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

// Pre-generated audio buffers (created without AudioContext)
let preGeneratedClickBuffer: Float32Array | null = null;

// Ultra-fast audio initialization - must be called synchronously in user gesture
const initAudioContextFast = () => {
  if (typeof window === 'undefined') return false;

  try {

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      console.warn('AudioContext not supported');
      return false;
    }

    // Create AudioContext immediately
    audioContext = new AudioContext();
    Howler.ctx = audioContext;

    // Handle AudioContext state - this needs to be synchronous in user gesture
    if (audioContext.state === 'suspended') {
      // Call resume synchronously and handle the promise
      audioContext.resume();
    } else {
      // AudioContext is already running, create bass saber immediately
      createBassSaberFast()
        .then(success => {
          if (!success) {
              console.error('Failed to create bass saber (context running)');
          }
        })
        .catch(error => {
          console.error('Error creating bass saber (context running):', error);
        });
    }

    isAudioInitialized = true;
    return true;
  } catch (error) {
    console.error('Failed to initialize audio context:', error);
    return false;
  }
};

// Pre-generate audio data during loading (no AudioContext needed)
const preGenerateAudioData = () => {
  try {
    // Pre-generate click sound data
    const sampleRate = 44100; // Standard sample rate
    const duration = 0.15;
    const samples = Math.floor(sampleRate * duration);

    preGeneratedClickBuffer = new Float32Array(samples);

    // Generate soft click sound data
    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;

      // Create a soft envelope (quick attack, smooth decay)
      const envelope = Math.exp(-t * 15) * (1 - Math.exp(-t * 100));

      // Generate a soft click using filtered noise and sine wave
      const noise = (Math.random() - 0.5) * 0.3;
      const tone = Math.sin(2 * Math.PI * 800 * t) * 0.4;

      // Combine noise and tone for organic click
      let sample = (noise * 0.3 + tone * 0.7) * envelope;

      // Apply soft damping
      const dampingFactor = 1 - t * 2;
      sample *= Math.max(0.1, dampingFactor);

      // Apply gentle low-pass filtering effect
      const cutoffFreq = 1200 * (1 - t * 0.8);
      const filterEffect = Math.min(1, cutoffFreq / 1200);
      sample *= filterEffect;

      // Final volume scaling
      sample *= 0.4;

      preGeneratedClickBuffer[i] = sample;
    }

    return true;
  } catch (error) {
    console.error('Failed to pre-generate audio data:', error);
    return false;
  }
};

// Ultra-fast preload - generates all data without AudioContext
const preloadAudioFast = async () => {
  if (isAudioPreloaded) return true;

  try {
    // Pre-generate all audio data
    preGenerateAudioData();

    isAudioPreloaded = true;
    return true;
  } catch (error) {
    return false;
  }
};

// Ultra-fast click sound using pre-generated buffer
const playSoftClickFast = async () => {
  if (!audioContext || !preGeneratedClickBuffer) {
    console.warn('Cannot play click: audioContext or buffer missing');
    return;
  }

  try {
    // Create buffer from pre-generated data
    const buffer = audioContext.createBuffer(
      2,
      preGeneratedClickBuffer.length,
      audioContext.sampleRate
    );
    const leftChannel = buffer.getChannelData(0);
    const rightChannel = buffer.getChannelData(1);

    // Copy pre-generated data to both channels
    leftChannel.set(preGeneratedClickBuffer);
    rightChannel.set(preGeneratedClickBuffer);

    // Play immediately
    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();

    source.buffer = buffer;
    gainNode.gain.value = 0.7;

    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    source.start(0);
  } catch (error) {
    console.error('Error playing fast click:', error);
  }
};

// Ultra-fast bass saber creation
const createBassSaberFast = async () => {
  if (!audioContext) {
    console.error('Cannot create bass saber: no audio context');
    return false;
  }

  try {

    // Clean up existing
    if (bassSaber) {
      bassSaber.stop();
      bassSaber.disconnect();
    }
    if (subBass) {
      subBass.stop();
      subBass.disconnect();
    }

    // Create all nodes immediately
    bassSaber = audioContext.createOscillator();
    subBass = audioContext.createOscillator();
    gainNode = audioContext.createGain();
    subGainNode = audioContext.createGain();
    filterNode = audioContext.createBiquadFilter();

    // Configure immediately
    bassSaber.type = 'sine';
    bassSaber.frequency.setValueAtTime(80, audioContext.currentTime);

    subBass.type = 'triangle';
    subBass.frequency.setValueAtTime(40, audioContext.currentTime);

    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(300, audioContext.currentTime);
    filterNode.Q.setValueAtTime(1.5, audioContext.currentTime);

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    subGainNode.gain.setValueAtTime(0, audioContext.currentTime);

    // Connect immediately
    bassSaber.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioContext.destination);

    subBass.connect(subGainNode);
    subGainNode.connect(audioContext.destination);

    // Start immediately
    bassSaber.start();
    subBass.start();


    // If hover was requested before bass saber was ready, activate it now
    if (isHoverActive && gainNode && subGainNode) {
      gainNode.gain.setTargetAtTime(0.3, audioContext.currentTime, 0.1);
      subGainNode.gain.setTargetAtTime(0.2, audioContext.currentTime, 0.1);
    }

    return true;
  } catch (error) {
    console.error('Failed to create fast bass saber:', error);
    return false;
  }
};

