import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RawgService, DetalhesJogo } from '../../../../core/services/rawg.service';

@Component({
  selector: 'app-thewitcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './thewitcher.html',
  styleUrl: './thewitcher.css'
})
export class Thewitcher implements OnInit {
  jogo: DetalhesJogo | null = null;
  carregando: boolean = true;
  erro: boolean = false;

  galeriaImagens: string[] = [
    'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/ss_107be6d788f43716514b136bad78e8d0b2bcf232.1920x1080.jpg',
    'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/ss_f8f018448108a9f626a57529d10e5414e08216c5.1920x1080.jpg',
    'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/ss_692e8289f712f5847b231d2e1c94d03d3c8c27a2.1920x1080.jpg',
    'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/ss_84074213da8f8303e6727ed24816be50c7ea519f.1920x1080.jpg',
  ];

  imagemPrincipal: string = this.galeriaImagens[0];
  favorito: boolean = false;

  constructor(private rawgService: RawgService) {}

 ngOnInit(): void {
  console.log('1. ngOnInit disparou');
  this.rawgService.obterDetalhesTheWitcher3().subscribe({
    next: (dados) => {
      console.log('2. Dados recebidos:', dados);
      this.jogo = dados;
      this.carregando = false;
    },
    error: (err) => {
      console.log('3. Deu erro:', err);
      console.error('Erro ao carregar detalhes:', err);
      this.carregando = false;
      this.erro = true;
    }
  });
}

  selecionarImagem(img: string): void {
    this.imagemPrincipal = img;
  }

  toggleFavorito(): void {
    this.favorito = !this.favorito;
  }
}