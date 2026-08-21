import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  user,
} from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class AuthService {
  
  constructor(private auth: Auth) {}
  
  login(email: string, senha: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, senha));
  }

  registrar(email: string, senha: string): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth, email, senha));
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  get usuarioAtual$() {
    return user(this.auth);
  }
}
