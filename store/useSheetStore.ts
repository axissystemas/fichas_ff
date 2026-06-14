import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface NewsItem {
  id: string;
  category: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  created_at?: string;
}

export const DEFAULT_NEWS: NewsItem[] = [
  {
    id: 'default-1',
    category: 'Livros Jogos',
    title: 'Encontro Marcado com o M.E.D.O.',
    description: 'Agora disponível! Ficha customizada de super-heróis em Titan City. Escolha poderes (Superforça, Psi, HTA, Rajada), acumule Pontos de Herói e use o Cinto de Utilidades ou Relógio do Crime.',
    date: '2026-06-14'
  },
  {
    id: 'default-2',
    category: 'Melhoria',
    title: 'Áudio & Trilha Retrô',
    description: 'Trilha sonora 16-bits imersiva adicionada. As músicas mudam dinamicamente dependendo da sua campanha atual!',
    date: '2026-06-12'
  },
  {
    id: 'default-3',
    category: 'Infraestrutura',
    title: 'Sincronização na Nuvem',
    description: 'Salvamento automático de progresso através da integração Supabase. Suas aventuras salvas em qualquer dispositivo.',
    date: '2026-06-10'
  }
];

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

// Database types
export interface DbSheet {
  id: string;
  user_id: string;
  title: string;
  status?: 'playing' | 'victory' | 'defeat';
  gamebook?: string;
  attributes: {
    skill: Attribute;
    energy: Attribute;
    luck: Attribute;
    currentSection?: string;
    suggestionsEnabled?: boolean;
    heroPoints?: number;
    superpower?: 'superforca' | 'psi' | 'hta' | 'rajada' | null;
    timeDay?: 1 | 2 | 3;
    timePeriod?: 'manha' | 'tarde' | 'noite';
    clues?: {
      local: string;
      dia: string;
      horario: string;
      lider: string;
      outras: string;
    };
  };
  gold?: number;
  provisions?: number;
  inventory?: Item[];
  monsters?: Monster[];
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email?: string;
  provider?: string;
  user_metadata?: { avatar_url?: string; full_name?: string };
}

type SyncStatus = 'idle' | 'saving' | 'saved' | 'error' | 'loading';

interface SheetState {
  // Data
  attributes: {
    skill: Attribute;
    energy: Attribute;
    luck: Attribute;
    currentSection?: string;
    suggestionsEnabled?: boolean;
    heroPoints?: number;
    superpower?: 'superforca' | 'psi' | 'hta' | 'rajada' | null;
    timeDay?: 1 | 2 | 3;
    timePeriod?: 'manha' | 'tarde' | 'noite';
    clues?: {
      local: string;
      dia: string;
      horario: string;
      lider: string;
      outras: string;
    };
  };
  gold: number;
  provisions: number;
  inventory: Item[];
  monsters: Monster[];
  notes: string;
  theme: 'papyrus' | 'night';
  combatLog: { type: string; value: string; timestamp?: string }[];
  activeTab: string;
  resetKey: number;
  status: 'playing' | 'victory' | 'defeat';
  gamebook: string;
  soundEnabled: boolean;
  musicEnabled: boolean;

  // Supabase sync, list, and user state
  user: AuthUser | null;
  activeSheetId: string | null;
  sheetsList: Array<{
    id: string;
    user_id?: string;
    title: string;
    gamebook?: string;
    updated_at: string;
    status?: 'playing' | 'victory' | 'defeat';
    attributes?: {
      skill: Attribute;
      energy: Attribute;
      luck: Attribute;
      currentSection?: string;
      suggestionsEnabled?: boolean;
      heroPoints?: number;
      superpower?: 'superforca' | 'psi' | 'hta' | 'rajada' | null;
      timeDay?: 1 | 2 | 3;
      timePeriod?: 'manha' | 'tarde' | 'noite';
      clues?: {
        local: string;
        dia: string;
        horario: string;
        lider: string;
        outras: string;
      };
    };
    gold?: number;
    provisions?: number;
    inventory?: Item[];
    monsters?: Monster[];
  }>;
  syncStatus: SyncStatus;
  lastSynced: string | null;
  isAdmin: boolean | null;
  newsList: NewsItem[];
  newsTableExists: boolean;

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
  toggleSound: () => void;
  toggleMusic: () => void;
  addCombatLog: (log: { type: string; value: string; timestamp?: string }) => void;
  setNotes: (notes: string) => void;
  setCurrentSection: (section: string) => void;
  setSuggestionsEnabled: (enabled: boolean) => void;
  resetSheet: () => void;
  setStatus: (status: 'playing' | 'victory' | 'defeat') => Promise<void>;
  logTelemetry: (eventType: string, eventData: any) => Promise<void>;
  updateUserSession: () => Promise<void>;
  incrementPlayTime: () => Promise<void>;
  updateHeroPoints: (amount: number) => void;
  setSuperpower: (power: 'superforca' | 'psi' | 'hta' | 'rajada' | null) => void;
  advanceTime: () => void;
  updateClues: (clues: { local?: string; dia?: string; horario?: string; lider?: string; outras?: string }) => void;

