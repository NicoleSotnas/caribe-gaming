import { Injectable, inject, runInInjectionContext, EnvironmentInjector } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  user,
} from '@angular/fire/auth';
import { defer, from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private injector = inject(EnvironmentInjector);

  async loginAsync(email: string, senha: string): Promise<any> {
    return runInInjectionContext(this.injector, () => {
      return signInWithEmailAndPassword(this.auth, email, senha);
    });
  }

  async loginComGoogleAsync(): Promise<any> {
    return runInInjectionContext(this.injector, () => {
      const provider = new GoogleAuthProvider();
      return signInWithPopup(this.auth, provider);
    });
  }

  async recuperarSenhaAsync(email: string): Promise<void> {
    return runInInjectionContext(this.injector, () => {
      return sendPasswordResetEmail(this.auth, email);
    });
  }

  // Métodos em Observable mantidos por compatibilidade
  login(email: string, senha: string): Observable<any> {
    return defer(() => from(this.loginAsync(email, senha)));
  }

  loginComGoogle(): Observable<any> {
    return defer(() => from(this.loginComGoogleAsync()));
  }

  recuperarSenha(email: string): Observable<void> {
    return defer(() => from(this.recuperarSenhaAsync(email)));
  }

  registrar(email: string, senha: string, nome?: string): Observable<any> {
    return defer(() =>
      from(
        runInInjectionContext(this.injector, () =>
          createUserWithEmailAndPassword(this.auth, email, senha),
        ),
      ),
    ).pipe(
      switchMap((credencial) => {
        if (!nome) {
          return from(Promise.resolve(credencial));
        }
        return defer(() => from(updateProfile(credencial.user, { displayName: nome }))).pipe(
          switchMap(() => from(Promise.resolve(credencial))),
        );
      }),
    );
  }

  logout(): Observable<void> {
    return defer(() => from(runInInjectionContext(this.injector, () => signOut(this.auth))));
  }

  atualizarNomeUsuario(nome: string): Observable<void> {
    return defer(() => {
      const usuarioAtual = this.auth.currentUser;
      if (!usuarioAtual) {
        throw new Error('Nenhum usuário autenticado.');
      }
      return from(
        runInInjectionContext(this.injector, () =>
          updateProfile(usuarioAtual, { displayName: nome }),
        ),
      );
    });
  }

  get usuarioAtual$() {
    return user(this.auth);
  }
}
