import React, {
  useEffect,
  useRef,
  useCallback,
  createContext,
  useContext,
  useReducer,
  useMemo,
} from 'react';
import { TabContainer } from '../../shared/TabContainer';

import {
  useContentLoading,
  ContentLoadingIndicator,
  type TabLoadingConfig,
  type ImageLoadingConfig,
  type ContentLoadingState,
} from './Loading';
import type { TabItem } from '../../shared/types';

// Strict typing for wrapper context
interface WrapperContextType {
  readonly handleTabChange: (tabId: string) => void;
  readonly handleGalleryOpen: (galleryId: string, tabId: string) => void;
  readonly handleImageObservation: (element: HTMLElement, imageId: string) => void;
  readonly isTabBroken: (tabId: string) => boolean;
  readonly isGalleryBroken: (galleryId: string) => boolean;
  readonly isImageBroken: (imageId: string) => boolean;
  readonly loadingState: ContentLoadingState;
}

const WrapperContext = createContext<WrapperContextType | null>(null);

export const useWrapper = (): WrapperContextType | null => {
  const context = useContext(WrapperContext);
  if (!context) {
    console.warn('useWrapper must be used within a ContentWrapper component');
    return null;
  }
  return context;
};

// Strict interface definitions
interface ContentWrapperProps {
  readonly id: string;
  readonly tabs: readonly TabItem[];
  readonly className?: string;
  readonly style?: React.CSSProperties;
  readonly onError?: (error: string, context: string) => void;
  readonly onSuccess?: (action: string) => void;
  readonly loadingConfig: {
    readonly tabs: readonly TabLoadingConfig[];
    readonly images: readonly ImageLoadingConfig[];
  };
}

// Consolidated state using useReducer
interface ComponentState {
  readonly errorState: {
    readonly brokenTabs: Set<string>;
    readonly brokenGalleries: Set<string>;
    readonly brokenImages: Set<string>;
    readonly errorCount: number;
    readonly lastErrorTime: number;
    readonly isCircuitOpen: boolean;
  };
  readonly recoveryState: {
    readonly attempts: number;
    readonly lastAttempt: number;
    readonly backoffMultiplier: number;
  };
}

// Action types for useReducer
type ComponentAction =
  | {
      readonly type: 'ADD_ERROR';
      readonly payload: {
        readonly errorType: 'tab' | 'gallery' | 'image';
        readonly errorId: string;
        readonly shouldBreakCircuit: boolean;
      };
    }
  | {
      readonly type: 'CLEAR_ERROR';
      readonly payload: {
        readonly errorType: 'tab' | 'gallery' | 'image';
        readonly errorId: string;
      };
    }
  | {
      readonly type: 'RESET_CIRCUIT';
    }
  | {
      readonly type: 'INCREMENT_RECOVERY';
    }
  | {
      readonly type: 'RECOVERY_FAILED';
    };

const initialState: ComponentState = {
  errorState: {
    brokenTabs: new Set<string>(),
    brokenGalleries: new Set<string>(),
    brokenImages: new Set<string>(),
    errorCount: 0,
    lastErrorTime: 0,
    isCircuitOpen: false,
  },
  recoveryState: {
    attempts: 0,
    lastAttempt: 0,
    backoffMultiplier: 1,
  },
};

