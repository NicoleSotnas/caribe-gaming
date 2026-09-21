import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface DetalhesJogo {
  id: number;
  nome: string;
  descricao: string;
  dataLancamento: string;
  desenvolvedoras: string;
  distribuidoras: string;
  classificacaoEtaria: string;
  plataformas: string;
  background_image?: string;
}

export interface RawgGameResponse {
  id: number;
  name: string;
  description_raw: string;
  released: string;
  developers: Array<{ name: string }>;
  publishers: Array<{ name: string }>;
  esrb_rating?: { name: string };
  platforms: Array<{ platform: { name: string; slug: string } }>;
  genres?: Array<{ name: string }>;
  metacritic?: number;
  background_image?: string;
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
  private apiKey = '53cda31b968d4afea37f6db579e0ec8c';
  private baseUrl = 'https://api.rawg.io/api';

  /**
   * 1. Retorna os dados brutos (JSON sem tratamento) vindo da API RAWG
   */
  obterGameRaw(jogoIdOuSlug: string | number): Observable<RawgGameResponse> {
    const url = `${this.baseUrl}/games/${jogoIdOuSlug}?key=${this.apiKey}`;
    return this.http.get<RawgGameResponse>(url);
  }

  /**
   * 2. Retorna os detalhes do jogo já mapeados para a tua interface DetalhesJogo
   */
  obterDetalhesJogo(jogoIdOuSlug: string | number): Observable<DetalhesJogo> {
    return this.obterGameRaw(jogoIdOuSlug).pipe(
      map((res) => this.mapearGameParaDetalhes(res))
    );
  }

  /**
   * 3. Retorna as imagens (screenshots) da galeria
   */
  obterScreenshots(jogoIdOuSlug: string | number): Observable<RawgScreenshotResponse> {
    const url = `${this.baseUrl}/games/${jogoIdOuSlug}/screenshots?key=${this.apiKey}`;
    return this.http.get<RawgScreenshotResponse>(url);
  }

  /**
   * Mapeia a resposta bruta da RAWG para a interface limpa usada nas telas
   */
  private mapearGameParaDetalhes(res: RawgGameResponse): DetalhesJogo {
    return {
      id: res.id,
      nome: res.name,
      descricao: res.description_raw || 'Sem descrição disponível.',
      dataLancamento: res.released ? new Date(res.released).toLocaleDateString('pt-BR') : 'N/A',
      desenvolvedoras: res.developers?.map((d) => d.name).join(', ') || 'Não informada',
      distribuidoras: res.publishers?.map((p) => p.name).join(', ') || 'Não informada',
      classificacaoEtaria: res.esrb_rating?.name || 'Livre',
      plataformas: res.platforms?.map((p) => p.platform.name).join(' / ') || 'PC',
      background_image: res.background_image,
    };
  }
}