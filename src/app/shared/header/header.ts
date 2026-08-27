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

    const termo = this.termoPesquisa
      .trim()
      .toLowerCase();

    if (!termo) {
      this.produtosFiltrados = [];
      this.mostrarSugestoes = false;
      return;
    }

    this.produtosFiltrados =
      this.produtosService.listaProdutos
        .filter(produto => {

          const nome =
            produto.nome?.toLowerCase() || '';

          const slug =
            produto.slug?.toLowerCase() || '';

          return (
            nome.includes(termo) ||
            slug.includes(termo)
          );
        })
        .slice(0, 6);

    this.mostrarSugestoes =
      this.produtosFiltrados.length > 0;
  }


  // ==========================
  // SELECIONAR JOGO
  // ==========================

  selecionarJogo(produto: any) {

    this.termoPesquisa = produto.nome;

    this.mostrarSugestoes = false;

    const rota = this.obterRotaJogo(produto);

    this.router.navigateByUrl(rota);
  }


  // ==========================
  // ROTAS DOS JOGOS
  // ==========================

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

      // RED DEAD
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


    const slug =
      produto.slug?.toLowerCase();


    // Se existir uma rota específica
    if (slug && rotas[slug]) {
      return rotas[slug];
    }


    // Caso não exista rota específica,
    // abre a página genérica do produto
    return `/produto/${produto.id}`;
  }


  // ==========================
  // CLIQUE FORA
  // ==========================

  @HostListener('document:click', ['$event'])
  aoClicarFora(event: Event) {

    if (
      !this.elementRef.nativeElement.contains(
        event.target
      )
    ) {

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