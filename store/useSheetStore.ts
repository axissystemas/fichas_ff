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

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: { avatar_url?: string; full_name?: string };
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

  // Supabase sync, list, and user state
  user: AuthUser | null;
  activeSheetId: string | null;
  sheetsList: Array<{ id: string; title: string; updated_at: string }>;
  syncStatus: SyncStatus;
  lastSynced: string | null;

  // Actions
  setUser: (user: AuthUser | null) => void;
  clearLocalState: () => void;
  setActiveSheetId: (id: string | null) => void;
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
  loadSheetsList: () => Promise<void>;
  loadSheet: (id: string) => Promise<void>;
  createSheet: (title: string) => Promise<void>;
  renameSheet: (id: string, newTitle: string) => Promise<void>;
  deleteSheet: (id: string) => Promise<void>;
  saveToSupabase: () => Promise<void>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

let saveTimer: ReturnType<typeof setTimeout> | null = null;

/** Debounce saves so rapid state changes don't flood Supabase */
function scheduleSave(store: SheetState) {
  if (!store.user || !store.activeSheetId) return; // Do not save if not logged in or no active sheet
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
      user: null,
      activeSheetId: null,
      sheetsList: [],
      syncStatus: 'idle',
      lastSynced: null,

      // ── Sync helpers ───────────────────────────────────────────────────────
      setSyncStatus: (syncStatus) => set({ syncStatus }),

      setUser: (user) => set({ user }),

      clearLocalState: () => {
        set({
          attributes: defaultAttributes,
          gold: 125,
          provisions: 7,
          inventory: [],
          monsters: [],
          notes: '',
          combatLog: [],
          activeTab: 'Ficha',
          user: null,
          activeSheetId: null,
          sheetsList: [],
          syncStatus: 'idle',
          lastSynced: null,
        });
      },

      setActiveSheetId: (activeSheetId) => set({ activeSheetId }),

      loadSheetsList: async () => {
        const user = get().user;
        if (!user) return;
        set({ syncStatus: 'loading' });
        try {
          const { data, error } = await supabase
            .from('adventure_sheets')
            .select('id, title, updated_at')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false });

          if (error) throw error;

          set({ sheetsList: data || [], syncStatus: 'idle' });
        } catch (err) {
          console.error('[Supabase] loadSheetsList error:', err);
          set({ syncStatus: 'idle', sheetsList: [] });
        }
      },

      loadSheet: async (id: string) => {
        const user = get().user;
        if (!user) return;
        set({ syncStatus: 'loading' });
        try {
          const { data, error } = await supabase
            .from('adventure_sheets')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

          if (error) throw error;

          if (data) {
            set({
              activeSheetId: data.id,
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
          }
        } catch (err) {
          console.error('[Supabase] loadSheet error:', err);
          set({ syncStatus: 'error' });
        }
      },

      createSheet: async (title: string) => {
        const user = get().user;
        if (!user) return;
        set({ syncStatus: 'saving' });
        try {
          const newSheetId = crypto.randomUUID();
          const payload = {
            id: newSheetId,
            user_id: user.id,
            title: title || 'Nova Ficha',
            attributes: defaultAttributes,
            gold: 125,
            provisions: 7,
            inventory: [],
            monsters: [],
            notes: '',
            theme: get().theme,
            combat_log: [],
          };

          const { error } = await supabase
            .from('adventure_sheets')
            .insert(payload);

          if (error) throw error;

          set((state) => ({
            sheetsList: [
              { id: newSheetId, title: payload.title, updated_at: new Date().toISOString() },
              ...state.sheetsList,
            ],
            activeSheetId: newSheetId,
            attributes: defaultAttributes,
            gold: 125,
            provisions: 7,
            inventory: [],
            monsters: [],
            notes: '',
            combatLog: [],
            syncStatus: 'saved',
            lastSynced: new Date().toISOString(),
          }));

          setTimeout(() => {
            if (get().syncStatus === 'saved') set({ syncStatus: 'idle' });
          }, 2000);
        } catch (err: any) {
          console.error('[Supabase] createSheet error:', err);
          alert('Erro ao criar ficha: ' + (err?.message || JSON.stringify(err)));
          set({ syncStatus: 'error' });
        }
      },

      renameSheet: async (id: string, newTitle: string) => {
        const user = get().user;
        if (!user) return;
        try {
          const { error } = await supabase
            .from('adventure_sheets')
            .update({ title: newTitle })
            .eq('id', id)
            .eq('user_id', user.id);

          if (error) throw error;

          set((state) => ({
            sheetsList: state.sheetsList.map((s) =>
              s.id === id ? { ...s, title: newTitle } : s
            ),
          }));
        } catch (err) {
          console.error('[Supabase] renameSheet error:', err);
        }
      },

      deleteSheet: async (id: string) => {
        const user = get().user;
        if (!user) return;
        try {
          const { error } = await supabase
            .from('adventure_sheets')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

          if (error) throw error;

          set((state) => ({
            sheetsList: state.sheetsList.filter((s) => s.id !== id),
            activeSheetId: state.activeSheetId === id ? null : state.activeSheetId,
          }));
        } catch (err) {
          console.error('[Supabase] deleteSheet error:', err);
        }
      },

      saveToSupabase: async () => {
        const state = get();
        const user = state.user;
        const activeSheetId = state.activeSheetId;
        if (!user || !activeSheetId) return;
        
        set({ syncStatus: 'saving' });
        try {
          const payload = {
            id: activeSheetId,
            user_id: user.id,
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
            .upsert(payload);

          if (error) throw error;

          set({ syncStatus: 'saved', lastSynced: new Date().toISOString() });

          // Refresh locally
          set((state) => ({
            sheetsList: state.sheetsList.map((s) =>
              s.id === activeSheetId ? { ...s, updated_at: new Date().toISOString() } : s
            ),
          }));

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
        const user = get().user;
        const activeSheetId = get().activeSheetId;
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

        if (user && activeSheetId) {
          try {
            await supabase
              .from('adventure_sheets')
              .delete()
              .eq('id', activeSheetId)
              .eq('user_id', user.id);
            
            // Return to selector
            set({ activeSheetId: null });
            await get().loadSheetsList();
          } catch (err) {
            console.error('[Supabase] resetSheet error:', err);
          }
        }
      },
    }),
    {
      name: 'adventure-sheet-storage',
      // Only persist theme locally
      partialize: (state) => ({
        theme: state.theme,
      }),
    }
  )
);
