import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthFacade } from '../../core/facades/auth.facade';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonModule, CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  authFacade = inject(AuthFacade);

  sair() {
    this.authFacade.sair();
  }
}