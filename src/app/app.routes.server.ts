import { RenderMode, ServerRoute } from '@angular/ssr';


export const serverRoutes: ServerRoute[] = [
  // ... outras rotas que já existem aí no seu projeto

  
  {
    path: 'produto/:id',
    renderMode: RenderMode.Server
  },
 
    

    { path: '**', renderMode: RenderMode.Server },

];