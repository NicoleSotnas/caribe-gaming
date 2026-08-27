import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, user } from '@angular/fire/auth';
import { map, take } from 'rxjs';

const EMAIL_ADMIN = 'admin@email.com';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return user(auth).pipe(
    take(1),
    map((usuario) => {
      if (usuario?.email === EMAIL_ADMIN) {
        return true;
      }
      router.navigate(['/']);
      return false;
    }),
  );
};
