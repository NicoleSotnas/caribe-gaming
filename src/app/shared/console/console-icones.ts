import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Plataforma {
  icone: string;
  rotulo: string;
}

const MAPA: Record<string, Plataforma> = {
  pc: { icone: 'fa-brands fa-windows', rotulo: 'PC' },
  ps: { icone: 'fa-brands fa-playstation', rotulo: 'PlayStation' },
  xbox: { icone: 'fa-brands fa-xbox', rotulo: 'Xbox' },
  switch: { icone: 'fa-brands fa-nintendo-switch', rotulo: 'Nintendo Switch' },
};

@Component({
  selector: 'app-plataforma-icones',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="plat" *ngFor="let p of lista" [title]="p.rotulo">
      <i [class]="p.icone"></i>
    </span>
  `,
  styles: [`
    :host {
      position: absolute;
      top: -6px;
      right: -5px;
       display: inline-flex;
      gap: 4px;
      z-index: 5;

    }
    .plat {
      background: rgba(10, 22, 38, 0.85);
      backdrop-filter: blur(4px);
      color: #ffffff;
      width: 26px;
      height: 26px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
    }
  `]
})
export class PlataformaIcones {
  lista: Plataforma[] = [];

  // aceita "PC / PS" (texto) ou ['PC', 'PS'] (lista)
  @Input() set plataformas(valor: string | string[] | undefined) {
    const itens = Array.isArray(valor) ? valor : (valor ?? '').split('/');
    const vistos = new Set<string>();
    this.lista = [];

    for (const bruto of itens) {
      const t = bruto.trim().toLowerCase();
      let chave = '';
      if (t === 'pc' || t.includes('windows')) chave = 'pc';
      else if (t.startsWith('ps') || t.includes('playstation')) chave = 'ps';
      else if (t.includes('xbox')) chave = 'xbox';
      else if (t.includes('switch') || t.includes('nintendo')) chave = 'switch';

      if (chave && !vistos.has(chave)) {
        vistos.add(chave);
        this.lista.push(MAPA[chave]);
      }
    }
  }
}