  // Supabase actions
  setSyncStatus: (status: SyncStatus) => void;
  loadSheetsList: (allSheets?: boolean) => Promise<void>;
  loadSheet: (id: string) => Promise<void>;
  createSheet: (title: string, gamebook: string, suggestionsEnabled?: boolean) => Promise<void>;
  renameSheet: (id: string, newTitle: string) => Promise<void>;
  deleteSheet: (id: string) => Promise<void>;
  saveToSupabase: () => Promise<void>;
  checkAdminStatus: () => Promise<boolean>;
  loadNewsList: () => Promise<void>;
  addNewsItem: (item: Omit<NewsItem, 'id'>) => Promise<boolean>;
  updateNewsItem: (id: string, item: Partial<NewsItem>) => Promise<boolean>;
  deleteNewsItem: (id: string) => Promise<boolean>;
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
  currentSection: '',
  suggestionsEnabled: true,
};

const getDefaultInventory = (): Item[] => [
  { id: crypto.randomUUID(), name: 'Mochila', quantity: 1, equipped: true },
  { id: crypto.randomUUID(), name: 'Espada', quantity: 1, equipped: true },
  { id: crypto.randomUUID(), name: 'Armadura de couro', quantity: 1, equipped: true },
];

// ─── Store ────────────────────────────────────────────────────────────────────

