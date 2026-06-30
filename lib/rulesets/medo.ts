import dynamic from 'next/dynamic';
import { GamebookRuleset } from './types';

const MedoTracker = dynamic(() => import('@/components/MedoTracker').then(mod => mod.MedoTracker), { ssr: false });

export const medoRuleset: GamebookRuleset = {
  id: 'medo',
  displayName: 'Encontro Marcado com o M.E.D.O.',
  hasSuggestions: true,
  attributes: [
    { key: 'skill', label: 'Habilidade', initialFormula: '1d6+6', type: 'primary', limitToInitial: true, deathCondition: 'none' },
    { key: 'energy', label: 'Energia', initialFormula: '2d6+12', type: 'primary', limitToInitial: true, deathCondition: 'min' },
    { key: 'luck', label: 'Sorte', initialFormula: '1d6+6', type: 'primary', limitToInitial: true, deathCondition: 'none' }
  ],
  creation: {
    rollAttributes: ['skill', 'energy', 'luck'],
    choosePowers: {
      label: 'Escolha seu Superpoder',
      maxSelection: 1,
      options: [
        { id: 'superforca', name: 'Superforça & Voo', description: 'Habilidade de lutar ampliada (Habilidade inicial trava em 13) e capacidade de voar para perseguições terrestres ou aéreas.' },
        { id: 'psi', name: 'Poderes Psi', description: 'Capacidade de ler mentes e mover objetos mentalmente. Cada uso consome 2 de Energia.' },
        { id: 'hta', name: 'Habilidade Tecnológica Avançada (HTA)', description: 'Diversos dispositivos de alta tecnologia em seu Cinto de Utilidades.' },
        { id: 'rajada', name: 'Rajada de Energia', description: 'Canalize energia eletrostática pelas mãos para tontear adversários humanos. Cada uso consome 2 de Energia.' }
      ]
    }
  },
  desktopWidgets: [MedoTracker]
};
