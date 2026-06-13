import { useSheetStore } from '@/store/useSheetStore';
import { RefreshCw } from 'lucide-react';
import { audio } from '@/lib/audio';

interface Props {
  label: string;
  attrKey: 'skill' | 'energy' | 'luck';
}

export const AttributeCard = ({ label, attrKey }: Props) => {
  const { attributes, setAttribute, theme } = useSheetStore();
  const attr = attributes[attrKey];
  const cardClasses = theme === 'papyrus' 
    ? 'bg-[#FDF6E3] border-[#4A3728] text-[#2C1E14]' 
    : 'bg-[#1a202c] border-[#4a5568] text-[#cbd5e0]';

  const rollInitial = () => {
    audio.playDiceRoll();
    // Regra específica para Energia (1d6 + 12), caso contrário 1d6 + 6
    const modifier = attrKey === 'energy' ? 12 : 6;
    const roll = Math.floor(Math.random() * 6) + 1 + modifier;
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
        <button onClick={rollInitial} className="hover:text-[#C5A059] transition p-1 border border-transparent hover:border-current rounded">
          <RefreshCw size={18} />
        </button>
      </div>
    </div>
  );
};
