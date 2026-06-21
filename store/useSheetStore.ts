import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { audio } from '@/lib/audio';
import { ACHIEVEMENTS, getAchievementIdForBook } from '@/lib/achievements';

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

export interface UserStats {
  totalCombatsWon: number;
  totalMonstersDefeated: number;
  totalProvisionsConsumed: number;
  totalLuckTestsPassed: number;
  totalLuckTestsFailed: number;
  totalLuckUses: number;
  totalDeaths: number;
  totalCharactersCreated: number;
  musicTimeMs: number;
  themeChanges: number;
  sheetsExported: number;
  sheetsImported: number;
  visitedSections: Record<string, string[]>;
  completedBooks: string[];
  consecutiveLuckPasses: number;
  consecutiveWinsNoDamage: number;
  hasUsedLuckThisBook: boolean;
  hasEatenProvisionsThisBook: boolean;
  hasFledThisBook: boolean;
  suggestionsUsed: boolean;
  loginDays: string[];
  recentDeathsCount: number;
  energyAtCombatStart?: number;
}

const defaultUserStats = (): UserStats => ({
  totalCombatsWon: 0,
  totalMonstersDefeated: 0,
  totalProvisionsConsumed: 0,
  totalLuckTestsPassed: 0,
  totalLuckTestsFailed: 0,
  totalLuckUses: 0,
  totalDeaths: 0,
  totalCharactersCreated: 0,
  musicTimeMs: 0,
  themeChanges: 0,
  sheetsExported: 0,
  sheetsImported: 0,
  visitedSections: {},
  completedBooks: [],
  consecutiveLuckPasses: 0,
  consecutiveWinsNoDamage: 0,
  hasUsedLuckThisBook: false,
  hasEatenProvisionsThisBook: false,
  hasFledThisBook: false,
  suggestionsUsed: false,
  loginDays: [],
  recentDeathsCount: 0,
});

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
    playTimeMinutes?: number;
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
    magic?: Attribute;
    spells?: Record<string, number>;
    faith?: Attribute;
    diseases?: string[];
    coffinsDestroyed?: number;
    army?: {
      warriors: number;
      dwarfs: number;
      elves: number;
      knights: number;
      others: number;
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
    playTimeMinutes?: number;
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
    magic?: Attribute;
    spells?: Record<string, number>;
    faith?: Attribute;
    diseases?: string[];
    coffinsDestroyed?: number;
    army?: {
      warriors: number;
      dwarfs: number;
      elves: number;
      knights: number;
      others: number;
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
  musicVolume: number;

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
      playTimeMinutes?: number;
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
      magic?: Attribute;
      spells?: Record<string, number>;
      faith?: Attribute;
      diseases?: string[];
      coffinsDestroyed?: number;
      army?: {
        warriors: number;
        dwarfs: number;
        elves: number;
        knights: number;
        others: number;
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
  youtubeSettings: { channelId: string; videoUrl: string; isLive: boolean; instagramUrl: string; youtubeUrl: string; discordUrl: string; };
  youtubeTableExists: boolean;
  unlockedAchievements: Array<{ achievement_id: string; unlocked_at: string }>;
  achievementsTableExists: boolean;
  justUnlocked: { id: string; title: string; icon: string } | null;
  userStats: UserStats;
  statsTableExists: boolean;
  activeSheetLogs: any[];

  // Actions
  setUser: (user: AuthUser | null) => void;
  clearLocalState: () => void;
  setActiveSheetId: (id: string | null) => void;
  setActiveTab: (tab: string) => void;
  setAttribute: (key: 'skill' | 'energy' | 'luck' | 'magic' | 'faith', value: number, isInitial: boolean) => void;
  setSpells: (spells: Record<string, number>) => void;
  toggleDisease: (disease: string) => void;
  updateCoffinsDestroyed: (delta: number) => void;
  updateTroopCount: (troop: 'warriors' | 'dwarfs' | 'elves' | 'knights' | 'others', delta: number) => void;
  castSpell: (spellKey: string) => void;
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
  setMusicVolume: (volume: number) => void;
  addCombatLog: (log: { type: string; value: string; timestamp?: string }) => void;
  setNotes: (notes: string) => void;
  setCurrentSection: (section: string) => void;
  setSuggestionsEnabled: (enabled: boolean) => void;
  resetSheet: () => void;
  setStatus: (status: 'playing' | 'victory' | 'defeat') => Promise<void>;
  logTelemetry: (eventType: string, eventData: any) => Promise<void>;
  updateUserSession: () => Promise<void>;
  incrementPlayTime: () => Promise<void>;
  incrementSheetPlayTime: () => void;
  loadActiveSheetLogs: () => Promise<void>;
  updateHeroPoints: (amount: number) => void;
  setSuperpower: (power: 'superforca' | 'psi' | 'hta' | 'rajada' | null) => void;
  advanceTime: () => void;
  updateClues: (clues: { local?: string; dia?: string; horario?: string; lider?: string; outras?: string }) => void;
  loadAchievements: () => Promise<void>;
  unlockAchievement: (id: string) => Promise<void>;
  checkAchievements: (triggerType: 'stat' | 'death' | 'victory' | 'combat', data?: any) => Promise<void>;
  clearJustUnlocked: () => void;
  loadUserStats: () => Promise<void>;
  saveUserStats: () => Promise<void>;
  incrementStat: (key: keyof UserStats | string, amount?: number, extraData?: any) => Promise<void>;
  registerLuckTest: (success: boolean) => void;

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
  loadYoutubeSettings: () => Promise<void>;
  saveYoutubeSettings: (channelId: string, videoUrl: string, isLive: boolean, instagramUrl: string, youtubeUrl: string, discordUrl: string) => Promise<boolean>;
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
      musicVolume: 0.2,
      user: null,
      activeSheetId: null,
      sheetsList: [],
      syncStatus: 'idle',
      lastSynced: null,
      isAdmin: null,
      newsList: [],
      newsTableExists: false,
      youtubeSettings: { channelId: 'UCQJ2X-kM3wX2HnC4a8e2r7g', videoUrl: '', isLive: false, instagramUrl: '', youtubeUrl: '', discordUrl: '' },
      youtubeTableExists: false,
      unlockedAchievements: [],
      achievementsTableExists: false,
      justUnlocked: null,
      userStats: defaultUserStats(),
      statsTableExists: false,
      activeSheetLogs: [],

      // ── Sync helpers ───────────────────────────────────────────────────────
      setSyncStatus: (syncStatus) => set({ syncStatus }),

      setUser: (user) => {
        set({ user });
        get().loadAchievements();
        get().loadUserStats();
      },

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
          unlockedAchievements: [],
          achievementsTableExists: false,
          justUnlocked: null,
          userStats: defaultUserStats(),
          statsTableExists: false,
          activeSheetLogs: [],
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

          const { data: logsData } = await supabase
            .from('adventure_logs')
            .select('*')
            .eq('sheet_id', id)
            .order('created_at', { ascending: true });

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
              activeSheetLogs: logsData || [],
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
          const isCidadela = gamebook === 'A Cidadela do Caos';
          const isVampiro = gamebook === 'A Cripta do Vampiro';
          const isExercitos = gamebook === 'Exércitos da Morte';
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
            } : {}),
            ...(isCidadela ? {
              magic: { initial: 0, current: 0 },
              spells: {},
            } : {}),
            ...(isExercitos ? {
              army: { warriors: 100, dwarfs: 50, elves: 50, knights: 50, others: 0 },
            } : {})
          };
          const payload = {
            id: newSheetId,
            user_id: user.id,
            title: title || 'Nova Ficha',
            gamebook: gamebook || 'O Feiticeiro da Montanha de Fogo',
            attributes: customAttributes as any,
            gold: isExercitos ? 20000 : 0,
            provisions: isExercitos ? 0 : 10,
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
            gold: isExercitos ? 20000 : 0,
            provisions: isExercitos ? 0 : 10,
            inventory: getDefaultInventory(),
            monsters: [],
            notes: '',
            combatLog: [],
            status: 'playing',
            gamebook: payload.gamebook,
            activeSheetLogs: [],
            syncStatus: 'saved',
            lastSynced: new Date().toISOString(),
          }));

          get().incrementStat('totalCharactersCreated');

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
        let isLowEnergyWarning = false;
        set((state) => {
          const attr = state.attributes[key] || { initial: 0, current: 0 };
          // Se não estiver mudando o valor inicial, garante que o valor não passe do inicial atual (exceto para fé)
          const isFaith = key === 'faith';
          const finalValue = (!isInitial && !isFaith) ? Math.min(value, attr.initial) : value;
          
          if (key === 'energy' && !isInitial && attr.current > 0 && finalValue <= 0) {
            playerDied = true;
          }
          // Detecta se a energia diminuiu e ficou crítica (entre 1 e 4)
          if (key === 'energy' && !isInitial && finalValue > 0 && finalValue <= 4 && attr.current > finalValue) {
            isLowEnergyWarning = true;
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

        if (isInitial && (key === 'skill' || key === 'luck' || key === 'energy')) {
          get().checkAchievements('stat');
        }

        if (key === 'energy' && !isInitial && get().attributes.energy.current === 1) {
          get().checkAchievements('stat');
        }

        if (playerDied) {
          const monsters = get().monsters;
          const activeMonster = monsters.find(m => m.status === 'alive');
          get().logTelemetry('death', {
            cause: activeMonster ? 'combat' : 'trap',
            monster: activeMonster ? activeMonster.name : null,
            section: get().attributes.currentSection || null,
          });
          
          // Registrar morte nas estatísticas
          get().incrementStat('totalDeaths', 1);
          set((state) => ({
            userStats: {
              ...state.userStats,
              recentDeathsCount: (state.userStats.recentDeathsCount || 0) + 1
            }
          }));
          get().saveUserStats();

          get().setStatus('defeat');
        } else if (isLowEnergyWarning) {
          audio.playLowEnergyWarning();
        }
      },
      setSpells: (spells) => {
        set((state) => ({
          attributes: {
            ...state.attributes,
            spells,
          },
        }));
        scheduleSave(get());
      },
      castSpell: (spellKey) => {
        const CIDADELA_SPELLS = [
          { key: 'copia_de_criatura', name: 'Cópia de Criatura' },
          { key: 'pes', name: 'P.E.S.' },
          { key: 'fogo', name: 'Fogo' },
          { key: 'ouro_dos_tolos', name: 'Ouro dos Tolos' },
          { key: 'ilusao', name: 'Ilusão' },
          { key: 'levitacao', name: 'Levitação' },
          { key: 'sorte', name: 'Sorte' },
          { key: 'escudo', name: 'Escudo' },
          { key: 'habilidade', name: 'Habilidade' },
          { key: 'energia', name: 'Energia' },
          { key: 'forca', name: 'Força' },
          { key: 'fraqueza', name: 'Fraqueza' }
        ];

        let textLog = '';
        set((state) => {
          const spells = { ...state.attributes.spells };
          if (!spells[spellKey] || spells[spellKey] <= 0) return {};

          spells[spellKey] -= 1;

          const attributes = {
            ...state.attributes,
            spells,
          };

          if (spellKey === 'energia') {
            const energy = { ...state.attributes.energy };
            const healAmount = Math.ceil(energy.initial / 2);
            const newCurrent = Math.min(energy.current + healAmount, energy.initial);
            attributes.energy = { ...energy, current: newCurrent };
            textLog = `Conjurou Energia: Recuperou +${newCurrent - energy.current} de Energia.`;
          } else if (spellKey === 'habilidade') {
            const skill = { ...state.attributes.skill };
            attributes.skill = { ...skill, current: skill.initial };
            textLog = `Conjurou Habilidade: Restaurou Habilidade para o valor inicial (${skill.initial}).`;
          } else if (spellKey === 'sorte') {
            const luck = { ...state.attributes.luck };
            const newInitial = luck.initial + 1;
            attributes.luck = { initial: newInitial, current: newInitial };
            textLog = `Conjurou Sorte: Aumentou a Sorte Inicial para ${newInitial} e restaurou Sorte Atual.`;
          } else {
            const spellName = CIDADELA_SPELLS.find(s => s.key === spellKey)?.name || spellKey;
            textLog = `Conjurou o feitiço: ${spellName}.`;
          }

          if (attributes.magic) {
            attributes.magic = {
              ...attributes.magic,
              current: Math.max(0, attributes.magic.current - 1),
            };
          }

          return { attributes };
        });

        if (textLog) {
          get().addCombatLog({ type: 'spell', value: textLog });
        }
        scheduleSave(get());
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
          get().incrementStat('visitedSections', 1, { book: get().gamebook, section });
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
      toggleDisease: (disease) => {
        set((state) => {
          const currentDiseases = state.attributes.diseases || [];
          const exists = currentDiseases.includes(disease);
          const nextDiseases = exists
            ? currentDiseases.filter((d) => d !== disease)
            : [...currentDiseases, disease];
          return {
            attributes: {
              ...state.attributes,
              diseases: nextDiseases,
            },
          };
        });
        scheduleSave(get());
      },
      updateCoffinsDestroyed: (delta) => {
        set((state) => ({
          attributes: {
            ...state.attributes,
            coffinsDestroyed: Math.min(4, Math.max(0, (state.attributes.coffinsDestroyed || 0) + delta)),
          },
        }));
        scheduleSave(get());
      },
      updateTroopCount: (troop, delta) => {
        set((state) => {
          if (!state.attributes.army) return {};
          const currentCount = state.attributes.army[troop] || 0;
          const newCount = Math.max(0, currentCount + delta);
          return {
            attributes: {
              ...state.attributes,
              army: {
                ...state.attributes.army,
                [troop]: newCount,
              },
            },
          };
        });
        scheduleSave(get());
      },

      // ── Gold & Provisions ─────────────────────────────────────────────────
      updateGold: (amount) => {
        set((state) => ({ gold: Math.max(0, state.gold + amount) }));
        scheduleSave(get());
        get().checkAchievements('stat');
      },
      updateProvisions: (amount) => {
        set((state) => ({ provisions: Math.max(0, state.provisions + amount) }));
        scheduleSave(get());
        if (amount < 0) {
          get().logTelemetry('item_use', { item: 'provisions', quantity: Math.abs(amount) });
          get().incrementStat('totalProvisionsConsumed', Math.abs(amount));
          set((state) => ({
            userStats: {
              ...state.userStats,
              hasEatenProvisionsThisBook: true
            }
          }));
          get().saveUserStats();
        }
      },

      // ── Monsters ──────────────────────────────────────────────────────────
      addMonster: (monster) => {
        if (get().monsters.length === 0) {
          set((state) => ({
            userStats: {
              ...state.userStats,
              energyAtCombatStart: state.attributes.energy.current
            }
          }));
        }
        set((state) => ({ monsters: [...state.monsters, monster] }));
        scheduleSave(get());
      },
      removeMonster: (id) => {
        const monster = get().monsters.find(m => m.id === id);
        if (monster && monster.status === 'alive') {
          set((state) => ({
            userStats: {
              ...state.userStats,
              hasFledThisBook: true
            }
          }));
          get().saveUserStats();
        }
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
          
          get().incrementStat('totalMonstersDefeated', 1);

          // Triggers para os novos vilões/monstros das conquistas
          const nameNorm = defeatedMonster.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          if (nameNorm.includes('zagor')) {
            get().unlockAchievement('combat_slayer_zagor');
          }
          if (nameNorm.includes('balthus') || nameNorm.includes('balthusdire')) {
            get().unlockAchievement('combat_slayer_balthus');
          }
          if (nameNorm.includes('zanbar bone')) {
            get().unlockAchievement('combat_slayer_zanbar');
          }
          if (nameNorm.includes('razaak')) {
            get().unlockAchievement('combat_slayer_razaak');
          }
          if (nameNorm.includes('heydrich')) {
            get().unlockAchievement('combat_slayer_heydrich');
          }
          if (nameNorm.includes('agglax')) {
            get().unlockAchievement('combat_slayer_agglax');
          }
          if (nameNorm.includes('malbordus')) {
            get().unlockAchievement('combat_slayer_malbordus');
          }
          if (nameNorm.includes('bruxa da neve')) {
            get().unlockAchievement('combat_slayer_snow_witch');
          }
          if (nameNorm.includes('rei lagarto')) {
            get().unlockAchievement('combat_slayer_lizard_king');
          }
          if (nameNorm.includes('arqui-mago') || nameNorm.includes('arquimago')) {
            get().unlockAchievement('combat_slayer_archmage');
          }
          if (nameNorm.includes('sidney knox')) {
            get().unlockAchievement('combat_slayer_knox');
          }
          if (nameNorm.includes('zera')) {
            get().unlockAchievement('combat_slayer_zera');
          }
          if (nameNorm.includes('cadanca')) {
            get().unlockAchievement('combat_slayer_cadanca');
          }
          if (nameNorm.includes('dragao')) {
            get().unlockAchievement('combat_slayer_dragon');
          }
          if (nameNorm.includes('demonio')) {
            get().unlockAchievement('combat_slayer_demon');
          }

          const allDefeated = get().monsters.every(m => m.status === 'defeated');
          if (allDefeated) {
            get().incrementStat('totalCombatsWon', 1);
            
            const energyAtStart = get().userStats.energyAtCombatStart || 0;
            const currentEnergy = get().attributes.energy.current;
            const noDamage = currentEnergy >= energyAtStart;
            
            set((state) => {
              const stats = { ...state.userStats };
              if (noDamage) {
                stats.consecutiveWinsNoDamage += 1;
              } else {
                stats.consecutiveWinsNoDamage = 0;
              }
              return { userStats: stats };
            });
            
            get().saveUserStats();
            get().checkAchievements('combat');

            if (noDamage) {
              get().unlockAchievement('combat_untouchable');
            }
            if (currentEnergy === 1) {
              get().unlockAchievement('combat_wall');
            }
          }
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
        if (theme === 'night') {
          get().incrementStat('themeChanges');
        }
      },

      toggleSound: () => {
        set((state) => ({ soundEnabled: !state.soundEnabled }));
      },

      toggleMusic: () => {
        set((state) => ({ musicEnabled: !state.musicEnabled }));
      },

      setMusicVolume: (musicVolume) => {
        set({ musicVolume });
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

        if (status === 'victory') {
          get().incrementStat('completedBooks', 1, get().gamebook);
          set((state) => ({
            userStats: {
              ...state.userStats,
              recentDeathsCount: 0
            }
          }));
          get().saveUserStats();
          await get().checkAchievements('victory');
        } else if (status === 'defeat') {
          await get().checkAchievements('death');
        }

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
          const newLog = {
            sheet_id: activeSheetId,
            user_id: user.id,
            event_type: eventType,
            event_data: eventData,
            created_at: new Date().toISOString()
          };
          set((state) => ({ activeSheetLogs: [...state.activeSheetLogs, newLog] }));
          await supabase.from('adventure_logs').insert(newLog);
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

      incrementSheetPlayTime: () => {
        set((state) => {
          const currentPlayTime = state.attributes.playTimeMinutes || 0;
          return {
            attributes: {
              ...state.attributes,
              playTimeMinutes: currentPlayTime + 1
            }
          };
        });
        scheduleSave(get());
      },

      loadActiveSheetLogs: async () => {
        const activeSheetId = get().activeSheetId;
        if (!activeSheetId) return;
        try {
          const { data, error } = await supabase
            .from('adventure_logs')
            .select('*')
            .eq('sheet_id', activeSheetId)
            .order('created_at', { ascending: true });
          if (error) throw error;
          set({ activeSheetLogs: data || [] });
        } catch (err) {
          console.error('[Supabase] loadActiveSheetLogs error:', err);
        }
      },

      resetSheet: async () => {
        const isMedo = get().gamebook === 'Encontro Marcado com o M.E.D.O.';
        const isCidadela = get().gamebook === 'A Cidadela do Caos';
        const isVampiro = get().gamebook === 'A Cripta do Vampiro';
        const isExercitos = get().gamebook === 'Exércitos da Morte';
        set((state) => ({
          attributes: {
            skill: { initial: 0, current: 0 },
            energy: { initial: 0, current: 0 },
            luck: { initial: 0, current: 0 },
            currentSection: '',
            suggestionsEnabled: state.attributes.suggestionsEnabled,
            playTimeMinutes: 0,
            ...(isMedo ? {
              heroPoints: 0,
              superpower: null,
              timeDay: 1 as any,
              timePeriod: 'manha' as any,
              clues: { local: '', dia: '', horario: '', lider: '', outras: '' },
            } : {}),
            ...(isCidadela ? {
              magic: { initial: 0, current: 0 },
              spells: {},
            } : {}),
            ...(isVampiro ? {
              faith: { initial: 0, current: 0 },
              diseases: [],
              coffinsDestroyed: 0,
            } : {}),
            ...(isExercitos ? {
              army: { warriors: 100, dwarfs: 50, elves: 50, knights: 50, others: 0 },
            } : {})
          },
          gold: isExercitos ? 20000 : 0,
          provisions: isExercitos ? 0 : 10,
          inventory: getDefaultInventory(),
          monsters: [],
          notes: '',
          combatLog: [],
          activeTab: 'Ficha',
          resetKey: state.resetKey + 1,
          status: 'playing',
          activeSheetLogs: [],
        }));

        get().incrementStat('totalCharactersCreated');
        set((state) => ({
          userStats: {
            ...state.userStats,
            hasUsedLuckThisBook: false,
            hasEatenProvisionsThisBook: false,
            hasFledThisBook: false,
          }
        }));
        get().saveUserStats();

        // Deletar os logs da ficha atual no Supabase para iniciar o checklist do zero
        const activeSheetId = get().activeSheetId;
        const user = get().user;
        if (activeSheetId && user) {
          try {
            await supabase.from('adventure_logs').delete().eq('sheet_id', activeSheetId);
          } catch (err) {
            console.warn('[Supabase] Error deleting logs on reset:', err);
          }
        }

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
      loadYoutubeSettings: async () => {
        try {
          const { data, error } = await supabase
            .from('youtube_settings')
            .select('*')
            .eq('id', 1)
            .maybeSingle();

          if (error) throw error;

          if (data) {
            set({
              youtubeSettings: {
                channelId: data.channel_id,
                videoUrl: data.video_url || '',
                isLive: data.is_live,
                instagramUrl: data.instagram_url || '',
                youtubeUrl: data.youtube_url || '',
                discordUrl: data.discord_url || '',
              },
              youtubeTableExists: true,
            });
          } else {
            // Se a tabela existe mas está vazia, insere a linha padrão
            const defaultSettings = { 
              channel_id: 'UCQJ2X-kM3wX2HnC4a8e2r7g', 
              video_url: '', 
              is_live: false,
              instagram_url: '',
              youtube_url: '',
              discord_url: ''
            };
            const { error: insertErr } = await supabase.from('youtube_settings').insert([{ id: 1, ...defaultSettings }]);
            if (!insertErr) {
              set({
                youtubeSettings: { 
                  channelId: defaultSettings.channel_id, 
                  videoUrl: '', 
                  isLive: false,
                  instagramUrl: '',
                  youtubeUrl: '',
                  discordUrl: ''
                },
                youtubeTableExists: true,
              });
            }
          }
        } catch (err: any) {
          console.warn('[YoutubeSettingsStore] Failed to fetch youtube_settings, falling back to local defaults:', err?.message || err);
          let localChannel = 'UCQJ2X-kM3wX2HnC4a8e2r7g';
          let localVideo = '';
          let localLive = false;
          let localInstagram = '';
          let localYoutube = '';
          let localDiscord = '';
          if (typeof window !== 'undefined') {
            localChannel = localStorage.getItem('yt_channel_id') || localChannel;
            localVideo = localStorage.getItem('yt_video_url') || localVideo;
            localLive = localStorage.getItem('yt_is_live') === 'true';
            localInstagram = localStorage.getItem('yt_instagram_url') || '';
            localYoutube = localStorage.getItem('yt_youtube_url') || '';
            localDiscord = localStorage.getItem('yt_discord_url') || '';
          }
          set({
            youtubeSettings: { 
              channelId: localChannel, 
              videoUrl: localVideo, 
              isLive: localLive,
              instagramUrl: localInstagram,
              youtubeUrl: localYoutube,
              discordUrl: localDiscord
            },
            youtubeTableExists: false,
          });
        }
      },
      saveYoutubeSettings: async (channelId, videoUrl, isLive, instagramUrl, youtubeUrl, discordUrl) => {
        try {
          const tableExists = get().youtubeTableExists;
          if (tableExists) {
            const { error } = await supabase
              .from('youtube_settings')
              .upsert({ 
                id: 1, 
                channel_id: channelId, 
                video_url: videoUrl, 
                is_live: isLive, 
                instagram_url: instagramUrl, 
                youtube_url: youtubeUrl, 
                discord_url: discordUrl,
                updated_at: new Date().toISOString() 
              });

            if (error) throw error;
          }

          // Sempre salva no localStorage também
          if (typeof window !== 'undefined') {
            localStorage.setItem('yt_channel_id', channelId);
            localStorage.setItem('yt_video_url', videoUrl);
            localStorage.setItem('yt_is_live', isLive ? 'true' : 'false');
            localStorage.setItem('yt_instagram_url', instagramUrl);
            localStorage.setItem('yt_youtube_url', youtubeUrl);
            localStorage.setItem('yt_discord_url', discordUrl);
          }

          set({
            youtubeSettings: { channelId, videoUrl, isLive, instagramUrl, youtubeUrl, discordUrl }
          });
          return true;
        } catch (err) {
          console.error('[YoutubeSettingsStore] saveYoutubeSettings error:', err);
          return false;
        }
      },

      loadAchievements: async () => {
        const user = get().user;
        if (!user) {
          if (typeof window !== 'undefined') {
            const local = localStorage.getItem('local_achievements');
            if (local) {
              try {
                set({ unlockedAchievements: JSON.parse(local), achievementsTableExists: false });
              } catch {
                set({ unlockedAchievements: [], achievementsTableExists: false });
              }
            } else {
              set({ unlockedAchievements: [], achievementsTableExists: false });
            }
          }
          return;
        }

        try {
          const { data, error } = await supabase
            .from('user_achievements')
            .select('*')
            .eq('user_id', user.id);

          if (error) throw error;

          set({
            unlockedAchievements: (data || []).map((d: any) => ({
              achievement_id: d.achievement_id,
              unlocked_at: d.unlocked_at
            })),
            achievementsTableExists: true
          });
        } catch (err: any) {
          console.warn('[AchievementsStore] Failed to fetch user_achievements, falling back to local:', err?.message || err);
          let localList: any[] = [];
          if (typeof window !== 'undefined') {
            const local = localStorage.getItem('local_achievements');
            if (local) {
              try {
                localList = JSON.parse(local);
              } catch {}
            }
          }
          set({ unlockedAchievements: localList, achievementsTableExists: false });
        }
      },

      unlockAchievement: async (achievementId: string) => {
        const list = get().unlockedAchievements;
        if (list.some(a => a.achievement_id === achievementId)) {
          return;
        }

        const nowStr = new Date().toISOString();
        const newAchievement = { achievement_id: achievementId, unlocked_at: nowStr };
        const updatedList = [...list, newAchievement];

        const definition = ACHIEVEMENTS.find(a => a.id === achievementId);
        if (definition) {
          set({
            unlockedAchievements: updatedList,
            justUnlocked: {
              id: definition.id,
              title: definition.title,
              icon: definition.icon
            }
          });
        } else {
          set({ unlockedAchievements: updatedList });
        }

        audio.playCoin();

        const user = get().user;
        const tableExists = get().achievementsTableExists;
        if (user && tableExists) {
          try {
            await supabase
              .from('user_achievements')
              .insert({
                user_id: user.id,
                achievement_id: achievementId,
                unlocked_at: nowStr
              });
          } catch (err) {
            console.error('[AchievementsStore] Error saving achievement to database:', err);
          }
        }

        if (typeof window !== 'undefined') {
          localStorage.setItem('local_achievements', JSON.stringify(updatedList));
        }
      },

      checkAchievements: async (triggerType, data) => {
        const state = get();
        const stats = state.userStats;
        
        const unlock = async (id: string) => {
          await get().unlockAchievement(id);
        };

        // ─── CATEGORIA: COMBATE ──────────────────────────────────────────────
        if (stats.totalCombatsWon >= 1) {
          await unlock('milestone_first_blood');
        }
        if (stats.totalCombatsWon >= 10) {
          await unlock('combat_veteran');
        }
        if (stats.totalCombatsWon >= 50) {
          await unlock('combat_gladiator');
        }
        if (stats.totalCombatsWon >= 100) {
          await unlock('combat_war_machine');
        }
        if (stats.totalMonstersDefeated >= 500) {
          await unlock('combat_terminator');
        }
        if (stats.consecutiveWinsNoDamage >= 5) {
          await unlock('combat_no_mercy');
        }

        // ─── CATEGORIA: SORTE ────────────────────────────────────────────────
        if (stats.totalLuckTestsPassed >= 1) {
          await unlock('luck_first_test');
        }
        if (stats.consecutiveLuckPasses >= 10) {
          await unlock('luck_favored_by_gods');
        }
        if (stats.totalLuckUses >= 50) {
          await unlock('luck_gambler');
        }

        // ─── CATEGORIA: SOBREVIVÊNCIA ────────────────────────────────────────
        if (stats.totalProvisionsConsumed >= 1) {
          await unlock('survival_first_meal');
        }
        if (stats.totalProvisionsConsumed >= 50) {
          await unlock('survival_banqueteer');
        }
        if (state.attributes.energy.current === 1) {
          await unlock('survival_near_death');
        }

        // ─── CATEGORIA: EXPLORAÇÃO ───────────────────────────────────────────
        if (state.activeSheetId) {
          await unlock('explore_first_step');
        }
        const totalVisitedSections = Object.values(stats.visitedSections || {}).reduce((acc, val) => acc + (val?.length || 0), 0);
        if (totalVisitedSections >= 100) {
          await unlock('explore_cartographer');
        }
        const uniqueBooksPlayed = Object.keys(stats.visitedSections || {}).length;
        if (uniqueBooksPlayed >= 5) {
          await unlock('explore_veteran_reader');
        }
        if (stats.completedBooks && stats.completedBooks.length >= 39) {
          await unlock('explore_grandmaster');
        }
        if (stats.suggestionsUsed) {
          await unlock('explore_curious');
        }

        // ─── CATEGORIA: PERSONAGEM ───────────────────────────────────────────
        if (stats.totalCharactersCreated >= 1) {
          await unlock('char_first_hero');
        }
        if (stats.totalCharactersCreated >= 25) {
          await unlock('char_living_legend');
        }
        
        const skill = state.attributes.skill;
        const luck = state.attributes.luck;
        const energy = state.attributes.energy;
        
        if (skill && skill.initial === 12) {
          await unlock('milestone_max_skill');
        }
        if (luck && luck.initial === 12) {
          await unlock('milestone_max_luck');
        }
        if (energy && energy.initial === 24) {
          await unlock('char_max_energy');
        }

        // ─── CATEGORIA: RECURSOS DO APP ──────────────────────────────────────
        if (state.musicEnabled) {
          await unlock('app_retro');
        }
        if (stats.musicTimeMs >= 3600000) {
          await unlock('app_chiptune_lover');
        }
        if (state.theme === 'night') {
          await unlock('app_dark_theme');
        }
        if (stats.sheetsExported >= 1) {
          await unlock('app_scribe');
        }
        if (stats.sheetsImported >= 1) {
          await unlock('app_collector');
        }

        // ─── CATEGORIA: DESAFIOS AVANÇADOS ───────────────────────────────────
        if (stats.totalDeaths >= 10) {
          await unlock('challenge_dead_again');
        }
        if (stats.totalDeaths >= 50) {
          await unlock('challenge_persistent');
        }

        if (triggerType === 'victory') {
          const bookName = state.gamebook;
          if (bookName) {
            const bookAchId = getAchievementIdForBook(bookName);
            if (bookAchId) {
              await unlock(bookAchId);
            }
          }

          if (!stats.hasUsedLuckThisBook) {
            await unlock('challenge_no_luck');
          }
          if (!stats.hasEatenProvisionsThisBook) {
            await unlock('challenge_heroic_fast');
          }
          if (state.inventory && state.inventory.length > 15) {
            await unlock('challenge_treasure_hunter');
          }
          if (!stats.hasFledThisBook) {
            await unlock('challenge_strategist');
          }
          if (state.attributes.luck.current === 1) {
            await unlock('luck_bold');
          }
          if (state.monsters && state.monsters.length === 0) {
            await unlock('survival_unbreakable');
          }

          if (stats.completedBooks && stats.completedBooks.length >= 5) {
            await unlock('hall_champion_allansia');
          }
          if (stats.completedBooks && stats.completedBooks.length >= 10) {
            await unlock('hall_legend_adventures');
          }
          
          if (state.attributes.energy.current === 1 && state.attributes.luck.current === 1) {
            await unlock('secret_razors_edge');
          }
        }

        if (triggerType === 'death') {
          await unlock('milestone_first_death');
          
          const isFirstSection = !state.attributes.currentSection || state.attributes.currentSection === '1' || state.attributes.currentSection === '0';
          if (isFirstSection) {
            await unlock('challenge_early_death');
          }
          
          if (stats.recentDeathsCount >= 3) {
            await unlock('secret_professional_loser');
          }
        }

        // ─── CONQUISTAS SECRETAS ─────────────────────────────────────────────
        if (skill && skill.initial === 12 && luck && luck.initial === 12 && energy && energy.initial === 24) {
          await unlock('secret_perfect_saga');
        }
        if (stats.loginDays && stats.loginDays.length >= 30) {
          await unlock('secret_guild_loyal');
        }
      },

      loadUserStats: async () => {
        const user = get().user;
        if (!user) {
          if (typeof window !== 'undefined') {
            const local = localStorage.getItem('local_user_stats');
            if (local) {
              try {
                set({ userStats: { ...defaultUserStats(), ...JSON.parse(local) }, statsTableExists: false });
              } catch {
                set({ userStats: defaultUserStats(), statsTableExists: false });
              }
            } else {
              set({ userStats: defaultUserStats(), statsTableExists: false });
            }
          }
          return;
        }

        try {
          const { data, error } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

          if (error) throw error;

          if (data && data.stats) {
            // Adiciona o dia de hoje no loginDays se for novo dia
            const stats = { ...defaultUserStats(), ...data.stats };
            const todayStr = new Date().toISOString().split('T')[0];
            const days = stats.loginDays || [];
            if (!days.includes(todayStr)) {
              stats.loginDays = [...days, todayStr];
            }
            set({
              userStats: stats,
              statsTableExists: true
            });
            // Auto salva a atualização de login
            await supabase.from('user_stats').update({ stats }).eq('user_id', user.id);
          } else {
            const initialStats = defaultUserStats();
            const todayStr = new Date().toISOString().split('T')[0];
            initialStats.loginDays = [todayStr];
            
            await supabase.from('user_stats').insert({
              user_id: user.id,
              stats: initialStats
            });

            set({
              userStats: initialStats,
              statsTableExists: true
            });
          }
        } catch (err: any) {
          console.warn('[StatsStore] Failed to fetch user_stats, falling back to local:', err?.message || err);
          let localStats = defaultUserStats();
          if (typeof window !== 'undefined') {
            const local = localStorage.getItem('local_user_stats');
            if (local) {
              try {
                localStats = { ...localStats, ...JSON.parse(local) };
              } catch {}
            }
          }
          const todayStr = new Date().toISOString().split('T')[0];
          const days = localStats.loginDays || [];
          if (!days.includes(todayStr)) {
            localStats.loginDays = [...days, todayStr];
            if (typeof window !== 'undefined') {
              localStorage.setItem('local_user_stats', JSON.stringify(localStats));
            }
          }
          set({ userStats: localStats, statsTableExists: false });
        }
      },

      saveUserStats: async () => {
        const stats = get().userStats;
        const user = get().user;
        const tableExists = get().statsTableExists;

        if (user && tableExists) {
          try {
            await supabase
              .from('user_stats')
              .upsert({
                user_id: user.id,
                stats,
                updated_at: new Date().toISOString()
              });
          } catch (err) {
            console.error('[StatsStore] Error saving user stats to Supabase:', err);
          }
        }

        if (typeof window !== 'undefined') {
          localStorage.setItem('local_user_stats', JSON.stringify(stats));
        }
      },

      incrementStat: async (key, amount = 1, extraData) => {
        set((state) => {
          const stats = { ...state.userStats };
          
          if (key === 'visitedSections') {
            if (extraData && extraData.book && extraData.section) {
              const bookSections = stats.visitedSections[extraData.book] || [];
              if (!bookSections.includes(extraData.section)) {
                stats.visitedSections = {
                  ...stats.visitedSections,
                  [extraData.book]: [...bookSections, extraData.section]
                };
              }
            }
          } else if (key === 'completedBooks') {
            if (extraData && typeof extraData === 'string') {
              const completed = stats.completedBooks || [];
              if (!completed.includes(extraData)) {
                stats.completedBooks = [...completed, extraData];
              }
            }
          } else if (key === 'loginDays') {
            if (extraData && typeof extraData === 'string') {
              const days = stats.loginDays || [];
              if (!days.includes(extraData)) {
                stats.loginDays = [...days, extraData];
              }
            }
          } else {
            const val = (stats as any)[key] || 0;
            (stats as any)[key] = val + amount;
          }

          return { userStats: stats };
        });

        await get().saveUserStats();
        await get().checkAchievements('stat');
      },

      registerLuckTest: (success) => {
        set((state) => {
          const stats = { ...state.userStats };
          stats.totalLuckUses = (stats.totalLuckUses || 0) + 1;
          stats.hasUsedLuckThisBook = true;
          
          if (success) {
            stats.totalLuckTestsPassed = (stats.totalLuckTestsPassed || 0) + 1;
            stats.consecutiveLuckPasses = (stats.consecutiveLuckPasses || 0) + 1;
          } else {
            stats.totalLuckTestsFailed = (stats.totalLuckTestsFailed || 0) + 1;
            stats.consecutiveLuckPasses = 0;
          }
          
          return { userStats: stats };
        });

        get().saveUserStats();
        get().checkAchievements('stat');
      },

      clearJustUnlocked: () => {
        set({ justUnlocked: null });
      },
    }),
    {
      name: 'adventure-sheet-storage',
      // Only persist theme and sound preferences locally
      partialize: (state) => ({
        theme: state.theme,
        soundEnabled: state.soundEnabled,
        musicEnabled: state.musicEnabled,
        musicVolume: state.musicVolume,
      }),
    }
  )
);
