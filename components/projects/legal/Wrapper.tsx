import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { TabContainer } from '../../shared/TabContainer';

import {
  useContentLoading,
  ContentLoadingIndicator,
  type TabLoadingConfig,
  type ImageLoadingConfig,
  type ContentLoadingState,
} from './Loading';
import type { TabItem } from '../../shared/types';

// Context for sharing wrapper utilities with child components
interface WrapperContextType {
  handleTabChange: (tabId: string) => void;
  handleGalleryOpen: (galleryId: string, tabId: string) => void;
  handleImageObservation: (element: HTMLElement, imageId: string) => void;
  isTabBroken: (tabId: string) => boolean;
  isGalleryBroken: (galleryId: string) => boolean;
  isImageBroken: (imageId: string) => boolean;
  loadingState: ContentLoadingState;
}

const WrapperContext = createContext<WrapperContextType | null>(null);

export const useWrapper = () => {
  const context = useContext(WrapperContext);
  if (!context) {
    console.warn('useWrapper must be used within a ContentWrapper component');
    return null;
  }
  return context;
};

interface ContentWrapperProps {
  id: string;
  tabs: TabItem[];
  className?: string;
  style?: React.CSSProperties;
  onError?: (error: string, context: string) => void;
  onSuccess?: (action: string) => void;
  loadingConfig: {
    tabs: TabLoadingConfig[];
    images: ImageLoadingConfig[];
  };
}

interface ErrorIsolationState {
  brokenTabs: Set<string>;
  brokenGalleries: Set<string>;
  brokenImages: Set<string>;
  errorCount: number;
  lastErrorTime: number;
  isCircuitOpen: boolean;
}

interface RecoveryState {
  attempts: number;
  lastAttempt: number;
  backoffMultiplier: number;
}

