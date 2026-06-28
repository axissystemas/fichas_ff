'use client';

import { useSheetStore } from '@/store/useSheetStore';
import { audio } from '@/lib/audio';
import { Rocket, User, Shield, Heart } from 'lucide-react';

export const ActiveCombatantSelector = () => {
  const { theme, gamebook, attributes, setActiveCombatantId } = useSheetStore();

  if (gamebook !== 'Nave Espacial Traveller') return null;

  const traveller = attributes.traveller;
  if (!traveller) return null;

  const isPapyrus = theme === 'papyrus';
  const activeId = attributes.activeCombatantId || 'captain';

  const crew = traveller.crew || {};
  const ship = traveller.ship || { firepower: { initial: 0, current: 0 }, shields: { initial: 0, current: 0 } };

  const combatantsList = [
    {
      id: 'ship',
      name: 'Astronave Traveller',
      role: 'Astronave',
      isShip: true,
      skill: ship.firepower?.current ?? 0,
      energy: ship.shields?.current ?? 0,
      skillLabel: 'Poder Fogo',
      energyLabel: 'Escudos',
      isDead: false,
      icon: <Rocket size={16} className="text-amber-500 shrink-0" />,
    },
    {
      id: 'captain',
      name: crew.captain?.name || 'Capitão',
      role: crew.captain?.role || 'Capitão',
      isShip: false,
      skill: crew.captain?.skill?.current ?? 0,
      energy: crew.captain?.energy?.current ?? 0,
      skillLabel: 'Hab',
      energyLabel: 'Ener',
      isDead: !!crew.captain?.isDead,
      icon: <User size={16} className="text-cyan-400 shrink-0" />,
    },
    {
      id: 'science',
      name: crew.science?.name || 'Oficial de Ciências',
      role: crew.science?.role || 'Oficial de Ciências',
      isShip: false,
      skill: crew.science?.skill?.current ?? 0,
      energy: crew.science?.energy?.current ?? 0,
      skillLabel: 'Hab',
      energyLabel: 'Ener',
      isDead: !!crew.science?.isDead,
      icon: <User size={16} className="text-[#C5A059] shrink-0" />,
    },
    {
      id: 'engineering',
      name: crew.engineering?.name || 'Oficial de Engenharia',
      role: crew.engineering?.role || 'Oficial de Engenharia',
      isShip: false,
      skill: crew.engineering?.skill?.current ?? 0,
      energy: crew.engineering?.energy?.current ?? 0,
      skillLabel: 'Hab',
      energyLabel: 'Ener',
      isDead: !!crew.engineering?.isDead,
      icon: <User size={16} className="text-orange-400 shrink-0" />,
    },
    {
      id: 'medical',
      name: crew.medical?.name || 'Oficial de Medicina',
      role: crew.medical?.role || 'Oficial de Medicina',
      isShip: false,
      skill: crew.medical?.skill?.current ?? 0,
      energy: crew.medical?.energy?.current ?? 0,
      skillLabel: 'Hab',
      energyLabel: 'Ener',
      isDead: !!crew.medical?.isDead,
      icon: <User size={16} className="text-emerald-400 shrink-0" />,
    },
    {
      id: 'security',
      name: crew.security?.name || 'Oficial de Segurança',
      role: crew.security?.role || 'Oficial de Segurança',
      isShip: false,
      skill: crew.security?.skill?.current ?? 0,
      energy: crew.security?.energy?.current ?? 0,
      skillLabel: 'Hab',
      energyLabel: 'Ener',
      isDead: !!crew.security?.isDead,
      icon: <User size={16} className="text-blue-400 shrink-0" />,
    },
    {
      id: 'guard1',
      name: crew.guard1?.name || 'Guarda 1',
      role: crew.guard1?.role || 'Guarda 1',
      isShip: false,
      skill: crew.guard1?.skill?.current ?? 0,
      energy: crew.guard1?.energy?.current ?? 0,
      skillLabel: 'Hab',
      energyLabel: 'Ener',
      isDead: !!crew.guard1?.isDead,
      icon: <User size={16} className="text-purple-400 shrink-0" />,
    },
    {
      id: 'guard2',
      name: crew.guard2?.name || 'Guarda 2',
      role: crew.guard2?.role || 'Guarda 2',
      isShip: false,
      skill: crew.guard2?.skill?.current ?? 0,
      energy: crew.guard2?.energy?.current ?? 0,
      skillLabel: 'Hab',
      energyLabel: 'Ener',
      isDead: !!crew.guard2?.isDead,
      icon: <User size={16} className="text-purple-400 shrink-0" />,
    },
  ];

  const handleSelect = (id: string, isDead: boolean) => {
    if (isDead) return;
    audio.playBlip();
    setActiveCombatantId(id);
  };

  return (
    <div className={`p-4 border-2 shadow-md mb-4 ${isPapyrus ? 'bg-[#FDF6E3] border-[#5C4033] text-[#2D1D16]' : 'bg-slate-900/90 border-slate-700 text-slate-200 rounded-xl'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2 mb-3 border-current/15">
        <div>
          <h3 className={`text-sm font-extrabold uppercase tracking-wider flex items-center gap-2 ${isPapyrus ? 'text-[#8B4513]' : 'text-cyan-400'}`}>
            🎯 Quem está no Encontro / Ação?
          </h3>
          <p className="text-[10px] opacity-75 font-sans">
            Selecione a Astronave ou o tripulante para direcionar os botões de Ataque, Dano e Testes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {combatantsList.map((c) => {
          const isActive = activeId === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => handleSelect(c.id, c.isDead)}
              disabled={c.isDead}
              className={`p-2 rounded-lg border flex flex-col justify-between items-center text-center transition-all cursor-pointer relative overflow-hidden ${
                c.isDead
                  ? 'opacity-40 grayscale cursor-not-allowed border-red-500/30 bg-red-950/20'
                  : isActive
                  ? isPapyrus
                    ? 'bg-[#5C4033] text-[#EAD8B8] border-[#8B4513] shadow-lg scale-105 ring-2 ring-[#C5A059]'
                    : 'bg-gradient-to-b from-cyan-600 to-blue-700 text-white border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)] scale-105 font-bold'
                  : isPapyrus
                  ? 'bg-[#EAD8B8]/40 border-[#5C4033]/30 hover:bg-[#EAD8B8]/70 text-[#2D1D16]'
                  : 'bg-slate-950/50 border-slate-800 hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-1 mb-1 max-w-full truncate">
                {c.icon}
                <span className="text-[11px] font-extrabold truncate uppercase font-serif">{c.name}</span>
              </div>

              <div className="flex items-center justify-around w-full text-[10px] font-mono mt-1 pt-1 border-t border-current/10">
                <span className="flex items-center gap-0.5" title={`${c.skillLabel}: ${c.skill}`}>
                  <Shield size={10} className="opacity-75" /> {c.skill}
                </span>
                <span className="flex items-center gap-0.5 text-red-400 font-bold" title={`${c.energyLabel}: ${c.energy}`}>
                  <Heart size={10} className="fill-current opacity-80" /> {c.energy}
                </span>
              </div>

              {c.isDead && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-[9px] font-extrabold uppercase text-red-400 tracking-wider bg-black/80 px-1 rounded">Morto</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
