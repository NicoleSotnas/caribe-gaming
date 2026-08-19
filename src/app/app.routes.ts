import { Routes } from '@angular/router';
<<<<<<< HEAD
import { Home } from './features/home/home';
=======
import { Login } from './features/login/login';
import { Home } from './features/home/home';
import { Produtos } from './features/produtos/produtos';
import { Carrinho } from './features/carrinho/carrinho';
import { authGuard } from './core/guards/auth-guard';
>>>>>>> ddcb2f384f03494cdb89a5af53e479ff241b80b2

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
<<<<<<< HEAD
];
=======
  {
    path: 'catalogo',
    component: Produtos,
  },
  {
    path: 'carrinho',
    component: Carrinho,
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' },
];
>>>>>>> ddcb2f384f03494cdb89a5af53e479ff241b80b2
