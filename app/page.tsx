'use client';
import { useEffect, useState } from 'react';
import { AttributeCard } from '@/components/AttributeCard';
import { NotesCard } from '@/components/NotesCard';
import { AttackCard } from '@/components/AttackCard';
import { DiceRoller } from '@/components/DiceRoller';
import { DamageCard } from '@/components/DamageCard';
import { CombatHistory } from '@/components/CombatHistory';
import { InventoryManager } from '@/components/InventoryManager';
import { GoldAndProvisions } from '@/components/GoldAndProvisions';
import { MonsterManager } from '@/components/MonsterManager';
import { SyncStatus } from '@/components/SyncStatus';
import AuthStatus from '@/components/AuthStatus';
import { CurrentSectionCard } from '@/components/CurrentSectionCard';
import { useSheetStore } from '@/store/useSheetStore';
import { CharacterCreation } from '@/components/CharacterCreation';
import { supabase } from '@/lib/supabase';
import { MedoTracker } from '@/components/MedoTracker';
import { CidadelaTracker } from '@/components/CidadelaTracker';
import { VampiroTracker } from '@/components/VampiroTracker';
import { ExercitosTracker } from '@/components/ExercitosTracker';
import { TravellerTracker } from '@/components/TravellerTracker';
import { TravellerOfficialSheet } from '@/components/TravellerOfficialSheet';
import { YouTubeLiveStream } from '@/components/YouTubeLiveStream';
import { GrimorioAmarilleo } from '@/components/GrimorioAmarilleo';
import MapAllansia from '@/components/MapAllansia';
import {
  Sun, Moon, RotateCcw, Upload, Download, Loader2,
  PlusCircle, Pencil, Trash2, BookOpen, ArrowLeft, Check, X, Bookmark,
  Volume2, VolumeX, Music, Skull, Trophy, Award, ShieldAlert,
  Instagram, Youtube, Shield, Swords, Backpack, Settings, Compass,
  Heart, Home as HomeIcon, ChevronLeft, MoreVertical, Map as MapIcon
} from 'lucide-react';
import { GAMEBOOKS, BOOKS_WITH_SUGGESTIONS } from '@/lib/gamebooks';
import { audio, music } from '@/lib/audio';
import confetti from 'canvas-confetti';
import AchievementsGallery from '@/components/AchievementsGallery';
import { ACHIEVEMENTS } from '@/lib/achievements';
import AchievementToast from '@/components/AchievementToast';
import { victoryParagraphs } from '@/lib/victoryParagraphs';
import { CompletionChecklist } from '@/components/CompletionChecklist';

// Custom Discord Icon component
const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 127.14 96.36" fill="currentColor" {...props}>
    <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c1-.73,2-1.5,2.92-2.3a75.7,75.7,0,0,0,92.14,0c.93.8,1.91,1.57,2.92,2.3a68.43,68.43,0,0,1-10.5,5,77.7,77.7,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31.06-18.83C129,54.65,122.57,31.58,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z" />
  </svg>
);

// ─── Sheet Dashboard ──────────────────────────────────────────────────────────

