'use client';
import { useState } from 'react';
import { motion } from 'motion/react';
import { useSheetStore } from '@/store/useSheetStore';

export const DiceRoller = () => {
  const [result, setResult] = useState<number | null>(null);
  const [outcome, setOutcome] = useState<string>('');
  const { theme } = useSheetStore();

  const rollAttack = () => {
    const skill = useSheetStore.getState().attributes.skill.current;
    const dice = Math.floor(Math.random() * 6) + 1;
    setResult(dice + skill);
    setOutcome('');
  };

  const testLuck = () => {
    const luck = useSheetStore.getState().attributes.luck.current;
    if (luck <= 0) return;

    const dice = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
    const success = dice <= luck;
    
    useSheetStore.getState().setAttribute('luck', Math.max(0, luck - 1), false);
    
    setResult(dice);
    setOutcome(success ? 'Sucesso' : 'Falha');
  };

  return (
    <div className={`flex flex-col items-center border-2 p-4 shadow-[-5px_5px_0px_rgba(0,0,0,0.3)] gap-2 transition-colors ${theme === 'papyrus' ? 'bg-[#FDF6E3] border-[#4A3728]' : 'bg-[#1a202c] border-[#4a5568]'}`}>
      <button 
        onClick={rollAttack}
        className={`w-full py-2 uppercase font-bold text-sm tracking-widest transition ${theme === 'papyrus' ? 'bg-[#2C1E14] text-[#C5A059] hover:bg-[#4A3728]' : 'bg-[#2d3748] text-[#cbd5e0] hover:bg-[#4a5568]'}`}
      >
        Ataque
      </button>
      <div className="h-2"></div>
      <button 
        onClick={testLuck}
        className={`w-full py-2 uppercase font-bold text-sm tracking-widest transition ${theme === 'papyrus' ? 'bg-[#5C4033] text-[#EAD8B8] hover:bg-[#2C1E14]' : 'bg-[#2d3748] text-[#cbd5e0] hover:bg-[#4a5568]'}`}
      >
        Testar Sorte
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
      {outcome && (
        <div className={`mt-1 font-bold ${theme === 'papyrus' ? (outcome === 'Sucesso' ? 'text-green-800' : 'text-red-800') : (outcome === 'Sucesso' ? 'text-green-400' : 'text-red-400')}`}>
          {outcome}
        </div>
      )}
    </div>
  );
};
