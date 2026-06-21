export interface Achievement {
  id: string;
  code: string; // e.g. "FF 01", "GERAL"
  title: string;
  description: string;
  icon: string;
  type: 'book' | 'milestone';
  bookName?: string;
  hint: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Fighting Fantasy (Jambô Editora)
  {
    id: 'ff_01',
    code: 'FF 01',
    title: 'O Feiticeiro da Montanha de Fogo',
    description: 'Concluiu a aventura e derrotou o mago Zagor na Montanha de Fogo.',
    icon: '🔥',
    type: 'book',
    bookName: 'O Feiticeiro da Montanha de Fogo',
    hint: 'Conclua o livro "O Feiticeiro da Montanha de Fogo".'
  },
  {
    id: 'ff_02',
    code: 'FF 02',
    title: 'A Cidadela do Caos',
    description: 'Balthus Dire foi derrotado em sua própria cidadela.',
    icon: '🏰',
    type: 'book',
    bookName: 'A Cidadela do Caos',
    hint: 'Conclua o livro "A Cidadela do Caos".'
  },
  {
    id: 'ff_03',
    code: 'FF 03',
    title: 'A Masmorra da Morte',
    description: 'Sobreviveu aos horrores do Desafio dos Campeões do Barão Sukumvit.',
    icon: '💀',
    type: 'book',
    bookName: 'A Masmorra da Morte',
    hint: 'Conclua o livro "A Masmorra da Morte".'
  },
  {
    id: 'ff_04',
    code: 'FF 04',
    title: 'Criatura Selvagem',
    description: 'Desvendou os mistérios da floresta e sobreviveu como a criatura.',
    icon: '🐾',
    type: 'book',
    bookName: 'Criatura Selvagem',
    hint: 'Conclua o livro "Criatura Selvagem".'
  },
  {
    id: 'ff_05',
    code: 'FF 05',
    title: 'A Cidade dos Ladrões',
    description: 'Sobreviveu a Port Blacksand e derrotou o Príncipe Nicodemus.',
    icon: '👥',
    type: 'book',
    bookName: 'A Cidade dos Ladrões',
    hint: 'Conclua o livro "A Cidade dos Ladrões".'
  },
  {
    id: 'ff_06',
    code: 'FF 06',
    title: 'A Cripta do Feiticeiro',
    description: 'Derrotou o necromante Razaak e salvou Allansia.',
    icon: '⚰️',
    type: 'book',
    bookName: 'A Cripta do Feiticeiro',
    hint: 'Conclua o livro "A Cripta do Feiticeiro".'
  },
  {
    id: 'ff_07',
    code: 'FF 07',
    title: 'A Mansão do Inferno',
    description: 'Escapou com vida da assustadora Mansão do Inferno.',
    icon: '👺',
    type: 'book',
    bookName: 'A Mansão do Inferno',
    hint: 'Conclua o livro "A Mansão do Inferno".'
  },
  {
    id: 'ff_08',
    code: 'FF 08',
    title: 'A Floresta da Destruição',
    description: 'Recuperou o lendário Martelo de Stonebridge e salvou os anões.',
    icon: '🌳',
    type: 'book',
    bookName: 'A Floresta da Destruição',
    hint: 'Conclua o livro "A Floresta da Destruição".'
  },
  {
    id: 'ff_09',
    code: 'FF 09',
    title: 'As Cavernas da Bruxa da Neve',
    description: 'Derrotou a Bruxa da Neve nos picos gelados das Montanhas do Dente de Cristal.',
    icon: '❄️',
    type: 'book',
    bookName: 'As Cavernas da Bruxa da Neve',
    hint: 'Conclua o livro "As Cavernas da Bruxa da Neve".'
  },
  {
    id: 'ff_10',
    code: 'FF 10',
    title: 'Desafio dos Campeões',
    description: 'Entrou novamente na Masmorra da Morte e venceu o segundo labirinto.',
    icon: '🏅',
    type: 'book',
    bookName: 'Desafio dos Campeões',
    hint: 'Conclua o livro "Desafio dos Campeões".'
  },
  {
    id: 'ff_11',
    code: 'FF 11',
    title: 'Exércitos da Morte',
    description: 'Liderou suas tropas com bravura e derrotou o Senhor das Sombras Agglax.',
    icon: '🛡️',
    type: 'book',
    bookName: 'Exércitos da Morte',
    hint: 'Conclua o livro "Exércitos da Morte".'
  },
  {
    id: 'ff_12',
    code: 'FF 12',
    title: 'Retorno à Montanha de Fogo',
    description: 'Venceu novamente os perigos da Montanha de Fogo para derrotar o Zagor ressuscitado.',
    icon: '🌋',
    type: 'book',
    bookName: 'Retorno à Montanha de Fogo',
    hint: 'Conclua o livro "Retorno à Montanha de Fogo".'
  },
  {
    id: 'ff_13',
    code: 'FF 13',
    title: 'A Ilha do Rei Lagarto',
    description: 'Libertou os prisioneiros e destruiu o tirânico Rei Lagarto.',
    icon: '🦎',
    type: 'book',
    bookName: 'A Ilha do Rei Lagarto',
    hint: 'Conclua o livro "A Ilha do Rei Lagarto".'
  },
  {
    id: 'ff_14',
    code: 'FF 14',
    title: 'Encontro Marcado com o M.E.D.O.',
    description: 'Salvou Titan City e derrotou a organização criminosa M.E.D.O.',
    icon: '🦸‍♂️',
    type: 'book',
    bookName: 'Encontro Marcado com o M.E.D.O.',
    hint: 'Conclua o livro "Encontro Marcado com o M.E.D.O.".'
  },
  {
    id: 'ff_15',
    code: 'FF 15',
    title: 'Nave Espacial Traveller',
    description: 'Guiou com sucesso a tripulação da Traveller de volta à Terra.',
    icon: '🚀',
    type: 'book',
    bookName: 'Nave Espacial Traveller',
    hint: 'Conclua o livro "Nave Espacial Traveller".'
  },
  {
    id: 'ff_16',
    code: 'FF 16',
    title: 'A Espada do Samurai',
    description: 'Recuperou a espada mágica Dai-Katana e salvou o império de Hachiman.',
    icon: '🏮',
    type: 'book',
    bookName: 'A Espada do Samurai',
    hint: 'Conclua o livro "A Espada do Samurai".'
  },
  {
    id: 'ff_17',
    code: 'FF 17',
    title: 'Guerreiro das Estradas',
    description: 'Atravessou as terras devastadas de Allansia e entregou a fórmula da cura.',
    icon: '🏎️',
    type: 'book',
    bookName: 'Guerreiro das Estradas',
    hint: 'Conclua o livro "Guerreiro das Estradas".'
  },
  {
    id: 'ff_18',
    code: 'FF 18',
    title: 'O Templo do Terror',
    description: 'Impediu que Malbordus obtivesse os cinco dragões de ouro no deserto de Vatos.',
    icon: '🦂',
    type: 'book',
    bookName: 'O Templo do Terror',
    hint: 'Conclua o livro "O Templo do Terror".'
  },
  {
    id: 'ff_19',
    code: 'FF 19',
    title: 'Sangue de Zumbis',
    description: 'Sobreviveu à epidemia de mortos-vivos no castelo de Gingrich.',
    icon: '🧟',
    type: 'book',
    bookName: 'Sangue de Zumbis',
    hint: 'Conclua o livro "Sangue de Zumbis".'
  },
  {
    id: 'ff_20',
    code: 'FF 20',
    title: 'Ossos Sangrentos',
    description: 'Derrotou o pirata morto-vivo Cadança e sua tripulação maldita.',
    icon: '🏴‍☠️',
    type: 'book',
    bookName: 'Ossos Sangrentos',
    hint: 'Conclua o livro "Ossos Sangrentos".'
  },
  {
    id: 'ff_21',
    code: 'FF 21',
    title: 'Uivo do Lobisomem',
    description: 'Quebrou a maldição da licantropia nas florestas sombrias de Lupravia.',
    icon: '🐺',
    type: 'book',
    bookName: 'Uivo do Lobisomem',
    hint: 'Conclua o livro "Uivo do Lobisomem".'
  },
  {
    id: 'ff_22',
    code: 'FF 22',
    title: 'O Porto do Perigo',
    description: 'Completou a jornada pelos mares desconhecidos e recuperou as relíquias.',
    icon: '⚓',
    type: 'book',
    bookName: 'O Porto do Perigo',
    hint: 'Conclua o livro "O Porto do Perigo".'
  },
  {
    id: 'ff_23',
    code: 'FF 23',
    title: 'O Talismã da Morte',
    description: 'Impediu que os asseclas do Deus da Morte recuperassem o talismã de Orb.',
    icon: '🧿',
    type: 'book',
    bookName: 'O Talismã da Morte',
    hint: 'Conclua o livro "O Talismã da Morte".'
  },
  {
    id: 'ff_24',
    code: 'FF 24',
    title: 'A Lenda de Zagor',
    description: 'Derrotou definitivamente o espírito reencarnado do mago Zagor.',
    icon: '🪄',
    type: 'book',
    bookName: 'A Lenda de Zagor',
    hint: 'Conclua o livro "A Lenda de Zagor".'
  },
  {
    id: 'ff_25',
    code: 'FF 25',
    title: 'A Cripta do Vampiro',
    description: 'Invadiu o Castelo Heydrich e destruiu o Conde Reiner Heydrich.',
    icon: '🦇',
    type: 'book',
    bookName: 'A Cripta do Vampiro',
    hint: 'Conclua o livro "A Cripta do Vampiro".'
  },
  {
    id: 'ff_26',
    code: 'FF 26',
    title: 'Algoz da Tempestade',
    description: 'Derrotou o Algoz da Tempestade e restaurou a paz no reino do céu.',
    icon: '⚡',
    type: 'book',
    bookName: 'Algoz da Tempestade',
    hint: 'Conclua o livro "Algoz da Tempestade".'
  },
  {
    id: 'ff_27',
    code: 'FF 27',
    title: 'Noite do Necromante',
    description: 'Sobreviveu à terrível noite e deteve a ressurreição das forças trevosas.',
    icon: '🔮',
    type: 'book',
    bookName: 'Noite do Necromante',
    hint: 'Conclua o livro "Noite do Necromante".'
  },
  {
    id: 'ff_28',
    code: 'FF 28',
    title: 'Assassinos de Allansia',
    description: 'Desvendou a conspiração e derrotou a liga de assassinos.',
    icon: '🎯',
    type: 'book',
    bookName: 'Assassinos de Allansia',
    hint: 'Conclua o livro "Assassinos de Allansia".'
  },
  {
    id: 'ff_29',
    code: 'FF 29',
    title: 'Segredos de Salamonis',
    description: 'Explorou a antiga cidade de Salamonis e revelou seus maiores mistérios.',
    icon: '📜',
    type: 'book',
    bookName: 'Segredos de Salamonis',
    hint: 'Conclua o livro "Segredos de Salamonis".'
  },
  {
    id: 'ff_30',
    code: 'FF 30',
    title: 'Sombra de Gigantes',
    description: 'Parou os gigantes que ameaçavam esmagar as terras de Allansia.',
    icon: '⛰️',
    type: 'book',
    bookName: 'Sombra de Gigantes',
    hint: 'Conclua o livro "Sombra de Gigantes".'
  },

  // Série Magia! (Sorcery!)
  {
    id: 'ff_31',
    code: 'FF 31',
    title: 'Magia! Vol. 1 — As Montanhas Shamutanti',
    description: 'Iniciou a jornada pela Coroa dos Reis atravessando as Montanhas Shamutanti.',
    icon: '⛰️',
    type: 'book',
    bookName: 'As Montanhas Shamutanti',
    hint: 'Conclua o livro "As Montanhas Shamutanti".'
  },
  {
    id: 'ff_32',
    code: 'FF 32',
    title: 'Magia! Vol. 2 — Kharé: Porto dos Ardis',
    description: 'Escapou das armadilhas e decifrou os feitiços da traiçoeira cidade de Kharé.',
    icon: '🚪',
    type: 'book',
    bookName: 'Kharé: Porto dos Ardis',
    hint: 'Conclua o livro "Kharé: Porto dos Ardis".'
  },
  {
    id: 'ff_33',
    code: 'FF 33',
    title: 'Magia! Vol. 3 — As Sete Serpentes',
    description: 'Caçou e derrotou as sete serpentes mensageiras do Arqui-mago.',
    icon: '🐍',
    type: 'book',
    bookName: 'As Sete Serpentes',
    hint: 'Conclua o livro "As Sete Serpentes".'
  },
  {
    id: 'ff_34',
    code: 'FF 34',
    title: 'Magia! Vol. 4 — A Coroa dos Reis',
    description: 'Invadiu a Fortaleza de Mampang e recuperou a lendária Coroa dos Reis.',
    icon: '👑',
    type: 'book',
    bookName: 'A Coroa dos Reis',
    hint: 'Conclua o livro "A Coroa dos Reis".'
  },

  // Novos lançamentos
  {
    id: 'ff_35',
    code: 'FF 35',
    title: 'A Masmorra na Ilha de Sangue',
    description: 'Sobreviveu à terrível masmorra tropical e escapou da Ilha de Sangue.',
    icon: '🏝️',
    type: 'book',
    bookName: 'A Masmorra na Ilha de Sangue',
    hint: 'Conclua o livro "A Masmorra na Ilha de Sangue".'
  },
  {
    id: 'ff_36',
    code: 'FF 36',
    title: 'Ladrão da Meia-noite',
    description: 'Realizou os maiores roubos noturnos e provou seu valor na guilda dos ladrões.',
    icon: '🕵️‍♂️',
    type: 'book',
    bookName: 'Ladrão da Meia-Noite',
    hint: 'Conclua o livro "Ladrão da Meia-Noite".'
  },
  {
    id: 'ff_37',
    code: 'FF 37',
    title: 'Robô Comando',
    description: 'Assumiu o controle do mecha gigante e salvou a humanidade da invasão metalizada.',
    icon: '🤖',
    type: 'book',
    bookName: 'Robô Comando',
    hint: 'Conclua o livro "Robô Comando".'
  },

  // Outros livros incluídos no app
  {
    id: 'ff_kether',
    code: 'FF EXTRA',
    title: 'As Coligações de Kether',
    description: 'Derrubou o império de tráfico de drogas em Kether e salvou a galáxia.',
    icon: '🌌',
    type: 'book',
    bookName: 'As Coligações de Kether',
    hint: 'Conclua o livro "As Coligações de Kether".'
  },
  {
    id: 'ff_mares',
    code: 'FF EXTRA',
    title: 'Mares de Sangue',
    description: 'Tornou-se o maior pirata do mar interior acumulando o maior saque de ouro.',
    icon: '🌊',
    type: 'book',
    bookName: 'Mares de Sangue',
    hint: 'Conclua o livro "Mares de Sangue".'
  },

  // Conquistas Gerais
  {
    id: 'milestone_first_blood',
    code: 'GERAL',
    title: 'Primeiro Sangue',
    description: 'Derrotou o primeiro monstro em combate.',
    icon: '⚔️',
    type: 'milestone',
    hint: 'Vença um combate contra qualquer criatura.'
  },
  {
    id: 'milestone_gold_hoarder',
    code: 'GERAL',
    title: 'Rico de Marré',
    description: 'Acumulou 30 ou mais moedas de ouro na sua ficha ativa.',
    icon: '🪙',
    type: 'milestone',
    hint: 'Acumule pelo menos 30 moedas de ouro em sua ficha.'
  },
  {
    id: 'milestone_max_luck',
    code: 'GERAL',
    title: 'Sorte Grande',
    description: 'Obteve Sorte Inicial máxima (12) durante a criação do personagem.',
    icon: '🎲',
    type: 'milestone',
    hint: 'Crie uma ficha com Sorte Inicial igual a 12.'
  },
  {
    id: 'milestone_max_skill',
    code: 'GERAL',
    title: 'Coração Valente',
    description: 'Obteve Habilidade Inicial máxima (12) durante a criação do personagem.',
    icon: '💪',
    type: 'milestone',
    hint: 'Crie uma ficha com Habilidade Inicial igual a 12.'
  },
  {
    id: 'milestone_first_death',
    code: 'GERAL',
    title: 'Primeira Queda',
    description: 'Sofreu a sua primeira derrota (energia chegou a zero ou morte registrada).',
    icon: '💀',
    type: 'milestone',
    hint: 'Morra em combate ou tenha sua energia reduzida a zero.'
  }
];

export function getAchievementIdForBook(bookName: string): string | undefined {
  return ACHIEVEMENTS.find(a => a.type === 'book' && a.bookName === bookName)?.id;
}
