import {
  Component,
  inject,
  ViewEncapsulation,
  ElementRef,
  HostListener
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthFacade } from '../../core/facades/auth.facade';
import { ProdutosService } from '../../core/services/produtos.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
  encapsulation: ViewEncapsulation.Emulated,
})
export class Header {

  authFacade = inject(AuthFacade);
  produtosService = inject(ProdutosService);
  router = inject(Router);

  menuAberto = false;
  menuUsuarioAberto = false;

  termoPesquisa = '';

  mostrarSugestoes = false;

  produtosFiltrados: any[] = [];

  constructor(private elementRef: ElementRef) {}

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  fecharMenu() {
    this.menuAberto = false;
  }

  toggleMenuUsuario() {
    this.menuUsuarioAberto = !this.menuUsuarioAberto;
  }

  // ==========================
  // PESQUISA
  // ==========================

  pesquisar() {

    const termo = this.termoPesquisa.trim().toLowerCase();

    if (!termo) {
      this.produtosFiltrados = [];
      this.mostrarSugestoes = false;
      return;
    }

    this.produtosFiltrados = this.produtosService.listaProdutos
      .filter(produto =>
        produto.nome.toLowerCase().includes(termo)
      )
      .slice(0, 6);

    this.mostrarSugestoes = true;
  }

  selecionarJogo(produto: any) {

    this.termoPesquisa = produto.nome;
    this.mostrarSugestoes = false;

    this.router.navigateByUrl(this.obterRotaJogo(produto));
  }

  // Define a rota correta de cada jogo
  obterRotaJogo(produto: any): string {

    const rotas: { [slug: string]: string } = {

      'grand-theft-auto-v':
        '/jogos/grand-theft-auto-v',

      'the-witcher-3-wild-hunt':
        '/jogos/the-witcher-3',

      'the-sims-4':
        '/jogos/the-sims-4',

      'god-of-war-4':
        '/jogos/god-of-war',

      'marvels-spider-man-remastered':
        '/jogos/marvels-spider-man-remastered',

      'call-of-duty-modern-warfare-ii-2022':
        '/jogos/call-of-duty-modern-warfare-ii',

      'a-plague-tale-innocence':
        '/jogos/a-plague-tale',

      'god-of-war-ragnarok':
        '/jogos/god-of-war-ragnarök',

      'hollow-knight':
        '/jogos/hollow-knight',

      'the-last-of-us-part-ii-remastered':
        '/jogos/the-last-of-us-II',

      'red-dead-redemption-2':
        '/jogos/red-dead-redemption-2',

      'assassins-creed-iv-black-flag':
        '/jogos/assassins-creed-iv-black-flag',

      'yakuza-0':
        '/jogos/yakuza-0',

      'ea-sports-fc-24':
        '/jogos/ea-sports-fc-24',

      'life-is-strange':
        '/jogos/life-is-strange',

      'the-last-of-us-part-i':
        '/jogos/the-last-of-Us',

      'f1-23':
        '/jogos/f1-23',

      'elden-ring':
        '/jogos/elden-ring',

      'cyberpunk-2077':
        '/jogos/cyberpunk-2077',

      'marvel-rivals':
        '/jogos/marvel-rivals'
    };

    // Se tiver uma rota específica, usa ela
    if (rotas[produto.slug]) {
      return rotas[produto.slug];
    }

    // Para os outros jogos, usa sua página de detalhe
    return `/produto/${produto.id}`;
  }

  // ==========================
  // CLIQUE FORA
  // ==========================

  @HostListener('document:click', ['$event'])
  aoClicarFora(event: Event) {

    if (!this.elementRef.nativeElement.contains(event.target)) {

      this.menuUsuarioAberto = false;

      this.mostrarSugestoes = false;
    }
  }

  // ==========================
  // SAIR
  // ==========================

  sair() {

    this.authFacade.sair();

    this.menuUsuarioAberto = false;

    this.fecharMenu();
  }
}