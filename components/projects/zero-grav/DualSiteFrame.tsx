import React, { useState, useRef, useEffect, useCallback } from 'react';

interface SiteConfig {
  url: string;
  title: string;
  allowFullscreen: boolean;
  corsPolicy: 'strict' | 'moderate' | 'permissive';
  expectedLoadTime: number; // in milliseconds
}

interface DualSiteFrameProps {
  primarySite: SiteConfig;
  secondarySite: SiteConfig;
  className?: string;
  onLoadComplete?: (site: 'primary' | 'secondary', success: boolean) => void;
  onError?: (site: 'primary' | 'secondary', error: string) => void;
}

interface LoadingState {
  isLoading: boolean;
  hasError: boolean;
  loadProgress: number;
  errorMessage?: string;
  startTime?: number;
  loadingMethod?: 'direct' | 'proxy';
}

export const DualSiteFrame: React.FC<DualSiteFrameProps> = ({
  primarySite,
  secondarySite,
  className = '',
  onLoadComplete,
  onError,
}) => {
  const [activeTab, setActiveTab] = useState<'primary' | 'secondary'>('primary');
  const [primaryState, setPrimaryState] = useState<LoadingState>({
    isLoading: true,
    hasError: false,
    loadProgress: 0,
    loadingMethod: 'direct',
  });
  const [secondaryState, setSecondaryState] = useState<LoadingState>({
    isLoading: true,
    hasError: false,
    loadProgress: 0,
    loadingMethod: 'direct',
  });

  const primaryIframeRef = useRef<HTMLIFrameElement>(null);
  const secondaryIframeRef = useRef<HTMLIFrameElement>(null);

  // Determine if a site needs proxy due to CSP restrictions
  const needsProxy = useCallback((config: SiteConfig): boolean => {
    return (
      config.corsPolicy === 'strict' ||
      config.url.includes('opensea.io') ||
      config.url.includes('queer-alliance.com')
    );
  }, []);

  // Get the appropriate URL (direct or proxy)
  const getLoadingUrl = useCallback(
    (config: SiteConfig, useProxy: boolean = false): string => {
      if (useProxy || needsProxy(config)) {
        return `/api/proxy?url=${encodeURIComponent(config.url)}`;
      }
      return config.url;
    },
    [needsProxy]
  );

  // Get secure sandbox permissions (prevent sandbox escape)
  const getSandboxPermissions = useCallback(
    (config: SiteConfig): string => {
      const basePermissions = ['allow-scripts', 'allow-forms'];

      // SECURITY: Don't combine allow-scripts with allow-same-origin to prevent sandbox escape
      // Only add allow-same-origin for trusted, non-script content
      const needsSameOrigin = config.corsPolicy !== 'strict' && !needsProxy(config);
      if (needsSameOrigin) {
        basePermissions.push('allow-same-origin');
      }

      switch (config.corsPolicy) {
        case 'permissive':
          basePermissions.push(
            'allow-popups',
            'allow-downloads',
            'allow-top-navigation-by-user-activation'
          );
          break;
        case 'moderate':
          basePermissions.push('allow-popups', 'allow-modals');
          break;
        case 'strict':
          basePermissions.push('allow-modals');
          break;
      }

      return basePermissions.join(' ');
    },
    [needsProxy]
  );

  // Progress simulation for loading states
  const simulateProgress = useCallback(
    (
      site: 'primary' | 'secondary',
      setState: React.Dispatch<React.SetStateAction<LoadingState>>
    ) => {
      const config = site === 'primary' ? primarySite : secondarySite;
      const interval = setInterval(() => {
        setState(prev => {
          if (prev.hasError || !prev.isLoading) {
            clearInterval(interval);
            return prev;
          }

          const elapsed = Date.now() - (prev.startTime || Date.now());
          const expectedProgress = Math.min((elapsed / config.expectedLoadTime) * 90, 90);
          const randomIncrement = Math.random() * 5;
          const newProgress = Math.min(prev.loadProgress + randomIncrement, expectedProgress);

          return {
            ...prev,
            loadProgress: newProgress,
          };
        });
      }, 300);

      return interval;
    },
    [primarySite, secondarySite]
  );

  // Handle iframe load events
  const handleIframeLoad = useCallback(
    (
      site: 'primary' | 'secondary',
      setState: React.Dispatch<React.SetStateAction<LoadingState>>
    ) => {
      setState(prev => ({
        ...prev,
        isLoading: false,
        hasError: false,
        loadProgress: 100,
      }));

      onLoadComplete?.(site, true);
    },
    [onLoadComplete]
  );

  // Handle iframe error events - simplified without retry logic
  const handleIframeError = useCallback(
    (
      site: 'primary' | 'secondary',
      setState: React.Dispatch<React.SetStateAction<LoadingState>>,
      config: SiteConfig
    ) => {
      // Determine appropriate error message
      const errorMessage = needsProxy(config)
        ? `${config.title} blocks embedding due to security policies.`
        : `Failed to load ${config.title}. This may be due to CORS restrictions or network issues.`;

      setState(prev => ({
        ...prev,
        isLoading: false,
        hasError: true,
        loadProgress: 0,
        errorMessage,
      }));

      onError?.(site, errorMessage);
      onLoadComplete?.(site, false);
    },
    [needsProxy, onError, onLoadComplete]
  );

  // Get the current loading URL for a site
  const getCurrentUrl = useCallback(
    (config: SiteConfig, state: LoadingState): string => {
      return getLoadingUrl(config, state.loadingMethod === 'proxy');
    },
    [getLoadingUrl]
  );

  // Set up iframe event listeners
  useEffect(() => {
    const primaryIframe = primaryIframeRef.current;

    if (primaryIframe) {
      const handleLoad = () => handleIframeLoad('primary', setPrimaryState);
      const handleError = () => handleIframeError('primary', setPrimaryState, primarySite);

      primaryIframe.addEventListener('load', handleLoad);
      primaryIframe.addEventListener('error', handleError);

      const progressInterval = simulateProgress('primary', setPrimaryState);
      setPrimaryState(prev => ({
        ...prev,
        startTime: Date.now(),
        loadingMethod: needsProxy(primarySite) ? 'proxy' : 'direct',
      }));

      return () => {
        primaryIframe.removeEventListener('load', handleLoad);
        primaryIframe.removeEventListener('error', handleError);
        clearInterval(progressInterval);
      };
    }

    return undefined;
  }, [primarySite, handleIframeLoad, handleIframeError, simulateProgress, needsProxy]);

  useEffect(() => {
    const secondaryIframe = secondaryIframeRef.current;

    if (secondaryIframe) {
      const handleLoad = () => handleIframeLoad('secondary', setSecondaryState);
      const handleError = () => handleIframeError('secondary', setSecondaryState, secondarySite);

      secondaryIframe.addEventListener('load', handleLoad);
      secondaryIframe.addEventListener('error', handleError);

      const progressInterval = simulateProgress('secondary', setSecondaryState);
      setSecondaryState(prev => ({
        ...prev,
        startTime: Date.now(),
        loadingMethod: needsProxy(secondarySite) ? 'proxy' : 'direct',
      }));

      return () => {
        secondaryIframe.removeEventListener('load', handleLoad);
        secondaryIframe.removeEventListener('error', handleError);
        clearInterval(progressInterval);
      };
    }

    return undefined;
  }, [secondarySite, handleIframeLoad, handleIframeError, simulateProgress, needsProxy]);

  // Update iframe src when loading method changes
  useEffect(() => {
    if (primaryIframeRef.current) {
      const newUrl = getCurrentUrl(primarySite, primaryState);
      if (primaryIframeRef.current.src !== newUrl) {
        primaryIframeRef.current.src = newUrl;
      }
    }
  }, [primarySite, primaryState.loadingMethod, getCurrentUrl, primaryState]);

  useEffect(() => {
    if (secondaryIframeRef.current) {
      const newUrl = getCurrentUrl(secondarySite, secondaryState);
      if (secondaryIframeRef.current.src !== newUrl) {
        secondaryIframeRef.current.src = newUrl;
      }
    }
  }, [secondarySite, secondaryState.loadingMethod, getCurrentUrl, secondaryState]);

  // Render loading component
  const renderLoadingState = (state: LoadingState, config: SiteConfig) => (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 p-8 bg-gray-800/90 rounded-lg shadow-xl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
        <div className="text-center">
          <div className="text-lg font-medium text-white mb-2">
            Loading {config.title}...
            {state.loadingMethod === 'proxy' && (
              <span className="block text-sm text-cyan-400 mt-1">via Proxy</span>
            )}
          </div>
          <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-300 ease-out"
              style={{ width: `${state.loadProgress}%` }}
            />
          </div>
          <div className="text-xs text-gray-400 mt-2">
            {Math.round(state.loadProgress)}% complete
          </div>
        </div>
      </div>
    </div>
  );

  // Render error component - simplified without retry option
  const renderErrorState = (state: LoadingState, config: SiteConfig) => {
    const isCSPError =
      state.errorMessage?.includes('security policies') ||
      state.errorMessage?.includes('Content Security Policy') ||
      needsProxy(config);

    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90">
        <div className="text-center p-8 bg-gray-800/90 rounded-lg shadow-xl max-w-md">
          <div className="text-red-500 mb-4 text-5xl">{isCSPError ? '🛡️' : '⚠️'}</div>
          <div className="text-xl font-medium text-white mb-2">
            {isCSPError ? 'Security Restricted' : 'Failed to Load'} {config.title}
          </div>
          <div className="text-sm text-gray-300 mb-4">{state.errorMessage}</div>
          <a
            href={config.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors font-medium"
          >
            Open {config.title} in New Tab →
          </a>
          {isCSPError && (
            <div className="mt-4 text-xs text-yellow-400">
              💡 This site prevents embedding for security reasons
            </div>
          )}
        </div>
      </div>
    );
  };

  const currentConfig = activeTab === 'primary' ? primarySite : secondarySite;

  return (
    <div className={`dual-site-frame ${className}`}>
      {/* Tab Navigation */}
      <div className="flex bg-gray-800/90 backdrop-blur-sm rounded-t-lg">
        <button
          onClick={() => setActiveTab('primary')}
          className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'primary'
              ? 'bg-cyan-600 text-white'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          {primarySite.title}
          {primaryState.isLoading && (
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          )}
          {primaryState.hasError && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
          {!primaryState.isLoading && !primaryState.hasError && (
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          )}
          {primaryState.loadingMethod === 'proxy' && (
            <span className="text-xs bg-orange-600 px-1 rounded">P</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('secondary')}
          className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'secondary'
              ? 'bg-cyan-600 text-white'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          {secondarySite.title}
          {secondaryState.isLoading && (
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          )}
          {secondaryState.hasError && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
          {!secondaryState.isLoading && !secondaryState.hasError && (
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          )}
          {secondaryState.loadingMethod === 'proxy' && (
            <span className="text-xs bg-orange-600 px-1 rounded">P</span>
          )}
        </button>
      </div>

      {/* Iframe Container */}
      <div className="relative h-full bg-black rounded-b-lg overflow-hidden">
        {/* Primary Site */}
        <div className={`absolute inset-0 ${activeTab === 'primary' ? 'z-10' : 'z-0 invisible'}`}>
          <iframe
            ref={primaryIframeRef}
            src={getCurrentUrl(primarySite, primaryState)}
            title={primarySite.title}
            className="w-full h-full border-0"
            sandbox={getSandboxPermissions(primarySite)}
            referrerPolicy="strict-origin-when-cross-origin"
            allow="encrypted-media; picture-in-picture"
            allowFullScreen={primarySite.allowFullscreen}
            style={{
              visibility: primaryState.isLoading || primaryState.hasError ? 'hidden' : 'visible',
            }}
          />

          {primaryState.isLoading && renderLoadingState(primaryState, primarySite)}
          {primaryState.hasError && renderErrorState(primaryState, primarySite)}
        </div>

        {/* Secondary Site */}
        <div className={`absolute inset-0 ${activeTab === 'secondary' ? 'z-10' : 'z-0 invisible'}`}>
          <iframe
            ref={secondaryIframeRef}
            src={getCurrentUrl(secondarySite, secondaryState)}
            title={secondarySite.title}
            className="w-full h-full border-0"
            sandbox={getSandboxPermissions(secondarySite)}
            referrerPolicy="strict-origin-when-cross-origin"
            allow="encrypted-media; picture-in-picture"
            allowFullScreen={secondarySite.allowFullscreen}
            style={{
              visibility:
                secondaryState.isLoading || secondaryState.hasError ? 'hidden' : 'visible',
            }}
          />

          {secondaryState.isLoading && renderLoadingState(secondaryState, secondarySite)}
          {secondaryState.hasError && renderErrorState(secondaryState, secondarySite)}
        </div>

        {/* Status Indicators */}
        <div className="absolute top-2 right-2 flex gap-2 z-20">
          {currentConfig.corsPolicy === 'strict' && (
            <div className="bg-red-600/90 text-white px-2 py-1 rounded text-xs font-medium shadow-lg">
              🛡️ Strict CORS
            </div>
          )}
          {(activeTab === 'primary' ? primaryState : secondaryState).loadingMethod === 'proxy' && (
            <div className="bg-orange-600/90 text-white px-2 py-1 rounded text-xs font-medium shadow-lg">
              🔀 Proxy Mode
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
