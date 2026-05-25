'use client';
import { useSheetStore } from '@/store/useSheetStore';

export const GoldAndProvisions = () => {
  const { gold, provisions, updateGold, updateProvisions } = useSheetStore();

  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      <div className="bg-[#EAD8B8] border border-[#5C4033] p-4 text-center">
        <label className="block text-sm font-bold uppercase text-[#5C4033]">Ouro</label>
        <div className="text-3xl font-bold my-2">{gold}</div>
        <div className="flex gap-2 justify-center">
          <button onClick={() => updateGold(10)} className="bg-[#2C1E14] text-[#EAD8B8] px-2 py-1 text-xs">+10</button>
          <button onClick={() => updateGold(1)} className="bg-[#2C1E14] text-[#EAD8B8] px-2 py-1 text-xs">+1</button>
          <button onClick={() => updateGold(-1)} className="bg-[#2C1E14] text-[#EAD8B8] px-2 py-1 text-xs">-1</button>
          <button onClick={() => updateGold(-10)} className="bg-[#2C1E14] text-[#EAD8B8] px-2 py-1 text-xs">-10</button>
        </div>
      </div>
      <div className="bg-[#EAD8B8] border border-[#5C4033] p-4 text-center">
        <label className="block text-sm font-bold uppercase text-[#5C4033]">Provisões</label>
        <div className="text-3xl font-bold my-2">{provisions}</div>
        <div className="flex gap-2 justify-center">
          <button onClick={() => updateProvisions(-1)} className="bg-[#2C1E14] text-[#EAD8B8] px-4 py-1 text-xs">CONSUMIR</button>
          <button onClick={() => updateProvisions(1)} className="bg-[#2C1E14] text-[#EAD8B8] px-3 py-1 text-xs">+1</button>
        </div>
      </div>
    </div>
  );
};
