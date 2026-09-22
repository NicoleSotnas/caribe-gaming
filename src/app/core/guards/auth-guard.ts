import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = async () => {
  const navegador = isPlatformBrowser(inject(PLATFORM_ID));
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!navegador) return true; // SSR: deixa passar; a decisão real acontece no navegador

  await auth.pronto;
  if (auth.usuarioAtualSnapshot) return true;

  router.navigate(['/login']);
  return false;
};