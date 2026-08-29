'use client';
import { useSheetStore } from '@/store/useSheetStore';
import { audio } from '@/lib/audio';
import { PlusSquare, CreditCard, Cross } from 'lucide-react';

export const GoldAndProvisions = () => {
  const { gold, provisions, updateGold, updateProvisions, attributes, setAttribute, theme, gamebook } = useSheetStore();

  const isGuerreiro = gamebook === 'Guerreiro das Estradas';

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

  if (isGuerreiro) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {/* Créditos */}
        <div className={`${isPapyrus ? 'bg-[#EAD8B8] border-[#5C4033] text-[#5C4033]' : 'bg-[#1a202c] border-[#4a5568] text-[#cbd5e0]'} border p-4 text-center transition-colors rounded-lg`}>
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <CreditCard size={16} />
            <label className="block text-sm font-bold uppercase tracking-wider">Créditos</label>
          </div>
          <div className="text-3xl font-black my-2 tracking-tight">{gold}</div>
          <div className="flex gap-1.5 justify-center flex-wrap">
            <button onClick={() => handleUpdateGold(50)} className={`${isPapyrus ? 'bg-[#2C1E14] text-[#EAD8B8]' : 'bg-[#2d3748] text-white hover:bg-slate-600'} px-2 py-1 text-xs transition-colors rounded-sm`}>+50</button>
            <button onClick={() => handleUpdateGold(10)} className={`${isPapyrus ? 'bg-[#2C1E14] text-[#EAD8B8]' : 'bg-[#2d3748] text-white hover:bg-slate-600'} px-2 py-1 text-xs transition-colors rounded-sm`}>+10</button>
            <button onClick={() => handleUpdateGold(1)} className={`${isPapyrus ? 'bg-[#2C1E14] text-[#EAD8B8]' : 'bg-[#2d3748] text-white hover:bg-slate-600'} px-2 py-1 text-xs transition-colors rounded-sm`}>+1</button>
            <button onClick={() => handleUpdateGold(-1)} className={`${isPapyrus ? 'bg-[#2C1E14] text-[#EAD8B8]' : 'bg-[#2d3748] text-white hover:bg-slate-600'} px-2 py-1 text-xs transition-colors rounded-sm`}>-1</button>
            <button onClick={() => handleUpdateGold(-10)} className={`${isPapyrus ? 'bg-[#2C1E14] text-[#EAD8B8]' : 'bg-[#2d3748] text-white hover:bg-slate-600'} px-2 py-1 text-xs transition-colors rounded-sm`}>-10</button>
            <button onClick={() => handleUpdateGold(-50)} className={`${isPapyrus ? 'bg-[#2C1E14] text-[#EAD8B8]' : 'bg-[#2d3748] text-white hover:bg-slate-600'} px-2 py-1 text-xs transition-colors rounded-sm`}>-50</button>
          </div>
        </div>

        {/* Medkit */}
        <div className={`${isPapyrus ? 'bg-[#EAD8B8] border-[#5C4033] text-[#5C4033]' : 'bg-[#1a202c] border-[#4a5568] text-[#cbd5e0]'} border p-4 text-center transition-colors rounded-lg flex flex-col justify-between`}>
          <div>
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <PlusSquare size={16} className="text-red-500" />
              <label className="block text-sm font-bold uppercase tracking-wider">Medkit (Pacotes)</label>
            </div>
            
            {/* Visual Medkit Grid (10 caixas como na ficha original) */}
            <div className="grid grid-cols-5 gap-1.5 my-3 max-w-[200px] mx-auto">
              {Array.from({ length: 10 }).map((_, idx) => {
                const isAvailable = idx < provisions;
                return (
                  <div
                    key={idx}
                    className={`h-6 border flex items-center justify-center rounded text-[10px] font-black transition-all ${
                      isAvailable
                        ? isPapyrus
                          ? 'bg-red-700 text-white border-red-900 shadow-sm'
                          : 'bg-red-600 text-white border-red-400 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
                        : isPapyrus
                        ? 'bg-[#5C4033]/15 text-[#5C4033]/30 border-[#5C4033]/30'
                        : 'bg-slate-800/40 text-slate-600 border-slate-700'
                    }`}
                  >
                    +
                  </div>
                );
              })}
            </div>

            <div className="text-xs font-bold mb-2">
              {provisions} de 10 pacotes disponíveis
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <button
              onClick={handleConsume}
              disabled={provisions <= 0}
              className={`${
                isPapyrus
                  ? 'bg-red-800 text-white hover:bg-red-900'
                  : 'bg-red-600 text-white hover:bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
              } px-3 py-1.5 text-xs font-bold transition-all rounded disabled:opacity-50 cursor-pointer`}
            >
              USAR MEDKIT (+4 Energia)
            </button>
            <button
              onClick={() => handleUpdateProvisions(1)}
              className={`${isPapyrus ? 'bg-[#2C1E14] text-[#EAD8B8]' : 'bg-[#2d3748] text-white hover:bg-slate-600'} px-2.5 py-1 text-xs transition-colors rounded`}
            >
              +1
            </button>
            <button
              onClick={() => handleUpdateProvisions(-1)}
              disabled={provisions <= 0}
              className={`${isPapyrus ? 'bg-[#2C1E14] text-[#EAD8B8]' : 'bg-[#2d3748] text-white hover:bg-slate-600'} px-2.5 py-1 text-xs transition-colors rounded disabled:opacity-50`}
            >
              -1
            </button>
          </div>
        </div>
      </div>
    );
  }

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
