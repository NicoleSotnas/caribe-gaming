import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ProdutosService, Produto } from '../../../core/services/produtos.service';
import { RawgService } from '../../../core/services/rawg.service';
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

interface InfoEditorial {
  descricao: string;
  dataLancamento: string;
  desenvolvedora: string;
  distribuidora: string;
  classificacaoEtaria: string;
}

@Component({
  selector: 'app-detalhe-jogo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalhe-jogo.html',
  styleUrl: './detalhe-jogo.css',
})
export class DetalheJogo implements OnInit {
  jogo: Produto | null = null;
  info: InfoEditorial | null = null;
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

  listaComentarios: Comentario[] = [];

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private cdr = inject(ChangeDetectorRef);
  private produtosService = inject(ProdutosService);
  private rawgService = inject(RawgService);
  private carrinhoFacade = inject(CarrinhoFacade);
  private favoritosService = inject(FavoritosService);

  private get chaveCache(): string {
    return `jogo_cache_${this.jogo?.id}`;
  }

  private get chaveAvaliacoes(): string {
    return `avaliacoes_jogo_${this.jogo?.id}`;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.data['id'];
    if (!id) {
      this.erro = true;
      this.carregando = false;
      return;
    }

    this.produtosService.obterPorId(id).subscribe({
      next: (produto) => {
        if (!produto) {
          this.erro = true;
          this.carregando = false;
          return;
        }

        this.jogo = produto;
        this.favorito = this.favoritosService.ehFavorito(produto.id);
        this.carregarAvaliacoes();

        if (this.carregarDoCache()) {
          this.carregando = false;
        } else {
          this.buscarDadosRawg(produto);
        }
      },
      error: () => {
        this.erro = true;
        this.carregando = false;
      },
    });
  }

  private buscarDadosRawg(produto: Produto): void {
    this.rawgService.obterDetalhesJogo(produto.slug).subscribe({
      next: (res) => {
        this.info = {
          descricao: res.description_raw || 'Descrição indisponível.',
          dataLancamento: res.released ? res.released.split('-').reverse().join('/') : 'N/A',
          desenvolvedora: res.developers?.[0]?.name || 'N/A',
          distribuidora: res.publishers?.[0]?.name || 'N/A',
          classificacaoEtaria: this.mapearClassificacao(res.esrb_rating?.name),
        };
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao buscar detalhes do jogo:', err);
        this.info = {
          descricao: 'Descrição indisponível no momento.',
          dataLancamento: 'N/A',
          desenvolvedora: 'N/A',
          distribuidora: 'N/A',
          classificacaoEtaria: '12+',
        };
        this.cdr.markForCheck();
      },
    });

    this.rawgService.obterScreenshots(produto.slug).subscribe({
      next: (res) => {
        const capa = produto.steamAppId
          ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${produto.steamAppId}/capsule_616x353.jpg`
          : produto.imagem;

        const screenshots = res.results?.map((item) => item.image) ?? [];
        this.galeriaImagens = [capa, ...screenshots];

        this.salvarNoCache();
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao carregar screenshots:', err);
        this.galeriaImagens = [produto.imagem];
        this.carregando = false;
        this.cdr.markForCheck();
      },
    });
  }

  private mapearClassificacao(nomeEsrb?: string): string {
    const mapa: Record<string, string> = {
      'Everyone': 'L',
      'Everyone 10+': '10+',
      'Teen': '14+',
      'Mature': '18+',
      'Adults Only': '18+',
      'Rating Pending': '12+',
    };
    return mapa[nomeEsrb ?? ''] ?? '12+';
  }

  classificacaoClasse(classificacao: string): string {
    const mapa: Record<string, string> = {
      'L': 'livre',
      '10+': 'dez',
      '12+': 'doze',
      '14+': 'quatorze',
      '16+': 'dezesseis',
      '18+': 'dezoito',
    };
    return mapa[classificacao] ?? 'doze';
  }

  private carregarDoCache(): boolean {
    try {
      if (typeof sessionStorage === 'undefined') return false;
      const cache = sessionStorage.getItem(this.chaveCache);
      if (!cache) return false;

      const dados = JSON.parse(cache);
      this.info = dados.info;
      this.galeriaImagens = dados.imagens;
      return true;
    } catch {
      return false;
    }
  }

  private salvarNoCache(): void {
    try {
      if (typeof sessionStorage === 'undefined') return;
      sessionStorage.setItem(this.chaveCache, JSON.stringify({
        info: this.info,
        imagens: this.galeriaImagens,
      }));
    } catch {}
  }

  voltarPagina(): void {
    this.location.back();
  }

  irParaHome(): void {
    this.router.navigate(['/']);
  }

  irParaJogos(): void {
    this.router.navigate(['/jogos']);
  }

  toggleFavorito(): void {
    if (!this.jogo) return;
    this.favorito = !this.favorito;
    this.favoritosService.toggleFavorito(this.jogo);
    this.exibirToast(this.favorito ? '❤️ Adicionado aos favoritos!' : '💔 Removido dos favoritos!');
  }

  private converterPreco(preco: string): number {
    if (!preco || preco.toLowerCase().includes('grátis')) return 0;
    return Number(preco.replace('R$', '').replace(',', '.').trim());
  }

  adicionarAoCarrinho(): void {
    if (!this.jogo) return;

    const preco = this.converterPreco(this.jogo.precoPromocional);

    if (preco === 0) {
      this.exibirToast('🎉 Jogo obtido com sucesso!');
      return;
    }

    this.carrinhoFacade.adicionarProduto({
      id: Number(this.jogo.id),
      nome: this.jogo.nome,
      preco,
      quantidade: 1,
      imagemUrl: this.jogo.imagem,
      plataforma: this.jogo.plataforma,
      categoria: this.jogo.genero,
    });

    this.exibirToast('🛒 Jogo adicionado ao carrinho!');
  }

  comprarAgora(): void {
    this.adicionarAoCarrinho();
    this.router.navigate(['/carrinho']);
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

  private exibirToast(mensagem: string): void {
    this.mensagemToast = mensagem;
    this.cdr.markForCheck();
    setTimeout(() => {
      this.mensagemToast = null;
      this.cdr.markForCheck();
    }, 3000);
  }

  carregarAvaliacoes(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        const salvas = localStorage.getItem(this.chaveAvaliacoes);
        this.listaComentarios = salvas ? JSON.parse(salvas) : [];
      }
    } catch {
      this.listaComentarios = [];
    }
  }

  salvarAvaliacoes(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.chaveAvaliacoes, JSON.stringify(this.listaComentarios));
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
      if (c.votouDislike) { c.dislikes--; c.votouDislike = false; }
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
      if (c.votouLike) { c.likes--; c.votouLike = false; }
      c.votouDislike = true;
    }
    this.salvarAvaliacoes();
  }

  getEstrelasTexto(num: number): string {
    return '★'.repeat(num) + '☆'.repeat(5 - num);
  }
}