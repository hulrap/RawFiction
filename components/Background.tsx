// Advanced 3D Background System
import React from 'react';
import { CubeMazeBackground } from './background/CubeMazeBackground';
import type * as THREE from 'three';

interface BackgroundProps {
  className?: string;
  onReady?: () => void;
  mouse: THREE.Vector2;
}

const Background: React.FC<BackgroundProps> = ({ className = '', onReady, mouse }) => {
  return (
    <CubeMazeBackground
      className={`cube-maze-background ${className}`}
      {...(onReady && { onReady })}
      mouse={mouse}
    />
  );
};

export default Background;
