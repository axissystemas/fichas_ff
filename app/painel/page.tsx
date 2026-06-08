'use client';

import { useEffect, useState } from 'react';
import { useSheetStore } from '@/store/useSheetStore';
import { supabase } from '@/lib/supabase';
import {
  Sun, Moon, Loader2, LogOut, Search, PlusCircle, Trash2, Pencil, Check, X,
  Download, BookOpen, ShieldAlert, BarChart3, Database, KeyRound, Award, Copy,
  Coins, Apple, Swords, Shield
} from 'lucide-react';

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

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
          await loadSheetsList();
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
          await loadSheetsList();
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
          await loadSheetsList();
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
    setAuthLoading(false);
  };

  const handleCreate = async () => {
    const title = newTitle.trim() || 'Nova Ficha Admin';
    await createSheet(title);
    setNewTitle('');
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
  };

  const copyUidToClipboard = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Export sheet JSON file
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

  // Temas
  const isPapyrus = theme === 'papyrus';

  // Filtro de buscas
  const filteredSheets = sheetsList.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Estatísticas agregadas
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

  // Condicionais de exibição
  const showLoading = checkingAdmin;
  const showLogin = !checkingAdmin && !user;
  const showAccessDenied = !checkingAdmin && !!user && !isAdmin;
  const showAdminDashboard = !checkingAdmin && !!user && !!isAdmin;

  const isSyncing = syncStatus === 'loading';

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
              Gerenciamento
            </h1>
            <p className={`text-xs font-sans tracking-wide mt-1 ${isPapyrus ? 'text-[#5C4033]/70' : 'text-slate-400'}`}>
              Painel administrativo para controle e auditoria de fichas de aventuras.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Tema */}
            <button
              onClick={() => setTheme(isPapyrus ? 'night' : 'papyrus')}
              className="p-1.5 sm:p-2 border border-current hover:bg-[#3D2B1F]/10 rounded cursor-pointer transition"
              aria-label="Alternar tema"
            >
              {isPapyrus ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Logout */}
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

                {/* Formulário de Email */}
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

                {/* Google Login fallback */}
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

                {/* Formulário de Email */}
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

                {/* Google login */}
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

        {/* ── Tela: Acesso Negado (Não está cadastrado na tabela de admins) ── */}
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

              {/* Box do UID para copiar */}
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
            {/* Bloco Estatístico */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Total Fichas */}
              <div className={`p-4 border ${isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/30' : 'border-[#4a5568]/40 bg-slate-800/20 rounded-lg'} flex items-center gap-3.5`}>
                <div className={`p-2 rounded ${isPapyrus ? 'bg-[#5C4033]/10 text-[#5C4033]' : 'bg-cyan-500/10 text-cyan-400'}`}>
                  <BarChart3 size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider opacity-60">Total Fichas</p>
                  <p className="text-2xl font-bold tracking-tight">{totalSheets}</p>
                </div>
              </div>

              {/* Ouro Acumulado */}
              <div className={`p-4 border ${isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/30' : 'border-[#4a5568]/40 bg-slate-800/20 rounded-lg'} flex items-center gap-3.5`}>
                <div className={`p-2 rounded ${isPapyrus ? 'bg-[#5C4033]/10 text-[#5C4033]' : 'bg-yellow-500/10 text-yellow-500'}`}>
                  <Coins size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider opacity-60">Ouro Total</p>
                  <p className="text-2xl font-bold tracking-tight">{totalGold}</p>
                </div>
              </div>

              {/* Provisões Restantes */}
              <div className={`p-4 border ${isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/30' : 'border-[#4a5568]/40 bg-slate-800/20 rounded-lg'} flex items-center gap-3.5`}>
                <div className={`p-2 rounded ${isPapyrus ? 'bg-[#5C4033]/10 text-[#5C4033]' : 'bg-[#C5A059]/10 text-[#C5A059]'}`}>
                  <Apple size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider opacity-60">Provisões Totais</p>
                  <p className="text-2xl font-bold tracking-tight">{totalProvisions}</p>
                </div>
              </div>

              {/* Monstros Derrotados */}
              <div className={`p-4 border ${isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/30' : 'border-[#4a5568]/40 bg-slate-800/20 rounded-lg'} flex items-center gap-3.5`}>
                <div className={`p-2 rounded ${isPapyrus ? 'bg-[#5C4033]/10 text-[#5C4033]' : 'bg-red-500/10 text-red-400'}`}>
                  <Swords size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider opacity-60">Monstros Derrotados</p>
                  <p className="text-2xl font-bold tracking-tight">{totalMonstersDefeated}</p>
                </div>
              </div>

              {/* Média Habilidade */}
              <div className={`p-4 border ${isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/30' : 'border-[#4a5568]/40 bg-slate-800/20 rounded-lg'} flex items-center gap-3.5`}>
                <div className={`p-2 rounded ${isPapyrus ? 'bg-[#5C4033]/10 text-[#5C4033]' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  <Award size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider opacity-60">Média Hab.</p>
                  <p className="text-2xl font-bold tracking-tight">{avgSkill}</p>
                </div>
              </div>

              {/* Média Energia */}
              <div className={`p-4 border ${isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/30' : 'border-[#4a5568]/40 bg-slate-800/20 rounded-lg'} flex items-center gap-3.5`}>
                <div className={`p-2 rounded ${isPapyrus ? 'bg-[#5C4033]/10 text-[#5C4033]' : 'bg-rose-500/10 text-rose-400'}`}>
                  <Award size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider opacity-60">Média Energ.</p>
                  <p className="text-2xl font-bold tracking-tight">{avgEnergy}</p>
                </div>
              </div>

              {/* Média Sorte */}
              <div className={`p-4 border ${isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/30' : 'border-[#4a5568]/40 bg-slate-800/20 rounded-lg'} flex items-center gap-3.5`}>
                <div className={`p-2 rounded ${isPapyrus ? 'bg-[#5C4033]/10 text-[#5C4033]' : 'bg-amber-500/10 text-amber-400'}`}>
                  <Award size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider opacity-60">Média Sorte</p>
                  <p className="text-2xl font-bold tracking-tight">{avgLuck}</p>
                </div>
              </div>

              {/* Itens Equipados */}
              <div className={`p-4 border ${isPapyrus ? 'border-[#5C4033] bg-[#EAD8B8]/30' : 'border-[#4a5568]/40 bg-slate-800/20 rounded-lg'} flex items-center gap-3.5`}>
                <div className={`p-2 rounded ${isPapyrus ? 'bg-[#5C4033]/10 text-[#5C4033]' : 'bg-indigo-500/10 text-indigo-400'}`}>
                  <Shield size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider opacity-60">Itens Equipados</p>
                  <p className="text-2xl font-bold tracking-tight">{totalItemsEquipped}</p>
                </div>
              </div>
            </div>

            {/* Barra de Ações: Busca + Criar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isPapyrus ? 'text-[#5C4033]/60' : 'text-slate-400'}`} size={16} />
                <input
                  type="text"
                  placeholder="Pesquisar ficha pelo nome..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2 text-sm border ${
                    isPapyrus
                      ? 'border-[#5C4033] bg-[#EAD8B8]/60 text-[#2D1D16] placeholder-[#5C4033]/50 focus:outline-none focus:ring-2 focus:ring-[#C5A059]'
                      : 'border-[#4a5568] bg-slate-900 text-[#cbd5e0] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 rounded-lg'
                  }`}
                />
              </div>

              <button
                onClick={() => setCreating(true)}
                className={`flex items-center justify-center gap-2 px-4 py-2 text-xs uppercase font-bold tracking-wider transition-all duration-200 cursor-pointer ${
                  isPapyrus
                    ? 'border-2 border-[#5C4033] text-[#2D1D16] hover:bg-[#5C4033] hover:text-[#EAD8B8]'
                    : 'border border-cyan-500/50 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-lg'
                }`}
              >
                <PlusCircle size={14} /> Criar Ficha Admin
              </button>
            </div>

            {/* Criar Nova Ficha Form */}
            {creating && (
              <div className={`p-4 border flex flex-col sm:flex-row items-stretch sm:items-center gap-3 ${
                isPapyrus ? 'border-2 border-[#5C4033] bg-[#EAD8B8]/30 shadow-md' : 'border-[#4a5568]/60 bg-slate-800/40 rounded-lg'
              }`}>
                <input
                  type="text"
                  placeholder="Nome da ficha (ex: Admin Campaign)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  className={`flex-1 px-3 py-2 text-sm border ${
                    isPapyrus
                      ? 'border-[#5C4033] bg-[#EAD8B8]/60 text-[#2D1D16]'
                      : 'border-[#4a5568] bg-slate-950 text-[#cbd5e0] rounded-lg'
                  }`}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreate}
                    className={`flex items-center gap-1 px-4 py-2 text-xs uppercase font-bold tracking-wider cursor-pointer ${
                      isPapyrus 
                        ? 'border border-[#5C4033] bg-[#5C4033] text-[#EAD8B8] hover:bg-[#3D2B1F]' 
                        : 'border border-cyan-500/60 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 rounded-lg'
                    }`}
                  >
                    <Check size={14} /> Criar
                  </button>
                  <button
                    onClick={() => { setCreating(false); setNewTitle(''); }}
                    className={`flex items-center gap-1 px-3 py-2 text-xs uppercase font-bold tracking-wider cursor-pointer border ${
                      isPapyrus 
                        ? 'border-[#5C4033] text-[#2D1D16] hover:bg-[#5C4033]/10' 
                        : 'border-[#4a5568] text-[#cbd5e0] hover:bg-slate-700/60 rounded-lg'
                    }`}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Listagem de Fichas */}
            {isSyncing && sheetsList.length === 0 ? (
              <div className="flex items-center justify-center py-16 gap-3 opacity-60">
                <Loader2 className="animate-spin" size={24} />
                <span className="text-sm uppercase tracking-widest font-mono">Carregando dados...</span>
              </div>
            ) : filteredSheets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 opacity-50 border-2 border-dashed border-current/20 rounded-lg">
                <BookOpen size={40} strokeWidth={1} />
                <p className="text-sm tracking-wide text-center">
                  Nenhuma ficha encontrada com esses termos.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSheets.map((sheet) => {
                  const isEditing = editingId === sheet.id;
                  const isConfirmingDelete = confirmDeleteId === sheet.id;
                  const updated = new Date(sheet.updated_at);
                  const dateStr = updated.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
                  const timeStr = updated.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                  return (
                    <div
                      key={sheet.id}
                      className={`p-5 border flex flex-col gap-4 group transition-all duration-200 ${
                        isPapyrus
                          ? 'border-2 border-[#5C4033] bg-[#EAD8B8]/30 shadow-md'
                          : 'border-[#4a5568]/50 bg-slate-900/50 hover:bg-slate-800/40 rounded-xl'
                      }`}
                    >
                      {/* Título & Renomeação */}
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            className={`flex-1 px-3 py-1.5 text-sm border font-sans ${
                              isPapyrus
                                ? 'border-[#5C4033] bg-[#EAD8B8]/60 text-[#2D1D16]'
                                : 'border-[#4a5568] bg-slate-950 text-[#cbd5e0] rounded-lg'
                            }`}
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleRename(sheet.id);
                              if (e.key === 'Escape') { setEditingId(null); setEditTitle(''); }
                            }}
                            autoFocus
                          />
                          <button onClick={() => handleRename(sheet.id)} className="p-1.5 hover:text-green-500 cursor-pointer">
                            <Check size={16} />
                          </button>
                          <button onClick={() => { setEditingId(null); setEditTitle(''); }} className="p-1.5 hover:text-red-500 cursor-pointer">
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-2">
                          <h3 className={`font-bold text-base leading-snug line-clamp-1 ${isPapyrus ? 'text-[#2D1D16]' : 'text-[#e2e8f0]'}`}>
                            {sheet.title}
                          </h3>
                          <button
                            onClick={() => { setEditingId(sheet.id); setEditTitle(sheet.title); }}
                            className="shrink-0 p-1 opacity-0 group-hover:opacity-100 hover:text-cyan-400 transition cursor-pointer"
                          >
                            <Pencil size={12} />
                          </button>
                        </div>
                      )}

                      {/* Infos Rápidas */}
                      <div className="grid grid-cols-3 gap-2 py-1 text-center bg-slate-950/10 dark:bg-slate-950/30 rounded border border-current/5">
                        <div>
                          <p className="text-[9px] uppercase tracking-wider opacity-60">Hab.</p>
                          <p className="text-sm font-bold">{sheet.attributes?.skill?.current ?? 0}/{sheet.attributes?.skill?.initial ?? 0}</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-wider opacity-60">Energ.</p>
                          <p className="text-sm font-bold">{sheet.attributes?.energy?.current ?? 0}/{sheet.attributes?.energy?.initial ?? 0}</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-wider opacity-60">Sorte</p>
                          <p className="text-sm font-bold">{sheet.attributes?.luck?.current ?? 0}/{sheet.attributes?.luck?.initial ?? 0}</p>
                        </div>
                      </div>

                      {/* Item Atual & Data */}
                      <div className="space-y-1 text-xs opacity-75">
                        <p>Última Edição: <span className="font-mono">{dateStr} {timeStr}</span></p>
                        <p>Item Atual: <span className="font-bold">{sheet.attributes?.currentSection || 'Nenhum'}</span></p>
                      </div>

                      {/* Ações de Cartão */}
                      <div className="flex items-center gap-2 mt-auto pt-2 border-t border-current/10">
                        {/* Download JSON */}
                        <button
                          onClick={() => handleExportSheet(sheet.id, sheet.title)}
                          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer border ${
                            isPapyrus 
                              ? 'border-[#5C4033]/60 text-[#2D1D16] hover:bg-[#5C4033]/10' 
                              : 'border-slate-700 text-slate-300 hover:bg-slate-800 rounded-lg'
                          }`}
                        >
                          <Download size={12} /> Exportar
                        </button>

                        {/* Exclusão */}
                        {isConfirmingDelete ? (
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="text-[10px] text-red-500 font-bold uppercase mr-1">Confirmar?</span>
                            <button
                              onClick={() => handleDelete(sheet.id)}
                              className="p-1.5 text-red-500 hover:bg-red-500/10 border border-red-500/50 rounded cursor-pointer"
                            >
                              <Check size={12} />
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="p-1.5 text-slate-400 hover:bg-slate-700/60 border border-slate-700 rounded cursor-pointer"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(sheet.id)}
                            className="p-2 border border-red-500/40 text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer transition"
                            title="Excluir ficha"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
