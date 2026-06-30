import dynamic from 'next/dynamic';
import { GamebookRuleset } from './types';

const TravellerTracker = dynamic(() => import('@/components/TravellerTracker').then(mod => mod.TravellerTracker), { ssr: false });
const TravellerOfficialSheet = dynamic(() => import('@/components/TravellerOfficialSheet').then(mod => mod.TravellerOfficialSheet), { ssr: false });

export const travellerRuleset: GamebookRuleset = {
  id: 'traveller',
  displayName: 'Nave Espacial Traveller',
  hasSuggestions: false,
  attributes: [
    { key: 'skill', label: 'Habilidade', initialFormula: '1d6+6', type: 'primary', limitToInitial: true, deathCondition: 'none' },
    { key: 'energy', label: 'Energia', initialFormula: '2d6+12', type: 'primary', limitToInitial: true, deathCondition: 'min' },
    { key: 'luck', label: 'Sorte', initialFormula: '1d6+6', type: 'primary', limitToInitial: true, deathCondition: 'none' }
  ],
  creation: {
    rollAttributes: ['skill', 'energy', 'luck']
  },
  hideDefaultTabs: ['Inventário'],
  hideAttributeCards: true,
  mobileWidgets: [TravellerTracker],
  desktopWidgets: [TravellerOfficialSheet]
};
