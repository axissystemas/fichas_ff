'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSheetStore } from '@/store/useSheetStore';
import { supabase } from '@/lib/supabase';
import {
  Sun, Moon, Loader2, LogOut, Search, PlusCircle, Trash2, Pencil, Check, X,
  Download, BookOpen, ShieldAlert, BarChart3, Database, KeyRound, Award, Copy, Bookmark,
  Coins, Apple, Swords, Shield, Flame, Clock, Calendar, Compass, Skull, ChevronRight, User, Youtube
} from 'lucide-react';
import {
  AttributeHistoryLineChart,
  MonsterPieChart,
  CompletionBarChart,
  ActivityHeatmap
} from '@/components/DashboardCharts';
import { GAMEBOOKS, BOOKS_WITH_SUGGESTIONS } from '@/lib/gamebooks';

export default function PainelAdmin() {
  const {
    theme,
    setTheme,
    user,
    setUser,
    sheetsList,
    loadSheetsList,
    createSheet,
    renameSheet,
    deleteSheet,
    clearLocalState,
    syncStatus,
    isAdmin,
    checkAdminStatus,
    newsList,
    newsTableExists,
    addNewsItem,
    updateNewsItem,
    deleteNewsItem,
    loadNewsList,
    youtubeSettings,
    youtubeTableExists,
    loadYoutubeSettings,
    saveYoutubeSettings,
    unlockedAchievements,
    achievementsTableExists,
    loadAchievements,
    statsTableExists,
    loadUserStats,
  } = useSheetStore();

  // Estados locais
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  // Estados locais para Gerenciamento de Novidades
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [newsCategory, setNewsCategory] = useState('Livros Jogos');
  const [newsTitleField, setNewsTitleField] = useState('');
  const [newsDescriptionField, setNewsDescriptionField] = useState('');
  const [newsDateField, setNewsDateField] = useState(new Date().toISOString().split('T')[0]);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsSaving, setNewsSaving] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Estados locais para Gerenciamento do YouTube/Live
  const [ytChannelId, setYtChannelId] = useState('');
  const [ytVideoUrl, setYtVideoUrl] = useState('');
  const [ytIsLive, setYtIsLive] = useState(false);
  const [ytInstagramUrl, setYtInstagramUrl] = useState('');
  const [ytYoutubeUrl, setYtYoutubeUrl] = useState('');
  const [ytDiscordUrl, setYtDiscordUrl] = useState('');
  const [ytSaving, setYtSaving] = useState(false);
  const [copiedYtSql, setCopiedYtSql] = useState(false);
  const [copiedAchievementsSql, setCopiedAchievementsSql] = useState(false);
  const [copiedStatsSql, setCopiedStatsSql] = useState(false);
  const [copiedRpcSql, setCopiedRpcSql] = useState(false);

  // Estados para gerenciamento de fichas
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newGamebook, setNewGamebook] = useState<string>(GAMEBOOKS[0]);
  const [newSuggestionsEnabled, setNewSuggestionsEnabled] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Aba ativa do Painel Admin
  const [activeAdminTab, setActiveAdminTab] = useState<'geral' | 'jogadores' | 'combate' | 'aventuras' | 'novidades' | 'online' | 'youtube' | 'conquistas'>('geral');

  // Usuários online em tempo real
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);

  // Filtro por livro-jogo global para as estatísticas
  const [selectedGamebookFilter, setSelectedGamebookFilter] = useState<string>('all');

  // Dados de telemetria carregados do Supabase
  const [profiles, setProfiles] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);

  // Ficha selecionada para exibição de evolução de atributos
  const [selectedSheetDetails, setSelectedSheetDetails] = useState<any | null>(null);
  const [selectedSheetLogs, setSelectedSheetLogs] = useState<any[]>([]);
  const [loadingSheetLogs, setLoadingSheetLogs] = useState(false);

  // Função para carregar as métricas do banco de dados
  const loadStatsData = async () => {
    setStatsLoading(true);
    try {
      // 1. Carrega Perfis
      const { data: userProfiles, error: profileErr } = await supabase
        .from('user_profiles')
        .select('*')
        .order('last_login', { ascending: false });

      if (profileErr) console.warn('[Admin] Error user_profiles:', profileErr);
      else setProfiles(userProfiles || []);

      // 2. Carrega Logs de Telemetria
      const { data: telemetryLogs, error: logErr } = await supabase
        .from('adventure_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (logErr) console.warn('[Admin] Error adventure_logs:', logErr);
      else setLogs(telemetryLogs || []);
    } catch (err) {
      console.error('[Admin] Stats load error:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  // Monitora a sessão e valida administrador
  useEffect(() => {
    let isMounted = true;

    const runVerification = async () => {
      try {
        setCheckingAdmin(true);
        const { data: { session } } = await supabase.auth.getSession();
        const activeUser = session?.user ?? null;

        if (activeUser) {
          setUser({
            id: activeUser.id,
            email: activeUser.email,
            provider: activeUser.app_metadata.provider,
            user_metadata: activeUser.user_metadata,
          });

          const hasAccess = await checkAdminStatus();
          if (isMounted) setCheckingAdmin(false);

          if (hasAccess && isMounted) {
            // Carrega os dados de estatística e telemetria em segundo plano sem travar a interface
            Promise.allSettled([
              loadSheetsList(true),
              loadStatsData(),
              loadNewsList(),
              loadYoutubeSettings(),
              loadAchievements(),
              loadUserStats(),
            ]);
          }
        } else {
          clearLocalState();
          if (isMounted) setCheckingAdmin(false);
        }
      } catch (err) {
        console.error('[Painel Admin] Erro na verificação de acesso:', err);
        if (isMounted) setCheckingAdmin(false);
      }
    };

    runVerification();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'INITIAL_SESSION') return; // Evita execução duplicada na inicialização
      
      const activeUser = session?.user ?? null;
      if (activeUser) {
        setUser({
          id: activeUser.id,
          email: activeUser.email,
          provider: activeUser.app_metadata.provider,
          user_metadata: activeUser.user_metadata,
        });
        const hasAccess = await checkAdminStatus();
        if (hasAccess) {
          Promise.allSettled([
            loadSheetsList(true),
            loadStatsData(),
            loadNewsList(),
            loadYoutubeSettings(),
            loadAchievements(),
            loadUserStats(),
          ]);
        }
      } else {
        clearLocalState();
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rastreamento de Presença em Tempo Real (Supabase Presence) para o painel admin
  useEffect(() => {
    if (!user || !isAdmin) return;

    const channel = supabase.channel('online-players');

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const usersList: any[] = [];
        
        Object.values(state).forEach((presenceArray: any) => {
          if (presenceArray && presenceArray.length > 0) {
            const sortedSessions = [...presenceArray].sort(
              (a: any, b: any) => new Date(b.online_at).getTime() - new Date(a.online_at).getTime()
            );
            usersList.push(sortedSessions[0]);
          }
        });
        
        setOnlineUsers(usersList);
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user, isAdmin]);

  // Sincroniza estados locais do YouTube com a store quando carregada
  useEffect(() => {
    if (youtubeSettings) {
      setYtChannelId(youtubeSettings.channelId || '');
      setYtVideoUrl(youtubeSettings.videoUrl || '');
      setYtIsLive(youtubeSettings.isLive || false);
      setYtInstagramUrl(youtubeSettings.instagramUrl || '');
      setYtYoutubeUrl(youtubeSettings.youtubeUrl || '');
      setYtDiscordUrl(youtubeSettings.discordUrl || '');
    }
  }, [youtubeSettings]);

  const youtubeSqlCommand = `CREATE TABLE public.youtube_settings (
  id INT PRIMARY KEY DEFAULT 1,
  channel_id TEXT NOT NULL DEFAULT 'UCQJ2X-kM3wX2HnC4a8e2r7g',
  video_url TEXT DEFAULT '',
  is_live BOOLEAN NOT NULL DEFAULT false,
  instagram_url TEXT DEFAULT '',
  youtube_url TEXT DEFAULT '',
  discord_url TEXT DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE public.youtube_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura pública" ON public.youtube_settings
  FOR SELECT TO public USING (true);

CREATE POLICY "Permitir escrita apenas para administradores" ON public.youtube_settings
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid() AND admin_users.is_admin = true
    )
  );

-- Insere o registro inicial padrão
INSERT INTO public.youtube_settings (id, channel_id, video_url, is_live, instagram_url, youtube_url, discord_url)
VALUES (1, 'UCQJ2X-kM3wX2HnC4a8e2r7g', '', false, '', '', '')
ON CONFLICT (id) DO NOTHING;

-- Caso sua tabela já exista no banco, execute este script para adicionar as novas colunas:
-- ALTER TABLE public.youtube_settings 
-- ADD COLUMN IF NOT EXISTS instagram_url TEXT DEFAULT '',
-- ADD COLUMN IF NOT EXISTS youtube_url TEXT DEFAULT '',
-- ADD COLUMN IF NOT EXISTS discord_url TEXT DEFAULT '';`;

  const copyYtSqlToClipboard = () => {
    navigator.clipboard.writeText(youtubeSqlCommand);
    setCopiedYtSql(true);
    setTimeout(() => setCopiedYtSql(false), 2000);
  };

  const achievementsSqlCommand = `CREATE TABLE public.user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura pública das conquistas" ON public.user_achievements
  FOR SELECT USING (true);

CREATE POLICY "Permitir inserção de conquistas pelo próprio usuário" ON public.user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);`;

  const copyAchievementsSqlToClipboard = () => {
    navigator.clipboard.writeText(achievementsSqlCommand);
    setCopiedAchievementsSql(true);
    setTimeout(() => setCopiedAchievementsSql(false), 2000);
  };

  const statsSqlCommand = `CREATE TABLE public.user_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  stats JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura pública das estatísticas" ON public.user_stats
  FOR SELECT USING (true);

CREATE POLICY "Permitir upsert de estatísticas pelo próprio usuário" ON public.user_stats
  FOR ALL WITH CHECK (auth.uid() = user_id);`;

  const copyStatsSqlToClipboard = () => {
    navigator.clipboard.writeText(statsSqlCommand);
    setCopiedStatsSql(true);
    setTimeout(() => setCopiedStatsSql(false), 2000);
  };

  const rpcSqlCommand = `CREATE OR REPLACE FUNCTION public.get_recent_achievements()
RETURNS TABLE (
  display_name TEXT,
  achievement_id TEXT,
  unlocked_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(p.display_name, 'Aventureiro')::TEXT AS display_name,
    a.achievement_id,
    a.unlocked_at
  FROM public.user_achievements a
  LEFT JOIN public.user_profiles p ON a.user_id = p.id
  ORDER BY a.unlocked_at DESC
  LIMIT 5;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_recent_achievements() TO anon;
GRANT EXECUTE ON FUNCTION public.get_recent_achievements() TO authenticated;`;

  const copyRpcSqlToClipboard = () => {
    navigator.clipboard.writeText(rpcSqlCommand);
    setCopiedRpcSql(true);
    setTimeout(() => setCopiedRpcSql(false), 2000);
  };

  const handleSaveYoutubeSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setYtSaving(true);
    const success = await saveYoutubeSettings(
      ytChannelId.trim(), 
      ytVideoUrl.trim(), 
      ytIsLive,
      ytInstagramUrl.trim(),
      ytYoutubeUrl.trim(),
      ytDiscordUrl.trim()
    );
    setYtSaving(false);
    if (success) {
      alert('Configurações do YouTube salvas com sucesso!');
    } else {
      alert('Erro ao salvar configurações do YouTube. Verifique as permissões da tabela.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setAuthLoading(true);
    setLoginError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          provider: data.user.app_metadata.provider,
          user_metadata: data.user.user_metadata,
        });
        
        const hasAccess = await checkAdminStatus();
        if (hasAccess) {
          Promise.allSettled([
            loadSheetsList(true),
            loadStatsData(),
            loadNewsList(),
            loadYoutubeSettings(),
            loadAchievements(),
            loadUserStats(),
          ]);
        }
      }
    } catch (err: any) {
      console.error('[Painel] Login error:', err);
      setLoginError(err?.message || 'Erro ao realizar login. Verifique suas credenciais.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('login_redirect', '/painel');
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/painel' },
    });
    if (error) {
      alert('Erro ao conectar com Google: ' + error.message);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('login_redirect');
      }
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    setAuthLoading(true);
    await supabase.auth.signOut();
    clearLocalState();
    setSelectedSheetDetails(null);
    setProfiles([]);
    setLogs([]);
    setAuthLoading(false);
  };

  const handleCreate = async () => {
    const title = newTitle.trim() || 'Nova Ficha Admin';
    await createSheet(title, newGamebook, newSuggestionsEnabled);
    setNewTitle('');
    setNewGamebook(GAMEBOOKS[0]);
    setNewSuggestionsEnabled(true);
    setCreating(false);
  };

  const handleRename = async (id: string) => {
    if (editTitle.trim()) {
      await renameSheet(id, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle('');
  };

  const handleDelete = async (id: string) => {
    await deleteSheet(id);
    setConfirmDeleteId(null);
    if (selectedSheetDetails?.id === id) {
      setSelectedSheetDetails(null);
    }
  };

  const copyUidToClipboard = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sqlCommand = `CREATE TABLE public.guild_news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.guild_news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura pública" ON public.guild_news
  FOR SELECT TO public USING (true);

CREATE POLICY "Permitir escrita apenas para administradores" ON public.guild_news
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid() AND admin_users.is_admin = true
    )
  );`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlCommand);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitleField.trim() || !newsDescriptionField.trim() || !newsDateField) return;

    setNewsSaving(true);
    const itemData = {
      category: newsCategory,
      title: newsTitleField.trim(),
      description: newsDescriptionField.trim(),
      date: newsDateField
    };

    let success = false;
    if (editingNewsId) {
      success = await updateNewsItem(editingNewsId, itemData);
    } else {
      success = await addNewsItem(itemData);
    }

    setNewsSaving(false);
    if (success) {
      setShowNewsForm(false);
      setNewsTitleField('');
      setNewsDescriptionField('');
      setNewsDateField(new Date().toISOString().split('T')[0]);
      setNewsCategory('Livros Jogos');
      setEditingNewsId(null);
    } else {
      alert('Erro ao salvar notícia. Verifique se a tabela guild_news foi criada e tem as permissões corretas.');
    }
  };

  const handleEditNews = (item: any) => {
    setEditingNewsId(item.id);
    setNewsCategory(item.category);
    setNewsTitleField(item.title);
    setNewsDescriptionField(item.description);
    // Tratar datas completas com timestamp do postgres
    const formattedDate = item.date ? item.date.split('T')[0] : '';
    setNewsDateField(formattedDate);
    setShowNewsForm(true);
  };

  const handleDeleteNews = async (id: string) => {
    if (window.confirm('Deseja realmente excluir esta notícia?')) {
      const success = await deleteNewsItem(id);
      if (!success) {
        alert('Erro ao excluir notícia.');
      }
    }
  };

  // Exportar ficha JSON
  const handleExportSheet = async (sheetId: string, sheetTitle: string) => {
    try {
      const { data, error } = await supabase
        .from('adventure_sheets')
        .select('*')
        .eq('id', sheetId)
        .single();
      
      if (error) throw error;

      if (data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ficha-${sheetTitle.toLowerCase().replace(/\s+/g, '-')}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      alert('Erro ao exportar ficha.');
      console.error(err);
    }
  };

  // Seleciona uma ficha para carregar o histórico de parágrafos
  const handleSelectSheetDetails = async (sheet: any) => {
    setSelectedSheetDetails(sheet);
    setLoadingSheetLogs(true);
    try {
      const { data, error } = await supabase
        .from('adventure_logs')
        .select('*')
        .eq('sheet_id', sheet.id)
        .order('created_at', { ascending: true }); // ordem cronológica para gráfico de linha

      if (error) throw error;
      setSelectedSheetLogs(data || []);
    } catch (err) {
      console.error('[Admin] Error sheet logs:', err);
      setSelectedSheetLogs([]);
    } finally {
      setLoadingSheetLogs(false);
    }
  };

  // Temas
  const isPapyrus = theme === 'papyrus';

  // Filtro de buscas e filtro por Livro-Jogo (Em Memória)
  const sheetMap = useMemo(() => new Map(sheetsList.map(s => [s.id, s])), [sheetsList]);

  // Lista de fichas filtrada pelo livro selecionado + busca (usada no grid e listas)
  const filteredSheets = useMemo(() => {
    let result = sheetsList;
    if (selectedGamebookFilter !== 'all') {
      result = result.filter(s => s.gamebook === selectedGamebookFilter);
    }
    if (searchQuery.trim() !== '') {
      result = result.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return result;
  }, [sheetsList, selectedGamebookFilter, searchQuery]);

  // Fichas usadas para os cálculos de estatísticas do painel
  const statsSheets = useMemo(() => {
    if (selectedGamebookFilter === 'all') return sheetsList;
    return sheetsList.filter(s => s.gamebook === selectedGamebookFilter);
  }, [sheetsList, selectedGamebookFilter]);

  // Logs usados para os cálculos de estatísticas do painel (filtrados por livro do sheet correspondente)
  const statsLogs = useMemo(() => {
    if (selectedGamebookFilter === 'all') return logs;
    return logs.filter(log => {
      const sheet = sheetMap.get(log.sheet_id);
      return sheet?.gamebook === selectedGamebookFilter;
    });
  }, [logs, selectedGamebookFilter, sheetMap]);

  // ─── Métricas Agregadas e Dados para os Gráficos ─────────────────────────────
  const totalSheets = statsSheets.length;

  // Filtra as fichas iniciadas (que já tiveram os atributos rolados) para não distorcer as médias
  const initializedSheets = statsSheets.filter(
    s => !((s.attributes?.skill?.initial ?? 0) === 0 && (s.attributes?.energy?.initial ?? 0) === 0 && (s.attributes?.luck?.initial ?? 0) === 0)
  );
  const totalInitializedSheets = initializedSheets.length;

  // Médias Atuais
  const avgSkill = totalInitializedSheets > 0 
    ? Math.round((initializedSheets.reduce((acc, s) => acc + (s.attributes?.skill?.current ?? 0), 0) / totalInitializedSheets) * 10) / 10
    : 0;
  const avgEnergy = totalInitializedSheets > 0 
    ? Math.round((initializedSheets.reduce((acc, s) => acc + (s.attributes?.energy?.current ?? 0), 0) / totalInitializedSheets) * 10) / 10
    : 0;
  const avgLuck = totalInitializedSheets > 0 
    ? Math.round((initializedSheets.reduce((acc, s) => acc + (s.attributes?.luck?.current ?? 0), 0) / totalInitializedSheets) * 10) / 10
    : 0;

  // Médias Iniciais
  const avgSkillInitial = totalInitializedSheets > 0 
    ? Math.round((initializedSheets.reduce((acc, s) => acc + (s.attributes?.skill?.initial ?? 0), 0) / totalInitializedSheets) * 10) / 10
    : 0;
  const avgEnergyInitial = totalInitializedSheets > 0 
    ? Math.round((initializedSheets.reduce((acc, s) => acc + (s.attributes?.energy?.initial ?? 0), 0) / totalInitializedSheets) * 10) / 10
    : 0;
  const avgLuckInitial = totalInitializedSheets > 0 
    ? Math.round((initializedSheets.reduce((acc, s) => acc + (s.attributes?.luck?.initial ?? 0), 0) / totalInitializedSheets) * 10) / 10
    : 0;

  // Taxa de Sucesso (Win Rate)
  const victoryCount = statsSheets.filter(s => s.status === 'victory').length;
  const defeatCount = statsSheets.filter(s => s.status === 'defeat').length;
  const totalFinished = victoryCount + defeatCount;
  const winRate = totalFinished > 0 ? Math.round((victoryCount / totalFinished) * 100) : 0;

  const totalGold = statsSheets.reduce((acc, s) => acc + (s.gold ?? 0), 0);
  const totalProvisions = statsSheets.reduce((acc, s) => acc + (s.provisions ?? 0), 0);
  const totalMonstersDefeated = statsSheets.reduce(
    (acc, s) => acc + (s.monsters?.filter(m => m.status === 'defeated').length ?? 0),
    0
  );
  const totalItemsEquipped = statsSheets.reduce(
    (acc, s) => acc + (s.inventory?.filter(i => i.equipped).length ?? 0),
    0
  );

  // 1. Monstros derrotados (Pie Chart) - Baseado nos logs filtrados
  const monsterDefeatedCounts: Record<string, number> = {};
  statsLogs.forEach(log => {
    if (log.event_type === 'combat' && log.event_data?.monster) {
      const name = log.event_data.monster;
      monsterDefeatedCounts[name] = (monsterDefeatedCounts[name] || 0) + 1;
    }
  });
  const monsterPieData = Object.entries(monsterDefeatedCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // 2. Parágrafos mais visitados agrupados por livro
  const sectionVisits: Record<string, { count: number; gamebook: string }> = {};
  statsLogs.forEach(log => {
    if (log.event_type === 'section_visit' && log.event_data?.section) {
      const sec = String(log.event_data.section);
      const sheet = sheetMap.get(log.sheet_id);
      const gamebook = sheet?.gamebook || 'Desconhecido';
      const key = `${sec}::${gamebook}`;
      
      if (!sectionVisits[key]) {
        sectionVisits[key] = { count: 0, gamebook };
      }
      sectionVisits[key].count += 1;
    }
  });
  const topSections = Object.entries(sectionVisits)
    .map(([key, data]) => {
      const [section] = key.split('::');
      return { section, count: data.count, gamebook: data.gamebook };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // 3. Parágrafos Mais Mortais (Deadliest Sections) com Fallback Cronológico
  const deathSections: Record<string, { count: number; gamebook: string }> = {};
  statsLogs.forEach(log => {
    if (log.event_type === 'death') {
      const sheet = sheetMap.get(log.sheet_id);
      const gamebook = sheet?.gamebook || 'Desconhecido';
      
      let section = log.event_data?.section;
      if (!section) {
        // Fallback: busca retroativa do último section_visit deste sheet antes da morte
        const sheetLogs = logs.filter(l => l.sheet_id === log.sheet_id);
        const visitLogsBeforeDeath = sheetLogs
          .filter(l => l.event_type === 'section_visit' && new Date(l.created_at) <= new Date(log.created_at))
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        section = visitLogsBeforeDeath[0]?.event_data?.section || 'Início';
      }
      
      const sec = String(section);
      const key = `${sec}::${gamebook}`;
      if (!deathSections[key]) {
        deathSections[key] = { count: 0, gamebook };
      }
      deathSections[key].count += 1;
    }
  });
  const topDeadlySections = Object.entries(deathSections)
    .map(([key, data]) => {
      const [section] = key.split('::');
      return { section, count: data.count, gamebook: data.gamebook };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // 4. Mortes por tipo / Causa
  let deathsCombat = 0;
  let deathsTrap = 0;
  const killerMonsters: Record<string, number> = {};
  statsLogs.forEach(log => {
    if (log.event_type === 'death') {
      if (log.event_data?.cause === 'combat') {
        deathsCombat++;
        if (log.event_data.monster) {
          killerMonsters[log.event_data.monster] = (killerMonsters[log.event_data.monster] || 0) + 1;
        }
      } else {
        deathsTrap++;
      }
    }
  });
  const mostDeadlyMonster = Object.entries(killerMonsters)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Nenhum';

  // 5. Atividade para o Heatmap (últimos 28 dias)
  const activityData: { date: string; count: number }[] = [];
  const todayDate = new Date();
  for (let i = 27; i >= 0; i--) {
    const d = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() - i);
    const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    const count = statsLogs.filter(log => {
      const logDate = new Date(log.created_at);
      return logDate.getDate() === d.getDate() &&
             logDate.getMonth() === d.getMonth() &&
             logDate.getFullYear() === d.getFullYear();
    }).length;
    activityData.push({ date: dateStr, count });
  }

  // 6. Conclusões por jogador (Bar Chart)
  const userCompletionMap: Record<string, { name: string; iniciadas: number; concluidas: number }> = {};
  statsSheets.forEach(sheet => {
    const userId = sheet.user_id;
    if (!userId) return;
    const profile = profiles.find(p => p.id === userId);
    const userName = profile?.display_name || profile?.email || 'Jogador Anônimo';
    
    if (!userCompletionMap[userId]) {
      userCompletionMap[userId] = { name: userName, iniciadas: 0, concluidas: 0 };
    }
    userCompletionMap[userId].iniciadas++;
    if (sheet.status === 'victory' || sheet.status === 'defeat') {
      userCompletionMap[userId].concluidas++;
    }
  });
  const completionBarData = Object.values(userCompletionMap).slice(0, 5);

  // 7. Ranking de Ouro
  const goldRanking = [...statsSheets]
    .sort((a, b) => (b.gold || 0) - (a.gold || 0))
    .slice(0, 5)
    .map(s => {
      const p = s.user_id ? profiles.find(prof => prof.id === s.user_id) : null;
      return {
        name: p?.display_name || p?.email || 'Jogador Anônimo',
        sheetTitle: s.title,
        value: s.gold || 0
      };
    });

  // 8. Caçadores globais (monstros derrotados)
  const hunterRankingMap: Record<string, { name: string; value: number }> = {};
  statsLogs.forEach(log => {
    if (log.event_type === 'combat') {
      const userId = log.user_id;
      const p = profiles.find(prof => prof.id === userId);
      const name = p?.display_name || p?.email || 'Jogador Anônimo';
      if (!hunterRankingMap[userId]) {
        hunterRankingMap[userId] = { name, value: 0 };
      }
      hunterRankingMap[userId].value++;
    }
  });
  const hunterRanking = Object.values(hunterRankingMap)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // 9. Popularidade dos Livros-Jogo (Quantidade de fichas criadas por livro - Sempre Global)
  const gamebookPopularityMap: Record<string, number> = {};
  sheetsList.forEach(sheet => {
    const bookName = sheet.gamebook || 'O Feiticeiro da Montanha de Fogo';
    gamebookPopularityMap[bookName] = (gamebookPopularityMap[bookName] || 0) + 1;
  });
  const gamebookPopularity = Object.entries(gamebookPopularityMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // 9. Histórico simulado de atributos para a ficha selecionada
  const selectedSheetAttributeHistory = selectedSheetLogs.map((l, idx) => {
    const initialSkill = selectedSheetDetails?.attributes?.skill?.initial || 10;
    const initialEnergy = selectedSheetDetails?.attributes?.energy?.initial || 14;
    const initialLuck = selectedSheetDetails?.attributes?.luck?.initial || 8;
    
    let skill = initialSkill;
    let energy = initialEnergy;
    let luck = initialLuck;

    if (l.event_type === 'combat') {
      energy = Math.max(2, initialEnergy - 3 - (idx % 3));
    } else if (l.event_type === 'item_use') {
      energy = Math.min(initialEnergy, energy + 4);
    } else if (l.event_type === 'death') {
      energy = 0;
    }

    const label = l.event_type === 'section_visit' ? `Parágrafo ${l.event_data?.section}` : l.event_type === 'combat' ? 'Combate' : l.event_type;
    return { name: label, skill, energy, luck };
  });

  // Condicionais de exibição
  const showLoading = checkingAdmin;
  const showLogin = !checkingAdmin && !user;
  const showAccessDenied = !checkingAdmin && !!user && !isAdmin;
  const showAdminDashboard = !checkingAdmin && !!user && !!isAdmin;

  return (
    <main
      className={`min-h-screen py-6 px-4 md:py-12 md:px-8 transition-colors duration-300 font-serif ${
        isPapyrus ? 'theme-papyrus' : 'theme-night'
      }`}
    >
      <div
        className={`max-w-[1024px] w-full p-4 sm:p-8 shadow-2xl border mx-auto transition-colors duration-300 ${
          isPapyrus ? 'theme-papyrus-card' : 'theme-night-card'
        }`}
      >
        {/* Cabeçalho */}
        <header
          className={`flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b-2 ${
            isPapyrus ? 'border-[#5C4033] text-[#2D1D16]' : 'border-[#4a5568] text-[#cbd5e0]'
          }`}
        >
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-bold uppercase tracking-widest flex items-center justify-center sm:justify-start gap-2">
              <Database className={isPapyrus ? 'text-[#C5A059]' : 'text-cyan-400'} size={28} />
              Central de Campanha
            </h1>
            <p className={`text-xs font-sans tracking-wide mt-1 ${isPapyrus ? 'text-[#5C4033]/70' : 'text-slate-400'}`}>
              Painel administrativo para controle, telemetria avançada e estatísticas de uso dos jogadores.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(isPapyrus ? 'night' : 'papyrus')}
              className="p-1.5 sm:p-2 border border-current hover:bg-[#3D2B1F]/10 rounded cursor-pointer transition"
              aria-label="Alternar tema"
            >
              {isPapyrus ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {(showAdminDashboard || showAccessDenied) && (
              <button
                onClick={handleLogout}
                disabled={authLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition text-xs uppercase font-bold tracking-wider cursor-pointer"
              >
                {authLoading ? <Loader2 size={12} className="animate-spin" /> : <LogOut size={12} />}
                Sair
              </button>
            )}
          </div>
        </header>

        {/* ── Tela: Carregando Verificação ── */}
        {showLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 opacity-60 font-sans">
            <Loader2 className="animate-spin text-current" size={32} />
            <span className="text-sm uppercase tracking-widest">Validando acesso...</span>
          </div>
        )}

        {/* ── Tela: Login (Email/Senha ou Google) ── */}
        {showLogin && (
          <div className="flex flex-col items-center justify-center py-6 px-4 text-center animate-fade-in">
            {isPapyrus ? (
              <div className="max-w-[440px] w-full flex flex-col items-stretch gap-5 p-6 sm:p-10 border-2 border-[#C5A059] bg-[#EAD8B8]/30 shadow-inner rounded-sm">
                <div className="flex items-center justify-center text-[#5C4033] mb-1">
                  <KeyRound size={48} strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-bold uppercase tracking-widest text-[#2D1D16]">Painel Administrativo</h2>
                <div className="w-20 h-0.5 bg-[#C5A059] mx-auto"></div>

                {loginError && (
                  <p className="text-xs font-sans text-red-800 bg-red-800/10 border border-red-800 p-2.5 rounded-sm">
                    {loginError}
                  </p>
                )}

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-xs uppercase font-bold tracking-wider text-[#5C4033]">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border border-[#5C4033] bg-[#EAD8B8]/60 text-[#2D1D16] focus:outline-none focus:ring-2 focus:ring-[#C5A059] px-3 py-2 text-sm font-sans"
                      placeholder="admin@exemplo.com"
                    />
                  </div>

                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-xs uppercase font-bold tracking-wider text-[#5C4033]">Senha</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border border-[#5C4033] bg-[#EAD8B8]/60 text-[#2D1D16] focus:outline-none focus:ring-2 focus:ring-[#C5A059] px-3 py-2 text-sm font-sans"
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="flex items-center justify-center gap-3 w-full px-6 py-2.5 border-2 border-[#5C4033] text-[#2D1D16] bg-[#EAD8B8] hover:bg-[#2D1D16] hover:text-[#EAD8B8] disabled:opacity-50 transition-all duration-300 uppercase text-xs font-bold tracking-widest shadow-md cursor-pointer"
                  >
                    {authLoading ? <Loader2 size={14} className="animate-spin" /> : 'Entrar com Email'}
                  </button>
                </form>

                <div className="flex items-center gap-2 my-1">
                  <div className="flex-1 h-[1px] bg-[#5C4033]/30"></div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#5C4033]/60 font-sans">ou conecte via</span>
                  <div className="flex-1 h-[1px] bg-[#5C4033]/30"></div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={authLoading}
                  className="flex items-center justify-center gap-2.5 w-full px-6 py-2.5 border border-[#5C4033] text-[#2D1D16] bg-[#EAD8B8]/30 hover:bg-[#5C4033]/15 transition uppercase text-xs font-bold font-sans tracking-wider cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Conectar conta Google
                </button>

                <a href="/" className="text-xs font-sans tracking-wide text-[#5C4033]/80 hover:underline mt-2">
                  Voltar para tela de jogo
                </a>
              </div>
            ) : (
              <div className="max-w-[440px] w-full flex flex-col items-stretch gap-5 p-6 sm:p-10 border border-[#4a5568]/50 bg-slate-900/60 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.05)] rounded-xl">
                <div className="w-14 h-14 border border-cyan-500/40 rounded-full flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] mb-1 mx-auto">
                  <KeyRound size={28} strokeWidth={1.5} />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold uppercase tracking-widest bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Admin Portal
                  </h2>
                  <p className="text-xs uppercase tracking-wider text-cyan-400/80 mt-1 font-mono font-bold">
                    Database Controller Login
                  </p>
                </div>
                <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto"></div>

                {loginError && (
                  <p className="text-xs font-mono text-red-400 bg-red-950/20 border border-red-500/30 p-2.5 rounded-lg">
                    {loginError}
                  </p>
                )}

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-xs uppercase font-mono tracking-wider text-slate-400">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border border-[#4a5568] bg-slate-950 text-[#cbd5e0] focus:outline-none focus:ring-2 focus:ring-cyan-500/50 px-3 py-2 text-sm font-sans rounded-lg"
                      placeholder="admin@exemplo.com"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-xs uppercase font-mono tracking-wider text-slate-400">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border border-[#4a5568] bg-slate-950 text-[#cbd5e0] focus:outline-none focus:ring-2 focus:ring-cyan-500/50 px-3 py-2 text-sm font-sans rounded-lg"
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="flex items-center justify-center gap-3 w-full px-6 py-2.5 border border-cyan-500/50 text-[#cbd5e0] bg-slate-950 hover:bg-cyan-500/10 hover:border-cyan-400 disabled:opacity-50 transition-all duration-300 uppercase text-xs font-mono font-bold tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.05)] cursor-pointer rounded-lg"
                  >
                    {authLoading ? <Loader2 size={14} className="animate-spin" /> : 'Log In with Email'}
                  </button>
                </form>

                <div className="flex items-center gap-2 my-1">
                  <div className="flex-1 h-[1px] bg-slate-800"></div>
                  <span className="text-[10px] uppercase font-mono text-slate-500">or connect via</span>
                  <div className="flex-1 h-[1px] bg-slate-800"></div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={authLoading}
                  className="flex items-center justify-center gap-2.5 w-full px-6 py-2.5 border border-slate-700 text-[#cbd5e0] bg-slate-950 hover:bg-slate-800 transition uppercase text-xs font-bold font-mono tracking-wider cursor-pointer rounded-lg"
                >
                  <svg className="w-3.5 h-3.5 text-cyan-400" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Connect with Google
                </button>

                <a href="/" className="text-xs font-mono tracking-wide text-slate-500 hover:text-slate-300 hover:underline mt-2">
                  Back to Player Portal
                </a>
              </div>
            )}
          </div>
        )}

        {/* ── Tela: Acesso Negado (Não cadastrado na tabela de admins) ── */}
        {showAccessDenied && (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center animate-fade-in font-sans">
            <div className={`max-w-[480px] w-full flex flex-col items-stretch gap-6 p-6 sm:p-10 border ${
              isPapyrus 
                ? 'border-2 border-red-700 bg-[#EAD8B8]/40 text-[#2D1D16]' 
                : 'border-red-500/40 bg-slate-900/60 backdrop-blur-md shadow-[0_0_30px_rgba(239,68,68,0.1)] rounded-xl text-slate-300'
            }`}>
              <div className="flex flex-col items-center gap-2">
                <ShieldAlert className="text-red-500" size={48} />
                <h2 className="text-2xl font-bold uppercase tracking-widest">Acesso Recusado</h2>
                <div className="w-16 h-[1px] bg-red-500/50 mt-1"></div>
              </div>

              <p className="text-sm leading-relaxed opacity-90">
                Seu usuário não possui permissão para acessar o painel de gerenciamento. Ele precisa ser explicitamente ativado na tabela <code className="px-1.5 py-0.5 bg-red-500/10 rounded font-mono text-xs">admin_users</code> do seu banco de dados.
              </p>

              <div className={`p-4 border rounded-lg text-left space-y-2 ${
                isPapyrus 
                  ? 'border-[#5C4033]/40 bg-[#EAD8B8]/70 text-[#2D1D16]' 
                  : 'border-slate-800 bg-slate-950 text-slate-300'
              }`}>
                <p className="text-[10px] uppercase font-bold tracking-wider opacity-60">Seu código UID para copiar:</p>
                <div className="flex items-center justify-between gap-2 bg-black/5 dark:bg-black/20 p-2 rounded border border-current/10">
                  <span className="font-mono text-xs select-all break-all">{user?.id}</span>
                  <button
                    onClick={copyUidToClipboard}
                    className={`p-1.5 rounded hover:bg-current/10 border border-current/10 transition shrink-0 cursor-pointer ${
                      copied ? 'text-green-500' : ''
                    }`}
                    title="Copiar UID"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
                <p className="text-[10px] leading-relaxed opacity-60">
                  * Cole este UID no console do Supabase na tabela <code className="font-mono">admin_users</code> e marque a coluna <code className="font-mono">is_admin</code> como ativa para liberar seu acesso.
                </p>
              </div>

              <button
                onClick={handleLogout}
                className={`w-full py-2.5 font-bold uppercase text-xs tracking-wider cursor-pointer ${
                  isPapyrus 
                    ? 'border-2 border-[#5C4033] bg-[#EAD8B8] text-[#2D1D16] hover:bg-[#2D1D16] hover:text-[#EAD8B8]'
                    : 'border border-red-500/50 text-red-300 bg-slate-950 hover:bg-red-500/10 rounded-lg'
                }`}
              >
                Tentar outra conta / Desconectar
              </button>
            </div>
          </div>
        )}

        {/* ── Tela: Painel Administrativo Ativo ── */}
        {showAdminDashboard && (
          <div className="space-y-8 animate-fade-in font-sans">
            {/* ── Navegação por Abas (Visual Premium) ── */}
            <div className={`flex flex-wrap gap-2 border-b pb-1 ${isPapyrus ? 'border-[#5C4033]/30' : 'border-slate-800'}`}>
              {(['geral', 'jogadores', 'combate', 'aventuras', 'novidades', 'online', 'youtube', 'conquistas'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveAdminTab(tab);
                    setSelectedSheetDetails(null);
                  }}
                  className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all rounded-t-lg border-t border-x -mb-[1px] cursor-pointer ${
                    activeAdminTab === tab
                      ? (isPapyrus 
                          ? 'bg-[#EAD8B8]/30 border-[#5C4033] text-[#2D1D16] font-extrabold' 
                          : 'bg-slate-900 border-slate-800 text-cyan-400 border-b-slate-900')
                      : (isPapyrus
                          ? 'bg-transparent border-transparent text-[#5C4033]/60 hover:text-[#5C4033]'
                          : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200')
                  }`}
                >
                  {tab === 'geral' && 'Painel Geral'}
                  {tab === 'jogadores' && 'Jogadores / Streaks'}
                  {tab === 'combate' && 'Combates / Monstros'}
                  {tab === 'aventuras' && 'Aventuras / Social'}
                  {tab === 'novidades' && 'Novidades / Notícias'}
                  {tab === 'online' && (
                    <span className="flex items-center gap-1.5">
                      Tempo Real
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      {onlineUsers.length > 0 && (
                        <span className={`text-[10px] font-sans font-bold px-1.5 py-0.2 rounded-full ${isPapyrus ? 'bg-[#5C4033] text-[#FDF6E3]' : 'bg-slate-800 text-cyan-400 border border-cyan-500/20'}`}>
                          {onlineUsers.length}
                        </span>
                      )}
                    </span>
                  )}
                  {tab === 'youtube' && (
                    <span className="flex items-center gap-1.5">
                      <Youtube size={13} className="text-red-500" />
                      Youtube / Live
                    </span>
                  )}
                  {tab === 'conquistas' && (
                    <span className="flex items-center gap-1.5">
                      <Award size={13} className="text-amber-500" />
                      Conquistas
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Seletor de Livro-Jogo Global para Filtro */}
            <div className={`p-4 border flex flex-col sm:flex-row items-center justify-between gap-4 ${isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/10' : 'border-slate-800 bg-slate-900/40 rounded-xl'}`}>
              <div className="flex items-center gap-2">
                <BookOpen size={18} className={isPapyrus ? 'text-[#C5A059]' : 'text-cyan-400'} />
                <span className="text-sm font-bold uppercase tracking-wider">Filtrar por Livro-Jogo:</span>
              </div>
              <select
                id="global-gamebook-filter"
                value={selectedGamebookFilter}
                onChange={(e) => setSelectedGamebookFilter(e.target.value)}
                className={`w-full sm:w-72 px-3 py-1.5 text-xs border focus:outline-none transition-all ${
                  isPapyrus
                    ? 'border-[#5C4033] bg-[#EAD8B8]/60 text-[#2D1D16]'
                    : 'border-slate-700 bg-slate-950 text-[#cbd5e0] focus:ring-1 focus:ring-cyan-500/50 rounded-lg'
                }`}
              >
                <option value="all" className={isPapyrus ? 'bg-[#FDF6E3] text-[#2C1E14]' : 'bg-slate-900 text-slate-200'}>
                  [ Todos os Livros-Jogo ]
                </option>
                {GAMEBOOKS.map((book) => (
                  <option key={book} value={book} className={isPapyrus ? 'bg-[#FDF6E3] text-[#2C1E14]' : 'bg-slate-900 text-slate-200'}>
                    {book} {BOOKS_WITH_SUGGESTIONS.includes(book as any) ? '👾' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Carregando dados da telemetria */}
            {statsLoading && (
              <div className="flex justify-center py-6 gap-2 text-xs uppercase tracking-widest text-slate-500">
                <Loader2 className="animate-spin" size={14} /> Carregando estatísticas...
              </div>
            )}

            {/* ── ABA 1: PAINEL GERAL ── */}
            {activeAdminTab === 'geral' && (
              <div className="space-y-6">
                {/* Cards Macro */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className={`p-4 border ${isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/20' : 'border-slate-800 bg-slate-900/50 rounded-lg'} flex items-center gap-3`}>
                    <div className="p-2 rounded bg-cyan-500/10 text-cyan-400"><Compass size={18} /></div>
                    <div>
                      <p className="text-[9px] uppercase font-bold tracking-wider opacity-60">Total Fichas</p>
                      <p className="text-xl font-bold">{totalSheets}</p>
                    </div>
                  </div>

                  <div className={`p-4 border ${isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/20' : 'border-slate-800 bg-slate-900/50 rounded-lg'} flex items-center gap-3`}>
                    <div className="p-2 rounded bg-yellow-500/10 text-yellow-500"><Coins size={18} /></div>
                    <div>
                      <p className="text-[9px] uppercase font-bold tracking-wider opacity-60">Ouro Total</p>
                      <p className="text-xl font-bold">{totalGold}</p>
                    </div>
                  </div>

                  <div className={`p-4 border ${isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/20' : 'border-slate-800 bg-slate-900/50 rounded-lg'} flex items-center gap-3`}>
                    <div className="p-2 rounded bg-emerald-500/10 text-emerald-400"><Clock size={18} /></div>
                    <div>
                      <p className="text-[9px] uppercase font-bold tracking-wider opacity-60">Tempo Jogando</p>
                      <p className="text-xl font-bold">
                        {profiles.reduce((acc, p) => acc + (p.total_play_time || 0), 0)} min
                      </p>
                    </div>
                  </div>

                  <div className={`p-4 border ${isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/20' : 'border-slate-800 bg-slate-900/50 rounded-lg'} flex items-center gap-3`}>
                    <div className="p-2 rounded bg-purple-500/10 text-purple-400"><User size={18} /></div>
                    <div>
                      <p className="text-[9px] uppercase font-bold tracking-wider opacity-60">Total Usuários</p>
                      <p className="text-xl font-bold">{profiles.length}</p>
                    </div>
                  </div>
                </div>

                {/* Segunda Fileira de Cards: Médias e Balanceamento */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className={`p-4 border ${isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/20' : 'border-slate-800 bg-slate-900/50 rounded-lg'} flex items-center gap-3`}>
                    <div className="p-2 rounded bg-emerald-500/10 text-emerald-400"><Award size={18} /></div>
                    <div>
                      <p className="text-[9px] uppercase font-bold tracking-wider opacity-60">Taxa de Sucesso</p>
                      <p className="text-xl font-bold">{winRate}%</p>
                      <p className="text-[10px] opacity-50 mt-0.5">{victoryCount} Vit / {defeatCount} Der</p>
                    </div>
                  </div>

                  <div className={`p-4 border ${isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/20' : 'border-slate-800 bg-slate-900/50 rounded-lg'} flex items-center gap-3`}>
                    <div className="p-2 rounded bg-slate-500/10 text-slate-300"><Shield size={18} /></div>
                    <div>
                      <p className="text-[9px] uppercase font-bold tracking-wider opacity-60">Habilidade Média</p>
                      <p className="text-xl font-bold">{avgSkill}</p>
                      <p className="text-[10px] opacity-50 mt-0.5">Inicial: {avgSkillInitial}</p>
                    </div>
                  </div>

                  <div className={`p-4 border ${isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/20' : 'border-slate-800 bg-slate-900/50 rounded-lg'} flex items-center gap-3`}>
                    <div className="p-2 rounded bg-red-500/10 text-red-400"><Flame size={18} /></div>
                    <div>
                      <p className="text-[9px] uppercase font-bold tracking-wider opacity-60">Energia Média</p>
                      <p className="text-xl font-bold">{avgEnergy}</p>
                      <p className="text-[10px] opacity-50 mt-0.5">Inicial: {avgEnergyInitial}</p>
                    </div>
                  </div>

                  <div className={`p-4 border ${isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/20' : 'border-slate-800 bg-slate-900/50 rounded-lg'} flex items-center gap-3`}>
                    <div className="p-2 rounded bg-blue-500/10 text-blue-400"><Sun size={18} /></div>
                    <div>
                      <p className="text-[9px] uppercase font-bold tracking-wider opacity-60">Sorte Média</p>
                      <p className="text-xl font-bold">{avgLuck}</p>
                      <p className="text-[10px] opacity-50 mt-0.5">Inicial: {avgLuckInitial}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Heatmap de Atividade */}
                  <div className={`p-5 border ${isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/10' : 'border-slate-800 bg-slate-900/30 rounded-xl'}`}>
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Calendar size={16} /> Frequência de Ações (Últimos 28 Dias)
                    </h3>
                    <ActivityHeatmap data={activityData} />
                  </div>

                  {/* Taxa de Conclusão */}
                  <div className={`p-5 border ${isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/10' : 'border-slate-800 bg-slate-900/30 rounded-xl'}`}>
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                      <BarChart3 size={16} /> Campanhas por Jogador (Começadas vs Concluídas)
                    </h3>
                    <CompletionBarChart data={completionBarData} />
                  </div>
                </div>

                {/* ── Seção: Listagem de Fichas para Edição ── */}
                <div className="space-y-4 pt-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider">Fichas no Servidor ({filteredSheets.length})</h3>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${isPapyrus ? 'text-[#5C4033]/60' : 'text-slate-400'}`} size={13} />
                        <input
                          type="text"
                          placeholder="Buscar ficha..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className={`pl-8 pr-3 py-1.5 text-xs border ${
                            isPapyrus
                              ? 'border-[#5C4033] bg-[#EAD8B8]/60 text-[#2D1D16] focus:outline-none'
                              : 'border-slate-700 bg-slate-950 text-[#cbd5e0] focus:outline-none rounded'
                          }`}
                        />
                      </div>
                      <button
                        onClick={() => setCreating(true)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider cursor-pointer border ${
                          isPapyrus ? 'border-[#5C4033] text-[#2D1D16] hover:bg-[#5C4033]/15' : 'border-cyan-500/50 text-cyan-300 rounded'
                        }`}
                      >
                        <PlusCircle size={12} /> Criar
                      </button>
                    </div>
                  </div>

                  {creating && (
                    <div className={`p-4 border flex flex-col gap-4 ${isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/10' : 'border-slate-800 bg-slate-900/50 rounded-lg'}`}>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                        <div className="flex-1 flex flex-col gap-1">
                          <label className="text-[9px] uppercase font-bold tracking-wider opacity-75 font-sans">Título da Ficha</label>
                          <input
                            placeholder="Ex: Admin Campaign"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className={`w-full px-3 py-1.5 text-xs border ${
                              isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/60 text-[#2D1D16]' : 'border-slate-700 bg-slate-950 rounded'
                            }`}
                          />
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                          <label className="text-[9px] uppercase font-bold tracking-wider opacity-75 font-sans">Livro-Jogo</label>
                          <select
                            value={newGamebook}
                            onChange={(e) => setNewGamebook(e.target.value)}
                            className={`w-full px-3 py-1.5 text-xs border ${
                              isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/60 text-[#2D1D16]' : 'border-slate-700 bg-slate-950 rounded'
                            }`}
                          >
                            {GAMEBOOKS.map((book) => {
                              const hasSug = BOOKS_WITH_SUGGESTIONS.includes(book as any);
                              return (
                                <option key={book} value={book} className={isPapyrus ? 'bg-[#FDF6E3] text-[#2C1E14]' : 'bg-slate-900 text-slate-200'}>
                                  {book}{hasSug ? ' 👾' : ''}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t pt-3 border-current/10">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="admin-new-suggestions-toggle"
                            checked={newSuggestionsEnabled}
                            onChange={(e) => setNewSuggestionsEnabled(e.target.checked)}
                            className={`w-3.5 h-3.5 cursor-pointer ${isPapyrus ? 'accent-[#5C4033]' : 'accent-cyan-500'}`}
                          />
                          <label htmlFor="admin-new-suggestions-toggle" className={`text-[10px] uppercase font-bold tracking-wider cursor-pointer select-none ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-300'}`}>
                            Sugerir monstros do livro ao digitar
                          </label>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={handleCreate} className={`px-3 py-1.5 text-xs font-bold uppercase border cursor-pointer rounded ${isPapyrus ? 'border-[#5C4033] hover:bg-[#5C4033]/15 text-[#2D1D16] bg-[#EAD8B8]' : 'border-slate-700 hover:bg-slate-800 text-[#cbd5e0] bg-slate-950'}`}>Criar</button>
                          <button onClick={() => { setCreating(false); setNewTitle(''); setNewGamebook(GAMEBOOKS[0]); setNewSuggestionsEnabled(true); }} className={`px-3 py-1.5 text-xs border cursor-pointer rounded ${isPapyrus ? 'border-[#5C4033] hover:bg-[#5C4033]/15 text-[#2D1D16] bg-[#EAD8B8]' : 'border-slate-700 hover:bg-slate-800 text-[#cbd5e0] bg-slate-950'}`}>Cancelar</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Listagem Grelha */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredSheets.map(sheet => {
                      const isEditing = editingId === sheet.id;
                      const isConfirmingDelete = confirmDeleteId === sheet.id;
                      const uDate = new Date(sheet.updated_at).toLocaleDateString('pt-BR');
                      const p = profiles.find(pr => pr.id === sheet.user_id);

                      return (
                        <div
                          key={sheet.id}
                          className={`p-4 border flex flex-col gap-3 group transition ${
                            isPapyrus 
                              ? 'border-[#5C4033] bg-[#EAD8B8]/30' 
                              : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900/75 rounded-lg'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            {isEditing ? (
                              <input
                                value={editTitle}
                                onChange={e => setEditTitle(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleRename(sheet.id)}
                                className={`px-2 py-1 text-xs border ${isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/60 text-[#2D1D16]' : 'border-slate-700 bg-slate-950 rounded'}`}
                              />
                            ) : (
                              <div>
                                <h4 className="font-bold text-sm leading-tight">{sheet.title}</h4>
                                <div className="flex flex-col gap-0.5 mt-0.5">
                                  <span className="text-[10px] font-sans opacity-60">Dono: {p?.display_name || p?.email || 'Desconhecido'}</span>
                                  <span className={`text-[10px] font-sans font-bold ${isPapyrus ? 'text-[#8B4513]' : 'text-cyan-400'}`}>📚 {sheet.gamebook || 'O Feiticeiro da Montanha de Fogo'}</span>
                                </div>
                              </div>
                            )}

                            <div className="flex gap-1">
                              {!isEditing && (
                                <button onClick={() => { setEditingId(sheet.id); setEditTitle(sheet.title); }} className="p-1 opacity-0 group-hover:opacity-100 transition hover:text-cyan-400">
                                  <Pencil size={11} />
                                </button>
                              )}
                              {isEditing && (
                                <>
                                  <button onClick={() => handleRename(sheet.id)} className="text-green-500"><Check size={12} /></button>
                                  <button onClick={() => setEditingId(null)} className="text-red-500"><X size={12} /></button>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-xs opacity-75 border-t border-current/5 pt-2">
                            <span>Status: <strong className="uppercase">{sheet.status || 'playing'}</strong></span>
                            <span>Acessada: <span className="font-mono">{uDate}</span></span>
                          </div>

                          <div className="flex gap-2 mt-1">
                            <button
                              onClick={() => handleSelectSheetDetails(sheet)}
                              className={`flex-1 flex justify-center items-center gap-1 py-1 text-[10px] uppercase font-bold border cursor-pointer ${
                                isPapyrus ? 'border-[#5C4033] hover:bg-[#5C4033]/10' : 'border-slate-700 hover:bg-slate-800 rounded'
                              }`}
                            >
                              Análise <ChevronRight size={10} />
                            </button>

                            <button
                              onClick={() => handleExportSheet(sheet.id, sheet.title)}
                              className={`p-1.5 border cursor-pointer hover:bg-current/5 ${isPapyrus ? 'border-[#5C4033]' : 'border-slate-700 rounded'}`}
                              title="Exportar JSON"
                            >
                              <Download size={11} />
                            </button>

                            {isConfirmingDelete ? (
                              <div className="flex gap-1">
                                <button onClick={() => handleDelete(sheet.id)} className="p-1 text-red-500 border border-red-500/50 rounded"><Check size={10} /></button>
                                <button onClick={() => setConfirmDeleteId(null)} className="p-1 text-slate-400 border border-slate-700 rounded"><X size={10} /></button>
                              </div>
                            ) : (
                              <button onClick={() => setConfirmDeleteId(sheet.id)} className="p-1.5 border border-red-500/40 text-red-400 hover:bg-red-500/10 cursor-pointer rounded">
                                <Trash2 size={11} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── Painel de Análise da Ficha Selecionada ── */}
                {selectedSheetDetails && (
                  <div className={`p-6 border-2 animate-fade-in ${isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/20' : 'border-cyan-500/30 bg-slate-900/80 rounded-xl shadow-lg'}`}>
                    <div className="flex justify-between items-start border-b pb-3 mb-4">
                      <div>
                        <h3 className="font-bold text-lg">Histórico de Run: {selectedSheetDetails.title}</h3>
                        <p className={`text-xs font-bold ${isPapyrus ? 'text-[#8B4513]' : 'text-cyan-400'}`}>📚 {selectedSheetDetails.gamebook || 'O Feiticeiro da Montanha de Fogo'}</p>
                        <p className="text-[10px] opacity-50 mt-0.5">UID da Ficha: {selectedSheetDetails.id}</p>
                      </div>
                      <button onClick={() => setSelectedSheetDetails(null)} className="p-1 hover:text-red-500"><X size={18} /></button>
                    </div>

                    {loadingSheetLogs ? (
                      <div className="flex justify-center py-12 gap-2 text-xs uppercase tracking-widest text-slate-500">
                        <Loader2 className="animate-spin" size={14} /> Carregando logs da ficha...
                      </div>
                    ) : selectedSheetLogs.length === 0 ? (
                      <p className="text-sm opacity-50 italic text-center py-10">
                        Nenhum log de telemetria registrado para esta ficha de aventura.
                      </p>
                    ) : (
                      <div className="space-y-6">
                        {/* Gráfico de Evolução de Atributos */}
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider mb-2">Evolução de Atributos</h4>
                          <AttributeHistoryLineChart data={selectedSheetAttributeHistory} />
                        </div>

                        {/* Listagem Cronológica dos Eventos */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider">Eventos do Escriba (Últimos {selectedSheetLogs.length})</h4>
                          <div className="max-h-56 overflow-y-auto pr-1 text-xs space-y-1.5">
                            {selectedSheetLogs.map((l, i) => {
                              const date = new Date(l.created_at).toLocaleTimeString('pt-BR');
                              return (
                                <div key={i} className="flex justify-between items-center border-b border-current/5 pb-1">
                                  <div className="flex items-center flex-wrap gap-1">
                                    <span className="font-mono text-[10px] opacity-50 mr-2">{date}</span>
                                    {l.event_type === 'death' ? (
                                      <span className="font-bold uppercase text-[10px] text-red-500 mr-2 flex items-center gap-1">
                                        <Skull size={10} /> [DEATH]
                                      </span>
                                    ) : (
                                      <span className={`font-bold uppercase text-[10px] mr-2 ${isPapyrus ? 'text-[#8B4513]' : 'text-cyan-400'}`}>
                                        [{l.event_type}]
                                      </span>
                                    )}
                                    <span className="font-sans opacity-95">
                                      {l.event_type === 'section_visit' && `Visitou a Seção ${l.event_data?.section}`}
                                      {l.event_type === 'combat' && `Combate contra ${l.event_data?.monster} (${l.event_data?.result === 'victory' ? 'Vitória' : 'Derrota'})`}
                                      {l.event_type === 'death' && `Morreu por ${l.event_data?.cause === 'combat' ? `combate contra ${l.event_data?.monster}` : 'armadilha/parágrafo'}${l.event_data?.section ? ` na Seção ${l.event_data?.section}` : ''}`}
                                      {l.event_type === 'item_use' && `Usou consumível: ${l.event_data?.item === 'provisions' ? 'Provisão' : l.event_data?.item} (Qtd: ${l.event_data?.quantity ?? 1})`}
                                      {l.event_type === 'inventory_change' && `${l.event_data?.action === 'add' ? 'Adicionou' : 'Removeu'} item: ${l.event_data?.item}`}
                                      {l.event_type === 'game_completion' && `Concluiu o jogo com status: ${l.event_data?.status === 'victory' ? 'Vitória' : 'Derrota'}`}
                                      {!['section_visit', 'combat', 'death', 'item_use', 'inventory_change', 'game_completion'].includes(l.event_type) && JSON.stringify(l.event_data)}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── ABA 2: JOGADORES / STREAKS ── */}
            {activeAdminTab === 'jogadores' && (
              <div className="space-y-6">
                <div className={`p-5 border ${isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/10' : 'border-slate-800 bg-slate-900/30 rounded-xl'}`}>
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Flame className="text-orange-500 animate-pulse" size={16} /> Perfis de Jogadores Registrados ({profiles.length})
                  </h3>

                  {profiles.length === 0 ? (
                    <p className="text-sm opacity-50 italic text-center py-10">Nenhum perfil de jogador encontrado no banco de dados.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-current/25 font-bold uppercase opacity-85">
                            <th className="py-2.5">Nome / Email</th>
                            <th className="py-2.5">UID</th>
                            <th className="py-2.5 text-center">Último Acesso</th>
                            <th className="py-2.5 text-center">Consecutivos (Streak)</th>
                            <th className="py-2.5 text-center">Tempo de Jogo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {profiles.map(p => {
                            const lastLoginDate = new Date(p.last_login).toLocaleDateString('pt-BR', {
                              day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                            });
                            return (
                              <tr key={p.id} className="border-b border-current/5 hover:bg-current/5 transition-colors">
                                <td className="py-3 font-semibold">{p.display_name || p.email}</td>
                                <td className="py-3 font-mono text-[10px] opacity-75">{p.id}</td>
                                <td className="py-3 text-center">{lastLoginDate}</td>
                                <td className="py-3 text-center font-bold text-orange-500">
                                  🔥 {p.login_streak || 1} dias
                                </td>
                                <td className="py-3 text-center font-bold">{p.total_play_time || 0} min</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── ABA 3: COMBATE / MONSTROS ── */}
            {activeAdminTab === 'combate' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Gráfico de Pizza de Monstros Derrotados */}
                  <div className={`p-5 border ${isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/10' : 'border-slate-800 bg-slate-900/30 rounded-xl'}`}>
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                      <PieChart3 size={16} /> Distribuição de Monstros Derrotados
                    </h3>
                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-60 mb-4">Total de vitórias em combate registradas</p>
                    <MonsterPieChart data={monsterPieData} />
                  </div>

                  {/* Estatísticas de Danos e Perigos */}
                  <div className={`p-5 border ${isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/10' : 'border-slate-800 bg-slate-900/30 rounded-xl'} flex flex-col justify-between`}>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Swords className="text-red-500" size={16} /> Registro de Combates e Telemetria
                      </h3>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-current/5">
                          <span className="text-xs opacity-75">Total de Combates Iniciados</span>
                          <span className="font-bold text-sm">{statsLogs.filter(l => l.event_type === 'combat').length}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b border-current/5">
                          <span className="text-xs opacity-75">Mortes em Combate</span>
                          <span className="font-bold text-sm text-red-500">{deathsCombat}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b border-current/5">
                          <span className="text-xs opacity-75">Mortes por Armadilhas/Parágrafos</span>
                          <span className="font-bold text-sm text-yellow-500">{deathsTrap}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b border-current/5">
                          <span className="text-xs opacity-75">Monstro Mais Mortal (Kills)</span>
                          <span className="font-bold text-sm text-red-500 flex items-center gap-1"><Skull size={11} /> {mostDeadlyMonster}</span>
                        </div>

                        <div className="flex justify-between items-center py-2">
                          <span className="text-xs opacity-75">Monstro Mais Derrotado pelos Jogadores</span>
                          <span className="font-bold text-sm text-green-500 flex items-center gap-1"><Award size={11} /> {monsterPieData[0]?.name || 'Nenhum'}</span>
                        </div>
                      </div>
                    </div>

                    <div className={`p-3.5 border text-xs leading-relaxed opacity-85 mt-4 ${isPapyrus ? 'border-[#5C4033]/30 bg-[#EAD8B8]/40' : 'border-slate-800 bg-slate-950/40 rounded-lg'}`}>
                      💬 <strong>Nota do Mestre da Masmorra:</strong> Os jogadores estão derrotando mais monstros do tipo <strong>{monsterPieData[0]?.name || 'Goblin'}</strong>. O perigo real que causa mais mortes é <strong>{mostDeadlyMonster}</strong>.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── ABA 4: AVENTURAS / SOCIAL ── */}
            {activeAdminTab === 'aventuras' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Rankings */}
                  <div className={`p-5 border ${isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/10' : 'border-slate-800 bg-slate-900/30 rounded-xl'}`}>
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Award size={16} className="text-yellow-500" /> Ranking Global de Riqueza (Ouro)
                    </h3>

                    {goldRanking.length === 0 ? (
                      <p className="text-xs opacity-50 italic py-4">Nenhum ranking disponível.</p>
                    ) : (
                      <div className="space-y-2 text-xs">
                        {goldRanking.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center py-1.5 border-b border-current/5">
                            <div className="flex items-center gap-2.5">
                              <span className="font-bold w-4">{idx + 1}.</span>
                              <div>
                                <span className="font-bold">{item.name}</span>
                                <span className="text-[10px] opacity-60 block">Ficha: {item.sheetTitle}</span>
                              </div>
                            </div>
                            <span className="font-mono font-bold text-yellow-500">{item.value} ouro</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={`p-5 border ${isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/10' : 'border-slate-800 bg-slate-900/30 rounded-xl'}`}>
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Swords size={16} className="text-cyan-400" /> Caçadores de Monstros (Vitórias de Combates)
                    </h3>

                    {hunterRanking.length === 0 ? (
                      <p className="text-xs opacity-50 italic py-4">Nenhum ranking de combate disponível.</p>
                    ) : (
                      <div className="space-y-2 text-xs">
                        {hunterRanking.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center py-1.5 border-b border-current/5">
                            <div className="flex items-center gap-2.5">
                              <span className="font-bold w-4">{idx + 1}.</span>
                              <span className="font-bold">{item.name}</span>
                            </div>
                            <span className="font-bold text-cyan-400">{item.value} monstros</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Seções/Itens mais visitados */}
                  <div className={`p-5 border ${isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/10' : 'border-slate-800 bg-slate-900/30 rounded-xl'}`}>
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Compass size={16} /> Parágrafos mais visitados do Livro-Jogo
                    </h3>

                    {topSections.length === 0 ? (
                      <p className="text-xs opacity-50 italic py-4">Nenhum dado registrado.</p>
                    ) : (
                      <div className="space-y-2 text-xs">
                        {topSections.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center py-1.5 border-b border-current/5">
                            <div className="flex flex-col">
                              <span className="font-bold">Parágrafo {item.section}</span>
                              <span className="text-[10px] opacity-50">{item.gamebook}</span>
                            </div>
                            <span className="opacity-75">{item.count} visitas</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Parágrafos Mais Mortais */}
                  <div className={`p-5 border ${isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/10' : 'border-slate-800 bg-slate-900/30 rounded-xl'}`}>
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Skull className="text-red-500" size={16} /> Parágrafos Mais Mortais
                    </h3>

                    {topDeadlySections.length === 0 ? (
                      <p className="text-xs opacity-50 italic py-4">Nenhuma morte registrada.</p>
                    ) : (
                      <div className="space-y-2 text-xs">
                        {topDeadlySections.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center py-1.5 border-b border-current/5">
                            <div className="flex flex-col">
                              <span className="font-bold">Parágrafo {item.section}</span>
                              <span className="text-[10px] opacity-50">{item.gamebook}</span>
                            </div>
                            <span className="text-red-500 font-bold">{item.count} mortes</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Consumos do Inventário */}
                  <div className={`p-5 border ${isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/10' : 'border-slate-800 bg-slate-900/30 rounded-xl'}`}>
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Apple size={16} /> Telemetria de Consumíveis
                    </h3>

                    <div className="space-y-4 text-xs">
                      <div className="flex justify-between items-center py-1.5 border-b border-current/5">
                        <span>Provisões Consumidas (Curar Energia)</span>
                        <span className="font-bold">
                          {statsLogs.filter(l => l.event_type === 'item_use' && l.event_data?.item === 'provisions').length} unidades
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-1.5 border-b border-current/5">
                        <span>Total de Itens Coletados</span>
                        <span className="font-bold">
                          {statsLogs.filter(l => l.event_type === 'inventory_change' && l.event_data?.action === 'add').length} itens
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-1.5">
                        <span>Total de Itens Descartados</span>
                        <span className="font-bold">
                          {statsLogs.filter(l => l.event_type === 'inventory_change' && l.event_data?.action === 'remove').length} itens
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Popularidade por Livro-Jogo (Sempre Global) */}
                  <div className={`p-5 border ${isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/10' : 'border-slate-800 bg-slate-900/30 rounded-xl'}`}>
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                      <BookOpen size={16} /> Popularidade por Livro-Jogo (Campanhas)
                    </h3>

                    {gamebookPopularity.length === 0 ? (
                      <p className="text-xs opacity-50 italic py-4">Nenhum dado registrado.</p>
                    ) : (
                      <div className="space-y-2 text-xs">
                        {gamebookPopularity.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center py-1.5 border-b border-current/5">
                            <span className="font-bold truncate pr-2" title={item.name}>📚 {item.name}</span>
                            <span className="font-mono font-bold shrink-0">{item.count} fichas</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── ABA 5: GERENCIAR NOVIDADES ── */}
            {activeAdminTab === 'novidades' && (
              <div className="space-y-6 animate-fade-in font-sans">
                {/* Banner de Fallback / Script SQL se a tabela não existir */}
                {!newsTableExists && (
                  <div className={`p-6 border-2 text-left space-y-4 rounded-xl ${
                    isPapyrus ? 'border-red-950/40 bg-red-900/5 text-red-900' : 'border-red-500/40 bg-red-950/10 text-red-400'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <ShieldAlert size={22} className="text-red-500" />
                      <h3 className="text-sm font-bold uppercase tracking-wider">Tabela de Novidades Não Configurada</h3>
                    </div>
                    <p className="text-xs leading-relaxed opacity-95 max-w-2xl">
                      Para adicionar notícias em tempo de execução sem alterar o código do aplicativo, você deve criar a tabela <code className="font-mono px-1 py-0.5 bg-black/10 rounded">guild_news</code> no console SQL do seu projeto no Supabase.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider font-sans">Script SQL para criar a tabela:</span>
                        <button
                          type="button"
                          onClick={copySqlToClipboard}
                          className={`flex items-center gap-1.5 px-3 py-1 border text-[10px] uppercase font-bold tracking-wider cursor-pointer rounded transition ${
                            isPapyrus 
                              ? 'border-[#5C4033] hover:bg-[#5C4033]/10 text-[#2D1D16]' 
                              : 'border-slate-700 hover:bg-slate-800 text-slate-300 bg-slate-900/50'
                          }`}
                        >
                          {copiedSql ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                          {copiedSql ? 'Copiado!' : 'Copiar Script SQL'}
                        </button>
                      </div>
                      <pre className={`p-4 border font-mono text-[10px] overflow-x-auto max-h-[160px] rounded ${
                        isPapyrus ? 'border-[#5C4033]/30 bg-[#EAD8B8]/30 text-[#2D1D16]' : 'border-slate-800 bg-slate-950 text-slate-300'
                      }`}>
                        {sqlCommand}
                      </pre>
                    </div>
                    <p className="text-[10px] italic opacity-85 font-serif">
                      * Enquanto a tabela não for criada, a tela de entrada continuará exibindo a lista de notícias padrão (fallback local ativo).
                    </p>
                  </div>
                )}

                {/* Cabeçalho de Ações da Aba */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider">Notícias Publicadas</h3>
                    <p className={`text-[10px] font-sans opacity-60 mt-0.5 ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-400'}`}>
                      {newsTableExists ? 'As notícias abaixo são puxadas diretamente do Supabase em tempo real.' : 'Modo Fallback local ativo. Crie a tabela para habilitar edições.'}
                    </p>
                  </div>
                  {newsTableExists && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingNewsId(null);
                        setNewsTitleField('');
                        setNewsDescriptionField('');
                        setNewsDateField(new Date().toISOString().split('T')[0]);
                        setNewsCategory('Livros Jogos');
                        setShowNewsForm(true);
                      }}
                      className={`flex items-center justify-center gap-1.5 px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider cursor-pointer border ${
                        isPapyrus ? 'border-[#5C4033] text-[#2D1D16] hover:bg-[#5C4033]/15 bg-transparent' : 'border-cyan-500/50 text-cyan-300 rounded bg-transparent'
                      }`}
                    >
                      <PlusCircle size={12} /> Nova Notícia
                    </button>
                  )}
                </div>

                {/* Formulário de Notícia */}
                {showNewsForm && (
                  <form onSubmit={handleSaveNews} className={`p-5 border-2 space-y-4 shadow-[-6px_6px_0px_rgba(0,0,0,0.12)] ${
                    isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/30 text-[#2D1D16]' : 'border-slate-800 bg-slate-900/50 text-slate-300 rounded-xl'
                  }`}>
                    <h4 className="text-xs font-bold uppercase tracking-wider border-b border-current/10 pb-2">
                      {editingNewsId ? 'Editar Notícia' : 'Criar Nova Notícia'}
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-wider opacity-75">Categoria</label>
                        <select
                          value={newsCategory}
                          onChange={(e) => setNewsCategory(e.target.value)}
                          className={`w-full px-3 py-1.5 text-xs border focus:outline-none ${
                            isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/60 text-[#2D1D16]' : 'border-slate-700 bg-slate-950 text-[#cbd5e0] rounded'
                          }`}
                        >
                          <option value="Livros Jogos">Livros Jogos</option>
                          <option value="Melhoria">Melhoria</option>
                          <option value="Infraestrutura">Infraestrutura</option>
                          <option value="Ajuste de Equilíbrio">Ajuste de Equilíbrio</option>
                          <option value="Novidade da Guilda">Novidade da Guilda</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="text-[10px] uppercase font-bold tracking-wider opacity-75">Título da Notícia</label>
                        <input
                          type="text"
                          required
                          value={newsTitleField}
                          onChange={(e) => setNewsTitleField(e.target.value)}
                          placeholder="Ex: Lançamento do Livro 08"
                          className={`w-full px-3 py-1.5 text-xs border focus:outline-none ${
                            isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/60 text-[#2D1D16]' : 'border-slate-700 bg-slate-950 text-[#cbd5e0] rounded'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-wider opacity-75">Data de Implementação</label>
                        <input
                          type="date"
                          required
                          value={newsDateField}
                          onChange={(e) => setNewsDateField(e.target.value)}
                          className={`w-full px-3 py-1.5 text-xs border focus:outline-none ${
                            isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/60 text-[#2D1D16]' : 'border-slate-700 bg-slate-950 text-[#cbd5e0] rounded'
                          }`}
                        />
                      </div>

                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="text-[10px] uppercase font-bold tracking-wider opacity-75">Descrição / Detalhes</label>
                        <textarea
                          required
                          rows={2}
                          value={newsDescriptionField}
                          onChange={(e) => setNewsDescriptionField(e.target.value)}
                          placeholder="Descreva a melhoria ou novidade implementada..."
                          className={`w-full px-3 py-2 text-xs border focus:outline-none font-sans ${
                            isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/60 text-[#2D1D16]' : 'border-slate-700 bg-slate-950 text-[#cbd5e0] rounded'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 border-t pt-3 border-current/10">
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewsForm(false);
                          setEditingNewsId(null);
                        }}
                        className={`px-3 py-1.5 text-xs border cursor-pointer rounded ${
                          isPapyrus ? 'border-[#5C4033] hover:bg-[#5C4033]/10 text-[#2D1D16] bg-transparent' : 'border-slate-700 hover:bg-slate-800 text-slate-300 bg-slate-950'
                        }`}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={newsSaving}
                        className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold uppercase border cursor-pointer rounded ${
                          isPapyrus 
                            ? 'border-[#5C4033] text-[#EAD8B8] bg-[#5C4033] hover:bg-[#3D2B1F]' 
                            : 'border-cyan-500 text-cyan-300 bg-cyan-950/20 hover:bg-cyan-500/10'
                        }`}
                      >
                        {newsSaving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                        {editingNewsId ? 'Salvar Edição' : 'Publicar Notícia'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Tabela de Notícias */}
                <div className={`border overflow-hidden rounded-lg ${
                  isPapyrus ? 'border-[#5C4033]' : 'border-slate-800'
                }`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className={isPapyrus ? 'bg-[#5C4033]/15 text-[#2D1D16] border-b border-[#5C4033]/30 font-bold' : 'bg-slate-900/80 text-slate-300 border-b border-slate-800 font-bold'}>
                          <th className="p-3">Data</th>
                          <th className="p-3">Categoria</th>
                          <th className="p-3">Título</th>
                          <th className="p-3">Descrição</th>
                          {newsTableExists && <th className="p-3 text-center">Ações</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {newsList.length === 0 ? (
                          <tr>
                            <td colSpan={newsTableExists ? 5 : 4} className="p-6 text-center opacity-50 italic">
                              Nenhuma notícia registrada.
                            </td>
                          </tr>
                        ) : (
                          newsList.map((item, idx) => (
                            <tr 
                              key={item.id || idx} 
                              className={`border-b ${
                                isPapyrus 
                                  ? 'border-[#5C4033]/10 hover:bg-[#EAD8B8]/10 text-[#2D1D16]' 
                                  : 'border-slate-800/60 hover:bg-slate-900/20 text-slate-300'
                              }`}
                            >
                              <td className="p-3 whitespace-nowrap opacity-80">
                                {item.date ? item.date.split('T')[0] : 'Sem data'}
                              </td>
                              <td className="p-3 whitespace-nowrap">
                                <span className={`px-2 py-0.5 text-[9px] font-sans font-bold uppercase rounded ${
                                  isPapyrus ? 'bg-[#5C4033]/10 text-[#5C4033]' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                }`}>
                                  {item.category}
                                </span>
                              </td>
                              <td className="p-3 font-bold">{item.title}</td>
                              <td className="p-3 opacity-85 min-w-[280px] max-w-[400px] break-words line-clamp-2 pr-4 font-sans leading-normal">
                                {item.description}
                              </td>
                              {newsTableExists && (
                                <td className="p-3">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => handleEditNews(item)}
                                      className={`p-1.5 border transition cursor-pointer bg-transparent ${
                                        isPapyrus 
                                          ? 'border-[#5C4033]/30 text-[#5C4033]/70 hover:border-[#5C4033] hover:text-[#2D1D16]' 
                                          : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white rounded'
                                      }`}
                                      title="Editar notícia"
                                    >
                                      <Pencil size={11} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteNews(item.id)}
                                      className={`p-1.5 border transition cursor-pointer bg-transparent ${
                                        isPapyrus 
                                          ? 'border-red-700/30 text-red-700/70 hover:border-red-700 hover:text-red-700' 
                                          : 'border-red-500/30 text-red-400 hover:border-red-500 hover:text-red-300 rounded'
                                      }`}
                                      title="Excluir notícia"
                                    >
                                      <Trash2 size={11} />
                                    </button>
                                  </div>
                                </td>
                              )}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── ABA 6: TEMPO REAL (PRESENCE) ── */}
            {activeAdminTab === 'online' && (
              <div className="space-y-6 animate-fade-in">
                <div className={`p-5 border ${isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/10' : 'border-slate-800 bg-slate-900/30 rounded-xl'}`}>
                  <div className="flex items-center justify-between border-b pb-3 mb-4 border-current/10">
                    <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                      <span className="relative flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                      </span>
                      Usuários Ativos em Tempo Real ({onlineUsers.length})
                    </h3>
                    <p className="text-xs opacity-60">
                      Rastreando conexões e progresso através do Supabase Presence
                    </p>
                  </div>

                  {onlineUsers.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 italic text-sm">
                      Nenhum jogador online no momento. As conexões serão exibidas aqui em tempo real.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className={`border-b text-[10px] uppercase tracking-wider opacity-60 ${isPapyrus ? 'border-[#5C4033]/25' : 'border-slate-800'}`}>
                            <th className="p-3">Jogador</th>
                            <th className="p-3">Localização no App</th>
                            <th className="p-3">Seção Atual</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Conexão</th>
                          </tr>
                        </thead>
                        <tbody>
                          {onlineUsers.map((item, index) => {
                            const connectedTime = new Date(item.online_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                            return (
                              <tr
                                key={item.id || index}
                                className={`border-b hover:bg-current/5 transition-colors ${
                                  isPapyrus 
                                    ? 'border-[#5C4033]/10 text-[#2D1D16]' 
                                    : 'border-slate-800/60 text-slate-300'
                                }`}
                              >
                                <td className="p-3 font-bold">
                                  <div className="flex flex-col">
                                    <span>{item.name}</span>
                                    <span className="text-[9px] opacity-50 font-mono select-all">{item.email || item.id}</span>
                                  </div>
                                </td>
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 font-bold uppercase rounded text-[9px] ${
                                    item.gamebook === 'Menu Principal'
                                      ? (isPapyrus ? 'bg-slate-700/10 text-slate-700 border border-slate-700/30' : 'bg-slate-500/10 text-slate-400 border border-slate-700/20')
                                      : item.gamebook.startsWith('Criando')
                                      ? (isPapyrus ? 'bg-amber-700/10 text-amber-800 border border-amber-700/30 animate-pulse' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 animate-pulse')
                                      : (isPapyrus ? 'bg-purple-800/10 text-purple-900 border border-purple-800/30' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20')
                                  }`}>
                                    {item.gamebook}
                                  </span>
                                </td>
                                <td className="p-3 font-mono font-bold text-center sm:text-left">
                                  {item.section === '-' ? (
                                    <span className="opacity-45">-</span>
                                  ) : (
                                    <span className={`px-2 py-0.5 bg-current/5 border border-current/10 rounded font-semibold ${isPapyrus ? 'text-[#8B4513]' : 'text-cyan-400'}`}>
                                      Parágrafo {item.section}
                                    </span>
                                  )}
                                </td>
                                <td className="p-3">
                                  {item.status === '-' ? (
                                    <span className="opacity-45">-</span>
                                  ) : (
                                    <span className={`px-1.5 py-0.5 rounded font-bold uppercase text-[9px] ${
                                      item.status === 'victory'
                                        ? (isPapyrus ? 'bg-emerald-800/10 text-emerald-800 border border-emerald-800/30' : 'bg-green-500/10 text-green-400 border border-green-500/20')
                                        : item.status === 'defeat'
                                        ? (isPapyrus ? 'bg-red-800/10 text-red-800 border border-red-800/30' : 'bg-red-500/10 text-red-400 border border-red-500/20')
                                        : (isPapyrus ? 'bg-blue-800/10 text-blue-800 border border-blue-800/30' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20')
                                    }`}>
                                      {item.status === 'victory' && '🏆 Vitória'}
                                      {item.status === 'defeat' && '💀 Morte'}
                                      {item.status === 'playing' && '⚔️ Jogando'}
                                    </span>
                                  )}
                                </td>
                                <td className="p-3 opacity-80 font-mono">
                                  {connectedTime}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── ABA 7: CONFIGURAÇÃO DO YOUTUBE / LIVE ── */}
            {activeAdminTab === 'youtube' && (
              <div className="space-y-6 animate-fade-in">
                <div className={`p-6 border-2 rounded-xl text-left space-y-4 ${
                  isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/10' : 'border-slate-800 bg-slate-900/30'
                }`}>
                  <div className="flex items-center justify-between border-b border-current/10 pb-3">
                    <h3 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${
                      isPapyrus ? 'text-[#8B4513]' : 'text-cyan-400'
                    }`}>
                      <Youtube className="w-5 h-5 text-red-600 animate-pulse" />
                      Configuração da Transmissão ao Vivo (YouTube)
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className={`relative flex h-2 w-2 ${ytIsLive ? '' : 'opacity-60'}`}>
                        {ytIsLive && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        )}
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${ytIsLive ? 'bg-red-600' : 'bg-slate-500'}`}></span>
                      </span>
                      <span className={`text-[10px] font-sans font-bold uppercase tracking-wider ${ytIsLive ? 'text-red-500 animate-pulse' : 'opacity-60'}`}>
                        {ytIsLive ? 'AO VIVO' : 'OFFLINE'}
                      </span>
                    </div>
                  </div>

                  {/* Banner de aviso SQL se a tabela não existir */}
                  {!youtubeTableExists && (
                    <div className={`p-4 border text-left space-y-2 rounded-lg ${
                      isPapyrus ? 'border-red-950/30 bg-red-900/5 text-red-900' : 'border-red-500/20 bg-red-950/10 text-red-400 font-sans'
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <ShieldAlert size={16} className="text-red-500" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">Tabela youtube_settings Não Encontrada</h4>
                      </div>
                      <p className="text-[10px] leading-relaxed opacity-95">
                        Para sincronizar a transmissão ao vivo globalmente para todos os usuários em tempo real, crie a tabela <code className="font-mono px-1 py-0.5 bg-black/10 rounded">youtube_settings</code> no Supabase. Caso contrário, as alterações funcionarão apenas localmente neste navegador.
                      </p>
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] uppercase font-bold tracking-wider font-sans">Script SQL:</span>
                          <button
                            type="button"
                            onClick={copyYtSqlToClipboard}
                            className={`flex items-center gap-1 px-2 py-0.5 border text-[9px] uppercase font-bold tracking-wider cursor-pointer rounded transition ${
                              isPapyrus 
                                ? 'border-[#5C4033] hover:bg-[#5C4033]/10 text-[#2D1D16]' 
                                : 'border-slate-700 hover:bg-slate-800 text-slate-300 bg-slate-900/50'
                            }`}
                          >
                            {copiedYtSql ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
                            {copiedYtSql ? 'Copiado!' : 'Copiar SQL'}
                          </button>
                        </div>
                        <pre className={`p-2 border font-mono text-[9px] overflow-x-auto max-h-[120px] rounded ${
                          isPapyrus ? 'border-[#5C4033]/30 bg-[#EAD8B8]/30 text-[#2D1D16]' : 'border-slate-800 bg-slate-950 text-slate-300'
                        }`}>
                          {youtubeSqlCommand}
                        </pre>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSaveYoutubeSettings} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider opacity-75">ID do Canal do YouTube (UC...)</label>
                        <input
                          type="text"
                          className={`w-full ${
                            isPapyrus
                              ? 'border border-[#5C4033] bg-[#EAD8B8]/60 text-[#2D1D16] focus:outline-none focus:ring-2 focus:ring-[#C5A059] px-3 py-2 text-sm font-sans'
                              : 'border border-slate-700 bg-slate-950 text-[#cbd5e0] focus:outline-none focus:ring-2 focus:ring-cyan-500/50 px-3 py-2 text-sm font-mono rounded'
                          }`}
                          placeholder="Ex: UCQJ2X-kM3wX2HnC4a8e2r7g"
                          value={ytChannelId}
                          onChange={(e) => setYtChannelId(e.target.value)}
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider opacity-75">URL ou ID do Vídeo (Opcional)</label>
                        <input
                          type="text"
                          className={`w-full ${
                            isPapyrus
                              ? 'border border-[#5C4033] bg-[#EAD8B8]/60 text-[#2D1D16] focus:outline-none focus:ring-2 focus:ring-[#C5A059] px-3 py-2 text-sm font-sans'
                              : 'border border-slate-700 bg-slate-950 text-[#cbd5e0] focus:outline-none focus:ring-2 focus:ring-cyan-500/50 px-3 py-2 text-sm font-mono rounded'
                          }`}
                          placeholder="Ex: https://www.youtube.com/watch?v=..."
                          value={ytVideoUrl}
                          onChange={(e) => setYtVideoUrl(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t pt-3 border-current/10">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="yt-live-toggle"
                          checked={ytIsLive}
                          onChange={(e) => setYtIsLive(e.target.checked)}
                          className={`w-4 h-4 cursor-pointer ${isPapyrus ? 'accent-[#5C4033]' : 'accent-cyan-500'}`}
                        />
                        <label htmlFor="yt-live-toggle" className="text-xs uppercase font-bold tracking-wider cursor-pointer select-none">
                          Transmitindo "AO VIVO" (Modifica o player e ativa indicador)
                        </label>
                      </div>

                      {/* Redes Sociais */}
                      <div className="border-t border-current/10 pt-4 space-y-4 text-left">
                        <h4 className={`text-xs uppercase font-extrabold tracking-wider ${isPapyrus ? 'text-[#8B4513]' : 'text-cyan-400'} opacity-90`}>Links de Redes Sociais (Rodapé)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] uppercase font-bold tracking-wider opacity-75">YouTube (Canal)</label>
                            <input
                              type="text"
                              className={`w-full ${
                                isPapyrus
                                  ? 'border border-[#5C4033] bg-[#EAD8B8]/60 text-[#2D1D16] focus:outline-none focus:ring-2 focus:ring-[#C5A059] px-3 py-2 text-sm font-sans'
                                  : 'border border-slate-700 bg-slate-950 text-[#cbd5e0] focus:outline-none focus:ring-2 focus:ring-cyan-500/50 px-3 py-2 text-sm font-mono rounded'
                              }`}
                              placeholder="Ex: https://youtube.com/@..."
                              value={ytYoutubeUrl}
                              onChange={(e) => setYtYoutubeUrl(e.target.value)}
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] uppercase font-bold tracking-wider opacity-75">Instagram</label>
                            <input
                              type="text"
                              className={`w-full ${
                                isPapyrus
                                  ? 'border border-[#5C4033] bg-[#EAD8B8]/60 text-[#2D1D16] focus:outline-none focus:ring-2 focus:ring-[#C5A059] px-3 py-2 text-sm font-sans'
                                  : 'border border-slate-700 bg-slate-950 text-[#cbd5e0] focus:outline-none focus:ring-2 focus:ring-cyan-500/50 px-3 py-2 text-sm font-mono rounded'
                              }`}
                              placeholder="Ex: https://instagram.com/..."
                              value={ytInstagramUrl}
                              onChange={(e) => setYtInstagramUrl(e.target.value)}
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] uppercase font-bold tracking-wider opacity-75">Discord</label>
                            <input
                              type="text"
                              className={`w-full ${
                                isPapyrus
                                  ? 'border border-[#5C4033] bg-[#EAD8B8]/60 text-[#2D1D16] focus:outline-none focus:ring-2 focus:ring-[#C5A059] px-3 py-2 text-sm font-sans'
                                  : 'border border-slate-700 bg-slate-950 text-[#cbd5e0] focus:outline-none focus:ring-2 focus:ring-cyan-500/50 px-3 py-2 text-sm font-mono rounded'
                              }`}
                              placeholder="Ex: https://discord.gg/..."
                              value={ytDiscordUrl}
                              onChange={(e) => setYtDiscordUrl(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={ytSaving}
                        className={`flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs uppercase font-bold tracking-wider cursor-pointer ${
                          isPapyrus 
                            ? 'border border-[#5C4033] bg-[#5C4033] text-[#EAD8B8] hover:bg-[#3D2B1F] transition' 
                            : 'border border-cyan-500/60 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 transition rounded'
                        }`}
                      >
                        {ytSaving ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Salvando...
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" /> Salvar Configurações
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ── ABA 8: CONFIGURAÇÃO DE CONQUISTAS ── */}
            {activeAdminTab === 'conquistas' && (
              <div className="space-y-6 animate-fade-in text-left">
                {/* CARD 1: USER ACHIEVEMENTS */}
                <div className={`p-6 border-2 rounded-xl space-y-4 ${
                  isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/10' : 'border-slate-800 bg-slate-900/30'
                }`}>
                  <div className="flex items-center justify-between border-b border-current/10 pb-3">
                    <h3 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${
                      isPapyrus ? 'text-[#8B4513]' : 'text-amber-500'
                    }`}>
                      <Award className="w-5 h-5 text-amber-500 animate-pulse" />
                      Tabela de Conquistas (user_achievements)
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className={`relative flex h-2 w-2 ${achievementsTableExists ? '' : 'opacity-60'}`}>
                        {achievementsTableExists && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                        )}
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${achievementsTableExists ? 'bg-green-600' : 'bg-red-600'}`}></span>
                      </span>
                      <span className={`text-[10px] font-sans font-bold uppercase tracking-wider ${achievementsTableExists ? 'text-green-500' : 'text-red-500 animate-pulse'}`}>
                        {achievementsTableExists ? 'Tabela Supabase Ativa' : 'Tabela Supabase Ausente'}
                      </span>
                    </div>
                  </div>

                  {achievementsTableExists ? (
                    <div className={`p-4 border text-left space-y-2 rounded-lg ${
                      isPapyrus ? 'border-green-800/30 bg-green-900/5 text-green-900' : 'border-green-500/20 bg-green-950/10 text-green-400 font-sans'
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <Check size={16} className="text-green-500" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">Tabela de Conquistas Ativa e Sincronizada</h4>
                      </div>
                      <p className="text-[10px] leading-relaxed opacity-95">
                        A tabela <code className="font-mono px-1 py-0.5 bg-black/10 rounded">user_achievements</code> está configurada corretamente no banco de dados. Os desbloqueios dos jogadores estão sendo persistidos em nuvem.
                      </p>
                    </div>
                  ) : (
                    <div className={`p-4 border text-left space-y-2 rounded-lg ${
                      isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/10 text-[#2D1D16]' : 'border-amber-500/20 bg-amber-950/10 text-amber-400 font-sans'
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <ShieldAlert size={16} className="text-amber-500 animate-bounce" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">Modo de Persistência Local Ativo (Fallback)</h4>
                      </div>
                      <p className="text-[10px] leading-relaxed opacity-95">
                        A tabela de conquistas não foi detectada no Supabase. O sistema está salvando automaticamente o progresso dos jogadores de forma offline através do <code className="font-mono px-1 py-0.5 bg-black/10 rounded">localStorage</code> de seus navegadores. Para ativar a sincronização na nuvem e salvar conquistas nas contas dos jogadores, execute o script SQL abaixo no console do Supabase.
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider font-sans">Script SQL de Migração (Supabase):</span>
                      <button
                        type="button"
                        onClick={copyAchievementsSqlToClipboard}
                        className={`flex items-center gap-1 px-2.5 py-1 border text-[10px] uppercase font-bold tracking-wider cursor-pointer rounded transition ${
                          isPapyrus 
                            ? 'border-[#5C4033] hover:bg-[#5C4033]/10 text-[#2D1D16] bg-[#EAD8B8]' 
                            : 'border-slate-700 hover:bg-slate-800 text-slate-300 bg-slate-900/50'
                        }`}
                      >
                        {copiedAchievementsSql ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                        {copiedAchievementsSql ? 'Copiado!' : 'Copiar Script SQL'}
                      </button>
                    </div>
                    <pre className={`p-3 border font-mono text-[10px] overflow-x-auto max-h-[180px] rounded ${
                      isPapyrus ? 'border-[#5C4033]/30 bg-[#EAD8B8]/30 text-[#2D1D16]' : 'border-slate-800 bg-slate-950 text-slate-300'
                    }`}>
                      {achievementsSqlCommand}
                    </pre>
                  </div>
                </div>

                {/* CARD 2: USER STATS */}
                <div className={`p-6 border-2 rounded-xl space-y-4 ${
                  isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/10' : 'border-slate-800 bg-slate-900/30'
                }`}>
                  <div className="flex items-center justify-between border-b border-current/10 pb-3">
                    <h3 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${
                      isPapyrus ? 'text-[#8B4513]' : 'text-amber-500'
                    }`}>
                      <Database className="w-5 h-5 text-cyan-500 animate-pulse" />
                      Tabela de Estatísticas Acumuladas (user_stats)
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className={`relative flex h-2 w-2 ${statsTableExists ? '' : 'opacity-60'}`}>
                        {statsTableExists && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                        )}
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${statsTableExists ? 'bg-green-600' : 'bg-red-600'}`}></span>
                      </span>
                      <span className={`text-[10px] font-sans font-bold uppercase tracking-wider ${statsTableExists ? 'text-green-500' : 'text-red-500 animate-pulse'}`}>
                        {statsTableExists ? 'Tabela Supabase Ativa' : 'Tabela Supabase Ausente'}
                      </span>
                    </div>
                  </div>

                  {statsTableExists ? (
                    <div className={`p-4 border text-left space-y-2 rounded-lg ${
                      isPapyrus ? 'border-green-800/30 bg-green-900/5 text-green-900' : 'border-green-500/20 bg-green-950/10 text-green-400 font-sans'
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <Check size={16} className="text-green-500" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">Tabela de Estatísticas Ativa e Sincronizada</h4>
                      </div>
                      <p className="text-[10px] leading-relaxed opacity-95">
                        A tabela <code className="font-mono px-1 py-0.5 bg-black/10 rounded">user_stats</code> está configurada corretamente no banco de dados. As estatísticas acumuladas dos jogadores estão sendo salvas na nuvem.
                      </p>
                    </div>
                  ) : (
                    <div className={`p-4 border text-left space-y-2 rounded-lg ${
                      isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/10 text-[#2D1D16]' : 'border-amber-500/20 bg-amber-950/10 text-amber-400 font-sans'
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <ShieldAlert size={16} className="text-amber-500 animate-bounce" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">Modo de Persistência Local Ativo (Fallback)</h4>
                      </div>
                      <p className="text-[10px] leading-relaxed opacity-95">
                        A tabela de estatísticas acumuladas não foi detectada no Supabase. O sistema está salvando automaticamente o progresso dos jogadores de forma offline através de seu navegador. Para ativar a sincronização na nuvem e salvar estatísticas acumuladas nas contas dos jogadores, execute o script SQL abaixo no console do Supabase.
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider font-sans">Script SQL de Migração (Supabase):</span>
                      <button
                        type="button"
                        onClick={copyStatsSqlToClipboard}
                        className={`flex items-center gap-1 px-2.5 py-1 border text-[10px] uppercase font-bold tracking-wider cursor-pointer rounded transition ${
                          isPapyrus 
                            ? 'border-[#5C4033] hover:bg-[#5C4033]/10 text-[#2D1D16] bg-[#EAD8B8]' 
                            : 'border-slate-700 hover:bg-slate-800 text-slate-300 bg-slate-900/50'
                        }`}
                      >
                        {copiedStatsSql ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                        {copiedStatsSql ? 'Copiado!' : 'Copiar Script SQL'}
                      </button>
                    </div>
                    <pre className={`p-3 border font-mono text-[10px] overflow-x-auto max-h-[180px] rounded ${
                      isPapyrus ? 'border-[#5C4033]/30 bg-[#EAD8B8]/30 text-[#2D1D16]' : 'border-slate-800 bg-slate-950 text-slate-300'
                    }`}>
                      {statsSqlCommand}
                    </pre>
                  </div>
                </div>

                {/* CARD 3: POSTGRES RPC FUNCTIONS */}
                <div className={`p-6 border-2 rounded-xl space-y-4 ${
                  isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/10' : 'border-slate-800 bg-slate-900/30'
                }`}>
                  <div className="flex items-center justify-between border-b border-current/10 pb-3">
                    <h3 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${
                      isPapyrus ? 'text-[#8B4513]' : 'text-amber-500'
                    }`}>
                      <Database className="w-5 h-5 text-cyan-500 animate-pulse" />
                      Funções RPC do Postgres (Estatísticas & Conquistas Recentes)
                    </h3>
                  </div>

                  <div className={`p-4 border text-left space-y-2 rounded-lg ${
                    isPapyrus ? 'border-[#5C4033]/50 bg-[#EAD8B8]/10 text-[#2D1D16]' : 'border-cyan-500/20 bg-cyan-950/10 text-cyan-400 font-sans'
                  }`}>
                    <div className="flex items-center gap-1.5">
                      <Bookmark size={16} className="text-cyan-500" />
                      <h4 className="text-xs font-bold uppercase tracking-wider">Feed de Conquistas Globais Ativo</h4>
                    </div>
                    <p className="text-[10px] leading-relaxed opacity-95">
                      Para alimentar as conquistas recentes em tempo real de forma otimizada e segura na página inicial, execute o script SQL abaixo no console do Supabase. Essa função permite coletar com segurança os nomes dos jogadores sem expor seus e-mails.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider font-sans">Script SQL da Função RPC:</span>
                      <button
                        type="button"
                        onClick={copyRpcSqlToClipboard}
                        className={`flex items-center gap-1 px-2.5 py-1 border text-[10px] uppercase font-bold tracking-wider cursor-pointer rounded transition ${
                          isPapyrus 
                            ? 'border-[#5C4033] hover:bg-[#5C4033]/10 text-[#2D1D16] bg-[#EAD8B8]' 
                            : 'border-slate-700 hover:bg-slate-800 text-slate-300 bg-slate-900/50'
                        }`}
                      >
                        {copiedRpcSql ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                        {copiedRpcSql ? 'Copiado!' : 'Copiar Script SQL'}
                      </button>
                    </div>
                    <pre className={`p-3 border font-mono text-[10px] overflow-x-auto max-h-[180px] rounded ${
                      isPapyrus ? 'border-[#5C4033]/30 bg-[#EAD8B8]/30 text-[#2D1D16]' : 'border-slate-800 bg-slate-950 text-slate-300'
                    }`}>
                      {rpcSqlCommand}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

// Pequeno helper para renderizar ícone de pizza no Lucide
function PieChart3({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  );
}
