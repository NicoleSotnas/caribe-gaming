import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RawgService } from '../../../core/services/rawg.service';
import { CarrinhoFacade } from '../../../core/facades/carrinho.facade';
import { FavoritosService } from '../../../core/services/favoritos.service';
import { DetalhesJogo, Comentario, Produto } from '../../../core/models/jogo';

@Component({
  selector: 'app-detalhe-jogo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalhe-jogo.html',
  styleUrls: ['./detalhe-jogo.css']
})
export class DetalheJogo implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private cdr = inject(ChangeDetectorRef);
  private rawgService = inject(RawgService);
  private carrinhoFacade = inject(CarrinhoFacade);
  private favoritosService = inject(FavoritosService);

  jogo: DetalhesJogo | null = null;
  carregando: boolean = true;
  erro: boolean = false;
  emEstoque: boolean = true;

  jogoIdOuSlug: string = '';
  galeriaImagens: string[] = [];
  indiceAtivo: number = 0;
  favorito: boolean = false;
  mensagemToast: string | null = null;

  precoOriginalFormatado: string = 'R$ 199,90';
  precoFormatado: string = 'R$ 99,95';
  desconto: number = 50;
  genero: string = 'Ação / Aventura';
  notaMetacritic: string = '4.8';
  totalAvaliacoes: number = 2450;

  requisitosMinimos: string = '';
  requisitosRecomendados: string = '';

  exibirModalAvaliacao: boolean = false;
  novoNome: string = '';
  novoTexto: string = '';
  novaNota: number = 5;
  listaComentarios: Comentario[] = [];

  readonly coresAvatares = ['#00d2d3', '#ff9f43', '#ee5253', '#0abde3', '#10ac84', '#5f27cd'];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.jogoIdOuSlug = params.get('id') || '';
      if (this.jogoIdOuSlug) {
        this.resetarEstado();
        this.carregarTudo();
      }
    });
  }

  private resetarEstado(): void {
    this.carregando = true;
    this.erro = false;
    this.galeriaImagens = [];
    this.indiceAtivo = 0;
  }

  private carregarTudo(): void {
    this.favorito = this.favoritosService.ehFavorito(this.jogoIdOuSlug);
    this.emEstoque = this.jogoIdOuSlug !== '15' && this.jogoIdOuSlug !== 'the-last-of-us-part-i';

    this.carregarAvaliacoes();

    this.rawgService.obterDetalhesJogo(this.jogoIdOuSlug).subscribe({
      next: (dados) => {
        this.jogo = dados;
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.erro = true;
        this.carregando = false;
        this.cdr.markForCheck();
      }
    });

    this.rawgService.obterScreenshots(this.jogoIdOuSlug).subscribe({
      next: (res) => {
        if (res.results?.length > 0) {
          this.galeriaImagens = res.results.map((item: any) => item.image);
        }
      }
    });

    this.rawgService.obterGameRaw(this.jogoIdOuSlug).subscribe({
      next: (raw: any) => {
        this.genero = raw.genres?.map((g: any) => g.name).join(', ') || 'Ação';
        this.notaMetacritic = raw.metacritic ? (raw.metacritic / 20).toFixed(1) : '4.8';

        const pcPlatform = raw.platforms?.find((p: any) => p.platform.slug === 'pc');
        if (pcPlatform?.requirements) {
          this.requisitosMinimos = this.formatarRequisitos(pcPlatform.requirements.minimum);
          this.requisitosRecomendados = this.formatarRequisitos(pcPlatform.requirements.recommended);
        }
      }
    });
  }

  // Tratamento automático de erro de imagem (Fallback para RAWG se Steam falhar)
  tratarErroImagem(event: Event): void {
    const imgElem = event.target as HTMLImageElement;
    if (this.jogo?.background_image && imgElem.src !== this.jogo.background_image) {
      imgElem.src = this.jogo.background_image;
    }
  }

  formatarClassificacao(classificacao?: string): string {
    if (!classificacao) return 'Livre';
    const lower = classificacao.toLowerCase();

    if (lower.includes('18') || lower.includes('mature') || lower.includes('adults')) return '+18';
    if (lower.includes('16')) return '+16';
    if (lower.includes('14') || lower.includes('teen')) return '+14';
    if (lower.includes('12')) return '+12';
    if (lower.includes('10') || lower.includes('everyone 10+')) return '+10';

    return 'Livre';
  }

  obterClasseClassificacao(classificacao?: string): string {
    const formatada = this.formatarClassificacao(classificacao);
    switch (formatada) {
      case '+18': return 'dezoito';
      case '+16': return 'dezesseis';
      case '+14': return 'quatorze';
      case '+12': return 'doze';
      case '+10': return 'dez';
      default: return 'livre';
    }
  }

  private formatarRequisitos(req: string): string {
    if (!req) return 'Consulte as especificações recomendadas na Steam.';
    return req
      .replace(/<[^>]*>/g, '')
      .replace(/Minimum:/gi, '')
      .replace(/Recommended:/gi, '')
      .replace(/OS:/gi, 'Sistema Operacional:')
      .replace(/Processor:/gi, 'Processador:')
      .replace(/Memory:/gi, 'Memória:')
      .replace(/Graphics:/gi, 'Placa de Vídeo:')
      .replace(/Storage:/gi, 'Armazenamento:');
  }

  private get chaveAvaliacoes(): string { return `caribe_avaliacoes_${this.jogoIdOuSlug}`; }

  carregarAvaliacoes(): void {
    try {
      const salvas = localStorage.getItem(this.chaveAvaliacoes);
      if (salvas) {
        this.listaComentarios = JSON.parse(salvas);
      } else {
        this.listaComentarios = [
          {
            id: 1,
            autor: 'GeraltDeRivia_BR',
            avatar: 'G',
            corAvatar: '#00d2d3',
            estrelas: 5,
            texto: 'Chave entregue na hora! Funcional e com suporte rápido da Caribe Gaming.',
            data: '18/05/2026',
            likes: 142,
            dislikes: 3
          }
        ];
      }
    } catch {}
  }

  salvarAvaliacoes(): void {
    try {
      localStorage.setItem(this.chaveAvaliacoes, JSON.stringify(this.listaComentarios));
    } catch {}
  }

  enviarAvaliacao(): void {
    if (!this.novoNome.trim() || !this.novoTexto.trim()) return;

    const nova: Comentario = {
      id: Date.now(),
      autor: this.novoNome.trim(),
      avatar: this.novoNome.trim().charAt(0).toUpperCase(),
      corAvatar: this.coresAvatares[Math.floor(Math.random() * this.coresAvatares.length)],
      estrelas: Number(this.novaNota),
      texto: this.novoTexto.trim(),
      data: new Date().toLocaleDateString('pt-BR'),
      likes: 0,
      dislikes: 0
    };

    this.listaComentarios.unshift(nova);
    this.salvarAvaliacoes();
    this.fecharModal();
    this.exibirToast('⭐ Sua avaliação foi publicada com sucesso!');
  }

  voltarPagina(): void { this.location.back(); }
  irParaHome(): void { this.router.navigate(['/']); }
  irParaJogos(): void { this.router.navigate(['/jogos']); }

  proximaFoto(): void { this.indiceAtivo = (this.indiceAtivo + 1) % this.galeriaImagens.length; }
  fotoAnterior(): void { this.indiceAtivo = (this.indiceAtivo - 1 + this.galeriaImagens.length) % this.galeriaImagens.length; }
  selecionarIndice(i: number): void { this.indiceAtivo = i; }

  adicionarAoCarrinho(): void {
    if (!this.jogo || !this.emEstoque) return;
    this.carrinhoFacade.adicionarProduto({
      id: Number(this.jogo.id) || Date.now(),
      nome: this.jogo.nome,
      preco: 99.95,
      quantidade: 1,
      imagemUrl: this.galeriaImagens[0] || this.jogo.background_image || '',
      plataforma: this.jogo.plataformas || 'PC',
      categoria: this.genero
    });
    this.exibirToast('🔑 CD-Key adicionada ao carrinho!');
  }

  comprarAgora(): void {
    if (!this.emEstoque) return;
    this.adicionarAoCarrinho();
    this.router.navigate(['/carrinho']);
  }

  toggleFavorito(): void {
    this.favorito = !this.favorito;
    this.exibirToast(this.favorito ? '❤️ Salvo nos favoritos!' : '💔 Removido dos favoritos!');
  }

  abrirModal(): void { this.exibirModalAvaliacao = true; }
  fecharModal(): void {
    this.exibirModalAvaliacao = false;
    this.novoNome = '';
    this.novoTexto = '';
  }

  darLike(c: Comentario): void { c.likes++; this.salvarAvaliacoes(); }
  darDislike(c: Comentario): void { c.dislikes++; this.salvarAvaliacoes(); }
  getEstrelasTexto(n: number): string { return '★'.repeat(n) + '☆'.repeat(5 - n); }

  private exibirToast(msg: string): void {
    this.mensagemToast = msg;
    this.cdr.markForCheck();
    setTimeout(() => { this.mensagemToast = null; this.cdr.markForCheck(); }, 3000);
  }
}