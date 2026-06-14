'use client';

import { useState, useEffect } from 'react';
import { useSheetStore } from '@/store/useSheetStore';
import { getBookIntro } from '@/lib/bookIntros';
import { audio } from '@/lib/audio';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Dices, Shield, Heart, Clover } from 'lucide-react';

export const CharacterCreation = () => {
  const {
    theme,
    gamebook,
    setAttribute,
    addCombatLog,
    saveToSupabase,
    logTelemetry,
    setSuperpower,
    updateHeroPoints,
    updateClues,
  } = useSheetStore();
  
  const isMedo = gamebook === 'Encontro Marcado com o M.E.D.O.';
  
  // Selected superpower for MEDO
  const [selectedPower, setSelectedPower] = useState<'superforca' | 'psi' | 'hta' | 'rajada' | null>(null);

  // Rolled attributes (null means unrolled)
  const [rolledSkill, setRolledSkill] = useState<number | null>(null);
  const [rolledEnergy, setRolledEnergy] = useState<number | null>(null);
  const [rolledLuck, setRolledLuck] = useState<number | null>(null);

  // Rolling states
  const [rollingSkill, setRollingSkill] = useState(false);
  const [rollingEnergy, setRollingEnergy] = useState(false);
  const [rollingLuck, setRollingLuck] = useState(false);

  // Display values during rolling animation
  const [displaySkill, setDisplaySkill] = useState(0);
  const [displayEnergy, setDisplayEnergy] = useState(0);
  const [displayLuck, setDisplayLuck] = useState(0);

  const isPapyrus = theme === 'papyrus';
  
  const introText = getBookIntro(gamebook);

  // Effect to handle superpower specific Skill value
  useEffect(() => {
    if (isMedo) {
      if (selectedPower === 'superforca') {
        setRolledSkill(13);
        setDisplaySkill(13);
      } else if (rolledSkill === 13) {
        setRolledSkill(null);
        setDisplaySkill(0);
      }
    }
  }, [selectedPower, isMedo, rolledSkill]);

  // Sound and rolling animation for Skill
  const rollSkill = () => {
    if (rollingSkill || rolledSkill !== null) return;
    setRollingSkill(true);
    audio.playDiceRoll();

    const interval = setInterval(() => {
      setDisplaySkill(Math.floor(Math.random() * 6) + 1 + 6);
    }, 60);

    setTimeout(() => {
      clearInterval(interval);
      const finalVal = Math.floor(Math.random() * 6) + 1 + 6; // 1d6 + 6
      setRolledSkill(finalVal);
      setDisplaySkill(finalVal);
      setRollingSkill(false);
      audio.playCoin();
    }, 600);
  };

  // Sound and rolling animation for Energy
  const rollEnergy = () => {
    if (rollingEnergy || rolledEnergy !== null) return;
    setRollingEnergy(true);
    audio.playDiceRoll();

    const interval = setInterval(() => {
      const displayVal = isMedo
        ? (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1) + 12
        : Math.floor(Math.random() * 6) + 1 + 12;
      setDisplayEnergy(displayVal);
    }, 60);

    setTimeout(() => {
      clearInterval(interval);
      const finalVal = isMedo
        ? (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1) + 12
        : Math.floor(Math.random() * 6) + 1 + 12; // 1d6 + 12 or 2d6 + 12 for MEDO
      setRolledEnergy(finalVal);
      setDisplayEnergy(finalVal);
      setRollingEnergy(false);
      audio.playCoin();
    }, 600);
  };

  // Sound and rolling animation for Luck
  const rollLuck = () => {
    if (rollingLuck || rolledLuck !== null) return;
    setRollingLuck(true);
    audio.playDiceRoll();

    const interval = setInterval(() => {
      setDisplayLuck(Math.floor(Math.random() * 6) + 1 + 6);
    }, 60);

    setTimeout(() => {
      clearInterval(interval);
      const finalVal = Math.floor(Math.random() * 6) + 1 + 6; // 1d6 + 6
      setRolledLuck(finalVal);
      setDisplayLuck(finalVal);
      setRollingLuck(false);
      audio.playCoin();
    }, 600);
  };

  const handleStartAdventure = async () => {
    if (isMedo && !selectedPower) {
      alert('Por favor, escolha um superpoder primeiro!');
      return;
    }
    if (rolledSkill === null || rolledEnergy === null || rolledLuck === null) return;

    // Play retro victory fanfare
    audio.playVictory();

    // Store attributes (initial & current)
    setAttribute('skill', rolledSkill, true);
    setAttribute('skill', rolledSkill, false);
    setAttribute('energy', rolledEnergy, true);
    setAttribute('energy', rolledEnergy, false);
    setAttribute('luck', rolledLuck, true);
    setAttribute('luck', rolledLuck, false);

    if (isMedo && selectedPower) {
      setSuperpower(selectedPower);
      updateHeroPoints(0);
      updateClues({ local: '', dia: '', horario: '', lider: '', outras: '' });
    }

    // Add log
    const powerStr = isMedo ? ` | Poder: ${selectedPower === 'superforca' ? 'Superforça' : selectedPower === 'psi' ? 'Psi' : selectedPower === 'hta' ? 'HTA' : 'Rajada'}` : '';
    addCombatLog({
      type: 'Aventura',
      value: `Jornada iniciada! Hab: ${rolledSkill}, Ener: ${rolledEnergy}, Luck: ${rolledLuck}${powerStr}`,
    });

    // Log telemetry
    await logTelemetry('character_creation', {
      skill: rolledSkill,
      energy: rolledEnergy,
      luck: rolledLuck,
      superpower: isMedo ? selectedPower : undefined,
    });

    // Save state to Supabase
    await saveToSupabase();
  };

  const allRolled = rolledSkill !== null && rolledEnergy !== null && rolledLuck !== null && (!isMedo || selectedPower !== null);

  // Aesthetic styling classes depending on theme
  const containerStyle = isPapyrus
    ? 'border-4 border-[#5C4033] bg-[#FDF6E3] text-[#2D1D16] shadow-[-12px_12px_0px_rgba(0,0,0,0.15)] p-6 sm:p-10 font-serif'
    : 'border border-cyan-500/30 bg-slate-950/60 backdrop-blur-md text-slate-100 shadow-[0_0_50px_rgba(6,182,212,0.1)] p-6 sm:p-10 font-sans rounded-2xl';

  const titleStyle = isPapyrus
    ? 'text-3xl sm:text-4xl font-extrabold uppercase tracking-widest text-[#5C4033] text-center mb-6'
    : 'text-3xl sm:text-4xl font-bold uppercase tracking-widest bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent text-center mb-6';

  const introCardStyle = isPapyrus
    ? 'border-2 border-[#5C4033]/40 bg-[#EAD8B8]/20 p-5 sm:p-6 mb-8 text-justify italic leading-relaxed text-[#5C4033]/90 text-sm sm:text-base border-dashed relative shadow-inner'
    : 'border border-slate-800 bg-slate-900/40 p-5 sm:p-6 mb-8 text-justify italic leading-relaxed text-slate-300 text-sm sm:text-base rounded-xl relative shadow-inner';

  const attributeCardStyle = (rolled: boolean, rolling: boolean) => {
    const base = 'flex flex-col items-center justify-between p-4 border-2 text-center transition-all duration-300 ';
    if (isPapyrus) {
      if (rolling) return base + 'border-yellow-600 bg-[#EAD8B8]/40 scale-105 shadow-md animate-pulse';
      if (rolled) return base + 'border-[#5C4033] bg-[#EAD8B8]/20 shadow-md';
      return base + 'border-dashed border-[#5C4033]/40 bg-transparent hover:border-[#5C4033] cursor-pointer';
    } else {
      if (rolling) return base + 'border-cyan-400 bg-cyan-950/20 scale-105 shadow-[0_0_15px_rgba(34,211,238,0.2)] rounded-xl animate-pulse';
      if (rolled) return base + 'border-slate-700 bg-slate-900/60 rounded-xl shadow-lg';
      return base + 'border-dashed border-slate-800 bg-transparent hover:border-slate-600 cursor-pointer rounded-xl';
    }
  };

  const buttonStyle = isPapyrus
    ? 'w-full py-2.5 px-4 bg-[#2C1E14] text-[#EAD8B8] hover:bg-[#5C4033] font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm cursor-pointer'
    : 'w-full py-2.5 px-4 bg-slate-800 text-slate-200 hover:bg-slate-700 font-bold text-xs uppercase tracking-wider transition-all duration-200 rounded-lg shadow-sm cursor-pointer';

  return (
    <div className={`${containerStyle} max-w-[800px] mx-auto my-4 animate-fade-in`}>
      {/* Narrative Section Header */}
      <h2 className={titleStyle}>
        ⚔️ {gamebook}
      </h2>

      {/* Narrative Scroll / Card */}
      <div className={introCardStyle}>
        <span className={`absolute -top-3 left-4 px-2 text-xs font-bold uppercase tracking-wider ${isPapyrus ? 'bg-[#FDF6E3] text-[#C5A059]' : 'bg-slate-950 text-cyan-400 font-mono'}`}>
          Introdução
        </span>
        <p className="indent-6 font-serif">
          {introText}
        </p>
      </div>

      <div className="w-full h-[1px] bg-current opacity-10 mb-8"></div>

      {/* Superpower Selection for M.E.D.O. */}
      {isMedo && (
        <div className="mb-8">
          <div className="text-center mb-6">
            <h3 className={`text-lg uppercase font-bold tracking-widest ${isPapyrus ? 'text-[#2D1D16]' : 'text-slate-200'}`}>
              Escolha seu Superpoder
            </h3>
            <p className={`text-xs mt-1 ${isPapyrus ? 'text-[#5C4033]/70' : 'text-slate-400 font-sans'}`}>
              Cada poder oferece uma mecânica única e um caminho diferente na história.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                id: 'superforca',
                name: 'Superforça & Voo',
                desc: 'Habilidade de lutar ampliada (Habilidade inicial trava em 13) e capacidade de voar para perseguições terrestres ou aéreas.',
              },
              {
                id: 'psi',
                name: 'Poderes Psi',
                desc: 'Capacidade de ler mentes e mover objetos mentalmente. Cada uso consome 2 de Energia.',
              },
              {
                id: 'hta',
                name: 'Habilidade Tecnológica Avançada (HTA)',
                desc: 'Diversos dispositivos de alta tecnologia em seu Cinto de Utilidades.',
              },
              {
                id: 'rajada',
                name: 'Rajada de Energia',
                desc: 'Canalize energia eletrostática pelas mãos para tontear adversários humanos. Cada uso consome 2 de Energia.',
              },
            ].map((p) => {
              const isSelected = selectedPower === p.id;
              const cardClass = isSelected
                ? isPapyrus
                  ? 'border-2 border-[#5C4033] bg-[#EAD8B8]/40 shadow-md scale-[1.02]'
                  : 'border-2 border-cyan-400 bg-cyan-950/20 shadow-[0_0_15px_rgba(34,211,238,0.2)] rounded-xl scale-[1.02]'
                : isPapyrus
                  ? 'border border-[#5C4033]/30 bg-transparent hover:border-[#5C4033]/70 hover:bg-[#EAD8B8]/10'
                  : 'border border-slate-800 bg-transparent hover:border-slate-600 rounded-xl hover:bg-slate-900/30';
              
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPower(p.id as any)}
                  className={`p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between ${cardClass}`}
                >
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      {isSelected && '⚡'} {p.name}
                    </h4>
                    <p className={`text-xs ${isPapyrus ? 'text-[#5C4033]/80' : 'text-slate-400 font-sans'} leading-normal`}>
                      {p.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="w-full h-[1px] bg-current opacity-10 mt-8 mb-4"></div>
        </div>
      )}

      {/* Attribute Rolling Setup */}
      <div className="text-center mb-8">
        <h3 className={`text-lg uppercase font-bold tracking-widest ${isPapyrus ? 'text-[#2D1D16]' : 'text-slate-200'}`}>
          Determine Seus Atributos Iniciais
        </h3>
        <p className={`text-xs mt-1 ${isPapyrus ? 'text-[#5C4033]/70' : 'text-slate-400 font-sans'}`}>
          Role os dados para determinar seus valores de partida.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {/* SKILL (Habilidade) Card */}
        <div 
          onClick={
            rolledSkill === null &&
            !(isMedo && !selectedPower) &&
            !(isMedo && selectedPower === 'superforca')
              ? rollSkill
              : undefined
          }
          className={attributeCardStyle(rolledSkill !== null, rollingSkill)}
        >
          <div className="flex items-center gap-1.5 justify-center mb-1">
            <Shield size={16} className={isPapyrus ? 'text-[#8B4513]' : 'text-cyan-400'} />
            <span className="text-xs uppercase font-extrabold tracking-wider">Habilidade</span>
          </div>

          <div className="my-4 h-16 flex items-center justify-center">
            {rollingSkill ? (
              <span className="text-4xl font-extrabold animate-bounce">{displaySkill}</span>
            ) : rolledSkill !== null ? (
              <motion.span 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl font-extrabold"
              >
                {rolledSkill}
              </motion.span>
            ) : (
              <Dices size={36} className={`opacity-40 ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-400'}`} />
            )}
          </div>

          {isMedo && selectedPower === 'superforca' ? (
            <div className="text-[10px] uppercase font-bold tracking-wider text-green-600 dark:text-cyan-400">Superforça ativa</div>
          ) : rolledSkill !== null ? (
            <div className="text-[10px] uppercase font-bold tracking-wider opacity-60">Dado + 6</div>
          ) : (
            <button 
              onClick={(e) => { e.stopPropagation(); rollSkill(); }}
              className={buttonStyle}
              disabled={rollingSkill || (isMedo && !selectedPower)}
            >
              Role 1d6+6
            </button>
          )}
        </div>

        {/* ENERGY (Energia) Card */}
        <div 
          onClick={rolledEnergy === null && !(isMedo && !selectedPower) ? rollEnergy : undefined}
          className={attributeCardStyle(rolledEnergy !== null, rollingEnergy)}
        >
          <div className="flex items-center gap-1.5 justify-center mb-1">
            <Heart size={16} className={isPapyrus ? 'text-[#8B0000]' : 'text-red-400'} />
            <span className="text-xs uppercase font-extrabold tracking-wider">Energia</span>
          </div>

          <div className="my-4 h-16 flex items-center justify-center">
            {rollingEnergy ? (
              <span className="text-4xl font-extrabold animate-bounce">{displayEnergy}</span>
            ) : rolledEnergy !== null ? (
              <motion.span 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl font-extrabold"
              >
                {rolledEnergy}
              </motion.span>
            ) : (
              <Dices size={36} className={`opacity-40 ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-400'}`} />
            )}
          </div>

          {rolledEnergy !== null ? (
            <div className="text-[10px] uppercase font-bold tracking-wider opacity-60">
              {isMedo ? '2 Dados + 12' : 'Dado + 12'}
            </div>
          ) : (
            <button 
              onClick={(e) => { e.stopPropagation(); rollEnergy(); }}
              className={buttonStyle}
              disabled={rollingEnergy || (isMedo && !selectedPower)}
            >
              {isMedo ? 'Role 2d6+12' : 'Role 1d6+12'}
            </button>
          )}
        </div>

        {/* LUCK (Sorte) Card */}
        <div 
          onClick={rolledLuck === null && !(isMedo && !selectedPower) ? rollLuck : undefined}
          className={attributeCardStyle(rolledLuck !== null, rollingLuck)}
        >
          <div className="flex items-center gap-1.5 justify-center mb-1">
            <Clover size={16} className={isPapyrus ? 'text-[#006400]' : 'text-green-400'} />
            <span className="text-xs uppercase font-extrabold tracking-wider">Sorte</span>
          </div>

          <div className="my-4 h-16 flex items-center justify-center">
            {rollingLuck ? (
              <span className="text-4xl font-extrabold animate-bounce">{displayLuck}</span>
            ) : rolledLuck !== null ? (
              <motion.span 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl font-extrabold"
              >
                {rolledLuck}
              </motion.span>
            ) : (
              <Dices size={36} className={`opacity-40 ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-400'}`} />
            )}
          </div>

          {rolledLuck !== null ? (
            <div className="text-[10px] uppercase font-bold tracking-wider opacity-60">Dado + 6</div>
          ) : (
            <button 
              onClick={(e) => { e.stopPropagation(); rollLuck(); }}
              className={buttonStyle}
              disabled={rollingLuck || (isMedo && !selectedPower)}
            >
              Role 1d6+6
            </button>
          )}
        </div>
      </div>

      {/* Start Adventure Action Trigger */}
      <AnimatePresence>
        {allRolled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-3 mt-6 pt-4 border-t border-current/10"
          >
            <button
              onClick={handleStartAdventure}
              className={`flex items-center justify-center gap-2.5 px-8 py-4 uppercase font-bold text-sm tracking-widest shadow-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
                isPapyrus
                  ? 'border-2 border-[#5C4033] bg-[#5C4033] text-[#EAD8B8] hover:bg-[#2C1E14]'
                  : 'border border-cyan-500 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/30 rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.2)]'
              }`}
            >
              <Sparkles size={16} className="animate-spin-slow" />
              <span>Iniciar Aventura</span>
            </button>
            <p className={`text-[10px] uppercase tracking-wider opacity-75 ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-400 font-mono'}`}>
              Os portões do destino estão abertos
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
