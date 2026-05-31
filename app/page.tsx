'use client';
import { useEffect } from 'react';
import { AttributeCard } from '@/components/AttributeCard';
import { NotesCard } from '@/components/NotesCard';
import { AttackCard } from '@/components/AttackCard';
import { LuckCard } from '@/components/LuckCard';
import { DamageCard } from '@/components/DamageCard';
import { CombatHistory } from '@/components/CombatHistory';
import { InventoryManager } from '@/components/InventoryManager';
import { GoldAndProvisions } from '@/components/GoldAndProvisions';
import { MonsterManager } from '@/components/MonsterManager';
import { SyncStatus } from '@/components/SyncStatus';
import { AuthStatus } from '@/components/AuthStatus';
import { useSheetStore } from '@/store/useSheetStore';
import { Sun, Moon, RotateCcw, Upload, Download, Loader2 } from 'lucide-react';

export default function Home() {
  const { theme, setTheme, resetSheet, loadFromSupabase, syncStatus, attributes, gold, inventory } =
    useSheetStore();

  // Load data from Supabase once on mount
  useEffect(() => {
    loadFromSupabase();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Export current sheet as JSON
  const handleExport = () => {
    const state = useSheetStore.getState();
    const data = {
      attributes: state.attributes,
      gold: state.gold,
      provisions: state.provisions,
      inventory: state.inventory,
      monsters: state.monsters,
      notes: state.notes,
      combatLog: state.combatLog,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'adventure-sheet.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import sheet from JSON file
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        const store = useSheetStore.getState();
        if (data.attributes) {
          ['skill', 'energy', 'luck'].forEach((key) => {
            const k = key as 'skill' | 'energy' | 'luck';
            store.setAttribute(k, data.attributes[k].initial, true);
            store.setAttribute(k, data.attributes[k].current, false);
          });
        }
        if (typeof data.gold === 'number') store.updateGold(data.gold - useSheetStore.getState().gold);
        if (typeof data.provisions === 'number') store.updateProvisions(data.provisions - useSheetStore.getState().provisions);
        if (data.notes) store.setNotes(data.notes);
        await store.saveToSupabase();
      } catch {
        alert('Arquivo inválido. Por favor, use um JSON exportado deste app.');
      }
    };
    input.click();
  };

  const isLoading = syncStatus === 'loading';

  return (
    <main
      className={`min-h-screen py-6 px-4 md:py-12 md:px-8 transition-colors duration-300 font-serif ${
        theme === 'papyrus' ? 'theme-papyrus' : 'theme-night'
      }`}
    >
      <div
        className={`max-w-[1024px] w-full p-4 sm:p-8 shadow-2xl border mx-auto transition-colors duration-300 ${
          theme === 'papyrus' ? 'theme-papyrus-card' : 'theme-night-card'
        }`}
      >
        {/* ── Cabeçalho ── */}
        <header
          className={`flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b-2 ${
            theme === 'papyrus' ? 'border-[#5C4033] text-[#2D1D16]' : 'border-[#4a5568] text-[#cbd5e0]'
          }`}
        >
          <div className="text-center sm:text-left">
            <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-widest">
              Adventure Sheet
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-xs uppercase tracking-wider opacity-70 font-sans">
                Digital Premium Companion
              </p>
              <SyncStatus />
              <AuthStatus />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {/* Backup */}
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-2.5 py-1.5 border border-current hover:bg-[#3D2B1F]/10 transition text-[10px] sm:text-xs uppercase font-bold tracking-wider cursor-pointer"
            >
              <Upload size={12} /> Exportar
            </button>
            <button
              onClick={handleImport}
              className="flex items-center gap-1.5 px-2.5 py-1.5 border border-current hover:bg-[#3D2B1F]/10 transition text-[10px] sm:text-xs uppercase font-bold tracking-wider cursor-pointer"
            >
              <Download size={12} /> Importar
            </button>

            {/* Tema */}
            <button
              onClick={() => setTheme(theme === 'papyrus' ? 'night' : 'papyrus')}
              className="p-1.5 sm:p-2 border border-current hover:bg-[#3D2B1F]/10 rounded cursor-pointer transition"
              aria-label="Alternar tema"
            >
              {theme === 'papyrus' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Reset */}
            <button
              onClick={() => {
                if (window.confirm('Deseja realmente resetar sua ficha? Essa ação é irreversível.')) {
                  resetSheet();
                }
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition text-[10px] sm:text-xs uppercase font-bold tracking-wider cursor-pointer"
            >
              <RotateCcw size={12} /> Resetar
            </button>
          </div>
        </header>

        {/* ── Loading overlay ── */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4 opacity-70">
            <Loader2 size={40} className="animate-spin" />
            <p className="text-sm uppercase tracking-widest font-sans">
              Carregando sua ficha da nuvem...
            </p>
          </div>
        )}

        {/* ── Conteúdo da Ficha ── */}
        {!isLoading && (
          <div className="space-y-8">
            {/* BLOCO DE CIMA: Atributos + Monstros/Ações */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Coluna Esquerda (1/4): Habilidade, Energia, Sorte */}
              <div className="md:col-span-1 flex flex-col gap-6">
                <AttributeCard label="Habilidade" attrKey="skill" />
                <AttributeCard label="Energia" attrKey="energy" />
                <AttributeCard label="Sorte" attrKey="luck" />
              </div>

              {/* Coluna Direita (3/4): Monstros e botões */}
              <div className="md:col-span-3 flex flex-col gap-6">
                <section
                  className={`bg-transparent border-2 p-6 shadow-[-10px_10px_0px_rgba(0,0,0,0.1)] ${
                    theme === 'papyrus' ? 'border-[#4A3728]' : 'border-[#4a5568]'
                  }`}
                >
                  <MonsterManager />
                </section>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <DamageCard />
                  <AttackCard />
                  <LuckCard />
                </div>
              </div>
            </div>

            {/* BLOCO DO MEIO: Equipamentos e Histórico */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section
                className={`bg-transparent border-2 p-6 shadow-[-10px_10px_0px_rgba(0,0,0,0.1)] ${
                  theme === 'papyrus' ? 'border-[#4A3728]' : 'border-[#4a5568]'
                }`}
              >
                <InventoryManager />
              </section>
              <section
                className={`bg-transparent border-2 p-6 shadow-[-10px_10px_0px_rgba(0,0,0,0.1)] ${
                  theme === 'papyrus' ? 'border-[#4A3728]' : 'border-[#4a5568]'
                }`}
              >
                <CombatHistory />
              </section>
            </div>

            {/* BLOCO INFERIOR: Ouro, Provisões e Notas */}
            <section>
              <GoldAndProvisions />
            </section>

            <section className="flex flex-col min-h-[200px]">
              <NotesCard />
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
