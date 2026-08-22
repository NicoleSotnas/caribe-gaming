import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Header } from '../../shared/header/header';
import { CarrinhoFacade } from '../../core/facades/carrinho.facade';

interface GameItem {
  id: number;
  title: string;
  subtitle: string;
  originalPrice: string;
  promoPrice: string;
  discount: string;
  badge?: string;
  image: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  private carrinhoFacade = inject(CarrinhoFacade);
  private router = inject(Router);

  activeHeroIndex = 0;
  private autoSlideTimer: any;

  // Banner Principal (Homem-Aranha e Formula 1 25)
  heroGames: GameItem[] = [
    {
      id: 1,
      title: "Marvel's Spider-Man Remastered",
      subtitle: 'Experimente a ação de super-herói em uma aventura épica.',
      originalPrice: 'R$ 349,90',
      promoPrice: 'R$ 199,90',
      discount: '-42%',
      badge: 'OFERTA DO DIA',
      image: 'https://i.pinimg.com/1200x/c8/a6/93/c8a693307e006df55eb3b8c7cb86891d.jpg',
    },
    {
      id: 2,
      title: 'Formula 1 2023',
      subtitle: 'Sinta a emoção da velocidade com o F1 2023.',
      originalPrice: 'R$ 359,00',
      promoPrice: 'R$ 143,60',
      discount: '-60%',
      badge: 'DESTAQUE DA SEMANA',
      image: 'https://i.pinimg.com/1200x/71/52/68/715268628f6902ea0ed1361b71dbf627.jpg',
    },
  ];

  // Carrossel com os 6 Jogos Solicitados
  offerGames: GameItem[] = [
    {
      id: 101,
      title: 'Red Dead Redemption 2',
      subtitle: 'Rockstar Games',
      originalPrice: 'R$ 299,90',
      promoPrice: 'R$ 98,96',
      discount: '-67%',
      image: 'https://i.pinimg.com/1200x/71/52/68/715268628f6902ea0ed1361b71dbf627.jpg',
    },
    {
      id: 102,
      title: 'Grand Theft Auto V',
      subtitle: 'Rockstar Games',
      originalPrice: 'R$ 149,90',
      promoPrice: 'R$ 74,95',
      discount: '-50%',
      image: 'https://i.pinimg.com/1200x/7d/bf/17/7dbf17f91c0fd5f606eb6ee7bb5cd636.jpg',
    },
    {
      id: 103,
      title: 'A Plague Tale: Innocence',
      subtitle: 'Focus Entertainment',
      originalPrice: 'R$ 229,00',
      promoPrice: 'R$ 91,60',
      discount: '-60%',
      image: 'https://i.pinimg.com/736x/69/13/bc/6913bc995e29ebe2bde3715cb6a0199e.jpg',
    },
    {
      id: 104,
      title: 'The Last of Us Part II',
      subtitle: 'PlayStation Studios',
      originalPrice: 'R$ 249,50',
      promoPrice: 'R$ 124,75',
      discount: '-50%',
      image: 'https://i.pinimg.com/736x/af/d9/62/afd962cd0ddbaf6209f340e4d6edcd39.jpg',
    },
    {
      id: 105,
      title: 'Life is Strange',
      subtitle: 'Square Enix',
      originalPrice: 'R$ 99,00',
      promoPrice: 'R$ 19,80',
      discount: '-80%',
      image: 'https://i.pinimg.com/1200x/d5/97/af/d597aff5740c76d0dd4504d7d12be010.jpg',
    },
    {
      id: 106,
      title: 'Cyberpunk 2077',
      subtitle: 'CD PROJEKT RED',
      originalPrice: 'R$ 199,90',
      promoPrice: 'R$ 99,95',
      discount: '-50%',
      image: 'https://i.pinimg.com/736x/67/89/fb/6789fb1dbf2c2e641e0f81f56ce8ccc6.jpg',
    },
  ];

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  // Método ajustado para usar adicionarProduto
  comprarAgora(jogo: GameItem) {
    const precoNumerico = parseFloat(
      jogo.promoPrice.replace('R$', '').replace('.', '').replace(',', '.').trim()
    );

    this.carrinhoFacade.adicionarProduto({
      id: jogo.id,
      nome: jogo.title,
      preco: precoNumerico,
      imagem: jogo.image,
    } as any);

    this.router.navigate(['/carrinho']);
  }

  startAutoSlide() {
    this.autoSlideTimer = setInterval(() => {
      this.nextHero();
    }, 5000);
  }

  stopAutoSlide() {
    if (this.autoSlideTimer) {
      clearInterval(this.autoSlideTimer);
    }
  }

  prevHero() {
    this.stopAutoSlide();
    this.activeHeroIndex =
      (this.activeHeroIndex - 1 + this.heroGames.length) % this.heroGames.length;
    this.startAutoSlide();
  }

  nextHero() {
    this.activeHeroIndex = (this.activeHeroIndex + 1) % this.heroGames.length;
  }

  selectHero(index: number) {
    this.stopAutoSlide();
    this.activeHeroIndex = index;
    this.startAutoSlide();
  }

  scrollOffers(container: HTMLDivElement, direction: 'left' | 'right') {
    const scrollAmount = direction === 'left' ? -320 : 320;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
}