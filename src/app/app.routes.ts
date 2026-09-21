import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Perfil } from './features/perfil/perfil';
import { Produtos } from './features/produtos/produtos';
import { Checkout } from './features/checkout/checkout/checkout';
import { Admin } from './features/admin/admin';
import { adminGuard } from './core/guards/admin-guard';
import { authGuard } from './core/guards/auth-guard';
import { DetalheJogo } from './features/produtos/detalhe-jogo/detalhe-jogo';

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
    // Rota única e dinâmica para qualquer jogo
    path: 'produto/:id',
    component: DetalheJogo,
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
  {
    path: 'perfil',
    component: Perfil,
    canActivate: [authGuard],
  },
  { 
    path: '**', 
    redirectTo: '' 
  },
];