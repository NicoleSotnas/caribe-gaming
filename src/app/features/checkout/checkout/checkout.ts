import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarrinhoFacade } from '../../../core/facades/carrinho.facade';
import { AuthFacade } from '../../../core/facades/auth.facade';

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
  private fb = inject(FormBuilder);

  compraFinalizada = signal<boolean>(false);
  metodoPagamento = signal<'pix' | 'cartao' | 'boleto'>('pix');
  segurancaAberta = signal<boolean>(false);

  // Regex estrita para validação de e-mail
  private emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';

  formulario: FormGroup = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
    endereco: ['', [Validators.required, Validators.minLength(5)]],
  });

  ngOnInit(): void {
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
    if (this.formulario.valid) {
      this.carrinhoFacade.limparCarrinho();
      this.compraFinalizada.set(true);
    } else {
      this.formulario.markAllAsTouched();
    }
  }
}
