import { Injectable, Injector, runInInjectionContext } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  user,
} from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private auth: Auth,
    private injector: Injector,
  ) {}

  login(email: string, senha: string): Observable<any> {
    return runInInjectionContext(this.injector, () =>
      from(signInWithEmailAndPassword(this.auth, email, senha)),
    );
  }

  loginComGoogle(): Observable<any> {
    return runInInjectionContext(this.injector, () => {
      const provider = new GoogleAuthProvider();
      return from(signInWithPopup(this.auth, provider));
    });
  }

  registrar(email: string, senha: string, nome: string): Observable<any> {
    return runInInjectionContext(this.injector, () =>
      from(createUserWithEmailAndPassword(this.auth, email, senha)).pipe(
        switchMap((credencial) =>
          runInInjectionContext(this.injector, () =>
            from(updateProfile(credencial.user, { displayName: nome })),
          ),
        ),
      ),
    );
  }

  logout(): Observable<void> {
    return runInInjectionContext(this.injector, () => from(signOut(this.auth)));
  }

  atualizarNomeUsuario(nome: string): Observable<void> {
    return runInInjectionContext(this.injector, () => {
      const usuarioAtual = this.auth.currentUser;
      if (!usuarioAtual) {
        throw new Error('Nenhum usuário autenticado.');
      }
      return from(updateProfile(usuarioAtual, { displayName: nome }));
    });
  }

  get usuarioAtual$() {
    return user(this.auth);
  }
}
