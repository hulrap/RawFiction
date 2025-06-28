import React, { useState, useEffect, useRef, useCallback } from 'react';
import { EmbeddedWebsiteFrame } from '../../shared/EmbeddedWebsiteFrame';
import { useEmbeddedLoading, EmbeddedLoadingIndicator } from './Loading';

interface EmbeddedWrapperProps {
  url: string;
  title: string;
  id: string;
  className?: string;
  style?: React.CSSProperties;
  fallbackContent?: React.ReactNode;
  onError?: (error: string) => void;
  onSuccess?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorInfo?: string;
  errorId: string;
  retryCount: number;
}

export const EmbeddedWrapper: React.FC<EmbeddedWrapperProps> = ({
  url,
  title,
  id,
  className = '',
  style,
  fallbackContent,
  onError,
  onSuccess,
}) => {
  const [errorState, setErrorState] = useState<ErrorBoundaryState>({
    hasError: false,
    errorId: '',
    retryCount: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout>();
  const healthCheckRef = useRef<NodeJS.Timeout>();

  const { state: loadingState, actions } = useEmbeddedLoading({
    url,
    title,
    timeout: 25000, // AI research sites may load slower
    maxRetries: 2,
    preloadDelay: 300,
    enablePreconnect: true,
  });

  const handleRecovery = useCallback(() => {
    setErrorState(prev => ({
      hasError: false,
      errorId: '',
      retryCount: prev.retryCount,
    }));

    // Re-initialize loading
    setTimeout(() => {
      actions.initiateLoad();
    }, 1000);
  }, [actions]);

  const handleComponentError = useCallback(
    (errorType: string, error: Error) => {
      const errorId = `${id}-${Date.now()}`;
      const errorMessage = `${errorType}: ${error.message}`;

      setErrorState(prev => {
        const newRetryCount = prev.retryCount + 1;

        // Auto-recovery attempt after 5 seconds
        if (newRetryCount < 3) {
          errorTimeoutRef.current = setTimeout(() => {
            handleRecovery();
          }, 5000);
        }

        return {
          hasError: true,
          errorInfo: errorMessage,
          errorId,
          retryCount: newRetryCount,
        };
      });

      onError?.(errorMessage);
    },
    [id, onError, handleRecovery]
  );

  // Health check for embedded content
  const performHealthCheck = useCallback(() => {
    try {
      const iframe = containerRef.current?.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        // Basic iframe accessibility check
        const isAccessible = iframe.offsetHeight > 0 && iframe.offsetWidth > 0;
        if (!isAccessible && loadingState.isLoaded) {
          throw new Error('Iframe became inaccessible');
        }
      }
    } catch (error) {
      handleComponentError('Health check failure', error as Error);
    }
  }, [loadingState.isLoaded, handleComponentError]);

  // Periodic health monitoring
  useEffect(() => {
    if (loadingState.isLoaded && !errorState.hasError) {
      healthCheckRef.current = setInterval(performHealthCheck, 45000); // Check every 45 seconds (less aggressive for academic sites)
    }

    return () => {
      if (healthCheckRef.current) {
        clearInterval(healthCheckRef.current);
      }
    };
  }, [loadingState.isLoaded, errorState.hasError, performHealthCheck]);

  const handleLoadSuccess = useCallback(() => {
    setErrorState({
      hasError: false,
      errorId: '',
      retryCount: 0,
    });

    actions.handleLoadSuccess();
    onSuccess?.();
  }, [actions, onSuccess]);

  const handleLoadError = useCallback(
    (error: string) => {
      handleComponentError('Load Error', new Error(error));
      actions.handleLoadError(error);
    },
    [handleComponentError, actions]
  );

  const manualRetry = useCallback(() => {
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
    handleRecovery();
  }, [handleRecovery]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      if (healthCheckRef.current) {
        clearInterval(healthCheckRef.current);
      }
    };
  }, []);

  // Critical error boundary - prevents crash propagation
  if (errorState.hasError && errorState.retryCount >= 3) {
    return (
      <div id={id} className={`relative ${className}`} style={style}>
        <div className="absolute inset-0 bg-gray-900 border border-red-500 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="text-red-500 text-4xl mb-4">🤖</div>
            <h3 className="text-lg font-semibold text-white mb-2">AI Alignment Space Isolated</h3>
            <p className="text-sm text-gray-300 mb-4">
              The AI safety research platform has been isolated due to connection issues
            </p>
            <p className="text-xs text-gray-500 mb-6">Error ID: {errorState.errorId}</p>
            {fallbackContent || (
              <div className="text-center">
                <button
                  onClick={manualRetry}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded mr-2"
                >
                  Reconnect
                </button>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  Visit AI Alignment Space
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id={id} className={`relative ${className}`} style={style} ref={containerRef}>
      <EmbeddedWebsiteFrame
        url={url}
        title={title}
        onLoad={handleLoadSuccess}
        onError={handleLoadError}
      />

      <EmbeddedLoadingIndicator state={loadingState} title={title} onRetry={actions.manualRetry} />

      {errorState.hasError && errorState.retryCount < 3 && (
        <div className="absolute top-4 right-4 bg-yellow-600 text-white px-3 py-1 rounded text-sm z-20">
          Recovering... ({errorState.retryCount}/3)
        </div>
      )}
    </div>
  );
};
