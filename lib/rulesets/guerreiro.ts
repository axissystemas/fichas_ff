import dynamic from 'next/dynamic';
import { GamebookRuleset } from './types';

const GuerreiroTracker = dynamic(() => import('@/components/GuerreiroTracker').then(mod => mod.GuerreiroTracker), { ssr: false });

export const guerreiroRuleset: GamebookRuleset = {
  id: 'guerreiro',
  displayName: 'Guerreiro das Estradas',
  hasSuggestions: false,
  attributes: [
    { key: 'skill', label: 'Habilidade', initialFormula: '1d6+6', type: 'primary', limitToInitial: true, deathCondition: 'none' },
    { key: 'energy', label: 'Energia', initialFormula: '2d6+12', type: 'primary', limitToInitial: true, deathCondition: 'min' },
    { key: 'luck', label: 'Sorte', initialFormula: '1d6+6', type: 'primary', limitToInitial: true, deathCondition: 'none' }
  ],
  creation: {
    rollAttributes: ['skill', 'energy', 'luck']
  },
  mobileWidgets: [GuerreiroTracker],
  desktopWidgets: [GuerreiroTracker]
};
