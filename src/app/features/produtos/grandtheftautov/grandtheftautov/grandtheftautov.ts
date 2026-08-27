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

const CHAVE_CACHE = 'gta_dados_completos';
const CHAVE_AVALIACOES = 'gta_avaliacoes_lista';

@Component({
  selector: 'app-grandtheftautov',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grandtheftautov.html',
  styleUrl: './grandtheftautov.css',
})
export class GrandTheftAutoV implements OnInit {
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
      autor: 'TrevorPhilips',
      avatar: 'T',
      estrelas: 5,
      texto: 'O melhor mundo aberto já criado. A liberdade de alternar entre os três personagens é fantástica!',
      data: '22/08/2026',
      likes: 412,
      dislikes: 12,
    },
    {
      id: 2,
      autor: 'FranklinClient',
      avatar: 'F',
      estrelas: 5,
      texto: 'Los Santos continua incrível, gráficos excelentes e missões de assalto muito criativas.',
      data: '20/08/2026',
      likes: 254,
      dislikes: 5,
    },
  ];

  readonly ID_PRODUTO = '2';
  readonly precoJogo = 74.95;
  readonly precoOriginalFormatado = 'R$ 149,90';
  readonly precoFormatado = 'R$ 74,95';

  private cdr = inject(ChangeDetectorRef);
  private rawgService = inject(RawgService);
  private router = inject(Router);
  private carrinhoFacade = inject(CarrinhoFacade);
  private favoritosService = inject(FavoritosService);

  private jogoSlug = 'grand-theft-auto-v';
  private steamAppId = '271590';

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

  // Propriedades computadas e dinâmicas para o painel de avaliações do GTA V
  get totalVotosGeral(): number {
    return 34200 + this.listaComentarios.length;
  }

  getPorcentagemEstrelas(numEstrelas: number): number {
    const total = this.listaComentarios.length;
    if (total === 0) return numEstrelas === 5 ? 82 : 4; 
    
    const filtrados = this.listaComentarios.filter(c => c.estrelas === numEstrelas).length;
    const fatorTempo = Math.floor((Date.now() / (1000 * 60 * 60)) % 24); 
    const dinamico = filtrados + (fatorTempo % 3); 
    
    return Math.min(Math.max(Math.round((dinamico / total) * 100), 2), 95);
  }

  get mediaNotasDinamica(): string {
    if (this.listaComentarios.length === 0) return '4.8';
    const soma = this.listaComentarios.reduce((acc, curr) => acc + curr.estrelas, 4.8 * 34200);
    const media = soma / (34200 + this.listaComentarios.length);
    return media.toFixed(1);
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
      plataforma: this.jogo.plataformas || 'PC / PS5',
      categoria: 'Ação, Mundo Aberto',
    } as any);

    this.exibirToast('🛒 Jogo adicionado ao carrinho!');
  }

  toggleFavorito(): void {
    if (!this.jogo) return;

    this.favorito = !this.favorito;

    this.favoritosService.toggleFavorito({
      id: this.ID_PRODUTO,
      nome: this.jogo.nome,
      imagem: this.galeriaImagens[0] || this.jogo.background_image || '',
      precoOriginal: this.precoOriginalFormatado,
      precoPromocional: this.precoFormatado,
      desconto: '-50%',
      genero: 'Ação / Mundo Aberto',
      plataforma: this.jogo.plataformas || 'PC / PS5',
      categorias: ['acao', 'mundo-aberto'],
      favorito: this.favorito,
    } as any);

    const msg = this.favorito ? '❤️ Adicionado aos favoritos!' : '💔 Removido dos favoritos!';
    this.exibirToast(msg);
  }

  comprarAgora(): void {
    this.adicionarAoCarrinho();
    if (this.precoJogo > 0) {
      this.router.navigate(['/carrinho']);
    }
  }

  private carregarDadosDoJogo(): void {
    this.rawgService.obterDetalhesJogo(this.jogoSlug).subscribe({
      next: (res: any) => {
        this.jogo = {
          id: res.id,
          nome: res.name,
         descricao: `Explore o vasto e vibrante mundo de Los Santos e Blaine County na experiência definitiva de Grand Theft Auto V. Acompanhe a trajetória de três criminosos muito diferentes — Michael, o ex-assaltante em crise familiar; Franklin, o jovem hustler em busca de oportunidades reais; e Trevor, o psicopata imprevisível movido pelo caos. Junte-se a eles em arriscados e espetaculares golpes para sobreviver em uma cidade implacável onde ninguém é confiável, muito menos o governo. Com uma liberdade sem precedentes, alternância instantânea de personagens e uma narrativa repleta de sátira social, este clássico moderno redefine o gênero de mundo aberto.`,
          dataLancamento: res.released ? res.released.split('-').reverse().join('/') : '17/09/2013',
          desenvolvedoras: res.developers?.[0]?.name || 'Rockstar North',
          distribuidoras: res.publishers?.[0]?.name || 'Rockstar Games',
          classificacaoEtaria: '18+',
          plataformas: res.platforms?.map((p: any) => p.platform.name).join(' / ') || 'PC / PS5 / Xbox',
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