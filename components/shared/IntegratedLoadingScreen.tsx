import React from 'react';

interface IntegratedLoadingScreenProps {
  loadedCount: number;
  totalCount: number;
  isReady: boolean;
}

export const IntegratedLoadingScreen: React.FC<IntegratedLoadingScreenProps> = ({
  loadedCount,
  totalCount,
  isReady,
}) => {
  const isComplete = loadedCount === totalCount && isReady;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-1000 ${
        isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="text-6xl text-[var(--brand-accent)] font-mono tracking-wider animate-pulse">
        {loadedCount} / {totalCount}
      </div>
    </div>
  );
};
