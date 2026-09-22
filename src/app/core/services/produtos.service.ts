import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Produto } from '../models/jogo';

@Injectable({ providedIn: 'root' })
export class ProdutosService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.rawg.io/api/games';
  private apiKey = '53cda31b968d4afea37f6db579e0ec8c';

  /**
   * Procura os jogos da RAWG API e mapeia instantaneamente.
   * Dá prioridade à capa da Steam, mantendo a imagem da RAWG como fallback seguro.
   */
  obterProdutos(): Observable<Produto[]> {
    return this.http
      .get<any>(`${this.apiUrl}?key=${this.apiKey}&page_size=40`)
      .pipe(
        map((resposta) =>
          (resposta.results || []).map((item: any) => this.mapearJogoParaProduto(item))
        )
      );
  }

  private mapearJogoParaProduto(item: any): Produto {
    // Procura se o jogo tem registo na loja Steam para capturar o AppId
    const steamStore = item.stores?.find((s: any) => s.store?.slug === 'steam');
    const steamAppId = steamStore?.store?.id ? steamStore.store.id.toString() : undefined;

    // Tenta montar a URL da Steam; se não existir, usa a imagem oficial da RAWG
    const imagemCapaSteam = steamAppId
      ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${steamAppId}/library_600x900.jpg`
      : item.background_image;

    return {
      id: item.id.toString(),
      nome: item.name,
      steamAppId: steamAppId,
      imagem: imagemCapaSteam || 'assets/imagens/placeholder.jpg',
      imagemPosicao: 'center',
      precoOriginal: 'R$ 199,90',
      precoPromocional: 'R$ 99,95',
      desconto: 50,
      genero: item.genres?.map((g: any) => g.name).join(' / ') || 'Ação',
      plataforma: item.platforms?.map((p: any) => p.platform.name).join(' / ') || 'PC',
      categorias: item.genres?.map((g: any) => g.slug) || [],
      slug: item.slug
    };
  }
}