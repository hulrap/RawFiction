/**
 * RawFiction Graphics Engine - Type Definitions
 * Bio-inspired, performance-first 3D graphics system
 * Unique approach inspired by swarm intelligence and natural phenomena
 */

import * as THREE from 'three';

// === CORE ENGINE ARCHITECTURE ===

export interface RawFictionEngineConfig {
  // Performance Strategy
  adaptiveQuality: boolean;
  targetFPS: number;
  qualityThreshold: number;

  // Bio-Inspired Systems
  enableSmartSwarm: boolean;
  enableNeuralParticles: boolean;
  enableQuantumField: boolean;

  // Rendering Pipeline
  preferredRenderer: 'webgpu' | 'webgl' | 'hybrid';
  enablePathTracing: boolean;
  maxParticles: number;

  // Interaction Systems
  mouseReactivity: number;
  audioReactivity: boolean;
  gestureControl: boolean;
}

// === SMART SWARM SYSTEM ===

export interface SwarmParticle {
  // Core Properties
  id: string;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;

  // Bio-Inspired Behavior
  behavior: 'explorer' | 'follower' | 'leader' | 'maverick' | 'guardian';
  energy: number;
  influence: number;
  socialRadius: number;

  // Lifecycle
  life: number;
  maxLife: number;
  reproductionThreshold: number;

  // Visual Properties
  size: number;
  color: THREE.Color;
  opacity: number;
  trail: THREE.Vector3[];

  // State Management
  state: 'active' | 'dormant' | 'reproducing' | 'dying';
  memory: SwarmMemory;
}

export interface SwarmMemory {
  visitedPositions: THREE.Vector3[];
  attractors: THREE.Vector3[];
  repulsors: THREE.Vector3[];
  socialConnections: string[];
  learningRate: number;
}

export interface SwarmConfig {
  // Population Dynamics
  maxParticles: number;
  initialPopulation: number;
  reproductionRate: number;
  mortalityRate: number;

  // Behavioral Parameters
  separationDistance: number;
  alignmentDistance: number;
  cohesionDistance: number;
  explorationTendency: number;
  socialInfluence: number;

  // Environmental Forces
  attractorStrength: number;
  repulsorStrength: number;
  turbulenceLevel: number;
  gravityWells: GravityWell[];

  // Performance Optimization
  spatialPartitioning: boolean;
  levelOfDetail: boolean;
  cullingDistance: number;
}

export interface GravityWell {
  position: THREE.Vector3;
  strength: number;
  radius: number;
  type: 'attract' | 'repel' | 'vortex';
}

// === NEURAL PARTICLE SYSTEM ===

export interface NeuralParticle {
  id: string;
  position: THREE.Vector3;
  activation: number;
  threshold: number;
  connections: NeuralConnection[];
  learningRate: number;
  memoryTrace: number[];
}

export interface NeuralConnection {
  targetId: string;
  weight: number;
  delay: number;
  active: boolean;
}

export interface NeuralNetworkConfig {
  networkTopology: 'mesh' | 'hierarchical' | 'small-world' | 'scale-free';
  connectionProbability: number;
  learningEnabled: boolean;
  plasticityRate: number;
  inhibitionStrength: number;
}

// === QUANTUM FIELD EFFECTS ===

export interface QuantumField {
  waveFunction: Float32Array;
  coherenceLength: number;
  entanglement: QuantumEntanglement[];
  superposition: boolean;
  measurement: QuantumMeasurement[];
}

export interface QuantumEntanglement {
  particleA: string;
  particleB: string;
  strength: number;
  phase: number;
}

export interface QuantumMeasurement {
  position: THREE.Vector3;
  probability: number;
  collapsed: boolean;
}

// === ADAPTIVE QUALITY SYSTEM ===

export interface QualityMetrics {
  // Performance Metrics
  fps: number;
  frameTime: number;
  gpuUtilization: number;
  memoryUsage: number;

  // Visual Quality Metrics
  particleCount: number;
  effectComplexity: number;
  renderPasses: number;
  shaderComplexity: number;

  // Adaptive Thresholds
  targetFPS: number;
  minQuality: number;
  maxQuality: number;
  adaptationSpeed: number;
}

export interface AdaptiveSettings {
  // Dynamic Quality Levels
  currentQuality: 'ultra' | 'high' | 'medium' | 'low' | 'minimal';
  particleDensity: number;
  effectIntensity: number;
  renderScale: number;

  // Optimization Strategies
  levelOfDetail: boolean;
  frustumCulling: boolean;
  occlusionCulling: boolean;
  instancedRendering: boolean;

  // Performance Budgets
  particleBudget: number;
  memoryBudget: number;
  frameBudget: number;
}

// === ADVANCED RENDERING ===

export interface RenderPipeline {
  id: string;
  stages: RenderStage[];
  enabled: boolean;
  priority: number;
}

export interface RenderStage {
  name: string;
  type: 'geometry' | 'compute' | 'postprocess' | 'composite';
  shader: string;
  uniforms: Record<string, unknown>;
  enabled: boolean;
  dependencies: string[];
}

export interface ComputeShaderConfig {
  workgroupSize: number;
  bufferBindings: BufferBinding[];
  textureBindings: TextureBinding[];
  uniformBindings: UniformBinding[];
}

