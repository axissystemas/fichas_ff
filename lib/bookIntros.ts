export const BOOK_INTROS: Record<string, string> = {
  'O Feiticeiro da Montanha de Fogo':
    'Sua busca pelo lendário tesouro do mago Zagor o trouxe ao sopé da Montanha de Fogo. Rumores dizem que o feiticeiro guarda suas riquezas no fundo de um labirinto povoado por monstros terríveis. Apenas a sua espada, coragem e determinação guiam seus passos rumo às profundezas cavernosas...',
  'A Cidadela do Caos':
    'O malévolo feiticeiro Balthus Dire planeja uma invasão implacável a partir de sua fortaleza, a temida Cidadela do Caos. Como um mestre da magia treinado pelo Grande Mago da Floresta de Yore, você foi enviado sozinho para se infiltrar na cidadela e deter Dire antes que seu exército de monstros marche.',
  'A Masmorra da Morte':
    'Na cidade de Fang, o Barão Sukumvit construiu um labirinto subterrâneo mortal conhecido como o Desafio dos Campeões. Inúmeros aventureiros entraram em seus portões de ferro buscando a glória e o prêmio de dez mil peças de ouro, mas nenhum jamais retornou vivo. Hoje, os portões se abrem para você...',
  'A Floresta da Destruição':
    'A Floresta de Darkwood é um lugar de horrores indescritíveis. Sua missão é recuperar o lendário Martelo de Stonebridge, roubado dos anões por trolls. Sem ele, a pacífica vila de Stonebridge está condenada à destruição por hordas invasoras. Você respira fundo e cruza a fronteira da floresta...',
  'A Cidade dos Ladrões':
    'Port Blacksand, a infame Cidade dos Ladrões, é governada pelo tirano Lorde Azzur. Um comerciante de Silverton contratou seus serviços para livrar a região do pesadelo do Príncipe Nicodemus. Para entrar na cidade e sobreviver às suas ruas perigosas, você precisará de toda a sua sagacidade e coragem.',
  'Nave Espacial Traveller':
    'Sua nave estelar, a Traveller, foi sugada por um buraco negro misterioso e arremessada para uma galáxia desconhecida e hostil. Como capitão, você deve guiar sua tripulação através do vazio do espaço profundo, descobrindo planetas alienígenas e procurando um caminho de volta para a Terra.',
  'O Templo do Terror':
    'O cruel Malbordus busca recuperar os cinco dragões de ouro escondidos no deserto de Vatos, com os quais pretende erguer um exército invencível. O Grande Mago Yaztromo convocou você para cruzar as areias impiedosas e destruir os planos do bruxo antes que a escuridão caia sobre Allansia.',
  'Mares de Sangue':
    'Nas águas traiçoeiras do mar interior, você comanda o navio pirata Banshee. Uma aposta audaciosa foi feita entre você e outro capitão pirata: quem saquear mais ouro ao longo de trinta dias será coroado o Rei dos Piratas. Ergam as velas, preparem os canhões e que comecem os Mares de Sangue!',
  'Encontro Marcado com o M.E.D.O.':
    'Na metrópole futurista de Titan City, supervilões e a organização criminosa M.E.D.O. ameaçam a paz. Sob a identidade secreta de um super-herói com poderes extraordinários, você patrulha as ruas escuras, combatendo o crime e desvendando a conspiração do maligno Dr. Macabre.',
  'As Coligações de Kether':
    'Como investigador estelar da polícia imperial, você foi enviado ao planeta colônia Kether para desmantelar uma rede secreta de tráfico de drogas espaciais que ameaça a estabilidade da Federação Galáctica. Em um mundo de intrigas corporativas e becos cibernéticos, cada decisão conta.',
  'A Cripta do Vampiro':
    'O malévolo Conde Reiner Heydrich despertou em seu castelo ancestral na Mauristânia, espalhando terror e morte pelas aldeias vizinhas. Munido de sua espada, suprimentos e de uma fé inabalável, você decide cruzar os portões do temido Castelo Heydrich para explorar seus corredores sombrios, enfrentar criaturas da noite e purificar a cripta antes que o vampiro reine supremo...',
};

export const getBookIntro = (bookName: string | undefined): string => {
  if (!bookName) return getGenericIntro();
  return BOOK_INTROS[bookName] || getGenericIntro();
};

const getGenericIntro = (): string => {
  return 'Uma nova aventura está prestes a começar em terras distantes e inexploradas. Diante de você se estende o caminho do desconhecido, repleto de perigos mortais, tesouros perdidos e escolhas difíceis. Para dar início à sua saga, você deve primeiro determinar os seus atributos iniciais de combate e sobrevivência...';
};
