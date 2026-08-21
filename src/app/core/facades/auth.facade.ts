import { Injectable, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../services/auth';

const EMAIL_ADMIN = 'admin@email.com';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  private authService = inject(AuthService);

  usuarioAtual = toSignal(this.authService.usuarioAtual$, { initialValue: null });

  estaLogado(): boolean {
    return !!this.usuarioAtual();
  }

  // computed: recalcula sozinho toda vez que usuarioAtual muda
  ehAdmin = computed(() => this.usuarioAtual()?.email === EMAIL_ADMIN);

  realizarLogin(email: string, senha: string) {
    return this.authService.login(email, senha);
  }

  realizarRegistro(email: string, senha: string) {
    return this.authService.registrar(email, senha);
  }

  sair() {
    this.authService.logout().subscribe();
  }
}