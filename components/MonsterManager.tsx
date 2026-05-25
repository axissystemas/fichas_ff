'use client';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useSheetStore, Monster } from '@/store/useSheetStore';
import { User } from 'lucide-react';

export const MonsterManager = () => {
  const { monsters, addMonster, removeMonster, updateMonsterEnergy, clearMonsters } = useSheetStore();
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

  return (
    <div>
      <h2 className="text-xl font-bold uppercase text-center border-b-2 border-[#2C1E14] pb-2 mb-4">Encontro com Monstros</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {monsters.map(monster => {
          const isLowEnergy = (monster.energyCurrent / monster.energyMax) < 0.25;
          return (
            <motion.div 
              key={monster.id}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.4 }}
              className={`bg-[#EAD8B8] border ${isLowEnergy ? 'border-4 border-yellow-500' : 'border-[#5C4033]'} p-3 text-sm text-[#2C1E14]`}
            >
              <div className="font-bold border-b border-[#5C4033] mb-2 pb-1 flex justify-between">
                {monster.name}
                <button onClick={() => removeMonster(monster.id)} className="text-red-700 text-[10px] hover:underline uppercase">Remover</button>
              </div>
              <div className="text-xs">
                <p>Hab: {monster.skill}</p>
                <p>Ener Max: {monster.energyMax}</p>
                <p>Ener At: {monster.energyCurrent}</p>
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => updateMonsterEnergy(monster.id, -1)} className="bg-[#2C1E14] text-[#EAD8B8] px-2 py-1">-1</button>
                <button onClick={() => updateMonsterEnergy(monster.id, 1)} className="bg-[#2C1E14] text-[#EAD8B8] px-2 py-1">+1</button>
              </div>
              <div className={`mt-2 text-center text-xs font-bold p-1 ${monster.status === 'alive' ? 'bg-red-900 text-white' : 'bg-gray-700 text-white'}`}>
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
      <div className="grid grid-cols-3 gap-2 mb-2 text-xs font-bold text-[#5C4033]">
        <label className="flex flex-col">Nome
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nome" className="p-2 border border-[#5C4033] bg-[#EAD8B8]" />
        </label>
        <label className="flex flex-col">Habilidade
          <input type="number" value={skill} onChange={e => setSkill(parseInt(e.target.value) || 0)} placeholder="Hab" className="p-2 border border-[#5C4033] bg-[#EAD8B8]" />
        </label>
        <label className="flex flex-col">Energia
          <input type="number" value={energy} onChange={e => setEnergy(parseInt(e.target.value) || 0)} placeholder="Energia" className="p-2 border border-[#5C4033] bg-[#EAD8B8]" />
        </label>
      </div>
      <button onClick={handleAddMonster} className="w-full bg-[#2C1E14] text-[#EAD8B8] py-2 uppercase font-bold text-sm tracking-widest hover:bg-[#4A3728] transition">
        + Adicionar Novo Monstro
      </button>
      <button onClick={clearMonsters} className="w-full mt-2 bg-[#5C4033] text-[#EAD8B8] py-2 uppercase font-bold text-sm tracking-widest hover:bg-[#2C1E14] transition">
        Limpar Monstros
      </button>
    </div>
  );
};
