import { isPlatformBrowser } from '@angular/common';
import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { ItemCarrinho } from '../models/item-carrinho';

@Injectable({
  providedIn: 'root',
})
export class CarrinhoService {
  private platformId = inject(PLATFORM_ID);
  private readonly chaveStorage = 'caribe-gaming-carrinho';
  private carrinho = signal<ItemCarrinho[]>(this.carregarCarrinhoSalvo());

  // Propriedades reativas computadas para os componentes
  itens = computed(() => this.carrinho());
  quantidade = computed(() =>
    this.carrinho().reduce((acc, item) => acc + (item.quantidade || 1), 0),
  );
  total = computed(() =>
    this.carrinho().reduce((total, item) => total + item.preco * (item.quantidade || 1), 0),
  );
  carrinhoVazio = computed(() => this.carrinho().length === 0);

  constructor() {
    // Garante que qualquer alteração seja sempre salva no LocalStorage do dispositivo atual
    effect(() => {
      this.salvarCarrinho(this.carrinho());
    });
  }

  // Define os itens do carrinho (usado quando a nuvem carrega ou sincroniza)
  definirItens(itens: ItemCarrinho[]) {
    this.carrinho.set(itens);
  }

  // Adiciona o produto ou aumenta a quantidade se já estiver no carrinho
  adicionar(produto: ItemCarrinho) {
    this.carrinho.update((lista) => {
      const id = produto.id;
      const indexExistente =
        id !== undefined && id !== null
          ? lista.findIndex((item) => String(item.id) === String(id))
          : lista.findIndex((item) => item.nome === produto.nome);

      if (indexExistente > -1) {
        const novaLista = [...lista];
        const itemExistente = novaLista[indexExistente];
        novaLista[indexExistente] = {
          ...itemExistente,
          quantidade: (itemExistente.quantidade || 1) + (produto.quantidade || 1),
        };
        return novaLista;
      }

      return [...lista, { ...produto, quantidade: produto.quantidade || 1 }];
    });
  }

  // Remove um produto pelo índice
  removerPorIndice(indice: number) {
    this.carrinho.update((listaAtual) => listaAtual.filter((_, index) => index !== indice));
  }

  // Limpa o carrinho e remove a chave do LocalStorage
  limpar() {
    this.carrinho.set([]);
    if (this.estaNoNavegador()) {
      localStorage.removeItem(this.chaveStorage);
    }
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

  private salvarCarrinho(itens: ItemCarrinho[]) {
    if (!this.estaNoNavegador()) return;
    localStorage.setItem(this.chaveStorage, JSON.stringify(itens));
  }
}
