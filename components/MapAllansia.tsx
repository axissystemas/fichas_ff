'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Info, Image as ImageIcon, Sparkles, Compass } from 'lucide-react';

interface Coords {
  x: number; // Porcentagem do lado esquerdo (0 a 100)
  y: number; // Porcentagem do topo (0 a 100)
}

export interface LocationData {
  id: string;
  name: string;
  coords: Coords;
  books: string[];
  description: string;
  lore: string;
}

// Lista de livros de Allansia e suas localizações calibradas para o mapa em português
export const ALLANSIA_LOCATIONS: LocationData[] = [
  {
    id: 'firetop_mountain',
    name: 'Montanha do Fogo (Firetop Mountain)',
    coords: { x: 71.5, y: 25.0 },
    books: ['O Feiticeiro da Montanha de Fogo', 'Retorno à Montanha de Fogo'],
    description: 'O pico duplo marcante de Allansia, lar do feiticeiro Zagor.',
    lore: 'Situada no norte de Allansia, esta montanha de picos duplos abriga veios de pedra vermelha brilhante. Sob suas fundações ergue-se o mortal labirinto subterrâneo de Zagor, repleto de monstros e tesouros lendários.',
  },
  {
    id: 'fang',
    name: 'Cidade de Fang',
    coords: { x: 54.0, y: 18.0 },
    books: ['A Masmorra da Morte', 'Desafio dos Campeões', 'Assassinos de Allansia'],
    description: 'A cidade mercantil governada pelo Barão Sukumvit, lar do Labirinto do Medo.',
    lore: 'Localizada na margem norte do Rio Kok, Fang atrai anualmente centenas de aventureiros para a famosa "Prova dos Campeões" — um teste de sobrevivência brutal em uma masmorra repleta de armadilhas mortais e feras brutais.',
  },
  {
    id: 'darkwood_forest',
    name: 'Floresta de Darkwood (Darkwood Forest)',
    coords: { x: 78.0, y: 70.0 },
    books: ['A Floresta da Destruição', 'Criatura Selvagem'],
    description: 'Uma floresta ancestral e impenetrável, lar do mago bondoso Yaztromo.',
    lore: 'Esta vasta área florestal é evitada por mercadores comuns devido às suas criaturas perigosas. No entanto, na sua fronteira sul ergue-se a torre do mago Yaztromo, um farol de esperança e sabedoria que vende itens mágicos a heróis em jornadas importantes.',
  },
  {
    id: 'port_blacksand',
    name: 'Porto Areia Negra (Port Blacksand)',
    coords: { x: 41.0, y: 53.0 },
    books: ['A Cidade dos Ladrões', 'Ladrão da Meia-Noite', 'O Porto do Perigo'],
    description: 'A infame Cidade dos Ladrões, governada pelo cruel Lorde Azul.',
    lore: 'Porto Areia Negra é o porto mais corrupto de Titan. Famosa por seus contrabandistas, piratas e guildas clandestinas de assassinos, a cidade é uma teia perigosa onde qualquer passo em falso nas vielas sombrias pode ser o último.',
  },
  {
    id: 'citadel_of_chaos',
    name: 'Cidadela da Garganta Negra (Citadel of Chaos)',
    coords: { x: 88.0, y: 90.0 },
    books: ['A Cidadela do Caos'],
    description: 'A fortaleza mágica do sombrio bruxo Balthus Dire.',
    lore: 'No topo de Craggen Rock, no sul de Allansia, ergue-se esta cidadela fortificada de pedra negra. Balthus Dire reuniu aqui uma hoste de criaturas mutantes e monstros na esperança de conquistar as terras humanas da planície.',
  },
  {
    id: 'crystal_peaks',
    name: 'Montes de Cristal (Crystal Peaks / Icefinger)',
    coords: { x: 46.0, y: 10.0 },
    books: ['As Cavernas da Bruxa da Neve'],
    description: 'A cordilheira gelada do extremo norte, lar da Bruxa da Neve.',
    lore: 'Região de frio extremo e geleiras eternas. Sob as cavernas mais profundas das geleiras reside a Bruxa da Neve, que planejava cobrir todo o continente com uma tempestade de inverno permanente usando seus lacaios de gelo.',
  },
  {
    id: 'shadowlands',
    name: 'Terras das Sombras (Shadowlands)',
    coords: { x: 95.0, y: 40.0 },
    books: ['Exércitos da Morte'],
    description: 'O deserto sem lei ao leste, lar do Shadow Demon e seus mortos-vivos.',
    lore: 'Uma terra devastada de cinzas e rochas tóxicas além dos Montes da Dor. Sob o comando do tirano Shadow Demon, as legiões de esqueletos e zumbis ressurgem destas terras para ameaçar o porto comercial de Carnopolis.',
  },
  {
    id: 'temple_of_terror',
    name: 'Templo de Vatos (Temple of Terror)',
    coords: { x: 54.0, y: 91.0 },
    books: ['O Templo do Terror'],
    description: 'A cidade sagrada perdida no Deserto dos Crânios.',
    lore: 'Protegida por miragens mágicas e dunas de calor assassino, a cidade subterrânea de Vatos abriga o Templo do Terror, onde o arquimago Malbordus busca cinco runas de poder deixadas por demônios antigos.',
  },
  {
    id: 'salamonis',
    name: 'Reino de Salamonis',
    coords: { x: 80.0, y: 75.0 },
    books: ['Segredos de Salamonis'],
    description: 'A prestigiada cidade-estado humana, rica em cultura e glória militar.',
    lore: 'Uma das civilizações humanas mais antigas e prósperas de Allansia Central. É governada pelo bondoso Rei Salamon e serve como refúgio comercial, além de ser famosa por suas imponentes guildas de cavaleiros.',
  },
  {
    id: 'fire_island',
    name: 'Ilha de Fogo (Fire Island / Lizard King)',
    coords: { x: 20.0, y: 81.0 },
    books: ['A Ilha do Rei Lagarto'],
    description: 'A perigosa ilha tropical ao sul de Allansia, lar do Rei Lagarto.',
    lore: 'Uma ilha vulcânica habitada por perigosos homens-lagarto selvagens e monstros do período pré-histórico. Suas tribos assaltam navios mercantes e escravizam camponeses costeiros sob o jugo mental do tirânico Rei Lagarto.',
  },
  {
    id: 'lake_of_shadows',
    name: 'Lago das Sombras (Lake of Shadows)',
    coords: { x: 88.0, y: 50.0 },
    books: ['A Cripta do Feiticeiro'],
    description: 'O pântano envolto em névoa onde reside a cripta do necromante Razaak.',
    lore: 'Uma região tenebrosa nas terras orientais de Allansia. Nas profundezas desse lago lodoso e morto, o necromante Razaak ressuscitou com o objetivo de espalhar uma praga mortal e reinar absoluto.',
  },
  {
    id: 'inland_sea',
    name: 'Mar Interior de Allansia (Inland Sea)',
    coords: { x: 75.0, y: 65.0 },
    books: ['Mares de Sangue'],
    description: 'Cenário das disputas piratas pelo título de Capitão dos Mares.',
    lore: 'A imensa bacia marítima que conecta as províncias comerciais. Suas águas são disputadas por frotas de piratas saqueadores de Porto Areia Negra e repletas de perigos ecológicos, como o terrível Redemoinho.',
  },
  {
    id: 'stonebridge',
    name: 'Stonebridge (Ponte de Pedra)',
    coords: { x: 58.0, y: 38.0 },
    books: ['Sombra de Gigantes'],
    description: 'A lendária aldeia anã com sua colossal ponte arqueada.',
    lore: 'Famosa pela grandiosa ponte anã construída sobre o Rio Vermelho. A aldeia é habitada por mineiros e artesãos orgulhosos, sendo também um ponto de resistência chave contra as invasões de gigantes que descem dos montes.',
  },
  {
    id: 'blood_island',
    name: 'Ilha de Sangue (Blood Island)',
    coords: { x: 10.0, y: 35.0 },
    books: ['A Masmorra na Ilha de Sangue'],
    description: 'Uma prisão insular enigmática na costa oeste.',
    lore: 'Localizada no oceano ocidental, esta ilha isolada esconde uma rede intrincada de masmorras naturais e masmorras construídas que guardam tesouros cobiçados e feras brutais prisioneiras.',
  },
  {
    id: 'trolltooth_pass',
    name: 'Passo do Dente de Troll (Trolltooth Pass)',
    coords: { x: 57.0, y: 38.0 },
    books: ['Criatura Selvagem'],
    description: 'O desfiladeiro rochoso disputado por tribos de monstros.',
    lore: 'Um vale sinuoso e rochoso infestado de goblins, orcs e trolls territoriais. É a principal passagem montanhosa entre Allansia Oriental e Ocidental, conhecida pelas emboscadas sangrentas contra viajantes.',
  }
];

