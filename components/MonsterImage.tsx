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

  // Obtém informações da imagem (nome do arquivo e altura com base nas regras)
  const getMonsterImageInfo = (rawName: string) => {
    const lowerName = rawName.toLowerCase();
    let imageName = '';
    let height = 92; // Altura padrão (83x92 px)

    if (lowerName.includes('orc')) {
      imageName = 'orc';
    } else if (lowerName.includes('zumbi')) {
      imageName = 'zumbi';
    } else if (lowerName.includes('morcegos gigantes') || lowerName.includes('morcego gigante')) {
      imageName = 'morcegos-gigantes';
      height = 73; // Exceção: 83x73 px
    } else {
      // Higienização padrão
      imageName = rawName
        .normalize('NFD') // Decompõe acentos
        .replace(/[\u0300-\u036f]/g, '') // Remove os acentos
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
        .replace(/\s+/g, '-'); // Substitui espaços por hifens
    }

    return { imageName, height };
  };

  const { imageName, height } = getMonsterImageInfo(name);

  useEffect(() => {
    setFormatIndex(0);
    setHasError(false);
    
    if (imageName) {
      setImgSrc(`${bucketUrl}/${imageName}${formats[0]}`);
    } else {
      setHasError(true);
    }
  }, [name, imageName]);

  const handleError = () => {
    if (formatIndex < formats.length - 1) {
      const nextIndex = formatIndex + 1;
      setFormatIndex(nextIndex);
      setImgSrc(`${bucketUrl}/${imageName}${formats[nextIndex]}`);
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
    <div className={`w-full h-full flex items-center justify-center bg-black/5 p-2 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt={name}
        onError={handleError}
        style={{ 
          width: '83px', 
          height: `${height}px`,
          imageRendering: 'pixelated'
        }}
        className="object-contain transition-opacity duration-300 hover:scale-110"
      />
    </div>
  );
};