function SheetDashboard() {
  const { theme, sheetsList, loadSheetsList, loadSheet, createSheet, renameSheet, deleteSheet, syncStatus } = useSheetStore();
  const [newTitle, setNewTitle] = useState('');
  const [newGamebook, setNewGamebook] = useState<string>(GAMEBOOKS[0]);
  const [newSuggestionsEnabled, setNewSuggestionsEnabled] = useState(true);
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

      {/* Galeria de Conquistas */}
      <div className="mb-6">
        <AchievementsGallery />
      </div>

      {/* Create Sheet Form */}
      {creating && (
        <div className={`p-4 ${cardBase} flex flex-col gap-4`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-xs uppercase font-bold tracking-wider opacity-75">Nome do Personagem / Ficha</label>
              <input
                className={`w-full ${inputBase}`}
                placeholder="Nome da ficha (ex: Barbarian Run)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                autoFocus
              />
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-xs uppercase font-bold tracking-wider opacity-75">Selecionar Livro-Jogo</label>
              <select
                value={newGamebook}
                onChange={(e) => setNewGamebook(e.target.value)}
                className={`w-full ${inputBase}`}
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

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t pt-3 border-current/10">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="new-suggestions-toggle"
                checked={newSuggestionsEnabled}
                onChange={(e) => setNewSuggestionsEnabled(e.target.checked)}
                className={`w-4 h-4 cursor-pointer ${isPapyrus ? 'accent-[#5C4033]' : 'accent-cyan-500'}`}
              />
              <label htmlFor="new-suggestions-toggle" className={`text-xs uppercase font-bold tracking-wider cursor-pointer select-none ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-300'}`}>
                Sugerir monstros do livro ao digitar
              </label>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={handleCreate}
                className={`flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs uppercase font-bold tracking-wider ${isPapyrus ? 'border border-[#5C4033] bg-[#5C4033] text-[#EAD8B8] hover:bg-[#3D2B1F] cursor-pointer transition' : 'border border-cyan-500/60 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 cursor-pointer transition rounded'}`}
              >
                <Check size={14} /> Criar
              </button>
              <button
                onClick={() => { setCreating(false); setNewTitle(''); setNewGamebook(GAMEBOOKS[0]); setNewSuggestionsEnabled(true); }}
                className={`flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs uppercase font-bold tracking-wider ${btnBase}`}
              >
                <X size={14} />
              </button>
            </div>
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

                {/* Gamebook */}
                <p className={`text-xs font-sans font-bold ${isPapyrus ? 'text-[#8B4513]' : 'text-cyan-400'} line-clamp-1`}>
                  📚 {sheet.gamebook || 'O Feiticeiro da Montanha de Fogo'}
                  {BOOKS_WITH_SUGGESTIONS.includes((sheet.gamebook || 'O Feiticeiro da Montanha de Fogo') as any) && ' 👾'}
                </p>

                {/* Date */}
                <p className={`text-xs font-sans ${isPapyrus ? 'text-[#5C4033]/60' : 'text-slate-500'}`}>
                  Atualizado em {dateStr} às {timeStr}
                </p>

                {/* Parou no Parágrafo */}
                <p className={`text-xs font-sans ${isPapyrus ? 'text-[#5C4033]/70' : 'text-slate-400'} flex items-center gap-1.5 mt-0.5`}>
                  <Bookmark size={11} className={isPapyrus ? 'text-[#C5A059]' : 'text-cyan-400'} />
                  <span>Parou no Parágrafo: {sheet.attributes?.currentSection || 'Não informado'}</span>
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

// ─── Helpers for News ────────────────────────────────────────────────────────

const formatDate = (dateString: string) => {
  try {
    const [year, month, day] = dateString.split('-');
    if (!year || !month || !day) return dateString;
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${parseInt(day, 10)} de ${months[parseInt(month, 10) - 1]} de ${year}`;
  } catch {
    return dateString;
  }
};

const getCategoryBadgeStyle = (category: string, isPapyrus: boolean) => {
  if (isPapyrus) return 'bg-[#5C4033]/15 text-[#5C4033]';
  const cat = category.toLowerCase();
  if (cat.includes('livro') || cat.includes('jogo')) {
    return 'bg-green-500/10 text-green-400 border border-green-500/20';
  }
  if (cat.includes('melhoria') || cat.includes('ajuste') || cat.includes('som') || cat.includes('trilha') || cat.includes('áudio')) {
    return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20';
  }
  return 'bg-slate-500/10 text-slate-400 border border-slate-700';
};

const getHeroAdvantage = (hero: string) => {
  switch (hero) {
    case 'anvar':
      return 'Anvar possui um sexto sentido avisando-o de ataques! Algumas vezes vai encontrar uma criatura (ou armadilha) que pode surpreendê-lo e infligir dano antes que você possa agir. Anvar não pode ser surpreendido. Então, se o parágrafo o instruir a perder pontos de ENERGIA, ou caso se veja preso de alguma forma por ser surpreendido, Anvar não sofre nenhum dano.';
    case 'braxus':
      return 'O talento de Braxus é sua versatilidade. Ele pode usar qualquer arma ou proteção que outros aventureiros não podem. Portanto, ele não sofre nenhuma desvantagem que outros aventureiros têm (veja Desvantagens a seguir).';
    case 'restolho':
      return 'Restolho tem um conhecimento especial sobre como lutar contra alguns monstros do subterrâneo. Ao confrontar uma criatura com a palavra "Pedra" no nome (como "estátua de pedra" ou "golem de pedra"), Restolho acrescenta 2 à sua Força de Ataque.';
    case 'sallazar':
      return 'Sallazar é muito perceptivo e minucioso. Sempre que precisar Testar sua Percepção, pode subtrair 2 do resultado. Também é capaz de ler tomos mágicos especiais e entende detalhes de runas mágicas que outros personagens não entendem. Além disso, Sallazar pode lançar qualquer magia do Grimório quantas vezes quiser, desde que tenha PONTOS DE MAGIA suficientes.';
    default:
      return 'Nenhuma vantagem inicial predefinida.';
  }
};

const getHeroDisadvantage = (hero: string) => {
  switch (hero) {
    case 'anvar':
      return 'Anvar fica bastante desconfortável vestindo qualquer armadura metálica (cota de malha ou armadura de placa de aço). Como Anvar, você não pode vestir placas de aço e, apesar de tolerar cotas de malha (e vesti-las), não ganhará nenhum bônus na sua Força de Ataque por isso. Embora possa usar arcos longos e flechas, não teve treinamento no uso de bestas; se usar alguma, deve subtrair 2 de sua Força de Ataque.';
    case 'braxus':
      return 'Braxus é tão versátil que não possui essas desvantagens! Caso jogue com um dos outros, lembre-se de anotar a desvantagem no espaço apropriado da ficha de aventura.';
    case 'restolho':
      return 'Restolho não pode usar espadas de duas mãos e arcos longos — são grandes demais para ele. Pode usar cotas de malha, mas só pode usar uma armadura de placas de aço de tamanho anão (se o texto não disser que aquela armadura de placas de aço é feita para anões, Restolho não pode usá-la).';
    case 'sallazar':
      return 'Sallazar possui problemas similares, mas de forma mais severa: não pode usar cotas de malha nem placas de aço (mal conseguiria se mexer com o peso!) Além disso, não pode usar bestas, arcos longos ou espadas de duas mãos. Ele precisa ter ao menos uma mão livre para conjurar feitiços!';
    default:
      return 'Nenhuma desvantagem inicial predefinida.';
  }
};

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
    resetKey,
    checkAdminStatus,
    gamebook,
    soundEnabled,
    musicEnabled,
    musicVolume,
    toggleSound,
    toggleMusic,
    setMusicVolume,
    attributes,
    newsList,
    loadNewsList,
    gold,
    monsters,
    activeSheetLogs,
    youtubeSettings,
    loadYoutubeSettings,
    getModifiedAttribute,
    inventory,
    unlockedAchievements,
    setAttribute,
  } = useSheetStore();

  const [inspectMode, setInspectMode] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  // Load achievements on mount or user changes
  const loadAchievements = useSheetStore(state => state.loadAchievements);
  useEffect(() => {
    loadAchievements();
  }, [user, loadAchievements]);

  // Reset inspectMode when activeSheetId changes
  useEffect(() => {
    setInspectMode(false);
  }, [activeSheetId]);

  const effectiveHero = (attributes.selectedHero === 'personalizado'
    ? (attributes.customArchetype || 'anvar')
    : attributes.selectedHero) || '';

  const modifiedEnergy = getModifiedAttribute('energy');
  const modifiedSkill = getModifiedAttribute('skill');
  const modifiedLuck = getModifiedAttribute('luck');

  const isNewSheet = attributes.skill.initial === 0 && attributes.energy.initial === 0 && attributes.luck.initial === 0;

  // Cálculos de elegibilidade de conclusão do livro jogo
  const lastParagraph = String(attributes.currentSection || '').trim();
  const isVictoryParagraph = !!(gamebook && victoryParagraphs[gamebook]?.includes(lastParagraph));
  const totalCombats = (activeSheetLogs || []).filter(l => l.event_type === 'combat').length;
  const hasCombat = totalCombats >= 1;

  const uniqueVisited = new Set(
    (activeSheetLogs || [])
      .filter(l => l.event_type === 'section_visit' && l.event_data?.section)
      .map(l => String(l.event_data.section))
  );
  const paragraphsVisited = uniqueVisited.size;
  const hasMinParagraphs = paragraphsVisited >= 20;

  let playTimeFromLogs = 0;
  if (activeSheetLogs && activeSheetLogs.length > 1) {
    const times = activeSheetLogs.map(l => new Date(l.created_at).getTime());
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    playTimeFromLogs = Math.floor((maxTime - minTime) / 60000);
  }
  const playTimeMinutes = Math.max(attributes.playTimeMinutes || 0, playTimeFromLogs);
  const hasMinPlayTime = playTimeMinutes >= 30;

  const actionsCount = (activeSheetLogs || []).length;
  const hasMinActions = actionsCount >= 30;

  const evidenceScore = [
    hasCombat,
    hasMinParagraphs,
    hasMinPlayTime,
    hasMinActions,
  ].filter(Boolean).length;

  const canCompleteBook = isVictoryParagraph && evidenceScore >= 2;

  const unlockedCount = ACHIEVEMENTS.filter((a) => (unlockedAchievements || []).some(u => u.achievement_id === a.id)).length;
  const totalCount = ACHIEVEMENTS.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100) || 0;

  // Load user session on initial render (AuthStatus also handles it)
  useEffect(() => {
    loadNewsList();
    loadYoutubeSettings();
    if (typeof window !== 'undefined') {
      const redirect = sessionStorage.getItem('login_redirect');
      if (redirect) {
        sessionStorage.removeItem('login_redirect');
        window.location.href = redirect;
        return;
      }
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const activeUser = session?.user ?? null;
      if (activeUser) {
        setUser({
          id: activeUser.id,
          email: activeUser.email,
          provider: activeUser.app_metadata.provider,
          user_metadata: activeUser.user_metadata,
        });

        // Update login streak and session profile
        const store = useSheetStore.getState();
        await store.updateUserSession();

        if (activeUser.app_metadata.provider === 'google') {
          loadSheetsList();
        }
        checkAdminStatus();
      } else {
        clearLocalState();
      }
    });
  }, []);

  // Synchronize audio engine preferences
  useEffect(() => {
    audio.setEnabled(soundEnabled);
    music.setEnabled(musicEnabled);
    music.setVolume(musicVolume);
  }, [soundEnabled, musicEnabled, musicVolume]);

  // Manage BGM depending on active screen/sheet
  useEffect(() => {
    const getTrackForGamebook = (bookName: string | undefined): string => {
      if (!bookName) return '/audios/16 bits/POL-the-foyer-short.wav';
      switch (bookName) {
        case 'O Feiticeiro da Montanha de Fogo':
          return '/audios/16 bits/POL-misty-dungeon-short.wav';
        case 'A Masmorra da Morte':
          return '/audios/16 bits/POL-boring-cavern-short.wav';
        case 'A Cripta do Vampiro':
          return '/audios/16 bits/POL-evil-throne-short.wav';
        case 'A Cidadela do Caos':
          return '/audios/16 bits/POL-chamber-of-secrets-short.wav';
        case 'O Templo do Terror':
          return '/audios/16 bits/POL-sacred-temple-short.wav';
        case 'A Floresta da Destruição':
          return '/audios/16 bits/POL-holy-forest-short.wav';
        case 'Exércitos da Morte':
          return '/audios/16 bits/POL-the-hordes-advance-short.wav';
        default:
          return '/audios/16 bits/POL-jungle-hideout-short.wav';
      }
    };

    if (!activeSheetId) {
      music.play('/audios/16 bits/POL-the-foyer-short.wav');
    } else {
      const track = getTrackForGamebook(gamebook);
      music.play(track);
    }
  }, [activeSheetId, gamebook]);

  // Play Victory/Defeat SFX when status changes
  const sheetStatus = useSheetStore(state => state.status);
  useEffect(() => {
    if (activeSheetId) {
      if (sheetStatus === 'victory') {
        audio.playVictory();
      } else if (sheetStatus === 'defeat') {
        audio.playDefeat();
      }
    }
  }, [sheetStatus, activeSheetId]);

  // Music duration stats tracker (cumulative and continuous)
  const [continuousMusicSeconds, setContinuousMusicSeconds] = useState(0);

  useEffect(() => {
    if (!musicEnabled || !activeSheetId) {
      setContinuousMusicSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      const store = useSheetStore.getState();

      // Increment cumulative music listening stat (every 10s)
      store.incrementStat('musicTimeMs', 10000);

      setContinuousMusicSeconds(prev => {
        const next = prev + 10;
        if (next >= 300) { // 5 minutes continuous
          store.unlockAchievement('secret_music_appreciator');
        }
        return next;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [musicEnabled, activeSheetId, activeTab]); // Reset continuous count if tab or sheet changes!

  // Track total game play time (increments every minute if a sheet is open)
  useEffect(() => {
    if (!user || !activeSheetId) return;

    const interval = setInterval(() => {
      const store = useSheetStore.getState();
      store.incrementPlayTime();
      store.incrementSheetPlayTime();
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, [user, activeSheetId]);

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

  // Função para voltar ao painel solicitando confirmação do parágrafo
  const handleBackToDashboard = async () => {
    if (activeSheetId) {
      const currentSection = useSheetStore.getState().attributes.currentSection || '';
      const sectionInput = window.prompt(
        'Antes de voltar, em qual parágrafo (número) você parou a aventura?',
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

    // Increment sheetsExported stat
    state.incrementStat('sheetsExported');
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

        // Increment sheetsImported stat
        store.incrementStat('sheetsImported');
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
  const showLogin = !user || user.provider !== 'google';
  const showDashboard = !!user && user.provider === 'google' && !activeSheetId;
  const showSheet = !!user && user.provider === 'google' && !!activeSheetId;
  const activeSheetTitle = activeSheetId
    ? sheetsList.find(s => s.id === activeSheetId)?.title
    : null;

  // Conquistas Recentes da Comunidade
  const [recentAchievements, setRecentAchievements] = useState<Array<{
    display_name: string;
    achievement_title: string;
    achievement_icon: string;
    unlocked_at: string;
  }>>([
    { display_name: 'Arthur', achievement_title: 'Primeiro Sangue', achievement_icon: '⚔️', unlocked_at: new Date(Date.now() - 1000 * 60 * 12).toISOString() },
    { display_name: 'Melinda', achievement_title: 'A Sorte Sorri', achievement_icon: '🍀', unlocked_at: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
    { display_name: 'Thorin', achievement_title: 'Conquistador da Montanha de Fogo', achievement_icon: '🏆', unlocked_at: new Date(Date.now() - 1000 * 60 * 120).toISOString() }
  ]);

  const formatTimeAgo = (dateString: string) => {
    try {
      const diffMs = Date.now() - new Date(dateString).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Agora mesmo';
      if (diffMins < 60) return `Há ${diffMins} min`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `Há ${diffHours} h`;
      return formatDate(dateString);
    } catch {
      return 'Recentemente';
    }
  };

  useEffect(() => {
    if (!showLogin) return;

    const fetchRecentAchievements = async () => {
      try {
        const { data, error } = await supabase.rpc('get_recent_achievements');
        if (!error && data && data.length > 0) {
          const mapped = data.map((item: any) => {
            const def = ACHIEVEMENTS.find(a => a.id === item.achievement_id);
            return {
              display_name: item.display_name,
              achievement_title: def ? def.title : 'Nova Conquista',
              achievement_icon: def ? def.icon : '🏆',
              unlocked_at: item.unlocked_at
            };
          });
          setRecentAchievements(mapped);
        } else {
          const { data: rawAchievements, error: tableError } = await supabase
            .from('user_achievements')
            .select('user_id, achievement_id, unlocked_at')
            .order('unlocked_at', { ascending: false })
            .limit(5);

          if (!tableError && rawAchievements && rawAchievements.length > 0) {
            const userIds = Array.from(new Set(rawAchievements.map(a => a.user_id)));

            const { data: profiles } = await supabase
              .from('user_profiles')
              .select('id, display_name')
              .in('id', userIds);

            const profileMap = new Map(profiles?.map(p => [p.id, p.display_name]) || []);

            const mapped = rawAchievements.map(a => {
              const def = ACHIEVEMENTS.find(ach => ach.id === a.achievement_id);
              const displayName = profileMap.get(a.user_id) || 'Aventureiro';
              const cleanName = displayName.includes('@') ? displayName.split('@')[0] : displayName;

              return {
                display_name: cleanName,
                achievement_title: def ? def.title : 'Nova Conquista',
                achievement_icon: def ? def.icon : '🏆',
                unlocked_at: a.unlocked_at
              };
            });
            setRecentAchievements(mapped);
          }
        }
      } catch (err) {
        console.warn('Erro ao carregar conquistas recentes:', err);
      }
    };

    fetchRecentAchievements();
    const interval = setInterval(fetchRecentAchievements, 30000);
    return () => clearInterval(interval);
  }, [showLogin]);

  // Rastreamento de Presença em Tempo Real (Supabase Presence)
  useEffect(() => {
    if (!user) return;

    const channel = supabase.channel('online-players', {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    channel.subscribe(async (statusSubscription) => {
      if (statusSubscription === 'SUBSCRIBED') {
        const name = user.user_metadata?.full_name || user.email || 'Jogador Anônimo';

        let displayGamebook = 'Menu Principal';
        let displaySection = '-';
        let displayStatus = '-';

        if (showSheet) {
          if (isNewSheet) {
            displayGamebook = `Criando Personagem: ${gamebook}`;
          } else {
            displayGamebook = gamebook || 'O Feiticeiro da Montanha de Fogo';
            displaySection = attributes.currentSection || 'Início';
            displayStatus = sheetStatus || 'playing';
          }
        }

        await channel.track({
          id: user.id,
          name,
          email: user.email,
          gamebook: displayGamebook,
          section: displaySection,
          status: displayStatus,
          online_at: new Date().toISOString(),
        });
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, [user, gamebook, attributes.currentSection, showSheet, sheetStatus, isNewSheet]);

  const renderMobileAttributeCard = (label: string, attrKey: 'skill' | 'energy' | 'luck' | 'magic' | 'faith' | 'fear' | 'willpower', desc: string) => {
    const attr = attributes[attrKey] || { initial: 0, current: 0 };
    const modifiedCurrent = getModifiedAttribute(attrKey);
    const modifier = modifiedCurrent - attr.current;
    const isEnergyLow = attrKey === 'energy' && modifiedCurrent > 0 && modifiedCurrent <= 4;
    const isFearHigh = attrKey === 'fear' && attr.initial > 0 && modifiedCurrent > 0 && modifiedCurrent >= attr.initial - 2;
    const isAlert = isEnergyLow || isFearHigh;
    const isMedo = gamebook === 'Encontro Marcado com o M.E.D.O.';
    const superpower = attributes.superpower;

    const rollInitialMobile = () => {
      if (isMedo && attrKey === 'skill' && superpower === 'superforca') {
        setAttribute('skill', 13, true);
        setAttribute('skill', 13, false);
        return;
      }
      audio.playDiceRoll();
      let roll = 0;
      if (attrKey === 'energy') {
        roll = (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1) + 12;
      } else if (gamebook === 'A Cidadela do Caos' && attrKey === 'magic') {
        roll = (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1) + 6;
      } else if (gamebook === 'A Cripta do Vampiro' && attrKey === 'faith') {
        roll = (Math.floor(Math.random() * 6) + 1) + 3;
      } else if (gamebook === 'A Mansão do Inferno' && attrKey === 'fear') {
        roll = Math.floor(Math.random() * 6) + 1 + 6;
      } else if (gamebook === 'A Lenda de Zagor' && attrKey === 'willpower') {
        roll = Math.floor(Math.random() * 6) + 1 + 6;
      } else {
        roll = Math.floor(Math.random() * 6) + 1 + 6;
      }

      if (attrKey === 'fear') {
        setAttribute(attrKey, roll, true);
        setAttribute(attrKey, 0, false);
      } else {
        setAttribute(attrKey, roll, true);
        setAttribute(attrKey, roll, false);
      }
    };

    const dec = () => {
      audio.playBlip();
      setAttribute(attrKey, attr.current - 1, false);
    };

    const inc = () => {
      audio.playBlip();
      setAttribute(attrKey, attr.current + 1, false);
    };

    return (
      <div className={`p-4 border rounded-2xl flex flex-col gap-2 transition-all relative ${isAlert
          ? 'animate-pulse ring-2 ring-red-500/80 border-red-500 bg-red-950/20'
          : (isPapyrus ? 'bg-[#FDF6E3] border-[#5C4033]/30 text-[#2D1D16]' : 'bg-[#1a202c]/50 border-slate-700/60 text-slate-200')
        }`}>
        <div className="flex items-center justify-between">
          <div className="flex-1 pr-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wide flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
              {label}
              <span className={`text-[9px] font-normal lowercase tracking-normal opacity-60 ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-400'}`}>
                (inicial: {attr.initial})
              </span>
            </h4>
            <p className={`text-[10px] font-sans opacity-75 mt-0.5 leading-tight ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-400'}`}>
              {desc}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={dec}
              className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold cursor-pointer active:scale-90 transition-all ${isPapyrus ? 'border-[#5C4033] hover:bg-[#5C4033] hover:text-[#EAD8B8]' : 'border-slate-700 hover:bg-slate-800 text-slate-350 bg-slate-900/50'
                }`}
            >
              -
            </button>
            <div className="text-lg font-extrabold flex items-baseline gap-0.5 min-w-[24px] justify-center">
              <span>{modifiedCurrent}</span>
              {modifier !== 0 && (
                <span className={`text-[9px] font-extrabold ${(attrKey === 'fear' ? modifier < 0 : modifier > 0)
                    ? 'text-green-500'
                    : 'text-red-500'
                  }`}>
                  {modifier > 0 ? `+${modifier}` : modifier}
                </span>
              )}
            </div>
            <button
              onClick={inc}
              className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold cursor-pointer active:scale-90 transition-all ${isPapyrus ? 'border-[#5C4033] hover:bg-[#5C4033] hover:text-[#EAD8B8]' : 'border-slate-700 hover:bg-slate-800 text-slate-350 bg-slate-900/50'
                }`}
            >
              +
            </button>

            {/* Roll initial button */}
            {!(isMedo && attrKey === 'skill' && superpower === 'superforca') &&
              !(gamebook === 'A Lenda de Zagor' && attributes.selectedHero && attributes.selectedHero !== 'personalizado') && (
                <button
                  onClick={rollInitialMobile}
                  className={`p-1 rounded-full border border-transparent hover:border-current active:scale-90 transition-all ${isPapyrus ? 'text-[#C5A059]' : 'text-cyan-400'
                    }`}
                  title="Rolar Inicial"
                >
                  <RotateCcw size={12} />
                </button>
              )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <main
      className={`min-h-screen py-6 px-4 md:py-12 md:px-8 transition-colors duration-300 font-serif ${isPapyrus ? 'theme-papyrus' : 'theme-night'
        }`}
    >
      <div
        className={`w-full mx-auto transition-all duration-300 ${showSheet || showLogin
            ? 'max-w-[1280px] xl:max-w-[1400px]'
            : 'max-w-[1024px]'
          } ${showSheet
            ? 'p-0 md:p-8 border-0 md:border ' + (isPapyrus ? 'md:bg-[#EAD8B8] md:border-[#C5A059] md:shadow-2xl' : 'md:bg-[#1a202c] md:border-[#4a5568] md:shadow-2xl')
            : 'p-4 sm:p-8 border shadow-2xl ' + (isPapyrus ? 'theme-papyrus-card' : 'theme-night-card')
          }`}
      >
        {/* ── Cabeçalho Desktop ── */}
        <header
          className={`hidden md:flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b-2 ${isPapyrus ? 'border-[#5C4033] text-[#2D1D16]' : 'border-[#4a5568] text-[#cbd5e0]'
            }`}
        >
          <div className="text-center sm:text-left">
            {/* Title — clicking it when in a sheet goes back to dashboard */}
            <h1
              className={`text-4xl sm:text-5xl font-bold uppercase tracking-widest ${showSheet ? 'cursor-pointer hover:opacity-80 transition' : ''}`}
              onClick={() => showSheet && handleBackToDashboard()}
              title={showSheet ? 'Voltar ao painel de fichas' : undefined}
            >
              Fichas de Aventuras Fantásticas
            </h1>
            {/* Sub-header: character name, gamebook, sync status and auth */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
              {showSheet && activeSheetTitle && (
                <>
                  {/* Character name */}
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs uppercase tracking-widest font-semibold opacity-60 ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-400'}`}>
                      Personagem
                    </span>
                    <span className={`text-xs uppercase font-bold tracking-widest px-2 py-0.5 border ${isPapyrus
                      ? 'bg-[#5C4033]/10 text-[#2D1D16] border-[#5C4033]/40'
                      : 'bg-slate-800 text-slate-100 border-slate-600'
                      }`}>
                      🧙 {activeSheetTitle}
                    </span>
                  </div>

                  {/* Separator */}
                  <span className={`hidden sm:block text-xs opacity-30 ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-500'}`}>|</span>

                  {/* Gamebook */}
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs uppercase tracking-widest font-semibold opacity-60 ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-400'}`}>
                      Livrojogo
                    </span>
                    <span className={`text-xs font-bold italic px-2 py-0.5 border ${isPapyrus
                      ? 'bg-[#8B4513]/10 text-[#6B3A2A] border-[#8B4513]/30'
                      : 'bg-cyan-950/50 text-cyan-300 border-cyan-700/50'
                      }`}>
                      📚 {gamebook || 'O Feiticeiro da Montanha de Fogo'}
                      {BOOKS_WITH_SUGGESTIONS.includes((gamebook || 'O Feiticeiro da Montanha de Fogo') as any) && ' 👾'}
                    </span>
                  </div>

                  {/* Selected Hero for Zagor */}
                  {gamebook === 'A Lenda de Zagor' && attributes.selectedHero && (
                    <>
                      {/* Separator */}
                      <span className={`hidden sm:block text-xs opacity-30 ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-500'}`}>|</span>

                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs uppercase tracking-widest font-semibold opacity-60 ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-400'}`}>
                          Herói
                        </span>
                        <span className={`text-xs font-bold uppercase px-2 py-0.5 border ${isPapyrus
                          ? 'bg-[#8B5A2B]/10 text-[#5C4033] border-[#8B5A2B]/30'
                          : 'bg-indigo-950/50 text-indigo-300 border-indigo-700/50'
                          }`}>
                          🛡️ {attributes.selectedHero === 'sallazar'
                            ? 'Mago Sallazar'
                            : attributes.selectedHero === 'restolho'
                              ? 'Restolho'
                              : attributes.selectedHero === 'anvar'
                                ? 'Anvar'
                                : attributes.selectedHero === 'braxus'
                                  ? 'Braxus'
                                  : `Personalizado (${attributes.customArchetype === 'sallazar' ? 'Mago' : attributes.customArchetype === 'restolho' ? 'Anão' : attributes.customArchetype === 'braxus' ? 'Guerreiro' : attributes.customArchetype === 'anvar' ? 'Bárbaro' : 'Sem Classe'})`}
                        </span>
                      </div>
                    </>
                  )}

                  {/* Separator */}
                  <span className={`hidden sm:block text-xs opacity-30 ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-500'}`}>|</span>
                </>
              )}

              {/* Sync status + Auth always visible */}
              {showSheet && <SyncStatus />}
              <AuthStatus />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {/* Back to Dashboard */}
            {showSheet && (
              <button
                onClick={handleBackToDashboard}
                className="flex items-center gap-1.5 px-2.5 py-1.5 border border-current hover:bg-[#3D2B1F]/10 transition text-xs uppercase font-bold tracking-wider cursor-pointer"
              >
                <ArrowLeft size={12} /> Fichas
              </button>
            )}

            {/* Backup (só visível numa ficha aberta) */}
            {showSheet && (
              <>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 border border-current hover:bg-[#3D2B1F]/10 transition text-xs uppercase font-bold tracking-wider cursor-pointer"
                >
                  <Upload size={12} /> Exportar
                </button>
                <button
                  onClick={handleImport}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 border border-current hover:bg-[#3D2B1F]/10 transition text-xs uppercase font-bold tracking-wider cursor-pointer"
                >
                  <Download size={12} /> Importar
                </button>
              </>
            )}

            {/* Mapa (só visível numa ficha aberta) */}
            {showSheet && (
              <button
                onClick={() => setShowMapModal(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 border border-current hover:bg-[#3D2B1F]/10 transition text-xs uppercase font-bold tracking-wider cursor-pointer"
              >
                <MapIcon size={12} /> Mapa
              </button>
            )}

            {/* Música de Fundo */}
            <div className="flex items-center gap-2 border border-current px-2 py-1 rounded transition hover:bg-current/5">
              <button
                onClick={toggleMusic}
                className="p-1 cursor-pointer transition flex items-center justify-center"
                aria-label={musicEnabled ? "Desativar música" : "Ativar música"}
                title={musicEnabled ? "Mudo (Música)" : "Ativar Música"}
              >
                <Music size={18} className={musicEnabled ? "opacity-100" : "opacity-35"} />
              </button>
              {musicEnabled && (
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={musicVolume}
                  onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                  className="w-16 h-1 cursor-pointer accent-current opacity-70 hover:opacity-100 transition-opacity bg-current/20 rounded-lg appearance-none"
                  title={`Volume: ${Math.round(musicVolume * 100)}%`}
                />
              )}
            </div>

            {/* Efeitos Sonoros */}
            <button
              onClick={toggleSound}
              className="p-1.5 sm:p-2 border border-current hover:bg-[#3D2B1F]/10 rounded cursor-pointer transition flex items-center justify-center"
              aria-label={soundEnabled ? "Desativar efeitos" : "Ativar efeitos"}
              title={soundEnabled ? "Mudo (Efeitos)" : "Ativar Efeitos"}
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            {/* Tema */}
            <button
              onClick={() => setTheme(isPapyrus ? 'night' : 'papyrus')}
              className="p-1.5 sm:p-2 border border-current hover:bg-[#3D2B1F]/10 rounded cursor-pointer transition"
              aria-label="Alternar tema"
            >
              {isPapyrus ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Concluir Aventura (só numa ficha aberta em jogo) */}
            {showSheet && sheetStatus === 'playing' && (
              <button
                onClick={async () => {
                  if (window.confirm('Você realmente completou com sucesso este livro-jogo? Sua vitória será gravada nas estatísticas!')) {
                    setCelebrating(true);

                    audio.playVictory();

                    const end = Date.now() + 3500;
                    const colors = ['#bb0000', '#ffffff', '#facc15', '#f59e0b', '#3b82f6'];

                    (function frame() {
                      confetti({
                        particleCount: 5,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0 },
                        colors: colors
                      });
                      confetti({
                        particleCount: 5,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1 },
                        colors: colors
                      });

                      if (Date.now() < end) {
                        requestAnimationFrame(frame);
                      }
                    }());

                    setTimeout(async () => {
                      setCelebrating(false);
                      const store = useSheetStore.getState();
                      await store.setStatus('victory');
                    }, 3500);
                  }
                }}
                disabled={!canCompleteBook}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 border transition text-xs uppercase font-bold tracking-wider ${canCompleteBook
                  ? 'border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white cursor-pointer'
                  : 'opacity-55 cursor-not-allowed border-gray-500 text-gray-500 bg-transparent'
                  }`}
              >
                <Trophy size={12} /> Concluir Livro
              </button>
            )}

            {/* Reset (só numa ficha aberta) */}
            {showSheet && (
              <button
                onClick={() => {
                  if (window.confirm('Deseja realmente resetar sua ficha? Essa ação é irreversível.')) {
                    resetSheet();
                  }
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition text-xs uppercase font-bold tracking-wider cursor-pointer"
              >
                <RotateCcw size={12} /> Resetar
              </button>
            )}
          </div>
        </header>

        {/* ── Tela de Login ── */}
        {showLogin && (
          <div className="flex flex-col gap-8 py-10 px-4 animate-fade-in">
            {/* Barra de Estatísticas da Comunidade */}
            <div className={`w-full p-4 border-2 rounded-sm flex flex-col md:flex-row items-center justify-around gap-6 text-center ${isPapyrus
              ? 'border-[#C5A059] bg-[#EAD8B8]/30 text-[#2D1D16]'
              : 'border-slate-800 bg-slate-900/40 text-slate-300 shadow-[0_0_20px_rgba(0,0,0,0.2)]'
              }`}>
              <div className="flex items-center gap-2.5">
                <span className="text-2xl select-none">⚔️</span>
                <div className="text-left md:text-center">
                  <div className="font-extrabold text-base tracking-wide">312</div>
                  <div className={`text-[9px] uppercase font-bold tracking-widest opacity-75 ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-400'}`}>Combates via Ficha</div>
                </div>
              </div>
              <div className="hidden md:block w-px h-8 bg-current opacity-20" />

              <div className="flex items-center gap-2.5">
                <span className="text-2xl select-none">📚</span>
                <div className="text-left md:text-center">
                  <div className="font-extrabold text-base tracking-wide">85</div>
                  <div className={`text-[9px] uppercase font-bold tracking-widest opacity-75 ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-400'}`}>Fichas Iniciadas</div>
                </div>
              </div>
              <div className="hidden md:block w-px h-8 bg-current opacity-20" />

              <div className="flex items-center gap-2.5">
                <span className="text-2xl select-none">🏆</span>
                <div className="text-left md:text-center">
                  <div className="font-extrabold text-base tracking-wide">12</div>
                  <div className={`text-[9px] uppercase font-bold tracking-widest opacity-75 ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-400'}`}>Fichas Concluídas</div>
                </div>
              </div>
              <div className="hidden md:block w-px h-8 bg-current opacity-20" />

              <div className="flex items-center gap-2.5">
                <span className="text-2xl select-none">👥</span>
                <div className="text-left md:text-center">
                  <div className="font-extrabold text-base tracking-wide">24</div>
                  <div className={`text-[9px] uppercase font-bold tracking-widest opacity-75 ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-400'}`}>Aventureiros com Ficha</div>
                </div>
              </div>
            </div>

            {/* Grid de Conteúdo Principal */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Coluna da Esquerda: Login e Novidades */}
              <div className="lg:col-span-5 flex flex-col gap-6 w-full justify-start">
                {/* Bloco de Login */}
                <div className="flex flex-col items-center justify-center text-center w-full">
                  {user && user.provider !== 'google' ? (
                    isPapyrus ? (
                      <div className="w-full flex flex-col items-center gap-6 p-6 sm:p-10 border-2 border-[#5C4033] bg-[#EAD8B8]/30 shadow-inner rounded-sm text-[#2D1D16]">
                        <h2 className="text-3xl font-extrabold uppercase tracking-widest text-red-800">Sessão Administrativa</h2>
                        <div className="w-24 h-0.5 bg-[#C5A059]"></div>
                        <p className="text-sm font-serif leading-relaxed opacity-90 max-w-[340px]">
                          Você está conectado com e-mail/senha. O jogo de fichas é exclusivo para acesso via Google.
                        </p>
                        <a
                          href="/painel"
                          className="mt-4 flex items-center justify-center gap-3 w-full max-w-[280px] px-6 py-3 border-2 border-[#5C4033] text-[#2D1D16] bg-[#EAD8B8] hover:bg-[#2D1D16] hover:text-[#EAD8B8] active:scale-95 transition-all duration-300 uppercase text-xs font-bold tracking-widest shadow-md cursor-pointer text-center"
                        >
                          Ir para o Painel
                        </a>
                        <button
                          onClick={async () => {
                            await supabase.auth.signOut();
                            clearLocalState();
                          }}
                          className="text-xs font-sans tracking-wide text-[#5C4033] hover:underline opacity-80 cursor-pointer"
                        >
                          Fazer Logout (Desconectar)
                        </button>
                      </div>
                    ) : (
                      <div className="w-full flex flex-col items-center gap-6 p-6 sm:p-10 border border-red-500/40 bg-slate-900/60 backdrop-blur-md shadow-[0_0_30px_rgba(239,68,68,0.1)] rounded-xl text-slate-300">
                        <div className="w-16 h-16 border border-red-500/40 rounded-full flex items-center justify-center text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)] mb-2 animate-pulse">
                          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <h2 className="text-3xl font-bold uppercase tracking-widest bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                            Painel Conectado
                          </h2>
                          <p className="text-xs uppercase tracking-wider text-red-400/80 mt-1 font-mono font-bold">
                            Acesso de Administrador
                          </p>
                        </div>
                        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
                        <p className="text-sm font-sans leading-relaxed text-[#a0aec0] max-w-[340px]">
                          Você está logado com credenciais administrativas. Para jogar, utilize o painel de gerenciamento ou desconecte para entrar com o Google.
                        </p>
                        <a
                          href="/painel"
                          className="mt-4 flex items-center justify-center gap-3 w-full max-w-[280px] px-6 py-3 border border-red-500/50 text-[#cbd5e0] bg-slate-950 hover:bg-red-500/10 hover:border-red-400 active:scale-95 transition-all duration-300 uppercase text-xs font-mono font-bold tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] cursor-pointer rounded-lg text-center"
                        >
                          Ir para o Painel
                        </a>
                        <button
                          onClick={async () => {
                            await supabase.auth.signOut();
                            clearLocalState();
                          }}
                          className="text-xs font-mono tracking-wide text-slate-500 hover:text-slate-300 hover:underline cursor-pointer"
                        >
                          Desconectar Sessão
                        </button>
                      </div>
                    )
                  ) : isPapyrus ? (
                    <div className="w-full flex flex-col items-center gap-5 p-6 sm:p-10 border-2 border-[#C5A059] bg-[#EAD8B8]/30 shadow-inner rounded-sm">
                      <div className="flex items-center justify-center mb-1 drop-shadow-lg">
                        <img src="/logo.png" alt="Logo" className="w-24 h-24 object-contain" />
                      </div>

                      <div className="text-center space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-[#2D1D16] leading-tight">
                          Viva Aventuras Fantásticas com Fichas Online
                        </h2>
                        <div className="w-24 h-0.5 bg-[#C5A059] mx-auto"></div>
                      </div>

                      <div className="w-full max-w-[320px] text-left space-y-2.5 my-1.5 font-serif text-[#5C4033] text-[13px] bg-[#5C4033]/5 p-4 border border-[#5C4033]/20 rounded-sm">
                        <div className="flex items-center gap-2.5">
                          <span className="text-base select-none">🧙</span>
                          <span className="font-bold">Gerencie atributos e itens de sua ficha.</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-base select-none">⚔️</span>
                          <span className="font-bold">Controle combates e role dados na ficha.</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-base select-none">🏆</span>
                          <span className="font-bold">Registre conquistas e histórico de aventuras.</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-base select-none">☁️</span>
                          <span className="font-bold">Sincronize suas fichas de forma segura na nuvem.</span>
                        </div>
                      </div>

                      <button
                        onClick={handleGoogleLogin}
                        className="mt-2 flex items-center justify-center gap-3 w-full max-w-[280px] px-6 py-3 border-2 border-[#5C4033] text-[#2D1D16] bg-[#EAD8B8] hover:bg-[#2D1D16] hover:text-[#EAD8B8] active:scale-95 transition-all duration-300 uppercase text-xs font-bold tracking-widest shadow-md cursor-pointer"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Conectar via Google
                      </button>

                      <div className="w-full max-w-[320px] mt-4 border-t border-[#5C4033]/20 pt-3 text-[10px] text-center leading-relaxed text-[#5C4033]/70 font-sans italic">
                        <strong>Aviso Legal:</strong> Este aplicativo é um assistente digital (ficha interativa) para uso com os livros-jogos físicos ou digitais da série Fighting Fantasy. O conteúdo dos livros e suas regras completas não estão inclusos.
                      </div>
                    </div>
                  ) : (
                    <div className="w-full flex flex-col items-center gap-5 p-6 sm:p-10 border border-[#4a5568]/50 bg-slate-900/60 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.1)] rounded-xl">
                      <div className="w-16 h-16 border border-cyan-500/40 rounded-full flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] mb-1 animate-pulse">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                      </div>

                      <div className="text-center space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-widest bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
                          Sua Jornada Começa Aqui
                        </h2>
                        <p className="text-[10px] uppercase tracking-wider text-cyan-400/80 font-mono font-bold">
                          Viva Aventuras Fantásticas com Fichas Online
                        </p>
                        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto"></div>
                      </div>

                      <div className="w-full max-w-[320px] text-left space-y-2.5 my-1.5 font-sans text-slate-300 text-[13px] bg-slate-950/40 p-4 border border-[#4a5568]/30 rounded-lg">
                        <div className="flex items-center gap-2.5">
                          <span className="text-base text-cyan-400 select-none">🧙</span>
                          <span className="font-medium">Gerencie atributos e itens de sua ficha.</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-base text-cyan-400 select-none">⚔️</span>
                          <span className="font-medium">Controle combates e role dados na ficha.</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-base text-cyan-400 select-none">🏆</span>
                          <span className="font-medium">Registre conquistas e histórico de aventuras.</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-base text-cyan-400 select-none">☁️</span>
                          <span className="font-medium">Sincronize suas fichas de forma segura na nuvem.</span>
                        </div>
                      </div>

                      <button
                        onClick={handleGoogleLogin}
                        className="mt-2 flex items-center justify-center gap-3 w-full max-w-[280px] px-6 py-3 border border-cyan-500/50 text-[#cbd5e0] bg-slate-950 hover:bg-cyan-500/10 hover:border-cyan-400 active:scale-95 transition-all duration-300 uppercase text-xs font-mono font-bold tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] cursor-pointer rounded-lg"
                      >
                        <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Autenticar Google
                      </button>

                      <div className="w-full max-w-[320px] mt-4 border-t border-slate-700/50 pt-3 text-[10px] text-center leading-relaxed text-slate-400 font-sans italic">
                        <strong>Aviso Legal:</strong> Este aplicativo é um assistente digital (ficha interativa) para uso com os livros-jogos físicos ou digitais da série Fighting Fantasy. O conteúdo dos livros e suas regras completas não estão inclusos.
                      </div>
                    </div>
                  )}
                </div>

                {/* Bloco de Novidades da Guilda */}
                <div className="w-full text-left flex-1">
                  <div className={`${isPapyrus
                    ? 'border-2 border-[#C5A059] bg-[#EAD8B8]/30 shadow-inner rounded-sm p-6 sm:p-10 text-[#2D1D16]'
                    : 'border border-[#4a5568]/50 bg-slate-900/60 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.1)] rounded-xl p-6 sm:p-10 text-slate-300'
                    } h-full flex flex-col gap-6`}>
                    <h3 className={`text-base font-extrabold uppercase tracking-widest ${isPapyrus ? 'text-[#8B4513]' : 'text-cyan-400'} border-b border-current/10 pb-2 flex items-center gap-1.5`}>
                      📢 Novidades da Guilda
                    </h3>
                    <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                      {newsList.map((item, index) => (
                        <div
                          key={item.id || index}
                          className={`space-y-1 ${index > 0 ? 'border-t border-current/5 pt-3' : ''}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-[9px] font-sans font-bold uppercase tracking-wider px-1.5 py-0.5 ${getCategoryBadgeStyle(item.category, isPapyrus)}`}>
                              {item.category}
                            </span>
                            <span className={`text-[9px] font-sans opacity-60 ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-400'}`}>
                              📅 {formatDate(item.date)}
                            </span>
                          </div>
                          <h4 className={`font-bold text-xs uppercase tracking-wide ${isPapyrus ? 'text-[#2D1D16]' : 'text-slate-200'}`}>
                            {item.title}
                          </h4>
                          <p className={`text-[10px] leading-relaxed opacity-85 font-sans ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-400'}`}>
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Coluna da Direita: YouTube Live Stream e Conquistas Recentes */}
              <div className="lg:col-span-7 flex flex-col gap-6 w-full">
                <YouTubeLiveStream />

                {/* Bloco de Conquistas Recentes */}
                <div className="w-full text-left">
                  <div className={`${isPapyrus
                    ? 'border-2 border-[#C5A059] bg-[#EAD8B8]/30 shadow-inner rounded-sm p-6 sm:p-10 text-[#2D1D16]'
                    : 'border border-[#4a5568]/50 bg-slate-900/60 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.1)] rounded-xl p-6 sm:p-10 text-slate-300'
                    } flex flex-col gap-4`}>
                    <h3 className={`text-base font-extrabold uppercase tracking-widest ${isPapyrus ? 'text-[#8B4513]' : 'text-cyan-400'} border-b border-current/10 pb-2 flex items-center gap-1.5`}>
                      🏆 Conquistas Recentes
                    </h3>
                    <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                      {recentAchievements && recentAchievements.length > 0 ? (
                        recentAchievements.map((item, index) => (
                          <div key={index} className={`flex items-start gap-3 ${index > 0 ? 'border-t border-current/5 pt-3' : ''}`}>
                            <span className="text-base select-none">{item.achievement_icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-[11px] font-sans ${isPapyrus ? 'text-[#2D1D16]' : 'text-slate-200'} leading-tight`}>
                                <strong className="font-bold">{item.display_name}</strong> desbloqueou:
                              </p>
                              <p className={`text-xs font-serif font-bold ${isPapyrus ? 'text-[#8B4513]' : 'text-cyan-400'} leading-tight truncate`}>
                                {item.achievement_title}
                              </p>
                              <p className={`text-[9px] font-sans opacity-60 ${isPapyrus ? 'text-[#5C4033]' : 'text-slate-400'} mt-0.5`}>
                                📅 {formatTimeAgo(item.unlocked_at)}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-[10px] opacity-60 italic text-center py-2">Nenhuma conquista recente registrada.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Dashboard de Fichas ── */}
        {showDashboard && <SheetDashboard />}

        {/* ── Conteúdo da Ficha Ativa ── */}
        {showSheet && (
          isNewSheet ? (
            <CharacterCreation />
          ) : (
            <div className="animate-fade-in space-y-6">
              {/* Alerta de Energia Baixa */}
              {modifiedEnergy > 0 && modifiedEnergy <= 4 && (
                <div className={`p-4 border-2 animate-pulse flex items-center justify-between gap-4 ${isPapyrus
                  ? 'border-red-900 bg-red-900/10 text-red-955 shadow-md'
                  : 'border-red-600 bg-red-950/20 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.15)] rounded-lg'
                  }`}>
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert size={20} className="text-red-500 shrink-0" />
                    <div className="text-left font-sans">
                      <p className="text-xs uppercase font-extrabold tracking-wider">⚠️ Energia Criticamente Baixa! ({modifiedEnergy} / {attributes.energy.initial})</p>
                      <p className="text-[10px] opacity-90 mt-0.5">O perigo espreita a cada esquina. Consuma Provisões ou use magias de cura imediatamente!</p>
                    </div>
                  </div>
                </div>
              )}

              {(sheetStatus === 'victory' || sheetStatus === 'defeat') && !inspectMode ? (
                /* ── Tela Especial de Fim de Jogo ── */
                sheetStatus === 'victory' ? (
                  /* 🏆 TELA DE VITÓRIA 🏆 */
                  <div className={`p-8 text-center border-2 rounded-xl flex flex-col gap-6 animate-fade-in ${isPapyrus
                    ? 'border-[#5C4033] bg-[#EAD8B8]/30 text-[#2D1D16]'
                    : 'border-emerald-500/30 bg-slate-900/80 text-slate-300 shadow-[0_0_50px_rgba(16,185,129,0.15)]'
                    }`}>
                    <Trophy size={72} className="text-yellow-500 animate-bounce mx-auto filter drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]" />
                    <div className="space-y-2">
                      <h2 className={`text-3xl font-extrabold uppercase tracking-widest ${isPapyrus ? 'text-[#8B4513]' : 'text-emerald-400'}`}>
                        Vitória Gloriosa!
                      </h2>
                      <p className="text-sm font-sans max-w-md mx-auto opacity-90">
                        Sua lenda foi escrita nas estrelas! Você concluiu com sucesso o livro-jogo: <strong className="italic">{gamebook || 'O Feiticeiro da Montanha de Fogo'}</strong>.
                      </p>
                    </div>

                    <div className="w-24 h-0.5 bg-current/20 mx-auto"></div>

                    {/* Resumo das Estatísticas */}
                    <div className={`max-w-md mx-auto w-full p-4 border border-current/10 font-sans text-xs space-y-2.5 ${isPapyrus ? 'bg-[#EAD8B8]/40' : 'bg-slate-950/50 rounded-lg'
                      }`}>
                      <h3 className="font-bold uppercase tracking-wider text-center border-b border-current/10 pb-1.5 mb-2">Resumo da Jornada</h3>
                      <div className="flex justify-between">
                        <span className="opacity-70">Personagem:</span>
                        <span className="font-bold">{activeSheetTitle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-70">Último Parágrafo Visitado:</span>
                        <span className="font-mono font-bold">#{attributes.currentSection || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-70">Habilidade / Energia / Sorte Final:</span>
                        <span className="font-bold">{modifiedSkill} / {modifiedEnergy} / {modifiedLuck}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-70">Moedas de Ouro Acumuladas:</span>
                        <span className="font-bold">{gold} 🪙</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-70">Inimigos Derrotados em Combate:</span>
                        <span className="font-bold">{monsters.filter((m: any) => m.status === 'defeated').length} ⚔️</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto w-full mt-4">
                      <button
                        onClick={() => setInspectMode(true)}
                        className={`flex-1 py-3 text-xs uppercase font-bold tracking-wider cursor-pointer border hover:bg-current/5 transition-all rounded ${isPapyrus ? 'border-[#5C4033] text-[#2D1D16]' : 'border-slate-700 text-slate-300'
                          }`}
                      >
                        📖 Ver Ficha
                      </button>
                      <button
                        onClick={async () => {
                          const store = useSheetStore.getState();
                          await store.setStatus('playing');
                        }}
                        className={`flex-1 py-3 text-xs uppercase font-bold tracking-wider cursor-pointer border hover:bg-current/5 transition-all rounded ${isPapyrus ? 'border-[#5C4033] text-[#2D1D16]' : 'border-slate-700 text-slate-300'
                          }`}
                      >
                        ↩️ Retomar
                      </button>
                      <button
                        onClick={() => handleBackToDashboard()}
                        className={`flex-1 py-3 text-xs uppercase font-bold tracking-wider cursor-pointer border-2 transition-all rounded ${isPapyrus
                          ? 'border-[#5C4033] bg-[#5C4033] text-[#EAD8B8] hover:bg-[#3D2B1F]'
                          : 'border-emerald-500 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                          }`}
                      >
                        ⬅️ Dashboard
                      </button>
                    </div>
                  </div>
                ) : (
                  /* 💀 TELA DE DERROTA (GAME OVER) 💀 */
                  <div className={`p-8 text-center border-2 rounded-xl flex flex-col gap-6 animate-fade-in ${isPapyrus
                    ? 'border-red-900 bg-red-900/5 text-red-955'
                    : 'border-red-500/30 bg-slate-900/90 text-slate-300 shadow-[0_0_50px_rgba(239,68,68,0.2)]'
                    }`}>
                    <Skull size={72} className="text-red-600 animate-pulse mx-auto filter drop-shadow-[0_0_15px_rgba(220,38,38,0.4)]" />
                    {(() => {
                      const isMorteDeMedo = gamebook === 'A Mansão do Inferno' && attributes.fear && attributes.fear.initial > 0 && getModifiedAttribute('fear') >= attributes.fear.initial;
                      return (
                        <>
                          <div className="space-y-2">
                            <h2 className={`text-3xl font-extrabold uppercase tracking-widest ${isPapyrus ? 'text-red-900' : 'text-red-500'}`}>
                              {isMorteDeMedo ? 'Você Morreu de Medo!' : 'Sua Jornada Terminou'}
                            </h2>
                            <p className="text-sm font-sans max-w-md mx-auto opacity-90">
                              {isMorteDeMedo
                                ? 'O pavor absoluto paralisou seu coração nos corredores sombrios de A Mansão do Inferno.'
                                : `A morte o encontrou nas profundezas e mistérios de `}
                              {!isMorteDeMedo && <strong className="italic">{gamebook || 'O Feiticeiro da Montanha de Fogo'}</strong>}
                            </p>
                          </div>

                          <div className="w-24 h-0.5 bg-current/20 mx-auto"></div>

                          {/* Resumo das Estatísticas */}
                          <div className={`max-w-md mx-auto w-full p-4 border border-current/10 font-sans text-xs space-y-2.5 ${isPapyrus ? 'bg-red-900/5' : 'bg-slate-950/50 rounded-lg'
                            }`}>
                            <h3 className="font-bold uppercase tracking-wider text-center border-b border-current/10 pb-1.5 mb-2">Detalhes da Queda</h3>
                            <div className="flex justify-between">
                              <span className="opacity-70">Aventureiro:</span>
                              <span className="font-bold">{activeSheetTitle}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="opacity-70">Parágrafo do Falecimento:</span>
                              <span className="font-mono font-bold">#{attributes.currentSection || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="opacity-70">Inimigos Derrotados:</span>
                              <span className="font-bold">{monsters.filter((m: any) => m.status === 'defeated').length} ⚔️</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="opacity-70">Causa:</span>
                              <span className="font-bold text-red-500">
                                {isMorteDeMedo ? 'Morte por Medo (Pavor Excessivo)' : 'Exaustão de Energia (Vida)'}
                              </span>
                            </div>
                          </div>
                        </>
                      );
                    })()}

                    <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto w-full mt-4">
                      <button
                        onClick={() => setInspectMode(true)}
                        className={`flex-1 py-3 text-xs uppercase font-bold tracking-wider cursor-pointer border hover:bg-current/5 transition-all rounded ${isPapyrus ? 'border-red-955 text-red-955' : 'border-slate-700 text-slate-300'
                          }`}
                      >
                        📖 Ver Ficha
                      </button>
                      <button
                        onClick={async () => {
                          const store = useSheetStore.getState();
                          await store.setStatus('playing');
                        }}
                        className={`flex-1 py-3 text-xs uppercase font-bold tracking-wider cursor-pointer border hover:bg-current/5 transition-all rounded ${isPapyrus ? 'border-red-955 text-red-955' : 'border-slate-700 text-slate-300'
                          }`}
                      >
                        ↩️ Retomar
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Deseja realmente renascer? Sua ficha atual será resetada.')) {
                            resetSheet();
                          }
                        }}
                        className={`flex-1 py-3 text-xs uppercase font-bold tracking-wider cursor-pointer border-2 transition-all rounded ${isPapyrus
                          ? 'border-[#5C4033] bg-[#5C4033] text-[#EAD8B8] hover:bg-[#3D2B1F]'
                          : 'border-red-600 bg-red-600/10 text-red-400 hover:bg-red-600/20 shadow-[0_0_15px_rgba(220,38,38,0.15)]'
                          }`}
                      >
                        🔄 Renascer
                      </button>
                      <button
                        onClick={() => handleBackToDashboard()}
                        className={`flex-1 py-3 text-xs uppercase font-bold tracking-wider cursor-pointer border hover:bg-current/5 transition-all rounded ${isPapyrus ? 'border-red-955 text-red-955' : 'border-slate-700 text-slate-300'
                          }`}
                      >
                        ⬅️ Dashboard
                      </button>
                    </div>
                  </div>
                )
              ) : (
                /* ── Ficha de Personagem Normal ── */
                <>
                  {/* ──────────────────────────────────────────────────────── */}
                  {/* ── VISUALIZAÇÃO MOBILE (block md:hidden) ── */}
                  {/* ──────────────────────────────────────────────────────── */}
                  <div className="block md:hidden space-y-4 pb-24 text-left">
                    {/* Cabeçalho Mobile Premium */}
                    <div className={`rounded-b-[2rem] shadow-lg p-5 pt-6 pb-6 relative flex flex-col gap-4 border-b transition-all duration-300 ${isPapyrus
                        ? 'bg-gradient-to-b from-[#2D1D16] to-[#1C120D] text-[#EAD8B8] border-[#5C4033]/45'
                        : 'bg-gradient-to-b from-[#1a202c] to-[#0f172a] text-slate-100 border-slate-800'
                      }`}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={handleBackToDashboard}
                            className={`p-2 rounded-full flex items-center justify-center transition-all active:scale-95 cursor-pointer ${isPapyrus ? 'bg-[#5C4033]/25 hover:bg-[#5C4033]/40 text-[#EAD8B8]' : 'bg-slate-800 hover:bg-slate-750 text-slate-200'
                              }`}
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <div className="min-w-0">
                            <h2 className="text-base font-extrabold uppercase tracking-wide truncate max-w-[160px] sm:max-w-[240px] font-serif">
                              {activeSheetTitle || 'Aventureiro'}
                            </h2>
                            <p className={`text-[10px] font-sans truncate opacity-80 max-w-[160px] sm:max-w-[240px] font-bold ${isPapyrus ? 'text-[#C5A059]' : 'text-cyan-400'}`}>
                              📚 {gamebook || 'O Feiticeiro da Montanha de Fogo'}
                            </p>
                            {gamebook === 'A Lenda de Zagor' && attributes.selectedHero && (
                              <p className={`text-[9px] font-sans uppercase tracking-wider truncate opacity-90 max-w-[160px] sm:max-w-[240px] font-extrabold mt-0.5 ${isPapyrus ? 'text-[#8B5A2B]' : 'text-indigo-400'}`}>
                                🛡️ {attributes.selectedHero === 'sallazar'
                                  ? 'Mago Sallazar'
                                  : attributes.selectedHero === 'restolho'
                                    ? 'Restolho'
                                    : attributes.selectedHero === 'anvar'
                                      ? 'Anvar'
                                      : attributes.selectedHero === 'braxus'
                                        ? 'Braxus'
                                        : `Personalizado (${attributes.customArchetype === 'sallazar' ? 'Mago' : attributes.customArchetype === 'restolho' ? 'Anão' : attributes.customArchetype === 'braxus' ? 'Guerreiro' : attributes.customArchetype === 'anvar' ? 'Bárbaro' : 'Sem Classe'})`}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 relative">
                          {/* Botão de Coração (Favorito) */}
                          <button
                            onClick={() => {
                              setIsFavorite(!isFavorite);
                              audio.playBlip();
                            }}
                            className={`p-2 rounded-full flex items-center justify-center transition-all active:scale-90 cursor-pointer ${isFavorite
                                ? 'text-red-500'
                                : (isPapyrus ? 'text-[#EAD8B8]/50 hover:text-[#EAD8B8]' : 'text-slate-400 hover:text-slate-200')
                              }`}
                            title="Favoritar Ficha"
                          >
                            <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
                          </button>

                          {/* Botão do Mapa */}
                          <button
                            onClick={() => {
                              setShowMapModal(true);
                              audio.playBlip();
                            }}
                            className={`p-2 rounded-full flex items-center justify-center transition-all active:scale-90 cursor-pointer ${isPapyrus ? 'text-[#EAD8B8]/50 hover:text-[#EAD8B8]' : 'text-slate-400 hover:text-slate-200'
                              }`}
                            title="Ver Mapa de Allansia"
                          >
                            <MapIcon size={20} />
                          </button>

                          {/* Botão de Opções */}
                          <button
                            onClick={() => setShowMoreMenu(!showMoreMenu)}
                            className={`p-2 rounded-full flex items-center justify-center transition-all active:scale-90 cursor-pointer ${isPapyrus ? 'text-[#EAD8B8]/50 hover:text-[#EAD8B8]' : 'text-slate-400 hover:text-slate-200'
                              }`}
                          >
                            <MoreVertical size={20} />
                          </button>

                          {/* Menu Suspenso */}
                          {showMoreMenu && (
                            <div className={`absolute right-0 top-11 z-[110] flex flex-col gap-1 w-40 rounded-lg shadow-2xl p-1.5 border animate-fade-in ${isPapyrus ? 'bg-[#FDF6E3] border-[#5C4033] text-[#2D1D16]' : 'bg-slate-900 border-slate-800 text-slate-300'
                              }`}>
                              <button
                                onClick={() => { handleExport(); setShowMoreMenu(false); }}
                                className="flex items-center gap-2 w-full text-left px-2 py-1.5 rounded hover:bg-current/5 text-[11px] font-bold uppercase transition cursor-pointer"
                              >
                                <Upload size={12} /> Exportar Ficha
                              </button>
                              <button
                                onClick={() => { handleImport(); setShowMoreMenu(false); }}
                                className="flex items-center gap-2 w-full text-left px-2 py-1.5 rounded hover:bg-current/5 text-[11px] font-bold uppercase transition cursor-pointer"
                              >
                                <Download size={12} /> Importar Ficha
                              </button>
                              <button
                                onClick={() => {
                                  setShowMoreMenu(false);
                                  if (window.confirm('Você realmente completou com sucesso este livro-jogo?')) {
                                    useSheetStore.getState().setStatus('victory');
                                  }
                                }}
                                disabled={!canCompleteBook}
                                className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded text-[11px] font-bold uppercase transition cursor-pointer ${canCompleteBook ? 'text-emerald-600 hover:bg-emerald-500/10' : 'opacity-40 cursor-not-allowed'
                                  }`}
                              >
                                <Trophy size={12} /> Concluir Livro
                              </button>
                              <div className="h-px bg-current opacity-10 my-0.5" />
                              <button
                                onClick={() => {
                                  setShowMoreMenu(false);
                                  if (window.confirm('Deseja realmente resetar sua ficha? Essa ação é irreversível.')) {
                                    resetSheet();
                                  }
                                }}
                                className="flex items-center gap-2 w-full text-left px-2 py-1.5 rounded text-red-500 hover:bg-red-500/10 text-[11px] font-bold uppercase transition cursor-pointer"
                              >
                                <RotateCcw size={12} /> Resetar Ficha
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Linha de Baixo do Cabeçalho */}
                      <div className="flex items-center justify-between border-t border-current/10 pt-3">
                        <button
                          onClick={() => {
                            const sec = window.prompt("Digite o número do parágrafo atual:", attributes.currentSection || "");
                            if (sec !== null) {
                              useSheetStore.getState().setCurrentSection(sec);
                              useSheetStore.getState().saveToSupabase();
                            }
                          }}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer ${isPapyrus ? 'bg-[#C5A059]/20 text-[#8B4513] border border-[#C5A059]/30' : 'bg-blue-500/15 text-cyan-350 border border-blue-500/25'
                            }`}
                        >
                          <span>Parágrafo:</span>
                          <span className="font-extrabold">{attributes.currentSection || '-'}</span>
                        </button>
                        <span className="text-[10px] font-sans opacity-70 flex items-center gap-1">
                          <Bookmark size={11} className={isPapyrus ? 'text-[#C5A059]' : 'text-cyan-400'} />
                          Tempo: {playTimeMinutes} min
                        </span>
                      </div>
                    </div>

                    {/* Menu de Abas Circulares Mobile ("Included") */}
                    <div className="px-4 pt-3 pb-1">
                      <div className="text-left mb-3">
                        <h3 className={`text-xs font-bold uppercase tracking-wider ${isPapyrus ? 'text-[#8B4513]' : 'text-slate-400'}`}>
                          Seções da Ficha
                        </h3>
                        <p className={`text-[9px] font-sans ${isPapyrus ? 'text-[#5C4033]/60' : 'text-slate-500'}`}>
                          Toque nos ícones para alternar as abas
                        </p>
                      </div>
                      <div className="flex items-center justify-around gap-2 max-w-sm mx-auto">
                        {/* Aba: Status */}
                        <div className="flex flex-col items-center">
                          <button
                            onClick={() => { setActiveTab('Status'); audio.playBlip(); }}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${activeTab === 'Status'
                                ? (isPapyrus ? 'bg-[#5C4033] text-[#EAD8B8] border-2 border-[#8B4513] shadow-md scale-105' : 'bg-cyan-500 text-slate-950 border-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105')
                                : (isPapyrus ? 'bg-[#EAD8B8]/40 text-[#5C4033]/60 border border-[#5C4033]/30 hover:bg-[#EAD8B8]/60' : 'bg-slate-800/40 text-slate-450 border border-slate-700/60 hover:bg-slate-800')
                              }`}
                          >
                            <Shield size={18} />
                          </button>
                          <span className={`text-[10px] font-bold mt-1 ${activeTab === 'Status' ? 'text-current font-extrabold' : 'opacity-65'}`}>Status</span>
                        </div>

                        {/* Aba: Combate */}
                        <div className="flex flex-col items-center">
                          <button
                            onClick={() => { setActiveTab('Combate'); audio.playBlip(); }}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${activeTab === 'Combate'
                                ? (isPapyrus ? 'bg-[#5C4033] text-[#EAD8B8] border-2 border-[#8B4513] shadow-md scale-105' : 'bg-cyan-500 text-slate-950 border-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105')
                                : (isPapyrus ? 'bg-[#EAD8B8]/40 text-[#5C4033]/60 border border-[#5C4033]/30 hover:bg-[#EAD8B8]/60' : 'bg-slate-800/40 text-slate-450 border border-slate-700/60 hover:bg-slate-800')
                              }`}
                          >
                            <Swords size={18} />
                          </button>
                          <span className={`text-[10px] font-bold mt-1 ${activeTab === 'Combate' ? 'text-current font-extrabold' : 'opacity-65'}`}>Combate</span>
                        </div>

                        {/* Aba: Mochila */}
                        <div className="flex flex-col items-center">
                          <button
                            onClick={() => { setActiveTab('Inventário'); audio.playBlip(); }}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${activeTab === 'Inventário'
                                ? (isPapyrus ? 'bg-[#5C4033] text-[#EAD8B8] border-2 border-[#8B4513] shadow-md scale-105' : 'bg-cyan-500 text-slate-950 border-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105')
                                : (isPapyrus ? 'bg-[#EAD8B8]/40 text-[#5C4033]/60 border border-[#5C4033]/30 hover:bg-[#EAD8B8]/60' : 'bg-slate-800/40 text-slate-450 border border-slate-700/60 hover:bg-slate-800')
                              }`}
                          >
                            <Backpack size={18} />
                          </button>
                          <span className={`text-[10px] font-bold mt-1 ${activeTab === 'Inventário' ? 'text-current font-extrabold' : 'opacity-65'}`}>Mochila</span>
                        </div>

                        {/* Aba: Diário */}
                        <div className="flex flex-col items-center">
                          <button
                            onClick={() => { setActiveTab('Notas'); audio.playBlip(); }}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${activeTab === 'Notas'
                                ? (isPapyrus ? 'bg-[#5C4033] text-[#EAD8B8] border-2 border-[#8B4513] shadow-md scale-105' : 'bg-cyan-500 text-slate-950 border-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105')
                                : (isPapyrus ? 'bg-[#EAD8B8]/40 text-[#5C4033]/60 border border-[#5C4033]/30 hover:bg-[#EAD8B8]/60' : 'bg-slate-800/40 text-slate-450 border border-slate-700/60 hover:bg-slate-800')
                              }`}
                          >
                            <BookOpen size={18} />
                          </button>
                          <span className={`text-[10px] font-bold mt-1 ${activeTab === 'Notas' ? 'text-current font-extrabold' : 'opacity-65'}`}>Diário</span>
                        </div>
                      </div>
                    </div>

                    {/* CONTEÚDO DAS ABAS (MOBILE) */}

                    {/* Aba Status */}
                    {activeTab === 'Status' && (
                      <div className="px-4 space-y-4 animate-fade-in">
                        <div className="flex items-center justify-between mt-2">
                          <h3 className={`text-xs font-bold uppercase tracking-wider ${isPapyrus ? 'text-[#8B4513]' : 'text-cyan-400'}`}>
                            Atributos & Status
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
                            <span>★</span>
                            <span>{progressPercent}% Completado</span>
                          </div>
                        </div>

                        {/* Lista de Atributos (Estilo Reviews) */}
                        {gamebook === 'Nave Espacial Traveller' ? (
                          <TravellerOfficialSheet />
                        ) : (
                          <div className="space-y-3">
                            {renderMobileAttributeCard('Habilidade', 'skill', 'Determina sua competência em combates e testes físicos.')}
                            {renderMobileAttributeCard('Energia', 'energy', 'Sua força vital. Se chegar a 0, sua jornada termina.')}
                            {renderMobileAttributeCard('Sorte', 'luck', 'Sua fortuna. Essencial para testar sua sorte ao longo do jogo.')}

                            {/* Atributos específicos de Livros */}
                            {gamebook === 'A Cidadela do Caos' && renderMobileAttributeCard('Mágica', 'magic', 'Sua reserva de poder mágico para lançar feitiços.')}
                            {gamebook === 'A Cripta do Vampiro' && renderMobileAttributeCard('Fé', 'faith', 'Sua proteção e força espiritual contra as trevas.')}
                            {gamebook === 'A Mansão do Inferno' && renderMobileAttributeCard('Medo', 'fear', 'Seu controle de estresse. Não deixe atingir o máximo.')}
                            {gamebook === 'A Lenda de Zagor' && renderMobileAttributeCard(
                              effectiveHero === 'sallazar' ? 'Pontos de Magia' : 'Força de Vontade',
                              'willpower',
                              attributes.selectedHero === 'sallazar'
                                ? 'Sua reserva de magia para conjurar feitiços do Grimório Amarílleo.'
                                : 'Sua determinação e resistência psicológica.'
                            )}
                          </div>
                        )}

                        {/* Seções complementares de Status */}
                        <div className="space-y-4">
                          <CurrentSectionCard />
                          <CompletionChecklist />
                        </div>

                        {/* Galeria de Conquistas (Estilo Gallery) */}
                        <div className="space-y-2 mt-4">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-xs font-bold uppercase tracking-wider ${isPapyrus ? 'text-[#8B4513]' : 'text-slate-350'}`}>
                              Galeria de Troféus
                            </h4>
                            <span className={`text-[10px] uppercase font-bold tracking-wider ${isPapyrus ? 'text-[#5C4033]/60' : 'text-slate-400'}`}>
                              Recentes
                            </span>
                          </div>

                          <div className="flex overflow-x-auto gap-3 pb-3 snap-x scrollbar-none">
                            {unlockedAchievements && unlockedAchievements.length > 0 ? (
                              unlockedAchievements.slice(0, 8).map((u) => {
                                const def = ACHIEVEMENTS.find(a => a.id === u.achievement_id);
                                if (!def) return null;
                                return (
                                  <div
                                    key={u.achievement_id}
                                    className={`flex-shrink-0 w-36 p-3 rounded-xl border flex flex-col gap-1 items-center text-center snap-center ${isPapyrus
                                        ? 'bg-[#FDF6E3] border-[#5C4033]/30 text-[#2D1D16]'
                                        : 'bg-slate-900/80 border-slate-800 text-slate-200 shadow-sm'
                                      }`}
                                  >
                                    <span className="text-xl select-none">{def.icon}</span>
                                    <span className="text-[10px] font-bold truncate w-full">{def.title}</span>
                                    <span className="text-[8px] font-sans opacity-60 leading-none truncate w-full">{def.code}</span>
                                  </div>
                                );
                              })
                            ) : null}
                          </div>
                        </div>

                        {/* Vantagens & Desvantagens (Mobile - A Lenda de Zagor) */}
                        {gamebook === 'A Lenda de Zagor' && attributes.selectedHero && (
                          <div className="space-y-3 mt-4">
                            <div className={`p-4 border rounded-2xl ${isPapyrus ? 'bg-[#FDF6E3] border-[#5C4033]/30' : 'bg-[#1a202c]/50 border-slate-700/60'}`}>
                              <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${isPapyrus ? 'text-[#5C4033]' : 'text-green-400'}`}>
                                🟢 Vantagem
                              </h4>
                              <p className={`text-[10px] leading-relaxed font-sans ${isPapyrus ? 'text-[#2D1D16]' : 'text-slate-350'}`}>
                                {getHeroAdvantage(effectiveHero)}
                              </p>
                            </div>

                            <div className={`p-4 border rounded-2xl ${isPapyrus ? 'bg-[#FDF6E3] border-[#5C4033]/30' : 'bg-[#1a202c]/50 border-slate-700/60'}`}>
                              <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${isPapyrus ? 'text-[#5C4033]' : 'text-red-400'}`}>
                                🔴 Desvantagem
                              </h4>
                              <p className={`text-[10px] leading-relaxed font-sans ${isPapyrus ? 'text-[#2D1D16]' : 'text-slate-350'}`}>
                                {getHeroDisadvantage(effectiveHero)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Aba Combate */}
                    {activeTab === 'Combate' && (
                      <div className="px-4 space-y-4 animate-fade-in">
                        <div className="flex items-center justify-between mt-2">
                          <h3 className={`text-xs font-bold uppercase tracking-wider ${isPapyrus ? 'text-[#8B4513]' : 'text-cyan-400'}`}>
                            Combate & Inimigos
                          </h3>
                        </div>

                        {gamebook === 'Encontro Marcado com o M.E.D.O.' && (
                          <p className="text-[9px] uppercase font-bold tracking-wider text-center p-2 border border-red-500/25 bg-red-950/10 rounded-xl text-red-400 animate-pulse">
                            ⚠️ Derrotar criminosos permanentemente custa 1 Ponto de Herói. Prefira apenas capturá-los!
                          </p>
                        )}

                        <div className={`p-4 border rounded-2xl ${isPapyrus ? 'bg-[#FDF6E3] border-[#5C4033]/30' : 'bg-[#1a202c]/50 border-slate-700/60'}`}>
                          <MonsterManager />
                        </div>

                        <div className={`p-4 border rounded-2xl ${isPapyrus ? 'bg-[#FDF6E3] border-[#5C4033]/30' : 'bg-[#1a202c]/50 border-slate-700/60'}`}>
                          <DamageCard />
                        </div>

                        <div className="flex flex-col gap-4">
                          <div className={`p-4 border rounded-2xl ${isPapyrus ? 'bg-[#FDF6E3] border-[#5C4033]/30' : 'bg-[#1a202c]/50 border-slate-700/60'}`}>
                            <AttackCard key={`attack-mobile-${resetKey}`} />
                          </div>
                          <div className={`p-4 border rounded-2xl ${isPapyrus ? 'bg-[#FDF6E3] border-[#5C4033]/30' : 'bg-[#1a202c]/50 border-slate-700/60'}`}>
                            <DiceRoller key={`roller-mobile-${resetKey}`} />
                          </div>
                        </div>

                        {gamebook === 'A Cidadela do Caos' && (
                          <div className={`p-4 border rounded-2xl ${isPapyrus ? 'bg-[#FDF6E3] border-[#5C4033]/30' : 'bg-[#1a202c]/50 border-slate-700/60'}`}>
                            <CidadelaTracker />
                          </div>
                        )}
                        {gamebook === 'A Cripta do Vampiro' && (
                          <div className={`p-4 border rounded-2xl ${isPapyrus ? 'bg-[#FDF6E3] border-[#5C4033]/30' : 'bg-[#1a202c]/50 border-slate-700/60'}`}>
                            <VampiroTracker />
                          </div>
                        )}
                        {gamebook === 'Exércitos da Morte' && (
                          <div className={`p-4 border rounded-2xl ${isPapyrus ? 'bg-[#FDF6E3] border-[#5C4033]/30' : 'bg-[#1a202c]/50 border-slate-700/60'}`}>
                            <ExercitosTracker />
                          </div>
                        )}
                        {gamebook === 'Nave Espacial Traveller' && (
                          <div className={`p-4 border rounded-2xl ${isPapyrus ? 'bg-[#FDF6E3] border-[#5C4033]/30' : 'bg-[#1a202c]/50 border-slate-700/60'}`}>
                            <TravellerTracker />
                          </div>
                        )}
                        {gamebook === 'A Lenda de Zagor' && effectiveHero === 'sallazar' && (
                          <div className={`p-4 border rounded-2xl ${isPapyrus ? 'bg-[#FDF6E3] border-[#5C4033]/30' : 'bg-[#1a202c]/50 border-slate-700/60'}`}>
                            <GrimorioAmarilleo />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Aba Mochila (Inventário) */}
                    {activeTab === 'Inventário' && (
                      <div className="px-4 space-y-4 animate-fade-in">
                        <div className="flex items-center justify-between mt-2">
                          <h3 className={`text-xs font-bold uppercase tracking-wider ${isPapyrus ? 'text-[#8B4513]' : 'text-cyan-400'}`}>
                            Mochila de Equipamentos
                          </h3>
                        </div>

                        <div className={`p-4 border rounded-2xl ${isPapyrus ? 'bg-[#FDF6E3] border-[#5C4033]/30' : 'bg-[#1a202c]/50 border-slate-700/60'}`}>
                          <GoldAndProvisions />
                        </div>

                        <div className={`p-4 border rounded-2xl ${isPapyrus ? 'bg-[#FDF6E3] border-[#5C4033]/30' : 'bg-[#1a202c]/50 border-slate-700/60'}`}>
                          <InventoryManager />
                        </div>

                        <div className={`p-4 border rounded-2xl ${isPapyrus ? 'bg-[#FDF6E3] border-[#5C4033]/30' : 'bg-[#1a202c]/50 border-slate-700/60'}`}>
                          <CombatHistory />
                        </div>
                      </div>
                    )}

                    {/* Aba Diário (Notas) */}
                    {activeTab === 'Notas' && (
                      <div className="px-4 space-y-4 animate-fade-in">
                        <div className="flex items-center justify-between mt-2">
                          <h3 className={`text-xs font-bold uppercase tracking-wider ${isPapyrus ? 'text-[#8B4513]' : 'text-cyan-400'}`}>
                            Diário & Anotações
                          </h3>
                        </div>

                        <div className={`p-4 border rounded-2xl min-h-[300px] flex flex-col ${isPapyrus ? 'bg-[#FDF6E3] border-[#5C4033]/30' : 'bg-[#1a202c]/50 border-slate-700/60'}`}>
                          <NotesCard />
                        </div>
                      </div>
                    )}

                    {/* Barra de Navegação Inferior Fixa */}
                    <div className={`fixed bottom-0 left-0 right-0 z-[100] border-t backdrop-blur-md safe-bottom flex items-center justify-around py-2.5 shadow-2xl transition-colors duration-300 ${isPapyrus ? 'bg-[#1C120D]/95 border-[#4A3728] text-[#EAD8B8]' : 'bg-slate-950/95 border-slate-850 text-slate-300'
                      }`}>
                      <button
                        onClick={handleBackToDashboard}
                        className="flex flex-col items-center justify-center p-1.5 hover:opacity-85 active:scale-90 transition-all cursor-pointer"
                      >
                        <HomeIcon size={18} />
                        <span className="text-[9px] font-sans mt-0.5">Painel</span>
                      </button>

                      <button
                        onClick={() => { setShowAchievementsModal(true); audio.playBlip(); }}
                        className="flex flex-col items-center justify-center p-1.5 hover:opacity-85 active:scale-90 transition-all cursor-pointer"
                      >
                        <Compass size={18} />
                        <span className="text-[9px] font-sans mt-0.5">Conquistas</span>
                      </button>

                      <button
                        onClick={() => { setActiveTab('Status'); audio.playBlip(); }}
                        className={`flex flex-col items-center justify-center p-1.5 hover:opacity-85 active:scale-90 transition-all cursor-pointer ${activeTab === 'Status' ? (isPapyrus ? 'text-[#C5A059]' : 'text-cyan-400') : ''
                          }`}
                      >
                        <Heart size={18} className={activeTab === 'Status' ? 'fill-current' : ''} />
                        <span className="text-[9px] font-sans mt-0.5">Status</span>
                      </button>

                      <button
                        onClick={() => { setShowSettingsModal(true); audio.playBlip(); }}
                        className="flex flex-col items-center justify-center p-1.5 hover:opacity-85 active:scale-90 transition-all cursor-pointer"
                      >
                        <Settings size={18} />
                        <span className="text-[9px] font-sans mt-0.5 font-bold">Ajustes</span>
                      </button>
                    </div>

                    {/* Modal de Configurações Mobile */}
                    {showSettingsModal && (
                      <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in" onClick={() => setShowSettingsModal(false)}>
                        <div
                          className={`w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6 border-t sm:border shadow-2xl flex flex-col gap-4 text-left transform translate-y-0 transition-transform ${isPapyrus ? 'bg-[#FDF6E3] border-[#5C4033]/40 text-[#2D1D16]' : 'bg-slate-900 border-slate-800 text-slate-100'
                            }`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-between border-b pb-2.5 border-current/10">
                            <h3 className="font-extrabold uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                              <Settings size={13} /> Ajustes da Ficha
                            </h3>
                            <button onClick={() => setShowSettingsModal(false)} className="text-xs font-extrabold border px-2 py-0.5 rounded border-current/30 hover:bg-current/5 cursor-pointer">
                              Fechar
                            </button>
                          </div>

                          <div className="space-y-3.5">
                            {/* Tema */}
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="opacity-80 uppercase tracking-wide">Tema Visual</span>
                              <button
                                onClick={() => setTheme(isPapyrus ? 'night' : 'papyrus')}
                                className={`px-3 py-1.5 border rounded flex items-center gap-1.5 uppercase font-extrabold hover:bg-current/5 transition-all text-[9px] cursor-pointer ${isPapyrus ? 'border-[#5C4033]/40' : 'border-slate-700'
                                  }`}
                              >
                                {isPapyrus ? <><Moon size={11} /> Escuro</> : <><Sun size={11} /> Claro</>}
                              </button>
                            </div>

                            {/* SFX */}
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="opacity-80 uppercase tracking-wide">Efeitos Sonoros</span>
                              <button
                                onClick={toggleSound}
                                className={`px-3 py-1.5 border rounded flex items-center gap-1.5 uppercase font-extrabold hover:bg-current/5 transition-all text-[9px] cursor-pointer ${isPapyrus ? 'border-[#5C4033]/40' : 'border-slate-700'
                                  }`}
                              >
                                {soundEnabled ? <><Volume2 size={11} /> Ativos</> : <><VolumeX size={11} /> Mudo</>}
                              </button>
                            </div>

                            {/* BGM */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs font-bold">
                                <span className="opacity-80 uppercase tracking-wide">Música de Fundo</span>
                                <button
                                  onClick={toggleMusic}
                                  className={`px-3 py-1.5 border rounded flex items-center gap-1.5 uppercase font-extrabold hover:bg-current/5 transition-all text-[9px] cursor-pointer ${isPapyrus ? 'border-[#5C4033]/40' : 'border-slate-700'
                                    }`}
                                >
                                  {musicEnabled ? <><Music size={11} /> Ativa</> : <><VolumeX size={11} /> Mudo</>}
                                </button>
                              </div>
                              {musicEnabled && (
                                <div className="flex items-center gap-3">
                                  <span className="text-[9px] opacity-60">Volume</span>
                                  <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={musicVolume}
                                    onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                                    className="flex-1 h-1.5 cursor-pointer accent-current opacity-70 bg-current/20 rounded-lg appearance-none"
                                  />
                                  <span className="text-[9px] font-bold font-mono">{Math.round(musicVolume * 100)}%</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="h-px bg-current opacity-10 my-1" />

                          {/* Ações de Backup */}
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => { handleExport(); setShowSettingsModal(false); }}
                              className={`py-2 text-[9px] uppercase font-bold tracking-wider border rounded flex items-center justify-center gap-1 hover:bg-current/5 cursor-pointer ${isPapyrus ? 'border-[#5C4033]/40' : 'border-slate-700'
                                }`}
                            >
                              <Upload size={11} /> Exportar
                            </button>
                            <button
                              onClick={() => { handleImport(); setShowSettingsModal(false); }}
                              className={`py-2 text-[9px] uppercase font-bold tracking-wider border rounded flex items-center justify-center gap-1 hover:bg-current/5 cursor-pointer ${isPapyrus ? 'border-[#5C4033]/40' : 'border-slate-700'
                                }`}
                            >
                              <Download size={11} /> Importar
                            </button>
                          </div>

                          {/* Zona de Perigo */}
                          <button
                            onClick={() => {
                              setShowSettingsModal(false);
                              if (window.confirm('Deseja realmente resetar sua ficha? Essa ação é irreversível.')) {
                                resetSheet();
                              }
                            }}
                            className="w-full py-2 text-[9px] uppercase font-bold tracking-wider bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 rounded text-center transition cursor-pointer"
                          >
                            Resetar Ficha de Aventura
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Modal de Conquistas Mobile */}
                    {showAchievementsModal && (
                      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setShowAchievementsModal(false)}>
                        <div
                          className={`w-full max-w-lg rounded-2xl max-h-[80vh] overflow-y-auto p-4 border shadow-2xl flex flex-col gap-4 text-left ${isPapyrus ? 'bg-[#FDF6E3] border-[#5C4033]/40 text-[#2D1D16]' : 'bg-slate-900 border-slate-800 text-slate-100'
                            }`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-between border-b pb-2 border-current/10">
                            <h3 className="font-extrabold uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                              🏆 Galeria Geral de Conquistas
                            </h3>
                            <button onClick={() => setShowAchievementsModal(false)} className="text-xs font-bold border border-current/25 hover:bg-current/5 px-2 py-0.5 rounded cursor-pointer">
                              Fechar
                            </button>
                          </div>
                          <div className="text-sm font-sans">
                            <AchievementsGallery />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ──────────────────────────────────────────────────────── */}
                  {/* ── VISUALIZAÇÃO DESKTOP (hidden md:block) ── */}
                  {/* ──────────────────────────────────────────────────────── */}
                  <div className="hidden md:block space-y-8 text-left">
                    {/* Painel do Super-Herói (exclusivo para o livro do M.E.D.O.) */}
                    {gamebook === 'Encontro Marcado com o M.E.D.O.' && (
                      <MedoTracker />
                    )}

                    {/* Ficha Oficial de A Nave Espacial Traveller */}
                    {gamebook === 'Nave Espacial Traveller' && (
                      <TravellerOfficialSheet />
                    )}

                    {/* Main Layout Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start animate-fade-in">
                      {/* STATUS TAB (Mobile) / Coluna Esquerda (Desktop) */}
                      <div className="lg:col-span-1 flex flex-col gap-6">
                        {gamebook !== 'Nave Espacial Traveller' && (
                          <>
                            <AttributeCard label="Habilidade" attrKey="skill" />
                            <AttributeCard label="Energia" attrKey="energy" />
                            <AttributeCard label="Sorte" attrKey="luck" />
                          </>
                        )}
                        {gamebook === 'A Cidadela do Caos' && (
                          <AttributeCard label="Mágica" attrKey="magic" />
                        )}
                        {gamebook === 'A Cripta do Vampiro' && (
                          <AttributeCard label="Fé" attrKey="faith" />
                        )}
                        {gamebook === 'A Mansão do Inferno' && (
                          <AttributeCard label="Medo" attrKey="fear" />
                        )}
                        {gamebook === 'A Lenda de Zagor' && (
                          <AttributeCard
                            label={effectiveHero === 'sallazar' ? 'Pontos de Magia' : 'Força de Vontade'}
                            attrKey="willpower"
                          />
                        )}
                        <CurrentSectionCard />
                        <CompletionChecklist />
                      </div>

                      {/* Right Main Content Column (Desktop) */}
                      <div className="lg:col-span-4 flex flex-col gap-6">
                        {/* Seção de Combate (Desktop) */}
                        <div className="flex flex-col gap-6">
                          {gamebook === 'A Cidadela do Caos' || gamebook === 'A Cripta do Vampiro' || gamebook === 'Exércitos da Morte' || gamebook === 'Nave Espacial Traveller' ? (
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                              <div className="xl:col-span-2 flex flex-col gap-6">
                                <section
                                  className={`bg-transparent border-2 p-6 shadow-[-10px_10px_0px_rgba(0,0,0,0.1)] ${isPapyrus ? 'border-[#4A3728]' : 'border-[#4a5568]'
                                    }`}
                                >
                                  <MonsterManager />
                                </section>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                  <DamageCard />
                                  <AttackCard key={`attack-${resetKey}`} />
                                  <DiceRoller key={`roller-${resetKey}`} />
                                </div>
                              </div>
                              <div className="xl:col-span-1">
                                {gamebook === 'A Cidadela do Caos' && <CidadelaTracker />}
                                {gamebook === 'A Cripta do Vampiro' && <VampiroTracker />}
                                {gamebook === 'Exércitos da Morte' && <ExercitosTracker />}
                              </div>
                            </div>
                          ) : (
                            <>
                              <section
                                className={`bg-transparent border-2 p-6 shadow-[-10px_10px_0px_rgba(0,0,0,0.1)] ${isPapyrus ? 'border-[#4A3728]' : 'border-[#4a5568]'
                                  }`}
                              >
                                <MonsterManager />
                                {gamebook === 'Encontro Marcado com o M.E.D.O.' && (
                                  <p className={`text-[10px] mt-4 uppercase font-bold tracking-wider text-center ${isPapyrus ? 'text-red-800' : 'text-cyan-400 font-mono animate-pulse'}`}>
                                    ⚠️ Nota: Derrotar permanentemente (matar) um criminoso custa 1 Ponto de Herói. Prefira apenas capturá-los!
                                  </p>
                                )}
                              </section>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <DamageCard />
                                <AttackCard key={`attack-${resetKey}`} />
                                <DiceRoller key={`roller-${resetKey}`} />
                              </div>
                            </>
                          )}
                        </div>

                        {gamebook === 'A Lenda de Zagor' && effectiveHero === 'sallazar' && (
                          <GrimorioAmarilleo />
                        )}

                        {/* Seção do Inventário (Desktop) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <section
                            className={`bg-transparent border-2 p-6 shadow-[-10px_10px_0px_rgba(0,0,0,0.1)] ${isPapyrus ? 'border-[#4A3728]' : 'border-[#4a5568]'
                              }`}
                          >
                            <InventoryManager />
                          </section>
                          <section
                            className={`bg-transparent border-2 p-6 shadow-[-10px_10px_0px_rgba(0,0,0,0.1)] ${isPapyrus ? 'border-[#4A3728]' : 'border-[#4a5568]'
                              }`}
                          >
                            <CombatHistory />
                          </section>
                        </div>

                        {/* Vantagens & Desvantagens (Desktop - A Lenda de Zagor) */}
                        {gamebook === 'A Lenda de Zagor' && attributes.selectedHero && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <section
                              className={`bg-transparent border-2 p-6 shadow-[-10px_10px_0px_rgba(0,0,0,0.1)] ${isPapyrus ? 'border-[#4A3728]' : 'border-[#4a5568]'}`}
                            >
                              <h3 className={`text-md font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${isPapyrus ? 'text-[#5C4033]' : 'text-green-400'}`}>
                                🟢 Vantagem
                              </h3>
                              <p className={`text-xs leading-relaxed font-sans ${isPapyrus ? 'text-[#2D1D16]' : 'text-slate-350'}`}>
                                {getHeroAdvantage(effectiveHero)}
                              </p>
                            </section>

                            <section
                              className={`bg-transparent border-2 p-6 shadow-[-10px_10px_0px_rgba(0,0,0,0.1)] ${isPapyrus ? 'border-[#4A3728]' : 'border-[#4a5568]'}`}
                            >
                              <h3 className={`text-md font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${isPapyrus ? 'text-[#5C4033]' : 'text-red-400'}`}>
                                🔴 Desvantagem
                              </h3>
                              <p className={`text-xs leading-relaxed font-sans ${isPapyrus ? 'text-[#2D1D16]' : 'text-slate-350'}`}>
                                {getHeroDisadvantage(effectiveHero)}
                              </p>
                            </section>
                          </div>
                        )}

                        {/* BLOCO INFERIOR (Desktop) */}
                        <section>
                          <GoldAndProvisions />
                        </section>

                        {/* BLOCO INFERIOR (Desktop) */}
                        <section className="flex flex-col min-h-[350px]">
                          <NotesCard />
                        </section>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )
        )}

        {/* Footer / Rodapé */}
        <footer className={`mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans tracking-wide ${isPapyrus
            ? 'border-[#5C4033]/20 text-[#5C4033]/70'
            : 'border-[#4a5568]/30 text-slate-400'
          }`}>
          <div className="max-w-xl text-balance">
            © {new Date().getFullYear()} Fichas FF • É um Projeto independente criado por fãs para fãs.
            <span className="block mt-0.5 text-[11px] opacity-75">
              "Aventuras Fantásticas" (Fighting Fantasy) e marcas relacionadas são propriedade de seus respectivos autores e editoras.
            </span>
          </div>

          {/* Social Media Links */}
          <div className="flex items-center gap-4">
            <a
              href={youtubeSettings.instagramUrl || 'https://instagram.com'}
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:scale-110 active:scale-95 transition-transform flex items-center justify-center p-1 rounded-sm ${isPapyrus ? 'hover:text-[#2D1D16] hover:bg-[#5C4033]/10 text-[#5C4033]' : 'hover:text-cyan-400 hover:bg-slate-700/30 text-slate-300'
                }`}
              title="Instagram"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <a
              href={youtubeSettings.youtubeUrl || 'https://youtube.com'}
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:scale-110 active:scale-95 transition-transform flex items-center justify-center p-1 rounded-sm ${isPapyrus ? 'hover:text-[#2D1D16] hover:bg-[#5C4033]/10 text-[#5C4033]' : 'hover:text-cyan-400 hover:bg-slate-700/30 text-slate-300'
                }`}
              title="YouTube"
              aria-label="YouTube"
            >
              <Youtube size={18} />
            </a>
            <a
              href={youtubeSettings.discordUrl || 'https://discord.gg'}
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:scale-110 active:scale-95 transition-transform flex items-center justify-center p-1 rounded-sm ${isPapyrus ? 'hover:text-[#2D1D16] hover:bg-[#5C4033]/10 text-[#5C4033]' : 'hover:text-cyan-400 hover:bg-slate-700/30 text-slate-300'
                }`}
              title="Discord"
              aria-label="Discord"
            >
              <DiscordIcon className="w-[18px] h-[18px]" />
            </a>
          </div>
        </footer>
      </div>

      {/* Efeito de Congratulações de Vitória */}
      {celebrating && (
        <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="text-center space-y-6 max-w-md px-6 animate-scale-up">
            <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center border-4 border-amber-400 bg-amber-500/10 text-amber-400 shadow-[0_0_50px_rgba(251,191,36,0.3)] animate-pulse">
              <Trophy size={40} />
            </div>

            <div className="space-y-2">
              <h2
                className="text-4xl md:text-5xl font-extrabold tracking-widest bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent"
                style={{ fontFamily: isPapyrus ? "'Cinzel', Georgia, serif" : 'inherit' }}
              >
                PARABÉNS!
              </h2>
              <p
                className={`text-sm md:text-base uppercase font-bold tracking-widest ${isPapyrus ? 'text-[#F5EAD4]' : 'text-slate-200'
                  }`}
              >
                Você Venceu o Jogo!
              </p>
            </div>

            <div className="w-32 h-0.5 mx-auto bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>

            <p className={`text-xs ${isPapyrus ? 'text-[#EAD8B8]/80' : 'text-slate-400'} font-sans`}>
              Registrando sua vitória nas estatísticas...
            </p>
          </div>
        </div>
      )}

      {/* Modal do Mapa de Allansia */}
      {showMapModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setShowMapModal(false)}
        >
          <div
            className={`w-full max-w-4xl rounded-2xl overflow-hidden p-6 border shadow-2xl flex flex-col gap-4 text-left ${isPapyrus ? 'bg-[#FDF6E3] border-[#5C4033] text-[#2D1D16]' : 'bg-slate-900 border-slate-800 text-slate-100'
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-2.5 border-current/10">
              <h3 className="font-extrabold uppercase text-xs tracking-wider flex items-center gap-1.5 font-serif">
                🗺️ Mapa de Allansia
              </h3>
              <button
                onClick={() => setShowMapModal(false)}
                className="text-xs font-bold border border-current/25 hover:bg-current/5 px-2.5 py-1 rounded cursor-pointer"
              >
                Fechar
              </button>
            </div>
            <MapAllansia activeBook={gamebook} isPapyrus={isPapyrus} />
          </div>
        </div>
      )}

      {/* Toasts de Conquistas */}
      <AchievementToast />
    </main>
  );
}