function componentReducer(state: ComponentState, action: ComponentAction): ComponentState {
  switch (action.type) {
    case 'ADD_ERROR': {
      const { errorType, errorId, shouldBreakCircuit } = action.payload;
      const newErrorCount = state.errorState.errorCount + 1;

      let newBrokenTabs = state.errorState.brokenTabs;
      let newBrokenGalleries = state.errorState.brokenGalleries;
      let newBrokenImages = state.errorState.brokenImages;

      switch (errorType) {
        case 'tab':
          newBrokenTabs = new Set([...state.errorState.brokenTabs, errorId]);
          break;
        case 'gallery':
          newBrokenGalleries = new Set([...state.errorState.brokenGalleries, errorId]);
          break;
        case 'image':
          newBrokenImages = new Set([...state.errorState.brokenImages, errorId]);
          break;
      }

      return {
        ...state,
        errorState: {
          ...state.errorState,
          brokenTabs: newBrokenTabs,
          brokenGalleries: newBrokenGalleries,
          brokenImages: newBrokenImages,
          errorCount: newErrorCount,
          lastErrorTime: Date.now(),
          isCircuitOpen: shouldBreakCircuit,
        },
      };
    }

    case 'CLEAR_ERROR': {
      const { errorType, errorId } = action.payload;
      let newBrokenTabs = state.errorState.brokenTabs;
      let newBrokenGalleries = state.errorState.brokenGalleries;
      let newBrokenImages = state.errorState.brokenImages;

      switch (errorType) {
        case 'tab':
          newBrokenTabs = new Set([...state.errorState.brokenTabs]);
          newBrokenTabs.delete(errorId);
          break;
        case 'gallery':
          newBrokenGalleries = new Set([...state.errorState.brokenGalleries]);
          newBrokenGalleries.delete(errorId);
          break;
        case 'image':
          newBrokenImages = new Set([...state.errorState.brokenImages]);
          newBrokenImages.delete(errorId);
          break;
      }

      return {
        ...state,
        errorState: {
          ...state.errorState,
          brokenTabs: newBrokenTabs,
          brokenGalleries: newBrokenGalleries,
          brokenImages: newBrokenImages,
        },
      };
    }

    case 'RESET_CIRCUIT':
      return {
        ...state,
        errorState: {
          ...state.errorState,
          isCircuitOpen: false,
          errorCount: 0,
        },
        recoveryState: {
          attempts: 0,
          lastAttempt: 0,
          backoffMultiplier: 1,
        },
      };

    case 'INCREMENT_RECOVERY':
      return {
        ...state,
        recoveryState: {
          attempts: state.recoveryState.attempts + 1,
          lastAttempt: Date.now(),
          backoffMultiplier: Math.min(state.recoveryState.backoffMultiplier * 1.5, 4),
        },
      };

    case 'RECOVERY_FAILED':
      return {
        ...state,
        recoveryState: {
          ...state.recoveryState,
          backoffMultiplier: state.recoveryState.backoffMultiplier * 2,
        },
      };

    default:
      return state;
  }
}

