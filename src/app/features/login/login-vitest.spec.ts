import { render, screen, fireEvent } from '@testing-library/angular';
import { Login } from './login';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { describe, it, expect, vi } from 'vitest';

const mockAuthService = {
  loginAsync: vi.fn().mockResolvedValue({}),
  loginComGoogleAsync: vi.fn().mockResolvedValue({}),
  recuperarSenhaAsync: vi.fn().mockResolvedValue({}),
};

describe('Login - Caixa Preta (Comportamental)', () => {
  it('deve encontrar e clicar no botão de login', async () => {
    await render(Login, {
      providers: [provideRouter([]), { provide: AuthService, useValue: mockAuthService }],
    });

    const loginButton = screen.getByRole('button', { name: /^entrar$/i });
    expect(loginButton).toBeTruthy();

    fireEvent.click(loginButton);
    expect(loginButton).toBeDefined();
  });

  it('deve encontrar e interagir com o botão de esqueci a senha', async () => {
    await render(Login, {
      providers: [provideRouter([]), { provide: AuthService, useValue: mockAuthService }],
    });

    const forgotPasswordLink = screen.getByRole('button', { name: /esqueceu a senha/i });
    expect(forgotPasswordLink).toBeTruthy();

    fireEvent.click(forgotPasswordLink);
    expect(forgotPasswordLink).toBeDefined();
  });

  // 👇 COLE ESTE NOVO TESTE AQUI (dentro do describe principal)
  it('deve permitir que o usuário digite o e-mail e a senha', async () => {
    await render(Login, {
      providers: [provideRouter([]), { provide: AuthService, useValue: mockAuthService }],
    });

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const senhaInput = screen.getByLabelText(/senha/i) as HTMLInputElement;

    fireEvent.input(emailInput, { target: { value: 'teste@email.com' } });
    fireEvent.input(senhaInput, { target: { value: 'senha123' } });

    expect(emailInput.value).toBe('teste@email.com');
    expect(senhaInput.value).toBe('senha123');
  });
}); // Fim do describe
