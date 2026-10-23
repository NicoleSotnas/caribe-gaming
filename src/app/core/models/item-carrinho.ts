export interface ItemCarrinho {
  id?: number | string; // Aceita número ou texto
  nome: string;
  preco: number;
  quantidade?: number;
  imagemUrl?: string;
  plataforma?: string;
  categoria?: string;
}
