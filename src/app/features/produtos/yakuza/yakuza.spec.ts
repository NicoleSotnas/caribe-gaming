import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { Yakuza } from './yakuza';
import { RawgService } from '../../../core/services/rawg.service';
import { CarrinhoFacade } from '../../../core/facades/carrinho.facade';
import { FavoritosService } from '../../../core/services/favoritos.service';

// Mock do localStorage e sessionStorage
const mockStorage = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    clear: () => { store = {}; }
  };
};

Object.defineProperty(window, 'localStorage', { value: mockStorage() });
Object.defineProperty(window, 'sessionStorage', { value: mockStorage() });

// Mocks dos Serviços
const mockRawgService = {
  obterDetalhesJogo: vi.fn().mockReturnValue(of({
    id: 638970,
    name: 'Yakuza 0',
    released: '2015-03-12',
    developers: [{ name: 'SEGA' }],
    publishers: [{ name: 'SEGA' }],
    platforms: [{ platform: { name: 'PC' } }],
    background_image: 'yakuza.jpg'
  })),
  obterScreenshots: vi.fn().mockReturnValue(of({
    results: [{ image: 'screen1.jpg' }, { image: 'screen2.jpg' }]
  }))
};

const mockCarrinhoFacade = {
  adicionarProduto: vi.fn()
};

const mockFavoritosService = {
  ehFavorito: vi.fn().mockReturnValue(false),
  toggleFavorito: vi.fn()
};

const mockRouter = {
  navigate: vi.fn()
};

const mockLocation = {
  back: vi.fn()
};

describe('Componente Yakuza - Testes de Cobertura Alta', () => {

  // ==========================================
  // 1. TESTES DE LÓGICA INTERNA E MÉTODOS (Vitest)
  // ==========================================
  describe('Lógica de Métodos e Estado (Vitest)', () => {
    let component: Yakuza;

    beforeEach(() => {
      localStorage.clear();
      sessionStorage.clear();

      TestBed.resetTestingModule(); // Garante um ambiente limpo antes do teste

      TestBed.configureTestingModule({
        imports: [Yakuza],
        providers: [
          { provide: RawgService, useValue: mockRawgService },
          { provide: CarrinhoFacade, useValue: mockCarrinhoFacade },
          { provide: FavoritosService, useValue: mockFavoritosService },
          { provide: Router, useValue: mockRouter },
          { provide: Location, useValue: mockLocation }
        ]
      });

      const fixture = TestBed.createComponent(Yakuza);
      component = fixture.componentInstance;
    });

    it('deve inicializar o componente e carregar dados do jogo', () => {
      expect(component).toBeTruthy();
      (component as any).carregarDadosDoJogo();
      expect(component.jogo?.nome).toBe('Yakuza 0');
      expect(component.galeriaImagens.length).toBeGreaterThan(0);
    });

    it('deve manipular o modal de avaliação e validação de envio', () => {
      component.abrirModal();
      expect(component.exibirModalAvaliacao).toBe(true);

      component.novoNome = '';
      component.novoTexto = '';
      component.enviarAvaliacao();
      expect(component.mensagemToast).toContain('Preencha seu nome');

      component.novoNome = 'Kiryu';
      component.novoTexto = 'Excelente jogo!';
      component.enviarAvaliacao();
      expect(component.listaComentarios[0].autor).toBe('Kiryu');
      expect(component.exibirModalAvaliacao).toBe(false);
    });

    it('deve testar os likes e dislikes nos comentários', () => {
      const comentario = component.listaComentarios[0];
      const likesIniciais = comentario.likes;

      component.darLike(comentario);
      expect(comentario.likes).toBe(likesIniciais + 1);
      expect(comentario.votouLike).toBe(true);

      component.darLike(comentario);
      expect(comentario.likes).toBe(likesIniciais);

      component.darDislike(comentario);
      expect(comentario.votouDislike).toBe(true);
    });

    it('deve navegar na galeria de fotos (próxima, anterior e selecionar)', () => {
      component.galeriaImagens = ['foto1.jpg', 'foto2.jpg', 'foto3.jpg'];
      
      component.proximaFoto();
      expect(component.indiceAtivo).toBe(1);

      component.proximaFoto();
      expect(component.indiceAtivo).toBe(2);

      component.proximaFoto();
      expect(component.indiceAtivo).toBe(0);

      component.fotoAnterior();
      expect(component.indiceAtivo).toBe(2);

      component.selecionarIndice(1);
      expect(component.indiceAtivo).toBe(1);
    });

    it('deve formatar estrelas de avaliação corretamente', () => {
      const estrelas3 = component.getEstrelasTexto(3);
      expect(estrelas3).toBe('★★★☆☆');
    });

    it('deve adicionar ao carrinho, favoritar e usar o comprar agora', () => {
      component.jogo = { nome: 'Yakuza 0', plataformas: 'PC' } as any;

      component.adicionarAoCarrinho();
      expect(mockCarrinhoFacade.adicionarProduto).toHaveBeenCalled();

      component.toggleFavorito();
      expect(mockFavoritosService.toggleFavorito).toHaveBeenCalled();

      component.comprarAgora();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/carrinho']);
    });

    it('deve testar navegação de rotas e voltar página', () => {
      component.voltarPagina();
      expect(mockLocation.back).toHaveBeenCalled();

      component.irParaHome();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);

      component.irParaJogos();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/jogos']);
    });

    it('deve tratar erro de carregamento da API RAWG sem estourar log', () => {
      vi.spyOn(console, 'error').mockImplementation(() => {}); // Oculta a mensagem de erro esperada no console
      mockRawgService.obterDetalhesJogo.mockReturnValueOnce(throwError(() => new Error('Erro API')));
      (component as any).carregarDadosDoJogo();
      expect(component.erro).toBe(true);
    });
  });

  // ==========================================
  // 2. TESTES DE INTERFACE E DOM (Testing Library)
  // ==========================================
  describe('Interface do Usuário (Testing Library)', () => {
    beforeEach(() => {
      TestBed.resetTestingModule(); // Reseta a configuração do módulo para permitir a renderização do render()
    });

    it('deve renderizar a página do jogo e os elementos visíveis', async () => {
      await render(Yakuza, {
        providers: [
          { provide: RawgService, useValue: mockRawgService },
          { provide: CarrinhoFacade, useValue: mockCarrinhoFacade },
          { provide: FavoritosService, useValue: mockFavoritosService },
          { provide: Router, useValue: mockRouter },
          { provide: Location, useValue: mockLocation }
        ]
      });

      // Valida elementos visíveis na página
      const comentarios = screen.getByText(/KazumaKiryu_88/i);
      expect(comentarios).not.toBeNull();
    });
  });
});