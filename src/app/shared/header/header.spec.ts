import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { provideRouter, RouterLink } from '@angular/router';
import { By } from '@angular/platform-browser';

import { Header } from './header';
import { ProdutosService } from '../../core/services/produtos.service';
import { AuthFacade } from '../../core/facades/auth.facade';

describe('Header', () => {
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
            estaLogado: () => false,
          },
        },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;

    await fixture.whenStable();
    fixture.detectChanges();
  });

  // ==========================================
  // BARRA DE PESQUISA
  // ==========================================
  describe('Barra de Pesquisa', () => {
    it('deve encontrar jogo especifico ao pesquisar', () => {
      component.termoPesquisa = 'Red Dead';

      component.pesquisar();

      expect(
        component.produtosFiltrados.some((produto) => produto.nome === 'Red Dead Redemption 2'),
      ).toBe(true);
    });

    it('deve mostrar jogo especifico ao digitar na barra de pesquisa na sugestao', async () => {
      const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

      expect(input).toBeTruthy();

      const user = userEvent.setup();

      await user.type(input, 'Red Dead');

      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('Red Dead Redemption 2');
    });
  });

  // ==========================================
  // LINKS DE NAVEGAÇÃO
  // ==========================================
  describe('Links de Navegação', () => {
    it('deve conter os links principais com as rotas corretas', () => {
      const debugElements = fixture.debugElement.queryAll(By.directive(RouterLink));
      const routerLinks = debugElements.map((de) => de.injector.get(RouterLink));

      expect(routerLinks.length).toBeGreaterThan(0);

      const temLinkHome = routerLinks.some(
        (link) => link.urlTree?.toString() === '/' || link.urlTree?.toString() === '',
      );
      expect(temLinkHome).toBe(true);
    });

    it('deve possuir a diretiva RouterLink configurada nos elementos de navegacao', () => {
      const debugElements = fixture.debugElement.queryAll(By.directive(RouterLink));
      expect(debugElements.length).toBeGreaterThan(0);

      debugElements.forEach((de) => {
        const routerLink = de.injector.get(RouterLink);
        expect(routerLink.urlTree).toBeDefined();
      });
    });
  });

  // ==========================================
  // MENU MOBILE E ÍCONES
  // ==========================================
  describe('Menu Mobile e Ícones', () => {
    it('deve alternar o ícone e a visibilidade do menu ao clicar no botão do menu', async () => {
      const user = userEvent.setup();

      // Busca especificamente o botão do menu (evitando o botão de busca com lupa)
      const allButtons = Array.from(
        fixture.nativeElement.querySelectorAll('button'),
      ) as HTMLButtonElement[];

      const menuButton =
        allButtons.find(
          (btn) =>
            btn.className.includes('menu') ||
            btn.className.includes('toggle') ||
            btn.className.includes('hamburguer') ||
            btn.querySelector('.fa-bars, .fa-xmark, .fa-bars-staggered, [class*="menu"]') !== null,
        ) || allButtons[0];

      expect(menuButton).toBeTruthy();

      const iconeElement = menuButton.querySelector('i, mat-icon, span') || menuButton;
      const iconeInicial = iconeElement.className || iconeElement.textContent?.trim();

      // Clique 1: Abre o menu / alterna o ícone
      await user.click(menuButton);
      fixture.detectChanges();

      const iconeAposAbrir = iconeElement.className || iconeElement.textContent?.trim();
      expect(iconeAposAbrir).not.toBe(iconeInicial);

      // Clique 2: Fecha o menu / restaura o ícone
      await user.click(menuButton);
      fixture.detectChanges();

      const iconeAposFechar = iconeElement.className || iconeElement.textContent?.trim();
      expect(iconeAposFechar).toBe(iconeInicial);
    });
  });
});
