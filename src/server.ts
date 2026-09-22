import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';

import express from 'express';

import { join } from 'node:path';

import {
  existsSync,
} from 'node:fs';

import {
  createHmac,
  randomUUID,
  timingSafeEqual,
} from 'node:crypto';

import {
  loadEnvFile,
} from 'node:process';

import {
  cert,
  getApps,
  initializeApp,
} from 'firebase-admin/app';

import {
  FieldValue,
  getFirestore,
} from 'firebase-admin/firestore';

import { PRECOS } from './server/catalogo-precos';

/**
 * --------------------------------------------------
 * CARREGAMENTO DO .ENV
 * --------------------------------------------------
 *
 * Em desenvolvimento, carregamos o arquivo:
 *
 * .env
 *
 * localizado na raiz do projeto.
 *
 * Em produção (ex.: Vercel), as variáveis
 * normalmente já estarão disponíveis em
 * process.env, então não dependemos da existência
 * de um arquivo .env.
 */
const envPath = join(
  process.cwd(),
  '.env',
);

if (existsSync(envPath)) {
  loadEnvFile(envPath);
}

const browserDistFolder = join(
  import.meta.dirname,
  '../browser',
);

const app = express();

const angularApp =
  new AngularNodeAppEngine();

app.use(
  express.json({
    limit: '1mb',
  }),
);

const MP_API =
  'https://api.mercadopago.com';

type StatusPedido =
  | 'pending'
  | 'paid'
  | 'failed';

interface PedidoFirestore {
  totalCentavos: number;
  status: StatusPedido;
  paymentId?: string;
  preferenceId?: string;
  email: string;
  items: {
    id: string;
    title: string;
    quantity: number;
    unit_price: number;
    currency_id: 'BRL';
  }[];
  mpStatus?: string;
  mpStatusDetail?: string;
  createdAt?: FirebaseFirestore.Timestamp;
  updatedAt?: FirebaseFirestore.Timestamp;
}

/**
 * --------------------------------------------------
 * FIREBASE ADMIN / FIRESTORE
 * --------------------------------------------------
 */
function obterFirestore() {
  const projectId =
    process.env['FIREBASE_PROJECT_ID'];

  const clientEmail =
    process.env['FIREBASE_CLIENT_EMAIL'];

  const privateKey =
    process.env['FIREBASE_PRIVATE_KEY'];

  if (
    !projectId ||
    !clientEmail ||
    !privateKey
  ) {
    throw new Error(
      'Firebase Admin não está configurado. ' +
        'Defina FIREBASE_PROJECT_ID, ' +
        'FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY.',
    );
  }

  const appFirebase =
    getApps().length > 0
      ? getApps()[0]
      : initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey:
              privateKey.replace(
                /\\n/g,
                '\n',
              ),
          }),
        });

  return getFirestore(appFirebase);
}

/**
 * --------------------------------------------------
 * URL PÚBLICA
 * --------------------------------------------------
 */
function obterPublicAppUrl(): string {
  const configurada =
    process.env['PUBLIC_APP_URL']?.trim();

  if (configurada) {
    return configurada.replace(
      /\/+$/,
      '',
    );
  }

  const vercelUrl =
    process.env['VERCEL_URL']?.trim();

  if (vercelUrl) {
    return `https://${vercelUrl.replace(
      /^https?:\/\//,
      '',
    )}`;
  }

  return 'http://localhost:4000';
}

/**
 * --------------------------------------------------
 * VALIDAÇÃO DE E-MAIL
 * --------------------------------------------------
 */
function emailValido(
  email: string,
): boolean {
  return (
    email.length > 0 &&
    email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email,
    )
  );
}

/**
 * --------------------------------------------------
 * RECONCILIAÇÃO DO PAGAMENTO
 * --------------------------------------------------
 *
 * Consulta o Mercado Pago e sincroniza
 * o pedido correspondente no Firestore.
 */
