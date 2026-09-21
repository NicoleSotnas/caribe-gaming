import { Component, OnInit, inject, ChangeDetectorRef, afterNextRender } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RawgService, DetalhesJogo } from '../../../core/services/rawg.service';
import { CarrinhoFacade } from '../../../core/facades/carrinho.facade';
import { FavoritosService } from '../../../core/services/favoritos.service';

export interface Comentario {
  id: number;
  autor: string;
  avatar: string;
  estrelas: number;
  texto: string;
  data: string;
  likes: number;
  dislikes: number;
  votouLike?: boolean;
  votouDislike?: boolean;
}

@Component({
  selector: 'app-detalhe-jogo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalhe-jogo.html',
  styleUrl: './detalhe-jogo.css',
})
export class DetalheJogo implements OnInit {
  jogo: DetalhesJogo | null = null;
  carregando: boolean = true;
  erro: boolean = false;

  galeriaImagens: string[] = [];
  indiceAtivo: number = 0;
  favorito: boolean = false;
  mensagemToast: string | null = null;

  // Propriedades Dinâmicas do E-commerce
  jogoIdOuSlug: string = '';
  precoJogo: number = 99.95;
  precoOriginalFormatado: string = 'R$ 199,90';
  precoFormatado: string = 'R$ 99,95';
  desconto: number = 50;
  genero: string = 'Ação / Aventura';
  notaMetacritic: string = '4.5';
  totalAvaliacoes: number = 1240;

  requisitosMinimos?: string;
  requisitosRecomendados?: string;

  exibirModalAvaliacao: boolean = false;
  novoNome: string = '';
  novoTexto: string = '';
  novaNota: number = 5;

  listaComentarios: Comentario[] = [];

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private cdr = inject(ChangeDetectorRef);
  private rawgService = inject(RawgService);
  private carrinhoFacade = inject(CarrinhoFacade);
  private favoritosService = inject(FavoritosService);

  constructor() {
    afterNextRender(() => {
      // Captura o parâmetro dinâmico da URL (:id ou :slug)
      this.jogoIdOuSlug = this.route.snapshot.paramMap.get('id') || '';

      if (this.jogoIdOuSlug) {
        this.favorito = this.favoritosService.ehFavorito(this.jogoIdOuSlug);
        this.carregarAvaliacoes();
        this.carregarDadosDoJogo();
      }
    });
  }

  ngOnInit(): void {}

  // LocalStorage dinâmico usando o ID do jogo como chave
  private get chaveAvaliacoes(): string {
    return `avaliacoes_jogo_${this.jogoIdOuSlug}`;
  }

