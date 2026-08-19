import { isPlatformBrowser } from '@angular/common';
import { Injectable, computed, effect, inject, PLATFORM_ID, signal } from '@angular/core';
import { ItemCarrinho } from '../../models/item-carrinho';

@Injectable({
  providedIn: 'root',
})
export class CarrinhoService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly chaveStorage = 'caribe-gaming-carrinho';
  private readonly carrinho = signal<ItemCarrinho[]>(this.carregarCarrinhoSalvo());

  readonly itens = computed(() => this.carrinho());
  readonly quantidade = computed(() =>
    this.carrinho().reduce((acc, item) => acc + (item.quantidade ?? 1), 0),
  );
  readonly total = computed(() =>
    this.carrinho().reduce(
      (total, item) => total + (item.preco * (item.quantidade ?? 1)),
      0,
    ),
  );
  readonly carrinhoVazio = computed(() => this.carrinho().length === 0);

  constructor() {
    effect(() => {
      this.salvarCarrinho(this.carrinho());
    });
  }

  adicionar(produto: ItemCarrinho): void {
    this.carrinho.update((lista) => [...lista, produto]);
  }

  removerPorIndice(indice: number): void {
    this.carrinho.update((listaAtual) => listaAtual.filter((_, index) => index !== indice));
  }

  limpar(): void {
    this.carrinho.set([]);
  }

  private estaNoNavegador(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private carregarCarrinhoSalvo(): ItemCarrinho[] {
    if (!this.estaNoNavegador()) return [];

    const dadosSalvos = localStorage.getItem(this.chaveStorage);
    if (!dadosSalvos) return [];

    try {
      return JSON.parse(dadosSalvos) as ItemCarrinho[];
    } catch {
      return [];
    }
  }

  private salvarCarrinho(itens: ItemCarrinho[]): void {
    if (!this.estaNoNavegador()) return;
    localStorage.setItem(this.chaveStorage, JSON.stringify(itens));
  }
}
