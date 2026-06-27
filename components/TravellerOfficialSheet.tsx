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
  Award,
  Clover,
  FileText
} from 'lucide-react';

export const TravellerOfficialSheet = () => {
  const { 
    attributes, 
    theme, 
    updateTravellerShipAttribute, 
    updateTravellerCrewAttribute, 
    promoteCrewAssistant, 
    toggleCrewMemberDead,
    setAttribute,
    notes,
    setNotes
  } = useSheetStore();

  const traveller = attributes.traveller || (() => {
    const roll1d6_6 = () => Math.floor(Math.random() * 6) + 7;
    const roll2d6_12 = () => Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 14;
    const createCrew = (id: string, role: string, name: string) => {
      const sk = roll1d6_6();
      const en = roll2d6_12();
      return { id, role, name, skill: { initial: sk, current: sk }, energy: { initial: en, current: en } };
    };
    const fp = roll1d6_6();
    const sh = roll2d6_12();
    return {
      ship: { firepower: { initial: fp, current: fp }, shields: { initial: sh, current: sh } },
      crew: {
        captain: createCrew('captain', 'Capitão', 'Capitão'),
        science: createCrew('science', 'Oficial de Ciências', 'Oficial de Ciências'),
        engineering: createCrew('engineering', 'Oficial de Engenharia', 'Oficial de Engenharia'),
        medical: createCrew('medical', 'Oficial de Medicina', 'Oficial de Medicina'),
        security: createCrew('security', 'Oficial de Segurança', 'Oficial de Segurança'),
        guard1: createCrew('guard1', 'Guarda de Segurança 1', 'Guarda 1'),
        guard2: createCrew('guard2', 'Guarda de Segurança 2', 'Guarda 2')
      }
    };
  })();

  const isPapyrus = theme === 'papyrus';
  const [promotingId, setPromotingId] = useState<string | null>(null);
  const [assistantSkill, setAssistantSkill] = useState(7);
  const [assistantEnergy, setAssistantEnergy] = useState(18);

  const ship = traveller.ship;
  const crew = traveller.crew;
  const luck = attributes.luck || { initial: 10, current: 10 };

  const handleShipChange = (key: 'firepower' | 'shields', delta: number) => {
    const current = ship[key]?.current ?? 0;
    const nextVal = Math.max(0, current + delta);
    audio.playBlip();
    updateTravellerShipAttribute(key, nextVal, false);
  };

  const handleCrewChange = (memberId: string, attrKey: 'skill' | 'energy', delta: number) => {
    const member = (crew as Record<string, any>)[memberId];
    if (!member) return;
    const current = member[attrKey]?.current ?? 0;
    const nextVal = Math.max(0, current + delta);
    audio.playBlip();
    updateTravellerCrewAttribute(memberId, attrKey, nextVal, false);
  };

  const handleLuckChange = (delta: number) => {
    const current = luck.current ?? 0;
    const nextVal = Math.max(0, current + delta);
    audio.playBlip();
    setAttribute('luck', nextVal, false);
  };

  const handleConfirmPromotion = (memberId: string) => {
    audio.playCoin();
    promoteCrewAssistant(memberId, assistantSkill, assistantEnergy);
    setPromotingId(null);
  };

  const mainOfficers = [
    { key: 'captain', label: 'CAPITÃO', hasAsterisk: false },
    { key: 'science', label: 'OFICIAL DE CIÊNCIAS', hasAsterisk: true },
    { key: 'medical', label: 'OFICIAL MÉDICA', hasAsterisk: true },
    { key: 'engineering', label: 'OFICIAL ENGENHEIRO', hasAsterisk: true },
    { key: 'security', label: 'OFICIAL DE SEGURANÇA', hasAsterisk: false },
  ];

  return (
    <div className={`w-full p-4 sm:p-6 rounded-3xl border-4 relative font-sans transition-all shadow-2xl ${
      isPapyrus 
        ? 'bg-[#FDF6E3] border-[#5C4033] text-[#2D1D16]' 
        : 'bg-slate-950 border-slate-700 text-slate-100'
    }`}>
      {/* ── CABEÇALHO FUTURISTA ── */}
      <div className="flex items-center justify-between gap-4 mb-6 relative border-b-2 pb-3 border-current/20">
        <div className="flex items-center gap-2">
          <Users className={isPapyrus ? 'text-[#8B4513]' : 'text-cyan-400'} size={22} />
          <h2 className="text-base sm:text-lg font-extrabold tracking-widest uppercase font-mono">
            A TRIPULAÇÃO
          </h2>
        </div>
        <div className="hidden sm:flex flex-1 items-center justify-center px-4">
          <div className="w-full h-1 bg-current/20 relative flex items-center justify-between">
            <div className="w-3 h-3 rounded-full border-2 border-current bg-current/40" />
            <div className="w-2 h-2 rounded-full bg-current/60" />
            <div className="w-3 h-3 rounded-full border-2 border-current bg-current/40" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-extrabold tracking-widest uppercase font-mono">
            A TRAVELLER
          </h2>
          <Rocket className={isPapyrus ? 'text-[#8B4513]' : 'text-cyan-400'} size={22} />
        </div>
      </div>

      {/* ── CONTEÚDO PRINCIPAL (2 COLUNAS) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* ── COLUNA ESQUERDA: A TRIPULAÇÃO ── */}
        <div className="flex flex-col gap-3.5">
          {mainOfficers.map(({ key, label, hasAsterisk }) => {
            const member = (crew as Record<string, any>)[key];
            if (!member) return null;

            const isDead = member.isDead || member.energy?.current === 0;
            const isAssistant = member.isAssistant;

            return (
              <div
                key={key}
                className={`p-3 rounded-2xl border-2 transition-all flex flex-col gap-2 relative ${
                  isDead 
                    ? (isPapyrus ? 'bg-red-950/10 border-red-800/40 opacity-70' : 'bg-red-950/30 border-red-700/50 opacity-70')
                    : (isPapyrus ? 'bg-[#EAD8B8]/40 border-[#5C4033]/50' : 'bg-slate-900/80 border-slate-700/80')
                }`}
              >
                <div className="flex items-center justify-between gap-2 border-b pb-1.5 border-current/10">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-black tracking-wider uppercase font-mono ${isDead ? 'line-through text-red-500' : ''}`}>
                      {member.name || label} {hasAsterisk && '*'}
                    </span>
                    {isAssistant && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        Assistente
                      </span>
                    )}
                    {isDead && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-extrabold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                        <UserX size={10} /> Morto
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {isDead && key !== 'captain' && (
                      <button
                        onClick={() => {
                          setPromotingId(key);
                          setAssistantSkill(Math.max(1, (member.skill?.initial || 8) - 2));
                          setAssistantEnergy(18);
                        }}
                        className="text-[9px] px-2 py-0.5 rounded bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/40 font-bold flex items-center gap-0.5 transition cursor-pointer"
                        title="Promover assistente"
                      >
                        <UserPlus size={10} /> Promover
                      </button>
                    )}
                    <button
                      onClick={() => toggleCrewMemberDead(key)}
                      className={`p-1 rounded hover:bg-current/10 transition cursor-pointer ${
                        isDead ? 'text-emerald-500' : 'text-red-400 opacity-60 hover:opacity-100'
                      }`}
                      title={isDead ? 'Ressuscitar/Vivo' : 'Marcar Falecido'}
                    >
                      {isDead ? <Heart size={14} /> : <UserX size={14} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Promotion Modal */}
                {promotingId === key && (
                  <div className={`p-2.5 rounded-xl border text-xs flex flex-col gap-1.5 ${
                    isPapyrus ? 'bg-[#FDF6E3] border-[#5C4033]' : 'bg-slate-900 border-slate-700'
                  }`}>
                    <span className="font-bold text-[#C5A059] flex items-center gap-1 text-[11px]">
                      <Award size={12} /> Promover Assistente de {label}?
                    </span>
                    <div className="grid grid-cols-2 gap-2 my-0.5">
                      <div>
                        <label className="text-[9px] block opacity-75">Hab. Inic. (-2)</label>
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
                      <button onClick={() => setPromotingId(null)} className="px-2 py-0.5 text-[9px] uppercase font-bold opacity-70">
                        Cancelar
                      </button>
                      <button onClick={() => handleConfirmPromotion(key)} className="px-2 py-0.5 text-[9px] uppercase font-bold bg-emerald-600 text-white rounded shadow">
                        Confirmar
                      </button>
                    </div>
                  </div>
                )}

                {!isDead && (
                  <div className="grid grid-cols-2 gap-3 items-center">
                    {/* Habilidade Box */}
                    <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl border border-current/15 bg-current/5">
                      <span className="text-[10px] font-bold uppercase font-mono opacity-80">HABILIDADE</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCrewChange(key, 'skill', -1)}
                          className="w-5 h-5 rounded border border-current/30 flex items-center justify-center font-bold text-xs hover:bg-current/10 active:scale-90"
                        >
                          -
                        </button>
                        <span className="text-sm font-extrabold min-w-[18px] text-center font-mono">
                          {member.skill?.current ?? 0}
                        </span>
                        <button
                          onClick={() => handleCrewChange(key, 'skill', 1)}
                          className="w-5 h-5 rounded border border-current/30 flex items-center justify-center font-bold text-xs hover:bg-current/10 active:scale-90"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Energia Box */}
                    <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl border border-current/15 bg-current/5">
                      <span className="text-[10px] font-bold uppercase font-mono opacity-80">ENERGIA</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCrewChange(key, 'energy', -1)}
                          className="w-5 h-5 rounded border border-current/30 flex items-center justify-center font-bold text-xs text-red-400 hover:bg-current/10 active:scale-90"
                        >
                          -
                        </button>
                        <span className="text-sm font-extrabold min-w-[18px] text-center font-mono text-red-500">
                          {member.energy?.current ?? 0}
                        </span>
                        <button
                          onClick={() => handleCrewChange(key, 'energy', 1)}
                          className="w-5 h-5 rounded border border-current/30 flex items-center justify-center font-bold text-xs text-green-400 hover:bg-current/10 active:scale-90"
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

          {/* ── QUADRO COMPACTO: GUARDA 1 & GUARDA 2 ── */}
          <div className={`p-3 rounded-2xl border-2 flex flex-col gap-2 relative ${
            isPapyrus ? 'bg-[#EAD8B8]/40 border-[#5C4033]/50' : 'bg-slate-900/80 border-slate-700/80'
          }`}>
            <div className="text-center border-b pb-1 border-current/10">
              <span className="text-xs font-black tracking-widest uppercase font-mono">
                GUARDA 1 &nbsp;•&nbsp; GUARDA 2
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              {['guard1', 'guard2'].map((gKey, idx) => {
                const gMember = (crew as Record<string, any>)[gKey];
                const isGDead = gMember?.isDead || gMember?.energy?.current === 0;

                return (
                  <div key={gKey} className="contents">
                    {/* Habilidade Box (H) */}
                    <div className={`p-1.5 rounded-xl border flex flex-col items-center justify-center gap-1 ${
                      isGDead ? 'opacity-40 line-through bg-red-950/20' : 'bg-current/5 border-current/15'
                    }`}>
                      <span className="text-[9px] font-bold font-mono opacity-70">G{idx+1} HAB (H)</span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleCrewChange(gKey, 'skill', -1)} className="w-4 h-4 rounded border flex items-center justify-center text-[10px] font-bold">-</button>
                        <span className="font-extrabold text-xs font-mono">{gMember?.skill?.current ?? 0}</span>
                        <button onClick={() => handleCrewChange(gKey, 'skill', 1)} className="w-4 h-4 rounded border flex items-center justify-center text-[10px] font-bold">+</button>
                      </div>
                    </div>

                    {/* Energia Box (E) */}
                    <div className={`p-1.5 rounded-xl border flex flex-col items-center justify-center gap-1 ${
                      isGDead ? 'opacity-40 line-through bg-red-950/20' : 'bg-current/5 border-current/15'
                    }`}>
                      <span className="text-[9px] font-bold font-mono text-red-400 opacity-80">G{idx+1} ENE (E)</span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleCrewChange(gKey, 'energy', -1)} className="w-4 h-4 rounded border flex items-center justify-center text-[10px] font-bold text-red-400">-</button>
                        <span className="font-extrabold text-xs font-mono text-red-500">{gMember?.energy?.current ?? 0}</span>
                        <button onClick={() => handleCrewChange(gKey, 'energy', 1)} className="w-4 h-4 rounded border flex items-center justify-center text-[10px] font-bold text-green-400">+</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── NOTA DE RODAPÉ OFICIAL ── */}
          <div className="text-center mt-1">
            <span className="text-[10px] font-bold tracking-wider uppercase font-mono opacity-80 text-amber-600 dark:text-amber-400">
              * DEDUZA 3 PONTOS DA HABILIDADE EM COMBATES
            </span>
          </div>
        </div>

        {/* ── COLUNA DIREITA: A TRAVELLER ── */}
        <div className="flex flex-col gap-4">
          
          {/* ── SISTEMAS DA NAVE: FORÇA DE ARMAS & ESCUDOS ── */}
          <div className={`p-4 rounded-2xl border-2 flex flex-col gap-3 ${
            isPapyrus ? 'bg-[#EAD8B8]/40 border-[#5C4033]/50' : 'bg-slate-900/80 border-slate-700/80'
          }`}>
            <div className="text-center border-b pb-1.5 border-current/10">
              <span className="text-xs font-black tracking-widest uppercase font-mono flex items-center justify-center gap-1.5">
                <Rocket size={15} /> SISTEMAS DA ASTRONAVE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* FORÇA DE ARMAS */}
              <div className="p-3 rounded-xl border border-current/15 bg-current/5 flex flex-col items-center justify-center text-center gap-1.5">
                <div className="flex items-center gap-1.5 text-amber-500">
                  <Zap size={16} />
                  <span className="text-xs font-bold uppercase font-mono">FORÇA DE ARMAS</span>
                </div>
                <div className="flex items-center gap-2 my-1">
                  <button onClick={() => handleShipChange('firepower', -1)} className="w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs">-</button>
                  <div className="text-center min-w-[36px]">
                    <span className="text-lg font-black font-mono">{ship.firepower?.current ?? 0}</span>
                    <span className="text-[9px] block opacity-60">/ {ship.firepower?.initial ?? 0}</span>
                  </div>
                  <button onClick={() => handleShipChange('firepower', 1)} className="w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs">+</button>
                </div>
                <span className="text-[9px] opacity-70">Rolar 1d6 sob este valor</span>
              </div>

              {/* ESCUDOS */}
              <div className="p-3 rounded-xl border border-current/15 bg-current/5 flex flex-col items-center justify-center text-center gap-1.5">
                <div className="flex items-center gap-1.5 text-blue-400">
                  <Shield size={16} />
                  <span className="text-xs font-bold uppercase font-mono">ESCUDOS</span>
                </div>
                <div className="flex items-center gap-2 my-1">
                  <button onClick={() => handleShipChange('shields', -1)} className="w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs">-</button>
                  <div className="text-center min-w-[36px]">
                    <span className={`text-lg font-black font-mono ${ship.shields?.current === 0 ? 'text-red-500 animate-pulse' : ''}`}>
                      {ship.shields?.current ?? 0}
                    </span>
                    <span className="text-[9px] block opacity-60">/ {ship.shields?.initial ?? 0}</span>
                  </div>
                  <button onClick={() => handleShipChange('shields', 1)} className="w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs">+</button>
                </div>
                <span className="text-[9px] opacity-70">Absorve dano no espaço</span>
              </div>
            </div>
          </div>

          {/* ── NOTAS DE MISSÃO (CENTRO) ── */}
          <div className={`p-4 rounded-2xl border-2 flex flex-col gap-2 ${
            isPapyrus ? 'bg-[#EAD8B8]/40 border-[#5C4033]/50' : 'bg-slate-900/80 border-slate-700/80'
          }`}>
            <div className="flex items-center justify-between border-b pb-1.5 border-current/10">
              <span className="text-xs font-black tracking-widest uppercase font-mono flex items-center gap-1.5">
                <FileText size={15} /> NOTAS DE MISSÃO / DIÁRIO DE BORDO
              </span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Registre coordenadas de planetas, senhas alienígenas e observações da viagem..."
              rows={6}
              className={`w-full p-3 rounded-xl border text-xs resize-y transition bg-transparent font-sans ${
                isPapyrus ? 'border-[#5C4033]/30 focus:border-[#5C4033] text-[#2D1D16]' : 'border-slate-700 focus:border-cyan-400 text-slate-200'
              }`}
            />
          </div>

          {/* ── SORTE GLOBAL (BASE) ── */}
          <div className={`p-4 rounded-2xl border-2 flex flex-col gap-3 ${
            isPapyrus ? 'bg-[#EAD8B8]/40 border-[#5C4033]/50' : 'bg-slate-900/80 border-slate-700/80'
          }`}>
            <div className="text-center border-b pb-1.5 border-current/10">
              <span className="text-xs font-black tracking-widest uppercase font-mono flex items-center justify-center gap-1.5 text-amber-500">
                <Clover size={16} /> SORTE GLOBAL (TRIPULAÇÃO)
              </span>
            </div>

            <div className="flex items-center justify-between px-4 py-2 rounded-xl border border-current/15 bg-current/5">
              <div>
                <span className="text-xs font-bold uppercase font-mono block">Testes de Destino</span>
                <span className="text-[10px] opacity-70 block">Usado pelo Capitão ao longo da jornada</span>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => handleLuckChange(-1)} className="w-7 h-7 rounded-full border flex items-center justify-center font-bold text-xs active:scale-90">-</button>
                <div className="text-center min-w-[40px]">
                  <span className="text-xl font-black font-mono">{luck.current ?? 0}</span>
                  <span className="text-[9px] block opacity-60">/ {luck.initial ?? 0}</span>
                </div>
                <button onClick={() => handleLuckChange(1)} className="w-7 h-7 rounded-full border flex items-center justify-center font-bold text-xs active:scale-90">+</button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
