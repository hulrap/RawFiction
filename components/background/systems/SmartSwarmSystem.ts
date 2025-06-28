/**
 * SmartSwarm - Bio-inspired particle system for RawFiction
 * Uses emergent behavior patterns like flocking, schooling, and swarming
 * for natural-looking animations with minimal computational overhead
 */

import * as THREE from 'three';

interface SwarmParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;
  life: number;
  maxLife: number;
  behavior: 'explorer' | 'follower' | 'leader' | 'maverick';
  energy: number;
  influence: number;
}

interface SwarmConfig {
  maxParticles: number;
  separationDistance: number;
  alignmentDistance: number;
  cohesionDistance: number;
  maxSpeed: number;
  maxForce: number;
  behaviorWeights: {
    separation: number;
    alignment: number;
    cohesion: number;
    wander: number;
  };
}

export class SmartSwarmSystem {
  private particles: SwarmParticle[] = [];
  private geometry!: THREE.BufferGeometry;
  private material!: THREE.ShaderMaterial;
  private mesh!: THREE.Points;
  private config: SwarmConfig;
  private spatialGrid: Map<string, SwarmParticle[]> = new Map();
  private gridSize: number = 5;

  // Performance optimization: reusable vectors
  private tempVector1 = new THREE.Vector3();
  private tempVector2 = new THREE.Vector3();

  constructor(config: Partial<SwarmConfig> = {}) {
    this.config = {
      maxParticles: 1000,
      separationDistance: 2.0,
      alignmentDistance: 3.0,
      cohesionDistance: 4.0,
      maxSpeed: 0.1,
      maxForce: 0.03,
      behaviorWeights: {
        separation: 1.5,
        alignment: 1.0,
        cohesion: 1.0,
        wander: 0.3,
      },
      ...config,
    };

    this.initializeParticles();
    this.createGeometry();
    this.createMaterial();
    this.mesh = new THREE.Points(this.geometry, this.material);
  }

  private initializeParticles(): void {
    for (let i = 0; i < this.config.maxParticles; i++) {
      const particle: SwarmParticle = {
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
        life: Math.random(),
        maxLife: 1.0 + Math.random() * 2.0,
        behavior: this.assignBehavior(),
        energy: 0.5 + Math.random() * 0.5,
        influence: Math.random(),
      };
      this.particles.push(particle);
    }
  }

  private assignBehavior(): SwarmParticle['behavior'] {
    const rand = Math.random();
    if (rand < 0.1) return 'leader';
    if (rand < 0.25) return 'maverick';
    if (rand < 0.65) return 'follower';
    return 'explorer';
  }

  private createGeometry(): void {
    this.geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(this.config.maxParticles * 3);
    const velocities = new Float32Array(this.config.maxParticles * 3);
    const lives = new Float32Array(this.config.maxParticles);
    const behaviors = new Float32Array(this.config.maxParticles);
    const influences = new Float32Array(this.config.maxParticles);

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    this.geometry.setAttribute('life', new THREE.BufferAttribute(lives, 1));
    this.geometry.setAttribute('behavior', new THREE.BufferAttribute(behaviors, 1));
    this.geometry.setAttribute('influence', new THREE.BufferAttribute(influences, 1));
  }

