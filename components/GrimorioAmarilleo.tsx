'use client';

import { useState } from 'react';
import { useSheetStore } from '@/store/useSheetStore';
import { audio } from '@/lib/audio';
import { 
  Flame, 
  Shield, 
  Heart, 
  ArrowUp, 
  Zap, 
  Skull,
  BookOpen,
  Clover,
  Key,
  Wand2,
  Sparkles,
  Coins,
  Compass
} from 'lucide-react';

const AMARILLEO_SPELLS = [
  {
    key: 'criar_alimento',
    name: 'Criar Alimento',
    description: 'Cria Provisões extras. Acrescenta 1, 3 ou 5 à mochila dependendo dos PM gastos. Não pode ser usado em combate.',
    icon: Heart,
    type: 'special_alimento'
  },
  {
    key: 'saltar',
    name: 'Saltar',
    cost: 1,
    description: 'Permite saltar com segurança por uma distância de até seis metros para atravessar abismos ou armadilhas. Não pode ser usado em combate.',
    icon: ArrowUp
  },
  {
    key: 'luz',
    name: 'Luz',
    cost: 1,
    description: 'Cria uma pequena esfera luminosa para atuar como lanterna. Cada uso ilumina apenas uma seção. Não pode ser usado em combate.',
    icon: Sparkles
  },
  {
    key: 'sorte',
    name: 'Feitiço da Sorte',
    cost: 1,
    description: 'Aumenta sua Sorte atual em 1 ponto (sem exceder o valor inicial). Não pode ser usado em combate.',
    icon: Clover,
    effectBadge: '+1 Sorte Atual'
  },
  {
    key: 'abrir',
    name: 'Abrir',
    cost: 1,
    description: 'Abre baús ou portas trancados com segurança, desativando armadilhas físicas ou mágicas. Não pode ser usado em combate.',
    icon: Key
  },
  {
    key: 'habilidade',
    name: 'Feitiço de Habilidade',
    cost: 1,
    description: 'Adiciona +1 à sua Habilidade atual por um curto período (antes de combates ou testes de Habilidade).',
    icon: Wand2,
    effectBadge: '+1 Habilidade Atual'
  },
  {
    key: 'maos_rapidas',
    name: 'Mãos Rápidas',
    cost: 2,
    description: 'Usado imediatamente antes de combates. Permite rolar os dados duas vezes e escolher o maior nas 3 primeiras rodadas.',
    icon: Zap
  },
  {
    key: 'bola_de_fogo',
    name: 'Bola de Fogo',
    cost: 2,
    description: 'Usado em qualquer rodada em vez de arma. Se vencer a rodada, o adversário perde 5 de Energia. Se perder, você sofre o dano.',
    icon: Flame,
    effectBadge: 'Dano: 5 Energia'
  },
  {
    key: 'barreira_magica',
    name: 'Barreira Mágica',
    cost: 2,
    description: 'Neutraliza o próximo feitiço lançado por um inimigo. Pode ser invocado a qualquer momento fora de combate.',
    icon: Shield
  },
  {
    key: 'morte',
    name: 'Feitiço da Morte',
    cost: 3,
    description: 'Usado em rodadas de ataque. Se vencer, mata instantaneamente oponente com Habilidade 9 ou menor (inútil em mortos-vivos ou Zagor).',
    icon: Skull,
    effectBadge: 'Instakill (Hab <= 9)'
  },
  {
    key: 'relampago',
    name: 'Relâmpago',
    cost: 3,
    description: 'Funciona como a Bola de Fogo, mas causa perda de 7 de Energia ao adversário se você for bem-sucedido.',
    icon: Zap,
    effectBadge: 'Dano: 7 Energia'
  },
  {
    key: 'teletransporte',
    name: 'Teletransporte',
    cost: 4,
    description: 'Permite teletransporte instantâneo ao encontrar portais mágicos especiais para evitar perigos e inimigos.',
    icon: Compass
  },
  {
    key: 'roubar_tesouro',
    name: 'Roubar Tesouro',
    description: 'Invoca Talismã Dourado ou Adaga de Prata para sua mochila (máximo de 2 conjurações, não dá Sorte).',
    icon: Coins,
    type: 'special_roubar'
  }
];

