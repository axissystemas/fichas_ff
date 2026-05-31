'use client';
import { useSheetStore } from '@/store/useSheetStore';
import { Cloud, CloudOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export function SyncStatus() {
  const { syncStatus, lastSynced, theme } = useSheetStore();

  const isDark = theme === 'night';

  const configs = {
    idle: {
      icon: <Cloud size={13} />,
      label: 'Nuvem',
      color: isDark ? 'text-[#718096]' : 'text-[#8c7056]',
    },
    loading: {
      icon: <Loader2 size={13} className="animate-spin" />,
      label: 'Carregando...',
      color: isDark ? 'text-blue-400' : 'text-blue-600',
    },
    saving: {
      icon: <Loader2 size={13} className="animate-spin" />,
      label: 'Salvando...',
      color: isDark ? 'text-yellow-400' : 'text-yellow-600',
    },
    saved: {
      icon: <CheckCircle2 size={13} />,
      label: 'Salvo',
      color: isDark ? 'text-green-400' : 'text-green-700',
    },
    error: {
      icon: <CloudOff size={13} />,
      label: 'Erro de sincronização',
      color: 'text-red-500',
    },
  };

  const cfg = configs[syncStatus];

  const formattedTime =
    lastSynced && syncStatus === 'idle'
      ? new Date(lastSynced).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      : null;

  return (
    <div
      title={formattedTime ? `Último sync: ${formattedTime}` : undefined}
      className={`flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider select-none transition-colors duration-300 ${cfg.color}`}
    >
      {cfg.icon}
      <span>{formattedTime ? `Sync ${formattedTime}` : cfg.label}</span>
    </div>
  );
}
