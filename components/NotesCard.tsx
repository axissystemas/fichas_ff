'use client';
import { useSheetStore } from '@/store/useSheetStore';

export const NotesCard = () => {
  const { notes, setNotes, theme } = useSheetStore();
  const cardClasses = theme === 'papyrus' 
    ? 'bg-[#FDF6E3] border-[#4A3728] text-[#2C1E14]' 
    : 'bg-[#1a202c] border-[#4a5568] text-[#cbd5e0]';

  return (
    <div className={`${cardClasses} border-2 p-4 shadow-[-5px_5px_0px_rgba(0,0,0,0.3)] transition-colors flex flex-col min-h-[300px] md:min-h-[350px] flex-grow`}>
      <h3 className={`text-md font-bold uppercase text-center mb-2 border-b pb-1 w-full ${theme === 'papyrus' ? 'border-[#2C1E14]' : 'border-[#cbd5e0]'}`}>Notas do Aventureiro</h3>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className={`w-full flex-1 p-2 bg-transparent border ${theme === 'papyrus' ? 'border-[#4A3728]' : 'border-[#cbd5e0]'} resize-none`}
        placeholder="Anote suas descobertas..."
      />
    </div>
  );
};
