import { Comentario } from "../../core/models/jogo";

type Semente = [autor: string, estrelas: number, texto: string];

const CORES = ['#00d2d3', '#ff9f43', '#ee5253', '#0abde3', '#10ac84', '#5f27cd'];

// Chave = appid da Steam. Dados de demonstração.
const SEMENTES: Record<number, Semente[]> = {
  271590: [
    ['Franklin_do_Morro', 5, 'Los Santos continua incrível. Alternar entre Michael, Franklin e Trevor nos assaltos é sensacional.'],
    ['Michael_BR', 4, 'História excelente e mundo gigantesco. Só acho que o carregamento do online podia ser mais rápido.'],
    ['TrevorNoCaos', 5, 'Mesmo depois de tantos anos ainda encontro coisa nova para fazer. Roda muito bem no meu PC.'],
  ],
  292030: [
    ['GeraltDeRivia_BR', 5, 'Um dos melhores RPGs já feitos. Até as missões secundárias têm história de verdade.'],
    ['YenneferVengerberg', 5, 'Trilha sonora impecável e mundo cheio de vida. As expansões valem muito a pena.'],
    ['Jaskier_Cantor', 4, 'O combate é um pouco travado no começo, mas a narrativa compensa tudo.'],
  ],
  1222670: [
    ['SimMaluca', 5, 'Passei horas só construindo casas. O modo construção é viciante.'],
    ['FamiliaSemLimites', 4, 'Divertido demais, mas as expansões ficam caras para quem quer ter tudo.'],
    ['PlumbobLover', 5, 'Ótimo para relaxar. Criar famílias e ver as histórias acontecerem nunca enjoa.'],
  ],
  1593500: [
    ['KratosEmFuria', 5, 'A relação entre Kratos e Atreus é o coração do jogo. O combate com o machado é muito satisfatório.'],
    ['Boy_Atreus', 5, 'Visual lindo, câmera em plano único e história emocionante do começo ao fim.'],
    ['EspartanoBR', 4, 'Ótima reinvenção da série. Alguns chefes poderiam ser mais variados.'],
  ],
  1817070: [
    ['AranhaDoSuburbio', 5, 'Balançar pelos prédios de Nova York é a melhor sensação de movimento que já joguei.'],
    ['PeterParker_BR', 5, 'História com muito coração e combate fluido. Os trajes são um show à parte.'],
    ['MJ_Reporter', 4, 'Divertido e bonito, só as missões de stealth com a MJ cansam um pouco.'],
  ],
  2519060: [
    ['Soap_McTavish', 4, 'Multiplayer divertido e cheio de ação. A campanha é curta, mas tem boas missões.'],
    ['PriceNaMira', 3, 'Gráficos e tiroteio ótimos, mas a campanha deixou a desejar para o preço.'],
    ['ZombieFarmer', 5, 'O modo Zumbis é viciante com os amigos. Já passei muitas noites jogando.'],
  ],
  752590: [
    ['AmiciaDeRune', 5, 'História tocante e atmosfera sombria. Fiquei grudada no jogo do começo ao fim.'],
    ['HugoNoEscuro', 4, 'Stealth bem feito e visual lindo, mas é bem linear.'],
    ['RatosEmMassa', 5, 'Os ratos dão medo de verdade. Narrativa e trilha sonora impecáveis.'],
  ],
  2322010: [
    ['FilhoDeOdin', 5, 'Superou o jogo anterior em tudo: história, combate e cenários dos nove reinos.'],
    ['ThorNoMjolnir', 5, 'Os chefes são épicos e a história me prendeu até o último minuto.'],
    ['Freya_Vingadora', 4, 'Jogo enorme e caprichado. Poderia ter um pouco menos de enrolação no meio.'],
  ],
  367520: [
    ['CavaleiroVazio', 5, 'Melhor metroidvania que já joguei. Arte, trilha e mapa são perfeitos.'],
    ['QuirrelNoBanco', 5, 'Difícil, mas justo. Cada chefe derrotado dá uma sensação enorme de vitória.'],
    ['MariposaNoCaminho', 4, 'É fácil se perder no mapa no começo, mas explorar é a melhor parte.'],
  ],
  1174180: [
    ['ArthurMorgan_BR', 5, 'A história mais emocionante que já vi em um jogo. Os detalhes do mundo são absurdos.'],
    ['DutchVanDerLinde', 4, 'Obra-prima, mas o ritmo é lento. Quem gosta de jogar sem pressa vai amar.'],
    ['CavaloDoJohn', 5, 'Cada viagem a cavalo é um passeio. Gráficos e trilha sonora estão em outro nível.'],
  ],
  242050: [
    ['Kenway_Pirata', 5, 'Navegar com o Jackdaw e abordar navios é viciante. Melhor tema da série, na minha opinião.'],
    ['EdwardDoCaribe', 5, 'Piratas, ilhas e cantigas de marinheiro. Combina demais com a Caribe Gaming!'],
    ['AssassinoDeBarba', 4, 'As missões em terra cansam um pouco, mas o mar compensa tudo.'],
  ],
  638970: [
    ['KiryuChan', 5, 'História e personagens incríveis. As missões secundárias são hilárias.'],
    ['MajimaEverywhere', 5, 'Cada capítulo do Majima é uma loucura. O cabaré e o karaokê ganham o jogo.'],
    ['TokyoNights', 4, 'O combate é meio repetitivo no começo, mas a trama compensa.'],
  ],
  2195250: [
    ['CraqueDeVarzea', 4, 'Jogabilidade fluida e Ultimate Team viciante. Os gráficos melhoraram bastante.'],
    ['Zagueiro_Raiz', 3, 'Bom jogo, mas as microtransações do Ultimate Team incomodam.'],
    ['GolDeBicicleta', 5, 'Joguei muito online com os amigos. Os times e os estádios estão bem completos.'],
  ],
  319630: [
    ['MaxCaulfield_BR', 5, 'História emocionante que me fez chorar. As escolhas realmente importam.'],
    ['ChloePrice', 5, 'Trilha sonora perfeita e personagens marcantes. Um jogo que fica na memória.'],
    ['ArcadiaBayFan', 4, 'O ritmo é lento em alguns trechos, mas o final vale a pena.'],
  ],
  1888930: [
    ['EllieWilliams_BR', 5, 'Uma das melhores histórias dos games. Remake lindíssimo.'],
    ['JoelMiller', 5, 'Emocionante do início ao fim. Os cenários pós-apocalípticos tiram o fôlego.'],
    ['ClickerHunter', 4, 'Ótimo, mas exige um PC mais forte do que eu esperava.'],
  ],
  2108330: [
    ['PoleNaLargada', 4, 'Modo carreira bem completo e carros com bom feeling. Ótimo com volante.'],
    ['PitStopPro', 3, 'Corridas ótimas, mas a IA às vezes exagera nas ultrapassagens.'],
    ['VoltaRapida', 5, 'Gráficos bonitos e muita sensação de velocidade. Divertido demais.'],
  ],
  1245620: [
    ['TarnishedBR', 5, 'O mundo aberto mais incrível que já explorei. Cada canto esconde algo.'],
    ['MalenaFan', 4, 'Muito difícil, mas recompensador. Dica: explore bastante antes de enfrentar os chefes.'],
    ['GraceGuia', 5, 'Direção de arte absurda. Joguei mais de 100 horas e não enjoei.'],
  ],
  1091500: [
    ['V_DeNightCity', 5, 'Depois das atualizações virou outro jogo. Night City é viva e cheia de histórias.'],
    ['JohnnyBlackhand', 4, 'Ótima história e trilha sonora. Alguns bugs aparecem, mas nada que atrapalhe.'],
    ['NetrunnerBR', 5, 'A expansão Phantom Liberty é espetacular. Recomendo a todos.'],
  ],
  2767030: [
    ['StarLordBR', 4, 'Muito divertido e gratuito. Personagens bem equilibrados e partidas rápidas.'],
    ['Hulk_Esmaga', 5, 'Joguei com os amigos e foi pura bagunça. As habilidades dos heróis são criativas.'],
    ['WandaVisao', 3, 'Bom, mas alguns heróis ainda estão desbalanceados nas partidas ranqueadas.'],
  ],
  2531310: [
    ['AbbyAnderson', 5, 'Narrativa corajosa e gráficos impressionantes. O modo Sem Regresso é viciante.'],
    ['EllieNoViolao', 4, 'História pesada e emocionante. Algumas decisões dividem opiniões, mas é uma obra de arte.'],
    ['SobreviventeBR', 5, 'Animações e áudio são de outro mundo. Melhor aproveitar com o volume alto.'],
  ],
};

