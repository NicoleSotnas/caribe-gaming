import { Injectable } from '@angular/core';
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

@Injectable({ providedIn: 'root' })
export class RawgService {
  obterDetalhesTheWitcher3(): Observable<DetalhesJogo> {
    return of({
      id: 292030,
      nome: 'The Witcher 3: Wild Hunt',
      descricao: 'Geralt de Rívia, um caçador de monstros mutante, viaja pelos Reinos do Norte. A serviço, chantageado ou por escolha própria, Geralt precisa navegar por um mundo cada vez mais perigoso, tomando decisões difíceis, em busca de sentido.',
      dataLancamento: '18/05/2015',
      desenvolvedoras: 'CD PROJEKT RED',
      distribuidoras: 'CD PROJEKT RED',
      classificacaoEtaria: '18+',
      plataformas: 'PC / PS5',
    });
  }
}