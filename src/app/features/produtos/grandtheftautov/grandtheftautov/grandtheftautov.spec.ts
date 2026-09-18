import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { vi } from 'vitest';

// Tokens do Firebase para a Injeção de Dependência
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';

import { GrandTheftAutoV } from './grandtheftautov';

describe('GrandTheftAutoV', () => {
  let component: GrandTheftAutoV;
  let fixture: ComponentFixture<GrandTheftAutoV>;

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

  // Mock do HttpClient para interceptar chamadas à API da RAWG
  const mockHttpClient = {
    get: vi.fn(() => of({ results: [], screenshots: [] })),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrandTheftAutoV],
      providers: [
        provideRouter([]),
        { provide: Auth, useValue: mockAuth },
        { provide: Firestore, useValue: {} },
        { provide: HttpClient, useValue: mockHttpClient },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GrandTheftAutoV);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
