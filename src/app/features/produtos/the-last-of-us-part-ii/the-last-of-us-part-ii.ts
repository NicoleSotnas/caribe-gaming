import { Component, OnInit, inject, ChangeDetectorRef, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RawgService,DetalhesJogo } from '../../../core/services/rawg.service';
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

const CHAVE_CACHE = 'tlou2_dados_completos';
const CHAVE_AVALIACOES = 'tlou2_avaliacoes_lista';

@Component({
  selector: 'app-the-last-of-us-ii',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './the-last-of-us-part-ii.html',
  styleUrl: './the-last-of-us-part-ii.css',
})
export class TheLastOfUsPartii implements OnInit {
  jogo: DetalhesJogo | null = null;
  carregando: boolean = true;
  erro: boolean = false;

  galeriaImagens: string[] = [];
  indiceAtivo: number = 0;
  favorito: boolean = false;
  mensagemToast: string | null = null;

  exibirModalAvaliacao: boolean = false;
  novoNome: string = '';
  novoTexto: string = '';
  novaNota: number = 5;

  private location = inject(Location);

  voltarPagina(): void {
    this.location.back();
  }

  listaComentarios: Comentario[] = [
    {
      id: 1,
      autor: 'EllieW_BR',
      avatar: 'E',
      estrelas: 5,
      texto: 'Uma das narrativas mais intensas e maduras já feitas em um jogo. Emocionalmente devastador do início ao fim.',
      data: '20/06/2026',
      likes: 298,
      dislikes: 4,
    },
    {
      id: 2,
      autor: 'JoelFan_BR',
      avatar: 'J',
      estrelas: 5,
      texto: 'Gameplay refinadíssimo e uma história corajosa que não tem medo de te fazer desconfortável. Obra-prima da Naughty Dog.',
      data: '17/06/2026',
      likes: 176,
      dislikes: 3,
    },
  ];

  readonly ID_PRODUTO = '20';
  readonly precoJogo = 249.90;
  readonly precoFormatado = 'R$ 249,90';

  private cdr = inject(ChangeDetectorRef);
  private rawgService = inject(RawgService);
  private router = inject(Router);
  private carrinhoFacade = inject(CarrinhoFacade);
  private favoritosService = inject(FavoritosService);

  private jogoSlug = 'the-last-of-us-part-ii-remastered';
  private steamAppId = '2531310';

  constructor() {
    this.carregarDoCache();

    afterNextRender(() => {
      this.favorito = this.favoritosService.ehFavorito(this.ID_PRODUTO);
      this.carregarAvaliacoes();

      if (!this.jogo || this.galeriaImagens.length === 0) {
        this.carregarDadosDoJogo();
      } else {
        this.carregando = false;
      }
    });
  }

  ngOnInit(): void {}

  carregarAvaliacoes(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        const salvas = localStorage.getItem(CHAVE_AVALIACOES);
        if (salvas) {
          this.listaComentarios = JSON.parse(salvas);
        }
      }
    } catch {}
  }

  salvarAvaliacoes(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(CHAVE_AVALIACOES, JSON.stringify(this.listaComentarios));
      }
    } catch {}
  }

  abrirModal(): void {
    this.exibirModalAvaliacao = true;
  }

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

    const hoje = new Date();
    const dataFormatada = hoje.toLocaleDateString('pt-BR');

    const novaAvaliacao: Comentario = {
      id: Date.now(),
      autor: this.novoNome.trim(),
      avatar: this.novoNome.trim().charAt(0).toUpperCase(),
      estrelas: Number(this.novaNota),
      texto: this.novoTexto.trim(),
      data: dataFormatada,
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

  adicionarAoCarrinho(): void {
    if (!this.jogo) return;

    this.carrinhoFacade.adicionarProduto({
      id: Number(this.ID_PRODUTO),
      nome: this.jogo.nome,
      preco: this.precoJogo,
      quantidade: 1,
      imagemUrl: this.galeriaImagens[0] || this.jogo.background_image || '',
      plataforma: this.jogo.plataformas || 'PC / PS5',
      categoria: 'Ação, Sobrevivência',
    });

    this.exibirToast('🛒 Jogo adicionado ao carrinho!');
  }

  toggleFavorito(): void {
    if (!this.jogo) return;

    this.favorito = !this.favorito;

    this.favoritosService.toggleFavorito({
      id: this.ID_PRODUTO,
      nome: this.jogo.nome,
      imagem: this.galeriaImagens[0] || this.jogo.background_image || '',
      imagemPosicao: 'center',
      precoOriginal: this.precoFormatado,
      precoPromocional: this.precoFormatado,
      desconto: 0,
      genero: 'Ação / Sobrevivência',
      plataforma: this.jogo.plataformas || 'PC / PS5',
      categorias: ['aventura', 'acao'],
    });

    const msg = this.favorito ? '❤️ Adicionado aos favoritos!' : '💔 Removido dos favoritos!';
    this.exibirToast(msg);
  }

  comprarAgora(): void {
    this.adicionarAoCarrinho();
    this.router.navigate(['/carrinho']);
  }

  private carregarDadosDoJogo(): void {
    this.rawgService.obterDetalhesJogo(this.jogoSlug).subscribe({
      next: (res: any) => {
        this.jogo = {
          id: res.id,
          nome: 'The Last of Us Part II',
          descricao: `Quatro anos após seus perigosos eventos ao percorrer os Estados Unidos pós-pandêmicos, Ellie e Joel se estabeleceram em Jackson, Wyoming. Vivendo entre uma comunidade de sobreviventes, ambos conseguiram encontrar certa paz apesar do mundo brutal ao seu redor. Um evento violento perturba essa paz e desencadeia uma jornada implacável de Ellie em busca de justiça e acerto de contas contra aqueles que a machucaram. Enquanto ela caça cada um deles com metodicidade, é forçada a confrontar as consequências físicas e emocionais brutais de seus atos.`,
          dataLancamento: res.released ? res.released.split('-').reverse().join('/') : '19/06/2020',
          desenvolvedoras: res.developers?.[0]?.name || 'Naughty Dog',
          distribuidoras: res.publishers?.[0]?.name || 'Sony Interactive Entertainment',
          classificacaoEtaria: '+18',
          plataformas: res.platforms?.map((p: any) => p.platform.name).join(' / ') || 'PC / PlayStation 5',
          background_image: res.background_image,
        };
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao buscar detalhes do jogo:', err);
        this.erro = true;
        this.cdr.markForCheck();
      },
    });

    this.rawgService.obterScreenshots(this.jogoSlug).subscribe({
      next: (res) => {
        const capaSteam = this.steamAppId
          ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${this.steamAppId}/header.jpg`
          : this.jogo?.background_image || '';

        const screenshots = res.results?.length ? res.results.map((item: any) => item.image) : [];

        this.galeriaImagens = capaSteam ? [capaSteam, ...screenshots] : screenshots;
        this.salvarNoCache({ jogo: this.jogo, imagens: this.galeriaImagens });

        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao carregar screenshots:', err);
        const capaSteam = this.steamAppId
          ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${this.steamAppId}/header.jpg`
          : this.jogo?.background_image || '';

        this.galeriaImagens = capaSteam ? [capaSteam] : [];
        this.carregando = false;
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
    this.indiceAtivo = this.indiceAtivo < this.galeriaImagens.length - 1 ? this.indiceAtivo + 1 : 0;
  }

  fotoAnterior(): void {
    if (this.galeriaImagens.length === 0) return;
    this.indiceAtivo = this.indiceAtivo > 0 ? this.indiceAtivo - 1 : this.galeriaImagens.length - 1;
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