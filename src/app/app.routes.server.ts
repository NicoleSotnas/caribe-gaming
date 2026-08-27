import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // ... outras rotas que já existem aí no seu projeto

  {
    path: 'jogos/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'sobre-nos',
    renderMode: RenderMode.Prerender, // Ou RenderMode.Server
  },
  {
    path: 'jogos/:id',
    renderMode: RenderMode.Server,
  },

  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
