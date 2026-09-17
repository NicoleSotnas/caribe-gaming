import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { vi } from 'vitest';

import { Thewitcher } from './thewitcher';
import { RawgService } from '../../../../core/services/rawg.service';
import { CarrinhoFacade } from '../../../../core/facades/carrinho.facade';
import { FavoritosService } from '../../../../core/services/favoritos.service';

describe('Thewitcher - Carrossel', () => {
  let component: Thewitcher;
  let fixture: ComponentFixture<Thewitcher>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Thewitcher],

      providers: [
        {
          provide: RawgService,
          useValue: {
            obterDetalhesJogo: vi.fn(),
            obterScreenshots: vi.fn(),
          },
        },
        {
          provide: CarrinhoFacade,
          useValue: {
            adicionarProduto: vi.fn(),
          },
        },
        {
          provide: FavoritosService,
          useValue: {
            ehFavorito: vi.fn().mockReturnValue(false),
            toggleFavorito: vi.fn(),
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: vi.fn(),
          },
        },
        {
          provide: Location,
          useValue: {
            back: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Thewitcher);
    component = fixture.componentInstance;

    // Dados fictícios para o teste
    component.jogo = {
      id: 1,
      nome: 'The Witcher 3',
      descricao: 'Descrição do jogo',
      dataLancamento: '19/05/2015',
      desenvolvedoras: 'CD PROJEKT RED',
      distribuidoras: 'CD PROJEKT RED',
      classificacaoEtaria: '+18',
      plataformas: 'PC / PS5',
      background_image: 'imagem-1.jpg',
    };

    component.galeriaImagens = [
      'imagem-1.jpg',
      'imagem-2.jpg',
      'imagem-3.jpg',
    ];

    component.indiceAtivo = 0;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('deve passar para a próxima imagem ao clicar na seta direita', async () => {
    // Estado inicial
    expect(component.indiceAtivo).toBe(0);

    const imagemAntes = fixture.nativeElement.querySelector(
      '.img-destaque'
    ) as HTMLImageElement;

    expect(imagemAntes.getAttribute('src')).toBe('imagem-1.jpg');

    // Encontra a seta direita
    const botaoProximo = fixture.nativeElement.querySelector(
      '.btn-next'
    ) as HTMLButtonElement;

    // Simula o clique
    botaoProximo.click();

    fixture.detectChanges();
    await fixture.whenStable();

    // Deve ter passado para a segunda imagem
    expect(component.indiceAtivo).toBe(1);

    // A imagem exibida também deve ter mudado
    const imagemDepois = fixture.nativeElement.querySelector(
      '.img-destaque'
    ) as HTMLImageElement;

    expect(imagemDepois.getAttribute('src')).toBe('imagem-2.jpg');
  });
});