import {
  Injectable,
  inject,
} from '@angular/core';

import {
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';

import {
  Observable,
  throwError,
} from 'rxjs';

import {
  catchError,
  timeout,
} from 'rxjs/operators';

import { ItemCarrinho } from '../models/item-carrinho';

export interface PreferenciaMercadoPago {
  id: string;
  initPoint: string;
  sandboxInitPoint?: string;
  externalReference: string;
}

export interface PagamentoMercadoPago {
  id: number;
  status: string;
  externalReference: string;
}

@Injectable({
  providedIn: 'root',
})
export class MercadoPagoService {
  private readonly http =
    inject(HttpClient);

  criarPreferencia(
    itens: ItemCarrinho[],
    email: string,
  ): Observable<PreferenciaMercadoPago> {
    return this.http
      .post<PreferenciaMercadoPago>(
        '/api/mercado-pago/preference',
        {
          items:
            itens.map(
              (
                item,
              ) => ({
                id: item.id,
                quantity:
                  item.quantidade ||
                  1,
              }),
            ),

          payer: {
            email:
              email.trim(),
          },
        },
      )
      .pipe(
        timeout(
          20000,
        ),

        catchError(
          (
            erro: unknown,
          ) =>
            this.tratarErro(
              erro,
              'Não foi possível iniciar o pagamento.',
            ),
        ),
      );
  }

  consultarPagamento(
    paymentId: string,
    externalReference: string,
  ): Observable<PagamentoMercadoPago> {
    const id =
      String(
        paymentId,
      ).trim();

    const referencia =
      String(
        externalReference,
      ).trim();

    if (
      !id ||
      !/^\d+$/.test(
        id,
      ) ||
      !referencia
    ) {
      return throwError(
        () =>
          new Error(
            'Dados de pagamento inválidos.',
          ),
      );
    }

    const url =
      `/api/mercado-pago/payment/${encodeURIComponent(
        id,
      )}` +
      `?external_reference=${encodeURIComponent(
        referencia,
      )}`;

    return this.http
      .get<PagamentoMercadoPago>(
        url,
      )
      .pipe(
        timeout(
          15000,
        ),

        catchError(
          (
            erro: unknown,
          ) =>
            this.tratarErro(
              erro,
              'Não foi possível confirmar o pagamento.',
            ),
        ),
      );
  }

  private tratarErro(
    erro: unknown,
    mensagemPadrao: string,
  ): Observable<never> {
    console.error(
      'Erro no Mercado Pago:',
      erro instanceof
        HttpErrorResponse
        ? {
            status:
              erro.status,

            message:
              erro.message,
          }
        : erro,
    );

    return throwError(
      () =>
        new Error(
          this.extrairMensagemErro(
            erro,
            mensagemPadrao,
          ),
        ),
    );
  }

  private extrairMensagemErro(
    erro: unknown,
    mensagemPadrao: string,
  ): string {
    if (
      erro instanceof
      HttpErrorResponse
    ) {
      const mensagem =
        erro.error?.error;

      if (
        typeof mensagem ===
          'string' &&
        mensagem.trim()
      ) {
        return mensagem;
      }

      if (
        erro.status ===
        0
      ) {
        return 'Não foi possível conectar ao servidor de pagamento.';
      }

      if (
        erro.status ===
        400
      ) {
        return 'Os dados enviados para o pagamento são inválidos.';
      }

      if (
        erro.status ===
        404
      ) {
        return 'Não foi possível localizar o pagamento.';
      }

      if (
        erro.status ===
        503
      ) {
        return 'O serviço de pagamento não está configurado no servidor.';
      }

      if (
        erro.status >=
        500
      ) {
        return 'O serviço de pagamento está indisponível no momento.';
      }
    }

    return mensagemPadrao;
  }
}