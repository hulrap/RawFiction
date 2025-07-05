import React, { useState, useEffect } from 'react';
import type { SiteConfig } from '../../shared/types';
import { StandardLoadingScreen } from '../../shared/StandardLoadingScreen';

// Simplified loading state - only direct loading
interface LoadingState {
  isLoading: boolean;
  loadingStage: 'connecting' | 'loading' | 'ready' | 'error' | 'timeout';
  retryCount: number;
  errorMessage?: string;
}

export const Loading: React.FC<{
  config: SiteConfig;
  onComplete: () => void;
  onError: (error: string) => void;
}> = ({ config, onComplete, onError }) => {
  const [state, setState] = useState<LoadingState>({
    isLoading: true,
    loadingStage: 'connecting',
    retryCount: 0,
  });

  // Simulate AI Instructor loading process
  useEffect(() => {
    let timeoutRef: NodeJS.Timeout;

    const startLoading = () => {
      setState(prev => ({
        ...prev,
        isLoading: true,
        loadingStage: 'connecting',
      }));

      // Timeout handling
      timeoutRef = setTimeout(() => {
        if (state.retryCount < config.loading.retryCount) {
          // Retry
          setState(prev => ({
            ...prev,
            retryCount: prev.retryCount + 1,
            loadingStage: 'connecting',
          }));

          setTimeout(() => startLoading(), config.loading.retryDelay);
        } else {
          // Final failure
          const finalError = `AI Instructor appears to be down. Failed after ${state.retryCount + 1} attempts.`;
          setState(prev => ({
            ...prev,
            isLoading: false,
            loadingStage: 'error',
            errorMessage: finalError,
          }));
          onError(finalError);
        }
      }, config.loading.timeout);

      // Simulate successful completion
      setTimeout(
        () => {
          if (Math.random() > 0.2) {
            // 80% success rate
            clearTimeout(timeoutRef);

            setState(prev => ({
              ...prev,
              loadingStage: 'ready',
              isLoading: false,
            }));

            setTimeout(() => onComplete(), 300);
          }
        },
        Math.random() * 3000 + 2000
      ); // 2-5 seconds
    };

    startLoading();

    return () => {
      clearTimeout(timeoutRef);
    };
  }, [config, onComplete, onError, state.retryCount]);

  return <StandardLoadingScreen />;
};
