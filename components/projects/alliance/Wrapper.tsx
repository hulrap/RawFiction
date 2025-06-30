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
  // Wrapper initialized
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
    preloadDelay: siteConfig.loading.preloadDelay || 0,
    enablePreconnect: siteConfig.loading.enablePreconnect,
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
    });

    actions.handleLoadSuccess();
    onSuccess?.();
  }, [actions, onSuccess]);

  const handleLoadError = useCallback(
    (error: string) => {
      // For Cloudflare protection, skip retries and show fallback immediately
      if (error.includes('Cloudflare') || error.includes('security')) {
        setErrorState({
          hasError: true,
          errorInfo: 'Site protected by security measures',
          errorId: `${id}-security-${Date.now()}`,
          retryCount: 999, // Force immediate fallback
        });
        onError?.(error);
        return;
      }

      handleComponentError('Load Error', new Error(error));
      actions.handleLoadError(error);
    },
    [handleComponentError, actions, id, onError]
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
        <div className="absolute inset-0 bg-gray-900 border border-purple-500 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="text-purple-500 text-4xl mb-4">🏳️‍🌈</div>
            <h3 className="text-lg font-semibold text-white mb-2">Component Isolated</h3>
            <p className="text-sm text-gray-300 mb-4">
              {siteConfig.title} has been isolated to prevent system impact
            </p>
            <p className="text-xs text-gray-500 mb-6">Error ID: {errorState.errorId}</p>

            {/* Use fallback content or default actions */}
            {fallbackContent || (
              <div className="text-center space-y-4">
                <p className="text-xs text-gray-400 mb-4">
                  Queer Alliance builds inclusive communities and supports LGBTQ+ individuals
                  worldwide.
                </p>
                <button
                  onClick={manualRetry}
                  className="px-4 py-2 text-white rounded mr-2 transition-colors"
                  style={{
                    background:
                      'linear-gradient(45deg, #e40303, #ff8c00, #ffed00, #008018, #0066cc, #732982)',
                  }}
                >
                  Force Retry
                </button>
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
      {/* Direct iframe loading */}
      <div className={`absolute inset-0 ${loadingState.isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <EmbeddedWebsiteFrame
          key={`${id}-direct`}
          url={siteConfig.url}
          title={siteConfig.title}
          onLoad={handleLoadSuccess}
          onError={handleLoadError}
          siteConfig={siteConfig}
        />
      </div>

      <EmbeddedLoadingIndicator
        state={loadingState}
        title={siteConfig.title}
        onRetry={actions.manualRetry}
      />

      {errorState.hasError && errorState.retryCount < 3 && (
        <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded text-sm z-20">
          Recovering... ({errorState.retryCount}/3)
        </div>
      )}
    </div>
  );
};
