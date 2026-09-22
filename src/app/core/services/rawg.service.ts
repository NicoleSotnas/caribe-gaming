import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DetalhesJogo } from '../models/jogo';

export type { DetalhesJogo};

@Injectable({ providedIn: 'root' })
export class RawgService {
  private http = inject(HttpClient);
  private apiKey = '53cda31b968d4afea37f6db579e0ec8c';
  private baseUrl = 'https://api.rawg.io/api';

  obterGameRaw(jogoIdOuSlug: string | number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/games/${jogoIdOuSlug}?key=${this.apiKey}`);
  }

  obterDetalhesJogo(jogoIdOuSlug: string | number): Observable<DetalhesJogo> {
    return this.obterGameRaw(jogoIdOuSlug).pipe(
      map((res: any) => ({
        id: res.id,
        nome: res.name,
        descricao: this.limparETraduzirTexto(res.description_raw || res.description || 'Sem descrição disponível.'),
        dataLancamento: res.released ? res.released.split('-').reverse().join('/') : 'N/A',
        desenvolvedoras: res.developers?.map((d: any) => d.name).join(', ') || 'CD PROJEKT RED',
        distribuidoras: res.publishers?.map((p: any) => p.name).join(', ') || 'Caribe Games',
        classificacaoEtaria: res.esrb_rating?.name || '+18',
        plataformas: res.platforms?.map((p: any) => p.platform.name).join(' / ') || 'PC / PS5',
        background_image: res.background_image,
        slug: res.slug
      }))
    );
  }

  obterScreenshots(jogoIdOuSlug: string | number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/games/${jogoIdOuSlug}/screenshots?key=${this.apiKey}`);
  }

  obterAddonsOuDlcs(jogoIdOuSlug: string | number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/games/${jogoIdOuSlug}/add-ons?key=${this.apiKey}`);
  }

  obterJogosSemelhantes(jogoIdOuSlug: string | number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/games/${jogoIdOuSlug}/game-series?key=${this.apiKey}`);
  }

  private limparETraduzirTexto(texto: string): string {
    if (!texto) return '';
    return texto
      .replace(/<[^>]*>/g, '')
      .replace(/Minimum:/gi, 'Mínimos:')
      .replace(/Recommended:/gi, 'Recomendados:')
      .replace(/Processor:/gi, 'Processador:')
      .replace(/Memory:/gi, 'Memória:')
      .replace(/Graphics:/gi, 'Placa de Vídeo:')
      .replace(/Storage:/gi, 'Armazenamento:')
      .replace(/OS:/gi, 'Sistema Operacional:');
  }
}