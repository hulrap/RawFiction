import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PortfolioProject {
  id: string;
  title: string;
  component: React.ComponentType;
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
  isTransitioning
}) => {
  return (
    <div className="nav-controls">
      <button
        className="nav-button"
        onClick={onPrevious}
        disabled={isTransitioning}
        aria-label="Previous project"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-4 px-6">
        <span className="text-sm font-medium text-metallic">
          {currentIndex + 1} / {projects.length}
        </span>

        <span className="text-sm text-gradient font-medium">
          {projects[currentIndex]?.title}
        </span>
      </div>

      <button
        className="nav-button"
        onClick={onNext}
        disabled={isTransitioning}
        aria-label="Next project"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
};
