import { render, screen } from '@testing-library/angular';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { APlagueTale } from './a-plague-tale';
import { RawgService } from '../../../core/services/rawg.service';
import { CarrinhoFacade } from '../../../core/facades/carrinho.facade';
import { FavoritosService } from '../../../core/services/favoritos.service';

// Mock do localStorage e sessionStorage para o ambiente de testes
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
    id: 752590,
    name: 'A Plague Tale: Innocence',
    released: '2019-05-14',
    developers: [{ name: 'Asobo Studio' }],
    publishers: [{ name: 'Focus Entertainment' }],
    platforms: [{ platform: { name: 'PC' } }],
    background_image: 'plague.jpg'
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

describe('Componente APlagueTale - Testes de Cobertura Alta', () => {

  // ==========================================
  // 1. TESTES DE LÓGICA INTERNA E MÉTODOS (Vitest)
  // ==========================================
  describe('Lógica de Métodos e Estado (Vitest)', () => {
    let component: APlagueTale;

    beforeEach(() => {
      localStorage.clear();
      sessionStorage.clear();

      TestBed.resetTestingModule(); // Reseta o módulo antes da reconfiguração

      TestBed.configureTestingModule({
        imports: [APlagueTale],
        providers: [
          { provide: RawgService, useValue: mockRawgService },
          { provide: CarrinhoFacade, useValue: mockCarrinhoFacade },
          { provide: FavoritosService, useValue: mockFavoritosService },
          { provide: Router, useValue: mockRouter },
          { provide: Location, useValue: mockLocation }
        ]
      });

      const fixture = TestBed.createComponent(APlagueTale);
      component = fixture.componentInstance;
    });

    it('deve inicializar o componente e carregar dados do jogo', () => {
      expect(component).toBeTruthy();
      (component as any).carregarDadosDoJogo();
      expect(component.jogo?.nome).toBe('A Plague Tale: Innocence');
      expect(component.galeriaImagens.length).toBeGreaterThan(0);
    });

    it('deve manipular o modal de avaliação e validação de envio', () => {
      component.abrirModal();
      expect(component.exibirModalAvaliacao).toBe(true);

      // Tenta enviar vazio (dispara o toast de alerta)
      component.novoNome = '';
      component.novoTexto = '';
      component.enviarAvaliacao();
      expect(component.mensagemToast).toContain('Preencha seu nome');

      // Preenche e envia corretamente
      component.novoNome = 'Amicia';
      component.novoTexto = 'Jogo espetacular e muito emocionante!';
      component.enviarAvaliacao();
      expect(component.listaComentarios[0].autor).toBe('Amicia');
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
      const estrelas = component.getEstrelasTexto(5);
      expect(estrelas).toBe('★★★★★');
    });

    it('deve adicionar ao carrinho, favoritar e acionar comprar agora', () => {
      component.jogo = { nome: 'A Plague Tale: Innocence', plataformas: 'PC' } as any;

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
      TestBed.resetTestingModule(); // Garante ambiente isolado para o render()
    });

    it('deve renderizar a página do jogo e checar comentários na tela', async () => {
      await render(APlagueTale, {
        providers: [
          { provide: RawgService, useValue: mockRawgService },
          { provide: CarrinhoFacade, useValue: mockCarrinhoFacade },
          { provide: FavoritosService, useValue: mockFavoritosService },
          { provide: Router, useValue: mockRouter },
          { provide: Location, useValue: mockLocation }
        ]
      });

      // Valida se o comentário padrão de AmiciaDeRuns aparece visível na página
      const autorComentario = screen.getByText(/AmiciaDeRuns/i);
      expect(autorComentario).not.toBeNull();
    });
  });
});