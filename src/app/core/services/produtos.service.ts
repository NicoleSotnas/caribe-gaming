import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, of, switchMap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export type Produto = {
  id: string;
  nome: string;
  imagem: string;
  precoOriginal: string;
  precoPromocional: string;
  desconto: number;
  genero: string;
  plataforma: string;
};

type ItemCatalogo = {
  id: string;
  nome: string;
  igdbId: number;
  steamAppId?: string;
  coverOverrideUrl?: string;
  genero: string;
  plat: string;
  orig: string;
  promo: string;
  desc: number;
};

@Injectable({ providedIn: 'root' })
export class ProdutosService {
  private http = inject(HttpClient);

  private readonly clientId = 'nyp1afbe3hyswfh47uvoy7fbuq1jc6';
  private readonly clientSecret = 'vubbfn635rc1hzd2u95h8tgnvrs9bd';

  readonly lista19Produtos: ItemCatalogo[] = [
    { id: '1', nome: 'Grand Theft Auto V', igdbId: 1020, steamAppId: '271590', genero: 'Ação / Mundo Aberto', plat: 'PC', orig: 'R$ 89,90', promo: 'R$ 39,90', desc: 55 },
    {
      id: '2',
      nome: 'The Witcher 3: Wild Hunt',
      igdbId: 1942,
      steamAppId: '292030',
      genero: 'RPG / Mundo Aberto',
      plat: 'PC / PS5',
      orig: 'R$ 129,99',
      promo: 'R$ 32,49',
      desc: 75
    },
    { id: '3', nome: 'The Sims 4', igdbId: 7331, steamAppId: '1222670', genero: 'Simulação', plat: 'PC', orig: 'Grátis', promo: 'Grátis', desc: 0 },
    { id: '4', nome: 'God of War', igdbId: 19560, steamAppId: '1593500', genero: 'Ação / Aventura', plat: 'PC / PS5', orig: 'R$ 199,90', promo: 'R$ 99,90', desc: 50 },
    { id: '5', nome: 'Marvel\'s Spider-Man Remastered', igdbId: 19564, steamAppId: '1817070', genero: 'Ação / Aventura', plat: 'PC / PS5', orig: 'R$ 249,90', promo: 'R$ 149,90', desc: 40 },
    { id: '6', nome: 'Call of Duty: Modern Warfare II', igdbId: 194420, steamAppId: '1938090', genero: 'Tiro / FPS', plat: 'PC', orig: 'R$ 299,00', promo: 'R$ 199,00', desc: 33 },
    { id: '7', nome: 'A Plague Tale: Innocence', igdbId: 38814, steamAppId: '752590', genero: 'Aventura / Mistério', plat: 'PC', orig: 'R$ 139,90', promo: 'R$ 34,90', desc: 75 },
    { id: '8', nome: 'God of War Ragnarök', igdbId: 119133, steamAppId: '2322010', genero: 'Ação / Aventura', plat: 'PC / PS5', orig: 'R$ 249,90', promo: 'R$ 199,90', desc: 20 },
    { id: '9', nome: 'Hollow Knight', igdbId: 12104, steamAppId: '367520', genero: 'Metroidvania', plat: 'PC', orig: 'R$ 46,99', promo: 'R$ 23,49', desc: 50 },
    {
      id: '10',
      nome: 'Red Dead Redemption 2',
      igdbId: 25076,
      steamAppId: '1174180',
      genero: 'Ação / Mundo Aberto',
      plat: 'PC / PS5',
      orig: 'R$ 299,90',
      promo: 'R$ 98,96',
      desc: 67
    },
    { id: '11', nome: 'Assassin’s Creed IV Black Flag', igdbId: 2120, steamAppId: '242050', genero: 'Ação', plat: 'PC', orig: 'R$ 119,99', promo: 'R$ 35,99', desc: 70 },
    { id: '12', nome: 'Yakuza 0', igdbId: 18017, steamAppId: '638970', genero: 'Ação / Luta', plat: 'PC', orig: 'R$ 83,50', promo: 'R$ 20,87', desc: 75 },
    { id: '13', nome: 'EA Sports FC 24', igdbId: 251280, steamAppId: '2195250', genero: 'Esportes', plat: 'PC / PS5', orig: 'R$ 350,00', promo: 'R$ 175,00', desc: 50 },
    { id: '14', nome: 'Life is Strange', igdbId: 7531, steamAppId: '319630', genero: 'História Interativa', plat: 'PC', orig: 'R$ 36,99', promo: 'R$ 7,39', desc: 80 },
    { id: '15', nome: 'The Last of Us Part I', igdbId: 204364, steamAppId: '1888930', genero: 'Ação / Sobrevivência', plat: 'PC / PS5', orig: 'R$ 249,90', promo: 'R$ 167,43', desc: 33 },
    { id: '16', nome: 'F1 23', igdbId: 243468, steamAppId: '2108330', genero: 'Corrida', plat: 'PC', orig: 'R$ 350,00', promo: 'R$ 210,00', desc: 40 },
    { id: '17', nome: 'Watch Dogs 2', igdbId: 18000, steamAppId: '447040', genero: 'Mundo Aberto', plat: 'PC', orig: 'R$ 149,99', promo: 'R$ 22,49', desc: 85 },
    { id: '18', nome: 'Cyberpunk 2077', igdbId: 1877, steamAppId: '1091500', genero: 'RPG / Sci-Fi', plat: 'PC', orig: 'R$ 199,90', promo: 'R$ 99,95', desc: 50 },
    { id: '19', nome: 'Marvel Rivals', igdbId: 295175, steamAppId: '2767030', genero: 'Hero Shooter', plat: 'PC', orig: 'Grátis', promo: 'Grátis', desc: 0 }
  ];

