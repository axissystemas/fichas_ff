import { useSheetStore } from '@/store/useSheetStore';
import { RefreshCw } from 'lucide-react';

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
    // Regra específica para Energia (1d6 + 12), caso contrário 1d6 + 6
    const modifier = attrKey === 'energy' ? 12 : 6;
    const roll = Math.floor(Math.random() * 6) + 1 + modifier;
    setAttribute(attrKey, roll, true);
    setAttribute(attrKey, roll, false);
  };

  return (
    <div className={`${cardClasses} border-2 p-4 shadow-[-5px_5px_0px_rgba(0,0,0,0.3)] transition-colors`}>
      <h3 className={`text-md font-bold uppercase text-center mb-2 border-b pb-1 ${theme === 'papyrus' ? 'border-[#2C1E14] text-[#2C1E14]' : 'border-[#cbd5e0] text-[#cbd5e0]'}`}>{label}</h3>
      <div className="flex items-center justify-between gap-4">
        <button 
          onClick={() => setAttribute(attrKey, attr.current - 1, false)}
          className={`w-8 h-8 border hover:bg-[#2C1E14] hover:text-[#FDF6E3] flex items-center justify-center font-bold ${theme === 'papyrus' ? 'border-[#2C1E14]' : 'border-[#cbd5e0]'}`}
        >-</button>
        <div className="text-3xl font-bold">{attr.current}</div>
        <button 
          onClick={() => setAttribute(attrKey, attr.current + 1, false)}
          className={`w-8 h-8 border hover:bg-[#2C1E14] hover:text-[#FDF6E3] flex items-center justify-center font-bold ${theme === 'papyrus' ? 'border-[#2C1E14]' : 'border-[#cbd5e0]'}`}
        >+</button>
      </div>
      <div className={`flex items-center justify-center gap-2 mt-3 p-1 ${theme === 'papyrus' ? 'bg-[#EAD8B8] text-[#2C1E14]' : 'bg-[#2d3748] text-[#cbd5e0]'}`}>
        <span className="text-sm uppercase font-bold">Inicial: {attr.initial}</span>
        <button onClick={rollInitial} className="hover:text-[#C5A059] transition">
          <RefreshCw size={16} />
        </button>
      </div>
    </div>
  );
};