export const ContentWrapper: React.FC<ContentWrapperProps> = React.memo(
  ({ id, tabs, className = '', style, onError, onSuccess, loadingConfig }) => {
    const [state, dispatch] = useReducer(componentReducer, initialState);

    const containerRef = useRef<HTMLDivElement>(null);
    const healthCheckRef = useRef<NodeJS.Timeout>();
    const recoveryTimeoutRef = useRef<NodeJS.Timeout>();

    // Memoized loading hook
    const { state: loadingState, actions } = useContentLoading(
      useMemo(
        () => ({
          tabs: [...loadingConfig.tabs],
          images: [...loadingConfig.images],
          batchSize: 2, // Conservative for stability
          intersectionThreshold: 0.15, // Higher threshold for better performance
          preloadDistance: 1, // Conservative preloading
        }),
        [loadingConfig.tabs, loadingConfig.images]
      )
    );

    // Memoized circuit breaker logic
    const shouldBreakCircuit = useCallback(
      (errorCount: number, timeWindow: number = 30000): boolean => {
        return errorCount >= 5 && Date.now() - state.errorState.lastErrorTime < timeWindow;
      },
      [state.errorState.lastErrorTime]
    );

    // Memoized recovery function
    const attemptRecovery = useCallback(
      (errorType: 'tab' | 'gallery' | 'image', errorId: string): void => {
        console.warn(`Attempting recovery for ${errorType}: ${errorId}`);

        try {
          dispatch({ type: 'CLEAR_ERROR', payload: { errorType, errorId } });

          switch (errorType) {
            case 'tab':
              actions.loadTab(errorId);
              break;
            case 'image':
              actions.queueImageLoad(errorId, 'low');
              break;
          }

          onSuccess?.(`recovery-${errorType}-${errorId}`);
        } catch (recoveryError) {
          console.warn(`Recovery failed for ${errorType}: ${errorId}`, recoveryError);
          dispatch({ type: 'RECOVERY_FAILED' });
        }
      },
      [actions, onSuccess]
    );

    // Memoized error handling
    const handleComponentError = useCallback(
      (
        errorType: 'tab' | 'gallery' | 'image' | 'general',
        errorId: string,
        error: Error,
        context?: string
      ): void => {
        const errorMessage = `${errorType.toUpperCase()} Error in ${errorId}: ${error.message}`;

        console.error(`[${id}] Component error:`, {
          type: errorType,
          id: errorId,
          error: error.message,
          context,
          stack: error.stack,
          timestamp: new Date().toISOString(),
        });

        if (errorType !== 'general') {
          const newErrorCount = state.errorState.errorCount + 1;
          const shouldOpen = shouldBreakCircuit(newErrorCount);

          dispatch({
            type: 'ADD_ERROR',
            payload: { errorType, errorId, shouldBreakCircuit: shouldOpen },
          });

          if (!state.errorState.isCircuitOpen) {
            const backoffDelay = Math.min(
              1000 *
                Math.pow(2, state.recoveryState.attempts) *
                state.recoveryState.backoffMultiplier,
              30000
            );

            recoveryTimeoutRef.current = setTimeout(() => {
              attemptRecovery(errorType, errorId);
            }, backoffDelay);

            dispatch({ type: 'INCREMENT_RECOVERY' });
          }
        }

        onError?.(errorMessage, context || 'unknown');
      },
      [
        id,
        onError,
        shouldBreakCircuit,
        state.errorState.errorCount,
        state.errorState.isCircuitOpen,
        state.recoveryState.attempts,
        state.recoveryState.backoffMultiplier,
        attemptRecovery,
      ]
    );

    // Memoized health check function
    const performHealthCheck = useCallback((): void => {
      try {
        const container = containerRef.current;
        if (!container) return;

        // Check tab container accessibility
        const tabContainer = container.querySelector('[role="tablist"]') as HTMLElement | null;
        if (tabContainer && !tabContainer.offsetParent) {
          throw new Error('Tab container became inaccessible');
        }

        // Check visible images are loading properly
        const visibleImages = container.querySelectorAll('img[data-image-id]');
        visibleImages.forEach(img => {
          const imageElement = img as HTMLImageElement;
          if (imageElement.complete && imageElement.naturalWidth === 0) {
            const imageId = imageElement.getAttribute('data-image-id');
            if (imageId && !state.errorState.brokenImages.has(imageId)) {
              handleComponentError('image', imageId, new Error('Image failed to load properly'));
            }
          }
        });
      } catch (error) {
        handleComponentError('general', 'health-check', error as Error, 'periodic-health-check');
      }
    }, [state.errorState.brokenImages, handleComponentError]);

    // Memoized tab change handler
    const handleTabChange = useCallback(
      (tabId: string): void => {
        if (state.errorState.brokenTabs.has(tabId)) {
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
      [state.errorState.brokenTabs, actions, onSuccess, handleComponentError]
    );

    // Memoized gallery open handler
    const handleGalleryOpen = useCallback(
      (galleryId: string, tabId: string): void => {
        if (state.errorState.brokenGalleries.has(galleryId)) {
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
      [state.errorState.brokenGalleries, actions, onSuccess, handleComponentError]
    );

    // Memoized image observation handler
    const handleImageObservation = useCallback(
      (element: HTMLElement, imageId: string): void => {
        if (state.errorState.brokenImages.has(imageId)) {
          return;
        }

        try {
          actions.observeImage(element, imageId);
        } catch (error) {
          handleComponentError('image', imageId, error as Error, 'image-observation');
        }
      },
      [state.errorState.brokenImages, actions, handleComponentError]
    );

    // Memoized wrapper utilities
    const wrapperUtils = useMemo(
      (): WrapperContextType => ({
        handleTabChange,
        handleGalleryOpen,
        handleImageObservation,
        isTabBroken: (tabId: string): boolean => state.errorState.brokenTabs.has(tabId),
        isGalleryBroken: (galleryId: string): boolean =>
          state.errorState.brokenGalleries.has(galleryId),
        isImageBroken: (imageId: string): boolean => state.errorState.brokenImages.has(imageId),
        loadingState,
      }),
      [
        handleTabChange,
        handleGalleryOpen,
        handleImageObservation,
        state.errorState.brokenTabs,
        state.errorState.brokenGalleries,
        state.errorState.brokenImages,
        loadingState,
      ]
    );

    // Memoized protected tabs
    const protectedTabs = useMemo(
      (): TabItem[] =>
        tabs.map(tab => ({
          ...tab,
          content: state.errorState.brokenTabs.has(tab.id) ? (
            <div className="flex items-center justify-center h-64 text-center">
              <div>
                <div className="text-3xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold mb-2">Tab Isolated</h3>
                <p className="text-sm text-gray-600 mb-4">
                  This tab has been isolated due to errors
                </p>
                <button
                  onClick={() => attemptRecovery('tab', tab.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Attempt Recovery
                </button>
              </div>
            </div>
          ) : (
            tab.content
          ),
        })),
      [tabs, state.errorState.brokenTabs, attemptRecovery]
    );

    // Initialize health monitoring
    useEffect(() => {
      if (!state.errorState.isCircuitOpen) {
        healthCheckRef.current = setInterval(performHealthCheck, 15000); // Check every 15 seconds
      }

      return () => {
        if (healthCheckRef.current) {
          clearInterval(healthCheckRef.current);
        }
      };
    }, [state.errorState.isCircuitOpen, performHealthCheck]);

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
    if (state.errorState.isCircuitOpen) {
      return (
        <div id={id} className={`relative ${className}`} style={style}>
          <div className="absolute inset-0 bg-red-900 bg-opacity-20 border border-red-500 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="text-red-500 text-5xl mb-4">🔴</div>
              <h3 className="text-xl font-semibold text-white mb-2">Circuit Breaker Open</h3>
              <p className="text-sm text-gray-300 mb-4">
                Too many errors detected. Component protection activated.
              </p>
              <p className="text-xs text-gray-500 mb-6">
                Error Count: {state.errorState.errorCount} | Last Error:{' '}
                {new Date(state.errorState.lastErrorTime).toLocaleTimeString()}
              </p>
              <button
                onClick={() => dispatch({ type: 'RESET_CIRCUIT' })}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Force Reset Circuit
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
              brokenTabs: Array.from(state.errorState.brokenTabs),
              brokenImages: Array.from(state.errorState.brokenImages),
            })}
          />

          <ContentLoadingIndicator
            isLoading={loadingState.isTabLoading}
            progress={loadingState.loadingProgress}
            type="tab"
            message="Loading content..."
          />

          {/* Error status indicator */}
          {(state.errorState.brokenTabs.size > 0 || state.errorState.brokenImages.size > 0) && (
            <div className="absolute top-4 right-4 bg-yellow-600 text-white px-3 py-1 rounded text-xs z-20">
              {state.errorState.brokenTabs.size} tabs, {state.errorState.brokenImages.size} images
              isolated
            </div>
          )}
        </div>
      </WrapperContext.Provider>
    );
  }
);

ContentWrapper.displayName = 'ContentWrapper';
