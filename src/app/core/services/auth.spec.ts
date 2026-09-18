import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Auth as FirebaseAuth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { vi } from 'vitest';

import { Auth } from './auth';

describe('Auth', () => {
  let service: Auth;

  // Mock com os ouvintes do Firebase Auth necessários para os observables do AngularFire
  const mockFirebaseAuth = {
    onIdTokenChanged: vi.fn((callback: (user: unknown) => void) => {
      callback(null);
      return () => {};
    }),
    onAuthStateChanged: vi.fn((callback: (user: unknown) => void) => {
      callback(null);
      return () => {};
    }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: FirebaseAuth, useValue: mockFirebaseAuth },
        { provide: Firestore, useValue: {} },
      ],
    });
    service = TestBed.inject(Auth);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
