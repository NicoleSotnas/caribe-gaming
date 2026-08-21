import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProdutosService, Produto } from '../../core/services/produtos.service';
import { CarrinhoFacade } from '../../core/facades/carrinho.facade';

interface ProdutoComFavorito extends Produto {
  favorito: boolean;
}

interface Categoria {
  id: string;
  nome: string;
  icone: string;
}

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './produtos.html',
  styleUrls: ['./produtos.css']
})
export class Produtos implements OnInit {
  private produtosService = inject(ProdutosService);
  private router = inject(Router);
  private carrinhoFacade = inject(CarrinhoFacade);

  produtos: ProdutoComFavorito[] = [];
  produtosFiltrados: ProdutoComFavorito[] = [];

  readonly categorias: Categoria[] = [
    { id: 'acao', nome: 'Ação', icone: '⚔️' },
    { id: 'aventura', nome: 'Aventura', icone: '🧭' },
    { id: 'rpg', nome: 'RPG', icone: '🧙' },
    { id: 'simulacao', nome: 'Simulação', icone: '🎮' },
    { id: 'mundo-aberto', nome: 'Mundo Aberto', icone: '🌎' },
  ];

  categoriaAtiva: string | null = null; // null = "todas"
  plataformasAtivas = new Set<string>();
  faixaPrecoAtiva: string = 'todos';

  ngOnInit(): void {
    this.produtosService.obterProdutos().subscribe({
      next: (dados) => {
        this.produtos = dados.map(p => ({ ...p, favorito: false }));
        this.aplicarFiltros();
      },
      error: (err) => console.error('Erro ao carregar produtos:', err)
    });
  }

  selecionarCategoria(id: string): void {
    this.categoriaAtiva = this.categoriaAtiva === id ? null : id;
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
    this.produtosFiltrados = this.produtos.filter(produto => {
      const passaCategoria = !this.categoriaAtiva || produto.categorias.includes(this.categoriaAtiva);

      const passaPlataforma = this.plataformasAtivas.size === 0 ||
        [...this.plataformasAtivas].some(plat => produto.plataforma.includes(plat));

      const passaPreco = this.passaFiltroPreco(produto);

      return passaCategoria && passaPlataforma && passaPreco;
    });
  }

  private passaFiltroPreco(produto: ProdutoComFavorito): boolean {
    if (this.faixaPrecoAtiva === 'todos') return true;

    const preco = this.converterPreco(produto.precoPromocional);

    switch (this.faixaPrecoAtiva) {
      case 'gratis': return preco === 0;
      case '0-50': return preco > 0 && preco <= 50;
      case '50-100': return preco > 50 && preco <= 100;
      case 'acima-100': return preco > 100;
      default: return true;
    }
  }

  private converterPreco(preco: string): number {
    if (preco.toLowerCase().includes('grátis')) return 0;
    return Number(preco.replace('R$', '').replace(',', '.').trim());
  }

  toggleFavorito(produto: ProdutoComFavorito): void {
    produto.favorito = !produto.favorito;
  }

  adicionarAoCarrinho(produto: ProdutoComFavorito): void {
    const preco = this.converterPreco(produto.precoPromocional);

    this.carrinhoFacade.adicionarProduto({
      id: Number(produto.id),
      nome: produto.nome,
      preco,
      quantidade: 1,
      imagemUrl: produto.imagem,
      plataforma: produto.plataforma,
      categoria: produto.genero,
    });
  }

  irParaPaginaDoJogo(produto: ProdutoComFavorito): void {
    if (produto.id === '2' || produto.nome.toLowerCase().includes('witcher')) {
      this.router.navigate(['/jogos/the-witcher-3']);
    }
  }
}