function padrao(nome: string, genero: string): Semente[] {
  const g = genero ? genero.toLowerCase() : 'jogos';
  return [
    ['GamerDoCaribe', 5, `${nome} entrega exatamente o que promete. Valeu cada centavo!`],
    ['Capitao_Barba', 4, `Gostei bastante de ${nome}, só achei que poderia ter mais conteúdo no começo.`],
    ['SireneDoMar', 4, `Ótimo para jogar com calma no fim de semana. Recomendo para quem curte ${g}.`],
  ];
}

// número estável por jogo/comentário (os valores não mudam a cada recarga)
const mistura = (a: number, b: number) => Math.abs((a * 2654435 + b * 40503) % 997);

export function comentariosDoJogo(appid: number, nome: string, genero = ''): Comentario[] {
  const sementes = SEMENTES[appid] ?? padrao(nome, genero);

  return sementes.map(([autor, estrelas, texto], i) => {
    const dia = 1 + (mistura(appid, i) % 27);
    const mes = 5 + (mistura(appid, i + 9) % 5);
    return {
      id: appid * 10 + i + 1,
      autor,
      avatar: autor.charAt(0).toUpperCase(),
      corAvatar: CORES[(appid + i) % CORES.length],
      estrelas,
      texto,
      data: `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/2026`,
      likes: 20 + (mistura(appid, i + 3) % 380),
      dislikes: mistura(appid, i + 5) % 12,
    };
  });
}