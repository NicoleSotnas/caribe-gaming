import dns from 'node:dns';

dns.setDefaultResultOrder('ipv4first');
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';

import express from 'express';

import {
  existsSync,
} from 'node:fs';

import {
  join,
} from 'node:path';

import {
  createHmac,
  randomUUID,
  timingSafeEqual,
} from 'node:crypto';

import {
  loadEnvFile,
} from 'node:process';

import { PRECOS } from './server/catalogo-precos';

/**
 * ==================================================
 * CARREGAMENTO DO .ENV
 * ==================================================
 */

const envPath = join(
  process.cwd(),
  '.env',
);

if (existsSync(envPath)) {
  try {
    loadEnvFile(envPath);
  } catch (erro) {
    console.error(
      'Não foi possível carregar o arquivo .env.',
      erro,
    );
  }
}

/**
 * ==================================================
 * CONFIGURAÇÃO
 * ==================================================
 */

const browserDistFolder = join(
  import.meta.dirname,
  '../browser',
);

const app = express();

const angularApp =
  new AngularNodeAppEngine();

const MP_API =
  'https://api.mercadopago.com';

app.use(
  express.json({
    limit: '1mb',
  }),
);

/**
 * ==================================================
 * TIPOS
 * ==================================================
 */

interface ItemRecebido {
  id?: unknown;
  quantity?: unknown;
}

interface LinhaPagamento {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  currency_id: 'BRL';
}

interface PreferenciaMercadoPago {
  id?: unknown;
  init_point?: unknown;
  sandbox_init_point?: unknown;
}

interface PagamentoMercadoPago {
  id?: unknown;
  status?: unknown;
  status_detail?: unknown;
  external_reference?: unknown;
  transaction_amount?: unknown;
  currency_id?: unknown;
}

interface PreferenciaPesquisada {
  id?: unknown;
  external_reference?: unknown;
  items?: unknown;
}

/**
 * ==================================================
 * AUXILIARES
 * ==================================================
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

function obterPublicAppUrl(): string {
  const configurada =
    process.env[
      'PUBLIC_APP_URL'
    ]?.trim();

  if (configurada) {
    return configurada.replace(
      /\/+$/,
      '',
    );
  }

  const vercelUrl =
    process.env[
      'VERCEL_URL'
    ]?.trim();

  if (vercelUrl) {
    return `https://${vercelUrl.replace(
      /^https?:\/\//,
      '',
    )}`;
  }

  return 'http://localhost:4000';
}

function calcularTotalCentavos(
  itens: unknown,
): number | null {
  if (!Array.isArray(itens)) {
    return null;
  }

  let totalCentavos = 0;

  for (
    const bruto of itens
  ) {
    const item =
      (bruto ?? {}) as {
        quantity?: unknown;
        unit_price?: unknown;
      };

    const quantity =
      Number(
        item.quantity,
      );

    const unitPrice =
      Number(
        item.unit_price,
      );

    if (
      !Number.isInteger(
        quantity,
      ) ||
      quantity < 1 ||
      quantity > 99
    ) {
      return null;
    }

    if (
      !Number.isFinite(
        unitPrice,
      ) ||
      unitPrice < 0
    ) {
      return null;
    }

    totalCentavos +=
      Math.round(
        unitPrice * 100,
      ) *
      quantity;
  }

  return totalCentavos;
}

function extrairAssinaturas(
  signatureHeader: string,
): {
  timestamp: string;
  assinaturas: string[];
} {
  let timestamp = '';

  const assinaturas: string[] = [];

  for (
    const parte of
      signatureHeader.split(',')
  ) {
    const [chave, ...resto] =
      parte
        .trim()
        .split('=');

    const valor =
      resto
        .join('=')
        .trim();

    if (
      chave === 'ts'
    ) {
      timestamp = valor;
    }

    if (
      chave === 'v1' &&
      valor
    ) {
      assinaturas.push(
        valor,
      );
    }
  }

  return {
    timestamp,
    assinaturas,
  };
}

function assinaturaWebhookValida(
  secret: string,
  dataId: string,
  requestId: string,
  timestamp: string,
  assinaturas: string[],
): boolean {
  const timestampNumero =
    Number(
      timestamp,
    );

  if (
    !Number.isFinite(
      timestampNumero,
    )
  ) {
    return false;
  }

  /**
   * O Mercado Pago utiliza timestamp
   * em milissegundos nas notificações.
   *
   * Rejeitamos timestamps muito antigos
   * ou muito adiantados para reduzir
   * risco de replay.
   */
  const agora =
    Date.now();

  const diferenca =
    Math.abs(
      agora -
        timestampNumero,
    );

  const dezMinutos =
    10 * 60 * 1000;

  if (
    diferenca >
    dezMinutos
  ) {
    return false;
  }

  const manifest =
    `id:${dataId.toLowerCase()};` +
    `request-id:${requestId};` +
    `ts:${timestamp};`;

  const esperado =
    createHmac(
      'sha256',
      secret,
    )
      .update(
        manifest,
      )
      .digest('hex');

  for (
    const recebido of assinaturas
  ) {
    if (
      esperado.length !==
      recebido.length
    ) {
      continue;
    }

    try {
      if (
        timingSafeEqual(
          Buffer.from(
            esperado,
            'utf8',
          ),
          Buffer.from(
            recebido,
            'utf8',
          ),
        )
      ) {
        return true;
      }
    } catch {
      continue;
    }
  }

  return false;
}

