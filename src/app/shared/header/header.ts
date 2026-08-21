<<<<<<< HEAD
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AuthFacade } from '../../core/facades/auth.facade';
=======
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthFacade } from '../../core/facades/auth.facade'; // Ajuste o caminho conforme seu projeto
>>>>>>> d04ad2c0fc0cf4c359316c5bb2346c2bebd6373f

@Component({
  selector: 'app-header',
  standalone: true,
<<<<<<< HEAD
  imports: [ButtonModule, CommonModule],
=======
  imports: [CommonModule, RouterLink, RouterLinkActive],
>>>>>>> d04ad2c0fc0cf4c359316c5bb2346c2bebd6373f
  templateUrl: './header.html',
  styleUrl: './header.css', // No Angular 17+, use styleUrl
  encapsulation: ViewEncapsulation.None,
})
export class Header {
  authFacade = inject(AuthFacade);
<<<<<<< HEAD

  sair() {
    this.authFacade.sair();
  }
}
=======
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
>>>>>>> d04ad2c0fc0cf4c359316c5bb2346c2bebd6373f
