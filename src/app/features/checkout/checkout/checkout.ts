import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarrinhoFacade } from '../../../core/facades/carrinho.facade';
import { AuthFacade } from '../../../core/facades/auth.facade';
import { MercadoPagoService } from '../../../core/services/mercado-pago.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  carrinhoFacade = inject(CarrinhoFacade);
  authFacade = inject(AuthFacade);
  private mercadoPagoService = inject(MercadoPagoService);
  private activatedRoute = inject(ActivatedRoute);
  private platformId = inject(PLATFORM_ID);
  private fb = inject(FormBuilder);

  compraFinalizada = signal<boolean>(false);
  metodoPagamento = signal<'pix' | 'cartao' | 'boleto'>('pix');
  segurancaAberta = signal<boolean>(false);
  processandoPagamento = signal<boolean>(false);
  erroPagamento = signal<string | null>(null);

  // Regex estrita para validação de e-mail
  private emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';

  formulario: FormGroup = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
    endereco: ['', [Validators.required, Validators.minLength(5)]],
  });

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.activatedRoute.queryParamMap.subscribe((params) => {
        const paymentId = params.get('payment_id');
        if (paymentId) {
          this.processandoPagamento.set(true);
          this.mercadoPagoService.consultarPagamento(paymentId).subscribe({
            next: (pagamento) => {
              this.processandoPagamento.set(false);
              const minhaRef = sessionStorage.getItem('caribe-ref');
              if (pagamento.status === 'approved' && pagamento.externalReference === minhaRef) {
                this.carrinhoFacade.limparCarrinho();
                sessionStorage.removeItem('caribe-ref');
                this.compraFinalizada.set(true);
              } else if (pagamento.status === 'pending' || pagamento.status === 'in_process') {
                this.erroPagamento.set(
                  'Pagamento pendente (Pix/boleto). Ele será confirmado assim que for compensado.',
                );
              } else {
                this.erroPagamento.set(`Pagamento não aprovado: ${pagamento.status}.`);
              }
            },
            error: () => {
              this.processandoPagamento.set(false);
              this.erroPagamento.set('Não foi possível confirmar o status do pagamento.');
            },
          });
        }
      });
    }

    const usuario = this.authFacade.usuarioAtual();
    if (usuario) {
      if (usuario.displayName) {
        this.formulario.patchValue({ nome: usuario.displayName });
      }
      if (usuario.email) {
        this.formulario.patchValue({ email: usuario.email });
      }
    }
  }

  campoInvalido(nomeCampo: string): boolean {
    const campo = this.formulario.get(nomeCampo);
    return !!(campo && campo.invalid && (campo.dirty || campo.touched));
  }

  selecionarPagamento(metodo: 'pix' | 'cartao' | 'boleto') {
    this.metodoPagamento.set(metodo);
  }

  toggleSeguranca() {
    this.segurancaAberta.update((v) => !v);
  }

  finalizar() {
    if (!this.formulario.valid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const email = this.formulario.get('email')?.value as string;
    this.processandoPagamento.set(true);
    this.erroPagamento.set(null);

    this.mercadoPagoService.criarPreferencia(this.carrinhoFacade.itens(), email).subscribe({
      next: (preferencia) => {
        if (isPlatformBrowser(this.platformId)) {
          sessionStorage.setItem('caribe-ref', preferencia.externalReference); // liga este navegador ao pedido
          window.location.assign(preferencia.initPoint);
        }
      },
      error: (error) => {
        this.processandoPagamento.set(false);
        this.erroPagamento.set(
          error?.error?.error || 'Não foi possível iniciar o pagamento. Tente novamente.',
        );
      },
    });
  }
}