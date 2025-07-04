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
    batchSize: 2, // Conservative for heavy fashion images
    intersectionThreshold: 0.2, // Higher threshold for luxury experience
    preloadDistance: 1, // Conservative preloading for large files
  });

  // Circuit breaker logic
  const shouldBreakCircuit = useCallback(
    (errorCount: number, timeWindow: number = 30000) => {
      return errorCount >= 5 && Date.now() - errorState.lastErrorTime < timeWindow;
    },
    [errorState.lastErrorTime]
  );

  const attemptRecovery = useCallback(
    (errorType: 'tab' | 'gallery' | 'image' | 'general', errorId: string) => {
      // Production-grade fashion recovery without console pollution

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

        onSuccess?.(`fashion-recovery-${errorType}-${errorId}`);
      } catch (recoveryError) {
        console.warn(`Fashion recovery failed for ${errorType}: ${errorId}`, recoveryError);
        // Increase backoff for failed recovery
        setRecoveryState(prev => ({
          ...prev,
          backoffMultiplier: prev.backoffMultiplier * 2,
        }));
      }
    },
    [actions, onSuccess]
  );

  // Fashion brand recovery scheduling
  const scheduleRecovery = useCallback(
    (errorType: 'tab' | 'gallery' | 'image' | 'general', errorId: string) => {
      if (errorState.isCircuitOpen) return;

      const backoffDelay = Math.min(
        1000 * Math.pow(2, recoveryState.attempts) * recoveryState.backoffMultiplier,
        18000 // Max 18 seconds for fashion content
      );

      recoveryTimeoutRef.current = setTimeout(() => {
        attemptRecovery(errorType, errorId);
      }, backoffDelay);

      setRecoveryState(prev => ({
        attempts: prev.attempts + 1,
        lastAttempt: Date.now(),
        backoffMultiplier: Math.min(prev.backoffMultiplier * 1.5, 4),
      }));
    },
    [
      errorState.isCircuitOpen,
      recoveryState.attempts,
      recoveryState.backoffMultiplier,
      attemptRecovery,
    ]
  );

  // Smart error handling with fashion brand protection
  const handleComponentError = useCallback(
    (
      errorType: 'tab' | 'gallery' | 'image' | 'general',
      errorId: string,
      error: Error,
      context?: string
    ) => {
      const errorMessage = `${errorType.toUpperCase()} Error in ${errorId}: ${error.message}`;
      const now = Date.now();

      // Professional error logging for fashion brand
      const errorReport = {
        type: errorType,
        id: errorId,
        error: error.message,
        context,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        brand: 'Raw Fiction',
      };

      // Log for monitoring but avoid console pollution in production
      if (process.env.NODE_ENV === 'development') {
        console.error(`[${id}] Raw Fiction error:`, errorReport);
      }

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

      // Schedule fashion recovery
      scheduleRecovery(errorType, errorId);
    },
    [id, onError, shouldBreakCircuit, scheduleRecovery]
  );

  // Health monitoring for luxury fashion content
  const performHealthCheck = useCallback(() => {
    try {
      const container = containerRef.current;
      if (!container) return;

      // Check tab container accessibility
      const tabContainer = container.querySelector('[role="tablist"]') as HTMLElement;
      if (tabContainer && !tabContainer.offsetParent) {
        throw new Error('Fashion tab container became inaccessible');
      }

      // Check visible high-resolution images are loading properly
      const visibleImages = container.querySelectorAll('img[data-image-id]');
      visibleImages.forEach(img => {
        const imageElement = img as HTMLImageElement;
        if (imageElement.complete && imageElement.naturalWidth === 0) {
          const imageId = imageElement.getAttribute('data-image-id');
          if (imageId && !errorState.brokenImages.has(imageId)) {
            handleComponentError(
              'image',
              imageId,
              new Error('High-resolution fashion image failed to load')
            );
          }
        }
      });
    } catch (error) {
      handleComponentError('general', 'health-check', error as Error, 'luxury-health-check');
    }
  }, [errorState.brokenImages, handleComponentError]);

  // Enhanced tab switching with luxury error isolation
  const handleTabChange = useCallback(
    (tabId: string) => {
      if (errorState.brokenTabs.has(tabId)) {
        console.warn(`Skipping broken luxury tab: ${tabId}`);
        return;
      }

      try {
        actions.loadTab(tabId);
        onSuccess?.(`luxury-tab-switch-${tabId}`);
      } catch (error) {
        handleComponentError('tab', tabId, error as Error, 'luxury-tab-switching');
      }
    },
    [errorState.brokenTabs, actions, onSuccess, handleComponentError]
  );

  // Protected gallery opening for fashion collections
  const handleGalleryOpen = useCallback(
    (galleryId: string, tabId: string) => {
      if (errorState.brokenGalleries.has(galleryId)) {
        console.warn(`Skipping broken fashion gallery: ${galleryId}`);
        return;
      }

      try {
        actions.openGallery(galleryId, tabId);
        onSuccess?.(`luxury-gallery-open-${galleryId}`);
      } catch (error) {
        handleComponentError('gallery', galleryId, error as Error, 'luxury-gallery-opening');
      }
    },
    [errorState.brokenGalleries, actions, onSuccess, handleComponentError]
  );

  // Protected image observation for high-resolution fashion images
  const handleImageObservation = useCallback(
    (element: HTMLElement, imageId: string) => {
      if (errorState.brokenImages.has(imageId)) {
        return;
      }

      try {
        actions.observeImage(element, imageId);
      } catch (error) {
        handleComponentError('image', imageId, error as Error, 'luxury-image-observation');
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

  // Protected luxury fashion tabs with error boundaries
  const protectedTabs: TabItem[] = tabs.map(tab => ({
    ...tab,
    content: errorState.brokenTabs.has(tab.id) ? (
      <div className="flex items-center justify-center h-64 text-center">
        <div className="bg-gray-800/80 rounded-xl p-8 border border-gray-600/50 shadow-2xl">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-semibold">RF</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-200 mb-2">
            Collection Temporarily Unavailable
          </h3>
          <p className="text-sm text-gray-300 mb-4 leading-relaxed">
            This fashion collection is being carefully restored.
            <br />
            Our team is ensuring optimal viewing experience.
          </p>
          <button
            onClick={() => attemptRecovery('tab', tab.id)}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-all duration-200 shadow-lg"
          >
            Restore Collection
          </button>
        </div>
      </div>
    ) : (
      tab.content
    ),
  }));

  // Initialize luxury health monitoring
  useEffect(() => {
    if (!errorState.isCircuitOpen) {
      healthCheckRef.current = setInterval(performHealthCheck, 20000); // Check every 20 seconds for luxury content
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

  // Luxury fashion circuit breaker open state
  if (errorState.isCircuitOpen) {
    return (
      <div id={id} className={`relative ${className}`} style={style}>
        <div className="absolute inset-0 bg-gray-900/80 border-2 border-gray-600/60 flex items-center justify-center backdrop-blur-lg">
          <div className="text-center p-10 bg-gray-800/90 rounded-2xl border border-gray-600/50 shadow-2xl max-w-md">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-xl">RF</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-100 mb-3">Protection Mode</h3>
            <p className="text-sm text-gray-200 mb-4 leading-relaxed">
              Our fashion collections are under protective care due to system stress.
              <br />
              <span className="text-gray-300">Content requires optimal conditions.</span>
            </p>
            <div className="bg-gray-700/50 rounded-lg p-4 mb-6 text-xs text-gray-300 space-y-1">
              <div>Events: {errorState.errorCount}</div>
              <div>Last Issue: {new Date(errorState.lastErrorTime).toLocaleTimeString()}</div>
              <div className="text-gray-400">Safety Protocol: ACTIVE</div>
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
              className="px-8 py-4 bg-gray-600 hover:bg-gray-500 text-white rounded-xl font-bold shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Restore Access
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
          message="Curating fashion content..."
        />

        {/* Status indicator */}
        {(errorState.brokenTabs.size > 0 || errorState.brokenImages.size > 0) && (
          <div className="absolute top-4 right-4 bg-gray-800/90 text-white px-5 py-2 rounded-xl text-xs font-medium shadow-xl z-20 border border-gray-600/50">
            Curating: {errorState.brokenTabs.size} collections, {errorState.brokenImages.size}{' '}
            images
          </div>
        )}
      </div>
    </WrapperContext.Provider>
  );
};
