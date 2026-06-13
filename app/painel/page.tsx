'use client';

import { useEffect, useState } from 'react';
import { useSheetStore } from '@/store/useSheetStore';
import { supabase } from '@/lib/supabase';
import {
  Sun, Moon, Loader2, LogOut, Search, PlusCircle, Trash2, Pencil, Check, X,
  Download, BookOpen, ShieldAlert, BarChart3, Database, KeyRound, Award, Copy,
  Coins, Apple, Swords, Shield, Flame, Clock, Calendar, Compass, Skull, ChevronRight, User
} from 'lucide-react';
import {
  AttributeHistoryLineChart,
  MonsterPieChart,
  CompletionBarChart,
  ActivityHeatmap
} from '@/components/DashboardCharts';
import { GAMEBOOKS } from '@/lib/gamebooks';

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
  } = useSheetStore();

  // Estados locais
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  // Estados para gerenciamento de fichas
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newGamebook, setNewGamebook] = useState<string>(GAMEBOOKS[0]);
  const [newSuggestionsEnabled, setNewSuggestionsEnabled] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Aba ativa do Painel Admin
  const [activeAdminTab, setActiveAdminTab] = useState<'geral' | 'jogadores' | 'combate' | 'aventuras'>('geral');

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
    const runVerification = async () => {
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
        
        // Verifica na tabela public.admin_users
        const hasAccess = await checkAdminStatus();
        if (hasAccess) {
          await loadSheetsList(true);
          await loadStatsData();
        }
      } else {
        clearLocalState();
      }
      setCheckingAdmin(false);
    };

    runVerification();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
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
          await loadSheetsList(true);
          await loadStatsData();
        }
      } else {
        clearLocalState();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          await loadSheetsList(true);
          await loadStatsData();
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

  // Filtro de buscas
  const filteredSheets = sheetsList.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ─── Métricas Agregadas e Dados para os Gráficos ─────────────────────────────
  const totalSheets = sheetsList.length;
  const avgSkill = totalSheets > 0 
    ? Math.round(sheetsList.reduce((acc, s) => acc + (s.attributes?.skill?.current ?? 0), 0) / totalSheets)
    : 0;
  const avgEnergy = totalSheets > 0 
    ? Math.round(sheetsList.reduce((acc, s) => acc + (s.attributes?.energy?.current ?? 0), 0) / totalSheets)
    : 0;
  const avgLuck = totalSheets > 0 
    ? Math.round(sheetsList.reduce((acc, s) => acc + (s.attributes?.luck?.current ?? 0), 0) / totalSheets)
    : 0;

  const totalGold = sheetsList.reduce((acc, s) => acc + (s.gold ?? 0), 0);
  const totalProvisions = sheetsList.reduce((acc, s) => acc + (s.provisions ?? 0), 0);
  const totalMonstersDefeated = sheetsList.reduce(
    (acc, s) => acc + (s.monsters?.filter(m => m.status === 'defeated').length ?? 0),
    0
  );
  const totalItemsEquipped = sheetsList.reduce(
    (acc, s) => acc + (s.inventory?.filter(i => i.equipped).length ?? 0),
    0
  );

  // 1. Monstros derrotados (Pie Chart)
  const monsterDefeatedCounts: Record<string, number> = {};
  logs.forEach(log => {
    if (log.event_type === 'combat' && log.event_data?.monster) {
      const name = log.event_data.monster;
      monsterDefeatedCounts[name] = (monsterDefeatedCounts[name] || 0) + 1;
    }
  });
  const monsterPieData = Object.entries(monsterDefeatedCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // 2. Parágrafos mais visitados
  const sectionVisits: Record<string, number> = {};
  logs.forEach(log => {
    if (log.event_type === 'section_visit' && log.event_data?.section) {
      const sec = String(log.event_data.section);
      sectionVisits[sec] = (sectionVisits[sec] || 0) + 1;
    }
  });
  const topSections = Object.entries(sectionVisits)
    .map(([section, count]) => ({ section, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // 3. Mortes por tipo / Causa
  let deathsCombat = 0;
  let deathsTrap = 0;
  const killerMonsters: Record<string, number> = {};
  logs.forEach(log => {
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

  // 4. Atividade para o Heatmap (últimos 28 dias)
  const activityData: { date: string; count: number }[] = [];
  const todayDate = new Date();
  for (let i = 27; i >= 0; i--) {
    const d = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() - i);
    const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    const count = logs.filter(log => {
      const logDate = new Date(log.created_at);
      return logDate.getDate() === d.getDate() &&
             logDate.getMonth() === d.getMonth() &&
             logDate.getFullYear() === d.getFullYear();
    }).length;
    activityData.push({ date: dateStr, count });
  }

  // 5. Conclusões por jogador (Bar Chart)
  const userCompletionMap: Record<string, { name: string; iniciadas: number; concluidas: number }> = {};
  sheetsList.forEach(sheet => {
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

  // 6. Ranking de Ouro
  const goldRanking = [...sheetsList]
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

  // 7. Caçadores globais (monstros derrotados)
  const hunterRankingMap: Record<string, { name: string; value: number }> = {};
  logs.forEach(log => {
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

  // 8. Popularidade dos Livros-Jogo (Quantidade de fichas criadas por livro)
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

    const label = l.event_type === 'section_visit' ? `Item ${l.event_data?.section}` : l.event_type === 'combat' ? 'Combate' : l.event_type;
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
              {(['geral', 'jogadores', 'combate', 'aventuras'] as const).map(tab => (
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
                </button>
              ))}
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
                            {GAMEBOOKS.map((book) => (
                              <option key={book} value={book} className={isPapyrus ? 'bg-[#FDF6E3] text-[#2C1E14]' : 'bg-slate-900 text-slate-200'}>
                                {book}
                              </option>
                            ))}
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
                        <p className="text-xs opacity-75">UID: {selectedSheetDetails.id}</p>
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
                          <div className="max-h-48 overflow-y-auto pr-1 text-xs space-y-1.5">
                            {selectedSheetLogs.map((l, i) => {
                              const date = new Date(l.created_at).toLocaleTimeString('pt-BR');
                              return (
                                <div key={i} className="flex justify-between items-center border-b border-current/5 pb-1">
                                  <div>
                                    <span className="font-mono text-[10px] opacity-50 mr-2">{date}</span>
                                    <span className="font-bold uppercase text-[10px] text-cyan-400 mr-2">[{l.event_type}]</span>
                                    <span className="font-sans opacity-95">{JSON.stringify(l.event_data)}</span>
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
                          <span className="font-bold text-sm">{logs.filter(l => l.event_type === 'combat').length}</span>
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
                      <Compass size={16} /> Parágrafos/Itens mais visitados do Livro-Jogo
                    </h3>

                    {topSections.length === 0 ? (
                      <p className="text-xs opacity-50 italic py-4">Nenhum dado registrado.</p>
                    ) : (
                      <div className="space-y-2 text-xs">
                        {topSections.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center py-1.5 border-b border-current/5">
                            <span className="font-bold">Item {item.section}</span>
                            <span className="opacity-75">{item.count} visitas</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Consumos do Inventário */}
                  <div className={`p-5 border ${isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/10' : 'border-slate-800 bg-slate-900/30 rounded-xl'}`}>
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Apple size={16} /> Telemetria de Consumíveis
                    </h3>

                    <div className="space-y-4 text-xs">
                      <div className="flex justify-between items-center py-1.5 border-b border-current/5">
                        <span>Provisões Consumidas (Curar Energia)</span>
                        <span className="font-bold">
                          {logs.filter(l => l.event_type === 'item_use' && l.event_data?.item === 'provisions').length} unidades
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-1.5 border-b border-current/5">
                        <span>Total de Itens Coletados</span>
                        <span className="font-bold">
                          {logs.filter(l => l.event_type === 'inventory_change' && l.event_data?.action === 'add').length} itens
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-1.5">
                        <span>Total de Itens Descartados</span>
                        <span className="font-bold">
                          {logs.filter(l => l.event_type === 'inventory_change' && l.event_data?.action === 'remove').length} itens
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Popularidade por Livro-Jogo */}
                <div className={`p-5 border ${isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/10' : 'border-slate-800 bg-slate-900/30 rounded-xl'} mt-6`}>
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                    <BookOpen size={16} /> Popularidade por Livro-Jogo (Campanhas Iniciadas)
                  </h3>

                  {gamebookPopularity.length === 0 ? (
                    <p className="text-xs opacity-50 italic py-4">Nenhum dado registrado.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                      {gamebookPopularity.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 px-3 border border-current/10 bg-current/5 rounded">
                          <span className="font-bold truncate pr-2" title={item.name}>📚 {item.name}</span>
                          <span className="font-mono font-bold shrink-0">{item.count} fichas</span>
                        </div>
                      ))}
                    </div>
                  )}
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
