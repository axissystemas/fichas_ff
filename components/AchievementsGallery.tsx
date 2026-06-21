'use client';

import React, { useState } from 'react';
import { useSheetStore } from '@/store/useSheetStore';
import { ACHIEVEMENTS, Achievement } from '@/lib/achievements';

const CATEGORIES = [
  { id: 'all', label: '🏆 Todas' },
  { id: 'combat', label: '⚔️ Combate' },
  { id: 'luck', label: '🍀 Sorte' },
  { id: 'survival', label: '🏕️ Sobrevivência' },
  { id: 'exploration', label: '🗺️ Exploração' },
  { id: 'character', label: '🧙 Personagem' },
  { id: 'resources', label: '🎧 Recursos' },
  { id: 'challenges', label: '☠️ Desafios' },
  { id: 'hall_of_fame', label: '🎖️ Hall da Fama' },
  { id: 'secret', label: '🔒 Secretas' }
];

export default function AchievementsGallery() {
  const unlocked = useSheetStore((state) => state.unlockedAchievements);
  const theme = useSheetStore((state) => state.theme);
  const isPapyrus = theme === 'papyrus';

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isOpen, setIsOpen] = useState(false);

  // Map of unlocked ids to unlock dates
  const unlockedMap = React.useMemo(() => {
    const map = new Map<string, string>();
    unlocked.forEach((u) => {
      map.set(u.achievement_id, u.unlocked_at);
    });
    return map;
  }, [unlocked]);

  // Compute counts per category dynamically
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = { all: ACHIEVEMENTS.length };
    ACHIEVEMENTS.forEach((a) => {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filter achievements
  const filteredAchievements = React.useMemo(() => {
    return ACHIEVEMENTS.filter((a) => {
      if (activeCategory === 'all') {
        // Under "All", we list normal achievements.
        // We will separate Hall of Fame into its own top section.
        return a.category !== 'hall_of_fame';
      }
      return a.category === activeCategory;
    });
  }, [activeCategory]);

  const hallOfFameAchievements = React.useMemo(() => {
    return ACHIEVEMENTS.filter((a) => a.category === 'hall_of_fame');
  }, []);

  const unlockedCount = ACHIEVEMENTS.filter((a) => unlockedMap.has(a.id)).length;
  const totalCount = ACHIEVEMENTS.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100) || 0;

  // Custom styling for border and container effects
  const getRarityStyles = (rarity: string, isUnlocked: boolean, isPapyrus: boolean) => {
    if (!isUnlocked) {
      return isPapyrus
        ? 'bg-[#EAD8B8]/30 border-[#5C4033]/15 opacity-60 hover:opacity-90'
        : 'bg-slate-950/40 border-slate-800/80 opacity-55 hover:opacity-85';
    }

    switch (rarity) {
      case 'uncommon':
        return isPapyrus
          ? 'border-emerald-600/50 bg-[#EAD8B8]/70 shadow-[0_0_8px_rgba(16,185,129,0.15)]'
          : 'border-emerald-500/40 bg-emerald-950/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]';
      case 'rare':
        return isPapyrus
          ? 'border-blue-600/50 bg-[#EAD8B8]/70 shadow-[0_0_8px_rgba(59,130,246,0.15)]'
          : 'border-blue-500/40 bg-blue-950/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]';
      case 'epic':
        return isPapyrus
          ? 'border-purple-600/60 bg-[#EAD8B8]/80 shadow-[0_0_12px_rgba(168,85,247,0.25)] animate-pulse'
          : 'border-purple-500/50 bg-purple-950/25 shadow-[0_0_14px_rgba(168,85,247,0.3)] animate-pulse';
      case 'legendary':
        return isPapyrus
          ? 'border-amber-600 bg-[#EAD8B8] shadow-[0_0_15px_rgba(245,158,11,0.3)] border-2 animate-pulse font-bold'
          : 'border-amber-500 bg-amber-950/30 shadow-[0_0_18px_rgba(245,158,11,0.55)] border-2 animate-pulse font-bold';
      case 'common':
      default:
        return isPapyrus
          ? 'bg-[#EAD8B8] border-[#5C4033]/40 shadow-sm'
          : 'bg-amber-500/10 border-amber-500/30 shadow-sm shadow-amber-500/5';
    }
  };

  const getIconRarityStyles = (rarity: string, isUnlocked: boolean, isPapyrus: boolean) => {
    if (!isUnlocked) {
      return 'bg-black/10 filter grayscale opacity-60';
    }
    switch (rarity) {
      case 'uncommon':
        return isPapyrus ? 'bg-emerald-600/20 text-emerald-800 border border-emerald-600/30' : 'bg-emerald-500/25 text-emerald-400 border border-emerald-500/30';
      case 'rare':
        return isPapyrus ? 'bg-blue-600/20 text-blue-800 border border-blue-600/30' : 'bg-blue-500/25 text-blue-400 border border-blue-500/30';
      case 'epic':
        return isPapyrus ? 'bg-purple-600/20 text-purple-800 border border-purple-600/30' : 'bg-purple-500/25 text-purple-400 border border-purple-500/30';
      case 'legendary':
        return isPapyrus ? 'bg-amber-600/25 text-amber-900 border border-amber-500/40' : 'bg-amber-500/25 text-amber-400 border border-amber-500/40';
      case 'common':
      default:
        return isPapyrus ? 'bg-[#5C4033]/15' : 'bg-amber-500/20';
    }
  };

  const getBadgeRarityStyles = (rarity: string, isUnlocked: boolean, isPapyrus: boolean) => {
    if (!isUnlocked) {
      return isPapyrus ? 'bg-black/10 text-[#5C4033]/60' : 'bg-slate-800 text-slate-500';
    }
    switch (rarity) {
      case 'uncommon':
        return isPapyrus ? 'bg-emerald-600/20 text-emerald-800 font-semibold' : 'bg-emerald-500/20 text-emerald-400';
      case 'rare':
        return isPapyrus ? 'bg-blue-600/20 text-blue-800 font-semibold' : 'bg-blue-500/20 text-blue-400';
      case 'epic':
        return isPapyrus ? 'bg-purple-600/20 text-purple-800 font-semibold' : 'bg-purple-500/25 text-purple-300';
      case 'legendary':
        return isPapyrus ? 'bg-amber-500 text-amber-950 font-bold' : 'bg-amber-550 text-slate-950 font-bold';
      case 'common':
      default:
        return isPapyrus ? 'bg-[#5C4033]/15 text-[#5C4033]' : 'bg-amber-500/20 text-amber-400';
    }
  };

  const HallOfFameMedal = ({ achievement, isUnlocked, unlockDate }: { achievement: Achievement; isUnlocked: boolean; unlockDate?: string }) => {
    const isLegendary = achievement.rarity === 'legendary';
    const borderClass = isUnlocked
      ? isLegendary
        ? isPapyrus
          ? 'border-amber-600 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.35)] animate-pulse border-2'
          : 'border-amber-500 bg-amber-950/20 shadow-[0_0_20px_rgba(245,158,11,0.55)] animate-pulse border-2'
        : isPapyrus
        ? 'border-blue-600/50 bg-blue-500/5 shadow-[0_0_10px_rgba(59,130,246,0.18)]'
        : 'border-blue-500/40 bg-blue-950/20 shadow-[0_0_12px_rgba(59,130,246,0.23)]'
      : isPapyrus
      ? 'border-[#5C4033]/15 bg-black/5 opacity-55'
      : 'border-slate-800 bg-slate-950/40 opacity-40';

    const iconBg = isUnlocked
      ? isLegendary
        ? isPapyrus ? 'bg-amber-600 text-white' : 'bg-amber-500 text-slate-950'
        : isPapyrus ? 'bg-blue-600/20 text-blue-700' : 'bg-blue-500/25 text-blue-400'
      : 'bg-black/10 filter grayscale';

    return (
      <div className={`flex flex-col items-center p-3.5 rounded-xl border text-center transition-all duration-300 hover:scale-105 ${borderClass}`}>
        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-md mb-2 border ${isUnlocked && isLegendary ? 'border-amber-400 animate-[spin_10s_linear_infinite]' : 'border-transparent'} ${iconBg}`}>
          {achievement.icon}
        </div>
        <span className={`text-xs font-bold leading-tight line-clamp-2 px-1 ${isUnlocked ? (isPapyrus ? 'text-[#2D1D16]' : 'text-slate-100') : 'text-slate-500'}`}>
          {achievement.title}
        </span>
        <span className={`text-[9px] mt-1.5 px-1.5 py-0.5 rounded leading-none ${isUnlocked ? 'bg-amber-500/10 text-amber-600 font-semibold' : 'bg-black/5 text-slate-500'}`}>
          {achievement.code}
        </span>
        <p className={`text-[10px] leading-snug mt-2 opacity-85 line-clamp-3 ${isPapyrus ? 'text-[#8C6D58]' : 'text-slate-400'}`}>
          {isUnlocked ? achievement.description : achievement.hint}
        </p>
        {isUnlocked && unlockDate && (
          <span className="text-[8px] mt-2 opacity-65 font-sans">
            {new Date(unlockDate).toLocaleDateString('pt-BR')}
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      className={`w-full rounded-xl border shadow-lg transition-all duration-300 ${
        isPapyrus
          ? 'bg-[#F5EAD4] border-[#5C4033]/30 text-[#2D1D16]'
          : 'bg-slate-900 border-slate-700 text-slate-100'
      }`}
    >
      {/* Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between p-4 cursor-pointer select-none rounded-t-xl hover:bg-black/5 transition-colors ${
          isPapyrus ? 'border-b border-[#5C4033]/15' : 'border-b border-slate-700/50'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">🏆</span>
          <div>
            <h3
              className="font-bold tracking-wide"
              style={{ fontFamily: isPapyrus ? "'Cinzel', Georgia, serif" : 'inherit' }}
            >
              Galeria de Conquistas
            </h3>
            <p className={`text-xs ${isPapyrus ? 'text-[#8C6D58]' : 'text-slate-400'}`}>
              {unlockedCount} de {totalCount} desbloqueadas ({progressPercent}%)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Mini progress bar */}
          <div className="hidden sm:block w-32 h-2 rounded-full overflow-hidden bg-black/10">
            <div
              className={`h-full transition-all duration-500 ${isPapyrus ? 'bg-[#5C4033]' : 'bg-amber-500'}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className={`text-sm transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </div>

      {/* Expandable Gallery Grid */}
      {isOpen && (
        <div className="p-4 flex flex-col gap-4 animate-fadeIn">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-1.5 border-b pb-3 border-[#5C4033]/10 dark:border-slate-800">
            {CATEGORIES.map((cat) => {
              const count = categoryCounts[cat.id] || 0;
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-md border transition-all cursor-pointer flex items-center gap-1 ${
                    active
                      ? isPapyrus
                        ? 'bg-[#5C4033] text-[#F5EAD4] border-[#5C4033]'
                        : 'bg-amber-500 text-slate-950 border-amber-500'
                      : isPapyrus
                      ? 'border-[#5C4033]/20 hover:bg-[#5C4033]/10 text-[#5C4033] bg-[#EAD8B8]/30'
                      : 'border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 bg-slate-950/20'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[9px] px-1 rounded-full ${active ? (isPapyrus ? 'bg-[#F5EAD4]/30 text-white' : 'bg-slate-950/20') : (isPapyrus ? 'bg-[#5C4033]/10' : 'bg-slate-800')}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Hall of Fame Highlights (Shown on 'all' or 'hall_of_fame') */}
          {(activeCategory === 'all' || activeCategory === 'hall_of_fame') && (
            <div className="flex flex-col gap-2 border-b pb-4 border-[#5C4033]/10 dark:border-slate-850">
              <h4 
                className="text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2"
                style={{ fontFamily: isPapyrus ? "'Cinzel', Georgia, serif" : 'inherit' }}
              >
                🎖️ Hall da Fama (Livros-Jogo e Grandes Feitos)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {hallOfFameAchievements.map((achievement) => {
                  const isUnlocked = unlockedMap.has(achievement.id);
                  const unlockDate = unlockedMap.get(achievement.id);
                  return (
                    <HallOfFameMedal
                      key={achievement.id}
                      achievement={achievement}
                      isUnlocked={isUnlocked}
                      unlockDate={unlockDate}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Remaining/Category Grid list */}
          {activeCategory !== 'hall_of_fame' && (
            <div className="flex flex-col gap-2">
              {activeCategory === 'all' && (
                <h4 
                  className="text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ fontFamily: isPapyrus ? "'Cinzel', Georgia, serif" : 'inherit' }}
                >
                  🏆 Conquistas Gerais e de Desafio
                </h4>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-1">
                {filteredAchievements.map((achievement) => {
                  const isUnlocked = unlockedMap.has(achievement.id);
                  const unlockDate = unlockedMap.get(achievement.id);
                  const isSecret = achievement.isSecret && !isUnlocked;

                  const title = isSecret ? 'Conquista Secreta 🔒' : achievement.title;
                  const description = isSecret ? '???' : (isUnlocked ? achievement.description : achievement.hint);
                  const icon = isSecret ? '🔒' : achievement.icon;
                  const code = isSecret ? 'SEGRETO' : achievement.code;
                  const rarity = isSecret ? 'secret' : achievement.rarity;

                  return (
                    <div
                      key={achievement.id}
                      className={`relative p-3.5 rounded-xl border flex items-start gap-3 transition-all duration-300 ${getRarityStyles(rarity, isUnlocked, isPapyrus)}`}
                    >
                      {/* Badge Icon */}
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full text-xl flex-shrink-0 select-none shadow-inner transition-transform duration-300 ${getIconRarityStyles(rarity, isUnlocked, isPapyrus)}`}
                      >
                        {icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 justify-between">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded leading-none ${getBadgeRarityStyles(rarity, isUnlocked, isPapyrus)}`}
                          >
                            {code}
                          </span>
                          {isUnlocked && unlockDate && (
                            <span className={`text-[9px] ${isPapyrus ? 'text-[#8C6D58]' : 'text-slate-500'} font-sans`}>
                              {new Date(unlockDate).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-xs font-bold leading-tight mt-1.5 truncate ${
                            isUnlocked
                              ? isPapyrus
                                ? 'text-[#2D1D16]'
                                : 'text-slate-100'
                              : isPapyrus
                              ? 'text-[#2D1D16]/65'
                              : 'text-slate-400'
                          }`}
                        >
                          {title}
                        </span>
                        <span className={`text-[10px] leading-snug mt-1 ${isPapyrus ? 'text-[#8C6D58]' : 'text-slate-450'}`}>
                          {description}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
