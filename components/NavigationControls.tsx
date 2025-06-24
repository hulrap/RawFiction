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
  onNavigate,
  onNext,
  onPrevious,
  isTransitioning
}) => {
  return (
    <>
      {/* Main Navigation Controls */}
      <div className="nav-controls">
        <button
          className="nav-button"
          onClick={onPrevious}
          disabled={isTransitioning}
          aria-label="Previous project"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 px-4">
          <span className="text-sm font-medium text-metallic">
            {currentIndex + 1} / {projects.length}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1 px-2">
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

      {/* Project Indicators */}
      <div className="scroll-indicator">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className={`scroll-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => onNavigate(index)}
            title={project.title}
            aria-label={`Go to ${project.title}`}
          />
        ))}
      </div>

      {/* Mobile Project Title */}
      <div className="md:hidden fixed top-8 left-1/2 transform -translate-x-1/2 z-1000">
        <div className="card-glass px-6 py-3">
          <h1 className="heading-card text-lg mb-0">
            {projects[currentIndex]?.title}
          </h1>
          <p className="text-sm opacity-75 mt-1">
            {projects[currentIndex]?.description}
          </p>
        </div>
      </div>

      {/* Desktop Project Info */}
      <div className="hidden md:block fixed top-8 right-8 z-1000">
        <div className="card-glass p-6 max-w-sm">
          <h1 className="heading-card text-xl mb-2">
            {projects[currentIndex]?.title}
          </h1>
          <p className="text-sm opacity-75 leading-relaxed">
            {projects[currentIndex]?.description}
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs opacity-60">
            <span>Project {currentIndex + 1} of {projects.length}</span>
          </div>
        </div>
      </div>

      {/* Navigation Instructions */}
      <div className="hidden lg:block fixed bottom-8 left-8 z-1000">
        <div className="card-glass p-4 text-sm opacity-75">
          <div className="space-y-1">
            <div>🖱️ Scroll wheel to navigate</div>
            <div>⌨️ Arrow keys for navigation</div>
            <div>📱 Swipe on mobile</div>
          </div>
        </div>
      </div>
    </>
  );
}; 