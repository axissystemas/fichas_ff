import dynamic from 'next/dynamic';
import { GamebookRuleset } from './types';

const LadraoTracker = dynamic(() => import('@/components/LadraoTracker').then(mod => mod.LadraoTracker), { ssr: false });

export const ladraoRuleset: GamebookRuleset = {
  id: 'ladrao',
  displayName: 'Ladrão da Meia-Noite',
  hasSuggestions: false,
  attributes: [
    { key: 'skill', label: 'Habilidade', initialFormula: '1d6+6', type: 'primary', limitToInitial: true, deathCondition: 'none' },
    { key: 'energy', label: 'Energia', initialFormula: '2d6+12', type: 'primary', limitToInitial: true, deathCondition: 'min' },
    { key: 'luck', label: 'Sorte', initialFormula: '1d6+6', type: 'primary', limitToInitial: true, deathCondition: 'none' }
  ],
  creation: {
    rollAttributes: ['skill', 'energy', 'luck'],
    chooseSkills: {
      label: 'Proficiências Especiais da Guilda',
      description: 'Assim como sua Habilidade, Energia e Sorte, você possui três proficiências especiais adquiridas ao longo de seu treinamento como aprendiz da Guilda dos Ladrões. Escolha 3 das 7 opções abaixo:',
      maxSelection: 3,
      options: [
        {
          id: 'maos_leves',
          name: 'Mãos Leves',
          description: 'Subtrair itens de bolsas, bolsos de transeuntes e pequenos truques de prestidigitação sem ser notado.',
          iconName: 'Coins'
        },
        {
          id: 'destrancar_fechaduras',
          name: 'Destrancar Fechaduras',
          description: 'Uso especializado de gazuas para abrir portas trancadas, grades, cadeados e fechaduras de baús.',
          iconName: 'KeyRound'
        },
        {
          id: 'escalar',
          name: 'Escalar',
          description: 'Destreza e agilidade física para galgar muros altos, paredes de pedra irregulares e telhados com segurança.',
          iconName: 'Footprints'
        },
        {
          id: 'esgueirar',
          name: 'Esgueirar',
          description: 'Mover-se pelas sombras e assoalhos rangentes em silêncio absoluto, passando despercebido por guardas.',
          iconName: 'Wind'
        },
        {
          id: 'esconder_se',
          name: 'Esconder-se',
          description: 'Camuflar-se no ambiente e aproveitar a penumbra para se tornar praticamente invisível aos olhos alheios.',
          iconName: 'EyeOff'
        },
        {
          id: 'encontrar',
          name: 'Encontrar',
          description: 'Olhar aguçado para inspecionar aposentos, notar passagens secretas, pisos ocos e armadilhas ocultas.',
          iconName: 'Search'
        },
        {
          id: 'sinais_secretos',
          name: 'Sinais Secretos',
          description: 'Conhecimento das marcas misteriosas, símbolos de giz, gírias e códigos criptografados da Guilda dos Ladrões.',
          iconName: 'Sparkles'
        }
      ]
    }
  },
  mobileWidgets: [LadraoTracker],
  desktopWidgets: [LadraoTracker]
};
