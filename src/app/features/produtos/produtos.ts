import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProdutosService, Produto } from '../../core/services/produtos.service';
import { CarrinhoFacade } from '../../core/facades/carrinho.facade';
import { FavoritosService } from '../../core/services/favoritos.service';

interface ProdutoComFavorito extends Produto {
  favorito: boolean;
}

interface Categoria {
  id: string;
  nome: string;
  icone: string;
  slugsRawg: string[]; // Slugs correspondentes retornados pela RAWG API
}

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './produtos.html',
  styleUrls: ['./produtos.css'],
})
export class Produtos implements OnInit {
  private produtosService = inject(ProdutosService);
  private router = inject(Router);
  private carrinhoFacade = inject(CarrinhoFacade);
  private favoritosService = inject(FavoritosService);
  private cdr = inject(ChangeDetectorRef);

  produtos: ProdutoComFavorito[] = [];
  produtosFiltrados: ProdutoComFavorito[] = [];

  abaAtiva: 'todos' | 'favoritos' = 'todos';
  menuCategoriasAberto: boolean = false;
  mensagemToast: string | null = null;

  // Mapeamento das categorias para os slugs em inglês da RAWG API
  readonly categorias: Categoria[] = [
    { id: 'acao', nome: 'Ação', icone: '⚔️', slugsRawg: ['action'] },
    { id: 'aventura', nome: 'Aventura', icone: '🧭', slugsRawg: ['adventure'] },
    { id: 'rpg', nome: 'RPG', icone: '🧙', slugsRawg: ['role-playing-games-rpg', 'rpg'] },
    { id: 'simulacao', nome: 'Simulação', icone: '🎮', slugsRawg: ['simulation'] },
    { id: 'mundo-aberto', nome: 'Mundo Aberto', icone: '🌎', slugsRawg: ['open-world'] },
  ];

  categoriaAtiva: string | null = null;
  plataformasAtivas = new Set<string>();
  faixaPrecoAtiva: string = 'todos';

  ngOnInit(): void {
    this.produtosService.obterProdutos().subscribe({
      next: (dados) => {
        this.produtos = dados.map((p) => ({
          ...p,
          favorito: this.favoritosService.ehFavorito(p.id),
        }));
        this.aplicarFiltros();
      },
      error: (err) => console.error('Erro ao carregar produtos:', err),
    });
  }

  get quantidadeFavoritos(): number {
    return this.produtos.filter((p) => p.favorito).length;
  }

  toggleMenuCategorias(): void {
    this.menuCategoriasAberto = !this.menuCategoriasAberto;
  }

  obterNomeCategoriaAtiva(): string {
    if (!this.categoriaAtiva) {
      return '🏷️ Categorias';
    }
    const cat = this.categorias.find((c) => c.id === this.categoriaAtiva);
    return cat ? `${cat.icone} ${cat.nome}` : '🏷️ Categorias';
  }

  selecionarAba(aba: 'todos' | 'favoritos'): void {
    this.abaAtiva = aba;
  }

  get produtosExibidos(): ProdutoComFavorito[] {
    if (this.abaAtiva === 'favoritos') {
      return this.produtosFiltrados.filter((p) => p.favorito);
    }
    return this.produtosFiltrados;
  }

  selecionarCategoria(id: string): void {
    this.categoriaAtiva = this.categoriaAtiva === id ? null : id;
    this.menuCategoriasAberto = false;
    this.aplicarFiltros();
  }

  togglePlataforma(plat: string): void {
    if (this.plataformasAtivas.has(plat)) {
      this.plataformasAtivas.delete(plat);
    } else {
      this.plataformasAtivas.add(plat);
    }
    this.aplicarFiltros();
  }

  definirFaixaPreco(faixa: string): void {
    this.faixaPrecoAtiva = faixa;
    this.aplicarFiltros();
  }

  private aplicarFiltros(): void {
    this.produtosFiltrados = this.produtos.filter((produto) => {
      // Filtro de Categoria com suporte aos slugs da RAWG
      let passaCategoria = true;
      if (this.categoriaAtiva) {
        const catConfig = this.categorias.find((c) => c.id === this.categoriaAtiva);
        const slugsAceitos = catConfig ? [catConfig.id, ...catConfig.slugsRawg] : [this.categoriaAtiva];
        
        passaCategoria = produto.categorias.some((catSlug) =>
          slugsAceitos.includes(catSlug.toLowerCase())
        );
      }

      // Filtro de Plataforma
      const passaPlataforma =
        this.plataformasAtivas.size === 0 ||
        [...this.plataformasAtivas].some((plat) =>
          produto.plataforma.toLowerCase().includes(plat.toLowerCase())
        );

      // Filtro de Preço
      const passaPreco = this.passaFiltroPreco(produto);

      return passaCategoria && passaPlataforma && passaPreco;
    });
  }

  private passaFiltroPreco(produto: ProdutoComFavorito): boolean {
    if (this.faixaPrecoAtiva === 'todos') return true;

    const preco = this.converterPreco(produto.precoPromocional);

    switch (this.faixaPrecoAtiva) {
      case 'gratis':
        return preco === 0;
      case '0-50':
        return preco > 0 && preco <= 50;
      case '50-100':
        return preco > 50 && preco <= 100;
      case 'acima-100':
        return preco > 100;
      default:
        return true;
    }
  }

  private converterPreco(preco: string): number {
    if (!preco || preco.toLowerCase().includes('grátis')) return 0;
    return Number(preco.replace('R$', '').replace(',', '.').trim());
  }

  private exibirToast(mensagem: string): void {
    this.mensagemToast = mensagem;
    this.cdr.markForCheck();

    setTimeout(() => {
      this.mensagemToast = null;
      this.cdr.markForCheck();
    }, 3000);
  }

  toggleFavorito(produto: ProdutoComFavorito): void {
    this.favoritosService.toggleFavorito(produto);
    produto.favorito = !produto.favorito;

    const msg = produto.favorito ? '❤️ Adicionado aos favoritos!' : '💔 Removido dos favoritos!';
    this.exibirToast(msg);
  }

  limparFavoritos(): void {
    this.favoritosService.limparTodosFavoritos();
    this.produtos.forEach((p) => (p.favorito = false));
    this.exibirToast('🗑️ Favoritos limpos!');
  }

  adicionarAoCarrinho(produto: ProdutoComFavorito): void {
    const preco = this.converterPreco(produto.precoPromocional);

    this.carrinhoFacade.adicionarProduto({
      id: Number(produto.id) || Date.now(),
      nome: produto.nome,
      preco: preco,
      quantidade: 1,
      imagemUrl: produto.imagem,
      plataforma: produto.plataforma,
      categoria: produto.genero,
    });

    const mensagem =
      preco === 0
        ? '🎁 Jogo gratuito adicionado ao carrinho!'
        : '🛒 Jogo adicionado ao carrinho!';
    this.exibirToast(mensagem);
  }

  irParaPaginaDoJogo(produto: ProdutoComFavorito): void {
    this.router.navigate(['/produto', produto.id]);
  }
}