import {
  Component,
  OnInit,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser,
} from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  ActivatedRoute,
  Router,
  RouterLink,
} from '@angular/router';

import { CarrinhoFacade } from '../../../core/facades/carrinho.facade';
import { AuthFacade } from '../../../core/facades/auth.facade';
import { MercadoPagoService } from '../../../core/services/mercado-pago.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  readonly carrinhoFacade =
    inject(CarrinhoFacade);

  readonly authFacade =
    inject(AuthFacade);

  private readonly mercadoPagoService =
    inject(MercadoPagoService);

  private readonly activatedRoute =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly platformId =
    inject(PLATFORM_ID);

  private readonly fb =
    inject(FormBuilder);

  readonly compraFinalizada =
    signal(false);

  readonly metodoPagamento =
    signal<'pix' | 'cartao' | 'boleto'>(
      'pix',
    );

  readonly segurancaAberta =
    signal(false);

  readonly processandoPagamento =
    signal(false);

  readonly erroPagamento =
    signal('');

  private readonly emailPattern =
    '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';

  readonly formulario: FormGroup =
    this.fb.group({
      nome: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
        ],
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            this.emailPattern,
          ),
        ],
      ],

      endereco: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
        ],
      ],
    });

  ngOnInit(): void {
    this.preencherDadosUsuario();

    if (
      isPlatformBrowser(
        this.platformId,
      )
    ) {
      try {
        sessionStorage.removeItem(
          'caribe-checkout-validado',
        );
      } catch {
        // Ignora indisponibilidade de storage.
      }

      this.verificarRetornoMercadoPago();
    }
  }

  private preencherDadosUsuario(): void {
    const usuario =
      this.authFacade.usuarioAtual();

    if (!usuario) {
      return;
    }

    this.formulario.patchValue({
      nome:
        usuario.displayName?.trim() ??
        '',
      email:
        usuario.email?.trim() ??
        '',
    });
  }

  campoInvalido(
    nomeCampo: string,
  ): boolean {
    const campo =
      this.formulario.get(
        nomeCampo,
      );

    return !!(
      campo &&
      campo.invalid &&
      (
        campo.dirty ||
        campo.touched
      )
    );
  }

  checkoutProntoParaPagamento(): boolean {
    if (
      this.carrinhoFacade.carrinhoVazio()
    ) {
      return false;
    }

    return this.formulario.valid;
  }

  irParaPagamento(
    metodo:
      | 'pix'
      | 'cartao'
      | 'boleto',
  ): void {
    this.erroPagamento.set('');

    if (
      this.carrinhoFacade.carrinhoVazio()
    ) {
      this.erroPagamento.set(
        'Seu porão de tesouros está vazio. Adicione um jogo antes de continuar.',
      );

      return;
    }

    if (
      this.formulario.invalid
    ) {
      this.formulario.markAllAsTouched();

      const endereco =
        this.formulario.get(
          'endereco',
        );

      if (
        endereco?.hasError(
          'required',
        )
      ) {
        this.erroPagamento.set(
          'Preencha o endereço de cobrança antes de escolher uma forma de pagamento.',
        );

        return;
      }

      if (
        endereco?.hasError(
          'minlength',
        )
      ) {
        this.erroPagamento.set(
          'Informe um endereço de cobrança válido antes de continuar.',
        );

        return;
      }

      this.erroPagamento.set(
        this.mensagemErroFormulario(),
      );

      return;
    }

    this.metodoPagamento.set(
      metodo,
    );

    if (
      isPlatformBrowser(
        this.platformId,
      )
    ) {
      try {
        sessionStorage.setItem(
          'caribe-checkout-validado',
          'true',
        );
      } catch {
        // A página de pagamento ainda pode abrir normalmente.
      }
    }

    const rotas: Record<
      'pix' | 'cartao' | 'boleto',
      string
    > = {
      pix:
        '/checkout/pagamento-pix',
      cartao:
        '/checkout/pagamento-cartao',
      boleto:
        '/checkout/pagamento-boleto',
    };

    void this.router.navigateByUrl(
      rotas[metodo],
    );
  }

  toggleSeguranca(): void {
    this.segurancaAberta.update(
      (aberta) => !aberta,
    );
  }

  finalizar(): void {
    this.erroPagamento.set('');

    if (
      this.processandoPagamento()
    ) {
      return;
    }

    if (
      this.carrinhoFacade.carrinhoVazio()
    ) {
      this.erroPagamento.set(
        'Seu porão de tesouros está vazio. Adicione jogos antes de finalizar a compra.',
      );

      return;
    }

    if (
      this.formulario.invalid
    ) {
      this.formulario.markAllAsTouched();

      this.erroPagamento.set(
        this.mensagemErroFormulario(),
      );

      return;
    }

    const email =
      String(
        this.formulario.get(
          'email',
        )?.value ?? '',
      ).trim();

    if (!email) {
      this.erroPagamento.set(
        'Informe um e-mail válido para continuar.',
      );

      return;
    }

    const itens =
      this.carrinhoFacade.itens();

    if (!itens.length) {
      this.erroPagamento.set(
        'Não existem produtos válidos no carrinho.',
      );

      return;
    }

    this.processandoPagamento.set(
      true,
    );

    this.mercadoPagoService
      .criarPreferencia(
        itens,
        email,
      )
      .subscribe({
        next: (
          preferencia,
        ) => {
          if (
            !preferencia ||
            !preferencia.initPoint
          ) {
            this.erroPagamento.set(
              'O Mercado Pago não retornou um endereço de pagamento válido.',
            );

            this.processandoPagamento.set(
              false,
            );

            return;
          }

          if (
            !isPlatformBrowser(
              this.platformId,
            )
          ) {
            this.processandoPagamento.set(
              false,
            );

            return;
          }

          try {
            if (
              preferencia.externalReference
            ) {
              sessionStorage.setItem(
                'caribe-ref',
                preferencia.externalReference,
              );
            } else {
              sessionStorage.removeItem(
                'caribe-ref',
              );
            }
          } catch {
            // Continua mesmo se o storage estiver indisponível.
          }

          window.location.assign(
            preferencia.initPoint,
          );
        },

        error: (
          erro: unknown,
        ) => {
          console.error(
            'Erro ao iniciar o Mercado Pago:',
            erro,
          );

          this.erroPagamento.set(
            this.extrairMensagemErro(
              erro,
              'Não foi possível iniciar o pagamento. Tente novamente.',
            ),
          );

          this.processandoPagamento.set(
            false,
          );
        },
      });
  }

  voltarCarrinho(): void {
    void this.router.navigateByUrl(
      '/carrinho',
    );
  }

  voltarJogos(): void {
    void this.router.navigateByUrl(
      '/jogos',
    );
  }

  private verificarRetornoMercadoPago(): void {
    this.activatedRoute.queryParamMap.subscribe(
      (params) => {
        const paymentId =
          params.get(
            'payment_id',
          );

        const status =
          params.get(
            'status',
          );

        const referenciaUrl =
          params.get(
            'external_reference',
          );

        if (paymentId) {
          this.consultarPagamento(
            paymentId,
            referenciaUrl,
          );

          return;
        }

        if (
          status ===
          'approved'
        ) {
          this.carrinhoFacade.limparCarrinho();

          this.compraFinalizada.set(
            true,
          );

          this.processandoPagamento.set(
            false,
          );

          return;
        }

        if (
          status ===
          'pending'
        ) {
          this.erroPagamento.set(
            'O pagamento ainda está pendente no Mercado Pago. Aguarde a confirmação.',
          );

          this.processandoPagamento.set(
            false,
          );

          return;
        }

        if (
          status ===
          'failure'
        ) {
          this.erroPagamento.set(
            'O pagamento não foi aprovado pelo Mercado Pago.',
          );

          this.processandoPagamento.set(
            false,
          );
        }
      },
    );
  }

  private consultarPagamento(
    paymentId: string,
    referenciaDaUrl:
      | string
      | null,
  ): void {
    this.processandoPagamento.set(
      true,
    );

    this.erroPagamento.set('');

    let referenciaEsperada =
      '';

    if (
      isPlatformBrowser(
        this.platformId,
      )
    ) {
      try {
        referenciaEsperada =
          referenciaDaUrl?.trim() ||
          sessionStorage.getItem(
            'caribe-ref',
          )?.trim() ||
          '';
      } catch {
        referenciaEsperada =
          referenciaDaUrl?.trim() ||
          '';
      }
    } else {
      referenciaEsperada =
        referenciaDaUrl?.trim() ||
        '';
    }

    if (!referenciaEsperada) {
      this.processandoPagamento.set(
        false,
      );

      this.erroPagamento.set(
        'Não foi possível identificar a referência desta compra para confirmar o pagamento.',
      );

      return;
    }

    this.mercadoPagoService
      .consultarPagamento(
        paymentId,
        referenciaEsperada,
      )
      .subscribe({
        next: (
          pagamento,
        ) => {
          const referenciaRecebida =
            pagamento.externalReference
              ?.trim() ??
            '';

          const referenciaConfere =
            referenciaRecebida !== '' &&
            referenciaRecebida ===
              referenciaEsperada;

          const statusPagamento =
            pagamento.status;

          if (
            statusPagamento ===
              'approved' &&
            referenciaConfere
          ) {
            this.carrinhoFacade.limparCarrinho();

            this.compraFinalizada.set(
              true,
            );

            this.processandoPagamento.set(
              false,
            );

            if (
              isPlatformBrowser(
                this.platformId,
              )
            ) {
              try {
                sessionStorage.removeItem(
                  'caribe-ref',
                );
              } catch {
                // Ignora.
              }
            }

            return;
          }

          if (
            statusPagamento ===
              'approved' &&
            !referenciaConfere
          ) {
            this.erroPagamento.set(
              'O pagamento foi aprovado, mas a referência da compra não corresponde ao pedido atual.',
            );

            this.processandoPagamento.set(
              false,
            );

            return;
          }

          if (
            statusPagamento ===
              'pending' ||
            statusPagamento ===
              'in_process'
          ) {
            this.erroPagamento.set(
              'O pagamento foi recebido, mas ainda está sendo processado pelo Mercado Pago.',
            );

            this.processandoPagamento.set(
              false,
            );

            return;
          }

          if (
            statusPagamento ===
            'rejected'
          ) {
            this.erroPagamento.set(
              'O pagamento foi recusado pelo Mercado Pago.',
            );

            this.processandoPagamento.set(
              false,
            );

            return;
          }

          if (
            statusPagamento ===
            'cancelled'
          ) {
            this.erroPagamento.set(
              'O pagamento foi cancelado.',
            );

            this.processandoPagamento.set(
              false,
            );

            return;
          }

          this.erroPagamento.set(
            `Pagamento não aprovado: ${
              statusPagamento ||
              'status desconhecido'
            }.`,
          );

          this.processandoPagamento.set(
            false,
          );
        },

        error: (
          erro: unknown,
        ) => {
          console.error(
            'Erro ao consultar pagamento:',
            erro,
          );

          this.erroPagamento.set(
            this.extrairMensagemErro(
              erro,
              'Não foi possível confirmar o status do pagamento.',
            ),
          );

          this.processandoPagamento.set(
            false,
          );
        },
      });
  }

  private mensagemErroFormulario(): string {
    const nome =
      this.formulario.get(
        'nome',
      );

    const email =
      this.formulario.get(
        'email',
      );

    const endereco =
      this.formulario.get(
        'endereco',
      );

    if (
      nome?.hasError(
        'required',
      )
    ) {
      return 'Informe seu nome completo.';
    }

    if (
      nome?.hasError(
        'minlength',
      )
    ) {
      return 'O nome completo deve possuir pelo menos 3 caracteres.';
    }

    if (
      email?.hasError(
        'required',
      )
    ) {
      return 'Informe um e-mail para continuar.';
    }

    if (
      email?.hasError(
        'pattern',
      )
    ) {
      return 'Informe um e-mail válido para receber as informações da compra.';
    }

    if (
      endereco?.hasError(
        'required',
      )
    ) {
      return 'Preencha o endereço de cobrança antes de continuar.';
    }

    if (
      endereco?.hasError(
        'minlength',
      )
    ) {
      return 'Informe um endereço de cobrança válido com pelo menos 5 caracteres.';
    }

    return 'Confira os dados obrigatórios antes de continuar.';
  }

  private extrairMensagemErro(
    erro: unknown,
    mensagemPadrao: string,
  ): string {
    if (
      erro instanceof Error &&
      erro.message.trim()
    ) {
      return erro.message;
    }

    if (
      typeof erro ===
        'object' &&
      erro !== null
    ) {
      const resposta =
        erro as {
          error?: {
            error?: unknown;
            message?: unknown;
          };
          message?: unknown;
        };

      if (
        typeof resposta
          .error?.error ===
          'string' &&
        resposta.error.error.trim()
      ) {
        return resposta.error.error;
      }

      if (
        typeof resposta
          .error?.message ===
          'string' &&
        resposta.error.message.trim()
      ) {
        return resposta.error.message;
      }

      if (
        typeof resposta.message ===
          'string' &&
        resposta.message.trim()
      ) {
        return resposta.message;
      }
    }

    return mensagemPadrao;
  }
}