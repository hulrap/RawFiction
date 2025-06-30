import { useState, useEffect, useCallback, useRef } from 'react';

export interface EmbeddedLoadingState {
  isLoading: boolean;
  isLoaded: boolean;
  hasError: boolean;
  errorMessage?: string;
  loadingProgress: number;
  retryCount: number;
}

export interface EmbeddedLoadingConfig {
  url: string;
  title: string;
  timeout?: number;
  maxRetries?: number;
  preloadDelay?: number;
  enablePreconnect?: boolean;
}

export const useEmbeddedLoading = (config: EmbeddedLoadingConfig) => {
  const [state, setState] = useState<EmbeddedLoadingState>({
    isLoading: false,
    isLoaded: false,
    hasError: false,
    loadingProgress: 0,
    retryCount: 0,
  });

  const timeoutRef = useRef<NodeJS.Timeout>();
  const progressRef = useRef<NodeJS.Timeout>();
  const retryTimeoutRef = useRef<NodeJS.Timeout>();

  const {
    url,
    title,
    timeout = 30000, // Extended timeout for space platforms
    maxRetries = 3,
    preloadDelay = 500, // Longer preload for space optimization
    enablePreconnect = true,
  } = config;

  // DNS preconnect optimization
  useEffect(() => {
    if (enablePreconnect) {
      try {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = new URL(url).origin;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);

        return () => {
          if (document.head.contains(link)) {
            document.head.removeChild(link);
          }
        };
      } catch (error) {
        return; // Ensure all code paths return a value
      }
    }
    return; // Ensure the function always returns
  }, [url, enablePreconnect]);

  // Progress simulation for better UX
  const startProgressSimulation = useCallback(() => {
    setState(prev => ({ ...prev, loadingProgress: 0 }));

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 90) {
        progress = 90; // Stop at 90% until actual load
        clearInterval(interval);
      }
      setState(prev => ({ ...prev, loadingProgress: Math.min(progress, 90) }));
    }, 200);

    progressRef.current = interval;
  }, []);

  const stopProgressSimulation = useCallback(() => {
    if (progressRef.current) {
      clearInterval(progressRef.current);
    }
  }, []);

  const initiateLoad = useCallback(() => {
    setState(prev => {
      const newState: EmbeddedLoadingState = {
        ...prev,
        isLoading: true,
        hasError: false,
      };
      delete newState.errorMessage;
      return newState;
    });

    startProgressSimulation();

    // Set loading timeout
    timeoutRef.current = setTimeout(() => {
      if (!state.isLoaded) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          hasError: true,
          errorMessage: `Space Timeout: ${title} lost connection in zero gravity environment`,
        }));
        stopProgressSimulation();
      }
    }, timeout);
  }, [title, timeout, state.isLoaded, startProgressSimulation, stopProgressSimulation]);

  const handleLoadSuccess = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    stopProgressSimulation();

    setState(prev => ({
      ...prev,
      isLoading: false,
      isLoaded: true,
      hasError: false,
      loadingProgress: 100,
    }));
  }, [stopProgressSimulation]);

  const handleLoadError = useCallback(
    (error: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      stopProgressSimulation();

      setState(prev => {
        const newRetryCount = prev.retryCount + 1;

        if (newRetryCount < maxRetries) {
          // Schedule retry
          retryTimeoutRef.current = setTimeout(() => {
            setState(retry => ({ ...retry, retryCount: newRetryCount }));
            setTimeout(initiateLoad, 1000); // 1 second delay between retries
          }, 2000);

          return {
            ...prev,
            isLoading: false,
            hasError: true,
            errorMessage: `Space Retry ${newRetryCount}/${maxRetries}: ${error}`,
            retryCount: newRetryCount,
          };
        }

        return {
          ...prev,
          isLoading: false,
          hasError: true,
          errorMessage: `Space Mission Failed after ${maxRetries} launch attempts: ${error}`,
          retryCount: newRetryCount,
        };
      });
    },
    [maxRetries, initiateLoad, stopProgressSimulation]
  );

  const manualRetry = useCallback(() => {
    setState(prev => ({ ...prev, retryCount: 0 }));
    setTimeout(initiateLoad, preloadDelay);
  }, [initiateLoad, preloadDelay]);

  // Auto-start loading
  useEffect(() => {
    const timer = setTimeout(initiateLoad, preloadDelay);
    return () => clearTimeout(timer);
  }, [initiateLoad, preloadDelay]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, []);

  return {
    state,
    actions: {
      handleLoadSuccess,
      handleLoadError,
      manualRetry,
      initiateLoad,
    },
  };
};

export const EmbeddedLoadingIndicator: React.FC<{
  state: EmbeddedLoadingState;
  title: string;
  onRetry?: () => void;
}> = ({ state }) => {
  if (state.isLoading) {
    return (
      <div className="absolute inset-0 bg-black bg-opacity-85 flex items-center justify-center z-10">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-[var(--brand-glass)] border-t-[var(--brand-accent)] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return null;
};
