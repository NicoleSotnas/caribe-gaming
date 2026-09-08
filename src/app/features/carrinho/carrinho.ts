import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CarrinhoFacade } from '../../core/facades/carrinho.facade';
import { AuthFacade } from '../../core/facades/auth.facade';

@Component({
  selector: 'app-carrinho',
  imports: [RouterLink, MatButtonModule],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css',
})
export class Carrinho {
  carrinhoFacade = inject(CarrinhoFacade);
  authFacade = inject(AuthFacade);

  removerItem(indice: number) {
    this.carrinhoFacade.removerItem(indice);
  }

  limparCarrinho() {
    this.carrinhoFacade.limparCarrinho();
  }
}
