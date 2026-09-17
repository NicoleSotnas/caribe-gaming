import { render, screen, fireEvent } from '@testing-library/angular';
import { Login } from './login';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { describe, it, expect, vi } from 'vitest';

// Simula o serviço de login para não depender do banco/Firebase real
const mockAuthService = {
  loginAsync: vi.fn().mockResolvedValue({}),
  loginComGoogleAsync: vi.fn().mockResolvedValue({}),
  recuperarSenhaAsync: vi.fn().mockResolvedValue({}),
};

describe('Login - Caixa Preta (Comportamental)', () => {
  // Teste 1: Simula o usuário procurando e clicando no botão de entrar
  it('deve encontrar e clicar no botão de login', async () => {
    await render(Login, {
      providers: [provideRouter([]), { provide: AuthService, useValue: mockAuthService }],
    });

    // Procura o botão pelo que o usuário lê na tela
    const loginButton = screen.getByRole('button', { name: /^entrar$/i });
    expect(loginButton).toBeTruthy(); // Confirma que ele existe

    // Simula o clique real do mouse
    fireEvent.click(loginButton);
    expect(loginButton).toBeDefined();
  });

  // Teste 2: Simula o usuário interagindo com o botão de recuperar senha
  it('deve encontrar e interagir com o botão de esqueci a senha', async () => {
    await render(Login, {
      providers: [provideRouter([]), { provide: AuthService, useValue: mockAuthService }],
    });

    // Procura o texto do link de recuperação
    const forgotPasswordLink = screen.getByRole('button', { name: /esqueceu a senha/i });
    expect(forgotPasswordLink).toBeTruthy();

    // Simula o clique
    fireEvent.click(forgotPasswordLink);
    expect(forgotPasswordLink).toBeDefined();
  });
});
