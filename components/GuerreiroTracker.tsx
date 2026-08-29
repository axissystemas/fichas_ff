'use client';

import { useState } from 'react';
import { useSheetStore } from '@/store/useSheetStore';
import { audio } from '@/lib/audio';
import {
  Shield,
  Zap,
  Fuel,
  Disc,
  Flame,
  Crosshair,
  Wrench,
  HelpCircle,
  AlertTriangle,
  Radio,
  Gauge
} from 'lucide-react';

export const GuerreiroTracker = () => {
  const {
    attributes,
    updateInterceptorAttribute,
    updateInterceptorResource,
    setInterceptorModifications,
    addCombatLog,
    theme
  } = useSheetStore();

  const isPapyrus = theme === 'papyrus';

  const interceptor = attributes.interceptor || {
    firepower: { initial: 10, current: 10 },
    armour: { initial: 30, current: 30 },
    missiles: 4,
    spikes: 3,
    oil: 2,
    spareTires: 2,
    fuel: 10,
    modifications: ''
  };

  const firepower = interceptor.firepower || { initial: 10, current: 10 };
  const armour = interceptor.armour || { initial: 30, current: 30 };
  const missiles = interceptor.missiles ?? 4;
  const spikes = interceptor.spikes ?? 3;
  const oil = interceptor.oil ?? 2;
  const spareTires = interceptor.spareTires ?? 2;
  const fuel = interceptor.fuel ?? 10;
  const modifications = interceptor.modifications ?? '';

  const [showRules, setShowRules] = useState(false);

  // Rolador de combate veicular rápido
  const rollVehicleAttack = () => {
    audio.playDiceRoll();
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const total = d1 + d2 + firepower.current;
    addCombatLog({
      type: 'Veículo',
      value: `Interceptor disparou torreta: 2d6 (${d1} + ${d2}) + ${firepower.current} Poder de Fogo = ${total} Força de Ataque`
    });
  };

  const rollVehicleDamage = () => {
    audio.playDiceRoll();
    const dmg = Math.floor(Math.random() * 6) + 1;
    addCombatLog({
      type: 'Veículo',
      value: `Dano de veículo infligido: 1d6 = ${dmg} na Blindagem do alvo!`
    });
  };

  const fireMissile = () => {
    if (missiles <= 0) return;
    audio.playHit();
    updateInterceptorResource('missiles', -1);
    addCombatLog({
      type: 'Veículo',
      value: `🚀 MÍSSIL DISPARADO! Acerto automático: Veículo inimigo DESTRUÍDO!`
    });
  };

  // Cálculo da porcentagem de blindagem para barra visual
  const armourPercent = armour.initial > 0 ? Math.round((armour.current / armour.initial) * 100) : 0;

  return (
    <div
      className={`p-5 border-2 transition-all duration-300 ${
        isPapyrus
          ? 'border-[#5C4033] bg-[#EAD8B8]/30 text-[#2D1D16] shadow-md'
          : 'border-orange-500/40 bg-slate-950/80 text-slate-100 rounded-2xl shadow-[0_0_25px_rgba(249,115,22,0.1)]'
      }`}
    >
      {/* Header Estilo Painel Automotivo */}
      <div className="flex items-center justify-between border-b border-current/15 pb-4 mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl ${
              isPapyrus
                ? 'bg-[#5C4033]/20 text-[#8B4513]'
                : 'bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-[0_0_12px_rgba(249,115,22,0.3)]'
            }`}
          >
            <Gauge size={22} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black uppercase tracking-widest flex items-center gap-2">
              Dodge Interceptor
              <span
                className={`text-[9px] uppercase px-2 py-0.5 rounded font-black tracking-wider ${
                  isPapyrus
                    ? 'bg-[#5C4033] text-[#FDF6E3]'
                    : 'bg-orange-600 text-black border border-orange-400 shadow-sm'
                }`}
              >
                V8 Interceptor
              </span>
            </h3>
            <p className="text-[10px] opacity-75 font-sans">
              Especificações e Painel de Controle de Batalha
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              audio.playBlip();
              setShowRules(!showRules);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded border transition ${
              isPapyrus
                ? 'border-[#5C4033] text-[#5C4033] hover:bg-[#5C4033]/15'
                : 'border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <HelpCircle size={13} /> {showRules ? 'Ocultar Regras' : 'Regras de Veículo'}
          </button>
        </div>
      </div>

      {/* Regras Rápidas Expansíveis */}
      {showRules && (
        <div
          className={`mb-4 p-4 rounded-xl text-xs space-y-2 border font-sans animate-fade-in ${
            isPapyrus
              ? 'bg-[#FDF6E3] border-[#5C4033]/30 text-[#2D1D16]'
              : 'bg-slate-900/90 border-slate-800 text-slate-300'
          }`}
        >
          <div className="font-bold uppercase text-[11px] flex items-center gap-1.5 text-orange-500">
            <Radio size={14} /> Regras de Combate de Veículos:
          </div>
          <ul className="list-disc pl-4 space-y-1 text-[11px] leading-relaxed opacity-90">
            <li><strong>Sequência:</strong> Role 2d6 + Poder de Fogo do Interceptor vs 2d6 + Poder de Fogo do oponente.</li>
            <li><strong>Dano de Metralhadora:</strong> Quem tiver a maior Força de Ataque acerta e causa <strong>1d6 de dano</strong> na Blindagem do veículo atingido!</li>
            <li><strong>Disparo de Míssil:</strong> No início de qualquer rodada, você pode disparar um míssil. O acerto é <strong>automático e destrói o veículo inimigo</strong> de imediato!</li>
            <li><strong>Destruição:</strong> Ao chegar a 0 de Blindagem, o veículo explode e o motorista morre.</li>
          </ul>
        </div>
      )}

      {/* Grid Principal: Poder de Fogo e Blindagem */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {/* Poder de Fogo */}
        <div
          className={`p-4 rounded-xl border flex flex-col justify-between ${
            isPapyrus
              ? 'bg-[#EAD8B8]/50 border-[#5C4033]/40'
              : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <Crosshair size={15} className="text-orange-500" /> Poder de Fogo
            </span>
            <span className="text-[10px] opacity-70 font-sans font-bold">
              Inicial: {firepower.initial}
            </span>
          </div>

          <div className="flex items-center justify-between my-2">
            <div className="text-3xl font-black">{firepower.current}</div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  audio.playBlip();
                  updateInterceptorAttribute('firepower', 1);
                }}
                className={`w-7 h-7 flex items-center justify-center font-bold text-sm rounded border ${
                  isPapyrus ? 'bg-[#5C4033] text-[#FDF6E3]' : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                +
              </button>
              <button
                type="button"
                onClick={() => {
                  audio.playBlip();
                  updateInterceptorAttribute('firepower', -1);
                }}
                className={`w-7 h-7 flex items-center justify-center font-bold text-sm rounded border ${
                  isPapyrus ? 'bg-[#5C4033] text-[#FDF6E3]' : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                -
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={rollVehicleAttack}
            className={`w-full mt-2 py-1.5 px-3 rounded text-[11px] font-bold uppercase tracking-wider border flex items-center justify-center gap-1.5 cursor-pointer transition ${
              isPapyrus
                ? 'bg-[#5C4033] text-[#FDF6E3] hover:bg-[#8B4513]'
                : 'bg-orange-600/90 text-white hover:bg-orange-500 border-orange-400/40 shadow-sm'
            }`}
          >
            <Crosshair size={13} /> Atirar Metralhadora (2d6 + {firepower.current})
          </button>
        </div>

        {/* Blindagem */}
        <div
          className={`p-4 rounded-xl border flex flex-col justify-between ${
            isPapyrus
              ? 'bg-[#EAD8B8]/50 border-[#5C4033]/40'
              : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <Shield size={15} className="text-blue-500" /> Blindagem
            </span>
            <span className="text-[10px] opacity-70 font-sans font-bold">
              Inicial: {armour.initial}
            </span>
          </div>

          <div className="flex items-center justify-between my-2">
            <div className="text-3xl font-black">{armour.current}</div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  audio.playBlip();
                  updateInterceptorAttribute('armour', 1);
                }}
                className={`w-7 h-7 flex items-center justify-center font-bold text-sm rounded border ${
                  isPapyrus ? 'bg-[#5C4033] text-[#FDF6E3]' : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                +
              </button>
              <button
                type="button"
                onClick={() => {
                  audio.playBlip();
                  updateInterceptorAttribute('armour', -1);
                }}
                className={`w-7 h-7 flex items-center justify-center font-bold text-sm rounded border ${
                  isPapyrus ? 'bg-[#5C4033] text-[#FDF6E3]' : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                -
              </button>
            </div>
          </div>

          {/* Barra de integridade da blindagem */}
          <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full transition-all duration-300 ${
                armourPercent > 50
                  ? 'bg-emerald-500'
                  : armourPercent > 25
                  ? 'bg-amber-500'
                  : 'bg-red-600 animate-pulse'
              }`}
              style={{ width: `${Math.max(0, Math.min(100, armourPercent))}%` }}
            />
          </div>

          <button
            type="button"
            onClick={rollVehicleDamage}
            className={`w-full py-1.5 px-3 rounded text-[11px] font-bold uppercase tracking-wider border flex items-center justify-center gap-1.5 cursor-pointer transition ${
              isPapyrus
                ? 'bg-[#5C4033]/20 border-[#5C4033] text-[#2D1D16] hover:bg-[#5C4033]/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <Shield size={13} /> Rolar Dano no Alvo (1d6)
          </button>
        </div>
      </div>

      {/* Armas Secundárias e Equipamentos Especiais */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {/* MÍSSEIS */}
        <div
          className={`p-3 rounded-xl border flex flex-col justify-between ${
            isPapyrus ? 'bg-[#EAD8B8]/30 border-[#5C4033]/30' : 'bg-slate-900/40 border-slate-800'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider">Mísseis</span>
              <span className="text-xs font-black text-orange-500">{missiles}/4</span>
            </div>

            {/* Marcadores de 1 a 4 */}
            <div className="grid grid-cols-4 gap-1 mb-2">
              {[1, 2, 3, 4].map((num) => {
                const hasMissile = num <= missiles;
                return (
                  <div
                    key={num}
                    onClick={() => {
                      audio.playBlip();
                      if (hasMissile) {
                        updateInterceptorResource('missiles', -1);
                      } else {
                        updateInterceptorResource('missiles', 1);
                      }
                    }}
                    className={`h-7 rounded border flex items-center justify-center text-[10px] font-black cursor-pointer transition ${
                      hasMissile
                        ? 'bg-red-600 text-white border-red-500 shadow-sm'
                        : 'bg-transparent opacity-30 border-current'
                    }`}
                  >
                    🚀
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={fireMissile}
            disabled={missiles <= 0}
            className={`w-full py-1 text-[9px] font-black uppercase tracking-wider rounded border cursor-pointer transition disabled:opacity-30 ${
              isPapyrus
                ? 'bg-red-800 text-white hover:bg-red-900'
                : 'bg-red-600 hover:bg-red-500 text-white border-red-400/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
            }`}
          >
            Disparar (Kill)
          </button>
        </div>

        {/* CRAVOS DE FERRO */}
        <div
          className={`p-3 rounded-xl border flex flex-col justify-between ${
            isPapyrus ? 'bg-[#EAD8B8]/30 border-[#5C4033]/30' : 'bg-slate-900/40 border-slate-800'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider">Cravos</span>
              <span className="text-xs font-black text-amber-500">{spikes}/3</span>
            </div>

            <div className="grid grid-cols-3 gap-1 mb-2">
              {[1, 2, 3].map((num) => {
                const hasSpike = num <= spikes;
                return (
                  <div
                    key={num}
                    onClick={() => {
                      audio.playBlip();
                      updateInterceptorResource('spikes', hasSpike ? -1 : 1);
                    }}
                    className={`h-7 rounded border flex items-center justify-center text-xs cursor-pointer transition ${
                      hasSpike
                        ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                        : 'bg-transparent opacity-30 border-current'
                    }`}
                  >
                    ⭐
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (spikes > 0) {
                audio.playBlip();
                updateInterceptorResource('spikes', -1);
                addCombatLog({ type: 'Veículo', value: 'Cravos de ferro lançados na pista!' });
              }
            }}
            disabled={spikes <= 0}
            className={`w-full py-1 text-[9px] font-black uppercase tracking-wider rounded border cursor-pointer transition disabled:opacity-30 ${
              isPapyrus ? 'bg-[#5C4033] text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            Lançar Cravo
          </button>
        </div>

        {/* ÓLEO */}
        <div
          className={`p-3 rounded-xl border flex flex-col justify-between ${
            isPapyrus ? 'bg-[#EAD8B8]/30 border-[#5C4033]/30' : 'bg-slate-900/40 border-slate-800'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider">Óleo</span>
              <span className="text-xs font-black text-amber-600">{oil}/2</span>
            </div>

            <div className="grid grid-cols-2 gap-1 mb-2">
              {[1, 2].map((num) => {
                const hasOil = num <= oil;
                return (
                  <div
                    key={num}
                    onClick={() => {
                      audio.playBlip();
                      updateInterceptorResource('oil', hasOil ? -1 : 1);
                    }}
                    className={`h-7 rounded border flex items-center justify-center text-xs cursor-pointer transition ${
                      hasOil
                        ? 'bg-neutral-800 text-white border-neutral-600 shadow-sm'
                        : 'bg-transparent opacity-30 border-current'
                    }`}
                  >
                    🛢️
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (oil > 0) {
                audio.playBlip();
                updateInterceptorResource('oil', -1);
                addCombatLog({ type: 'Veículo', value: 'Óleo despejado na pista atrás do Interceptor!' });
              }
            }}
            disabled={oil <= 0}
            className={`w-full py-1 text-[9px] font-black uppercase tracking-wider rounded border cursor-pointer transition disabled:opacity-30 ${
              isPapyrus ? 'bg-[#5C4033] text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            Despejar Óleo
          </button>
        </div>

        {/* ESTEPES E COMBUSTÍVEL */}
        <div
          className={`p-3 rounded-xl border flex flex-col justify-between ${
            isPapyrus ? 'bg-[#EAD8B8]/30 border-[#5C4033]/30' : 'bg-slate-900/40 border-slate-800'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <Disc size={11} /> Estepes
              </span>
              <span className="text-xs font-black">{spareTires}/2</span>
            </div>

            <div className="flex items-center gap-1 justify-center mb-2">
              {[1, 2].map((num) => {
                const hasTire = num <= spareTires;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      audio.playBlip();
                      updateInterceptorResource('spareTires', hasTire ? -1 : 1);
                    }}
                    className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs transition ${
                      hasTire
                        ? 'bg-zinc-800 text-white border-zinc-600 ring-1 ring-zinc-500'
                        : 'bg-transparent opacity-30 border-current'
                    }`}
                  >
                    🛞
                  </button>
                );
              })}
            </div>

            <div className="border-t border-current/15 pt-1.5 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase flex items-center gap-1">
                <Fuel size={11} className="text-amber-500" /> Galões
              </span>
              <div className="flex items-center gap-1 font-black text-xs">
                <span>{fuel}</span>
                <button
                  type="button"
                  onClick={() => {
                    audio.playBlip();
                    updateInterceptorResource('fuel', 1);
                  }}
                  className="w-4 h-4 rounded bg-current/10 flex items-center justify-center text-[10px]"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audio.playBlip();
                    updateInterceptorResource('fuel', -1);
                  }}
                  className="w-4 h-4 rounded bg-current/10 flex items-center justify-center text-[10px]"
                >
                  -
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Caixa de Modificações do Interceptor */}
      <div
        className={`p-3.5 rounded-xl border ${
          isPapyrus ? 'bg-[#EAD8B8]/40 border-[#5C4033]/30' : 'bg-slate-900/50 border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
            <Wrench size={14} className="text-amber-500" /> Modificações do Veículo
          </span>
          <span className="text-[10px] opacity-60 font-sans">
            Melhorias, turbo, blindagens e armas adicionais
          </span>
        </div>
        <textarea
          rows={2}
          value={modifications}
          onChange={(e) => setInterceptorModifications(e.target.value)}
          placeholder="Ex: Turbo compressor instalado, aríete dianteiro reforçado, pneus à prova de balas..."
          className={`w-full p-2 text-xs rounded border transition font-sans ${
            isPapyrus
              ? 'bg-[#FDF6E3] border-[#5C4033]/40 text-[#2D1D16] focus:border-[#5C4033]'
              : 'bg-slate-950 border-slate-700 text-slate-200 focus:border-orange-500'
          }`}
        />
      </div>
    </div>
  );
};
