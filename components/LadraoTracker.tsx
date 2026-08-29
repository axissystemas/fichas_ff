'use client';

import { useState } from 'react';
import { useSheetStore } from '@/store/useSheetStore';
import { audio } from '@/lib/audio';
import {
  KeyRound,
  Coins,
  Footprints,
  Wind,
  EyeOff,
  Search,
  Sparkles,
  Check,
  Pencil,
  ShieldAlert,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export interface ThiefSkill {
  id: string;
  name: string;
  description: string;
  icon: any;
}

export const THIEF_SKILLS: ThiefSkill[] = [
  {
    id: 'maos_leves',
    name: 'Mãos Leves',
    description: 'Subtrair itens de bolsas, bolsos de transeuntes e pequenos truques de prestidigitação sem ser notado.',
    icon: Coins
  },
  {
    id: 'destrancar_fechaduras',
    name: 'Destrancar Fechaduras',
    description: 'Uso especializado de gazuas para abrir portas trancadas, grades, cadeados e fechaduras de baús.',
    icon: KeyRound
  },
  {
    id: 'escalar',
    name: 'Escalar',
    description: 'Destreza e agilidade física para galgar muros altos, paredes de pedra irregulares e telhados com segurança.',
    icon: Footprints
  },
  {
    id: 'esgueirar',
    name: 'Esgueirar',
    description: 'Mover-se pelas sombras e assoalhos rangentes em silêncio absoluto, passando despercebido por guardas.',
    icon: Wind
  },
  {
    id: 'esconder_se',
    name: 'Esconder-se',
    description: 'Camuflar-se no ambiente e aproveitar a penumbra para se tornar praticamente invisível aos olhos alheios.',
    icon: EyeOff
  },
  {
    id: 'encontrar',
    name: 'Encontrar',
    description: 'Olhar aguçado para inspecionar aposentos, notar passagens secretas, pisos ocos e armadilhas ocultas.',
    icon: Search
  },
  {
    id: 'sinais_secretos',
    name: 'Sinais Secretos',
    description: 'Conhecimento das marcas misteriosas, símbolos de giz, gírias e códigos criptografados da Guilda dos Ladrões.',
    icon: Sparkles
  }
];

export const LadraoTracker = () => {
  const { attributes, setSpecialSkills, theme } = useSheetStore();
  const isPapyrus = theme === 'papyrus';

  const selectedSkills: string[] = attributes.specialSkills || [];
  const [isEditing, setIsEditing] = useState(selectedSkills.length < 3);

  const toggleSkill = (id: string) => {
    audio.playBlip();
    if (selectedSkills.includes(id)) {
      setSpecialSkills(selectedSkills.filter(s => s !== id));
    } else {
      if (selectedSkills.length >= 3) {
        alert('Você só pode possuir exatamente 3 proficiências especiais de acordo com as regras da Guilda dos Ladrões. Desmarque uma antes de selecionar outra.');
        return;
      }
      setSpecialSkills([...selectedSkills, id]);
    }
  };

  const activeSkillsList = THIEF_SKILLS.filter(s => selectedSkills.includes(s.id));

  return (
    <div
      className={`p-5 border-2 transition-all duration-300 ${
        isPapyrus
          ? 'border-[#5C4033] bg-[#EAD8B8]/20 text-[#2D1D16] shadow-sm'
          : 'border-amber-500/30 bg-slate-900/80 text-slate-200 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.05)]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-current/10 pb-3 mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 rounded-lg ${
              isPapyrus ? 'bg-[#5C4033]/15 text-[#8B4513]' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}
          >
            <KeyRound size={18} />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center gap-2">
              Proficiências Especiais
              <span
                className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                  selectedSkills.length === 3
                    ? isPapyrus
                      ? 'bg-emerald-600/15 text-emerald-800'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : isPapyrus
                    ? 'bg-amber-600/15 text-amber-800'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {selectedSkills.length}/3 Escolhidas
              </span>
            </h3>
            <p className="text-[10px] opacity-75 font-sans">
              Treinamento de aprendiz da Guilda dos Ladrões
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            audio.playBlip();
            setIsEditing(!isEditing);
          }}
          className={`flex items-center gap-1 px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded border cursor-pointer transition ${
            isPapyrus
              ? 'border-[#5C4033] hover:bg-[#5C4033] hover:text-[#FDF6E3] text-[#2D1D16]'
              : 'border-amber-500/40 hover:bg-amber-500/20 text-amber-300'
          }`}
        >
          {isEditing ? (
            <>
              <Check size={12} /> Concluir
            </>
          ) : (
            <>
              <Pencil size={11} /> Ajustar
            </>
          )}
        </button>
      </div>

      {/* Alerta se faltar selecionar */}
      {selectedSkills.length < 3 && (
        <div className="mb-4 p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-500 text-xs font-sans flex items-start gap-2">
          <ShieldAlert size={16} className="shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Atenção, Ladino:</strong> Escolha{' '}
            {3 - selectedSkills.length} proficiência(s) restante(s) abaixo para completar seu treinamento.
          </div>
        </div>
      )}

      {/* Modo de Edição / Seleção: Mostra todas as 7 proficiências */}
      {isEditing ? (
        <div className="space-y-2">
          <p className="text-[11px] opacity-80 mb-3 font-sans">
            Clique para selecionar as 3 proficiências que você aprendeu na Guilda dos Ladrões:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {THIEF_SKILLS.map((skill) => {
              const isSelected = selectedSkills.includes(skill.id);
              const IconComp = skill.icon;
              return (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => toggleSkill(skill.id)}
                  className={`p-3 text-left rounded-lg border transition-all cursor-pointer flex items-start gap-2.5 ${
                    isSelected
                      ? isPapyrus
                        ? 'border-[#5C4033] bg-[#EAD8B8]/60 shadow-sm ring-1 ring-[#5C4033]'
                        : 'border-amber-400 bg-amber-500/15 shadow-[0_0_12px_rgba(245,158,11,0.15)] ring-1 ring-amber-400 text-white'
                      : isPapyrus
                      ? 'border-[#5C4033]/25 bg-transparent hover:bg-[#EAD8B8]/20 opacity-70'
                      : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div
                    className={`p-2 rounded-md shrink-0 mt-0.5 ${
                      isSelected
                        ? isPapyrus
                          ? 'bg-[#5C4033] text-[#FDF6E3]'
                          : 'bg-amber-500 text-slate-950 font-bold'
                        : isPapyrus
                        ? 'bg-[#5C4033]/10 text-[#5C4033]'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <IconComp size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4 className="text-xs font-bold uppercase tracking-wide">
                        {skill.name}
                      </h4>
                      {isSelected && (
                        <span className="text-emerald-500 font-bold text-xs">✓</span>
                      )}
                    </div>
                    <p className="text-[10px] leading-relaxed opacity-85 font-sans">
                      {skill.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Modo Visualização: Mostra as 3 proficiências ativas com destaque */
        <div className="space-y-3">
          {activeSkillsList.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-xs opacity-60 italic mb-2">Nenhuma proficiência selecionada ainda.</p>
              <button
                onClick={() => setIsEditing(true)}
                className={`px-3 py-1 text-xs uppercase font-bold rounded border ${
                  isPapyrus ? 'border-[#5C4033] bg-[#5C4033] text-[#FDF6E3]' : 'border-amber-500 bg-amber-500/20 text-amber-300'
                }`}
              >
                Escolher Proficiências
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {activeSkillsList.map((skill) => {
                const IconComp = skill.icon;
                return (
                  <div
                    key={skill.id}
                    className={`p-3.5 rounded-lg border flex flex-col justify-between ${
                      isPapyrus
                        ? 'border-[#5C4033]/50 bg-[#EAD8B8]/40 shadow-sm'
                        : 'border-amber-500/30 bg-slate-950/60 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`p-1.5 rounded-md ${
                            isPapyrus ? 'bg-[#5C4033] text-[#FDF6E3]' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          <IconComp size={15} />
                        </div>
                        <h4 className="text-xs font-bold uppercase tracking-wider">
                          {skill.name}
                        </h4>
                      </div>
                      <p className="text-[10px] leading-relaxed opacity-80 font-sans">
                        {skill.description}
                      </p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-current/10 flex items-center justify-between text-[9px] uppercase font-bold opacity-60 font-sans">
                      <span>Guilda dos Ladrões</span>
                      <span className="text-emerald-500">Ativa ✓</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
