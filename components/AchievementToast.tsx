'use client';

import React, { useEffect, useState } from 'react';
import { useSheetStore } from '@/store/useSheetStore';

export default function AchievementToast() {
  const justUnlocked = useSheetStore((state) => state.justUnlocked);
  const clearJustUnlocked = useSheetStore((state) => state.clearJustUnlocked);
  const theme = useSheetStore((state) => state.theme);
  const isPapyrus = theme === 'papyrus';

  const [visible, setVisible] = useState(false);
  const [toastData, setToastData] = useState<{ id: string; title: string; icon: string } | null>(null);

  useEffect(() => {
    if (justUnlocked) {
      setToastData(justUnlocked);
      setVisible(true);
      clearJustUnlocked();

      const timer = setTimeout(() => {
        setVisible(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [justUnlocked, clearJustUnlocked]);

  if (!toastData) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-4 max-w-sm p-4 rounded-xl border shadow-2xl transition-all duration-500 ease-out transform ${
        visible
          ? 'translate-y-0 opacity-100 scale-100'
          : 'translate-y-12 opacity-0 scale-90 pointer-events-none'
      } ${
        isPapyrus
          ? 'bg-[#F2E5D0]/95 border-[#5C4033]/30 text-[#2D1D16]'
          : 'bg-[#0f172a]/95 border-amber-500/30 text-slate-100'
      }`}
      style={{
        backdropFilter: 'blur(8px)',
        fontFamily: isPapyrus ? "'Cinzel', Georgia, serif" : 'inherit',
      }}
    >
      {/* Icon Badge */}
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-full text-2xl animate-bounce shadow-md ${
          isPapyrus ? 'bg-[#5C4033]/10 border border-[#5C4033]/20' : 'bg-amber-500/10 border border-amber-500/20'
        }`}
      >
        {toastData.icon}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <span
          className={`text-[10px] uppercase tracking-widest font-bold ${
            isPapyrus ? 'text-[#8C6D58]' : 'text-amber-400'
          }`}
        >
          Conquista Desbloqueada!
        </span>
        <span className="text-sm font-semibold leading-tight mt-0.5">{toastData.title}</span>
      </div>

      {/* Close button */}
      <button
        onClick={() => setVisible(false)}
        className={`text-xs p-1 rounded-md hover:bg-black/5 opacity-50 hover:opacity-100 cursor-pointer ${
          isPapyrus ? 'text-[#2D1D16]' : 'text-slate-400 hover:text-slate-100'
        }`}
      >
        ✕
      </button>
    </div>
  );
}
