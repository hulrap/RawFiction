/**
 * RawFiction Advanced Particle System
 * Bio-inspired, performance-first particle engine
 * Features: Neural Networks, Quantum Fields, Adaptive Quality
 */

import * as THREE from 'three';
import type {
  RawFictionEngineConfig,
  SwarmParticle,
  NeuralParticle,
  QuantumField,
  AdaptiveSettings,
  PerformanceProfiler,
} from '../types/GraphicsTypes';
import { QUALITY_PRESETS } from '../types/GraphicsTypes';

export class AdvancedParticleSystem {
  private particles: Map<string, SwarmParticle> = new Map();
  private neuralParticles: Map<string, NeuralParticle> = new Map();
  private quantumField!: QuantumField;
  private adaptiveSettings!: AdaptiveSettings;
  private performanceProfiler!: PerformanceProfiler;

  // Rendering components
  private scene: THREE.Scene;
  private particleGeometry!: THREE.BufferGeometry;
  private particleMaterial!: THREE.ShaderMaterial;
  private particleSystem!: THREE.Points;

  // Performance optimization
  private spatialGrid: Map<string, string[]> = new Map();
  private gridSize: number = 5.0;

  // Adaptive quality
  private lastAdaptation = 0;
  private adaptationInterval = 1000; // 1 second

  // Performance pools for memory efficiency (Active Theory style)
  private deadParticles: string[] = [];
  private maxPoolSize = 1000;

  // Error handling and recovery
  private initializationError = false;

  constructor(
    scene: THREE.Scene,
    _camera: THREE.Camera,
    private config: RawFictionEngineConfig
  ) {
    this.scene = scene;

    try {
      this.initializeAdaptiveSettings();
      this.initializeQuantumField();
      this.initializePerformanceProfiler();
      this.initializeParticleSystem();
      this.populateInitialParticles();
    } catch (error) {
      this.initializationError = true;
      if (process.env.NODE_ENV === 'development') {
        console.warn('AdvancedParticleSystem initialization failed:', error);
      }
      this.createFallbackSystem();
    }
  }

  private initializeAdaptiveSettings(): void {
    const preset = QUALITY_PRESETS?.HIGH || {
      maxParticles: 25000,
      effectIntensity: 0.8,
      renderScale: 0.9,
      enableAllEffects: true,
    };

    this.adaptiveSettings = {
      currentQuality: 'high',
      particleDensity: 1.0,
      effectIntensity: 0.8,
      renderScale: 0.9,
      levelOfDetail: true,
      frustumCulling: true,
      occlusionCulling: false,
      instancedRendering: true,
      particleBudget: preset.maxParticles,
      memoryBudget: 256 * 1024 * 1024, // 256MB
      frameBudget: 16.67, // 60 FPS
    };
  }

  private initializeQuantumField(): void {
    const fieldSize = 256 * 256;
    this.quantumField = {
      waveFunction: new Float32Array(fieldSize * 2), // Complex numbers
      coherenceLength: 10.0,
      entanglement: [],
      superposition: true,
      measurement: [],
    };

    // Initialize wave function with quantum noise
    for (let i = 0; i < fieldSize; i++) {
      this.quantumField.waveFunction[i * 2] = (Math.random() - 0.5) * 0.1; // Real part
      this.quantumField.waveFunction[i * 2 + 1] = (Math.random() - 0.5) * 0.1; // Imaginary part
    }
  }

  private initializePerformanceProfiler(): void {
    this.performanceProfiler = {
      frameTime: 16.67,
      updateTime: 0,
      renderTime: 0,
      gpuTime: 0,
      triangleCount: 0,
      drawCalls: 0,
      textureMemory: 0,
      bufferMemory: 0,
      thermalThrottling: false,
    };
  }

