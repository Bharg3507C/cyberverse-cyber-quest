// CYBERVERSE — Synthesized Sound Manager (Web Audio API, no external files)

class SoundManager {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private enabled = true;
  private volume = 0.4;
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.volume;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  setEnabled(v: boolean) {
    this.enabled = v;
    if (this.master) this.master.gain.setTargetAtTime(v ? this.volume : 0, this.ctx!.currentTime, 0.1);
    if (!v) this.stopAmbient();
  }

  setVolume(v: number) {
    this.volume = v;
    if (this.master && this.enabled) this.master.gain.setTargetAtTime(v, this.ctx!.currentTime, 0.1);
  }

  // --- UI Sounds (synthesized) ---

  hover() {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(2200, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(2800, ctx.currentTime + 0.04);
    g.gain.setValueAtTime(0.06, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    o.connect(g).connect(this.master!);
    o.start(); o.stop(ctx.currentTime + 0.07);
  }

  click() {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(1400, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);
    g.gain.setValueAtTime(0.12, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    o.connect(g).connect(this.master!);
    o.start(); o.stop(ctx.currentTime + 0.11);
  }

  success() {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    [800, 1000, 1200].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, ctx.currentTime + i * 0.08);
      g.gain.linearRampToValueAtTime(0.1, ctx.currentTime + i * 0.08 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.15);
      o.connect(g).connect(this.master!);
      o.start(ctx.currentTime + i * 0.08);
      o.stop(ctx.currentTime + i * 0.08 + 0.16);
    });
  }

  error() {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(300, ctx.currentTime);
    o.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.15);
    g.gain.setValueAtTime(0.08, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    o.connect(g).connect(this.master!);
    o.start(); o.stop(ctx.currentTime + 0.21);
  }

  transition() {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(200, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.3);
    o.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.5);
    g.gain.setValueAtTime(0.05, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.15);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    o.connect(g).connect(this.master!);
    o.start(); o.stop(ctx.currentTime + 0.55);
  }

  achievement() {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    [523, 659, 784, 1047].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
      g.gain.linearRampToValueAtTime(0.12, ctx.currentTime + i * 0.1 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.3);
      o.connect(g).connect(this.master!);
      o.start(ctx.currentTime + i * 0.1);
      o.stop(ctx.currentTime + i * 0.1 + 0.35);
    });
  }

  alert() {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    [0, 0.2, 0.4].forEach((delay) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'square';
      o.frequency.setValueAtTime(880, ctx.currentTime + delay);
      o.frequency.setValueAtTime(440, ctx.currentTime + delay + 0.08);
      g.gain.setValueAtTime(0.06, ctx.currentTime + delay);
      g.gain.setValueAtTime(0.001, ctx.currentTime + delay + 0.15);
      o.connect(g).connect(this.master!);
      o.start(ctx.currentTime + delay);
      o.stop(ctx.currentTime + delay + 0.16);
    });
  }

  // --- Ambient drone ---

  startAmbient() {
    if (!this.enabled || this.ambientOsc) return;
    const ctx = this.getCtx();
    this.ambientOsc = ctx.createOscillator();
    this.ambientGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    this.ambientOsc.type = 'sawtooth';
    this.ambientOsc.frequency.value = 55;
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    filter.Q.value = 2;

    this.ambientGain.gain.setValueAtTime(0, ctx.currentTime);
    this.ambientGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2);

    this.ambientOsc.connect(filter).connect(this.ambientGain).connect(this.master!);
    this.ambientOsc.start();
  }

  stopAmbient() {
    if (this.ambientOsc && this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.5);
      const osc = this.ambientOsc;
      setTimeout(() => { try { osc.stop(); } catch {} }, 1000);
      this.ambientOsc = null;
      this.ambientGain = null;
    }
  }
}

export const soundManager = new SoundManager();
