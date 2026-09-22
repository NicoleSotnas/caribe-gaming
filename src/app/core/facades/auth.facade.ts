import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { of, switchMap, map, from } from 'rxjs';
import { AuthService } from '../services/auth';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly authService = inject(AuthService);

  usuarioAtual = toSignal(this.authService.usuarioAtual$, { initialValue: null });

  estaLogado(): boolean {
    return !!this.usuarioAtual();
  }

  // Antes: comparação com EMAIL_ADMIN no cliente. Agora: papel vindo do banco (profiles.role).
  // Isto só controla a INTERFACE (mostrar/esconder botão); quem protege de verdade é o RLS/is_admin().
  ehAdmin = toSignal(
    this.authService.usuarioAtual$.pipe(
      switchMap((u) => (u ? from(this.authService.buscarPapel(u.uid)) : of('customer'))),
      map((papel) => papel === 'admin'),
    ),
    { initialValue: false },
  );

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