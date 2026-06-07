'use client';
import { useEffect, useState } from 'react';
import { AttributeCard } from '@/components/AttributeCard';
import { NotesCard } from '@/components/NotesCard';
import { AttackCard } from '@/components/AttackCard';
import { LuckCard } from '@/components/LuckCard';
import { DamageCard } from '@/components/DamageCard';
import { CombatHistory } from '@/components/CombatHistory';
import { InventoryManager } from '@/components/InventoryManager';
import { GoldAndProvisions } from '@/components/GoldAndProvisions';
import { MonsterManager } from '@/components/MonsterManager';
import { SyncStatus } from '@/components/SyncStatus';
import AuthStatus from '@/components/AuthStatus';
import { CurrentSectionFloatingBar } from '@/components/CurrentSectionFloatingBar';
import { useSheetStore } from '@/store/useSheetStore';
import { supabase } from '@/lib/supabase';
import {
  Sun, Moon, RotateCcw, Upload, Download, Loader2,
  PlusCircle, Pencil, Trash2, BookOpen, ArrowLeft, Check, X,
} from 'lucide-react';

// ─── Sheet Dashboard ──────────────────────────────────────────────────────────

function SheetDashboard() {
  const { theme, sheetsList, loadSheetsList, loadSheet, createSheet, renameSheet, deleteSheet, syncStatus } = useSheetStore();
  const [newTitle, setNewTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadSheetsList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async () => {
    const title = newTitle.trim() || 'Nova Ficha';
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

  const isPapyrus = theme === 'papyrus';
  const cardBase = isPapyrus
    ? 'border-2 border-[#5C4033] bg-[#EAD8B8]/30 shadow-[-6px_6px_0px_rgba(0,0,0,0.12)]'
    : 'border border-[#4a5568]/60 bg-slate-800/50 shadow-lg backdrop-blur-sm';

  const btnBase = isPapyrus
    ? 'border border-[#5C4033] text-[#2D1D16] hover:bg-[#5C4033] hover:text-[#EAD8B8] transition-all duration-200 cursor-pointer'
    : 'border border-[#4a5568] text-[#cbd5e0] hover:bg-slate-700/60 transition-all duration-200 cursor-pointer';

  const inputBase = isPapyrus
    ? 'border border-[#5C4033] bg-[#EAD8B8]/60 text-[#2D1D16] placeholder-[#5C4033]/50 focus:outline-none focus:ring-2 focus:ring-[#C5A059] px-3 py-2 text-sm font-serif'
    : 'border border-[#4a5568] bg-slate-900/80 text-[#cbd5e0] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 px-3 py-2 text-sm font-sans rounded';

  const isLoading = syncStatus === 'loading';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Dashboard Header */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 ${isPapyrus ? 'border-[#5C4033]/40' : 'border-[#4a5568]/40'}`}>
        <div>
          <h2 className={`text-2xl font-bold uppercase tracking-widest ${isPapyrus ? 'text-[#2D1D16]' : 'text-[#cbd5e0]'}`}>
            Minhas Fichas
          </h2>
          <p className={`text-xs font-sans tracking-wide mt-1 ${isPapyrus ? 'text-[#5C4033]/70' : 'text-slate-400'}`}>
            Selecione uma ficha para continuar sua aventura ou crie uma nova.
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className={`flex items-center gap-2 px-4 py-2 text-xs uppercase font-bold tracking-wider ${btnBase}`}
        >
          <PlusCircle size={14} /> Nova Ficha
        </button>
      </div>

      {/* Create Sheet Form */}
      {creating && (
        <div className={`p-4 ${cardBase} flex flex-col sm:flex-row items-stretch sm:items-center gap-3`}>
          <input
            className={`flex-1 ${inputBase}`}
            placeholder="Nome da ficha (ex: Barbarian Run)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs uppercase font-bold tracking-wider ${isPapyrus ? 'border border-[#5C4033] bg-[#5C4033] text-[#EAD8B8] hover:bg-[#3D2B1F] cursor-pointer transition' : 'border border-cyan-500/60 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 cursor-pointer transition rounded'}`}
            >
              <Check size={14} /> Criar
            </button>
            <button
              onClick={() => { setCreating(false); setNewTitle(''); }}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs uppercase font-bold tracking-wider ${btnBase}`}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20 gap-3 opacity-60">
          <Loader2 size={32} className="animate-spin" />
          <span className="text-sm uppercase tracking-widest font-sans">Carregando fichas...</span>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && sheetsList.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-60">
          <BookOpen size={48} strokeWidth={1} />
          <p className="text-sm uppercase tracking-widest font-sans text-center">
            Nenhuma ficha encontrada.<br />Crie sua primeira aventura!
          </p>
        </div>
      )}

      {/* Sheets Grid */}
      {!isLoading && sheetsList.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sheetsList.map((sheet) => {
            const isEditing = editingId === sheet.id;
            const isConfirmingDelete = confirmDeleteId === sheet.id;
            const updated = new Date(sheet.updated_at);
            const dateStr = updated.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
            const timeStr = updated.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            return (
              <div
                key={sheet.id}
                className={`${cardBase} p-5 flex flex-col gap-4 group`}
              >
                {/* Title / Rename */}
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      className={`flex-1 ${inputBase} py-1`}
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRename(sheet.id);
                        if (e.key === 'Escape') { setEditingId(null); setEditTitle(''); }
                      }}
                      autoFocus
                    />
                    <button onClick={() => handleRename(sheet.id)} className={`p-1.5 ${isPapyrus ? 'text-[#5C4033] hover:text-green-700 cursor-pointer' : 'text-slate-400 hover:text-green-400 cursor-pointer'} transition`}>
                      <Check size={14} />
                    </button>
                    <button onClick={() => { setEditingId(null); setEditTitle(''); }} className={`p-1.5 ${isPapyrus ? 'text-[#5C4033] hover:text-red-700 cursor-pointer' : 'text-slate-400 hover:text-red-400 cursor-pointer'} transition`}>
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`font-bold text-base leading-snug line-clamp-2 ${isPapyrus ? 'text-[#2D1D16]' : 'text-[#e2e8f0]'}`}>
                      {sheet.title}
                    </h3>
                    <button
                      onClick={() => { setEditingId(sheet.id); setEditTitle(sheet.title); }}
                      className={`shrink-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity ${isPapyrus ? 'text-[#5C4033]/60 hover:text-[#5C4033] cursor-pointer' : 'text-slate-500 hover:text-slate-300 cursor-pointer'}`}
                    >
                      <Pencil size={12} />
                    </button>
                  </div>
                )}

                {/* Date */}
                <p className={`text-xs font-sans ${isPapyrus ? 'text-[#5C4033]/60' : 'text-slate-500'}`}>
                  Atualizado em {dateStr} às {timeStr}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-auto pt-2">
                  {/* Open */}
                  <button
                    onClick={() => loadSheet(sheet.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs uppercase font-bold tracking-wider ${isPapyrus ? 'border-2 border-[#5C4033] bg-[#5C4033] text-[#EAD8B8] hover:bg-[#3D2B1F] cursor-pointer transition-all' : 'border border-cyan-500/50 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 cursor-pointer transition-all rounded'}`}
                  >
                    <BookOpen size={13} /> Abrir
                  </button>

                  {/* Delete */}
                  {isConfirmingDelete ? (
                    <div className="flex items-center gap-1">
                      <span className={`text-xs font-sans ${isPapyrus ? 'text-red-700' : 'text-red-400'}`}>Confirmar?</span>
                      <button
                        onClick={() => handleDelete(sheet.id)}
                        className={`p-1.5 ${isPapyrus ? 'text-red-700 hover:bg-red-700/10 cursor-pointer border border-red-700' : 'text-red-400 hover:bg-red-400/10 cursor-pointer border border-red-500/50 rounded'} transition text-xs font-bold`}
                      >
                        <Check size={13} />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className={`p-1.5 ${isPapyrus ? 'text-[#5C4033]/60 hover:bg-[#5C4033]/10 cursor-pointer border border-[#5C4033]/40' : 'text-slate-500 hover:bg-slate-700/60 cursor-pointer border border-[#4a5568] rounded'} transition`}
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(sheet.id)}
                      className={`p-2 ${isPapyrus ? 'border border-[#5C4033]/40 text-[#5C4033]/60 hover:border-red-700 hover:text-red-700 cursor-pointer' : 'border border-[#4a5568]/60 text-slate-500 hover:border-red-500/70 hover:text-red-400 cursor-pointer rounded'} transition`}
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const {
    theme,
    setTheme,
    resetSheet,
    syncStatus,
    user,
    activeSheetId,
    setActiveSheetId,
    sheetsList,
    setUser,
    loadSheetsList,
    clearLocalState,
    activeTab,
    setActiveTab,
  } = useSheetStore();

  // Load user session on initial render (AuthStatus also handles it)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const activeUser = session?.user ?? null;
      if (activeUser) {
        setUser({
          id: activeUser.id,
          email: activeUser.email,
          user_metadata: activeUser.user_metadata,
        });
        loadSheetsList();
      } else {
        clearLocalState();
      }
    });
  }, []);

  // Interceptar fechamento ou recarregamento do navegador
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (activeSheetId) {
        e.preventDefault();
        e.returnValue = ''; // Exibe o diálogo padrão do navegador
        return '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [activeSheetId]);

  // Função para voltar ao painel solicitando confirmação do item
  const handleBackToDashboard = async () => {
    if (activeSheetId) {
      const currentSection = useSheetStore.getState().attributes.currentSection || '';
      const sectionInput = window.prompt(
        'Antes de voltar, em qual item (número) você parou a aventura?',
        currentSection
      );
      if (sectionInput === null) {
        // Se cancelar, aborta a navegação
        return;
      }
      useSheetStore.getState().setCurrentSection(sectionInput);
      await useSheetStore.getState().saveToSupabase();
    }
    setActiveSheetId(null);
  };

  // Export current sheet as JSON
  const handleExport = () => {
    const state = useSheetStore.getState();
    const data = {
      attributes: state.attributes,
      gold: state.gold,
      provisions: state.provisions,
      inventory: state.inventory,
      monsters: state.monsters,
      notes: state.notes,
      combatLog: state.combatLog,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'adventure-sheet.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import sheet from JSON file
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        const store = useSheetStore.getState();
        if (data.attributes) {
          ['skill', 'energy', 'luck'].forEach((key) => {
            const k = key as 'skill' | 'energy' | 'luck';
            store.setAttribute(k, data.attributes[k].initial, true);
            store.setAttribute(k, data.attributes[k].current, false);
          });
        }
        if (typeof data.gold === 'number') store.updateGold(data.gold - useSheetStore.getState().gold);
        if (typeof data.provisions === 'number') store.updateProvisions(data.provisions - useSheetStore.getState().provisions);
        if (data.notes) store.setNotes(data.notes);
        await store.saveToSupabase();
      } catch {
        alert('Arquivo inválido. Por favor, use um JSON exportado deste app.');
      }
    };
    input.click();
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) {
      console.error('Login error:', error.message);
      alert('Erro ao conectar com Google: ' + error.message);
    }
  };

  const isPapyrus = theme === 'papyrus';
  // We remove global isLoading so it doesn't unmount child components during fetch.
  // The child components will handle their own loading states.

  // Which view to render in the content area
  const showLogin = !user;
  const showDashboard = !!user && !activeSheetId;
  const showSheet = !!user && !!activeSheetId;
  const activeSheetTitle = activeSheetId
    ? sheetsList.find(s => s.id === activeSheetId)?.title
    : null;

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
        {/* ── Cabeçalho ── */}
        <header
          className={`flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b-2 ${
            isPapyrus ? 'border-[#5C4033] text-[#2D1D16]' : 'border-[#4a5568] text-[#cbd5e0]'
          }`}
        >
          <div className="text-center sm:text-left">
            {/* Title — clicking it when in a sheet goes back to dashboard */}
            <h1
              className={`text-4xl sm:text-5xl font-bold uppercase tracking-widest ${showSheet ? 'cursor-pointer hover:opacity-80 transition' : ''}`}
              onClick={() => showSheet && handleBackToDashboard()}
              title={showSheet ? 'Voltar ao painel de fichas' : undefined}
            >
              Aventuras Fantásticas
            </h1>
            <div className="flex items-center gap-3 mt-1">
              {showSheet && activeSheetTitle && (
                <span className={`text-xs uppercase font-bold tracking-widest px-2 py-0.5 rounded ${isPapyrus ? 'bg-[#5C4033]/10' : 'bg-white/10'}`}>
                  {activeSheetTitle}
                </span>
              )}
              {showSheet && <SyncStatus />}
              <AuthStatus />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {/* Back to Dashboard */}
            {showSheet && (
              <button
                onClick={handleBackToDashboard}
                className="flex items-center gap-1.5 px-2.5 py-1.5 border border-current hover:bg-[#3D2B1F]/10 transition text-[10px] sm:text-xs uppercase font-bold tracking-wider cursor-pointer"
              >
                <ArrowLeft size={12} /> Fichas
              </button>
            )}

            {/* Backup (só visível numa ficha aberta) */}
            {showSheet && (
              <>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 border border-current hover:bg-[#3D2B1F]/10 transition text-[10px] sm:text-xs uppercase font-bold tracking-wider cursor-pointer"
                >
                  <Upload size={12} /> Exportar
                </button>
                <button
                  onClick={handleImport}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 border border-current hover:bg-[#3D2B1F]/10 transition text-[10px] sm:text-xs uppercase font-bold tracking-wider cursor-pointer"
                >
                  <Download size={12} /> Importar
                </button>
              </>
            )}

            {/* Tema */}
            <button
              onClick={() => setTheme(isPapyrus ? 'night' : 'papyrus')}
              className="p-1.5 sm:p-2 border border-current hover:bg-[#3D2B1F]/10 rounded cursor-pointer transition"
              aria-label="Alternar tema"
            >
              {isPapyrus ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Reset (só numa ficha aberta) */}
            {showSheet && (
              <button
                onClick={() => {
                  if (window.confirm('Deseja realmente resetar sua ficha? Essa ação é irreversível.')) {
                    resetSheet();
                  }
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition text-[10px] sm:text-xs uppercase font-bold tracking-wider cursor-pointer"
              >
                <RotateCcw size={12} /> Resetar
              </button>
            )}
          </div>
        </header>

        {/* ── Tela de Login ── */}
        {showLogin && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
            {isPapyrus ? (
              <div className="max-w-[480px] w-full flex flex-col items-center gap-6 p-6 sm:p-10 border-2 border-[#C5A059] bg-[#EAD8B8]/30 shadow-inner rounded-sm">
                <div className="flex items-center justify-center mb-2 drop-shadow-lg">
                  <img src="/logo.png" alt="Logo" className="w-28 h-28 object-contain" />
                </div>
                <h2 className="text-3xl font-extrabold uppercase tracking-widest text-[#2D1D16]">Fichas de Aventuras</h2>
                <div className="w-24 h-0.5 bg-[#C5A059]"></div>
                <p className="text-sm font-serif leading-relaxed text-[#5C4033] opacity-90 max-w-[340px]">
                  &ldquo;Apenas os corajosos que registrarem seus nomes no livro dos escribas poderão desbravar os perigos do Labirinto.&rdquo;
                </p>
                <p className="text-xs font-sans tracking-wide text-[#2D1D16] opacity-75">
                  Conecte sua conta Google para criar, salvar e carregar suas fichas na nuvem.
                </p>
                <button
                  onClick={handleGoogleLogin}
                  className="mt-4 flex items-center justify-center gap-3 w-full max-w-[280px] px-6 py-3 border-2 border-[#5C4033] text-[#2D1D16] bg-[#EAD8B8] hover:bg-[#2D1D16] hover:text-[#EAD8B8] active:scale-95 transition-all duration-300 uppercase text-xs font-bold tracking-widest shadow-md cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Conectar via Google
                </button>
              </div>
            ) : (
              <div className="max-w-[480px] w-full flex flex-col items-center gap-6 p-6 sm:p-10 border border-[#4a5568]/50 bg-slate-900/60 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.1)] rounded-xl">
                <div className="w-16 h-16 border border-cyan-500/40 rounded-full flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] mb-2 animate-pulse">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <div className="text-center">
                  <h2 className="text-3xl font-bold uppercase tracking-widest bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Adventure System
                  </h2>
                  <p className="text-xs uppercase tracking-wider text-cyan-400/80 mt-1 font-mono font-bold">
                    Secure Database Connection
                  </p>
                </div>
                <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
                <p className="text-sm font-sans leading-relaxed text-[#a0aec0] max-w-[340px]">
                  Para acessar o banco de dados e sincronizar o progresso do seu agente cibernético na nuvem, conecte-se com sua credencial do Google.
                </p>
                <button
                  onClick={handleGoogleLogin}
                  className="mt-4 flex items-center justify-center gap-3 w-full max-w-[280px] px-6 py-3 border border-cyan-500/50 text-[#cbd5e0] bg-slate-950 hover:bg-cyan-500/10 hover:border-cyan-400 active:scale-95 transition-all duration-300 uppercase text-xs font-mono font-bold tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] cursor-pointer rounded-lg"
                >
                  <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Autenticar Google
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Dashboard de Fichas ── */}
        {showDashboard && <SheetDashboard />}

        {/* ── Conteúdo da Ficha Ativa ── */}
        {showSheet && (
          <div className="animate-fade-in">
            {/* ── Menu de Abas (Apenas Mobile) ── */}
            <div className={`md:hidden flex overflow-x-auto gap-2 mb-6 pb-2 border-b ${isPapyrus ? 'border-[#5C4033]/30' : 'border-[#4a5568]/50'}`}>
              {['Status', 'Combate', 'Inventário', 'Notas'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-bold uppercase tracking-wider whitespace-nowrap rounded ${
                    activeTab === tab 
                      ? (isPapyrus ? 'bg-[#5C4033] text-[#EAD8B8]' : 'bg-[#cbd5e0] text-[#1a202c]')
                      : (isPapyrus ? 'bg-[#EAD8B8]/50 text-[#5C4033] border border-[#5C4033]/30' : 'bg-slate-800 text-[#cbd5e0] border border-[#4a5568]/50')
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-8">
              {/* BLOCO DE CIMA: Atributos + Monstros/Ações */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* STATUS TAB (Mobile) / Coluna Esquerda (Desktop) */}
                <div className={`md:col-span-1 flex-col gap-6 ${activeTab === 'Status' ? 'flex' : 'hidden md:flex'}`}>
                  <AttributeCard label="Habilidade" attrKey="skill" />
                  <AttributeCard label="Energia" attrKey="energy" />
                  <AttributeCard label="Sorte" attrKey="luck" />
                  
                  {/* Ouro e Provisões vão para cá no Mobile também */}
                  <div className="md:hidden">
                    <GoldAndProvisions />
                  </div>
                </div>

                {/* COMBATE TAB (Mobile) / Coluna Direita (Desktop) */}
                <div className={`md:col-span-3 flex-col gap-6 ${activeTab === 'Combate' ? 'flex' : 'hidden md:flex'}`}>
                  <section
                    className={`bg-transparent border-2 p-6 shadow-[-10px_10px_0px_rgba(0,0,0,0.1)] ${
                      isPapyrus ? 'border-[#4A3728]' : 'border-[#4a5568]'
                    }`}
                  >
                    <MonsterManager />
                  </section>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <DamageCard />
                    <AttackCard />
                    <LuckCard />
                  </div>
                </div>
              </div>

              {/* INVENTÁRIO TAB (Mobile) / BLOCO DO MEIO (Desktop) */}
              <div className={`grid-cols-1 md:grid-cols-2 gap-6 ${activeTab === 'Inventário' ? 'grid' : 'hidden md:grid'}`}>
                <section
                  className={`bg-transparent border-2 p-6 shadow-[-10px_10px_0px_rgba(0,0,0,0.1)] ${
                    isPapyrus ? 'border-[#4A3728]' : 'border-[#4a5568]'
                  }`}
                >
                  <InventoryManager />
                </section>
                <section
                  className={`bg-transparent border-2 p-6 shadow-[-10px_10px_0px_rgba(0,0,0,0.1)] ${
                    isPapyrus ? 'border-[#4A3728]' : 'border-[#4a5568]'
                  }`}
                >
                  <CombatHistory />
                </section>
              </div>

              {/* STATUS TAB extras (Mobile) / BLOCO INFERIOR (Desktop) */}
              <section className={`hidden md:block`}>
                <GoldAndProvisions />
              </section>

              {/* NOTAS TAB (Mobile) / BLOCO INFERIOR (Desktop) */}
              <section className={`flex-col min-h-[200px] ${activeTab === 'Notas' ? 'flex' : 'hidden md:flex'}`}>
                <NotesCard />
              </section>
            </div>
            {/* Item atual flutuante */}
            <CurrentSectionFloatingBar />
          </div>
        )}
      </div>
    </main>
  );
}
