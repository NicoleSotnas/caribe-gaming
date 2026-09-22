import {
  Injectable,
  Injector,
  runInInjectionContext,
} from '@angular/core';

import {
  Auth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  user,
} from '@angular/fire/auth';

import {
  from,
  Observable,
} from 'rxjs';

import {
  switchMap,
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private readonly auth: Auth,
    private readonly injector: Injector,
  ) {}

  /**
   * Realiza login com e-mail e senha.
   */
  login(
    email: string,
    senha: string,
  ): Observable<any> {
    return runInInjectionContext(
      this.injector,
      () =>
        from(
          signInWithEmailAndPassword(
            this.auth,
            email.trim(),
            senha,
          ),
        ),
    );
  }

  /**
   * Realiza login utilizando uma conta Google.
   */
  loginComGoogle(): Observable<any> {
    return runInInjectionContext(
      this.injector,
      () => {
        const provider =
          new GoogleAuthProvider();

        return from(
          signInWithPopup(
            this.auth,
            provider,
          ),
        );
      },
    );
  }

  /**
   * Envia um e-mail para redefinição da senha.
   */
  recuperarSenha(
    email: string,
  ): Observable<void> {
    return runInInjectionContext(
      this.injector,
      () =>
        from(
          sendPasswordResetEmail(
            this.auth,
            email.trim(),
          ),
        ),
    );
  }

  /**
   * Cria uma nova conta.
   *
   * Depois da criação, salva o nome informado
   * como displayName no perfil do usuário.
   */
  registrar(
    email: string,
    senha: string,
    nome: string,
  ): Observable<any> {
    return runInInjectionContext(
      this.injector,
      () =>
        from(
          createUserWithEmailAndPassword(
            this.auth,
            email.trim(),
            senha,
          ),
        ).pipe(
          switchMap(
            (credencial) =>
              runInInjectionContext(
                this.injector,
                () =>
                  from(
                    updateProfile(
                      credencial.user,
                      {
                        displayName:
                          nome.trim(),
                      },
                    ),
                  ),
              ),
          ),
        ),
    );
  }

  /**
   * Encerra a sessão atual.
   */
  logout(): Observable<void> {
    return runInInjectionContext(
      this.injector,
      () =>
        from(
          signOut(
            this.auth,
          ),
        ),
    );
  }

  /**
   * Atualiza o nome do usuário autenticado.
   */
  atualizarNomeUsuario(
    nome: string,
  ): Observable<void> {
    return runInInjectionContext(
      this.injector,
      () => {
        const usuarioAtual =
          this.auth.currentUser;

        if (!usuarioAtual) {
          throw new Error(
            'Nenhum usuário autenticado.',
          );
        }

        return from(
          updateProfile(
            usuarioAtual,
            {
              displayName:
                nome.trim(),
            },
          ),
        );
      },
    );
  }

  /**
   * Observable que acompanha
   * automaticamente o estado de autenticação.
   *
   * Emite:
   * User → usuário logado
   * null → usuário deslogado
   */
  get usuarioAtual$() {
    return user(
      this.auth,
    );
  }
}
