import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  usuarioAtual$: Observable<any>;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.usuarioAtual$ = this.authService.usuarioAtual$;
  }

  sair(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
