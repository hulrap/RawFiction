import React, { useState, useRef, useMemo, useCallback, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, invalidate } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry';

interface CardWithOverlayProps {
  title: string;
  isRevealed: boolean;
  needsImmediateOverlay?: boolean;
  onShatter: () => void;
  children: React.ReactNode;
  carouselPosition: string;
  forceHighQuality?: boolean;
  onOverlayReady?: () => void;
}

// Enhanced 3D Cube Field component
const CubeGrid: React.FC<{
  mouse: THREE.Vector2;
  flowProgress: number;
  isFlowing: boolean;
  onReady: () => void;
}> = ({ mouse, flowProgress, isFlowing, onReady }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // UNIFORM cube grid configuration - same for ALL cards regardless of carousel position
  const CAMERA_DISTANCE = 4.0;
  const CAMERA_FOV = 60;

  // Fixed world dimensions - no carousel compensation needed
  const fovRad = (CAMERA_FOV * Math.PI) / 180;
  const visibleHeight = 2 * CAMERA_DISTANCE * Math.tan(fovRad / 2);
  const visibleWidth = visibleHeight * (16 / 9); // Force 16:9 aspect ratio

  // Fixed dimensions for consistent cube grid across all cards (fill entire canvas)
  const BORDER_COMPENSATION = 0.0; // No border - fill completely
  const EFFECTIVE_WIDTH = visibleWidth - BORDER_COMPENSATION * 2;
  const EFFECTIVE_HEIGHT = visibleHeight - BORDER_COMPENSATION * 2;

  // Fixed cube configuration - much larger glass cubes, fewer total cubes
  const CUBE_SIZE = 0.16; // Quadrupled size = 1/16th the total cubes (perfect for glass effect)
  const CUBE_SPACING = 0.0; // No gaps - continuous surface
  const CUBE_PITCH = CUBE_SIZE + CUBE_SPACING;

  // Fixed grid dimensions - same grid size for all cards
  const CUBES_X = Math.floor(EFFECTIVE_WIDTH / CUBE_PITCH);
  const CUBES_Y = Math.floor(EFFECTIVE_HEIGHT / CUBE_PITCH);
  const TOTAL_CUBES = CUBES_X * CUBES_Y;

  const geometry = useMemo(
    () => new RoundedBoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE, 2, 0.01),
    [CUBE_SIZE]
  );

  const cubes = useMemo(() => {
    const temp = [];
    const totalGridWidth = CUBES_X * CUBE_PITCH - CUBE_SPACING;
    const totalGridHeight = CUBES_Y * CUBE_PITCH - CUBE_SPACING;
    const startX = -totalGridWidth / 2;
    const startY = -totalGridHeight / 2;
    for (let x = 0; x < CUBES_X; x++) {
      for (let y = 0; y < CUBES_Y; y++) {
        const posX = startX + x * CUBE_PITCH + CUBE_SIZE / 2;
        const posY = startY + y * CUBE_PITCH + CUBE_SIZE / 2;
        temp.push({
          basePosition: new THREE.Vector3(posX, posY, 0),
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
    return temp;
  }, [CUBES_X, CUBES_Y, CUBE_PITCH, CUBE_SIZE]);

  useLayoutEffect(() => {
    if (!meshRef.current) return;
    const matrix = new THREE.Matrix4();
    cubes.forEach((cube, index) => {
      matrix.setPosition(cube.basePosition);
      meshRef.current!.setMatrixAt(index, matrix);
    });
    meshRef.current!.instanceMatrix.needsUpdate = true;
  }, [cubes]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const smoothstep = (min: number, max: number, value: number) => {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
  };

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime();

    cubes.forEach((cube, index) => {
      const { basePosition } = cube;
      dummy.position.copy(basePosition);

      // Re-implement shader logic in JS
      const cubeUV = new THREE.Vector2(
        (dummy.position.x + EFFECTIVE_WIDTH / 2) / EFFECTIVE_WIDTH,
        (dummy.position.y + EFFECTIVE_HEIGHT / 2) / EFFECTIVE_HEIGHT
      );
      const dist = cubeUV.distanceTo(mouse);

      // Hover elevation
      const hoverInfluence = 1.0 - smoothstep(0.0, 0.2, dist);
      const cubeElevation = hoverInfluence ** 3 * 0.6;
      dummy.position.z += cubeElevation;

      // Ripple
      const ripple = Math.sin(dist * 15.0 - time * 4.0) * 0.1;
      dummy.position.z += ripple * Math.exp(-dist * 3.0) * hoverInfluence;

      // Flow
      if (isFlowing) {
        const adjustedProgress = Math.max(0.0, flowProgress - dummy.position.y * 0.05);
        dummy.position.y -= adjustedProgress ** 2 * 8.0;
        dummy.position.z += Math.sin(dummy.position.x * 3.0 + time * 1.8) * adjustedProgress * 0.15;
      }

      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(index, dummy.matrix);
    });
    meshRef.current!.instanceMatrix.needsUpdate = true;
  });

  // Signal ready state
  useEffect(() => {
    if (meshRef.current && !isInitialized) {
      setIsInitialized(true);
      onReady();
    }
  }, [isInitialized, onReady]);

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, TOTAL_CUBES]}>
      <meshStandardMaterial color="#e5e7eb" metalness={0.9} roughness={0.25} />
    </instancedMesh>
  );
};

