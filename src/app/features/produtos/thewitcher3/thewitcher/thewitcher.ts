import { Component, OnInit, inject, ChangeDetectorRef, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RawgService, DetalhesJogo } from '../../../../core/services/rawg.service';

const CHAVE_CACHE = 'witcher3_dados_completos';

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
  private rawgService = inject(RawgService);
  private router = inject(Router);

  // Identificadores do The Witcher 3 na RAWG e na Steam
  private jogoSlug = 'the-witcher-3-wild-hunt';
  private steamAppId = '292030';

  constructor() {
    this.carregarDoCache();

    afterNextRender(() => {
      if (!this.jogo || this.galeriaImagens.length === 0) {
        this.carregarDadosDoJogo();
      } else {
        this.carregando = false;
      }
    });
  }

  ngOnInit(): void {}

  private carregarDadosDoJogo(): void {
    // 1. Busca os detalhes textuais dinamicamente pelo serviço genérico
    this.rawgService.obterDetalhesJogo(this.jogoSlug).subscribe({
      next: (res: any) => {
        this.jogo = {
          id: res.id,
          nome: res.name,
          descricao: res.description_raw || 'Descrição indisponível.',
          dataLancamento: res.released ? res.released.split('-').reverse().join('/') : 'N/A',
          desenvolvedoras: res.developers?.[0]?.name || 'CD PROJEKT RED',
          distribuidoras: res.publishers?.[0]?.name || 'CD PROJEKT RED',
          classificacaoEtaria: res.esrb_rating?.name || '18+',
          plataformas: res.platforms?.map((p: any) => p.platform.name).join(' / ') || 'PC / PS5'
        };
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao buscar detalhes do jogo:', err);
        this.erro = true;
        this.cdr.markForCheck();
      }
    });

    // 2. Busca as screenshots e adiciona a capa da Steam na frente
    this.rawgService.obterScreenshots(this.jogoSlug).subscribe({
      next: (res) => {
        if (res.results && res.results.length > 0) {
          const capaSteam = `https://cdn.cloudflare.steamstatic.com/steam/apps/${this.steamAppId}/capsule_616x353.jpg`;
          const screenshots = res.results.map((item: any) => item.image);
          
          this.galeriaImagens = [capaSteam, ...screenshots];
          this.salvarNoCache({ jogo: this.jogo, imagens: this.galeriaImagens });
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

  private carregarDoCache(): void {
    try {
      if (typeof sessionStorage !== 'undefined') {
        const cache = sessionStorage.getItem(CHAVE_CACHE);
        if (cache) {
          const dados = JSON.parse(cache);
          this.jogo = dados.jogo;
          this.galeriaImagens = dados.imagens;
        }
      }
    } catch {}
  }

  private salvarNoCache(dados: any): void {
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(CHAVE_CACHE, JSON.stringify(dados));
      }
    } catch {}
  }

  proximaFoto(): void {
    if (this.galeriaImagens.length === 0) return;
    this.indiceAtivo = (this.indiceAtivo < this.galeriaImagens.length - 1) ? this.indiceAtivo + 1 : 0;
  }

  fotoAnterior(): void {
    if (this.galeriaImagens.length === 0) return;
    this.indiceAtivo = (this.indiceAtivo > 0) ? this.indiceAtivo - 1 : this.galeriaImagens.length - 1;
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