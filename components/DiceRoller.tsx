'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useSheetStore } from '@/store/useSheetStore';
import { audio } from '@/lib/audio';
import { Die, getDiceStyle } from './Die';

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
  const [rolling, setRolling] = useState(false);
  const [rollingDice, setRollingDice] = useState<number[]>([]);
  const { theme, gamebook, attributes, setAttribute, addCombatLog, getModifiedAttribute, inventory } = useSheetStore();

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

  const isTraveller = gamebook === 'Nave Espacial Traveller';
  const activeId = attributes.activeCombatantId || 'captain';

  const getAttributeVal = (key: AttributeKey) => {
    if (isTraveller) {
      if (key === 'luck') return getModifiedAttribute('luck');
      if (activeId === 'ship') {
        if (key === 'skill') return attributes.traveller?.ship?.firepower?.current ?? 0;
        if (key === 'energy') return attributes.traveller?.ship?.shields?.current ?? 0;
      } else {
        const member = attributes.traveller?.crew?.[activeId];
        if (key === 'skill') return member?.skill?.current ?? 0;
        if (key === 'energy') return member?.energy?.current ?? 0;
      }
    }
    return getModifiedAttribute(key);
  };

  // Compute available attributes dynamically based on the gamebook
  const availableAttributes: { key: AttributeKey; label: string }[] = [
    { key: 'skill', label: isTraveller && activeId === 'ship' ? 'Poder de Fogo' : 'Habilidade' },
    { key: 'energy', label: isTraveller && activeId === 'ship' ? 'Escudos' : 'Energia' },
    { key: 'luck', label: isTraveller ? 'Sorte Global' : 'Sorte' },
  ];

  if (gamebook === 'A Cidadela do Caos') {
    availableAttributes.push({ key: 'magic', label: 'Mágica' });
  } else if (gamebook === 'A Cripta do Vampiro') {
    availableAttributes.push({ key: 'faith', label: 'Fé' });
  }



  const runAttributeTest = () => {
    if (rolling) return;
    audio.playDiceRoll();
    setRolling(true);
    setResult(null);

    let rollsCount = 0;
    const rollInterval = setInterval(() => {
      setRollingDice([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ]);
      rollsCount++;
    }, 70);

    setTimeout(() => {
      clearInterval(rollInterval);
      setRolling(false);

      const store = useSheetStore.getState();
      const currentIsTrav = store.gamebook === 'Nave Espacial Traveller';
      const currentActiveId = store.attributes.activeCombatantId || 'captain';

      let attrValue = store.getModifiedAttribute(selectedAttr);
      let combatantName = '';

      if (currentIsTrav) {
        if (selectedAttr === 'luck') {
          attrValue = store.getModifiedAttribute('luck');
          combatantName = 'Tripulação';
        } else if (currentActiveId === 'ship') {
          if (selectedAttr === 'skill') attrValue = store.attributes.traveller?.ship?.firepower?.current ?? 0;
          if (selectedAttr === 'energy') attrValue = store.attributes.traveller?.ship?.shields?.current ?? 0;
          combatantName = 'Astronave Traveller';
        } else {
          const member = store.attributes.traveller?.crew?.[currentActiveId];
          if (selectedAttr === 'skill') attrValue = member?.skill?.current ?? 0;
          if (selectedAttr === 'energy') attrValue = member?.energy?.current ?? 0;
          combatantName = member?.name || 'Capitão';
        }
      }

      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const total = d1 + d2;
      const success = total <= attrValue;

      const attrLabel = availableAttributes.find(a => a.key === selectedAttr)?.label ?? selectedAttr;

      // Apply special rule for Luck Test: decrease Luck score by 1
      if (selectedAttr === 'luck') {
        const baseLuck = attributes.luck.current;
        setAttribute('luck', Math.max(0, baseLuck - 1), false);
      }

      setResult({
        id: crypto.randomUUID(),
        type: 'test',
        dice: [d1, d2],
        total,
        success,
        attributeLabel: currentIsTrav ? `${attrLabel} (${combatantName})` : attrLabel,
        targetValue: attrValue,
      });

      addCombatLog({
        type: 'Teste',
        value: `Teste de ${attrLabel}${combatantName ? ` (${combatantName})` : ''}: Rolou ${total} [🎲${d1} + 🎲${d2}] vs ${attrValue} (${success ? 'Sucesso' : 'Falha'})`
      });

      if (success) {
        audio.playSuccess();
      } else {
        audio.playFailure();
      }
    }, 600);
  };

  const rollFreeDice = (count: 1 | 2) => {
    if (rolling) return;
    audio.playDiceRoll();
    setRolling(true);
    setResult(null);

    const rollInterval = setInterval(() => {
      const temp: number[] = [];
      for (let i = 0; i < count; i++) {
        temp.push(Math.floor(Math.random() * 6) + 1);
      }
      setRollingDice(temp);
    }, 70);

    setTimeout(() => {
      clearInterval(rollInterval);
      setRolling(false);

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

      audio.playBlip();
    }, 600);
  };

  return (
    <div className={`${cardClasses} border-2 p-4 shadow-[-5px_5px_0px_rgba(0,0,0,0.3)] transition-colors flex flex-col justify-between h-full min-h-[300px]`}>
      <div className="flex flex-col gap-3">
        <h3 className={`text-md font-bold uppercase text-center mb-1 border-b pb-1 w-full ${isPapyrus ? 'border-[#2C1E14]' : 'border-[#cbd5e0]'}`}>
          Dados & Testes
        </h3>

        {/* Teste de Atributo Section */}
        <div className="flex flex-col gap-1.5 border-b pb-3 border-dashed border-current/20">
          <label className="text-[10px] uppercase font-bold tracking-wider opacity-80 font-sans">
            Teste de Atributo (2d6)
          </label>
          <div className="flex flex-col gap-2">
            <select
              value={selectedAttr}
              onChange={(e) => setSelectedAttr(e.target.value as AttributeKey)}
              className={`w-full ${selectClasses}`}
            >
              {availableAttributes.map((attr) => (
                <option
                  key={attr.key}
                  value={attr.key}
                  className={isPapyrus ? 'bg-[#FDF6E3] text-[#2C1E14]' : 'bg-slate-900 text-slate-200'}
                >
                  {attr.label} (atual: {getAttributeVal(attr.key)})
                </option>
              ))}
            </select>
            <button
              onClick={runAttributeTest}
              className={`w-full py-2 uppercase font-bold text-xs tracking-wider transition cursor-pointer ${btnPrimaryClasses}`}
            >
              Testar
            </button>
          </div>
          {selectedAttr === 'luck' && (
            <span className={`text-[9px] italic opacity-70 ${isPapyrus ? 'text-red-800' : 'text-red-400'} font-sans`}>
              * Testar Sorte consome 1 ponto do valor atual.
            </span>
          )}
        </div>

        {/* Dados Livres Section */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase font-bold tracking-wider opacity-80 font-sans">
            Dados Livres (d6)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => rollFreeDice(1)}
              className={`py-1.5 uppercase font-bold text-xs tracking-wider transition cursor-pointer ${btnSecondaryClasses}`}
            >
              Rolar 1d6
            </button>
            <button
              onClick={() => rollFreeDice(2)}
              className={`py-1.5 uppercase font-bold text-xs tracking-wider transition cursor-pointer ${btnSecondaryClasses}`}
            >
              Rolar 2d6
            </button>
          </div>
        </div>
      </div>

      {/* Result Display Section */}
      <div className="mt-4 flex flex-col items-center justify-center min-h-[110px] border-t border-dashed border-current/10 pt-3">
        {rolling ? (
          <div className="flex flex-col items-center justify-center w-full animate-pulse gap-2">
            <div className="flex items-center gap-3">
              {rollingDice.map((d, idx) => (
                <Die key={idx} value={d} rolling={true} styleClass={getDiceStyle(theme, gamebook)} />
              ))}
            </div>
            <span className="text-[9px] uppercase tracking-widest opacity-60 font-sans">Rolando dados...</span>
          </div>
        ) : (
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
                <div className="flex items-center gap-3 mb-2">
                  {result.dice.map((d, index) => (
                    <Die key={index} value={d} rolling={false} styleClass={getDiceStyle(theme, gamebook)} />
                  ))}
                  {result.dice.length > 1 && (
                    <span className="text-xl font-bold mx-1 opacity-70">=</span>
                  )}
                  {result.dice.length > 1 && (
                    <span className="text-4xl font-black">{result.total}</span>
                  )}
                </div>

                {/* Success/Failure or Details Text */}
                {result.type === 'test' ? (
                  <div className="text-center mt-1">
                    <div className={`font-black text-xl tracking-wide ${
                      result.success
                        ? (isPapyrus ? 'text-green-800' : 'text-green-400')
                        : (isPapyrus ? 'text-red-800' : 'text-red-400')
                    }`}>
                      {result.success ? 'Sucesso!' : 'Falha!'}
                    </div>
                    <div className="text-[10px] opacity-75 mt-0.5 font-sans">
                      Total {result.total} vs {result.targetValue} ({result.attributeLabel})
                    </div>
                  </div>
                ) : (
                  <div className="text-center mt-1">
                    <div className={`font-semibold text-xs tracking-wider opacity-85 uppercase font-sans`}>
                      Total Rolado
                    </div>
                    <div className="text-3xl font-black">{result.total}</div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="text-[11px] italic opacity-60 text-center select-none py-4 font-sans">
                Escolha uma rolagem acima para iniciar.
              </div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
