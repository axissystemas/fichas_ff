import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

// ─── Types ───────────────────────────────────────────────────────────────────

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

type SyncStatus = 'idle' | 'saving' | 'saved' | 'error' | 'loading';

interface SheetState {
  // Data
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
  combatLog: { type: string; value: string }[];
  activeTab: string;

  // Supabase sync
  sessionId: string;
  syncStatus: SyncStatus;
  lastSynced: string | null;

  // Actions
  setActiveTab: (tab: string) => void;
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
  addCombatLog: (log: { type: string; value: string }) => void;
  setNotes: (notes: string) => void;
  resetSheet: () => void;

  // Supabase actions
  setSyncStatus: (status: SyncStatus) => void;
  loadFromSupabase: () => Promise<void>;
  saveToSupabase: () => Promise<void>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Generates or retrieves a stable anonymous session ID */
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'ssr';
  const key = 'adventure-session-id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;

/** Debounce saves so rapid state changes don't flood Supabase */
function scheduleSave(store: SheetState) {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    store.saveToSupabase();
  }, 1200);
}

// ─── Default state ────────────────────────────────────────────────────────────

const defaultAttributes = {
  skill: { initial: 10, current: 10 },
  energy: { initial: 14, current: 14 },
  luck: { initial: 8, current: 8 },
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useSheetStore = create<SheetState>()(
  persist(
    (set, get) => ({
      // ── Initial State ──────────────────────────────────────────────────────
      attributes: defaultAttributes,
      gold: 125,
      provisions: 7,
      inventory: [],
      monsters: [],
      notes: '',
      theme: 'papyrus',
      combatLog: [],
      activeTab: 'Ficha',
      sessionId: getOrCreateSessionId(),
      syncStatus: 'idle',
      lastSynced: null,

      // ── Sync helpers ───────────────────────────────────────────────────────
      setSyncStatus: (syncStatus) => set({ syncStatus }),

      loadFromSupabase: async () => {
        const sessionId = get().sessionId;
        set({ syncStatus: 'loading' });
        try {
          const { data, error } = await supabase
            .from('adventure_sheets')
            .select('*')
            .eq('session_id', sessionId)
            .maybeSingle();

          if (error) throw error;

          if (data) {
            set({
              attributes: data.attributes,
              gold: data.gold,
              provisions: data.provisions,
              inventory: data.inventory,
              monsters: data.monsters,
              notes: data.notes,
              theme: data.theme as 'papyrus' | 'night',
              combatLog: data.combat_log,
              syncStatus: 'saved',
              lastSynced: new Date().toISOString(),
            });
          } else {
            // No existing sheet — save the current defaults to Supabase
            set({ syncStatus: 'idle' });
            await get().saveToSupabase();
          }
        } catch (err) {
          console.error('[Supabase] loadFromSupabase error:', err);
          set({ syncStatus: 'error' });
        }
      },

      saveToSupabase: async () => {
        const state = get();
        set({ syncStatus: 'saving' });
        try {
          const payload = {
            session_id: state.sessionId,
            attributes: state.attributes,
            gold: state.gold,
            provisions: state.provisions,
            inventory: state.inventory,
            monsters: state.monsters,
            notes: state.notes,
            theme: state.theme,
            combat_log: state.combatLog,
          };

          const { error } = await supabase
            .from('adventure_sheets')
            .upsert(payload, { onConflict: 'session_id' });

          if (error) throw error;

          set({ syncStatus: 'saved', lastSynced: new Date().toISOString() });

          // Reset to idle after 2s
          setTimeout(() => {
            if (get().syncStatus === 'saved') set({ syncStatus: 'idle' });
          }, 2000);
        } catch (err) {
          console.error('[Supabase] saveToSupabase error:', err);
          set({ syncStatus: 'error' });
        }
      },

      // ── Tab ───────────────────────────────────────────────────────────────
      setActiveTab: (activeTab) => set({ activeTab }),

      // ── Attributes ────────────────────────────────────────────────────────
      setAttribute: (key, value, isInitial) => {
        set((state) => ({
          attributes: {
            ...state.attributes,
            [key]: {
              ...state.attributes[key],
              [isInitial ? 'initial' : 'current']: value,
            },
          },
        }));
        scheduleSave(get());
      },

      // ── Gold & Provisions ─────────────────────────────────────────────────
      updateGold: (amount) => {
        set((state) => ({ gold: Math.max(0, state.gold + amount) }));
        scheduleSave(get());
      },
      updateProvisions: (amount) => {
        set((state) => ({ provisions: Math.max(0, state.provisions + amount) }));
        scheduleSave(get());
      },

      // ── Monsters ──────────────────────────────────────────────────────────
      addMonster: (monster) => {
        set((state) => ({ monsters: [...state.monsters, monster] }));
        scheduleSave(get());
      },
      removeMonster: (id) => {
        set((state) => ({ monsters: state.monsters.filter((m) => m.id !== id) }));
        scheduleSave(get());
      },
      updateMonsterEnergy: (id, delta) => {
        set((state) => ({
          monsters: state.monsters.map((m) => {
            if (m.id !== id) return m;
            const newEnergy = Math.max(0, m.energyCurrent + delta);
            return { ...m, energyCurrent: newEnergy, status: newEnergy === 0 ? 'defeated' : 'alive' };
          }),
        }));
        scheduleSave(get());
      },
      clearMonsters: () => {
        set({ monsters: [] });
        scheduleSave(get());
      },

      // ── Inventory ─────────────────────────────────────────────────────────
      addItem: (item) => {
        set((state) => ({ inventory: [...state.inventory, item] }));
        scheduleSave(get());
      },
      removeItem: (id) => {
        set((state) => ({ inventory: state.inventory.filter((i) => i.id !== id) }));
        scheduleSave(get());
      },
      updateItemQuantity: (id, delta) => {
        set((state) => ({
          inventory: state.inventory.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
          ),
        }));
        scheduleSave(get());
      },

      // ── Theme ─────────────────────────────────────────────────────────────
      setTheme: (theme) => {
        set({ theme });
        scheduleSave(get());
      },

      // ── Combat Log ────────────────────────────────────────────────────────
      addCombatLog: (log) => {
        set((state) => ({ combatLog: [log, ...state.combatLog].slice(0, 5) }));
        scheduleSave(get());
      },

      // ── Notes ─────────────────────────────────────────────────────────────
      setNotes: (notes) => {
        set({ notes });
        scheduleSave(get());
      },

      // ── Reset ─────────────────────────────────────────────────────────────
      resetSheet: async () => {
        const sessionId = get().sessionId;
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
          activeTab: 'Ficha',
        });

        // Also delete from Supabase
        try {
          await supabase
            .from('adventure_sheets')
            .delete()
            .eq('session_id', sessionId);
        } catch (err) {
          console.error('[Supabase] resetSheet error:', err);
        }
      },
    }),
    {
      name: 'adventure-sheet-storage',
      // Only persist theme and sessionId locally; everything else comes from Supabase
      partialize: (state) => ({
        theme: state.theme,
        sessionId: state.sessionId,
      }),
    }
  )
);
