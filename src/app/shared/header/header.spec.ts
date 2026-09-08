import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { provideRouter } from '@angular/router';

import { Header } from './header';
import { ProdutosService } from '../../core/services/produtos.service';
import { AuthFacade } from '../../core/facades/auth.facade';

describe('Header - Barra de Pesquisa', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],

      providers: [
        ProdutosService,

        {
          provide: AuthFacade,
          useValue: {
            estaLogado: () => false
          }
        },

        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;

    await fixture.whenStable();
    fixture.detectChanges();
  });

  // TESTE — LÓGICA DA PESQUISA
  it('deve encontrar jogo especifico ao pesquisar', () => {
    component.termoPesquisa = 'Red Dead';

    component.pesquisar();

    expect(
      component.produtosFiltrados.some(
        produto => produto.nome === 'Red Dead Redemption 2'
      )
    ).toBe(true);
  });

  // TESTE — VISUAL DA PESQUISA
  it('deve mostrar jogo especifico ao digitar na barra de pesquisa na sugestao', async () => {
    const input = fixture.nativeElement.querySelector(
      'input'
    ) as HTMLInputElement;

    expect(input).toBeTruthy();

    const user = userEvent.setup();

    await user.type(input, 'Red Dead');

    fixture.detectChanges();

    expect(
      fixture.nativeElement.textContent
    ).toContain('Red Dead Redemption 2');
  });
});