/**
 * ==================================================
 * CONSULTA E VALIDAÇÃO DO PAGAMENTO
 * ==================================================
 */

async function reconciliarPagamento(
  paymentId: string,
  accessToken: string,
  externalReferenceEsperada: string,
) {
  try {
    /**
     * ----------------------------------------------
     * 1. CONSULTA PAGAMENTO
     * ----------------------------------------------
     */

    const pagamentoResponse =
      await fetch(
        `${MP_API}/v1/payments/${encodeURIComponent(
          paymentId,
        )}`,
        {
          method: 'GET',

          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },
        },
      );

    if (
      !pagamentoResponse.ok
    ) {
      console.error(
        'Erro ao consultar pagamento no Mercado Pago:',
        pagamentoResponse.status,
      );

      return null;
    }

    const pagamento =
      (await pagamentoResponse.json()) as PagamentoMercadoPago;

    const externalReference =
      String(
        pagamento.external_reference ??
          '',
      ).trim();

    if (
      !externalReference
    ) {
      return null;
    }

    /**
     * A referência esperada deve
     * existir e ser exatamente igual.
     */
    if (
      !externalReferenceEsperada ||
      externalReference !==
        externalReferenceEsperada
    ) {
      return null;
    }

    /**
     * ----------------------------------------------
     * 2. VALIDAR MOEDA
     * ----------------------------------------------
     */

    const currency =
      String(
        pagamento.currency_id ??
          '',
      ).toUpperCase();

    if (
      currency !==
      'BRL'
    ) {
      console.error(
        'Moeda de pagamento inesperada:',
        currency,
      );

      return null;
    }

    /**
     * ----------------------------------------------
     * 3. VALOR REALMENTE PAGO
     * ----------------------------------------------
     */

    const valorPago =
      Number(
        pagamento.transaction_amount,
      );

    if (
      !Number.isFinite(
        valorPago,
      ) ||
      valorPago < 0
    ) {
      return null;
    }

    const valorPagoCentavos =
      Math.round(
        valorPago * 100,
      );

    /**
     * ----------------------------------------------
     * 4. BUSCAR A PREFERÊNCIA
     * ----------------------------------------------
     */

    const urlPesquisa =
      `${MP_API}/checkout/preferences/search` +
      `?external_reference=${encodeURIComponent(
        externalReference,
      )}`;

    const preferenciasResponse =
      await fetch(
        urlPesquisa,
        {
          method: 'GET',

          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },
        },
      );

    if (
      !preferenciasResponse.ok
    ) {
      console.error(
        'Erro ao pesquisar preferência:',
        preferenciasResponse.status,
      );

      return null;
    }

    const dadosPreferencias =
      (await preferenciasResponse.json()) as {
        results?: PreferenciaPesquisada[];
      };

    const preferencias =
      Array.isArray(
        dadosPreferencias.results,
      )
        ? dadosPreferencias.results
        : [];

    const preferencia =
      preferencias.find(
        (
          item,
        ) =>
          String(
            item.external_reference ??
              '',
          ) === externalReference,
      );

    if (
      !preferencia
    ) {
      console.error(
        'Preferência não encontrada.',
        externalReference,
      );

      return null;
    }

    /**
     * ----------------------------------------------
     * 5. RECALCULAR O VALOR DA PREFERÊNCIA
     * ----------------------------------------------
     */

    const valorEsperadoCentavos =
      calcularTotalCentavos(
        preferencia.items,
      );

    if (
      valorEsperadoCentavos ===
      null
    ) {
      return null;
    }

    /**
     * Nunca aceitamos um pagamento cujo
     * valor seja diferente do pedido.
     */
    if (
      valorEsperadoCentavos !==
      valorPagoCentavos
    ) {
      console.error(
        'Valor do pagamento diferente do valor da preferência.',
        {
          paymentId,
          externalReference,
          esperado:
            valorEsperadoCentavos,
          recebido:
            valorPagoCentavos,
        },
      );

      return null;
    }

    return {
      id:
        Number(
          pagamento.id ??
            paymentId,
        ),

      status:
        String(
          pagamento.status ??
            '',
        ),

      externalReference,
    };
  } catch (erro) {
    console.error(
      'Falha ao reconciliar pagamento.',
      erro,
    );

    return null;
  }
}

