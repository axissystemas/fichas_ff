import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Attribute {
  initial: number;
  current: number;
}

interface Item {
  id: string;
  name: string;
  quantity: number;
  equipped: boolean;
}

export interface Monster {
  id: string;
  name: string;
  skill: number;
  energyMax: number;
  energyCurrent: number;
  status: 'alive' | 'defeated';
}

interface SheetState {
  attributes: {
    skill: Attribute;
    energy: Attribute;
    luck: Attribute;
  };
  gold: number;
  provisions: number;
  inventory: Item[];
  monsters: Monster[];
  notes: string;
  theme: 'papyrus' | 'night';
  combatLog: { type: string, value: string }[];
  
  // Actions
  setAttribute: (key: 'skill' | 'energy' | 'luck', value: number, isInitial: boolean) => void;
  updateGold: (amount: number) => void;
  updateProvisions: (amount: number) => void;
  addMonster: (monster: Monster) => void;
  removeMonster: (id: string) => void;
  updateMonsterEnergy: (id: string, delta: number) => void;
  clearMonsters: () => void;
  addItem: (item: Item) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, delta: number) => void;
  setTheme: (theme: 'papyrus' | 'night') => void;
  addCombatLog: (log: { type: string, value: string }) => void;
  setNotes: (notes: string) => void;
  resetSheet: () => void;
}

export const useSheetStore = create<SheetState>()(
  persist(
    (set) => ({
      attributes: {
        skill: { initial: 10, current: 10 },
        energy: { initial: 14, current: 14 },
        luck: { initial: 8, current: 8 },
      },
      gold: 125,
      provisions: 7,
      inventory: [],
      monsters: [],
      notes: '',
      theme: 'papyrus',
      combatLog: [],
      
      resetSheet: () => {
        localStorage.removeItem('adventure-sheet-storage');
        set({
          attributes: {
            skill: { initial: 0, current: 0 },
            energy: { initial: 0, current: 0 },
            luck: { initial: 0, current: 0 },
          },
          gold: 0,
          provisions: 0,
          inventory: [],
          monsters: [],
          notes: '',
          combatLog: [],
        });
      },
      
      setAttribute: (key, value, isInitial) => 
        set((state) => ({
          attributes: {
            ...state.attributes,
            [key]: {
              ...state.attributes[key],
              [isInitial ? 'initial' : 'current']: value
            }
          }
        })),
        
      updateGold: (amount) => set((state) => ({ gold: Math.max(0, state.gold + amount) })),
      updateProvisions: (amount) => set((state) => ({ provisions: Math.max(0, state.provisions + amount) })),
      addMonster: (monster) => set((state) => ({ monsters: [...state.monsters, monster] })),
      removeMonster: (id) => set((state) => ({ monsters: state.monsters.filter(m => m.id !== id) })),
      updateMonsterEnergy: (id, delta) => set((state) => ({
        monsters: state.monsters.map(m => {
          if (m.id !== id) return m;
          const newEnergy = Math.max(0, m.energyCurrent + delta);
          return {
            ...m,
            energyCurrent: newEnergy,
            status: newEnergy === 0 ? 'defeated' : 'alive'
          };
        })
      })),
      clearMonsters: () => set({ monsters: [] }),
      addItem: (item) => set((state) => ({ inventory: [...state.inventory, item] })),
      removeItem: (id) => set((state) => ({ inventory: state.inventory.filter(i => i.id !== id) })),
      updateItemQuantity: (id, delta) => set((state) => ({
        inventory: state.inventory.map(i => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i)
      })),
      setTheme: (theme) => set({ theme }),
      addCombatLog: (log) => set((state) => ({ 
        combatLog: [log, ...state.combatLog].slice(0, 5) 
      })),
      setNotes: (notes) => set({ notes }),
    }),
    { name: 'adventure-sheet-storage' }
  )
);
