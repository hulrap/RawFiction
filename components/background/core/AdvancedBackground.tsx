'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SmartSwarmSystem } from '../systems/SmartSwarmSystem';
import { AdvancedParticleSystem } from '../systems/ParticleSystem';
import type {
  RawFictionEngineConfig,
  MousePosition,
  PerformanceStats,
} from '../types/GraphicsTypes';

interface AdvancedBackgroundProps {
  enableWebGPU?: boolean;
  enablePathTracing?: boolean;
  enableSmartSwarm?: boolean;
  enableNeuralParticles?: boolean;
  quality?: 'ultra' | 'high' | 'medium' | 'low';
  enableMouseInteraction?: boolean;
  className?: string;
}

export const AdvancedBackground: React.FC<AdvancedBackgroundProps> = ({
  enableWebGPU = false,
  enablePathTracing = false,
  enableSmartSwarm = true,
  enableNeuralParticles = true,
  quality = 'medium',
  enableMouseInteraction = true,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Core Three.js components
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();

  // Our bio-inspired systems
  const smartSwarmRef = useRef<SmartSwarmSystem>();
  const particleSystemRef = useRef<AdvancedParticleSystem>();

  // State management
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentEngine, setCurrentEngine] = useState<'webgl' | 'bio-inspired' | 'fallback'>(
    'bio-inspired'
  );
  const [hasError, setHasError] = useState(false);

  // Mouse interaction
  const mouseRef = useRef<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
    velocity: new THREE.Vector2(),
    lastPosition: new THREE.Vector2(),
  });

  // Performance monitoring
  const performanceRef = useRef<PerformanceStats>({
    fps: 60,
    frameTime: 16.67,
    drawCalls: 0,
    triangles: 0,
    gpuMemory: 0,
    cpuTime: 0,
  });

  // Engine configuration
  const engineConfig: RawFictionEngineConfig = {
    adaptiveQuality: true,
    targetFPS: quality === 'ultra' ? 60 : quality === 'high' ? 45 : 30,
    qualityThreshold: 0.8,
    enableSmartSwarm: enableSmartSwarm,
    enableNeuralParticles: enableNeuralParticles,
    enableQuantumField: quality === 'ultra',
    preferredRenderer: enableWebGPU ? 'webgpu' : 'webgl',
    enablePathTracing: enablePathTracing,
    maxParticles: getMaxParticlesForQuality(quality),
    mouseReactivity: enableMouseInteraction ? 1.0 : 0.0,
    audioReactivity: false,
    gestureControl: false,
  };

  function getMaxParticlesForQuality(qual: string): number {
    switch (qual) {
      case 'ultra':
        return 5000;
      case 'high':
        return 3000;
      case 'medium':
        return 1500;
      case 'low':
        return 800;
      default:
        return 1500;
    }
  }

  // Validate canvas dimensions before any WebGL operations
  const validateCanvasDimensions = (canvas: HTMLCanvasElement): boolean => {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width || window.innerWidth));
    const height = Math.max(1, Math.floor(rect.height || window.innerHeight));

    // Ensure minimum dimensions
    if (width < 1 || height < 1) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Canvas has invalid dimensions:', { width, height });
      }
      return false;
    }

    // Set canvas size explicitly
    canvas.width = width;
    canvas.height = height;
    return true;
  };

  // Initialize the advanced graphics system
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const initializeGraphics = async () => {
      try {
        // Validate canvas dimensions first
        if (!validateCanvasDimensions(canvasRef.current!)) {
          throw new Error('Invalid canvas dimensions');
        }

        // Setup basic Three.js scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        );

        // Enhanced WebGL renderer with comprehensive error handling
        const renderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current!,
          antialias: quality === 'ultra' || quality === 'high',
          alpha: true,
          powerPreference: 'default',
          failIfMajorPerformanceCaveat: false,
          preserveDrawingBuffer: false, // Better performance
          stencil: false, // Disable if not needed
          depth: true,
          logarithmicDepthBuffer: false, // Can cause issues on some devices
        });

        // Global error handling for THREE.js
        const originalConsoleError = console.error;
        const originalConsoleWarn = console.warn;

        console.error = (...args) => {
          const message = args.join(' ');
          if (
            message.includes('THREE.WebGLProgram') ||
            message.includes('Shader Error') ||
            message.includes('WebGL') ||
            message.includes('VALIDATE_STATUS')
          ) {
            // Suppress THREE.js shader errors but log them in development
            if (process.env.NODE_ENV === 'development') {
              originalConsoleWarn('THREE.js Error (suppressed):', ...args);
            }
            return;
          }
          originalConsoleError.apply(console, args);
        };

        console.warn = (...args) => {
          const message = args.join(' ');
          if (
            message.includes('THREE.WebGLProgram') ||
            message.includes('Shader Error') ||
            message.includes('WebGL')
          ) {
            return; // Completely suppress these warnings
          }
          originalConsoleWarn.apply(console, args);
        };

        // Validate renderer creation
        const gl = renderer.getContext();
        if (!gl) {
          throw new Error('WebGL context creation failed');
        }

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === 'ultra' ? 2 : 1.5));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.shadowMap.enabled = quality === 'ultra' || quality === 'high';
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Additional renderer settings for stability
        renderer.sortObjects = false; // Better performance
        renderer.autoClear = true;
        renderer.autoClearColor = true;
        renderer.autoClearDepth = true;
        renderer.autoClearStencil = true;

        // Store references
        sceneRef.current = scene;
        cameraRef.current = camera;
        rendererRef.current = renderer;

        // Setup camera position
        camera.position.set(0, 0, 15);
        camera.lookAt(0, 0, 0);

        // Create atmospheric background with error handling
        createAtmosphericBackground(scene);

        // Initialize bio-inspired systems with comprehensive fallbacks
        let systemsActive = 0;

        if (enableSmartSwarm) {
          try {
            const swarmConfig = {
              maxParticles: Math.floor(engineConfig.maxParticles * 0.6),
              separationDistance: 2.0,
              alignmentDistance: 3.0,
              cohesionDistance: 4.0,
              maxSpeed: 0.08,
              maxForce: 0.02,
            };

            smartSwarmRef.current = new SmartSwarmSystem(swarmConfig);
            scene.add(smartSwarmRef.current.getMesh());
            systemsActive++;
          } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              console.warn('Smart Swarm system failed to initialize:', error);
            }
          }
        }

        if (enableNeuralParticles) {
          try {
            particleSystemRef.current = new AdvancedParticleSystem(scene, camera, engineConfig);
            systemsActive++;
          } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              console.warn('Neural Particle system failed to initialize:', error);
            }
          }
        }

        // Add basic lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        scene.add(directionalLight);

        // Start render loop
        startRenderLoop();
        setCurrentEngine(systemsActive > 0 ? 'bio-inspired' : 'webgl');
        setIsInitialized(true);
        setHasError(false);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Advanced background failed to initialize, using fallback:', error);
        }
        // Create minimal fallback background
        createFallbackBackground();
        setCurrentEngine('fallback');
        setIsInitialized(true);
        setHasError(true);
      }
    };

    initializeGraphics();

    // Cleanup
    return () => {
      try {
        smartSwarmRef.current?.dispose();
        particleSystemRef.current?.dispose();
        rendererRef.current?.dispose();
      } catch (error) {
        // Ignore cleanup errors
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const createAtmosphericBackground = (scene: THREE.Scene) => {
    try {
      // Simple working background instead of complex shader
      const backgroundGeometry = new THREE.PlaneGeometry(200, 200);
      const backgroundMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#001122'),
        transparent: true,
        opacity: 0.8,
      });

      const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
      backgroundMesh.position.z = -50;
      scene.add(backgroundMesh);

      // Add simple animated particles using basic materials
      const particleCount = Math.min(500, getMaxParticlesForQuality(quality));
      const particleGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

        colors[i * 3] = 0.2 + Math.random() * 0.3; // R
        colors[i * 3 + 1] = 0.4 + Math.random() * 0.4; // G
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2; // B
      }

      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const particleMaterial = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
      });

      const particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);

      // Store reference for animation
      if (sceneRef.current) {
        sceneRef.current.userData['simpleParticles'] = particles;
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to create atmospheric background, using solid color:', error);
      }
      // Ultra-simple fallback
      try {
        const fallbackGeometry = new THREE.PlaneGeometry(200, 200);
        const fallbackMaterial = new THREE.MeshBasicMaterial({
          color: 0x001122,
          transparent: true,
          opacity: 0.3,
        });
        const fallbackMesh = new THREE.Mesh(fallbackGeometry, fallbackMaterial);
        fallbackMesh.position.z = -50;
        scene.add(fallbackMesh);
      } catch (fallbackError) {
        // Even fallback failed, continue without background
      }
    }
  };

  // Optimized render loop with error handling
  const startRenderLoop = () => {
    const clock = new THREE.Clock();
    let frameCount = 0;
    let lastPerformanceUpdate = 0;
    let isRenderLoopActive = true;

    const render = () => {
      if (!isRenderLoopActive) return;

      try {
        const deltaTime = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();

        if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

        // Validate canvas dimensions before rendering
        if (canvasRef.current && !validateCanvasDimensions(canvasRef.current)) {
          return; // Skip this frame if canvas is invalid
        }

        // Subtle camera movement
        if (frameCount % 3 === 0) {
          const camera = cameraRef.current;
          const slowTime = elapsedTime * 0.02;
          camera.position.x = Math.sin(slowTime) * 0.5;
          camera.position.y = Math.cos(slowTime * 0.7) * 0.3;
          camera.position.z = 15 + Math.sin(slowTime * 0.3) * 0.8;
          camera.lookAt(0, 0, 0);
        }

        // Update bio-inspired systems with error handling
        if (smartSwarmRef.current) {
          try {
            smartSwarmRef.current.update(deltaTime);
            smartSwarmRef.current.setTime(elapsedTime);
          } catch (error) {
            // Continue without swarm updates
          }
        }

        if (particleSystemRef.current) {
          try {
            const mousePos = enableMouseInteraction
              ? new THREE.Vector2(mouseRef.current.normalizedX, mouseRef.current.normalizedY)
              : undefined;
            particleSystemRef.current.update(deltaTime, mousePos);
          } catch (error) {
            // Continue without particle updates
          }
        }

        // Update simple particle animation
        if (sceneRef.current && sceneRef.current.userData['simpleParticles']) {
          try {
            const particles = sceneRef.current.userData['simpleParticles'];
            particles.rotation.y += 0.001;
            particles.rotation.x += 0.0005;

            // Simple mouse interaction
            if (enableMouseInteraction) {
              const mouseInfluence = 0.0002;
              particles.rotation.y += mouseRef.current.normalizedX * mouseInfluence;
              particles.rotation.x += mouseRef.current.normalizedY * mouseInfluence;
            }
          } catch (error) {
            // Continue without particle animation
          }
        }

        // Update background shader (if any)
        try {
          sceneRef.current.traverse(object => {
            if (object instanceof THREE.Mesh && object.material instanceof THREE.ShaderMaterial) {
              if (object.material.uniforms?.['time']) {
                object.material.uniforms['time'].value = elapsedTime;
              }
            }
          });
        } catch (error) {
          // Continue without shader updates
        }

        // Render with error handling
        try {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Render failed:', error);
          }
          // Continue to next frame
        }

        // Performance monitoring (less frequent)
        frameCount++;
        if (performance.now() - lastPerformanceUpdate > 1000) {
          performanceRef.current.fps = frameCount;
          performanceRef.current.frameTime = 1000 / frameCount;
          frameCount = 0;
          lastPerformanceUpdate = performance.now();
        }

        requestAnimationFrame(render);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Render loop error:', error);
        }
        // Continue render loop even if this frame failed
        requestAnimationFrame(render);
      }
    };

    requestAnimationFrame(render);

    // Return cleanup function
    return () => {
      isRenderLoopActive = false;
    };
  };

  // Optimized mouse interaction handler
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!enableMouseInteraction || !containerRef.current) return;

    try {
      const rect = containerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const normalizedX = (x / rect.width) * 2 - 1;
      const normalizedY = -(y / rect.height) * 2 + 1;

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
    } catch (error) {
      // Ignore mouse handling errors
    }
  };

  // Handle window resize
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        try {
          if (!cameraRef.current || !rendererRef.current || !canvasRef.current) return;

          // Validate new dimensions
          if (!validateCanvasDimensions(canvasRef.current)) return;

          const width = window.innerWidth;
          const height = window.innerHeight;

          cameraRef.current.aspect = width / height;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(width, height);
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Resize handling failed:', error);
          }
        }
      }, 200);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Fallback background when everything fails
  const createFallbackBackground = () => {
    if (!containerRef.current) return;

    try {
      const fallbackDiv = document.createElement('div');
      fallbackDiv.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #000814 0%, #001d3d 50%, #003566 100%);
        z-index: -1;
      `;
      containerRef.current.appendChild(fallbackDiv);
    } catch (error) {
      // Ignore fallback creation errors
    }
  };

  return (
    <div
      ref={containerRef}
      className={`bio-background-container ${className}`}
      onMouseMove={handleMouseMove}
      style={{
        background: isInitialized
          ? 'transparent'
          : 'linear-gradient(135deg, #000814 0%, #001d3d 50%, #003566 100%)',
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full bio-particles"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'translateZ(0)',
          pointerEvents: 'none',
          display: 'block',
        }}
      />

      {/* Bio-inspired animated overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: `
            radial-gradient(circle at 30% 30%, rgba(0, 100, 200, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, rgba(100, 0, 200, 0.15) 0%, transparent 50%)
          `,
          animation: 'bioBackgroundPulse 8s ease-in-out infinite alternate',
        }}
      />

      {/* Error indicator for critical failures */}
      {hasError && process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 bg-red-900 bg-opacity-75 text-white p-2 rounded font-mono text-xs z-50">
          <div>⚠️ Background System Error</div>
          <div>Using Fallback Mode</div>
        </div>
      )}

      {/* Performance indicator (development only) */}
      {process.env.NODE_ENV === 'development' && isInitialized && !hasError && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded font-mono text-xs z-50">
          <div>Engine: {currentEngine.toUpperCase()}</div>
          <div>Quality: {quality.toUpperCase()}</div>
          <div>FPS: {performanceRef.current.fps}</div>
          {smartSwarmRef.current && <div>Smart Swarm: Active</div>}
          {particleSystemRef.current && <div>Neural Particles: Active</div>}
        </div>
      )}
    </div>
  );
};
