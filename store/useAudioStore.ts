import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { audio, music } from '@/lib/audio';

interface AudioState {
  isMuted: boolean;
  volume: number; // 0.0 a 1.0
  isPlayingMusic: boolean;
  currentBookMusic?: string;

  toggleMute: () => void;
  setVolume: (volume: number) => void;
  playMusicForBook: (bookId: string) => void;
  stopMusic: () => void;
  playBlip: () => void;
  playDiceRoll: () => void;
  playCoin: () => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set, get) => ({
      isMuted: false,
      volume: 0.8,
      isPlayingMusic: false,
      currentBookMusic: undefined,

      toggleMute: () => {
        const nextMuted = !get().isMuted;
        set({ isMuted: nextMuted });
        audio.setEnabled(!nextMuted);
        music.setEnabled(!nextMuted);
      },

      setVolume: (newVol: number) => {
        const clamped = Math.max(0, Math.min(1, newVol));
        set({ volume: clamped });
        audio.setVolume(clamped);
        music.setVolume(clamped);
      },

      playMusicForBook: (bookId: string) => {
        const { isMuted } = get();
        set({ currentBookMusic: bookId, isPlayingMusic: true });
        if (!isMuted) {
          // Play default track
          music.play('/audios/intro.mp3');
        }
      },

      stopMusic: () => {
        set({ isPlayingMusic: false });
        music.stop();
      },

      playBlip: () => {
        if (!get().isMuted) audio.playBlip();
      },

      playDiceRoll: () => {
        if (!get().isMuted) audio.playDiceRoll();
      },

      playCoin: () => {
        if (!get().isMuted) audio.playCoin();
      },
    }),
    {
      name: 'ff_audio_store',
      partialize: (state) => ({
        isMuted: state.isMuted,
        volume: state.volume,
      }),
    }
  )
);
