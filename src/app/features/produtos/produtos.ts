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
    
    if (produto.id === '1' || produto.nome.toLowerCase().includes('grand')) {
      this.router.navigate(['/jogos/grand-theft-auto-v']);
    }
    if (produto.id === '2' || produto.nome.toLowerCase().includes('witcher')) {
      this.router.navigate(['/jogos/the-witcher-3']);
    }
    if (produto.id === '3' || produto.nome.toLowerCase().includes('sims')) {
      this.router.navigate(['/jogos/the-sims-4']);
    }
    if (produto.id === '4' || produto.nome.toLowerCase().includes('god')) {
      this.router.navigate(['/jogos/god-of-war']);
    }
    if (produto.id === '5' || produto.nome.toLowerCase().includes('spider')) {
      this.router.navigate(['/jogos/jogos/marvels-spider-Man-remastered']);
    }
    if (produto.id === '6' || produto.nome.toLowerCase().includes('call')) {
      this.router.navigate(['/jogos/call-of-duty-modern-warfare-ii']);
    }
    if (produto.id === '7' || produto.nome.toLowerCase().includes('plague')) {
      this.router.navigate(['/jogos/a-plague-tale']);
    }
    if (produto.id === '8' || produto.nome.toLowerCase().includes('ragnarök')) {
      this.router.navigate(['/jogos/god-of-war-ragnarök']);
    }
    if (produto.id === '9' || produto.nome.toLowerCase().includes('knight')) {
      this.router.navigate(['/jogos/hollow-knight']);
    }
    if (produto.id === '10' || produto.nome.toLowerCase().includes('dead')) {
      this.router.navigate(['/jogos/red-dead-redemption-2']);
    }
      if (produto.id === '11' || produto.nome.toLowerCase().includes('assassins')) {
      this.router.navigate(['/jogos/assassins-creed-iv-black-flag']);
    }
      if (produto.id === '12' || produto.nome.toLowerCase().includes('yakuza')) {
      this.router.navigate(['/jogos/yakuza-0']);
    }
      if (produto.id === '13' || produto.nome.toLowerCase().includes('sports')) {
      this.router.navigate(['/jogos/ea-sports-fc-24']);
    }
      if (produto.id === '14' || produto.nome.toLowerCase().includes('strange')) {
      this.router.navigate(['/jogos/life-is-strange']);
    }
      if (produto.id === '15' || produto.nome.toLowerCase().includes('last')) {
      this.router.navigate(['/jogos/the-last-of-Us']);
    }
      if (produto.id === '16' || produto.nome.toLowerCase().includes('f1')) {
      this.router.navigate(['/jogos/f1-23']);
    }
      if (produto.id === '17' || produto.nome.toLowerCase().includes('')) {
      this.router.navigate(['/jogos/watch-dogs-2']);
    }
      if (produto.id === '18' || produto.nome.toLowerCase().includes('cyberpunk')) {
      this.router.navigate(['/jogos/cyberpunk-2077']);
    }
      if (produto.id === '19' || produto.nome.toLowerCase().includes('marvel')) {
      this.router.navigate(['/jogos/marvel-rivals']);
    }
   
    
  }

  
}