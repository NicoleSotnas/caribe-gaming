import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

@Injectable({ providedIn: 'root' })
export class MercadoPagoService {
  private http = inject(HttpClient);

  // O navegador manda SÓ id e quantidade. Nome e preço vêm do servidor (catalogo-precos.ts).
  criarPreferencia(itens: ItemCarrinho[], email: string): Observable<PreferenciaMercadoPago> {
    return this.http.post<PreferenciaMercadoPago>('/api/mercado-pago/preference', {
      items: itens.map((item) => ({
        id: item.id,
        quantity: item.quantidade || 1,
      })),
      payer: { email },
    });
  }

  consultarPagamento(paymentId: string): Observable<PagamentoMercadoPago> {
    return this.http.get<PagamentoMercadoPago>(`/api/mercado-pago/payment/${paymentId}`);
  }
}