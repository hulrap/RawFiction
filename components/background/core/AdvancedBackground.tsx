'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PathTracingEngine } from '../engines/PathTracingEngine';
import { WebGPURenderer } from '../engines/WebGPURenderer';
import type {
  PathTracingConfig,
  WebGPUConfig,
  MousePosition,
  PerformanceStats,
} from '../types/GraphicsTypes';

interface AdvancedBackgroundProps {
  enableWebGPU?: boolean;
  enablePathTracing?: boolean;
  quality?: 'ultra' | 'high' | 'medium' | 'low';
  enableMouseInteraction?: boolean;
  className?: string;
}

export const AdvancedBackground: React.FC<AdvancedBackgroundProps> = ({
  enableWebGPU = true,
  enablePathTracing = true,
  quality = 'high',
  enableMouseInteraction = true,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Core Three.js components
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();

  // Advanced rendering engines
  const pathTracerRef = useRef<PathTracingEngine>();
  const webgpuRendererRef = useRef<WebGPURenderer>();

  // State management
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentEngine, setCurrentEngine] = useState<'webgl' | 'webgpu' | 'pathtracing'>('webgl');
  const [performance] = useState<PerformanceStats>({
    fps: 60,
    frameTime: 16.67,
    drawCalls: 0,
    triangles: 0,
    gpuMemory: 0,
    cpuTime: 0,
  });

  // Mouse interaction
  const mouseRef = useRef<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
    velocity: new THREE.Vector2(),
    lastPosition: new THREE.Vector2(),
  });

  // Graphics configuration (for future use)
  // const graphicsConfig: GraphicsConfig = {
  //   enableWebGPU,
  //   enablePathTracing,
  //   enableAdvancedParticles: true,
  //   enableMouseReactivity: enableMouseInteraction,
  //   quality,
  //   targetFPS: quality === 'ultra' ? 120 : quality === 'high' ? 60 : 30,
  // };

  const pathTracingConfig: PathTracingConfig = {
    bounces: quality === 'ultra' ? 10 : quality === 'high' ? 8 : 5,
    samples: quality === 'ultra' ? 1000 : quality === 'high' ? 500 : 200,
    denoise: true,
    enableGI: true,
    enableCaustics: quality === 'ultra' || quality === 'high',
    enableVolumetrics: quality === 'ultra',
  };

  const webgpuConfig: WebGPUConfig = {
    preferredFormat: 'bgra8unorm' as GPUTextureFormat,
    powerPreference: 'high-performance' as GPUPowerPreference,
    enableValidation: false,
    maxBufferSize: 256 * 1024 * 1024, // 256MB
  };

  // Initialize the advanced graphics system
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const initializeGraphics = async () => {
      try {
        // Setup basic Three.js scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        );
        const renderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current!,
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Store references
        sceneRef.current = scene;
        cameraRef.current = camera;
        rendererRef.current = renderer;

        // Setup camera position
        camera.position.set(0, 0, 10);
        camera.lookAt(0, 0, 0);

        // Create immersive 3D environment
        await createImmersiveEnvironment(scene);

        // Initialize advanced rendering engines
        let engineInitialized = false;

        // Try WebGPU first (most advanced)
        if (enableWebGPU) {
          const webgpuRenderer = new WebGPURenderer(canvasRef.current!, webgpuConfig);
          const webgpuSupported = await webgpuRenderer.initialize();

          if (webgpuSupported) {
            webgpuRendererRef.current = webgpuRenderer;
            setCurrentEngine('webgpu');
            engineInitialized = true;
            // WebGPU Engine active - Next-generation graphics enabled
          }
        }

        // Try Path Tracing (ultra-realistic)
        if (!engineInitialized && enablePathTracing) {
          try {
            const pathTracer = new PathTracingEngine(renderer, scene, camera, pathTracingConfig);
            await pathTracer.initialize();
            pathTracerRef.current = pathTracer;
            setCurrentEngine('pathtracing');
            engineInitialized = true;
            // Path Tracing Engine active - Ultra-realistic rendering enabled
          } catch (error) {
            // Path tracing initialization failed, falling back to WebGL
          }
        }

        // Fallback to enhanced WebGL
        if (!engineInitialized) {
          setCurrentEngine('webgl');
          // Enhanced WebGL active - High-performance rendering enabled
        }

        // Start render loop
        startRenderLoop();
        setIsInitialized(true);
      } catch (error) {
        // Graphics initialization failed
      }
    };

    initializeGraphics();

    // Cleanup
    return () => {
      pathTracerRef.current?.dispose();
      webgpuRendererRef.current?.dispose();
      rendererRef.current?.dispose();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Create immersive 3D environment
  const createImmersiveEnvironment = async (scene: THREE.Scene) => {
    // Add atmospheric background
    const backgroundGeometry = new THREE.SphereGeometry(100, 64, 32);
    const backgroundMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2() },
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

        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          vec3 color = vec3(0.0, 0.05, 0.15);

          // Add stellar atmosphere
          float stars = sin(vPosition.x * 100.0) * sin(vPosition.y * 100.0) * sin(vPosition.z * 100.0);
          stars = pow(max(0.0, stars), 20.0) * 0.5;

          // Add nebula-like clouds
          float nebula = sin(vPosition.x * 2.0 + time * 0.1) * cos(vPosition.y * 1.5 + time * 0.08);
          nebula = pow(max(0.0, nebula), 3.0) * 0.2;

          color += vec3(stars);
          color += vec3(nebula * 0.3, nebula * 0.1, nebula * 0.5);

          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.BackSide,
    });

    const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    scene.add(backgroundMesh);

    // Add volumetric lighting
    const volumetricLight = new THREE.DirectionalLight(0x4488ff, 0.8);
    volumetricLight.position.set(10, 10, 5);
    volumetricLight.castShadow = true;
    volumetricLight.shadow.mapSize.width = 2048;
    volumetricLight.shadow.mapSize.height = 2048;
    scene.add(volumetricLight);

    // Add ambient lighting
    const ambientLight = new THREE.AmbientLight(0x2244aa, 0.3);
    scene.add(ambientLight);

    // Add some floating objects for depth
    for (let i = 0; i < 20; i++) {
      const geometry = new THREE.IcosahedronGeometry(0.5, 1);
      const material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6),
        metalness: 0.8,
        roughness: 0.2,
        transmission: 0.3,
        transparent: true,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30
      );
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
    }
  };

  // Advanced render loop
  const startRenderLoop = () => {
    const clock = new THREE.Clock();

    const render = () => {
      clock.getDelta(); // Update clock
      const elapsedTime = clock.getElapsedTime();

      if (!sceneRef.current || !cameraRef.current) return;

      // Update materials with time
      sceneRef.current.traverse(object => {
        if (object instanceof THREE.Mesh && object.material instanceof THREE.ShaderMaterial) {
          if (object.material.uniforms['time']) {
            object.material.uniforms['time'].value = elapsedTime;
          }
        }
      });

      // Render with appropriate engine
      switch (currentEngine) {
        case 'webgpu':
          webgpuRendererRef.current?.computeParticles(elapsedTime);
          rendererRef.current?.render(sceneRef.current, cameraRef.current);
          break;

        case 'pathtracing':
          pathTracerRef.current?.render();
          break;

        default:
          rendererRef.current?.render(sceneRef.current, cameraRef.current);
          break;
      }

      requestAnimationFrame(render);
    };

    render();
  };

  // Mouse interaction handler
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!enableMouseInteraction || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const normalizedX = (x / rect.width) * 2 - 1;
    const normalizedY = -(y / rect.height) * 2 + 1;

    // Calculate velocity
    const velocity = new THREE.Vector2(
      normalizedX - mouseRef.current.normalizedX,
      normalizedY - mouseRef.current.normalizedY
    );

    mouseRef.current = {
      x,
      y,
      normalizedX,
      normalizedY,
      velocity,
      lastPosition: new THREE.Vector2(mouseRef.current.normalizedX, mouseRef.current.normalizedY),
    };

    // Update engines with mouse interaction
    pathTracerRef.current?.updateMouseInteraction(mouseRef.current);
    webgpuRendererRef.current?.updateMouseInteraction(mouseRef.current);
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;

      const width = window.innerWidth;
      const height = window.innerHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 -z-10 ${className}`}
      onMouseMove={handleMouseMove}
      style={{
        background: 'linear-gradient(135deg, #000814 0%, #001d3d 50%, #003566 100%)',
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'translateZ(0)',
        }}
      />

      {/* Performance HUD (development only) */}
      {process.env.NODE_ENV === 'development' && isInitialized && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded font-mono text-sm">
          <div>Engine: {currentEngine.toUpperCase()}</div>
          <div>FPS: {performance.fps}</div>
          <div>Quality: {quality.toUpperCase()}</div>
          {currentEngine === 'pathtracing' && (
            <div>Samples: {pathTracerRef.current?.getPerformanceStats().samples || 0}</div>
          )}
        </div>
      )}
    </div>
  );
};
