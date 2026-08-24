import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

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
}

type ItemCatalogo = {
  id: string;
  nome: string;
  steamAppId?: string;
  imagemCustom?: string;
  imagemPosicao?: string;
  genero: string;
  plat: string;
  orig: string;
  promo: string;
  desc: number;
  categorias: string[];
  slug: string;
  descricaoCustom?: string;
};

@Injectable({ providedIn: 'root' })
export class ProdutosService {

  readonly listaProdutos: ItemCatalogo[] = [
    { id: '1', nome: 'Grand Theft Auto V', steamAppId: '271590', genero: 'Ação / Mundo Aberto', plat: 'PC', orig: 'R$ 149,90', promo: 'R$ 74,95', desc: 50, categorias: ['mundo-aberto'], slug: 'grand-theft-auto-v' },
    { id: '2', nome: 'The Witcher 3: Wild Hunt', steamAppId: '292030', genero: 'RPG / Mundo Aberto', plat: 'PC / PS5', orig: 'R$ 129,99', promo: 'R$ 129,99', desc: 0, categorias: ['rpg'], slug: 'the-witcher-3-wild-hunt' },
    { id: '3', nome: 'The Sims 4', steamAppId: '1222670', genero: 'Simulação', plat: 'PC', orig: 'Grátis', promo: 'Grátis', desc: 0, categorias: ['simulacao'], slug: 'the-sims-4' },
    { id: '4', nome: 'God of War', steamAppId: '1593500', genero: 'Ação / Aventura', plat: 'PC / PS5', orig: 'R$ 199,90', promo: 'R$ 199,90', desc: 0, categorias: ['acao'], slug: 'god-of-war-4' },
    { id: '5', nome: 'Marvel\'s Spider-Man Remastered', steamAppId: '1817070', genero: 'Ação / Aventura', plat: 'PC / PS5', orig: 'R$ 349,90', promo: 'R$ 199,90', desc: 42, categorias: ['mundo-aberto'], slug: 'marvels-spider-man-remastered' },
    { id: '6', nome: 'Call of Duty: Modern Warfare II', steamAppId: '1938090', genero: 'Tiro / FPS', plat: 'PC', orig: 'R$ 299,00', promo: 'R$ 299,00', desc: 0, categorias: ['acao'], slug: 'call-of-duty-modern-warfare-ii-2022' },
    { id: '7', nome: 'A Plague Tale: Innocence', steamAppId: '752590', genero: 'Aventura / Mistério', plat: 'PC', orig: 'R$ 229,00', promo: 'R$ 91,60', desc: 60, categorias: ['aventura'], slug: 'a-plague-tale-innocence' },
    { id: '8', nome: 'God of War Ragnarök', steamAppId: '2322010', genero: 'Ação / Aventura', plat: 'PC / PS5', orig: 'R$ 249,90', promo: 'R$ 249,90', desc: 0, categorias: ['acao'], slug: 'god-of-war-ragnarok' },
    { id: '9', nome: 'Hollow Knight', steamAppId: '367520', genero: 'Metroidvania', plat: 'PC', orig: 'R$ 46,99', promo: 'R$ 46,99', desc: 0, categorias: ['acao'], slug: 'hollow-knight' },
    { id: '10', nome: 'Red Dead Redemption 2', steamAppId: '1174180', genero: 'Ação / Mundo Aberto', plat: 'PC / PS5', orig: 'R$ 299,90', promo: 'R$ 98,96', desc: 67, categorias: ['mundo-aberto'], slug: 'red-dead-redemption-2' },
    { id: '11', nome: 'Assassin’s Creed IV Black Flag', steamAppId: '242050', genero: 'Ação', plat: 'PC', orig: 'R$ 119,99', promo: 'R$ 119,99', desc: 0, categorias: ['mundo-aberto'], slug: 'assassins-creed-iv-black-flag' },
    { id: '12', nome: 'Yakuza 0', steamAppId: '638970', genero: 'Ação / Luta', plat: 'PC', orig: 'R$ 83,50', promo: 'R$ 83,50', desc: 0, categorias: ['mundo-aberto'], slug: 'yakuza-0' },
    { id: '13', nome: 'EA Sports FC 24', steamAppId: '2195250', genero: 'Esportes', plat: 'PC / PS5', orig: 'R$ 350,00', promo: 'R$ 350,00', desc: 0, categorias: ['simulacao'], slug: 'ea-sports-fc-24' },
    { id: '14', nome: 'Life is Strange', steamAppId: '319630', genero: 'História Interativa', plat: 'PC', orig: 'R$ 99,00', promo: 'R$ 19,80', desc: 80, categorias: ['aventura'], slug: 'life-is-strange' },
    { id: '15', nome: 'The Last of Us Part I', steamAppId: '1888930', genero: 'Ação / Sobrevivência', plat: 'PC / PS5', orig: 'R$ 249,90', promo: 'R$ 249,90', desc: 0, categorias: ['aventura'], slug: 'the-last-of-us-part-i' },
    { id: '16', nome: 'F1 23', steamAppId: '2108330', genero: 'Corrida', plat: 'PC', orig: 'R$ 350,00', promo: 'R$ 143,60', desc: 60, categorias: ['simulacao'], slug: 'f1-23' },
    { id: '17', nome: 'Elden Ring', steamAppId: '1245620', genero: 'RPG / Souls-like', plat: 'PC / PS5', orig: 'R$ 229,90', promo: 'R$ 229,90', desc: 0, categorias: ['rpg'], slug: 'elden-ring' },
    { id: '18', nome: 'Cyberpunk 2077', steamAppId: '1091500', genero: 'RPG / Sci-Fi', plat: 'PC', orig: 'R$ 199,90', promo: 'R$ 99,95', desc: 50, categorias: ['rpg'], slug: 'cyberpunk-2077' },
    { id: '19', nome: 'Marvel Rivals', steamAppId: '2767030', genero: 'Hero Shooter', plat: 'PC', orig: 'Grátis', promo: 'Grátis', desc: 0, categorias: ['acao'], slug: 'marvel-rivals' },
    { id: '20', nome: 'The Last of Us Part II', steamAppId: '2531310', genero: 'Ação / Sobrevivência', plat: 'PS5', orig: 'R$ 249,90', promo: 'R$ 249,90', desc: 0, categorias: ['aventura'], slug: 'the-last-of-us-part-ii-remastered' },
    // ===== JOGOS NOVOS — só pra encher o catálogo (usam o componente único) =====
    
    { id: '22', nome: 'Resident Evil 4', steamAppId: '2050650', genero: 'Ação / Terror', plat: 'PC / PS5', orig: 'R$ 249,90', promo: 'R$ 249,90', desc: 0, categorias: ['acao', 'aventura'], slug: 'resident-evil-4-2023', descricaoCustom: 'Leon S. Kennedy é enviado a uma vila rural na Europa para resgatar a filha do presidente dos EUA, sequestrada por um culto sinistro, nesta refação moderna do clássico de terror e ação.' },
    { id: '23', nome: 'Horizon Zero Dawn', steamAppId: '1151640', genero: 'Ação / RPG', plat: 'PC / PS5', orig: 'R$ 149,90', promo: 'R$ 149,90', desc: 0, categorias: ['rpg', 'mundo-aberto'], slug: 'horizon-zero-dawn-complete-edition', descricaoCustom: 'Em um mundo pós-apocalíptico dominado por máquinas parecidas com animais, Aloy embarca em uma jornada para descobrir os mistérios do seu passado e o destino de sua tribo.' },
    { id: '24', nome: 'Death Stranding', steamAppId: '1190460', genero: 'Aventura / Ação', plat: 'PC / PS5', orig: 'R$ 199,90', promo: 'R$ 199,90', desc: 0, categorias: ['aventura'], slug: 'death-stranding', descricaoCustom: 'Sam Bridges deve atravessar uma América devastada e reconectar cidades isoladas em uma rede de comunicação, enfrentando criaturas sobrenaturais nesta experiência única de Hideo Kojima.' },
    { id: '25', nome: 'Sekiro: Shadows Die Twice', steamAppId: '814380', genero: 'Ação / Aventura', plat: 'PC', orig: 'R$ 199,90', promo: 'R$ 199,90', desc: 0, categorias: ['acao'], slug: 'sekiro-shadows-die-twice', descricaoCustom: 'No Japão do período Sengoku, um shinobi caído busca vingança contra o samurai que o derrotou, usando uma prótese repleta de ferramentas mortais e a arte da espada.' },
    { id: '26', nome: 'Forza Horizon 5', steamAppId: '1551360', genero: 'Corrida', plat: 'PC', orig: 'R$ 249,90', promo: 'R$ 249,90', desc: 0, categorias: ['simulacao', 'mundo-aberto'], slug: 'forza-horizon-5', descricaoCustom: 'Explore as paisagens vibrantes do México em um festival automobilístico de mundo aberto, com centenas de carros para colecionar e customizar.' },
    { id: '27', nome: 'Baldur\'s Gate 3', steamAppId: '1086940', genero: 'RPG', plat: 'PC / PS5', orig: 'R$ 249,90', promo: 'R$ 249,90', desc: 0, categorias: ['rpg'], slug: 'baldurs-gate-3', descricaoCustom: 'Reúna seu grupo e retorne aos Reinos Esquecidos em uma história de camaradagem, traição e sacrifício, neste RPG baseado nas regras de Dungeons & Dragons.' },
    { id: '28', nome: 'It Takes Two', steamAppId: '1426210', genero: 'Aventura / Cooperativo', plat: 'PC / PS5', orig: 'R$ 149,90', promo: 'R$ 149,90', desc: 0, categorias: ['aventura'], slug: 'it-takes-two', descricaoCustom: 'Cody e May, um casal em processo de divórcio, são transformados em bonecos e precisam trabalhar juntos para voltar ao normal, em uma aventura cooperativa para dois jogadores.' },
    { id: '29', nome: 'Stardew Valley', steamAppId: '413150', genero: 'Simulação', plat: 'PC', orig: 'R$ 27,99', promo: 'R$ 27,99', desc: 0, categorias: ['simulacao'], slug: 'stardew-valley', descricaoCustom: 'Você herdou a antiga fazenda do seu avô. Cultive plantas, crie animais, pesque e construa relacionamentos com os moradores da cidade nesta relaxante simulação de vida no campo.' },
    { id: '30', nome: 'Hades', steamAppId: '1145360', genero: 'Ação / Roguelike', plat: 'PC / PS5', orig: 'R$ 62,99', promo: 'R$ 62,99', desc: 0, categorias: ['acao'], slug: 'hades', descricaoCustom: 'Como o Príncipe do Submundo, lute para escapar das garras do próprio deus dos mortos, enfrentando salas geradas aleatoriamente neste aclamado roguelike de ação.' },
    { id: '31', nome: 'Dark Souls III', steamAppId: '374320', genero: 'RPG / Ação', plat: 'PC', orig: 'R$ 99,99', promo: 'R$ 99,99', desc: 0, categorias: ['rpg'], slug: 'dark-souls-iii', descricaoCustom: 'As chamas estão se apagando e o mundo caminha para as cinzas. Enfrente inimigos brutais e chefes memoráveis nesta jornada implacável de FromSoftware.' },
    { id: '32', nome: 'Portal 2', steamAppId: '620', genero: 'Puzzle / Aventura', plat: 'PC', orig: 'R$ 24,99', promo: 'R$ 24,99', desc: 0, categorias: ['aventura'], slug: 'portal-2', descricaoCustom: 'Chell retorna ao Laboratório Aperture para resolver quebra-cabeças com o Portal Gun, enquanto desvenda os plans obscuros da IA GLaDOS neste clássico de puzzle e humor.' },
    { id: '33', nome: 'Half-Life: Alyx', steamAppId: '546560', genero: 'Ação / FPS', plat: 'PC', orig: 'R$ 149,90', promo: 'R$ 149,90', desc: 0, categorias: ['acao'], slug: 'half-life-alyx', descricaoCustom: 'Alyx Vance enfrenta a ocupação alienígena da Combine em Cidade 17 nesta experiência imersiva ambientada entre os eventos de Half-Life e Half-Life 2.' },
    { id: '34', nome: 'Counter-Strike 2', steamAppId: '730', genero: 'Tiro / FPS', plat: 'PC', orig: 'Grátis', promo: 'Grátis', desc: 0, categorias: ['acao'], slug: 'counter-strike-2', descricaoCustom: 'O clássico shooter tático competitivo evolui com um novo motor gráfico, mantendo o combate 5v5 baseado em rounds que definiu o gênero de tiro tático.' },
    { id: '35', nome: 'Dota 2', steamAppId: '570', genero: 'MOBA', plat: 'PC', orig: 'Grátis', promo: 'Grátis', desc: 0, categorias: ['acao'], slug: 'dota-2', descricaoCustom: 'Duas equipes de cinco jogadores competem para destruir a base adversária, escolhendo entre mais de cem heróis com habilidades únicas neste MOBA de referência mundial.' },
    { id: '36', nome: 'PUBG: Battlegrounds', steamAppId: '578080', genero: 'Battle Royale', plat: 'PC', orig: 'Grátis', promo: 'Grátis', desc: 0, categorias: ['acao', 'mundo-aberto'], slug: 'playerunknowns-battlegrounds', descricaoCustom: 'Cem jogadores caem em uma ilha e lutam para ser o último sobrevivente, coletando armas e equipamentos enquanto a zona segura vai encolhendo neste pioneiro do battle royale.' },
    { id: '37', nome: 'Terraria', steamAppId: '105600', genero: 'Aventura / Mundo Aberto', plat: 'PC', orig: 'R$ 27,99', promo: 'R$ 27,99', desc: 0, categorias: ['aventura', 'mundo-aberto'], slug: 'terraria', descricaoCustom: 'Cave, construa, explore e lute em um mundo gerado proceduralmente em 2D, repleto de biomas, chefes e itens para descobrir nesta aventura sandbox aclamada.' },
    { id: '38', nome: 'Among Us', steamAppId: '945360', genero: 'Festa / Social', plat: 'PC', orig: 'R$ 14,99', promo: 'R$ 14,99', desc: 0, categorias: ['simulacao'], slug: 'among-us', descricaoCustom: 'Uma tripulação prepara sua nave para viagem, mas alguns tripulantes são impostores disfarçados. Descubra quem são antes que sabotem a missão neste jogo social multiplayer.' },
    { id: '39', nome: 'Fall Guys', steamAppId: '1097150', genero: 'Festa', plat: 'PC', orig: 'Grátis', promo: 'Grátis', desc: 0, categorias: ['simulacao'], slug: 'fall-guys', descricaoCustom: 'Dezenas de jogadores competem em fases caóticas cheias de obstáculos coloridos em busca da coroa de campeão, neste show de eliminação hilário e colorido.' },
    { id: '40', nome: 'Rocket League', steamAppId: '252950', genero: 'Esportes', plat: 'PC', orig: 'Grátis', promo: 'Grátis', desc: 0, categorias: ['simulacao'], slug: 'rocket-league', descricaoCustom: 'Futebol encontra carros em alta velocidade nesta mistura viciante de esportes e ação veicular, com partidas competitivas e acrobacias aéreas espetaculares.' },
    { id: '41', nome: 'Apex Legends', steamAppId: '1172470', genero: 'Tiro / Battle Royale', plat: 'PC', orig: 'Grátis', promo: 'Grátis', desc: 0, categorias: ['acao'], slug: 'apex-legends', descricaoCustom: 'Esquadrões de três Lendários com habilidades únicas competem em um battle royale acelerado, combinando tiro tático com movimentação fluida e trabalho em equipe.' },
    { id: '42', nome: 'Valheim', steamAppId: '892970', genero: 'Sobrevivência / Mundo Aberto', plat: 'PC', orig: 'R$ 45,50', promo: 'R$ 45,50', desc: 0, categorias: ['aventura', 'mundo-aberto'], slug: 'valheim', descricaoCustom: 'Explore, construa e sobreviva em um purgatório vikingue procedural, enfrentando criaturas mitológicas e desbravando um vasto mundo gerado aleatoriamente.' },
    { id: '43', nome: 'Rust', steamAppId: '252490', genero: 'Sobrevivência', plat: 'PC', orig: 'R$ 44,99', promo: 'R$ 44,99', desc: 0, categorias: ['mundo-aberto'], slug: 'rust', descricaoCustom: 'Você é apenas mais um sobrevivente tentando sobreviver na natureza selvagem, coletando recursos, construindo abrigos e enfrentando outros jogadores neste sandbox multiplayer brutal.' },
    { id: '44', nome: 'ARK: Survival Evolved', steamAppId: '346110', genero: 'Sobrevivência', plat: 'PC', orig: 'R$ 59,99', promo: 'R$ 59,99', desc: 0, categorias: ['mundo-aberto'], slug: 'ark-survival-evolved', descricaoCustom: 'Preso em uma ilha misteriosa repleta de dinossauros e criaturas pré-históricas, você deve caçar, cultivar, construir abrigos e domesticar dinossauros para sobreviver.' },
    { id: '45', nome: 'Subnautica', steamAppId: '264710', genero: 'Sobrevivência / Aventura', plat: 'PC', orig: 'R$ 59,99', promo: 'R$ 59,99', desc: 0, categorias: ['aventura'], slug: 'subnautica', descricaoCustom: 'Após o naufrágio de sua nave, explore um vasto oceano alienígena repleto de vida marinha fascinante e perigosa, construindo bases e submarinos para sobreviver nas profundezas.' },
    { id: '46', nome: 'Slay the Spire', steamAppId: '646570', genero: 'Roguelike / Cartas', plat: 'PC', orig: 'R$ 34,99', promo: 'R$ 34,99', desc: 0, categorias: ['acao'], slug: 'slay-the-spire', descricaoCustom: 'Escale uma torre misteriosa e cada vez mais perigosa usando um baralho de cartas único que você constrói ao longo da jornada, em um roguelike deckbuilder viciante.' },
    { id: '47', nome: 'Celeste', steamAppId: '504230', genero: 'Plataforma', plat: 'PC', orig: 'R$ 34,90', promo: 'R$ 34,90', desc: 0, categorias: ['acao'], slug: 'celeste', descricaoCustom: 'Ajude Madeline a escalar a montanha Celeste enquanto ela enfrenta seus próprios demônios internos, neste plataforma desafiador e emocionalmente profundo.' },
    { id: '48', nome: 'Dead Cells', steamAppId: '588650', genero: 'Ação / Roguelike', plat: 'PC', orig: 'R$ 44,99', promo: 'R$ 44,99', desc: 0, categorias: ['acao'], slug: 'dead-cells', descricaoCustom: 'Explore um castelo em constante mutação, lutando com uma variedade de armas e habilidades neste roguelike de ação em 2D com combate fluido e permadeath.' },
    { id: '49', nome: 'Ori and the Blind Forest', steamAppId: '261570', genero: 'Aventura / Plataforma', plat: 'PC', orig: 'R$ 34,99', promo: 'R$ 34,99', desc: 0, categorias: ['aventura'], slug: 'ori-and-the-blind-forest', descricaoCustom: 'Siga a jornada emocionante de Ori, um pequeno guardião da floresta, para restaurar o coração da floresta de Nibel neste belíssimo platformer com trilha sonora orquestral.' },
    { id: '50', nome: 'Ori and the Will of the Wisps', steamAppId: '1057090', genero: 'Aventura / Plataforma', plat: 'PC', orig: 'R$ 64,99', promo: 'R$ 64,99', desc: 0, categorias: ['aventura'], slug: 'ori-and-the-will-of-the-wisps', descricaoCustom: 'Continue a jornada de Ori em um mundo em decadência, enfrentando novos desafios e explorando paisagens ainda mais deslumbrantes nesta sequência aclamada.' },
    { id: '51', nome: 'Inside', steamAppId: '304430', genero: 'Aventura / Puzzle', plat: 'PC', orig: 'R$ 34,99', promo: 'R$ 34,99', desc: 0, categorias: ['aventura'], slug: 'inside', descricaoCustom: 'Um garoto solitário é empurrado para dentro de um projeto sombrio e perigoso, em uma aventura de puzzle atmosférica e perturbadora dos criadores de Limbo.' },
    { id: '52', nome: 'Limbo', steamAppId: '48000', genero: 'Aventura / Puzzle', plat: 'PC', orig: 'R$ 19,99', promo: 'R$ 19,99', desc: 0, categorias: ['aventura'], slug: 'limbo', descricaoCustom: 'Sem saber o destino de sua irmã, um garoto entra em Limbo e é recebido por um mundo perigoso e desmoralizante nesta obra-prima minimalista em preto e branco.' },
    { id: '53', nome: 'Undertale', steamAppId: '391540', genero: 'RPG Indie', plat: 'PC', orig: 'R$ 14,99', promo: 'R$ 14,99', desc: 0, categorias: ['rpg'], slug: 'undertale', descricaoCustom: 'Uma criança cai em um mundo subterrâneo cheio de monstros e deve encontrar o caminho de volta para a superfície, podendo escolher entre lutar ou fazer amizade com cada inimigo.' },
    { id: '54', nome: 'Disco Elysium', steamAppId: '632470', genero: 'RPG', plat: 'PC', orig: 'R$ 89,99', promo: 'R$ 89,99', desc: 0, categorias: ['rpg'], slug: 'disco-elysium', descricaoCustom: 'Um detetive amnésico deve resolver um assassinato brutal enquanto lida com seus próprios traumas internos, em um RPG narrativo profundo com um sistema de diálogo excepcional.' },
    { id: '55', nome: 'Persona 5 Royal', steamAppId: '1687950', genero: 'RPG', plat: 'PC / PS5', orig: 'R$ 199,90', promo: 'R$ 199,90', desc: 0, categorias: ['rpg'], slug: 'persona-5-royal', descricaoCustom: 'Estudantes colegiais se tornam ladrões fantasmas que invadem o coração corrupto de adultos, roubando seus desejos distorcidos, nesta edição definitiva do aclamado RPG japonês.' },
    { id: '56', nome: 'Nier: Automata', steamAppId: '524220', genero: 'Ação / RPG', plat: 'PC', orig: 'R$ 129,90', promo: 'R$ 129,90', desc: 0, categorias: ['rpg', 'acao'], slug: 'nier-automata', descricaoCustom: 'Em uma Terra pós-apocalíptica dominada por máquinas, androides lutam para recuperar o planeta para a humanidade, em uma história filosófica sobre existência e propósito.' },
    { id: '57', nome: 'Dying Light 2', steamAppId: '534380', genero: 'Ação / Sobrevivência', plat: 'PC / PS5', orig: 'R$ 249,90', promo: 'R$ 249,90', desc: 0, categorias: ['acao', 'mundo-aberto'], slug: 'dying-light-2-stay-human', descricaoCustom: 'Em uma cidade tomada por infectados, use parkour e combate brutal para sobreviver, enquanto suas escolhas moldam o destino dos sobreviventes ao seu redor.' },
    { id: '58', nome: 'Ghost of Tsushima', steamAppId: '2215430', genero: 'Ação / Aventura', plat: 'PC / PS5', orig: 'R$ 249,90', promo: 'R$ 249,90', desc: 0, categorias: ['acao', 'mundo-aberto'], slug: 'ghost-of-tsushima-directors-cut', descricaoCustom: 'Jin Sakai, um dos últimos samurais remanescentes, deve abandonar as tradições de sua casta para se tornar o Fantasma e libertar Tsushima da invasão mongol.' },
    { id: '59', nome: 'Batman: Arkham Knight', steamAppId: '208650', genero: 'Ação / Aventura', plat: 'PC', orig: 'R$ 99,90', promo: 'R$ 99,90', desc: 0, categorias: ['acao', 'mundo-aberto'], slug: 'batman-arkham-knight', descricaoCustom: 'Batman enfrenta o misterioso Cavaleiro de Arkham e uma coalizão de vilões clássicos em uma Gotham City aberta, no capítulo final da aclamada trilogia Arkham.' },
    { id: '60', nome: 'Metro Exodus', steamAppId: '412020', genero: 'Tiro / Sobrevivência', plat: 'PC', orig: 'R$ 79,99', promo: 'R$ 79,99', desc: 0, categorias: ['acao'], slug: 'metro-exodus', descricaoCustom: 'Artyom deixa os túneis do metrô de Moscou e cruza a Rússia pós-apocalíptica em uma jornada por diferentes estações do ano, enfrentando mutantes e facções hostis.' },
    { id: '61', nome: 'Doom Eternal', steamAppId: '782330', genero: 'Tiro / FPS', plat: 'PC', orig: 'R$ 199,90', promo: 'R$ 199,90', desc: 0, categorias: ['acao'], slug: 'doom-eternal', descricaoCustom: 'O Slayer retorna para enfrentar as forças infernais que invadiram a Terra, em um shooter frenético e brutal com combate rápido e visceral.' },
    { id: '62', nome: 'Doom (2016)', steamAppId: '379720', genero: 'Tiro / FPS', plat: 'PC', orig: 'R$ 79,99', promo: 'R$ 79,99', desc: 0, categorias: ['acao'], slug: 'doom-2016', descricaoCustom: 'De volta a Marte, o Slayer deve conter uma invasão demoníaca que ameaça toda a humanidade, neste reboot que revitalizou o gênero shooter clássico.' },
    { id: '63', nome: 'Wolfenstein: The New Order', steamAppId: '201810', genero: 'Tiro / FPS', plat: 'PC', orig: 'R$ 49,99', promo: 'R$ 49,99', desc: 0, categorias: ['acao'], slug: 'wolfenstein-the-new-order', descricaoCustom: 'Em uma realidade alternativa onde os nazistas venceram a Segunda Guerra Mundial, B.J. Blazkowicz lidera a resistência para libertar a humanidade da tirania.' },
    { id: '64', nome: 'Titanfall 2', steamAppId: '1237970', genero: 'Tiro / FPS', plat: 'PC', orig: 'R$ 39,99', promo: 'R$ 39,99', desc: 0, categorias: ['acao'], slug: 'titanfall-2', descricaoCustom: 'Um piloto e seu Titan formam um vínculo único em uma campanha aclamada, combinando parkour ágil e combate mecanizado devastador em batalhas épicas.' },
    { id: '65', nome: 'Borderlands 3', steamAppId: '397540', genero: 'Tiro / RPG', plat: 'PC', orig: 'R$ 199,90', promo: 'R$ 199,90', desc: 0, categorias: ['acao', 'rpg'], slug: 'borderlands-3', descricaoCustom: 'Novos Caçadores da Cofre embarcam em uma jornada caótica por várias galáxias, atirando com bilhões de armas geradas proceduralmente contra cultos fanáticos.' },
    { id: '66', nome: 'Far Cry 5', steamAppId: '552520', genero: 'Ação / Mundo Aberto', plat: 'PC', orig: 'R$ 149,90', promo: 'R$ 149,90', desc: 0, categorias: ['acao', 'mundo-aberto'], slug: 'far-cry-5', descricaoCustom: 'Enfrente um culto fanático religioso que tomou controle de um condado rural americano, em uma luta pela liberdade contra um líder carismático e perigoso.' },
    { id: '67', nome: 'Far Cry 6', steamAppId: '2369390', genero: 'Ação / Mundo Aberto', plat: 'PC', orig: 'R$ 249,90', promo: 'R$ 249,90', desc: 0, categorias: ['acao', 'mundo-aberto'], slug: 'far-cry-6', descricaoCustom: 'Lidere uma revolução guerrilheira contra um ditador opressor na ilha tropical de Yara, usando armas improvisadas e táticas de guerrilha inspiradas em conflitos reais.' },
   
    { id: '69', nome: 'Kingdom Come: Deliverance', steamAppId: '379430', genero: 'RPG', plat: 'PC', orig: 'R$ 89,99', promo: 'R$ 89,99', desc: 0, categorias: ['rpg', 'mundo-aberto'], slug: 'kingdom-come-deliverance', descricaoCustom: 'Ambientado na Boêmia medieval historicamente precisa, Henry busca vingança pela morte de sua família em um RPG realista sem magia ou fantasia, apenas espada e sobrevivência.' },
    { id: '70', nome: 'Civilization VI', steamAppId: '289070', genero: 'Estratégia', plat: 'PC', orig: 'R$ 129,90', promo: 'R$ 129,90', desc: 0, categorias: ['simulacao'], slug: 'sid-meiers-civilization-vi', descricaoCustom: 'Construa um império que resista ao teste do tempo, guiando uma civilização desde a Idade da Pedra até a era espacial neste clássico jogo de estratégia por turnos.' },
   { id: '72', nome: 'Control', steamAppId: '870780', genero: 'Ação / Aventura', plat: 'PC / PS5', orig: 'R$ 129,00', promo: 'R$ 129,00', desc: 0, categorias: ['acao', 'aventura'], slug: 'control' },
   
    { id: '74', nome: 'Deathloop', steamAppId: '1252330', genero: 'Tiro / Ação', plat: 'PC / PS5', orig: 'R$ 249,00', promo: 'R$ 249,00', desc: 0, categorias: ['acao'], slug: 'deathloop' },
    { id: '75', nome: 'Dishonored 2', steamAppId: '403640', genero: 'Ação / Furtividade', plat: 'PC', orig: 'R$ 89,99', promo: 'R$ 89,99', desc: 0, categorias: ['acao'], slug: 'dishonored-2' },
    { id: '76', nome: 'Prey', steamAppId: '480490', genero: 'Ficção Científica / Ação', plat: 'PC', orig: 'R$ 119,00', promo: 'R$ 119,00', desc: 0, categorias: ['acao', 'aventura'], slug: 'prey' },
    { id: '77', nome: 'Hitman 3', steamAppId: '1659040', genero: 'Ação / Furtividade', plat: 'PC / PS5', orig: 'R$ 249,00', promo: 'R$ 249,00', desc: 0, categorias: ['acao'], slug: 'hitman-3' },
    { id: '78', nome: 'Devil May Cry 5', steamAppId: '601150', genero: 'Ação / Hack and Slash', plat: 'PC / PS5', orig: 'R$ 99,90', promo: 'R$ 99,90', desc: 0, categorias: ['acao'], slug: 'devil-may-cry-5' },
    { id: '79', nome: 'Monster Hunter: World', steamAppId: '582010', genero: 'RPG / Ação', plat: 'PC', orig: 'R$ 99,90', promo: 'R$ 99,90', desc: 0, categorias: ['rpg', 'acao'], slug: 'monster-hunter-world' },
    { id: '80', nome: 'Monster Hunter Rise', steamAppId: '1446780', genero: 'RPG / Ação', plat: 'PC / PS5', orig: 'R$ 139,90', promo: 'R$ 139,90', desc: 0, categorias: ['rpg', 'acao'], slug: 'monster-hunter-rise' },
    { id: '81', nome: 'Street Fighter 6', steamAppId: '1364780', genero: 'Luta', plat: 'PC / PS5', orig: 'R$ 249,00', promo: 'R$ 249,00', desc: 0, categorias: ['acao'], slug: 'street-fighter-6' },
    { id: '82', nome: 'Tekken 8', steamAppId: '1778820', genero: 'Luta', plat: 'PC / PS5', orig: 'R$ 349,90', promo: 'R$ 349,90', desc: 0, categorias: ['acao'], slug: 'tekken-8' },
    { id: '83', nome: 'Mortal Kombat 1', steamAppId: '1792600', genero: 'Luta', plat: 'PC / PS5', orig: 'R$ 279,90', promo: 'R$ 279,90', desc: 0, categorias: ['acao'], slug: 'mortal-kombat-1' },
    { id: '84', nome: 'Dragon Ball FighterZ', steamAppId: '678950', genero: 'Luta', plat: 'PC', orig: 'R$ 149,90', promo: 'R$ 149,90', desc: 0, categorias: ['acao'], slug: 'dragon-ball-fighterz' },
    { id: '85', nome: 'Guilty Gear Strive', steamAppId: '1384160', genero: 'Luta', plat: 'PC / PS5', orig: 'R$ 149,90', promo: 'R$ 149,90', desc: 0, categorias: ['acao'], slug: 'guilty-gear-strive' },
    { id: '86', nome: 'Sea of Thieves', steamAppId: '1172620', genero: 'Aventura / Mundo Aberto', plat: 'PC / PS5', orig: 'R$ 89,00', promo: 'R$ 89,00', desc: 0, categorias: ['aventura', 'mundo-aberto'], slug: 'sea-of-thieves' },
    { id: '87', nome: 'Deep Rock Galactic', steamAppId: '548430', genero: 'Tiro / Cooperativo', plat: 'PC', orig: 'R$ 57,99', promo: 'R$ 57,99', desc: 0, categorias: ['acao'], slug: 'deep-rock-galactic' },
    { id: '88', nome: 'Helldivers 2', steamAppId: '553850', genero: 'Tiro / Cooperativo', plat: 'PC / PS5', orig: 'R$ 199,50', promo: 'R$ 199,50', desc: 0, categorias: ['acao'], slug: 'helldivers-2' },
    { id: '89', nome: 'Palworld', steamAppId: '1623730', genero: 'Sobrevivência / Mundo Aberto', plat: 'PC', orig: 'R$ 88,99', promo: 'R$ 88,99', desc: 0, categorias: ['aventura', 'mundo-aberto'], slug: 'palworld' },
    
    { id: '91', nome: 'Phasmophobia', steamAppId: '739630', genero: 'Terror', plat: 'PC', orig: 'R$ 27,89', promo: 'R$ 27,89', desc: 0, categorias: ['aventura'], slug: 'phasmophobia' },
    { id: '92', nome: 'Dead by Daylight', steamAppId: '381210', genero: 'Terror / Sobrevivência', plat: 'PC', orig: 'R$ 49,99', promo: 'R$ 49,99', desc: 0, categorias: ['acao'], slug: 'dead-by-daylight' },
    { id: '93', nome: 'Vampire Survivors', steamAppId: '1794680', genero: 'Ação / Casual', plat: 'PC', orig: 'R$ 12,99', promo: 'R$ 12,99', desc: 0, categorias: ['acao'], slug: 'vampire-survivors' },
    { id: '94', nome: 'Risk of Rain 2', steamAppId: '632360', genero: 'Roguelike / Ação', plat: 'PC', orig: 'R$ 59,99', promo: 'R$ 59,99', desc: 0, categorias: ['acao'], slug: 'risk-of-rain-2' },
    { id: '95', nome: 'Cult of the Lamb', steamAppId: '1313140', genero: 'Ação / Simulação', plat: 'PC / PS5', orig: 'R$ 64,95', promo: 'R$ 64,95', desc: 0, categorias: ['acao', 'simulacao'], slug: 'cult-of-the-lamb' },
    { id: '96', nome: 'Dave the Diver', steamAppId: '1868140', genero: 'Aventura / Simulação', plat: 'PC / PS5', orig: 'R$ 59,99', promo: 'R$ 59,99', desc: 0, categorias: ['aventura', 'simulacao'], slug: 'dave-the-diver' },
    { id: '97', nome: 'Stray', steamAppId: '1332010', genero: 'Aventura', plat: 'PC / PS5', orig: 'R$ 69,99', promo: 'R$ 69,99', desc: 0, categorias: ['aventura'], slug: 'stray' },
    { id: '98', nome: 'Outer Wilds', steamAppId: '753640', genero: 'Exploração / Aventura', plat: 'PC / PS5', orig: 'R$ 73,99', promo: 'R$ 73,99', desc: 0, categorias: ['aventura'], slug: 'outer-wilds' },
    { id: '99', nome: 'Tunic', steamAppId: '553420', genero: 'Ação / Aventura', plat: 'PC / PS5', orig: 'R$ 88,99', promo: 'R$ 88,99', desc: 0, categorias: ['acao', 'aventura'], slug: 'tunic' },
    { id: '100', nome: 'Sea of Stars', steamAppId: '1244090', genero: 'RPG', plat: 'PC / PS5', orig: 'R$ 99,99', promo: 'R$ 99,99', desc: 0, categorias: ['rpg'], slug: 'sea-of-stars' },
  ];

