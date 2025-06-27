import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { TabContainer } from '../../shared/TabContainer';

import {
  useContentLoading,
  ContentLoadingIndicator,
  type TabLoadingConfig,
  type ImageLoadingConfig,
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
  loadingState: any;
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
    batchSize: 4, // Higher for static content
    intersectionThreshold: 0.1, // Standard for lightweight content
    preloadDistance: 2, // More aggressive for static content
  });

  // Business-grade circuit breaker for marketing content
  const shouldBreakCircuit = useCallback(
    (errorCount: number, timeWindow: number = 45000) => {
      return errorCount >= 7 && Date.now() - errorState.lastErrorTime < timeWindow; // More tolerant for static content
    },
    [errorState.lastErrorTime]
  );

  // Professional error handling for business content
  const handleComponentError = useCallback(
    (
      errorType: 'tab' | 'gallery' | 'image' | 'general',
      errorId: string,
      error: Error,
      context?: string
    ) => {
      const errorMessage = `${errorType.toUpperCase()} Error in ${errorId}: ${error.message}`;
      const now = Date.now();

      console.error(`[${id}] Social Media Consulting error:`, {
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

        let newState = {
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

      // Schedule business recovery
      if (!errorState.isCircuitOpen) {
        scheduleRecovery(errorType, errorId);
      }
    },
    [id, onError, shouldBreakCircuit, errorState.isCircuitOpen]
  );

  // Business-optimized recovery for marketing content
  const scheduleRecovery = useCallback(
    (errorType: 'tab' | 'gallery' | 'image' | 'general', errorId: string) => {
      const backoffDelay = Math.min(
        500 * Math.pow(1.5, recoveryState.attempts) * recoveryState.backoffMultiplier, // Faster recovery for static content
        15000 // Max 15 seconds for business content
      );

      recoveryTimeoutRef.current = setTimeout(() => {
        attemptRecovery(errorType, errorId);
      }, backoffDelay);

      setRecoveryState(prev => ({
        attempts: prev.attempts + 1,
        lastAttempt: Date.now(),
        backoffMultiplier: Math.min(prev.backoffMultiplier * 1.3, 3), // Gentler backoff for static content
      }));
    },
    [recoveryState.attempts, recoveryState.backoffMultiplier]
  );

  const attemptRecovery = useCallback(
    (errorType: 'tab' | 'gallery' | 'image' | 'general', errorId: string) => {
      console.log(`Attempting business recovery for ${errorType}: ${errorId}`);

      try {
        setErrorState(prev => {
          let newState = { ...prev };

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

        onSuccess?.(`business-recovery-${errorType}-${errorId}`);
      } catch (recoveryError) {
        console.warn(`Business recovery failed for ${errorType}: ${errorId}`, recoveryError);
        // Increase backoff for failed recovery
        setRecoveryState(prev => ({
          ...prev,
          backoffMultiplier: prev.backoffMultiplier * 2,
        }));
      }
    },
    [actions, onSuccess]
  );

  // Business content health monitoring
  const performHealthCheck = useCallback(() => {
    try {
      const container = containerRef.current;
      if (!container) return;

      // Check business content accessibility
      const tabContainer = container.querySelector('[role="tablist"]') as HTMLElement;
      if (tabContainer && !tabContainer.offsetParent) {
        throw new Error('Business content container became inaccessible');
      }

      // Lightweight monitoring for static content (no heavy images)
      const contentElements = container.querySelectorAll('[data-content-loaded]');
      contentElements.forEach(element => {
        if (!element.offsetParent) {
          console.warn('Static content element became inaccessible');
        }
      });
    } catch (error) {
      handleComponentError('general', 'health-check', error as Error, 'business-health-check');
    }
  }, [handleComponentError]);

  // Professional tab switching for business content
  const handleTabChange = useCallback(
    (tabId: string) => {
      if (errorState.brokenTabs.has(tabId)) {
        console.warn(`Skipping broken business tab: ${tabId}`);
        return;
      }

      try {
        actions.loadTab(tabId);
        onSuccess?.(`business-tab-switch-${tabId}`);
      } catch (error) {
        handleComponentError('tab', tabId, error as Error, 'business-tab-switching');
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

  // Professional business tabs with error boundaries
  const protectedTabs: TabItem[] = tabs.map(tab => ({
    ...tab,
    content: errorState.brokenTabs.has(tab.id) ? (
      <div className="flex items-center justify-center h-64 text-center">
        <div className="bg-gradient-to-br from-blue-900/60 to-cyan-900/60 rounded-xl p-8 border border-blue-400/50 shadow-2xl">
          <div className="text-5xl mb-4">📱</div>
          <h3 className="text-lg font-semibold text-blue-200 mb-2">
            Content Temporarily Unavailable
          </h3>
          <p className="text-sm text-blue-300 mb-4 leading-relaxed">
            This business content section is being optimized.
            <br />
            Our systems are ensuring optimal performance.
          </p>
          <button
            onClick={() => attemptRecovery('tab', tab.id)}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg"
          >
            🚀 Restore Content
          </button>
        </div>
      </div>
    ) : (
      tab.content
    ),
  }));

  // Initialize business content monitoring
  useEffect(() => {
    if (!errorState.isCircuitOpen) {
      healthCheckRef.current = setInterval(performHealthCheck, 30000); // Check every 30 seconds for static content
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

  // Business continuity protection mode
  if (errorState.isCircuitOpen) {
    return (
      <div id={id} className={`relative ${className}`} style={style}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border-2 border-blue-400/60 flex items-center justify-center backdrop-blur-lg">
          <div className="text-center p-10 bg-gradient-to-br from-blue-900/80 to-cyan-900/80 rounded-2xl border border-blue-300/50 shadow-2xl max-w-md">
            <div className="text-blue-300 text-7xl mb-6">📊</div>
            <h3 className="text-2xl font-bold text-blue-100 mb-3">Business Protection Mode</h3>
            <p className="text-sm text-blue-200 mb-4 leading-relaxed">
              Our social media consulting platform is under protective care.
              <br />
              <span className="text-cyan-300">Business continuity protocols activated.</span>
            </p>
            <div className="bg-blue-800/50 rounded-lg p-4 mb-6 text-xs text-blue-300 space-y-1">
              <div>System Events: {errorState.errorCount}</div>
              <div>Last Issue: {new Date(errorState.lastErrorTime).toLocaleTimeString()}</div>
              <div className="text-cyan-400">Business Protection: ACTIVE</div>
            </div>
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
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-bold shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              📈 Restore Business Access
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
          message="Loading marketing insights..."
        />

        {/* Business status indicator */}
        {(errorState.brokenTabs.size > 0 || errorState.brokenImages.size > 0) && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600/90 to-cyan-600/90 text-white px-5 py-2 rounded-xl text-xs font-medium shadow-xl z-20 border border-blue-400/50">
            📱 Optimizing: {errorState.brokenTabs.size} sections
          </div>
        )}
      </div>
    </WrapperContext.Provider>
  );
};
