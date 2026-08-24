import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarrinhoFacade } from '../../../core/facades/carrinho.facade';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  carrinhoFacade = inject(CarrinhoFacade);
  private fb = inject(FormBuilder);

  compraFinalizada = signal<boolean>(false);

  formulario: FormGroup = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    endereco: ['', [Validators.required, Validators.minLength(5)]],
  });

  /**
   * Avalia se o campo está inválido e se já foi focado/modificado pelo usuário.
   */
  campoInvalido(nomeCampo: string): boolean {
    const campo = this.formulario.get(nomeCampo);
    return !!(campo && campo.invalid && (campo.dirty || campo.touched));
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