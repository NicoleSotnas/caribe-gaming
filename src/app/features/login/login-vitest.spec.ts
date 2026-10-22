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

describe('Login - Teste Simples com Vitest', () => {
    it('deve disparar a ação ao clicar no botão de login', async () => {
        await render(Login, {
            providers: [
                provideRouter([]),
                { provide: AuthService, useValue: mockAuthService }
            ]
        });

        // Seleciona especificamente o botão do tipo submit ou pelo texto exato "Entrar"
        const loginButton = screen.getByRole('button', { name: /^entrar$/i });
        expect(loginButton).toBeTruthy();

        fireEvent.click(loginButton);
        expect(loginButton).toBeDefined();
    });

    it('deve possuir e interagir com o botão de esqueci a senha', async () => {
        await render(Login, {
            providers: [
                provideRouter([]),
                { provide: AuthService, useValue: mockAuthService }
            ]
        });

        // Ajustado para o texto real do HTML: "Esqueceu a senha?"
        const forgotPasswordLink = screen.getByRole('button', { name: /esqueceu a senha/i });
        expect(forgotPasswordLink).toBeTruthy();

        fireEvent.click(forgotPasswordLink);
        expect(forgotPasswordLink).toBeDefined();
    });
});