  private createMaterial(): void {
    try {
      this.material = new THREE.ShaderMaterial({
        vertexShader: `
          attribute float life;
          attribute float behavior;
          attribute float influence;
          attribute vec3 velocity;

          uniform float time;
          uniform float size;

          varying float vLife;
          varying float vBehavior;
          varying float vInfluence;
          varying vec3 vVelocity;

          void main() {
            vLife = life;
            vBehavior = behavior;
            vInfluence = influence;
            vVelocity = velocity;

            // Dynamic size based on behavior and influence
            float particleSize = size * (0.5 + influence * 0.5);

            // Leaders are bigger, mavericks shimmer
            if (behavior < 0.25) { // leader
              particleSize *= 1.5;
            } else if (behavior < 0.5) { // maverick
              particleSize *= (1.0 + sin(time * 10.0 + position.x) * 0.2);
            }

            // Safe distance calculation to prevent division by zero
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            float distance = max(1.0, length(mvPosition));
            gl_PointSize = particleSize * (300.0 / distance);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform float time;

          varying float vLife;
          varying float vBehavior;
          varying float vInfluence;
          varying vec3 vVelocity;

          void main() {
            // Circular particles
            float distance = length(gl_PointCoord - vec2(0.5));
            if (distance > 0.5) discard;

            // Behavior-based colors
            vec3 color;
            if (vBehavior < 0.25) { // leader - bright gold
              color = mix(vec3(1.0, 0.8, 0.2), vec3(1.0, 1.0, 0.5), vInfluence);
            } else if (vBehavior < 0.5) { // maverick - electric blue
              color = mix(vec3(0.2, 0.5, 1.0), vec3(0.8, 0.9, 1.0), sin(time * 15.0) * 0.5 + 0.5);
            } else if (vBehavior < 0.75) { // follower - soft white
              color = mix(vec3(0.7, 0.8, 1.0), vec3(1.0, 1.0, 1.0), vInfluence);
            } else { // explorer - green
              color = mix(vec3(0.2, 1.0, 0.4), vec3(0.6, 1.0, 0.8), vLife);
            }

            // Speed-based intensity
            float speed = length(vVelocity);
            float intensity = 0.3 + speed * 2.0;

            // Life-based alpha
            float alpha = smoothstep(0.0, 0.1, vLife) * smoothstep(1.0, 0.8, vLife);
            alpha *= intensity;

            // Soft edges
            alpha *= 1.0 - smoothstep(0.3, 0.5, distance);

            gl_FragColor = vec4(color, alpha);
          }
        `,
        uniforms: {
          time: { value: 0 },
          size: { value: 3 },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
    } catch (error) {
      console.warn('Failed to create SwarmSystem shader, using fallback:', error);
      // Create a simple fallback ShaderMaterial instead of PointsMaterial
      this.material = new THREE.ShaderMaterial({
        vertexShader: `
          void main() {
            gl_PointSize = 3.0;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          void main() {
            gl_FragColor = vec4(0.2, 0.4, 1.0, 0.6);
          }
        `,
        uniforms: {
          time: { value: 0 },
          size: { value: 3 },
        },
        transparent: true,
      });
    }
  }

  // Spatial hashing for efficient neighbor finding
  private updateSpatialGrid(): void {
    this.spatialGrid.clear();

    for (const particle of this.particles) {
      const gridX = Math.floor(particle.position.x / this.gridSize);
      const gridY = Math.floor(particle.position.y / this.gridSize);
      const gridZ = Math.floor(particle.position.z / this.gridSize);
      const key = `${gridX},${gridY},${gridZ}`;

      if (!this.spatialGrid.has(key)) {
        this.spatialGrid.set(key, []);
      }
      this.spatialGrid.get(key)!.push(particle);
    }
  }

  private getNeighbors(particle: SwarmParticle, radius: number): SwarmParticle[] {
    const neighbors: SwarmParticle[] = [];
    const gridX = Math.floor(particle.position.x / this.gridSize);
    const gridY = Math.floor(particle.position.y / this.gridSize);
    const gridZ = Math.floor(particle.position.z / this.gridSize);

    // Check surrounding grid cells
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          const key = `${gridX + dx},${gridY + dy},${gridZ + dz}`;
          const cellParticles = this.spatialGrid.get(key);

          if (cellParticles) {
            for (const neighbor of cellParticles) {
              if (neighbor !== particle) {
                const distance = particle.position.distanceTo(neighbor.position);
                if (distance < radius) {
                  neighbors.push(neighbor);
                }
              }
            }
          }
        }
      }
    }

    return neighbors;
  }

  // Bio-inspired flocking behaviors
  private separate(particle: SwarmParticle): THREE.Vector3 {
    const steer = this.tempVector1.set(0, 0, 0);
    const neighbors = this.getNeighbors(particle, this.config.separationDistance);

    if (neighbors.length === 0) return steer;

    for (const neighbor of neighbors) {
      const diff = this.tempVector2.subVectors(particle.position, neighbor.position);
      const distance = diff.length();
      if (distance > 0) {
        diff.normalize().divideScalar(distance); // Weight by distance
        steer.add(diff);
      }
    }

    if (steer.length() > 0) {
      steer.normalize().multiplyScalar(this.config.maxSpeed);
      steer.sub(particle.velocity);
      steer.clampLength(0, this.config.maxForce);
    }

    return steer;
  }

  private align(particle: SwarmParticle): THREE.Vector3 {
    const steer = this.tempVector1.set(0, 0, 0);
    const neighbors = this.getNeighbors(particle, this.config.alignmentDistance);

    if (neighbors.length === 0) return steer;

    for (const neighbor of neighbors) {
      steer.add(neighbor.velocity);
    }

    steer.divideScalar(neighbors.length);
    steer.normalize().multiplyScalar(this.config.maxSpeed);
    steer.sub(particle.velocity);
    steer.clampLength(0, this.config.maxForce);

    return steer;
  }

  private cohesion(particle: SwarmParticle): THREE.Vector3 {
    const steer = this.tempVector1.set(0, 0, 0);
    const neighbors = this.getNeighbors(particle, this.config.cohesionDistance);

    if (neighbors.length === 0) return steer;

    for (const neighbor of neighbors) {
      steer.add(neighbor.position);
    }

    steer.divideScalar(neighbors.length);
    steer.sub(particle.position);
    steer.normalize().multiplyScalar(this.config.maxSpeed);
    steer.sub(particle.velocity);
    steer.clampLength(0, this.config.maxForce);

    return steer;
  }

