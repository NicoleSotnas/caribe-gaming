import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Produto {
  id: string;
  nome: string;
  steamAppId?: string;
  genero: string;
  plataforma: string;
  precoOriginal: string;
  precoPromocional: string;
  desconto: number;
  categorias: string[];
  slug: string;
  imagem?: string;
  imagemPosicao?: string;
  descricaoCustom?: string;
}

@Injectable({ providedIn: 'root' })
export class ProdutosService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.rawg.io/api/games';
  private apiKey = '53cda31b968d4afea37f6db579e0ec8c';

  /**
   * Procura os jogos dinamicamente na API RAWG e mapeia para o formato Produto[]
   */
  obterProdutos(): Observable<Produto[]> {
    return this.http
      .get<any>(`${this.apiUrl}?key=${this.apiKey}&page_size=40`)
      .pipe(
        map((resposta) =>
          resposta.results.map((item: any) => this.mapearJogoParaProduto(item))
        )
      );
  }

  /**
   * Converte os dados brutos recebidos da RAWG na estrutura Produto esperada pelo teu e-commerce
   */
  private mapearJogoParaProduto(item: any): Produto {
    // Procura se o jogo tem registo na Steam para capturar o AppId
    const steamStore = item.stores?.find((s: any) => s.store.slug === 'steam');
    const steamAppId = steamStore ? steamStore.store.id.toString() : undefined;

    // Se tiver ID da Steam, usa a capa vertical oficial da Steam, caso contrário usa a imagem da RAWG
    const imagemCapa = steamAppId
      ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${steamAppId}/library_600x900.jpg`
      : item.background_image;

    return {
      id: item.id.toString(),
      nome: item.name,
      steamAppId: steamAppId,
      imagem: imagemCapa,
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