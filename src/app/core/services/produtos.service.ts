import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export type Produto = {
  id: string;
  nome: string;
  imagem: string;
  imagemPosicao: string;
  precoOriginal: string;
  precoPromocional: string;
  desconto: number;
  genero: string;
  plataforma: string;
  categorias: string[];
  slug: string;
  steamAppId?: string;
};

type ItemCatalogo = {
  id: string;
  nome: string;
  steamAppId?: string;
  imagemCustom?: string;
  imagemPosicao?: string;
  genero: string;
  plat: string;
  orig: string;
  promo: string;
  desc: number;
  categorias: string[];
  slug: string;
};

@Injectable({ providedIn: 'root' })
export class ProdutosService {

  readonly listaProdutos: ItemCatalogo[] = [
    { id: '1', nome: 'Grand Theft Auto V', steamAppId: '271590', genero: 'Ação / Mundo Aberto', plat: 'PC', orig: 'R$ 149,90', promo: 'R$ 74,95', desc: 50, categorias: ['mundo-aberto'], slug: 'grand-theft-auto-v' },
    { id: '2', nome: 'The Witcher 3: Wild Hunt', steamAppId: '292030', genero: 'RPG / Mundo Aberto', plat: 'PC / PS5', orig: 'R$ 129,99', promo: 'R$ 129,99', desc: 0, categorias: ['rpg'], slug: 'the-witcher-3-wild-hunt' },
    { id: '3', nome: 'The Sims 4', steamAppId: '1222670', genero: 'Simulação', plat: 'PC', orig: 'Grátis', promo: 'Grátis', desc: 0, categorias: ['simulacao'], slug: 'the-sims-4' },
    { id: '4', nome: 'God of War', steamAppId: '1593500', genero: 'Ação / Aventura', plat: 'PC / PS5', orig: 'R$ 199,90', promo: 'R$ 199,90', desc: 0, categorias: ['acao'], slug: 'god-of-war-4' },
    { id: '5', nome: 'Marvel\'s Spider-Man Remastered', steamAppId: '1817070', genero: 'Ação / Aventura', plat: 'PC / PS5', orig: 'R$ 349,90', promo: 'R$ 199,90', desc: 42, categorias: ['mundo-aberto'], slug: 'marvels-spider-man-remastered' },
    { id: '6', nome: 'Call of Duty: Modern Warfare II', steamAppId: '1938090', genero: 'Tiro / FPS', plat: 'PC', orig: 'R$ 299,00', promo: 'R$ 299,00', desc: 0, categorias: ['acao'], slug: 'call-of-duty-modern-warfare-ii-2022' },
    { id: '7', nome: 'A Plague Tale: Innocence', steamAppId: '752590', genero: 'Aventura / Mistério', plat: 'PC', orig: 'R$ 229,00', promo: 'R$ 91,60', desc: 60, categorias: ['aventura'], slug: 'a-plague-tale-innocence' },
    { id: '8', nome: 'God of War Ragnarök', steamAppId: '2322010', genero: 'Ação / Aventura', plat: 'PC / PS5', orig: 'R$ 249,90', promo: 'R$ 249,90', desc: 0, categorias: ['acao'], slug: 'god-of-war-ragnarok' },
    { id: '9', nome: 'Hollow Knight', steamAppId: '367520', genero: 'Metroidvania', plat: 'PC', orig: 'R$ 46,99', promo: 'R$ 46,99', desc: 0, categorias: ['acao'], slug: 'hollow-knight' },
    { id: '10', nome: 'Red Dead Redemption 2', steamAppId: '1174180', genero: 'Ação / Mundo Aberto', plat: 'PC / PS5', orig: 'R$ 299,90', promo: 'R$ 98,96', desc: 67, categorias: ['mundo-aberto'], slug: 'red-dead-redemption-2' },
    { id: '11', nome: 'Assassin’s Creed IV Black Flag', steamAppId: '242050', genero: 'Ação', plat: 'PC', orig: 'R$ 119,99', promo: 'R$ 119,99', desc: 0, categorias: ['mundo-aberto'], slug: 'assassins-creed-iv-black-flag' },
    { id: '12', nome: 'Yakuza 0', steamAppId: '638970', genero: 'Ação / Luta', plat: 'PC', orig: 'R$ 83,50', promo: 'R$ 83,50', desc: 0, categorias: ['mundo-aberto'], slug: 'yakuza-0' },
    { id: '13', nome: 'EA Sports FC 24', steamAppId: '2195250', genero: 'Esportes', plat: 'PC / PS5', orig: 'R$ 350,00', promo: 'R$ 350,00', desc: 0, categorias: ['simulacao'], slug: 'ea-sports-fc-24' },
    { id: '14', nome: 'Life is Strange', steamAppId: '319630', genero: 'História Interativa', plat: 'PC', orig: 'R$ 99,00', promo: 'R$ 19,80', desc: 80, categorias: ['aventura'], slug: 'life-is-strange' },
    { id: '15', nome: 'The Last of Us Part I', steamAppId: '1888930', genero: 'Ação / Sobrevivência', plat: 'PC / PS5', orig: 'R$ 249,90', promo: 'R$ 249,90', desc: 0, categorias: ['aventura'], slug: 'the-last-of-us-part-i' },
    { id: '16', nome: 'F1 23', steamAppId: '2108330', genero: 'Corrida', plat: 'PC', orig: 'R$ 350,00', promo: 'R$ 143,60', desc: 60, categorias: ['simulacao'], slug: 'f1-23' },
    { id: '17', nome: 'Elden Ring', steamAppId: '1245620', genero: 'RPG / Souls-like', plat: 'PC / PS5', orig: 'R$ 229,90', promo: 'R$ 229,90', desc: 0, categorias: ['rpg'], slug: 'elden-ring' },
    { id: '18', nome: 'Cyberpunk 2077', steamAppId: '1091500', genero: 'RPG / Sci-Fi', plat: 'PC', orig: 'R$ 199,90', promo: 'R$ 99,95', desc: 50, categorias: ['rpg'], slug: 'cyberpunk-2077' },
    { id: '19', nome: 'Marvel Rivals', steamAppId: '2767030', genero: 'Hero Shooter', plat: 'PC', orig: 'Grátis', promo: 'Grátis', desc: 0, categorias: ['acao'], slug: 'marvel-rivals' },
    { id: '20', nome: 'The Last of Us Part II', steamAppId: '2531310', genero: 'Ação / Sobrevivência', plat: 'PS5', orig: 'R$ 249,90', promo: 'R$ 249,90', desc: 0, categorias: ['aventura'], slug: 'the-last-of-us-part-ii' }
  ];

  obterProdutos(): Observable<Produto[]> {
    const produtosMapeados: Produto[] = this.listaProdutos.map(item => ({
      id: item.id,
      nome: item.nome,
      imagem: item.imagemCustom
        ? item.imagemCustom
        : `https://cdn.cloudflare.steamstatic.com/steam/apps/${item.steamAppId}/library_600x900.jpg`,
      imagemPosicao: item.imagemPosicao ?? 'center',
      precoOriginal: item.orig,
      precoPromocional: item.promo,
      desconto: item.desc,
      genero: item.genero,
      plataforma: item.plat,
      categorias: item.categorias,
      slug: item.slug,
      steamAppId: item.steamAppId,
    }));

    return of(produtosMapeados);
  }

  obterPorId(id: string): Observable<Produto | undefined> {
    return new Observable(observer => {
      this.obterProdutos().subscribe(produtos => {
        observer.next(produtos.find(p => p.id === id));
        observer.complete();
      });
    });
  }

}