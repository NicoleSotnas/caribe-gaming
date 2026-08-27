import { Component, inject, ViewEncapsulation, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthFacade } from '../../core/facades/auth.facade';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
  encapsulation: ViewEncapsulation.Emulated,
})
export class Header {
  authFacade = inject(AuthFacade);
  menuAberto = false;
  menuUsuarioAberto = false;

  constructor(private elementRef: ElementRef) {}

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  fecharMenu() {
    this.menuAberto = false;
  }

  toggleMenuUsuario() {
    this.menuUsuarioAberto = !this.menuUsuarioAberto;
  }

  @HostListener('document:click', ['$event'])
  aoClicarFora(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.menuUsuarioAberto = false;
    }
  }

  sair() {
    this.authFacade.sair();
    this.menuUsuarioAberto = false;
    this.fecharMenu();
  }
}
