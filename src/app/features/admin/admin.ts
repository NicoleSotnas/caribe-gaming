import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AuthFacade } from '../../core/facades/auth.facade';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  authFacade = inject(AuthFacade);

  // Números fictícios pra representar o painel — depois dá pra trocar por dados reais de uma API
  produtosCadastrados = 20;
  pedidosPendentes = 3;
  usuariosCadastrados = 8;

  sair() {
    this.authFacade.sair();
  }
}
//atualizado