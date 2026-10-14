/**
 * Synthesizes high-performance audio effects and authentic arcade racing music
 * using the Web Audio API. Zero external audio files required, works offline.
 */

class SoundEffectsService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isMusicMuted: boolean = false;
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;

  // Music Sequencer State
  private musicInterval: number | null = null;
  private isMusicPlaying: boolean = false;
  private musicStep: number = 0;

  constructor() {
    const savedAudio = localStorage.getItem('turbotype_audio_muted');
    this.isMuted = savedAudio === 'true';

    const savedMusic = localStorage.getItem('turbotype_music_muted');
    this.isMusicMuted = savedMusic === 'true';
  }

  private initCtx(): AudioContext | null {
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

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('turbotype_audio_muted', String(this.isMuted));
    if (this.isMuted) {
      this.stopEngine();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMusic(): boolean {
    this.isMusicMuted = !this.isMusicMuted;
    localStorage.setItem('turbotype_music_muted', String(this.isMusicMuted));

    if (this.isMusicMuted) {
      this.stopRacingMusic();
    } else {
      this.startRacingMusic();
    }
    return !this.isMusicMuted;
  }

  public getMusicPlaying(): boolean {
    return this.isMusicPlaying && !this.isMusicMuted;
  }

  /**
   * Brand new ultra-satisfying bouncy arcade button tap sound:
   * Features a crisp springy mechanical transient + rich resonant pop tone.
   */
  public playButtonClick() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // 1. Crisp springy pop transient (high cheerful pluck)
      const pluck = ctx.createOscillator();
      const pluckGain = ctx.createGain();
      pluck.type = 'triangle';
      pluck.frequency.setValueAtTime(740, now);
      pluck.frequency.exponentialRampToValueAtTime(1150, now + 0.015);
      pluck.frequency.exponentialRampToValueAtTime(420, now + 0.05);

      pluckGain.gain.setValueAtTime(0.24, now);
      pluckGain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

      pluck.connect(pluckGain);
      pluckGain.connect(ctx.destination);
      pluck.start(now);
      pluck.stop(now + 0.06);

      // 2. Chunky wooden/plastic arcade button body "thock"
      const body = ctx.createOscillator();
      const bodyGain = ctx.createGain();
      body.type = 'sine';
      body.frequency.setValueAtTime(340, now);
      body.frequency.exponentialRampToValueAtTime(160, now + 0.04);

      bodyGain.gain.setValueAtTime(0.22, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      body.connect(bodyGain);
      bodyGain.connect(ctx.destination);
      body.start(now);
      body.stop(now + 0.05);
    } catch {}
  }

  /**
   * Tactile typing keyboard keypress click
   */
  public playKeyClick() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(540 + Math.random() * 80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.036);
    } catch {}
  }

  /**
   * Mistyped letter error sound
   */
  public playError() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.09);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.095);
    } catch {}
  }

  /**
   * Countdown beeps for 3, 2, 1, GO
   */
  public playCountdown(isGo: boolean) {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      if (isGo) {
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      }
    } catch {}
  }

  /**
   * Nitro blast burst sound
   */
  public playNitro() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.45);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.46);
    } catch {}
  }

  /**
   * Race finish fanfare
   */
  public playFanfare(isWinner: boolean) {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const notes = isWinner ? [523.25, 659.25, 783.99, 1046.50] : [440, 554.37, 659.25];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = ctx.currentTime + idx * 0.1;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.2, start + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.52);
      });
    } catch {}
  }

  // ==========================================
  // REAL-TIME SYNTHESIZED ARCADE RACING MUSIC
  // ==========================================

  private currentTrackIndex: number = 0;
  private readonly TRACK_NAMES = [
    'Countryside Bop 🚜',
    'Turbo Hill Rush ⚡',
    'Downhill Speedster 🏁'
  ];

  public getTrackName(): string {
    return this.TRACK_NAMES[this.currentTrackIndex];
  }

  public getCurrentTrackIndex(): number {
    return this.currentTrackIndex;
  }

  public nextTrack(): string {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.TRACK_NAMES.length;
    if (this.isMusicPlaying) {
      this.stopRacingMusic();
      this.startRacingMusic();
    }
    return this.TRACK_NAMES[this.currentTrackIndex];
  }

  /**
   * Starts looping the upbeat Hill Climb Racing style cartoon theme music!
   */
  public startRacingMusic(trackIdx?: number) {
    if (trackIdx !== undefined) {
      this.currentTrackIndex = trackIdx % this.TRACK_NAMES.length;
    }

    if (this.isMusicMuted) return;
    if (this.isMusicPlaying && this.musicInterval !== null) return;

    const ctx = this.initCtx();
    if (!ctx) return;

    this.isMusicPlaying = true;
    this.musicStep = 0;

    // Track 0: Countryside Bop (136 BPM -> 110ms per 16th note)
    // Track 1: Turbo Hill Rush (152 BPM -> 98ms per 16th note)
    // Track 2: Downhill Speedster (140 BPM -> 107ms per 16th note)
    const tempos = [110, 98, 107];
    const stepDuration = tempos[this.currentTrackIndex] || 110;

    // Track 0: Countryside Bop
    const bassline0 = [
      110.0, 0, 110.0, 130.81, 146.83, 0, 164.81, 146.83,
      130.81, 0, 98.0, 110.0, 164.81, 146.83, 130.81, 98.0,
      110.0, 110.0, 130.81, 146.83, 164.81, 0, 146.83, 130.81,
      110.0, 0, 130.81, 146.83, 164.81, 174.61, 164.81, 146.83
    ];
    const leadNotes0 = [
      523.25, 0, 659.25, 783.99, 880.0, 0, 783.99, 659.25,
      587.33, 0, 523.25, 659.25, 783.99, 880.0, 1046.5, 0,
      1046.5, 880.0, 783.99, 659.25, 587.33, 659.25, 783.99, 0,
      880.0, 783.99, 659.25, 587.33, 523.25, 0, 587.33, 523.25
    ];

    // Track 1: Turbo Hill Rush (Upbeat High Octane Synth Racing)
    const bassline1 = [
      146.83, 146.83, 0, 146.83, 174.61, 0, 196.0, 0,
      146.83, 0, 130.81, 0, 110.0, 0, 130.81, 146.83,
      174.61, 174.61, 0, 174.61, 196.0, 0, 220.0, 0,
      196.0, 0, 174.61, 0, 146.83, 130.81, 146.83, 0
    ];
    const leadNotes1 = [
      587.33, 0, 587.33, 698.46, 783.99, 0, 880.0, 0,
      783.99, 698.46, 587.33, 0, 523.25, 0, 587.33, 0,
      698.46, 0, 783.99, 0, 880.0, 0, 1046.5, 0,
      880.0, 783.99, 698.46, 587.33, 698.46, 783.99, 587.33, 0
    ];

    // Track 2: Downhill Speedster (Funky bouncy groove)
    const bassline2 = [
      130.81, 0, 130.81, 164.81, 196.0, 0, 164.81, 0,
      146.83, 0, 146.83, 174.61, 220.0, 0, 196.0, 0,
      174.61, 0, 174.61, 220.0, 261.63, 0, 220.0, 0,
      196.0, 0, 164.81, 0, 130.81, 0, 164.81, 196.0
    ];
    const leadNotes2 = [
      659.25, 783.99, 0, 659.25, 523.25, 0, 659.25, 0,
      587.33, 698.46, 0, 587.33, 440.0, 0, 587.33, 0,
      698.46, 880.0, 0, 698.46, 523.25, 0, 698.46, 0,
      783.99, 0, 659.25, 0, 523.25, 659.25, 783.99, 0
    ];

    const currentBass = this.currentTrackIndex === 1 ? bassline1 : this.currentTrackIndex === 2 ? bassline2 : bassline0;
    const currentLead = this.currentTrackIndex === 1 ? leadNotes1 : this.currentTrackIndex === 2 ? leadNotes2 : leadNotes0;
    const loopLength = currentBass.length;

    this.musicInterval = window.setInterval(() => {
      if (!this.isMusicPlaying || this.isMusicMuted) return;

      const now = ctx.currentTime;
      const step = this.musicStep % loopLength;

      // 1. Kick & Snare Percussion
      if (step % 4 === 0) {
        // Punchy Kick Drum
        try {
          const kickOsc = ctx.createOscillator();
          const kickGain = ctx.createGain();
          kickOsc.type = 'sine';
          kickOsc.frequency.setValueAtTime(140, now);
          kickOsc.frequency.exponentialRampToValueAtTime(42, now + 0.08);

          kickGain.gain.setValueAtTime(0.22, now);
          kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

          kickOsc.connect(kickGain);
          kickGain.connect(ctx.destination);
          kickOsc.start(now);
          kickOsc.stop(now + 0.09);
        } catch {}
      } else if (step % 4 === 2) {
        // Crisp Snare Pop
        try {
          const snareOsc = ctx.createOscillator();
          const snareGain = ctx.createGain();
          snareOsc.type = 'triangle';
          snareOsc.frequency.setValueAtTime(260, now);
          snareOsc.frequency.exponentialRampToValueAtTime(80, now + 0.05);

          snareGain.gain.setValueAtTime(0.12, now);
          snareGain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

          snareOsc.connect(snareGain);
          snareGain.connect(ctx.destination);
          snareOsc.start(now);
          snareOsc.stop(now + 0.06);
        } catch {}
      } else if (step % 2 === 1) {
        // High-hat shimmer
        try {
          const hatOsc = ctx.createOscillator();
          const hatGain = ctx.createGain();
          hatOsc.type = 'square';
          hatOsc.frequency.setValueAtTime(1800, now);

          hatGain.gain.setValueAtTime(0.02, now);
          hatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

          hatOsc.connect(hatGain);
          hatGain.connect(ctx.destination);
          hatOsc.start(now);
          hatOsc.stop(now + 0.032);
        } catch {}
      }

      // 2. Bassline Note
      const bassFreq = currentBass[step];
      if (bassFreq > 0) {
        try {
          const bassOsc = ctx.createOscillator();
          const bassGain = ctx.createGain();
          bassOsc.type = 'triangle';
          bassOsc.frequency.setValueAtTime(bassFreq, now);

          bassGain.gain.setValueAtTime(0.15, now);
          bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

          bassOsc.connect(bassGain);
          bassGain.connect(ctx.destination);
          bassOsc.start(now);
          bassOsc.stop(now + 0.105);
        } catch {}
      }

      // 3. Lead Melody Note
      const leadFreq = currentLead[step];
      if (leadFreq > 0) {
        try {
          const leadOsc = ctx.createOscillator();
          const leadGain = ctx.createGain();
          leadOsc.type = 'sawtooth'; // Bright cheerful arcade horn/banjo
          leadOsc.frequency.setValueAtTime(leadFreq, now);

          leadGain.gain.setValueAtTime(0.05, now);
          leadGain.gain.exponentialRampToValueAtTime(0.001, now + 0.095);

          leadOsc.connect(leadGain);
          leadGain.connect(ctx.destination);
          leadOsc.start(now);
          leadOsc.stop(now + 0.1);
        } catch {}
      }

      this.musicStep++;
    }, stepDuration);
  }

  public stopRacingMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  public stopEngine() {
    if (this.engineOsc) {
      try {
        this.engineOsc.stop();
        this.engineOsc.disconnect();
      } catch {}
      this.engineOsc = null;
    }
    if (this.engineGain) {
      this.engineGain.disconnect();
      this.engineGain = null;
    }
  }
}

export const soundFx = new SoundEffectsService();
