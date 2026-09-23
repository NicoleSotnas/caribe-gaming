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
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
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

/* =========================================================
   CPF
========================================================= */

function cpfValido(
  valor: string,
): boolean {
  const cpf =
    valor
      .replace(/\D/g, '')
      .slice(0, 11);

  if (
    cpf.length !== 11
  ) {
    return false;
  }

  if (
    /^(\d)\1{10}$/.test(cpf)
  ) {
    return false;
  }

  let soma = 0;

  for (
    let i = 0;
    i < 9;
    i++
  ) {
    soma +=
      Number(cpf.charAt(i)) *
      (10 - i);
  }

  let resto =
    soma % 11;

  const primeiroDigito =
    resto < 2
      ? 0
      : 11 - resto;

  if (
    primeiroDigito !==
    Number(cpf.charAt(9))
  ) {
    return false;
  }

  soma = 0;

  for (
    let i = 0;
    i < 10;
    i++
  ) {
    soma +=
      Number(cpf.charAt(i)) *
      (11 - i);
  }

  resto =
    soma % 11;

  const segundoDigito =
    resto < 2
      ? 0
      : 11 - resto;

  return (
    segundoDigito ===
    Number(cpf.charAt(10))
  );
}

function cpfValidator(): ValidatorFn {
  return (
    control,
  ): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    return cpfValido(
      String(control.value),
    )
      ? null
      : {
          cpfInvalido: true,
        };
  };
}

/* =========================================================
   CARTÃO — LUHN
========================================================= */

function cartaoLuhn(
  numero: string,
): boolean {
  const digits =
    numero.replace(
      /\D/g,
      '',
    );

  if (
    digits.length < 13 ||
    digits.length > 19
  ) {
    return false;
  }

  let soma = 0;
  let dobrar = false;

  for (
    let i = digits.length - 1;
    i >= 0;
    i--
  ) {
    let digito =
      Number(
        digits.charAt(i),
      );

    if (dobrar) {
      digito *= 2;

      if (
        digito > 9
      ) {
        digito -= 9;
      }
    }

    soma += digito;

    dobrar =
      !dobrar;
  }

  return (
    soma % 10 === 0
  );
}

function cartaoValidator(): ValidatorFn {
  return (
    control,
  ): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    return cartaoLuhn(
      String(control.value),
    )
      ? null
      : {
          cartaoInvalido: true,
        };
  };
}

/* =========================================================
   NOME
========================================================= */

function nomeCartaoValidator(): ValidatorFn {
  return (
    control,
  ): ValidationErrors | null => {
    const nome =
      String(
        control.value ?? '',
      ).trim();

    if (!nome) {
      return null;
    }

    if (
      !/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(
        nome,
      )
    ) {
      return {
        nomeInvalido: true,
      };
    }

    return null;
  };
}

/* =========================================================
   VALIDADE DO CARTÃO
   Formato: MM/AA
========================================================= */

function validadeCartaoValidator(): ValidatorFn {
  return (
    control,
  ): ValidationErrors | null => {
    const valor =
      String(
        control.value ?? '',
      ).trim();

    if (!valor) {
      return null;
    }

    const match =
      valor.match(
        /^(0[1-9]|1[0-2])\/(\d{2})$/,
      );

    if (!match) {
      return {
        formatoValidadeInvalido:
          true,
      };
    }

    const mes =
      Number(match[1]);

    const ano =
      2000 +
      Number(match[2]);

    const agora =
      new Date();

    const anoAtual =
      agora.getFullYear();

    const mesAtual =
      agora.getMonth() + 1;

    if (
      ano < anoAtual ||
      (
        ano === anoAtual &&
        mes < mesAtual
      )
    ) {
      return {
        validadeExpirada:
          true,
      };
    }

    return null;
  };
}

/* =========================================================
   COMPONENTE
========================================================= */

@Component({
  selector: 'app-pagamento-cartao',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl:
    './pagamento-cartao.html',
  styleUrl:
    './pagamento-cartao.css',
})
export class PagamentoCartao {
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

  /* =======================================================
     ESTADO
  ======================================================= */

  readonly sucesso =
    signal(false);

  readonly processando =
    signal(false);

  readonly erro =
    signal('');

  /* =======================================================
     SNAPSHOT DA COMPRA
  ======================================================= */

  readonly itensCompra =
    signal<ItemCarrinho[]>(
      [],
    );

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

