import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import type { RenderResult } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthFacade } from '../../core/facades/auth.facade';
import { CarrinhoFacade } from '../../core/facades/carrinho.facade';
import { Carrinho } from './carrinho';

@Component({ standalone: true, template: '<h1>Checkout</h1>' })
class CheckoutFake {}

//Nessa parte do teste, é uma representação de como se o carrinho estivesse cheio.
describe('Carrinho', () => {
  let fixture: RenderResult<Carrinho, Carrinho, import('@testing-library/dom').Queries>;
  const carrinhoVazio = signal(false);
  const carrinhoFacadeMock = {
    carrinhoVazio,
    itens: signal([
      { id: 1, nome: 'Jogo Teste', preco: 50, quantidade: 1, imagemUrl: '', plataforma: 'PC' },
    ]),
    quantidade: signal(1),
    total: signal(50),
    aumentarQuantidade: vi.fn(),
    diminuirQuantidade: vi.fn(),
    removerItem: vi.fn(),
    limparCarrinho: vi.fn(),
    adicionarProduto: vi.fn(),
  };

  //É uma versão falsa para ser usada somente durante o teste. Em vez de usar o facade real, é usado uma versão controlada pelo programador.
  const authFacadeMock = { estaLogado: vi.fn().mockReturnValue(false) };

  beforeEach(async () => {
    carrinhoVazio.set(false);
    fixture = await render(Carrinho, {
      providers: [
        provideRouter([
          { path: 'checkout', component: CheckoutFake },
          { path: 'jogos', component: CheckoutFake },
        ]),
        { provide: CarrinhoFacade, useValue: carrinhoFacadeMock },
        { provide: AuthFacade, useValue: authFacadeMock },
      ],
    });
  });

  // await fixture.whenStable(); O clique pode gerar uma opção que o angular ainda precisa processar,
  // basicamente é como se pedisse para esperar o angular terminar as operações pendentes antes de verificar os resultados.

  it('deve levar o usuário para o checkout ao clicar em Finalizar compra', async () => {
    const router = TestBed.inject(Router);
    const botao = fixture.fixture.nativeElement.querySelector('.btn-finalizar') as HTMLButtonElement;
    expect(botao).toBeTruthy();
    botao.click();
    await fixture.fixture.whenStable();
    expect(router.url).toBe('/checkout');
  });

  // Caixa preta: testa o comportamento visível pela perspectiva do usuário,
  // sem depender de detalhes do código-fonte na verificação.
  // A entrada é o clique no botão e o resultado esperado é a navegação para /jogos.
  it('caixa preta: deve navegar para jogos ao clicar em Explorar Jogos', async () => {
    carrinhoVazio.set(true);
    fixture.fixture.detectChanges();
    const botao = screen.getByRole('button', { name: /explorar jogos/i });
    const router = fixture.fixture.debugElement.injector.get(Router);
    await userEvent.click(botao);
    expect(router.url).toBe('/jogos');
  });

  // Caixa branca: testa a lógica interna pela perspectiva do desenvolvedor,
  // verificando diretamente o signal que controla o @if e o seletor de implementação.
  it('caixa branca: deve renderizar Explorar Jogos quando o carrinho está vazio', () => {
    carrinhoVazio.set(true);
    fixture.fixture.detectChanges();
    expect(carrinhoFacadeMock.carrinhoVazio()).toBe(true);
    expect(fixture.fixture.nativeElement.querySelector('.btn-explorar')).toBeTruthy();
  });

  it('deve chamar removerItem da facade com o índice correto', () => {
    fixture.fixture.componentInstance.removerItem(0);
    expect(carrinhoFacadeMock.removerItem).toHaveBeenCalledWith(0);
  });
});
