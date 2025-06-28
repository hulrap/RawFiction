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
    timeout = 18000, // Creative agencies may have rich content
    maxRetries = 3, // Standard retries for business sites
    preloadDelay = 150, // Smooth delay for creative experience
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
        console.warn(`Failed to preconnect to ${url}:`, error);
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
          errorMessage: `Timeout: ${title} failed to load within ${timeout}ms`,
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
            errorMessage: `Creative Retry ${newRetryCount}/${maxRetries}: ${error}`,
            retryCount: newRetryCount,
          };
        }

        return {
          ...prev,
          isLoading: false,
          hasError: true,
          errorMessage: `Creative Connection Failed after ${maxRetries} attempts: ${error}`,
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
}> = ({ state, title, onRetry }) => {
  if (state.isLoaded) return null;

  if (state.hasError) {
    return (
      <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center z-10">
        <div className="text-center p-6 max-w-md">
          <div className="text-orange-400 text-2xl mb-4">🎬</div>
          <h3 className="text-lg font-semibold text-white mb-2">LA Agency Unavailable</h3>
          <p className="text-sm text-gray-300 mb-4">{state.errorMessage}</p>
          <p className="text-xs text-gray-400 mb-6">
            The creative agency platform may be experiencing high traffic or updates.
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 text-white rounded transition-colors"
              style={{ background: 'linear-gradient(45deg, #f97316, #fbbf24, #f97316)' }}
            >
              Reconnect to Agency
            </button>
          )}
        </div>
      </div>
    );
  }

  if (state.isLoading) {
    return (
      <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-white mb-2">Connecting to Creative Hub</h3>
          <p className="text-sm text-gray-300 mb-3">{title}</p>
          <div className="w-64 bg-gray-700 rounded-full h-2 mb-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${state.loadingProgress}%`,
                background: 'linear-gradient(90deg, #f97316, #fbbf24, #f59e0b, #d97706)',
              }}
            />
          </div>
          <p className="text-xs text-gray-400">{Math.round(state.loadingProgress)}%</p>
          <p className="text-xs text-gray-500 mt-2">Loading creative excellence...</p>
        </div>
      </div>
    );
  }

  return null;
};