export const useSheetStore = create<SheetState>()(
  persist(
    (set, get) => ({
      // ── Initial State ──────────────────────────────────────────────────────
      attributes: defaultAttributes,
      gold: 0,
      provisions: 10,
      inventory: getDefaultInventory(),
      monsters: [],
      notes: '',
      theme: 'papyrus',
      combatLog: [],
      activeTab: 'Ficha',
      resetKey: 0,
      status: 'playing',
      gamebook: 'O Feiticeiro da Montanha de Fogo',
      soundEnabled: true,
      musicEnabled: true,
      user: null,
      activeSheetId: null,
      sheetsList: [],
      syncStatus: 'idle',
      lastSynced: null,
      isAdmin: null,
      newsList: [],
      newsTableExists: false,

      // ── Sync helpers ───────────────────────────────────────────────────────
      setSyncStatus: (syncStatus) => set({ syncStatus }),

      setUser: (user) => set({ user }),

      clearLocalState: () => {
        set({
          attributes: defaultAttributes,
          gold: 0,
          provisions: 10,
          inventory: getDefaultInventory(),
          monsters: [],
          notes: '',
          combatLog: [],
          activeTab: 'Ficha',
          resetKey: 0,
          status: 'playing',
          gamebook: 'O Feiticeiro da Montanha de Fogo',
          user: null,
          activeSheetId: null,
          sheetsList: [],
          syncStatus: 'idle',
          lastSynced: null,
          isAdmin: null,
        });
      },

      setActiveSheetId: (activeSheetId) => set({ activeSheetId }),

      loadSheetsList: async (allSheets = false) => {
        const user = get().user;
        if (!user) return;
        set({ syncStatus: 'loading' });
        try {
          let query = supabase
            .from('adventure_sheets')
            .select('*');

          if (!allSheets) {
            query = query.eq('user_id', user.id);
          }

          const { data, error } = await query.order('updated_at', { ascending: false });

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
              status: (data.status || 'playing') as 'playing' | 'victory' | 'defeat',
              gamebook: data.gamebook || 'O Feiticeiro da Montanha de Fogo',
              syncStatus: 'saved',
              lastSynced: new Date().toISOString(),
            });
          }
        } catch (err) {
          console.error('[Supabase] loadSheet error:', err);
          set({ syncStatus: 'error' });
        }
      },

      createSheet: async (title: string, gamebook: string, suggestionsEnabled = true) => {
        const user = get().user;
        if (!user) return;
        set({ syncStatus: 'saving' });
        try {
          const newSheetId = crypto.randomUUID();
          const isMedo = gamebook === 'Encontro Marcado com o M.E.D.O.';
          const customAttributes = {
            skill: { initial: 0, current: 0 },
            energy: { initial: 0, current: 0 },
            luck: { initial: 0, current: 0 },
            currentSection: '',
            suggestionsEnabled,
            ...(isMedo ? {
              heroPoints: 0,
              superpower: null,
              timeDay: 1 as any,
              timePeriod: 'manha' as any,
              clues: { local: '', dia: '', horario: '', lider: '', outras: '' },
            } : {})
          };
          const payload = {
            id: newSheetId,
            user_id: user.id,
            title: title || 'Nova Ficha',
            gamebook: gamebook || 'O Feiticeiro da Montanha de Fogo',
            attributes: customAttributes as any,
            gold: 0,
            provisions: 10,
            inventory: getDefaultInventory(),
            monsters: [],
            notes: '',
            theme: get().theme,
            combat_log: [],
            status: 'playing',
          };

          const { error } = await supabase
            .from('adventure_sheets')
            .insert(payload);

          if (error) throw error;

          set((state) => ({
            sheetsList: [
              {
                id: newSheetId,
                title: payload.title,
                gamebook: payload.gamebook,
                updated_at: new Date().toISOString(),
                attributes: customAttributes,
                status: 'playing',
              },
              ...state.sheetsList,
            ],
            activeSheetId: newSheetId,
            attributes: customAttributes,
            gold: 0,
            provisions: 10,
            inventory: getDefaultInventory(),
            monsters: [],
            notes: '',
            combatLog: [],
            status: 'playing',
            gamebook: payload.gamebook,
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
            status: state.status,
            gamebook: state.gamebook,
          };

          const { error } = await supabase
            .from('adventure_sheets')
            .update(payload)
            .eq('id', activeSheetId)
            .eq('user_id', user.id);

          if (error) throw error;

          set({ syncStatus: 'saved', lastSynced: new Date().toISOString() });

          // Refresh locally
          set((state) => ({
            sheetsList: state.sheetsList.map((s) =>
              s.id === activeSheetId
                ? {
                    ...s,
                    updated_at: new Date().toISOString(),
                    attributes: state.attributes,
                    status: state.status,
                    gamebook: state.gamebook,
                  }
                : s
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
        let playerDied = false;
        set((state) => {
          const attr = state.attributes[key];
          // Se não estiver mudando o valor inicial, garante que o valor não passe do inicial atual
          const finalValue = !isInitial ? Math.min(value, attr.initial) : value;
          
          if (key === 'energy' && !isInitial && attr.current > 0 && finalValue <= 0) {
            playerDied = true;
          }

          return {
            attributes: {
              ...state.attributes,
              [key]: {
                ...attr,
                [isInitial ? 'initial' : 'current']: finalValue,
              },
            },
          };
        });
        scheduleSave(get());

        if (playerDied) {
          const monsters = get().monsters;
          const activeMonster = monsters.find(m => m.status === 'alive');
          get().logTelemetry('death', {
            cause: activeMonster ? 'combat' : 'trap',
            monster: activeMonster ? activeMonster.name : null,
            section: get().attributes.currentSection || null,
          });
          get().setStatus('defeat');
        }
      },
      setCurrentSection: (section) => {
        set((state) => ({
          attributes: {
            ...state.attributes,
            currentSection: section,
          },
        }));
        scheduleSave(get());
        if (section) {
          get().logTelemetry('section_visit', { section });
        }
      },
      setSuggestionsEnabled: (enabled) => {
        set((state) => ({
          attributes: {
            ...state.attributes,
            suggestionsEnabled: enabled,
          },
        }));
        scheduleSave(get());
      },
      updateHeroPoints: (amount) => {
        set((state) => ({
          attributes: {
            ...state.attributes,
            heroPoints: Math.max(0, (state.attributes.heroPoints || 0) + amount),
          },
        }));
        scheduleSave(get());
      },
      setSuperpower: (power) => {
        set((state) => ({
          attributes: {
            ...state.attributes,
            superpower: power,
          },
        }));
        scheduleSave(get());
      },
      advanceTime: () => {
        set((state) => {
          const currentDay = state.attributes.timeDay || 1;
          const currentPeriod = state.attributes.timePeriod || 'manha';
          
          let nextPeriod: 'manha' | 'tarde' | 'noite' = 'manha';
          let nextDay = currentDay;
          
          if (currentPeriod === 'manha') {
            nextPeriod = 'tarde';
          } else if (currentPeriod === 'tarde') {
            nextPeriod = 'noite';
          } else {
            nextPeriod = 'manha';
            nextDay = currentDay === 3 ? 1 : (currentDay + 1) as any;
          }
          
          return {
            attributes: {
              ...state.attributes,
              timeDay: nextDay,
              timePeriod: nextPeriod,
            },
          };
        });
        scheduleSave(get());
      },
      updateClues: (updatedClues) => {
        set((state) => ({
          attributes: {
            ...state.attributes,
            clues: {
              local: '',
              dia: '',
              horario: '',
              lider: '',
              outras: '',
              ...(state.attributes.clues || {}),
              ...updatedClues,
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
        if (amount < 0) {
          get().logTelemetry('item_use', { item: 'provisions', quantity: Math.abs(amount) });
        }
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
        let defeatedMonster: any = null;
        set((state) => {
          const monsters = state.monsters.map((m) => {
            if (m.id !== id) return m;
            const newEnergy = Math.max(0, m.energyCurrent + delta);
            const status: 'alive' | 'defeated' = newEnergy === 0 ? 'defeated' : 'alive';
            if (m.energyCurrent > 0 && newEnergy === 0) {
              defeatedMonster = m;
            }
            return { ...m, energyCurrent: newEnergy, status };
          });
          return { monsters };
        });
        scheduleSave(get());
        if (defeatedMonster) {
          get().logTelemetry('combat', {
            monster: defeatedMonster.name,
            result: 'victory',
            monster_skill: defeatedMonster.skill,
            monster_energy: defeatedMonster.energyMax,
          });
        }
      },
      clearMonsters: () => {
        set({ monsters: [] });
        scheduleSave(get());
      },

      // ── Inventory ─────────────────────────────────────────────────────────
      addItem: (item) => {
        set((state) => ({ inventory: [...state.inventory, item] }));
        scheduleSave(get());
        get().logTelemetry('inventory_change', { action: 'add', item: item.name, quantity: item.quantity });
      },
      removeItem: (id) => {
        let itemName = '';
        set((state) => {
          const item = state.inventory.find((i) => i.id === id);
          if (item) itemName = item.name;
          return { inventory: state.inventory.filter((i) => i.id !== id) };
        });
        scheduleSave(get());
        if (itemName) {
          get().logTelemetry('inventory_change', { action: 'remove', item: itemName });
        }
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

      toggleSound: () => {
        set((state) => ({ soundEnabled: !state.soundEnabled }));
      },

      toggleMusic: () => {
        set((state) => ({ musicEnabled: !state.musicEnabled }));
      },

      // ── Combat Log ────────────────────────────────────────────────────────
      addCombatLog: (log) => {
        const timestamp = new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
        set((state) => ({ combatLog: [{ ...log, timestamp }, ...state.combatLog].slice(0, 10) }));
        scheduleSave(get());
      },

      // ── Notes ─────────────────────────────────────────────────────────────
      setNotes: (notes) => {
        set({ notes });
        scheduleSave(get());
      },

      setStatus: async (status) => {
        set({ status });
        const activeSheetId = get().activeSheetId;
        const user = get().user;
        if (activeSheetId && user) {
          try {
            await supabase.from('adventure_sheets').update({ status }).eq('id', activeSheetId).eq('user_id', user.id);
            if (status !== 'playing') {
              await get().logTelemetry('game_completion', { status });
            }
          } catch (err) {
            console.error('[Supabase] setStatus error:', err);
          }
        }
      },

      logTelemetry: async (eventType, eventData) => {
        const user = get().user;
        const activeSheetId = get().activeSheetId;
        if (!user || !activeSheetId) return;
        try {
          await supabase.from('adventure_logs').insert({
            sheet_id: activeSheetId,
            user_id: user.id,
            event_type: eventType,
            event_data: eventData
          });
        } catch (err) {
          console.warn('[Telemetry] Log error:', err);
        }
      },

      updateUserSession: async () => {
        const user = get().user;
        if (!user) return;
        try {
          const { data: profile, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          if (error) throw error;

          const now = new Date();
          let streak = 1;

          if (profile) {
            const lastLogin = new Date(profile.last_login);
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const startOfLastLogin = new Date(lastLogin.getFullYear(), lastLogin.getMonth(), lastLogin.getDate());
            const diffDays = Math.round((startOfToday.getTime() - startOfLastLogin.getTime()) / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
              streak = profile.login_streak || 1;
            } else if (diffDays === 1) {
              streak = (profile.login_streak || 0) + 1;
            } else {
              streak = 1;
            }

            await supabase
              .from('user_profiles')
              .update({
                email: user.email,
                display_name: user.user_metadata?.full_name || user.email,
                last_login: now.toISOString(),
                login_streak: streak,
              })
              .eq('id', user.id);
          } else {
            await supabase
              .from('user_profiles')
              .insert({
                id: user.id,
                email: user.email,
                display_name: user.user_metadata?.full_name || user.email,
                last_login: now.toISOString(),
                login_streak: 1,
                total_play_time: 0,
              });
          }
        } catch (err) {
          console.warn('[Telemetry] Error updating user session:', err);
        }
      },

      incrementPlayTime: async () => {
        const user = get().user;
        if (!user) return;
        try {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('total_play_time')
            .eq('id', user.id)
            .maybeSingle();

          const currentPlayTime = profile?.total_play_time || 0;
          await supabase
            .from('user_profiles')
            .update({ total_play_time: currentPlayTime + 1 })
            .eq('id', user.id);
        } catch (err) {
          console.warn('[Telemetry] Playtime update warning:', err);
        }
      },

      resetSheet: async () => {
        const isMedo = get().gamebook === 'Encontro Marcado com o M.E.D.O.';
        set((state) => ({
          attributes: {
            skill: { initial: 0, current: 0 },
            energy: { initial: 0, current: 0 },
            luck: { initial: 0, current: 0 },
            currentSection: '',
            suggestionsEnabled: state.attributes.suggestionsEnabled,
            ...(isMedo ? {
              heroPoints: 0,
              superpower: null,
              timeDay: 1 as any,
              timePeriod: 'manha' as any,
              clues: { local: '', dia: '', horario: '', lider: '', outras: '' },
            } : {})
          },
          gold: 0,
          provisions: 10,
          inventory: getDefaultInventory(),
          monsters: [],
          notes: '',
          combatLog: [],
          activeTab: 'Ficha',
          resetKey: state.resetKey + 1,
          status: 'playing',
        }));

        // Save the cleared state to Supabase instead of deleting the sheet
        await get().saveToSupabase();
      },
      checkAdminStatus: async () => {
        const user = get().user;
        if (!user) {
          set({ isAdmin: false });
          return false;
        }
        try {
          const { data, error } = await supabase
            .from('admin_users')
            .select('is_admin')
            .eq('id', user.id)
            .maybeSingle();

          if (error) throw error;

          const isUserAdmin = !!data?.is_admin;
          set({ isAdmin: isUserAdmin });
          return isUserAdmin;
        } catch (err) {
          console.error('[Supabase] checkAdminStatus error:', err);
          set({ isAdmin: false });
          return false;
        }
      },
      loadNewsList: async () => {
        try {
          const { data, error } = await supabase
            .from('guild_news')
            .select('*')
            .order('date', { ascending: false });

          if (error) throw error;

          set({ newsList: data || [], newsTableExists: true });
        } catch (err: any) {
          console.warn('[NewsStore] Failed to fetch guild_news table, falling back to static news:', err?.message || err);
          set({ newsList: DEFAULT_NEWS, newsTableExists: false });
        }
      },
      addNewsItem: async (item) => {
        try {
          const { error } = await supabase
            .from('guild_news')
            .insert([item]);

          if (error) throw error;

          await get().loadNewsList();
          return true;
        } catch (err) {
          console.error('[NewsStore] addNewsItem error:', err);
          return false;
        }
      },
      updateNewsItem: async (id, item) => {
        try {
          const { error } = await supabase
            .from('guild_news')
            .update(item)
            .eq('id', id);

          if (error) throw error;

          await get().loadNewsList();
          return true;
        } catch (err) {
          console.error('[NewsStore] updateNewsItem error:', err);
          return false;
        }
      },
      deleteNewsItem: async (id) => {
        try {
          const { error } = await supabase
            .from('guild_news')
            .delete()
            .eq('id', id);

          if (error) throw error;

          await get().loadNewsList();
          return true;
        } catch (err) {
          console.error('[NewsStore] deleteNewsItem error:', err);
          return false;
        }
      },
    }),
    {
      name: 'adventure-sheet-storage',
      // Only persist theme and sound preferences locally
      partialize: (state) => ({
        theme: state.theme,
        soundEnabled: state.soundEnabled,
        musicEnabled: state.musicEnabled,
      }),
    }
  )
);
