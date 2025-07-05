import React, { useEffect, useState } from 'react';
import type { SiteConfig } from '../../shared/types';
import { StandardLoadingScreen } from '../../shared/StandardLoadingScreen';

interface LoadingProps {
  config: SiteConfig;
  onError: (error: string) => void;
}

export const Loading: React.FC<LoadingProps> = ({ config, onError }) => {
  const [_progress, setProgress] = useState(0);

  useEffect(() => {
    // Simple progress simulation
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 15;
        if (next >= 90) {
          clearInterval(interval);
          // Don't complete automatically - let the iframe onLoad handle completion
          return 90;
        }
        return next;
      });
    }, 200);

    // Timeout fallback
    const timeout = setTimeout(() => {
      onError('Loading timeout');
    }, config.loading.timeout || 30000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [config.loading.timeout, onError]);

  // Use standardized loading screen - ignore progress for visual consistency
  return <StandardLoadingScreen />;
};
