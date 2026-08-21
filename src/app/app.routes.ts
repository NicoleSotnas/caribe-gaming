import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Home } from './home/home/home';
import { Produtos } from './features/produtos/produtos';
import { Carrinho } from './features/carrinho/carrinho';
import { Checkout } from './features/checkout/checkout/checkout';
import { Thewitcher } from './features/produtos/thewitcher3/thewitcher/thewitcher';
import { Admin } from './features/admin/admin';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home/home').then((m) => m.Home),
  },
  {
    path: 'jogos',
    component: Produtos,
  },
  {
    path: 'jogos/the-witcher-3',
    component: Thewitcher,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'registro',
    loadComponent: () => import('./features/login/registro').then((m) => m.Registro),
  },
  {
    path: 'carrinho',
    loadComponent: () => import('./features/carrinho/carrinho').then((m) => m.Carrinho),
  },
  {
    path: 'checkout',
    component: Checkout,
  },
  {
    path: 'admin',
    component: Admin,
    canActivate: [adminGuard],
  },
  { path: '**', redirectTo: '' },
];
