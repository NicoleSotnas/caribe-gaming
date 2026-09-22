import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { Thewitcher } from './thewitcher';
import { RawgService } from '../../../../core/services/rawg.service';
import { CarrinhoFacade } from '../../../../core/facades/carrinho.facade';
import { FavoritosService } from '../../../../core/services/favoritos.service';

// Mock do localStorage e sessionStorage para testes de browser
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
    id: 292030,
    name: 'The Witcher 3: Wild Hunt',
    released: '2015-05-18',
    developers: [{ name: 'CD PROJEKT RED' }],
    publishers: [{ name: 'CD PROJEKT RED' }],
    platforms: [{ platform: { name: 'PC' } }],
    background_image: 'witcher.jpg'
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

describe('Componente Thewitcher - Testes de Cobertura Alta', () => {

  // ==========================================
  // 1. TESTES DE LÓGICA INTERNA E MÉTODOS (Vitest)
  // ==========================================
  describe('Lógica de Métodos e Estado (Vitest)', () => {
    let component: Thewitcher;

    beforeEach(() => {
      localStorage.clear();
      sessionStorage.clear();

      TestBed.resetTestingModule(); // Reseta o ambiente antes de reconfigurar

      TestBed.configureTestingModule({
        imports: [Thewitcher],
        providers: [
          { provide: RawgService, useValue: mockRawgService },
          { provide: CarrinhoFacade, useValue: mockCarrinhoFacade },
          { provide: FavoritosService, useValue: mockFavoritosService },
          { provide: Router, useValue: mockRouter },
          { provide: Location, useValue: mockLocation }
        ]
      });

      const fixture = TestBed.createComponent(Thewitcher);
      component = fixture.componentInstance;
    });

    it('deve inicializar o componente e carregar dados do jogo', () => {
      expect(component).toBeTruthy();
      (component as any).carregarDadosDoJogo();
      expect(component.jogo?.nome).toBe('The Witcher 3: Wild Hunt');
      expect(component.galeriaImagens.length).toBeGreaterThan(0);
    });

    it('deve manipular o modal de avaliação e validação de envio', () => {
      component.abrirModal();
      expect(component.exibirModalAvaliacao).toBe(true);

      // Tenta enviar vazio (deve disparar toast de erro)
      component.novoNome = '';
      component.novoTexto = '';
      component.enviarAvaliacao();
      expect(component.mensagemToast).toContain('Preencha seu nome');

      // Preenche corretamente e envia
      component.novoNome = 'Geralt';
      component.novoTexto = 'Melhor jogo de todos!';
      component.enviarAvaliacao();
      expect(component.listaComentarios[0].autor).toBe('Geralt');
      expect(component.exibirModalAvaliacao).toBe(false);
    });

    it('deve testar os likes e dislikes nos comentários', () => {
      const comentario = component.listaComentarios[0];
      const likesIniciais = comentario.likes;

      // Adiciona Like
      component.darLike(comentario);
      expect(comentario.likes).toBe(likesIniciais + 1);
      expect(comentario.votouLike).toBe(true);

      // Remove Like ao clicar novamente
      component.darLike(comentario);
      expect(comentario.likes).toBe(likesIniciais);

      // Adiciona Dislike
      component.darDislike(comentario);
      expect(comentario.votouDislike).toBe(true);
    });

    it('deve navegar na galeria de fotos (próxima, anterior e selecionar)', () => {
      component.galeriaImagens = ['foto1.jpg', 'foto2.jpg', 'foto3.jpg'];
      
      component.proximaFoto();
      expect(component.indiceAtivo).toBe(1);

      component.proximaFoto();
      expect(component.indiceAtivo).toBe(2);

      component.proximaFoto(); // Loop para a primeira
      expect(component.indiceAtivo).toBe(0);

      component.fotoAnterior(); // Loop para a última
      expect(component.indiceAtivo).toBe(2);

      component.selecionarIndice(1);
      expect(component.indiceAtivo).toBe(1);
    });

    it('deve formatar estrelas de avaliação corretamente', () => {
      const estrelas4 = component.getEstrelasTexto(4);
      expect(estrelas4).toBe('★★★★☆');
    });

    it('deve adicionar ao carrinho, favoritar e acionar o comprar agora', () => {
      component.jogo = { nome: 'The Witcher 3', plataformas: 'PC' } as any;

      component.adicionarAoCarrinho();
      expect(mockCarrinhoFacade.adicionarProduto).toHaveBeenCalled();

      component.toggleFavorito();
      expect(mockFavoritosService.toggleFavorito).toHaveBeenCalled();

      component.comprarAgora();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/carrinho']);
    });

    it('deve testar rotas de navegação e o botão de voltar', () => {
      component.voltarPagina();
      expect(mockLocation.back).toHaveBeenCalled();

      component.irParaHome();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);

      component.irParaJogos();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/jogos']);
    });

    it('deve tratar erro de carregamento da API RAWG sem poluir o console', () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
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
      TestBed.resetTestingModule(); // Garante ambiente limpo para o render()
    });

    it('deve renderizar a página do jogo e checar comentários na tela', async () => {
      await render(Thewitcher, {
        providers: [
          { provide: RawgService, useValue: mockRawgService },
          { provide: CarrinhoFacade, useValue: mockCarrinhoFacade },
          { provide: FavoritosService, useValue: mockFavoritosService },
          { provide: Router, useValue: mockRouter },
          { provide: Location, useValue: mockLocation }
        ]
      });

      // Valida se o comentário padrão de GeraltDeRivia_BR aparece na interface
      const comentarioAutor = screen.getByText(/GeraltDeRivia_BR/i);
      expect(comentarioAutor).not.toBeNull();
    });
  });
});