  private wander(particle: SwarmParticle): THREE.Vector3 {
    const wanderForce = this.tempVector1.set(
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.1
    );

    // Behavior-specific wandering
    switch (particle.behavior) {
      case 'maverick':
        wanderForce.multiplyScalar(3.0); // More chaotic
        break;
      case 'explorer':
        wanderForce.multiplyScalar(2.0); // More adventurous
        break;
      case 'leader':
        wanderForce.multiplyScalar(0.5); // More stable
        break;
    }

    return wanderForce;
  }

  public update(deltaTime: number): void {
    // Update spatial grid for efficient neighbor finding
    this.updateSpatialGrid();

    // Update particles
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      if (!particle) continue;

      // Reset acceleration
      particle.acceleration.set(0, 0, 0);

      // Apply flocking forces
      const separation = this.separate(particle);
      const alignment = this.align(particle);
      const cohesion = this.cohesion(particle);
      const wander = this.wander(particle);

      // Weight forces based on behavior
      const weights = this.config.behaviorWeights;
      separation.multiplyScalar(weights.separation);
      alignment.multiplyScalar(weights.alignment);
      cohesion.multiplyScalar(weights.cohesion);
      wander.multiplyScalar(weights.wander);

      // Behavior-specific modifications
      if (particle.behavior === 'leader') {
        wander.multiplyScalar(2.0); // Leaders explore more
        cohesion.multiplyScalar(0.5); // But don't follow as much
      } else if (particle.behavior === 'maverick') {
        separation.multiplyScalar(2.0); // Mavericks avoid crowds
        alignment.multiplyScalar(0.3); // And don't conform
      }

      // Apply forces
      particle.acceleration.add(separation);
      particle.acceleration.add(alignment);
      particle.acceleration.add(cohesion);
      particle.acceleration.add(wander);

      // Update physics
      particle.velocity.add(particle.acceleration.clone().multiplyScalar(deltaTime));
      particle.velocity.clampLength(0, this.config.maxSpeed);
      particle.position.add(particle.velocity.clone().multiplyScalar(deltaTime));

      // Update life
      particle.life += deltaTime * 0.1;
      if (particle.life > particle.maxLife) {
        particle.life = 0;
        particle.behavior = this.assignBehavior();
        particle.energy = 0.5 + Math.random() * 0.5;
      }

      // Boundary wrapping
      const boundary = 25;
      if (Math.abs(particle.position.x) > boundary) particle.position.x *= -0.8;
      if (Math.abs(particle.position.y) > boundary) particle.position.y *= -0.8;
      if (Math.abs(particle.position.z) > boundary) particle.position.z *= -0.8;
    }

    // Update geometry attributes
    this.updateGeometry();
  }

  private updateGeometry(): void {
    const positionAttr = this.geometry.attributes['position'];
    const velocityAttr = this.geometry.attributes['velocity'];
    const lifeAttr = this.geometry.attributes['life'];
    const behaviorAttr = this.geometry.attributes['behavior'];
    const influenceAttr = this.geometry.attributes['influence'];

    if (!positionAttr || !velocityAttr || !lifeAttr || !behaviorAttr || !influenceAttr) return;

    const positions = positionAttr.array as Float32Array;
    const velocities = velocityAttr.array as Float32Array;
    const lives = lifeAttr.array as Float32Array;
    const behaviors = behaviorAttr.array as Float32Array;
    const influences = influenceAttr.array as Float32Array;

    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      if (!particle) continue;
      const i3 = i * 3;

      positions[i3] = particle.position.x;
      positions[i3 + 1] = particle.position.y;
      positions[i3 + 2] = particle.position.z;

      velocities[i3] = particle.velocity.x;
      velocities[i3 + 1] = particle.velocity.y;
      velocities[i3 + 2] = particle.velocity.z;

      lives[i] = particle.life / particle.maxLife;
      behaviors[i] = this.getBehaviorValue(particle.behavior);
      influences[i] = particle.influence;
    }

    positionAttr.needsUpdate = true;
    velocityAttr.needsUpdate = true;
    lifeAttr.needsUpdate = true;
    behaviorAttr.needsUpdate = true;
    influenceAttr.needsUpdate = true;
  }

  private getBehaviorValue(behavior: SwarmParticle['behavior']): number {
    switch (behavior) {
      case 'leader':
        return 0.1;
      case 'maverick':
        return 0.3;
      case 'follower':
        return 0.6;
      case 'explorer':
        return 0.9;
    }
  }

  public getMesh(): THREE.Points {
    return this.mesh;
  }

  public setTime(time: number): void {
    if (this.material && this.material.uniforms && this.material.uniforms['time']) {
      this.material.uniforms['time'].value = time;
    }
  }

  public dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}
