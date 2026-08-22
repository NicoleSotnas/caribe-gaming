import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Home } from './home/home/home';
import { Produtos } from './features/produtos/produtos';
import { Carrinho } from './features/carrinho/carrinho';
import { Checkout } from './features/checkout/checkout/checkout';
import { Thewitcher } from './features/produtos/thewitcher3/thewitcher/thewitcher';
import { TheSims } from './features/produtos/thesims4/thesims/thesims';
import { WatchDogs2 } from './features/produtos/watch-dogs-2/watch-dogs-2';
import { Grandtheftautov } from './features/produtos/grandtheftautov/grandtheftautov/grandtheftautov';
import { Godofwar } from './features/produtos/godofwar/godofwar/godofwar';
import { MarvelsSpiderManRemastered } from './features/produtos/marvels-spider-man-remastered/marvels-spider-man-remastered';
import { CallOfDutyModernWarfareIi } from './features/produtos/call-of-duty-modern-warfare-ii/call-of-duty-modern-warfare-ii';
import { APlagueTale } from './features/produtos/a-plague-tale/a-plague-tale';
import { Ragnarok } from './features/produtos/ragnarok/ragnarok';
import { HollowKnight } from './features/produtos/hollow-knight/hollow-knight';
import { RedDeadRedemption2 } from './features/produtos/red-dead-redemption-2/red-dead-redemption-2';
import { AssassinsCreedBlackFlag } from './features/produtos/assassins-creed-black-flag/assassins-creed-black-flag';
import { Yakuza } from './features/produtos/yakuza/yakuza';
import { Fifa } from './features/produtos/fifa/fifa';
import { LifeIsStrange } from './features/produtos/life-is-strange/life-is-strange';
import { TheLastOfUs } from './features/produtos/the-last-of-us/the-last-of-us';
import { F1 } from './features/produtos/f1/f1';
import { Cyberpunk2077 } from './features/produtos/cyberpunk-2077/cyberpunk-2077';
import { MarvelRivals } from './features/produtos/marvel-rivals/marvel-rivals';

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
    path: 'jogos/grand-theft-auto-v',
    component: Grandtheftautov,
  },
  {
    path: 'jogos/the-witcher-3',
    component: Thewitcher,
  },
  {
    path: 'jogos/the-sims-4',
    component: TheSims,
  },
  {
    path: 'jogos/god-of-war',
    component: Godofwar,
  },
  {
    path: 'jogos/marvels-spider-man-remastered',
    component: MarvelsSpiderManRemastered,
  },
  {
    path: 'jogos/call-of-duty-modern-warfare-ii',
    component: CallOfDutyModernWarfareIi,
  },
  {
    path: 'jogos/a-plague-tale',
    component: APlagueTale,
  },
  {
    path: 'jogos/god-of-war-ragnarök',
    component: Ragnarok,
  },
  {
    path: 'jogos/hollow-knight',
    component: HollowKnight,
  },
  {
    path: 'jogos/red-dead-redemption-2',
    component: RedDeadRedemption2,
  },
  {
    path: 'jogos/assassins-creed-iv-black-flag',
    component: AssassinsCreedBlackFlag,
  },
  {
    path: 'jogos/yakuza-0',
    component: Yakuza,
  },
  {
    path: 'jogos/ea-sports-fc-24',
    component: Fifa,
  },
  {
    path: 'jogos/life-is-strange',
    component: LifeIsStrange,
  },
  {
    path: 'jogos/the-last-of-Us',
    component: TheLastOfUs,
  },
  {
    path: 'jogos/f1-23',
    component: F1,
  },
  {
    path: 'jogos/watch-dogs-2',
    component: WatchDogs2,
  },
  {
    path: 'jogos/cyberpunk-2077',
    component: Cyberpunk2077,
  },
  {
    path: 'jogos/marvel-rivals',
    component: MarvelRivals,
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
  { path: '**', redirectTo: '' },
];
