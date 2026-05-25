'use client';
import { FileText, Backpack, Sword, Dices, NotebookText, ScrollText, Settings, Upload, Download, CheckCircle, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { useSheetStore } from '@/store/useSheetStore';

const menuItems = [
  { name: 'Ficha', icon: FileText },
  { name: 'Inventário', icon: Backpack },
  { name: 'Combate', icon: Sword },
  { name: 'Rolagem', icon: Dices },
  { name: 'Notas', icon: NotebookText },
  { name: 'Crônica', icon: ScrollText },
  { name: 'Configurações', icon: Settings },
];

export const Sidebar = () => {
  const [active, setActive] = useState('Ficha');
  const { theme, setTheme } = useSheetStore();

  return (
    <aside className="w-64 bg-[#1E1712] border-r-2 border-[#3D2B1F] flex flex-col h-screen p-4 font-serif text-[#C5A059]">
      <div className="flex justify-between items-start mb-4">
        <button onClick={() => setTheme(theme === 'papyrus' ? 'night' : 'papyrus')} className="p-2 hover:bg-[#3D2B1F] rounded">
          {theme === 'papyrus' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
      <div className="flex flex-col items-center mb-10 mt-4">
        <div className="w-24 h-24 border-2 border-[#C5A059] rounded-full flex items-center justify-center mb-2">
          <span className="text-3xl font-bold">FF</span>
        </div>
        <h1 className="text-lg uppercase tracking-wider text-center">Fighting Fantasy</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.name;
          return (
            <button
              key={item.name}
              onClick={() => setActive(item.name)}
              className={`w-full flex items-center gap-4 p-3 rounded transition ${isActive ? 'bg-[#3D2B1F]/80 text-[#EAD8B8]' : 'hover:bg-[#3D2B1F]/40'}`}
            >
              <Icon size={20} />
              <span className="text-lg">{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4 pt-6 border-t-2 border-[#3D2B1F]">
        <button className="w-full flex items-center gap-3 p-2 border border-[#C5A059] hover:bg-[#3D2B1F] justify-center">
          <Upload size={16} /> Exportar Ficha
        </button>
        <button className="w-full flex items-center gap-3 p-2 border border-[#C5A059] hover:bg-[#3D2B1F] justify-center">
          <Download size={16} /> Importar Ficha
        </button>
        
        <div className="text-center text-xs mt-4">
          <p className="mb-1">Salvo Automaticamente</p>
          <div className="flex items-center justify-center gap-2 text-green-700">
            <CheckCircle size={14} /> 15:42:31
          </div>
        </div>
      </div>
    </aside>
  );
};
