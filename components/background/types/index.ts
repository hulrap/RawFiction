import * as THREE from 'three';

// Surface configuration for the 5 faces of the cube environment
export interface CubeSurface {
  name: 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom';
  center: [number, number, number];
  rotation: [number, number, number]; // Euler rotation for wall orientation
  dimensions: {
    width: number | '100vw'; // Can be static or responsive
    height: number | '100vh'; // Can be static or responsive
  };
  cubeCount?: number;
  distributionType?: 'grid' | 'random' | 'spiral';
  animationLoop?: 'breathing';
}

// Individual cube configuration within the maze
export interface MazeCube {
  id: string;
  surface: CubeSurface['name'];
  position: THREE.Vector3;
  size: number;
  basePosition: THREE.Vector3;
  speed: number;
  opacity: number;
  rotationSpeed: THREE.Vector3;
  currentRotation: THREE.Vector3;
  animationOffset: number;
}

// Animation loop configuration for cube movement patterns
export interface AnimationLoop {
  speed: number;
  direction: number;
}

// Main background system configuration
export interface CubeMazeConfig {
  surfaces: CubeSurface[];
  cubes: MazeCube[];
  animationLoops: AnimationLoop[];
  globalSettings: {
    cameraDistance: number;
    cubeCount: {
      front: number;
      left: number;
      right: number;
      top: number;
      bottom: number;
    };
    sizeRange: {
      min: number;
      max: number;
    };
    speedRange: {
      min: number;
      max: number;
    };
    opacity: {
      base: number;
      variation: number;
    };
  };
}

// Shader uniform types
export interface CubeMazeUniforms {
  uTime: { value: number };
  uOpacity: { value: number };
}

// Performance optimization levels
export type PerformanceLevel = 'low' | 'medium' | 'high' | 'ultra';

export interface PerformanceSettings {
  level: PerformanceLevel;
  maxCubesPerSurface: number;
  updateFrequency: number;
  enableComplexShaders: boolean;
  enableMouseInteraction: boolean;
  enableParallax: boolean;
}

// Surface generation configuration
export interface SurfaceGeneratorConfig {
  surfaceDistance: number;
  cubeCountPerSurface: number;
  cubeSize: {
    min: number;
    max: number;
  };
  cubeOpacity: {
    min: number;
    max: number;
  };
  animationSpeed: {
    min: number;
    max: number;
  };
}
