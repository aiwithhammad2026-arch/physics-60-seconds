// Web Audio API Cinematic Synthesizer
// Completely standalone, zero external audio assets required.

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;
  private isDroneRunning: boolean = false;
  private lastTriggeredScene: number = -1;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.45, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.45, this.ctx.currentTime, 0.05);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public startAtmosphere() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isDroneRunning) return;

    try {
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.droneGain.gain.exponentialRampToValueAtTime(0.3, this.ctx.currentTime + 2.5);

      this.droneFilter = this.ctx.createBiquadFilter();
      this.droneFilter.type = 'lowpass';
      this.droneFilter.frequency.setValueAtTime(180, this.ctx.currentTime);
      this.droneFilter.Q.setValueAtTime(3.5, this.ctx.currentTime);

      // Deep root oscillator (A1 - 55Hz)
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sawtooth';
      this.droneOsc1.frequency.setValueAtTime(55, this.ctx.currentTime);

      // Sub harmonic oscillator (A0 - 27.5Hz sine)
      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'sine';
      this.droneOsc2.frequency.setValueAtTime(27.5, this.ctx.currentTime);

      this.droneOsc1.connect(this.droneFilter);
      this.droneOsc2.connect(this.droneGain);
      this.droneFilter.connect(this.droneGain);
      this.droneGain.connect(this.masterGain);

      this.droneOsc1.start();
      this.droneOsc2.start();
      this.isDroneRunning = true;
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public stopAtmosphere() {
    if (this.droneGain && this.ctx) {
      this.droneGain.gain.setTargetAtTime(0.001, this.ctx.currentTime, 0.3);
      setTimeout(() => {
        try {
          this.droneOsc1?.stop();
          this.droneOsc2?.stop();
          this.droneOsc1?.disconnect();
          this.droneOsc2?.disconnect();
        } catch {}
        this.isDroneRunning = false;
      }, 400);
    }
  }

  public playSceneTransition(sceneIndex: number) {
    if (this.isMuted || sceneIndex === this.lastTriggeredScene) return;
    this.lastTriggeredScene = sceneIndex;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Scene-specific chord frequencies (futuristic harmonic progression)
    const frequencies = [220, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
    const freq = frequencies[sceneIndex % frequencies.length];

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq * 0.5, t);
    osc.frequency.exponentialRampToValueAtTime(freq, t + 0.35);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.exponentialRampToValueAtTime(3200, t + 0.2);
    filter.frequency.exponentialRampToValueAtTime(400, t + 0.9);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.95);
  }

  public playImpactBoom() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const noiseGain = this.ctx.createGain();
    const subGain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(32, t + 0.6);

    subGain.gain.setValueAtTime(0.4, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

    osc.connect(subGain);
    subGain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.85);

    // Subtle impact high-frequency sparkle
    const sparkle = this.ctx.createOscillator();
    sparkle.type = 'sawtooth';
    sparkle.frequency.setValueAtTime(880, t);
    sparkle.frequency.exponentialRampToValueAtTime(220, t + 0.15);
    noiseGain.gain.setValueAtTime(0.12, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    sparkle.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    sparkle.start(t);
    sparkle.stop(t + 0.25);
  }

  public playCrescendoReveal() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    // Triumphant chord for Hammad AI Engineer reveal: D major add9 / futuristic synth
    const freqs = [146.83, 220.00, 293.66, 369.99, 440.00, 587.33];
    
    freqs.forEach((f, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = i % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.06 / (i + 1), t + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 3.5);

      const filter = this.ctx!.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, t);
      filter.frequency.exponentialRampToValueAtTime(3500, t + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(t);
      osc.stop(t + 3.6);
    });
  }
}

export const soundEngine = new SoundEngine();
