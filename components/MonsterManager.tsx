'use client';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useSheetStore, Monster } from '@/store/useSheetStore';
import { User, Sparkles } from 'lucide-react';
import { audio } from '@/lib/audio';

// Importando arquivos de encontros dos livros
import feiticeiroMontanhaJSON from '@/encontros/feiticeiro_montanha_de_fogo.json';
import cidadelaCaosJSON from '@/encontros/cidadela_do_caos.json';
import florestaDestruicaoJSON from '@/encontros/floresta_da_destruicao.json';
import cidadeLadroesJSON from '@/encontros/cidade_dos_ladroes.json';
import masmorraMorteJSON from '@/encontros/masmorra_da_morte.json';
import naveTravellerJSON from '@/encontros/nave_espacial_traveller.json';
import temploTerrorJSON from '@/encontros/templo_do_terror.json';
import coligacoesKetherJSON from '@/encontros/coligacoes_de_kether.json';
import maresSangueJSON from '@/encontros/mares_de_sangue.json';
import encontroMedoJSON from '@/encontros/encontro_marcado_medo.json';
import criptaVampiroJSON from '@/encontros/cripta_do_vampiro.json';
import exercitosMorteJSON from '@/encontros/exercitos_da_morte.json';

const BOOK_MONSTERS_MAP: Record<string, any> = {
  'O Feiticeiro da Montanha de Fogo': feiticeiroMontanhaJSON,
  'A Cidadela do Caos': cidadelaCaosJSON,
  'A Floresta da Destruição': florestaDestruicaoJSON,
  'A Cidade dos Ladrões': cidadeLadroesJSON,
  'A Masmorra da Morte': masmorraMorteJSON,
  'Nave Espacial Traveller': naveTravellerJSON,
  'O Templo do Terror': temploTerrorJSON,
  'As Coligações de Kether': coligacoesKetherJSON,
  'Mares de Sangue': maresSangueJSON,
  'Encontro Marcado com o M.E.D.O.': encontroMedoJSON,
  'A Cripta do Vampiro': criptaVampiroJSON,
  'Exércitos da Morte': exercitosMorteJSON,
};

