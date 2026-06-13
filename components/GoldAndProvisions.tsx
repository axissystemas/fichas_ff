'use client';
import { useSheetStore } from '@/store/useSheetStore';
import { audio } from '@/lib/audio';

export const GoldAndProvisions = () => {
  const { gold, provisions, updateGold, updateProvisions, attributes, setAttribute, theme } = useSheetStore();

  const handleConsume = () => {
    if (provisions > 0) {
      audio.playSuccess(); // Healing chime
      updateProvisions(-1);
      const currentEnergy = attributes.energy.current;
      const initialEnergy = attributes.energy.initial;
      if (currentEnergy < initialEnergy) {
        const newEnergy = Math.min(currentEnergy + 4, initialEnergy);
        setAttribute('energy', newEnergy, false);
      }
    }
  };

  const handleUpdateGold = (amount: number) => {
    updateGold(amount);
    if (amount > 0) {
      audio.playCoin();
    } else {
      audio.playBlip();
    }
  };

  const handleUpdateProvisions = (amount: number) => {
    updateProvisions(amount);
    if (amount > 0) {
      audio.playCoin();
    } else {
      audio.playBlip();
    }
  };

  const isPapyrus = theme === 'papyrus';

  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      <div className={`${isPapyrus ? 'bg-[#EAD8B8] border-[#5C4033] text-[#5C4033]' : 'bg-[#1a202c] border-[#4a5568] text-[#cbd5e0]'} border p-4 text-center transition-colors`}>
        <label className="block text-sm font-bold uppercase">Ouro</label>
        <div className="text-3xl font-bold my-2">{gold}</div>
        <div className="flex gap-2 justify-center flex-wrap">
          <button onClick={() => handleUpdateGold(10)} className={`${isPapyrus ? 'bg-[#2C1E14] text-[#EAD8B8]' : 'bg-[#2d3748] text-white hover:bg-slate-600'} px-2 py-1 text-xs transition-colors rounded-sm`}>+10</button>
          <button onClick={() => handleUpdateGold(1)} className={`${isPapyrus ? 'bg-[#2C1E14] text-[#EAD8B8]' : 'bg-[#2d3748] text-white hover:bg-slate-600'} px-2 py-1 text-xs transition-colors rounded-sm`}>+1</button>
          <button onClick={() => handleUpdateGold(-1)} className={`${isPapyrus ? 'bg-[#2C1E14] text-[#EAD8B8]' : 'bg-[#2d3748] text-white hover:bg-slate-600'} px-2 py-1 text-xs transition-colors rounded-sm`}>-1</button>
          <button onClick={() => handleUpdateGold(-10)} className={`${isPapyrus ? 'bg-[#2C1E14] text-[#EAD8B8]' : 'bg-[#2d3748] text-white hover:bg-slate-600'} px-2 py-1 text-xs transition-colors rounded-sm`}>-10</button>
        </div>
      </div>
      <div className={`${isPapyrus ? 'bg-[#EAD8B8] border-[#5C4033] text-[#5C4033]' : 'bg-[#1a202c] border-[#4a5568] text-[#cbd5e0]'} border p-4 text-center transition-colors`}>
        <label className="block text-sm font-bold uppercase">Provisões</label>
        <div className="text-3xl font-bold my-2">{provisions}</div>
        <div className="flex gap-2 justify-center">
          <button onClick={handleConsume} className={`${isPapyrus ? 'bg-[#2C1E14] text-[#EAD8B8]' : 'bg-[#2d3748] text-white hover:bg-slate-600'} px-4 py-1 text-xs font-bold transition-colors rounded-sm`}>CONSUMIR</button>
          <button onClick={() => handleUpdateProvisions(1)} className={`${isPapyrus ? 'bg-[#2C1E14] text-[#EAD8B8]' : 'bg-[#2d3748] text-white hover:bg-slate-600'} px-3 py-1 text-xs transition-colors rounded-sm`}>+1</button>
        </div>
      </div>
    </div>
  );
};
