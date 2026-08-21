import { Component, OnInit, inject, ChangeDetectorRef, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RawgService, DetalhesJogo } from '../../../../core/services/rawg.service';

const CHAVE_CACHE = 'witcher3_galeria_imagens';

@Component({
  selector: 'app-thewitcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './thewitcher.html',
  styleUrl: './thewitcher.css',
})
export class Thewitcher implements OnInit {
  jogo: DetalhesJogo | null = null;
  carregando: boolean = true;
  erro: boolean = false;

  galeriaImagens: string[] = [];
  indiceAtivo: number = 0;
  favorito: boolean = false;

  private cdr = inject(ChangeDetectorRef);

  constructor(
    private rawgService: RawgService,
    private router: Router
  ) {
    // Tenta carregar do cache ANTES de qualquer renderização
    this.carregarDoCache();

    afterNextRender(() => {
      // Só busca da API se o cache estiver vazio
      if (this.galeriaImagens.length === 0) {
        this.carregarScreenshots();
      } else {
        this.carregando = false;
      }
    });
  }

  ngOnInit(): void {
    this.rawgService.obterDetalhesTheWitcher3().subscribe({
      next: (dados: DetalhesJogo) => {
        this.jogo = dados;
        this.cdr.markForCheck();
      },
      error: (err) => console.error(err),
    });
  }

  private carregarDoCache(): void {
    try {
      if (typeof sessionStorage !== 'undefined') {
        const cache = sessionStorage.getItem(CHAVE_CACHE);
        if (cache) {
          this.galeriaImagens = JSON.parse(cache);
        }
      }
    } catch {
      // sessionStorage pode não existir durante SSR — ignora silenciosamente
    }
  }

  private salvarNoCache(imagens: string[]): void {
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(CHAVE_CACHE, JSON.stringify(imagens));
      }
    } catch {
      // ignora se der erro (ex: modo anônimo bloqueando storage)
    }
  }

  private carregarScreenshots(): void {
    this.rawgService.obterScreenshots('the-witcher-3-wild-hunt').subscribe({
      next: (res) => {
        if (res.results && res.results.length > 0) {
          const capa = 'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/capsule_616x353.jpg';
          const screenshots = res.results.map((item: any) => item.image);
          this.galeriaImagens = [capa, ...screenshots];
          this.salvarNoCache(this.galeriaImagens);
        }
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao carregar screenshots:', err);
        this.carregando = false;
        this.erro = true;
        this.cdr.markForCheck();
      },
    });
  }

  proximaFoto(): void {
    if (this.galeriaImagens.length === 0) return;
    if (this.indiceAtivo < this.galeriaImagens.length - 1) {
      this.indiceAtivo++;
    } else {
      this.indiceAtivo = 0;
    }
  }

  fotoAnterior(): void {
    if (this.galeriaImagens.length === 0) return;
    if (this.indiceAtivo > 0) {
      this.indiceAtivo--;
    } else {
      this.indiceAtivo = this.galeriaImagens.length - 1;
    }
  }

  selecionarIndice(index: number): void {
    this.indiceAtivo = index;
  }

  irParaHome(): void {
    this.router.navigate(['/']);
  }

  irParaJogos(): void {
    this.router.navigate(['/jogos']);
  }
}