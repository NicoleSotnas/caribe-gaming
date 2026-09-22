import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Produto } from '../models/jogo';

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
    return this.favoritosSubject.value.some(p => p.id.toString() === produtoId.toString());
  }

  adicionarFavorito(produto: Produto): void {
    const listaAtual = this.favoritosSubject.value;
    if (!this.ehFavorito(produto.id)) {
      const novaLista = [...listaAtual, produto];
      this.favoritosSubject.next(novaLista);
      this.salvarNoStorage(novaLista);
    }
  }

  removerFavorito(produtoId: string): void {
    const listaAtual = this.favoritosSubject.value;
    const novaLista = listaAtual.filter(p => p.id.toString() !== produtoId.toString());
    this.favoritosSubject.next(novaLista);
    this.salvarNoStorage(novaLista);
  }

  toggleFavorito(produto: Produto) {
    if (this.ehFavorito(produto.id)) {
      this.removerFavorito(produto.id);
    } else {
      this.adicionarFavorito(produto);
    }
  }

  limparTodosFavoritos(): void {
    this.favoritosSubject.next([]);
    this.salvarNoStorage([]);
  }

  obterFavoritos(): Produto[] {
    return this.favoritosSubject.value;
  }
}