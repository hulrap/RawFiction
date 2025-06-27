import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { useEmbeddedLoading, EmbeddedLoadingIndicator, type EmbeddedLoadingState } from './Loading';
import type { TabItem } from '../../shared/types';

// Context for sharing wrapper utilities with child components
interface WrapperContextType {
  handleTabChange: (tabId: string) => void;
  isTabBroken: (tabId: string) => boolean;
  loadingState: EmbeddedLoadingState;
}

const WrapperContext = createContext<WrapperContextType | null>(null);

export const useWrapper = () => {
  const context = useContext(WrapperContext);
  if (!context) {
    console.warn('useWrapper must be used within an EmbeddedWrapper component');
    return null;
  }
  return context;
};

interface EmbeddedWrapperProps {
  id: string;
  tabs: TabItem[];
  className?: string;
  style?: React.CSSProperties;
  onError?: (error: string) => void;
  onSuccess?: () => void;
}

interface SpaceErrorState {
  brokenTabs: Set<string>;
  errorCount: number;
  lastErrorTime: number;
  isSpaceProtectionActive: boolean;
}

interface SpaceRecoveryState {
  attempts: number;
  lastAttempt: number;
  backoffMultiplier: number;
}

export const EmbeddedWrapper: React.FC<EmbeddedWrapperProps> = ({
  id,
  tabs,
  className = '',
  style,
  onError,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id || '');
  const [errorState, setErrorState] = useState<SpaceErrorState>({
    brokenTabs: new Set(),
    errorCount: 0,
    lastErrorTime: 0,
    isSpaceProtectionActive: false,
  });

  const [recoveryState, setRecoveryState] = useState<SpaceRecoveryState>({
    attempts: 0,
    lastAttempt: 0,
    backoffMultiplier: 1,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const healthCheckRef = useRef<NodeJS.Timeout>();
  const recoveryTimeoutRef = useRef<NodeJS.Timeout>();

  // Get current tab URL for loading system
  const getCurrentTabUrl = () => {
    if (activeTab === 'zerograv') return 'https://zerograv.xyz';
    if (activeTab === 'opensea') return 'https://opensea.io';
    return 'https://zerograv.xyz';
  };

  const { state: loadingState, actions } = useEmbeddedLoading({
    url: getCurrentTabUrl(),
    title: activeTab === 'zerograv' ? 'Zero Grav Platform' : 'OpenSea Marketplace',
    timeout: 30000, // Longer timeout for space platforms
    maxRetries: 3,
    preloadDelay: 300,
    enablePreconnect: true,
  });

  // Space circuit breaker logic
  const shouldActivateSpaceProtection = useCallback(
    (errorCount: number, timeWindow: number = 90000) => {
      return errorCount >= 3 && Date.now() - errorState.lastErrorTime < timeWindow;
    },
    [errorState.lastErrorTime]
  );

  // Cosmic error handling for space platforms
  const handleSpaceError = useCallback(
    (errorType: 'tab' | 'health' | 'general', errorId: string, error: Error) => {
      const errorMessage = `${errorType.toUpperCase()} Error in ${errorId}: ${error.message}`;
      const now = Date.now();

      console.error(`[${id}] Zero Grav space error:`, {
        type: errorType,
        id: errorId,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      setErrorState(prev => {
        const newErrorCount = prev.errorCount + 1;
        const shouldActivate = shouldActivateSpaceProtection(newErrorCount);

        let newState = {
          ...prev,
          errorCount: newErrorCount,
          lastErrorTime: now,
          isSpaceProtectionActive: shouldActivate,
        };

        // Mark tab as broken for space isolation
        if (errorType === 'tab') {
          newState.brokenTabs = new Set([...prev.brokenTabs, errorId]);
        }

        return newState;
      });

      onError?.(errorMessage);

      // Schedule space recovery
      if (!errorState.isSpaceProtectionActive) {
        scheduleSpaceRecovery(errorType, errorId);
      }
    },
    [id, onError, shouldActivateSpaceProtection, errorState.isSpaceProtectionActive]
  );

  // Space recovery system
  const scheduleSpaceRecovery = useCallback(
    (errorType: 'tab' | 'health' | 'general', errorId: string) => {
      const backoffDelay = Math.min(
        5000 * Math.pow(2, recoveryState.attempts) * recoveryState.backoffMultiplier,
        60000 // Max 1 minute for space recovery
      );

      recoveryTimeoutRef.current = setTimeout(() => {
        attemptSpaceRecovery(errorType, errorId);
      }, backoffDelay);

      setRecoveryState(prev => ({
        attempts: prev.attempts + 1,
        lastAttempt: Date.now(),
        backoffMultiplier: Math.min(prev.backoffMultiplier * 1.5, 4),
      }));
    },
    [recoveryState.attempts, recoveryState.backoffMultiplier]
  );

  const attemptSpaceRecovery = useCallback(
    (errorType: 'tab' | 'health' | 'general', errorId: string) => {
      console.log(`Attempting space recovery for ${errorType}: ${errorId}`);

      try {
        setErrorState(prev => {
          let newState = { ...prev };

          if (errorType === 'tab') {
            newState.brokenTabs = new Set([...prev.brokenTabs]);
            newState.brokenTabs.delete(errorId);
          }

          return newState;
        });

        // Re-initialize loading for the current tab
        actions.manualRetry();
        onSuccess?.();
      } catch (recoveryError) {
        console.warn(`Space recovery failed for ${errorType}: ${errorId}`, recoveryError);
        setRecoveryState(prev => ({
          ...prev,
          backoffMultiplier: prev.backoffMultiplier * 2,
        }));
      }
    },
    [actions, onSuccess]
  );

  // Enhanced tab switching for space platforms
  const handleTabChange = useCallback(
    (tabId: string) => {
      if (errorState.brokenTabs.has(tabId)) {
        console.warn(`Skipping broken space platform: ${tabId}`);
        return;
      }

      try {
        setActiveTab(tabId);
        // The useEmbeddedLoading will automatically restart with new URL
        onSuccess?.();
      } catch (error) {
        handleSpaceError('tab', tabId, error as Error);
      }
    },
    [errorState.brokenTabs, onSuccess, handleSpaceError]
  );

  // Space platform health monitoring
  const performSpaceHealthCheck = useCallback(() => {
    try {
      const container = containerRef.current;
      if (!container) return;

      // Check space platform accessibility
      const iframes = container.querySelectorAll('iframe');
      iframes.forEach((iframe, index) => {
        const isAccessible = iframe.offsetHeight > 0 && iframe.offsetWidth > 0;
        if (!isAccessible) {
          console.warn(`Space platform ${index + 1} became inaccessible`);
        }
      });

      // Check tab navigation accessibility
      const tabContainer = container.querySelector('[role="tablist"]') as HTMLElement;
      if (tabContainer && !tabContainer.offsetParent) {
        throw new Error('Space navigation became inaccessible');
      }
    } catch (error) {
      handleSpaceError('health', 'space-health-check', error as Error);
    }
  }, [handleSpaceError]);

  // Expose wrapper utilities
  const wrapperUtils = {
    handleTabChange,
    isTabBroken: (tabId: string) => errorState.brokenTabs.has(tabId),
    loadingState,
  };

  // Protected space platform tabs with error boundaries
  const protectedTabs: TabItem[] = tabs.map(tab => ({
    ...tab,
    content: errorState.brokenTabs.has(tab.id) ? (
      <div className="flex items-center justify-center h-64 text-center">
        <div className="bg-gradient-to-br from-purple-900/60 to-indigo-900/60 rounded-xl p-8 border border-purple-400/50 shadow-2xl">
          <div className="text-5xl mb-4">🛸</div>
          <h3 className="text-lg font-semibold text-purple-200 mb-2">Platform Offline</h3>
          <p className="text-sm text-purple-300 mb-4 leading-relaxed">
            This space platform is temporarily offline.
            <br />
            Cosmic maintenance in progress.
          </p>
          <button
            onClick={() => attemptSpaceRecovery('tab', tab.id)}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg"
          >
            🚀 Relaunch Platform
          </button>
        </div>
      </div>
    ) : (
      tab.content
    ),
  }));

  // Initialize space platform monitoring
  useEffect(() => {
    if (!errorState.isSpaceProtectionActive) {
      healthCheckRef.current = setInterval(performSpaceHealthCheck, 60000); // Check every minute for space platforms
    }

    return () => {
      if (healthCheckRef.current) {
        clearInterval(healthCheckRef.current);
      }
    };
  }, [errorState.isSpaceProtectionActive, performSpaceHealthCheck]);

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

  // Space protection mode
  if (errorState.isSpaceProtectionActive) {
    return (
      <div id={id} className={`relative ${className}`} style={style}>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border-2 border-purple-400/60 flex items-center justify-center backdrop-blur-lg">
          <div className="text-center p-10 bg-gradient-to-br from-purple-900/90 to-indigo-900/90 rounded-2xl border border-purple-300/50 shadow-2xl max-w-md">
            <div className="text-purple-300 text-7xl mb-6">🌌</div>
            <h3 className="text-2xl font-bold text-purple-100 mb-3">Space Protection Mode</h3>
            <p className="text-sm text-purple-200 mb-4 leading-relaxed">
              Zero gravity platforms are under cosmic protection.
              <br />
              <span className="text-indigo-300">Space safety protocols activated.</span>
            </p>
            <div className="bg-purple-800/50 rounded-lg p-4 mb-6 text-xs text-purple-300 space-y-1">
              <div>Cosmic Events: {errorState.errorCount}</div>
              <div>Last Issue: {new Date(errorState.lastErrorTime).toLocaleTimeString()}</div>
              <div className="text-indigo-400">Space Protection: ACTIVE</div>
            </div>
            <button
              onClick={() => {
                setErrorState(prev => ({
                  ...prev,
                  isSpaceProtectionActive: false,
                  errorCount: 0,
                }));
                setRecoveryState({
                  attempts: 0,
                  lastAttempt: 0,
                  backoffMultiplier: 1,
                });
              }}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl font-bold shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              🚀 Restore Space Access
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <WrapperContext.Provider value={wrapperUtils}>
      <div id={id} className={`relative ${className}`} style={style} ref={containerRef}>
        {/* Custom space tab container with error handling */}
        <div className="tab-container h-full">
          <div className="tab-header">
            {protectedTabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''} ${
                  errorState.brokenTabs.has(tab.id) ? 'broken' : ''
                }`}
                onClick={() => handleTabChange(tab.id)}
                disabled={errorState.brokenTabs.has(tab.id)}
              >
                {errorState.brokenTabs.has(tab.id) ? '🛸' : ''} {tab.title}
              </button>
            ))}
          </div>

          <div className="tab-content content-area">
            {protectedTabs.find(tab => tab.id === activeTab)?.content}
          </div>
        </div>

        {/* Space loading indicator */}
        <EmbeddedLoadingIndicator
          state={loadingState}
          title={activeTab === 'zerograv' ? 'Zero Grav Platform' : 'OpenSea Marketplace'}
          onRetry={actions.manualRetry}
        />

        {/* Space status indicator */}
        {errorState.brokenTabs.size > 0 && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600/90 to-indigo-600/90 text-white px-5 py-2 rounded-xl text-xs font-medium shadow-xl z-20 border border-purple-400/50">
            🛸 Repairing: {errorState.brokenTabs.size} platforms
          </div>
        )}
      </div>
    </WrapperContext.Provider>
  );
};
