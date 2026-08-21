import { Component, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthFacade } from '../../core/facades/auth.facade'; // Ajuste o caminho conforme seu projeto

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css', // No Angular 17+, use styleUrl
  encapsulation: ViewEncapsulation.None,
})
export class Header {
  authFacade = inject(AuthFacade);
  menuAberto = false;

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  fecharMenu() {
    this.menuAberto = false;
  }

  sair() {
    this.authFacade.sair();
    this.fecharMenu();
  }
}
