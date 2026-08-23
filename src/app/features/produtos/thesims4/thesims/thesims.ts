import { Component, OnInit, inject, ChangeDetectorRef, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RawgService, DetalhesJogo } from '../../../../core/services/rawg.service';
import { CarrinhoFacade } from '../../../../core/facades/carrinho.facade';
import { FavoritosService } from '../../../../core/services/favoritos.service';

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

const CHAVE_CACHE = 'sims4_dados_completos';
const CHAVE_AVALIACOES = 'sims4_avaliacoes_lista';

@Component({
  selector: 'app-thesims4',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './thesims.html',
  styleUrl: './thesims.css',
})
export class TheSims implements OnInit {
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
      autor: 'BellaGoth_Lover',
      avatar: 'B',
      estrelas: 5,
      texto:
        'O modo construção desse jogo é simplesmente viciante! Passo horas construindo mansões e criando famílias criativas.',
      data: '19/08/2026',
      likes: 320,
      dislikes: 4,
    },
    {
      id: 2,
      autor: 'PlumbobBuilder',
      avatar: 'P',
      estrelas: 5,
      texto:
        'Mesmo com os anos, continua sendo um simulador incrível de vida. Os pacotes de expansão trazem muita variedade.',
      data: '17/08/2026',
      likes: 178,
      dislikes: 2,
    },
  ];

  readonly ID_PRODUTO = '1';
  readonly precoJogo = 0.0;
  readonly precoFormatado = 'Gratuito';

  private cdr = inject(ChangeDetectorRef);
  private rawgService = inject(RawgService);
  private router = inject(Router);
  private carrinhoFacade = inject(CarrinhoFacade);
  private favoritosService = inject(FavoritosService);

  private jogoSlug = 'the-sims-4';
  private steamAppId = '1222670';

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

  irParaExpansoes(): void {
    this.router.navigate(['/jogos/the-sims-4/expansoes']);
  }

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
      plataforma: this.jogo.plataformas || 'PC / PS4 / Xbox One',
      categoria: 'Simulação, Casual',
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
      genero: 'Simulação',
      plataforma: this.jogo.plataformas || 'PC / PS4 / Xbox One',
      categorias: ['simulacao', 'casual'],
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
          descricao: `Liberte sua imaginação e crie um mundo único de Sims totalmente personalizados, com aparências expressivas, personalidades marcantes e aspirações profundas. Em The Sims 4, você tem o poder de construir e projetar casas detalhadas para eles, guiar suas carreiras profissionais, gerenciar relacionamentos complexos e explorar histórias ricas cheias de comédia, drama e momentos inusitados. Sem regras rígidas, o jogo oferece total liberdade para você decidir como seus Sims vão viver, amar, fracassar e prosperar no dia a dia.`,
          dataLancamento: res.released ? res.released.split('-').reverse().join('/') : '02/09/2014',
          desenvolvedoras: res.developers?.[0]?.name || 'Electronic Arts',
          distribuidoras: res.publishers?.[0]?.name || 'Electronic Arts',
          classificacaoEtaria: '12+',
          plataformas:
            res.platforms?.map((p: any) => p.platform.name).join(' / ') || 'PC / PS4 / Xbox One',
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
