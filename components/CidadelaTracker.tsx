'use client';

import { useSheetStore } from '@/store/useSheetStore';
import { motion } from 'motion/react';
import { audio } from '@/lib/audio';
import { 
  Wand2, 
  Brain, 
  Flame, 
  Coins, 
  Eye, 
  ArrowUp, 
  Clover, 
  Shield, 
  Heart, 
  Zap, 
  UserX, 
  Copy,
  BookOpen
} from 'lucide-react';

const CIDADELA_SPELLS = [
  { key: 'copia_de_criatura', name: 'Cópia de Criatura', description: 'Cria um clone idêntico do monstro para lutar ao seu lado.' },
  { key: 'pes', name: 'P.E.S.', description: 'Permite ler a mente de criaturas para descobrir segredos ou intenções.' },
  { key: 'fogo', name: 'Fogo', description: 'Lança fogo para causar destruição ou ferir oponentes.' },
  { key: 'ouro_dos_tolos', name: 'Ouro dos Tolos', description: 'Transforma pedras comuns em moedas de ouro temporárias.' },
  { key: 'ilusao', name: 'Ilusão', description: 'Cria miragens para enganar guardas ou desviar atenção de perigos.' },
  { key: 'levitacao', name: 'Levitação', description: 'Permite flutuar no ar para passar por armadilhas e abismos.' },
  { key: 'sorte', name: 'Sorte', description: 'Restabelece Sorte atual e aumenta o limite de Sorte Inicial em +1.' },
  { key: 'escudo', name: 'Escudo', description: 'Cria uma barreira invisível que repele ataques e projéteis.' },
  { key: 'habilidade', name: 'Habilidade', description: 'Restaura a Habilidade atual de volta ao valor máximo inicial.' },
  { key: 'energia', name: 'Energia', description: 'Restaura metade da Energia inicial (arredondada para cima) sem exceder o máximo.' },
  { key: 'forca', name: 'Força', description: 'Aumenta drasticamente a força física por breves períodos.' },
  { key: 'fraqueza', name: 'Fraqueza', description: 'Enfraquece a habilidade ou energia de um inimigo.' }
];

const spellMeta: Record<string, { icon: any; colorClass: string; effectBadge?: string }> = {
  copia_de_criatura: { icon: Copy, colorClass: 'from-blue-500/10 to-indigo-500/10 text-blue-400 border-blue-500/30' },
  pes: { icon: Brain, colorClass: 'from-pink-500/10 to-rose-500/10 text-pink-400 border-pink-500/30' },
  fogo: { icon: Flame, colorClass: 'from-orange-500/10 to-red-500/10 text-orange-400 border-orange-500/30' },
  ouro_dos_tolos: { icon: Coins, colorClass: 'from-yellow-500/10 to-amber-500/10 text-yellow-400 border-yellow-500/30' },
  ilusao: { icon: Eye, colorClass: 'from-purple-500/10 to-violet-500/10 text-purple-400 border-purple-500/30' },
  levitacao: { icon: ArrowUp, colorClass: 'from-cyan-500/10 to-sky-500/10 text-cyan-400 border-cyan-500/30' },
  sorte: { icon: Clover, colorClass: 'from-green-500/10 to-emerald-500/10 text-green-400 border-green-500/30', effectBadge: 'Sorte Inicial +1 & Cura' },
  escudo: { icon: Shield, colorClass: 'from-teal-500/10 to-emerald-500/10 text-teal-400 border-teal-500/30' },
  habilidade: { icon: Wand2, colorClass: 'from-cyan-500/10 to-blue-500/10 text-cyan-300 border-cyan-500/30', effectBadge: 'Cura Habilidade' },
  energia: { icon: Heart, colorClass: 'from-red-500/10 to-rose-500/10 text-red-400 border-red-500/30', effectBadge: '+50% Energia' },
  forca: { icon: Zap, colorClass: 'from-yellow-500/10 to-orange-500/10 text-yellow-400 border-yellow-500/30' },
  fraqueza: { icon: UserX, colorClass: 'from-gray-500/10 to-slate-500/10 text-slate-400 border-slate-500/30' },
};