/**
 * ==================================================
 * CRIAR PREFERÊNCIA
 * ==================================================
 */

app.post(
  '/api/mercado-pago/preference',
  async (
    req,
    res,
  ) => {
    const accessToken =
      process.env[
        'MERCADOPAGO_ACCESS_TOKEN'
      ];

    if (
      !accessToken
    ) {
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
        ?.email ===
      'string'
        ? corpo.payer.email.trim()
        : '';

    const entrada =
      Array.isArray(
        corpo.items,
      )
        ? corpo.items
        : [];

    if (
      !emailValido(
        email,
      ) ||
      entrada.length ===
        0 ||
      entrada.length >
        50
    ) {
      res.status(400).json({
        error:
          'Dados do pedido inválidos.',
      });

      return;
    }

    /**
     * ----------------------------------------------
     * VALIDAR ITENS PELO CATÁLOGO DO SERVIDOR
     * ----------------------------------------------
     */

    const linhas:
      LinhaPagamento[] =
      [];

    let totalCentavos =
      0;

    for (
      const bruto of entrada
    ) {
      const item =
        (bruto ?? {}) as ItemRecebido;

      const id =
        String(
          item.id ??
            '',
        ).trim();

      const produto =
        PRECOS[id];

      const quantity =
        Number(
          item.quantity,
        );

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
        produto.precoCentavos ===
        0
      ) {
        continue;
      }

      totalCentavos +=
        produto.precoCentavos *
        quantity;

      linhas.push({
        id,

        title:
          produto.nome,

        quantity,

        unit_price:
          produto.precoCentavos /
          100,

        currency_id:
          'BRL',
      });
    }

    if (
      linhas.length ===
        0 ||
      totalCentavos <= 0
    ) {
      res.status(400).json({
        error:
          'Nada a pagar neste pedido.',
      });

      return;
    }

    /**
     * ----------------------------------------------
     * REFERÊNCIA ÚNICA DO PEDIDO
     * ----------------------------------------------
     */

    const externalReference =
      randomUUID();

    const publicAppUrl =
      obterPublicAppUrl();

    const webhookUrl =
      process.env[
        'MERCADOPAGO_WEBHOOK_URL'
      ]?.trim() ||
      `${publicAppUrl}/api/mercado-pago/webhook`;

    /**
     * ----------------------------------------------
     * CRIAR PREFERÊNCIA
     * ----------------------------------------------
     */

    try {
      const response =
        await fetch(
          `${MP_API}/checkout/preferences`,
          {
            method: 'POST',

            headers: {
              Authorization:
                `Bearer ${accessToken}`,

              'Content-Type':
                'application/json',

              'X-Idempotency-Key':
                externalReference,
            },

            body: JSON.stringify({
              items:
                linhas.map(
                  (
                    linha,
                  ) => ({
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
        (await response.json()) as PreferenciaMercadoPago;

      if (
        !response.ok
      ) {
        console.error(
          'Mercado Pago rejeitou a preferência.',
          {
            status:
              response.status,
            data,
          },
        );

        res.status(502).json({
          error:
            'Não foi possível iniciar o pagamento.',
        });

        return;
      }

      const initPoint =
        String(
          data.init_point ??
            '',
        ).trim();

      if (
        !initPoint
      ) {
        res.status(502).json({
          error:
            'O Mercado Pago não retornou o endereço do checkout.',
        });

        return;
      }

      res.json({
        id:
          String(
            data.id ??
              '',
          ),

        initPoint,

        sandboxInitPoint:
          data.sandbox_init_point
            ? String(
                data.sandbox_init_point,
              )
            : undefined,

        externalReference,
      });
    } catch (erro) {
      console.error(
        'Erro ao criar preferência no Mercado Pago.',
        erro,
      );

      res.status(502).json({
        error:
          'Serviço de pagamento indisponível.',
      });
    }
  },
);

/**
 * ==================================================
 * CONSULTAR PAGAMENTO
 * ==================================================
 */

app.get(
  '/api/mercado-pago/payment/:id',
  async (
    req,
    res,
  ) => {
    const accessToken =
      process.env[
        'MERCADOPAGO_ACCESS_TOKEN'
      ];

    const paymentId =
      req.params['id'];

    const externalReference =
      String(
        req.query[
          'external_reference'
        ] ??
          '',
      ).trim();

    /**
     * A referência é obrigatória.
     *
     * Isso evita que essa rota seja usada
     * livremente para consultar qualquer
     * payment_id conhecido.
     */
    if (
      !accessToken ||
      !/^\d+$/.test(
        paymentId,
      ) ||
      !externalReference ||
      externalReference.length >
        100
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
        externalReference,
      );

    if (
      !resultado
    ) {
      res.status(404).json({
        error:
          'Pagamento não encontrado ou não corresponde ao pedido.',
      });

      return;
    }

    res.json(
      resultado,
    );
  },
);

/**
 * ==================================================
 * WEBHOOK
 * ==================================================
 */

app.post(
  '/api/mercado-pago/webhook',
  async (
    req,
    res,
  ) => {
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
      res.sendStatus(
        503,
      );

      return;
    }

    const dataId =
      String(
        req.query[
          'data.id'
        ] ??
          req.body?.data
            ?.id ??
          '',
      ).trim();

    const requestId =
      String(
        req.header(
          'x-request-id',
        ) ??
          '',
      ).trim();

    const signatureHeader =
      String(
        req.header(
          'x-signature',
        ) ??
          '',
      ).trim();

    if (
      !dataId ||
      !requestId ||
      !signatureHeader
    ) {
      res.sendStatus(
        400,
      );

      return;
    }

    const {
      timestamp,
      assinaturas,
    } =
      extrairAssinaturas(
        signatureHeader,
      );

    if (
      !timestamp ||
      assinaturas.length ===
        0
    ) {
      res.sendStatus(
        401,
      );

      return;
    }

    const valida =
      assinaturaWebhookValida(
        secret,
        dataId,
        requestId,
        timestamp,
        assinaturas,
      );

    if (!valida) {
      res.sendStatus(
        401,
      );

      return;
    }

    const tipo =
      String(
        req.query[
          'type'
        ] ??
          req.query[
            'topic'
          ] ??
          req.body?.type ??
          '',
      ).toLowerCase();

    /**
     * O endpoint de webhook valida a origem
     * e, quando a notificação é de pagamento,
     * consulta novamente a API do Mercado Pago.
     */
    if (
      tipo ===
        'payment'
    ) {
      /**
       * Como não recebemos a external_reference
       * necessariamente de forma confiável no
       * webhook, a consulta é realizada pelo
       * payment_id e o próprio Mercado Pago
       * fornece a referência.
       *
       * O método interno recebe uma referência,
       * por isso buscamos primeiro o pagamento.
       */
      try {
        const pagamentoResponse =
          await fetch(
            `${MP_API}/v1/payments/${encodeURIComponent(
              dataId,
            )}`,
            {
              headers: {
                Authorization:
                  `Bearer ${accessToken}`,
              },
            },
          );

        if (
          pagamentoResponse.ok
        ) {
          const pagamento =
            (await pagamentoResponse.json()) as PagamentoMercadoPago;

          const reference =
            String(
              pagamento.external_reference ??
                '',
            ).trim();

          if (
            reference
          ) {
            await reconciliarPagamento(
              dataId,
              accessToken,
              reference,
            );
          }
        }
      } catch (erro) {
        console.error(
          'Erro ao processar webhook.',
          erro,
        );
      }
    }

    res.sendStatus(
      200,
    );
  },
);

/**
 * ==================================================
 * ARQUIVOS ESTÁTICOS
 * ==================================================
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
 * ==================================================
 * ANGULAR SSR
 * ==================================================
 */

app.use(
  (
    req,
    res,
    next,
  ) => {
    angularApp
      .handle(req)
      .then(
        (
          response,
        ) =>
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
 * ==================================================
 * SERVIDOR LOCAL
 * ==================================================
 */

if (
  isMainModule(
    import.meta.url,
  ) ||
  process.env['pm_id']
) {
  const port =
    process.env[
      'PORT'
    ] ||
    4000;

  app.listen(
    port,
    (
      error,
    ) => {
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
 * ==================================================
 * HANDLER
 * ==================================================
 */

export const reqHandler =
  createNodeRequestHandler(
    app,
  );