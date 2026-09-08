import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  recuperarForm: FormGroup;

  mensagemErro: string = '';
  mensagemSucesso: string = '';
  carregando: boolean = false;
  modoRecuperacao: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.recuperarForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.carregando = true;
    this.mensagemErro = '';

    const { email, senha } = this.loginForm.value;

    this.authService.login(email, senha).subscribe({
      next: () => {
        this.carregando = false;
        this.router.navigate(['/']);
      },
      error: (erro) => {
        this.carregando = false;
        this.mensagemErro = 'Email ou senha inválidos. Tente novamente.';
        console.error(erro);
      },
    });
  }

  onGoogleLogin(): void {
    this.carregando = true;
    this.mensagemErro = '';

    this.authService.loginComGoogle().subscribe({
      next: () => {
        this.carregando = false;
        this.router.navigate(['/']);
      },
      error: (erro) => {
        this.carregando = false;
        this.mensagemErro = 'Não foi possível entrar com o Google. Tente novamente.';
        console.error(erro);
      },
    });
  }

  abrirRecuperacao(): void {
    this.modoRecuperacao = true;
    this.mensagemErro = '';
    this.mensagemSucesso = '';
    this.recuperarForm.reset();
  }

  voltarParaLogin(): void {
    this.modoRecuperacao = false;
    this.mensagemErro = '';
    this.mensagemSucesso = '';
  }

  onRecuperarSenha(): void {
    if (this.recuperarForm.invalid) {
      this.recuperarForm.markAllAsTouched();
      return;
    }

    this.carregando = true;
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    const { email } = this.recuperarForm.value;

    this.authService.recuperarSenha(email).subscribe({
      next: () => {
        this.carregando = false;
        this.mensagemSucesso = 'Link de recuperação enviado com sucesso! Verifique seu email.';
      },
      error: (erro) => {
        this.carregando = false;
        this.mensagemErro =
          'Não foi possível enviar o email de recuperação. Verifique o endereço e tente novamente.';
        console.error(erro);
      },
    });
  }
}
