import { render, screen, fireEvent } from '@testing-library/angular';
import { vi } from 'vitest';
import { of } from 'rxjs';

import { TheSims } from './thesims';

import { FavoritosService } from '../../../../core/services/favoritos.service';
import { RawgService } from '../../../../core/services/rawg.service';
import { CarrinhoFacade } from '../../../../core/facades/carrinho.facade';

import { Router } from '@angular/router';
import { Location } from '@angular/common';

describe('TheSims - Favoritos', () => {

  it('deve deixar o coração vermelho quando o jogo for favoritado', async () => {

    // Serviço de favoritos falso
    const favoritosServiceMock = {
      ehFavorito: vi.fn().mockReturnValue(false),
      toggleFavorito: vi.fn()
    };

    // Serviço da RAWG falso
    const rawgServiceMock = {
      obterDetalhesJogo: vi.fn().mockReturnValue(
        of({})
      ),
      obterScreenshots: vi.fn().mockReturnValue(
        of({ results: [] })
      )
    };

    // Carrinho falso
    const carrinhoFacadeMock = {
      adicionarProduto: vi.fn()
    };

    // Router falso
    const routerMock = {
      navigate: vi.fn()
    };

    // Location falsa
    const locationMock = {
      back: vi.fn()
    };

    // Jogo fictício
    const jogoFicticio = {
      id: 1222670,
      nome: 'The Sims 4',
      descricao: 'Jogo de simulação',
      dataLancamento: '02/09/2014',
      desenvolvedoras: 'Electronic Arts',
      distribuidoras: 'Electronic Arts',
      classificacaoEtaria: '12+',
      plataformas: 'PC / PlayStation 4 / Xbox One',
      background_image: 'imagem.jpg'
    };

    // Coloca o jogo fictício no cache
    sessionStorage.setItem(
      'sims4_dados_completos',
      JSON.stringify({
        jogo: jogoFicticio,
        imagens: ['imagem.jpg']
      })
    );

    // Renderiza o componente
    const { fixture } = await render(TheSims, {
      providers: [
        {
          provide: FavoritosService,
          useValue: favoritosServiceMock
        },
        {
          provide: RawgService,
          useValue: rawgServiceMock
        },
        {
          provide: CarrinhoFacade,
          useValue: carrinhoFacadeMock
        },
        {
          provide: Router,
          useValue: routerMock
        },
        {
          provide: Location,
          useValue: locationMock
        }
      ]
    });

    // Espera o componente terminar de carregar
    await fixture.whenStable();

    // Atualiza a tela
    fixture.detectChanges();

    // Procura o botão do coração
    const botaoFavorito = screen.getByTitle('Favoritar');

    // Antes do clique, o jogo não está favoritado
    expect(fixture.componentInstance.favorito).toBe(false);

    // O coração inicialmente não está vermelho
    const coracaoAntes = botaoFavorito.querySelector('svg');

    expect(
      coracaoAntes?.getAttribute('fill')
    ).toBe('none');

    // Clica no coração
    await fireEvent.click(botaoFavorito);

    // Atualiza a tela
    fixture.detectChanges();

    // Depois do clique, o jogo deve estar favoritado
    expect(fixture.componentInstance.favorito).toBe(true);

    // O botão deve receber a classe "favoritado"
    expect(
      botaoFavorito.classList.contains('favoritado')
    ).toBe(true);

    // Procura o coração dentro do botão
    const coracaoDepois = botaoFavorito.querySelector('svg');

    // O coração deve ficar vermelho
    expect(
      coracaoDepois?.getAttribute('fill')
    ).toBe('#ff4757');

    // O serviço de favoritos deve ter sido chamado
    expect(
      favoritosServiceMock.toggleFavorito
    ).toHaveBeenCalled();

    // Limpa o cache usado pelo teste
    sessionStorage.removeItem('sims4_dados_completos');

  });

});