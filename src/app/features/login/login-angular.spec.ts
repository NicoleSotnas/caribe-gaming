import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { AuthService } from '../../core/services/auth';
import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockAuthService = {
    loginAsync: vi.fn().mockResolvedValue({}),
    loginComGoogleAsync: vi.fn().mockResolvedValue({}),
    recuperarSenhaAsync: vi.fn().mockResolvedValue({}),
};

describe('Login - Teste Padrão Angular TestBed', () => {
    let component: Login;
    let fixture: ComponentFixture<Login>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Login],
            providers: [
                provideRouter([]),
                { provide: AuthService, useValue: mockAuthService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(Login);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('deve verificar se o botão de login está presente no DOM', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const loginButton = compiled.querySelector('button[type="submit"]');

        expect(loginButton).toBeTruthy();
    });

    it('deve verificar se o botão de esqueci a senha existe no DOM', () => {
        const forgotPasswordEl = fixture.debugElement.query(
            By.css('button.link-esqueci')
        );

        expect(forgotPasswordEl).toBeTruthy();
    });
});