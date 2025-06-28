import * as THREE from 'three';
import { WebGLPathTracer } from 'three-gpu-pathtracer';
import type { PathTracingConfig, MousePosition } from '../types/GraphicsTypes';

export class PathTracingEngine {
  private pathTracer: WebGLPathTracer | null = null;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private config: PathTracingConfig;
  private isInitialized = false;
  private animationId: number | null = null;

  // Performance monitoring
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;

  constructor(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    config: PathTracingConfig
  ) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.config = config;
  }

  async initialize(): Promise<void> {
    // Setup renderer for path tracing
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Create path tracer
    this.pathTracer = new WebGLPathTracer(this.renderer);

    // Configure path tracer settings
    this.pathTracer.bounces = this.config.bounces;
    this.pathTracer.renderScale = this.getQualityScale();
    this.pathTracer.tiles.set(3, 3); // Tiled rendering for better performance

    // Enable advanced features
    if (this.config.enableGI) {
      this.pathTracer.filterGlossyFactor = 0.25; // Reduce fireflies
    }

    // Setup scene with path tracer
    this.pathTracer.setScene(this.scene, this.camera);

    this.isInitialized = true;
    // Path Tracing Engine initialized with ultra-realistic rendering
  }

  private getQualityScale(): number {
    // Dynamic quality scaling based on performance
    const devicePixelRatio = window.devicePixelRatio || 1;
    return Math.min(devicePixelRatio, 2.0);
  }

  updateMouseInteraction(mouse: MousePosition): void {
    if (!this.pathTracer || !this.isInitialized) return;

    // Reset path tracer when mouse moves significantly
    const velocity = mouse.velocity.length();
    if (velocity > 0.01) {
      this.pathTracer.reset();
    }
  }

  addVolumetricObject(geometry: THREE.BufferGeometry, material: THREE.Material): THREE.Mesh {
    // Create volumetric object for path tracing
    const mesh = new THREE.Mesh(geometry, material);

    // Enable volumetric properties if supported
    if (this.config.enableVolumetrics && material instanceof THREE.MeshPhysicalMaterial) {
      // Configure volumetric material properties
      material.transparent = true;
      material.opacity = 0.3;
    }

    this.scene.add(mesh);

    // Update path tracer scene
    if (this.pathTracer) {
      this.pathTracer.setScene(this.scene, this.camera);
    }

    return mesh;
  }

  addReactiveObject(
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    reactivity: number = 1.0
  ): THREE.Mesh {
    const mesh = new THREE.Mesh(geometry, material);

    // Store reactivity data
    mesh.userData['reactivity'] = reactivity;
    mesh.userData['isReactive'] = true;

    this.scene.add(mesh);

    // Update path tracer
    if (this.pathTracer) {
      this.pathTracer.setScene(this.scene, this.camera);
    }

    return mesh;
  }

  addAreaLight(
    width: number = 2,
    height: number = 2,
    color: THREE.Color = new THREE.Color(0xffffff),
    intensity: number = 1.0,
    position: THREE.Vector3 = new THREE.Vector3(0, 5, 0)
  ): THREE.RectAreaLight {
    const light = new THREE.RectAreaLight(color, intensity, width, height);
    light.position.copy(position);
    light.lookAt(0, 0, 0);

    this.scene.add(light);

    // Update path tracer lighting
    if (this.pathTracer) {
      this.pathTracer.updateLights();
    }

    return light;
  }

  createEmissiveMaterial(
    color: THREE.Color = new THREE.Color(0x0088ff),
    intensity: number = 2.0
  ): THREE.MeshPhysicalMaterial {
    return new THREE.MeshPhysicalMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: intensity,
      roughness: 0.1,
      metalness: 0.0,
      transparent: true,
      opacity: 0.8,
    });
  }

  createGlassMaterial(
    color: THREE.Color = new THREE.Color(0x88ccff),
    roughness: number = 0.0
  ): THREE.MeshPhysicalMaterial {
    return new THREE.MeshPhysicalMaterial({
      color: color,
      metalness: 0.0,
      roughness: roughness,
      transmission: 1.0,
      transparent: true,
      thickness: 0.5,
      ior: 1.5,
    });
  }

  createHolographicMaterial(
    baseColor: THREE.Color = new THREE.Color(0x00ffaa)
  ): THREE.MeshPhysicalMaterial {
    return new THREE.MeshPhysicalMaterial({
      color: baseColor,
      emissive: baseColor,
      emissiveIntensity: 0.3,
      metalness: 0.0,
      roughness: 0.1,
      transmission: 0.9,
      transparent: true,
      opacity: 0.4,
      thickness: 0.1,
      ior: 1.2,
      iridescence: 1.0,
      iridescenceIOR: 2.0,
    });
  }

  updateCamera(): void {
    if (this.pathTracer && this.isInitialized) {
      this.pathTracer.updateCamera();
    }
  }

  updateMaterials(): void {
    if (this.pathTracer && this.isInitialized) {
      this.pathTracer.updateMaterials();
    }
  }

  render(): void {
    if (!this.pathTracer || !this.isInitialized) return;

    // Performance monitoring
    const currentTime = performance.now();
    this.frameCount++;

    if (currentTime - this.lastTime >= 1000) {
      this.fps = (this.frameCount * 1000) / (currentTime - this.lastTime);
      this.frameCount = 0;
      this.lastTime = currentTime;
    }

    // Render with path tracing
    this.pathTracer.renderSample();
  }

  startRenderLoop(): void {
    if (this.animationId) return;

    const renderLoop = () => {
      this.render();
      this.animationId = requestAnimationFrame(renderLoop);
    };

    renderLoop();
    // Path tracing render loop started
  }

  stopRenderLoop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
      // Path tracing render loop stopped
    }
  }

  reset(): void {
    if (this.pathTracer) {
      this.pathTracer.reset();
    }
  }

  getPerformanceStats() {
    return {
      fps: Math.round(this.fps),
      samples: this.pathTracer?.samples || 0,
      bounces: this.config.bounces,
      isConverged: (this.pathTracer?.samples || 0) > 100,
    };
  }

  updateConfig(newConfig: Partial<PathTracingConfig>): void {
    this.config = { ...this.config, ...newConfig };

    if (this.pathTracer) {
      if (newConfig.bounces !== undefined) {
        this.pathTracer.bounces = newConfig.bounces;
      }

      this.pathTracer.reset();
    }
  }

  dispose(): void {
    this.stopRenderLoop();

    if (this.pathTracer) {
      this.pathTracer.dispose();
      this.pathTracer = null;
    }

    this.isInitialized = false;
    // Path Tracing Engine disposed
  }
}
