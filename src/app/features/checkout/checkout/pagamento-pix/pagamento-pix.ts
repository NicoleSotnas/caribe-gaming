import { CommonModule, isPlatformBrowser } from '@angular/common';

import {
  Component,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import {
  Router,
  RouterLink,
} from '@angular/router';

import { CarrinhoFacade } from '../../../../core/facades/carrinho.facade';
import { AuthFacade } from '../../../../core/facades/auth.facade';
import { ItemCarrinho } from '../../../../core/models/item-carrinho';

function cpfValido(valor: string): boolean {
  const cpf = valor.replace(/\D/g, '');

  if (
    cpf.length !== 11 ||
    /^(\d)\1{10}$/.test(cpf)
  ) {
    return false;
  }

  let soma = 0;

  for (let i = 0; i < 9; i++) {
    soma += Number(cpf[i]) * (10 - i);
  }

  let resto = soma % 11;
  const primeiro =
    resto < 2 ? 0 : 11 - resto;

  if (
    primeiro !== Number(cpf[9])
  ) {
    return false;
  }

  soma = 0;

  for (let i = 0; i < 10; i++) {
    soma += Number(cpf[i]) * (11 - i);
  }

  resto = soma % 11;

  const segundo =
    resto < 2 ? 0 : 11 - resto;

  return (
    segundo === Number(cpf[10])
  );
}

function cpfValidator(): ValidatorFn {
  return (control) => {
    if (!control.value) {
      return null;
    }

    return cpfValido(
      String(control.value),
    )
      ? null
      : { cpfInvalido: true };
  };
}

@Component({
  selector: 'app-pagamento-pix',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
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

  private readonly fb =
    inject(FormBuilder);

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

  readonly cpfComprador =
    signal('');

  readonly numeroPedido =
    signal('');

  readonly numeroNotaFiscal =
    signal('');

  readonly codigoAutorizacao =
    signal('');

  readonly dataPagamento =
    signal('');

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
        this.authFacade.usuarioAtual()
          ?.email
          ?.trim() || '',
    );

  readonly formulario =
    this.fb.nonNullable.group({
      cpf: [
        '',
        [
          Validators.required,
          cpfValidator(),
        ],
      ],
    });

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

  mascararCpf(
    event: Event,
  ): void {
    const input =
      event.target as HTMLInputElement;

    const digits =
      input.value
        .replace(/\D/g, '')
        .slice(0, 11);

    let valor = digits;

    if (digits.length > 3) {
      valor =
        `${digits.slice(0, 3)}.${digits.slice(3)}`;
    }

    if (digits.length > 6) {
      valor =
        `${digits.slice(0, 3)}.${digits.slice(
          3,
          6,
        )}.${digits.slice(6)}`;
    }

    if (digits.length > 9) {
      valor =
        `${digits.slice(0, 3)}.${digits.slice(
          3,
          6,
        )}.${digits.slice(
          6,
          9,
        )}-${digits.slice(9)}`;
    }

    input.value =
      valor;

    this.formulario.controls.cpf.setValue(
      valor,
      {
        emitEvent: true,
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
        () =>
          this.codigoCopiado.set(false),
        1800,
      );
    };

    if (
      navigator.clipboard
        ?.writeText
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
      this.carrinhoFacade.carrinhoVazio()
    ) {
      this.erro.set(
        'Seu carrinho está vazio.',
      );

      return;
    }

    if (
      this.formulario.invalid
    ) {
      this.formulario.markAllAsTouched();

      this.erro.set(
        'Informe um CPF válido.',
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

    this.cpfComprador.set(
      this.formulario.controls.cpf.value,
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

        this.carrinhoFacade.limparCarrinho();

        this.formulario.reset({
          cpf: '',
        });

        try {
          sessionStorage.removeItem(
            'caribe-checkout-validado',
          );
        } catch {
          // Continua.
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

    const eFinder =
      (
        linha: number,
        coluna: number,
      ):
        | boolean
        | null => {
        for (
          const [baseLinha, baseColuna] of buscadores
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
            borda || centro
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
            estado %
            100
          ) <
          44;
      }
    }

    return matriz;
  }
}