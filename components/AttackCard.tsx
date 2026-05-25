'use client';
import { useSheetStore } from '@/store/useSheetStore';
import { motion } from 'motion/react';
import { useState } from 'react';

export const AttackCard = () => {
  const [result, setResult] = useState<number | null>(null);
  const { theme } = useSheetStore();
  const cardClasses = theme === 'papyrus' 
    ? 'bg-[#FDF6E3] border-[#4A3728] text-[#2C1E14]' 
    : 'bg-[#1a202c] border-[#4a5568] text-[#cbd5e0]';

  const rollAttack = () => {
    const skill = useSheetStore.getState().attributes.skill.current;
    const dice = Math.floor(Math.random() * 6) + 1;
    const total = dice + skill;
    setResult(total);
    useSheetStore.getState().addCombatLog({ type: 'Ataque', value: total.toString() });
  };

  return (
    <div className={`${cardClasses} border-2 p-4 shadow-[-5px_5px_0px_rgba(0,0,0,0.3)] gap-2 transition-colors flex flex-col items-center`}>
      <h3 className={`text-md font-bold uppercase text-center mb-2 border-b pb-1 w-full ${theme === 'papyrus' ? 'border-[#2C1E14]' : 'border-[#cbd5e0]'}`}>Ataque</h3>
      <button 
        onClick={rollAttack}
        className={`w-full py-2 uppercase font-bold text-sm tracking-widest transition ${theme === 'papyrus' ? 'bg-[#2C1E14] text-[#C5A059] hover:bg-[#4A3728]' : 'bg-[#2d3748] text-[#cbd5e0] hover:bg-[#4a5568]'}`}
      >
        Rolar Ataque
      </button>
      {result !== null && (
        <motion.div 
          key={result}
          initial={{ opacity: 0, scale: 0.5, x: 0 }}
          animate={{ opacity: 1, scale: 1, x: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 0.4 }}
          className={`text-4xl font-bold mt-2 ${theme === 'papyrus' ? 'text-[#2C1E14]' : 'text-[#cbd5e0]'}`}
        >
          {result}
        </motion.div>
      )}
    </div>
  );
};
