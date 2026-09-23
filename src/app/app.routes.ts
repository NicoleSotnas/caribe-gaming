import { Routes } from '@angular/router';

import { Login } from './features/login/login';
import { Perfil } from './features/perfil/perfil';
import { Carrinho } from './features/carrinho/carrinho';
import { Checkout } from './features/checkout/checkout/checkout';
import { Produtos } from './features/produtos/produtos';
import { Admin } from './features/admin/admin';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home/home').then(
        (m) => m.Home,
      ),
  },

  {
    path: 'sobre-nos',
    loadComponent: () =>
      import('./features/sobrenos/sobrenos').then(
        (m) => m.Sobrenos,
      ),
  },

  {
    path: 'jogos',
    component: Produtos,
  },

  {
    path: 'jogos/grand-theft-auto-v',
    loadComponent: () =>
      import(
        './features/produtos/grandtheftautov/grandtheftautov/grandtheftautov'
      ).then(
        (m) => m.GrandTheftAutoV,
      ),
  },

  {
    path: 'jogos/the-witcher-3',
    loadComponent: () =>
      import(
        './features/produtos/thewitcher3/thewitcher/thewitcher'
      ).then(
        (m) => m.Thewitcher,
      ),
  },

  {
    path: 'jogos/the-sims-4',
    loadComponent: () =>
      import(
        './features/produtos/thesims4/thesims/thesims'
      ).then(
        (m) => m.TheSims,
      ),
  },

  {
    path: 'jogos/god-of-war',
    loadComponent: () =>
      import(
        './features/produtos/godofwar/godofwar/godofwar'
      ).then(
        (m) => m.GodOfWar,
      ),
  },

  {
    path: 'jogos/marvels-spider-man-remastered',
    loadComponent: () =>
      import(
        './features/produtos/marvels-spider-man-remastered/marvels-spider-man-remastered'
      ).then(
        (m) => m.MarvelsSpiderManRemastered,
      ),
  },

  {
    path: 'jogos/call-of-duty-modern-warfare-ii',
    loadComponent: () =>
      import(
        './features/produtos/call-of-duty-modern-warfare-ii/call-of-duty-modern-warfare-ii'
      ).then(
        (m) => m.CallOfDutyModernWarfareIi,
      ),
  },

  {
    path: 'jogos/a-plague-tale',
    loadComponent: () =>
      import(
        './features/produtos/a-plague-tale/a-plague-tale'
      ).then(
        (m) => m.APlagueTale,
      ),
  },

  {
    path: 'jogos/god-of-war-ragnarök',
    loadComponent: () =>
      import(
        './features/produtos/god-of-war-ragnarok/god-of-war-ragnarok'
      ).then(
        (m) => m.GodOfWarRagnarok,
      ),
  },

  {
    path: 'jogos/hollow-knight',
    loadComponent: () =>
      import(
        './features/produtos/hollow-knight/hollow-knight'
      ).then(
        (m) => m.HollowKnight,
      ),
  },

  {
    path: 'jogos/the-last-of-us-II',
    loadComponent: () =>
      import(
        './features/produtos/the-last-of-us-part-ii/the-last-of-us-part-ii'
      ).then(
        (m) => m.TheLastOfUsPartii,
      ),
  },

  {
    path: 'jogos/red-dead-redemption-2',
    loadComponent: () =>
      import(
        './features/produtos/red-dead-redemption-2/red-dead-redemption-2'
      ).then(
        (m) => m.RedDeadRedemption2,
      ),
  },

  {
    path: 'jogos/assassins-creed-iv-black-flag',
    loadComponent: () =>
      import(
        './features/produtos/assassins-creed-black-flag/assassins-creed-black-flag'
      ).then(
        (m) => m.AssassinsCreedBlackFlag,
      ),
  },

  {
    path: 'jogos/yakuza-0',
    loadComponent: () =>
      import(
        './features/produtos/yakuza/yakuza'
      ).then(
        (m) => m.Yakuza,
      ),
  },

  {
    path: 'jogos/ea-sports-fc-24',
    loadComponent: () =>
      import(
        './features/produtos/fifa/fifa'
      ).then(
        (m) => m.Fifa,
      ),
  },

  {
    path: 'jogos/life-is-strange',
    loadComponent: () =>
      import(
        './features/produtos/life-is-strange/life-is-strange'
      ).then(
        (m) => m.LifeIsStrange,
      ),
  },

  {
    path: 'jogos/the-last-of-Us',
    loadComponent: () =>
      import(
        './features/produtos/the-last-of-us/the-last-of-us'
      ).then(
        (m) => m.TheLastOfUs,
      ),
  },

  {
    path: 'jogos/f1-23',
    loadComponent: () =>
      import(
        './features/produtos/f1/f1'
      ).then(
        (m) => m.F1,
      ),
  },

  {
    path: 'jogos/elden-ring',
    loadComponent: () =>
      import(
        './features/produtos/elden-ring/elden-ring'
      ).then(
        (m) => m.EldenRing,
      ),
  },

  {
    path: 'jogos/cyberpunk-2077',
    loadComponent: () =>
      import(
        './features/produtos/cyberpunk-2077/cyberpunk-2077'
      ).then(
        (m) => m.Cyberpunk2077,
      ),
  },

  {
    path: 'jogos/marvel-rivals',
    loadComponent: () =>
      import(
        './features/produtos/marvel-rivals/marvel-rivals'
      ).then(
        (m) => m.MarvelRivals,
      ),
  },

  {
    path: 'login',
    component: Login,
  },

  {
    path: 'registro',
    loadComponent: () =>
      import('./features/login/registro').then(
        (m) => m.Registro,
      ),
  },

  {
    path: 'carrinho',
    loadComponent: () =>
      import('./features/carrinho/carrinho').then(
        (m) => m.Carrinho,
      ),
  },

  {
    path: 'checkout',
    component: Checkout,
    canActivate: [authGuard],
  },

  {
    path: 'checkout/pagamento-pix',
    loadComponent: () =>
      import(
        './features/checkout/checkout/pagamento-pix/pagamento-pix'
      ).then(
        (m) => m.PagamentoPix,
      ),
    canActivate: [authGuard],
  },

  {
    path: 'checkout/pagamento-cartao',
    loadComponent: () =>
      import(
        './features/checkout/checkout/pagamento-cartao/pagamento-cartao'
      ).then(
        (m) => m.PagamentoCartao,
      ),
    canActivate: [authGuard],
  },

  {
    path: 'checkout/pagamento-boleto',
    loadComponent: () =>
      import(
        './features/checkout/checkout/pagamento-boleto/pagamento-boleto'
      ).then(
        (m) => m.PagamentoBoleto,
      ),
    canActivate: [authGuard],
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
    redirectTo: '',
  },
];