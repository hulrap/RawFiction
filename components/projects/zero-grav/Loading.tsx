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

// Space-themed loading indicator for embedded content
export const ContentLoadingIndicator: React.FC<{
  isLoading: boolean;
  progress: number;
  type: 'tab' | 'gallery' | 'general';
  message?: string;
}> = ({ isLoading, progress, type, message }) => {
  if (!isLoading) return null;

  const getSpaceIcon = () => {
    switch (type) {
      case 'tab':
        return '🚀'; // Rocket for website loading
      case 'gallery':
        return '🌌'; // Galaxy for content loading
      default:
        return '⭐'; // Star for general loading
    }
  };

  const getSpaceMessage = () => {
    if (message) return message;

    switch (type) {
      case 'tab':
        return 'Docking with space platform...';
      case 'gallery':
        return 'Loading cosmic marketplace...';
      default:
        return 'Establishing zero gravity connection...';
    }
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center z-10 backdrop-blur-sm">
      <div className="text-center bg-gradient-to-br from-purple-900 to-indigo-900 border border-purple-400/50 rounded-xl p-8 shadow-2xl max-w-sm mx-4">
        <div className="text-4xl mb-4 animate-pulse">{getSpaceIcon()}</div>
        <div className="text-purple-100 text-sm font-medium mb-4">{getSpaceMessage()}</div>
        <div className="w-48 bg-gradient-to-r from-purple-800 to-indigo-800 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-300 h-3 rounded-full transition-all duration-700 ease-out shadow-lg animate-pulse"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs text-purple-300 mt-3 font-medium tracking-wider">
          {progress}% LOADED
        </div>
        <div className="text-xs text-indigo-400 mt-1 opacity-75">Zero Grav • Space Platform</div>
      </div>
    </div>
  );
};

export const EmbeddedLoadingIndicator: React.FC<{
  state: EmbeddedLoadingState;
  title: string;
  onRetry?: () => void;
}> = ({ state, title, onRetry }) => {
  if (state.isLoaded) return null;

  if (state.hasError) {
    return (
      <div className="absolute inset-0 bg-black bg-opacity-95 flex items-center justify-center z-10">
        <div className="text-center p-8 max-w-md bg-gradient-to-br from-red-900/80 to-purple-900/80 rounded-xl border border-red-400/50 shadow-2xl">
          <div className="text-red-400 text-5xl mb-4">🛸</div>
          <h3 className="text-lg font-semibold text-red-200 mb-2">Launch Failed</h3>
          <p className="text-sm text-red-300 mb-6 leading-relaxed">{state.errorMessage}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg"
            >
              🚀 Retry Launch
            </button>
          )}
        </div>
      </div>
    );
  }

  if (state.isLoading) {
    return (
      <div className="absolute inset-0 bg-black bg-opacity-85 flex items-center justify-center z-10">
        <div className="text-center bg-gradient-to-br from-purple-900/80 to-indigo-900/80 rounded-xl p-8 border border-purple-400/50 shadow-2xl">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-400/30 border-t-purple-400 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-2xl animate-pulse">🌌</div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-purple-100 mb-4">Launching {title}</h3>
          <div className="w-64 bg-gradient-to-r from-purple-800 to-indigo-800 rounded-full h-3 mb-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-400 to-pink-400 h-3 rounded-full transition-all duration-500 animate-pulse"
              style={{ width: `${state.loadingProgress}%` }}
            />
          </div>
          <p className="text-xs text-purple-300 font-medium">
            {Math.round(state.loadingProgress)}% LOADED
          </p>
        </div>
      </div>
    );
  }

  return null;
};
