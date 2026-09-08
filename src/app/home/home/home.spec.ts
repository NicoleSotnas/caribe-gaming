import { render, screen, fireEvent } from '@testing-library/angular';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Router } from '@angular/router';
import { Home } from './home';
import { CarrinhoFacade } from '../../core/facades/carrinho.facade';

describe('Home Component - Botão Comprar Agora', () => {
  let carrinhoFacadeMock: { adicionarProduto: ReturnType<typeof vi.fn> };
  let routerMock: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    carrinhoFacadeMock = {
      adicionarProduto: vi.fn(),
    };

    routerMock = {
      navigate: vi.fn(),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // --- TESTE ANGULAR TESTING LIBRARY ---
  describe('Testing Library Tests', () => {
    it('deve disparar a compra e redirecionar ao clicar no botão "COMPRAR AGORA" via interação de DOM', async () => {
      await render(Home, {
        componentProviders: [
          { provide: CarrinhoFacade, useValue: carrinhoFacadeMock },
          { provide: Router, useValue: routerMock },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      });

      const buyButtons = screen.getAllByRole('button', { name: /comprar agora/i });
      expect(buyButtons.length).toBeGreaterThan(0);

      await fireEvent.click(buyButtons[0]);

      expect(carrinhoFacadeMock.adicionarProduto).toHaveBeenCalledWith({
        id: 5,
        nome: "Marvel's Spider-Man Remastered",
        preco: 199.9,
        quantidade: 1,
        imagemUrl: 'https://i.pinimg.com/1200x/c8/a6/93/c8a693307e006df55eb3b8c7cb86891d.jpg',
        plataforma: 'PC',
        categoria: 'Jogo',
      });

      expect(routerMock.navigate).toHaveBeenCalledWith(['/carrinho']);
    });
  });

  // --- TESTE DE UNIDADE VITEST ---
  describe('Vitest Unit Tests', () => {
    it('deve converter corretamente o preço em string para float ao executar comprarAgora()', async () => {
      await TestBed.configureTestingModule({
        imports: [Home],
        providers: [
          { provide: CarrinhoFacade, useValue: carrinhoFacadeMock },
          { provide: Router, useValue: routerMock },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();

      const fixture = TestBed.createComponent(Home);
      const component = fixture.componentInstance;

      const mockGame = {
        id: 16,
        title: 'Formula 1 2023',
        subtitle: 'Sinta a emoção da velocidade com o F1 2023.',
        originalPrice: 'R$ 359,00',
        promoPrice: 'R$ 1.250,50',
        discount: '-60%',
        image: 'https://i.pinimg.com/1200x/71/52/68/715268628f6902ea0ed1361b71dbf627.jpg',
      };

      component.comprarAgora(mockGame as any);

      expect(carrinhoFacadeMock.adicionarProduto).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 16,
          nome: 'Formula 1 2023',
          preco: 1250.5,
        }),
      );
      expect(routerMock.navigate).toHaveBeenCalledWith(['/carrinho']);
    });
  });
});
