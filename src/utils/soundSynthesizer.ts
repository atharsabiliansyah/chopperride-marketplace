/**
 * Chopper Engine Sound Synthesizer using Web Audio API
 * Generates realistic vintage engine idle rumble (Potato-Potato V-Twin, Parallel Twin, Thumper)
 * with cold start crank, idle loop, and throttle revving.
 */

class ChopperSoundEngine {
  private audioCtx: AudioContext | null = null;
  private isPlaying = false;
  private currentEngineType: 'vtwin' | 'parallel_twin' | 'thumper' = 'vtwin';
  private timerId: number | null = null;
  private gainNode: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private baseRpm = 750;
  private currentRpm = 750;
  private onRpmChangeCallback?: (rpm: number) => void;

  constructor() {
    // Lazy init audio context on first user interaction
  }

  private initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public setRpmCallback(cb: (rpm: number) => void) {
    this.onRpmChangeCallback = cb;
  }

  public playColdStart(
    type: 'vtwin' | 'parallel_twin' | 'thumper' = 'vtwin',
    onStarted?: () => void
  ) {
    this.stop();
    this.initContext();
    if (!this.audioCtx) return;

    this.isPlaying = true;
    this.currentEngineType = type;

    if (type === 'vtwin') this.baseRpm = 720;
    else if (type === 'parallel_twin') this.baseRpm = 1050;
    else this.baseRpm = 880;

    this.currentRpm = 350; // Starter crank RPM
    this.onRpmChangeCallback?.(this.currentRpm);

    // 1. Play starter motor crank sequence
    this.playStarterCrank(() => {
      // 2. Engine catches fire & revs up briefly, then settles into idle
      if (!this.isPlaying) return;
      this.playEngineCatch();
      onStarted?.();
    });
  }

  private playStarterCrank(onDone: () => void) {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;

    let cranks = 0;
    const crankInterval = window.setInterval(() => {
      if (!this.isPlaying || cranks >= 4) {
        clearInterval(crankInterval);
        if (this.isPlaying) onDone();
        return;
      }
      cranks++;
      this.currentRpm = 350 + Math.random() * 80;
      this.onRpmChangeCallback?.(Math.round(this.currentRpm));

      // Starter burst
      const osc = ctx.createOscillator();
      const crankGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(55, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.12);

      crankGain.gain.setValueAtTime(0.18, ctx.currentTime);
      crankGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.14);

      osc.connect(crankGain);
      crankGain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    }, 180);
  }

  private playEngineCatch() {
    if (!this.audioCtx || !this.isPlaying) return;
    const ctx = this.audioCtx;

    // Surge on startup
    this.currentRpm = this.baseRpm * 1.6;
    this.onRpmChangeCallback?.(Math.round(this.currentRpm));

    // Big initial combustion
    this.triggerPulse(0.4, 60);

    // Settle to idle after 1 second
    window.setTimeout(() => {
      if (!this.isPlaying) return;
      this.startIdleLoop();
    }, 400);
  }

  private startIdleLoop() {
    if (!this.isPlaying || !this.audioCtx) return;

    const scheduleNextBeat = () => {
      if (!this.isPlaying) return;

      // Smoothly drift around base RPM
      const rpmJitter = (Math.random() - 0.5) * 40;
      this.currentRpm = Math.max(500, Math.min(3500, this.currentRpm * 0.92 + (this.baseRpm + rpmJitter) * 0.08));
      this.onRpmChangeCallback?.(Math.round(this.currentRpm));

      // Calculate timing based on RPM
      // 4-stroke: 2 crank revolutions per power stroke per cylinder
      // For V-Twin: uneven 315° / 405° spacing gives famous "potato-potato" rhythm
      let beatDelay = (60 / this.currentRpm) * 1000;

      if (this.currentEngineType === 'vtwin') {
        // Uneven firing rhythm
        this.triggerPulse(0.28, 48);
        window.setTimeout(() => {
          if (this.isPlaying) this.triggerPulse(0.24, 54);
        }, beatDelay * 0.38);
      } else if (this.currentEngineType === 'parallel_twin') {
        // XS650 360-degree twin: synchronous pulses
        this.triggerPulse(0.22, 62);
        window.setTimeout(() => {
          if (this.isPlaying) this.triggerPulse(0.2, 60);
        }, beatDelay * 0.5);
      } else {
        // Single cylinder thumper (Binter Merzy / Tiger)
        this.triggerPulse(0.32, 42);
      }

      this.timerId = window.setTimeout(scheduleNextBeat, beatDelay);
    };

    scheduleNextBeat();
  }

  private triggerPulse(volume: number, freq: number) {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    // Sub rumble oscillator
    const osc = ctx.createOscillator();
    const subOsc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(18, freq * 0.4), now + 0.12);

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(freq * 0.5, now);
    subOsc.frequency.exponentialRampToValueAtTime(20, now + 0.16);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280 + (this.currentRpm / 1000) * 160, now);
    filter.Q.setValueAtTime(3.5, now);

    // Punch envelope
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    subOsc.start(now);
    osc.stop(now + 0.18);
    subOsc.stop(now + 0.18);
  }

  public revThrottle() {
    if (!this.isPlaying || !this.audioCtx) return;
    // Boost RPM and simulate exhaust braaap
    const peakRpm = Math.min(3800, this.currentRpm + 1400);
    this.currentRpm = peakRpm;
    this.onRpmChangeCallback?.(Math.round(this.currentRpm));

    // Multiple rapid pulses
    for (let i = 0; i < 4; i++) {
      window.setTimeout(() => {
        if (this.isPlaying) {
          this.triggerPulse(0.42, 85 + i * 10);
        }
      }, i * 45);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.currentRpm = 0;
    this.onRpmChangeCallback?.(0);
  }

  public getIsPlaying() {
    return this.isPlaying;
  }
}

export const chopperAudio = new ChopperSoundEngine();
