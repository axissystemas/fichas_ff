import dynamic from 'next/dynamic';
import { GamebookRuleset } from './types';

const VampiroTracker = dynamic(() => import('@/components/VampiroTracker').then(mod => mod.VampiroTracker), { ssr: false });

export const vampiroRuleset: GamebookRuleset = {
  id: 'vampiro',
  displayName: 'A Cripta do Vampiro',
  hasSuggestions: true,
  attributes: [
    { key: 'skill', label: 'Habilidade', initialFormula: '1d6+6', type: 'primary', limitToInitial: true, deathCondition: 'none' },
    { key: 'energy', label: 'Energia', initialFormula: '2d6+12', type: 'primary', limitToInitial: true, deathCondition: 'min' },
    { key: 'luck', label: 'Sorte', initialFormula: '1d6+6', type: 'primary', limitToInitial: true, deathCondition: 'none' },
    { key: 'faith', label: 'Fé', initialFormula: '1d6+3', type: 'primary', limitToInitial: false, deathCondition: 'none' }
  ],
  creation: {
    rollAttributes: ['skill', 'energy', 'luck', 'faith']
  },
  mobileWidgets: [VampiroTracker],
  desktopSideWidgets: [VampiroTracker]
};
