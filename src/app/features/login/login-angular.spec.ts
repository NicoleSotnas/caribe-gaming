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

describe('Login - Caixa Branca (Estrutural)', () => {
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([]), { provide: AuthService, useValue: mockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    fixture.detectChanges();
  });

  it('deve conter a tag de envio (submit) no DOM', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const loginButton = compiled.querySelector('button[type="submit"]');

    expect(loginButton).toBeTruthy();
  });

  it('deve conter a classe CSS correta para o botão de recuperar senha', () => {
    const forgotPasswordEl = fixture.debugElement.query(By.css('button.link-esqueci'));

    expect(forgotPasswordEl).toBeTruthy();
  });

  it('deve possuir um input de senha estruturado com o tipo password', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const passwordInput = compiled.querySelector('input#senha') as HTMLInputElement;

    expect(passwordInput).toBeTruthy();
    expect(passwordInput.type).toBe('password');
    expect(passwordInput.placeholder).toBe('••••••••');
  });
}); // Fim do describe
