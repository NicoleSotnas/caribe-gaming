import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    nome: string;
    email: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // troque pela URL real da API do grupo
  private apiUrl = 'https://sua-api.com/api';

  constructor(private http: HttpClient) {}

  login(email: string, senha: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, senha }).pipe(
      tap((resposta) => {
        localStorage.setItem('token', resposta.token);
        localStorage.setItem('usuario', JSON.stringify(resposta.user));
      }),
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  estaLogado(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsuario(): any {
    const dados = localStorage.getItem('usuario');
    return dados ? JSON.parse(dados) : null;
  }
}
