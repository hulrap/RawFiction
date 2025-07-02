// Advanced 3D Background System
import React from 'react';
import { CubeMazeBackground } from './background/CubeMazeBackground';

interface BackgroundProps {
  className?: string;
}

const Background: React.FC<BackgroundProps> = ({ className = '' }) => {
  return <CubeMazeBackground className={`cube-maze-background ${className}`} />;
};

export default Background;
