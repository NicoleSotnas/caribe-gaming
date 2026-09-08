import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Produtos } from './produtos';
import { ProdutosService } from '../../core/services/produtos.service';
import { CarrinhoFacade } from '../../core/facades/carrinho.facade';
import { FavoritosService } from '../../core/services/favoritos.service';
import { Router } from '@angular/router';

// Mocks dos produtos
const mockProdutos = [
  {
    id: '1',
    nome: 'The Witcher 3',
    precoPromocional: 'R$ 50,00',
    categorias: ['rpg'],
    plataforma: ['PC'],
    genero: 'RPG',
    imagem: 'witcher.jpg',
    slug: 'the-witcher-3'
  },
  {
    id: '2',
    nome: 'The Sims 4',
    precoPromocional: 'Grátis',
    categorias: ['simulacao'],
    plataforma: ['PC'],
    genero: 'Simulação',
    imagem: 'sims.jpg',
    slug: 'the-sims-4'
  }
];

// Mocks dos serviços
const mockProdutosService = {
  obterProdutos: () => of(mockProdutos)
};

const mockFavoritosService = {
  ehFavorito: (id: string) => id === '1',
  toggleFavorito: vi.fn(),
  limparTodosFavoritos: vi.fn()
};

const mockCarrinhoFacade = {
  adicionarProduto: vi.fn()
};

const mockRouter = {
  navigate: vi.fn()
};

// ==========================================
// 1. TESTE UNITÁRIO COM VITEST (Visão de Código)
// ==========================================
describe('ProdutosComponent - Lógica do Código (Vitest)', () => {
  let component: Produtos;

  beforeEach(() => {
    // Configura o TestBed para criar o componente dentro do contexto de injeção do Angular
    TestBed.configureTestingModule({
      imports: [Produtos],
      providers: [
        { provide: ProdutosService, useValue: mockProdutosService },
        { provide: FavoritosService, useValue: mockFavoritosService },
        { provide: CarrinhoFacade, useValue: mockCarrinhoFacade },
        { provide: Router, useValue: mockRouter }
      ]
    });

    const fixture = TestBed.createComponent(Produtos);
    component = fixture.componentInstance;
  });

  it('deve alternar o estado do menu de categorias', () => {
    // Arrange: Menu começa fechado
    expect(component.menuCategoriasAberto).toBe(false);

    // Act: Chama o método interno
    component.toggleMenuCategorias();

    // Assert: O valor deve ter invertido para true
    expect(component.menuCategoriasAberto).toBe(true);
  });

  it('deve converter strings de preço no formato correto', () => {
    // Act & Assert: Chama o método de conversão
    const precoFormatado = (component as any).converterPreco('R$ 50,00');
    const precoGratis = (component as any).converterPreco('Grátis');

    expect(precoFormatado).toBe(50);
    expect(precoGratis).toBe(0);
  });
});

// ==========================================
// 2. TESTE DE COMPONENTE COM ANGULAR TESTING LIBRARY (Visão do Usuário)
// ==========================================
describe('ProdutosComponent - Interface do Usuário (Testing Library)', () => {
  it('deve filtrar produtos pela aba de favoritos ao clicar', async () => {
    // 1. ARRANGE: Renderiza o componente fornecendo os Mocks no container
    await render(Produtos, {
      providers: [
        { provide: ProdutosService, useValue: mockProdutosService },
        { provide: FavoritosService, useValue: mockFavoritosService },
        { provide: CarrinhoFacade, useValue: mockCarrinhoFacade },
        { provide: Router, useValue: mockRouter }
      ]
    });

    // 2. ASSERT INICIAL: Verifica se ambos os jogos aparecem no carregamento
    expect(screen.getByText('The Witcher 3')).not.toBeNull();
    expect(screen.getByText('The Sims 4')).not.toBeNull();

    // 3. ACT: O usuário encontra a aba "Favoritos" pelo texto e clica nela
    const abaFavoritos = screen.getByText(/favoritos/i);
    await userEvent.click(abaFavoritos);

    // 4. ASSERT FINAL: Apenas o jogo favorito deve permanecer na tela para o usuário
    expect(screen.getByText('The Witcher 3')).not.toBeNull();
    expect(screen.queryByText('The Sims 4')).toBeNull();
  });
});