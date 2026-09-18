import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

// Tokens do Firebase para a Injeção de Dependência
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';

import { Perfil } from './perfil';

describe('Perfil', () => {
  let component: Perfil;
  let fixture: ComponentFixture<Perfil>;

  // Mock do Firebase Auth para destravar os observáveis do AngularFire
  const mockAuth = {
    onIdTokenChanged: vi.fn((callback: (user: unknown) => void) => {
      callback(null);
      return () => {};
    }),
    onAuthStateChanged: vi.fn((callback: (user: unknown) => void) => {
      callback(null);
      return () => {};
    }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Perfil],
      providers: [
        provideRouter([]),
        { provide: Auth, useValue: mockAuth },
        { provide: Firestore, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(Perfil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
