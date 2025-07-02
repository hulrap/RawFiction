import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { CubeSurface, PerformanceLevel } from './types';

// The new, correctly structured Scene component
const Scene = () => {
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
      <ambientLight intensity={0.8} />
      <directionalLight position={[0, 20, 50]} intensity={1.2} color="#cccccc" />
      <directionalLight position={[0, -20, -50]} intensity={0.5} color="#555555" />

      {surfaces.map(surface => (
        <CubeWall key={surface.name} surface={surface} />
      ))}
    </>
  );
};

const CubeWall: React.FC<{ surface: CubeSurface }> = ({ surface }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const { geometry, material, cubes } = useMemo(() => {
    const geom = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x666666),
      roughness: 0.6,
      metalness: 0.2,
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

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime();
    const matrix = new THREE.Matrix4();
    cubes.forEach((cube, index) => {
      const movement = Math.sin(time * cube.speedFactor + cube.phase) * cube.amplitudeFactor;
      const position = cube.basePosition.clone();
      position.z += movement;
      matrix.setPosition(position);
      meshRef.current!.setMatrixAt(index, matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
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
}> = ({ className = 'cube-maze-background' }) => {
  return (
    <div
      className={className}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75, near: 0.1, far: 1000 }}
        gl={{ alpha: true, antialias: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};
