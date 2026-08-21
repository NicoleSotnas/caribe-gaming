import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../shared/header/header';

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
  activeHeroIndex = 0;
  private autoSlideTimer: any;

  // Banner Principal (Homem-Aranha e EA FC 24)
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
      title: 'Formula 1 2025',
      subtitle: 'Sinta a emoção da velocidade com o F1 2025.',
      originalPrice: 'R$ 359,00',
      promoPrice: 'R$ 143,60',
      discount: '-60%',
      badge: 'DESTAQUE DA SEMANA',
      image: 'https://i.pinimg.com/1200x/8f/f1/cb/8ff1cb847ff1b7e3507ad494a29744c2.jpg',
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
      image: 'https://i.pinimg.com/736x/73/f7/47/73f7476132056ce768d3adee46dafc64.jpg',
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
<<<<<<< HEAD
}
=======

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
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
>>>>>>> d04ad2c0fc0cf4c359316c5bb2346c2bebd6373f
