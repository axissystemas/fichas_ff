import { GamebookRuleset } from './types';
import { defaultRuleset } from './default';
import { mansaoRuleset } from './mansao';
import { medoRuleset } from './medo';
import { travellerRuleset } from './traveller';
import { zagorRuleset } from './zagor';
import { cidadelaRuleset } from './cidadela';
import { vampiroRuleset } from './vampiro';
import { exercitosRuleset } from './exercitos';
import { ladraoRuleset } from './ladrao';
import { guerreiroRuleset } from './guerreiro';

const RULESET_MAP: Record<string, GamebookRuleset> = {
  'A Mansão do Inferno': mansaoRuleset,
  'Nave Espacial Traveller': travellerRuleset,
  'A Lenda de Zagor': zagorRuleset,
  'Encontro Marcado com o M.E.D.O.': medoRuleset,
  'A Cidadela do Caos': cidadelaRuleset,
  'A Cripta do Vampiro': vampiroRuleset,
  'Exércitos da Morte': exercitosRuleset,
  'Ladrão da Meia-Noite': ladraoRuleset,
  'Guerreiro das Estradas': guerreiroRuleset
};

export function getRuleset(gamebook: string | undefined): GamebookRuleset {
  if (!gamebook) return defaultRuleset;
  return RULESET_MAP[gamebook] || defaultRuleset;
}

export * from './types';
export * from './default';
export * from './mansao';
export * from './medo';
export * from './traveller';
export * from './zagor';
export * from './cidadela';
export * from './vampiro';
export * from './exercitos';
export * from './ladrao';
export * from './guerreiro';
