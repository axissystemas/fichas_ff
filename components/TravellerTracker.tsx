'use client';

import { useSheetStore } from '@/store/useSheetStore';
import { audio } from '@/lib/audio';
import { useState } from 'react';
import { 
  Rocket, 
  Shield, 
  Zap, 
  Users, 
  UserX, 
  UserPlus, 
  Heart, 
  Award
} from 'lucide-react';

export const TravellerTracker = () => {
  const { 
    attributes, 
    theme, 
    updateTravellerShipAttribute, 
    updateTravellerCrewAttribute, 
    promoteCrewAssistant, 
    toggleCrewMemberDead 
  } = useSheetStore();

  const traveller = attributes.traveller || {
    ship: {
      firepower: { initial: 10, current: 10 },
      shields: { initial: 16, current: 16 }
    },
    crew: {
      captain: { id: 'captain', role: 'Capitão', name: 'Capitão', skill: { initial: 10, current: 10 }, energy: { initial: 18, current: 18 } },
      science: { id: 'science', role: 'Oficial de Ciências', name: 'Oficial de Ciências', skill: { initial: 9, current: 9 }, energy: { initial: 18, current: 18 } },
      engineering: { id: 'engineering', role: 'Oficial de Engenharia', name: 'Oficial de Engenharia', skill: { initial: 9, current: 9 }, energy: { initial: 18, current: 18 } },
      medical: { id: 'medical', role: 'Oficial de Medicina', name: 'Oficial de Medicina', skill: { initial: 9, current: 9 }, energy: { initial: 18, current: 18 } },
      security: { id: 'security', role: 'Oficial de Segurança', name: 'Oficial de Segurança', skill: { initial: 10, current: 10 }, energy: { initial: 20, current: 20 } },
      guard1: { id: 'guard1', role: 'Guarda de Segurança 1', name: 'Guarda 1', skill: { initial: 9, current: 9 }, energy: { initial: 18, current: 18 } },
      guard2: { id: 'guard2', role: 'Guarda de Segurança 2', name: 'Guarda 2', skill: { initial: 9, current: 9 }, energy: { initial: 18, current: 18 } }
    }
  };

  const isPapyrus = theme === 'papyrus';
  const [promotingId, setPromotingId] = useState<string | null>(null);
  const [assistantSkill, setAssistantSkill] = useState(7);
  const [assistantEnergy, setAssistantEnergy] = useState(18);

  const ship = traveller.ship;
  const crew = traveller.crew;

  const handleShipChange = (key: 'firepower' | 'shields', delta: number) => {
    const current = ship[key]?.current ?? 0;
    const nextVal = Math.max(0, current + delta);
    audio.playBlip();
    updateTravellerShipAttribute(key, nextVal, false);
  };

  const handleCrewChange = (memberId: string, attrKey: 'skill' | 'energy', delta: number) => {
    const member = crew[memberId];
    if (!member) return;
    const current = member[attrKey]?.current ?? 0;
    const nextVal = Math.max(0, current + delta);
    audio.playBlip();
    updateTravellerCrewAttribute(memberId, attrKey, nextVal, false);
  };

  const handleConfirmPromotion = (memberId: string) => {
    audio.playCoin();
    promoteCrewAssistant(memberId, assistantSkill, assistantEnergy);
    setPromotingId(null);
  };

  const crewKeys = ['captain', 'science', 'engineering', 'medical', 'security', 'guard1', 'guard2'];

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      {/* CARD DA ASTRONAVE TRAVELLER */}
      <div className={`p-5 rounded-2xl border shadow-lg flex flex-col gap-4 relative ${
        isPapyrus 
          ? 'bg-[#FDF6E3] border-[#5C4033]/40 text-[#2D1D16]' 
          : 'bg-slate-900/90 border-slate-700 text-slate-100'
      }`}>
        <div className="flex items-center justify-between border-b pb-3 border-current/10">
          <div className="flex items-center gap-2.5">
            <Rocket className={isPapyrus ? 'text-[#8B4513]' : 'text-cyan-400'} size={24} />
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider">Astronave Traveller</h3>
              <p className="text-[11px] opacity-75">Sistemas de combate estelar e escudos de defesa</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {/* Poder de Fogo */}
          <div className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
            isPapyrus ? 'bg-[#EAD8B8]/30 border-[#5C4033]/20' : 'bg-slate-800/50 border-slate-700/60'
          }`}>
            <div className="flex items-center gap-2">
              <Zap className="text-amber-500 flex-shrink-0" size={18} />
              <div>
                <span className="text-xs font-bold uppercase tracking-wide block">Poder de Fogo</span>
                <span className="text-[9px] opacity-70 block">Rolar 1d6 sob valor</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => handleShipChange('firepower', -1)}
                className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold transition active:scale-90 ${
                  isPapyrus ? 'border-[#5C4033] hover:bg-[#5C4033]/10' : 'border-slate-600 hover:bg-slate-700'
                }`}
              >
                -
              </button>
              <div className="text-center min-w-[32px]">
                <span className="text-sm font-extrabold">{ship.firepower?.current ?? 0}</span>
                <span className="text-[9px] block opacity-60">/ {ship.firepower?.initial ?? 0}</span>
              </div>
              <button
                onClick={() => handleShipChange('firepower', 1)}
                className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold transition active:scale-90 ${
                  isPapyrus ? 'border-[#5C4033] hover:bg-[#5C4033]/10' : 'border-slate-600 hover:bg-slate-700'
                }`}
              >
                +
              </button>
            </div>
          </div>

          {/* Escudos */}
          <div className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
            isPapyrus ? 'bg-[#EAD8B8]/30 border-[#5C4033]/20' : 'bg-slate-800/50 border-slate-700/60'
          }`}>
            <div className="flex items-center gap-2">
              <Shield className="text-blue-500 flex-shrink-0" size={18} />
              <div>
                <span className="text-xs font-bold uppercase tracking-wide block">Escudos Nave</span>
                <span className="text-[9px] opacity-70 block">Estrutura em espaço</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => handleShipChange('shields', -1)}
                className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold transition active:scale-90 ${
                  isPapyrus ? 'border-[#5C4033] hover:bg-[#5C4033]/10' : 'border-slate-600 hover:bg-slate-700'
                }`}
              >
                -
              </button>
              <div className="text-center min-w-[32px]">
                <span className={`text-sm font-extrabold ${ship.shields?.current === 0 ? 'text-red-500 animate-pulse' : ''}`}>
                  {ship.shields?.current ?? 0}
                </span>
                <span className="text-[9px] block opacity-60">/ {ship.shields?.initial ?? 0}</span>
              </div>
              <button
                onClick={() => handleShipChange('shields', 1)}
                className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold transition active:scale-90 ${
                  isPapyrus ? 'border-[#5C4033] hover:bg-[#5C4033]/10' : 'border-slate-600 hover:bg-slate-700'
                }`}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CARD DA TRIPULAÇÃO DA PONTE */}
      <div className={`p-4 rounded-2xl border shadow-lg flex flex-col gap-3.5 ${
        isPapyrus 
          ? 'bg-[#FDF6E3] border-[#5C4033]/40 text-[#2D1D16]' 
          : 'bg-slate-900/90 border-slate-700 text-slate-100'
      }`}>
        <div className="flex items-center justify-between border-b pb-2.5 border-current/10">
          <div className="flex items-center gap-2">
            <Users className={isPapyrus ? 'text-[#8B4513]' : 'text-cyan-400'} size={20} />
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider">Tripulação de Ponte</h3>
              <p className="text-[10px] opacity-75">Oficiais e Guardas ativas</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {crewKeys.map((key) => {
            const member = crew[key];
            if (!member) return null;

            const isDead = member.isDead || member.energy?.current === 0;
            const isAssistant = member.isAssistant;
            const isNonCombatant = ['science', 'engineering', 'medical'].includes(key);

            return (
              <div
                key={key}
                className={`p-3 rounded-xl border flex flex-col gap-2 transition-all ${
                  isDead 
                    ? (isPapyrus ? 'bg-red-950/10 border-red-800/30 opacity-70' : 'bg-red-950/20 border-red-800/40 opacity-70')
                    : (isPapyrus ? 'bg-[#EAD8B8]/20 border-[#5C4033]/20' : 'bg-slate-800/40 border-slate-700/60')
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-xs font-extrabold uppercase leading-tight ${isDead ? 'line-through text-red-500' : ''}`}>
                      {member.name}
                    </span>
                    {isAssistant && (
                      <span className="text-[8px] px-1 py-0.2 rounded font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        Assistente
                      </span>
                    )}
                    {isDead && (
                      <span className="text-[8px] px-1 py-0.2 rounded font-extrabold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-0.5">
                        <UserX size={9} /> Morto
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {/* Botão Promover Assistente se falecido */}
                    {isDead && key !== 'captain' && (
                      <button
                        onClick={() => {
                          setPromotingId(key);
                          setAssistantSkill(Math.max(1, (member.skill?.initial || 8) - 2));
                          setAssistantEnergy(18);
                        }}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/40 font-bold flex items-center gap-0.5 transition cursor-pointer"
                        title="Promover assistente substituto"
                      >
                        <UserPlus size={10} /> Promover
                      </button>
                    )}
                    <button
                      onClick={() => toggleCrewMemberDead(key)}
                      className={`p-1 rounded hover:bg-current/10 transition cursor-pointer ${
                        isDead ? 'text-emerald-500' : 'text-red-400 opacity-60 hover:opacity-100'
                      }`}
                      title={isDead ? 'Marcar como Vivo' : 'Marcar como Falecido'}
                    >
                      {isDead ? <Heart size={13} /> : <UserX size={13} />}
                    </button>
                  </div>
                </div>

                {/* Modal de confirmação de promoção */}
                {promotingId === key && (
                  <div className={`p-2.5 rounded-lg border text-xs flex flex-col gap-1.5 ${
                    isPapyrus ? 'bg-[#FDF6E3] border-[#5C4033]' : 'bg-slate-900 border-slate-700'
                  }`}>
                    <span className="font-bold text-[#C5A059] flex items-center gap-1 text-[11px]">
                      <Award size={12} /> Promover Assistente de {member.role}?
                    </span>
                    <p className="text-[9px] opacity-80 leading-tight">
                      Habilidade = Habilidade inicial do oficial falecido - 2.
                    </p>
                    <div className="grid grid-cols-2 gap-2 my-0.5">
                      <div>
                        <label className="text-[9px] block opacity-75">Hab. Inic.</label>
                        <input
                          type="number"
                          value={assistantSkill}
                          onChange={(e) => setAssistantSkill(Number(e.target.value))}
                          className="w-full px-1.5 py-0.5 rounded border text-center text-xs bg-transparent"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] block opacity-75">Energ. Inic.</label>
                        <input
                          type="number"
                          value={assistantEnergy}
                          onChange={(e) => setAssistantEnergy(Number(e.target.value))}
                          className="w-full px-1.5 py-0.5 rounded border text-center text-xs bg-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 justify-end mt-0.5">
                      <button
                        onClick={() => setPromotingId(null)}
                        className="px-2 py-0.5 text-[9px] uppercase font-bold opacity-70 hover:opacity-100"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleConfirmPromotion(key)}
                        className="px-2 py-0.5 text-[9px] uppercase font-bold bg-emerald-600 text-white rounded shadow"
                      >
                        Confirmar
                      </button>
                    </div>
                  </div>
                )}

                {/* Controles de Habilidade e Energia do membro */}
                {!isDead && (
                  <div className="flex flex-col gap-1.5 text-xs">
                    {/* Habilidade */}
                    <div className="flex items-center justify-between px-2 py-1 rounded bg-current/5 border border-current/10">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold opacity-80">Habilidade:</span>
                        <span className="font-extrabold text-xs">{member.skill?.current ?? 0}</span>
                        {isNonCombatant && (
                          <span className="text-[8px] text-amber-500 font-bold ml-1">
                            (-3 combate)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCrewChange(key, 'skill', -1)}
                          className="w-5 h-5 rounded flex items-center justify-center font-bold border border-current/30 hover:bg-current/10 active:scale-90 transition"
                        >
                          -
                        </button>
                        <button
                          onClick={() => handleCrewChange(key, 'skill', 1)}
                          className="w-5 h-5 rounded flex items-center justify-center font-bold border border-current/30 hover:bg-current/10 active:scale-90 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Energia */}
                    <div className="flex items-center justify-between px-2 py-1 rounded bg-current/5 border border-current/10">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold opacity-80">Energia:</span>
                        <span className="font-extrabold text-xs text-red-500">{member.energy?.current ?? 0}</span>
                        <span className="text-[9px] opacity-60">/ {member.energy?.initial ?? 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCrewChange(key, 'energy', -1)}
                          className="w-5 h-5 rounded flex items-center justify-center font-bold border border-current/30 hover:bg-current/10 text-red-400 active:scale-90 transition"
                        >
                          -
                        </button>
                        <button
                          onClick={() => handleCrewChange(key, 'energy', 1)}
                          className="w-5 h-5 rounded flex items-center justify-center font-bold border border-current/30 hover:bg-current/10 text-green-400 active:scale-90 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
