import { Component, NgZone } from '@angular/core';
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
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  recuperarForm: FormGroup;

  modoRecuperacao: boolean = false;
  carregando: boolean = false;
  mensagemErro: string = '';
  mensagemSucesso: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, emailValidoValidator]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.recuperarForm = this.fb.group({
      email: ['', [Validators.required, emailValidoValidator]],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.carregando) return;

    this.mensagemErro = '';

    // Validação rápida imediata: se o formulário for inválido, exibe o erro na hora sem ir para a rede
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.mensagemErro = 'Email ou senha inválidos.';
      return;
    }

    this.carregando = true;
    const { email, senha } = this.loginForm.value;

    try {
      await this.authService.loginAsync(email, senha);
      this.ngZone.run(() => {
        this.carregando = false;
        this.router.navigate(['/']);
      });
    } catch (erro: any) {
      this.ngZone.run(() => {
        this.carregando = false;
        this.mensagemErro = this.traduzirErro(erro?.code);
      });
      console.error(erro);
    }
  }

  async onGoogleLogin(): Promise<void> {
    if (this.carregando) return;

    this.carregando = true;
    this.mensagemErro = '';

    try {
      await this.authService.loginComGoogleAsync();
      this.ngZone.run(() => {
        this.carregando = false;
        this.router.navigate(['/']);
      });
    } catch (erro: any) {
      this.ngZone.run(() => {
        this.carregando = false;
        this.mensagemErro = 'Não foi possível entrar com o Google. Tente novamente.';
      });
      console.error(erro);
    }
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
    this.loginForm.reset();
  }

  async onRecuperarSenha(): Promise<void> {
    if (this.carregando) return;

    if (this.recuperarForm.invalid) {
      this.recuperarForm.markAllAsTouched();
      this.mensagemErro = 'Digite um email válido.';
      return;
    }

    this.carregando = true;
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    const { email } = this.recuperarForm.value;

    try {
      await this.authService.recuperarSenhaAsync(email);
      this.ngZone.run(() => {
        this.carregando = false;
        this.mensagemSucesso =
          'Email de recuperação enviado com sucesso! Verifique sua caixa de entrada.';
        this.recuperarForm.reset();
      });
    } catch (erro: any) {
      this.ngZone.run(() => {
        this.carregando = false;
        this.mensagemErro = this.traduzirErroRecuperacao(erro?.code);
      });
      console.error(erro);
    }
  }

  private traduzirErro(codigo?: string): string {
    switch (codigo) {
      case 'auth/invalid-email':
        return 'Digite um email válido.';
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Email ou senha inválidos.';
      case 'auth/too-many-requests':
        return 'Muitas tentativas. Tente novamente em alguns instantes.';
      default:
        return 'Email ou senha inválidos.';
    }
  }

  private traduzirErroRecuperacao(codigo?: string): string {
    switch (codigo) {
      case 'auth/invalid-email':
        return 'Digite um email válido.';
      case 'auth/user-not-found':
        return 'Não existe conta cadastrada com este email.';
      default:
        return 'Não foi possível enviar o email de recuperação. Tente novamente.';
    }
  }
}
