'use client';
import { useState, useEffect } from 'react';
import { Skull } from 'lucide-react';

interface MonsterImageProps {
  name: string;
  className?: string;
}

export const MonsterImage = ({ name, className = '' }: MonsterImageProps) => {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [formatIndex, setFormatIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  const formats = ['.webp', '.jpg', '.png'];
  const bucketUrl = 'https://uygapxzgpcoryrmaxvuh.supabase.co/storage/v1/object/public/monsters';

  // Sanitiza o nome do monstro para formar o nome de arquivo adequado
  const sanitizeFileName = (rawName: string): string => {
    return rawName
      .normalize('NFD') // Decompõe acentos
      .replace(/[\u0300-\u036f]/g, '') // Remove os acentos decompostos
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais não alfanuméricos
      .replace(/\s+/g, '-'); // Substitui espaços por hifens
  };

  useEffect(() => {
    setFormatIndex(0);
    setHasError(false);
    
    if (name) {
      const sanitized = sanitizeFileName(name);
      setImgSrc(`${bucketUrl}/${sanitized}${formats[0]}`);
    } else {
      setHasError(true);
    }
  }, [name]);

  const handleError = () => {
    if (formatIndex < formats.length - 1) {
      const nextIndex = formatIndex + 1;
      const sanitized = sanitizeFileName(name);
      setFormatIndex(nextIndex);
      setImgSrc(`${bucketUrl}/${sanitized}${formats[nextIndex]}`);
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#3D2B1F]/30 to-[#2C1E14]/40 text-[#5C4033]/60 border border-dashed border-[#5C4033]/40 p-4 select-none ${className}`}>
        <Skull size={24} className="stroke-[1.5] text-[#5C4033]/50 animate-pulse" />
        <span className="text-[9px] uppercase font-bold tracking-wider text-[#5C4033]/60 font-sans mt-1.5">Sem Ilustração</span>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden bg-black/5 flex items-center justify-center ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt={name}
        onError={handleError}
        className="w-full h-full object-cover transition-opacity duration-300 hover:scale-105"
        style={{ imageRendering: 'auto' }}
      />
    </div>
  );
};
