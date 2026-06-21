import { useSheetStore } from '@/store/useSheetStore';
import { victoryParagraphs } from '@/lib/victoryParagraphs';
import { Trophy, Swords, Clock, Compass, Check, X, AlertTriangle, ShieldAlert } from 'lucide-react';

export const CompletionChecklist = () => {
  const { attributes, gamebook, activeSheetLogs, theme } = useSheetStore();

  const isPapyrus = theme === 'papyrus';

  // Card themes
  const cardClasses = isPapyrus
    ? 'bg-[#FDF6E3] border-[#4A3728] text-[#2C1E14]'
    : 'bg-[#1a202c] border-[#4a5568] text-[#cbd5e0]';

  const titleClasses = isPapyrus
    ? 'text-[#8B4513] border-[#4A3728]/20'
    : 'text-cyan-400 border-slate-700';

  // ─── 1. Parágrafo Final Encontrado ──────────────────────────────────────────
  const lastParagraph = String(attributes.currentSection || '').trim();
  const isVictoryParagraph = !!(gamebook && victoryParagraphs[gamebook]?.includes(lastParagraph));

  // ─── 2. Combates Registrados ────────────────────────────────────────────────
  const totalCombats = activeSheetLogs.filter(l => l.event_type === 'combat').length;
  const hasCombat = totalCombats >= 1;

  // ─── 3. Tempo Mínimo de Aventura ────────────────────────────────────────────
  // Calculate play time from logs span as fallback
  let playTimeFromLogs = 0;
  if (activeSheetLogs && activeSheetLogs.length > 1) {
    const times = activeSheetLogs.map(l => new Date(l.created_at).getTime());
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    playTimeFromLogs = Math.floor((maxTime - minTime) / 60000);
  }
  const playTimeMinutes = Math.max(attributes.playTimeMinutes || 0, playTimeFromLogs);
  const hasMinPlayTime = playTimeMinutes >= 30;

  // ─── 4. Registros de Jornada ────────────────────────────────────────────────
  const actionsCount = activeSheetLogs.length;
  const hasMinActions = actionsCount >= 30;

  // ─── unique paragraphs (for display or future checks) ─────────────────────
  const uniqueVisited = new Set(
    activeSheetLogs
      .filter(l => l.event_type === 'section_visit' && l.event_data?.section)
      .map(l => String(l.event_data.section))
  );
  const paragraphsVisited = uniqueVisited.size;
  const hasMinParagraphs = paragraphsVisited >= 20;

  // ─── Elegibilidade Geral ──────────────────────────────────────────────────
  const evidenceScore = [
    hasCombat,
    hasMinParagraphs,
    hasMinPlayTime,
    hasMinActions,
  ].filter(Boolean).length;

  const canCompleteBook = isVictoryParagraph && evidenceScore >= 2;

  // Checklist items definitions
  const checklistItems = [
    {
      label: 'Parágrafo final encontrado',
      detail: isVictoryParagraph 
        ? `Sim (#${lastParagraph})` 
        : `Não (Atual: #${lastParagraph || 'N/A'})`,
      complete: isVictoryParagraph,
      icon: <Trophy size={14} className={isVictoryParagraph ? 'text-amber-500' : 'opacity-40'} />,
    },
    {
      label: 'Combate registrado',
      detail: `${totalCombats} / 1 combat${totalCombats >= 1 ? 'e' : 'es'}`,
      complete: hasCombat,
      icon: <Swords size={14} className={hasCombat ? 'text-red-500' : 'opacity-40'} />,
    },
    {
      label: 'Tempo mínimo de aventura',
      detail: `${playTimeMinutes} / 30 min`,
      complete: hasMinPlayTime,
      icon: <Clock size={14} className={hasMinPlayTime ? 'text-emerald-500' : 'opacity-40'} />,
    },
    {
      label: 'Registros suficientes de jornada',
      detail: `${paragraphsVisited} / 20 parágrafos únicos`,
      complete: hasMinParagraphs,
      icon: <Compass size={14} className={hasMinParagraphs ? 'text-cyan-500' : 'opacity-40'} />,
    },
  ];

  return (
    <div className={`border-2 rounded-lg p-4 shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all ${cardClasses}`}>
      <h3 className={`text-xs uppercase font-extrabold tracking-wider border-b pb-2 mb-3 flex items-center gap-2 ${titleClasses}`}>
        <Trophy size={16} /> Elegibilidade de Conclusão
      </h3>

      {/* Banner de status */}
      <div className={`p-3 border rounded mb-4 text-xs font-sans leading-relaxed ${
        canCompleteBook
          ? (isPapyrus ? 'bg-green-500/10 border-green-800/30 text-green-950' : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400')
          : (isPapyrus ? 'bg-amber-500/10 border-amber-800/30 text-amber-950' : 'bg-amber-950/20 border-amber-500/30 text-amber-400')
      }`}>
        {canCompleteBook ? (
          <div className="flex items-start gap-2">
            <Check size={16} className="shrink-0 text-emerald-500 mt-0.5" />
            <div>
              <strong className="block uppercase tracking-wide text-[10px]">Elegibilidade Confirmada!</strong>
              Você já pode concluir esta aventura clicando no botão <strong>Concluir Livro</strong> no cabeçalho.
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="shrink-0 text-amber-500 mt-0.5" />
            <div>
              <strong className="block uppercase tracking-wide text-[10px]">Conclusão Bloqueada</strong>
              Continue sua jornada até alcançar um final válido da aventura e cumprir pelo menos 2 requisitos de progresso.
            </div>
          </div>
        )}
      </div>

      {/* Checklist Grid */}
      <div className="space-y-2.5 font-sans text-xs">
        {checklistItems.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-3 py-1 border-b border-current/5 last:border-b-0">
            <div className="flex items-center gap-2">
              <span className="shrink-0">{item.icon}</span>
              <div className="flex flex-col text-left">
                <span className="font-semibold leading-tight">{item.label}</span>
                <span className="text-[10px] opacity-60 font-mono mt-0.5">{item.detail}</span>
              </div>
            </div>
            <div className={`p-1 rounded-full border ${
              item.complete
                ? 'bg-green-500/10 border-green-500/30 text-green-500'
                : 'bg-current/5 border-current/10 opacity-40'
            }`}>
              {item.complete ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
            </div>
          </div>
        ))}
      </div>

      {/* Critério resumo */}
      <div className="mt-4 pt-3 border-t border-current/5 text-[10px] opacity-75 font-sans flex justify-between items-center">
        <span>Pontuação de evidências:</span>
        <span className="font-bold font-mono">
          {evidenceScore} / 4 (Mínimo: 2)
        </span>
      </div>
    </div>
  );
};
