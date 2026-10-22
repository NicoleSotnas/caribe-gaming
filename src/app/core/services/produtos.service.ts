import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { JogoCard, Produto } from '../models/jogo';
import { JogosApiService } from './jogos-api.service';

@Injectable({ providedIn: 'root' })
export class ProdutosService {
  private jogosApi = inject(JogosApiService);

  obterProdutos(opts: { q?: string; plataforma?: 'pc' | 'ps'; pagina?: number } = {}): Observable<Produto[]> {
    return this.jogosApi
      .listar(opts)
      .pipe(map((lista) => lista.map((j) => this.mapearJogoParaProduto(j))));
  }

  private mapearJogoParaProduto(j: JogoCard): Produto {
    return {
      id: j.id.toString(),
      nome: j.nome,
      imagem: j.capa || 'assets/imagens/placeholder.jpg',
      imagemPosicao: 'center',
      precoOriginal: j.preco?.original ?? '',
      precoPromocional: j.gratis ? 'Grátis' : (j.preco?.atual ?? 'Indisponível'),
      precoNumero: j.gratis ? 0 : (j.preco?.valor ?? 0),
      desconto: j.preco?.desconto ?? 0,
      genero: j.generos.join(' / ') || 'Ação',
      plataforma: j.plataformas.join(' / ') || 'PC',
      categorias: j.categorias,
      slug: j.slug,
      estoque: j.estoque,
      
    };
  }
}