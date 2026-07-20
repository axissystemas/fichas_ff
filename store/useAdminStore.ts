import { create } from 'zustand';
import { adminService, YoutubeSettingsData } from '@/lib/services/adminService';
import { NewsItem, DEFAULT_NEWS } from '@/store/useSheetStore';

interface AdminState {
  isAdmin: boolean;
  newsList: NewsItem[];
  newsTableExists: boolean;
  youtubeSettings: YoutubeSettingsData;
  youtubeTableExists: boolean;
  isLoadingAdminData: boolean;

  checkAdminStatus: (userId?: string) => Promise<boolean>;
  loadNewsList: () => Promise<void>;
  addNewsItem: (item: Omit<NewsItem, 'id'>) => Promise<void>;
  updateNewsItem: (id: string, item: Partial<NewsItem>) => Promise<void>;
  deleteNewsItem: (id: string) => Promise<void>;
  loadYoutubeSettings: () => Promise<void>;
  saveYoutubeSettings: (settings: YoutubeSettingsData) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  isAdmin: false,
  newsList: DEFAULT_NEWS,
  newsTableExists: true,
  youtubeSettings: { channelId: '', videoUrl: '', isLive: false, youtubeUrl: '' },
  youtubeTableExists: true,
  isLoadingAdminData: false,

  checkAdminStatus: async (userId?: string) => {
    if (!userId) {
      set({ isAdmin: false });
      return false;
    }
    const isAdmin = await adminService.checkAdminStatus(userId);
    set({ isAdmin });
    return isAdmin;
  },

  loadNewsList: async () => {
    const { data, tableExists } = await adminService.fetchNewsList();
    if (data && data.length > 0) {
      set({ newsList: data, newsTableExists: tableExists });
    } else {
      set({ newsTableExists: tableExists });
    }
  },

  addNewsItem: async (newItem) => {
    const id = `news-${Date.now()}`;
    const payload = { ...newItem, id };
    const { data } = await adminService.saveNewsItem(payload);
    const added = data || payload;
    set({ newsList: [added, ...get().newsList] });
  },

  updateNewsItem: async (id, updated) => {
    const current = get().newsList.find((n) => n.id === id);
    if (!current) return;
    const payload = { ...current, ...updated };
    await adminService.saveNewsItem(payload);
    set({
      newsList: get().newsList.map((n) => (n.id === id ? payload : n)),
    });
  },

  deleteNewsItem: async (id) => {
    await adminService.deleteNewsItem(id);
    set({ newsList: get().newsList.filter((n) => n.id !== id) });
  },

  loadYoutubeSettings: async () => {
    const { data, tableExists } = await adminService.fetchYoutubeSettings();
    if (data) {
      set({ youtubeSettings: data, youtubeTableExists: tableExists });
    } else {
      set({ youtubeTableExists: tableExists });
    }
  },

  saveYoutubeSettings: async (settings) => {
    await adminService.saveYoutubeSettings(settings);
    set({ youtubeSettings: settings });
  },
}));
