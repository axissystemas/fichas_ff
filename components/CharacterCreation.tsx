'use client';

import { useState, useEffect } from 'react';
import { useSheetStore } from '@/store/useSheetStore';
import { getBookIntro } from '@/lib/bookIntros';
import { audio } from '@/lib/audio';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Dices, Shield, Heart, Clover, Flame, Rocket, Zap, Users } from 'lucide-react';

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
    updateProvisions,
    setSelectedHero,
    setCustomArchetype,
    updateGold,
  } = useSheetStore();
  
  const isMedo = gamebook === 'Encontro Marcado com o M.E.D.O.';
  const isCidadela = gamebook === 'A Cidadela do Caos';
  const isVampiro = gamebook === 'A Cripta do Vampiro';
  const isMansao = gamebook === 'A Mansão do Inferno';
  const isZagor = gamebook === 'A Lenda de Zagor';
  const isTraveller = gamebook === 'Nave Espacial Traveller';
  
  // Selected superpower for MEDO
  const [selectedPower, setSelectedPower] = useState<'superforca' | 'psi' | 'hta' | 'rajada' | null>(null);

  // Selected hero for A Lenda de Zagor
  const [selectedHeroLocal, setSelectedHeroLocal] = useState<'anvar' | 'braxus' | 'restolho' | 'sallazar' | 'personalizado' | null>(null);
  const [customArchetypeLocal, setCustomArchetypeLocal] = useState<'anvar' | 'braxus' | 'restolho' | 'sallazar' | null>(null);

  // Rolled attributes (null means unrolled)
  const [rolledSkill, setRolledSkill] = useState<number | null>(null);
  const [rolledEnergy, setRolledEnergy] = useState<number | null>(null);
  const [rolledLuck, setRolledLuck] = useState<number | null>(null);
  const [rolledMagic, setRolledMagic] = useState<number | null>(null);
  const [rolledFaith, setRolledFaith] = useState<number | null>(null);
  const [rolledFear, setRolledFear] = useState<number | null>(null);
  const [rolledWillpower, setRolledWillpower] = useState<number | null>(null);

  // Traveller Crew & Ship state
  const [travellerCrew, setTravellerCrew] = useState<{
    ship: { firepower: number; shields: number };
    science: { skill: number; energy: number };
    engineering: { skill: number; energy: number };
    medical: { skill: number; energy: number };
    security: { skill: number; energy: number };
    guard1: { skill: number; energy: number };
    guard2: { skill: number; energy: number };
  } | null>(null);
  const [rollingCrew, setRollingCrew] = useState(false);

  const rollTravellerCrew = () => {
    if (rollingCrew) return;
    setRollingCrew(true);
    audio.playDiceRoll();

    const roll1d6_6 = () => Math.floor(Math.random() * 6) + 7;
    const roll2d6_12 = () => Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 14;

    const interval = setInterval(() => {
      setTravellerCrew({
        ship: { firepower: roll1d6_6(), shields: roll2d6_12() },
        science: { skill: roll1d6_6(), energy: roll2d6_12() },
        engineering: { skill: roll1d6_6(), energy: roll2d6_12() },
        medical: { skill: roll1d6_6(), energy: roll2d6_12() },
        security: { skill: roll1d6_6(), energy: roll2d6_12() },
        guard1: { skill: roll1d6_6(), energy: roll2d6_12() },
        guard2: { skill: roll1d6_6(), energy: roll2d6_12() }
      });
    }, 60);

    setTimeout(() => {
      clearInterval(interval);
      const finalCrew = {
        ship: { firepower: roll1d6_6(), shields: roll2d6_12() },
        science: { skill: roll1d6_6(), energy: roll2d6_12() },
        engineering: { skill: roll1d6_6(), energy: roll2d6_12() },
        medical: { skill: roll1d6_6(), energy: roll2d6_12() },
        security: { skill: roll1d6_6(), energy: roll2d6_12() },
        guard1: { skill: roll1d6_6(), energy: roll2d6_12() },
        guard2: { skill: roll1d6_6(), energy: roll2d6_12() }
      };
      setTravellerCrew(finalCrew);
      setRollingCrew(false);
      audio.playCoin();
    }, 600);
  };

  // Rolling states
  const [rollingSkill, setRollingSkill] = useState(false);
  const [rollingEnergy, setRollingEnergy] = useState(false);
  const [rollingLuck, setRollingLuck] = useState(false);
  const [rollingMagic, setRollingMagic] = useState(false);
  const [rollingFaith, setRollingFaith] = useState(false);
  const [rollingFear, setRollingFear] = useState(false);
  const [rollingWillpower, setRollingWillpower] = useState(false);

  // Display values during rolling animation
  const [displaySkill, setDisplaySkill] = useState(0);
  const [displayEnergy, setDisplayEnergy] = useState(0);
  const [displayLuck, setDisplayLuck] = useState(0);
  const [displayMagic, setDisplayMagic] = useState(0);
  const [displayFaith, setDisplayFaith] = useState(0);
  const [displayFear, setDisplayFear] = useState(0);
  const [displayWillpower, setDisplayWillpower] = useState(0);

  const rollWillpower = () => {
    if (rollingWillpower || rolledWillpower !== null) return;
    setRollingWillpower(true);
    audio.playDiceRoll();

    const interval = setInterval(() => {
      setDisplayWillpower(Math.floor(Math.random() * 6) + 1 + 6);
    }, 60);

    setTimeout(() => {
      clearInterval(interval);
      const finalVal = Math.floor(Math.random() * 6) + 1 + 6; // 1d6 + 6
      setRolledWillpower(finalVal);
      setDisplayWillpower(finalVal);
      setRollingWillpower(false);
      audio.playCoin();
    }, 600);
  };

  const handleSelectHero = (hero: 'anvar' | 'braxus' | 'restolho' | 'sallazar' | 'personalizado') => {
    setSelectedHeroLocal(hero);
    setCustomArchetypeLocal(null);
    if (hero === 'anvar') {
      setRolledSkill(10);
      setRolledEnergy(22);
      setRolledLuck(10);
      setRolledWillpower(10);
    } else if (hero === 'braxus') {
      setRolledSkill(11);
      setRolledEnergy(20);
      setRolledLuck(9);
      setRolledWillpower(11);
    } else if (hero === 'restolho') {
      setRolledSkill(9);
      setRolledEnergy(24);
      setRolledLuck(11);
      setRolledWillpower(10);
    } else if (hero === 'sallazar') {
      setRolledSkill(7);
      setRolledEnergy(16);
      setRolledLuck(8);
      setRolledWillpower(14);
    } else {
      // reset rolled values for personalizado so they can roll
      setRolledSkill(null);
      setRolledEnergy(null);
      setRolledLuck(null);
      setRolledWillpower(null);
    }
  };

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
    if (isZagor && !selectedHeroLocal) {
      alert('Por favor, escolha um herói primeiro!');
      return;
    }
    if (isZagor && selectedHeroLocal === 'personalizado' && !customArchetypeLocal) {
      alert('Por favor, escolha a classe do seu herói personalizado!');
      return;
    }
    if (rolledSkill === null || rolledEnergy === null || rolledLuck === null) return;
    if (isCidadela && rolledMagic === null) return;
    if (isVampiro && rolledFaith === null) return;
    if (isMansao && rolledFear === null) return;
    if (isZagor && rolledWillpower === null) return;

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

    if (isZagor && rolledWillpower !== null) {
      setSelectedHero(selectedHeroLocal);
      if (selectedHeroLocal === 'personalizado') {
        setCustomArchetype(customArchetypeLocal);
      }
      setAttribute('willpower', rolledWillpower, true);
      setAttribute('willpower', rolledWillpower, false);
    }

    if (isMedo && selectedPower) {
      setSuperpower(selectedPower);
      updateHeroPoints(0);
      updateClues({ local: '', dia: '', horario: '', lider: '', outras: '' });
    }

    const isExercitos = gamebook === 'Exércitos da Morte';
    const isTraveller = gamebook === 'Nave Espacial Traveller';
    if (isExercitos) {
      updateGold(20000 - gold);
      updateProvisions(0 - provisions);
    }

    if (isTraveller) {
      const roll1d6_6 = () => Math.floor(Math.random() * 6) + 7;
      const roll2d6_12 = () => Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 14;

      const crewData = travellerCrew || {
        ship: { firepower: roll1d6_6(), shields: roll2d6_12() },
        science: { skill: roll1d6_6(), energy: roll2d6_12() },
        engineering: { skill: roll1d6_6(), energy: roll2d6_12() },
        medical: { skill: roll1d6_6(), energy: roll2d6_12() },
        security: { skill: roll1d6_6(), energy: roll2d6_12() },
        guard1: { skill: roll1d6_6(), energy: roll2d6_12() },
        guard2: { skill: roll1d6_6(), energy: roll2d6_12() }
      };

      const createCrew = (id: string, role: string, name: string, sk: number, en: number) => ({
        id, role, name,
        skill: { initial: sk, current: sk },
        energy: { initial: en, current: en }
      });

      const travellerData = {
        ship: {
          firepower: { initial: crewData.ship.firepower, current: crewData.ship.firepower },
          shields: { initial: crewData.ship.shields, current: crewData.ship.shields }
        },
        crew: {
          captain: createCrew('captain', 'Capitão', 'Capitão', rolledSkill, rolledEnergy),
          science: createCrew('science', 'Oficial de Ciências', 'Oficial de Ciências', crewData.science.skill, crewData.science.energy),
          engineering: createCrew('engineering', 'Oficial de Engenharia', 'Oficial de Engenharia', crewData.engineering.skill, crewData.engineering.energy),
          medical: createCrew('medical', 'Oficial de Medicina', 'Oficial de Medicina', crewData.medical.skill, crewData.medical.energy),
          security: createCrew('security', 'Oficial de Segurança', 'Oficial de Segurança', crewData.security.skill, crewData.security.energy),
          guard1: createCrew('guard1', 'Guarda de Segurança 1', 'Guarda 1', crewData.guard1.skill, crewData.guard1.energy),
          guard2: createCrew('guard2', 'Guarda de Segurança 2', 'Guarda 2', crewData.guard2.skill, crewData.guard2.energy),
        }
      };

      useSheetStore.setState((state) => ({
        attributes: {
          ...state.attributes,
          traveller: travellerData
        }
      }));

      // Adiciona Faseador ao inventário
      const inv = useSheetStore.getState().inventory;
      if (!inv.some(i => i.name.includes('Faseador'))) {
        useSheetStore.getState().addItem({ id: crypto.randomUUID(), name: 'Faseador (Pistola Laser)', quantity: 1, equipped: true });
      }
    }

    // Add log
    const powerStr = isMedo ? ` | Poder: ${selectedPower === 'superforca' ? 'Superforça' : selectedPower === 'psi' ? 'Psi' : selectedPower === 'hta' ? 'HTA' : 'Rajada'}` : '';
    const magicStr = isCidadela ? ` | Mágica: ${rolledMagic}` : '';
    const faithStr = isVampiro ? ` | Fé: ${rolledFaith}` : '';
    const fearStr = isMansao ? ` | Medo Máx: ${rolledFear}` : '';
    const heroNameMap = {
      anvar: 'Anvar',
      braxus: 'Braxus',
      restolho: 'Restolho',
      sallazar: 'Sallazar',
      personalizado: 'Personalizado',
    };
    const heroStr = isZagor && selectedHeroLocal ? ` | Herói: ${heroNameMap[selectedHeroLocal]} | ${selectedHeroLocal === 'sallazar' ? 'PM' : 'Força de Vontade'}: ${rolledWillpower}` : '';
    addCombatLog({
      type: 'Aventura',
      value: `Jornada iniciada! Hab: ${rolledSkill}, Ener: ${rolledEnergy}, Luck: ${rolledLuck}${powerStr}${magicStr}${faithStr}${fearStr}${heroStr}`,
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
      selectedHero: isZagor ? selectedHeroLocal : undefined,
      willpower: isZagor ? rolledWillpower : undefined,
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
    (!isMansao || rolledFear !== null) &&
    (!isZagor || rolledWillpower !== null);

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

  // Wizard steps configuration based on active gamebook
  const steps: { id: string; title: string; subtitle: string }[] = [];
  steps.push({ id: 'intro', title: 'Narrativa', subtitle: 'Introdução da aventura' });
  if (isMedo) {
    steps.push({ id: 'power', title: 'Superpoder', subtitle: 'Habilidade especial' });
  }
  if (isZagor) {
    steps.push({ id: 'hero', title: 'Herói', subtitle: 'Escolha de guerreiro' });
  }
  steps.push({ id: 'attributes', title: 'Atributos', subtitle: 'Rolagem de dados' });
  if (isCidadela) {
    steps.push({ id: 'spells', title: 'Grimório', subtitle: 'Escolha de feitiços' });
  }
  if (isTraveller) {
    steps.push({ id: 'crew', title: 'Tripulação', subtitle: 'Oficiais e Astronave' });
  }
  steps.push({ id: 'review', title: 'Revisão', subtitle: 'Resumo dos dados' });

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const currentStep = steps[activeStepIndex];

  const isStepValid = (stepId: string) => {
    switch (stepId) {
      case 'intro':
        return true;
      case 'power':
        return selectedPower !== null;
      case 'hero':
        return selectedHeroLocal !== null && (selectedHeroLocal !== 'personalizado' || customArchetypeLocal !== null);
      case 'attributes':
        return rolledSkill !== null && rolledEnergy !== null && rolledLuck !== null &&
          (!isVampiro || rolledFaith !== null) &&
          (!isMansao || rolledFear !== null) &&
          (!isZagor || rolledWillpower !== null) &&
          (!isCidadela || rolledMagic !== null);
      case 'spells': {
        const spent = Object.values(selectedSpells).reduce((sum, val) => sum + val, 0);
        return rolledMagic !== null && (rolledMagic - spent) === 0;
      }
      case 'crew':
        return travellerCrew !== null;
      case 'review':
        return true;
      default:
        return false;
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="mb-6 w-full font-sans">
        {/* Mobile Indicator */}
        <div className={`block sm:hidden text-center text-xs font-bold uppercase tracking-wider mb-2 opacity-80 ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-400'}`}>
          Etapa {activeStepIndex + 1} de {steps.length}: {currentStep.title}
        </div>

        {/* Desktop Step bar */}
        <div className="hidden sm:flex items-center justify-between gap-2 relative">
          <div className={`absolute top-1/2 left-0 right-0 h-0.5 transform -translate-y-1/2 -z-10 opacity-20 ${isPapyrus ? 'bg-[#5C4033]' : 'bg-slate-650'}`} />
          {steps.map((st, idx) => {
            const isCompleted = idx < activeStepIndex;
            const isActive = idx === activeStepIndex;
            return (
              <div key={st.id} className="flex flex-col items-center gap-1 z-10">
                <button
                  type="button"
                  onClick={() => {
                    if (idx < activeStepIndex) {
                      setActiveStepIndex(idx);
                      audio.playBlip();
                    }
                  }}
                  disabled={idx >= activeStepIndex}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2 ${
                    isActive
                      ? isPapyrus
                        ? 'border-[#5C4033] bg-[#5C4033] text-[#EAD8B8] scale-110 shadow-md font-bold'
                        : 'border-cyan-400 bg-cyan-950 text-cyan-300 scale-110 shadow-[0_0_10px_rgba(6,182,212,0.45)]'
                      : isCompleted
                        ? isPapyrus
                          ? 'border-[#5C4033] bg-[#EAD8B8] text-[#5C4033]'
                          : 'border-cyan-500/50 bg-slate-900 text-cyan-500'
                        : isPapyrus
                          ? 'border-[#5C4033]/20 bg-[#FDF6E3] text-[#5C4033]/30'
                          : 'border-slate-800 bg-slate-950 text-slate-600'
                  } ${idx < activeStepIndex ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </button>
                <span className={`text-[9px] uppercase font-black tracking-widest hidden md:block select-none ${
                  isActive ? 'opacity-100' : 'opacity-40'
                }`}>
                  {st.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderNavigationButtons = () => {
    const isFirst = activeStepIndex === 0;
    const isLast = activeStepIndex === steps.length - 1;
    const canGoNext = isStepValid(currentStep.id);

    return (
      <div className="flex items-center justify-between gap-4 mt-8 pt-5 border-t border-current/10 font-sans">
        {!isFirst ? (
          <button
            type="button"
            onClick={() => {
              setActiveStepIndex(prev => prev - 1);
              audio.playBlip();
            }}
            className={`px-4 py-2 text-xs uppercase font-bold tracking-wider transition-all duration-200 cursor-pointer ${
              isPapyrus
                ? 'border border-[#5C4033] text-[#5C4033] hover:bg-[#5C4033] hover:text-[#EAD8B8]'
                : 'border border-slate-700 text-slate-350 hover:bg-slate-800 rounded-lg'
            }`}
          >
            ← Voltar
          </button>
        ) : (
          <div />
        )}

        {!isLast ? (
          <button
            type="button"
            onClick={() => {
              if (canGoNext) {
                setActiveStepIndex(prev => prev + 1);
                audio.playCoin();
              }
            }}
            disabled={!canGoNext}
            className={`px-6 py-2.5 text-xs uppercase font-bold tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
              canGoNext
                ? isPapyrus
                  ? 'bg-[#2C1E14] text-[#EAD8B8] hover:bg-[#5C4033] cursor-pointer'
                  : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/50 hover:bg-cyan-500/20 rounded-lg cursor-pointer'
                : 'opacity-40 cursor-not-allowed border border-current/10'
            }`}
          >
            <span>Avançar</span>
            <span>→</span>
          </button>
        ) : (
          <button
            onClick={handleStartAdventure}
            className={`px-8 py-3.5 uppercase font-bold text-xs tracking-widest shadow-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2 ${
              isPapyrus
                ? 'border-2 border-[#5C4033] bg-[#5C4033] text-[#EAD8B8] hover:bg-[#2C1E14]'
                : 'border border-cyan-500 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/30 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.25)]'
            }`}
          >
            <Sparkles size={14} className="animate-spin-slow" />
            <span>Iniciar Aventura</span>
          </button>
        )}
      </div>
    );
  };

  const renderReviewStep = () => {
    const spentPoints = Object.values(selectedSpells).reduce((sum, val) => sum + val, 0);
    const heroNameMap = {
      anvar: 'Bárbaro (Anvar)',
      braxus: 'Guerreiro (Braxus)',
      restolho: 'Anão (Restolho)',
      sallazar: 'Mago (Sallazar)',
      personalizado: 'Personalizado',
    };
    const powerNameMap = {
      superforca: 'Superforça & Voo',
      psi: 'Poderes Psi',
      hta: 'Dispositivos HTA',
      rajada: 'Rajada de Energia',
    };

    return (
      <div className="space-y-6 animate-fade-in font-sans">
        <div className="text-center mb-4">
          <h3 className={`text-xl font-bold uppercase tracking-widest ${isPapyrus ? 'text-[#8B4513]' : 'text-cyan-400'}`}>
            Revisão da Ficha de Personagem
          </h3>
          <p className={`text-xs opacity-75 mt-1 ${isPapyrus ? 'text-[#5C4033]/80' : 'text-slate-400'}`}>
            Sua ficha está pronta para o combate. Revise seus dados antes de iniciar.
          </p>
        </div>

        <div className={`p-5 border-2 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-6 ${
          isPapyrus ? 'bg-[#EAD8B8]/20 border-[#5C4033]/30' : 'bg-slate-900/40 border-slate-800'
        }`}>
          {/* Column 1: Config summary */}
          <div className="space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 block">Aventura</span>
              <span className="text-base font-bold italic font-serif">📚 {gamebook}</span>
            </div>

            {isMedo && selectedPower && (
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 block">Superpoder</span>
                <span className="text-sm font-bold uppercase text-green-700 dark:text-cyan-400">
                  ⚡ {powerNameMap[selectedPower]}
                </span>
              </div>
            )}

            {isZagor && selectedHeroLocal && (
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 block">Herói Escolhido</span>
                <span className="text-sm font-bold uppercase text-amber-700 dark:text-amber-400">
                  🛡️ {selectedHeroLocal === 'personalizado' ? `Personalizado (${heroNameMap[customArchetypeLocal || 'personalizado']})` : heroNameMap[selectedHeroLocal]}
                </span>
              </div>
            )}

            <div className={`p-3.5 border rounded-lg text-xs leading-relaxed ${
              isPapyrus ? 'bg-[#FDF6E3] border-[#5C4033]/20 text-[#5C4033]' : 'bg-slate-950/40 border-slate-800 text-slate-300'
            }`}>
              <span className="font-bold block mb-1">🔥 Regra Inicial / Vantagem:</span>
              {isMedo && selectedPower === 'superforca' && "Sua Habilidade inicial é fixada em 13. Você pode voar."}
              {isMedo && selectedPower === 'psi' && "Capacidade de ler mentes e mover objetos gastando Energia."}
              {isMedo && selectedPower === 'hta' && "Acesso a cinto tecnológico com itens especiais."}
              {isMedo && selectedPower === 'rajada' && "Pode dar choques eletrostáticos para neutralizar adversários."}
              {isZagor && selectedHeroLocal === 'anvar' && "Anvar nunca é pego de surpresa e ignora primeiro dano de emboscadas."}
              {isZagor && selectedHeroLocal === 'braxus' && "Braxus pode usar qualquer item ou armadura sem sofrer penalidades."}
              {isZagor && selectedHeroLocal === 'restolho' && "Restolho possui +2 de Força de Ataque contra oponentes de Pedra."}
              {isZagor && selectedHeroLocal === 'sallazar' && "Sallazar tem vantagens em percepção e magia ilimitada no Grimório."}
              {!isMedo && !isZagor && "Ficha básica criada. Você carrega seus pertences normais e está pronto para jogar!"}
            </div>
          </div>

          {/* Column 2: Stats summary */}
          <div className="space-y-4">
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 block">Valores de Partida</span>
            <div className="grid grid-cols-3 gap-2">
              <div className={`p-2.5 border rounded text-center ${isPapyrus ? 'bg-[#FDF6E3] border-[#5C4033]/20' : 'bg-slate-950/50 border-slate-850'}`}>
                <span className="text-[9px] block opacity-75 font-bold uppercase">Habilidade</span>
                <span className="text-xl font-extrabold">{rolledSkill}</span>
              </div>
              <div className={`p-2.5 border rounded text-center ${isPapyrus ? 'bg-[#FDF6E3] border-[#5C4033]/20' : 'bg-slate-950/50 border-slate-850'}`}>
                <span className="text-[9px] block opacity-75 font-bold uppercase text-red-500">Energia</span>
                <span className="text-xl font-extrabold text-red-500">{rolledEnergy}</span>
              </div>
              <div className={`p-2.5 border rounded text-center ${isPapyrus ? 'bg-[#FDF6E3] border-[#5C4033]/20' : 'bg-slate-950/50 border-slate-850'}`}>
                <span className="text-[9px] block opacity-75 font-bold uppercase text-green-600 dark:text-green-400">Sorte</span>
                <span className="text-xl font-extrabold text-green-600 dark:text-green-400">{rolledLuck}</span>
              </div>
              {isCidadela && rolledMagic !== null && (
                <div className={`p-2.5 border rounded text-center ${isPapyrus ? 'bg-[#FDF6E3] border-[#5C4033]/20' : 'bg-slate-950/50 border-slate-850'}`}>
                  <span className="text-[9px] block opacity-75 font-bold uppercase text-purple-400">Mágica</span>
                  <span className="text-xl font-extrabold text-purple-400">{rolledMagic}</span>
                </div>
              )}
              {isVampiro && rolledFaith !== null && (
                <div className={`p-2.5 border rounded text-center ${isPapyrus ? 'bg-[#FDF6E3] border-[#5C4033]/20' : 'bg-slate-950/50 border-slate-850'}`}>
                  <span className="text-[9px] block opacity-75 font-bold uppercase text-orange-400">Fé</span>
                  <span className="text-xl font-extrabold text-orange-400">{rolledFaith}</span>
                </div>
              )}
              {isMansao && rolledFear !== null && (
                <div className={`p-2.5 border rounded text-center ${isPapyrus ? 'bg-[#FDF6E3] border-[#5C4033]/20' : 'bg-slate-950/50 border-slate-850'}`}>
                  <span className="text-[9px] block opacity-75 font-bold uppercase text-red-400">Medo Máx</span>
                  <span className="text-xl font-extrabold text-red-400">{rolledFear}</span>
                </div>
              )}
              {isZagor && rolledWillpower !== null && (
                <div className={`p-2.5 border rounded text-center ${isPapyrus ? 'bg-[#FDF6E3] border-[#5C4033]/20' : 'bg-slate-950/50 border-slate-850'}`}>
                  <span className="text-[9px] block opacity-75 font-bold uppercase text-indigo-400">Vontade</span>
                  <span className="text-xl font-extrabold text-indigo-400">{rolledWillpower}</span>
                </div>
              )}
            </div>

            {/* Speels Cidadela */}
            {isCidadela && Object.keys(selectedSpells).length > 0 && (
              <div className="pt-2">
                <span className="text-[9px] font-bold uppercase opacity-60 block mb-1">Feitiços do Grimório</span>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(selectedSpells).map(([key, qty]) => {
                    if (qty === 0) return null;
                    const spellObj = CIDADELA_SPELLS.find(s => s.key === key);
                    return (
                      <span key={key} className={`text-[10px] px-2 py-0.5 rounded border font-mono ${
                        isPapyrus ? 'bg-[#5C4033]/10 border-[#5C4033]/20 text-[#5C4033]' : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}>
                        {spellObj?.name || key} x{qty}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Crew summary Traveller */}
            {isTraveller && travellerCrew && (
              <div className="pt-2">
                <span className="text-[9px] font-bold uppercase opacity-60 block mb-1">Astronave & Tripulação</span>
                <div className={`p-2.5 border rounded text-xs leading-normal font-mono ${isPapyrus ? 'bg-[#FDF6E3] border-[#5C4033]/20' : 'bg-slate-950/40 border-slate-800'}`}>
                  🚀 Nave: Poder de Fogo {travellerCrew.ship.firepower} | Escudos {travellerCrew.ship.shields} <br/>
                  👥 Tripulantes de Ponte: 6 Oficiais gerados com sucesso.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`${containerStyle} max-w-[800px] mx-auto my-4 animate-fade-in`}>
      {/* Title */}
      <h2 className={titleStyle}>
        ⚔️ {gamebook}
      </h2>

      {/* Wizard progress steps indicator */}
      {renderStepIndicator()}

      <div className="w-full h-[1px] bg-current opacity-10 mb-6"></div>

      {/* Main Switch steps content */}
      <div className="min-h-[300px]">
        
        {/* STEP 1: Intro */}
        {currentStep.id === 'intro' && (
          <div className="space-y-6 animate-fade-in">
            <div className={introCardStyle}>
              <span className={`absolute -top-3 left-4 px-2 text-xs font-bold uppercase tracking-wider ${isPapyrus ? 'bg-[#FDF6E3] text-[#C5A059]' : 'bg-slate-950 text-cyan-400 font-mono'}`}>
                Introdução da Aventura
              </span>
              <p className="indent-6 font-serif leading-relaxed">
                {introText}
              </p>
            </div>
            
            <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center gap-4 ${
              isPapyrus ? 'bg-[#EAD8B8]/15 border-[#5C4033]/30' : 'bg-slate-900/35 border-slate-800'
            }`}>
              <span className="text-3xl select-none">🗺️</span>
              <div className="text-left font-sans text-xs">
                <span className="font-bold block uppercase tracking-wider mb-0.5">Prepare seus dados e lápis virtuais</span>
                <span className="opacity-80">Nas próximas etapas, você definirá seu herói e rolará os atributos de partida que decidirão seu destino nesta aventura.</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Superpower (M.E.D.O.) */}
        {currentStep.id === 'power' && isMedo && (
          <div className="space-y-6 animate-fade-in font-sans">
            <div className="text-center mb-4">
              <h3 className={`text-lg uppercase font-bold tracking-widest ${isPapyrus ? 'text-[#2D1D16]' : 'text-slate-200'}`}>
                Escolha seu Superpoder
              </h3>
              <p className="text-xs opacity-75 mt-1">Cada poder oferece uma mecânica única e um caminho diferente na história.</p>
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
                      audio.playBlip();
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
          </div>
        )}

        {/* STEP 3: Hero Choice (Zagor) */}
        {currentStep.id === 'hero' && isZagor && (
          <div className="space-y-6 animate-fade-in font-sans">
            <div className="text-center mb-4">
              <h3 className={`text-lg uppercase font-bold tracking-widest ${isPapyrus ? 'text-[#2D1D16]' : 'text-slate-200'}`}>
                Escolha seu Herói
              </h3>
              <p className="text-xs opacity-75 mt-1">Escolha um dos quatro heróis clássicos ou crie um Herói Personalizado.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                {
                  id: 'anvar',
                  name: 'Anvar',
                  subtitle: 'Bárbaro',
                  desc: 'Hab: 10 | Ener: 22\nSorte: 10 | Vontade: 10',
                },
                {
                  id: 'braxus',
                  name: 'Braxus',
                  subtitle: 'Guerreiro',
                  desc: 'Hab: 11 | Ener: 20\nSorte: 9 | Vontade: 11',
                },
                {
                  id: 'restolho',
                  name: 'Restolho',
                  subtitle: 'Anão',
                  desc: 'Hab: 9 | Ener: 24\nSorte: 11 | Vontade: 10',
                },
                {
                  id: 'sallazar',
                  name: 'Sallazar',
                  subtitle: 'Mago',
                  desc: 'Hab: 7 | Ener: 16\nSorte: 8 | Magia: 14',
                },
                {
                  id: 'personalizado',
                  name: 'Personalizado',
                  subtitle: 'Sua Criação',
                  desc: 'Determine seus atributos rolando os dados.',
                },
              ].map((h) => {
                const isSelected = selectedHeroLocal === h.id;
                const cardClass = isSelected
                  ? isPapyrus
                    ? 'border-2 border-[#5C4033] bg-[#EAD8B8]/40 shadow-md scale-[1.02]'
                    : 'border-2 border-cyan-400 bg-cyan-950/20 shadow-[0_0_15px_rgba(34,211,238,0.2)] rounded-xl scale-[1.02]'
                  : isPapyrus
                    ? 'border border-[#5C4033]/30 bg-transparent hover:border-[#5C4033]/70 hover:bg-[#EAD8B8]/10'
                    : 'border border-slate-800 bg-transparent hover:border-slate-600 rounded-xl hover:bg-slate-900/30';
                
                return (
                  <div
                    key={h.id}
                    onClick={() => {
                      handleSelectHero(h.id as any);
                      audio.playBlip();
                    }}
                    className={`p-3 cursor-pointer transition-all duration-200 flex flex-col justify-between text-center ${cardClass}`}
                  >
                    <div>
                      <h4 className="font-bold text-sm uppercase tracking-wider mb-0.5">
                        {h.name}
                      </h4>
                      <div className={`text-[10px] font-semibold mb-1 uppercase tracking-wider ${isPapyrus ? 'text-[#8B5A2B]' : 'text-cyan-400'}`}>
                        {h.subtitle}
                      </div>
                      <p className={`text-xs ${isPapyrus ? 'text-[#5C4033]/85' : 'text-slate-350 font-mono'} leading-tight whitespace-pre-line`}>
                        {h.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedHeroLocal === 'personalizado' && (
              <div className="text-center mt-6 animate-fade-in">
                <h4 className={`text-xs uppercase font-bold tracking-wider mb-2 ${isPapyrus ? 'text-[#8B4513]' : 'text-cyan-400'}`}>
                  Classe do Herói Personalizado
                </h4>
                <p className="text-[10px] mb-3 opacity-80">
                  Selecione o arquétipo para determinar seu estilo de jogo, vantagens e desvantagens:
                </p>
                <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                  {[
                    { id: 'anvar', name: 'Bárbaro (Anvar)' },
                    { id: 'braxus', name: 'Guerreiro (Braxus)' },
                    { id: 'restolho', name: 'Anão (Restolho)' },
                    { id: 'sallazar', name: 'Mago (Sallazar)' }
                  ].map((arc) => {
                    const isArcSelected = customArchetypeLocal === arc.id;
                    const arcBtnClass = isArcSelected
                      ? isPapyrus
                        ? 'border-2 border-[#5C4033] bg-[#EAD8B8]/40 font-bold scale-105'
                        : 'border-2 border-cyan-400 bg-cyan-950/20 text-cyan-300 font-bold scale-105 rounded-lg'
                      : isPapyrus
                        ? 'border border-[#5C4033]/30 bg-transparent hover:bg-[#EAD8B8]/10'
                        : 'border border-slate-700 bg-transparent hover:border-slate-500 rounded-lg hover:bg-slate-900/30';
                    return (
                      <button
                        key={arc.id}
                        type="button"
                        onClick={() => {
                          setCustomArchetypeLocal(arc.id as any);
                          audio.playBlip();
                        }}
                        className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${arcBtnClass}`}
                      >
                        {arc.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Attributes Rolling */}
        {currentStep.id === 'attributes' && (
          <div className="space-y-6 animate-fade-in font-sans">
            <div className="text-center mb-6">
              <h3 className={`text-lg uppercase font-bold tracking-widest ${isPapyrus ? 'text-[#2D1D16]' : 'text-slate-200'}`}>
                {isZagor && selectedHeroLocal !== 'personalizado' ? 'Atributos Fixados' : 'Determine Seus Atributos Iniciais'}
              </h3>
              <p className="text-xs opacity-75 mt-1">
                {isZagor && selectedHeroLocal !== 'personalizado'
                  ? 'Os atributos do seu herói são predefinidos por regras oficiais.'
                  : 'Role os dados para determinar seus valores de partida.'}
              </p>
            </div>

            <div className={`grid grid-cols-1 ${(isCidadela || isVampiro || isMansao || isZagor) ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3'} gap-6`}>
              {/* SKILL Card */}
              <div 
                onClick={rolledSkill === null && !(isMedo && selectedPower === 'superforca') ? rollSkill : undefined}
                className={attributeCardStyle(rolledSkill !== null, rollingSkill)}
              >
                <div className="flex items-center gap-1.5 justify-center mb-1">
                  <Shield size={16} className={isPapyrus ? 'text-[#8B4513]' : 'text-cyan-400'} />
                  <span className="text-xs uppercase font-extrabold tracking-wider truncate">
                    {isTraveller ? 'Habilidade (Cap)' : 'Habilidade'}
                  </span>
                </div>
                <div className="my-4 h-14 flex items-center justify-center">
                  {rollingSkill ? (
                    <span className="text-3xl font-extrabold animate-bounce">{displaySkill}</span>
                  ) : rolledSkill !== null ? (
                    <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-4xl font-extrabold">
                      {rolledSkill}
                    </motion.span>
                  ) : (
                    <Dices size={32} className={`opacity-40 ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-400'}`} />
                  )}
                </div>
                {isMedo && selectedPower === 'superforca' ? (
                  <div className="text-[10px] uppercase font-bold tracking-wider text-green-700 dark:text-cyan-400">Superforça 13</div>
                ) : rolledSkill !== null ? (
                  <div className="text-[9px] uppercase font-bold tracking-wider opacity-60">
                    {selectedHeroLocal && selectedHeroLocal !== 'personalizado' ? 'Fixo' : 'Dado + 6'}
                  </div>
                ) : (
                  <button onClick={(e) => { e.stopPropagation(); rollSkill(); }} className={buttonStyle} disabled={rollingSkill}>
                    Role 1d6+6
                  </button>
                )}
              </div>

              {/* ENERGY Card */}
              <div 
                onClick={rolledEnergy === null ? rollEnergy : undefined}
                className={attributeCardStyle(rolledEnergy !== null, rollingEnergy)}
              >
                <div className="flex items-center gap-1.5 justify-center mb-1">
                  <Heart size={16} className={isPapyrus ? 'text-[#8B0000]' : 'text-red-400'} />
                  <span className="text-xs uppercase font-extrabold tracking-wider truncate">
                    {isTraveller ? 'Energia (Cap)' : 'Energia'}
                  </span>
                </div>
                <div className="my-4 h-14 flex items-center justify-center">
                  {rollingEnergy ? (
                    <span className="text-3xl font-extrabold animate-bounce">{displayEnergy}</span>
                  ) : rolledEnergy !== null ? (
                    <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-4xl font-extrabold">
                      {rolledEnergy}
                    </motion.span>
                  ) : (
                    <Dices size={32} className={`opacity-40 ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-400'}`} />
                  )}
                </div>
                {rolledEnergy !== null ? (
                  <div className="text-[9px] uppercase font-bold tracking-wider opacity-60">
                    {selectedHeroLocal && selectedHeroLocal !== 'personalizado' ? 'Fixo' : '2 Dados + 12'}
                  </div>
                ) : (
                  <button onClick={(e) => { e.stopPropagation(); rollEnergy(); }} className={buttonStyle} disabled={rollingEnergy}>
                    Role 2d6+12
                  </button>
                )}
              </div>

              {/* LUCK Card */}
              <div 
                onClick={rolledLuck === null ? rollLuck : undefined}
                className={attributeCardStyle(rolledLuck !== null, rollingLuck)}
              >
                <div className="flex items-center gap-1.5 justify-center mb-1">
                  <Clover size={16} className={isPapyrus ? 'text-[#006400]' : 'text-green-400'} />
                  <span className="text-xs uppercase font-extrabold tracking-wider truncate">
                    {isTraveller ? 'Sorte (Tripulação)' : 'Sorte'}
                  </span>
                </div>
                <div className="my-4 h-14 flex items-center justify-center">
                  {rollingLuck ? (
                    <span className="text-3xl font-extrabold animate-bounce">{displayLuck}</span>
                  ) : rolledLuck !== null ? (
                    <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-4xl font-extrabold">
                      {rolledLuck}
                    </motion.span>
                  ) : (
                    <Dices size={32} className={`opacity-40 ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-400'}`} />
                  )}
                </div>
                {rolledLuck !== null ? (
                  <div className="text-[9px] uppercase font-bold tracking-wider opacity-60">
                    {selectedHeroLocal && selectedHeroLocal !== 'personalizado' ? 'Fixo' : 'Dado + 6'}
                  </div>
                ) : (
                  <button onClick={(e) => { e.stopPropagation(); rollLuck(); }} className={buttonStyle} disabled={rollingLuck}>
                    Role 1d6+6
                  </button>
                )}
              </div>

              {/* FAITH Card */}
              {isVampiro && (
                <div 
                  onClick={rolledFaith === null ? rollFaith : undefined}
                  className={attributeCardStyle(rolledFaith !== null, rollingFaith)}
                >
                  <div className="flex items-center gap-1.5 justify-center mb-1">
                    <Flame size={16} className={isPapyrus ? 'text-[#8B4513]' : 'text-orange-400'} />
                    <span className="text-xs uppercase font-extrabold tracking-wider">Fé</span>
                  </div>
                  <div className="my-4 h-14 flex items-center justify-center">
                    {rollingFaith ? (
                      <span className="text-3xl font-extrabold animate-bounce">{displayFaith}</span>
                    ) : rolledFaith !== null ? (
                      <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-4xl font-extrabold">
                        {rolledFaith}
                      </motion.span>
                    ) : (
                      <Dices size={32} className={`opacity-40 ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-400'}`} />
                    )}
                  </div>
                  {rolledFaith !== null ? (
                    <div className="text-[9px] uppercase font-bold tracking-wider opacity-60">Dado + 3</div>
                  ) : (
                    <button onClick={(e) => { e.stopPropagation(); rollFaith(); }} className={buttonStyle} disabled={rollingFaith}>
                      Role 1d6+3
                    </button>
                  )}
                </div>
              )}

              {/* MAGIC Card */}
              {isCidadela && (
                <div 
                  onClick={rolledMagic === null ? rollMagic : undefined}
                  className={attributeCardStyle(rolledMagic !== null, rollingMagic)}
                >
                  <div className="flex items-center gap-1.5 justify-center mb-1">
                    <Sparkles size={16} className={isPapyrus ? 'text-[#8B008B]' : 'text-purple-400'} />
                    <span className="text-xs uppercase font-extrabold tracking-wider">Mágica</span>
                  </div>
                  <div className="my-4 h-14 flex items-center justify-center">
                    {rollingMagic ? (
                      <span className="text-3xl font-extrabold animate-bounce">{displayMagic}</span>
                    ) : rolledMagic !== null ? (
                      <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-4xl font-extrabold">
                        {rolledMagic}
                      </motion.span>
                    ) : (
                      <Dices size={32} className={`opacity-40 ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-400'}`} />
                    )}
                  </div>
                  {rolledMagic !== null ? (
                    <div className="text-[9px] uppercase font-bold tracking-wider opacity-60">2 Dados + 6</div>
                  ) : (
                    <button onClick={(e) => { e.stopPropagation(); rollMagic(); }} className={buttonStyle} disabled={rollingMagic}>
                      Role 2d6+6
                    </button>
                  )}
                </div>
              )}

              {/* FEAR Card */}
              {isMansao && (
                <div 
                  onClick={rolledFear === null ? rollFear : undefined}
                  className={attributeCardStyle(rolledFear !== null, rollingFear)}
                >
                  <div className="flex items-center gap-1.5 justify-center mb-1">
                    <Flame size={16} className={isPapyrus ? 'text-[#8B0000]' : 'text-red-500'} />
                    <span className="text-xs uppercase font-extrabold tracking-wider">Medo Máximo</span>
                  </div>
                  <div className="my-4 h-14 flex items-center justify-center">
                    {rollingFear ? (
                      <span className="text-3xl font-extrabold animate-bounce">{displayFear}</span>
                    ) : rolledFear !== null ? (
                      <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-4xl font-extrabold">
                        {rolledFear}
                      </motion.span>
                    ) : (
                      <Dices size={32} className={`opacity-40 ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-400'}`} />
                    )}
                  </div>
                  {rolledFear !== null ? (
                    <div className="text-[9px] uppercase font-bold tracking-wider opacity-60">Dado + 6</div>
                  ) : (
                    <button onClick={(e) => { e.stopPropagation(); rollFear(); }} className={buttonStyle} disabled={rollingFear}>
                      Role 1d6+6
                    </button>
                  )}
                </div>
              )}

              {/* WILLPOWER Card */}
              {isZagor && selectedHeroLocal && (
                <div 
                  onClick={rolledWillpower === null ? rollWillpower : undefined}
                  className={attributeCardStyle(rolledWillpower !== null, rollingWillpower)}
                >
                  <div className="flex items-center gap-1.5 justify-center mb-1">
                    <Sparkles size={16} className={isPapyrus ? 'text-[#8B008B]' : 'text-purple-400'} />
                    <span className="text-xs uppercase font-extrabold tracking-wider truncate">
                      {(selectedHeroLocal === 'sallazar' || (selectedHeroLocal === 'personalizado' && customArchetypeLocal === 'sallazar')) ? 'Pontos Mágicos' : 'Vontade'}
                    </span>
                  </div>
                  <div className="my-4 h-14 flex items-center justify-center">
                    {rollingWillpower ? (
                      <span className="text-3xl font-extrabold animate-bounce">{displayWillpower}</span>
                    ) : rolledWillpower !== null ? (
                      <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-4xl font-extrabold">
                        {rolledWillpower}
                      </motion.span>
                    ) : (
                      <Dices size={32} className={`opacity-40 ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-400'}`} />
                    )}
                  </div>
                  {rolledWillpower !== null ? (
                    <div className="text-[9px] uppercase font-bold tracking-wider opacity-60">
                      {selectedHeroLocal === 'personalizado' ? 'Dado + 6' : 'Fixo'}
                    </div>
                  ) : (
                    <button onClick={(e) => { e.stopPropagation(); rollWillpower(); }} className={buttonStyle} disabled={rollingWillpower}>
                      Role 1d6+6
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 5: Spells Choice (Cidadela) */}
        {currentStep.id === 'spells' && isCidadela && (
          (() => {
            const spentPoints = Object.values(selectedSpells).reduce((sum, val) => sum + val, 0);
            const remainingMagicPoints = (rolledMagic || 0) - spentPoints;
            return (
              <div className="space-y-6 animate-fade-in font-sans">
                <div className="text-center mb-4">
                  <h3 className={`text-xl font-bold uppercase tracking-wider ${isPapyrus ? 'text-[#5C4033]' : 'text-purple-400'}`}>
                    Grimório do Mago
                  </h3>
                  <p className="text-xs mt-1">
                    Você tem <span className="font-extrabold text-sm">{rolledMagic}</span> pontos de Mágica para adquirir seus feitiços.
                  </p>
                  <div className={`mt-3 inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded ${
                    remainingMagicPoints === 0 ? 'bg-green-500/20 text-green-700 dark:text-green-400' : 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                  }`}>
                    {remainingMagicPoints === 0 ? 'Tudo pronto!' : `Pontos para distribuir: ${remainingMagicPoints}`}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-2">
                  {CIDADELA_SPELLS.map((spell) => {
                    const count = selectedSpells[spell.key] || 0;
                    return (
                      <div 
                        key={spell.key} 
                        className={`p-3 border flex flex-col justify-between ${
                          isPapyrus ? 'border-[#5C4033]/30 bg-[#FDF6E3] hover:border-[#5C4033]/60' : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 rounded-xl'
                        } transition-all duration-200`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-xs uppercase tracking-wide truncate pr-2">{spell.name}</h4>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleAdjustSpell(spell.key, -1)}
                              className={`w-6 h-6 flex items-center justify-center text-xs font-bold transition-colors ${
                                isPapyrus ? 'bg-[#EAD8B8] hover:bg-[#5C4033] hover:text-[#EAD8B8] text-[#2C1E14]' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md'
                              } disabled:opacity-40 cursor-pointer`}
                              disabled={count === 0}
                            >
                              -
                            </button>
                            <span className="font-mono text-xs font-bold w-4 text-center">{count}</span>
                            <button
                              onClick={() => handleAdjustSpell(spell.key, 1)}
                              className={`w-6 h-6 flex items-center justify-center text-xs font-bold transition-colors ${
                                isPapyrus ? 'bg-[#EAD8B8] hover:bg-[#5C4033] hover:text-[#EAD8B8] text-[#2C1E14]' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md'
                              } disabled:opacity-40 cursor-pointer`}
                              disabled={remainingMagicPoints <= 0}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <p className={`text-[10px] leading-relaxed opacity-75 ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-400'}`}>
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

        {/* STEP 6: Crew Selection (Traveller) */}
        {currentStep.id === 'crew' && isTraveller && (
          <div className="space-y-6 animate-fade-in font-sans">
            <div className="text-center">
              <h3 className={`text-lg font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${isPapyrus ? 'text-[#5C4033]' : 'text-cyan-400'}`}>
                <Rocket size={20} /> Astronave & Tripulação de Ponte
              </h3>
              <p className="text-xs opacity-75 mt-1">Determine os atributos iniciais da astronave Traveller e dos oficiais.</p>
              <button
                type="button"
                onClick={rollTravellerCrew}
                disabled={rollingCrew}
                className="mt-4 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold uppercase tracking-wider rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2 mx-auto cursor-pointer text-xs"
              >
                <Dices size={16} /> {travellerCrew ? 'Re-rolar Tripulação & Nave' : 'Rolar Oficiais & Nave'}
              </button>
            </div>

            {travellerCrew && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[340px] overflow-y-auto pr-2">
                {/* Ship */}
                <div className={`p-4 rounded-xl border flex flex-col gap-2 ${isPapyrus ? 'bg-[#FDF6E3] border-[#5C4033]/30' : 'bg-slate-950/60 border-slate-700'}`}>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5"><Zap size={14} /> Astronave Traveller</span>
                  <div className="grid grid-cols-2 gap-2 text-center text-xs mt-1 font-mono">
                    <div className="p-2 rounded bg-current/5 border border-current/10">
                      <span className="text-[9px] block opacity-70">FP (1d6+6)</span>
                      <span className="text-sm font-extrabold">{travellerCrew.ship.firepower}</span>
                    </div>
                    <div className="p-2 rounded bg-current/5 border border-current/10">
                      <span className="text-[9px] block opacity-70">Escudos (2d6+12)</span>
                      <span className="text-sm font-extrabold text-blue-400">{travellerCrew.ship.shields}</span>
                    </div>
                  </div>
                </div>

                {/* Oficiais */}
                {[
                  { key: 'science', name: 'Oficial de Ciências', data: travellerCrew.science },
                  { key: 'engineering', name: 'Oficial Engenheiro', data: travellerCrew.engineering },
                  { key: 'medical', name: 'Oficial Médica', data: travellerCrew.medical },
                  { key: 'security', name: 'Oficial de Segurança', data: travellerCrew.security },
                  { key: 'guard1', name: 'Guarda de Segurança 1', data: travellerCrew.guard1 },
                  { key: 'guard2', name: 'Guarda de Segurança 2', data: travellerCrew.guard2 },
                ].map((off) => (
                  <div key={off.key} className={`p-4 rounded-xl border flex flex-col gap-2 ${isPapyrus ? 'bg-[#FDF6E3] border-[#5C4033]/30' : 'bg-slate-950/60 border-slate-700'}`}>
                    <span className="text-xs font-bold uppercase tracking-wider truncate flex items-center gap-1.5"><Users size={12} className="opacity-70" /> {off.name}</span>
                    <div className="grid grid-cols-2 gap-2 text-center text-xs mt-1 font-mono">
                      <div className="p-2 rounded bg-current/5 border border-current/10">
                        <span className="text-[9px] block opacity-70">Hab (1d6+6)</span>
                        <span className="text-sm font-extrabold">{off.data.skill}</span>
                      </div>
                      <div className="p-2 rounded bg-current/5 border border-current/10">
                        <span className="text-[9px] block opacity-70">Energ (2d6+12)</span>
                        <span className="text-sm font-extrabold text-red-500">{off.data.energy}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 7: Review and Finalize */}
        {currentStep.id === 'review' && renderReviewStep()}

      </div>

      {/* Navigation Controls */}
      {renderNavigationButtons()}
    </div>
  );
};
