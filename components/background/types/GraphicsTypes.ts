import * as THREE from 'three';

// Core Graphics Configuration
export interface GraphicsConfig {
  enableWebGPU: boolean;
  enablePathTracing: boolean;
  enableAdvancedParticles: boolean;
  enableMouseReactivity: boolean;
  quality: 'ultra' | 'high' | 'medium' | 'low';
  targetFPS: number;
}

// Mouse Interaction
export interface MousePosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
  velocity: THREE.Vector2;
  lastPosition: THREE.Vector2;
}

// Particle System Types
export interface ParticleConfig {
  count: number;
  type: 'neural' | 'energy' | 'quantum' | 'plasma' | 'volumetric';
  size: number;
  speed: number;
  reactivity: number;
  color: THREE.Color;
  emissive: boolean;
}

export interface Particle {
  id: string;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
  color: THREE.Color;
  opacity: number;
  type: ParticleConfig['type'];
}

// Path Tracing Configuration
export interface PathTracingConfig {
  bounces: number;
  samples: number;
  denoise: boolean;
  enableGI: boolean;
  enableCaustics: boolean;
  enableVolumetrics: boolean;
}

// WebGPU Configuration
export interface WebGPUConfig {
  preferredFormat: GPUTextureFormat;
  powerPreference: GPUPowerPreference;
  enableValidation: boolean;
  maxBufferSize: number;
}

// 3D Environment Types
export interface EnvironmentConfig {
  skybox: 'procedural' | 'hdri' | 'gradient';
  lighting: 'natural' | 'studio' | 'dramatic';
  atmosphere: boolean;
  fog: boolean;
  shadows: boolean;
}

// Performance Monitoring
export interface PerformanceStats {
  fps: number;
  frameTime: number;
  drawCalls: number;
  triangles: number;
  gpuMemory: number;
  cpuTime: number;
}

// Shader Material Types
export interface ShaderUniforms {
  time: { value: number };
  resolution: { value: THREE.Vector2 };
  mouse: { value: THREE.Vector2 };
  cameraPosition: { value: THREE.Vector3 };
  viewMatrix: { value: THREE.Matrix4 };
  projectionMatrix: { value: THREE.Matrix4 };
}

// Advanced Rendering Pipeline
export interface RenderPipeline {
  id: string;
  name: string;
  enabled: boolean;
  priority: number;
  passes: RenderPass[];
}

export interface RenderPass {
  id: string;
  type: 'geometry' | 'lighting' | 'postprocess' | 'compute';
  enabled: boolean;
  shader?: THREE.ShaderMaterial;
  uniforms?: ShaderUniforms;
}

// Scene Management
export interface SceneObject {
  id: string;
  mesh: THREE.Mesh;
  material: THREE.Material;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  reactive: boolean;
  animated: boolean;
}

// Animation System
export interface Animation {
  id: string;
  target: string;
  property: string;
  duration: number;
  easing: string;
  loop: boolean;
  autoplay: boolean;
}