export const audioManager = {
  // Ultra-fast preload - only pre-generates data
  preload: preloadAudioFast,

  playNavigation: async () => {
    try {

      // Initialize everything on first call if needed
      if (!isAudioInitialized) {
        const success = await initAudioContextFast();
        if (!success) return;
      }

      await playSoftClickFast();
    } catch (error) {
      console.error('Error playing navigation sound:', error);
    }
  },

  startHover: () => {
    try {
      console.log('Hover audio start requested, initialized:', isAudioInitialized);

      // Initialize everything on first call if needed
      if (!isAudioInitialized) {
        const success = initAudioContextFast();
        if (!success) {
          console.error('Failed to initialize audio for hover');
          return;
        }
      }

      isHoverActive = true;

      // Try to start audio immediately if nodes exist, otherwise wait for async creation
      if (gainNode && subGainNode && audioContext) {
        // Start immediately - everything is already created
        gainNode.gain.setTargetAtTime(0.3, audioContext.currentTime, 0.1);
        subGainNode.gain.setTargetAtTime(0.2, audioContext.currentTime, 0.1);
      } else {
        console.log('Audio nodes not ready yet, will activate when bass saber is created');
      }
    } catch (error) {
      console.error('Error starting hover audio:', error);
    }
  },

  stopHover: () => {
    try {
      isHoverActive = false;

      if (gainNode && subGainNode && audioContext) {
        gainNode.gain.setTargetAtTime(0, audioContext.currentTime, 0.3);
        subGainNode.gain.setTargetAtTime(0, audioContext.currentTime, 0.3);
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
      ) {
        // Only log if we expect it to work, and show detailed component status
        if (isHoverActive && isAudioInitialized) {
          console.warn('Cannot update hover intensity - missing components:', {
            hasAudioContext: !!audioContext,
            audioContextState: audioContext?.state,
            hasGainNode: !!gainNode,
            hasSubGainNode: !!subGainNode,
            hasBassSaber: !!bassSaber,
            hasSubBass: !!subBass,
            hasFilterNode: !!filterNode,
            isHoverActive,
            isAudioInitialized,
          });
        }
        return;
      }

      const clampedIntensity = Math.max(0, Math.min(1, intensity));

      // Ultra-fast parameter updates
      const mainGain = 0.3 + clampedIntensity * 0.4;
      const subGain = 0.2 + clampedIntensity * 0.3;

      gainNode.gain.setTargetAtTime(mainGain, audioContext.currentTime, 0.05);
      subGainNode.gain.setTargetAtTime(subGain, audioContext.currentTime, 0.05);

      const baseFrequency = 80;
      const peakFrequency = 150;
      const newFrequency = baseFrequency + (peakFrequency - baseFrequency) * clampedIntensity;
      bassSaber.frequency.setTargetAtTime(newFrequency, audioContext.currentTime, 0.05);

      const subBaseFreq = 40;
      const subPeakFreq = 70;
      const newSubFreq = subBaseFreq + (subPeakFreq - subBaseFreq) * clampedIntensity;
      subBass.frequency.setTargetAtTime(newSubFreq, audioContext.currentTime, 0.05);

      const baseFilterFreq = 300;
      const peakFilterFreq = 500;
      const newFilterFreq = baseFilterFreq + (peakFilterFreq - baseFilterFreq) * clampedIntensity;
      filterNode.frequency.setTargetAtTime(newFilterFreq, audioContext.currentTime, 0.05);
    } catch (error) {
      console.error('Error updating hover intensity:', error);
    }
  },

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
      hasPreGeneratedData: !!preGeneratedClickBuffer,
      sampleRate: audioContext?.sampleRate,
    };
  },
};
