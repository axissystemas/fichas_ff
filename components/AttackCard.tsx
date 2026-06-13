'use client';
import { useSheetStore } from '@/store/useSheetStore';
import { motion } from 'motion/react';
import { useState } from 'react';
import { audio } from '@/lib/audio';

interface AttackResult {
  id: string;
  adventurer: number;
  monster: number | null;
  monsterName: string | null;
}

export const AttackCard = () => {
  const [result, setResult] = useState<AttackResult | null>(null);
  const { theme } = useSheetStore();
  const cardClasses = theme === 'papyrus' 
    ? 'bg-[#FDF6E3] border-[#4A3728] text-[#2C1E14]' 
    : 'bg-[#1a202c] border-[#4a5568] text-[#cbd5e0]';

  const rollAttack = () => {
    audio.playDiceRoll();
    const store = useSheetStore.getState();
    const skill = store.attributes.skill.current;
    
    // 2d6 para aventureiro
    const advDice = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
    const advTotal = advDice + skill;
    
    const aliveMonster = store.monsters.find(m => m.status === 'alive');

    if (aliveMonster) {
      // 2d6 para monstro
      const monsterDice = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
      const monsterTotal = monsterDice + aliveMonster.skill;
      
      setResult({
        id: crypto.randomUUID(),
        adventurer: advTotal,
        monster: monsterTotal,
        monsterName: aliveMonster.name
      });
      
      store.addCombatLog({ 
        type: 'Combate', 
        value: `Aventureiro (${advTotal}) vs ${aliveMonster.name} (${monsterTotal})` 
      });

      // Play appropriate sound effect with delay to follow dice roll sound
      setTimeout(() => {
        if (advTotal > monsterTotal) {
          audio.playHit();
        } else if (monsterTotal > advTotal) {
          audio.playHurt();
        } else {
          audio.playBlip();
        }
      }, 280);
    } else {
      setResult({
        id: crypto.randomUUID(),
        adventurer: advTotal,
        monster: null,
        monsterName: null
      });
      store.addCombatLog({ type: 'Ataque', value: advTotal.toString() });
    }
  };

  const isPapyrus = theme === 'papyrus';

  return (
    <div className={`${cardClasses} border-2 p-4 shadow-[-5px_5px_0px_rgba(0,0,0,0.3)] gap-2 transition-colors flex flex-col items-center`}>
      <h3 className={`text-md font-bold uppercase text-center mb-2 border-b pb-1 w-full ${isPapyrus ? 'border-[#2C1E14]' : 'border-[#cbd5e0]'}`}>Ataque</h3>
      <button 
        onClick={rollAttack}
        className={`w-full py-2 uppercase font-bold text-sm tracking-widest transition ${isPapyrus ? 'bg-[#2C1E14] text-[#C5A059] hover:bg-[#4A3728]' : 'bg-[#2d3748] text-[#cbd5e0] hover:bg-[#4a5568]'}`}
      >
        Rolar Ataque
      </button>
      
      {result !== null && (
        <motion.div 
          key={result.id}
          initial={{ opacity: 0, scale: 0.9, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 w-full flex flex-col gap-2 text-sm"
        >
          <div className={`flex justify-between items-center p-2 border-b ${isPapyrus ? 'border-[#5C4033]/20' : 'border-[#4a5568]/50'} ${result.monster !== null && result.adventurer > result.monster ? (isPapyrus ? 'bg-green-800/10' : 'bg-green-500/20') : ''}`}>
            <span className="font-bold">Aventureiro</span>
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
