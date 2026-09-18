import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { vi } from 'vitest';

// Tokens do Firebase para a Injeção de Dependência
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';

import { App } from './app';

describe('App', () => {
  // Mock do Firebase Auth
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

  // Mock do HttpClient para interceptar chamadas de rede
  const mockHttpClient = {
    get: vi.fn(() => of({ results: [], screenshots: [] })),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: Auth, useValue: mockAuth },
        { provide: Firestore, useValue: {} },
        { provide: HttpClient, useValue: mockHttpClient },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have as title "caribe-gaming"', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance as any;
    const titleValue = typeof app.title === 'function' ? app.title() : app.title;
    expect(titleValue).toEqual('caribe-gaming');
  });
});
