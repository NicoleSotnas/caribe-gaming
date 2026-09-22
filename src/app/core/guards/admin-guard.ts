import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = async () => {
  const navegador = isPlatformBrowser(inject(PLATFORM_ID));
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!navegador) return true;

  await auth.pronto;
  const usuario = auth.usuarioAtualSnapshot;
  if (!usuario) {
    router.navigate(['/login']);
    return false;
  }

  const papel = await auth.buscarPapel(usuario.uid);
  if (papel === 'admin') return true;

  router.navigate(['/']);
  return false;
};