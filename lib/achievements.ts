export interface Achievement {
  id: string;
  code: string; // e.g. "FF 01", "COMBATE", "SORTE"
  title: string;
  description: string;
  icon: string;
  type: 'book' | 'milestone';
  bookName?: string;
  hint: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category: 'combat' | 'luck' | 'survival' | 'exploration' | 'character' | 'resources' | 'challenges' | 'hall_of_fame' | 'secret';
  isSecret?: boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  // ─── LIVROS JOGOS - EXPLORAÇÃO / HALL DA FAMA ──────────────────────────────
  {
    id: 'ff_01',
    code: 'FF 01',
    title: 'Conquistador da Montanha de Fogo',
    description: 'Concluiu a aventura e derrotou o mago Zagor na Montanha de Fogo.',
    icon: '🏆',
    type: 'book',
    bookName: 'O Feiticeiro da Montanha de Fogo',
    hint: 'Conclua o livro "O Feiticeiro da Montanha de Fogo".',
    rarity: 'rare',
    category: 'hall_of_fame'
  },
  {
    id: 'ff_02',
    code: 'FF 02',
    title: 'Vencedor da Cidadela do Caos',
    description: 'Balthus Dire foi derrotado em sua própria cidadela.',
    icon: '🏆',
    type: 'book',
    bookName: 'A Cidadela do Caos',
    hint: 'Conclua o livro "A Cidadela do Caos".',
    rarity: 'rare',
    category: 'hall_of_fame'
  },
  {
    id: 'ff_03',
    code: 'FF 03',
    title: 'Herói de Fang',
    description: 'Sobreviveu aos horrores do Desafio dos Campeões do Barão Sukumvit na Masmorra da Morte.',
    icon: '🏆',
    type: 'book',
    bookName: 'A Masmorra da Morte',
    hint: 'Conclua o livro "A Masmorra da Morte".',
    rarity: 'rare',
    category: 'hall_of_fame'
  },
  {
    id: 'ff_04',
    code: 'FF 04',
    title: 'Criatura Selvagem',
    description: 'Desvendou os mistérios da floresta e sobreviveu como a criatura.',
    icon: '🐾',
    type: 'book',
    bookName: 'Criatura Selvagem',
    hint: 'Conclua o livro "Criatura Selvagem".',
    rarity: 'common',
    category: 'exploration'
  },
  {
    id: 'ff_05',
    code: 'FF 05',
    title: 'A Cidade dos Ladrões',
    description: 'Sobreviveu a Port Blacksand e derrotou o Príncipe Nicodemus.',
    icon: '👥',
    type: 'book',
    bookName: 'A Cidade dos Ladrões',
    hint: 'Conclua o livro "A Cidade dos Ladrões".',
    rarity: 'common',
    category: 'exploration'
  },
  {
    id: 'ff_06',
    code: 'FF 06',
    title: 'A Cripta do Feiticeiro',
    description: 'Derrotou o necromante Razaak e salvou Allansia.',
    icon: '⚰️',
    type: 'book',
    bookName: 'A Cripta do Feiticeiro',
    hint: 'Conclua o livro "A Cripta do Feiticeiro".',
    rarity: 'uncommon',
    category: 'exploration'
  },
  {
    id: 'ff_07',
    code: 'FF 07',
    title: 'A Mansão do Inferno',
    description: 'Escapou com vida da assustadora Mansão do Inferno.',
    icon: '👺',
    type: 'book',
    bookName: 'A Mansão do Inferno',
    hint: 'Conclua o livro "A Mansão do Inferno".',
    rarity: 'uncommon',
    category: 'exploration'
  },
  {
    id: 'ff_08',
    code: 'FF 08',
    title: 'A Floresta da Destruição',
    description: 'Recuperou o lendário Martelo de Stonebridge e salvou os anões.',
    icon: '🌳',
    type: 'book',
    bookName: 'A Floresta da Destruição',
    hint: 'Conclua o livro "A Floresta da Destruição".',
    rarity: 'common',
    category: 'exploration'
  },
  {
    id: 'ff_09',
    code: 'FF 09',
    title: 'As Cavernas da Bruxa da Neve',
    description: 'Derrotou a Bruxa da Neve nos picos gelados das Montanhas do Dente de Cristal.',
    icon: '❄️',
    type: 'book',
    bookName: 'As Cavernas da Bruxa da Neve',
    hint: 'Conclua o livro "As Cavernas da Bruxa da Neve".',
    rarity: 'uncommon',
    category: 'exploration'
  },
  {
    id: 'ff_10',
    code: 'FF 10',
    title: 'Desafio dos Campeões',
    description: 'Entrou novamente na Masmorra da Morte e venceu o segundo labirinto.',
    icon: '🏅',
    type: 'book',
    bookName: 'Desafio dos Campeões',
    hint: 'Conclua o livro "Desafio dos Campeões".',
    rarity: 'uncommon',
    category: 'exploration'
  },
  {
    id: 'ff_11',
    code: 'FF 11',
    title: 'Exércitos da Morte',
    description: 'Liderou suas tropas com bravura e derrotou o Senhor das Sombras Agglax.',
    icon: '🛡️',
    type: 'book',
    bookName: 'Exércitos da Morte',
    hint: 'Conclua o livro "Exércitos da Morte".',
    rarity: 'uncommon',
    category: 'exploration'
  },
  {
    id: 'ff_12',
    code: 'FF 12',
    title: 'Retorno à Montanha de Fogo',
    description: 'Venceu novamente os perigos da Montanha de Fogo para derrotar o Zagor ressuscitado.',
    icon: '🌋',
    type: 'book',
    bookName: 'Retorno à Montanha de Fogo',
    hint: 'Conclua o livro "Retorno à Montanha de Fogo".',
    rarity: 'uncommon',
    category: 'exploration'
  },
  {
    id: 'ff_13',
    code: 'FF 13',
    title: 'A Ilha do Rei Lagarto',
    description: 'Libertou os prisioneiros e destruiu o tirânico Rei Lagarto.',
    icon: '🦎',
    type: 'book',
    bookName: 'A Ilha do Rei Lagarto',
    hint: 'Conclua o livro "A Ilha do Rei Lagarto".',
    rarity: 'common',
    category: 'exploration'
  },
  {
    id: 'ff_14',
    code: 'FF 14',
    title: 'Encontro Marcado com o M.E.D.O.',
    description: 'Salvou Titan City e derrotou a organização criminosa M.E.D.O.',
    icon: '🦸‍♂️',
    type: 'book',
    bookName: 'Encontro Marcado com o M.E.D.O.',
    hint: 'Conclua o livro "Encontro Marcado com o M.E.D.O.".',
    rarity: 'uncommon',
    category: 'exploration'
  },
  {
    id: 'ff_15',
    code: 'FF 15',
    title: 'Nave Espacial Traveller',
    description: 'Guiou com sucesso a tripulação da Traveller de volta à Terra.',
    icon: '🚀',
    type: 'book',
    bookName: 'Nave Espacial Traveller',
    hint: 'Conclua o livro "Nave Espacial Traveller".',
    rarity: 'common',
    category: 'exploration'
  },
  {
    id: 'ff_16',
    code: 'FF 16',
    title: 'A Espada do Samurai',
    description: 'Recuperou a espada mágica Dai-Katana e salvou o império de Hachiman.',
    icon: '🏮',
    type: 'book',
    bookName: 'A Espada do Samurai',
    hint: 'Conclua o livro "A Espada do Samurai".',
    rarity: 'common',
    category: 'exploration'
  },
  {
    id: 'ff_17',
    code: 'FF 17',
    title: 'Guerreiro das Estradas',
    description: 'Atravessou as terras devastadas de Allansia e entregou a fórmula da cura.',
    icon: '🏎️',
    type: 'book',
    bookName: 'Guerreiro das Estradas',
    hint: 'Conclua o livro "Guerreiro das Estradas".',
    rarity: 'common',
    category: 'exploration'
  },
  {
    id: 'ff_18',
    code: 'FF 18',
    title: 'Mestre do Templo do Terror',
    description: 'Impediu que Malbordus obtivesse os cinco dragões de ouro no deserto de Vatos.',
    icon: '🏆',
    type: 'book',
    bookName: 'O Templo do Terror',
    hint: 'Conclua o livro "O Templo do Terror".',
    rarity: 'rare',
    category: 'hall_of_fame'
  },
  {
    id: 'ff_19',
    code: 'FF 19',
    title: 'Sangue de Zumbis',
    description: 'Sobreviveu à epidemia de mortos-vivos no castelo de Gingrich.',
    icon: '🧟',
    type: 'book',
    bookName: 'Sangue de Zumbis',
    hint: 'Conclua o livro "Sangue de Zumbis".',
    rarity: 'common',
    category: 'exploration'
  },
  {
    id: 'ff_20',
    code: 'FF 20',
    title: 'Ossos Sangrentos',
    description: 'Derrotou o pirata morto-vivo Cadança e sua tripulação maldita.',
    icon: '🏴‍☠️',
    type: 'book',
    bookName: 'Ossos Sangrentos',
    hint: 'Conclua o livro "Ossos Sangrentos".',
    rarity: 'common',
    category: 'exploration'
  },
  {
    id: 'ff_21',
    code: 'FF 21',
    title: 'Uivo do Lobisomem',
    description: 'Quebrou a maldição da licantropia nas florestas sombrias de Lupravia.',
    icon: '🐺',
    type: 'book',
    bookName: 'Uivo do Lobisomem',
    hint: 'Conclua o livro "Uivo do Lobisomem".',
    rarity: 'uncommon',
    category: 'exploration'
  },
  {
    id: 'ff_22',
    code: 'FF 22',
    title: 'O Porto do Perigo',
    description: 'Completou a jornada pelos mares desconhecidos e recuperou as relíquias.',
    icon: '⚓',
    type: 'book',
    bookName: 'O Porto do Perigo',
    hint: 'Conclua o livro "O Porto do Perigo".',
    rarity: 'common',
    category: 'exploration'
  },
  {
    id: 'ff_23',
    code: 'FF 23',
    title: 'O Talismã da Morte',
    description: 'Impediu que os asseclas do Deus da Morte recuperassem o talismã de Orb.',
    icon: '🧿',
    type: 'book',
    bookName: 'O Talismã da Morte',
    hint: 'Conclua o livro "O Talismã da Morte".',
    rarity: 'common',
    category: 'exploration'
  },
  {
    id: 'ff_24',
    code: 'FF 24',
    title: 'A Lenda de Zagor',
    description: 'Derrotou definitivamente o espírito reencarnado do mago Zagor.',
    icon: '🪄',
    type: 'book',
    bookName: 'A Lenda de Zagor',
    hint: 'Conclua o livro "A Lenda de Zagor".',
    rarity: 'uncommon',
    category: 'exploration'
  },
  {
    id: 'ff_25',
    code: 'FF 25',
    title: 'A Cripta do Vampiro',
    description: 'Invadiu o Castelo Heydrich e destruiu o Conde Reiner Heydrich.',
    icon: '🦇',
    type: 'book',
    bookName: 'A Cripta do Vampiro',
    hint: 'Conclua o livro "A Cripta do Vampiro".',
    rarity: 'uncommon',
    category: 'exploration'
  },
  {
    id: 'ff_26',
    code: 'FF 26',
    title: 'Algoz da Tempestade',
    description: 'Derrotou o Algoz da Tempestade e restaurou a paz no reino do céu.',
    icon: '⚡',
    type: 'book',
    bookName: 'Algoz da Tempestade',
    hint: 'Conclua o livro "Algoz da Tempestade".',
    rarity: 'uncommon',
    category: 'exploration'
  },
  {
    id: 'ff_27',
    code: 'FF 27',
    title: 'Noite do Necromante',
    description: 'Sobreviveu à terrível noite e deteve a ressurreição das forças trevosas.',
    icon: '🔮',
    type: 'book',
    bookName: 'Noite do Necromante',
    hint: 'Conclua o livro "Noite do Necromante".',
    rarity: 'uncommon',
    category: 'exploration'
  },
  {
    id: 'ff_28',
    code: 'FF 28',
    title: 'Assassinos de Allansia',
    description: 'Desvendou a conspiração e derrotou a liga de assassinos.',
    icon: '🎯',
    type: 'book',
    bookName: 'Assassinos de Allansia',
    hint: 'Conclua o livro "Assassinos de Allansia".',
    rarity: 'uncommon',
    category: 'exploration'
  },
  {
    id: 'ff_29',
    code: 'FF 29',
    title: 'Segredos de Salamonis',
    description: 'Explorou a antiga cidade de Salamonis e revelou seus maiores mistérios.',
    icon: '📜',
    type: 'book',
    bookName: 'Segredos de Salamonis',
    hint: 'Conclua o livro "Segredos de Salamonis".',
    rarity: 'uncommon',
    category: 'exploration'
  },
  {
    id: 'ff_30',
    code: 'FF 30',
    title: 'Sombra de Gigantes',
    description: 'Parou os gigantes que ameaçavam esmagar as terras de Allansia.',
    icon: '⛰️',
    type: 'book',
    bookName: 'Sombra de Gigantes',
    hint: 'Conclua o livro "Sombra de Gigantes".',
    rarity: 'uncommon',
    category: 'exploration'
  },
  {
    id: 'ff_31',
    code: 'FF 31',
    title: 'Magia! Vol. 1 — As Montanhas Shamutanti',
    description: 'Iniciou a jornada pela Coroa dos Reis atravessando as Montanhas Shamutanti.',
    icon: '⛰️',
    type: 'book',
    bookName: 'As Montanhas Shamutanti',
    hint: 'Conclua o livro "As Montanhas Shamutanti".',
    rarity: 'common',
    category: 'exploration'
  },
  {
    id: 'ff_32',
    code: 'FF 32',
    title: 'Magia! Vol. 2 — Kharé: Porto dos Ardis',
    description: 'Escapou das armadilhas e decifrou os feitiços da traiçoeira cidade de Kharé.',
    icon: '🚪',
    type: 'book',
    bookName: 'Kharé: Porto dos Ardis',
    hint: 'Conclua o livro "Kharé: Porto dos Ardis".',
    rarity: 'common',
    category: 'exploration'
  },
  {
    id: 'ff_33',
    code: 'FF 33',
    title: 'Magia! Vol. 3 — As Sete Serpentes',
    description: 'Caçou e derrotou as sete serpentes mensageiras do Arqui-mago.',
    icon: '🐍',
    type: 'book',
    bookName: 'As Sete Serpentes',
    hint: 'Conclua o livro "As Sete Serpentes".',
    rarity: 'uncommon',
    category: 'exploration'
  },
  {
    id: 'ff_34',
    code: 'FF 34',
    title: 'Magia! Vol. 4 — A Coroa dos Reis',
    description: 'Invadiu a Fortaleza de Mampang e recuperou a lendária Coroa dos Reis.',
    icon: '👑',
    type: 'book',
    bookName: 'A Coroa dos Reis',
    hint: 'Conclua o livro "A Coroa dos Reis".',
    rarity: 'rare',
    category: 'exploration'
  },
  {
    id: 'ff_35',
    code: 'FF 35',
    title: 'A Masmorra na Ilha de Sangue',
    description: 'Sobreviveu à terrível masmorra tropical e escapou da Ilha de Sangue.',
    icon: '🏝️',
    type: 'book',
    bookName: 'A Masmorra na Ilha de Sangue',
    hint: 'Conclua o livro "A Masmorra na Ilha de Sangue".',
    rarity: 'uncommon',
    category: 'exploration'
  },
  {
    id: 'ff_36',
    code: 'FF 36',
    title: 'Ladrão da Meia-noite',
    description: 'Realizou os maiores roubos noturnos e provou seu valor na guilda dos ladrões.',
    icon: '🕵️‍♂️',
    type: 'book',
    bookName: 'Ladrão da Meia-Noite',
    hint: 'Conclua o livro "Ladrão da Meia-Noite".',
    rarity: 'uncommon',
    category: 'exploration'
  },
  {
    id: 'ff_37',
    code: 'FF 37',
    title: 'Robô Comando',
    description: 'Assumiu o controle do mecha gigante e salvou a humanidade da invasão metalizada.',
    icon: '🤖',
    type: 'book',
    bookName: 'Robô Comando',
    hint: 'Conclua o livro "Robô Comando".',
    rarity: 'uncommon',
    category: 'exploration'
  },
  {
    id: 'ff_kether',
    code: 'FF EXTRA',
    title: 'As Coligações de Kether',
    description: 'Derrubou o império de tráfico de drogas em Kether e salvou a galáxia.',
    icon: '🌌',
    type: 'book',
    bookName: 'As Coligações de Kether',
    hint: 'Conclua o livro "As Coligações de Kether".',
    rarity: 'uncommon',
    category: 'exploration'
  },
  {
    id: 'ff_mares',
    code: 'FF EXTRA',
    title: 'Mares de Sangue',
    description: 'Tornou-se o maior pirata do mar interior acumulando o maior saque de ouro.',
    icon: '🌊',
    type: 'book',
    bookName: 'Mares de Sangue',
    hint: 'Conclua o livro "Mares de Sangue".',
    rarity: 'uncommon',
    category: 'exploration'
  },

  // ─── CATEGORIA: COMBATE ────────────────────────────────────────────────────
  {
    id: 'milestone_first_blood',
    code: 'COMBATE',
    title: 'Primeiro Sangue 🥉',
    description: 'Derrotou o primeiro monstro em combate.',
    icon: '⚔️',
    type: 'milestone',
    hint: 'Vença o primeiro combate.',
    rarity: 'common',
    category: 'combat'
  },
  {
    id: 'combat_veteran',
    code: 'COMBATE',
    title: 'Veterano',
    description: 'Venceu 10 combates na sua história acumulada.',
    icon: '⚔️',
    type: 'milestone',
    hint: 'Vença 10 combates.',
    rarity: 'common',
    category: 'combat'
  },
  {
    id: 'combat_gladiator',
    code: 'COMBATE',
    title: 'Gladiador',
    description: 'Venceu 50 combates na sua história acumulada.',
    icon: '⚔️',
    type: 'milestone',
    hint: 'Vença 50 combates.',
    rarity: 'uncommon',
    category: 'combat'
  },
  {
    id: 'combat_war_machine',
    code: 'COMBATE',
    title: 'Máquina de Guerra',
    description: 'Venceu 100 combates na sua história acumulada.',
    icon: '⚔️',
    type: 'milestone',
    hint: 'Vença 100 combates.',
    rarity: 'rare',
    category: 'combat'
  },
  {
    id: 'combat_terminator',
    code: 'COMBATE',
    title: 'Exterminador',
    description: 'Derrotou 500 monstros no total geral.',
    icon: '💀',
    type: 'milestone',
    hint: 'Derrote 500 monstros.',
    rarity: 'epic',
    category: 'combat'
  },
  {
    id: 'combat_no_mercy',
    code: 'COMBATE',
    title: 'Sem Misericórdia',
    description: 'Venceu 5 combates seguidos sem sofrer nenhuma perda de energia.',
    icon: '🔥',
    type: 'milestone',
    hint: 'Vença 5 combates seguidos sem perder energia.',
    rarity: 'rare',
    category: 'combat'
  },
  {
    id: 'combat_untouchable',
    code: 'COMBATE',
    title: 'Intocável',
    description: 'Venceu um combate inteiro sem sofrer nenhum dano.',
    icon: '🛡️',
    type: 'milestone',
    hint: 'Vença um combate sem sofrer dano.',
    rarity: 'uncommon',
    category: 'combat'
  },
  {
    id: 'combat_wall',
    code: 'COMBATE',
    title: 'Muralha',
    description: 'Venceu um combate com apenas 1 ponto de energia restante.',
    icon: '🛡️',
    type: 'milestone',
    hint: 'Vença um combate com apenas 1 ponto de energia restante.',
    rarity: 'rare',
    category: 'combat'
  },

  // ─── CATEGORIA: SORTE ──────────────────────────────────────────────────────
  {
    id: 'luck_first_test',
    code: 'SORTE',
    title: 'A Sorte Sorri',
    description: 'Passou com sucesso no seu primeiro teste de sorte.',
    icon: '🍀',
    type: 'milestone',
    hint: 'Passe no primeiro teste de sorte.',
    rarity: 'common',
    category: 'luck'
  },
  {
    id: 'luck_favored_by_gods',
    code: 'SORTE',
    title: 'Favorito dos Deuses',
    description: 'Passou em 10 testes de sorte seguidos sem falhar.',
    icon: '🌟',
    type: 'milestone',
    hint: 'Passe 10 testes de sorte consecutivos.',
    rarity: 'epic',
    category: 'luck'
  },
  {
    id: 'luck_gambler',
    code: 'SORTE',
    title: 'Apostador',
    description: 'Testou sua sorte 50 vezes ao longo das aventuras.',
    icon: '🎲',
    type: 'milestone',
    hint: 'Utilize Sorte 50 vezes.',
    rarity: 'uncommon',
    category: 'luck'
  },
  {
    id: 'luck_bold',
    code: 'SORTE',
    title: 'Ousado',
    description: 'Concluiu um livro-jogo com o atributo Sorte igual a 1.',
    icon: '😈',
    type: 'milestone',
    hint: 'Chegue ao final de um livro com Sorte igual a 1.',
    rarity: 'rare',
    category: 'luck'
  },

  // ─── CATEGORIA: SOBREVIVÊNCIA ──────────────────────────────────────────────
  {
    id: 'survival_first_meal',
    code: 'SOBREVIVÊNCIA',
    title: 'Sobrevivente',
    description: 'Consumiu uma provisão para recuperar suas forças pela primeira vez.',
    icon: '🥖',
    type: 'milestone',
    hint: 'Consuma sua primeira provisão.',
    rarity: 'common',
    category: 'survival'
  },
  {
    id: 'survival_banqueteer',
    code: 'SOBREVIVÊNCIA',
    title: 'Banqueteiro',
    description: 'Consumiu 50 provisões acumuladas em sua jornada.',
    icon: '🥩',
    type: 'milestone',
    hint: 'Consuma 50 provisões.',
    rarity: 'uncommon',
    category: 'survival'
  },
  {
    id: 'survival_near_death',
    code: 'SOBREVIVÊNCIA',
    title: 'Quase Morto',
    description: 'Ficou ou sobreviveu com exatamente 1 ponto de energia.',
    icon: '💉',
    type: 'milestone',
    hint: 'Sobreviva com apenas 1 ponto de energia.',
    rarity: 'common',
    category: 'survival'
  },
  {
    id: 'survival_unbreakable',
    code: 'SOBREVIVÊNCIA',
    title: 'Inquebrável',
    description: 'Terminou um livro completo sem sofrer nenhuma derrota (morte).',
    icon: '🏕️',
    type: 'milestone',
    hint: 'Termine um livro sem morrer nenhuma vez.',
    rarity: 'legendary',
    category: 'survival'
  },

  // ─── CATEGORIA: EXPLORAÇÃO (GERAL) ─────────────────────────────────────────
  {
    id: 'explore_first_step',
    code: 'EXPLORAÇÃO',
    title: 'Primeiro Passo',
    description: 'Iniciou a sua jornada e entrou em sua primeira ficha de aventura.',
    icon: '👣',
    type: 'milestone',
    hint: 'Entre em sua primeira aventura.',
    rarity: 'common',
    category: 'exploration'
  },
  {
    id: 'explore_cartographer',
    code: 'EXPLORAÇÃO',
    title: 'Explorador',
    description: 'Visitou 100 seções/parágrafos de livros no total acumulado.',
    icon: '🗺️',
    type: 'milestone',
    hint: 'Visite 100 seções de livros.',
    rarity: 'rare',
    category: 'exploration'
  },
  {
    id: 'explore_veteran_reader',
    code: 'EXPLORAÇÃO',
    title: 'Leitor Veterano',
    description: 'Explorou e jogou pelo menos 5 livros-jogos diferentes.',
    icon: '📚',
    type: 'milestone',
    hint: 'Jogue 5 livros diferentes.',
    rarity: 'uncommon',
    category: 'exploration'
  },
  {
    id: 'explore_grandmaster',
    code: 'EXPLORAÇÃO',
    title: 'Mestre dos Livros-Jogo',
    description: 'Concluiu com sucesso todas as aventuras cadastradas.',
    icon: '🏰',
    type: 'milestone',
    hint: 'Conclua todos os livros cadastrados.',
    rarity: 'legendary',
    category: 'exploration'
  },
  {
    id: 'explore_curious',
    code: 'EXPLORAÇÃO',
    title: 'Curioso',
    description: 'Utilizou a busca e sugestões de monstros integradas pela primeira vez.',
    icon: '🔎',
    type: 'milestone',
    hint: 'Utilize a busca de seções/encontros pela primeira vez.',
    rarity: 'common',
    category: 'exploration'
  },

  // ─── CATEGORIA: PERSONAGEM ─────────────────────────────────────────────────
  {
    id: 'char_first_hero',
    code: 'PERSONAGEM',
    title: 'Herói Nascente',
    description: 'Criou e instanciou a sua primeira ficha de personagem.',
    icon: '🧙',
    type: 'milestone',
    hint: 'Crie seu primeiro personagem.',
    rarity: 'common',
    category: 'character'
  },
  {
    id: 'char_living_legend',
    code: 'PERSONAGEM',
    title: 'Lenda Viva',
    description: 'Deu vida a 25 aventureiros na história da sua conta.',
    icon: '👑',
    type: 'milestone',
    hint: 'Crie 25 personagens.',
    rarity: 'rare',
    category: 'character'
  },
  {
    id: 'milestone_max_skill',
    code: 'PERSONAGEM',
    title: 'Abençoado pelos Dados',
    description: 'Obteve Habilidade Inicial máxima (12) durante a criação do personagem.',
    icon: '🎲',
    type: 'milestone',
    hint: 'Comece uma aventura com Habilidade máxima (12).',
    rarity: 'uncommon',
    category: 'character'
  },
  {
    id: 'char_max_energy',
    code: 'PERSONAGEM',
    title: 'Vigor Incomparável',
    description: 'Obteve Energia Inicial máxima (24) durante a criação do personagem.',
    icon: '❤️',
    type: 'milestone',
    hint: 'Comece uma aventura com Energia máxima (24).',
    rarity: 'uncommon',
    category: 'character'
  },
  {
    id: 'milestone_max_luck',
    code: 'PERSONAGEM',
    title: 'Destino Favorável',
    description: 'Obteve Sorte Inicial máxima (12) durante a criação do personagem.',
    icon: '🍀',
    type: 'milestone',
    hint: 'Comece uma aventura com Sorte máxima (12).',
    rarity: 'uncommon',
    category: 'character'
  },

  // ─── CATEGORIA: RECURSOS DO APP ────────────────────────────────────────────
  {
    id: 'app_retro',
    code: 'RECURSOS',
    title: 'Retrô',
    description: 'Ativou a trilha sonora 16-bits do aplicativo pela primeira vez.',
    icon: '🎧',
    type: 'milestone',
    hint: 'Ative a música pela primeira vez.',
    rarity: 'common',
    category: 'resources'
  },
  {
    id: 'app_chiptune_lover',
    code: 'RECURSOS',
    title: 'Chiptune',
    description: 'Manteve a trilha sonora de fundo ligada por pelo menos 1 hora acumulada.',
    icon: '🔊',
    type: 'milestone',
    hint: 'Utilize a trilha sonora por 1 hora acumulada.',
    rarity: 'uncommon',
    category: 'resources'
  },
  {
    id: 'app_dark_theme',
    code: 'RECURSOS',
    title: 'Filho da Noite',
    description: 'Ativou o tema visual escuro (Night) para poupar as vistas.',
    icon: '🌙',
    type: 'milestone',
    hint: 'Ative o tema Night.',
    rarity: 'common',
    category: 'resources'
  },
  {
    id: 'app_scribe',
    code: 'RECURSOS',
    title: 'Escriba',
    description: 'Exportou e fez backup local de uma ficha de personagem em JSON.',
    icon: '📜',
    type: 'milestone',
    hint: 'Exporte sua primeira ficha.',
    rarity: 'common',
    category: 'resources'
  },
  {
    id: 'app_collector',
    code: 'RECURSOS',
    title: 'Colecionador',
    description: 'Importou com sucesso uma ficha de personagem externa de um arquivo JSON.',
    icon: '📦',
    type: 'milestone',
    hint: 'Importe uma ficha.',
    rarity: 'common',
    category: 'resources'
  },

  // ─── CATEGORIA: DESAFIOS AVANÇADOS ─────────────────────────────────────────
  {
    id: 'challenge_no_luck',
    code: 'DESAFIOS',
    title: 'Sem Sorte',
    description: 'Concluiu uma aventura vitoriosa sem realizar nenhum teste de Sorte.',
    icon: '⚔️',
    type: 'milestone',
    hint: 'Conclua um livro sem utilizar Sorte.',
    rarity: 'epic',
    category: 'challenges'
  },
  {
    id: 'challenge_heroic_fast',
    code: 'DESAFIOS',
    title: 'Jejum Heroico',
    description: 'Concluiu uma aventura completa sem consumir nenhuma provisão.',
    icon: '🥖',
    type: 'milestone',
    hint: 'Conclua um livro sem consumir provisões.',
    rarity: 'epic',
    category: 'challenges'
  },
  {
    id: 'challenge_treasure_hunter',
    code: 'DESAFIOS',
    title: 'Caçador de Tesouros',
    description: 'Terminou uma aventura carregando mais de 15 itens diferentes em seu inventário.',
    icon: '💎',
    type: 'milestone',
    hint: 'Termine uma aventura carregando mais de 15 itens no inventário.',
    rarity: 'rare',
    category: 'challenges'
  },
  {
    id: 'challenge_strategist',
    code: 'DESAFIOS',
    title: 'Estrategista',
    description: 'Concluiu um livro-jogo completo sem fugir de nenhum combate contra monstros.',
    icon: '🧠',
    type: 'milestone',
    hint: 'Conclua um livro sem fugir de nenhum combate.',
    rarity: 'epic',
    category: 'challenges'
  },
  {
    id: 'milestone_first_death',
    code: 'DESAFIOS',
    title: 'Primeira Queda',
    description: 'Sofreu a sua primeira derrota (energia chegou a zero ou morte registrada).',
    icon: '💀',
    type: 'milestone',
    hint: 'Tenha sua energia reduzida a zero.',
    rarity: 'common',
    category: 'challenges'
  },
  {
    id: 'challenge_dead_again',
    code: 'DESAFIOS',
    title: 'Morto... Outra Vez',
    description: 'Sofreu 10 derrotas ou mortes de personagens no total acumulado.',
    icon: '☠️',
    type: 'milestone',
    hint: 'Morra 10 vezes.',
    rarity: 'common',
    category: 'challenges'
  },
  {
    id: 'challenge_persistent',
    code: 'DESAFIOS',
    title: 'Persistente',
    description: 'Sofreu 50 derrotas acumuladas (você realmente não desiste!).',
    icon: '☠️☠️☠️',
    type: 'milestone',
    hint: 'Morra 50 vezes.',
    rarity: 'uncommon',
    category: 'challenges'
  },
  {
    id: 'challenge_early_death',
    code: 'DESAFIOS',
    title: 'Eu Posso Explicar...',
    description: 'Morreu logo no parágrafo ou na primeira decisão da aventura.',
    icon: '😅',
    type: 'milestone',
    hint: 'Morra na primeira decisão do livro.',
    rarity: 'uncommon',
    category: 'challenges'
  },

  // ─── CATEGORIA: CONQUISTAS SECRETAS (SECRETS) ──────────────────────────────
  {
    id: 'secret_professional_loser',
    code: 'SEGRETO',
    title: 'Perdedor Profissional 🔒',
    description: 'Morreu em 3 aventuras seguidas sem nenhuma vitória entre elas.',
    icon: '👻',
    type: 'milestone',
    hint: 'Morrer em 3 aventuras seguidas.',
    rarity: 'rare',
    category: 'secret',
    isSecret: true
  },
  {
    id: 'secret_razors_edge',
    code: 'SEGRETO',
    title: 'Fio da Navalha 🔒',
    description: 'Sobreviveu a um combate ou concluiu o jogo com exatamente 1 de Energia e 1 de Sorte.',
    icon: '🩸',
    type: 'milestone',
    hint: 'Sobreviver ou vencer com 1 Energia e 1 Sorte.',
    rarity: 'legendary',
    category: 'secret',
    isSecret: true
  },
  {
    id: 'secret_perfect_saga',
    code: 'SEGRETO',
    title: 'Saga Perfeita 🔒',
    description: 'Iniciou a aventura rolando atributos iniciais perfeitos: 12 Habilidade, 24 Energia e 12 Sorte.',
    icon: '✨',
    type: 'milestone',
    hint: 'Tirar dados máximos em todos os atributos iniciais.',
    rarity: 'legendary',
    category: 'secret',
    isSecret: true
  },
  {
    id: 'secret_guild_loyal',
    code: 'SEGRETO',
    title: 'Fiel da Guilda 🔒',
    description: 'Acessou o aplicativo em 30 dias diferentes para continuar suas aventuras.',
    icon: '📅',
    type: 'milestone',
    hint: 'Abrir o app por 30 dias diferentes.',
    rarity: 'rare',
    category: 'secret',
    isSecret: true
  },
  {
    id: 'secret_music_appreciator',
    code: 'SEGRETO',
    title: 'Apreciador Musical 🔒',
    description: 'Escutou a trilha sonora de um livro-jogo por 5 minutos sem trocar de tela ou interromper.',
    icon: '🎵',
    type: 'milestone',
    hint: 'Escutar uma música completa sem trocar de tela.',
    rarity: 'uncommon',
    category: 'secret',
    isSecret: true
  },

  // ─── HALL DA FAMA (MÉTRICOS) ───────────────────────────────────────────────
  {
    id: 'hall_champion_allansia',
    code: 'HALL',
    title: 'Campeão de Allansia',
    description: 'Concluiu com sucesso 5 livros-jogos diferentes da coleção.',
    icon: '🏆',
    type: 'milestone',
    hint: 'Conclua 5 livros-jogo diferentes.',
    rarity: 'rare',
    category: 'hall_of_fame'
  },
  {
    id: 'hall_legend_adventures',
    code: 'HALL',
    title: 'Lenda das Aventuras Fantásticas',
    description: 'Concluiu com sucesso 10 livros-jogos diferentes da coleção.',
    icon: '🏆',
    type: 'milestone',
    hint: 'Conclua 10 livros-jogo diferentes.',
    rarity: 'legendary',
    category: 'hall_of_fame'
  },
  {
    id: 'combat_slayer_zagor',
    code: 'VILÃO',
    title: 'Morte ao Feiticeiro',
    description: 'Derrotou o temível feiticeiro Zagor em combate.',
    icon: '🧙‍♂️',
    type: 'milestone',
    hint: 'Derrote o feiticeiro Zagor em combate.',
    rarity: 'rare',
    category: 'combat'
  },
  {
    id: 'combat_slayer_balthus',
    code: 'VILÃO',
    title: 'Fim da Tirania',
    description: 'Derrotou Balthus Dire em combate na sua Cidadela.',
    icon: '🏰',
    type: 'milestone',
    hint: 'Derrote Balthus Dire em combate.',
    rarity: 'rare',
    category: 'combat'
  },
  {
    id: 'combat_slayer_zanbar',
    code: 'VILÃO',
    title: 'Cinzas ao Vento',
    description: 'Derrotou o Príncipe da Noite Zanbar Bone.',
    icon: '💀',
    type: 'milestone',
    hint: 'Derrote Zanbar Bone em combate.',
    rarity: 'rare',
    category: 'combat'
  },
  {
    id: 'combat_slayer_razaak',
    code: 'VILÃO',
    title: 'Purificação Ancestral',
    description: 'Destruiu o ressuscitado Necromante Razaak.',
    icon: '⚰️',
    type: 'milestone',
    hint: 'Derrote o Necromante Razaak em combate.',
    rarity: 'epic',
    category: 'combat'
  },
  {
    id: 'combat_slayer_heydrich',
    code: 'VILÃO',
    title: 'Estaca no Coração',
    description: 'Derrotou o Conde Reiner Heydrich em seu castelo.',
    icon: '🦇',
    type: 'milestone',
    hint: 'Derrote o Conde Reiner Heydrich em combate.',
    rarity: 'rare',
    category: 'combat'
  },
  {
    id: 'combat_slayer_agglax',
    code: 'VILÃO',
    title: 'Luz nas Sombras',
    description: 'Derrotou o Senhor das Sombras Agglax em Exércitos da Morte.',
    icon: '🛡️',
    type: 'milestone',
    hint: 'Derrote Agglax, o Senhor das Sombras, em combate.',
    rarity: 'rare',
    category: 'combat'
  },
  {
    id: 'combat_slayer_malbordus',
    code: 'VILÃO',
    title: 'Dragões Adormecidos',
    description: 'Impediu os planos do feiticeiro Malbordus no deserto.',
    icon: '🌋',
    type: 'milestone',
    hint: 'Derrote o feiticeiro Malbordus em combate.',
    rarity: 'rare',
    category: 'combat'
  },
  {
    id: 'combat_slayer_snow_witch',
    code: 'VILÃO',
    title: 'Degelo Gélido',
    description: 'Derrotou a Bruxa da Neve em seu reino de gelo.',
    icon: '❄️',
    type: 'milestone',
    hint: 'Derrote a Bruxa da Neve em combate.',
    rarity: 'rare',
    category: 'combat'
  },
  {
    id: 'combat_slayer_lizard_king',
    code: 'VILÃO',
    title: 'Reinado Extinto',
    description: 'Derrotou o tirânico Rei Lagarto.',
    icon: '🦎',
    type: 'milestone',
    hint: 'Derrote o Rei Lagarto em combate.',
    rarity: 'rare',
    category: 'combat'
  },
  {
    id: 'combat_slayer_archmage',
    code: 'VILÃO',
    title: 'Queda de Mampang',
    description: 'Derrotou o lendário Arqui-mago de Mampang.',
    icon: '👑',
    type: 'milestone',
    hint: 'Derrote o Arqui-mago de Mampang em combate.',
    rarity: 'epic',
    category: 'combat'
  },
  {
    id: 'combat_slayer_knox',
    code: 'VILÃO',
    title: 'Ordem Restaurada',
    description: 'Derrotou Sidney Knox, o líder do M.E.D.O. em Titan City.',
    icon: '🦸‍♂️',
    type: 'milestone',
    hint: 'Derrote Sidney Knox em combate.',
    rarity: 'rare',
    category: 'combat'
  },
  {
    id: 'combat_slayer_zera',
    code: 'VILÃO',
    title: 'Confronto no Asteróide',
    description: 'Derrotou o contrabandista intergaláctico Zera.',
    icon: '🌌',
    type: 'milestone',
    hint: 'Derrote Zera em combate.',
    rarity: 'rare',
    category: 'combat'
  },
  {
    id: 'combat_slayer_cadanca',
    code: 'VILÃO',
    title: 'Pirata Purificado',
    description: 'Derrotou o terrível pirata morto-vivo Capitão Cadança.',
    icon: '🏴‍☠️',
    type: 'milestone',
    hint: 'Derrote o Capitão Cadança em combate.',
    rarity: 'rare',
    category: 'combat'
  },
  {
    id: 'combat_slayer_dragon',
    code: 'COMBATE',
    title: 'Matador de Dragões',
    description: 'Venceu e derrotou um dragão ancestral em combate.',
    icon: '🐉',
    type: 'milestone',
    hint: 'Derrote qualquer criatura "Dragão" em combate.',
    rarity: 'epic',
    category: 'combat'
  },
  {
    id: 'combat_slayer_demon',
    code: 'COMBATE',
    title: 'Exorcista',
    description: 'Exilou um demônio em combate.',
    icon: '👹',
    type: 'milestone',
    hint: 'Derrote um "Demônio" em combate.',
    rarity: 'uncommon',
    category: 'combat'
  }
];

export function getAchievementIdForBook(bookName: string): string | undefined {
  return ACHIEVEMENTS.find(a => a.type === 'book' && a.bookName === bookName)?.id;
}
