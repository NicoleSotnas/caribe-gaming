// src/app/core/models/jogo.model.ts

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
  id: number;
  nome: string;
  descricao: string;
  dataLancamento: string;
  desenvolvedoras: string;
  distribuidoras: string;
  classificacaoEtaria: string;
  plataformas: string;
  background_image?: string;
  slug?: string;
}

export interface Produto {
  id: string;
  nome: string;
  steamAppId?: string;
  genero: string;
  plataforma: string;
  precoOriginal: string;
  precoPromocional: string;
  desconto: number;
  categorias: string[];
  slug: string;
  imagem?: string;
  imagemPosicao?: string;
  descricaoCustom?: string;
  favorito?: boolean;
}