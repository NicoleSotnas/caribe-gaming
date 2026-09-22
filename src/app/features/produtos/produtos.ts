import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProdutosService } from '../../core/services/produtos.service';
import { CarrinhoFacade } from '../../core/facades/carrinho.facade';
import { FavoritosService } from '../../core/services/favoritos.service';
import { Produto } from '../../core/models/jogo';

export interface CategoriaItem {
  id: string;
  nome: string;
  icone: string;
}

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produtos.html',
  styleUrls: ['./produtos.css']
})
export class Produtos implements OnInit {
  private produtosService = inject(ProdutosService);
  private carrinhoFacade = inject(CarrinhoFacade);
  private favoritosService = inject(FavoritosService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  produtos: Produto[] = [];
  produtosExibidos: Produto[] = [];

  // Estados de Abas e Filtros
  abaAtiva: 'todos' | 'favoritos' = 'todos';
  faixaPrecoAtiva: string = 'todos';
  plataformasSelecionadas: string[] = [];

  // Dropdown e Categoria
  menuCategoriasAberto: boolean = false;
  categoriaAtiva: string | null = null;
  mensagemToast: string | null = null;

  readonly categorias: CategoriaItem[] = [
    { id: 'acao', nome: 'Ação', icone: '⚔️' },
    { id: 'rpg', nome: 'RPG', icone: '🛡️' },
    { id: 'aventura', nome: 'Aventura', icone: '🧭' },
    { id: 'fps', nome: 'FPS / Tiro', icone: '🎯' },
    { id: 'simulacao', nome: 'Simulação', icone: '🚗' },
    { id: 'esportes', nome: 'Esportes', icone: '⚽' }
  ];

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.produtosService.obterProdutos().subscribe({
      next: (dados) => {
        this.produtos = dados.map(p => ({
          ...p,
          favorito: this.favoritosService.ehFavorito(p.id)
        }));
        this.aplicarFiltros();
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Erro ao carregar lista de jogos:', err)
    });
  }

  get quantidadeFavoritos(): number {
    return this.favoritosService.obterFavoritos().length;
  }

  // --- LÓGICA DE FILTRAGEM ---
  aplicarFiltros(): void {
    let resultado = [...this.produtos];

    // Atualiza o estado de favorito de cada item com o FavoritosService
    resultado = resultado.map(p => ({
      ...p,
      favorito: this.favoritosService.ehFavorito(p.id)
    }));

    // 1. Aba de Favoritos
    if (this.abaAtiva === 'favoritos') {
      resultado = resultado.filter(p => p.favorito);
    }

    // 2. Filtro de Categorias
    if (this.categoriaAtiva) {
      resultado = resultado.filter(p =>
        p.categorias?.includes(this.categoriaAtiva!) ||
        p.genero.toLowerCase().includes(this.categoriaAtiva!.toLowerCase())
      );
    }

    // 3. Filtro de Faixa de Preço
    if (this.faixaPrecoAtiva === 'gratis') {
      resultado = resultado.filter(p => p.precoPromocional === 'R$ 0,00' || p.precoOriginal === 'Gratuito');
    } else if (this.faixaPrecoAtiva === '0-50') {
      resultado = resultado.filter(p => {
        const val = this.extrairValorPreco(p.precoPromocional);
        return val > 0 && val <= 50;
      });
    } else if (this.faixaPrecoAtiva === '50-100') {
      resultado = resultado.filter(p => {
        const val = this.extrairValorPreco(p.precoPromocional);
        return val > 50 && val <= 100;
      });
    } else if (this.faixaPrecoAtiva === 'acima-100') {
      resultado = resultado.filter(p => this.extrairValorPreco(p.precoPromocional) > 100);
    }

    // 4. Filtro por Plataforma
    if (this.plataformasSelecionadas.length > 0) {
      resultado = resultado.filter(p =>
        this.plataformasSelecionadas.some(plat => p.plataforma.toLowerCase().includes(plat.toLowerCase()))
      );
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

  // --- NAVEGAÇÃO E AÇÕES DE E-COMMERCE ---
  irParaPaginaDoJogo(produto: Produto): void {
    this.router.navigate(['/produto', produto.slug || produto.id]);
  }

  adicionarAoCarrinho(produto: Produto): void {
    this.carrinhoFacade.adicionarProduto({
      id: Number(produto.id) || Date.now(),
      nome: produto.nome,
      preco: this.extrairValorPreco(produto.precoPromocional),
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

  private extrairValorPreco(precoStr: string): number {
    if (!precoStr || precoStr === 'Gratuito' || precoStr === 'R$ 0,00') return 0;
    const limpo = precoStr.replace('R$', '').replace('.', '').replace(',', '.').trim();
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