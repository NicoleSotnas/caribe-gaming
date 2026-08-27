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

const CHAVE_CACHE = 'yakuza0_dados_completos';
const CHAVE_AVALIACOES = 'yakuza0_avaliacoes_lista';

@Component({
  selector: 'app-yakuza',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './yakuza.html',
  styleUrl: './yakuza.css',
})
export class Yakuza implements OnInit {
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
      autor: 'KazumaKiryu_88',
      avatar: 'K',
      estrelas: 5,
      texto: 'Simplesmente incrível! A história drama de máfia mesclada com minijogos hilários e um combate extremamente satisfatório tornam este jogo inesquecível.',
      data: '22/08/2026',
      likes: 245,
      dislikes: 1,
    },
    {
      id: 2,
      autor: 'MadDogMajima',
      avatar: 'M',
      estrelas: 5,
      texto: 'A introdução perfeita para a franquia Yakuza/Like a Dragon. Trilha sonora absurda e uma ambientação fantástica de Kamurocho e Sotenbori.',
      data: '20/08/2026',
      likes: 198,
      dislikes: 3,
    },
  ];

  readonly ID_PRODUTO = '12';
  readonly precoJogo = 83.50;
  readonly precoFormatado = 'R$ 83,50';

  private cdr = inject(ChangeDetectorRef);
  private rawgService = inject(RawgService);
  private router = inject(Router);
  private carrinhoFacade = inject(CarrinhoFacade);
  private favoritosService = inject(FavoritosService);

  private jogoSlug = 'yakuza-0';
  private steamAppId = '638970';

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
      plataforma: this.jogo.plataformas || 'PC / PS4 / Xbox',
      categoria: 'Ação, Luta, RPG',
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
      genero: 'Ação / Luta',
      plataforma: this.jogo.plataformas || 'PC / PS4 / Xbox',
      categorias: ['acao', 'luta', 'rpg'],
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
          nome: res.name,
          descricao: `Viva a extravagância desenfreada dos anos 80 no Japão com Yakuza 0. Acompanhe a história de origem de Kazuma Kiryu, o futuro Dragão de Dojima, envolvido em uma teia mortal de assassinatos e disputas imobiliárias em Kamurocho, e de Goro Majima, o Cão Raivoso de Shimano, tentando retornar ao clã Yakuza enquanto administra um clube noturno de sucesso em Sotenbori. Alterne entre múltiplos estilos de luta viscerais, explore distritos repletos de vida, karaokês, arcades clássicos da SEGA e uma narrativa épica de submundo criminoso.`,
          dataLancamento: res.released ? res.released.split('-').reverse().join('/') : '12/03/2015',
          desenvolvedoras: res.developers?.[0]?.name || 'Ryu Ga Gotoku Studio / SEGA',
          distribuidoras: res.publishers?.[0]?.name || 'SEGA',
          classificacaoEtaria: '+18',
          plataformas: res.platforms?.map((p: any) => p.platform.name).join(' / ') || 'PC / PlayStation / Xbox',
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