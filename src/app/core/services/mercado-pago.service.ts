import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemCarrinho } from '../models/item-carrinho';

export interface PreferenciaMercadoPago {
  id: string;
  initPoint: string;
  sandboxInitPoint?: string;
}

export interface PagamentoMercadoPago {
  id: number;
  status: string;
  externalReference?: string;
}

@Injectable({ providedIn: 'root' })
export class MercadoPagoService {
  private http = inject(HttpClient);

  criarPreferencia(
    itens: ItemCarrinho[],
    email: string,
    externalReference: string,
  ): Observable<PreferenciaMercadoPago> {
    return this.http.post<PreferenciaMercadoPago>('/api/mercado-pago/preference', {
      items: itens.map((item) => ({
        title: item.nome,
        quantity: item.quantidade || 1,
        unit_price: item.preco,
      })),
      payer: { email },
      externalReference,
    });
  }

  consultarPagamento(paymentId: string): Observable<PagamentoMercadoPago> {
    return this.http.get<PagamentoMercadoPago>(`/api/mercado-pago/payment/${paymentId}`);
  }
}