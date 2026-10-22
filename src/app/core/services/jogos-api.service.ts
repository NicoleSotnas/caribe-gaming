import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable, forkJoin, of, timer, map, catchError, shareReplay, switchMap, scan,
} from 'rxjs';
import { DetalhesJogo, JogoCard, CATALOGO } from '../models/jogo';

const STEAM = '/steam';
const INTERVALO_ATUALIZACAO = 5 * 60 * 1000; // 5 minutos

const capa = (appid: number) =>
  `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/library_600x900.jpg`;

function formatarPreco(p: any) {
  if (!p) return null;
  return {
    atual: p.final_formatted as string,
    original: (p.discount_percent > 0 ? p.initial_formatted : null) as string | null,
    desconto: p.discount_percent as number,
    valor: p.final / 100, // a Steam manda em centavos
  };
}

// A Steam manda "<strong>Mínimos:</strong><br><ul>..." e o seu HTML já tem o título
function limparRequisitos(html?: string | null): string | null {
  if (!html) return null;
  return html.replace(/^\s*<strong>[^<]*<\/strong>\s*<br\s*\/?>/i, '').trim() || null;
}

@Injectable({ providedIn: 'root' })
export class JogosApiService {
  private http = inject(HttpClient);

  private detalheCache = new Map<number, Observable<DetalhesJogo>>();

  // Consulta os preços agora e repete a cada 5 min. Se uma consulta falhar, mantém os últimos preços.
  // refCount: true -> para de consultar quando nenhuma tela estiver usando a lista.
  private precos$: Observable<any> = timer(0, INTERVALO_ATUALIZACAO).pipe(
    switchMap(() =>
      this.http
        .get<any>(`${STEAM}/api/appdetails`, {
          params: {
            appids: CATALOGO.map((g) => g.appid).join(','),
            cc: 'br',
            filters: 'price_overview',
          },
        })
        .pipe(catchError(() => of(null)))
    ),
    scan((anterior: any, atual: any) => atual ?? anterior, {}),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  listar(opts: { q?: string; plataforma?: 'pc' | 'ps'; pagina?: number } = {}): Observable<JogoCard[]> {
    return this.precos$.pipe(
      map((json: any) =>
        CATALOGO.map((g) => ({
          id: g.appid,
          nome: g.nome,
          slug: String(g.appid),
          capa: capa(g.appid),
          plataformas: g.plataformas,
          generos: g.generos,
          categorias: g.categorias,
          gratis: g.gratis === true,
          estoque: g.estoque !== false,
          preco: formatarPreco(json?.[g.appid]?.data?.price_overview),
        })).filter((j) => {
          const okQ = !opts.q || j.nome.toLowerCase().includes(opts.q.toLowerCase());
          const okP =
            !opts.plataforma ||
            j.plataformas.includes(opts.plataforma === 'pc' ? 'PC' : 'PS');
          return okQ && okP;
        })
      )
    );
  }

  obterJogo(id: string): Observable<DetalhesJogo> {
    const appid = Number(id);
    let cached = this.detalheCache.get(appid);
    if (!cached) {
      cached = this.buscarDetalhe(appid).pipe(shareReplay(1));
      this.detalheCache.set(appid, cached);
    }
    return cached;
  }

  private buscarDetalhe(appid: number): Observable<DetalhesJogo> {
    const meta = CATALOGO.find((g) => g.appid === appid);

    return forkJoin({
      detalhes: this.http.get<any>(`${STEAM}/api/appdetails`, {
        params: { appids: appid, cc: 'br', l: 'portuguese' },
      }),
      reviews: this.http
        .get<any>(`${STEAM}/appreviews/${appid}`, {
          params: { json: 1, language: 'all', purchase_type: 'all', num_per_page: 0 },
        })
        .pipe(catchError(() => of(null))),
    }).pipe(
      map(({ detalhes, reviews }) => {
        const d = detalhes?.[appid]?.data;
        if (!meta || !d) throw new Error('jogo não encontrado');

        const q = reviews?.query_summary;
        const avaliacao = q?.total_reviews
          ? { nota: ((q.total_positive / q.total_reviews) * 5).toFixed(1), total: q.total_reviews }
          : null;

        const imagens: string[] = (d.screenshots ?? []).map((s: any) => s.path_full);

        return {
          id: appid,
          nome: d.name,
          background_image: imagens[0] ?? d.header_image,
          descricao: d.short_description,
          plataformas: meta.plataformas.join(' / '),
          desenvolvedoras: (d.developers ?? []).join(', '),
          distribuidoras: (d.publishers ?? []).join(', '),
          dataLancamento: d.release_date?.date ?? '',
          classificacaoEtaria: d.ratings?.dejus?.rating ?? String(d.required_age ?? 0),
          generos: (d.genres ?? []).map((g: any) => g.description).join(', '),
          caracteristicas: (d.categories ?? []).map((c: any) => c.description as string),
          imagens,
          requisitos: {
            minimos: limparRequisitos(d.pc_requirements?.minimum),
            recomendados: limparRequisitos(d.pc_requirements?.recommended),
          },
          gratis: meta.gratis === true || d.is_free === true,
          estoque: meta.estoque !== false,
          preco: formatarPreco(d.price_overview),
          avaliacao,
        } as DetalhesJogo;
      })
    );
  }
}