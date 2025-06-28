import * as THREE from 'three';
import type { WebGPUConfig, MousePosition, PerformanceStats } from '../types/GraphicsTypes';

export class WebGPURenderer {
  private device: GPUDevice | null = null;
  private context: GPUCanvasContext | null = null;
  private adapter: GPUAdapter | null = null;
  private canvas: HTMLCanvasElement;
  private config: WebGPUConfig;
  private isInitialized = false;

  // Compute shaders for advanced effects
  private particleComputePipeline: GPUComputePipeline | null = null;

  // Buffers
  private particleBuffer: GPUBuffer | null = null;
  private uniformBuffer: GPUBuffer | null = null;
  private mouseBuffer: GPUBuffer | null = null;

  // Performance monitoring
  private frameCount = 0;
  private lastTime = performance.now();
  private stats: PerformanceStats = {
    fps: 60,
    frameTime: 16.67,
    drawCalls: 0,
    triangles: 0,
    gpuMemory: 0,
    cpuTime: 0,
  };

  constructor(canvas: HTMLCanvasElement, config: WebGPUConfig) {
    this.canvas = canvas;
    this.config = config;
  }

  async initialize(): Promise<boolean> {
    try {
      // Check WebGPU support
      if (!navigator.gpu) {
        // WebGPU not supported, falling back to WebGL
        return false;
      }

      // Request adapter
      this.adapter = await navigator.gpu.requestAdapter({
        powerPreference: this.config.powerPreference,
      });

      if (!this.adapter) {
        // WebGPU adapter not available
        return false;
      }

      // Request device
      this.device = await this.adapter.requestDevice({
        requiredFeatures: [],
        requiredLimits: {
          maxBufferSize: this.config.maxBufferSize,
        },
      });

      // Setup canvas context
      this.context = this.canvas.getContext('webgpu');
      if (!this.context) {
        throw new Error('Failed to get WebGPU context');
      }

      // Configure canvas
      this.context.configure({
        device: this.device,
        format: this.config.preferredFormat,
        alphaMode: 'premultiplied',
      });

      // Initialize compute pipelines
      await this.initializeComputePipelines();

      // Initialize buffers
      this.initializeBuffers();

      this.isInitialized = true;
      // WebGPU Renderer initialized successfully
      // GPU: ${this.adapter.info?.description || 'Unknown'}
      // Format: ${this.config.preferredFormat}

      return true;
    } catch (error) {
      // WebGPU initialization failed
      return false;
    }
  }

  private async initializeComputePipelines(): Promise<void> {
    if (!this.device) return;

    // Advanced particle compute shader
    const particleComputeShader = `
      @group(0) @binding(0) var<storage, read_write> particles: array<vec4<f32>>;
      @group(0) @binding(1) var<uniform> uniforms: vec4<f32>;
      @group(0) @binding(2) var<uniform> mouse: vec4<f32>;

      @compute @workgroup_size(64)
      fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
        let index = global_id.x;
        if (index >= arrayLength(&particles)) {
          return;
        }

        let time = uniforms.x;
        let mousePos = mouse.xy;
        let mouseVel = mouse.zw;
        let intensity = uniforms.w;

        var particle = particles[index];
        let pos = particle.xy;
        let vel = particle.zw;

        // Mouse interaction force
        let toMouse = mousePos - pos;
        let dist = length(toMouse);
        let force = vec2<f32>(0.0);

        if (dist > 0.0 && dist < 0.3) {
          let strength = (0.3 - dist) / 0.3;
          force = normalize(toMouse) * strength * intensity * 0.02;
          force += mouseVel * 0.01;
        }

        // Quantum field fluctuations
        let noise = vec2<f32>(
          sin(time * 3.0 + pos.x * 10.0),
          cos(time * 2.0 + pos.y * 12.0)
        ) * 0.001;

        // Update velocity and position
        let newVel = vel * 0.98 + force + noise;
        newVel = clamp(newVel, vec2<f32>(-0.05), vec2<f32>(0.05));
        let newPos = pos + newVel;

        // Boundary wrapping
        if (newPos.x < -1.0) { newPos.x = 1.0; }
        if (newPos.x > 1.0) { newPos.x = -1.0; }
        if (newPos.y < -1.0) { newPos.y = 1.0; }
        if (newPos.y > 1.0) { newPos.y = -1.0; }

        particles[index] = vec4<f32>(newPos, newVel);
      }
    `;

    // Create compute pipeline
    this.particleComputePipeline = this.device.createComputePipeline({
      layout: 'auto',
      compute: {
        module: this.device.createShaderModule({ code: particleComputeShader }),
        entryPoint: 'main',
      },
    });
  }

