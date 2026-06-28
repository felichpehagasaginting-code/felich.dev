'use client';

class SoundController {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sound-enabled');
      this.isEnabled = stored === null ? true : stored === 'true';
    }
  }

  public toggle() {
    this.isEnabled = !this.isEnabled;
    if (typeof window !== 'undefined') {
       localStorage.setItem('sound-enabled', String(this.isEnabled));
    }
    return this.isEnabled;
  }

  public getStatus() {
    return this.isEnabled;
  }

  private init() {
    if (typeof window !== 'undefined' && !this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  /**
   * Schedules a disconnect of `osc` and `gain` after the sound finishes.
   * Stopped OscillatorNodes remain in the AudioContext graph until explicitly
   * disconnected — without this, long sessions leak hundreds of idle nodes.
   */
  private scheduleDisconnect(osc: OscillatorNode, gain: GainNode, durationMs: number) {
    setTimeout(() => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {
        // AudioContext may already be closed — safe to ignore
      }
    }, durationMs + 50);
  }

  public playPop() {
    if (!this.isEnabled) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.05);
      
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      
      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + 0.05);
      this.scheduleDisconnect(osc, gain, 50);
    } catch (e) {
      // browser audio context issue, ignore
    }
  }

  public playSwitch() {
    if (!this.isEnabled) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      
      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + 0.08);
      this.scheduleDisconnect(osc, gain, 80);
    } catch (e) {
      // browser audio context issue, ignore
    }
  }

  public playHover() {
    if (!this.isEnabled) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1000, this.ctx.currentTime + 0.02);
      
      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.02);
      
      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + 0.02);
      this.scheduleDisconnect(osc, gain, 20);
    } catch (e) {
      // ignore
    }
  }

  public playClick() {
    if (!this.isEnabled) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.01);
      
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.01);
      
      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + 0.01);
      this.scheduleDisconnect(osc, gain, 10);
    } catch (e) {
      // ignore
    }
  }
}

export const sounds = new SoundController();