export const MonsterManager = () => {
  const { 
    monsters, 
    addMonster, 
    removeMonster, 
    updateMonsterEnergy, 
    gamebook,
    attributes,
    setSuggestionsEnabled
  } = useSheetStore();
  const [name, setName] = useState('');
  const [skill, setSkill] = useState(6);
  const [energy, setEnergy] = useState(6);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fecha as sugestões ao clicar/tocar fora do container do input
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const container = document.getElementById('monster-name-container');
      if (container && !container.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  const handleAddMonster = () => {
    if (!name.trim()) return;
    audio.playBlip();
    const newMonster: Monster = {
      id: crypto.randomUUID(),
      name,
      skill,
      energyMax: energy,
      energyCurrent: energy,
      status: 'alive'
    };
    addMonster(newMonster);
    setName('');
    setSkill(6);
    setEnergy(6);
    setShowSuggestions(false);
  };

  const handleRemoveMonster = (id: string) => {
    audio.playBlip();
    removeMonster(id);
  };

  const handleUpdateMonsterEnergy = (id: string, delta: number) => {
    const monster = monsters.find(m => m.id === id);
    if (!monster) return;
    const nextEnergy = Math.max(0, monster.energyCurrent + delta);
    if (delta < 0) {
      if (nextEnergy === 0 && monster.energyCurrent > 0) {
        audio.playSuccess(); // defeated!
      } else {
        audio.playHit();
      }
    } else {
      audio.playBlip();
    }
    updateMonsterEnergy(id, delta);
  };

  // Helper to normalize strings (remove accents) for better searching
  const normalizeStr = (str: string) => 
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  // Function to clean and capitalize monster names that have injected characters
  const cleanMonsterName = (rawName: string): string => {
    if (!rawName) return rawName;
    const evenChars = [];
    for (let i = 0; i < rawName.length; i += 2) {
      evenChars.push(rawName[i]);
    }
    const accentAInjections = evenChars.filter(c => /[áÁãÃâÂàÀäÄéÉêÊíÍóÓõÕôÔúÚ]/.test(c));
    const isObfuscated = rawName.length >= 3 && rawName.length % 2 === 1 && (accentAInjections.length / evenChars.length) >= 0.8;

    if (isObfuscated) {
      let cleaned = '';
      for (let i = 1; i < rawName.length; i += 2) {
        cleaned += rawName[i];
      }
      // Capitalize first letter of each word / subword
      return cleaned
        .split(' ')
        .map(word => {
          if (!word) return '';
          return word
            .split('-')
            .map(subWord => subWord.charAt(0).toUpperCase() + subWord.slice(1))
            .join('-');
        })
        .join(' ');
    }
    return rawName;
  };

  const bookData = BOOK_MONSTERS_MAP[gamebook];
  const rawBookMonsters = bookData ? bookData.monstros : [];
  const bookMonsters = rawBookMonsters.map((m: any) => ({
    ...m,
    nome: cleanMonsterName(m.nome),
  }));

  // Filtra as sugestões do livro com base no que o jogador está digitando (mínimo de 3 letras) e se a opção está ativa
  const suggestions = (attributes.suggestionsEnabled !== false) && name.trim().length >= 3
    ? bookMonsters.filter((m: any) => normalizeStr(m.nome).includes(normalizeStr(name)))
    : [];

  return (
    <div>
      <h2 className="text-xl font-bold uppercase text-center border-b-2 border-[#2C1E14] pb-2 mb-4">Encontro com Monstros</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6 max-h-80 overflow-y-auto pr-1">
        {monsters.map(monster => {
          const isLowEnergy = (monster.energyCurrent / monster.energyMax) < 0.25;
          return (
            <motion.div 
              key={monster.id}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.4 }}
              className={`bg-[#EAD8B8] border flex flex-col ${isLowEnergy ? 'border-4 border-yellow-500' : 'border-[#5C4033]'} p-2 text-sm text-[#2C1E14]`}
            >
              <div className="font-bold border-b border-[#5C4033] mb-1 pb-1 flex justify-between">
                {monster.name}
                <button onClick={() => handleRemoveMonster(monster.id)} className="text-red-700 text-[10px] hover:underline uppercase">Remover</button>
              </div>
              <div className="flex justify-between items-center flex-grow mt-1">
                <div className="text-sm font-semibold text-[#2C1E14] leading-tight">
                  <p>Hab: {monster.skill}</p>
                  <p>Ener Max: {monster.energyMax}</p>
                  <p>Ener At: {monster.energyCurrent}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleUpdateMonsterEnergy(monster.id, -1)} className="bg-[#2C1E14] text-[#EAD8B8] px-3 py-1.5 font-bold">-1</button>
                  <button onClick={() => handleUpdateMonsterEnergy(monster.id, 1)} className="bg-[#2C1E14] text-[#EAD8B8] px-3 py-1.5 font-bold">+1</button>
                </div>
              </div>
              <div className={`mt-2 text-center text-[10px] sm:text-xs font-bold py-0.5 px-1 ${monster.status === 'alive' ? 'bg-red-900 text-white' : 'bg-gray-700 text-white'}`}>
                {monster.status === 'alive' ? 'VIVO' : 'DERROTADO'}
              </div>
            </motion.div>
          );
        })}
        {Array.from({ length: Math.max(0, 3 - monsters.length) }).map((_, i) => (
          <div key={i} className="border-2 border-dashed border-[#5C4033] flex flex-col items-center justify-center p-4 text-[#5C4033] opacity-50">
            <User size={32} />
            <p className="text-xs">Vaga</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-sm sm:text-base font-bold text-[#2C1E14]">
        <label className="flex flex-col gap-1 relative">
          <div className="flex items-center justify-between mb-0.5">
            <span>Nome</span>
            {bookMonsters && bookMonsters.length > 0 && (
              <span className="flex items-center gap-1 cursor-pointer select-none text-[9px] uppercase font-bold text-[#5C4033]/70 font-sans">
                <input 
                  type="checkbox"
                  id="toggle-suggestions-combat"
                  checked={attributes.suggestionsEnabled !== false}
                  onChange={(e) => setSuggestionsEnabled(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#5C4033] cursor-pointer"
                />
                <label htmlFor="toggle-suggestions-combat" className="cursor-pointer">Sugerir</label>
              </span>
            )}
          </div>
          <div id="monster-name-container" className="relative w-full">
            <input 
              type="text" 
              value={name} 
              onChange={e => {
                setName(e.target.value);
                setShowSuggestions(true);
              }} 
              onFocus={() => setShowSuggestions(true)}
              placeholder="Nome do monstro" 
              className="p-3 pr-10 border border-[#5C4033] bg-[#EAD8B8] text-base focus:outline-none focus:ring-2 focus:ring-[#C5A059] w-full" 
            />
            {bookMonsters && bookMonsters.length > 0 && attributes.suggestionsEnabled !== false && (
              <span 
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-help"
                title={suggestions.length > 0 ? "Sugestões de monstros encontradas!" : "Sugestões do livro ativas (digite 3 letras...)"}
              >
                <Sparkles 
                  size={16} 
                  className={`transition-all duration-300 ${
                    suggestions.length > 0 
                      ? 'text-yellow-600 scale-110 drop-shadow-[0_0_6px_rgba(202,138,4,0.3)]' 
                      : 'text-[#5C4033]/30'
                  }`}
                />
              </span>
            )}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-20 mt-1 bg-[#FDF6E3] border-2 border-[#5C4033] shadow-lg max-h-48 overflow-y-auto rounded-sm">
                {suggestions.map((m: any) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setName(m.nome);
                      setSkill(m.habilidade);
                      setEnergy(m.energiaMaxima);
                      setShowSuggestions(false);
                      useSheetStore.getState().incrementStat('suggestionsUsed');
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-[#EAD8B8] text-[#2C1E14] text-xs font-bold border-b border-[#5C4033]/20 last:border-0 cursor-pointer transition-colors"
                  >
                    ✨ {m.nome}
                  </button>
                ))}
              </div>
            )}
          </div>
        </label>
        <label className="flex flex-col gap-1">Habilidade
          <input type="number" value={skill} onChange={e => setSkill(parseInt(e.target.value) || 0)} placeholder="Hab" className="p-3 border border-[#5C4033] bg-[#EAD8B8] text-base focus:outline-none focus:ring-2 focus:ring-[#C5A059]" />
        </label>
        <label className="flex flex-col gap-1">Energia
          <input type="number" value={energy} onChange={e => setEnergy(parseInt(e.target.value) || 0)} placeholder="Energia" className="p-3 border border-[#5C4033] bg-[#EAD8B8] text-base focus:outline-none focus:ring-2 focus:ring-[#C5A059]" />
        </label>
      </div>
      <button onClick={handleAddMonster} className="w-full bg-[#2C1E14] text-[#EAD8B8] py-3 uppercase font-bold text-sm tracking-widest hover:bg-[#4A3728] transition">
        + Adicionar Novo Monstro
      </button>
    </div>
  );
};
