import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { ProjectProps } from './shared/types';

interface PortfolioProject {
  id: string;
  title: string;
  component: React.ComponentType<ProjectProps>;
  description: string;
}

interface NavigationControlsProps {
  projects: PortfolioProject[];
  currentIndex: number;
  onNavigate: (index: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  isTransitioning: boolean;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  projects,
  currentIndex,
  onNext,
  onPrevious,
  isTransitioning,
}) => {
  return (
    <div className="nav-controls">
      <button
        className="nav-button w-16 h-16 flex items-center justify-center"
        onClick={onPrevious}
        disabled={isTransitioning}
        aria-label="Previous project"
      >
        <ChevronLeftIcon className="w-6 h-6" />
      </button>

      <div className="flex items-center justify-center px-6 min-w-0 flex-1 max-w-md mx-auto">
        <div className="text-center">
          <span className="text-sm font-medium text-metallic block">
            {currentIndex + 1} / {projects.length}
          </span>
          <span className="text-sm text-gradient font-medium block truncate max-w-xs">
            {projects[currentIndex]?.title}
          </span>
        </div>
      </div>

      <button
        className="nav-button w-16 h-16 flex items-center justify-center shrink-0"
        onClick={onNext}
        disabled={isTransitioning}
        aria-label="Next project"
      >
        <ChevronRightIcon className="w-6 h-6" />
      </button>
    </div>
  );
};
