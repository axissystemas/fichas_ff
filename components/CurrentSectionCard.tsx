import { useSheetStore } from '@/store/useSheetStore';
import { Bookmark } from 'lucide-react';

export const CurrentSectionCard = () => {
  const { attributes, setCurrentSection, theme } = useSheetStore();
  const currentSection = attributes.currentSection || '';

  const cardClasses = theme === 'papyrus' 
    ? 'bg-[#FDF6E3] border-[#4A3728] text-[#2C1E14]' 
    : 'bg-[#1a202c] border-[#4a5568] text-[#cbd5e0]';

  const inputClasses = theme === 'papyrus'
    ? 'border-b border-[#4A3728]/40 focus:border-[#4A3728] text-[#2C1E14] placeholder-[#2C1E14]/40 font-serif'
    : 'border-b border-slate-700 focus:border-cyan-400 text-cyan-400 placeholder-slate-600 font-sans';

  return (
    <div className={`${cardClasses} border-2 rounded-lg p-3.5 flex items-center justify-between gap-3 transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.05)]`}>
      <div className="flex items-center gap-2">
        <Bookmark size={18} className={theme === 'papyrus' ? 'text-[#C5A059]' : 'text-cyan-400'} />
        <span className="text-xs uppercase font-extrabold tracking-wider select-none">
          Parou no Parágrafo:
        </span>
      </div>
      <input
        type="text"
        value={currentSection}
        onChange={(e) => setCurrentSection(e.target.value)}
        placeholder="Ex: 400"
        className={`w-20 text-center font-bold bg-transparent focus:outline-none transition-all ${inputClasses}`}
      />
    </div>
  );
};
