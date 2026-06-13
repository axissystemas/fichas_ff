import { useSheetStore } from '@/store/useSheetStore';
import { Bookmark } from 'lucide-react';

export const CurrentSectionFloatingBar = () => {
  const { attributes, setCurrentSection, theme } = useSheetStore();
  const currentSection = attributes.currentSection || '';

  const barClasses = theme === 'papyrus' 
    ? 'bg-[#FDF6E3]/95 border-[#4A3728] text-[#2C1E14] shadow-[0_10px_30px_rgba(44,30,20,0.25)]' 
    : 'bg-slate-900/90 border-[#4a5568]/60 text-[#cbd5e0] shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md';

  const inputClasses = theme === 'papyrus'
    ? 'border-b border-[#4A3728]/40 focus:border-[#4A3728] text-[#2C1E14] placeholder-[#2C1E14]/40 font-serif'
    : 'border-b border-slate-700 focus:border-cyan-400 text-cyan-400 placeholder-slate-600 font-sans';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSection(e.target.value);
  };

  return (
    <div className={`fixed bottom-6 right-6 max-sm:bottom-4 max-sm:right-4 z-50 flex items-center gap-2.5 px-4 py-2.5 border-2 rounded-lg transition-all duration-300 hover:scale-102 ${barClasses}`}>
      <Bookmark size={16} className={theme === 'papyrus' ? 'text-[#C5A059]' : 'text-cyan-400'} />
      <span className="text-xs uppercase font-bold tracking-wider select-none">
        Parou no Parágrafo:
      </span>
      <input
        type="text"
        value={currentSection}
        onChange={handleChange}
        placeholder="Ex: 400"
        className={`w-16 text-center font-bold bg-transparent focus:outline-none transition-all ${inputClasses}`}
      />
    </div>
  );
};
