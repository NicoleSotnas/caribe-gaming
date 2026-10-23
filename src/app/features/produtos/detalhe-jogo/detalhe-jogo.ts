import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { JogosApiService } from '../../../core/services/jogos-api.service';
import { CarrinhoFacade } from '../../../core/facades/carrinho.facade';
import { FavoritosService } from '../../../core/services/favoritos.service';
import { DetalhesJogo, Comentario, JogoCard, Dlc } from '../../../core/models/jogo';
import { LoaderBarco } from '../carregamento/cacrregamento-barco';
import { comentariosDoJogo } from '../comentarios';

@Component({
  selector: 'app-detalhe-jogo',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderBarco],
  templateUrl: './detalhe-jogo.html',
  styleUrls: ['./detalhe-jogo.css']
})
export class DetalheJogo implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private cdr = inject(ChangeDetectorRef);
  private jogosApi = inject(JogosApiService);
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
  precoOriginalFormatado: string = '';
  precoFormatado: string = '';
  precoNumero: number = 0;
  desconto: number = 0;
  genero: string = '';

  // Nota da Steam
  notaSteam: string = '—';
  notaSteamNum: number = 0;
  totalSteam: number = 0;
  requisitosMinimos: string = '';
  requisitosRecomendados: string = '';

  // Seções extras
  recomendados: JogoCard[] = [];
  dlcs: Dlc[] = [];

  // Avaliações do site
  exibirModalAvaliacao: boolean = false;
  novoNome: string = '';
  novoTexto: string = '';
  novaNota: number = 5;
  listaComentarios: Comentario[] = [];
  totalSite: number = 0;
  mediaSite: string = '—';
  mediaSiteNum: number = 0;
  distribuicao: { estrelas: number; qtd: number; pct: number }[] = [];
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
    this.jogo = null;
    this.galeriaImagens = [];
    this.indiceAtivo = 0;
    this.precoOriginalFormatado = '';
    this.precoFormatado = '';
    this.precoNumero = 0;
    this.desconto = 0;
    this.notaSteam = '—';
    this.notaSteamNum = 0;
    this.totalSteam = 0;
    this.requisitosMinimos = '';
    this.requisitosRecomendados = '';
    this.recomendados = [];
    this.dlcs = [];
    this.listaComentarios = [];
    this.recalcularResumo();
  }

  private carregarTudo(): void {
    this.favorito = this.favoritosService.ehFavorito(this.jogoIdOuSlug);
    this.jogosApi.obterJogo(this.jogoIdOuSlug).subscribe({
      next: (d) => {
        this.jogo = d;

        // Galeria com a capa na posição 0 recebida do serviço
        this.galeriaImagens = d.imagens ?? [];
        this.indiceAtivo = 0;

        this.genero = d.generos ?? '';
        this.emEstoque = d.estoque ?? true;
        this.desconto = d.preco?.desconto ?? 0;
        this.precoFormatado = d.gratis ? 'Grátis' : (d.preco?.atual ?? 'Indisponível');
        this.precoOriginalFormatado = d.preco?.original ?? '';
        this.precoNumero = d.gratis ? 0 : (d.preco?.valor ?? 0);
        this.notaSteam = d.avaliacao?.nota ?? '—';
        this.notaSteamNum = d.avaliacao ? Number(d.avaliacao.nota) : 0;
        this.totalSteam = d.avaliacao?.total ?? 0;
        this.requisitosMinimos = d.requisitos?.minimos ?? '';
        this.requisitosRecomendados = d.requisitos?.recomendados ?? '';
        this.carregando = false;
        this.carregarAvaliacoes();
        this.carregarRecomendados(d);
        this.carregarDlcs(d);
        this.cdr.markForCheck();
      },
      error: () => {
        this.erro = true;
        this.carregando = false;
        this.cdr.markForCheck();
      }
    });
  }

  private carregarRecomendados(d: DetalhesJogo): void {
    const idAtual = Number(d.id);
    this.jogosApi.listar().pipe(take(1)).subscribe((lista) => {
      const atual = lista.find((j) => j.id === idAtual);
      const cats = new Set(atual?.categorias ?? []);
      const gens = new Set(atual?.generos ?? []);
      this.recomendados = lista
        .filter((j) => j.id !== idAtual)
        .map((j) => ({
          j,
          pontos:
            j.categorias.filter((c) => cats.has(c)).length * 2 +
            j.generos.filter((g) => gens.has(g)).length
        }))
        .sort((a, b) => b.pontos - a.pontos)
        .slice(0, 6)
        .map((x) => x.j);
      this.cdr.markForCheck();
    });
  }

  private carregarDlcs(d: DetalhesJogo): void {
    if (!d.dlcIds?.length) return;
    this.jogosApi.obterDlcs(Number(d.id), d.dlcIds).subscribe((lista) => {
      if (this.jogoIdOuSlug !== String(d.id)) return;
      this.dlcs = lista;
      this.cdr.markForCheck();
    });
  }

  abrirJogo(id: number): void {
    this.router.navigate(['/produto', id]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  adicionarDlcAoCarrinho(dlc: Dlc): void {
    if (!dlc.preco) return;
    this.carrinhoFacade.adicionarProduto({
      id: dlc.id,
      nome: dlc.nome,
      preco: dlc.preco.valor,
      quantidade: 1,
      imagemUrl: dlc.imagem,
      plataforma: this.jogo?.plataformas || 'PC',
      categoria: 'DLC / Expansão'
    });
    this.exibirToast('🔑 Expansão adicionada ao carrinho!');
  }

  rastrearRec(_i: number, j: JogoCard): number { return j.id; }
  rastrearBarra(_i: number, b: { estrelas: number }): number { return b.estrelas; }

  tratarErroImagem(event: Event): void {
    const imgElem = event.target as HTMLImageElement;
    if (this.jogo?.background_image && imgElem.src !== this.jogo.background_image) {
      imgElem.src = this.jogo.background_image;
    }
  }

  private nivelClassificacao(valor?: string): string {
    if (!valor) return 'L';
    const v = valor.toLowerCase().trim();
    const n = parseInt(v.replace(/\D/g, ''), 10);
    if (!isNaN(n)) {
      if (n >= 18) return '18';
      if (n >= 16) return '16';
      if (n >= 14) return '14';
      if (n >= 12) return '12';
      if (n >= 10) return '10';
      return 'L';
    }
    if (v.includes('mature') || v.includes('adults')) return '18';
    if (v.includes('teen')) return '14';
    return 'L';
  }

  formatarClassificacao(classificacao?: string): string {
    return this.nivelClassificacao(classificacao);
  }

  obterClasseClassificacao(classificacao?: string): string {
    switch (this.nivelClassificacao(classificacao)) {
      case '18': return 'dezoito';
      case '16': return 'dezesseis';
      case '14': return 'quatorze';
      case '12': return 'doze';
      case '10': return 'dez';
      default: return 'livre';
    }
  }

  formatarMilhar(n: number): string {
    return n.toLocaleString('pt-BR');
  }

  resumoLista(texto: string | undefined, max = 1): string {
    const itens = (texto ?? '').split(',').map((s) => s.trim()).filter(Boolean);
    if (itens.length <= max) return itens.join(', ');
    return `${itens.slice(0, max).join(', ')} +${itens.length - max}`;
  }

  getEstrelasTexto(n: number): string {
    const r = Math.max(0, Math.min(5, Math.round(n)));
    return '★'.repeat(r) + '☆'.repeat(5 - r);
  }

  private get chaveAvaliacoes(): string { return `caribe_avaliacoes_v2_${this.jogoIdOuSlug}`; }

  private comentariosPadrao(): Comentario[] {
    if (!this.jogo) return [];
    const primeiroGenero = (this.jogo.generos ?? '').split(',')[0]?.trim() ?? '';
    return comentariosDoJogo(Number(this.jogo.id), this.jogo.nome, primeiroGenero);
  }

  carregarAvaliacoes(): void {
    try {
      const salvas = localStorage.getItem(this.chaveAvaliacoes);
      this.listaComentarios = salvas ? JSON.parse(salvas) : this.comentariosPadrao();
    } catch {
      this.listaComentarios = this.comentariosPadrao();
    }
    this.recalcularResumo();
  }

  salvarAvaliacoes(): void {
    try {
      localStorage.setItem(this.chaveAvaliacoes, JSON.stringify(this.listaComentarios));
    } catch {}
  }

  private recalcularResumo(): void {
    const total = this.listaComentarios.length;
    const soma = this.listaComentarios.reduce((acc, c) => acc + c.estrelas, 0);
    this.totalSite = total;
    this.mediaSiteNum = total ? soma / total : 0;
    this.mediaSite = total ? this.mediaSiteNum.toFixed(1) : '—';
    this.distribuicao = [5, 4, 3, 2, 1].map((estrelas) => {
      const qtd = this.listaComentarios.filter((c) => c.estrelas === estrelas).length;
      return { estrelas, qtd, pct: total ? (qtd / total) * 100 : 0 };
    });
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
    this.recalcularResumo();
    this.fecharModal();
    this.exibirToast('⭐ Sua avaliação foi publicada com sucesso!');
  }

  voltarPagina(): void { this.location.back(); }
  irParaHome(): void { this.router.navigate(['/']); }
  irParaJogos(): void { this.router.navigate(['/jogos']); }

  proximaFoto(): void {
    if (!this.galeriaImagens.length) return;
    this.indiceAtivo = (this.indiceAtivo + 1) % this.galeriaImagens.length;
  }

  fotoAnterior(): void {
    if (!this.galeriaImagens.length) return;
    this.indiceAtivo = (this.indiceAtivo - 1 + this.galeriaImagens.length) % this.galeriaImagens.length;
  }

  selecionarIndice(i: number): void { this.indiceAtivo = i; }

  adicionarAoCarrinho(): void {
    if (!this.jogo || !this.emEstoque) return;
    this.carrinhoFacade.adicionarProduto({
      id: Number(this.jogo.id) || Date.now(),
      nome: this.jogo.nome,
      preco: this.precoNumero,
      quantidade: 1,
      imagemUrl: this.galeriaImagens[0] || this.jogo.background_image || '',
      plataforma: this.jogo.plataformas || 'PC',
      categoria: this.genero
    });
    this.exibirToast('Adicionado ao carrinho!');
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

  private exibirToast(msg: string): void {
    this.mensagemToast = msg;
    this.cdr.markForCheck();
    setTimeout(() => { this.mensagemToast = null; this.cdr.markForCheck(); }, 3000);
  }
}