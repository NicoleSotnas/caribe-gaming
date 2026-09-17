import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { AuthService } from '../../core/services/auth';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Simula o serviço de login para isolar o componente
const mockAuthService = {
  loginAsync: vi.fn().mockResolvedValue({}),
  loginComGoogleAsync: vi.fn().mockResolvedValue({}),
  recuperarSenhaAsync: vi.fn().mockResolvedValue({}),
};

describe('Login - Caixa Branca (Estrutural)', () => {
  let fixture: ComponentFixture<Login>;

  // Roda antes de cada teste: "liga" o componente na memória
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([]), { provide: AuthService, useValue: mockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    fixture.detectChanges();
  });

  // Teste 1: Verifica se a tag HTML do botão de login foi construída corretamente
  it('deve conter a tag de envio (submit) no DOM', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const loginButton = compiled.querySelector('button[type="submit"]');

    expect(loginButton).toBeTruthy(); // Valida se a estrutura HTML existe
  });

  // Teste 2: Verifica se a classe CSS estrutural do botão de senha foi aplicada
  it('deve conter a classe CSS correta para o botão de recuperar senha', () => {
    const forgotPasswordEl = fixture.debugElement.query(By.css('button.link-esqueci'));

    expect(forgotPasswordEl).toBeTruthy(); // Valida a presença do seletor técnico
  });
});