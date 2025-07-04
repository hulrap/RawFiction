import { Howler } from 'howler';

// Extend the Window interface to include the non-standard webkitAudioContext
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

// Audio state management
let audioContext: AudioContext | null = null;
let bassSaber: OscillatorNode | null = null;
let subBass: OscillatorNode | null = null;
let gainNode: GainNode | null = null;
let subGainNode: GainNode | null = null;
let filterNode: BiquadFilterNode | null = null;
let isAudioInitialized = false;
let isHoverActive = false;
let isAudioPreloaded = false;

// Initialize audio context only when needed (after user interaction)
const initAudioContext = async () => {
  if (typeof window === 'undefined') return false;

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      console.warn('AudioContext not supported');
      return false;
    }

    if (!audioContext) {
      audioContext = new AudioContext();
      Howler.ctx = audioContext;
    }

    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    isAudioInitialized = true;
    console.log('Audio context initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize audio context:', error);
    return false;
  }
};

// Preload audio system - called during loading phase
const preloadAudio = async () => {
  if (isAudioPreloaded) return true;

  try {
    // Create a silent audio context to prepare everything
    const success = await initAudioContext();
    if (!success) return false;

    // Pre-create the bass saber system
    await createBassSaber();

    // Mark as preloaded
    isAudioPreloaded = true;
    console.log('Audio system preloaded successfully');
    return true;
  } catch (error) {
    console.error('Failed to preload audio:', error);
    return false;
  }
};

// Generate soft click sound using Web Audio API
const createSoftClickSound = () => {
  if (!audioContext) return null;

  try {
    // Create a buffer for the soft click sound
    const sampleRate = audioContext.sampleRate;
    const duration = 0.15; // 150ms soft click
    const samples = Math.floor(sampleRate * duration);

    const buffer = audioContext.createBuffer(2, samples, sampleRate);
    const leftChannel = buffer.getChannelData(0);
    const rightChannel = buffer.getChannelData(1);

    // Generate soft click sound data
    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;

      // Create a soft envelope (quick attack, smooth decay)
      const envelope = Math.exp(-t * 15) * (1 - Math.exp(-t * 100));

      // Generate a soft click using filtered noise and sine wave
      const noise = (Math.random() - 0.5) * 0.3; // Gentle noise
      const tone = Math.sin(2 * Math.PI * 800 * t) * 0.4; // Soft 800Hz tone

      // Combine noise and tone for organic click
      let sample = (noise * 0.3 + tone * 0.7) * envelope;

      // Apply soft damping (simulates muted/damp quality)
      const dampingFactor = 1 - t * 2; // Gradual damping
      sample *= Math.max(0.1, dampingFactor);

      // Apply gentle low-pass filtering effect
      const cutoffFreq = 1200 * (1 - t * 0.8); // Frequency rolls off
      const filterEffect = Math.min(1, cutoffFreq / 1200);
      sample *= filterEffect;

      // Final volume scaling for subtlety
      sample *= 0.4;

      leftChannel[i] = sample;
      rightChannel[i] = sample;
    }

    return buffer;
  } catch (error) {
    console.error('Failed to create soft click sound:', error);
    return null;
  }
};

// Play soft click sound using generated buffer
const playSoftClickSound = async () => {
  if (!audioContext) return;

  try {
    const buffer = createSoftClickSound();
    if (!buffer) return;

    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();

    source.buffer = buffer;
    gainNode.gain.value = 0.7; // Moderate volume for subtlety

    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    source.start(0);
    console.log('Soft click sound played');
  } catch (error) {
    console.error('Error playing soft click sound:', error);
  }
};

// Create cinematic bass saber with dual oscillators
const createBassSaber = async () => {
  if (!audioContext) {
    console.warn('Audio context not available for bass saber');
    return false;
  }

  try {
    // Clean up existing oscillators
    if (bassSaber) {
      bassSaber.stop();
      bassSaber.disconnect();
    }
    if (subBass) {
      subBass.stop();
      subBass.disconnect();
    }

    // Create dual oscillator setup for rich bass
    bassSaber = audioContext.createOscillator();
    subBass = audioContext.createOscillator();
    gainNode = audioContext.createGain();
    subGainNode = audioContext.createGain();
    filterNode = audioContext.createBiquadFilter();

    // Main bass oscillator - audible bass range
    bassSaber.type = 'sine';
    bassSaber.frequency.setValueAtTime(80, audioContext.currentTime); // Start at 80Hz (audible bass)

    // Sub-bass oscillator for depth
    subBass.type = 'triangle';
    subBass.frequency.setValueAtTime(40, audioContext.currentTime); // Sub-bass at 40Hz

    // Configure low-pass filter for warmth
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(300, audioContext.currentTime); // Allow more harmonics
    filterNode.Q.setValueAtTime(1.5, audioContext.currentTime); // Moderate resonance

    // Start with zero gain
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    subGainNode.gain.setValueAtTime(0, audioContext.currentTime);

    // Connect the audio chain
    // Main bass: oscillator -> filter -> gain -> destination
    bassSaber.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Sub-bass: oscillator -> sub-gain -> destination (no filter for pure sub)
    subBass.connect(subGainNode);
    subGainNode.connect(audioContext.destination);

    bassSaber.start();
    subBass.start();

    console.log('Cinematic bass saber created successfully');
    return true;
  } catch (error) {
    console.error('Failed to create bass saber:', error);
    return false;
  }
};

