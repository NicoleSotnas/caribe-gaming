import { Injectable, signal, computed } from '@angular/core';

import { ItemCarrinho } from '../models/item-carrinho';

@Injectable({
  providedIn: 'root',
})
export class CarrinhoService {
  private carrinho = signal<ItemCarrinho[]>([]);

  // SELECTORS
  itens = computed(() => this.carrinho());
  quantidade = computed(() => this.carrinho().length);
  total = computed(() => this.carrinho().reduce((total, item) => total + item.preco, 0));
  carrinhoVazio = computed(() => this.carrinho().length === 0);

  // ACTIONS
  adicionar(produto: ItemCarrinho) {
    this.carrinho.update((lista) => [...lista, produto]);
  }

  removerPorIndice(indice: number) {
    this.carrinho.update((listaAtual) => listaAtual.filter((_, index) => index !== indice));
  }

  limpar() {
    this.carrinho.set([]);
  }
}
