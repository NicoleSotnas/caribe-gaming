import { Component, OnInit, inject, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProdutosService } from '../../core/services/produtos.service';
import { CarrinhoFacade } from '../../core/facades/carrinho.facade';
import { FavoritosService } from '../../core/services/favoritos.service';
import { Produto } from '../../core/models/jogo';
import { PlataformaIcones } from '../../shared/console/console-icones';

export interface CategoriaItem {
  id: string;
  nome: string;
  icone: string;
}

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule, PlataformaIcones],
  templateUrl: './produtos.html',
  styleUrls: ['./produtos.css']
})
export class Produtos implements OnInit {
  private produtosService = inject(ProdutosService);
  private carrinhoFacade = inject(CarrinhoFacade);
  private favoritosService = inject(FavoritosService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  produtos: Produto[] = [];
  produtosExibidos: Produto[] = [];

  // Estados de Abas e Filtros
  abaAtiva: 'todos' | 'favoritos' = 'todos';
  faixaPrecoAtiva: string = 'todos';
  plataformasSelecionadas: string[] = [];
  apenasPromocao: boolean = false;
  ordenacao: string = 'relevancia';

  // Dropdown e Categoria
  menuCategoriasAberto: boolean = false;
  categoriaAtiva: string | null = null;
  mensagemToast: string | null = null;

  readonly faixasPreco = [
    { id: 'todos', nome: 'Todos' },
    { id: 'gratis', nome: 'Grátis' },
    { id: '0-50', nome: 'Até R$50' },
    { id: '50-100', nome: 'R$50 – R$100' },
    { id: 'acima-100', nome: 'Acima de R$100' }
  ];

  // "id" precisa ser igual ao usado em CATALOGO.plataformas
  readonly plataformasFiltro = [
    { id: 'PC', nome: 'PC', icone: 'fa-brands fa-windows' },
    { id: 'PS', nome: 'PlayStation', icone: 'fa-brands fa-playstation' },
    { id: 'Xbox', nome: 'Xbox', icone: 'fa-brands fa-xbox' },
    { id: 'Switch', nome: 'Switch', icone: 'fa-brands fa-nintendo-switch' }
  ];

  readonly opcoesOrdenacao = [
    { id: 'relevancia', nome: 'Relevância' },
    { id: 'menor-preco', nome: 'Menor preço' },
    { id: 'maior-preco', nome: 'Maior preço' },
    { id: 'maior-desconto', nome: 'Maior desconto' },
    { id: 'az', nome: 'A – Z' }
  ];

  // "id" precisa ser igual aos slugs de CATALOGO.categorias
  readonly categorias: CategoriaItem[] = [
    { id: 'action', nome: 'Ação', icone: '⚔️' },
    { id: 'role-playing-rpg', nome: 'RPG', icone: '🛡️' },
    { id: 'adventure', nome: 'Aventura', icone: '🧭' },
    { id: 'shooter', nome: 'FPS / Tiro', icone: '🎯' },
    { id: 'simulator', nome: 'Simulação', icone: '🚗' },
    { id: 'sport', nome: 'Esportes', icone: '⚽' },
    { id: 'racing', nome: 'Corrida', icone: '🏁' },
    { id: 'indie', nome: 'Indie', icone: '🎨' }
  ];

  ngOnInit(): void {
    this.carregarProdutos();
  }

  // A lista chega de novo a cada 5 min (preços atualizados na Steam).
  // Os filtros ficam guardados aqui no componente, então são reaplicados a cada chegada.
  carregarProdutos(): void {
    this.produtosService
      .obterProdutos()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (dados) => {
          this.produtos = dados;
          this.aplicarFiltros();
        },
        error: (err) => console.error('Erro ao carregar lista de jogos:', err)
      });
  }

  get quantidadeFavoritos(): number {
    return this.favoritosService.obterFavoritos().length;
  }

  get filtrosAtivos(): number {
    return (
      (this.faixaPrecoAtiva !== 'todos' ? 1 : 0) +
      this.plataformasSelecionadas.length +
      (this.apenasPromocao ? 1 : 0) +
      (this.categoriaAtiva ? 1 : 0)
    );
  }

  // --- LÓGICA DE FILTRAGEM ---
  aplicarFiltros(): void {
    let resultado = this.produtos.map(p => ({
      ...p,
      favorito: this.favoritosService.ehFavorito(p.id)
    }));

    // 1. Aba de Favoritos
    if (this.abaAtiva === 'favoritos') {
      resultado = resultado.filter(p => p.favorito);
    }

    // 2. Categoria
    if (this.categoriaAtiva) {
      const cat = this.categoriaAtiva;
      resultado = resultado.filter(p => p.categorias?.includes(cat));
    }

    // 3. Só em promoção
    if (this.apenasPromocao) {
      resultado = resultado.filter(p => this.temDesconto(p.desconto));
    }

    // 4. Faixa de preço
    switch (this.faixaPrecoAtiva) {
      case 'gratis':
        resultado = resultado.filter(p => this.ehGratis(p));
        break;
      case '0-50':
        resultado = resultado.filter(p => this.temPreco(p) && this.valorPreco(p) <= 50);
        break;
      case '50-100':
        resultado = resultado.filter(p => this.temPreco(p) && this.valorPreco(p) > 50 && this.valorPreco(p) <= 100);
        break;
      case 'acima-100':
        resultado = resultado.filter(p => this.temPreco(p) && this.valorPreco(p) > 100);
        break;
    }

    // 5. Plataforma (basta ter uma das selecionadas)
    if (this.plataformasSelecionadas.length > 0) {
      resultado = resultado.filter(p => {
        const lista = p.plataforma.split('/').map(x => x.trim());
        return this.plataformasSelecionadas.some(sel => lista.includes(sel));
      });
    }

    // 6. Ordenação
    switch (this.ordenacao) {
      case 'menor-preco':
        resultado.sort((a, b) => this.valorParaOrdenar(a, true) - this.valorParaOrdenar(b, true));
        break;
      case 'maior-preco':
        resultado.sort((a, b) => this.valorParaOrdenar(b, false) - this.valorParaOrdenar(a, false));
        break;
      case 'maior-desconto':
        resultado.sort((a, b) => this.descontoNumero(b.desconto) - this.descontoNumero(a.desconto));
        break;
      case 'az':
        resultado.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
        break;
    }

    this.produtosExibidos = resultado;
    this.cdr.markForCheck();
  }

  // --- MÉTODOS DISPARADOS PELO HTML ---
  definirFaixaPreco(faixa: string): void {
    this.faixaPrecoAtiva = faixa;
    this.aplicarFiltros();
  }

  togglePlataforma(plataforma: string): void {
    const idx = this.plataformasSelecionadas.indexOf(plataforma);
    if (idx >= 0) {
      this.plataformasSelecionadas.splice(idx, 1);
    } else {
      this.plataformasSelecionadas.push(plataforma);
    }
    this.aplicarFiltros();
  }

  limparFiltros(): void {
    this.faixaPrecoAtiva = 'todos';
    this.plataformasSelecionadas = [];
    this.apenasPromocao = false;
    this.categoriaAtiva = null;
    this.aplicarFiltros();
  }

  selecionarAba(aba: 'todos' | 'favoritos'): void {
    this.abaAtiva = aba;
    this.aplicarFiltros();
  }

  toggleMenuCategorias(): void {
    this.menuCategoriasAberto = !this.menuCategoriasAberto;
  }

  selecionarCategoria(catId: string): void {
    this.categoriaAtiva = catId ? catId : null;
    this.menuCategoriasAberto = false;
    this.aplicarFiltros();
  }

  obterNomeCategoriaAtiva(): string {
    if (!this.categoriaAtiva) return '🏝️ Categorias';
    const cat = this.categorias.find(c => c.id === this.categoriaAtiva);
    return cat ? `${cat.icone} ${cat.nome}` : '🏝️ Categorias';
  }

  rastrear(_indice: number, produto: Produto): string {
    return produto.id;
  }

  // Se a capa vertical não existir na Steam, usa a imagem horizontal do mesmo jogo
  imagemFalhou(event: Event, produto: Produto): void {
    const img = event.target as HTMLImageElement;
    if (!img.src.endsWith('/header.jpg')) {
      img.src = `https://cdn.cloudflare.steamstatic.com/steam/apps/${produto.id}/header.jpg`;
    }
  }

  // --- NAVEGAÇÃO E AÇÕES DE E-COMMERCE ---
  irParaPaginaDoJogo(produto: Produto): void {
    this.router.navigate(['/produto', produto.id]);
  }

  adicionarAoCarrinho(produto: Produto): void {
    if (produto.estoque === false) {
      this.exibirToast('😕 Jogo esgotado no momento');
      return;
    }
    if (this.estaIndisponivel(produto)) {
      this.exibirToast('😕 Preço indisponível no momento');
      return;
    }

    this.carrinhoFacade.adicionarProduto({
      id: Number(produto.id) || Date.now(),
      nome: produto.nome,
      preco: this.valorPreco(produto),
      quantidade: 1,
      imagemUrl: produto.imagem || '',
      plataforma: produto.plataforma,
      categoria: produto.genero
    });
    this.exibirToast('🛒 Adicionado ao carrinho com sucesso!');
  }

  toggleFavorito(produto: Produto): void {
    this.favoritosService.toggleFavorito(produto);
    produto.favorito = !produto.favorito;

    this.exibirToast(
      produto.favorito ? '❤️ Salvo nos favoritos!' : '💔 Removido dos favoritos!'
    );

    this.aplicarFiltros();
  }

  limparFavoritos(): void {
    this.favoritosService.limparTodosFavoritos();
    this.produtos.forEach(p => p.favorito = false);
    this.aplicarFiltros();
    this.exibirToast('🗑️ Favoritos limpos com sucesso!');
  }

  // --- AUXILIARES DE PREÇO ---
  descontoNumero(desconto: number | string | undefined): number {
    if (!desconto) return 0;
    if (typeof desconto === 'number') return desconto;
    return parseFloat(desconto.replace(/[^0-9.]/g, '')) || 0;
  }

  temDesconto(desconto: number | string | undefined): boolean {
    return this.descontoNumero(desconto) > 0;
  }

  textoDesconto(desconto: number | string | undefined): string {
    return `-${this.descontoNumero(desconto)}%`;
  }

  ehGratis(p: Produto): boolean {
    return p.precoPromocional === 'Grátis';
  }

  estaIndisponivel(p: Produto): boolean {
    return p.precoPromocional === 'Indisponível';
  }

  // tem um preço real maior que zero
  private temPreco(p: Produto): boolean {
    return !this.ehGratis(p) && !this.estaIndisponivel(p) && this.valorPreco(p) > 0;
  }

  private valorPreco(p: Produto): number {
    return p.precoNumero ?? this.extrairValorPreco(p.precoPromocional);
  }

  // jogos sem preço vão sempre para o fim da lista
  private valorParaOrdenar(p: Produto, crescente: boolean): number {
    if (this.estaIndisponivel(p)) return crescente ? Number.MAX_SAFE_INTEGER : -1;
    return this.valorPreco(p);
  }

  private extrairValorPreco(precoStr: string): number {
    if (!precoStr) return 0;
    const limpo = precoStr.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
    return parseFloat(limpo) || 0;
  }

  private exibirToast(msg: string): void {
    this.mensagemToast = msg;
    this.cdr.markForCheck();
    setTimeout(() => {
      this.mensagemToast = null;
      this.cdr.markForCheck();
    }, 3000);
  }
}