// Mapeamento de aventuras de fora de Allansia
export const OTHER_SETTINGS: Record<string, { name: string; description: string; details: string }> = {
  'Encontro Marcado com o M.E.D.O.': {
    name: 'Titan City (Cidade de Titan)',
    description: 'Cenário urbano moderno e tecnológico, fora de Allansia.',
    details: 'Uma metrópole contemporânea com arranha-céus, indústrias, quadrilhas de supervilões e patrulhas policiais. O jogador assume o papel de um super-herói que combate o crime usando superpoderes e tecnologia.',
  },
  'A Mansão do Inferno': {
    name: 'Mansão do Inferno (Inferno House)',
    description: 'Uma mansão vitoriana assombrada localizada na Terra.',
    details: 'Situada em nossa própria realidade/dimensão (Inglaterra contemporânea). Um abrigo sob uma tempestade que se revela um reduto de cultistas satânicos, fantasmas e demônios antigos liderados pelo Conde de Brissac.',
  },
  'A Cripta do Vampiro': {
    name: 'Mortvania (Velho Mundo)',
    description: 'Um principado sombrio e gótico no continente do Velho Mundo.',
    details: 'Localizado além do oceano, no continente do Velho Mundo de Titan. Um vale envolto em névoas eternas e governado pelo vampiro Conde Heydrich em seu castelo gótico sobre o abismo.',
  },
  'As Montanhas Shamutanti': {
    name: 'Kakhabad (Velho Mundo)',
    description: 'A terra sem leis de Kakhabad na série Sorcery!.',
    details: 'Localizada no Velho Mundo. Uma região selvagem composta por desfiladeiros hostis, colinas rochosas e vilas perigosas que servem de portão de entrada para a Coroa dos Reis.',
  },
  'Kharé: Porto dos Ardis': {
    name: 'Kharé (Cidade dos Ardis)',
    description: 'A cidade-armadilha e labiríntica de Kharé no Velho Mundo.',
    details: 'Uma cidade construída na foz de um grande rio, famosa por seus ardis mágicos, gangues de esgoto, portais secretos e as lendárias linhas de feitiços que trancam seus portões.',
  },
  'As Sete Serpentes': {
    name: 'Deserto de Baklands (Velho Mundo)',
    description: 'O deserto árido habitado pelas sete serpentes mágicas.',
    details: 'Uma extensão inóspita e arenosa onde sete serpentes místicas vigiam o caminho do herói, enviando segredos telepáticos ao Arquimago.',
  },
  'A Coroa dos Reis': {
    name: 'Fortaleza de Mampang (Velho Mundo)',
    description: 'A imponente fortaleza mágica no topo da colina de Mampang.',
    details: 'A cidadela fortificada e impenetrável onde o Arquimago esconde a cobiçada Coroa dos Reis, cercada por guardas leais e armadilhas mentais.',
  },
  'Nave Espacial Traveller': {
    name: 'Espaço Profundo (Galáxia FF)',
    description: 'Estações espaciais e planetas desconhecidos na ficção científica.',
    details: 'Uma aventura futurista no espaço profundo da nave espacial Traveller, com buracos negros, alienígenas hostis, lasers e computadores de bordo.',
  },
  'As Coligações de Kether': {
    name: 'Sistema Solar de Kether',
    description: 'Cenário espacial de ficção científica da série Traveller.',
    details: 'O jogador assume o comando de um caça estelar no sistema estelar de Kether, lutando contra o sindicato do crime que tenta controlar substâncias narcóticas cósmicas.',
  },
  'A Espada do Samurai': {
    name: 'Império de Hachiman (Continente de Khul)',
    description: 'Um reino oriental inspirado no Japão feudal em outro continente.',
    details: 'Hachiman localiza-se no continente de Khul, em Titan. É uma terra de samurais honrados, ninjas assassinos, demônios Yokai e templos de meditação governada pelo Shogun.',
  },
  'Guerreiro das Estradas': {
    name: 'Terra Devastada (EUA Pós-Apocalíptico)',
    description: 'As rodovias americanas pós-guerra nuclear.',
    details: 'Uma dimensão alternativa baseada nas estradas desertas de uma Terra destruída pela guerra nuclear. Aventura baseada em direção de veículos blindados contra gangues motorizadas.',
  }
};

