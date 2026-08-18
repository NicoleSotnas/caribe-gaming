import { Injectable, inject } from '@angular/core';

import { CarrinhoService } from '../services/carrinho.service';
import { ItemCarrinho } from '../models/item-carrinho';

@Injectable({
  providedIn: 'root',
})
export class CarrinhoFacade {
  private carrinhoService = inject(CarrinhoService);

  itens = this.carrinhoService.itens;
  quantidade = this.carrinhoService.quantidade;
  total = this.carrinhoService.total;
  carrinhoVazio = this.carrinhoService.carrinhoVazio;

  adicionarProduto(produto: ItemCarrinho) {
    this.carrinhoService.adicionar(produto);
  }

  removerItem(indice: number) {
    this.carrinhoService.removerPorIndice(indice);
  }

  limparCarrinho() {
    this.carrinhoService.limpar();
  }
}