  private obterTokenTwitch(): Observable<string> {
    const authUrl = `https://id.twitch.tv/oauth2/token?client_id=${this.clientId}&client_secret=${this.clientSecret}&grant_type=client_credentials`;
    const proxyAuthUrl = 'https://corsproxy.io/?' + encodeURIComponent(authUrl);

    return this.http.post<any>(proxyAuthUrl, {}).pipe(
      map(res => res.access_token),
      catchError(() => of(''))
    );
  }

  private buscarJogoIGDB(item: ItemCatalogo, token: string): Observable<Produto> {
    if (!token) {
      return of(this.getFallbackProduto(item));
    }

    const targetUrl = 'https://api.igdb.com/v4/covers';
    const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(targetUrl);

    const headers = new HttpHeaders({
      'Client-ID': this.clientId,
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });

    const body = `where game = ${item.igdbId}; fields url; limit 1;`;

    return this.http.post<any[]>(proxyUrl, body, { headers }).pipe(
      map(res => {
        let capaUrl = '';

        if (res && res.length > 0 && res[0].url) {
          capaUrl = res[0].url.replace('t_thumb', 't_1080p');
          if (capaUrl.startsWith('//')) {
            capaUrl = 'https:' + capaUrl;
          }
        }

        if (!capaUrl) {
          return this.getFallbackProduto(item);
        }

        return {
          id: item.id,
          nome: item.nome,
          imagem: capaUrl,
          precoOriginal: item.orig,
          precoPromocional: item.promo,
          desconto: item.desc,
          genero: item.genero,
          plataforma: item.plat
        };
      }),
      catchError(() => of(this.getFallbackProduto(item)))
    );
  }

  private getFallbackProduto(item: ItemCatalogo): Produto {
    let fallbackImg = '';

    if (item.coverOverrideUrl) {
      fallbackImg = item.coverOverrideUrl;
    } else if (item.steamAppId) {
      fallbackImg = `https://cdn.cloudflare.steamstatic.com/steam/apps/${item.steamAppId}/library_600x900.jpg`;
    } else {
      fallbackImg = 'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/library_600x900.jpg';
    }

    return {
      id: item.id,
      nome: item.nome,
      imagem: fallbackImg,
      precoOriginal: item.orig,
      precoPromocional: item.promo,
      desconto: item.desc,
      genero: item.genero,
      plataforma: item.plat
    };
  }

  obterProdutos(): Observable<Produto[]> {
    return this.obterTokenTwitch().pipe(
      switchMap(token => {
        const requisicoes = this.lista19Produtos.map(item => this.buscarJogoIGDB(item, token));
        return forkJoin(requisicoes);
      })
    );
  }
}

