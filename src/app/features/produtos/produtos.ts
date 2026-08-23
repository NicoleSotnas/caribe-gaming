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

  readonly categorias: Categoria[] = [
    { id: 'acao', nome: 'Ação', icone: '⚔️' },
    { id: 'aventura', nome: 'Aventura', icone: '🧭' },
    { id: 'rpg', nome: 'RPG', icone: '🧙' },
    { id: 'simulacao', nome: 'Simulação', icone: '🎮' },
    { id: 'mundo-aberto', nome: 'Mundo Aberto', icone: '🌎' },
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
      const passaCategoria =
        !this.categoriaAtiva || produto.categorias.includes(this.categoriaAtiva);

      const passaPlataforma =
        this.plataformasAtivas.size === 0 ||
        [...this.plataformasAtivas].some((plat) => produto.plataforma.includes(plat));

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

    // Se o jogo for de graça (preço = 0)
    if (preco === 0) {
      this.exibirToast('🎉 Jogo obtido com sucesso!');
      return;
    }

    // Se for jogo pago, adiciona no carrinho
    this.carrinhoFacade.adicionarProduto({
      id: Number(produto.id),
      nome: produto.nome,
      preco,
      quantidade: 1,
      imagemUrl: produto.imagem,
      plataforma: produto.plataforma,
      categoria: produto.genero,
    });

    this.exibirToast('🛒 Jogo adicionado ao carrinho!');
  }

  irParaPaginaDoJogo(produto: ProdutoComFavorito): void {
    const nome = produto.nome.toLowerCase();
    const id = String(produto.id);

    if (id === '1' || nome.includes('grand')) {
      this.router.navigate(['/jogos/grand-theft-auto-v']);
    } else if (id === '2' || nome.includes('witcher')) {
      this.router.navigate(['/jogos/the-witcher-3']);
    } else if (id === '3' || nome.includes('sims')) {
      this.router.navigate(['/jogos/the-sims-4']);
    } else if (id === '8' || nome.includes('ragnarök')) {
      this.router.navigate(['/jogos/god-of-war-ragnarök']);
    } else if (id === '4' || nome.includes('god')) {
      this.router.navigate(['/jogos/god-of-war']);
    } else if (id === '5' || nome.includes('marvels')) {
      this.router.navigate(['jogos/marvels-spider-man-remastered']);
    } else if (id === '6' || nome.includes('call')) {
      this.router.navigate(['/jogos/call-of-duty-modern-warfare-ii']);
    } else if (id === '7' || nome.includes('plague')) {
      this.router.navigate(['/jogos/a-plague-tale']);
    } else if (id === '9' || nome.includes('knight')) {
      this.router.navigate(['/jogos/hollow-knight']);
    } else if (id === '10' || nome.includes('dead')) {
      this.router.navigate(['/jogos/red-dead-redemption-2']);
    } else if (id === '11' || nome.includes('assassins')) {
      this.router.navigate(['/jogos/assassins-creed-iv-black-flag']);
    } else if (id === '12' || nome.includes('yakuza')) {
      this.router.navigate(['/jogos/yakuza-0']);
    } else if (id === '13' || nome.includes('sports')) {
      this.router.navigate(['/jogos/ea-sports-fc-24']);
    } else if (id === '14' || nome.includes('strange')) {
      this.router.navigate(['/jogos/life-is-strange']);
    } else if (id === '20' || nome.includes('the')) {
      this.router.navigate(['/jogos/the-last-of-us-II']); 
    }else if (id === '15' || nome.includes('last')) {
      this.router.navigate(['/jogos/the-last-of-Us']);
    } else if (id === '16' || nome.includes('f1')) {
      this.router.navigate(['/jogos/f1-23']);
    } else if (id === '17' || nome.includes('elden')) {
      this.router.navigate(['/jogos/elden-ring']);
    } else if (id === '18' || nome.includes('cyberpunk')) {
      this.router.navigate(['/jogos/cyberpunk-2077']);
    } else if (id === '19' || nome.includes('rivals')) {
      this.router.navigate(['/jogos/marvel-rivals']);

    }
  }
}