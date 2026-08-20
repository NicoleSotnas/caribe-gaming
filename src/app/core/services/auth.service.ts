import { Injectable, computed, signal } from '@angular/core';

type PerfilUsuario = 'usuario' | 'admin';

type Usuario = {
  email: string;
  perfil: PerfilUsuario;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usuario = signal<Usuario | null>(null);
  private tokenJwt = signal<string | null>(null);

  usuarioAtual = computed(() => this.usuario());
  estaLogado = computed(() => this.usuario() !== null);
  ehAdmin = computed(() => this.usuario()?.perfil === 'admin');
  token = computed(() => this.tokenJwt());

  login(email: string, senha: string): boolean {
    if (!email || !senha) {
      return false;
    }

    // Regra: e-mail perfil será admin: admin@email.com . Outro e-mail: usuario comum.
    const perfil: PerfilUsuario = email === 'admin@email.com' ? 'admin' : 'usuario';

    const tokenSimulado =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
      'eyJzdWIiOiJhbHVub0B0ZXN0ZS5jb20iLCJwZXJmaWwiOiJ1c3VhcmlvIn0.' +
      'assinatura-simulada';

    this.usuario.set({ email, perfil });

    this.tokenJwt.set(tokenSimulado);

    return true;
  }

  logout() {
    this.usuario.set(null);
    this.tokenJwt.set(null);
  }

  obterToken(): string | null {
    return this.tokenJwt();
  }

  obterPerfil(): PerfilUsuario | null {
    return this.usuario()?.perfil ?? null;
  }
}
