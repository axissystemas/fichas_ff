'use client';
import { useSheetStore } from '@/store/useSheetStore';

export const CombatHistory = () => {
  const { combatLog, theme } = useSheetStore();
  const cardClasses = theme === 'papyrus' 
    ? 'bg-[#FDF6E3] border-[#4A3728] text-[#2C1E14]' 
    : 'bg-[#1a202c] border-[#4a5568] text-[#cbd5e0]';

  return (
    <div className={`${cardClasses} border-2 p-4 shadow-[-5px_5px_0px_rgba(0,0,0,0.3)] transition-colors`}>
      <h3 className={`text-md font-bold uppercase text-center mb-2 border-b pb-1 w-full ${theme === 'papyrus' ? 'border-[#2C1E14]' : 'border-[#cbd5e0]'}`}>Histórico de Combate</h3>
      <div className="space-y-1">
        {combatLog.length === 0 ? (
          <p className="text-center text-sm opacity-60 italic">Nenhuma ação registrada</p>
        ) : (
          combatLog.map((log, i) => (
            <div key={i} className={`flex justify-between text-sm py-1 border-b border-opacity-20 last:border-none ${theme === 'papyrus' ? 'text-[#5C4033] border-[#5C4033]' : 'text-slate-300 border-slate-600'}`}>
              <span className="font-bold uppercase flex items-center gap-1">
                {log.type}
                {log.timestamp && <span className="text-xs opacity-80 normal-case font-normal ml-1">[{log.timestamp}]</span>}
              </span>
              <span className="text-right">{log.value}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
