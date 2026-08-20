import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { ChevronLeft } from '@primeicons/angular/chevron-left';
import { ChevronRight } from '@primeicons/angular/chevron-right';
import { Header } from '../../shared/header/header';

interface CarouselItem {
  id: number;
  image: string;
  title: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CarouselModule, ChevronLeft, ChevronRight, Header],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  // Itens do 1º Carrossel
  items: CarouselItem[] = [
    {
      id: 1,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdCNW9622QbMDVZAlExMojBUCzhwBnqD1W2lB3UPotPQ&s=10',
      title: 'Item 1',
    },
    {
      id: 2,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6upNO06KTImeHJUphwtnLaiJB-uz2xb_WSusQ5m62kg&s=10',
      title: 'Item 2',
    },
  ];

  // Itens do 2º Carrossel
  loopItems: CarouselItem[] = [
    {
      id: 101,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9PtGjawIc5S6rT8-HrpKbyXFozSOTi0Sl-rkDTmJTbA&s=10',
      title: 'Jogo 1',
    },
    {
      id: 102,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFHRhPtVKK2dGvAcLr3ubTNeIC22MGnIgxcmVzjBgeyQ&s=10',
      title: 'Jogo 2',
    },
    {
      id: 103,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRekeDpwU7xCiO947psRwjCU3Xy0b6WLluSDmkAeOiU5Q&s=10',
      title: 'Jogo 3',
    },
    {
      id: 104,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBTT0TQOjjeu-Ed570zZDuYGyHP_NbOIPxB24_5a63qA&s=10',
      title: 'Jogo 4',
    },
  ];
}
