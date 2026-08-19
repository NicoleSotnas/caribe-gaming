import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Home } from './home/home/home';
import { ProdutosComponent } from './features/produtos/produtos';
import { Carrinho } from './features/carrinho/carrinho';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'catalogo',
    component: ProdutosComponent,
  },
  {
    path: 'carrinho',
    component: Carrinho,
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'login', component: Login, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' },
];
