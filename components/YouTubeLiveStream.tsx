'use client';

import React, { useState, useEffect } from 'react';
import { Youtube, Settings, Check, X, RefreshCw, Radio, ExternalLink } from 'lucide-react';
import { useSheetStore } from '@/store/useSheetStore';

// Helper function to extract Video ID from YouTube URLs
function extractYoutubeId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();
  if (trimmed.length === 11 && !trimmed.includes('/') && !trimmed.includes('.')) {
    return trimmed;
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|live\/)([^#\&\?]*).*/;
  const match = trimmed.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

interface YouTubeLiveStreamProps {
  isReadOnly?: boolean;
}

export function YouTubeLiveStream({ isReadOnly = false }: YouTubeLiveStreamProps) {
  const { theme } = useSheetStore();
  const isPapyrus = theme === 'papyrus';

  // Config States (persist in localStorage)
  const [channelId, setChannelId] = useState('UCQJ2X-kM3wX2HnC4a8e2r7g');
  const [videoUrl, setVideoUrl] = useState('');
  const [isLive, setIsLive] = useState(false);

  // UI States
  const [showSettings, setShowSettings] = useState(false);
  const [tempChannelId, setTempChannelId] = useState(channelId);
  const [tempVideoUrl, setTempVideoUrl] = useState(videoUrl);
  const [tempIsLive, setTempIsLive] = useState(isLive);

  // Load configuration from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedChannelId = localStorage.getItem('yt_channel_id');
      const storedVideoUrl = localStorage.getItem('yt_video_url');
      const storedIsLive = localStorage.getItem('yt_is_live');

      if (storedChannelId) {
        setChannelId(storedChannelId);
        setTempChannelId(storedChannelId);
      }
      if (storedVideoUrl !== null) {
        setVideoUrl(storedVideoUrl);
        setTempVideoUrl(storedVideoUrl);
      }
      if (storedIsLive !== null) {
        const liveVal = storedIsLive === 'true';
        setIsLive(liveVal);
        setTempIsLive(liveVal);
      }
    }
  }, []);

  const handleSaveSettings = () => {
    setChannelId(tempChannelId);
    setVideoUrl(tempVideoUrl);
    setIsLive(tempIsLive);

    if (typeof window !== 'undefined') {
      localStorage.setItem('yt_channel_id', tempChannelId);
      localStorage.setItem('yt_video_url', tempVideoUrl);
      localStorage.setItem('yt_is_live', tempIsLive ? 'true' : 'false');
    }
    setShowSettings(false);
  };

  const handleResetDefaults = () => {
    const defaultChannel = 'UCQJ2X-kM3wX2HnC4a8e2r7g';
    const defaultVideo = '';
    const defaultLive = false;

    setTempChannelId(defaultChannel);
    setTempVideoUrl(defaultVideo);
    setTempIsLive(defaultLive);
  };

  // Determine the correct embed URL
  const videoId = extractYoutubeId(videoUrl);
  let embedUrl = '';

  if (isLive) {
    // If live, prioritize channel live stream embed, otherwise fallback to specific videoId
    if (videoId) {
      embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
    } else {
      embedUrl = `https://www.youtube.com/embed/live_stream?channel=${channelId}&autoplay=1&mute=1`;
    }
  } else {
    // If offline, display custom video, or channel page trailer if none set (using a generic placeholder/intro or empty)
    if (videoId) {
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else {
      // Default fallback embed (we use a placeholder video ID or let it show the live channel stream redirect)
      embedUrl = `https://www.youtube.com/embed/live_stream?channel=${channelId}`;
    }
  }

  // Base styling classes depending on theme
  const cardBase = isPapyrus
    ? 'border-2 border-[#C5A059] bg-[#EAD8B8]/30 shadow-inner rounded-sm p-6 sm:p-10 text-[#2D1D16] flex flex-col gap-6 h-full'
    : 'border border-[#4a5568]/50 bg-slate-900/60 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.1)] rounded-xl p-6 sm:p-10 text-slate-300 flex flex-col gap-6 h-full';

  const btnBase = isPapyrus
    ? 'border border-[#5C4033] text-[#2D1D16] hover:bg-[#5C4033] hover:text-[#EAD8B8] transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider py-2 px-3'
    : 'border border-[#4a5568] text-[#cbd5e0] hover:bg-slate-700/60 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider py-2 px-3 rounded';

  const primaryBtnBase = isPapyrus
    ? 'border-2 border-[#5C4033] bg-[#5C4033] text-[#EAD8B8] hover:bg-[#3D2B1F] cursor-pointer transition flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider py-2.5 px-4'
    : 'border border-cyan-500/60 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 cursor-pointer transition rounded flex items-center justify-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider py-2.5 px-4';

  const inputBase = isPapyrus
    ? 'border border-[#5C4033] bg-[#EAD8B8]/60 text-[#2D1D16] placeholder-[#5C4033]/50 focus:outline-none focus:ring-2 focus:ring-[#C5A059] px-3 py-2 text-sm font-serif'
    : 'border border-[#4a5568] bg-slate-950 text-[#cbd5e0] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 px-3 py-2 text-sm font-mono rounded';

  return (
    <div className={cardBase}>
      {/* Header Panel */}
      <div className="flex items-center justify-between border-b border-current/10 pb-3">
        <h3 className={`text-base font-extrabold uppercase tracking-widest ${isPapyrus ? 'text-[#8B4513]' : 'text-cyan-400'} flex items-center gap-2`}>
          <Youtube className="w-5 h-5 text-red-600 animate-pulse" />
          Transmissões ao Vivo
        </h3>

        <div className="flex items-center gap-3">
          {/* Live Status indicator */}
          <div className="flex items-center gap-1.5">
            <span className={`relative flex h-2.5 w-2.5 ${isLive ? '' : 'opacity-60'}`}>
              {isLive && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isLive ? 'bg-red-600' : 'bg-slate-500'}`}></span>
            </span>
            <span className={`text-[10px] font-sans font-bold uppercase tracking-wider ${isLive ? 'text-red-500 animate-pulse' : 'opacity-60'}`}>
              {isLive ? 'AO VIVO' : 'OFFLINE'}
            </span>
          </div>

          {/* Config Toggle button */}
          {!isReadOnly && (
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-1.5 hover:bg-current/10 rounded transition cursor-pointer ${showSettings ? 'rotate-45' : ''}`}
              title="Configurações do canal"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Settings Form (Embedded inside the panel) */}
      {!isReadOnly && showSettings && (
        <div className={`p-4 border border-current/10 ${isPapyrus ? 'bg-[#5C4033]/5' : 'bg-slate-950/40 rounded-lg'} flex flex-col gap-4 animate-fade-in`}>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold tracking-wider opacity-75">ID do Canal do YouTube (UC...)</label>
              <input
                type="text"
                className={inputBase}
                placeholder="Ex: UCQJ2X-kM3wX2HnC4a8e2r7g"
                value={tempChannelId}
                onChange={(e) => setTempChannelId(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold tracking-wider opacity-75">URL / ID do Vídeo Opcional</label>
              <input
                type="text"
                className={inputBase}
                placeholder="Ex: https://www.youtube.com/watch?v=..."
                value={tempVideoUrl}
                onChange={(e) => setTempVideoUrl(e.target.value)}
              />
              <p className="text-[9px] font-sans opacity-60">Coloque a URL de uma live programada ou vídeo específico para exibir no player.</p>
            </div>

            <div className="flex items-center gap-2 border-t pt-2 border-current/10">
              <input
                type="checkbox"
                id="is-live-toggle"
                checked={tempIsLive}
                onChange={(e) => setTempIsLive(e.target.checked)}
                className={`w-4 h-4 cursor-pointer ${isPapyrus ? 'accent-[#5C4033]' : 'accent-cyan-500'}`}
              />
              <label htmlFor="is-live-toggle" className="text-xs uppercase font-bold tracking-wider cursor-pointer select-none">
                Simular status &ldquo;AO VIVO&rdquo;
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-3 border-current/10 gap-2">
            <button
              onClick={handleResetDefaults}
              className={`${btnBase} px-2.5 py-1.5`}
            >
              <RefreshCw className="w-3.5 h-3.5" /> Padrão
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSettings(false)}
                className={`${btnBase} px-2.5 py-1.5`}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveSettings}
                className={`${primaryBtnBase} py-1.5 px-3`}
              >
                <Check className="w-3.5 h-3.5" /> Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Iframe Container */}
      <div className="relative aspect-video w-full border border-current/20 shadow-md bg-black overflow-hidden group">
        <iframe
          src={embedUrl}
          title="YouTube Live Stream"
          className="absolute top-0 left-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>

      {/* Channel Information / Actions */}
      <div className="flex flex-col gap-4 mt-auto">
        <div className="flex flex-col gap-1">
          <h4 className={`font-bold text-sm uppercase tracking-wide flex items-center gap-1.5 ${isPapyrus ? 'text-[#2D1D16]' : 'text-slate-200'}`}>
            Nerdolas e Trolls RPG
          </h4>
          <p className="text-[11px] leading-relaxed opacity-80 font-sans">
            Acompanhe nossas lives de RPG, mesas de Fighting Fantasy, campanhas temáticas e discussões de sistemas clássicos!
          </p>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Subscribe */}
          <a
            href="https://www.youtube.com/@nerdolasetrollsrpg?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
            className={`${primaryBtnBase} text-center`}
          >
            Inscrever-se <ExternalLink className="w-3 h-3" />
          </a>

          {/* Open Chat */}
          <a
            href={videoId 
              ? `https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${typeof window !== 'undefined' ? window.location.hostname : ''}` 
              : `https://www.youtube.com/@nerdolasetrollsrpg/live`
            }
            target="_blank"
            rel="noopener noreferrer"
            className={`${btnBase} text-center`}
          >
            Abrir Chat <Radio className="w-3 h-3 text-red-500" />
          </a>

          {/* Channel Link */}
          <a
            href="https://www.youtube.com/@nerdolasetrollsrpg"
            target="_blank"
            rel="noopener noreferrer"
            className={`${btnBase} text-center`}
          >
            Canal YouTube <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
