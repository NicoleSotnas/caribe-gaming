import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { vi } from 'vitest';

// Tokens do Firebase para a Injeção de Dependência
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';

import { TheLastOfUsPartii } from './the-last-of-us-part-ii';

describe('TheLastOfUsPartIi', () => {
  let component: TheLastOfUsPartii;
  let fixture: ComponentFixture<TheLastOfUsPartii>;

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

  // Mock do HttpClient para prevenir falhas de requisições externas
  const mockHttpClient = {
    get: vi.fn(() => of({ results: [], screenshots: [] })),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TheLastOfUsPartii],
      providers: [
        provideRouter([]),
        { provide: Auth, useValue: mockAuth },
        { provide: Firestore, useValue: {} },
        { provide: HttpClient, useValue: mockHttpClient },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TheLastOfUsPartii);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
