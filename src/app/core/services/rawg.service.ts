import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface DetalhesJogo {
  id: number;
  nome: string;
  descricao: string;
  dataLancamento: string;
  desenvolvedoras: string;
  distribuidoras: string;
  classificacaoEtaria: string;
  plataformas: string;
}

export interface RawgScreenshotResponse {
  count: number;
  results: Array<{
    id: number;
    image: string;
    width: number;
    height: number;
  }>;
}

@Injectable({ providedIn: 'root' })
export class RawgService {
  private http = inject(HttpClient);
  private apiKey = '4e45dbce048d41c4adcfabbf27dbb16e';
  private baseUrl = 'https://api.rawg.io/api';

  // Retorna os detalhes mockados em português do jogo
  obterDetalhesTheWitcher3(): Observable<DetalhesJogo> {
    return of({
      id: 292030,
      nome: 'The Witcher 3: Wild Hunt',
      descricao: 'Geralt de Rivia, um caçador de monstros mutante, viaja pelos Reinos do Norte em busca de sentido, navegando por um mundo cada vez mais perigoso a serviço, chantageado ou por escolha própria. Desenvolvido pela CD PROJEKT RED, o jogo oferece um mundo aberto massivo recheado de perigos, monstros e escolhas morais profundas que moldam a história.',
      dataLancamento: '18/05/2015',
      desenvolvedoras: 'CD PROJEKT RED',
      distribuidoras: 'CD PROJEKT RED',
      classificacaoEtaria: '18+',
      plataformas: 'PC / PS5',
    });
  }

  // Busca screenshots reais em HD direto da API RAWG
  obterScreenshots(jogoIdOuSlug: string | number): Observable<RawgScreenshotResponse> {
    const url = `${this.baseUrl}/games/${jogoIdOuSlug}/screenshots?key=${this.apiKey}`;
    return this.http.get<RawgScreenshotResponse>(url);
  }
}