  private initializeBuffers(): void {
    if (!this.device) return;

    // Particle buffer (10,000 particles)
    const particleCount = 10000;
    const particleData = new Float32Array(particleCount * 4);

    // Initialize particles with random positions
    for (let i = 0; i < particleCount; i++) {
      const offset = i * 4;
      particleData[offset] = (Math.random() - 0.5) * 2; // x
      particleData[offset + 1] = (Math.random() - 0.5) * 2; // y
      particleData[offset + 2] = 0; // vx
      particleData[offset + 3] = 0; // vy
    }

    this.particleBuffer = this.device.createBuffer({
      size: particleData.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });

    new Float32Array(this.particleBuffer.getMappedRange()).set(particleData);
    this.particleBuffer.unmap();

    // Uniform buffer
    this.uniformBuffer = this.device.createBuffer({
      size: 16, // 4 floats
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    // Mouse buffer
    this.mouseBuffer = this.device.createBuffer({
      size: 16, // 4 floats
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
  }

  updateMouseInteraction(mouse: MousePosition): void {
    if (!this.device || !this.mouseBuffer) return;

    const mouseData = new Float32Array([
      mouse.normalizedX,
      mouse.normalizedY,
      mouse.velocity.x,
      mouse.velocity.y,
    ]);

    this.device.queue.writeBuffer(this.mouseBuffer, 0, mouseData);
  }

  computeParticles(time: number, intensity: number = 1.0): void {
    if (!this.device || !this.particleComputePipeline || !this.uniformBuffer) return;

    // Update uniforms
    const uniformData = new Float32Array([time, 0, 0, intensity]);
    this.device.queue.writeBuffer(this.uniformBuffer, 0, uniformData);

    // Create command encoder
    const commandEncoder = this.device.createCommandEncoder();
    const computePass = commandEncoder.beginComputePass();

    // Dispatch compute shader
    computePass.setPipeline(this.particleComputePipeline);
    computePass.dispatchWorkgroups(Math.ceil(10000 / 64));
    computePass.end();

    // Submit commands
    this.device.queue.submit([commandEncoder.finish()]);
  }

  createAdvancedMaterial(): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2() },
        mouse: { value: new THREE.Vector2() },
        particleData: { value: null },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        uniform vec2 mouse;

        varying vec2 vUv;
        varying vec3 vPosition;

        // Advanced noise functions
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

          vec3 i = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);

          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);

          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;

          i = mod289(i);
          vec4 p = permute(permute(permute(
                   i.z + vec4(0.0, i1.z, i2.z, 1.0))
                 + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                 + i.x + vec4(0.0, i1.x, i2.x, 1.0));

          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;

          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);

          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);

          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);

          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));

          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);

          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;

          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }

        void main() {
          vec2 uv = vUv;
          vec3 pos = vPosition;

          // Create quantum field effect
          float noise1 = snoise(pos * 2.0 + time * 0.5);
          float noise2 = snoise(pos * 4.0 + time * 0.3);
          float noise3 = snoise(pos * 8.0 + time * 0.1);

          float combined = noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2;

          // Mouse interaction
          vec2 mousePos = mouse;
          float dist = distance(uv, mousePos);
          float mouseEffect = exp(-dist * 8.0) * 0.5;

          // Color based on quantum field
          vec3 color1 = vec3(0.0, 0.3, 0.8); // Deep blue
          vec3 color2 = vec3(0.0, 0.8, 0.4); // Cyan-green
          vec3 color3 = vec3(0.5, 0.0, 0.8); // Purple

          vec3 finalColor = mix(color1, color2, combined + 0.5);
          finalColor = mix(finalColor, color3, mouseEffect);

          // Add volumetric glow
          float glow = exp(-dist * 3.0) * (sin(time * 2.0) * 0.5 + 0.5);
          finalColor += vec3(glow * 0.3);

          gl_FragColor = vec4(finalColor, 0.8 + mouseEffect * 0.2);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
  }

  getPerformanceStats(): PerformanceStats {
    const currentTime = performance.now();
    this.frameCount++;

    if (currentTime - this.lastTime >= 1000) {
      this.stats.fps = (this.frameCount * 1000) / (currentTime - this.lastTime);
      this.stats.frameTime = 1000 / this.stats.fps;
      this.frameCount = 0;
      this.lastTime = currentTime;
    }

    return { ...this.stats };
  }

  isSupported(): boolean {
    return !!navigator.gpu && this.isInitialized;
  }

  dispose(): void {
    // Clean up WebGPU resources
    this.particleBuffer?.destroy();
    this.uniformBuffer?.destroy();
    this.mouseBuffer?.destroy();

    this.isInitialized = false;
    // WebGPU Renderer disposed
  }
}
