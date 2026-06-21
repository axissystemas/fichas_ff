'use client';

import { useState } from 'react';
import { useSheetStore } from '@/store/useSheetStore';
import { audio } from '@/lib/audio';
import { Zap, Brain, ShieldAlert, Cpu, Clock, Save } from 'lucide-react';

export const MedoTracker = () => {
  const {
    theme,
    attributes,
    setAttribute,
    updateHeroPoints,
    advanceTime,
    updateClues,
    addCombatLog,
    saveToSupabase,
    getModifiedAttribute,
  } = useSheetStore();

  const isPapyrus = theme === 'papyrus';
  const isMedo = useSheetStore(state => state.gamebook) === 'Encontro Marcado com o M.E.D.O.';

  const superpower = attributes.superpower;
  const heroPoints = attributes.heroPoints || 0;
  const timeDay = attributes.timeDay || 1;
  const timePeriod = attributes.timePeriod || 'manha';
  const clues = attributes.clues || { local: '', dia: '', horario: '', lider: '', outras: '' };

  const [localClue, setLocalClue] = useState(clues.local);
  const [diaClue, setDiaClue] = useState(clues.dia);
  const [horarioClue, setHorarioClue] = useState(clues.horario);
  const [liderClue, setLiderClue] = useState(clues.lider);
  const [outrasClue, setOutrasClue] = useState(clues.outras);

  const [blastResult, setBlastResult] = useState<string | null>(null);
  const [rollingBlast, setRollingBlast] = useState(false);

  if (!isMedo) return null;

  const containerClasses = isPapyrus
    ? 'border-2 border-[#5C4033] bg-[#FDF6E3] text-[#2D1D16] p-6 shadow-[-8px_8px_0px_rgba(0,0,0,0.15)] font-serif'
    : 'border border-cyan-500/30 bg-slate-950/60 backdrop-blur-md text-slate-100 p-6 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.1)] font-sans';

  const cardClasses = isPapyrus
    ? 'border-2 border-[#5C4033]/50 bg-[#EAD8B8]/25 p-4 shadow-sm'
    : 'border border-slate-800 bg-slate-900/40 p-4 rounded-xl shadow-inner';

  const titleClasses = isPapyrus
    ? 'text-base font-extrabold uppercase tracking-wider text-[#5C4033] mb-3 border-b border-[#5C4033]/30 pb-1'
    : 'text-base font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-3 border-b border-slate-800 pb-1';

  const buttonClasses = isPapyrus
    ? 'px-3 py-1.5 bg-[#2C1E14] text-[#EAD8B8] hover:bg-[#5C4033] font-bold text-xs uppercase tracking-wider transition duration-150 shadow-sm cursor-pointer border border-[#2C1E14] disabled:opacity-50'
    : 'px-3 py-1.5 bg-slate-800 text-slate-200 hover:bg-slate-700 font-bold text-xs uppercase tracking-wider transition duration-150 rounded-lg shadow-sm cursor-pointer border border-slate-700 disabled:opacity-50';

  const inputClasses = isPapyrus
    ? 'w-full bg-[#FDF6E3] border border-[#5C4033] text-[#2D1D16] px-2.5 py-1 text-sm font-serif focus:outline-none focus:ring-1 focus:ring-[#C5A059]'
    : 'w-full bg-slate-950/60 border border-slate-800 text-slate-200 px-2.5 py-1 rounded text-sm font-sans focus:outline-none focus:ring-1 focus:ring-cyan-500';

  const handleUsePsi = () => {
    if (attributes.energy.current <= 2) {
      alert('Sua energia está muito baixa para usar Poderes Psi!');
      return;
    }
    audio.playBlip();
    setAttribute('energy', attributes.energy.current - 2, false);
    addCombatLog({
      type: 'Poder',
      value: 'Poderes Psi ativados mentalmente (-2 Energia)'
    });
  };

  const handleUseBlast = () => {
    if (attributes.energy.current <= 2) {
      alert('Sua energia está muito baixa para disparar uma Rajada de Energia!');
      return;
    }
    if (rollingBlast) return;

    audio.playDiceRoll();
    setRollingBlast(true);
    setBlastResult('Mirando...');

    setTimeout(() => {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const total = d1 + d2;
      const skill = getModifiedAttribute('skill');

      const hit = total <= skill;
      setAttribute('energy', attributes.energy.current - 2, false);

      if (hit) {
        setBlastResult(`Acertou! Rolado: ${total} (Hab: ${skill})`);
        addCombatLog({
          type: 'Poder',
          value: `Rajada de Energia acertou e tonteou o alvo! [Rolado: ${total} vs Hab: ${skill}] (-2 Energia)`
        });
        audio.playCoin();
      } else {
        setBlastResult(`Errou! Rolado: ${total} (Hab: ${skill})`);
        addCombatLog({
          type: 'Poder',
          value: `Rajada de Energia errou o alvo! [Rolado: ${total} vs Hab: ${skill}] (-2 Energia)`
        });
      }
      setRollingBlast(false);
    }, 800);
  };

  const handleSaveClues = async () => {
    updateClues({
      local: localClue,
      dia: diaClue,
      horario: horarioClue,
      lider: liderClue,
      outras: outrasClue,
    });
    await saveToSupabase();
  };

  const handleAdvanceTime = () => {
    audio.playBlip();
    advanceTime();
    
    // Log the time passage
    const daysMap = { 1: 'Segunda-feira', 2: 'Terça-feira', 3: 'Quarta-feira' };
    const periodMap = { manha: 'Manhã', tarde: 'Tarde', noite: 'Noite' };
    
    setTimeout(() => {
      const storeState = useSheetStore.getState();
      const newDay = storeState.attributes.timeDay || 1;
      const newPeriod = storeState.attributes.timePeriod || 'manha';
      addCombatLog({
        type: 'Tempo',
        value: `Tempo avançado para ${daysMap[newDay as 1 | 2 | 3]} (${periodMap[newPeriod]})`
      });
    }, 100);
  };

  const daysLabels = { 1: 'Segunda-feira (Dia 1)', 2: 'Terça-feira (Dia 2)', 3: 'Quarta-feira (Dia 3)' };
  const periodLabels = { manha: '☀️ Manhã', tarde: '⛅ Tarde', noite: '🌙 Noite' };

  return (
    <div className={`${containerClasses} space-y-6`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3 border-current/10">
        <div className="flex items-center gap-2.5">
          <Zap size={20} className={isPapyrus ? 'text-[#8B4513]' : 'text-cyan-400 animate-pulse'} />
          <h2 className="text-lg font-bold uppercase tracking-wider">Painel do Super-Herói</h2>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 border border-current/20 font-bold ${isPapyrus ? 'bg-[#EAD8B8]/30' : 'bg-slate-950/40 rounded-lg'}`}>
          <span className="text-xs uppercase opacity-70">Pontos de Herói:</span>
          <span className={`text-base font-extrabold ${isPapyrus ? 'text-red-800' : 'text-cyan-400 font-mono'}`}>{heroPoints}</span>
          <div className="flex flex-col ml-2 gap-0.5 scale-90">
            <button 
              onClick={() => { audio.playBlip(); updateHeroPoints(1); }}
              className="text-[10px] hover:text-cyan-400 font-bold leading-none cursor-pointer"
            >
              ▲
            </button>
            <button 
              onClick={() => { audio.playBlip(); updateHeroPoints(-1); }}
              className="text-[10px] hover:text-cyan-400 font-bold leading-none cursor-pointer"
            >
              ▼
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Superpower & Relógio do Crime */}
        <div className="space-y-6">
          {/* Superpower Card */}
          <div className={cardClasses}>
            <h3 className={titleClasses}>Poder Ativo</h3>
            {superpower === 'superforca' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold uppercase text-sm">
                  <ShieldAlert size={18} />
                  <span>Superforça & Voo</span>
                </div>
                <p className="text-xs opacity-80 leading-relaxed font-sans">
                  Sua Habilidade inicial está travada em 13. Você pode erguer objetos maciços e voar em altas velocidades por Titan City.
                </p>
              </div>
            )}
            {superpower === 'psi' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold uppercase text-sm">
                  <Brain size={18} />
                  <span>Poderes Psi</span>
                </div>
                <p className="text-xs opacity-80 leading-relaxed font-sans">
                  Capacidade de ler pensamentos alheios e mover objetos mentalmente. Exige esforço e drena energia.
                </p>
                <button
                  onClick={handleUsePsi}
                  className={`${buttonClasses} w-full flex items-center justify-center gap-2`}
                >
                  <Brain size={14} /> Usar Poder Psi (-2 Energia)
                </button>
              </div>
            )}
            {superpower === 'hta' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold uppercase text-sm">
                  <Cpu size={18} />
                  <span>Habilidade Tecnológica Avançada (HTA)</span>
                </div>
                <p className="text-xs opacity-80 leading-relaxed font-sans">
                  Você carrega um Cinto de Utilidades com mini-quinquilharias científicas para decodificar, rastrear e neutralizar obstáculos.
                </p>
                <div className="bg-slate-950/20 dark:bg-slate-900/60 p-2 rounded text-[11px] font-mono opacity-80">
                  Cinto: Rastreador, Decodificador, Laser Utilitário, Computador de Pulso.
                </div>
              </div>
            )}
            {superpower === 'rajada' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold uppercase text-sm">
                  <Zap size={18} />
                  <span>Rajada de Energia</span>
                </div>
                <p className="text-xs opacity-80 leading-relaxed font-sans">
                  Concentre energia estática nas pontas dos dedos e dispare. Se acertar o oponente humano, ele será tonteado automaticamente.
                </p>
                
                <div className="flex gap-2 items-center">
                  <button
                    onClick={handleUseBlast}
                    disabled={rollingBlast}
                    className={`${buttonClasses} flex-1 flex items-center justify-center gap-2`}
                  >
                    <Zap size={14} /> Disparar Rajada (-2 Energia)
                  </button>
                  {blastResult && (
                    <span className={`text-xs font-bold font-mono px-2 py-1 bg-slate-950/30 rounded ${
                      blastResult.includes('Acertou') ? 'text-green-500' : blastResult.includes('Errou') ? 'text-red-500' : 'text-slate-400'
                    }`}>
                      {blastResult}
                    </span>
                  )}
                </div>
              </div>
            )}
            {!superpower && (
              <p className="text-xs italic text-red-500 font-sans">Nenhum superpoder selecionado. Crie uma nova ficha.</p>
            )}
          </div>

          {/* Crime Watch / Relógio do Crime */}
          <div className={cardClasses}>
            <h3 className={titleClasses}>Relógio do Crime</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-sm uppercase">
                  <Clock size={16} className="text-cyan-500" />
                  <span>{daysLabels[timeDay as 1 | 2 | 3] || 'Desconhecido'}</span>
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Período: <span className={isPapyrus ? 'text-[#8B4513]' : 'text-cyan-400'}>{periodLabels[timePeriod as 'manha' | 'tarde' | 'noite'] || timePeriod}</span>
                </p>
              </div>
              <button
                onClick={handleAdvanceTime}
                className={`${buttonClasses} flex items-center gap-1.5`}
              >
                <Clock size={12} /> Avançar Período
              </button>
            </div>
            <p className="text-[10px] opacity-65 leading-relaxed font-sans mt-3 border-t border-current/5 pt-2">
              Nota: O herói possui apenas **3 dias** para coletar pistas e impedir a grande reunião do M.E.D.O.! Gerencie seu tempo.
            </p>
          </div>
        </div>

        {/* Right Column: Clues */}
        <div className={cardClasses}>
          <div className="flex items-center justify-between mb-3 border-b border-current/10 pb-1">
            <h3 className={titleClasses + ' !mb-0 !border-0'}>Pistas do M.E.D.O.</h3>
            <button
              onClick={handleSaveClues}
              className="p-1 border border-transparent hover:border-current rounded hover:text-cyan-400 transition cursor-pointer"
              title="Salvar Pistas"
            >
              <Save size={16} />
            </button>
          </div>
          <div className="space-y-3 font-sans">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider opacity-70">Local do Encontro:</label>
              <input
                type="text"
                placeholder="Ex: Jato Executivo, Galpão 4..."
                value={localClue}
                onChange={(e) => setLocalClue(e.target.value)}
                onBlur={handleSaveClues}
                className={inputClasses}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider opacity-70">Dia do Encontro:</label>
                <input
                  type="text"
                  placeholder="Ex: Quarta-feira..."
                  value={diaClue}
                  onChange={(e) => setDiaClue(e.target.value)}
                  onBlur={handleSaveClues}
                  className={inputClasses}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider opacity-70">Horário:</label>
                <input
                  type="text"
                  placeholder="Ex: 20:00..."
                  value={horarioClue}
                  onChange={(e) => setHorarioClue(e.target.value)}
                  onBlur={handleSaveClues}
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider opacity-70">Líder do M.E.D.O.:</label>
              <input
                type="text"
                placeholder="Ex: Vladimir Utoshski (Ciborg Titânio)..."
                value={liderClue}
                onChange={(e) => setLiderClue(e.target.value)}
                onBlur={handleSaveClues}
                className={inputClasses}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider opacity-70">Outras Anotações / Pistas:</label>
              <textarea
                placeholder="Ex: Bronski capturado no Parque Audubon..."
                value={outrasClue}
                onChange={(e) => setOutrasClue(e.target.value)}
                onBlur={handleSaveClues}
                rows={3}
                className={inputClasses + ' resize-none'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
