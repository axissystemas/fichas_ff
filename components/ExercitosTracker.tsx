'use client';

import { useSheetStore } from '@/store/useSheetStore';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '@/lib/audio';
import { useState } from 'react';
import { Die, getDiceStyle } from './Die';
import { 
  Swords, 
  Plus, 
  Minus, 
  Shield, 
  Users, 
  Dices,
  Skull,
  UserCheck
} from 'lucide-react';

const TROOPS_CONFIG = [
  { key: 'warriors', name: 'Guerreiros', desc: 'Sua infantaria principal.', icon: Users, color: 'text-amber-500' },
  { key: 'dwarfs', name: 'Anões', desc: 'Guerreiros robustos de machado.', icon: Shield, color: 'text-yellow-600' },
  { key: 'elves', name: 'Elfos', desc: 'Arqueiros ágeis da floresta.', icon: Swords, color: 'text-emerald-500' },
  { key: 'knights', name: 'Cavaleiros', desc: 'Cavalaria pesada e temida.', icon: UserCheck, color: 'text-blue-500' },
  { key: 'others', name: 'Outros/Aliados', desc: 'Mercenários ou reforços encontrados.', icon: Skull, color: 'text-purple-500' }
] as const;

export const ExercitosTracker = () => {
  const { attributes, updateTroopCount, theme } = useSheetStore();
  const army = attributes.army || { warriors: 100, dwarfs: 50, elves: 50, knights: 50, others: 0 };
  const isPapyrus = theme === 'papyrus';

  // Skirmish Simulator State
  const [rolling, setRolling] = useState(false);
  const [dice1, setDice1] = useState<number | null>(null);
  const [dice2, setDice2] = useState<number | null>(null);
  const [rollTotal, setRollTotal] = useState<number | null>(null);
  const [rollHistory, setRollHistory] = useState<{ d1: number; d2: number; total: number; timestamp: string }[]>([]);

  // Casualty Shortcut State
  const [selectedTroopForLoss, setSelectedTroopForLoss] = useState<'warriors' | 'dwarfs' | 'elves' | 'knights' | 'others'>('warriors');
  const [lossAmount, setLossAmount] = useState(5);

  const handleTroopChange = (troop: 'warriors' | 'dwarfs' | 'elves' | 'knights' | 'others', delta: number) => {
    const current = army[troop] || 0;
    if (current + delta >= 0) {
      audio.playHit();
      updateTroopCount(troop, delta);
    } else {
      audio.playBlip();
    }
  };

  const handleRollSkirmish = () => {
    if (rolling) return;
    setRolling(true);
    audio.playDiceRoll();

    let count = 0;
    const interval = setInterval(() => {
      setDice1(Math.floor(Math.random() * 6) + 1);
      setDice2(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count > 8) {
        clearInterval(interval);
        const finalD1 = Math.floor(Math.random() * 6) + 1;
        const finalD2 = Math.floor(Math.random() * 6) + 1;
        const total = finalD1 + finalD2;
        setDice1(finalD1);
        setDice2(finalD2);
        setRollTotal(total);
        setRolling(false);
        audio.playCoin();

        // Add to history
        const timestamp = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setRollHistory(prev => [{ d1: finalD1, d2: finalD2, total, timestamp }, ...prev].slice(0, 5));
      }
    }, 70);
  };

  const handleApplyCasualties = () => {
    const currentCount = army[selectedTroopForLoss] || 0;
    const actualLoss = Math.min(currentCount, lossAmount);
    if (actualLoss > 0) {
      audio.playHurt();
      updateTroopCount(selectedTroopForLoss, -actualLoss);
    } else {
      audio.playBlip();
    }
  };

  const totalTroops = 
    (army.warriors || 0) + 
    (army.dwarfs || 0) + 
    (army.elves || 0) + 
    (army.knights || 0) + 
    (army.others || 0);

  // Styles based on theme
  const wrapperClass = isPapyrus
    ? 'border-4 border-[#5C4033] bg-[#FDF6E3] p-6 shadow-[-8px_8px_0px_rgba(0,0,0,0.15)] font-serif mb-6'
    : 'border border-cyan-500/30 bg-slate-950/60 backdrop-blur-md p-6 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.1)] mb-6';

  const titleClass = isPapyrus
    ? 'text-xl font-extrabold uppercase tracking-widest text-[#5C4033] mb-4 flex items-center gap-2 border-b-2 border-[#5C4033]/20 pb-2'
    : 'text-xl font-bold uppercase tracking-widest bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent mb-4 flex items-center gap-2 border-b border-slate-800 pb-2';

  const subTitleClass = isPapyrus
    ? 'text-sm font-bold uppercase tracking-wider text-[#5C4033] mt-5 mb-2 border-b border-[#5C4033]/10 pb-1 flex items-center gap-1.5'
    : 'text-sm font-bold uppercase tracking-wider text-slate-300 mt-5 mb-2 border-b border-slate-800 pb-1 flex items-center gap-1.5';

  const buttonClass = isPapyrus
    ? 'border border-[#5C4033] text-[#2D1D16] hover:bg-[#5C4033] hover:text-[#EAD8B8] px-2 py-1 text-xs font-bold font-sans transition cursor-pointer disabled:opacity-30'
    : 'border border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-500 px-2 py-1 text-xs font-bold font-sans transition rounded cursor-pointer disabled:opacity-30';

  const actionButtonClass = isPapyrus
    ? 'w-full py-2 bg-[#5C4033] text-[#FDF6E3] hover:bg-[#3D2B1F] font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-sm'
    : 'w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition rounded-lg hover:from-amber-400 hover:to-yellow-500 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10';

  const rollBoxClass = isPapyrus
    ? 'border-2 border-dashed border-[#5C4033]/40 bg-[#EAD8B8]/10 p-3 rounded text-center flex flex-col items-center justify-center min-h-[90px]'
    : 'border border-dashed border-slate-800 bg-slate-900/40 p-3 rounded-xl text-center flex flex-col items-center justify-center min-h-[90px]';

  return (
    <div className={wrapperClass}>
      <h3 className={titleClass}>
        <span>🪖 Comando de Guerra</span>
      </h3>

      {/* Força Total */}
      <div className={`p-4 mb-4 border-2 flex items-center justify-between ${
        isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/20' : 'border-amber-500/30 bg-amber-500/5 rounded-xl'
      }`}>
        <div className="flex items-center gap-2">
          <Users className={isPapyrus ? 'text-[#5C4033]' : 'text-amber-400'} size={20} />
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wide">Força Total do Exército</h4>
            <p className={`text-[10px] ${isPapyrus ? 'text-[#5C4033]/85' : 'text-slate-400'} font-sans`}>Combatentes sob seu comando</p>
          </div>
        </div>
        <span className={`text-2xl font-extrabold font-mono ${isPapyrus ? 'text-[#5C4033]' : 'text-amber-400'}`}>
          {totalTroops}
        </span>
      </div>

      {/* Lista de Tropas */}
      <div>
        <h4 className={subTitleClass}>
          <span>👥 Forças Militares</span>
        </h4>
        <div className="space-y-2.5">
          {TROOPS_CONFIG.map((troop) => {
            const count = army[troop.key] || 0;
            const Icon = troop.icon;
            
            return (
              <div 
                key={troop.key}
                className={`p-2.5 border flex items-center justify-between transition-all ${
                  isPapyrus 
                    ? 'border-[#5C4033]/20 bg-[#EAD8B8]/10' 
                    : 'border-slate-800/80 bg-slate-900/30 rounded-xl hover:border-slate-700/80'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Icon size={16} className={`${troop.color} shrink-0`} />
                  <div className="min-w-0">
                    <h5 className="font-bold text-xs uppercase tracking-wide truncate">
                      {troop.name}
                    </h5>
                    <p className={`text-[9px] ${isPapyrus ? 'text-[#5C4033]/70' : 'text-slate-400'} font-sans truncate`}>
                      {troop.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleTroopChange(troop.key, -10)}
                    disabled={count < 10}
                    className={`${buttonClass} px-1.5 py-0.5 text-[10px]`}
                    title="Remover 10 soldados"
                  >
                    -10
                  </button>
                  <button
                    onClick={() => handleTroopChange(troop.key, -1)}
                    disabled={count < 1}
                    className={`${buttonClass} w-6 h-6 flex items-center justify-center p-0`}
                    title="Remover 1 soldado"
                  >
                    <Minus size={10} />
                  </button>

                  <span className="w-10 text-center font-bold font-mono text-sm">
                    {count}
                  </span>

                  <button
                    onClick={() => handleTroopChange(troop.key, 1)}
                    className={`${buttonClass} w-6 h-6 flex items-center justify-center p-0`}
                    title="Adicionar 1 soldado"
                  >
                    <Plus size={10} />
                  </button>
                  <button
                    onClick={() => handleTroopChange(troop.key, 10)}
                    className={`${buttonClass} px-1.5 py-0.5 text-[10px]`}
                    title="Adicionar 10 soldados"
                  >
                    +10
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulador de Escaramuças */}
      <div>
        <h4 className={subTitleClass}>
          <span>🎲 Simulador de Escaramuça (2D6)</span>
        </h4>
        <p className={`text-[10px] leading-relaxed mb-3 ${isPapyrus ? 'text-[#5C4033]/70' : 'text-slate-400'} font-sans`}>
          Role 2d6 para resolver testes de batalha em massa ou choques contra as hordas da morte.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch mb-4">
          {/* Caixa de dados rolados */}
          <div className={rollBoxClass}>
            {rolling ? (
              <div className="flex flex-col items-center justify-center animate-pulse">
                <div className="flex gap-2.5">
                  <Die value={dice1 || 1} rolling={true} styleClass={getDiceStyle(theme, 'A Lenda de Zagor')} />
                  <Die value={dice2 || 1} rolling={true} styleClass={getDiceStyle(theme, 'A Lenda de Zagor')} />
                </div>
                <span className="text-[9px] uppercase tracking-widest font-sans mt-1 opacity-70">
                  Rolando...
                </span>
              </div>
            ) : dice1 !== null && dice2 !== null ? (
              <div className="flex flex-col items-center justify-center">
                <div className="flex gap-2.5 mb-1.5">
                  <Die value={dice1} rolling={false} styleClass={getDiceStyle(theme, 'A Lenda de Zagor')} />
                  <Die value={dice2} rolling={false} styleClass={getDiceStyle(theme, 'A Lenda de Zagor')} />
                </div>
                <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                  Total Rolado: <span className="font-mono text-xs font-extrabold">{rollTotal}</span>
                </div>
              </div>
            ) : (
              <span className={`text-[10px] uppercase tracking-wider ${isPapyrus ? 'text-[#5C4033]/60' : 'text-slate-500'}`}>
                Aguardando Rolagem
              </span>
            )}
          </div>

          <button
            onClick={handleRollSkirmish}
            disabled={rolling}
            className={actionButtonClass}
          >
            <Dices size={16} /> Rolar Escaramuça
          </button>
        </div>

        {/* Histórico rápido */}
        {rollHistory.length > 0 && (
          <div className={`p-2.5 border-2 text-[10px] font-sans ${isPapyrus ? 'border-[#5C4033]/20 bg-black/5' : 'border-slate-800 bg-slate-900/20 rounded-xl'}`}>
            <h5 className="font-bold uppercase tracking-wider mb-1 opacity-70">Histórico de Escaramuças</h5>
            <div className="space-y-1">
              {rollHistory.map((h, i) => (
                <div key={i} className="flex items-center justify-between opacity-80 border-b border-current/5 pb-0.5 last:border-0 last:pb-0">
                  <span>🎲 Rolagem {rollHistory.length - i}: {h.d1} + {h.d2}</span>
                  <span className="font-mono font-bold">Total: {h.total} ({h.timestamp})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Atalho para Baixas Militares */}
      <div>
        <h4 className={subTitleClass}>
          <span>💀 Aplicar Baixas Militares</span>
        </h4>
        <p className={`text-[10px] leading-relaxed mb-3 ${isPapyrus ? 'text-[#5C4033]/70' : 'text-slate-400'} font-sans`}>
          Sofreu perdas em combate? Remova rapidamente um grupo de soldados.
        </p>

        <div className="flex gap-2 items-center flex-wrap sm:flex-nowrap">
          {/* Tipo de Tropa */}
          <select
            value={selectedTroopForLoss}
            onChange={(e) => setSelectedTroopForLoss(e.target.value as any)}
            className={`flex-grow px-2 py-1.5 text-xs ${
              isPapyrus 
                ? 'border border-[#5C4033] bg-[#FDF6E3] text-[#2D1D16] font-serif' 
                : 'border border-slate-700 bg-slate-900 text-slate-200 rounded-lg font-sans'
            }`}
          >
            {TROOPS_CONFIG.map(t => (
              <option key={t.key} value={t.key}>Perder {t.name}</option>
            ))}
          </select>

          {/* Quantidade */}
          <select
            value={lossAmount}
            onChange={(e) => setLossAmount(parseInt(e.target.value, 10))}
            className={`w-20 px-2 py-1.5 text-xs ${
              isPapyrus 
                ? 'border border-[#5C4033] bg-[#FDF6E3] text-[#2D1D16] font-serif' 
                : 'border border-slate-700 bg-slate-900 text-slate-200 rounded-lg font-sans'
            }`}
          >
            {[1, 2, 3, 5, 10, 15, 20, 30, 50].map(val => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>

          {/* Botão de Aplicar */}
          <button
            onClick={handleApplyCasualties}
            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider shrink-0 transition flex items-center justify-center gap-1.5 ${
              isPapyrus
                ? 'border-2 border-red-800 bg-red-500/10 text-red-800 hover:bg-red-800 hover:text-white cursor-pointer'
                : 'border border-red-500/50 bg-red-950/20 text-red-400 hover:bg-red-500/20 hover:border-red-400 cursor-pointer rounded-lg'
            }`}
          >
            <Skull size={13} /> Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};
