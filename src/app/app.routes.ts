import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Produtos} from './features/produtos/produtos';
import { Carrinho } from './features/carrinho/carrinho';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'catalogo',
    component: Produtos,
  },
  {
    path: 'carrinho',
    component: Carrinho,
  }
];