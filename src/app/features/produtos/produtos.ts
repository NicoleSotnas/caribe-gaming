import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  ProdutosService,
  Produto,
} from '../../core/services/produtos.service';

import {
  CarrinhoFacade,
} from '../../core/facades/carrinho.facade';

import {
  FavoritosService,
} from '../../core/services/favoritos.service';

import {
  CurrencyService,
} from '../../core/services/currency.service';

interface ProdutoComFavorito extends Produto {
  favorito: boolean;

  /**
   * Valor convertido para USD apenas para exibição.
   * Não é usado para pagamento.
   */
  precoUsd?: number | null;
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
  private readonly produtosService =
    inject(ProdutosService);

  private readonly router =
    inject(Router);

  private readonly carrinhoFacade =
    inject(CarrinhoFacade);

  private readonly favoritosService =
    inject(FavoritosService);

  private readonly currencyService =
    inject(CurrencyService);

  private readonly cdr =
    inject(ChangeDetectorRef);

  produtos: ProdutoComFavorito[] = [];

  produtosFiltrados: ProdutoComFavorito[] = [];

  abaAtiva:
    | 'todos'
    | 'favoritos' = 'todos';

  menuCategoriasAberto = false;

  mensagemToast:
    string | null = null;

  /**
   * Cotação atual BRL → USD.
   *
   * Exemplo:
   * 1 BRL = 0.1945 USD
   */
  cotacaoBrlUsd:
    number | null = null;

  carregandoCotacao = false;

  erroCotacao:
    string | null = null;

  readonly categorias: Categoria[] = [
    {
      id: 'acao',
      nome: 'Ação',
      icone: '⚔️',
    },
    {
      id: 'aventura',
      nome: 'Aventura',
      icone: '🧭',
    },
    {
      id: 'rpg',
      nome: 'RPG',
      icone: '🧙',
    },
    {
      id: 'simulacao',
      nome: 'Simulação',
      icone: '🎮',
    },
    {
      id: 'mundo-aberto',
      nome: 'Mundo Aberto',
      icone: '🌎',
    },
  ];

  categoriaAtiva:
    string | null = null;

  plataformasAtivas =
    new Set<string>();

  faixaPrecoAtiva = 'todos';

  ngOnInit(): void {
    this.carregarProdutos();

    this.carregarCotacao();
  }

  /**
   * Carrega os produtos do catálogo.
   */
  private carregarProdutos(): void {
    this.produtosService
      .obterProdutos()
      .subscribe({
        next: (dados) => {
          this.produtos =
            dados.map((produto) => ({
              ...produto,

              favorito:
                this.favoritosService
                  .ehFavorito(produto.id),

              precoUsd: null,
            }));

          this.aplicarFiltros();

          /*
           * Se a cotação já tiver sido carregada,
           * atualizamos imediatamente os valores USD.
           */
          if (
            this.cotacaoBrlUsd !== null
          ) {
            this.atualizarPrecosUsd();
          }

          this.cdr.markForCheck();
        },

        error: (erro) => {
          console.error(
            'Erro ao carregar produtos:',
            erro,
          );

          this.produtos = [];
          this.produtosFiltrados = [];

          this.cdr.markForCheck();
        },
      });
  }

  /**
   * Consulta a cotação atual BRL → USD.
   *
   * A Frankfurter é utilizada apenas
   * para conversão informativa.
   *
   * O preço oficial do produto continua
   * sendo o preço em BRL do catálogo.
   */
  private carregarCotacao(): void {
    this.carregandoCotacao = true;
    this.erroCotacao = null;

    this.currencyService
      .buscarCotacaoBrlUsd()
      .subscribe({
        next: (resposta) => {
          this.cotacaoBrlUsd =
            resposta.rate;

          this.carregandoCotacao =
            false;

          this.atualizarPrecosUsd();

          this.cdr.markForCheck();
        },

        error: (erro: Error) => {
          console.error(
            'Erro ao carregar cotação da Frankfurter:',
            erro,
          );

          this.cotacaoBrlUsd =
            null;

          this.carregandoCotacao =
            false;

          this.erroCotacao =
            'Cotação indisponível no momento.';

          /*
           * O catálogo continua funcionando
           * mesmo que a API de câmbio falhe.
           */
          this.cdr.markForCheck();
        },
      });
  }

  /**
   * Atualiza o preço USD de todos os produtos
   * usando a cotação já carregada.
   *
   * Não faz novas requisições à API.
   */
  private atualizarPrecosUsd(): void {
    if (
      this.cotacaoBrlUsd === null
    ) {
      return;
    }

    this.produtos =
      this.produtos.map((produto) => ({
        ...produto,

        precoUsd:
          this.converterParaUsd(
            this.converterPreco(
              produto.precoPromocional,
            ),
          ),
      }));

    this.aplicarFiltros();
  }

