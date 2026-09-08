import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { Carrinho } from './carrinho';
import { CarrinhoFacade } from '../../core/facades/carrinho.facade';
import { AuthFacade } from '../../core/facades/auth.facade';

@Component({
  standalone: true,
  template: '<h1>Checkout</h1>',
})
class CheckoutFake {}

describe('Carrinho', () => {
  let component: Carrinho;
  let fixture: ComponentFixture<Carrinho>;

  const carrinhoFacadeMock = {
    itens: vi.fn().mockReturnValue([
      {
        id: 1,
        nome: 'Jogo Teste',
        preco: 50,
        quantidade: 1,
        imagemUrl: '',
        plataforma: 'PC',
      },
    ]),

    quantidade: vi.fn().mockReturnValue(1),
    total: vi.fn().mockReturnValue(50),
    carrinhoVazio: vi.fn().mockReturnValue(false),

    aumentarQuantidade: vi.fn(),
    diminuirQuantidade: vi.fn(),
    removerItem: vi.fn(),
    limparCarrinho: vi.fn(),
    adicionarProduto: vi.fn(),
  };

  const authFacadeMock = {
    estaLogado: vi.fn().mockReturnValue(false),
  };

  beforeEach(async () => {
  carrinhoFacadeMock.carrinhoVazio.mockReturnValue(false);

  await TestBed.configureTestingModule({
    imports: [Carrinho],

    providers: [
      provideRouter([
        {
          path: 'checkout',
          component: CheckoutFake,
        },
      ]),

      {
        provide: CarrinhoFacade,
        useValue: carrinhoFacadeMock,
      },

      {
        provide: AuthFacade,
        useValue: authFacadeMock,
      },
    ],
  }).compileComponents();

  fixture = TestBed.createComponent(Carrinho);
  component = fixture.componentInstance;

  fixture.detectChanges();
});

  // TESTE DE CAIXA PRETA
  it('deve levar o usuário para o checkout ao clicar em Finalizar compra', async () => {
    const router = TestBed.inject(Router);

    const botao = fixture.nativeElement.querySelector('.btn-finalizar') as HTMLButtonElement;

    expect(botao).toBeTruthy();

    botao.click();

    await fixture.whenStable();

    expect(router.url).toBe('/checkout');
  });

  // TESTE DE CAIXA BRANCA
  it('deve chamar removerItem da facade com o índice correto', () => {
    component.removerItem(0);

    expect(carrinhoFacadeMock.removerItem).toHaveBeenCalledWith(0);
  });
});
