import React from 'react';
import dynamic from 'next/dynamic';
import { GamebookRuleset } from './types';
import { useSheetStore } from '@/store/useSheetStore';

const GrimorioAmarilleo = dynamic(() => import('@/components/GrimorioAmarilleo').then(mod => mod.GrimorioAmarilleo), { ssr: false });

const ZagorGrimorioWidget = () => {
  const selectedHero = useSheetStore(state => state.attributes.selectedHero);
  if (selectedHero !== 'sallazar') return null;
  return React.createElement(GrimorioAmarilleo);
};

export const zagorRuleset: GamebookRuleset = {
  id: 'zagor',
  displayName: 'A Lenda de Zagor',
  hasSuggestions: true,
  attributes: [
    { key: 'skill', label: 'Habilidade', initialFormula: '1d6+6', type: 'primary', limitToInitial: true, deathCondition: 'none' },
    { key: 'energy', label: 'Energia', initialFormula: '2d6+12', type: 'primary', limitToInitial: true, deathCondition: 'min' },
    { key: 'luck', label: 'Sorte', initialFormula: '1d6+6', type: 'primary', limitToInitial: true, deathCondition: 'none' },
    { key: 'willpower', label: 'Força de Vontade', initialFormula: '1d6+6', type: 'primary', limitToInitial: true, deathCondition: 'none' }
  ],
  creation: {
    rollAttributes: ['skill', 'energy', 'luck', 'willpower'],
    chooseArchetype: {
      label: 'Escolha seu Herói',
      options: [
        {
          id: 'anvar',
          name: 'Bárbaro (Anvar)',
          description: 'Forte e destemido. Começa com Habilidade 10, Energia 22, Sorte 10 e Força de Vontade 10.',
          attributes: { skill: 10, energy: 22, luck: 10, willpower: 10 }
        },
        {
          id: 'braxus',
          name: 'Guerreiro (Braxus)',
          description: 'Mestre das armas. Começa com Habilidade 11, Energia 20, Sorte 9 e Força de Vontade 11.',
          attributes: { skill: 11, energy: 20, luck: 9, willpower: 11 }
        },
        {
          id: 'restolho',
          name: 'Anão (Restolho)',
          description: 'Resistente e sortudo. Começa com Habilidade 9, Energia 24, Sorte 11 e Força de Vontade 10.',
          attributes: { skill: 9, energy: 24, luck: 11, willpower: 10 }
        },
        {
          id: 'sallazar',
          name: 'Mago (Sallazar)',
          description: 'Mestre das artes arcanas. Começa com Habilidade 7, Energia 16, Sorte 8 e Pontos de Magia 14.',
          attributes: { skill: 7, energy: 16, luck: 8, willpower: 14 }
        }
      ]
    }
  },
  mobileWidgets: [ZagorGrimorioWidget],
  desktopWidgets: [ZagorGrimorioWidget]
};
