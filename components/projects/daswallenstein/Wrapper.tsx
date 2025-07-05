import React, { useState, useEffect, useRef, useCallback } from 'react';
import { EmbeddedWebsiteFrame } from '../../shared/EmbeddedWebsiteFrame';
import { useEmbeddedLoading, EmbeddedLoadingIndicator } from './Loading';
import type { TabItem } from '../../shared/types';

interface EmbeddedWrapperProps {
  id: string;
  tabs: TabItem[];
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
  tabs,
  className = '',
  style,
  fallbackContent,
  onError,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id || '');
  const [errorState, setErrorState] = useState<ErrorBoundaryState>({
    hasError: false,
    errorId: '',
    retryCount: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout>();
  const healthCheckRef = useRef<NodeJS.Timeout>();

  // Find the website tab (assumed to be the first tab with EmbeddedWebsiteFrame)
  const websiteTab = tabs.find(
    tab => React.isValidElement(tab.content) && tab.content.type === EmbeddedWebsiteFrame
  );

  const { state: loadingState, actions } = useEmbeddedLoading({
    url: 'https://www.daswallenstein.wien/', // Default URL for loading states
    title: 'Das Wallenstein',
    timeout: 25000, // European cultural sites may load slower
    maxRetries: 2, // Conservative for cultural venues
    preloadDelay: 250, // Refined delay for Austrian elegance
    enablePreconnect: true,
  });

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onSuccess?.();
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
    if (loadingState.isLoaded && !errorState.hasError && activeTab === websiteTab?.id) {
      healthCheckRef.current = setInterval(performHealthCheck, 40000); // Check every 40 seconds (respectful for cultural venues)
    }

    return () => {
      if (healthCheckRef.current) {
        clearInterval(healthCheckRef.current);
      }
    };
  }, [loadingState.isLoaded, errorState.hasError, activeTab, websiteTab?.id, performHealthCheck]);

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
                  href="https://www.daswallenstein.wien/"
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
      {/* Tab structure */}
      <div className="tab-container h-full">
        <div className="tab-header">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.title}
            </button>
          ))}
        </div>

        <div className="tab-content content-area">
          {tabs.find(tab => tab.id === activeTab)?.content}
        </div>
      </div>

      {/* Loading and error states only for website tab */}
      {activeTab === websiteTab?.id && (
        <>
          <EmbeddedLoadingIndicator
            state={loadingState}
            title="Das Wallenstein"
            onRetry={actions.manualRetry}
          />

          {errorState.hasError && errorState.retryCount < 3 && (
            <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded text-sm z-20">
              Reconnecting... ({errorState.retryCount}/3)
            </div>
          )}
        </>
      )}
    </div>
  );
};
