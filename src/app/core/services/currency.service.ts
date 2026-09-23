import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  of,
  throwError,
} from 'rxjs';
import {
  catchError,
  map,
  shareReplay,
  tap,
} from 'rxjs/operators';

import { TaxaCambio } from '../models/taxa-cambio';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'https://api.frankfurter.dev/v2';

  private readonly cacheTtlMs =
    60 * 60 * 1000;

  private taxaBrlUsd$:
    Observable<TaxaCambio> | null = null;

  private taxaCache:
    TaxaCambio | null = null;

  private taxaCacheTimestamp = 0;

  buscarTaxa(
    base: string,
    quote: string,
  ): Observable<TaxaCambio> {
    const baseNormalizada =
      base.trim().toLowerCase();

    const quoteNormalizada =
      quote.trim().toLowerCase();

    if (
      !baseNormalizada ||
      !quoteNormalizada
    ) {
      return throwError(
        () =>
          new Error(
            'Moedas inválidas.',
          ),
      );
    }

    if (
      baseNormalizada ===
      quoteNormalizada
    ) {
      const hoje =
        new Date()
          .toISOString()
          .split('T')[0];

      return of({
        date: hoje,
        base: base.toUpperCase(),
        quote: quote.toUpperCase(),
        rate: 1,
      });
    }

    return this.http
      .get<TaxaCambio>(
        `${this.apiUrl}/rate/${baseNormalizada}/${quoteNormalizada}`,
      )
      .pipe(
        catchError((erro) => {
          console.error(
            'Erro ao consultar Frankfurter:',
            erro,
          );

          return throwError(
            () =>
              new Error(
                'Não foi possível consultar a cotação.',
              ),
          );
        }),
      );
  }

  buscarCotacaoBrlUsd():
    Observable<TaxaCambio> {
    const agora = Date.now();

    if (
      this.taxaCache &&
      agora -
        this.taxaCacheTimestamp <
        this.cacheTtlMs
    ) {
      return of(this.taxaCache);
    }

    if (this.taxaBrlUsd$) {
      return this.taxaBrlUsd$;
    }

    this.taxaBrlUsd$ =
      this.buscarTaxa(
        'BRL',
        'USD',
      ).pipe(
        tap((resposta) => {
          this.taxaCache = resposta;

          this.taxaCacheTimestamp =
            Date.now();

          this.taxaBrlUsd$ = null;
        }),

        shareReplay(1),

        catchError((erro) => {
          this.taxaBrlUsd$ = null;

          return throwError(
            () => erro,
          );
        }),
      );

    return this.taxaBrlUsd$;
  }

  converterBrlParaUsd(
    valorEmReais: number,
  ): Observable<number> {
    if (
      !Number.isFinite(
        valorEmReais,
      ) ||
      valorEmReais < 0
    ) {
      return throwError(
        () =>
          new Error(
            'Valor em reais inválido.',
          ),
      );
    }

    return this.buscarCotacaoBrlUsd().pipe(
      map(
        (cotacao) =>
          valorEmReais *
          cotacao.rate,
      ),
    );
  }

  formatarUsd(
    valor: number,
  ): string {
    return new Intl.NumberFormat(
      'en-US',
      {
        style: 'currency',
        currency: 'USD',
      },
    ).format(valor);
  }

  formatarTaxa(
    taxa: number,
  ): string {
    return taxa.toFixed(4);
  }

  limparCache(): void {
    this.taxaCache = null;
    this.taxaCacheTimestamp = 0;
    this.taxaBrlUsd$ = null;
  }
}