export const CardWithOverlay: React.FC<CardWithOverlayProps> = ({
  title,
  isRevealed,
  needsImmediateOverlay = false,
  onShatter,
  children,
  carouselPosition,
  forceHighQuality = false,
  onOverlayReady,
}) => {
  const [isFlowing, setIsFlowing] = useState(false);
  const [mouse, setMouse] = useState(new THREE.Vector2(0.5, 0.5));
  const [flowProgress, setFlowProgress] = useState(0);

  // Loading synchronization
  const [isContentReady, setIsContentReady] = useState(false);
  const [isWebGLReady, setIsWebGLReady] = useState(false);
  const [isAtomicReady, setIsAtomicReady] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Initialize ALL overlays immediately - regardless of visibility
  useEffect(() => {
    if (!isRevealed && !isAtomicReady) {
      if (needsImmediateOverlay) {
        // Immediate overlay for non-center cards - no waiting
        setIsAtomicReady(true);
        invalidate();
        onOverlayReady?.();
      } else if (isContentReady && isWebGLReady) {
        // Normal loading sequence for center cards
        const timer = setTimeout(() => {
          setIsAtomicReady(true);
          invalidate();
          onOverlayReady?.();
        }, 50);
        return () => clearTimeout(timer);
      }
    }
    return undefined;
  }, [
    isRevealed,
    isContentReady,
    isWebGLReady,
    isAtomicReady,
    onOverlayReady,
    needsImmediateOverlay,
  ]);

  // Track when card becomes visible to force Canvas re-mount
  const [canvasKey, setCanvasKey] = useState(0);
  const prevPositionRef = useRef(carouselPosition);

  useEffect(() => {
    // Only force Canvas re-mount when card transitions from hidden to visible (not on position changes)
    if (prevPositionRef.current === 'hidden' && carouselPosition !== 'hidden') {
      setCanvasKey(prev => prev + 1);
      setIsWebGLReady(false);
      setIsAtomicReady(false);
    }
    prevPositionRef.current = carouselPosition;
  }, [carouselPosition]);

  // Reset overlay state when position changes to ensure clean transitions
  useEffect(() => {
    if (carouselPosition !== 'center') {
      // Immediately reset any flowing/shattered state for non-center cards
      setIsFlowing(false);
      setFlowProgress(0);
      // Force immediate overlay readiness for non-center cards
      if (!isRevealed) {
        setIsAtomicReady(true);
      }
    }
  }, [carouselPosition, isRevealed]);

  // Content ready detection
  useEffect(() => {
    if (contentRef.current && !isContentReady) {
      const timer = requestAnimationFrame(() => {
        setIsContentReady(true);
      });
      return () => cancelAnimationFrame(timer);
    }
    return undefined;
  }, [isContentReady]);

  // WebGL ready callback
  const handleWebGLReady = useCallback(() => {
    setIsWebGLReady(true);
  }, []);

  // Enhanced mouse tracking with better responsiveness
  const lastMouseUpdate = useRef(0);
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!overlayRef.current || isFlowing) return;

      // Higher frequency updates for smoother interaction
      const now = performance.now();
      if (now - lastMouseUpdate.current < 8) return; // ~120fps
      lastMouseUpdate.current = now;

      const rect = overlayRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));

      setMouse(new THREE.Vector2(x, y));
      invalidate();
    },
    [isFlowing]
  );

  // Handle overlay click to trigger shatter effect
  const handleClick = useCallback(() => {
    if (isRevealed || isFlowing) return;

    setIsFlowing(true);

    const startTime = Date.now();
    const duration = 1800;

    const animateFlow = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setFlowProgress(progress);

      if (progress < 1) {
        requestAnimationFrame(animateFlow);
      } else {
        // Smooth completion - let the final frame render
        setFlowProgress(1);

        // Complete the animation smoothly
        requestAnimationFrame(() => {
          setTimeout(onShatter, 50);
        });
      }
    };

    requestAnimationFrame(animateFlow);
  }, [isRevealed, isFlowing, onShatter]);

  return (
    <div className="card-content-container lazy-container">
      {/* Card Content */}
      <div
        ref={contentRef}
        className={`transition-opacity duration-200`}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          // Content is always loaded and rendered, but hidden behind overlay when needed
          opacity: isRevealed ? 1 : 0, // Fade in when shattered
          visibility: isRevealed ? 'visible' : 'hidden', // Hide when not shattered
          zIndex: 1, // Always behind overlay until revealed
        }}
      >
        {isRevealed && children}
      </div>

      {/* Enhanced 3D Cube Grid Overlay */}
      <AnimatePresence>
        {!isRevealed && (
          <motion.div
            ref={overlayRef}
            className="glass-overlay-container"
            initial={{ opacity: needsImmediateOverlay ? 1 : 0 }}
            animate={{ opacity: needsImmediateOverlay ? 1 : isAtomicReady ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: needsImmediateOverlay ? 0 : 0.3 }}
            style={{
              cursor: isFlowing ? 'default' : 'pointer',
              zIndex: 20, // Always above content to ensure proper coverage
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => !isFlowing && setMouse(new THREE.Vector2(0.5, 0.5))}
            onClick={handleClick}
          >
            {/* 3D Cube Grid Canvas */}
            <div
              className="glass-overlay-webgl"
              style={{
                // Force maximum quality regardless of card position
                imageRendering: 'crisp-edges',
                opacity: 1,
                filter: 'none',
                transform: 'translateZ(0)',
              }}
            >
              <Canvas
                key={canvasKey} // Force re-mount when transitioning from hidden to visible
                camera={{
                  position: [0, 0, 4.0],
                  fov: 60,
                  near: 0.1,
                  far: 20,
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  transform: 'translateZ(0)', // Force new layer
                }}
                gl={{
                  alpha: true,
                  antialias: true,
                  powerPreference: forceHighQuality ? 'high-performance' : 'default',
                  stencil: false,
                  depth: true,
                  preserveDrawingBuffer: false,
                  premultipliedAlpha: false,
                }}
                dpr={
                  forceHighQuality ? window.devicePixelRatio : Math.min(window.devicePixelRatio, 2)
                }
                frameloop="always"
              >
                <ambientLight intensity={0.5} />
                {/* A custom environment with soft lightformers for clean reflections */}
                <Environment resolution={256}>
                  <group rotation={[-Math.PI / 2, 0, 0]}>
                    {/* Main soft reflection source */}
                    <Lightformer
                      intensity={5}
                      rotation-x={Math.PI / 2}
                      position={[0, 5, -9]}
                      scale={[10, 10, 1]}
                    />
                    {/* Secondary fill lights */}
                    <Lightformer
                      intensity={2.5}
                      rotation-y={Math.PI / 2}
                      position={[-5, 1, -1]}
                      scale={[10, 2, 1]}
                    />
                    <Lightformer
                      intensity={2.5}
                      rotation-y={Math.PI / 2}
                      position={[5, 1, -1]}
                      scale={[10, 2, 1]}
                    />
                    {/* Top-down fill */}
                    <Lightformer
                      intensity={2.5}
                      rotation-y={-Math.PI / 2}
                      position={[10, 4, -1]}
                      scale={[20, 4, 1]}
                    />
                  </group>
                </Environment>
                <CubeGrid
                  mouse={mouse}
                  flowProgress={flowProgress}
                  isFlowing={isFlowing}
                  onReady={handleWebGLReady}
                />
              </Canvas>
            </div>

            {/* Content overlay with enhanced styling */}
            {!isFlowing && (needsImmediateOverlay ? true : isAtomicReady) && (
              <div className="glass-overlay-content">
                <motion.h2
                  className="glass-overlay-title uppercase"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  {title}
                </motion.h2>
                <motion.div
                  className="glass-overlay-subtitle"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  Click to reveal
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
