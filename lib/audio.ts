'use client';

class ChiptuneEngine {
  private ctx: AudioContext | null = null;
  private volume: number = 0.3;
  private enabled: boolean = true;

  constructor() {}

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  private init() {
    if (typeof window === 'undefined') return null;
    
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch((err) => console.warn('Could not resume AudioContext:', err));
    }
    
    return this.ctx;
  }

  private createOscillator(
    type: OscillatorType,
    freqs: number[] | number,
    duration: number,
    gainValues: number[],
    gainTimes: number[]
  ) {
    const ctx = this.init();
    if (!ctx || !this.enabled) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;

    // Pitch envelope
    if (Array.isArray(freqs)) {
      if (freqs.length === 1) {
        osc.frequency.setValueAtTime(freqs[0], ctx.currentTime);
      } else {
        const step = duration / (freqs.length - 1);
        freqs.forEach((freq, idx) => {
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * step);
        });
      }
    } else {
      osc.frequency.setValueAtTime(freqs, ctx.currentTime);
    }

    // Gain envelope
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    if (gainValues.length > 0) {
      let timeOffset = 0;
      gainValues.forEach((val, idx) => {
        const durationFraction = gainTimes[idx] || 0;
        timeOffset += durationFraction;
        gainNode.gain.linearRampToValueAtTime(val * this.volume, ctx.currentTime + timeOffset);
      });
      // Final ramp to 0
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
    } else {
      gainNode.gain.setValueAtTime(this.volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    }

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  private playNoise(duration: number, gainValues: number[], gainTimes: number[], filterFreq?: number) {
    const ctx = this.init();
    if (!ctx || !this.enabled) return;

    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    // Fill buffer with random white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = buffer;

    const gainNode = ctx.createGain();
    
    let destNode: AudioNode = gainNode;
    if (filterFreq) {
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(filterFreq, ctx.currentTime);
      gainNode.connect(filter);
      destNode = filter;
    }

    // Gain envelope
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    let timeOffset = 0;
    gainValues.forEach((val, idx) => {
      const durationFraction = gainTimes[idx] || 0;
      timeOffset += durationFraction;
      gainNode.gain.linearRampToValueAtTime(val * this.volume, ctx.currentTime + timeOffset);
    });
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

    noiseNode.connect(gainNode);
    destNode.connect(ctx.destination);

    noiseNode.start();
    noiseNode.stop(ctx.currentTime + duration);
  }

  playBlip() {
    this.createOscillator('triangle', [600, 150], 0.08, [0.8, 0], [0.02, 0.06]);
  }

  playDiceRoll() {
    const ctx = this.init();
    if (!ctx || !this.enabled) return;
    const now = ctx.currentTime;
    
    // Play quick succession of retro rattle sounds
    for (let i = 0; i < 4; i++) {
      const time = now + i * 0.07;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180 + Math.random() * 180, time);
      gainNode.gain.setValueAtTime(0.5 * this.volume, time);
      gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.04);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.04);
    }
  }

  playCoin() {
    const ctx = this.init();
    if (!ctx || !this.enabled) return;
    const now = ctx.currentTime;
    
    // Classic retro double-ping coin chime: B5 (~988Hz) then E6 (~1319Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(988, now);
    gain1.gain.setValueAtTime(0.4 * this.volume, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.08);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1319, now + 0.08);
    gain2.gain.setValueAtTime(0.4 * this.volume, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.25);
  }

  playSuccess() {
    const ctx = this.init();
    if (!ctx || !this.enabled) return;
    const now = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
    
    freqs.forEach((freq, idx) => {
      const time = now + idx * 0.07;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, time);
      gainNode.gain.setValueAtTime(0.35 * this.volume, time);
      gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.15);
    });
  }

  playFailure() {
    const ctx = this.init();
    if (!ctx || !this.enabled) return;
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.35);
    
    gainNode.gain.setValueAtTime(0.5 * this.volume, now);
    gainNode.gain.linearRampToValueAtTime(0.01, now + 0.35);
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.35);
  }

  playHit() {
    // dealing damage: punchy noise crash + short square drop tone
    this.playNoise(0.18, [0.8, 0], [0.03, 0.15], 1100);
    this.createOscillator('square', [280, 90], 0.15, [0.55, 0], [0.02, 0.13]);
  }

  playHurt() {
    // taking damage: low heavy noise crash + descending sawtooth buzz
    this.playNoise(0.25, [0.9, 0], [0.04, 0.21], 450);
    this.createOscillator('sawtooth', [170, 50], 0.22, [0.7, 0], [0.03, 0.19]);
  }

  playVictory() {
    const ctx = this.init();
    if (!ctx || !this.enabled) return;
    const now = ctx.currentTime;
    const notes = [
      { f: 523.25, d: 0.1 }, // C5
      { f: 659.25, d: 0.1 }, // E5
      { f: 783.99, d: 0.1 }, // G5
      { f: 1046.50, d: 0.15 }, // C6
      { f: 783.99, d: 0.1 }, // G5
      { f: 1046.50, d: 0.4 }  // C6
    ];
    let timeOffset = 0;
    notes.forEach((note) => {
      const playTime = now + timeOffset;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(note.f, playTime);
      gainNode.gain.setValueAtTime(0.4 * this.volume, playTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, playTime + note.d);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(playTime);
      osc.stop(playTime + note.d);
      timeOffset += note.d - 0.02; // slide overlap
    });
  }

  playDefeat() {
    const ctx = this.init();
    if (!ctx || !this.enabled) return;
    const now = ctx.currentTime;
    const notes = [
      { f: 392.00, d: 0.15 }, // G4
      { f: 369.99, d: 0.15 }, // F#4
      { f: 349.23, d: 0.15 }, // F4
      { f: 311.13, d: 0.55 }  // D#4
    ];
    let timeOffset = 0;
    notes.forEach((note) => {
      const playTime = now + timeOffset;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(note.f, playTime);
      gainNode.gain.setValueAtTime(0.4 * this.volume, playTime);
      gainNode.gain.linearRampToValueAtTime(0.01, playTime + note.d);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(playTime);
      osc.stop(playTime + note.d);
      timeOffset += note.d;
    });
  }

  playLowEnergyWarning() {
    const ctx = this.init();
    if (!ctx || !this.enabled) return;
    const now = ctx.currentTime;
    // Retro double-beep alarm sound: 2 quick high-pitched square waves (B5: 987.77Hz)
    this.createOscillator('square', 987.77, 0.07, [0.3, 0], [0.01, 0.06]);
    setTimeout(() => {
      if (this.enabled) {
        this.createOscillator('square', 987.77, 0.07, [0.3, 0], [0.01, 0.06]);
      }
    }, 110);
  }
}