interface MapProps {
  activeBook: string;
  isPapyrus: boolean;
}

export default function MapAllansia({ activeBook, isPapyrus }: MapProps) {
  const [imageSrc, setImageSrc] = useState('/mapa_allansia.png');
  const [imageError, setImageError] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [showAllLocations, setShowAllLocations] = useState(true);

  // Estados de Zoom, Panning e Helper de Coordenadas
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });
  const [clickedCoords, setClickedCoords] = useState<{ x: number; y: number } | null>(null);
  const [copied, setCopied] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Encontra a localização correspondente ao livro-jogo atual
  const activeLocation = ALLANSIA_LOCATIONS.find((loc) =>
    loc.books.some((book) => book.toLowerCase() === activeBook.toLowerCase())
  );

  const outsideSetting = OTHER_SETTINGS[activeBook];

  // Define a localização selecionada por padrão
  useEffect(() => {
    if (activeLocation) {
      setSelectedLocation(activeLocation);
    } else {
      setSelectedLocation(null);
    }
  }, [activeBook, activeLocation]);

  const handleImageError = () => {
    if (imageSrc === '/mapa_allansia.png') {
      setImageSrc('/mapa_allansia.jpg');
    } else {
      setImageError(true);
    }
  };

  // Controles de Zoom
  const handleZoomChange = (delta: number) => {
    setZoom((prev) => Math.min(3, Math.max(1, prev + delta)));
  };

  // Arrastar e Panning (Drag to Scroll)
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoom === 1 || !containerRef.current) return;
    setIsDragging(true);
    setPanStart({
      x: e.clientX,
      y: e.clientY,
      scrollLeft: containerRef.current.scrollLeft,
      scrollTop: containerRef.current.scrollTop,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || zoom === 1 || !containerRef.current) return;
    e.preventDefault();
    const dx = e.clientX - panStart.x;
    const dy = e.clientY - panStart.y;
    containerRef.current.scrollLeft = panStart.scrollLeft - dx;
    containerRef.current.scrollTop = panStart.scrollTop - dy;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Utilitário de Clique para capturar Coordenadas exatas
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Se clicou em um pin (botão), ignora a captura de coordenada de fundo
    const target = e.target as HTMLElement;
    if (target.closest('.map-pin-btn')) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = parseFloat(((e.clientX - rect.left) / rect.width * 100).toFixed(1));
    const y = parseFloat(((e.clientY - rect.top) / rect.height * 100).toFixed(1));

    setClickedCoords({ x, y });
    navigator.clipboard.writeText(`coords: { x: ${x}, y: ${y} }`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 font-sans select-none">
      {/* ── Área Principal: Mapa ou Fallback Vetorial ── */}
      <div className="flex-1 flex flex-col gap-3">
        {/* Toggle de Exibição e Ajuda */}
        <div className="flex flex-wrap items-center justify-between text-xs font-bold px-1 gap-2">
          <span className="opacity-70 flex items-center gap-1.5">
            <Compass size={14} className={isPapyrus ? 'text-[#8B4513]' : 'text-cyan-400'} />
            Aventure-se por Titan
            <span className="text-[10px] opacity-60 font-normal">
              (Use +/- para dar zoom. Clique no mapa para ver/copiar coordenadas X,Y)
            </span>
          </span>
          <button
            onClick={() => setShowAllLocations(!showAllLocations)}
            className={`px-2.5 py-1 border transition-all rounded text-[10px] uppercase font-bold cursor-pointer hover:bg-current/5 ${
              isPapyrus ? 'border-[#5C4033] text-[#5C4033]' : 'border-slate-700 text-slate-300'
            }`}
          >
            {showAllLocations ? 'Mostrar Apenas Atual' : 'Mostrar Todos os Livros'}
          </button>
        </div>

        {/* Container do Mapa com Panning */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className={`relative w-full aspect-[5/3] overflow-auto border-2 scrollbar-none transition-colors duration-300 ${
            zoom > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
          } ${
            isPapyrus
              ? 'border-[#5C4033] bg-[#EAD8B8]/30 shadow-md'
              : 'border-slate-800 bg-slate-950/40 rounded-xl shadow-inner'
          }`}
        >
          {/* Controles Flutuantes de Zoom (Canto Superior Esquerdo) */}
          <div className="absolute top-2.5 left-2.5 z-20 flex gap-1 pointer-events-auto">
            <button
              onClick={() => handleZoomChange(0.5)}
              disabled={zoom >= 3}
              className={`w-7 h-7 flex items-center justify-center font-bold text-sm border rounded-lg transition active:scale-90 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isPapyrus 
                  ? 'bg-[#FDF6E3] border-[#5C4033] text-[#2D1D16] hover:bg-[#EAD8B8]/40' 
                  : 'bg-slate-900 border-slate-800 text-slate-100 hover:bg-slate-800'
              }`}
              title="Aumentar Zoom (+)"
            >
              +
            </button>
            <button
              onClick={() => handleZoomChange(-0.5)}
              disabled={zoom <= 1}
              className={`w-7 h-7 flex items-center justify-center font-bold text-sm border rounded-lg transition active:scale-90 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isPapyrus 
                  ? 'bg-[#FDF6E3] border-[#5C4033] text-[#2D1D16] hover:bg-[#EAD8B8]/40' 
                  : 'bg-slate-900 border-slate-800 text-slate-100 hover:bg-slate-800'
              }`}
              title="Diminuir Zoom (-)"
            >
              −
            </button>
            <button
              onClick={() => { setZoom(1); }}
              disabled={zoom === 1}
              className={`px-2 h-7 flex items-center justify-center font-bold text-[9px] uppercase border rounded-lg transition active:scale-90 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isPapyrus 
                  ? 'bg-[#FDF6E3] border-[#5C4033] text-[#2D1D16] hover:bg-[#EAD8B8]/40' 
                  : 'bg-slate-900 border-slate-800 text-slate-100 hover:bg-slate-800'
              }`}
              title="Resetar Zoom"
            >
              1x
            </button>
          </div>

          {/* Feedback de Coordenadas Clicadas (Canto Superior Direito) */}
          {clickedCoords && (
            <div className="absolute top-2.5 right-2.5 z-20 px-2 py-1 bg-black/85 backdrop-blur-sm rounded-lg text-[9px] font-bold text-slate-200 flex items-center gap-1.5 border border-slate-700/50 shadow-lg pointer-events-auto">
              <span>📍 Clique: <span className="text-amber-400 font-mono">x: {clickedCoords.x}, y: {clickedCoords.y}</span></span>
              <span className={copied ? "text-emerald-400 font-extrabold" : "text-slate-400 font-normal"}>
                {copied ? "Copiado!" : "Click p/ copiar"}
              </span>
            </div>
          )}

          {/* Wrapper dimensionável que escala sob o Zoom */}
          <div
            onClick={handleMapClick}
            className="relative h-full aspect-[5/3] origin-top-left transition-all duration-200"
            style={{
              width: `${zoom * 100}%`,
              height: `${zoom * 100}%`,
            }}
          >
            {/* Se a imagem falhar ao carregar, renderiza o fallback vetorial em SVG */}
            {imageError ? (
              <div className="absolute inset-0 select-none">
                {/* SVG do Mapa Vetorial Autogerado de Allansia */}
                <svg viewBox="0 0 1000 600" className="w-full h-full opacity-85" fill="none">
                  {/* Linhas de Grade Estilo Pergaminho Antigo */}
                  <line x1="100" y1="0" x2="100" y2="600" stroke="currentColor" strokeOpacity="0.04" strokeDasharray="5,5" />
                  <line x1="300" y1="0" x2="300" y2="600" stroke="currentColor" strokeOpacity="0.04" strokeDasharray="5,5" />
                  <line x1="500" y1="0" x2="500" y2="600" stroke="currentColor" strokeOpacity="0.04" strokeDasharray="5,5" />
                  <line x1="700" y1="0" x2="700" y2="600" stroke="currentColor" strokeOpacity="0.04" strokeDasharray="5,5" />
                  <line x1="900" y1="0" x2="900" y2="600" stroke="currentColor" strokeOpacity="0.04" strokeDasharray="5,5" />
                  
                  <line x1="0" y1="100" x2="1000" y2="100" stroke="currentColor" strokeOpacity="0.04" strokeDasharray="5,5" />
                  <line x1="0" y1="250" x2="1000" y2="250" stroke="currentColor" strokeOpacity="0.04" strokeDasharray="5,5" />
                  <line x1="0" y1="400" x2="1000" y2="400" stroke="currentColor" strokeOpacity="0.04" strokeDasharray="5,5" />
                  <line x1="0" y1="550" x2="1000" y2="550" stroke="currentColor" strokeOpacity="0.04" strokeDasharray="5,5" />

                  {/* Rosa dos Ventos Estilizada */}
                  <g transform="translate(850, 480)" className="opacity-20">
                    <circle r="40" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
                    <path d="M0 -50 L5 -10 L25 -25 L10 -5 L50 0 L10 5 L25 25 L5 10 L0 50 L-5 10 L-25 25 L-10 5 L-50 0 L-10 -5 L-25 -25 L-5 -10 Z" fill="currentColor" />
                    <text x="-4" y="-55" fontSize="12" fontWeight="bold" fill="currentColor">N</text>
                  </g>

                  {/* Desenho da Linha Costeira Vetorial de Allansia */}
                  <path
                    d="M 120 180 Q 90 280 150 320 T 170 410 Q 230 490 380 460 T 580 480 Q 730 460 830 400 T 900 280 Q 860 130 730 80 T 530 60 Q 380 40 230 80 Z"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeOpacity="0.25"
                    fill="currentColor"
                    fillOpacity="0.03"
                    className={isPapyrus ? 'text-[#8B4513]' : 'text-slate-500'}
                  />

                  {/* Ilha do Rei Lagarto */}
                  <path
                    d="M 180 540 Q 170 560 200 560 T 220 540 Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeOpacity="0.2"
                    fill="currentColor"
                    fillOpacity="0.05"
                    className={isPapyrus ? 'text-[#8B4513]' : 'text-slate-500'}
                  />

                  {/* Ilhas Menores Ocidentais */}
                  <path
                    d="M 85 200 Q 75 210 95 220 T 90 200 Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeOpacity="0.2"
                    fill="currentColor"
                    fillOpacity="0.05"
                    className={isPapyrus ? 'text-[#8B4513]' : 'text-slate-500'}
                  />

                  {/* Mar Interior */}
                  <path
                    d="M 720 380 Q 780 340 820 400 T 720 380 Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeOpacity="0.15"
                    fill="currentColor"
                    fillOpacity="0.02"
                    className={isPapyrus ? 'text-[#8B4513]' : 'text-slate-500'}
                  />

                  {/* Cadeias de Montanhas */}
                  <g className="opacity-15" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="420,70 435,90 405,90" />
                    <polygon points="440,65 455,85 425,85" />
                    <polygon points="460,60 475,80 445,80" />
                    <polygon points="480,68 495,88 465,88" />
                    <polygon points="800,280 815,305 785,305" />
                    <polygon points="820,300 835,325 805,325" />
                    <polygon points="840,320 855,345 825,345" />
                    <polygon points="320,400 335,420 305,420" />
                    <polygon points="290,410 305,430 275,430" />
                  </g>

                  {/* Floresta de Darkwood */}
                  <g className="opacity-10" fill="currentColor">
                    <circle cx="680" cy="250" r="15" />
                    <circle cx="700" cy="240" r="20" />
                    <circle cx="720" cy="260" r="18" />
                    <circle cx="690" cy="270" r="15" />
                    <circle cx="715" cy="280" r="12" />
                    <circle cx="735" cy="250" r="16" />
                  </g>

                  <text x="80" y="270" fontSize="9" letterSpacing="2" fontWeight="bold" opacity="0.25" fill="currentColor" transform="rotate(-90 80 270)">OCEANUS OCCIDENTALIS</text>
                  <text x="500" y="320" fontSize="14" letterSpacing="4" fontWeight="bold" opacity="0.12" fill="currentColor" textAnchor="middle">ALLANSIA</text>
                </svg>

                <div className="absolute bottom-2.5 left-2.5 right-2.5 p-2 bg-black/60 rounded flex items-center justify-between text-slate-300 font-sans backdrop-blur-sm pointer-events-auto">
                  <p className="text-[10px] leading-tight max-w-[80%]">
                    ℹ️ Exibindo mapa esquemático de Allansia. Adicione a imagem real como{' '}
                    <span className="font-mono text-amber-400">mapa_allansia.png</span> na pasta{' '}
                    <span className="font-mono text-amber-400">/public</span> do projeto para usá-la.
                  </p>
                  <ImageIcon size={14} className="text-slate-400" />
                </div>
              </div>
            ) : (
              <img
                src={imageSrc}
                alt="Mapa de Allansia"
                onError={handleImageError}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
              />
            )}

            {/* ── PINS DE LOCALIZAÇÃO SOBRE O MAPA ── */}
            {ALLANSIA_LOCATIONS.map((loc) => {
              const isActive = activeLocation?.id === loc.id;

              // Se a opção de mostrar tudo estiver desativada e este não for o ativo, não exibe
              if (!showAllLocations && !isActive) return null;

              return (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc)}
                  className="absolute map-pin-btn group z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                  style={{ left: `${loc.coords.x}%`, top: `${loc.coords.y}%` }}
                >
                  {isActive ? (
                    /* Pin de Aventura Ativo (Pulsante Dourado/Vermelho Premium) */
                    <div className="relative flex items-center justify-center">
                      <span className="absolute inline-flex h-7 w-7 rounded-full bg-amber-500/50 animate-ping" />
                      <span className="absolute inline-flex h-5 w-5 rounded-full bg-red-600/30 animate-pulse border border-red-500/60" />
                      <div className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-600 border border-amber-300 shadow-[0_0_10px_rgba(239,68,68,0.8)]">
                        <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                      </div>
                    </div>
                  ) : (
                    /* Pin Inativo (Outros pontos do atlas) */
                    <div className="relative flex items-center justify-center">
                      <div
                        className={`h-2.5 w-2.5 rounded-full border shadow-sm transition-colors ${
                          selectedLocation?.id === loc.id
                            ? 'bg-cyan-500 border-white scale-110 shadow-cyan-500/50'
                            : 'bg-slate-500/70 border-slate-300 group-hover:bg-slate-400 group-hover:border-white'
                        }`}
                      />
                    </div>
                  )}

                  {/* Tooltip de Hover */}
                  <div
                    className={`absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded px-2 py-1 text-[10px] font-bold shadow-lg transition-all duration-200 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none border ${
                      isPapyrus
                        ? 'bg-[#FDF6E3] border-[#5C4033] text-[#2D1D16]'
                        : 'bg-slate-900 border-slate-800 text-slate-100'
                    }`}
                  >
                    {loc.name}
                    {isActive && <span className="ml-1 text-amber-500 font-extrabold">(Atual)</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Painel de Detalhes à Direita ── */}
      <div
        className={`w-full md:w-80 flex-shrink-0 p-4 border rounded-xl flex flex-col justify-between gap-4 font-sans ${
          isPapyrus ? 'bg-[#FDF6E3]/70 border-[#5C4033]/45' : 'bg-slate-900/50 border-slate-800'
        }`}
      >
        {/* Caso a aventura seja jogada fora de Allansia */}
        {outsideSetting ? (
          <div className="flex-1 flex flex-col gap-3">
            <div className={`p-3 border-l-4 rounded flex gap-2.5 ${
              isPapyrus ? 'bg-amber-800/5 border-amber-800 text-[#2D1D16]' : 'bg-cyan-950/20 border-cyan-500 text-slate-300'
            }`}>
              <Info size={16} className="shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wider font-extrabold opacity-75">Configuração Diferente</p>
                <p className="text-[11px] font-bold font-serif mt-0.5">{outsideSetting.name}</p>
                <p className="text-[10px] mt-1 opacity-90 leading-relaxed font-sans">{outsideSetting.description}</p>
              </div>
            </div>
            <div className="text-left space-y-2 mt-2">
              <h4 className={`text-xs font-bold uppercase tracking-wider ${isPapyrus ? 'text-[#8B4513]' : 'text-cyan-400'}`}>
                Detalhes da Região
              </h4>
              <p className={`text-[11px] leading-relaxed font-sans opacity-95 ${isPapyrus ? 'text-[#2D1D16]' : 'text-slate-350'}`}>
                {outsideSetting.details}
              </p>
            </div>
          </div>
        ) : selectedLocation ? (
          /* Exibição da Localização de Allansia Selecionada */
          <div className="flex-1 flex flex-col gap-3">
            <div className="text-left space-y-1.5 border-b pb-3 border-current/15">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-extrabold uppercase tracking-wide font-serif">
                  {selectedLocation.name}
                </h3>
                {activeLocation?.id === selectedLocation.id && (
                  <span className={`px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider rounded border animate-pulse ${
                    isPapyrus
                      ? 'bg-red-800/10 text-red-955 border-red-800/30'
                      : 'bg-emerald-950/40 text-emerald-400 border-emerald-700/50'
                  }`}>
                    Aventura Atual
                  </span>
                )}
              </div>
              <p className={`text-[11px] leading-tight italic font-serif ${isPapyrus ? 'text-[#8B4513]' : 'text-cyan-400'}`}>
                {selectedLocation.description}
              </p>
            </div>

            <div className="text-left space-y-2">
              <h4 className={`text-xs font-bold uppercase tracking-wider ${isPapyrus ? 'text-[#8B4513]' : 'text-cyan-400'}`}>
                Livros Relacionados
              </h4>
              <div className="flex flex-wrap gap-1">
                {selectedLocation.books.map((book, idx) => (
                  <span
                    key={idx}
                    className={`text-[9px] font-bold px-2 py-0.5 border rounded ${
                      book.toLowerCase() === activeBook.toLowerCase()
                        ? (isPapyrus ? 'bg-[#5C4033] text-[#EAD8B8] border-[#5C4033]' : 'bg-cyan-500 text-slate-950 border-cyan-400 font-extrabold')
                        : (isPapyrus ? 'bg-[#EAD8B8]/30 text-[#2D1D16] border-[#C5A059]/40' : 'bg-slate-800/60 text-slate-350 border-slate-700')
                    }`}
                  >
                    📚 {book}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-left space-y-2 pt-2">
              <h4 className={`text-xs font-bold uppercase tracking-wider ${isPapyrus ? 'text-[#8B4513]' : 'text-cyan-400'}`}>
                História e Lore
              </h4>
              <p className={`text-[11px] leading-relaxed font-sans opacity-95 ${isPapyrus ? 'text-[#2D1D16]' : 'text-slate-350'}`}>
                {selectedLocation.lore}
              </p>
            </div>
          </div>
        ) : (
          /* Estado Vazio */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 opacity-60">
            <Compass size={36} className="mb-2 animate-spin" style={{ animationDuration: '8s' }} />
            <p className="text-xs font-bold">Selecione um ponto no mapa para ver detalhes</p>
          </div>
        )}

        {/* Rodapé explicativo da região geral */}
        <div className="text-[9px] opacity-60 border-t pt-2.5 text-center flex items-center justify-center gap-1">
          <Sparkles size={10} className="text-amber-500" />
          <span>Continente de Allansia • Mundo de Titan</span>
        </div>
      </div>
    </div>
  );
}
