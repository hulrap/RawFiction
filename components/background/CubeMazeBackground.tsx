import React, { useRef, useMemo, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
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
      {/* A low-intensity ambient light to ensure no part of the scene is pure black. */}
      <ambientLight intensity={0.8} />

      {/* A 6-point "light box" setup to ensure even, bright reflections from all angles. */}
      <Environment resolution={1024}>
        {/* The key lights are angled to create the desired reflections on the side walls. */}
        <Lightformer
          form="rect"
          intensity={10}
          color="white"
          position={[100, 0, -100]}
          scale={[200, 200, 200]}
          rotation-y={Math.PI}
        />
        <Lightformer
          form="rect"
          intensity={10}
          color="white"
          position={[-100, 0, -100]}
          scale={[200, 200, 200]}
          rotation-y={-Math.PI}
        />

        {/* Fill lights for the top and bottom walls. */}
        <Lightformer
          form="rect"
          intensity={10}
          color="white"
          position={[0, 100, 0]}
          scale={[150, 10, 1]}
          rotation-x={-Math.PI / 2}
        />
        <Lightformer
          form="rect"
          intensity={10}
          color="white"
          position={[0, -100, 0]}
          scale={[150, 10, 1]}
          rotation-x={Math.PI / 2}
        />

        {/* Lights for the back and front to complete the box. */}
        <Lightformer
          form="rect"
          intensity={5}
          color="white"
          position={[0, 0, -100]}
          scale={[150, 150, 1]}
        />
        <Lightformer
          form="rect"
          intensity={0}
          color="white"
          position={[0, 0, 100]}
          scale={[150, 150, 1]}
          rotation-y={Math.PI}
        />
      </Environment>

      {surfaces.map(surface => (
        <CubeWall key={surface.name} surface={surface} mouse={mouse} />
      ))}
    </>
  );
};

const CubeWall: React.FC<{ surface: CubeSurface; mouse: THREE.Vector2 }> = ({ surface, mouse }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { camera } = useThree();

  const { geometry, material, cubes } = useMemo(() => {
    const geom = new RoundedBoxGeometry(2, 2, 2, 6, 0.2);
    const mat = new THREE.MeshStandardMaterial({
      color: '#333333',
      metalness: 0.95,
      roughness: 0.05,
      vertexColors: true,
    });
    const spacing = 2.0;
    const width = typeof surface.dimensions.width === 'number' ? surface.dimensions.width : 0;
    const height = typeof surface.dimensions.height === 'number' ? surface.dimensions.height : 0;
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
  }, [surface.dimensions]);

  const baseColor = useMemo(() => new THREE.Color(material.color), [material.color]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const instanceMatrix = useMemo(() => new THREE.Matrix4(), []);
  const worldPosition = useMemo(() => new THREE.Vector3(), []);

  const smoothstep = useCallback((min: number, max: number, value: number) => {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
  }, []);

  const HOVER_RADIUS = 0.2;

  useFrame(state => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    cubes.forEach((cube, i) => {
      const { basePosition, speedFactor, phase, amplitudeFactor } = cube;
      dummy.position.copy(basePosition);
      dummy.updateMatrix();

      // Get the true world position of the cube instance without mutating matrices
      instanceMatrix.multiplyMatrices(meshRef.current!.matrixWorld, dummy.matrix);
      worldPosition.setFromMatrixPosition(instanceMatrix);

      const projected = worldPosition.clone().project(camera);
      const dist = new THREE.Vector2(projected.x, projected.y).distanceTo(mouse);

      const hoverInfluence = 1.0 - smoothstep(0.0, HOVER_RADIUS, dist);

      dummy.position.z +=
        Math.sin(time * speedFactor + phase) * amplitudeFactor + hoverInfluence * 4.0;
      dummy.updateMatrix();

      if (hoverInfluence > 0.01) {
        const hue = (time * 0.1 + basePosition.x * 0.05 + basePosition.y * 0.05) % 1;
        color.setHSL(hue, 0.7, 0.6);
        meshRef.current!.setColorAt(i, color);
      } else {
        meshRef.current!.setColorAt(i, baseColor);
      }

      meshRef.current!.setMatrixAt(i, dummy.matrix);
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
  mouse: THREE.Vector2;
}> = ({ className = 'cube-maze-background', onReady, mouse }) => {
  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      onReady?.();
    });
    return () => cancelAnimationFrame(timer);
  }, [onReady]);

  return (
    <div
      className={className}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75, near: 0.1, far: 1000 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
      >
        <Scene mouse={mouse} />
      </Canvas>
    </div>
  );
};
