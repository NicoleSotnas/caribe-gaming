import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach } from 'vitest';

import { Footer } from './footer';

describe('Footer', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;

    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('deve criar o Footer com as informações principais', () => {
    expect(component).toBeTruthy();

    const footer = fixture.nativeElement.querySelector('footer');

    expect(footer).toBeTruthy();
    expect(footer.textContent).toContain('Navegação');
    expect(footer.textContent).toContain('Suporte');
    expect(footer.textContent).toContain('Acompanhe-nos');
  });

  it('deve exibir os links de navegação e redes sociais', () => {
    const footer = fixture.nativeElement;

    expect(footer.textContent).toContain('Início');
    expect(footer.textContent).toContain('Jogos');
    expect(footer.textContent).toContain('Sobre Nós');
    expect(footer.textContent).toContain('Carrinho');

    expect(footer.textContent).toContain('caribetteam@gmail.com');
    expect(footer.textContent).toContain('R. Marquês de Sapucaí, 200 - Cidade Nova');

    expect(footer.querySelector('[aria-label="GitHub"]')).toBeTruthy();
    expect(footer.querySelector('[aria-label="LinkedIn"]')).toBeTruthy();
    expect(footer.querySelector('[aria-label="Instagram"]')).toBeTruthy();
  });
});