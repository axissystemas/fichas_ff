'use client';

import { useSheetStore } from '@/store/useSheetStore';
import { RefreshCw } from 'lucide-react';
import { audio } from '@/lib/audio';
import { useState } from 'react';
import { Die, getDiceStyle } from './Die';

interface Props {
  label: string;
  attrKey: 'skill' | 'energy' | 'luck' | 'magic' | 'faith' | 'fear' | 'willpower';
}

export const AttributeCard = ({ label, attrKey }: Props) => {
  const { attributes, setAttribute, theme, gamebook, getModifiedAttribute } = useSheetStore();
  const attr = attributes[attrKey] || { initial: 0, current: 0 };
  const isMedo = gamebook === 'Encontro Marcado com o M.E.D.O.';
  const superpower = attributes.superpower;

  const modifiedCurrent = getModifiedAttribute(attrKey);
  const modifier = modifiedCurrent - attr.current;

  const isEnergyLow = attrKey === 'energy' && modifiedCurrent > 0 && modifiedCurrent <= 4;
  const isFearHigh = attrKey === 'fear' && attr.initial > 0 && modifiedCurrent > 0 && modifiedCurrent >= attr.initial - 2;
  const isAlert = isEnergyLow || isFearHigh;

  const [rolling, setRolling] = useState(false);
  const [rollingDice, setRollingDice] = useState<number[]>([1]);

  const cardClasses = theme === 'papyrus' 
    ? `bg-[#FDF6E3] border-[#4A3728] text-[#2C1E14] ${isAlert ? 'animate-pulse ring-2 ring-red-700/80 border-red-700 shadow-[0_0_15px_rgba(220,38,38,0.5)]' : ''}` 
    : `bg-[#1a202c] border-[#4a5568] text-[#cbd5e0] ${isAlert ? 'animate-pulse ring-2 ring-red-500/80 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)]' : ''}`;

  const rollInitial = () => {
    if (isMedo && attrKey === 'skill' && superpower === 'superforca') {
      setAttribute('skill', 13, true);
      setAttribute('skill', 13, false);
      return;
    }
    if (rolling) return;

    audio.playDiceRoll();
    setRolling(true);

    const isTwoDice = attrKey === 'energy' || (gamebook === 'A Cidadela do Caos' && attrKey === 'magic');
    const numDice = isTwoDice ? 2 : 1;

    let rolls = 0;
    const interval = setInterval(() => {
      const temp = [];
      for (let i = 0; i < numDice; i++) {
        temp.push(Math.floor(Math.random() * 6) + 1);
      }
      setRollingDice(temp);
      rolls++;
    }, 70);

    setTimeout(() => {
      clearInterval(interval);
      setRolling(false);

      const d1 = Math.floor(Math.random() * 6) + 1;
      let rollResult = 0;

      if (attrKey === 'energy') {
        const d2 = Math.floor(Math.random() * 6) + 1;
        rollResult = d1 + d2 + 12;
      } else if (gamebook === 'A Cidadela do Caos' && attrKey === 'magic') {
        const d2 = Math.floor(Math.random() * 6) + 1;
        rollResult = d1 + d2 + 6;
      } else if (gamebook === 'A Cripta do Vampiro' && attrKey === 'faith') {
        rollResult = d1 + 3;
      } else if (gamebook === 'A Mansão do Inferno' && attrKey === 'fear') {
        rollResult = d1 + 6;
      } else if (gamebook === 'A Lenda de Zagor' && attrKey === 'willpower') {
        rollResult = d1 + 6;
      } else {
        rollResult = d1 + 6; // Habilidade e Sorte: 1d6 + 6
      }

      if (attrKey === 'fear') {
        setAttribute(attrKey, rollResult, true);
        setAttribute(attrKey, 0, false);
      } else {
        setAttribute(attrKey, rollResult, true);
        setAttribute(attrKey, rollResult, false);
      }
      audio.playCoin();
    }, 600);
  };

  const handleDecrement = () => {
    audio.playBlip();
    setAttribute(attrKey, attr.current - 1, false);
  };

  const handleIncrement = () => {
    audio.playBlip();
    setAttribute(attrKey, attr.current + 1, false);
  };

  return (
    <div className={`${cardClasses} border-2 p-4 shadow-[-5px_5px_0px_rgba(0,0,0,0.3)] transition-colors`}>
      <h3 className={`text-md font-bold uppercase text-center mb-2 border-b pb-1 ${theme === 'papyrus' ? 'border-[#2C1E14] text-[#2C1E14]' : 'border-[#cbd5e0] text-[#cbd5e0]'}`}>{label}</h3>
      <div className="flex items-center justify-between gap-4 mt-2 mb-2">
        <button 
          onClick={handleDecrement}
          className={`w-12 h-12 border hover:bg-[#2C1E14] hover:text-[#FDF6E3] flex items-center justify-center text-xl font-bold rounded-sm cursor-pointer ${theme === 'papyrus' ? 'border-[#2C1E14]' : 'border-[#cbd5e0]'}`}
        >-</button>
        
        <div className="text-4xl font-bold flex items-baseline gap-1.5 select-none">
          <span>{modifiedCurrent}</span>
          {modifier !== 0 && (
            <span className={`text-sm font-bold font-sans ${
              (attrKey === 'fear' ? modifier < 0 : modifier > 0)
                ? (theme === 'papyrus' ? 'text-green-800' : 'text-green-400') 
                : (theme === 'papyrus' ? 'text-red-800' : 'text-red-400')
            }`}>
              {modifier > 0 ? `+${modifier}` : modifier}
            </span>
          )}
        </div>
        
        <button 
          onClick={handleIncrement}
          className={`w-12 h-12 border hover:bg-[#2C1E14] hover:text-[#FDF6E3] flex items-center justify-center text-xl font-bold rounded-sm cursor-pointer ${theme === 'papyrus' ? 'border-[#2C1E14]' : 'border-[#cbd5e0]'}`}
        >+</button>
      </div>

      <div className={`flex items-center justify-between mt-4 p-2 min-h-[38px] ${theme === 'papyrus' ? 'bg-[#EAD8B8] text-[#2C1E14]' : 'bg-[#2d3748] text-[#cbd5e0]'}`}>
        {rolling ? (
          <div className="flex items-center gap-1.5 pl-1">
            {rollingDice.map((d, idx) => (
              <Die key={idx} value={d} rolling={true} styleClass={getDiceStyle(theme, gamebook)} />
            ))}
          </div>
        ) : (
          <span className="text-xs uppercase font-bold pl-1">Inicial: {attr.initial}</span>
        )}

        {!(isMedo && attrKey === 'skill' && superpower === 'superforca') && 
         !(gamebook === 'A Lenda de Zagor' && attributes.selectedHero && attributes.selectedHero !== 'personalizado') && (
          <button 
            onClick={rollInitial} 
            disabled={rolling}
            className="hover:text-[#C5A059] transition p-1 border border-transparent hover:border-current rounded disabled:opacity-50"
            title="Refazer Rolagem Inicial"
          >
            <RefreshCw size={16} className={rolling ? 'animate-spin' : ''} />
          </button>
        )}
      </div>
    </div>
  );
};
