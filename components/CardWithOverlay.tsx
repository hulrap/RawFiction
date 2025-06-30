import React, { useState, useRef, useMemo, useCallback, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, invalidate } from '@react-three/fiber';
import * as THREE from 'three';

interface CarouselTransform {
  x: number;
  y: number;
  z: number;
  rotX: number;
  rotY: number;
  scale: number;
  opacity: number;
  zIndex: number;
  pointerEvents: string;
  cursor: string;
}

interface CardWithOverlayProps {
  title: string;
  isOverlayVisible: boolean;
  needsImmediateOverlay?: boolean;
  onShatter: () => void;
  children: React.ReactNode;
  carouselPosition: string;
  carouselTransform: CarouselTransform;
  forceHighQuality?: boolean;
  onOverlayReady?: () => void;
}

// Enhanced 3D cube wall shaders with proper visibility and hover effects
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uFlowProgress;
  uniform float uIsFlowing;
  uniform float uAspect;
  uniform float uHoverRadius;
  uniform float uEffectiveWidth;
  uniform float uEffectiveHeight;
  uniform float uCardOpacity;
  varying vec2 vUv;
  varying vec3 vPosition;
  varying float vDistanceFromMouse;
  varying vec3 vNormal;
  varying float vCubeId;
  varying float vElevation;

  // Improved hash function for better randomization
  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  void main() {
    vUv = uv;
    vNormal = normal;

    // CRITICAL FIX: Apply the full instance matrix transformation first
    vec4 worldPosition = instanceMatrix * vec4(position, 1.0);
    vec3 pos = worldPosition.xyz;
    vPosition = pos;

    // Extract cube world position for effects
    vec3 cubeWorldPos = (instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    vec2 cubeGridPos = cubeWorldPos.xy;
    vCubeId = hash(cubeGridPos * 100.0);

    // Convert cube world position to UV space for mouse interaction
    vec2 cubeUV = vec2(
      (cubeGridPos.x + (uEffectiveWidth * 0.5)) / uEffectiveWidth,
      (cubeGridPos.y + (uEffectiveHeight * 0.5)) / uEffectiveHeight
    );

    vDistanceFromMouse = distance(cubeUV, uMouse);

    // Main hover effect - cubes emerge from surface
    float hoverInfluence = 1.0 - smoothstep(0.0, uHoverRadius, vDistanceFromMouse);
    float cubeElevation = hoverInfluence * hoverInfluence * hoverInfluence * 0.6; // Strong cubic falloff
    pos.z += cubeElevation;
    vElevation = cubeElevation;

    // Ripple wave effect around mouse
    float rippleDistance = vDistanceFromMouse;
    float ripple = sin(rippleDistance * 15.0 - uTime * 4.0) * 0.1;
    ripple *= exp(-rippleDistance * 3.0); // Sharp falloff
    ripple *= hoverInfluence; // Only apply ripple in hover area
    pos.z += ripple;

     // Perfect flat grid - no ambient wave variations

    // Cascade flowing effect during shatter - symmetrical top to bottom
    if (uIsFlowing > 0.5) {
      float cascade = uFlowProgress * uFlowProgress;
      float fallDelay = cubeGridPos.y * 0.05; // Only Y coordinate for pure vertical flow
      float adjustedProgress = max(0.0, uFlowProgress - fallDelay);

      pos.y -= adjustedProgress * adjustedProgress * 8.0; // Increased fall distance to go completely off-screen
      // Remove sideways movement for symmetrical effect
      pos.z += sin(cubeGridPos.x * 3.0 + uTime * 1.8) * adjustedProgress * 0.15;
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform float uOpacity;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uFlowProgress;
  uniform float uIsFlowing;
  uniform float uHoverRadius;
  varying vec2 vUv;
  varying vec3 vPosition;
  varying float vDistanceFromMouse;
  varying vec3 vNormal;
  varying float vCubeId;
  varying float vElevation;

  // Hash function for procedural noise
  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  // Smooth noise function
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(-vPosition);

    // Enhanced hyperrealistic lighting setup
    vec3 keyLight = normalize(vec3(0.7, 1.5, 1.8));      // Strong key light from top-right
    vec3 fillLight = normalize(vec3(-1.2, 0.8, 0.9));    // Softer fill light from left
    vec3 rimLight = normalize(vec3(0.4, -0.3, 1.2));     // Rim light for edge definition
    vec3 envLight = normalize(vec3(0.0, 1.0, 0.0));      // Environmental top light

    // Light colors for realistic scene lighting
    vec3 keyColor = vec3(1.0, 0.98, 0.95);      // Warm key light
    vec3 fillColor = vec3(0.7, 0.8, 1.0);       // Cool fill light
    vec3 rimColor = vec3(0.9, 0.95, 1.0);       // Cool rim light
    vec3 envColor = vec3(0.8, 0.85, 1.0);       // Cool environmental light

    // Calculate diffuse lighting with proper light colors
    float NdotL_key = max(0.0, dot(normal, keyLight));
    float NdotL_fill = max(0.0, dot(normal, fillLight));
    float NdotL_rim = max(0.0, dot(normal, rimLight));
    float NdotL_env = max(0.0, dot(normal, envLight));

    // Wrap lighting for subsurface scattering effect
    float wrap = 0.3;
    NdotL_key = (NdotL_key + wrap) / (1.0 + wrap);
    NdotL_fill = (NdotL_fill + wrap) / (1.0 + wrap);

    // Combine diffuse lighting
    vec3 diffuse = 0.2 * envColor * NdotL_env +           // Ambient environmental
                   0.8 * keyColor * NdotL_key +           // Primary key light
                   0.5 * fillColor * NdotL_fill +         // Secondary fill
                   0.3 * rimColor * NdotL_rim;            // Rim lighting

    // Advanced fresnel with realistic falloff
    float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 1.8);
    float fresnelSharp = pow(1.0 - max(0.0, dot(normal, viewDir)), 4.0);

    // Multi-layer specular for enamel surface
    vec3 reflectDir_key = reflect(-keyLight, normal);
    vec3 reflectDir_fill = reflect(-fillLight, normal);
    vec3 reflectDir_rim = reflect(-rimLight, normal);

    // Primary specular (sharp enamel surface)
    float specular1 = pow(max(0.0, dot(viewDir, reflectDir_key)), 120.0);
    float specular2 = pow(max(0.0, dot(viewDir, reflectDir_fill)), 60.0);
    float specular3 = pow(max(0.0, dot(viewDir, reflectDir_rim)), 80.0);

    // Secondary specular (broader reflection)
    float specularBroad1 = pow(max(0.0, dot(viewDir, reflectDir_key)), 20.0);
    float specularBroad2 = pow(max(0.0, dot(viewDir, reflectDir_fill)), 15.0);

    vec3 specular = keyColor * specular1 * 0.9 +
                    fillColor * specular2 * 0.6 +
                    rimColor * specular3 * 0.7 +
                    keyColor * specularBroad1 * 0.3 +
                    fillColor * specularBroad2 * 0.2;

    // Anthracite grey enamel base colors
    vec3 anthraciteBase = vec3(0.15, 0.16, 0.18);       // Deep anthracite
    vec3 anthraciteHighlight = vec3(0.35, 0.38, 0.42);  // Lighter anthracite
    vec3 anthraciteShadow = vec3(0.08, 0.09, 0.11);     // Dark anthracite

    // Off-white hover color
    vec3 offWhite = vec3(0.92, 0.94, 0.96);
    vec3 offWhiteHighlight = vec3(0.98, 0.99, 1.0);

    // Hover detection and color mixing
    float hoverGlow = 1.0 - smoothstep(0.0, uHoverRadius, vDistanceFromMouse);
    hoverGlow = hoverGlow * hoverGlow * hoverGlow; // Smooth cubic falloff

    // Base color mixing (anthracite to off-white based on hover)
    vec3 baseColor = mix(anthraciteBase, offWhite, hoverGlow);
    vec3 highlightColor = mix(anthraciteHighlight, offWhiteHighlight, hoverGlow);
    vec3 shadowColor = mix(anthraciteShadow, offWhite * 0.7, hoverGlow);

        // Build solid colored glass appearance
    vec3 color = baseColor * diffuse;

    // Glass refraction simulation
    vec3 refractDir = refract(-viewDir, normal, 0.85); // Glass IOR approximation
    float glassThickness = 0.3; // Solid glass thickness effect
    vec3 glassColor = baseColor * (1.0 + glassThickness);

    // Environment reflection simulation
    vec3 reflectDir = reflect(-viewDir, normal);
    float skyReflection = max(0.0, reflectDir.y);
    vec3 envReflection = mix(vec3(0.3, 0.4, 0.6), vec3(0.7, 0.8, 1.0), skyReflection);

    // Glass fresnel - stronger than enamel
    float glassFresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 1.2);
    float glassFresnelSharp = pow(1.0 - max(0.0, dot(normal, viewDir)), 3.0);

    // Multi-layer glass effects
    color = mix(glassColor, highlightColor, glassFresnel * 0.4);
    color = mix(color, envReflection, glassFresnelSharp * 0.5 * (1.0 + hoverGlow * 0.3));

    // Glass internal reflections
    float internalReflection = pow(max(0.0, dot(refractDir, normal)), 2.0);
    color += baseColor * internalReflection * 0.3;

    // Add specular reflections with glass intensity
    color += specular * (0.8 + hoverGlow * 0.5);

    // Glass surface imperfections and thickness variations
    vec2 stablePos = vPosition.xy * 0.1;
    float glassImperfections = noise(stablePos * 15.0) * 0.05;
    float glassThicknessVar = noise(stablePos * 6.0) * 0.1;
    color += vec3(glassImperfections) * (1.0 - hoverGlow * 0.4);
    color *= (1.0 + glassThicknessVar * 0.15);

    // Glass caustics and light refraction patterns
    float caustics = sin(vDistanceFromMouse * 15.0 - uTime * 10.0) * 0.5 + 0.5;
    caustics *= exp(-vDistanceFromMouse * 5.0) * hoverGlow;
    vec3 causticsColor = mix(baseColor, vec3(0.9, 0.95, 1.0), hoverGlow);
    color += causticsColor * caustics * 0.15;

    // Elevation effects with glass light transmission
    float elevationEffect = vElevation * 2.5;
    color += highlightColor * elevationEffect * 0.4;
    color += envReflection * elevationEffect * glassFresnel * 0.5;

    // Glass depth perception - no harsh ambient occlusion
    float glassDepth = 1.0 - (noise(stablePos * 3.0) * 0.1);
    color *= glassDepth;

    // Subsurface light transmission through glass
    float transmission = pow(max(0.0, dot(-viewDir, keyLight)), 2.0) * 0.6;
    color += glassColor * transmission * (1.0 + hoverGlow * 0.5);

    // Flowing effect with glass properties
    if (uIsFlowing > 0.5) {
      vec3 flowColor = mix(envReflection, offWhiteHighlight, hoverGlow);
      color += flowColor * uFlowProgress * 0.6;
      color *= (1.0 + uFlowProgress * 0.5);
      // Add glass energy and refraction during flow
      color += keyColor * specular * uFlowProgress * 0.9;
      color += envReflection * glassFresnelSharp * uFlowProgress * 0.7;
    }

    // Final glass edge enhancement
    float edgeGlassFresnel = pow(glassFresnel, 1.3);
    float sharpGlassEdge = pow(glassFresnelSharp, 0.9);
    color += highlightColor * edgeGlassFresnel * 0.25;
    color += envReflection * sharpGlassEdge * 0.2;

    // Tone mapping for realistic glass brightness
    color = color / (color + vec3(1.0));
    color = pow(color, vec3(0.85)); // Glass-appropriate gamma

    // Ensure proper contrast and depth
    color = max(color, shadowColor * 0.9);

        // Crystal clear glass with internal depth structure
    // Calculate depth-based inner core effect
    vec3 cubeCenter = vec3(0.0, 0.0, 0.0);
    float depthFromCenter = length(vPosition - cubeCenter);
    float maxDepth = 0.08; // Cube half-size
    float normalizedDepth = clamp(depthFromCenter / maxDepth, 0.0, 1.0);

    // Inner core density - more material in the center
    float coreDensity = 1.0 - smoothstep(0.3, 0.8, normalizedDepth);

    // Crystal clear glass base with depth-based coloring
    vec3 clearGlass = vec3(0.98, 0.99, 1.0); // Almost colorless
    vec3 finalColor = mix(clearGlass, color, coreDensity * 0.4); // Core gets more color

    // Ultra-transparent glass with realistic thickness
    float glassAlpha = 0.08 + glassFresnel * 0.4; // Very transparent with strong fresnel
    glassAlpha += coreDensity * 0.3; // Inner core more visible
    glassAlpha += hoverGlow * 0.25; // Hover makes it more visible
    glassAlpha *= (1.0 - uFlowProgress * 0.7); // Very transparent during flow

    // Enhanced glass refractions and reflections
    finalColor += envReflection * glassFresnelSharp * 0.6;
    finalColor += specular * (0.9 + hoverGlow * 0.4);

    gl_FragColor = vec4(finalColor, glassAlpha);
  }
