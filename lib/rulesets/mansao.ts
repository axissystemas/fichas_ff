import { GamebookRuleset } from './types';

export const mansaoRuleset: GamebookRuleset = {
  id: 'mansao',
  displayName: 'A Mansão do Inferno',
  hasSuggestions: true,
  attributes: [
    { key: 'skill', label: 'Habilidade', initialFormula: '1d6+6', type: 'primary', limitToInitial: true, deathCondition: 'none' },
    { key: 'energy', label: 'Energia', initialFormula: '2d6+12', type: 'primary', limitToInitial: true, deathCondition: 'min' },
    { key: 'luck', label: 'Sorte', initialFormula: '1d6+6', type: 'primary', limitToInitial: true, deathCondition: 'none' },
    { key: 'fear', label: 'Medo', initialFormula: '1d6+6', type: 'secondary', limitToInitial: false, deathCondition: 'max' }
  ],
  creation: {
    rollAttributes: ['skill', 'energy', 'luck', 'fear']
  }
};
