import { Injectable, inject } from '@angular/core';
import { CarrinhoService } from '../services/carrinho.service';
import { ItemCarrinho } from '../../models/item-carrinho';

@Injectable({
  providedIn: 'root',
})
export class CarrinhoFacade {
  private readonly carrinhoService = inject(CarrinhoService);

  readonly itens = this.carrinhoService.itens;
  readonly quantidade = this.carrinhoService.quantidade;
  readonly total = this.carrinhoService.total;
  readonly carrinhoVazio = this.carrinhoService.carrinhoVazio;

  adicionarProduto(produto: ItemCarrinho): void {
    this.carrinhoService.adicionar(produto);
  }

  removerItem(indice: number): void {
    this.carrinhoService.removerPorIndice(indice);
  }

  limparCarrinho(): void {
    this.carrinhoService.limpar();
  }
}