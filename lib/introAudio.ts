/**
 * Zero-dependency Web Audio API micro-sound synthesizer for Intro cinematic experience.
 * Fully compliant with browser autoplay policies (starts muted / unlocks on user gesture).
 */

class IntroAudioController {
  private ctx: AudioContext | null = null;
  private muted: boolean = true;

  constructor() {
    // Check if audio was previously enabled in localStorage
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('felich_intro_audio_enabled');
        this.muted = saved !== 'true';
      } catch {
        this.muted = true;
      }
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('felich_intro_audio_enabled', (!muted).toString());
      } catch {}
    }
    if (!muted) {
      this.getContext();
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  /**
   * Short sine micro-tick for counter increment
   */
  public playTick(pitchRatio: number = 1.0): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const baseFreq = 400 + pitchRatio * 600; // 400Hz -> 1000Hz as progress approaches 100%
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch {}
  }

  /**
   * Soft whoosh sweep for character / badge reveals
   */
  public playWhoosh(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(580, now + 0.18);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.23);
    } catch {}
  }

  /**
   * Harmonious dual chime on curtain lift
   */
  public playChime(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5 chord

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.06, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6 + idx * 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + 0.65 + idx * 0.05);
      });
    } catch {}
  }
}

export const introAudio = new IntroAudioController();
