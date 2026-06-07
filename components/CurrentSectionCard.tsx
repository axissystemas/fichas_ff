import { useSheetStore } from '@/store/useSheetStore';

export const CurrentSectionCard = () => {
  const { attributes, setCurrentSection, theme } = useSheetStore();
  const currentSection = attributes.currentSection || '';

  const cardClasses = theme === 'papyrus' 
    ? 'bg-[#FDF6E3] border-[#4A3728] text-[#2C1E14]' 
    : 'bg-[#1a202c] border-[#4a5568] text-[#cbd5e0]';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSection(e.target.value);
  };

  return (
    <div className={`${cardClasses} border-2 p-4 shadow-[-5px_5px_0px_rgba(0,0,0,0.3)] transition-colors`}>
      <h3 className={`text-md font-bold uppercase text-center mb-2 border-b pb-1 ${theme === 'papyrus' ? 'border-[#2C1E14] text-[#2C1E14]' : 'border-[#cbd5e0] text-[#cbd5e0]'}`}>
        Parou no Item
      </h3>
      <div className="flex items-center justify-center gap-2 mt-3">
        <input
          type="text"
          value={currentSection}
          onChange={handleChange}
          placeholder="Ex: 400"
          className={`w-full text-center text-2xl font-bold py-1 bg-transparent border-b focus:outline-none transition-all ${
            theme === 'papyrus' 
              ? 'border-[#4A3728]/40 focus:border-[#4A3728] text-[#2C1E14] placeholder-[#2C1E14]/40 font-serif' 
              : 'border-slate-700 focus:border-cyan-400 text-cyan-400 placeholder-slate-600 font-sans'
          }`}
        />
      </div>
      <p className="text-[10px] text-center mt-2 opacity-65 font-sans">
        Salve o número do parágrafo onde parou a leitura.
      </p>
    </div>
  );
};
