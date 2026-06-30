'use client';

import { motion } from 'motion/react';

interface DieProps {
  value: number;
  rolling: boolean;
  styleClass: string;
}

export const Die = ({ value, rolling, styleClass }: DieProps) => {
  return (
    <motion.div
      animate={rolling ? {
        rotateX: [0, 360, 720, 1080],
        rotateY: [0, 360, 720, 1080],
        scale: [1, 1.2, 0.9, 1.1, 1],
      } : { rotate: 0, scale: [0.8, 1.05, 1] }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className={`text-base sm:text-lg font-black flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 border-2 rounded-xl select-none transition-all ${styleClass}`}
      style={{ perspective: 400 }}
    >
      <span className="drop-shadow-sm">{value}</span>
    </motion.div>
  );
};

export const getDiceStyle = (theme: string, gamebook: string) => {
  const isPapyrus = theme === 'papyrus';
  if (gamebook === 'Nave Espacial Traveller') {
    return 'border-cyan-500 bg-slate-950 text-cyan-400 font-mono shadow-[0_0_10px_rgba(6,182,212,0.55)]';
  }
  if (gamebook === 'Encontro Marcado com o M.E.D.O.') {
    return 'border-yellow-400 bg-red-600 text-yellow-100 font-sans shadow-md transform rotate-3';
  }
  if (gamebook === 'A Floresta da Destruição') {
    return 'border-emerald-500 bg-emerald-950 text-emerald-300 font-serif shadow-[inset_0_0_8px_rgba(0,0,0,0.6)]';
  }
  return isPapyrus
    ? 'border-[#5C4033] bg-[#EAD8B8] text-[#2D1D16] font-serif shadow-inner'
    : 'border-slate-600 bg-slate-800 text-slate-100 font-sans shadow-md';
};
