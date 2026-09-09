import { render, screen, fireEvent } from '@testing-library/angular';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { provideRouter } from '@angular/router';

// Imports do Angular e Firebase (Tokens reais para a Injeção de Dependência)
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';

// Componente e Facade
import { Home } from './home';
import { CarrinhoFacade } from '../../core/facades/carrinho.facade';

describe('Home Component - Navegação e Troca de Banner', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  async function renderHomeComponent() {
    return await render(Home, {
      providers: [
        provideRouter([]),
        { provide: CarrinhoFacade, useValue: {} },
        // Provê os tokens reais do Firebase como objetos vazios
        { provide: Auth, useValue: {} },
        { provide: Firestore, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
  }

  // ==========================================================================
  // BLOCO DE TESTES: BOTÕES DE TROCA DE JOGO NO BANNER
  // ==========================================================================

  // --------------------------------------------------------------------------
  // TESTE 1: Renderização dos Botões/Indicadores
  // --------------------------------------------------------------------------
  it('deve renderizar os botões de navegação dos jogos no banner', async () => {
    await renderHomeComponent();

    const slide1Indicator = screen.getByText('01');
    const slide2Indicator = screen.getByText('02');

    expect(slide1Indicator).toBeTruthy();
    expect(slide2Indicator).toBeTruthy();
  });

  // --------------------------------------------------------------------------
  // TESTE 2: Exibição do Jogo Inicial
  // --------------------------------------------------------------------------
  it('deve exibir o título do primeiro jogo por padrão ao carregar', async () => {
    await renderHomeComponent();

    const gameTitle = screen.getByText(/Marvel's Spider-Man Remastered/i);
    expect(gameTitle).toBeTruthy();
  });

  // --------------------------------------------------------------------------
  // TESTE 3: Troca para o Segundo Jogo
  // --------------------------------------------------------------------------
  it('deve alterar o conteúdo do banner ao clicar no botão "02"', async () => {
    await renderHomeComponent();

    const secondSlideIndicator = screen.getByText('02');
    await fireEvent.click(secondSlideIndicator);

    const secondGameTitle = screen.getByRole('heading', { name: /Formula 1 2023/i, level: 1 });
    expect(secondGameTitle).toBeTruthy();
  });

  // --------------------------------------------------------------------------
  // TESTE 4: Retorno ao Primeiro Jogo
  // --------------------------------------------------------------------------
  it('deve retornar ao primeiro jogo ao clicar no botão "01"', async () => {
    await renderHomeComponent();

    // Avança para o slide 2
    const secondSlideIndicator = screen.getByText('02');
    await fireEvent.click(secondSlideIndicator);

    // Voltar para o slide 1
    const firstSlideIndicator = screen.getByText('01');
    await fireEvent.click(firstSlideIndicator);

    const firstGameTitle = screen.getByRole('heading', {
      name: /Marvel's Spider-Man Remastered/i,
      level: 1,
    });
    expect(firstGameTitle).toBeTruthy();
  });
});
