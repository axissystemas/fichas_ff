import dynamic from 'next/dynamic';
import { GamebookRuleset } from './types';

const ExercitosTracker = dynamic(() => import('@/components/ExercitosTracker').then(mod => mod.ExercitosTracker), { ssr: false });

export const exercitosRuleset: GamebookRuleset = {
  id: 'exercitos',
  displayName: 'Exércitos da Morte',
  hasSuggestions: true,
  attributes: [
    { key: 'skill', label: 'Habilidade', initialFormula: '1d6+6', type: 'primary', limitToInitial: true, deathCondition: 'none' },
    { key: 'energy', label: 'Energia', initialFormula: '2d6+12', type: 'primary', limitToInitial: true, deathCondition: 'min' },
    { key: 'luck', label: 'Sorte', initialFormula: '1d6+6', type: 'primary', limitToInitial: true, deathCondition: 'none' }
  ],
  creation: {
    rollAttributes: ['skill', 'energy', 'luck']
  },
  mobileWidgets: [ExercitosTracker],
  desktopSideWidgets: [ExercitosTracker]
};
