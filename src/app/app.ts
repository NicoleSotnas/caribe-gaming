import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/header/header';
import { Footer } from './shared/footer/footer'; // Import do Footer

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer], // Adicionado Footer ao array
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('caribe-gaming');
}