  /* =======================================================
     USUÁRIO
  ======================================================= */

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
          ?.trim() ||
        '',
    );

  /* =======================================================
     FORMULÁRIO
  ======================================================= */

  readonly formulario =
    this.fb.nonNullable.group({
      nomeTitular: [
        '',
        [
          Validators.required,
          Validators.minLength(
            3,
          ),
          nomeCartaoValidator(),
        ],
      ],

      cpf: [
        '',
        [
          Validators.required,
          cpfValidator(),
        ],
      ],

      numeroCartao: [
        '',
        [
          Validators.required,
          cartaoValidator(),
        ],
      ],

      validade: [
        '',
        [
          Validators.required,
          validadeCartaoValidator(),
        ],
      ],

      cvv: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^\d{3,4}$/,
          ),
        ],
      ],
    });

  constructor() {
    const nome =
      this.compradorLogado();

    if (nome) {
      this.formulario.controls.nomeTitular.setValue(
        nome,
      );
    }
  }

  /* =======================================================
     MOEDA
  ======================================================= */

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

  /* =======================================================
     QUANTIDADE
  ======================================================= */

  quantidadeTotalItens(): number {
    return this.carrinhoFacade
      .itens()
      .reduce(
        (
          total,
          item,
        ) =>
          total +
          (
            item.quantidade ||
            1
          ),
        0,
      );
  }

  totalAtual(): number {
    return this.carrinhoFacade.total();
  }

  /* =======================================================
     CPF — MÁSCARA
  ======================================================= */

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
        emitEvent:
          true,
      },
    );
  }

  /* =======================================================
     CARTÃO — MÁSCARA
  ======================================================= */

  mascararCartao(
    event: Event,
  ): void {
    const input =
      event.target as HTMLInputElement;

    let digits =
      input.value
        .replace(/\D/g, '')
        .slice(0, 19);

    const grupos:
      string[] = [];

    while (
      digits.length > 4
    ) {
      grupos.push(
        digits.slice(
          0,
          4,
        ),
      );

      digits =
        digits.slice(4);
    }

    if (digits) {
      grupos.push(
        digits,
      );
    }

    input.value =
      grupos.join(' ');

    this.formulario.controls.numeroCartao.setValue(
      input.value,
      {
        emitEvent:
          true,
      },
    );
  }

  /* =======================================================
     VALIDADE — MM/AA
  ======================================================= */

  formatarValidade(
    event: Event,
  ): void {
    const input =
      event.target as HTMLInputElement;

    let digits =
      input.value
        .replace(/\D/g, '')
        .slice(0, 4);

    /*
     * A barra é colocada automaticamente depois
     * dos dois primeiros dígitos.
     *
     * Exemplo:
     * 0
     * 05
     * 05/
     * 05/29
     */

    if (
      digits.length >= 2
    ) {
      digits =
        `${digits.slice(
          0,
          2,
        )}/${digits.slice(2)}`;
    }

    input.value =
      digits;

    this.formulario.controls.validade.setValue(
      digits,
      {
        emitEvent:
          true,
      },
    );
  }

  /* =======================================================
     CVV
  ======================================================= */

  limitarCvv(
    event: Event,
  ): void {
    const input =
      event.target as HTMLInputElement;

    input.value =
      input.value
        .replace(
          /\D/g,
          '',
        )
        .slice(
          0,
          4,
        );

    this.formulario.controls.cvv.setValue(
      input.value,
      {
        emitEvent:
          true,
      },
    );
  }

  /* =======================================================
     PAGAMENTO
  ======================================================= */

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
      checkoutValidado =
        false;
    }

    if (
      !checkoutValidado
    ) {
      this.erro.set(
        'Finalize o checkout antes de iniciar o pagamento.',
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
        'Seu carrinho está vazio. Adicione produtos antes de pagar.',
      );

      return;
    }

    if (
      this.formulario.invalid
    ) {
      this.formulario.markAllAsTouched();

      this.erro.set(
        this.mensagemErroFormulario(),
      );

      return;
    }

    const numero =
      this.formulario.controls
        .numeroCartao.value;

    if (
      !cartaoLuhn(numero)
    ) {
      this.formulario.controls.numeroCartao.setErrors(
        {
          ...(this.formulario.controls.numeroCartao.errors ??
            {}),
          cartaoInvalido:
            true,
        },
      );

      this.erro.set(
        'O número do cartão não passou na validação matemática.',
      );

      return;
    }

    const validade =
      this.formulario.controls
        .validade.value;

    const erroValidade =
      this.validarValidade(
        validade,
      );

    if (
      erroValidade
    ) {
      this.formulario.controls.validade.setErrors(
        {
          ...(this.formulario.controls.validade.errors ??
            {}),
          ...erroValidade,
        },
      );

      this.erro.set(
        erroValidade['validadeExpirada']
          ? 'O cartão está expirado.'
          : 'A validade deve estar no formato MM/AA e representar um mês válido.',
      );

      return;
    }

    const cpf =
      this.formulario.controls
        .cpf.value;

    if (
      !cpfValido(cpf)
    ) {
      this.formulario.controls.cpf.setErrors(
        {
          ...(this.formulario.controls.cpf.errors ??
            {}),
          cpfInvalido:
            true,
        },
      );

      this.erro.set(
        'O CPF informado é inválido.',
      );

      return;
    }

    const itens =
      this.carrinhoFacade
        .itens()
        .map(
          (
            item,
          ) => ({
            ...item,
            quantidade:
              item.quantidade ||
              1,
          }),
        );

    const total =
      this.carrinhoFacade.total();

    if (
      !itens.length
    ) {
      this.erro.set(
        'Não foi possível identificar os produtos da compra.',
      );

      return;
    }

    if (
      !Number.isFinite(
        total,
      ) ||
      total <= 0
    ) {
      this.erro.set(
        'O valor total da compra é inválido.',
      );

      return;
    }

    /*
     * SNAPSHOT:
     * tudo o que o comprovante precisa é copiado
     * antes de limpar o carrinho.
     *
     * NUNCA copiamos:
     * - número completo do cartão
     * - validade
     * - CVV
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

    this.cpfComprador.set(
      this.formatarCpfTexto(
        cpf,
      ),
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
          dateStyle:
            'short',
          timeStyle:
            'short',
        },
      ).format(
        new Date(),
      ),
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

        /*
         * O carrinho só é limpo DEPOIS
         * do snapshot.
         */
        this.carrinhoFacade
          .limparCarrinho();

        /*
         * Dados financeiros são removidos
         * imediatamente após a simulação.
         */
        this.formulario.reset(
          {
            nomeTitular:
              this.nomeComprador(),

            cpf:
              '',

            numeroCartao:
              '',

            validade:
              '',

            cvv:
              '',
          },
        );

        try {
          sessionStorage.removeItem(
            'caribe-checkout-validado',
          );
        } catch {
          // Ignora.
        }
      },
      1500,
    );
  }

  /* =======================================================
     VALIDAÇÃO DE DATA
  ======================================================= */

  private validarValidade(
    valor: string,
  ): ValidationErrors | null {
    const match =
      valor.match(
        /^(0[1-9]|1[0-2])\/(\d{2})$/,
      );

    if (!match) {
      return {
        formatoValidadeInvalido:
          true,
      };
    }

    const mes =
      Number(match[1]);

    const ano =
      2000 +
      Number(match[2]);

    const agora =
      new Date();

    const anoAtual =
      agora.getFullYear();

    const mesAtual =
      agora.getMonth() + 1;

    if (
      ano < anoAtual ||
      (
        ano === anoAtual &&
        mes < mesAtual
      )
    ) {
      return {
        validadeExpirada:
          true,
      };
    }

    return null;
  }

  /* =======================================================
     MENSAGENS DE ERRO
  ======================================================= */

  private mensagemErroFormulario(): string {
    const nome =
      this.formulario.controls
        .nomeTitular;

    const cpf =
      this.formulario.controls
        .cpf;

    const numero =
      this.formulario.controls
        .numeroCartao;

    const validade =
      this.formulario.controls
        .validade;

    const cvv =
      this.formulario.controls
        .cvv;

    if (
      nome.hasError(
        'required',
      )
    ) {
      return 'Informe o nome do titular do cartão.';
    }

    if (
      nome.hasError(
        'minlength',
      )
    ) {
      return 'O nome do titular deve possuir pelo menos 3 caracteres.';
    }

    if (
      nome.hasError(
        'nomeInvalido',
      )
    ) {
      return 'O nome deve conter apenas letras, espaços e hífen.';
    }

    if (
      cpf.hasError(
        'required',
      )
    ) {
      return 'Informe o CPF do comprador.';
    }

    if (
      cpf.hasError(
        'cpfInvalido',
      )
    ) {
      return 'O CPF informado é inválido.';
    }

    if (
      numero.hasError(
        'required',
      )
    ) {
      return 'Informe o número do cartão.';
    }

    if (
      numero.hasError(
        'cartaoInvalido',
      )
    ) {
      return 'O número do cartão é inválido.';
    }

    if (
      validade.hasError(
        'required',
      )
    ) {
      return 'Informe a validade do cartão.';
    }

    if (
      validade.hasError(
        'formatoValidadeInvalido',
      )
    ) {
      return 'Digite a validade no formato MM/AA.';
    }

    if (
      validade.hasError(
        'validadeExpirada',
      )
    ) {
      return 'A validade do cartão está expirada.';
    }

    if (
      cvv.hasError(
        'required',
      )
    ) {
      return 'Informe o CVV.';
    }

    if (
      cvv.hasError(
        'pattern',
      )
    ) {
      return 'O CVV deve possuir 3 ou 4 números.';
    }

    return 'Confira os dados do cartão antes de continuar.';
  }

  /* =======================================================
     CPF PARA COMPROVANTE
  ======================================================= */

  private formatarCpfTexto(
    valor: string,
  ): string {
    const digits =
      valor.replace(
        /\D/g,
        '',
      );

    if (
      digits.length !== 11
    ) {
      return 'CPF informado';
    }

    return `${digits.slice(
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

  /* =======================================================
     DOCUMENTOS SIMULADOS
  ======================================================= */

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
    const caracteres =
      'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    let codigo =
      'AUTH-';

    for (
      let i = 0;
      i < 6;
      i++
    ) {
      codigo +=
        caracteres.charAt(
          Math.floor(
            Math.random() *
              caracteres.length,
          ),
        );
    }

    return codigo;
  }

  /* =======================================================
     IMPRESSÃO
  ======================================================= */

  imprimirComprovante(): void {
    if (
      isPlatformBrowser(
        this.platformId,
      )
    ) {
      window.print();
    }
  }
}