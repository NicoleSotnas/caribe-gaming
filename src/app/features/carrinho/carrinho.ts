import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarrinhoFacade } from '../../core/facades/carrinho.facade';

@Component({
  selector: 'app-carrinho',
  imports: [RouterLink],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css',
})
export class Carrinho {
  readonly carrinhoFacade = inject(CarrinhoFacade);

  removerItem(indice: number): void {
    this.carrinhoFacade.removerItem(indice);
  }

  limparCarrinho(): void {
    this.carrinhoFacade.limparCarrinho();
  }
}