class MusicPlayer {
  private currentAudio: HTMLAudioElement | null = null;
  private currentTrack: string | null = null;
  private volume: number = 0.2;
  private enabled: boolean = true;

  constructor() {}

  setVolume(vol: number) {
    this.volume = vol;
    if (this.currentAudio) {
      this.currentAudio.volume = vol;
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stop();
    } else if (this.currentTrack) {
      this.play(this.currentTrack);
    }
  }

  play(trackPath: string) {
    if (typeof window === 'undefined') return;

    // If already playing this exact track, just ensure it plays
    if (this.currentTrack === trackPath && this.currentAudio) {
      if (this.currentAudio.paused && this.enabled) {
        this.currentAudio.play().catch(() => {});
      }
      return;
    }

    this.stop();
    this.currentTrack = trackPath;

    if (!this.enabled) return;

    try {
      const audio = new Audio(trackPath);
      audio.loop = true;
      audio.volume = this.volume;
      this.currentAudio = audio;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was blocked, add interaction trigger
          const playOnGesture = () => {
            if (this.currentTrack === trackPath && this.currentAudio && this.enabled) {
              this.currentAudio.play().catch(() => {});
            }
            window.removeEventListener('click', playOnGesture);
          };
          window.addEventListener('click', playOnGesture);
        });
      }
    } catch (e) {
      console.warn('Failed to play background music:', e);
    }
  }

  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
  }
}

export const audio = new ChiptuneEngine();
export const music = new MusicPlayer();
