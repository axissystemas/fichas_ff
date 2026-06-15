'use client';

import { useSheetStore } from '@/store/useSheetStore';
import { motion } from 'motion/react';
import { audio } from '@/lib/audio';
import { 
  Skull, 
  Plus, 
  Minus, 
  Activity, 
  HeartCrack,
  Flame,
  Eye,
  ShieldAlert
} from 'lucide-react';

const DISEASES = [
  { key: 'licantropia', name: 'Licantropia', description: 'Infecção lupina que pode causar transformações selvagens sob a lua cheia.', icon: Skull, color: 'text-amber-600' },
  { key: 'praga_morcego', name: 'Praga do Morcego', description: 'Febre debilitante transmitida por mordidas de morcegos vampiros.', icon: HeartCrack, color: 'text-red-500' },
  { key: 'maldicao_curandeiro', name: 'Maldição do Curandeiro', description: 'Efeito místico adverso que enfraquece suas capacidades físicas.', icon: ShieldAlert, color: 'text-purple-500' },
  { key: 'veneno_lento', name: 'Veneno de Ação Lenta', description: 'Toxina letal que gradualmente consome sua energia vital.', icon: Activity, color: 'text-green-500' },
  { key: 'encantado_katarina', name: 'Encantado por Katarina', description: 'Dominação mental exercida pela sedutora Katarina Heydrich.', icon: Eye, color: 'text-pink-500' }
];

export const VampiroTracker = () => {
  const { attributes, toggleDisease, updateCoffinsDestroyed, theme } = useSheetStore();
  
  const activeDiseases = attributes.diseases || [];
  const coffins = attributes.coffinsDestroyed || 0;
  const isPapyrus = theme === 'papyrus';

  const handleToggleDisease = (key: string, name: string) => {
    audio.playHit();
    toggleDisease(key);
  };

  const handleCoffinChange = (delta: number) => {
    const nextCoffins = coffins + delta;
    if (nextCoffins >= 0 && nextCoffins <= 4) {
      audio.playSuccess();
      updateCoffinsDestroyed(delta);
    } else {
      audio.playBlip();
    }
  };

  // Styles based on theme
  const wrapperClass = isPapyrus
    ? 'border-4 border-[#5C4033] bg-[#FDF6E3] p-6 shadow-[-8px_8px_0px_rgba(0,0,0,0.15)] font-serif mb-6'
    : 'border border-cyan-500/30 bg-slate-950/60 backdrop-blur-md p-6 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.1)] mb-6';

  const titleClass = isPapyrus
    ? 'text-xl font-extrabold uppercase tracking-widest text-[#5C4033] mb-4 flex items-center gap-2 border-b-2 border-[#5C4033]/20 pb-2'
    : 'text-xl font-bold uppercase tracking-widest bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-4 flex items-center gap-2 border-b border-slate-800 pb-2';

  const subTitleClass = isPapyrus
    ? 'text-sm font-bold uppercase tracking-wider text-[#5C4033] mt-4 mb-2 border-b border-[#5C4033]/10 pb-1 flex items-center gap-1.5'
    : 'text-sm font-bold uppercase tracking-wider text-slate-300 mt-4 mb-2 border-b border-slate-800 pb-1 flex items-center gap-1.5';

  return (
    <div className={wrapperClass}>
      <h3 className={titleClass}>
        <span>🏰 Castelo Heydrich</span>
      </h3>

      {/* Caixões Destruídos */}
      <div>
        <h4 className={subTitleClass}>
          <span>⚰️ Caixões Sobressalentes Destruídos</span>
        </h4>
        <p className={`text-[10px] leading-relaxed mb-3 ${isPapyrus ? 'text-[#5C4033]/70' : 'text-slate-400'} font-sans`}>
          Destrua os caixões extras de Heydrich no castelo para impedir que ele se regenere e facilitar o combate final.
        </p>
        <div className="flex items-center justify-between gap-4 p-3 border-2 border-current/10 bg-black/5 rounded">
          <button
            onClick={() => handleCoffinChange(-1)}
            disabled={coffins === 0}
            className={`w-8 h-8 flex items-center justify-center border font-bold transition cursor-pointer disabled:opacity-30 ${
              isPapyrus 
                ? 'border-[#5C4033] text-[#5C4033] hover:bg-[#5C4033]/10' 
                : 'border-slate-600 text-slate-200 hover:bg-slate-800 rounded'
            }`}
          >
            <Minus size={14} />
          </button>
          
          <div className="flex gap-1.5">
            {Array.from({ length: 4 }).map((_, i) => {
              const active = i < coffins;
              return (
                <span 
                  key={i} 
                  className={`text-xl transition-all duration-300 ${
                    active ? 'opacity-100 scale-110' : 'opacity-20 hover:opacity-40'
                  }`}
                  title={active ? 'Caixão Destruído' : 'Caixão Intacto'}
                >
                  ⚰️
                </span>
              );
            })}
          </div>

          <button
            onClick={() => handleCoffinChange(1)}
            disabled={coffins === 4}
            className={`w-8 h-8 flex items-center justify-center border font-bold transition cursor-pointer disabled:opacity-30 ${
              isPapyrus 
                ? 'border-[#5C4033] text-[#5C4033] hover:bg-[#5C4033]/10' 
                : 'border-slate-600 text-slate-200 hover:bg-slate-800 rounded'
            }`}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Moléstias */}
      <div>
        <h4 className={subTitleClass}>
          <span>🤢 Moléstias Contraídas</span>
        </h4>
        <p className={`text-[10px] leading-relaxed mb-3 ${isPapyrus ? 'text-[#5C4033]/70' : 'text-slate-400'} font-sans`}>
          Marque as doenças e maldições que você contraiu. Elas afetam negativamente a sua jornada no castelo.
        </p>

        <div className="space-y-2.5">
          {DISEASES.map((disease) => {
            const isContained = activeDiseases.includes(disease.key);
            const Icon = disease.icon;
            
            const itemClass = isPapyrus
              ? `border-2 p-2 flex items-start gap-2.5 transition-all cursor-pointer ${
                  isContained 
                    ? 'border-red-800 bg-red-500/10' 
                    : 'border-[#5C4033]/30 bg-transparent hover:border-[#5C4033]'
                }`
              : `border p-2 flex items-start gap-2.5 transition-all cursor-pointer rounded-xl ${
                  isContained 
                    ? 'border-red-500/40 bg-red-950/20 text-slate-100 shadow-[0_0_10px_rgba(239,68,68,0.05)]' 
                    : 'border-slate-800 bg-slate-900/20 text-slate-400 hover:border-slate-700'
                }`;

            return (
              <div 
                key={disease.key}
                onClick={() => handleToggleDisease(disease.key, disease.name)}
                className={itemClass}
              >
                <input 
                  type="checkbox"
                  checked={isContained}
                  onChange={() => {}} // toggle handled by container click
                  className="mt-1 accent-red-600 cursor-pointer"
                />
                
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Icon size={14} className={isContained ? 'text-red-500' : 'text-current opacity-60'} />
                    <h5 className="font-bold text-[11px] uppercase tracking-wide">
                      {disease.name}
                    </h5>
                  </div>
                  <p className={`text-[9px] mt-0.5 leading-tight ${
                    isPapyrus ? 'text-[#5C4033]/80' : 'text-slate-400'
                  } font-sans`}>
                    {disease.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
