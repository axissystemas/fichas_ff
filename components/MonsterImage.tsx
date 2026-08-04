'use client';
import { useState } from 'react';
import { Skull } from 'lucide-react';
import { motion } from 'motion/react';

interface MonsterImageProps {
  name: string;
  isDead?: boolean;
  className?: string;
}

const FORMATS = ['.webp', '.jpg', '.png'];
const BUCKET_URL = 'https://uygapxzgpcoryrmaxvuh.supabase.co/storage/v1/object/public/monsters';

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

export const MonsterImage = ({ name, isDead = false, className = '' }: MonsterImageProps) => {
  const { imageName, height } = getMonsterImageInfo(name);

  const [prevImageName, setPrevImageName] = useState(imageName);
  const [formatIndex, setFormatIndex] = useState(0);
  const [hasError, setHasError] = useState(!imageName);

  // Reset de estado durante a renderização caso o nome do monstro mude
  if (imageName !== prevImageName) {
    setPrevImageName(imageName);
    setFormatIndex(0);
    setHasError(!imageName);
  }

  const imgSrc = imageName && !hasError
    ? `${BUCKET_URL}/${imageName}${FORMATS[formatIndex] || FORMATS[0]}`
    : '';

  const handleError = () => {
    if (formatIndex < FORMATS.length - 1) {
      setFormatIndex(prev => prev + 1);
    } else {
      setHasError(true);
    }
  };

  if (hasError || !imgSrc) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#3D2B1F]/30 to-[#2C1E14]/40 text-[#5C4033]/60 border border-dashed border-[#5C4033]/40 p-4 select-none ${className}`}>
        <Skull size={24} className="stroke-[1.5] text-[#5C4033]/50 animate-pulse" />
        <span className="text-[9px] uppercase font-bold tracking-wider text-[#5C4033]/60 font-sans mt-1.5">Sem Ilustração</span>
      </div>
    );
  }

  return (
    <div className={`w-full h-full flex items-center justify-center bg-black/5 p-2 overflow-hidden select-none ${className}`}>
      <motion.div
        animate={
          isDead
            ? {
                y: 6,
                rotate: 10,
                opacity: 0.35,
                filter: 'grayscale(100%) contrast(80%) brightness(60%)',
              }
            : {
                y: [0, -3, 0],
                rotate: 0,
                opacity: 1,
                filter: 'grayscale(0%) contrast(100%) brightness(100%)',
              }
        }
        transition={
          isDead
            ? { duration: 0.6, ease: 'easeOut' }
            : {
                y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
                filter: { duration: 0.5 },
                opacity: { duration: 0.5 },
                rotate: { duration: 0.5 },
              }
        }
        whileHover={!isDead ? { scale: 1.1 } : {}}
        className="flex items-center justify-center shrink-0"
      >
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
          className="object-contain"
        />
      </motion.div>
    </div>
  );
};
