import {
  CommonModule,
  isPlatformBrowser,
} from '@angular/common';

import {
  Component,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';

import {
  Router,
  RouterLink,
} from '@angular/router';

import { CarrinhoFacade } from '../../../../core/facades/carrinho.facade';
import { AuthFacade } from '../../../../core/facades/auth.facade';
import { ItemCarrinho } from '../../../../core/models/item-carrinho';

@Component({
  selector: 'app-pagamento-pix',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
  ],
  templateUrl: './pagamento-pix.html',
  styleUrl: './pagamento-pix.css',
})
export class PagamentoPix {
  readonly carrinhoFacade =
    inject(CarrinhoFacade);

  readonly authFacade =
    inject(AuthFacade);

  private readonly router =
    inject(Router);

  private readonly platformId =
    inject(PLATFORM_ID);

  readonly sucesso =
    signal(false);

  readonly processando =
    signal(false);

  readonly erro =
    signal('');

  readonly codigoCopiado =
    signal(false);

  readonly itensCompra =
    signal<ItemCarrinho[]>([]);

  readonly totalCompra =
    signal(0);

  readonly nomeComprador =
    signal('');

  readonly emailComprador =
    signal('');

  readonly numeroPedido =
    signal('');

  readonly numeroNotaFiscal =
    signal('');

  readonly codigoAutorizacao =
    signal('');

  readonly dataPagamento =
    signal('');

  /**
   * Código Pix exclusivamente fictício.
   *
   * Não representa uma cobrança real
   * e não possui validade bancária.
   */
  readonly codigoPix =
    '00020101021226870014br.gov.bcb.pix2565pix.caribe-gaming.simulacao5204000053039865802BR5915CARIBE GAMING6009SAO PAULO62070503***6304ABCD';

  readonly compradorLogado =
    computed(
      () =>
        this.authFacade
          .nomeExibicao()
          .trim() ||
        'Usuário logado',
    );

  readonly emailLogado =
    computed(
      () =>
        this.authFacade
          .usuarioAtual()
          ?.email
          ?.trim() || '',
    );

  readonly qrCode =
    this.criarQrCode(
      this.codigoPix,
    );

  formatarMoeda(
    valor: number,
  ): string {
    return valor.toLocaleString(
      'pt-BR',
      {
        style: 'currency',
        currency: 'BRL',
      },
    );
  }

  quantidadeTotalItens(): number {
    return this.carrinhoFacade
      .itens()
      .reduce(
        (
          total,
          item,
        ) =>
          total +
          (item.quantidade || 1),
        0,
      );
  }

  copiarPix(): void {
    if (
      !isPlatformBrowser(
        this.platformId,
      )
    ) {
      return;
    }

    const concluir = () => {
      this.codigoCopiado.set(true);

      window.setTimeout(
        () => {
          this.codigoCopiado.set(false);
        },
        1800,
      );
    };

    if (
      navigator.clipboard?.writeText
    ) {
      navigator.clipboard
        .writeText(
          this.codigoPix,
        )
        .then(
          concluir,
          concluir,
        );

      return;
    }

    concluir();
  }

