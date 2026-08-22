import { Component, OnInit, inject, ChangeDetectorRef, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RawgService, DetalhesJogo } from '../../../../core/services/rawg.service';

const CHAVE_CACHE = 'sims4_galeria_imagens';

@Component({
  selector: 'app-thesims4',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './thesims.html', // Ajuste para o nome do seu arquivo html se necessário
  styleUrl: './thesims.css',
})
export class TheSims implements OnInit {
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
    // Se o seu RawgService tiver um método específico para o Sims 4, altere aqui.
    // Usando temporariamente os dados adaptados do The Sims 4:
    this.jogo = {
      id: 1222670,
      nome: 'The Sims 4',
      descricao: 'Liberte sua imaginação e crie um mundo de Sims exclusivo que é só seu! Explore e personalize cada detalhe, desde os Sims até as casas, e muito mais.',
      dataLancamento: '02/09/2014',
      desenvolvedoras: 'Maxis',
      distribuidoras: 'Electronic Arts',
      classificacaoEtaria: '12+',
      plataformas: 'PC / PS4 / Xbox One'
    };
    this.cdr.markForCheck();
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
      // ignora se der erro
    }
  }

  private carregarScreenshots(): void {
    // Buscando pelo slug do The Sims 4 na API da RAWG
    this.rawgService.obterScreenshots('the-sims-4').subscribe({
      next: (res) => {
        if (res.results && res.results.length > 0) {
          // Capa oficial do The Sims 4 na Steam (App ID: 1222670)
          const capa = 'https://cdn.cloudflare.steamstatic.com/steam/apps/1222670/capsule_616x353.jpg';
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