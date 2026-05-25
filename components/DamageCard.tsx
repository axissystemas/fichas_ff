'use client';
import { useSheetStore } from '@/store/useSheetStore';

export const DamageCard = () => {
  const { theme, attributes, setAttribute } = useSheetStore();
  const cardClasses = theme === 'papyrus' 
    ? 'bg-[#FDF6E3] border-[#4A3728] text-[#2C1E14]' 
    : 'bg-[#1a202c] border-[#4a5568] text-[#cbd5e0]';

  return (
    <div className={`${cardClasses} border-2 p-4 shadow-[-5px_5px_0px_rgba(0,0,0,0.3)] transition-colors flex flex-col items-center`}>
      <h3 className={`text-md font-bold uppercase text-center mb-2 border-b pb-1 w-full ${theme === 'papyrus' ? 'border-[#2C1E14]' : 'border-[#cbd5e0]'}`}>Combate</h3>
      <button 
        onClick={() => {
          setAttribute('energy', Math.max(0, attributes.energy.current - 2), false);
          useSheetStore.getState().addCombatLog({ type: 'Dano', value: '-2 Ener' });
        }}
        className={`w-full py-2 uppercase font-bold text-sm tracking-widest transition ${theme === 'papyrus' ? 'bg-[#8B0000] text-[#EAD8B8] hover:bg-[#600000]' : 'bg-[#9b2c2c] text-[#cbd5e0] hover:bg-[#742a2a]'}`}
      >
        Dano (-2 Energia)
      </button>
    </div>
  );
};
