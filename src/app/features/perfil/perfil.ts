import { Component, inject, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthFacade } from '../../core/facades/auth.facade';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {
  authFacade = inject(AuthFacade);
  fb = inject(FormBuilder);

  perfilForm: FormGroup;

  mensagemSucesso = signal('');
  mensagemErro = signal('');
  salvando = signal(false);

  constructor() {
    this.perfilForm = this.fb.group({
      nomeUsuario: ['', [Validators.required, Validators.minLength(3)]],
    });

    effect(() => {
      const usuario = this.authFacade.usuarioAtual();
      if (usuario) {
        this.perfilForm.patchValue({
          nomeUsuario: usuario.displayName || '',
        });
      }
    });
  }

  salvar(): void {
    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      return;
    }

    this.salvando.set(true);
    this.mensagemSucesso.set('');
    this.mensagemErro.set('');

    const { nomeUsuario } = this.perfilForm.value;

    this.authFacade
      .atualizarNomeUsuario(nomeUsuario)
      .pipe(finalize(() => this.salvando.set(false)))
      .subscribe({
        next: () => {
          this.mensagemSucesso.set('Nome de usuário atualizado com sucesso!');
        },
        error: (erro) => {
          console.error('Erro ao atualizar nome:', erro);
          this.mensagemErro.set('Não foi possível salvar. Tente novamente.');
        },
      });
  }
}
