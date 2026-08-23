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

const CHAVE_CACHE = 'gow_ragnarok_dados_completos';
const CHAVE_AVALIACOES = 'gow_ragnarok_avaliacoes_lista';

@Component({
  selector: 'app-god-of-war-ragnarok',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './god-of-war-ragnarok.html',
  styleUrl: './god-of-war-ragnarok.css',
})
export class GodOfWarRagnarok implements OnInit {
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
      autor: 'AtreusLoki',
      avatar: 'A',
      estrelas: 5,
      texto: 'Uma conclusão monumental para a saga nórdica. A relação entre o Kratos e o Atreus atinge um nível emocional incrível!',
      data: '22/08/2026',
      likes: 210,
      dislikes: 2,
    },
    {
      id: 2,
      autor: 'MimirWisdom',
      avatar: 'M',
      estrelas: 5,
      texto: 'Combate refinado, chefes espetaculares e uma otimização fantástica no PC. Vale cada centavo.',
      data: '20/08/2026',
      likes: 145,
      dislikes: 3,
    },
  ];

  readonly ID_PRODUTO = '8';
  readonly precoJogo = 249.90;
  readonly precoFormatado = 'R$ 249,90';

  private cdr = inject(ChangeDetectorRef);
  private rawgService = inject(RawgService);
  private router = inject(Router);
  private carrinhoFacade = inject(CarrinhoFacade);
  private favoritosService = inject(FavoritosService);

  private jogoSlug = 'god-of-war-ragnarok';
  private steamAppId = '2322010';

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
      categoria: 'Ação, Aventura, RPG',
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
      genero: 'Ação / Aventura',
      plataforma: this.jogo.plataformas || 'PC / PS5',
      categorias: ['acao', 'aventura', 'rpg'],
    });

    const msg = this.favorito ? '❤️ Adicionado aos favoritos!' : '💔 Removido dos favoritos!';
    this.exibirToast(msg);
  }

  comprarAgora(): void {
    this.adicionarAoCarrinho();
    this.router.navigate(['/carrinho']);
  }

  private carregarDadosDoJogo(): void {
    this.jogo = {
      id: 8,
      nome: 'God of War Ragnarök',
      descricao: `Embarque em uma jornada épica e comovente ao lado de Kratos e Atreus enquanto lutam para se segurar e deixar ir. Com o Fimbulwinter em pleno andamento, pai e filho devem viajar por cada um dos Nove Reinos em busca de respostas, enquanto as forças de Asgard se preparam para a batalha profetizada que acabará com o mundo. Explore paisagens míticas deslumbrantes, domine novos elementos de combate e enfrente deuses e monstros nórdicos em uma das narrativas mais marcantes dos videogames.`,
      dataLancamento: '19/09/2024',
      desenvolvedoras: 'Santa Monica Studio / Jetpack Interactive',
      distribuidoras: 'PlayStation Publishing LLC',
      classificacaoEtaria: '+18',
      plataformas: 'PC / PS5',
      background_image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2322010/capsule_616x353.jpg',
    };

    const capaSteam = `https://cdn.cloudflare.steamstatic.com/steam/apps/${this.steamAppId}/capsule_616x353.jpg`;
    this.galeriaImagens = [
      capaSteam,
      'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2322010/ss_1e11361cd35441865415785081b83d81b95603d3.1920x1080.jpg',
      'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2322010/ss_8440535e6c1e30954b04bf62580a5de62a70bf9d.1920x1080.jpg',
      'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2322010/ss_017b2b6348c414902b5db000109968a9b6c0e0b3.1920x1080.jpg'
    ];

    this.salvarNoCache({ jogo: this.jogo, imagens: this.galeriaImagens });
    this.carregando = false;
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

  proximaFoto():void {
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