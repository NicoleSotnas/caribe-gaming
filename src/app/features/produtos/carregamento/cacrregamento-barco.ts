import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader-barco',
  standalone: true,
  template: `
    <div class="loader" role="status" aria-live="polite">
      <svg class="cena" viewBox="0 0 320 220" aria-hidden="true" focusable="false">

        <!-- gaivotas -->
        <g transform="translate(0 38)">
          <g class="voo voo1"><path class="bater" d="M0 0 Q5 -6 10 0 Q15 -6 20 0"/></g>
        </g>
        <g transform="translate(0 62)">
          <g class="voo voo2"><path class="bater" d="M0 0 Q4 -5 8 0 Q12 -5 16 0"/></g>
        </g>
        <g transform="translate(0 24)">
          <g class="voo voo3"><path class="bater" d="M0 0 Q3 -4 6 0 Q9 -4 12 0"/></g>
        </g>

        <!-- âncora -->
        <g transform="translate(282 34)">
          <g class="ancora">
            <circle cx="0" cy="-13" r="4"/>
            <path d="M0 -9 V15 M-8 -3 H8 M-13 7 Q-13 17 0 17 Q13 17 13 7 M-16 9 L-13 5 L-9 9 M16 9 L13 5 L9 9"/>
          </g>
        </g>

        <!-- onda do fundo -->
        <g class="onda onda-fundo">
          <path d="M0 146 q40 -12 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 V220 H0 Z"/>
        </g>

        <!-- barco -->
        <g class="barco">
          <path class="mastro" d="M150 118 V8 M218 118 V40"/>

          <g class="vela">
            <path d="M118 36 H182 Q194 53 182 70 H118 Q106 53 118 36 Z"/>
            <path d="M114 76 H186 Q200 94 186 112 H114 Q100 94 114 76 Z"/>
            <path d="M194 60 H242 Q254 86 242 112 H194 Q182 86 194 60 Z"/>
          </g>

          <path class="verga" d="M110 36 H190 M104 76 H196 M186 60 H250"/>
          <path class="bandeira" d="M150 26 V12 Q166 6 184 12 Q170 19 184 26 Q166 22 150 26 Z"/>

          <path class="casco" d="M56 116 H254 C252 142 228 160 198 162 H110 C82 160 58 142 56 116 Z"/>
          <path class="faixa" d="M57 124 H253"/>
          <path class="casco" d="M56 116 V100 H92 V116 Z"/>
          <circle class="janela" cx="100" cy="137" r="3.5"/>
          <circle class="janela" cx="120" cy="139" r="3.5"/>
          <circle class="janela" cx="140" cy="140" r="3.5"/>
        </g>

        <!-- ondas da frente -->
        <g class="onda onda-meio">
          <path d="M0 152 q40 -10 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 V220 H0 Z"/>
        </g>
        <g class="onda onda-frente">
          <path d="M0 160 q40 -12 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 V220 H0 Z"/>
        </g>
      </svg>

      <p class="texto">{{ texto }}</p>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
    }

    .loader {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    /* bordas suaves nos lados e embaixo (a água "some" no fundo) */
    .cena {
      width: min(340px, 82vw);
      height: auto;
      -webkit-mask-image:
        linear-gradient(to right, transparent, #000 10%, #000 90%, transparent),
        linear-gradient(to bottom, #000 80%, transparent);
      -webkit-mask-composite: source-in;
      mask-image:
        linear-gradient(to right, transparent, #000 10%, #000 90%, transparent),
        linear-gradient(to bottom, #000 80%, transparent);
      mask-composite: intersect;
    }

    /* ---------- barco ---------- */
    .barco {
      transform-origin: 155px 150px;
      animation: balancar 3.4s ease-in-out infinite;
    }
    @keyframes balancar {
      0%, 100% { transform: translateY(0) rotate(-1.8deg); }
      50%      { transform: translateY(-5px) rotate(1.8deg); }
    }

    .mastro { stroke: #6b4a2b; stroke-width: 4; stroke-linecap: round; fill: none; }
    .verga  { stroke: #6b4a2b; stroke-width: 3; stroke-linecap: round; fill: none; }

    .vela path {
      fill: #fdf6e3;
      stroke: #14213a;
      stroke-width: 1.6;
      stroke-linejoin: round;
      transform-box: fill-box;
      transform-origin: center;
      animation: inflar 2.8s ease-in-out infinite alternate;
    }
    .vela path:nth-child(2) { animation-delay: -0.9s; }
    .vela path:nth-child(3) { animation-delay: -1.8s; }
    @keyframes inflar {
      from { transform: scaleX(1); }
      to   { transform: scaleX(1.05); }
    }

    .bandeira {
      fill: #ff4757;
      transform-box: fill-box;
      transform-origin: left center;
      animation: tremular 0.9s ease-in-out infinite alternate;
    }
    @keyframes tremular {
      from { transform: skewY(-6deg) scaleX(1); }
      to   { transform: skewY(6deg) scaleX(0.9); }
    }

    .casco  { fill: #14213a; stroke: #0a1626; stroke-width: 1; }
    .faixa  { stroke: #00d2d3; stroke-width: 5; fill: none; }
    .janela { fill: #72ecff; }

    /* ---------- ondas ---------- */
    .onda-fundo path  { fill: #4fc3e8; opacity: 0.5; }
    .onda-meio path   { fill: #00d2d3; opacity: 0.75; }
    .onda-frente path { fill: #0e7fa8; opacity: 0.95; }

    .onda { animation: correr linear infinite; }
    .onda-fundo  { animation-duration: 7s;   animation-delay: -1.5s; }
    .onda-meio   { animation-duration: 4.5s; animation-delay: -2.2s; }
    .onda-frente { animation-duration: 3s; }
    @keyframes correr {
      from { transform: translateX(0); }
      to   { transform: translateX(-160px); }
    }

    /* ---------- gaivotas ---------- */
    .voo { animation: voar linear infinite; }
    .voo1 { animation-duration: 9s;  animation-delay: -2s; }
    .voo2 { animation-duration: 12s; animation-delay: -7s; }
    .voo3 { animation-duration: 15s; animation-delay: -4s; }
    @keyframes voar {
      from { transform: translateX(-40px); }
      to   { transform: translateX(340px); }
    }

    .bater {
      fill: none;
      stroke: #ffffff;
      stroke-width: 2;
      stroke-linecap: round;
      transform-box: fill-box;
      transform-origin: center;
      animation: bater 0.55s ease-in-out infinite alternate;
    }
    @keyframes bater {
      from { transform: scaleY(1); }
      to   { transform: scaleY(0.45); }
    }

    /* ---------- âncora ---------- */
    .ancora {
      fill: none;
      stroke: #72ecff;
      stroke-width: 2.6;
      stroke-linecap: round;
      stroke-linejoin: round;
      opacity: 0.6;
      transform-origin: 0 -13px;
      animation: balancarAncora 4s ease-in-out infinite;
    }
    @keyframes balancarAncora {
      0%, 100% { transform: rotate(-6deg); }
      50%      { transform: rotate(6deg); }
    }

    /* ---------- texto ---------- */
    .texto {
      margin: 6px 0 0;
      font-size: 0.95rem;
      font-weight: 600;
      letter-spacing: 0.5px;
      color: #72ecff;
      animation: pulsar 2s ease-in-out infinite;
    }
    @keyframes pulsar {
      0%, 100% { opacity: 1; }
      50%      { opacity: 0.55; }
    }

    /* quem prefere menos movimento no sistema vê a cena parada */
    @media (prefers-reduced-motion: reduce) {
      .cena *, .texto { animation: none !important; }
    }
  `]
})
export class LoaderBarco {
  @Input() texto = "Navegando nos mares da Caribe's Gaming...";
}