export const ContentWrapper: React.FC<ContentWrapperProps> = ({
  id,
  tabs,
  className = '',
  style,
  onError,
  onSuccess,
  loadingConfig,
}) => {
  const [errorState, setErrorState] = useState<ErrorIsolationState>({
    brokenTabs: new Set(),
    brokenGalleries: new Set(),
    brokenImages: new Set(),
    errorCount: 0,
    lastErrorTime: 0,
    isCircuitOpen: false,
  });

  const [recoveryState, setRecoveryState] = useState<RecoveryState>({
    attempts: 0,
    lastAttempt: 0,
    backoffMultiplier: 1,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const healthCheckRef = useRef<NodeJS.Timeout>();
  const recoveryTimeoutRef = useRef<NodeJS.Timeout>();

  const { state: loadingState, actions } = useContentLoading({
    tabs: loadingConfig.tabs,
    images: loadingConfig.images,
    batchSize: 1, // Ultra-conservative for legal document reliability
    intersectionThreshold: 0.2, // Higher threshold for professional performance
    preloadDistance: 1, // Conservative preloading for compliance
  });

  // Circuit breaker logic
  const shouldBreakCircuit = useCallback(
    (errorCount: number, timeWindow: number = 30000) => {
      return errorCount >= 5 && Date.now() - errorState.lastErrorTime < timeWindow;
    },
    [errorState.lastErrorTime]
  );

  // MOVED: attemptRecovery declaration before handleComponentError to fix temporal dead zone
  const attemptRecovery = useCallback(
    (errorType: 'tab' | 'gallery' | 'image' | 'general', errorId: string) => {
      console.warn(`Attempting recovery for ${errorType}: ${errorId}`);

      try {
        setErrorState(prev => {
          const newState = { ...prev };

          switch (errorType) {
            case 'tab':
              newState.brokenTabs = new Set([...prev.brokenTabs]);
              newState.brokenTabs.delete(errorId);
              // Re-attempt tab loading
              actions.loadTab(errorId);
              break;
            case 'gallery':
              newState.brokenGalleries = new Set([...prev.brokenGalleries]);
              newState.brokenGalleries.delete(errorId);
              break;
            case 'image':
              newState.brokenImages = new Set([...prev.brokenImages]);
              newState.brokenImages.delete(errorId);
              // Re-queue image loading
              actions.queueImageLoad(errorId, 'low');
              break;
          }

          return newState;
        });

        onSuccess?.(`recovery-${errorType}-${errorId}`);
      } catch (recoveryError) {
        console.warn(`Recovery failed for ${errorType}: ${errorId}`, recoveryError);
        // Increase backoff for failed recovery
        setRecoveryState(prev => ({
          ...prev,
          backoffMultiplier: prev.backoffMultiplier * 2,
        }));
      }
    },
    [actions, onSuccess]
  );

  // Smart error handling with context isolation
  const handleComponentError = useCallback(
    (
      errorType: 'tab' | 'gallery' | 'image' | 'general',
      errorId: string,
      error: Error,
      context?: string
    ) => {
      const errorMessage = `${errorType.toUpperCase()} Error in ${errorId}: ${error.message}`;
      const now = Date.now();

      console.error(`[${id}] Component error:`, {
        type: errorType,
        id: errorId,
        error: error.message,
        context,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      setErrorState(prev => {
        const newErrorCount = prev.errorCount + 1;
        const shouldOpen = shouldBreakCircuit(newErrorCount);

        const newState = {
          ...prev,
          errorCount: newErrorCount,
          lastErrorTime: now,
          isCircuitOpen: shouldOpen,
        };

        // Isolate the specific broken component
        switch (errorType) {
          case 'tab':
            newState.brokenTabs = new Set([...prev.brokenTabs, errorId]);
            break;
          case 'gallery':
            newState.brokenGalleries = new Set([...prev.brokenGalleries, errorId]);
            break;
          case 'image':
            newState.brokenImages = new Set([...prev.brokenImages, errorId]);
            break;
        }

        return newState;
      });

      onError?.(errorMessage, context || 'unknown');

      // Schedule smart recovery
      if (!errorState.isCircuitOpen) {
        const backoffDelay = Math.min(
          1000 * Math.pow(2, recoveryState.attempts) * recoveryState.backoffMultiplier,
          30000 // Max 30 seconds
        );

        recoveryTimeoutRef.current = setTimeout(() => {
          attemptRecovery(errorType, errorId);
        }, backoffDelay);

        setRecoveryState(prev => ({
          attempts: prev.attempts + 1,
          lastAttempt: Date.now(),
          backoffMultiplier: Math.min(prev.backoffMultiplier * 1.5, 4),
        }));
      }
    },
    [
      id,
      onError,
      shouldBreakCircuit,
      errorState.isCircuitOpen,
      recoveryState.attempts,
      recoveryState.backoffMultiplier,
      attemptRecovery,
    ]
  );

  // Health monitoring for internal content
  const performHealthCheck = useCallback(() => {
    try {
      const container = containerRef.current;
      if (!container) return;

      // Check tab container accessibility
      const tabContainer = container.querySelector('[role="tablist"]') as HTMLElement;
      if (tabContainer && !tabContainer.offsetParent) {
        throw new Error('Tab container became inaccessible');
      }

      // Check visible images are loading properly
      const visibleImages = container.querySelectorAll('img[data-image-id]');
      visibleImages.forEach(img => {
        const imageElement = img as HTMLImageElement;
        if (imageElement.complete && imageElement.naturalWidth === 0) {
          const imageId = imageElement.getAttribute('data-image-id');
          if (imageId && !errorState.brokenImages.has(imageId)) {
            handleComponentError('image', imageId, new Error('Image failed to load properly'));
          }
        }
      });
    } catch (error) {
      handleComponentError('general', 'health-check', error as Error, 'periodic-health-check');
    }
  }, [errorState.brokenImages, handleComponentError]);

  // Enhanced tab switching with error isolation
  const handleTabChange = useCallback(
    (tabId: string) => {
      if (errorState.brokenTabs.has(tabId)) {
        console.warn(`Skipping broken tab: ${tabId}`);
        return;
      }

      try {
        actions.loadTab(tabId);
        onSuccess?.(`tab-switch-${tabId}`);
      } catch (error) {
        handleComponentError('tab', tabId, error as Error, 'tab-switching');
      }
    },
    [errorState.brokenTabs, actions, onSuccess, handleComponentError]
  );

  // Protected gallery opening
  const handleGalleryOpen = useCallback(
    (galleryId: string, tabId: string) => {
      if (errorState.brokenGalleries.has(galleryId)) {
        console.warn(`Skipping broken gallery: ${galleryId}`);
        return;
      }

      try {
        actions.openGallery(galleryId, tabId);
        onSuccess?.(`gallery-open-${galleryId}`);
      } catch (error) {
        handleComponentError('gallery', galleryId, error as Error, 'gallery-opening');
      }
    },
    [errorState.brokenGalleries, actions, onSuccess, handleComponentError]
  );

  // Protected image observation
  const handleImageObservation = useCallback(
    (element: HTMLElement, imageId: string) => {
      if (errorState.brokenImages.has(imageId)) {
        return;
      }

      try {
        actions.observeImage(element, imageId);
      } catch (error) {
        handleComponentError('image', imageId, error as Error, 'image-observation');
      }
    },
    [errorState.brokenImages, actions, handleComponentError]
  );

  // Expose utility functions for child components
  const wrapperUtils = {
    handleTabChange,
    handleGalleryOpen,
    handleImageObservation,
    isTabBroken: (tabId: string) => errorState.brokenTabs.has(tabId),
    isGalleryBroken: (galleryId: string) => errorState.brokenGalleries.has(galleryId),
    isImageBroken: (imageId: string) => errorState.brokenImages.has(imageId),
    loadingState,
  };

  // Enhanced tabs with error boundaries
  const protectedTabs: TabItem[] = tabs.map(tab => ({
    ...tab,
    content: errorState.brokenTabs.has(tab.id) ? (
      <div className="flex items-center justify-center h-64 text-center">
        <div>
          <div className="text-3xl mb-4">⚖️</div>
          <h3 className="text-lg font-semibold mb-2">Legal Document Temporarily Unavailable</h3>
          <p className="text-sm text-gray-600 mb-4">
            This legal section is temporarily inaccessible for compliance review
          </p>
          <button
            onClick={() => attemptRecovery('tab', tab.id)}
            className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors"
          >
            Restore Access
          </button>
        </div>
      </div>
    ) : (
      tab.content
    ),
  }));

  // Initialize health monitoring
  useEffect(() => {
    if (!errorState.isCircuitOpen) {
      healthCheckRef.current = setInterval(performHealthCheck, 30000); // Check every 30 seconds (stable for legal documents)
    }

    return () => {
      if (healthCheckRef.current) {
        clearInterval(healthCheckRef.current);
      }
    };
  }, [errorState.isCircuitOpen, performHealthCheck]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (recoveryTimeoutRef.current) {
        clearTimeout(recoveryTimeoutRef.current);
      }
      if (healthCheckRef.current) {
        clearInterval(healthCheckRef.current);
      }
    };
  }, []);

  // Circuit breaker open state
  if (errorState.isCircuitOpen) {
    return (
      <div id={id} className={`relative ${className}`} style={style}>
        <div className="absolute inset-0 bg-red-900 bg-opacity-20 border border-red-500 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="text-blue-500 text-5xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-white mb-2">Legal Documentation Protected</h3>
            <p className="text-sm text-gray-300 mb-4">
              Multiple access attempts detected. Legal document protection activated for compliance.
            </p>
            <p className="text-xs text-gray-500 mb-6">
              Access Attempts: {errorState.errorCount} | Last Attempt:{' '}
              {new Date(errorState.lastErrorTime).toLocaleTimeString()}
            </p>
            <button
              onClick={() => {
                setErrorState(prev => ({
                  ...prev,
                  isCircuitOpen: false,
                  errorCount: 0,
                }));
                setRecoveryState({
                  attempts: 0,
                  lastAttempt: 0,
                  backoffMultiplier: 1,
                });
              }}
              className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded transition-colors"
            >
              Request Document Access
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <WrapperContext.Provider value={wrapperUtils}>
      <div id={id} className={`relative ${className}`} style={style} ref={containerRef}>
        <TabContainer
          tabs={protectedTabs}
          defaultTab={tabs[0]?.id || 'overview'}
          className="h-full"
        />

        {/* Expose wrapper utilities for child components */}
        <div
          style={{ display: 'none' }}
          data-wrapper-utils={JSON.stringify({
            tabsLoaded: Array.from(loadingState.tabsLoaded),
            imagesLoaded: Array.from(loadingState.imagesLoaded),
            brokenTabs: Array.from(errorState.brokenTabs),
            brokenImages: Array.from(errorState.brokenImages),
          })}
        />

        <ContentLoadingIndicator
          isLoading={loadingState.isTabLoading}
          progress={loadingState.loadingProgress}
          type="tab"
          message="Loading legal documentation..."
        />

        {/* Error status indicator */}
        {(errorState.brokenTabs.size > 0 || errorState.brokenImages.size > 0) && (
          <div className="absolute top-4 right-4 bg-blue-700 text-white px-3 py-1 rounded text-xs z-20">
            {errorState.brokenTabs.size} documents, {errorState.brokenImages.size} assets protected
          </div>
        )}
      </div>
    </WrapperContext.Provider>
  );
};