  obterProdutos(): Observable<Produto[]> {
    const produtosMapeados: Produto[] = this.listaProdutos.map(item => ({
      id: item.id,
      nome: item.nome,
      imagem: item.imagemCustom
        ? item.imagemCustom
        : `https://cdn.cloudflare.steamstatic.com/steam/apps/${item.steamAppId}/library_600x900.jpg`,
      imagemPosicao: item.imagemPosicao ?? 'center',
      precoOriginal: item.orig,
      precoPromocional: item.promo,
      desconto: item.desc,
      genero: item.genero,
      plataforma: item.plat,
      categorias: item.categorias,
      slug: item.slug,
      steamAppId: item.steamAppId,
    }));

    return of(produtosMapeados);
  }

  obterPorSlugOuId(parametro: string): Observable<Produto | undefined> {
  const produtosMapeados: Produto[] = this.listaProdutos.map((item) => ({
    id: item.id,
    nome: item.nome,
    genero: item.genero,
    plataforma: item.plat,
    precoOriginal: item.orig,
    precoPromocional: item.promo,
    desconto: item.desc,
    categorias: item.categorias,
    slug: item.slug,
    steamAppId: item.steamAppId,
    descricaoCustom: item.descricaoCustom,
  }));

  const produtoEncontrado = produtosMapeados.find(
    (p: Produto) => p.slug === parametro || p.id === parametro
  );

  return of(produtoEncontrado);
}

  obterPorId(id: string): Observable<Produto | undefined> {
    return this.obterPorSlugOuId(id);
  }

}