export const GrimorioAmarilleo = () => {
  const { attributes, setAttribute, addCombatLog, theme, addItem, updateProvisions } = useSheetStore();
  const willpower = attributes.willpower || { initial: 0, current: 0 };
  const isPapyrus = theme === 'papyrus';
  const [isOpen, setIsOpen] = useState(true);

  const handleCast = (spellKey: string, spellName: string, cost: number) => {
    if (willpower.current < cost) {
      alert('Pontos de Magia insuficientes!');
      return;
    }

    // Play spellcast sound
    audio.playCoin();

    // Deduct cost
    const newWillpower = Math.max(0, willpower.current - cost);
    setAttribute('willpower', newWillpower, false);

    let textLog = `Conjurou o feitiço ${spellName} (Custo: ${cost} PM).`;

    if (spellKey === 'sorte') {
      const luck = attributes.luck;
      const newLuck = Math.min(luck.current + 1, luck.initial);
      setAttribute('luck', newLuck, false);
      textLog += ` Sorte atual aumentada para ${newLuck}/${luck.initial}.`;
    } else if (spellKey === 'habilidade') {
      const skill = attributes.skill;
      const newSkill = skill.current + 1;
      setAttribute('skill', newSkill, false);
      textLog += ` Habilidade atual aumentada temporariamente para ${newSkill}.`;
    }

    addCombatLog({ type: 'spell', value: textLog });
  };

  const handleCastAlimento = (cost: number, provAmount: number) => {
    if (willpower.current < cost) {
      alert('Pontos de Magia insuficientes!');
      return;
    }
    audio.playCoin();
    const newWillpower = Math.max(0, willpower.current - cost);
    setAttribute('willpower', newWillpower, false);
    updateProvisions(provAmount);
    const textLog = `Conjurou Criar Alimento (Custo: ${cost} PM): Adicionou +${provAmount} Provisões.`;
    addCombatLog({ type: 'spell', value: textLog });
  };

  const handleCastRoubar = (itemType: 'Talismã Dourado' | 'Adaga de Prata') => {
    if (willpower.current < 5) {
      alert('Pontos de Magia insuficientes!');
      return;
    }
    audio.playCoin();
    const newWillpower = Math.max(0, willpower.current - 5);
    setAttribute('willpower', newWillpower, false);
    
    addItem({
      id: crypto.randomUUID(),
      name: itemType,
      quantity: 1,
      equipped: true
    });
    
    const textLog = `Conjurou Roubar Tesouro (Custo: 5 PM): Invocou ${itemType} para a mochila.`;
    addCombatLog({ type: 'spell', value: textLog });
  };

  const wrapperClass = isPapyrus
    ? 'border-4 border-[#5C4033] bg-[#FDF6E3] p-6 shadow-[-8px_8px_0px_rgba(0,0,0,0.15)] font-serif mb-6'
    : 'border border-purple-500/30 bg-slate-950/60 backdrop-blur-md p-6 rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.1)] mb-6';

  const titleClass = isPapyrus
    ? 'text-xl font-extrabold uppercase tracking-widest text-[#5C4033] flex items-center justify-between pb-2 cursor-pointer select-none border-b-2 border-[#5C4033]/20 mb-4'
    : 'text-xl font-bold uppercase tracking-widest bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent flex items-center justify-between pb-2 cursor-pointer select-none border-b border-slate-800 mb-4';

  return (
    <div className={wrapperClass}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={titleClass}
      >
        <div className="flex items-center gap-2">
          <BookOpen size={20} className={isPapyrus ? 'text-[#5C4033]' : 'text-purple-400'} />
          <span>Grimório Amarílleo</span>
        </div>
        <span className={`text-sm transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} ${isPapyrus ? 'text-[#5C4033]' : 'text-purple-400'}`}>
          ▼
        </span>
      </div>

      {isOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {AMARILLEO_SPELLS.map((spell) => {
            const Icon = spell.icon;
            
            // Check if this is a special spell or standard
            const isSpecial = spell.type !== undefined;
            const costDisplay = spell.type === 'special_alimento' 
              ? 'Varia 1-3 PM' 
              : spell.type === 'special_roubar' 
              ? '5 PM' 
              : `${spell.cost} PM`;
              
            const isOut = !isSpecial && willpower.current < (spell.cost || 0);

            const cardClass = isPapyrus
              ? `border-2 p-2.5 flex flex-col justify-between transition-all duration-200 ${
                  isOut 
                    ? 'border-[#5C4033]/20 bg-[#5C4033]/5 opacity-50' 
                    : 'border-[#5C4033] bg-[#EAD8B8]/15 hover:bg-[#EAD8B8]/35'
                }`
              : `border bg-slate-900/40 p-2.5 flex flex-col justify-between transition-all duration-200 rounded-xl ${
                  isOut
                    ? 'border-slate-800/40 opacity-40'
                    : 'border-purple-500/25 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 hover:border-purple-500/50'
                }`;

            const buttonClass = isPapyrus
              ? 'w-full py-1.5 px-3 bg-[#2C1E14] text-[#EAD8B8] hover:bg-[#5C4033] disabled:bg-[#5C4033]/20 disabled:text-[#5C4033]/40 font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer'
              : 'w-full py-1.5 px-3 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-500 text-slate-100 font-bold text-[10px] uppercase tracking-wider transition-all rounded-lg cursor-pointer';

            return (
              <div key={spell.key} className={cardClass}>
                <div>
                  <div className="flex justify-between items-start mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Icon size={14} className={isPapyrus ? 'text-[#5C4033]' : 'text-purple-400'} />
                      <h4 className={`font-bold text-[11px] uppercase tracking-wide ${isPapyrus ? 'text-[#2D1D16]' : 'text-slate-200'}`}>
                        {spell.name}
                      </h4>
                    </div>
                    <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isPapyrus 
                        ? 'bg-[#5C4033]/15 text-[#5C4033]' 
                        : 'bg-purple-950/40 text-purple-300'
                    }`}>
                      {costDisplay}
                    </span>
                  </div>
                  
                  <p className={`text-[10px] leading-relaxed mb-2 ${isPapyrus ? 'text-[#5C4033]/80' : 'text-slate-400'} font-sans`}>
                    {spell.description}
                  </p>

                  {spell.effectBadge && !isOut && (
                    <div className="mb-2">
                      <span className={`text-[8px] uppercase font-bold tracking-wider px-1 py-0.5 rounded ${
                        isPapyrus 
                          ? 'bg-[#8B4513]/10 text-[#8B4513]' 
                          : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      }`}>
                        ⚡ {spell.effectBadge}
                      </span>
                    </div>
                  )}
                </div>

                {spell.type === 'special_alimento' ? (
                  <div className="flex flex-col gap-1 mt-2">
                    <button
                      disabled={willpower.current < 1}
                      onClick={() => handleCastAlimento(1, 1)}
                      className={buttonClass}
                    >
                      1 PM (+1 Provisão)
                    </button>
                    <button
                      disabled={willpower.current < 2}
                      onClick={() => handleCastAlimento(2, 3)}
                      className={buttonClass}
                    >
                      2 PM (+3 Provisões)
                    </button>
                    <button
                      disabled={willpower.current < 3}
                      onClick={() => handleCastAlimento(3, 5)}
                      className={buttonClass}
                    >
                      3 PM (+5 Provisões)
                    </button>
                  </div>
                ) : spell.type === 'special_roubar' ? (
                  <div className="flex flex-col gap-1 mt-2">
                    <button
                      disabled={willpower.current < 5}
                      onClick={() => handleCastRoubar('Talismã Dourado')}
                      className={buttonClass}
                    >
                      Talismã Dourado (5 PM)
                    </button>
                    <button
                      disabled={willpower.current < 5}
                      onClick={() => handleCastRoubar('Adaga de Prata')}
                      className={buttonClass}
                    >
                      Adaga de Prata (5 PM)
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleCast(spell.key, spell.name, spell.cost || 0)}
                    disabled={isOut}
                    className={buttonClass}
                  >
                    {isOut ? 'Sem PM suficiente' : 'Conjurar'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
