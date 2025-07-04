import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, SpotLight } from '@react-three/drei';
import * as THREE from 'three';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry';
import type { CubeSurface, PerformanceLevel } from './types';

// The new, correctly structured Scene component
const Scene = ({ mouse }: { mouse: THREE.Vector2 }) => {
  const { viewport } = useThree();

  // We define the walls inside the component that has access to the viewport
  const surfaces = useMemo((): CubeSurface[] => {
    // We calculate a distance that ensures the walls are far enough
    // to be a background but close enough to be visible with a standard FOV.
    const distance = 40;

    // The wall dimensions are calculated to be much larger than the viewport,
    // ensuring they always fill the screen and provide an immersive "room" feel.
    const wallDimensions = {
      width: viewport.width * 5,
      height: viewport.height * 5,
    };

    return [
      { name: 'back', center: [0, 0, -distance], rotation: [0, 0, 0], dimensions: wallDimensions },
      {
        name: 'left',
        center: [-distance, 0, 0],
        rotation: [0, Math.PI / 2, 0],
        dimensions: wallDimensions,
      },
      {
        name: 'right',
        center: [distance, 0, 0],
        rotation: [0, -Math.PI / 2, 0],
        dimensions: wallDimensions,
      },
      {
        name: 'top',
        center: [0, distance, 0],
        rotation: [Math.PI / 2, 0, 0],
        dimensions: wallDimensions,
      },
      {
        name: 'bottom',
        center: [0, -distance, 0],
        rotation: [-Math.PI / 2, 0, 0],
        dimensions: wallDimensions,
      },
    ];
  }, [viewport.width, viewport.height]);

  return (
    <>
      {/* Ambient light for a soft overall illumination */}
      <ambientLight intensity={1.5} />

      {/* A focused spotlight to create dramatic highlights and shadows */}
      <SpotLight
        penumbra={0.5}
        intensity={6}
        angle={0.6}
        position={[20, 20, 30]}
        castShadow
        color="#ffffff"
      />

      {/* Environment lighting for realistic, glossy reflections */}
      <Environment preset="apartment" blur={0.4} />

      {surfaces.map(surface => (
        <CubeWall key={surface.name} surface={surface} mouse={mouse} />
      ))}
    </>
  );
};

const CubeWall: React.FC<{ surface: CubeSurface; mouse: THREE.Vector2 }> = ({ surface, mouse }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { camera } = useThree(); // Get camera once, outside the loop

  const { geometry, material, cubes } = useMemo(() => {
    // Use RoundedBoxGeometry for smooth, enameled corners
    const geom = new RoundedBoxGeometry(1, 1, 1, 6, 0.1);
    // Material updated for a glossy, dark enamel look
    const mat = new THREE.MeshStandardMaterial({
      color: '#606060', // A lighter grey for better visibility
      metalness: 0.7, // Slightly reduced to show more base color
      roughness: 0.05, // Greatly reduced roughness for a glossy, reflective surface
      vertexColors: true, // Enable vertex colors to allow for dynamic color changes
    });

    const spacing = 1.0;
    const width = typeof surface.dimensions.width === 'string' ? 0 : surface.dimensions.width;
    const height = typeof surface.dimensions.height === 'string' ? 0 : surface.dimensions.height;
    const gridSizeX = Math.ceil(width / spacing);
    const gridSizeY = Math.ceil(height / spacing);
    const totalCubes = gridSizeX * gridSizeY;
    const cubeData = [];

    for (let i = 0; i < totalCubes; i++) {
      const x = i % gridSizeX;
      const y = Math.floor(i / gridSizeX);
      const localX = (x - (gridSizeX - 1) / 2) * spacing;
      const localY = (y - (gridSizeY - 1) / 2) * spacing;
      cubeData.push({
        basePosition: new THREE.Vector3(localX, localY, 0),
        phase: Math.random() * Math.PI * 2,
        speedFactor: 0.2 + Math.random() * 0.6,
        amplitudeFactor: 1.0 + Math.random() * 1.0,
      });
    }
    return { geometry: geom, material: mat, cubes: cubeData };
  }, [surface.dimensions.width, surface.dimensions.height]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const smoothstep = (min: number, max: number, value: number) => {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
  };
  const HOVER_RADIUS = 0.2;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime();

    cubes.forEach((cube, i) => {
      const { basePosition, speedFactor, phase, amplitudeFactor } = cube;
      dummy.position.copy(basePosition);

      // Convert world position to screen UV
      const screenPos = dummy.position.clone().project(camera); // Use camera from hook
      const cubeUV = new THREE.Vector2((screenPos.x + 1) / 2, (screenPos.y + 1) / 2);
      const dist = cubeUV.distanceTo(mouse);

      // Hover elevation
      const hoverInfluence = 1.0 - smoothstep(0.0, HOVER_RADIUS, dist);
      dummy.position.z +=
        Math.sin(time * speedFactor + phase) * amplitudeFactor + hoverInfluence * 2;

      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);

      // Oil spill color effect
      if (hoverInfluence > 0.01) {
        const hue = (time * 0.1 + basePosition.x * 0.05 + basePosition.y * 0.05) % 1;
        color.setHSL(hue, 0.7, 0.6);
        meshRef.current!.setColorAt(i, color);
      } else {
        // Reset color if not hovered
        meshRef.current!.setColorAt(i, new THREE.Color(material.color));
      }
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <group position={surface.center} rotation={new THREE.Euler(...surface.rotation)}>
      <instancedMesh ref={meshRef} args={[geometry, material, cubes.length]} />
    </group>
  );
};

export const CubeMazeBackground: React.FC<{
  className?: string;
  performanceLevel?: PerformanceLevel;
  onReady?: () => void;
}> = ({ className = 'cube-maze-background', onReady }) => {
  const [mouse, setMouse] = useState(new THREE.Vector2(0.5, 0.5));

  // Signal that background is ready after initial render
  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      onReady?.();
    });
    return () => cancelAnimationFrame(timer);
  }, [onReady]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = event;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    setMouse(
      new THREE.Vector2(
        (clientX - left) / width,
        1 - (clientY - top) / height // Invert Y to match coordinate system
      )
    );
  };

  return (
    <div
      className={className}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}
      onMouseMove={handleMouseMove}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75, near: 0.1, far: 1000 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]} // Cap DPR for performance
      >
        <Scene mouse={mouse} />
      </Canvas>
    </div>
  );
};
