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

  // Regex estrita que exige algo@dominio.com (exige ponto e pelo menos 2 letras após o ponto)
  private emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';

  formulario: FormGroup = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
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