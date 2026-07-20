import { supabase } from '@/lib/supabase';
import { NewsItem } from '@/store/useSheetStore';

export interface YoutubeSettingsData {
  channelId: string;
  videoUrl: string;
  isLive: boolean;
  youtubeUrl?: string;
}

export const adminService = {
  /**
   * Verifica se o usuário autenticado é administrador.
   */
  async checkAdminStatus(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('is_admin')
        .eq('id', userId)
        .maybeSingle();

      if (error || !data) return false;
      return !!data.is_admin;
    } catch {
      return false;
    }
  },

  /**
   * Carrega a lista de notícias.
   */
  async fetchNewsList(): Promise<{ data: NewsItem[] | null; tableExists: boolean }> {
    try {
      const { data, error } = await supabase
        .from('guild_news')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        if (error.code === '42P01') return { data: null, tableExists: false };
        throw error;
      }
      return { data: data as NewsItem[], tableExists: true };
    } catch (err: any) {
      console.error('[adminService] Erro ao carregar notícias:', err.message);
      return { data: null, tableExists: true };
    }
  },

  /**
   * Adiciona ou edita notícia.
   */
  async saveNewsItem(item: Partial<NewsItem>): Promise<{ data: NewsItem | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('guild_news')
        .upsert(item)
        .select()
        .single();

      if (error) throw error;
      return { data: data as NewsItem, error: null };
    } catch (err: any) {
      console.error('[adminService] Erro ao salvar notícia:', err.message);
      return { data: null, error: err };
    }
  },

  /**
   * Remove notícia por ID.
   */
  async deleteNewsItem(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('guild_news')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      console.error('[adminService] Erro ao excluir notícia:', err.message);
      return { error: err };
    }
  },

  /**
   * Carrega configurações da transmissão do YouTube.
   */
  async fetchYoutubeSettings(): Promise<{ data: YoutubeSettingsData | null; tableExists: boolean }> {
    try {
      const { data, error } = await supabase
        .from('youtube_settings')
        .select('*')
        .eq('id', 'default')
        .maybeSingle();

      if (error) {
        if (error.code === '42P01') return { data: null, tableExists: false };
        throw error;
      }

      if (!data) return { data: null, tableExists: true };

      return {
        data: {
          channelId: data.channel_id ?? '',
          videoUrl: data.video_url ?? '',
          isLive: data.is_live ?? false,
          youtubeUrl: data.youtube_url ?? '',
        },
        tableExists: true
      };
    } catch (err: any) {
      console.error('[adminService] Erro ao carregar YouTube settings:', err.message);
      return { data: null, tableExists: true };
    }
  },

  /**
   * Salva configurações do YouTube.
   */
  async saveYoutubeSettings(settings: YoutubeSettingsData): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('youtube_settings')
        .upsert({
          id: 'default',
          channel_id: settings.channelId,
          video_url: settings.videoUrl,
          is_live: settings.isLive,
          youtube_url: settings.youtubeUrl || '',
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      console.error('[adminService] Erro ao salvar YouTube settings:', err.message);
      return { error: err };
    }
  }
};
