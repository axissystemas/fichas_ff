'use client';
import { useState } from 'react';
import { useSheetStore } from '@/store/useSheetStore';
import { Trash2, Plus, Minus } from 'lucide-react';
import { audio } from '@/lib/audio';
import { motion } from 'motion/react';

export const InventoryManager = () => {
  const { inventory, addItem, removeItem, updateItemQuantity, toggleEquipItem, theme, gamebook } = useSheetStore();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  // Modifiers state
  const [showModifiers, setShowModifiers] = useState(false);
  const [skillMod, setSkillMod] = useState(0);
  const [energyMod, setEnergyMod] = useState(0);
  const [luckMod, setLuckMod] = useState(0);
  const [magicMod, setMagicMod] = useState(0);
  const [faithMod, setFaithMod] = useState(0);
  const [fearMod, setFearMod] = useState(0);

  const cardClasses = theme === 'papyrus' 
    ? 'bg-[#FDF6E3] border-[#4A3728] text-[#2C1E14]' 
    : 'bg-[#1a202c] border-[#4a5568] text-[#cbd5e0]';

  const inputClasses = theme === 'papyrus'
    ? 'border border-[#5C4033] bg-[#EAD8B8]/60 text-[#2D1D16] focus:outline-none focus:ring-1 focus:ring-[#C5A059] px-3 py-2 text-sm font-sans'
    : 'border border-slate-700 bg-slate-950 text-[#cbd5e0] focus:outline-none focus:ring-2 focus:ring-cyan-500/50 px-3 py-2 text-sm font-mono rounded';

  const handleAddItem = () => {
    if (!name.trim()) return;
    audio.playBlip();

    const modifiers: Record<string, number> = {};
    if (skillMod !== 0) modifiers.skill = skillMod;
    if (energyMod !== 0) modifiers.energy = energyMod;
    if (luckMod !== 0) modifiers.luck = luckMod;
    if (magicMod !== 0 && gamebook === 'A Cidadela do Caos') modifiers.magic = magicMod;
    if (faithMod !== 0 && gamebook === 'A Cripta do Vampiro') modifiers.faith = faithMod;
    if (fearMod !== 0 && gamebook === 'A Mansão do Inferno') modifiers.fear = fearMod;

    addItem({
      id: crypto.randomUUID(),
      name,
      quantity,
      equipped: false,
      ...(Object.keys(modifiers).length > 0 ? { modifiers } : {})
    });

    setName('');
    setQuantity(1);
    setSkillMod(0);
    setEnergyMod(0);
    setLuckMod(0);
    setMagicMod(0);
    setFaithMod(0);
    setFearMod(0);
    setShowModifiers(false);
  };

  const handleRemoveItem = (id: string) => {
    audio.playBlip();
    removeItem(id);
  };

  const handleUpdateItemQuantity = (id: string, delta: number) => {
    audio.playBlip();
    updateItemQuantity(id, delta);
  };

  return (
    <div className={`${cardClasses} border-2 p-4 shadow-[-5px_5px_0px_rgba(0,0,0,0.3)] transition-colors`}>
      <h2 className={`text-xl font-bold uppercase text-center mb-4 border-b-2 pb-2 w-full ${theme === 'papyrus' ? 'border-[#2C1E14]' : 'border-[#cbd5e0]'}`}>Equipamento</h2>
      
      <div className="space-y-2 mb-4 max-h-[220px] overflow-y-auto pr-1">
        {inventory.map(item => {
          const hasModifiers = item.modifiers && Object.keys(item.modifiers).length > 0;
          return (
            <div key={item.id} className="flex justify-between items-center text-sm border-b py-2 border-opacity-20 border-current">
              <div className="flex flex-col gap-0.5 text-left">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { audio.playBlip(); toggleEquipItem(item.id); }} 
                    className={`p-1 cursor-pointer transition rounded-sm scale-110 ${
                      item.equipped 
                        ? (theme === 'papyrus' ? 'text-[#8B4513] hover:text-[#5C4033]' : 'text-cyan-400 hover:text-cyan-300')
                        : 'text-slate-400 opacity-40 hover:opacity-100'
                    }`}
                    title={item.equipped ? 'Desequipar item' : 'Equipar item'}
                  >
                    <span>{item.equipped ? '🛡️' : '🔘'}</span>
                  </button>
                  <span className={item.equipped ? 'font-bold' : ''}>{item.name}</span>
                </div>
                
                {hasModifiers && (
                  <div className="flex flex-wrap gap-1 ml-8 mt-0.5">
                    {Object.entries(item.modifiers || {}).map(([attr, val]) => {
                      if (!val) return null;
                      const sign = val > 0 ? '+' : '';
                      const isFear = attr === 'fear';
                      const isPositive = val > 0;
                      const isGood = isFear ? !isPositive : isPositive;
                      const badgeColor = isGood
                        ? (theme === 'papyrus' ? 'bg-green-800/15 text-green-900 border-green-800/20' : 'bg-green-500/10 text-green-400 border-green-500/20')
                        : (theme === 'papyrus' ? 'bg-red-800/15 text-red-900 border-red-800/20' : 'bg-red-500/10 text-red-400 border-red-500/20');
                      
                      const attrLabels: Record<string, string> = {
                        skill: 'HAB',
                        energy: 'ENE',
                        luck: 'SOR',
                        magic: 'MAG',
                        faith: 'FÉ',
                        fear: 'MEDO'
                      };
                      return (
                        <span 
                          key={attr} 
                          className={`text-[9px] px-1 py-0.2 border rounded uppercase font-bold font-sans tracking-wide ${badgeColor}`}
                        >
                          {attrLabels[attr] || attr} {sign}{val}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleUpdateItemQuantity(item.id, -1)} className="hover:text-[#5C4033]"><Minus size={16} /></button>
                <span className="font-bold">{item.quantity}</span>
                <button onClick={() => handleUpdateItemQuantity(item.id, 1)} className="hover:text-[#5C4033]"><Plus size={16} /></button>
                <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700 ml-2"><Trash2 size={16} /></button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:grid sm:grid-cols-5 gap-3">
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Item" className={`sm:col-span-3 ${inputClasses}`} />
          <input type="number" value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 1)} className={`sm:col-span-1 ${inputClasses}`} />
          <button onClick={handleAddItem} className="sm:col-span-1 bg-[#2C1E14] text-[#EAD8B8] p-3 hover:bg-[#4A3728] transition font-bold text-sm rounded-sm">+</button>
        </div>

        <div className="text-left">
          <button
            type="button"
            onClick={() => { audio.playBlip(); setShowModifiers(!showModifiers); }}
            className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition opacity-75 hover:opacity-100 ${
              theme === 'papyrus' ? 'text-[#8B4513]' : 'text-cyan-400'
            }`}
          >
            <span>{showModifiers ? '▼ Ocultar Modificadores' : '▶ Configurar Modificadores'}</span>
          </button>

          {showModifiers && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className={`grid grid-cols-3 gap-2.5 mt-2.5 p-3 border rounded-sm ${
                theme === 'papyrus' ? 'border-[#5C4033]/30 bg-[#EAD8B8]/20' : 'border-slate-800 bg-slate-950/40'
              }`}
            >
              <div className="flex flex-col gap-0.5">
                <label className="text-[9px] font-bold uppercase tracking-wider opacity-75">Habilidade</label>
                <input 
                  type="number" 
                  value={skillMod || ''} 
                  onChange={e => setSkillMod(parseInt(e.target.value) || 0)} 
                  placeholder="0" 
                  className={inputClasses + ' py-1'} 
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <label className="text-[9px] font-bold uppercase tracking-wider opacity-75">Energia</label>
                <input 
                  type="number" 
                  value={energyMod || ''} 
                  onChange={e => setEnergyMod(parseInt(e.target.value) || 0)} 
                  placeholder="0" 
                  className={inputClasses + ' py-1'} 
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <label className="text-[9px] font-bold uppercase tracking-wider opacity-75">Sorte</label>
                <input 
                  type="number" 
                  value={luckMod || ''} 
                  onChange={e => setLuckMod(parseInt(e.target.value) || 0)} 
                  placeholder="0" 
                  className={inputClasses + ' py-1'} 
                />
              </div>

              {gamebook === 'A Cidadela do Caos' && (
                <div className="flex flex-col gap-0.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider opacity-75">Mágica</label>
                  <input 
                    type="number" 
                    value={magicMod || ''} 
                    onChange={e => setMagicMod(parseInt(e.target.value) || 0)} 
                    placeholder="0" 
                    className={inputClasses + ' py-1'} 
                  />
                </div>
              )}
              {gamebook === 'A Cripta do Vampiro' && (
                <div className="flex flex-col gap-0.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider opacity-75">Fé</label>
                  <input 
                    type="number" 
                    value={faithMod || ''} 
                    onChange={e => setFaithMod(parseInt(e.target.value) || 0)} 
                    placeholder="0" 
                    className={inputClasses + ' py-1'} 
                  />
                </div>
              )}
              {gamebook === 'A Mansão do Inferno' && (
                <div className="flex flex-col gap-0.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider opacity-75">Medo</label>
                  <input 
                    type="number" 
                    value={fearMod || ''} 
                    onChange={e => setFearMod(parseInt(e.target.value) || 0)} 
                    placeholder="0" 
                    className={inputClasses + ' py-1'} 
                  />
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
