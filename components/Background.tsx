// Advanced 3D Background System
import React from 'react';
import { CubeMazeBackground } from './background/CubeMazeBackground';

interface BackgroundProps {
  className?: string;
  onReady?: () => void;
}

const Background: React.FC<BackgroundProps> = ({ className = '', onReady }) => {
  return (
    <CubeMazeBackground
      className={`cube-maze-background ${className}`}
      {...(onReady && { onReady })}
    />
  );
};

export default Background;
