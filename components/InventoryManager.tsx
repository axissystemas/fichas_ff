'use client';
import { useState } from 'react';
import { useSheetStore } from '@/store/useSheetStore';
import { Trash2, Plus, Minus } from 'lucide-react';

export const InventoryManager = () => {
  const { inventory, addItem, removeItem, updateItemQuantity, theme } = useSheetStore();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const cardClasses = theme === 'papyrus' 
    ? 'bg-[#FDF6E3] border-[#4A3728] text-[#2C1E14]' 
    : 'bg-[#1a202c] border-[#4a5568] text-[#cbd5e0]';

  const handleAddItem = () => {
    if (!name.trim()) return;
    addItem({
      id: crypto.randomUUID(),
      name,
      quantity,
      equipped: false
    });
    setName('');
    setQuantity(1);
  };

  return (
    <div className={`${cardClasses} border-2 p-4 shadow-[-5px_5px_0px_rgba(0,0,0,0.3)] transition-colors`}>
      <h2 className={`text-xl font-bold uppercase text-center mb-4 border-b-2 pb-2 w-full ${theme === 'papyrus' ? 'border-[#2C1E14]' : 'border-[#cbd5e0]'}`}>Equipamento</h2>
      
      <div className="space-y-2 mb-4">
        {inventory.map(item => (
          <div key={item.id} className="flex justify-between items-center text-sm border-b pb-1 border-opacity-20">
            <span>{item.name}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => updateItemQuantity(item.id, -1)} className="hover:text-[#5C4033]"><Minus size={16} /></button>
              <span className="font-bold">{item.quantity}</span>
              <button onClick={() => updateItemQuantity(item.id, 1)} className="hover:text-[#5C4033]"><Plus size={16} /></button>
              <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 ml-2"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-2">
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Item" className="col-span-3 p-2 border border-[#5C4033] bg-[#EAD8B8] text-[#2C1E14]" />
        <input type="number" value={quantity} onChange={e => setQuantity(parseInt(e.target.value))} className="col-span-1 p-2 border border-[#5C4033] bg-[#EAD8B8] text-[#2C1E14]" />
        <button onClick={handleAddItem} className="col-span-1 bg-[#2C1E14] text-[#EAD8B8] p-2 hover:bg-[#4A3728] transition">+</button>
      </div>
    </div>
  );
};
