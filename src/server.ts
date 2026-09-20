import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.json());

app.post('/api/mercado-pago/preference', async (req, res) => {
  const accessToken = process.env['MERCADOPAGO_ACCESS_TOKEN'];
  if (!accessToken) {
    res.status(503).json({ error: 'Mercado Pago não configurado no servidor.' });
    return;
  }

  const { items, payer, externalReference } = req.body ?? {};
  if (!Array.isArray(items) || items.length === 0 || !payer?.email) {
    res.status(400).json({ error: 'Itens e e-mail do comprador são obrigatórios.' });
    return;
  }

  const itensValidos = items.every(
    (item: any) =>
      typeof item.title === 'string' &&
      item.title.trim().length > 0 &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0 &&
      Number.isFinite(item.unit_price) &&
      item.unit_price >= 0,
  );

  if (!itensValidos) {
    res.status(400).json({ error: 'Há itens inválidos no pedido.' });
    return;
  }

  const publicAppUrl = process.env['PUBLIC_APP_URL'] || 'http://localhost:4200';

  try {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: items.map((item: any) => ({
          title: item.title.trim(),
          quantity: item.quantity,
          unit_price: Number(item.unit_price.toFixed(2)),
          currency_id: 'BRL',
        })),
        payer: { email: payer.email.trim() },
        external_reference: String(externalReference || `caribe-${Date.now()}`),
        back_urls: {
          success: `${publicAppUrl}/checkout?status=approved`,
          pending: `${publicAppUrl}/checkout?status=pending`,
          failure: `${publicAppUrl}/checkout?status=failure`,
        },
        auto_return: 'approved',
        notification_url: process.env['MERCADOPAGO_WEBHOOK_URL'],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Mercado Pago rejeitou a preferência:', data);
      res.status(502).json({ error: 'Não foi possível iniciar o pagamento.' });
      return;
    }

    res.json({
      id: data.id,
      initPoint: data.init_point,
      sandboxInitPoint: data.sandbox_init_point,
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

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await response.json();
    if (!response.ok) {
      res.status(502).json({ error: 'Não foi possível consultar o pagamento.' });
      return;
    }
    res.json({ id: data.id, status: data.status, externalReference: data.external_reference });
  } catch (error) {
    console.error('Erro ao consultar pagamento no Mercado Pago:', error);
    res.status(502).json({ error: 'Serviço de pagamento indisponível.' });
  }
});

app.post('/api/mercado-pago/webhook', (req, res) => {
  // A confirmação definitiva e a liberação da chave devem ser processadas aqui em produção.
  console.log('Notificação Mercado Pago recebida:', req.body);
  res.sendStatus(200);
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
