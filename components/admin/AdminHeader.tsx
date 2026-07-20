import React from 'react';
import { Sun, Moon, LogOut, Shield } from 'lucide-react';
import { useSheetStore } from '@/store/useSheetStore';
import { useAudioStore } from '@/store/useAudioStore';

interface AdminHeaderProps {
  userEmail?: string;
  onLogout: () => void;
}

export function AdminHeader({ userEmail, onLogout }: AdminHeaderProps) {
  const { theme, setTheme } = useSheetStore();
  const isPapyrus = theme === 'papyrus';

  return (
    <header className={`border-b ${isPapyrus ? 'border-[#C5A059] bg-[#EAD8B8]/80' : 'border-slate-800 bg-slate-900/80'} backdrop-blur-md sticky top-0 z-40 transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isPapyrus ? 'bg-[#8B4513] text-[#F3E5AB]' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'}`}>
            <Shield size={20} />
          </div>
          <div>
            <h1 className={`font-bold text-lg leading-none ${isPapyrus ? 'text-[#2D1D16]' : 'text-white'}`}>
              Painel de Administração
            </h1>
            <p className={`text-xs ${isPapyrus ? 'text-[#8B4513]' : 'text-slate-400'}`}>
              Aventuras Fantásticas — Fichas FF
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(isPapyrus ? 'night' : 'papyrus')}
            className={`p-2 rounded-lg border transition ${
              isPapyrus
                ? 'border-[#C5A059] bg-[#F3E5AB] text-[#8B4513] hover:bg-[#EAD8B8]'
                : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Alternar Tema"
          >
            {isPapyrus ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {userEmail && (
            <div className="flex items-center gap-3">
              <span className={`text-xs font-medium hidden sm:inline ${isPapyrus ? 'text-[#8B4513]' : 'text-slate-400'}`}>
                {userEmail}
              </span>
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs font-bold transition"
              >
                <LogOut size={14} />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
