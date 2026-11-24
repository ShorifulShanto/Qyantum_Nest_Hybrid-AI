// Web Audio synthesizer for cosmic sonifications and live frequency analysis

let audioCtx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let currentSource: AudioNode | null = null;
let gainNode: GainNode | null = null;
let activeInterval: number | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.85;

    gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.7;
    gainNode.connect(analyser);
    analyser.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function stopCosmicAudio() {
  if (activeInterval) {
    window.clearInterval(activeInterval);
    activeInterval = null;
  }
  if (currentSource) {
    try {
      (currentSource as AudioScheduledSourceNode).stop?.();
    } catch {
      // ignore
    }
    currentSource.disconnect();
    currentSource = null;
  }
}

export function setCosmicVolume(val: number) {
  if (gainNode) {
    gainNode.gain.value = Math.max(0, Math.min(1, val));
  }
}

export function getAudioAnalyser(): AnalyserNode | null {
  return analyser;
}

export function playCosmicPreset(preset: string) {
  stopCosmicAudio();
  const ctx = getAudioContext();

  if (preset === 'black-hole') {
    // Ultra-low drone + binaural sub-bass + filtered noise
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(55, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(32, ctx.currentTime + 10);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(57, ctx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode!);

    osc1.start();
    osc2.start();
    currentSource = filter;
  } else if (preset === 'pulsar') {
    // Rhythmic repeating radio pulses
    const osc = ctx.createOscillator();
    const pulseGain = ctx.createGain();
    pulseGain.gain.value = 0;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, ctx.currentTime);

    osc.connect(pulseGain);
    pulseGain.connect(gainNode!);
    osc.start();

    let step = 0;
    activeInterval = window.setInterval(() => {
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      pulseGain.gain.cancelScheduledValues(now);
      pulseGain.gain.setValueAtTime(0.8, now);
      pulseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.frequency.setValueAtTime(380 + (step % 4) * 40, now);
      step++;
    }, 120);

    currentSource = osc;
  } else if (preset === 'plasma-wave') {
    // Eerie interstellar whistling resonance
    const osc = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);

    lfo.frequency.setValueAtTime(0.3, ctx.currentTime);
    lfoGain.gain.setValueAtTime(320, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    osc.connect(gainNode!);
    lfo.start();
    osc.start();
    currentSource = osc;
  } else if (preset === 'magnetosphere') {
    // Dawn chorus chirps
    const osc = ctx.createOscillator();
    const chirpGain = ctx.createGain();
    chirpGain.gain.value = 0.2;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);

    osc.connect(chirpGain);
    chirpGain.connect(gainNode!);
    osc.start();

    activeInterval = window.setInterval(() => {
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      osc.frequency.cancelScheduledValues(now);
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(2200, now + 0.25);
    }, 380);

    currentSource = osc;
  } else {
    // Ambient cosmic hiss & solar wind
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(350, ctx.currentTime);
    filter.Q.value = 3;

    osc.connect(filter);
    filter.connect(gainNode!);
    osc.start();
    currentSource = filter;
  }
}
