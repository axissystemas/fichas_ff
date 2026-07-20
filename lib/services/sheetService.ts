import { supabase, DbSheet } from '@/lib/supabase';

export const sheetService = {
  /**
   * Carrega a lista de fichas do usuário autenticado no Supabase.
   */
  async fetchUserSheets(userId: string): Promise<{ data: DbSheet[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('adventure_sheets')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return { data: data as DbSheet[], error: null };
    } catch (err: any) {
      console.error('[sheetService] Erro ao carregar fichas:', err.message);
      return { data: null, error: err };
    }
  },

  /**
   * Salva ou atualiza uma ficha no Supabase.
   */
  async saveSheet(sheetData: Partial<DbSheet> & { id: string; user_id: string }): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('adventure_sheets')
        .upsert({
          ...sheetData,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      console.error('[sheetService] Erro ao salvar ficha:', err.message);
      return { error: err };
    }
  },

  /**
   * Exclui uma ficha pelo ID.
   */
  async deleteSheet(sheetId: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('adventure_sheets')
        .delete()
        .eq('id', sheetId);

      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      console.error('[sheetService] Erro ao excluir ficha:', err.message);
      return { error: err };
    }
  },

  /**
   * Renomeia uma ficha existente.
   */
  async renameSheet(sheetId: string, newTitle: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('adventure_sheets')
        .update({ title: newTitle, updated_at: new Date().toISOString() })
        .eq('id', sheetId);

      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      console.error('[sheetService] Erro ao renomear ficha:', err.message);
      return { error: err };
    }
  }
};