  private initializeParticleSystem(): void {
    // Create optimized geometry for instanced rendering
    const maxParticles = this.adaptiveSettings.particleBudget;

    this.particleGeometry = new THREE.BufferGeometry();

    // Position buffer (vec3)
    const positions = new Float32Array(maxParticles * 3);
    const colors = new Float32Array(maxParticles * 3);
    const sizes = new Float32Array(maxParticles);
    const behaviors = new Float32Array(maxParticles); // Encoded behavior type
    const energies = new Float32Array(maxParticles);

    this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    this.particleGeometry.setAttribute('behavior', new THREE.BufferAttribute(behaviors, 1));
    this.particleGeometry.setAttribute('energy', new THREE.BufferAttribute(energies, 1));

    // Advanced shader material with bio-inspired effects
    this.particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        quantumCoherence: { value: 1.0 },
        swarmEnergy: { value: 1.0 },
        neuralActivity: { value: 0.5 },
        adaptiveScale: { value: 1.0 },
        mousePosition: { value: new THREE.Vector2() },
        resolution: { value: new THREE.Vector2() },
      },
      vertexShader: `
        attribute float size;
        attribute float behavior;
        attribute float energy;
        attribute vec3 color;

        uniform float time;
        uniform float adaptiveScale;
        uniform vec2 mousePosition;

        varying vec3 vColor;
        varying float vBehavior;
        varying float vEnergy;
        varying float vDistance;

        // Quantum-inspired wave function
        float quantumWave(vec3 pos, float time) {
          return sin(pos.x * 10.0 + time) * cos(pos.y * 8.0 + time * 0.7) * sin(pos.z * 6.0 + time * 0.5);
        }

        // Swarm behavior modulation
        vec3 swarmForce(vec3 pos, float behavior, float time) {
          vec3 force = vec3(0.0);

          // Explorer behavior - high-frequency movement
          if (behavior < 1.0) {
            force += vec3(
              sin(time * 2.0 + pos.x * 5.0),
              cos(time * 1.5 + pos.y * 4.0),
              sin(time * 1.8 + pos.z * 3.0)
            ) * 0.1;
          }
          // Follower behavior - smooth following
          else if (behavior < 2.0) {
            force += normalize(mousePosition.xyy - pos) * 0.05;
          }
          // Leader behavior - directional movement
          else if (behavior < 3.0) {
            force += vec3(sin(time * 0.5), cos(time * 0.3), sin(time * 0.7)) * 0.08;
          }

          return force;
        }

        void main() {
          vColor = color;
          vBehavior = behavior;
          vEnergy = energy;

          vec3 worldPos = position;

          // Apply quantum field fluctuations
          float quantum = quantumWave(worldPos, time) * 0.02;
          // Generate a pseudo-normal for quantum effects
          vec3 pseudoNormal = normalize(worldPos + vec3(sin(time), cos(time), sin(time * 0.7)));
          worldPos += pseudoNormal * quantum;

          // Apply swarm behavior forces
          vec3 swarmOffset = swarmForce(worldPos, behavior, time);
          worldPos += swarmOffset;

          // Distance-based size scaling
          vec4 mvPosition = modelViewMatrix * vec4(worldPos, 1.0);
          vDistance = length(mvPosition.xyz);

          gl_Position = projectionMatrix * mvPosition;

          // Adaptive size based on distance and energy with safer calculations
          float safeDistance = max(1.0, vDistance);
          float adaptiveSize = size * energy * adaptiveScale;
          adaptiveSize *= (100.0 / safeDistance);

          gl_PointSize = clamp(adaptiveSize, 1.0, 50.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float quantumCoherence;
        uniform float swarmEnergy;
        uniform float neuralActivity;

        varying vec3 vColor;
        varying float vBehavior;
        varying float vEnergy;
        varying float vDistance;

        // Advanced noise for organic effects
        float hash(float n) {
          return fract(sin(n) * 43758.5453);
        }

        float noise(vec3 x) {
          vec3 p = floor(x);
          vec3 f = fract(x);
          f = f * f * (3.0 - 2.0 * f);

          float n = p.x + p.y * 57.0 + 113.0 * p.z;
          return mix(
            mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
                mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
            mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
                mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y), f.z);
        }

        void main() {
          vec2 uv = gl_PointCoord - vec2(0.5);
          float dist = length(uv);

          // Discard pixels outside circle
          if (dist > 0.5) discard;

          // Safe color and alpha calculations
          vec3 finalColor = clamp(vColor, 0.0, 1.0);
          float alpha = clamp(1.0 - dist * 2.0, 0.0, 1.0);

          // Quantum coherence effect with safe calculations
          float safeDistance = max(1.0, vDistance);
          float coherence = quantumCoherence * sin(time * 3.0 + safeDistance * 0.1);
          finalColor += vec3(coherence * 0.2, coherence * 0.1, coherence * 0.3);

          // Neural activity pulsing with safe behavior values
          float safeBehavior = clamp(vBehavior, 0.0, 1.0);
          float neural = neuralActivity * (sin(time * 5.0 + safeBehavior * 10.0) * 0.5 + 0.5);
          finalColor *= (1.0 + neural * 0.3);

          // Energy-based intensity with clamping
          float safeEnergy = clamp(vEnergy, 0.1, 1.0);
          finalColor *= safeEnergy;

          // Organic noise overlay with safe time values
          float organicNoise = noise(vec3(uv * 10.0, mod(time, 100.0) * 0.5)) * 0.1;
          finalColor += vec3(organicNoise);

          // Distance-based alpha falloff
          alpha *= smoothstep(500.0, 100.0, safeDistance);

          // Final color and alpha clamping
          finalColor = clamp(finalColor, 0.0, 1.0);
          alpha = clamp(alpha, 0.0, 1.0);

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.particleSystem = new THREE.Points(this.particleGeometry, this.particleMaterial);
    this.scene.add(this.particleSystem);
  }

  private createFallbackSystem(): void {
    try {
      // Ultra-simple fallback particle system
      const fallbackGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(300 * 3); // Simple fallback with 300 particles
      const colors = new Float32Array(300 * 3);

      for (let i = 0; i < 300; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

        colors[i * 3] = 0.3 + Math.random() * 0.3;
        colors[i * 3 + 1] = 0.4 + Math.random() * 0.4;
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
      }

      fallbackGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      fallbackGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const fallbackMaterial = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
      });

      this.particleSystem = new THREE.Points(fallbackGeometry, fallbackMaterial);
      this.scene.add(this.particleSystem);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Even fallback particle system failed:', error);
      }
    }
  }

  private populateInitialParticles(): void {
    const count = Math.min(this.config.maxParticles, this.adaptiveSettings.particleBudget);

    for (let i = 0; i < count; i++) {
      this.createSwarmParticle();

      // Create neural particles for complex behaviors
      if (this.config.enableNeuralParticles && i % 10 === 0) {
        this.createNeuralParticle();
      }
    }

    this.updateParticleBuffers();
  }

  private createSwarmParticle(): SwarmParticle {
    const id = this.getPooledParticleId();
    const behaviors: SwarmParticle['behavior'][] = [
      'explorer',
      'follower',
      'leader',
      'maverick',
      'guardian',
    ];

    const particle: SwarmParticle = {
      id,
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1
      ),
      acceleration: new THREE.Vector3(),
      behavior: behaviors[Math.floor(Math.random() * behaviors.length)] || 'explorer',
      energy: 0.5 + Math.random() * 0.5,
      influence: Math.random(),
      socialRadius: 2 + Math.random() * 3,
      life: 0,
      maxLife: 1000 + Math.random() * 2000,
      reproductionThreshold: 0.8,
      size: 0.5 + Math.random() * 1.5,
      color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6),
      opacity: 0.8,
      trail: [],
      state: 'active',
      memory: {
        visitedPositions: [],
        attractors: [],
        repulsors: [],
        socialConnections: [],
        learningRate: 0.01 + Math.random() * 0.05,
      },
    };

    this.particles.set(id, particle);
    return particle;
  }

  private createNeuralParticle(): NeuralParticle {
    const id = `neural_${Date.now()}_${Math.random()}`;

    const neuralParticle: NeuralParticle = {
      id,
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15
      ),
      activation: 0,
      threshold: 0.5 + Math.random() * 0.3,
      connections: [],
      learningRate: 0.001 + Math.random() * 0.009,
      memoryTrace: new Array(10).fill(0),
    };

    this.neuralParticles.set(id, neuralParticle);
    return neuralParticle;
  }

  private updateParticleBuffers(): void {
    const positionAttr = this.particleGeometry.attributes['position'];
    const colorAttr = this.particleGeometry.attributes['color'];
    const sizeAttr = this.particleGeometry.attributes['size'];
    const behaviorAttr = this.particleGeometry.attributes['behavior'];
    const energyAttr = this.particleGeometry.attributes['energy'];

    if (!positionAttr || !colorAttr || !sizeAttr || !behaviorAttr || !energyAttr) return;

    const positions = positionAttr.array as Float32Array;
    const colors = colorAttr.array as Float32Array;
    const sizes = sizeAttr.array as Float32Array;
    const behaviors = behaviorAttr.array as Float32Array;
    const energies = energyAttr.array as Float32Array;

    let index = 0;
    for (const particle of this.particles.values()) {
      if (index * 3 >= positions.length) break;

      // Position
      positions[index * 3] = particle.position.x;
      positions[index * 3 + 1] = particle.position.y;
      positions[index * 3 + 2] = particle.position.z;

      // Color
      colors[index * 3] = particle.color.r;
      colors[index * 3 + 1] = particle.color.g;
      colors[index * 3 + 2] = particle.color.b;

      // Size
      sizes[index] = particle.size;

      // Behavior (encoded as number)
      const behaviorMap = { explorer: 0, follower: 1, leader: 2, maverick: 3, guardian: 4 };
      behaviors[index] = behaviorMap[particle.behavior];

      // Energy
      energies[index] = particle.energy;

      index++;
    }

    // Update particle count for rendering
    this.particleGeometry.setDrawRange(0, index);

    // Mark attributes as needing update
    positionAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;
    sizeAttr.needsUpdate = true;
    behaviorAttr.needsUpdate = true;
    energyAttr.needsUpdate = true;
  }

  public update(deltaTime: number, mousePosition?: THREE.Vector2): void {
    const startTime = performance.now();

    // Active Theory-style spatial optimization
    this.updateSpatialGrid();

    // Update quantum field
    this.updateQuantumField(deltaTime);

    // Update swarm particles
    this.updateSwarmParticles(deltaTime, mousePosition);

    // Update neural network
    if (this.config.enableNeuralParticles) {
      this.updateNeuralNetwork(deltaTime);
    }

    // Update particle buffers
    this.updateParticleBuffers();

    // Update shader uniforms
    this.updateShaderUniforms(deltaTime, mousePosition);

    // Adaptive quality management
    this.updateAdaptiveQuality();

    // Performance profiling
    this.performanceProfiler.updateTime = performance.now() - startTime;
  }

  private updateQuantumField(_deltaTime: number): void {
    if (!this.config.enableQuantumField || !this.quantumField.waveFunction) return;

    const waveFunction = this.quantumField.waveFunction;
    const coherenceDecay = 0.99;

    // Simulate quantum field evolution
    for (let i = 0; i < waveFunction.length; i += 2) {
      // Real part
      const realIndex = i;
      const imagIndex = i + 1;

      if (realIndex < waveFunction.length) {
        waveFunction[realIndex] = (waveFunction[realIndex] || 0) * coherenceDecay;
        waveFunction[realIndex] += (Math.random() - 0.5) * 0.001;
      }

      // Imaginary part
      if (imagIndex < waveFunction.length) {
        waveFunction[imagIndex] = (waveFunction[imagIndex] || 0) * coherenceDecay;
        waveFunction[imagIndex] += (Math.random() - 0.5) * 0.001;
      }
    }
  }

  private updateSwarmParticles(deltaTime: number, mousePosition?: THREE.Vector2): void {
    for (const particle of this.particles.values()) {
      // Age the particle
      particle.life += deltaTime;

      // Remove dead particles with memory pooling
      if (particle.life >= particle.maxLife) {
        this.recycleParticle(particle.id);
        continue;
      }

      // Apply swarm behaviors
      this.applySwarmBehavior(particle, mousePosition);

      // Update physics
      particle.velocity.add(particle.acceleration.clone().multiplyScalar(deltaTime));
      particle.velocity.multiplyScalar(0.98); // Damping
      particle.position.add(particle.velocity.clone().multiplyScalar(deltaTime));

      // Reset acceleration
      particle.acceleration.multiplyScalar(0);

      // Update energy based on activity
      const velocityMagnitude = particle.velocity.length();
      particle.energy = Math.max(0.1, particle.energy + (velocityMagnitude - 0.05) * 0.01);
      particle.energy = Math.min(1.0, particle.energy);
    }
  }

  private applySwarmBehavior(particle: SwarmParticle, mousePosition?: THREE.Vector2): void {
    const neighbors = this.findNeighbors(particle);

    const separation = new THREE.Vector3();
    const alignment = new THREE.Vector3();
    let cohesion = new THREE.Vector3();

    if (neighbors.length > 0) {
      // Separation: steer away from neighbors
      for (const neighbor of neighbors) {
        const diff = particle.position.clone().sub(neighbor.position);
        const distance = diff.length();
        if (distance > 0 && distance < particle.socialRadius * 0.5) {
          diff.normalize().divideScalar(distance);
          separation.add(diff);
        }
      }

      // Alignment: steer towards average heading of neighbors
      for (const neighbor of neighbors) {
        alignment.add(neighbor.velocity);
      }
      alignment.divideScalar(neighbors.length);

      // Cohesion: steer towards average position of neighbors
      const center = new THREE.Vector3();
      for (const neighbor of neighbors) {
        center.add(neighbor.position);
      }
      center.divideScalar(neighbors.length);
      cohesion = center.sub(particle.position);
    }

    // Mouse interaction
    if (mousePosition) {
      const mousePos3D = new THREE.Vector3(
        mousePosition.x * 10,
        mousePosition.y * 10,
        particle.position.z
      );
      const toMouse = mousePos3D.sub(particle.position);
      const distance = toMouse.length();

      if (distance < 5) {
        const mouseForce = toMouse.normalize().multiplyScalar(0.02);
        particle.acceleration.add(mouseForce);
      }
    }

    // Apply forces based on behavior
    const behaviorStrength = this.getBehaviorStrength(particle.behavior);
    particle.acceleration.add(separation.multiplyScalar(behaviorStrength.separation));
    particle.acceleration.add(alignment.multiplyScalar(behaviorStrength.alignment));
    particle.acceleration.add(cohesion.multiplyScalar(behaviorStrength.cohesion));
  }

  // Active Theory-style spatial partitioning for performance
  private updateSpatialGrid(): void {
    this.spatialGrid.clear();

    for (const particle of this.particles.values()) {
      const gridX = Math.floor(particle.position.x / this.gridSize);
      const gridY = Math.floor(particle.position.y / this.gridSize);
      const gridZ = Math.floor(particle.position.z / this.gridSize);
      const key = `${gridX},${gridY},${gridZ}`;

      if (!this.spatialGrid.has(key)) {
        this.spatialGrid.set(key, []);
      }
      this.spatialGrid.get(key)!.push(particle.id);
    }
  }

  private findNeighbors(particle: SwarmParticle): SwarmParticle[] {
    const neighbors: SwarmParticle[] = [];
    const gridX = Math.floor(particle.position.x / this.gridSize);
    const gridY = Math.floor(particle.position.y / this.gridSize);
    const gridZ = Math.floor(particle.position.z / this.gridSize);

    // Check surrounding grid cells (3x3x3)
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          const key = `${gridX + dx},${gridY + dy},${gridZ + dz}`;
          const cellParticles = this.spatialGrid.get(key);

          if (cellParticles) {
            for (const particleId of cellParticles) {
              if (particleId === particle.id) continue;

              const otherParticle = this.particles.get(particleId);
              if (otherParticle) {
                const distance = particle.position.distanceTo(otherParticle.position);
                if (distance < particle.socialRadius) {
                  neighbors.push(otherParticle);
                }
              }
            }
          }
        }
      }
    }

    return neighbors;
  }

  // Memory pooling for performance (Active Theory technique)
  private recycleParticle(id: string): void {
    if (this.deadParticles.length < this.maxPoolSize) {
      this.deadParticles.push(id);
    }
    this.particles.delete(id);
  }

  private getPooledParticleId(): string {
    return this.deadParticles.pop() || `particle_${Date.now()}_${Math.random()}`;
  }

  private getBehaviorStrength(behavior: SwarmParticle['behavior']) {
    const strengths = {
      explorer: { separation: 0.02, alignment: 0.01, cohesion: 0.005 },
      follower: { separation: 0.015, alignment: 0.025, cohesion: 0.02 },
      leader: { separation: 0.01, alignment: 0.005, cohesion: 0.01 },
      maverick: { separation: 0.03, alignment: 0.001, cohesion: 0.001 },
      guardian: { separation: 0.01, alignment: 0.02, cohesion: 0.025 },
    };

    return strengths[behavior];
  }

  private updateNeuralNetwork(_deltaTime: number): void {
    // Simple neural network simulation
    for (const neuron of this.neuralParticles.values()) {
      let totalInput = 0;

      // Calculate input from connected neurons
      for (const connection of neuron.connections) {
        const sourceNeuron = this.neuralParticles.get(connection.targetId);
        if (sourceNeuron && connection.active) {
          totalInput += sourceNeuron.activation * connection.weight;
        }
      }

      // Update activation with sigmoid function
      neuron.activation = 1 / (1 + Math.exp(-(totalInput - neuron.threshold)));

      // Update memory trace
      neuron.memoryTrace.shift();
      neuron.memoryTrace.push(neuron.activation);
    }
  }

  private updateShaderUniforms(deltaTime: number, mousePosition?: THREE.Vector2): void {
    if (this.initializationError || !this.particleMaterial?.uniforms) return;

    try {
      const elapsedTime = performance.now() * 0.001;

      // Update time uniform
      if (this.particleMaterial.uniforms['time']) {
        this.particleMaterial.uniforms['time'].value = elapsedTime;
      }

      // Update mouse position
      if (mousePosition && this.particleMaterial.uniforms['mousePosition']) {
        this.particleMaterial.uniforms['mousePosition'].value.copy(mousePosition);
      }

      // Update adaptive scale based on performance
      if (this.particleMaterial.uniforms['adaptiveScale']) {
        const targetScale = this.adaptiveSettings.renderScale;
        const currentScale = this.particleMaterial.uniforms['adaptiveScale'].value;
        this.particleMaterial.uniforms['adaptiveScale'].value = THREE.MathUtils.lerp(
          currentScale,
          targetScale,
          deltaTime * 2.0
        );
      }

      // Update quantum coherence
      if (this.particleMaterial.uniforms['quantumCoherence']) {
        this.particleMaterial.uniforms['quantumCoherence'].value =
          0.8 + Math.sin(elapsedTime * 0.5) * 0.2;
      }

      // Update swarm energy
      if (this.particleMaterial.uniforms['swarmEnergy']) {
        const avgEnergy =
          Array.from(this.particles.values()).reduce((sum, p) => sum + p.energy, 0) /
          Math.max(1, this.particles.size);
        this.particleMaterial.uniforms['swarmEnergy'].value = avgEnergy;
      }

      // Update neural activity
      if (this.particleMaterial.uniforms['neuralActivity']) {
        const neuralActivity =
          this.neuralParticles.size > 0
            ? Array.from(this.neuralParticles.values()).reduce((sum, p) => sum + p.activation, 0) /
              this.neuralParticles.size
            : 0.5;
        this.particleMaterial.uniforms['neuralActivity'].value = neuralActivity;
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Shader uniform update failed:', error);
      }
    }
  }

  private updateAdaptiveQuality(): void {
    const now = performance.now();
    if (now - this.lastAdaptation < this.adaptationInterval) return;

    this.lastAdaptation = now;

    // Simple adaptive quality based on particle count and performance
    const currentParticleCount = this.particles.size;
    const targetCount = this.adaptiveSettings.particleBudget;

    if (currentParticleCount > targetCount * 1.2) {
      // Too many particles, reduce quality
      this.adaptiveSettings.renderScale *= 0.95;
      this.adaptiveSettings.effectIntensity *= 0.98;
    } else if (currentParticleCount < targetCount * 0.8) {
      // Too few particles, increase quality
      this.adaptiveSettings.renderScale *= 1.02;
      this.adaptiveSettings.effectIntensity *= 1.01;
    }

    // Clamp values
    this.adaptiveSettings.renderScale = THREE.MathUtils.clamp(
      this.adaptiveSettings.renderScale,
      0.3,
      1.0
    );
    this.adaptiveSettings.effectIntensity = THREE.MathUtils.clamp(
      this.adaptiveSettings.effectIntensity,
      0.2,
      1.0
    );
  }

  public getPerformanceStats(): PerformanceProfiler {
    this.performanceProfiler.triangleCount = this.particles.size * 2; // Point sprites
    this.performanceProfiler.drawCalls = 1; // Single instanced draw call

    return { ...this.performanceProfiler };
  }

  public dispose(): void {
    this.scene.remove(this.particleSystem);
    this.particleGeometry.dispose();
    this.particleMaterial.dispose();
    this.particles.clear();
    this.neuralParticles.clear();
  }
}
