import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { randomUUID, createHmac, timingSafeEqual } from 'node:crypto';
import { PRECOS } from './server/catalogo-precos';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.json());

const MP_API = 'https://api.mercadopago.com';

type Pedido = { totalCentavos: number; status: 'pending' | 'paid' | 'failed'; paymentId?: string };
// DEMO: em memória (some ao reiniciar). Na fase Supabase isso vira a tabela "orders".
const pedidos = new Map<string, Pedido>();

// Consulta o pagamento NA FONTE e só aceita se pertencer a um pedido nosso
// e o valor pago bater com o total calculado pelo servidor.
async function reconciliar(paymentId: string, accessToken: string) {
  try {
    const r = await fetch(`${MP_API}/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!r.ok) return null;
    const pg = await r.json();

    const ref = String(pg.external_reference ?? '');
    const pedido = pedidos.get(ref);
    if (!pedido) return null;
    if (Math.round(Number(pg.transaction_amount) * 100) !== pedido.totalCentavos) return null;

    if (pg.status === 'approved') {
      pedido.status = 'paid';
      pedido.paymentId = String(pg.id);
    } else if ((pg.status === 'rejected' || pg.status === 'cancelled') && pedido.status === 'pending') {
      pedido.status = 'failed';
    }
    return { id: pg.id as number, status: pg.status as string, externalReference: ref };
  } catch (erro) {
    console.error('Falha ao consultar pagamento', erro);
    return null;
  }
}

app.post('/api/mercado-pago/preference', async (req, res) => {
  const accessToken = process.env['MERCADOPAGO_ACCESS_TOKEN'];
  if (!accessToken) {
    res.status(503).json({ error: 'Mercado Pago não configurado no servidor.' });
    return;
  }

  const corpo = req.body ?? {};
  const email = typeof corpo.payer?.email === 'string' ? corpo.payer.email.trim() : '';
  const entrada: unknown[] = Array.isArray(corpo.items) ? corpo.items : [];

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || entrada.length === 0 || entrada.length > 50) {
    res.status(400).json({ error: 'Dados do pedido inválidos.' });
    return;
  }

  // O cliente manda SÓ id e quantidade. Nome e preço vêm do servidor (catalogo-precos.ts).
  const linhas: { title: string; quantity: number; unit_price: number; currency_id: string }[] = [];
  let totalCentavos = 0;
  for (const bruto of entrada) {
    const item = (bruto ?? {}) as { id?: unknown; quantity?: unknown };
    const produto = PRECOS[String(item.id)];
    const quantity = Number(item.quantity);
    if (!produto || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      res.status(400).json({ error: 'Há itens inválidos no pedido.' });
      return;
    }
    if (produto.precoCentavos === 0) continue; // gratuito não passa pelo gateway
    totalCentavos += produto.precoCentavos * quantity;
    linhas.push({
      title: produto.nome,
      quantity,
      unit_price: produto.precoCentavos / 100,
      currency_id: 'BRL',
    });
  }
  if (linhas.length === 0) {
    res.status(400).json({ error: 'Nada a pagar neste pedido.' });
    return;
  }

  const externalReference = randomUUID(); // gerado no servidor, não previsível
  const publicAppUrl = process.env['PUBLIC_APP_URL'] || 'http://localhost:4000'; // corrigido: batia com a porta errada (4200)

  try {
    const response = await fetch(`${MP_API}/checkout/preferences`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': externalReference,
      },
      body: JSON.stringify({
        items: linhas,
        payer: { email },
        external_reference: externalReference,
        back_urls: {
          success: `${publicAppUrl}/checkout?status=approved`,
          pending: `${publicAppUrl}/checkout?status=pending`,
          failure: `${publicAppUrl}/checkout?status=failure`,
        },
        auto_return: 'approved', // exige https público; remova se falhar em localhost
        notification_url: process.env['MERCADOPAGO_WEBHOOK_URL'],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Mercado Pago rejeitou a preferência:', data);
      res.status(502).json({ error: 'Não foi possível iniciar o pagamento.' });
      return;
    }

    pedidos.set(externalReference, { totalCentavos, status: 'pending' });
    res.json({
      id: data.id,
      initPoint: data.init_point,
      sandboxInitPoint: data.sandbox_init_point,
      externalReference,
    });
  } catch (error) {
    console.error('Erro ao criar preferência no Mercado Pago:', error);
    res.status(502).json({ error: 'Serviço de pagamento indisponível.' });
  }
});

app.get('/api/mercado-pago/payment/:id', async (req, res) => {
  const accessToken = process.env['MERCADOPAGO_ACCESS_TOKEN'];
  const paymentId = req.params['id'];
  if (!accessToken || !/^\d+$/.test(paymentId)) {
    res.status(400).json({ error: 'Pagamento inválido.' });
    return;
  }
  const resultado = await reconciliar(paymentId, accessToken);
  if (!resultado) {
    res.status(404).json({ error: 'Pagamento não encontrado para este pedido.' });
    return;
  }
  res.json(resultado);
});

app.post('/api/mercado-pago/webhook', async (req, res) => {
  const secret = process.env['MERCADOPAGO_WEBHOOK_SECRET'];
  const accessToken = process.env['MERCADOPAGO_ACCESS_TOKEN'];
  const dataId = String(req.query['data.id'] ?? '');
  if (!secret || !accessToken || !dataId) {
    res.sendStatus(400);
    return;
  }

  const partes = Object.fromEntries(
    String(req.header('x-signature') ?? '')
      .split(',')
      .map((p) => p.trim().split('=') as [string, string]),
  );
  const manifest = `id:${dataId.toLowerCase()};request-id:${req.header('x-request-id') ?? ''};ts:${partes['ts']};`;
  const esperado = createHmac('sha256', secret).update(manifest).digest('hex');
  const recebido = String(partes['v1'] ?? '');
  const valida =
    esperado.length === recebido.length &&
    timingSafeEqual(Buffer.from(esperado), Buffer.from(recebido));
  if (!valida) {
    res.sendStatus(401);
    return;
  }

  if ((req.query['type'] ?? req.query['topic']) === 'payment') {
    await reconciliar(dataId, accessToken); // idempotente: repetir não muda nada
  }
  res.sendStatus(200);
});

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);