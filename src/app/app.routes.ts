import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Home } from './features/home/home';
import { Produtos } from './features/produtos/produtos';
import { Carrinho } from './features/carrinho/carrinho';
import { Checkout } from './features/checkout/checkout/checkout';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
  path: 'produtos',
  component: Produtos,
},
  {
    path: 'registro',
    loadComponent: () => import('./features/login/registro').then((m) => m.Registro),
  },
  {
    path: 'carrinho',
    loadComponent: () => import('./features/carrinho/carrinho').then((m) => m.Carrinho),
    canActivate: [authGuard],
  },
  {
  path: 'checkout',
  component: Checkout,
  canActivate: [authGuard],
},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' },
];
