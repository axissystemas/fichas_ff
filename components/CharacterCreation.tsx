'use client';

import { useState, useEffect } from 'react';
import { useSheetStore } from '@/store/useSheetStore';
import { getBookIntro } from '@/lib/bookIntros';
import { audio } from '@/lib/audio';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Dices, Shield, Heart, Clover, Flame } from 'lucide-react';

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
    setSpells,
    gold,
    provisions,
    updateGold,
    updateProvisions,
  } = useSheetStore();
  
  const isMedo = gamebook === 'Encontro Marcado com o M.E.D.O.';
  const isCidadela = gamebook === 'A Cidadela do Caos';
  const isVampiro = gamebook === 'A Cripta do Vampiro';
  const isMansao = gamebook === 'A Mansão do Inferno';
  
  // Selected superpower for MEDO
  const [selectedPower, setSelectedPower] = useState<'superforca' | 'psi' | 'hta' | 'rajada' | null>(null);

  // Rolled attributes (null means unrolled)
  const [rolledSkill, setRolledSkill] = useState<number | null>(null);
  const [rolledEnergy, setRolledEnergy] = useState<number | null>(null);
  const [rolledLuck, setRolledLuck] = useState<number | null>(null);
  const [rolledMagic, setRolledMagic] = useState<number | null>(null);
  const [rolledFaith, setRolledFaith] = useState<number | null>(null);
  const [rolledFear, setRolledFear] = useState<number | null>(null);

  // Rolling states
  const [rollingSkill, setRollingSkill] = useState(false);
  const [rollingEnergy, setRollingEnergy] = useState(false);
  const [rollingLuck, setRollingLuck] = useState(false);
  const [rollingMagic, setRollingMagic] = useState(false);
  const [rollingFaith, setRollingFaith] = useState(false);
  const [rollingFear, setRollingFear] = useState(false);

  // Display values during rolling animation
  const [displaySkill, setDisplaySkill] = useState(0);
  const [displayEnergy, setDisplayEnergy] = useState(0);
  const [displayLuck, setDisplayLuck] = useState(0);
  const [displayMagic, setDisplayMagic] = useState(0);
  const [displayFaith, setDisplayFaith] = useState(0);
  const [displayFear, setDisplayFear] = useState(0);

  // Selected spells for Cidadela
  const [selectedSpells, setSelectedSpells] = useState<Record<string, number>>({});

  const isPapyrus = theme === 'papyrus';
  
  const introText = getBookIntro(gamebook);



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
      const displayVal = (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1) + 12;
      setDisplayEnergy(displayVal);
    }, 60);

    setTimeout(() => {
      clearInterval(interval);
      const finalVal = (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1) + 12; // 2d6 + 12 para todos os livros
      setRolledEnergy(finalVal);
      setDisplayEnergy(finalVal);
      setRollingEnergy(false);
      audio.playCoin();
    }, 600);
  };

  // Sound and rolling animation for Faith (Fé)
  const rollFaith = () => {
    if (rollingFaith || rolledFaith !== null) return;
    setRollingFaith(true);
    audio.playDiceRoll();

    const interval = setInterval(() => {
      setDisplayFaith(Math.floor(Math.random() * 6) + 1 + 3);
    }, 60);

    setTimeout(() => {
      clearInterval(interval);
      const finalVal = Math.floor(Math.random() * 6) + 1 + 3; // 1d6 + 3
      setRolledFaith(finalVal);
      setDisplayFaith(finalVal);
      setRollingFaith(false);
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

  // Sound and rolling animation for Magic
  const rollMagic = () => {
    if (rollingMagic || rolledMagic !== null) return;
    setRollingMagic(true);
    audio.playDiceRoll();

    const interval = setInterval(() => {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      setDisplayMagic(d1 + d2 + 6);
    }, 60);

    setTimeout(() => {
      clearInterval(interval);
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const finalVal = d1 + d2 + 6; // 2d6 + 6
      setRolledMagic(finalVal);
      setDisplayMagic(finalVal);
      setRollingMagic(false);
      audio.playCoin();
    }, 600);
  };

    const rollFear = () => {
      if (rollingFear || rolledFear !== null) return;
      setRollingFear(true);
      audio.playDiceRoll();

      const interval = setInterval(() => {
        setDisplayFear(Math.floor(Math.random() * 6) + 1 + 6);
      }, 60);

      setTimeout(() => {
        clearInterval(interval);
        const finalVal = Math.floor(Math.random() * 6) + 1 + 6; // 1d6 + 6
        setRolledFear(finalVal);
        setDisplayFear(finalVal);
        setRollingFear(false);
        audio.playCoin();
      }, 600);
    };

  const handleAdjustSpell = (spellKey: string, delta: number) => {
    const currentCount = selectedSpells[spellKey] || 0;
    const newCount = currentCount + delta;
    if (newCount < 0) return;

    const spentPoints = Object.values(selectedSpells).reduce((sum, val) => sum + val, 0);
    const remaining = (rolledMagic || 0) - spentPoints;

    if (delta > 0 && remaining <= 0) return; // No points left

    setSelectedSpells({
      ...selectedSpells,
      [spellKey]: newCount,
    });
  };

  const CIDADELA_SPELLS = [
    { key: 'copia_de_criatura', name: 'Cópia de Criatura', description: 'Cria um clone idêntico do monstro para lutar ao seu lado.' },
    { key: 'pes', name: 'P.E.S.', description: 'Permite ler a mente de criaturas para descobrir segredos ou intenções.' },
    { key: 'fogo', name: 'Fogo', description: 'Lança fogo para causar destruição ou ferir oponentes.' },
    { key: 'ouro_dos_tolos', name: 'Ouro dos Tolos', description: 'Transforma pedras comuns em moedas de ouro temporárias.' },
    { key: 'ilusao', name: 'Ilusão', description: 'Cria miragens para enganar guardas ou desviar atenção de perigos.' },
    { key: 'levitacao', name: 'Levitação', description: 'Permite flutuar no ar para passar por armadilhas e abismos.' },
    { key: 'sorte', name: 'Sorte', description: 'Restaura a Sorte atual e aumenta o limite de Sorte Inicial em +1 ponto.' },
    { key: 'escudo', name: 'Escudo', description: 'Cria uma barreira invisível que repele ataques e projéteis.' },
    { key: 'habilidade', name: 'Habilidade', description: 'Restaura a Habilidade atual de volta ao valor máximo inicial.' },
    { key: 'energia', name: 'Energia', description: 'Restaura metade da Energia inicial (arredondada para cima) sem exceder o máximo.' },
    { key: 'forca', name: 'Força', description: 'Aumenta drasticamente a força física por breves períodos.' },
    { key: 'fraqueza', name: 'Fraqueza', description: 'Enfraquece a habilidade ou energia de um inimigo.' }
  ];

  const handleStartAdventure = async () => {
    if (isMedo && !selectedPower) {
      alert('Por favor, escolha um superpoder primeiro!');
      return;
    }
    if (rolledSkill === null || rolledEnergy === null || rolledLuck === null) return;
    if (isCidadela && rolledMagic === null) return;
    if (isVampiro && rolledFaith === null) return;
    if (isMansao && rolledFear === null) return;

    // Play retro victory fanfare
    audio.playVictory();

    // Store attributes (initial & current)
    setAttribute('skill', rolledSkill, true);
    setAttribute('skill', rolledSkill, false);
    setAttribute('energy', rolledEnergy, true);
    setAttribute('energy', rolledEnergy, false);
    setAttribute('luck', rolledLuck, true);
    setAttribute('luck', rolledLuck, false);

    if (isCidadela && rolledMagic !== null) {
      setAttribute('magic', rolledMagic, true);
      setAttribute('magic', rolledMagic, false);
      setSpells(selectedSpells);
    }

    if (isVampiro && rolledFaith !== null) {
      setAttribute('faith', rolledFaith, true);
      setAttribute('faith', rolledFaith, false);
    }

    if (isMansao && rolledFear !== null) {
      setAttribute('fear', rolledFear, true);
      setAttribute('fear', 0, false); // Começa com 0 pontos de medo atual
    }

    if (isMedo && selectedPower) {
      setSuperpower(selectedPower);
      updateHeroPoints(0);
      updateClues({ local: '', dia: '', horario: '', lider: '', outras: '' });
    }

    const isExercitos = gamebook === 'Exércitos da Morte';
    if (isExercitos) {
      updateGold(20000 - gold);
      updateProvisions(0 - provisions);
    }

    // Add log
    const powerStr = isMedo ? ` | Poder: ${selectedPower === 'superforca' ? 'Superforça' : selectedPower === 'psi' ? 'Psi' : selectedPower === 'hta' ? 'HTA' : 'Rajada'}` : '';
    const magicStr = isCidadela ? ` | Mágica: ${rolledMagic}` : '';
    const faithStr = isVampiro ? ` | Fé: ${rolledFaith}` : '';
    const fearStr = isMansao ? ` | Medo Máx: ${rolledFear}` : '';
    addCombatLog({
      type: 'Aventura',
      value: `Jornada iniciada! Hab: ${rolledSkill}, Ener: ${rolledEnergy}, Luck: ${rolledLuck}${powerStr}${magicStr}${faithStr}${fearStr}`,
    });

    // Log telemetry
    await logTelemetry('character_creation', {
      skill: rolledSkill,
      energy: rolledEnergy,
      luck: rolledLuck,
      magic: isCidadela ? rolledMagic : undefined,
      spells: isCidadela ? selectedSpells : undefined,
      superpower: isMedo ? selectedPower : undefined,
      faith: isVampiro ? rolledFaith : undefined,
      fear: isMansao ? rolledFear : undefined,
    });

    // Save state to Supabase
    await saveToSupabase();
  };

  const allRolled =
    rolledSkill !== null &&
    rolledEnergy !== null &&
    rolledLuck !== null &&
    (!isMedo || selectedPower !== null) &&
    (!isCidadela || rolledMagic !== null) &&
    (!isVampiro || rolledFaith !== null) &&
    (!isMansao || rolledFear !== null);

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
                  onClick={() => {
                    const power = p.id as 'superforca' | 'psi' | 'hta' | 'rajada';
                    setSelectedPower(power);
                    if (power === 'superforca') {
                      setRolledSkill(13);
                      setDisplaySkill(13);
                    } else if (rolledSkill === 13) {
                      setRolledSkill(null);
                      setDisplaySkill(0);
                    }
                  }}
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

      <div className={`grid grid-cols-1 ${(isCidadela || isVampiro || isMansao) ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3'} gap-6 mb-8`}>
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
            <div className="text-[10px] uppercase font-bold tracking-wider text-green-600 dark:text-cyan-400">Superforça active</div>
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
              2 Dados + 12
            </div>
          ) : (
            <button 
              onClick={(e) => { e.stopPropagation(); rollEnergy(); }}
              className={buttonStyle}
              disabled={rollingEnergy || (isMedo && !selectedPower)}
            >
              Role 2d6+12
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

        {/* FAITH (Fé) Card */}
        {isVampiro && (
          <div 
            onClick={rolledFaith === null ? rollFaith : undefined}
            className={attributeCardStyle(rolledFaith !== null, rollingFaith)}
          >
            <div className="flex items-center gap-1.5 justify-center mb-1">
              <Flame size={16} className={isPapyrus ? 'text-[#8B4513]' : 'text-orange-400'} />
              <span className="text-xs uppercase font-extrabold tracking-wider">Fé</span>
            </div>

            <div className="my-4 h-16 flex items-center justify-center">
              {rollingFaith ? (
                <span className="text-4xl font-extrabold animate-bounce">{displayFaith}</span>
              ) : rolledFaith !== null ? (
                <motion.span 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-5xl font-extrabold"
                >
                  {rolledFaith}
                </motion.span>
              ) : (
                <Dices size={36} className={`opacity-40 ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-400'}`} />
              )}
            </div>

            {rolledFaith !== null ? (
              <div className="text-[10px] uppercase font-bold tracking-wider opacity-60">Dado + 3</div>
            ) : (
              <button 
                onClick={(e) => { e.stopPropagation(); rollFaith(); }}
                className={buttonStyle}
                disabled={rollingFaith}
              >
                Role 1d6+3
              </button>
            )}
          </div>
        )}

        {/* MAGIC (Mágica) Card */}
        {isCidadela && (
          <div 
            onClick={rolledMagic === null ? rollMagic : undefined}
            className={attributeCardStyle(rolledMagic !== null, rollingMagic)}
          >
            <div className="flex items-center gap-1.5 justify-center mb-1">
              <Sparkles size={16} className={isPapyrus ? 'text-[#8B008B]' : 'text-purple-400'} />
              <span className="text-xs uppercase font-extrabold tracking-wider">Mágica</span>
            </div>

            <div className="my-4 h-16 flex items-center justify-center">
              {rollingMagic ? (
                <span className="text-4xl font-extrabold animate-bounce">{displayMagic}</span>
              ) : rolledMagic !== null ? (
                <motion.span 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-5xl font-extrabold"
                >
                  {rolledMagic}
                </motion.span>
              ) : (
                <Dices size={36} className={`opacity-40 ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-400'}`} />
              )}
            </div>

            {rolledMagic !== null ? (
              <div className="text-[10px] uppercase font-bold tracking-wider opacity-60">2 Dados + 6</div>
            ) : (
              <button 
                onClick={(e) => { e.stopPropagation(); rollMagic(); }}
                className={buttonStyle}
                disabled={rollingMagic}
              >
                Role 2d6+6
              </button>
            )}
          </div>
        )}

        {/* FEAR (Medo) Card */}
        {isMansao && (
          <div 
            onClick={rolledFear === null ? rollFear : undefined}
            className={attributeCardStyle(rolledFear !== null, rollingFear)}
          >
            <div className="flex items-center gap-1.5 justify-center mb-1">
              <Flame size={16} className={isPapyrus ? 'text-[#8B0000]' : 'text-red-500'} />
              <span className="text-xs uppercase font-extrabold tracking-wider">Medo Máximo</span>
            </div>

            <div className="my-4 h-16 flex items-center justify-center">
              {rollingFear ? (
                <span className="text-4xl font-extrabold animate-bounce">{displayFear}</span>
              ) : rolledFear !== null ? (
                <motion.span 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-5xl font-extrabold"
                >
                  {rolledFear}
                </motion.span>
              ) : (
                <Dices size={36} className={`opacity-40 ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-400'}`} />
              )}
            </div>

            {rolledFear !== null ? (
              <div className="text-[10px] uppercase font-bold tracking-wider opacity-60">Dado + 6</div>
            ) : (
              <button 
                onClick={(e) => { e.stopPropagation(); rollFear(); }}
                className={buttonStyle}
                disabled={rollingFear}
              >
                Role 1d6+6
              </button>
            )}
          </div>
        )}
      </div>

      {/* Grimório (Spell Selection) for Cidadela */}
      {isCidadela && allRolled && (
        (() => {
          const spentPoints = Object.values(selectedSpells).reduce((sum, val) => sum + val, 0);
          const remainingMagicPoints = (rolledMagic || 0) - spentPoints;
          return (
            <div className={`mt-8 p-6 border-2 border-dashed ${isPapyrus ? 'border-[#5C4033]/40 bg-[#EAD8B8]/10' : 'border-slate-800 bg-slate-900/30 rounded-2xl'} animate-fade-in mb-8`}>
              <div className="text-center mb-6">
                <h3 className={`text-xl font-bold uppercase tracking-wider ${isPapyrus ? 'text-[#5C4033]' : 'text-purple-400'}`}>
                  Grimório do Mago
                </h3>
                <p className={`text-sm mt-1 ${isPapyrus ? 'text-[#5C4033]/80' : 'text-slate-300'}`}>
                  Você tem <span className="font-bold text-lg">{rolledMagic}</span> pontos de Mágica.
                  Distribua-os comprando feitiços.
                </p>
                <div className={`mt-2 inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded ${
                  remainingMagicPoints === 0 
                    ? 'bg-green-500/20 text-green-600 dark:text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                }`}>
                  {remainingMagicPoints === 0 
                    ? 'Todos os pontos distribuídos!' 
                    : `Pontos restantes: ${remainingMagicPoints}`}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
                {CIDADELA_SPELLS.map((spell) => {
                  const count = selectedSpells[spell.key] || 0;
                  return (
                    <div 
                      key={spell.key} 
                      className={`p-3 border flex flex-col justify-between ${
                        isPapyrus 
                          ? 'border-[#5C4033]/30 bg-[#FDF6E3] hover:border-[#5C4033]/60' 
                          : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 rounded-xl'
                      } transition-all duration-200`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-sm uppercase tracking-wide">
                          {spell.name}
                        </h4>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAdjustSpell(spell.key, -1)}
                            className={`w-6 h-6 flex items-center justify-center text-xs font-bold transition-colors ${
                              isPapyrus
                                ? 'bg-[#EAD8B8] hover:bg-[#5C4033] hover:text-[#EAD8B8] text-[#2C1E14]'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md'
                            } disabled:opacity-40`}
                            disabled={count === 0}
                          >
                            -
                          </button>
                          <span className="font-mono text-sm font-bold w-4 text-center">{count}</span>
                          <button
                            onClick={() => handleAdjustSpell(spell.key, 1)}
                            className={`w-6 h-6 flex items-center justify-center text-xs font-bold transition-colors ${
                              isPapyrus
                                ? 'bg-[#EAD8B8] hover:bg-[#5C4033] hover:text-[#EAD8B8] text-[#2C1E14]'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md'
                            } disabled:opacity-40`}
                            disabled={remainingMagicPoints <= 0}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <p className={`text-xs ${isPapyrus ? 'text-[#5C4033]/70' : 'text-slate-400'} leading-relaxed font-sans`}>
                        {spell.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()
      )}

      {/* Start Adventure Action Trigger */}
      <AnimatePresence>
        {allRolled && (
          (() => {
            const spentPoints = Object.values(selectedSpells).reduce((sum, val) => sum + val, 0);
            const remainingMagicPoints = (rolledMagic || 0) - spentPoints;
            const startDisabled = isCidadela && remainingMagicPoints !== 0;
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-3 mt-6 pt-4 border-t border-current/10"
              >
                <button
                  onClick={handleStartAdventure}
                  disabled={startDisabled}
                  className={`flex items-center justify-center gap-2.5 px-8 py-4 uppercase font-bold text-sm tracking-widest shadow-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed ${
                    isPapyrus
                      ? 'border-2 border-[#5C4033] bg-[#5C4033] text-[#EAD8B8] hover:bg-[#2C1E14]'
                      : 'border border-cyan-500 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/30 rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.2)]'
                  }`}
                >
                  <Sparkles size={16} className="animate-spin-slow" />
                  <span>Iniciar Aventura</span>
                </button>
                <p className={`text-[10px] uppercase tracking-wider opacity-75 ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-400 font-mono'}`}>
                  {isCidadela && remainingMagicPoints !== 0 
                    ? `Selecione mais ${remainingMagicPoints} feitiços para começar`
                    : 'Os portões do destino estão abertos'}
                </p>
              </motion.div>
            );
          })()
        )}
      </AnimatePresence>
    </div>
  );
};