async function reconciliarPagamento(
  paymentId: string,
  accessToken: string,
) {
  try {
    const resposta = await fetch(
      `${MP_API}/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!resposta.ok) {
      console.error(
        'Mercado Pago retornou erro ao consultar pagamento:',
        resposta.status,
      );

      return null;
    }

    const pagamento =
      (await resposta.json()) as {
        id?: unknown;
        status?: unknown;
        status_detail?: unknown;
        external_reference?: unknown;
        transaction_amount?: unknown;
      };

    const externalReference =
      String(
        pagamento.external_reference ??
          '',
      ).trim();

    if (!externalReference) {
      console.error(
        'Pagamento sem external_reference:',
        paymentId,
      );

      return null;
    }

    const transactionAmount =
      Number(
        pagamento.transaction_amount,
      );

    if (
      !Number.isFinite(
        transactionAmount,
      ) ||
      transactionAmount < 0
    ) {
      console.error(
        'transaction_amount inválido no pagamento:',
        paymentId,
      );

      return null;
    }

    const totalCentavosPagamento =
      Math.round(
        transactionAmount * 100,
      );

    const db = obterFirestore();

    const pedidoRef =
      db
        .collection('pedidos')
        .doc(externalReference);

    const resultado =
      await db.runTransaction(
        async (transaction) => {
          const snapshot =
            await transaction.get(
              pedidoRef,
            );

          if (!snapshot.exists) {
            return null;
          }

          const pedido =
            snapshot.data() as PedidoFirestore;

          if (
            Number(
              pedido.totalCentavos,
            ) !==
            totalCentavosPagamento
          ) {
            console.error(
              'Valor do pagamento diferente do pedido:',
              {
                paymentId,
                externalReference,
                esperado:
                  pedido.totalCentavos,
                recebido:
                  totalCentavosPagamento,
              },
            );

            return null;
          }

          const statusMercadoPago =
            String(
              pagamento.status ?? '',
            );

          let novoStatus =
            pedido.status;

          if (
            statusMercadoPago ===
            'approved'
          ) {
            novoStatus = 'paid';
          } else if (
            (
              statusMercadoPago ===
                'rejected' ||
              statusMercadoPago ===
                'cancelled'
            ) &&
            pedido.status !== 'paid'
          ) {
            novoStatus = 'failed';
          } else if (
            pedido.status !==
            'paid'
          ) {
            novoStatus = 'pending';
          }

          const atualizacao: Record<
            string,
            unknown
          > = {
            status: novoStatus,
            mpStatus:
              statusMercadoPago,
            mpStatusDetail:
              String(
                pagamento.status_detail ??
                  '',
              ),
            updatedAt:
              FieldValue.serverTimestamp(),
          };

          if (
            pagamento.id !==
              undefined &&
            pagamento.id !== null
          ) {
            atualizacao[
              'paymentId'
            ] = String(
              pagamento.id,
            );
          }

          transaction.update(
            pedidoRef,
            atualizacao,
          );

          return {
            id:
              Number(
                pagamento.id ??
                  paymentId,
              ),
            status:
              statusMercadoPago,
            orderStatus:
              novoStatus,
            externalReference,
          };
        },
      );

    return resultado;
  } catch (erro) {
    console.error(
      'Falha ao reconciliar pagamento:',
      erro,
    );

    return null;
  }
}

/**
 * --------------------------------------------------
 * CRIAÇÃO DA PREFERÊNCIA
 * --------------------------------------------------
 */
app.post(
  '/api/mercado-pago/preference',
  async (req, res) => {
    const accessToken =
      process.env[
        'MERCADOPAGO_ACCESS_TOKEN'
      ];

    if (!accessToken) {
      res.status(503).json({
        error:
          'Mercado Pago não configurado no servidor.',
      });

      return;
    }

    const corpo =
      (req.body ?? {}) as {
        payer?: {
          email?: unknown;
        };
        items?: unknown;
      };

    const email =
      typeof corpo.payer
        ?.email === 'string'
        ? corpo.payer.email.trim()
        : '';

    const entrada: unknown[] =
      Array.isArray(corpo.items)
        ? corpo.items
        : [];

    if (
      !emailValido(email) ||
      entrada.length === 0 ||
      entrada.length > 50
    ) {
      res.status(400).json({
        error:
          'Dados do pedido inválidos.',
      });

      return;
    }

    const linhas: {
      id: string;
      title: string;
      quantity: number;
      unit_price: number;
      currency_id: 'BRL';
    }[] = [];

    let totalCentavos = 0;

    for (const bruto of entrada) {
      const item =
        (bruto ?? {}) as {
          id?: unknown;
          quantity?: unknown;
        };

      const produto =
        PRECOS[String(item.id)];

      const quantity =
        Number(item.quantity);

      if (
        !produto ||
        !Number.isInteger(
          quantity,
        ) ||
        quantity < 1 ||
        quantity > 99
      ) {
        res.status(400).json({
          error:
            'Há itens inválidos no pedido.',
        });

        return;
      }

      if (
        produto.precoCentavos === 0
      ) {
        continue;
      }

      totalCentavos +=
        produto.precoCentavos *
        quantity;

      linhas.push({
        id: String(item.id),
        title: produto.nome,
        quantity,
        unit_price:
          produto.precoCentavos /
          100,
        currency_id: 'BRL',
      });
    }

    if (
      linhas.length === 0 ||
      totalCentavos <= 0
    ) {
      res.status(400).json({
        error:
          'Nada a pagar neste pedido.',
      });

      return;
    }

    const externalReference =
      randomUUID();

    const publicAppUrl =
      obterPublicAppUrl();

    const webhookUrl =
      process.env[
        'MERCADOPAGO_WEBHOOK_URL'
      ]?.trim() ||
      `${publicAppUrl}/api/mercado-pago/webhook`;

    const db =
      (() => {
        try {
          return obterFirestore();
        } catch (erro) {
          console.error(
            'Firebase Admin não configurado:',
            erro,
          );

          return null;
        }
      })();

    if (!db) {
      res.status(503).json({
        error:
          'Firestore não configurado no servidor.',
      });

      return;
    }

    const pedidoRef =
      db
        .collection('pedidos')
        .doc(externalReference);

    const itensParaSalvar =
      linhas.map((linha) => ({
        id: linha.id,
        title: linha.title,
        quantity: linha.quantity,
        unit_price: linha.unit_price,
        currency_id:
          linha.currency_id,
      }));

    await pedidoRef.set({
      totalCentavos,
      status:
        'pending' as StatusPedido,
      email,
      items: itensParaSalvar,
      createdAt:
        FieldValue.serverTimestamp(),
      updatedAt:
        FieldValue.serverTimestamp(),
    });

    try {
      const response =
        await fetch(
          `${MP_API}/checkout/preferences`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type':
                'application/json',
              'X-Idempotency-Key':
                externalReference,
            },
            body: JSON.stringify({
              items: linhas.map(
                (linha) => ({
                  title:
                    linha.title,
                  quantity:
                    linha.quantity,
                  unit_price:
                    linha.unit_price,
                  currency_id:
                    linha.currency_id,
                }),
              ),
              payer: {
                email,
              },
              external_reference:
                externalReference,
              back_urls: {
                success:
                  `${publicAppUrl}/checkout?status=approved`,
                pending:
                  `${publicAppUrl}/checkout?status=pending`,
                failure:
                  `${publicAppUrl}/checkout?status=failure`,
              },
              auto_return:
                'approved',
              notification_url:
                webhookUrl,
            }),
          },
        );

      const data =
        (await response.json()) as {
          id?: unknown;
          init_point?: unknown;
          sandbox_init_point?: unknown;
        };

      if (!response.ok) {
        console.error(
          'Mercado Pago rejeitou a preferência:',
          data,
        );

        await pedidoRef.update({
          status:
            'failed' as StatusPedido,
          updatedAt:
            FieldValue.serverTimestamp(),
        });

        res.status(502).json({
          error:
            'Não foi possível iniciar o pagamento.',
        });

        return;
      }

      const preferenceId =
        String(
          data.id ?? '',
        );

      await pedidoRef.update({
        preferenceId,
        updatedAt:
          FieldValue.serverTimestamp(),
      });

      res.json({
        id: data.id,
        initPoint:
          data.init_point,
        sandboxInitPoint:
          data.sandbox_init_point,
        externalReference,
      });
    } catch (erro) {
      console.error(
        'Erro ao criar preferência no Mercado Pago:',
        erro,
      );

      await pedidoRef
        .update({
          status:
            'failed' as StatusPedido,
          updatedAt:
            FieldValue.serverTimestamp(),
        })
        .catch(
          (
            erroFirestore,
          ) => {
            console.error(
              'Erro ao marcar pedido como failed:',
              erroFirestore,
            );
          },
        );

      res.status(502).json({
        error:
          'Serviço de pagamento indisponível.',
      });
    }
  },
);

/**
 * --------------------------------------------------
 * CONSULTA DE PAGAMENTO
 * --------------------------------------------------
 */
app.get(
  '/api/mercado-pago/payment/:id',
  async (req, res) => {
    const accessToken =
      process.env[
        'MERCADOPAGO_ACCESS_TOKEN'
      ];

    const paymentId =
      req.params['id'];

    if (
      !accessToken ||
      !/^\d+$/.test(paymentId)
    ) {
      res.status(400).json({
        error:
          'Pagamento inválido.',
      });

      return;
    }

    const resultado =
      await reconciliarPagamento(
        paymentId,
        accessToken,
      );

    if (!resultado) {
      res.status(404).json({
        error:
          'Pagamento não encontrado para este pedido.',
      });

      return;
    }

    res.json(resultado);
  },
);

/**
 * --------------------------------------------------
 * WEBHOOK DO MERCADO PAGO
 * --------------------------------------------------
 */
app.post(
  '/api/mercado-pago/webhook',
  async (req, res) => {
    const secret =
      process.env[
        'MERCADOPAGO_WEBHOOK_SECRET'
      ];

    const accessToken =
      process.env[
        'MERCADOPAGO_ACCESS_TOKEN'
      ];

    if (
      !secret ||
      !accessToken
    ) {
      res.sendStatus(503);
      return;
    }

    const dataId =
      String(
        req.query['data.id'] ?? '',
      ).trim();

    const requestId =
      String(
        req.header(
          'x-request-id',
        ) ?? '',
      ).trim();

    const signature =
      String(
        req.header(
          'x-signature',
        ) ?? '',
      ).trim();

    if (
      !dataId ||
      !requestId ||
      !signature
    ) {
      res.sendStatus(400);
      return;
    }

    let ts = '';
    let recebido = '';

    for (
      const parte of
        signature.split(',')
    ) {
      const [chave, ...resto] =
        parte
          .trim()
          .split('=');

      const valor =
        resto.join('=').trim();

      if (chave === 'ts') {
        ts = valor;
      }

      if (chave === 'v1') {
        recebido = valor;
      }
    }

    if (
      !ts ||
      !recebido
    ) {
      res.sendStatus(401);
      return;
    }

    const manifest =
      `id:${dataId.toLowerCase()};` +
      `request-id:${requestId};` +
      `ts:${ts};`;

    const esperado =
      createHmac(
        'sha256',
        secret,
      )
        .update(manifest)
        .digest('hex');

    let assinaturaValida =
      false;

    if (
      esperado.length ===
      recebido.length
    ) {
      try {
        assinaturaValida =
          timingSafeEqual(
            Buffer.from(
              esperado,
              'utf8',
            ),
            Buffer.from(
              recebido,
              'utf8',
            ),
          );
      } catch {
        assinaturaValida =
          false;
      }
    }

    if (!assinaturaValida) {
      res.sendStatus(401);
      return;
    }

    const tipo =
      String(
        req.query['type'] ??
          req.query['topic'] ??
          '',
      ).toLowerCase();

    if (
      tipo === 'payment'
    ) {
      await reconciliarPagamento(
        dataId,
        accessToken,
      );
    }

    res.sendStatus(200);
  },
);

/**
 * --------------------------------------------------
 * ARQUIVOS ESTÁTICOS
 * --------------------------------------------------
 */
app.use(
  express.static(
    browserDistFolder,
    {
      maxAge: '1y',
      index: false,
      redirect: false,
    },
  ),
);

/**
 * --------------------------------------------------
 * ANGULAR SSR
 * --------------------------------------------------
 */
app.use(
  (req, res, next) => {
    angularApp
      .handle(req)
      .then(
        (response) =>
          response
            ? writeResponseToNodeResponse(
                response,
                res,
              )
            : next(),
      )
      .catch(next);
  },
);

/**
 * --------------------------------------------------
 * SERVIDOR LOCAL
 * --------------------------------------------------
 */
if (
  isMainModule(import.meta.url) ||
  process.env['pm_id']
) {
  const port =
    process.env['PORT'] ||
    4000;

  app.listen(
    port,
    (error) => {
      if (error) {
        throw error;
      }

      console.log(
        `Node Express server listening on http://localhost:${port}`,
      );
    },
  );
}

/**
 * Handler utilizado pelo Angular SSR,
 * Vercel e outros ambientes compatíveis.
 */
export const reqHandler =
  createNodeRequestHandler(app);