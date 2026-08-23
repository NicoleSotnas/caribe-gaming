import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Produto } from './produtos.service';

const CHAVE_STORAGE = 'caribes-gaming-favoritos';

@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private favoritosSubject = new BehaviorSubject<Produto[]>([]);
  favoritos$ = this.favoritosSubject.asObservable();

  constructor() {
    if (this.isBrowser) {
      this.favoritosSubject.next(this.carregarDoStorage());
    }
  }

  private carregarDoStorage(): Produto[] {
    if (!this.isBrowser) return [];
    
    try {
      const salvo = localStorage.getItem(CHAVE_STORAGE);
      return salvo ? JSON.parse(salvo) : [];
    } catch {
      return [];
    }
  }

  private salvarNoStorage(lista: Produto[]) {
    if (this.isBrowser) {
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(lista));
    }
  }

  ehFavorito(produtoId: string): boolean {
    return this.favoritosSubject.value.some(p => p.id === produtoId);
  }

  // Método flexível para aceitar tanto a interface completa de Produto quanto objetos parciais das telas de detalhes
  toggleFavorito(produto: Produto | { id: string; nome: string; imagem: string; [key: string]: any }) {
    const listaAtual = this.favoritosSubject.value;
    const jaExiste = listaAtual.some(p => p.id === produto.id);

    const novaLista = jaExiste
      ? listaAtual.filter(p => p.id !== produto.id)
      : [...listaAtual, produto as Produto];

    this.favoritosSubject.next(novaLista);
    this.salvarNoStorage(novaLista);
  }

  limparTodosFavoritos(): void {
    this.favoritosSubject.next([]);
    this.salvarNoStorage([]);
  }

  obterFavoritos(): Produto[] {
    return this.favoritosSubject.value;
  }
}