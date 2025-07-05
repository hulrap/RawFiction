import React from 'react';

interface StandardLoadingScreenProps {
  className?: string;
}

/**
 * Standardized visual loading screen component used across all cards
 * - Pure visual component with no text indication
 * - Consistent spinner design using brand colors
 * - Overlay style that covers the content area
 */
export const StandardLoadingScreen: React.FC<StandardLoadingScreenProps> = ({ className = '' }) => {
  return (
    <div
      className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 ${className}`}
      role="status"
      aria-label="Loading content"
    >
      <div className="relative">
        <div className="w-12 h-12 border-4 border-[var(--brand-glass)] border-t-[var(--brand-accent)] rounded-full animate-spin" />
      </div>
    </div>
  );
};