  simularPagamento(): void {
    this.erro.set('');

    if (
      !isPlatformBrowser(
        this.platformId,
      )
    ) {
      return;
    }

    let checkoutValidado =
      false;

    try {
      checkoutValidado =
        sessionStorage.getItem(
          'caribe-checkout-validado',
        ) === 'true';
    } catch {
      checkoutValidado = false;
    }

    if (!checkoutValidado) {
      this.erro.set(
        'Finalize o checkout antes de iniciar a simulação.',
      );

      void this.router.navigateByUrl(
        '/checkout',
      );

      return;
    }

    if (
      this.carrinhoFacade
        .carrinhoVazio()
    ) {
      this.erro.set(
        'Seu carrinho está vazio.',
      );

      return;
    }

    const itens =
      this.carrinhoFacade
        .itens()
        .map(
          (item) => ({
            ...item,
            quantidade:
              item.quantidade || 1,
          }),
        );

    const total =
      this.carrinhoFacade.total();

    if (
      itens.length === 0 ||
      total <= 0
    ) {
      this.erro.set(
        'Não foi possível identificar os itens da compra.',
      );

      return;
    }

    /*
     * Capturamos os dados da compra
     * antes de limpar o carrinho.
     */
    this.itensCompra.set(
      itens,
    );

    this.totalCompra.set(
      total,
    );

    this.nomeComprador.set(
      this.compradorLogado(),
    );

    this.emailComprador.set(
      this.emailLogado(),
    );

    this.numeroPedido.set(
      this.gerarNumeroPedido(),
    );

    this.numeroNotaFiscal.set(
      this.gerarNumeroNotaFiscal(),
    );

    this.codigoAutorizacao.set(
      this.gerarCodigoAutorizacao(),
    );

    this.dataPagamento.set(
      new Intl.DateTimeFormat(
        'pt-BR',
        {
          dateStyle: 'short',
          timeStyle: 'short',
        },
      ).format(
        new Date(),
      ),
    );

    this.processando.set(true);

    window.setTimeout(
      () => {
        this.processando.set(false);

        this.sucesso.set(true);

        this.carrinhoFacade
          .limparCarrinho();

        try {
          sessionStorage.removeItem(
            'caribe-checkout-validado',
          );
        } catch {
          // Continua normalmente.
        }
      },
      1300,
    );
  }

  imprimirComprovante(): void {
    if (
      isPlatformBrowser(
        this.platformId,
      )
    ) {
      window.print();
    }
  }

  private gerarNumeroPedido(): string {
    return `CGC-${String(
      Date.now(),
    ).slice(-8)}`;
  }

  private gerarNumeroNotaFiscal(): string {
    return `NF-${String(
      Date.now(),
    ).slice(-9)}-${Math.floor(
      Math.random() * 90 + 10,
    )}`;
  }

  private gerarCodigoAutorizacao(): string {
    return `PIX-${Math.floor(
      Math.random() * 900000 +
        100000,
    )}`;
  }

  /**
   * Cria uma matriz visual para representar
   * um QR Code exclusivamente demonstrativo.
   */
  private criarQrCode(
    valor: string,
  ): boolean[][] {
    const tamanho = 29;

    let estado = 0;

    for (
      const caractere of valor
    ) {
      estado =
        (
          estado * 31 +
          caractere.charCodeAt(0)
        ) %
        2147483647;
    }

    if (estado === 0) {
      estado = 97;
    }

    const matriz =
      Array.from(
        {
          length: tamanho,
        },
        () =>
          Array.from(
            {
              length: tamanho,
            },
            () => false,
          ),
      );

    const buscadores = [
      [0, 0],
      [0, tamanho - 7],
      [tamanho - 7, 0],
    ];

    const eFinder = (
      linha: number,
      coluna: number,
    ): boolean | null => {
      for (
        const [
          baseLinha,
          baseColuna,
        ] of buscadores
      ) {
        const dentro =
          linha >= baseLinha &&
          linha <
            baseLinha + 7 &&
          coluna >= baseColuna &&
          coluna <
            baseColuna + 7;

        if (!dentro) {
          continue;
        }

        const relativaLinha =
          linha - baseLinha;

        const relativaColuna =
          coluna - baseColuna;

        const borda =
          relativaLinha === 0 ||
          relativaLinha === 6 ||
          relativaColuna === 0 ||
          relativaColuna === 6;

        const centro =
          relativaLinha >= 2 &&
          relativaLinha <= 4 &&
          relativaColuna >= 2 &&
          relativaColuna <= 4;

        return (
          borda ||
          centro
        );
      }

      return null;
    };

    for (
      let linha = 0;
      linha < tamanho;
      linha++
    ) {
      for (
        let coluna = 0;
        coluna < tamanho;
        coluna++
      ) {
        const finder =
          eFinder(
            linha,
            coluna,
          );

        if (
          finder !== null
        ) {
          matriz[linha][coluna] =
            finder;

          continue;
        }

        estado =
          (
            estado * 1103515245 +
            12345
          ) &
          0x7fffffff;

        matriz[linha][coluna] =
          (
            estado % 100
          ) < 44;
      }
    }

    return matriz;
  }
}