  get quantidadeFavoritos(): number {
    return this.produtos.filter(
      (produto) =>
        produto.favorito,
    ).length;
  }

  toggleMenuCategorias(): void {
    this.menuCategoriasAberto =
      !this.menuCategoriasAberto;
  }

  obterNomeCategoriaAtiva(): string {
    if (
      !this.categoriaAtiva
    ) {
      return '🏷️ Categorias';
    }

    const categoria =
      this.categorias.find(
        (item) =>
          item.id ===
          this.categoriaAtiva,
      );

    return categoria
      ? `${categoria.icone} ${categoria.nome}`
      : '🏷️ Categorias';
  }

  selecionarAba(
    aba:
      | 'todos'
      | 'favoritos',
  ): void {
    this.abaAtiva = aba;
  }

  get produtosExibidos(): ProdutoComFavorito[] {
    if (
      this.abaAtiva ===
      'favoritos'
    ) {
      return this.produtosFiltrados.filter(
        (produto) =>
          produto.favorito,
      );
    }

    return this.produtosFiltrados;
  }

  selecionarCategoria(
    id: string,
  ): void {
    this.categoriaAtiva =
      this.categoriaAtiva === id
        ? null
        : id;

    this.menuCategoriasAberto =
      false;

    this.aplicarFiltros();
  }

  togglePlataforma(
    plataforma: string,
  ): void {
    if (
      this.plataformasAtivas.has(
        plataforma,
      )
    ) {
      this.plataformasAtivas.delete(
        plataforma,
      );
    } else {
      this.plataformasAtivas.add(
        plataforma,
      );
    }

    this.aplicarFiltros();
  }

  definirFaixaPreco(
    faixa: string,
  ): void {
    this.faixaPrecoAtiva =
      faixa;

    this.aplicarFiltros();
  }

  private aplicarFiltros(): void {
    this.produtosFiltrados =
      this.produtos.filter(
        (produto) => {
          const passaCategoria =
            !this.categoriaAtiva ||
            produto.categorias.includes(
              this.categoriaAtiva,
            );

          const passaPlataforma =
            this.plataformasAtivas
              .size === 0 ||
            [
              ...this.plataformasAtivas,
            ].some(
              (plataforma) =>
                produto.plataforma.includes(
                  plataforma,
                ),
            );

          const passaPreco =
            this.passaFiltroPreco(
              produto,
            );

          return (
            passaCategoria &&
            passaPlataforma &&
            passaPreco
          );
        },
      );
  }

  private passaFiltroPreco(
    produto: ProdutoComFavorito,
  ): boolean {
    if (
      this.faixaPrecoAtiva ===
      'todos'
    ) {
      return true;
    }

    const preco =
      this.converterPreco(
        produto.precoPromocional,
      );

    switch (
      this.faixaPrecoAtiva
    ) {
      case 'gratis':
        return preco === 0;

      case '0-50':
        return (
          preco > 0 &&
          preco <= 50
        );

      case '50-100':
        return (
          preco > 50 &&
          preco <= 100
        );

      case 'acima-100':
        return preco > 100;

      default:
        return true;
    }
  }

  /**
   * Converte uma string de preço brasileira
   * para número.
   *
   * Exemplos:
   *
   * R$ 99,90
   * → 99.90
   *
   * R$ 1.299,90
   * → 1299.90
   *
   * Grátis
   * → 0
   */
  private converterPreco(
    preco: string,
  ): number {
    if (
      !preco ||
      preco
        .toLowerCase()
        .includes('grátis')
    ) {
      return 0;
    }

    const valorNormalizado =
      preco
        .replace(/[^\d,.-]/g, '')
        .replace(
          /\./g,
          '',
        )
        .replace(
          ',',
          '.',
        );

    const valor =
      Number(
        valorNormalizado,
      );

    return Number.isFinite(valor)
      ? valor
      : 0;
  }

  /**
   * Converte BRL → USD usando
   * a cotação já carregada.
   */
  private converterParaUsd(
    valorEmReais: number,
  ): number | null {
    if (
      this.cotacaoBrlUsd ===
      null
    ) {
      return null;
    }

    return (
      valorEmReais *
      this.cotacaoBrlUsd
    );
  }

  /**
   * Formata o valor em USD para exibição.
   */
  formatarUsd(
    valor: number | null | undefined,
  ): string {
    if (
      valor === null ||
      valor === undefined
    ) {
      return '';
    }

    return this.currencyService
      .formatarUsd(valor);
  }

  /**
   * Retorna a cotação formatada.
   */
  obterCotacaoFormatada(): string {
    if (
      this.cotacaoBrlUsd ===
      null
    ) {
      return '';
    }

    return this.currencyService
      .formatarTaxa(
        this.cotacaoBrlUsd,
      );
  }

