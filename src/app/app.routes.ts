import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Home } from './features/home/home';
import { Produtos } from './features/produtos/produtos';
import { Carrinho } from './features/carrinho/carrinho';
import { authGuard } from './core/guards/auth-guard';
import { Thewitcher } from './features/produtos/thewitcher3/thewitcher/thewitcher';

export const routes: Routes = [
  {
    path: '',
    component: Home,
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
    path: 'registro',
    loadComponent: () => import('./features/login/registro').then((m) => m.Registro),
  },
  {
    path: 'carrinho',
    loadComponent: () => import('./features/carrinho/carrinho').then((m) => m.Carrinho),
    canActivate: [authGuard],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' },
];
