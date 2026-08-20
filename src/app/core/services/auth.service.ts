import { Injectable, computed, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type PerfilUsuario = 'usuario' | 'admin';
type Usuario = {
  email: string;
  perfil: PerfilUsuario;
};

const CHAVE_USUARIO = 'caribe-gaming:usuario';
const CHAVE_TOKEN = 'caribe-gaming:token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private plataformaId = inject(PLATFORM_ID);
  private ehNavegador = isPlatformBrowser(this.plataformaId);

  private usuario = signal<Usuario | null>(this.carregarUsuarioSalvo());
  private tokenJwt = signal<string | null>(
    this.ehNavegador ? localStorage.getItem(CHAVE_TOKEN) : null,
  );

  usuarioAtual = computed(() => this.usuario());
  estaLogado = computed(() => this.usuario() !== null);
  ehAdmin = computed(() => this.usuario()?.perfil === 'admin');
  token = computed(() => this.tokenJwt());

  private carregarUsuarioSalvo(): Usuario | null {
    if (!this.ehNavegador) {
      return null;
    }
    const dados = localStorage.getItem(CHAVE_USUARIO);
    return dados ? JSON.parse(dados) : null;
  }

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

    const usuario: Usuario = { email, perfil };

    this.usuario.set(usuario);
    this.tokenJwt.set(tokenSimulado);

    if (this.ehNavegador) {
      localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));
      localStorage.setItem(CHAVE_TOKEN, tokenSimulado);
    }

    return true;
  }

  logout() {
    this.usuario.set(null);
    this.tokenJwt.set(null);

    if (this.ehNavegador) {
      localStorage.removeItem(CHAVE_USUARIO);
      localStorage.removeItem(CHAVE_TOKEN);
    }
  }

  obterToken(): string | null {
    return this.tokenJwt();
  }

  obterPerfil(): PerfilUsuario | null {
    return this.usuario()?.perfil ?? null;
  }
}