  private exibirToast(
    mensagem: string,
  ): void {
    this.mensagemToast =
      mensagem;

    this.cdr.markForCheck();

    setTimeout(() => {
      this.mensagemToast =
        null;

      this.cdr.markForCheck();
    }, 3000);
  }

  toggleFavorito(
    produto: ProdutoComFavorito,
  ): void {
    this.favoritosService
      .toggleFavorito(
        produto,
      );

    produto.favorito =
      !produto.favorito;

    const mensagem =
      produto.favorito
        ? '❤️ Adicionado aos favoritos!'
        : '💔 Removido dos favoritos!';

    this.exibirToast(
      mensagem,
    );
  }

  limparFavoritos(): void {
    this.favoritosService
      .limparTodosFavoritos();

    this.produtos.forEach(
      (produto) => {
        produto.favorito = false;
      },
    );

    this.exibirToast(
      '🗑️ Favoritos limpos!',
    );
  }

  adicionarAoCarrinho(
    produto: ProdutoComFavorito,
  ): void {
    const preco =
      this.converterPreco(
        produto.precoPromocional,
      );

    /*
     * IMPORTANTE:
     * O preço abaixo é utilizado somente
     * pelo carrinho atual da aplicação.
     *
     * O Mercado Pago NÃO deve confiar
     * nesse valor. O backend deve recalcular
     * o preço oficial.
     */
    this.carrinhoFacade
      .adicionarProduto({
        id: Number(
          produto.id,
        ),

        nome:
          produto.nome,

        preco,

        quantidade: 1,

        imagemUrl:
          produto.imagem,

        plataforma:
          produto.plataforma,

        categoria:
          produto.genero,
      });

    const mensagem =
      preco === 0
        ? '🎁 Jogo gratuito adicionado ao carrinho!'
        : '🛒 Jogo adicionado ao carrinho!';

    this.exibirToast(
      mensagem,
    );
  }

  irParaPaginaDoJogo(
    produto: ProdutoComFavorito,
  ): void {
    const idNum =
      Number(produto.id);

    /*
     * Jogos novos:
     *
     * Atualmente o projeto tenta utilizar
     * a rota /produto/:slug para esses jogos.
     *
     * Essa rota precisa existir em app.routes.ts.
     */
    if (
      idNum >= 21
    ) {
      this.router.navigate([
        '/produto',
        produto.slug,
      ]);

      return;
    }

    /*
     * Jogos antigos: mantemos as rotas
     * individuais já existentes.
     */
    switch (
      String(produto.id)
    ) {
      case '1':
        this.router.navigate([
          '/jogos/grand-theft-auto-v',
        ]);
        break;

      case '2':
        this.router.navigate([
          '/jogos/the-witcher-3',
        ]);
        break;

      case '3':
        this.router.navigate([
          '/jogos/the-sims-4',
        ]);
        break;

      case '4':
        this.router.navigate([
          '/jogos/god-of-war',
        ]);
        break;

      case '5':
        this.router.navigate([
          '/jogos/marvels-spider-man-remastered',
        ]);
        break;

      case '6':
        this.router.navigate([
          '/jogos/call-of-duty-modern-warfare-ii',
        ]);
        break;

      case '7':
        this.router.navigate([
          '/jogos/a-plague-tale',
        ]);
        break;

      case '8':
        this.router.navigate([
          '/jogos/god-of-war-ragnarök',
        ]);
        break;

      case '9':
        this.router.navigate([
          '/jogos/hollow-knight',
        ]);
        break;

      case '10':
        this.router.navigate([
          '/jogos/red-dead-redemption-2',
        ]);
        break;

      case '11':
        this.router.navigate([
          '/jogos/assassins-creed-iv-black-flag',
        ]);
        break;

      case '12':
        this.router.navigate([
          '/jogos/yakuza-0',
        ]);
        break;

      case '13':
        this.router.navigate([
          '/jogos/ea-sports-fc-24',
        ]);
        break;

      case '14':
        this.router.navigate([
          '/jogos/life-is-strange',
        ]);
        break;

      case '15':
        this.router.navigate([
          '/jogos/the-last-of-Us',
        ]);
        break;

      case '16':
        this.router.navigate([
          '/jogos/f1-23',
        ]);
        break;

      case '17':
        this.router.navigate([
          '/jogos/elden-ring',
        ]);
        break;

      case '18':
        this.router.navigate([
          '/jogos/cyberpunk-2077',
        ]);
        break;

      case '19':
        this.router.navigate([
          '/jogos/marvel-rivals',
        ]);
        break;

      case '20':
        this.router.navigate([
          '/jogos/the-last-of-us-II',
        ]);
        break;

      default:
        this.router.navigate([
          '/produto',
          produto.slug,
        ]);
        break;
    }
  }
}