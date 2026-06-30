import dynamic from 'next/dynamic';
import { GamebookRuleset } from './types';

const CidadelaTracker = dynamic(() => import('@/components/CidadelaTracker').then(mod => mod.CidadelaTracker), { ssr: false });

export const cidadelaRuleset: GamebookRuleset = {
  id: 'cidadela',
  displayName: 'A Cidadela do Caos',
  hasSuggestions: true,
  attributes: [
    { key: 'skill', label: 'Habilidade', initialFormula: '1d6+6', type: 'primary', limitToInitial: true, deathCondition: 'none' },
    { key: 'energy', label: 'Energia', initialFormula: '2d6+12', type: 'primary', limitToInitial: true, deathCondition: 'min' },
    { key: 'luck', label: 'Sorte', initialFormula: '1d6+6', type: 'primary', limitToInitial: true, deathCondition: 'none' },
    { key: 'magic', label: 'Mágica', initialFormula: '2d6+6', type: 'primary', limitToInitial: true, deathCondition: 'none' }
  ],
  creation: {
    rollAttributes: ['skill', 'energy', 'luck', 'magic']
  },
  mobileWidgets: [CidadelaTracker],
  desktopWidgets: [CidadelaTracker]
};
