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

  ehAdmin = computed(() => this.usuarioAtual()?.email === EMAIL_ADMIN);

  // nome de exibição: usa o nome de usuário se tiver, senão cai no email
  nomeExibicao = computed(() => {
    const usuario = this.usuarioAtual();
    return usuario?.displayName || usuario?.email || '';
  });

  realizarLogin(email: string, senha: string) {
    return this.authService.login(email, senha);
  }

  realizarRegistro(email: string, senha: string, nome: string) {
    return this.authService.registrar(email, senha, nome);
  }

  atualizarNomeUsuario(nome: string) {
    return this.authService.atualizarNomeUsuario(nome);
  }

  sair() {
    this.authService.logout().subscribe();
  }
}
