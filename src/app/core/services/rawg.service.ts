import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

export interface RawgGameResponse {
  id: number;
  name: string;
  description_raw: string; // Descrição em texto limpo vinda da RAWG
  released: string;
  developers: Array<{ name: string }>;
  publishers: Array<{ name: string }>;
  esrb_rating?: { name: string };
  platforms: Array<{ platform: { name: string } }>;
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

  // Busca os detalhes textuais de QUALQUER jogo pelo ID ou slug (ex: 'the-sims-4' ou 'the-witcher-3-wild-hunt')
  obterDetalhesJogo(jogoIdOuSlug: string | number): Observable<RawgGameResponse> {
    const url = `${this.baseUrl}/games/${jogoIdOuSlug}?key=${this.apiKey}`;
    return this.http.get<RawgGameResponse>(url);
  }

  // Busca screenshots em HD de QUALQUER jogo
  obterScreenshots(jogoIdOuSlug: string | number): Observable<RawgScreenshotResponse> {
    const url = `${this.baseUrl}/games/${jogoIdOuSlug}/screenshots?key=${this.apiKey}`;
    return this.http.get<RawgScreenshotResponse>(url);
  }
}