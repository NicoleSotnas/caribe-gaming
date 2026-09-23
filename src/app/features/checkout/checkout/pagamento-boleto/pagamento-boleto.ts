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
  const cpf =
    valor.replace(/\D/g, '');

  if (
    cpf.length !== 11 ||
    /^(\d)\1{10}$/.test(cpf)
  ) {
    return false;
  }

  let soma = 0;

  for (let i = 0; i < 9; i++) {
    soma +=
      Number(cpf[i]) *
      (10 - i);
  }

  let resto =
    soma % 11;

  const primeiro =
    resto < 2
      ? 0
      : 11 - resto;

  if (
    primeiro !==
    Number(cpf[9])
  ) {
    return false;
  }

  soma = 0;

  for (let i = 0; i < 10; i++) {
    soma +=
      Number(cpf[i]) *
      (11 - i);
  }

  resto =
    soma % 11;

  const segundo =
    resto < 2
      ? 0
      : 11 - resto;

  return (
    segundo ===
    Number(cpf[10])
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
  selector: 'app-pagamento-boleto',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './pagamento-boleto.html',
  styleUrl: './pagamento-boleto.css',
})
export class PagamentoBoleto {
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

  readonly vencimento =
    signal('');

  readonly linhaDigitavel =
    computed(
      () =>
        this.gerarLinhaDigitavel(
          this.carrinhoFacade.total(),
        ),
    );

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

    let valor =
      digits;

    if (
      digits.length > 3
    ) {
      valor =
        `${digits.slice(
          0,
          3,
        )}.${digits.slice(3)}`;
    }

    if (
      digits.length > 6
    ) {
      valor =
        `${digits.slice(
          0,
          3,
        )}.${digits.slice(
          3,
          6,
        )}.${digits.slice(6)}`;
    }

    if (
      digits.length > 9
    ) {
      valor =
        `${digits.slice(
          0,
          3,
        )}.${digits.slice(
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

  copiarLinha(): void {
    if (
      !isPlatformBrowser(
        this.platformId,
      )
    ) {
      return;
    }

    const linha =
      this.linhaDigitavel();

    if (
      navigator.clipboard
        ?.writeText
    ) {
      navigator.clipboard
        .writeText(linha)
        .then(
          () =>
            this.mostrarCopiado(),
        )
        .catch(
          () =>
            this.mostrarCopiado(),
        );

      return;
    }

    this.mostrarCopiado();
  }

  private mostrarCopiado(): void {
    this.codigoCopiado.set(
      true,
    );

    window.setTimeout(
      () =>
        this.codigoCopiado.set(
          false,
        ),
      1800,
    );
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

    if (
      !checkoutValidado
    ) {
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

    this.vencimento.set(
      this.calcularVencimento(),
    );

    this.processando.set(
      true,
    );

    window.setTimeout(
      () => {
        this.processando.set(
          false,
        );

        this.sucesso.set(
          true,
        );

        this.carrinhoFacade
          .limparCarrinho();

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
      1400,
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

  private calcularVencimento(): string {
    const data =
      new Date();

    data.setDate(
      data.getDate() + 3,
    );

    return new Intl.DateTimeFormat(
      'pt-BR',
      {
        dateStyle: 'short',
      },
    ).format(data);
  }

  private gerarLinhaDigitavel(
    total: number,
  ): string {
    const centavos =
      Math.round(
        total * 100,
      )
        .toString()
        .padStart(
          10,
          '0',
        );

    const sequencia =
      (
        `99999${centavos}` +
        String(
          Date.now(),
        )
          .slice(-24) +
        '999999999999'
      )
        .replace(
          /\D/g,
          '',
        )
        .padEnd(
          47,
          '9',
        )
        .slice(
          0,
          47,
        );

    return (
      `${sequencia.slice(
        0,
        5,
      )}.${sequencia.slice(
        5,
        10,
      )} ${sequencia.slice(
        10,
        15,
      )}.${sequencia.slice(
        15,
        21,
      )} ${sequencia.slice(
        21,
        26,
      )}.${sequencia.slice(
        26,
        32,
      )} ${sequencia.slice(
        32,
        33,
      )} ${sequencia.slice(
        33,
        47,
      )}`
    );
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
      Math.random() * 90 +
        10,
    )}`;
  }

  private gerarCodigoAutorizacao(): string {
    return `BOL-${Math.floor(
      Math.random() * 900000 +
        100000,
    )}`;
  }
}