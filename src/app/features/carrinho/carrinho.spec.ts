import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthFacade } from '../../core/facades/auth.facade';
import { CarrinhoFacade } from '../../core/facades/carrinho.facade';
import { Carrinho } from './carrinho';

@Component({ standalone: true, template: '<h1>Checkout</h1>' })
class CheckoutFake {}

//Nessa parte do teste, é uma representação de como se o carrinho estivesse cheio.
describe('Carrinho', () => {
  let component: Carrinho;
  let fixture: ComponentFixture<Carrinho>;
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
    await TestBed.configureTestingModule({
      imports: [Carrinho],
      providers: [
        provideRouter([
          { path: 'checkout', component: CheckoutFake },
          { path: 'jogos', component: CheckoutFake },
        ]),
        { provide: CarrinhoFacade, useValue: carrinhoFacadeMock },
        { provide: AuthFacade, useValue: authFacadeMock },
      ],
    }).compileComponents();

    //Rpresenta o componente que está sendo testado.
    fixture = TestBed.createComponent(Carrinho);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // await fixture.whenStable(); O clique pode gerar uma opção que o angular ainda precisa processar,
  // basicamente é como se pedisse para esperar o angular terminar as operações pendentes antes de verificar os resultados.

  it('deve levar o usuário para o checkout ao clicar em Finalizar compra', async () => {
    const router = TestBed.inject(Router);
    const botao = fixture.nativeElement.querySelector('.btn-finalizar') as HTMLButtonElement;
    expect(botao).toBeTruthy();
    botao.click();
    await fixture.whenStable();
    expect(router.url).toBe('/checkout');
  });

  //Testa o sistema pelo olhar do usuário.
  it('caixa preta: deve navegar para jogos ao clicar em Explorar Jogos', async () => {
    carrinhoVazio.set(true);
    fixture.detectChanges();
    const botao = fixture.nativeElement.querySelector('.btn-explorar') as HTMLButtonElement;
    const router = TestBed.inject(Router);
    expect(botao).toBeTruthy();
    botao.click();
    await fixture.whenStable();
    expect(router.url).toBe('/jogos');
  });

  //Testa a lógica através do código.
  it('caixa branca: deve renderizar Explorar Jogos somente no ramo de carrinho vazio', () => {
    carrinhoVazio.set(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.btn-explorar')).toBeNull();
  });

  it('deve chamar removerItem da facade com o índice correto', () => {
    component.removerItem(0);
    expect(carrinhoFacadeMock.removerItem).toHaveBeenCalledWith(0);
  });
});
