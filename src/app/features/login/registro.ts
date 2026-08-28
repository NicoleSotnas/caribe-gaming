import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';

function emailValidoValidator(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (!valor) return null;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(valor) ? null : { emailInvalido: true };
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  registroForm: FormGroup;
  mensagemErro: string = '';
  carregando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registroForm = this.fb.group(
      {
        nome: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, emailValidoValidator]],
        senha: ['', [Validators.required, Validators.minLength(6)]],
        confirmarSenha: ['', [Validators.required]],
      },
      { validators: this.senhasIguaisValidator },
    );
  }

  senhasIguaisValidator(grupo: AbstractControl): ValidationErrors | null {
    const senha = grupo.get('senha')?.value;
    const confirmarSenha = grupo.get('confirmarSenha')?.value;
    return senha === confirmarSenha ? null : { senhasDiferentes: true };
  }

  onSubmit(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.carregando = true;
    this.mensagemErro = '';

    const { nome, email, senha } = this.registroForm.value;

    this.authService.registrar(email, senha, nome).subscribe({
      next: () => {
        this.carregando = false;
        this.router.navigate(['/']);
      },
      error: (erro) => {
        this.carregando = false;
        this.mensagemErro = this.traduzirErro(erro.code);
        console.error(erro);
      },
    });
  }

  private traduzirErro(codigo: string): string {
    switch (codigo) {
      case 'auth/email-already-in-use':
        return 'Esse email já está cadastrado.';
      case 'auth/invalid-email':
        return 'Email inválido.';
      case 'auth/weak-password':
        return 'A senha é muito fraca.';
      default:
        return 'Erro ao criar conta. Tente novamente.';
    }
  }
}
