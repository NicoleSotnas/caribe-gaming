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

    // Adiciona ao carrinho independente de ser 0 (grátis) ou pago
    this.carrinhoFacade.adicionarProduto({
      id: Number(produto.id),
      nome: produto.nome,
      preco: preco,
      quantidade: 1,
      imagemUrl: produto.imagem,
      plataforma: produto.plataforma,
      categoria: produto.genero,
    });

    const mensagem = preco === 0 ? '🎁 Jogo gratuito adicionado ao carrinho!' : '🛒 Jogo adicionado ao carrinho!';
    this.exibirToast(mensagem);
  }

  irParaPaginaDoJogo(produto: ProdutoComFavorito): void {
  const idNum = Number(produto.id);

  // Se for um dos jogos novos (IDs 21 em diante), usa a Rota Dinâmica
if (idNum >= 21) {
    this.router.navigate(['/produto', produto.slug]);
    return;
  }

  // Se for um dos jogos antigos individuais, mantém a rota antiga
  this.router.navigate(['/produto', produto.slug]);

  // Se for um dos jogos antigos (IDs 1 ao 20), usa o switch
  switch (String(produto.id)) {
    case '1': this.router.navigate(['/jogos/grand-theft-auto-v']); break;
    case '2': this.router.navigate(['/jogos/the-witcher-3']); break;
    case '3': this.router.navigate(['/jogos/the-sims-4']); break;
    case '4': this.router.navigate(['/jogos/god-of-war']); break;
    case '5': this.router.navigate(['/jogos/marvels-spider-man-remastered']); break;
    case '6': this.router.navigate(['/jogos/call-of-duty-modern-warfare-ii']); break;
    case '7': this.router.navigate(['/jogos/a-plague-tale']); break;
    case '8': this.router.navigate(['/jogos/god-of-war-ragnarök']); break;
    case '9': this.router.navigate(['/jogos/hollow-knight']); break;
    case '10': this.router.navigate(['/jogos/red-dead-redemption-2']); break;
    case '11': this.router.navigate(['/jogos/assassins-creed-iv-black-flag']); break;
    case '12': this.router.navigate(['/jogos/yakuza-0']); break;
    case '13': this.router.navigate(['/jogos/ea-sports-fc-24']); break;
    case '14': this.router.navigate(['/jogos/life-is-strange']); break;
    case '15': this.router.navigate(['/jogos/the-last-of-Us']); break;
    case '16': this.router.navigate(['/jogos/f1-23']); break;
    case '17': this.router.navigate(['/jogos/elden-ring']); break;
    case '18': this.router.navigate(['/jogos/cyberpunk-2077']); break;
    case '19': this.router.navigate(['/jogos/marvel-rivals']); break;
    case '20': this.router.navigate(['/jogos/the-last-of-us-II']); break;
    default:
      this.router.navigate(['/produto', produto.id]);
      break;
  }
}
 } 