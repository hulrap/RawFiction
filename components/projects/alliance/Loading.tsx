import { useState, useEffect, useCallback, useRef } from 'react';

export interface EmbeddedLoadingState {
  isLoading: boolean;
  isLoaded: boolean;
  hasError: boolean;
  errorMessage?: string;
  loadingProgress: number;
  retryCount: number;
}

export interface EmbeddedLoadingConfig {
  url: string;
  title: string;
  timeout?: number;
  maxRetries?: number;
  preloadDelay?: number;
  enablePreconnect?: boolean;
}

export const useEmbeddedLoading = (config: EmbeddedLoadingConfig) => {
  const [state, setState] = useState<EmbeddedLoadingState>({
    isLoading: false,
    isLoaded: false,
    hasError: false,
    loadingProgress: 0,
    retryCount: 0,
  });

  const timeoutRef = useRef<NodeJS.Timeout>();
  const progressRef = useRef<NodeJS.Timeout>();
  const retryTimeoutRef = useRef<NodeJS.Timeout>();

  const {
    url,
    title,
    timeout = 20000, // Community sites may need more time
    maxRetries = 3, // More retries for community engagement
    preloadDelay = 150, // Slight delay for stability
    enablePreconnect = true,
  } = config;

  // DNS preconnect optimization
  useEffect(() => {
    if (enablePreconnect) {
      try {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = new URL(url).origin;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);

        return () => {
          if (document.head.contains(link)) {
            document.head.removeChild(link);
          }
        };
      } catch (error) {
        console.warn(`Failed to preconnect to ${url}:`, error);
        return; // Ensure all code paths return a value
      }
    }
    return; // Ensure the function always returns
  }, [url, enablePreconnect]);

  // Progress simulation for better UX
  const startProgressSimulation = useCallback(() => {
    setState(prev => ({ ...prev, loadingProgress: 0 }));

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 90) {
        progress = 90; // Stop at 90% until actual load
        clearInterval(interval);
      }
      setState(prev => ({ ...prev, loadingProgress: Math.min(progress, 90) }));
    }, 200);

    progressRef.current = interval;
  }, []);

  const stopProgressSimulation = useCallback(() => {
    if (progressRef.current) {
      clearInterval(progressRef.current);
    }
  }, []);

  const initiateLoad = useCallback(() => {
    setState(prev => {
      const newState: EmbeddedLoadingState = {
        ...prev,
        isLoading: true,
        hasError: false,
      };
      delete newState.errorMessage;
      return newState;
    });

    startProgressSimulation();

    // Set loading timeout
    timeoutRef.current = setTimeout(() => {
      if (!state.isLoaded) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          hasError: true,
          errorMessage: `Timeout: ${title} failed to load within ${timeout}ms`,
        }));
        stopProgressSimulation();
      }
    }, timeout);
  }, [title, timeout, state.isLoaded, startProgressSimulation, stopProgressSimulation]);

  const handleLoadSuccess = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    stopProgressSimulation();

    // Check if this is actually a Cloudflare/Vercel protection page
    setTimeout(() => {
      try {
        const iframe = document.querySelector(`iframe[title="${title}"]`) as HTMLIFrameElement;
        if (iframe?.contentDocument) {
          const content = iframe.contentDocument.body?.textContent || '';
          const htmlContent = iframe.contentDocument.documentElement?.outerHTML || '';

          // Detect various protection pages
          if (
            content.includes('Überprüfung') ||
            content.includes('Browser') ||
            content.includes('fehlgeschlagen') ||
            content.includes('Vercel') ||
            content.includes('DDoS') ||
            content.includes('Cloudflare') ||
            content.includes('Ray ID') ||
            content.includes('challenge') ||
            content.includes('checking your browser') ||
            htmlContent.includes('cf-browser-verification') ||
            htmlContent.includes('challenge-platform') ||
            htmlContent.includes('__CF$cv$params')
          ) {
            // Check if we're in localhost (dev) vs production
            const isLocalhost =
              window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

            const errorMessage = isLocalhost
              ? 'Site blocked due to localhost. Will work in production when your domain is added to Cloudflare allowlist.'
              : 'Site protected by security checkpoint';

            // Treat as error - this is not the real website
            setState(prev => ({
              ...prev,
              isLoading: false,
              isLoaded: false,
              hasError: true,
              errorMessage,
              loadingProgress: 0,
            }));
            return;
          }
        }
      } catch (e) {
        // Can't access iframe content due to CORS - assume it's loading correctly
      }

      // If we get here, it's likely the real content
      setState(prev => ({
        ...prev,
        isLoading: false,
        isLoaded: true,
        hasError: false,
        loadingProgress: 100,
      }));
    }, 1000); // Wait 1 second for content to settle
  }, [stopProgressSimulation, title]);

  const handleLoadError = useCallback(
    (error: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      stopProgressSimulation();

      setState(prev => {
        const newRetryCount = prev.retryCount + 1;

        if (newRetryCount < maxRetries) {
          // Schedule retry
          retryTimeoutRef.current = setTimeout(() => {
            setState(retry => ({ ...retry, retryCount: newRetryCount }));
            setTimeout(initiateLoad, 1000); // 1 second delay between retries
          }, 2000);

          return {
            ...prev,
            isLoading: false,
            hasError: true,
            errorMessage: `Pride Retry ${newRetryCount}/${maxRetries}: ${error}`,
            retryCount: newRetryCount,
          };
        }

        return {
          ...prev,
          isLoading: false,
          hasError: true,
          errorMessage: `Pride Mission Failed after ${maxRetries} attempts: ${error}`,
          retryCount: newRetryCount,
        };
      });
    },
    [maxRetries, initiateLoad, stopProgressSimulation]
  );

  const manualRetry = useCallback(() => {
    setState(prev => ({ ...prev, retryCount: 0 }));
    setTimeout(initiateLoad, preloadDelay);
  }, [initiateLoad, preloadDelay]);

  // Auto-start loading
  useEffect(() => {
    const timer = setTimeout(initiateLoad, preloadDelay);
    return () => clearTimeout(timer);
  }, [initiateLoad, preloadDelay]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, []);

  return {
    state,
    actions: {
      handleLoadSuccess,
      handleLoadError,
      manualRetry,
      initiateLoad,
    },
  };
};

export const EmbeddedLoadingIndicator: React.FC<{
  state: EmbeddedLoadingState;
  title: string;
  onRetry?: () => void;
}> = ({ state, onRetry }) => {
  if (state.isLoaded) return null;

  if (state.hasError) {
    return (
      <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center z-10">
        <div className="text-center p-6 max-w-md">
          <div className="text-purple-400 text-2xl mb-4">🏳️‍🌈</div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {state.errorMessage?.includes('localhost')
              ? 'Development Limitation'
              : 'Queer Alliance Protected'}
          </h3>
          <p className="text-sm text-gray-300 mb-4">{state.errorMessage}</p>
          <p className="text-xs text-gray-400 mb-6">
            {state.errorMessage?.includes('localhost')
              ? 'This site blocks localhost for security. Add your production domain to the Cloudflare allowlist.'
              : 'The LGBTQ+ community platform uses security protection that prevents embedding.'}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 text-white rounded transition-colors"
              style={{
                background:
                  'linear-gradient(45deg, #e40303, #ff8c00, #ffed00, #008018, #0066cc, #732982)',
              }}
            >
              Reconnect to Community
            </button>
          )}
        </div>
      </div>
    );
  }

  if (state.isLoading) {
    return (
      <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-[var(--brand-glass)] border-t-[var(--brand-accent)] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return null;
};
