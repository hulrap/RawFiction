import React, { useState, useEffect, useRef, useCallback } from 'react';
import { EmbeddedWebsiteFrame } from '../../shared/EmbeddedWebsiteFrame';
import { useEmbeddedLoading, EmbeddedLoadingIndicator } from './Loading';
import type { SiteConfig } from '../../shared/types';

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
    timeout: 25000, // European cultural sites may load slower
    maxRetries: 2, // Conservative for cultural venues
    preloadDelay: 250, // Refined delay for Austrian elegance
    enablePreconnect: true,
  });

  // Site-specific configuration for secure sandbox
  const siteConfig: SiteConfig = {
    url,
    title,
    csp: {
      frameAncestors: ['*'], // More permissive for cultural venues
      bypassCSP: false,
    },
    loading: {
      method: 'direct',
      timeout: 30000, // Increased timeout for better success rate
      retryCount: 3, // More retries for reliability
      retryDelay: 3000,
      enablePreconnect: true,
      cacheBusting: false,
      rateLimit: {
        enabled: true,
        delay: 2000,
        backoff: 'linear',
      },
    },
    sandbox: {
      allowScripts: true,
      allowSameOrigin: true, // Required for functionality
      allowForms: true,
      allowPopups: false,
      allowDownloads: false,
      allowModals: true,
      allowTopNavigation: false,
      strictMode: false,
    },
  };

  const handleRecovery = useCallback(() => {
    setErrorState({
      hasError: false,
      errorId: '',
      retryCount: errorState.retryCount,
    });

    // Re-initialize loading
    setTimeout(() => {
      actions.initiateLoad();
    }, 1000);
  }, [errorState.retryCount, actions]);

  const handleComponentError = useCallback(
    (errorType: string, error: Error) => {
      const errorId = `${id}-${Date.now()}`;
      const errorMessage = `${errorType}: ${error.message}`;

      setErrorState(prev => ({
        hasError: true,
        errorInfo: errorMessage,
        errorId,
        retryCount: prev.retryCount + 1,
      }));

      onError?.(errorMessage);

      // Auto-recovery attempt after 5 seconds
      if (errorState.retryCount < 3) {
        errorTimeoutRef.current = setTimeout(() => {
          handleRecovery();
        }, 5000);
      }
    },
    [id, onError, errorState.retryCount, handleRecovery]
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
      healthCheckRef.current = setInterval(performHealthCheck, 40000); // Check every 40 seconds (respectful for cultural venues)
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
            <div className="text-red-500 text-4xl mb-4">🏰</div>
            <h3 className="text-lg font-semibold text-white mb-2">Das Wallenstein Protected</h3>
            <p className="text-sm text-gray-300 mb-4">
              The Vienna cultural venue has been protected due to connection issues
            </p>
            <p className="text-xs text-gray-500 mb-6">Error ID: {errorState.errorId}</p>
            {fallbackContent || (
              <div className="text-center">
                <button
                  onClick={manualRetry}
                  className="px-4 py-2 text-white rounded mr-2 transition-colors"
                  style={{ background: 'linear-gradient(45deg, #dc2626, #ffffff, #dc2626)' }}
                >
                  Reconnect
                </button>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded transition-colors"
                >
                  Visit Das Wallenstein
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
        siteConfig={siteConfig}
      />

      <EmbeddedLoadingIndicator state={loadingState} title={title} onRetry={actions.manualRetry} />

      {errorState.hasError && errorState.retryCount < 3 && (
        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded text-sm z-20">
          Reconnecting... ({errorState.retryCount}/3)
        </div>
      )}
    </div>
  );
};
