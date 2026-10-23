
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/header/header';

@Component({
  selector: 'app-sobrenos',
  standalone: true,
  imports: [Header, RouterLink],
  templateUrl: './sobrenos.html',
  styleUrl: './sobrenos.css',
})
export class Sobrenos {}
