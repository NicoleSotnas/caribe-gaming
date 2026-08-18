import { isPlatformBrowser } from '@angular/common';
import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';

export type ItemCarrinho = {
  nome: string;
  preco: number;
};

@Injectable({
  providedIn: 'root',
})
export class CarrinhoService {
  private platformId = inject(PLATFORM_ID);
  private readonly chaveStorage = 'caribe-gaming-carrinho';
  private carrinho = signal<ItemCarrinho[]>(this.carregarCarrinhoSalvo());

  // SELECTORS
  itens = computed(() => this.carrinho());
  quantidade = computed(() => this.carrinho().length);
  total = computed(() => this.carrinho().reduce((total, item) => total + item.preco, 0));
  carrinhoVazio = computed(() => this.carrinho().length === 0);

  constructor() {
    // Sempre que o carrinho mudar, a lista atualizada será persistida.
    effect(() => {
      this.salvarCarrinho(this.carrinho());
    });
  }

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

  private estaNoNavegador(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private carregarCarrinhoSalvo(): ItemCarrinho[] {
    if (!this.estaNoNavegador()) {
      return [];
    }
    const dadosSalvos = localStorage.getItem(this.chaveStorage);
    if (!dadosSalvos) {
      return [];
    }
    try {
      return JSON.parse(dadosSalvos) as ItemCarrinho[];
    } catch {
      return [];
    }
  }

  private salvarCarrinho(itens: ItemCarrinho[]) {
    if (!this.estaNoNavegador()) {
      return;
    }
    localStorage.setItem(this.chaveStorage, JSON.stringify(itens));
  }
}
