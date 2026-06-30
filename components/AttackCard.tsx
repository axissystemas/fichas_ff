'use client';

import { useSheetStore } from '@/store/useSheetStore';
import { motion } from 'motion/react';
import { useState } from 'react';
import { audio } from '@/lib/audio';
import { Die, getDiceStyle } from './Die';

interface AttackResult {
  id: string;
  adventurer: number;
  adventurerName: string;
  adventurerDice: number[];
  monster: number | null;
  monsterName: string | null;
  monsterDice: number[] | null;
}

export const AttackCard = () => {
  const [result, setResult] = useState<AttackResult | null>(null);
  const [rolling, setRolling] = useState(false);
  const [rollingDiceAdv, setRollingDiceAdv] = useState<number[]>([1, 1]);
  const [rollingDiceMonster, setRollingDiceMonster] = useState<number[]>([1, 1]);

  const { theme, gamebook, attributes } = useSheetStore();
  const isPapyrus = theme === 'papyrus';

  const cardClasses = isPapyrus 
    ? 'bg-[#FDF6E3] border-[#4A3728] text-[#2C1E14]' 
    : 'bg-[#1a202c] border-[#4a5568] text-[#cbd5e0]';

  const isTraveller = gamebook === 'Nave Espacial Traveller';
  const activeId = attributes.activeCombatantId || 'captain';
  const activeName = isTraveller
    ? activeId === 'ship'
      ? 'Traveller'
      : attributes.traveller?.crew?.[activeId]?.name || 'Capitão'
    : '';

  const rollAttack = () => {
    if (rolling) return;
    audio.playDiceRoll();
    setRolling(true);
    setResult(null);

    let rollsCount = 0;
    const rollInterval = setInterval(() => {
      setRollingDiceAdv([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ]);
      setRollingDiceMonster([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ]);
      rollsCount++;
    }, 70);

    setTimeout(() => {
      clearInterval(rollInterval);
      setRolling(false);

      const store = useSheetStore.getState();
      const isTrav = store.gamebook === 'Nave Espacial Traveller';
      const currentActiveId = store.attributes.activeCombatantId || 'captain';

      let skill = store.getModifiedAttribute('skill');
      let combatantName = 'Aventureiro';

      if (isTrav) {
        if (currentActiveId === 'ship') {
          skill = store.attributes.traveller?.ship?.firepower?.current ?? 0;
          combatantName = 'Astronave Traveller';
        } else {
          const member = store.attributes.traveller?.crew?.[currentActiveId];
          skill = member?.skill?.current ?? 0;
          combatantName = member?.name || 'Capitão';
        }
      }
      
      const d1_adv = Math.floor(Math.random() * 6) + 1;
      const d2_adv = Math.floor(Math.random() * 6) + 1;
      const advDiceTotal = d1_adv + d2_adv;
      const advTotal = advDiceTotal + skill;
      
      const aliveMonster = store.monsters.find(m => m.status === 'alive');

      if (aliveMonster) {
        const d1_mon = Math.floor(Math.random() * 6) + 1;
        const d2_mon = Math.floor(Math.random() * 6) + 1;
        const monsterDiceTotal = d1_mon + d2_mon;
        const monsterTotal = monsterDiceTotal + aliveMonster.skill;
        
        setResult({
          id: crypto.randomUUID(),
          adventurer: advTotal,
          adventurerName: combatantName,
          adventurerDice: [d1_adv, d2_adv],
          monster: monsterTotal,
          monsterName: aliveMonster.name,
          monsterDice: [d1_mon, d2_mon]
        });
        
        store.addCombatLog({ 
          type: 'Combate', 
          value: `${combatantName} (Rolou ${advDiceTotal} [🎲${d1_adv}+🎲${d2_adv}] + Hab ${skill} = ${advTotal}) vs ${aliveMonster.name} (Rolou ${monsterDiceTotal} [🎲${d1_mon}+🎲${d2_mon}] + Hab ${aliveMonster.skill} = ${monsterTotal})` 
        });

        if (advTotal > monsterTotal) {
          audio.playHit();
        } else if (monsterTotal > advTotal) {
          audio.playHurt();
        } else {
          audio.playBlip();
        }
      } else {
        setResult({
          id: crypto.randomUUID(),
          adventurer: advTotal,
          adventurerName: combatantName,
          adventurerDice: [d1_adv, d2_adv],
          monster: null,
          monsterName: null,
          monsterDice: null
        });
        store.addCombatLog({ type: 'Ataque', value: `${combatantName}: Rolou ${advDiceTotal} [🎲${d1_adv}+🎲${d2_adv}] + Hab ${skill} = ${advTotal}` });
        audio.playBlip();
      }
    }, 600);
  };

  return (
    <div className={`${cardClasses} border-2 p-4 shadow-[-5px_5px_0px_rgba(0,0,0,0.3)] gap-2 transition-colors flex flex-col items-center justify-between w-full h-full`}>
      <h3 className={`text-md font-bold uppercase text-center mb-2 border-b pb-1 w-full ${isPapyrus ? 'border-[#2C1E14]' : 'border-[#cbd5e0]'}`}>Ataque</h3>
      
      <button 
        onClick={rollAttack}
        disabled={rolling}
        className={`w-full py-2 px-1 uppercase font-bold text-xs sm:text-sm tracking-wider transition rounded cursor-pointer disabled:opacity-50 ${isPapyrus ? 'bg-[#2C1E14] text-[#C5A059] hover:bg-[#4A3728]' : 'bg-[#2d3748] text-[#cbd5e0] hover:bg-[#4a5568]'}`}
      >
        {rolling ? 'Rolando...' : 'Rolar Ataque'}
        {isTraveller && !rolling && <span className="block text-[10px] opacity-80 lowercase font-mono">({activeName})</span>}
      </button>

      {/* Visual Dice Row */}
      {(rolling || result) && (
        <div className="flex flex-col gap-2 w-full border-t border-dashed border-current/20 pt-3 mt-1">
          <div className="flex justify-between items-center text-xs opacity-95">
            <span className="font-bold flex items-center gap-1">🛡️ {result?.adventurerName || activeName || 'Você'}:</span>
            <div className="flex gap-1.5">
              <Die value={rolling ? rollingDiceAdv[0] : (result?.adventurerDice?.[0] ?? 1)} rolling={rolling} styleClass={getDiceStyle(theme, gamebook)} />
              <Die value={rolling ? rollingDiceAdv[1] : (result?.adventurerDice?.[1] ?? 1)} rolling={rolling} styleClass={getDiceStyle(theme, gamebook)} />
            </div>
          </div>
          
          {((rolling && useSheetStore.getState().monsters.some(m => m.status === 'alive')) || (result && result.monster !== null)) && (
            <div className="flex justify-between items-center text-xs opacity-95">
              <span className="font-bold flex items-center gap-1">😈 {result?.monsterName || 'Inimigo'}:</span>
              <div className="flex gap-1.5">
                <Die value={rolling ? rollingDiceMonster[0] : (result?.monsterDice?.[0] ?? 1)} rolling={rolling} styleClass={getDiceStyle(theme, gamebook)} />
                <Die value={rolling ? rollingDiceMonster[1] : (result?.monsterDice?.[1] ?? 1)} rolling={rolling} styleClass={getDiceStyle(theme, gamebook)} />
              </div>
            </div>
          )}
        </div>
      )}
      
      {!rolling && result !== null && (
        <motion.div 
          key={result.id}
          initial={{ opacity: 0, scale: 0.9, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-3 w-full flex flex-col gap-2 text-sm border-t border-dashed border-current/15 pt-2"
        >
          <div className={`flex justify-between items-center p-2 border-b ${isPapyrus ? 'border-[#5C4033]/20' : 'border-[#4a5568]/50'} ${result.monster !== null && result.adventurer > result.monster ? (isPapyrus ? 'bg-green-800/10' : 'bg-green-500/20') : ''}`}>
            <span className="font-bold truncate max-w-[130px]">{result.adventurerName}</span>
            <span className="text-2xl font-extrabold">{result.adventurer}</span>
          </div>

          {result.monster !== null && result.monsterName !== null && (
            <div className={`flex justify-between items-center p-2 border-b ${isPapyrus ? 'border-[#5C4033]/20' : 'border-[#4a5568]/50'} ${result.monster > result.adventurer ? (isPapyrus ? 'bg-red-800/10' : 'bg-red-500/20') : ''}`}>
              <span className="font-bold truncate max-w-[120px]">{result.monsterName}</span>
              <span className="text-2xl font-extrabold">{result.monster}</span>
            </div>
          )}

          {result.monster !== null && (
            <div className={`text-center font-bold mt-1 text-sm uppercase tracking-wider ${result.adventurer > result.monster ? 'text-green-600' : result.monster > result.adventurer ? 'text-red-600' : 'text-yellow-600'}`}>
              {result.adventurer > result.monster ? 'Você Acertou!' : result.monster > result.adventurer ? 'Você Levou Dano!' : 'Empate!'}
            </div>
          )}
          
          {result.monster === null && (
            <div className="text-center mt-1 opacity-70 text-xs italic">
              Nenhum monstro vivo em combate.
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
