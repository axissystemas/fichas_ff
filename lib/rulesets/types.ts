import React from 'react';

export interface AttributeConfig {
  key: string;
  label: string;
  initialFormula: string; // Ex: '1d6+6', '2d6+12', '1d6+6' ou '0' (se começar zerado)
  type: 'primary' | 'secondary'; // Atributos primários têm max/current inicial. Secundários começam com 0 ou valor estático.
  limitToInitial?: boolean; // Se o valor atual é limitado pelo valor inicial (ex: skill, energy, luck, fear)
  deathCondition?: 'min' | 'max' | 'none'; // Se morre ao atingir o mínimo (<= 0) ou máximo (>= inicial)
}

export interface ArchetypeOption {
  id: string;
  name: string;
  description: string;
  attributes: Record<string, number>; // Atributos fixos para esse arquétipo
  initialNotes?: string;
}

export interface PowerOption {
  id: string;
  name: string;
  description: string;
}

export interface CreationConfig {
  rollAttributes: string[]; // Quais atributos exigem rolagem de dados
  chooseArchetype?: {
    label: string;
    options: ArchetypeOption[];
  };
  choosePowers?: {
    label: string;
    maxSelection: number;
    options: PowerOption[];
  };
}

export interface TabConfig {
  id: string;
  label: string;
  iconName: string; // Ex: 'Swords', 'User', 'Backpack' correspondente às chaves do lucide-react
  component: React.ComponentType<any>;
}

export interface GamebookRuleset {
  id: string; // ID interno (ex: 'feiticeiro', 'mansao', 'traveller')
  displayName: string;
  hasSuggestions: boolean;
  attributes: AttributeConfig[];
  creation: CreationConfig;
  hideDefaultTabs?: string[]; // Ex: ['mochila'] se ocultar a mochila tradicional
  hideAttributeCards?: boolean; // Se verdadeiro, oculta a exibição padrão das AttributeCards (ex: no Traveller)
  mobileWidgets?: React.ComponentType<any>[]; // Widgets injetados no status mobile
  desktopWidgets?: React.ComponentType<any>[]; // Widgets injetados no status desktop
  desktopSideWidgets?: React.ComponentType<any>[]; // Widgets injetados ao lado do combate no desktop
}
