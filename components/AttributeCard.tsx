import { useSheetStore } from '@/store/useSheetStore';
import { RefreshCw } from 'lucide-react';
import { audio } from '@/lib/audio';

interface Props {
  label: string;
  attrKey: 'skill' | 'energy' | 'luck' | 'magic' | 'faith';
}

export const AttributeCard = ({ label, attrKey }: Props) => {
  const { attributes, setAttribute, theme, gamebook } = useSheetStore();
  const attr = attributes[attrKey] || { initial: 0, current: 0 };
  const isMedo = gamebook === 'Encontro Marcado com o M.E.D.O.';
  const superpower = attributes.superpower;

  const isEnergyLow = attrKey === 'energy' && attr.current > 0 && attr.current <= 4;

  const cardClasses = theme === 'papyrus' 
    ? `bg-[#FDF6E3] border-[#4A3728] text-[#2C1E14] ${isEnergyLow ? 'animate-pulse ring-2 ring-red-700/80 border-red-700 shadow-[0_0_15px_rgba(220,38,38,0.5)]' : ''}` 
    : `bg-[#1a202c] border-[#4a5568] text-[#cbd5e0] ${isEnergyLow ? 'animate-pulse ring-2 ring-red-500/80 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)]' : ''}`;

  const rollInitial = () => {
    if (isMedo && attrKey === 'skill' && superpower === 'superforca') {
      setAttribute('skill', 13, true);
      setAttribute('skill', 13, false);
      return;
    }

    audio.playDiceRoll();
    let roll = 0;
    if (attrKey === 'energy') {
      roll = (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1) + 12; // 2d6 + 12 para todos os livros
    } else if (gamebook === 'A Cidadela do Caos' && attrKey === 'magic') {
      roll = (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1) + 6; // 2d6 + 6
    } else if (gamebook === 'A Cripta do Vampiro' && attrKey === 'faith') {
      roll = (Math.floor(Math.random() * 6) + 1) + 3; // 1d6 + 3
    } else {
      const modifier = 6;
      roll = Math.floor(Math.random() * 6) + 1 + modifier; // Habilidade e Sorte: 1d6 + 6
    }
    setAttribute(attrKey, roll, true);
    setAttribute(attrKey, roll, false);
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
          className={`w-12 h-12 border hover:bg-[#2C1E14] hover:text-[#FDF6E3] flex items-center justify-center text-xl font-bold rounded-sm ${theme === 'papyrus' ? 'border-[#2C1E14]' : 'border-[#cbd5e0]'}`}
        >-</button>
        <div className="text-4xl font-bold">{attr.current}</div>
        <button 
          onClick={handleIncrement}
          className={`w-12 h-12 border hover:bg-[#2C1E14] hover:text-[#FDF6E3] flex items-center justify-center text-xl font-bold rounded-sm ${theme === 'papyrus' ? 'border-[#2C1E14]' : 'border-[#cbd5e0]'}`}
        >+</button>
      </div>
      <div className={`flex items-center justify-center gap-3 mt-4 p-2 ${theme === 'papyrus' ? 'bg-[#EAD8B8] text-[#2C1E14]' : 'bg-[#2d3748] text-[#cbd5e0]'}`}>
        <span className="text-sm uppercase font-bold">Inicial: {attr.initial}</span>
        {!(isMedo && attrKey === 'skill' && superpower === 'superforca') && (
          <button onClick={rollInitial} className="hover:text-[#C5A059] transition p-1 border border-transparent hover:border-current rounded">
            <RefreshCw size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
