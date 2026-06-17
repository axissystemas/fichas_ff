'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSheetStore } from '@/store/useSheetStore';
import { audio } from '@/lib/audio';

type AttributeKey = 'skill' | 'energy' | 'luck' | 'magic' | 'faith';

interface RollResult {
  id: string;
  type: 'test' | 'free';
  dice: number[];
  total: number;
  success?: boolean;
  attributeLabel?: string;
  targetValue?: number;
}

export const DiceRoller = () => {
  const [selectedAttr, setSelectedAttr] = useState<AttributeKey>('skill');
  const [result, setResult] = useState<RollResult | null>(null);
  const { theme, gamebook, attributes, setAttribute, addCombatLog } = useSheetStore();

  const isPapyrus = theme === 'papyrus';

  const cardClasses = isPapyrus
    ? 'bg-[#FDF6E3] border-[#4A3728] text-[#2C1E14]'
    : 'bg-[#1a202c] border-[#4a5568] text-[#cbd5e0]';

  const btnPrimaryClasses = isPapyrus
    ? 'bg-[#2C1E14] text-[#C5A059] hover:bg-[#4A3728]'
    : 'bg-[#2d3748] text-[#cbd5e0] hover:bg-[#4a5568] border border-[#cbd5e0]/10';

  const btnSecondaryClasses = isPapyrus
    ? 'bg-[#5C4033] text-[#EAD8B8] hover:bg-[#2C1E14]'
    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-[#cbd5e0]/10';

  const selectClasses = isPapyrus
    ? 'border border-[#5C4033] bg-[#EAD8B8]/60 text-[#2D1D16] focus:outline-none focus:ring-1 focus:ring-[#C5A059] px-2 py-1.5 text-xs font-serif'
    : 'border border-[#4a5568] bg-slate-900 text-[#cbd5e0] focus:outline-none focus:ring-1 focus:ring-cyan-500/50 px-2 py-1.5 text-xs font-sans rounded';

  // Compute available attributes dynamically based on the gamebook
  const availableAttributes: { key: AttributeKey; label: string }[] = [
    { key: 'skill', label: 'Habilidade' },
    { key: 'energy', label: 'Energia' },
    { key: 'luck', label: 'Sorte' },
  ];

  if (gamebook === 'A Cidadela do Caos') {
    availableAttributes.push({ key: 'magic', label: 'Mágica' });
  } else if (gamebook === 'A Cripta do Vampiro') {
    availableAttributes.push({ key: 'faith', label: 'Fé' });
  }

  const runAttributeTest = () => {
    audio.playDiceRoll();
    const attrValue = attributes[selectedAttr]?.current ?? 0;

    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const total = d1 + d2;
    const success = total <= attrValue;

    const attrLabel = availableAttributes.find(a => a.key === selectedAttr)?.label ?? selectedAttr;

    // Apply special rule for Luck Test: decrease Luck score by 1
    if (selectedAttr === 'luck') {
      setAttribute('luck', Math.max(0, attrValue - 1), false);
    }

    setResult({
      id: crypto.randomUUID(),
      type: 'test',
      dice: [d1, d2],
      total,
      success,
      attributeLabel: attrLabel,
      targetValue: attrValue,
    });

    addCombatLog({
      type: 'Teste',
      value: `Teste de ${attrLabel}: Rolou ${total} [🎲${d1} + 🎲${d2}] vs ${attrValue} (${success ? 'Sucesso' : 'Falha'})`
    });

    // Play outcome sound with a slight delay
    setTimeout(() => {
      if (success) {
        audio.playSuccess();
      } else {
        audio.playFailure();
      }
    }, 280);
  };

  const rollFreeDice = (count: 1 | 2) => {
    audio.playDiceRoll();

    const dice: number[] = [];
    let total = 0;
    for (let i = 0; i < count; i++) {
      const d = Math.floor(Math.random() * 6) + 1;
      dice.push(d);
      total += d;
    }

    setResult({
      id: crypto.randomUUID(),
      type: 'free',
      dice,
      total,
    });

    addCombatLog({
      type: 'Dados',
      value: `Rolou ${count}d6 livre: ${dice.map(d => `🎲${d}`).join(' + ')} = ${total}`
    });

    setTimeout(() => {
      audio.playBlip();
    }, 280);
  };

  return (
    <div className={`${cardClasses} border-2 p-4 shadow-[-5px_5px_0px_rgba(0,0,0,0.3)] transition-colors flex flex-col justify-between h-full min-h-[300px]`}>
      <div className="flex flex-col gap-3">
        <h3 className={`text-md font-bold uppercase text-center mb-1 border-b pb-1 w-full ${isPapyrus ? 'border-[#2C1E14]' : 'border-[#cbd5e0]'}`}>
          Dados & Testes
        </h3>

        {/* Teste de Atributo Section */}
        <div className="flex flex-col gap-1.5 border-b pb-3 border-dashed border-current/20">
          <label className="text-[10px] uppercase font-bold tracking-wider opacity-80">
            Teste de Atributo (2d6)
          </label>
          <div className="flex gap-2 items-center">
            <select
              value={selectedAttr}
              onChange={(e) => setSelectedAttr(e.target.value as AttributeKey)}
              className={`flex-1 ${selectClasses}`}
            >
              {availableAttributes.map((attr) => (
                <option
                  key={attr.key}
                  value={attr.key}
                  className={isPapyrus ? 'bg-[#FDF6E3] text-[#2C1E14]' : 'bg-slate-900 text-slate-200'}
                >
                  {attr.label} (atual: {attributes[attr.key]?.current ?? 0})
                </option>
              ))}
            </select>
            <button
              onClick={runAttributeTest}
              className={`px-3 py-1.5 uppercase font-bold text-xs tracking-wider transition ${btnPrimaryClasses}`}
            >
              Testar
            </button>
          </div>
          {selectedAttr === 'luck' && (
            <span className={`text-[9px] italic opacity-70 ${isPapyrus ? 'text-red-800' : 'text-red-400'}`}>
              * Testar Sorte consome 1 ponto do valor atual.
            </span>
          )}
        </div>

        {/* Dados Livres Section */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase font-bold tracking-wider opacity-80">
            Dados Livres (d6)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => rollFreeDice(1)}
              className={`py-1.5 uppercase font-bold text-xs tracking-wider transition ${btnSecondaryClasses}`}
            >
              Rolar 1d6
            </button>
            <button
              onClick={() => rollFreeDice(2)}
              className={`py-1.5 uppercase font-bold text-xs tracking-wider transition ${btnSecondaryClasses}`}
            >
              Rolar 2d6
            </button>
          </div>
        </div>
      </div>

      {/* Result Display Section */}
      <div className="mt-4 flex flex-col items-center justify-center min-h-[90px] border-t border-dashed border-current/10 pt-2">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, scale: 0.8, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -5 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center justify-center w-full"
            >
              {/* Visual representation of dice */}
              <div className="flex items-center gap-2 mb-1">
                {result.dice.map((d, index) => (
                  <span
                    key={index}
                    className={`text-2xl font-bold flex items-center justify-center w-8 h-8 border shadow-sm ${
                      isPapyrus
                        ? 'border-[#4A3728] bg-[#EAD8B8]/30 text-[#2C1E14]'
                        : 'border-[#4a5568] bg-slate-800 text-slate-100'
                    }`}
                  >
                    {d}
                  </span>
                ))}
                {result.dice.length > 1 && (
                  <span className="text-sm font-semibold mx-1 opacity-70">=</span>
                )}
                {result.dice.length > 1 && (
                  <span className="text-3xl font-extrabold">{result.total}</span>
                )}
              </div>

              {/* Success/Failure or Details Text */}
              {result.type === 'test' ? (
                <div className="text-center mt-1">
                  <div className={`font-bold text-lg tracking-wide ${
                    result.success
                      ? (isPapyrus ? 'text-green-800' : 'text-green-400')
                      : (isPapyrus ? 'text-red-800' : 'text-red-400')
                  }`}>
                    {result.success ? 'Sucesso!' : 'Falha!'}
                  </div>
                  <div className="text-[10px] opacity-75 mt-0.5">
                    Total {result.total} vs {result.targetValue} ({result.attributeLabel})
                  </div>
                </div>
              ) : (
                <div className="text-center mt-1">
                  <div className={`font-semibold text-xs tracking-wider opacity-85 uppercase`}>
                    Total Rolado
                  </div>
                  <div className="text-3xl font-extrabold">{result.total}</div>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="text-[11px] italic opacity-60 text-center select-none py-4">
              Escolha uma rolagem acima para iniciar.
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