export const audioManager = {
  // Preload function for loading phase
  preload: preloadAudio,

  playNavigation: async () => {
    try {
      if (!isAudioInitialized) {
        const success = await initAudioContext();
        if (!success) return;
      }

      await playSoftClickSound();
    } catch (error) {
      console.error('Error playing navigation sound:', error);
    }
  },

  startHover: async () => {
    try {
      if (!isAudioInitialized) {
        const success = await initAudioContext();
        if (!success) return;
      }

      if (!bassSaber || !isAudioPreloaded) {
        const success = await createBassSaber();
        if (!success) return;
      }

      isHoverActive = true;

      if (gainNode && subGainNode && audioContext) {
        // Start with louder bass presence
        gainNode.gain.setTargetAtTime(0.3, audioContext.currentTime, 0.1); // Increased from 0.15
        subGainNode.gain.setTargetAtTime(0.2, audioContext.currentTime, 0.1); // Increased from 0.08
        console.log('Cinematic hover audio started');
      }
    } catch (error) {
      console.error('Error starting hover audio:', error);
    }
  },

  stopHover: () => {
    try {
      isHoverActive = false;

      if (gainNode && subGainNode && audioContext) {
        // Fade out smoothly
        gainNode.gain.setTargetAtTime(0, audioContext.currentTime, 0.3);
        subGainNode.gain.setTargetAtTime(0, audioContext.currentTime, 0.3);
        console.log('Cinematic hover audio stopped');
      }
    } catch (error) {
      console.error('Error stopping hover audio:', error);
    }
  },

  updateHoverIntensity: (intensity: number) => {
    try {
      if (
        !audioContext ||
        !gainNode ||
        !subGainNode ||
        !bassSaber ||
        !subBass ||
        !filterNode ||
        !isHoverActive
      )
        return;

      const clampedIntensity = Math.max(0, Math.min(1, intensity));

      // Volume increases with movement - louder cinematic range
      const mainGain = 0.3 + clampedIntensity * 0.4; // Range: 0.3 to 0.7 (increased)
      const subGain = 0.2 + clampedIntensity * 0.3; // Range: 0.2 to 0.5 (increased)

      gainNode.gain.setTargetAtTime(mainGain, audioContext.currentTime, 0.05);
      subGainNode.gain.setTargetAtTime(subGain, audioContext.currentTime, 0.05);

      // Main bass frequency - audible bass range (80Hz to 150Hz)
      const baseFrequency = 80;
      const peakFrequency = 150;
      const newFrequency = baseFrequency + (peakFrequency - baseFrequency) * clampedIntensity;
      bassSaber.frequency.setTargetAtTime(newFrequency, audioContext.currentTime, 0.05);

      // Sub-bass frequency - lower range (40Hz to 70Hz)
      const subBaseFreq = 40;
      const subPeakFreq = 70;
      const newSubFreq = subBaseFreq + (subPeakFreq - subBaseFreq) * clampedIntensity;
      subBass.frequency.setTargetAtTime(newSubFreq, audioContext.currentTime, 0.05);

      // Filter frequency for character (300Hz to 500Hz)
      const baseFilterFreq = 300;
      const peakFilterFreq = 500;
      const newFilterFreq = baseFilterFreq + (peakFilterFreq - baseFilterFreq) * clampedIntensity;
      filterNode.frequency.setTargetAtTime(newFilterFreq, audioContext.currentTime, 0.05);
    } catch (error) {
      console.error('Error updating hover intensity:', error);
    }
  },

  // Add a debug method to check audio status
  getAudioStatus: () => {
    return {
      isInitialized: isAudioInitialized,
      isPreloaded: isAudioPreloaded,
      isHoverActive: isHoverActive,
      audioContextState: audioContext?.state,
      hasBassSaber: !!bassSaber,
      hasSubBass: !!subBass,
      hasGainNode: !!gainNode,
      hasSubGainNode: !!subGainNode,
      hasFilterNode: !!filterNode,
      sampleRate: audioContext?.sampleRate,
    };
  },
};
