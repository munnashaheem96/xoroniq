class SoundFxManager {
  private ctx: AudioContext | null = null;
  private muted: boolean = true; // Default muted for unobtrusive UX
  private listeners: Set<(muted: boolean) => void> = new Set();
  private lastTickTime: number = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('xoroniq_sound_enabled');
      // If user previously explicitly enabled, restore it
      this.muted = saved !== 'true';
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    if (!this.muted) {
      this.initContext();
      this.play('chime');
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('xoroniq_sound_enabled', String(!this.muted));
    }
    this.notify();
    return this.muted;
  }

  public onMuteChange(cb: (muted: boolean) => void): () => void {
    this.listeners.add(cb);
    cb(this.muted);
    return () => this.listeners.delete(cb);
  }

  private notify(): void {
    for (const cb of this.listeners) {
      cb(this.muted);
    }
  }

  public play(type: 'click' | 'whoosh' | 'tick' | 'open' | 'chime'): void {
    if (this.muted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    switch (type) {
      case 'click': {
        // High-end subtle tactile click
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }
      case 'whoosh': {
        // Soft aerodynamic whoosh
        const bufferSize = ctx.sampleRate * 0.15;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(400, now);
        filter.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
        filter.frequency.exponentialRampToValueAtTime(300, now + 0.15);
        filter.Q.value = 3;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.03, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        whiteNoise.start(now);
        whiteNoise.stop(now + 0.16);
        break;
      }
      case 'tick': {
        // Throttled frame transition micro-tick (max once every 70ms)
        const perfNow = performance.now();
        if (perfNow - this.lastTickTime < 70) return;
        this.lastTickTime = perfNow;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.02);
        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.025);
        break;
      }
      case 'open': {
        // Luxury slide drawer reveal
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(640, now + 0.15);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
        break;
      }
      case 'chime': {
        // Elegant acoustic glass chime
        const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad
        freqs.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          const startTime = now + i * 0.04;
          gain.gain.setValueAtTime(0.0001, startTime);
          gain.gain.linearRampToValueAtTime(0.04 / (i + 1), startTime + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.45);
        });
        break;
      }
    }
  }
}

export const soundFx = new SoundFxManager();