`;

// Enhanced 3D Cube Field component
const CubeGrid: React.FC<{
  mouse: THREE.Vector2;
  opacity: number;
  flowProgress: number;
  isFlowing: boolean;
  onReady: () => void;
}> = ({ mouse, opacity, flowProgress, isFlowing, onReady }) => {
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

  // Debug logging removed for production

  // Hover radius - adjustable for ripple effect size
  const HOVER_RADIUS = 0.2;

  // Optimized uniforms
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uOpacity: { value: 1 },
      uFlowProgress: { value: 0 },
      uIsFlowing: { value: 0 },
      uAspect: { value: 16 / 9 },
      uHoverRadius: { value: HOVER_RADIUS },
      uEffectiveWidth: { value: EFFECTIVE_WIDTH },
      uEffectiveHeight: { value: EFFECTIVE_HEIGHT },
      uCardOpacity: { value: 1.0 }, // Always render at full quality, handle opacity in shader
    }),
    [HOVER_RADIUS, EFFECTIVE_WIDTH, EFFECTIVE_HEIGHT]
  );

  // Setup cube grid positions with proper mathematical grid layout
  useLayoutEffect(() => {
    if (meshRef.current) {
      let index = 0;

      // Calculate starting positions to center the grid within effective area
      const totalGridWidth = CUBES_X * CUBE_PITCH - CUBE_SPACING;
      const totalGridHeight = CUBES_Y * CUBE_PITCH - CUBE_SPACING;
      const startX = -totalGridWidth / 2;
      const startY = -totalGridHeight / 2;

      // Grid layout debug removed for production

      // FORCED TEST PATTERN - Ignore calculations and force a visible grid
      const FORCE_TEST = false;

      if (FORCE_TEST) {
        // Create a simple 10x6 test grid that we KNOW should be visible
        const TEST_CUBES_X = 10;
        const TEST_CUBES_Y = 6;
        const TEST_SPACING = 0.3;

        for (let x = 0; x < TEST_CUBES_X; x++) {
          for (let y = 0; y < TEST_CUBES_Y; y++) {
            // Simple spread pattern - guaranteed to be visible
            const posX = (x - TEST_CUBES_X / 2) * TEST_SPACING;
            const posY = (y - TEST_CUBES_Y / 2) * TEST_SPACING;
            const posZ = 0.1 + (x + y) * 0.05; // Stepped heights

            const instanceMatrix = new THREE.Matrix4();
            instanceMatrix.setPosition(posX, posY, posZ);

            if (index < TOTAL_CUBES) {
              meshRef.current.setMatrixAt(index, instanceMatrix);

              // Test positions logged in development mode

              index++;
            }
          }
        }
      } else {
        // Perfect 2D symmetrical grid positioning
        for (let x = 0; x < CUBES_X; x++) {
          for (let y = 0; y < CUBES_Y; y++) {
            const posX = startX + x * CUBE_PITCH + CUBE_SIZE / 2;
            const posY = startY + y * CUBE_PITCH + CUBE_SIZE / 2;
            // Perfect flat alignment - all cubes at exact same Z level
            const posZ = 0.0; // Perfectly flat, symmetrical grid

            const instanceMatrix = new THREE.Matrix4();
            instanceMatrix.setPosition(posX, posY, posZ);
            meshRef.current.setMatrixAt(index, instanceMatrix);
            index++;
          }
        }
      }

      meshRef.current.instanceMatrix.needsUpdate = true;
      meshRef.current.computeBoundingSphere();
    }
  }, [
    CUBES_X,
    CUBES_Y,
    CUBE_PITCH,
    CUBE_SIZE,
    EFFECTIVE_WIDTH,
    EFFECTIVE_HEIGHT,
    visibleWidth,
    visibleHeight,
    TOTAL_CUBES,
  ]);

  // Animation loop with proper uniform updates
  useFrame(({ clock }) => {
    const material = meshRef.current?.material as THREE.ShaderMaterial;
    if (material?.uniforms) {
      if (material.uniforms['uTime']) material.uniforms['uTime'].value = clock.elapsedTime;
      if (material.uniforms['uMouse']) material.uniforms['uMouse'].value.copy(mouse);
      if (material.uniforms['uOpacity']) material.uniforms['uOpacity'].value = opacity;
      if (material.uniforms['uFlowProgress'])
        material.uniforms['uFlowProgress'].value = flowProgress;
      if (material.uniforms['uIsFlowing'])
        material.uniforms['uIsFlowing'].value = isFlowing ? 1.0 : 0.0;
      if (material.uniforms['uEffectiveWidth'])
        material.uniforms['uEffectiveWidth'].value = EFFECTIVE_WIDTH;
      if (material.uniforms['uEffectiveHeight'])
        material.uniforms['uEffectiveHeight'].value = EFFECTIVE_HEIGHT;
    }
  });

  // Signal ready state
  useEffect(() => {
    if (meshRef.current && !isInitialized) {
      setIsInitialized(true);
      onReady();
    }
  }, [isInitialized, onReady]);

  // Create rounded cube geometry for enamel effect (adjusted for larger cubes)
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, TOTAL_CUBES]}>
      <boxGeometry args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.NormalBlending}
        alphaTest={0.005}
        opacity={1.0}
      />
    </instancedMesh>
  );
};

export const CardWithOverlay: React.FC<CardWithOverlayProps> = ({
  title,
  isOverlayVisible,
  needsImmediateOverlay = false,
  onShatter,
  children,
  carouselPosition,
  carouselTransform,
  forceHighQuality = false,
  onOverlayReady,
}) => {
  const [isShattered, setIsShattered] = useState(false);
  const [isFlowing, setIsFlowing] = useState(false);
  const [mouse, setMouse] = useState(new THREE.Vector2(0.5, 0.5));
  const [opacity, setOpacity] = useState(1);
  const [flowProgress, setFlowProgress] = useState(0);

  // Loading synchronization
  const [isContentReady, setIsContentReady] = useState(false);
  const [isWebGLReady, setIsWebGLReady] = useState(false);
  const [isAtomicReady, setIsAtomicReady] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Initialize ALL overlays immediately - regardless of visibility
  useEffect(() => {
    if (isOverlayVisible && !isAtomicReady) {
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
    isOverlayVisible,
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
      setIsShattered(false);
      setIsFlowing(false);
      setOpacity(1);
      setFlowProgress(0);
      // Force immediate overlay readiness for non-center cards
      if (isOverlayVisible) {
        setIsAtomicReady(true);
      }
    }
  }, [carouselPosition, isOverlayVisible]);

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
    if (isShattered || isFlowing) return;

    setIsFlowing(true);

    const startTime = Date.now();
    const duration = 1800;

    const animateFlow = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setFlowProgress(progress);
      setOpacity(1 - progress * 0.3);

      if (progress < 1) {
        requestAnimationFrame(animateFlow);
      } else {
        // Smooth completion - let the final frame render
        setFlowProgress(1);
        setOpacity(0.7);

        // Complete the animation smoothly
        requestAnimationFrame(() => {
          setIsShattered(true);
          setOpacity(0);
          setTimeout(onShatter, 50);
        });
      }
    };

    requestAnimationFrame(animateFlow);
  }, [isShattered, isFlowing, onShatter]);

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
          opacity: 1, // Always visible for loading/rendering
          visibility: 'visible', // Always visible for loading/rendering
          zIndex: isOverlayVisible ? 1 : 10, // Put behind overlay when overlay is visible
        }}
      >
        {children}
      </div>

      {/* Enhanced 3D Cube Grid Overlay */}
      <AnimatePresence>
        {isOverlayVisible && !isShattered && (
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
                  forceHighQuality
                    ? window.devicePixelRatio * (carouselTransform?.scale || 1.0)
                    : Math.min(window.devicePixelRatio, 2) * (carouselTransform?.scale || 1.0)
                }
                frameloop="always"
              >
                <CubeGrid
                  mouse={mouse}
                  opacity={opacity}
                  flowProgress={flowProgress}
                  isFlowing={isFlowing}
                  onReady={handleWebGLReady}
                />
              </Canvas>
            </div>

            {/* Content overlay with enhanced styling */}
            {!isFlowing && (needsImmediateOverlay ? true : isAtomicReady) && (
              <motion.div
                className="glass-overlay-content"
                initial={{
                  opacity: needsImmediateOverlay ? 1 : 0,
                  y: needsImmediateOverlay ? 0 : 20,
                }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: needsImmediateOverlay ? 0 : 0.5 }}
              >
                <div className="glass-overlay-text">
                  <motion.h2
                    className="glass-overlay-title uppercase"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                  >
                    {title}
                  </motion.h2>
                  <motion.div
                    className="glass-overlay-subtitle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    Click to reveal
                  </motion.div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
