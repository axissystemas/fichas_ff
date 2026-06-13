'use client';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useSheetStore, Monster } from '@/store/useSheetStore';
import { User } from 'lucide-react';

// Importando arquivos de encontros dos livros
import feiticeiroMontanhaJSON from '@/encontros/feiticeiro_montanha_de_fogo.json';

const BOOK_MONSTERS_MAP: Record<string, any> = {
  'O Feiticeiro da Montanha de Fogo': feiticeiroMontanhaJSON,
};

export const MonsterManager = () => {
  const { monsters, addMonster, removeMonster, updateMonsterEnergy, gamebook } = useSheetStore();
  const [name, setName] = useState('');
  const [skill, setSkill] = useState(6);
  const [energy, setEnergy] = useState(6);

  const handleAddMonster = () => {
    if (!name.trim()) return;
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
  };

  const bookData = BOOK_MONSTERS_MAP[gamebook];
  const bookMonsters = bookData ? bookData.monstros : [];

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
                <button onClick={() => removeMonster(monster.id)} className="text-red-700 text-[10px] hover:underline uppercase">Remover</button>
              </div>
              <div className="flex justify-between items-center flex-grow mt-1">
                <div className="text-sm font-semibold text-[#2C1E14] leading-tight">
                  <p>Hab: {monster.skill}</p>
                  <p>Ener Max: {monster.energyMax}</p>
                  <p>Ener At: {monster.energyCurrent}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateMonsterEnergy(monster.id, -1)} className="bg-[#2C1E14] text-[#EAD8B8] px-3 py-1.5 font-bold">-1</button>
                  <button onClick={() => updateMonsterEnergy(monster.id, 1)} className="bg-[#2C1E14] text-[#EAD8B8] px-3 py-1.5 font-bold">+1</button>
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

      {bookMonsters && bookMonsters.length > 0 && (
        <div className="mb-6 text-sm font-bold text-[#2C1E14]">
          <label className="flex flex-col gap-1.5">
            Adicionar Criatura do Livro-Jogo
            <select 
              onChange={(e) => {
                const selectedId = e.target.value;
                if (!selectedId) return;
                const template = bookMonsters.find((m: any) => m.id === selectedId);
                if (template) {
                  const newMonster: Monster = {
                    id: crypto.randomUUID(),
                    name: template.nome,
                    skill: template.habilidade,
                    energyMax: template.energiaMaxima,
                    energyCurrent: template.energiaMaxima,
                    status: 'alive'
                  };
                  addMonster(newMonster);
                }
                e.target.value = ''; // reseta o select para a opção padrão
              }}
              className="p-3 border border-[#5C4033] bg-[#EAD8B8] text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            >
              <option value="">-- Selecione uma criatura para combate rápido --</option>
              {bookMonsters.map((m: any) => (
                <option key={m.id} value={m.id}>
                  {m.nome} (Hab: {m.habilidade}, Ener: {m.energiaMaxima}){m.boss ? ' 👑 CHEFE' : ''}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {bookMonsters && bookMonsters.length > 0 && (
        <div className="relative flex items-center justify-center my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#5C4033] opacity-30"></div>
          </div>
          <span className="relative px-3 bg-[#EAD8B8] text-[10px] uppercase font-bold text-[#5C4033] tracking-widest">
            ou Criar Monstro Customizado
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-sm sm:text-base font-bold text-[#2C1E14]">
        <label className="flex flex-col gap-1">Nome
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nome" className="p-3 border border-[#5C4033] bg-[#EAD8B8] text-base" />
        </label>
        <label className="flex flex-col gap-1">Habilidade
          <input type="number" value={skill} onChange={e => setSkill(parseInt(e.target.value) || 0)} placeholder="Hab" className="p-3 border border-[#5C4033] bg-[#EAD8B8] text-base" />
        </label>
        <label className="flex flex-col gap-1">Energia
          <input type="number" value={energy} onChange={e => setEnergy(parseInt(e.target.value) || 0)} placeholder="Energia" className="p-3 border border-[#5C4033] bg-[#EAD8B8] text-base" />
        </label>
      </div>
      <button onClick={handleAddMonster} className="w-full bg-[#2C1E14] text-[#EAD8B8] py-3 uppercase font-bold text-sm tracking-widest hover:bg-[#4A3728] transition">
        + Adicionar Novo Monstro
      </button>
    </div>
  );
};