export interface BufferBinding {
  name: string;
  type: 'storage' | 'uniform';
  access: 'read' | 'write' | 'read_write';
}

export interface TextureBinding {
  name: string;
  format: GPUTextureFormat;
  usage: number; // GPUTextureUsageFlags
}

export interface UniformBinding {
  name: string;
  type: 'f32' | 'vec2f' | 'vec3f' | 'vec4f' | 'mat4x4f';
  value: number | number[] | Float32Array;
}

// === INTERACTION SYSTEMS ===

export interface MouseInteraction {
  position: THREE.Vector2;
  normalizedPosition: THREE.Vector2;
  velocity: THREE.Vector2;
  acceleration: THREE.Vector2;
  pressure: number;

  // Gesture Recognition
  gesture: GestureType;
  confidence: number;
  duration: number;

  // Influence Field
  influenceRadius: number;
  influenceStrength: number;
  decayRate: number;
}

export type GestureType = 'none' | 'click' | 'drag' | 'swipe' | 'pinch' | 'rotate' | 'hover';

export interface AudioReactivity {
  enabled: boolean;
  sensitivity: number;
  frequencyBands: number[];
  amplitudeThreshold: number;
  beatDetection: boolean;
  spectralCentroid: number;
}

// === PERFORMANCE MONITORING ===

export interface PerformanceProfiler {
  // Timing Metrics
  frameTime: number;
  updateTime: number;
  renderTime: number;
  gpuTime: number;

  // Resource Usage
  triangleCount: number;
  drawCalls: number;
  textureMemory: number;
  bufferMemory: number;

  // System Health
  gpuTemperature?: number;
  powerConsumption?: number;
  thermalThrottling: boolean;
}

// === VISUAL EFFECTS ===

export interface EffectConfig {
  bloom: BloomConfig;
  motionBlur: MotionBlurConfig;
  volumetricLighting: VolumetricConfig;
  godRays: GodRaysConfig;
  atmosphericScattering: AtmosphericConfig;
}

export interface BloomConfig {
  enabled: boolean;
  threshold: number;
  strength: number;
  radius: number;
  passes: number;
}

export interface MotionBlurConfig {
  enabled: boolean;
  samples: number;
  intensity: number;
  velocityScale: number;
}

export interface VolumetricConfig {
  enabled: boolean;
  density: number;
  scattering: number;
  absorption: number;
  steps: number;
}

export interface GodRaysConfig {
  enabled: boolean;
  source: THREE.Vector3;
  intensity: number;
  decay: number;
  samples: number;
}

export interface AtmosphericConfig {
  enabled: boolean;
  rayleighScattering: THREE.Vector3;
  mieScattering: number;
  sunIntensity: number;
  sunPosition: THREE.Vector3;
}

// === LEGACY COMPATIBILITY ===

// Keep existing interfaces for backward compatibility
export interface PathTracingConfig {
  bounces: number;
  samples: number;
  denoise: boolean;
  enableGI: boolean;
  enableCaustics: boolean;
  enableVolumetrics: boolean;
}

export interface WebGPUConfig {
  preferredFormat: GPUTextureFormat;
  powerPreference: GPUPowerPreference;
  enableValidation: boolean;
  maxBufferSize: number;
}

export interface MousePosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
  velocity: THREE.Vector2;
  lastPosition: THREE.Vector2;
}

export interface PerformanceStats {
  fps: number;
  frameTime: number;
  drawCalls: number;
  triangles: number;
  gpuMemory: number;
  cpuTime: number;
}

// === CONSTANTS ===

export const QUALITY_PRESETS = {
  ULTRA: {
    maxParticles: 50000,
    effectIntensity: 1.0,
    renderScale: 1.0,
    enableAllEffects: true,
  },
  HIGH: {
    maxParticles: 25000,
    effectIntensity: 0.8,
    renderScale: 0.9,
    enableAllEffects: true,
  },
  MEDIUM: {
    maxParticles: 10000,
    effectIntensity: 0.6,
    renderScale: 0.8,
    enableAllEffects: false,
  },
  LOW: {
    maxParticles: 5000,
    effectIntensity: 0.4,
    renderScale: 0.7,
    enableAllEffects: false,
  },
  MINIMAL: {
    maxParticles: 1000,
    effectIntensity: 0.2,
    renderScale: 0.5,
    enableAllEffects: false,
  },
} as const;

export const SWARM_BEHAVIORS = {
  EXPLORER: {
    curiosity: 0.8,
    socialInfluence: 0.2,
    energyConsumption: 1.2,
  },
  FOLLOWER: {
    curiosity: 0.2,
    socialInfluence: 0.9,
    energyConsumption: 0.8,
  },
  LEADER: {
    curiosity: 0.6,
    socialInfluence: 0.1,
    energyConsumption: 1.0,
  },
  MAVERICK: {
    curiosity: 0.9,
    socialInfluence: 0.1,
    energyConsumption: 1.5,
  },
  GUARDIAN: {
    curiosity: 0.3,
    socialInfluence: 0.7,
    energyConsumption: 0.9,
  },
} as const;