  carregarAvaliacoes(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        const salvas = localStorage.getItem(this.chaveAvaliacoes);
        if (salvas) {
          this.listaComentarios = JSON.parse(salvas);
        } else {
          // Comentários iniciais padrão de demonstração
          this.listaComentarios = [
            {
              id: 1,
              autor: 'GamerPro',
              avatar: 'G',
              estrelas: 5,
              texto: 'Excelente jogo! Entrega rápida e código funcionando perfeitamente.',
              data: new Date().toLocaleDateString('pt-BR'),
              likes: 12,
              dislikes: 0,
            },
          ];
        }
      }
    } catch {}
  }

  salvarAvaliacoes(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.chaveAvaliacoes, JSON.stringify(this.listaComentarios));
      }
    } catch {}
  }

  private carregarDadosDoJogo(): void {
    this.carregando = true;

    // 1. Busca os detalhes formatados
    this.rawgService.obterDetalhesJogo(this.jogoIdOuSlug).subscribe({
      next: (dados) => {
        this.jogo = dados;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao buscar detalhes do jogo:', err);
        this.erro = true;
        this.carregando = false;
        this.cdr.markForCheck();
      },
    });

    // 2. Busca Capturas de Tela (Screenshots)
    this.rawgService.obterScreenshots(this.jogoIdOuSlug).subscribe({
      next: (res) => {
        if (res.results && res.results.length > 0) {
          this.galeriaImagens = res.results.map((item: any) => item.image);
        } else if (this.jogo?.background_image) {
          this.galeriaImagens = [this.jogo.background_image];
        }
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao carregar screenshots:', err);
        this.carregando = false;
        this.cdr.markForCheck();
      },
    });

    // 3. Busca metadados adicionais (Requisitos, Metacritic, Gêneros)
    this.rawgService.obterGameRaw(this.jogoIdOuSlug).subscribe({
      next: (raw: any) => {
        this.genero = raw.genres?.map((g: any) => g.name).join(', ') || 'Ação / Aventura';
        this.notaMetacritic = raw.metacritic ? (raw.metacritic / 20).toFixed(1) : '4.5';

        const pcPlatform = raw.platforms?.find((p: any) => p.platform.slug === 'pc');
        if (pcPlatform?.requirements) {
          this.requisitosMinimos = pcPlatform.requirements.minimum;
          this.requisitosRecomendados = pcPlatform.requirements.recommended;
        }
        this.cdr.markForCheck();
      },
    });
  }

  // Navegação
  voltarPagina(): void { this.location.back(); }
  irParaHome(): void { this.router.navigate(['/']); }
  irParaJogos(): void { this.router.navigate(['/jogos']); }

  // Carrossel
  proximaFoto(): void {
    if (this.galeriaImagens.length === 0) return;
    this.indiceAtivo = this.indiceAtivo < this.galeriaImagens.length - 1 ? this.indiceAtivo + 1 : 0;
  }

  fotoAnterior(): void {
    if (this.galeriaImagens.length === 0) return;
    this.indiceAtivo = this.indiceAtivo > 0 ? this.indiceAtivo - 1 : this.galeriaImagens.length - 1;
  }

  selecionarIndice(index: number): void {
    this.indiceAtivo = index;
  }

  // Ações de E-commerce
  adicionarAoCarrinho(): void {
    if (!this.jogo) return;

    this.carrinhoFacade.adicionarProduto({
      id: Number(this.jogo.id) || Date.now(),
      nome: this.jogo.nome,
      preco: this.precoJogo,
      quantidade: 1,
      imagemUrl: this.galeriaImagens[0] || this.jogo.background_image || '',
      plataforma: this.jogo.plataformas || 'PC',
      categoria: this.genero,
    });

    this.exibirToast('🛒 Jogo adicionado ao carrinho!');
  }

  toggleFavorito(): void {
    if (!this.jogo) return;

    this.favorito = !this.favorito;

    this.favoritosService.toggleFavorito({
      id: String(this.jogo.id),
      nome: this.jogo.nome,
      imagem: this.galeriaImagens[0] || this.jogo.background_image || '',
      imagemPosicao: 'center',
      precoOriginal: this.precoOriginalFormatado,
      precoPromocional: this.precoFormatado,
      desconto: `-${this.desconto}%`,
      genero: this.genero,
      plataforma: this.jogo.plataformas || 'PC',
      categorias: [this.genero.toLowerCase()],
    });

    const msg = this.favorito ? '❤️ Adicionado aos favoritos!' : '💔 Removido dos favoritos!';
    this.exibirToast(msg);
  }

  comprarAgora(): void {
    this.adicionarAoCarrinho();
    this.router.navigate(['/carrinho']);
  }

  // Modal e Avaliações
  abrirModal(): void { this.exibirModalAvaliacao = true; }

  fecharModal(): void {
    this.exibirModalAvaliacao = false;
    this.novoNome = '';
    this.novoTexto = '';
    this.novaNota = 5;
  }

  enviarAvaliacao(): void {
    if (!this.novoNome.trim() || !this.novoTexto.trim()) {
      this.exibirToast('⚠️ Preencha seu nome e comentário!');
      return;
    }

    const novaAvaliacao: Comentario = {
      id: Date.now(),
      autor: this.novoNome.trim(),
      avatar: this.novoNome.trim().charAt(0).toUpperCase(),
      estrelas: Number(this.novaNota),
      texto: this.novoTexto.trim(),
      data: new Date().toLocaleDateString('pt-BR'),
      likes: 0,
      dislikes: 0,
    };

    this.listaComentarios.unshift(novaAvaliacao);
    this.salvarAvaliacoes();
    this.fecharModal();
    this.exibirToast('⭐ Sua avaliação foi publicada!');
  }

  darLike(c: Comentario): void {
    if (c.votouLike) {
      c.likes--;
      c.votouLike = false;
    } else {
      c.likes++;
      if (c.votouDislike) {
        c.dislikes--;
        c.votouDislike = false;
      }
      c.votouLike = true;
    }
    this.salvarAvaliacoes();
  }

  darDislike(c: Comentario): void {
    if (c.votouDislike) {
      c.dislikes--;
      c.votouDislike = false;
    } else {
      c.dislikes++;
      if (c.votouLike) {
        c.likes--;
        c.votouLike = false;
      }
      c.votouDislike = true;
    }
    this.salvarAvaliacoes();
  }

  getEstrelasTexto(num: number): string {
    return '★'.repeat(num) + '☆'.repeat(5 - num);
  }

  private exibirToast(mensagem: string): void {
    this.mensagemToast = mensagem;
    this.cdr.markForCheck();

    setTimeout(() => {
      this.mensagemToast = null;
      this.cdr.markForCheck();
    }, 3000);
  }
}