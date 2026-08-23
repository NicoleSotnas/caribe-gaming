import { Component, OnInit, inject, ChangeDetectorRef, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
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

const CHAVE_CACHE = 'tlou_part2_dados_completos';
const CHAVE_AVALIACOES = 'tlou_part2_avaliacoes_lista';

@Component({
  selector: 'app-the-last-of-us-part-2',
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

  // Controle de Modal e Formulário de Avaliação
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
      autor: 'EllieRevenge',
      avatar: 'E',
      estrelas: 5,
      texto:
        'Uma obra-prima técnica e de enredo desafiador. As animações de combate, os detalhes dos cenários e a carga emocional tornam a experiência inesquecível!',
      data: '18/05/2026',
      likes: 480,
      dislikes: 5,
    },
    {
      id: 2,
      autor: 'AbbyAnderson',
      avatar: 'A',
      estrelas: 5,
      texto: 'Incrível do começo ao fim. A Naughty Dog conseguiu criar um dos jogos mais intensos e viscerais da história dos videogames.',
      data: '15/05/2026',
      likes: 310,
      dislikes: 4,
    },
  ];

  readonly ID_PRODUTO = '20';
  readonly precoJogo = 124.75;
  readonly precoOriginalFormatado = 'R$ 249,50';
  readonly precoFormatado = 'R$ 124,75';

  private cdr = inject(ChangeDetectorRef);
  private rawgService = inject(RawgService);
  private router = inject(Router);
  private carrinhoFacade = inject(CarrinhoFacade);
  private favoritosService = inject(FavoritosService);

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

  // Gerenciamento das Avaliações
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
      plataforma: this.jogo.plataformas || 'PC / PS5 / PS4',
      categoria: 'Ação, Aventura, Sobrevivência',
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
      precoOriginal: this.precoOriginalFormatado,
      precoPromocional: this.precoFormatado,
      desconto: '-50%',
      genero: 'Ação / Sobrevivência',
      plataforma: this.jogo.plataformas || 'PC / PS5 / PS4',
      categorias: ['aventura'],
    });

    const msg = this.favorito ? '❤️ Adicionado aos favoritos!' : '💔 Removido dos favoritos!';
    this.exibirToast(msg);
  }

  comprarAgora(): void {
    this.adicionarAoCarrinho();
    this.router.navigate(['/carrinho']);
  }

  private carregarDadosDoJogo(): void {
    // Galeria 100% oficial e estável do The Last of Us Part II
    const imagensOficiaisTLOU2 = [
      'https://images.igdb.com/igdb/image/upload/t_1080p/co2f89.jpg', // Capa Ellie
      'https://images.igdb.com/igdb/image/upload/t_1080p/sc85z8.jpg', // Gameplay Seattle
      'https://images.igdb.com/igdb/image/upload/t_1080p/sc85z9.jpg', // Combate Furtivo
      'https://images.igdb.com/igdb/image/upload/t_1080p/sc85z7.jpg', // Ellie no Cavalo
      'https://images.igdb.com/igdb/image/upload/t_1080p/sc85za.jpg', // Cenários
    ];

    this.jogo = {
      id: 20,
      nome: 'The Last of Us Part II',
      descricao: `Cinco anos após sua jornada perigosa pelos Estados Unidos pós-pandêmicos, Ellie e Joel se estabeleceram em Jackson, Wyoming. A convivência em uma comunidade próspera de sobreviventes trouxe paz e estabilidade, apesar da ameaça constante dos infectados e de outros sobreviventes desesperados. Quando um evento violento interrompe essa paz, Ellie embarca em uma jornada incansável em busca de justiça e encerramento. Conforme vai caçando os responsáveis um por um, ela se defronta com as profundas repercussões físicas e emocionais de suas ações.`,
      dataLancamento: '19/06/2020',
      desenvolvedoras: 'Naughty Dog',
      distribuidoras: 'Sony Interactive Entertainment',
      classificacaoEtaria: '+18',
      plataformas: 'PlayStation 5 / PlayStation 4',
      background_image: imagensOficiaisTLOU2[0],
    };

    this.galeriaImagens = imagensOficiaisTLOU2;
    this.carregando = false;
    this.erro = false;

    this.salvarNoCache({ jogo: this.jogo, imagens: this.galeriaImagens });
    this.cdr.markForCheck();
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