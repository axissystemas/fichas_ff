'use client';
import { AttributeCard } from '@/components/AttributeCard';
import { NotesCard } from '@/components/NotesCard';
import { AttackCard } from '@/components/AttackCard';
import { LuckCard } from '@/components/LuckCard';
import { DamageCard } from '@/components/DamageCard';
import { CombatHistory } from '@/components/CombatHistory';
import { InventoryManager } from '@/components/InventoryManager';
import { Sidebar } from '@/components/Sidebar';
import { GoldAndProvisions } from '@/components/GoldAndProvisions';
import { MonsterManager } from '@/components/MonsterManager';
import { useSheetStore } from '@/store/useSheetStore';

export default function Home() {
  const { theme, resetSheet } = useSheetStore();

  return (
    <main className={`min-h-screen flex font-serif transition-colors ${theme === 'papyrus' ? 'theme-papyrus' : 'theme-night'}`}>
      <Sidebar />
      <div className="flex-1 p-8">
        <div className={`max-w-[1024px] w-full p-8 shadow-2xl border mx-auto transition-colors ${theme === 'papyrus' ? 'theme-papyrus-card' : 'theme-night-card'}`}>
          <header className={`text-center mb-10 pb-6 border-b-2 relative ${theme === 'papyrus' ? 'border-[#5C4033]' : 'border-[#4a5568]'}`}>
            <button 
              onClick={() => {
                if (window.confirm('Deseja realmente resetar sua ficha? Essa ação é irreversível.')) {
                  resetSheet();
                }
              }}
              className="absolute top-0 right-0 text-xs uppercase hover:underline cursor-pointer"
            >
              Resetar Ficha
            </button>
            <h1 className="text-5xl font-bold uppercase tracking-widest">
              Ficha de Aventura
            </h1>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Coluna Esquerda: Atributos */}
            <div className="flex flex-col gap-6">
              <AttributeCard label="Habilidade" attrKey="skill" />
              <AttributeCard label="Energia" attrKey="energy" />
              <AttributeCard label="Sorte" attrKey="luck" />
              <NotesCard />
            </div>

            {/* Coluna Direita: O resto do layout */}
            <div className="md:col-span-3 flex flex-col gap-6">
              {/* Monstros */}
              <section className="bg-transparent border-2 border-[#4A3728] p-6 shadow-[-10px_10px_0px_rgba(0,0,0,0.1)]">
                <MonsterManager />
              </section>

              {/* Botões de Ação */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <DamageCard />
                <AttackCard />
                <LuckCard />
              </div>

              {/* Equipamentos e Histórico */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="bg-transparent border-2 border-[#4A3728] p-6 shadow-[-10px_10px_0px_rgba(0,0,0,0.1)]">
                  <InventoryManager />
                </section>
                <section className="bg-transparent border-2 border-[#4A3728] p-6 shadow-[-10px_10px_0px_rgba(0,0,0,0.1)]">
                  <CombatHistory />
                </section>
              </div>

              {/* Ouro e Consumível */}
              <GoldAndProvisions />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
