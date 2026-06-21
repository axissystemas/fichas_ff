'use client';

import React, { useEffect } from 'react';
import { Youtube, Radio, ExternalLink } from 'lucide-react';
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

export function YouTubeLiveStream() {
  const { theme, youtubeSettings, loadYoutubeSettings } = useSheetStore();
  const isPapyrus = theme === 'papyrus';
  const { channelId, videoUrl, isLive } = youtubeSettings;

  // Load configuration from Supabase / localStorage on mount
  useEffect(() => {
    loadYoutubeSettings();
  }, [loadYoutubeSettings]);

  // Determine the correct embed URL
  const videoId = extractYoutubeId(videoUrl);
  let embedUrl = '';

  if (isLive) {
    if (videoId) {
      embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
    } else {
      embedUrl = `https://www.youtube.com/embed/live_stream?channel=${channelId}&autoplay=1&mute=1`;
    }
  } else {
    if (videoId) {
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else {
      embedUrl = `https://www.youtube.com/embed/live_stream?channel=${channelId}`;
    }
  }

  const cardBase = isPapyrus
    ? 'border-2 border-[#C5A059] bg-[#EAD8B8]/30 shadow-inner rounded-sm p-6 sm:p-10 text-[#2D1D16] flex flex-col gap-6 h-full'
    : 'border border-[#4a5568]/50 bg-slate-900/60 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.1)] rounded-xl p-6 sm:p-10 text-slate-300 flex flex-col gap-6 h-full';

  const btnBase = isPapyrus
    ? 'border border-[#5C4033] text-[#2D1D16] hover:bg-[#5C4033] hover:text-[#EAD8B8] transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider py-2 px-3'
    : 'border border-[#4a5568] text-[#cbd5e0] hover:bg-slate-700/60 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider py-2 px-3 rounded';

  const primaryBtnBase = isPapyrus
    ? 'border-2 border-[#5C4033] bg-[#5C4033] text-[#EAD8B8] hover:bg-[#3D2B1F] cursor-pointer transition flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider py-2.5 px-4'
    : 'border border-cyan-500/60 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 cursor-pointer transition rounded flex items-center justify-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider py-2.5 px-4';

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
        </div>
      </div>

      {/* Video Iframe Container */}
      <div className="relative aspect-video w-full border border-current/20 shadow-md bg-black overflow-hidden group">
        {isLive ? (
          <iframe
            src={embedUrl}
            title="YouTube Live Stream"
            className="absolute top-0 left-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-slate-950">
            <img
              src="/offline-banner.jpg"
              alt="Offline - Aventuras Fantásticas"
              className="w-full h-full object-cover select-none pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-4">
              <div className="flex items-center gap-1.5 text-white">
                <span className="h-2 w-2 rounded-full bg-slate-500"></span>
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider opacity-90">Canal Atualmente Offline</span>
              </div>
            </div>
          </div>
        )}
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