export const CidadelaTracker = () => {
  const { attributes, castSpell, theme } = useSheetStore();
  
  const spells = attributes.spells || {};
  const isPapyrus = theme === 'papyrus';

  // Filter list to only show spells that were selected in creation (i.e. exist in the spells record)
  const activeSpells = CIDADELA_SPELLS.filter(
    (s) => spells[s.key] !== undefined
  );

  const handleCast = (spellKey: string, spellName: string) => {
    // Play spellcast sound
    audio.playCoin();
    castSpell(spellKey);
  };

  if (activeSpells.length === 0) {
    return null;
  }

  // Styles based on theme
  const wrapperClass = isPapyrus
    ? 'border-4 border-[#5C4033] bg-[#FDF6E3] p-6 shadow-[-8px_8px_0px_rgba(0,0,0,0.15)] font-serif mb-6'
    : 'border border-purple-500/30 bg-slate-950/60 backdrop-blur-md p-6 rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.1)] mb-6';

  const titleClass = isPapyrus
    ? 'text-xl font-extrabold uppercase tracking-widest text-[#5C4033] mb-4 flex items-center gap-2 border-b-2 border-[#5C4033]/20 pb-2'
    : 'text-xl font-bold uppercase tracking-widest bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4 flex items-center gap-2 border-b border-slate-800 pb-2';

  return (
    <div className={wrapperClass}>
      <h3 className={titleClass}>
        <BookOpen size={20} className={isPapyrus ? 'text-[#5C4033]' : 'text-purple-400'} />
        <span>Grimório de Feitiços</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-3">
        {activeSpells.map((spell) => {
          const qty = spells[spell.key] || 0;
          const meta = spellMeta[spell.key] || { icon: Wand2, colorClass: '' };
          const Icon = meta.icon;
          const isOut = qty === 0;

          const cardClass = isPapyrus
            ? `border-2 p-2.5 flex flex-col justify-between transition-all duration-200 ${
                isOut 
                  ? 'border-[#5C4033]/20 bg-[#5C4033]/5 opacity-50' 
                  : 'border-[#5C4033] bg-[#EAD8B8]/15 hover:bg-[#EAD8B8]/35'
              }`
            : `border bg-slate-900/40 p-2.5 flex flex-col justify-between transition-all duration-200 rounded-xl ${
                isOut
                  ? 'border-slate-800/40 opacity-40'
                  : 'border-purple-500/25 bg-gradient-to-br ' + meta.colorClass + ' hover:border-purple-500/50'
              }`;

          const buttonClass = isPapyrus
            ? 'w-full py-1 px-3 bg-[#2C1E14] text-[#EAD8B8] hover:bg-[#5C4033] disabled:bg-[#5C4033]/20 disabled:text-[#5C4033]/40 font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer'
            : 'w-full py-1 px-3 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-500 text-slate-100 font-bold text-[10px] uppercase tracking-wider transition-all rounded-lg cursor-pointer';

          return (
            <div key={spell.key} className={cardClass}>
              <div>
                <div className="flex justify-between items-start mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Icon size={14} className={isPapyrus ? 'text-[#5C4033]' : ''} />
                    <h4 className={`font-bold text-[11px] uppercase tracking-wide ${isPapyrus ? 'text-[#2D1D16]' : 'text-slate-200'}`}>
                      {spell.name}
                    </h4>
                  </div>
                  <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isPapyrus 
                      ? 'bg-[#5C4033]/15 text-[#5C4033]' 
                      : 'bg-purple-950/40 text-purple-300'
                  }`}>
                    {qty} {qty === 1 ? 'c' : 'c'}
                  </span>
                </div>
                
                <p className={`text-[10px] leading-relaxed mb-2 ${isPapyrus ? 'text-[#5C4033]/80' : 'text-slate-400'} font-sans`}>
                  {spell.description}
                </p>

                {meta.effectBadge && !isOut && (
                  <div className="mb-2">
                    <span className={`text-[8px] uppercase font-bold tracking-wider px-1 py-0.5 rounded ${
                      isPapyrus 
                        ? 'bg-[#8B4513]/10 text-[#8B4513]' 
                        : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    }`}>
                      ⚡ {meta.effectBadge}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleCast(spell.key, spell.name)}
                disabled={isOut}
                className={buttonClass}
              >
                {isOut ? 'Esgotado' : 'Conjurar'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
