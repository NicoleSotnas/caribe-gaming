import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AuthFacade } from '../../core/facades/auth.facade';
import { ProdutosService } from '../../core/services/produtos.service';
import { PainelAdminMockService } from '../../core/services/painel-admin-mock.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  authFacade = inject(AuthFacade);
  private produtosService = inject(ProdutosService);
  private painelAdminMockService = inject(PainelAdminMockService);

  produtosCadastrados = signal(0);
  pedidosPendentes = signal(0);
  usuariosCadastrados = signal(0);

  constructor() {
    this.produtosService.obterProdutos().subscribe((produtos) => {
      this.produtosCadastrados.set(produtos.length);
    });

    this.painelAdminMockService.obterPedidosPendentes().subscribe((pedidos) => {
      this.pedidosPendentes.set(pedidos.length);
    });

    this.painelAdminMockService.obterUsuariosCadastrados().subscribe((usuarios) => {
      this.usuariosCadastrados.set(usuarios.length);
    });
  }

  sair() {
    this.authFacade.sair();
  }
}
//fkjbaiuga