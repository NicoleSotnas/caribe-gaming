// src/app/core/models/jogo.ts

export interface Comentario {
  id: number;
  autor: string;
  avatar: string;
  corAvatar?: string;
  estrelas: number;
  texto: string;
  data: string;
  likes: number;
  dislikes: number;
  votouLike?: boolean;
  votouDislike?: boolean;
}

export interface DetalhesJogo {
  id: number | string;
  nome: string;
  descricao: string;
  dataLancamento: string;
  desenvolvedoras: string;
  distribuidoras: string;
  classificacaoEtaria?: string;
  plataformas: string;
  background_image?: string;
  slug?: string;

  // campos novos (opcionais para as páginas antigas continuarem compilando)
  generos?: string;
  imagens?: string[];
  requisitos?: { minimos: string | null; recomendados: string | null };
  gratis?: boolean;
  estoque?: boolean;
  preco?: {
    atual: string;
    original: string | null;
    desconto: number;
    valor: number;
  } | null;
  avaliacao?: { nota: string; total: number } | null;
  caracteristicas?: string[];
  dlcIds?: number[];
}

export interface Produto {
  id: string;
  nome: string;
  steamAppId?: string;
  genero: string;
  plataforma: string;
  precoOriginal: string;
  precoPromocional: string;
  precoNumero?: number;
  desconto: number | string;
  categorias: string[];
  slug?: string;
  imagem?: string;
  imagemPosicao?: string;
  descricaoCustom?: string;
  favorito?: boolean;
  estoque?: boolean;
}

export interface JogoCard {
  id: number;
  nome: string;
  slug: string;
  capa: string;
  plataformas: string[];
  generos: string[];
  categorias: string[];
  gratis: boolean;
  estoque: boolean;
  preco: {
    atual: string;
    original: string | null;
    desconto: number;
    valor: number;
  } | null;
}

export interface JogoCatalogo {
  appid: number;
  nome: string;
  plataformas: string[];
  generos: string[];
  categorias: string[];
  gratis?: boolean;
  estoque?: boolean;
}

export interface Dlc {
  id: number;
  nome: string;
  imagem: string;
  gratis: boolean;
  preco: {
    atual: string;
    original: string | null;
    desconto: number;
    valor: number;
  } | null;
}

export const CATALOGO: JogoCatalogo[] = [
  { appid: 271590,  nome: 'Grand Theft Auto V', plataformas: ['PC', 'PS'], generos: ['Ação', 'Mundo Aberto'], categorias: ['action', 'adventure'] },
  { appid: 292030,  nome: 'The Witcher 3: Wild Hunt', plataformas: ['PC', 'PS'], generos: ['RPG', 'Mundo Aberto'], categorias: ['role-playing-rpg', 'adventure'] },
  { appid: 1222670, nome: 'The Sims 4', plataformas: ['PC'], generos: ['Simulação'], categorias: ['simulator'], gratis: true },
  { appid: 1593500, nome: 'God of War', plataformas: ['PC', 'PS'], generos: ['Ação', 'Aventura'], categorias: ['action', 'adventure'] },
  { appid: 1817070, nome: "Marvel's Spider-Man Remastered", plataformas: ['PC', 'PS'], generos: ['Ação', 'Aventura'], categorias: ['action', 'adventure'] },
  { appid: 2519060, nome: 'Call of Duty: Modern Warfare III', plataformas: ['PC', 'PS'], generos: ['Tiro', 'FPS'], categorias: ['shooter', 'action'] },
  { appid: 752590,  nome: 'A Plague Tale: Innocence', plataformas: ['PC', 'PS'], generos: ['Aventura', 'Mistério'], categorias: ['adventure'] },
  { appid: 2322010, nome: 'God of War Ragnarök', plataformas: ['PC', 'PS'], generos: ['Ação', 'Aventura'], categorias: ['action', 'adventure'] },
  { appid: 367520,  nome: 'Hollow Knight', plataformas: ['PC'], generos: ['Metroidvania'], categorias: ['platform', 'indie'] },
  { appid: 1174180, nome: 'Red Dead Redemption 2', plataformas: ['PC', 'PS'], generos: ['Ação', 'Mundo Aberto'], categorias: ['action', 'adventure'] },
  { appid: 242050,  nome: "Assassin's Creed IV Black Flag", plataformas: ['PC'], generos: ['Ação'], categorias: ['action', 'adventure'] },
  { appid: 638970,  nome: 'Yakuza 0', plataformas: ['PC'], generos: ['Ação', 'Luta'], categorias: ['action', 'adventure'] },
  { appid: 2195250, nome: 'EA Sports FC 24', plataformas: ['PC', 'PS'], generos: ['Esportes'], categorias: ['sport'] },
  { appid: 319630,  nome: 'Life is Strange', plataformas: ['PC'], generos: ['História Interativa'], categorias: ['adventure'] },
  { appid: 1888930, nome: 'The Last of Us Part I', plataformas: ['PC', 'PS'], generos: ['Ação', 'Sobrevivência'], categorias: ['action', 'adventure'], estoque: false },
  { appid: 2108330, nome: 'F1 23', plataformas: ['PC', 'PS'], generos: ['Corrida'], categorias: ['racing', 'sport'] },
  { appid: 1245620, nome: 'Elden Ring', plataformas: ['PC', 'PS'], generos: ['RPG', 'Souls-like'], categorias: ['role-playing-rpg', 'action'] },
  { appid: 1091500, nome: 'Cyberpunk 2077', plataformas: ['PC'], generos: ['RPG', 'Sci-Fi'], categorias: ['role-playing-rpg', 'action'] },
  { appid: 2767030, nome: 'Marvel Rivals', plataformas: ['PC'], generos: ['Hero Shooter'], categorias: ['shooter'], gratis: true },
  { appid: 2531310, nome: 'The Last of Us Part II Remastered', plataformas: ['PC', 'PS'], generos: ['Ação', 'Sobrevivência'], categorias: ['action', 'adventure'] },
];