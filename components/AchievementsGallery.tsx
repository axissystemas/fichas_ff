'use client';

import React, { useState } from 'react';
import { useSheetStore } from '@/store/useSheetStore';
import { ACHIEVEMENTS } from '@/lib/achievements';

export default function AchievementsGallery() {
  const unlocked = useSheetStore((state) => state.unlockedAchievements);
  const theme = useSheetStore((state) => state.theme);
  const isPapyrus = theme === 'papyrus';

  const [activeTab, setActiveTab] = useState<'all' | 'books' | 'milestones'>('all');
  const [isOpen, setIsOpen] = useState(false);

  // Map of unlocked ids to unlock dates
  const unlockedMap = React.useMemo(() => {
    const map = new Map<string, string>();
    unlocked.forEach((u) => {
      map.set(u.achievement_id, u.unlocked_at);
    });
    return map;
  }, [unlocked]);

  const filteredAchievements = React.useMemo(() => {
    return ACHIEVEMENTS.filter((a) => {
      if (activeTab === 'books') return a.type === 'book';
      if (activeTab === 'milestones') return a.type === 'milestone';
      return true;
    });
  }, [activeTab]);

  const unlockedCount = ACHIEVEMENTS.filter((a) => unlockedMap.has(a.id)).length;
  const totalCount = ACHIEVEMENTS.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100) || 0;

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
          {/* Tab selector */}
          <div className="flex gap-2">
            {(['all', 'books', 'milestones'] as const).map((tab) => {
              const label = tab === 'all' ? 'Todas' : tab === 'books' ? 'Livros-Jogo' : 'Gerais';
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
                    active
                      ? isPapyrus
                        ? 'bg-[#5C4033] text-[#F5EAD4] border-[#5C4033]'
                        : 'bg-amber-500 text-slate-950 border-amber-500'
                      : isPapyrus
                      ? 'border-[#5C4033]/25 hover:bg-[#5C4033]/10 text-[#5C4033]'
                      : 'border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab === 'all' ? '🏆 Todas' : tab === 'books' ? '📚 Livros-Jogo' : '⚡ Gerais'}
                </button>
              );
            })}
          </div>

          {/* Grid list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[350px] overflow-y-auto pr-1">
            {filteredAchievements.map((achievement) => {
              const isUnlocked = unlockedMap.has(achievement.id);
              const unlockDate = unlockedMap.get(achievement.id);
              
              return (
                <div
                  key={achievement.id}
                  className={`relative p-3 rounded-lg border flex items-start gap-3 transition-all duration-300 ${
                    isUnlocked
                      ? isPapyrus
                        ? 'bg-[#EAD8B8] border-[#5C4033]/40 shadow-sm'
                        : 'bg-amber-500/10 border-amber-500/30 shadow-sm shadow-amber-500/5'
                      : isPapyrus
                      ? 'bg-black/5 border-[#5C4033]/10 opacity-60 hover:opacity-90'
                      : 'bg-slate-950/40 border-slate-800 opacity-50 hover:opacity-80'
                  }`}
                >
                  {/* Badge Icon */}
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full text-xl flex-shrink-0 select-none shadow-inner transition-transform duration-300 ${
                      isUnlocked
                        ? isPapyrus
                          ? 'bg-[#5C4033]/15'
                          : 'bg-amber-500/20'
                        : 'bg-black/10 filter grayscale'
                    }`}
                  >
                    {achievement.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 justify-between">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded leading-none ${
                          isUnlocked
                            ? isPapyrus
                              ? 'bg-[#5C4033]/15 text-[#5C4033]'
                              : 'bg-amber-500/20 text-amber-400'
                            : isPapyrus
                            ? 'bg-black/10 text-[#5C4033]/60'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {achievement.code}
                      </span>
                      {isUnlocked && unlockDate && (
                        <span className={`text-[9px] ${isPapyrus ? 'text-[#8C6D58]' : 'text-slate-500'}`}>
                          {new Date(unlockDate).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-xs font-bold leading-tight mt-1 truncate ${
                        isUnlocked
                          ? isPapyrus
                            ? 'text-[#2D1D16]'
                            : 'text-slate-100'
                          : isPapyrus
                          ? 'text-[#2D1D16]/65'
                          : 'text-slate-400'
                      }`}
                    >
                      {achievement.title}
                    </span>
                    <span className={`text-[10px] leading-snug mt-0.5 ${isPapyrus ? 'text-[#8C6D58]' : 'text-slate-400'}`}>
                      {isUnlocked ? achievement.description : achievement.hint}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
