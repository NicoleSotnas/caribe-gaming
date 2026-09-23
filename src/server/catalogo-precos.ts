// src/server/catalogo-precos.ts
// Fonte OFICIAL de preço no servidor, em CENTAVOS.
// Os ids batem com ProdutosService.listaProdutos (são strings, não números).
// Preço = o campo "promo" de produtos.service.ts (o que o cliente realmente paga).
export const PRECOS: Record<string, { nome: string; precoCentavos: number }> = {
  '1':  { nome: 'Grand Theft Auto V',              precoCentavos: 7495  },
  '2':  { nome: 'The Witcher 3: Wild Hunt',        precoCentavos: 12999 },
  '3':  { nome: 'The Sims 4',                      precoCentavos: 0     },
  '4':  { nome: 'God of War',                      precoCentavos: 19990 },
  '5':  { nome: "Marvel's Spider-Man Remastered",  precoCentavos: 19990 },
  '6':  { nome: 'Call of Duty: Modern Warfare II', precoCentavos: 29900 },
  '7':  { nome: 'A Plague Tale: Innocence',        precoCentavos: 9160  },
  '8':  { nome: 'God of War Ragnarök',             precoCentavos: 24990 },
  '9':  { nome: 'Hollow Knight',                   precoCentavos: 4699  },
  '10': { nome: 'Red Dead Redemption 2',           precoCentavos: 9896  },
  '11': { nome: 'Assassin’s Creed IV Black Flag',  precoCentavos: 11999 },
  '12': { nome: 'Yakuza 0',                        precoCentavos: 8350  },
  '13': { nome: 'EA Sports FC 24',                 precoCentavos: 35000 },
  '14': { nome: 'Life is Strange',                 precoCentavos: 1980  },
  '15': { nome: 'The Last of Us Part I',           precoCentavos: 24990 },
  '16': { nome: 'F1 23',                           precoCentavos: 14360 },
  '17': { nome: 'Elden Ring',                      precoCentavos: 22990 },
  '18': { nome: 'Cyberpunk 2077',                  precoCentavos: 9995  },
  '19': { nome: 'Marvel Rivals',                   precoCentavos: 0     },
  '20': { nome: 'The Last of Us Part II',          precoCentavos: 12475 },
};