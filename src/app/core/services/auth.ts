import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import type { AuthError, User } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';
import { UsuarioApp } from '../models/usuario-app';

const converter = (u: User | null | undefined): UsuarioApp | null =>
  u
    ? {
        uid: u.id,
        email: u.email ?? null,
        displayName: (u.user_metadata?.['display_name'] as string | undefined) ?? null,
      }
    : null;

// Códigos de erro do Supabase Auth: confirme os do seu projeto ao testar,
// a doc oficial lista os códigos atuais de auth error.
export function traduzirErroAuth(erro: unknown): string {
  const codigo = (erro as { code?: string })?.code ?? '';
  const mapa: Record<string, string> = {
    user_already_exists: 'Este e-mail já está cadastrado.',
    invalid_credentials: 'E-mail ou senha incorretos.',
    weak_password: 'Senha fraca. Use ao menos 6 caracteres.',
    email_not_confirmed: 'Confirme seu e-mail antes de entrar.',
    over_request_rate_limit: 'Muitas tentativas. Aguarde um pouco.',
  };
  return mapa[codigo] ?? 'Não foi possível concluir. Tente novamente.';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly sb = inject(SupabaseService).client;
  private readonly estado = new BehaviorSubject<UsuarioApp | null>(null);

  /** Resolve quando a sessão inicial foi lida. Os guards esperam por isso
   *  antes de decidir, senão redirecionam para /login por engano no primeiro instante. */
  readonly pronto: Promise<void>;

  constructor() {
    this.pronto = this.sb.auth
      .getSession()
      .then(({ data }) => this.estado.next(converter(data.session?.user)));
    this.sb.auth.onAuthStateChange((_evento, sessao) => this.estado.next(converter(sessao?.user)));
  }

  get usuarioAtual$(): Observable<UsuarioApp | null> {
    return this.estado.asObservable();
  }
  get usuarioAtualSnapshot(): UsuarioApp | null {
    return this.estado.value;
  }

  private comoObservable(p: PromiseLike<{ error: AuthError | null }>): Observable<void> {
    return from(
      Promise.resolve(p).then(({ error }) => {
        if (error) throw error;
      }),
    );
  }

  login(email: string, senha: string): Observable<void> {
    return this.comoObservable(this.sb.auth.signInWithPassword({ email, password: senha }));
  }

  // Precisa habilitar o provedor Google no painel do Supabase (Authentication > Providers)
  // e cadastrar as Redirect URLs antes de funcionar.
  loginComGoogle(): Observable<void> {
    return this.comoObservable(
      this.sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } }),
    );
  }

  recuperarSenha(email: string): Observable<void> {
    return this.comoObservable(
      this.sb.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/login` }),
    );
  }

  // Se "Confirm email" estiver ligado no Supabase (Authentication > Settings),
  // o usuário só consegue logar depois de confirmar o e-mail.
  registrar(email: string, senha: string, nome: string): Observable<void> {
    return this.comoObservable(
      this.sb.auth.signUp({ email, password: senha, options: { data: { display_name: nome } } }),
    );
  }

  logout(): Observable<void> {
    return this.comoObservable(this.sb.auth.signOut());
  }

  atualizarNomeUsuario(nome: string): Observable<void> {
    return from(
      (async () => {
        const { error } = await this.sb.auth.updateUser({ data: { display_name: nome } });
        if (error) throw error;
        const uid = this.estado.value?.uid;
        if (uid) {
          // grant é só em display_name (ver 001_init.sql): tentar mudar "role" aqui falharia.
          const r = await this.sb.from('profiles').update({ display_name: nome }).eq('id', uid);
          if (r.error) throw r.error;
        }
      })(),
    );
  }

  /** Papel vem da tabela profiles. O usuário não consegue alterá-lo (grant de coluna no banco). */
  async buscarPapel(uid: string): Promise<string> {
    const { data } = await this.sb.from('profiles').select('role').eq('id', uid).single();
    return (data?.role as string | undefined) ?? 'customer';
  }
}