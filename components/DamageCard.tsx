'use client';
import { useState } from 'react';
import { motion } from 'motion/react';
import { useSheetStore } from '@/store/useSheetStore';
import { audio } from '@/lib/audio';

const WANDERING_MONSTERS: Record<number, { name: string; skill: number; energy: number }> = {
  1: { name: 'Goblin', skill: 5, energy: 3 },
  2: { name: 'Orc', skill: 6, energy: 3 },
  3: { name: 'Gremlin', skill: 6, energy: 4 },
  4: { name: 'Rato Gigante', skill: 5, energy: 4 },
  5: { name: 'Esqueleto', skill: 6, energy: 5 },
  6: { name: 'Troll', skill: 8, energy: 4 },
};

export const DamageCard = () => {
  const { theme, gamebook, attributes, setAttribute, inventory, monsters, addMonster } = useSheetStore();
  const cardClasses = theme === 'papyrus' 
    ? 'bg-[#FDF6E3] border-[#4A3728] text-[#2C1E14]' 
    : 'bg-[#1a202c] border-[#4a5568] text-[#cbd5e0]';

  const isTraveller = gamebook === 'Nave Espacial Traveller';
  const activeId = attributes.activeCombatantId || 'captain';
  const aliveMonster = monsters.find(m => m.status === 'alive');

  const [wanderingResult, setWanderingResult] = useState<{
    roll: number;
    monster: { name: string; skill: number; energy: number };
  } | null>(null);

  const handleRollWanderingMonster = () => {
    audio.playDiceRoll();
    const roll = Math.floor(Math.random() * 6) + 1;
    const monster = WANDERING_MONSTERS[roll];
    setWanderingResult({ roll, monster });
  };

  const handleConfirmWanderingMonster = () => {
    if (!wanderingResult) return;
    audio.playBlip();
    addMonster({
      id: crypto.randomUUID(),
      name: wanderingResult.monster.name,
      skill: wanderingResult.monster.skill,
      energyMax: wanderingResult.monster.energy,
      energyCurrent: wanderingResult.monster.energy,
      status: 'alive'
    });
    setWanderingResult(null);
  };

  // Calculate damage reduction from equipped gear
  const maxReduction = inventory
    .filter(item => item.equipped && item.quantity > 0)
    .reduce((max, item) => {
      let reduction = item.modifiers?.damageReduction || 0;
      if (item.name.toLowerCase().includes('escudo') && reduction === 0) {
        reduction = 1; // Default reduction is 1 for items with "escudo" in their name
      }
      return Math.max(max, reduction);
    }, 0);

  const baseDamage = 2;
  const finalDamage = Math.max(1, baseDamage - maxReduction);
  const hasReduction = finalDamage < baseDamage;

  const activeName = isTraveller
    ? activeId === 'ship'
      ? 'Traveller'
      : attributes.traveller?.crew?.[activeId]?.name || 'Capitão'
    : '';

  const unitLabel = isTraveller && activeId === 'ship' ? 'Escudos' : 'Energia';

  const handleApplyDamage = () => {
    audio.playHurt();
    const store = useSheetStore.getState();
    if (isTraveller) {
      if (activeId === 'ship') {
        const currentShields = store.attributes.traveller?.ship?.shields?.current ?? 0;
        store.updateTravellerShipAttribute('shields', Math.max(0, currentShields - finalDamage), false);
        store.addCombatLog({ type: 'Dano', value: `-${finalDamage} Escudos (Astronave Traveller)` });
      } else {
        const crewMember = store.attributes.traveller?.crew?.[activeId];
        const currentEnergy = crewMember?.energy?.current ?? 0;
        store.updateTravellerCrewAttribute(activeId, 'energy', Math.max(0, currentEnergy - finalDamage), false);
        store.addCombatLog({ type: 'Dano', value: `-${finalDamage} Ener (${crewMember?.name || activeId})` });
      }
    } else {
      setAttribute('energy', Math.max(0, attributes.energy.current - finalDamage), false);
      store.addCombatLog({ type: 'Dano', value: `-${finalDamage} Ener` });
    }
  };

  const handleApplyMonsterDamage = () => {
    const store = useSheetStore.getState();
    const targetMonster = store.monsters.find(m => m.status === 'alive');
    if (!targetMonster) return;

    const nextEnergy = Math.max(0, targetMonster.energyCurrent - 2);
    if (nextEnergy === 0 && targetMonster.energyCurrent > 0) {
      audio.playSuccess();
    } else {
      audio.playHit();
    }
    store.updateMonsterEnergy(targetMonster.id, -2);
    store.addCombatLog({ type: 'Dano', value: `-2 Ener (${targetMonster.name})` });
  };

  return (
    <div className={`${cardClasses} border-2 p-4 shadow-[-5px_5px_0px_rgba(0,0,0,0.3)] transition-colors flex flex-col items-center justify-between w-full h-full`}>
      <h3 className={`text-md font-bold uppercase text-center mb-2 border-b pb-1 w-full ${theme === 'papyrus' ? 'border-[#2C1E14]' : 'border-[#cbd5e0]'}`}>Combate</h3>
      
      {wanderingResult && gamebook === 'O Feiticeiro da Montanha de Fogo' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full mb-3 p-3 bg-[#FDF6E3] border-2 border-[#5C4033] rounded-lg shadow-md text-[#2C1E14]"
        >
          <div className="flex justify-between items-center border-b border-[#5C4033]/30 pb-1.5 mb-2">
            <span className="font-extrabold uppercase text-xs tracking-wide text-[#5C4033] flex items-center gap-1">
              🎲 Monstro Errante!
            </span>
            <button 
              onClick={() => setWanderingResult(null)}
              className="text-[10px] text-red-700 hover:underline font-bold uppercase"
            >
              Cancelar
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs mb-2 bg-[#EAD8B8]/60 p-2 rounded border border-[#5C4033]/20 text-center">
            <div className="flex flex-col items-center justify-center p-1 bg-[#EAD8B8] rounded border border-[#5C4033]/20">
              <span className="text-[9px] uppercase font-bold text-[#5C4033]">Dado</span>
              <span className="text-base font-black text-amber-900">🎲 {wanderingResult.roll}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-1 bg-[#EAD8B8] rounded border border-[#5C4033]/20">
              <span className="text-[9px] uppercase font-bold text-[#5C4033]">Monstro</span>
              <span className="text-xs font-extrabold text-[#2C1E14]">{wanderingResult.monster.name}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-1 bg-[#EAD8B8] rounded border border-[#5C4033]/20">
              <span className="text-[9px] uppercase font-bold text-[#5C4033]">Hab</span>
              <span className="text-xs font-extrabold text-[#2C1E14]">{wanderingResult.monster.skill}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-1 bg-[#EAD8B8] rounded border border-[#5C4033]/20">
              <span className="text-[9px] uppercase font-bold text-[#5C4033]">Energia</span>
              <span className="text-xs font-extrabold text-[#2C1E14]">{wanderingResult.monster.energy}</span>
            </div>
          </div>
          <button
            onClick={handleConfirmWanderingMonster}
            className="w-full bg-[#2C1E14] text-[#EAD8B8] py-2 px-3 uppercase font-bold text-xs tracking-wider hover:bg-[#4A3728] transition-colors rounded shadow"
          >
            ⚔️ Adicionar ao Combate
          </button>
        </motion.div>
      )}

      <div className="flex flex-col gap-2 w-full">
        {gamebook === 'O Feiticeiro da Montanha de Fogo' && (
          <button
            onClick={handleRollWanderingMonster}
            className={`w-full py-2 px-1 uppercase font-bold text-xs sm:text-sm tracking-wider transition rounded cursor-pointer ${
              theme === 'papyrus'
                ? 'bg-[#5C4033] text-[#EAD8B8] hover:bg-[#2C1E14]'
                : 'bg-[#4a5568] text-[#cbd5e0] hover:bg-[#2d3748]'
            }`}
          >
            🎲 Monstro Errante
          </button>
        )}

        <button 
          onClick={handleApplyMonsterDamage}
          disabled={!aliveMonster}
          className={`w-full py-2 px-1 uppercase font-bold text-xs sm:text-sm tracking-wider transition rounded cursor-pointer ${
            !aliveMonster 
              ? 'opacity-40 cursor-not-allowed bg-gray-600 text-gray-300' 
              : theme === 'papyrus' 
                ? 'bg-[#8B0000] text-[#EAD8B8] hover:bg-[#600000]' 
                : 'bg-[#9b2c2c] text-[#cbd5e0] hover:bg-[#742a2a]'
          }`}
        >
          Dano no Monstro (-2 Ener)
          {aliveMonster && <span className="block text-[10px] opacity-80 lowercase font-mono">({aliveMonster.name})</span>}
        </button>

        <button 
          onClick={handleApplyDamage}
          className={`w-full py-2 px-1 uppercase font-bold text-xs sm:text-sm tracking-wider transition rounded cursor-pointer ${theme === 'papyrus' ? 'bg-[#8B0000] text-[#EAD8B8] hover:bg-[#600000]' : 'bg-[#9b2c2c] text-[#cbd5e0] hover:bg-[#742a2a]'}`}
        >
          Dano no Herói (-{finalDamage} {unitLabel}) {hasReduction && '🛡️'}
          {isTraveller && <span className="block text-[10px] opacity-80 lowercase font-mono">({activeName})</span>}
        </button>
      </div>
    </div>
  );
};


