import React, { useState, useEffect, useRef, useCallback } from 'react';
import { EmbeddedWebsiteFrame } from '../../shared/EmbeddedWebsiteFrame';
import { useEmbeddedLoading, EmbeddedLoadingIndicator } from './Loading';
import type { SiteConfig } from '../../shared/types';

interface EmbeddedWrapperProps {
  id: string;
  siteConfig: SiteConfig;
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
  isCSPError?: boolean;
}

export const EmbeddedWrapper: React.FC<EmbeddedWrapperProps> = ({
  id,
  siteConfig,
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
    url: siteConfig.url,
    title: siteConfig.title,
    timeout: siteConfig.loading.timeout,
    maxRetries: siteConfig.loading.retryCount,
    preloadDelay: 200,
    enablePreconnect: siteConfig.loading.enablePreconnect,
  });

  const handleRecovery = useCallback(() => {
    setErrorState(prev => ({
      hasError: false,
      errorId: '',
      retryCount: prev.retryCount,
      isCSPError: false,
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

      // Detect CSP errors
      const isCSPError =
        errorMessage.includes('Content Security Policy') ||
        errorMessage.includes('frame-ancestors') ||
        errorMessage.includes('Refused to frame') ||
        siteConfig.csp.frameAncestors === 'none';

      setErrorState(prev => {
        const newRetryCount = prev.retryCount + 1;

        // For CSP errors, don't retry - show fallback immediately
        if (isCSPError) {
          return {
            hasError: true,
            errorInfo: 'CSP restriction detected',
            errorId,
            retryCount: newRetryCount,
            isCSPError: true,
          };
        }

        // Auto-recovery attempt after delay for non-CSP errors
        if (newRetryCount < siteConfig.loading.retryCount) {
          const delay =
            siteConfig.loading.retryDelay *
            (siteConfig.loading.rateLimit?.backoff === 'exponential'
              ? Math.pow(2, newRetryCount - 1)
              : 1);

          errorTimeoutRef.current = setTimeout(() => {
            handleRecovery();
          }, delay);
        }

        return {
          hasError: true,
          errorInfo: errorMessage,
          errorId,
          retryCount: newRetryCount,
          isCSPError: false,
        };
      });

      onError?.(errorMessage);
    },
    [id, onError, handleRecovery, siteConfig]
  );

  // Health check for embedded content
  const performHealthCheck = useCallback(() => {
    try {
      const iframe = containerRef.current?.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
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
      healthCheckRef.current = setInterval(performHealthCheck, 35000);
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
      isCSPError: false,
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

  // CSP error or critical error boundary
  if (
    errorState.hasError &&
    (errorState.isCSPError || errorState.retryCount >= siteConfig.loading.retryCount)
  ) {
    return (
      <div id={id} className={`relative ${className}`} style={style}>
        <div className="absolute inset-0 bg-gray-900 border border-purple-500 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="text-purple-500 text-4xl mb-4">🏳️‍🌈</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {errorState.isCSPError ? 'Queer Alliance Protected' : 'Connection Issues'}
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              {errorState.isCSPError
                ? 'This community platform prevents embedding for security.'
                : 'The community platform is experiencing connection issues.'}
            </p>
            {!errorState.isCSPError && (
              <p className="text-xs text-gray-500 mb-6">Error ID: {errorState.errorId}</p>
            )}

            {/* Use fallback content or default actions */}
            {fallbackContent || (
              <div className="text-center space-y-4">
                <p className="text-xs text-gray-400 mb-4">
                  Queer Alliance builds inclusive communities and supports LGBTQ+ individuals
                  worldwide.
                </p>
                {!errorState.isCSPError && (
                  <button
                    onClick={manualRetry}
                    className="px-4 py-2 text-white rounded mr-2 transition-colors"
                    style={{
                      background:
                        'linear-gradient(45deg, #e40303, #ff8c00, #ffed00, #008018, #0066cc, #732982)',
                    }}
                  >
                    Reconnect
                  </button>
                )}
                <a
                  href={siteConfig.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                >
                  Visit Queer Alliance
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
        url={siteConfig.url}
        title={siteConfig.title}
        siteConfig={siteConfig}
        onLoad={handleLoadSuccess}
        onError={handleLoadError}
      />

      <EmbeddedLoadingIndicator
        state={loadingState}
        title={siteConfig.title}
        onRetry={actions.manualRetry}
      />

      {errorState.hasError &&
        errorState.retryCount < siteConfig.loading.retryCount &&
        !errorState.isCSPError && (
          <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded text-sm z-20">
            Reconnecting... ({errorState.retryCount}/{siteConfig.loading.retryCount})
          </div>
        )}
    </div>
  );
};
