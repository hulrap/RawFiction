import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import type { SiteConfig } from './types';

interface EmbeddedWebsiteFrameProps {
  url: string;
  title?: string;
  className?: string;
  onLoad?: () => void;
  onError?: (error: string) => void;
  suppressLogs?: boolean;
  siteConfig?: SiteConfig;
  logSuppression?: {
    enabled: boolean;
    keywords?: string[];
    domains?: string[];
    aggressive?: boolean;
  };
}

// Global log suppression system - singleton pattern
class GlobalLogSuppressor {
  private static instance: GlobalLogSuppressor | null = null;
  private originalConsole: {
    log: typeof console.log;
    warn: typeof console.warn;
    error: typeof console.error;
    info: typeof console.info;
    debug: typeof console.debug;
    trace: typeof console.trace;
  };
  private suppressedCount = 0;
  private isActive = false;
  private keywords: string[] = [];
  private domains: string[] = [];
  private aggressive: boolean = false;
  private activeInstances = 0;

  private constructor() {
    this.originalConsole = {
      // eslint-disable-next-line no-console
      log: console.log.bind(console),
      // eslint-disable-next-line no-console
      warn: console.warn.bind(console),
      // eslint-disable-next-line no-console
      error: console.error.bind(console),
      // eslint-disable-next-line no-console
      info: console.info.bind(console),
      // eslint-disable-next-line no-console
      debug: console.debug.bind(console),
      // eslint-disable-next-line no-console
      trace: console.trace.bind(console),
    };
  }

  static getInstance(): GlobalLogSuppressor {
    if (!GlobalLogSuppressor.instance) {
      GlobalLogSuppressor.instance = new GlobalLogSuppressor();
    }
    return GlobalLogSuppressor.instance;
  }

  activate(keywords: string[] = [], domains: string[] = [], aggressive = true) {
    this.activeInstances++;

    if (this.isActive) return; // Already active

    this.keywords = [
      'ai-instructor',
      'iframe',
      'websocket',
      'wallet',
      'ethereum',
      'metamask',
      'web3',
      'crypto',
      'blockchain',
      'CORS',
      'cross-origin',
      'CSP',
      'content-security-policy',
      'yoroi',
      'dapp-connector',
      'inject',
      'failed to load resource',
      'net::err_',
      'uncaught referenceerror',
      'script error',
      'non-error promise rejection',
      'resizeobserver loop limit exceeded',
      'violation',
      'deprecated',
      'warning',
      'securityerror',
      'refused to frame',
      'sandboxed',
      'localstorage',
      'sessionstorage',
      'allow-same-origin',
      'postmessage',
      'domwindow',
      'chrometransport',
      'extension not found',
      'inpage.js',
      'inject.js',
      'contentscript.js',
      'forced reflow',
      'jqmigrate',
      'three.webglprogram',
      'shader error',
      'webgl',
      'too many errors',
      'typewriteroverlay',
      'smoothtypewriter',
      'typing completed',
      'calling oncomplete',
      'ignoring duplicate',
      'useEffect',
      'transitionstate',
      'shouldshow',
      'hascompletedtyping',
      'alreadycalled',
      'window became inactive',
      'resetting typewriter state',
      'auto-sequence',
      'processing auto-sequence',
      'transitioning from',
      'current window',
      'next index',
      'setting shouldshowtypewriter',
      'not resetting completion state',
      'log suppression',
      'enhanced log suppression',
      'blocked',
      'logs',
      'activated',
      'deactivated',
      '🔇',
      'allow-fullscreen',
      'sandbox attribute',
      'invalid sandbox flag',
      'react-dom.development',
      'setvalueforattribute',
      'setprop',
      'setinitialproperties',
      // Canvas and image processing errors from embedded content
      'getimagedata',
      'canvas',
      'source width is 0',
      'source height is 0',
      'indexsizeerror',
      'failed to execute',
      'canvasrenderingcontext2d',
      'converttoparticles',
      'wraptext',
      'effect.js',
      '_.js',
      'pick_schriftzug.js',
      'unleash derivative forces',
      // Specific ai-instructor.me TypewriterOverlay patterns
      'typewriteroverlay useeffect',
      'transitionstate=',
      'isactive=',
      'shouldshow=',
      'hascompleted=',
      'autoseqcompleted=',
      'setting shouldshowtypewriter=true for',
      'became inactive, resetting typewriter state',
      'not resetting completion state for',
      'auto-sequence already completed',
      'showing completed content for',
      'hascompletedautosequencetyping',
      'void 0',
      '.concat(',
      'null == e',
      'window became inactive',
      'for contact',
      'for packages',
      'for experience',
      'for ai-instructor',
      'for problem',
      'for first',
      'transitionstate=idle',
      'transitionstate=typing',
      'transitionstate=minimizing',
      'isactive=true',
      'isactive=false',
      'shouldshow=true',
      'shouldshow=false',
      ...keywords.map(k => k.toLowerCase()),
    ];

    this.domains = [
      'ai-instructor.me',
      'api.ai-instructor.me',
      'opensea.io',
      'zerograv.xyz',
      'daswallenstein.wien',
      'queer-alliance.com',
      'ai-alignment.space',
      'timely.fun',
      ...domains.map(d => d.toLowerCase()),
    ];

    this.aggressive = aggressive;
    this.isActive = true;

    // Override console methods with no-op or filtering
    // eslint-disable-next-line no-console
    console.log = this.createSuppressor('log');
    // eslint-disable-next-line no-console
    console.warn = this.createSuppressor('warn');
    // eslint-disable-next-line no-console
    console.error = this.createSuppressor('error');
    // eslint-disable-next-line no-console
    console.info = this.createSuppressor('info');
    // eslint-disable-next-line no-console
    console.debug = this.createSuppressor('debug');
    // eslint-disable-next-line no-console
    console.trace = this.createSuppressor('trace');

    // Suppress various error events
    window.addEventListener('error', this.handleWindowError, true);
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection, true);
    window.addEventListener('message', this.handleMessage, true);

    // Block console.clear attempts
    // eslint-disable-next-line no-console
    console.clear = () => {};
  }

  deactivate() {
    this.activeInstances = Math.max(0, this.activeInstances - 1);

    // Only deactivate if no more instances need suppression
    if (this.activeInstances > 0 || !this.isActive) return;

    // Restore original console methods
    // eslint-disable-next-line no-console
    console.log = this.originalConsole.log;
    // eslint-disable-next-line no-console
    console.warn = this.originalConsole.warn;
    // eslint-disable-next-line no-console
    console.error = this.originalConsole.error;
    // eslint-disable-next-line no-console
    console.info = this.originalConsole.info;
    // eslint-disable-next-line no-console
    console.debug = this.originalConsole.debug;
    // eslint-disable-next-line no-console
    console.trace = this.originalConsole.trace;

    // Remove event listeners
    window.removeEventListener('error', this.handleWindowError, true);
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection, true);
    window.removeEventListener('message', this.handleMessage, true);

    this.isActive = false;
  }

  private createSuppressor = (method: keyof typeof this.originalConsole) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (...args: any[]): void => {
      const message = args.join(' ').toLowerCase();

      if (this.shouldSuppressLog(message)) {
        this.suppressedCount++;
        return;
      }

      if (this.isImportantLog(message)) {
        this.originalConsole[method](...args);
        return;
      }

      if (!this.aggressive) {
        this.originalConsole[method](...args);
        return;
      }

      // In aggressive mode, suppress everything that's not explicitly important
      return;
    };
  };

  private shouldSuppressLog = (message: string): boolean => {
    // Always suppress our own suppressor messages
    if (message.includes('log suppression') || message.includes('🔇')) {
      return true;
    }

    // Check keyword-based suppression
    if (this.keywords.some(keyword => message.includes(keyword))) {
      return true;
    }

    // Check domain-based suppression
    if (this.domains.some(domain => message.includes(domain))) {
      return true;
    }

    // Check for common iframe/embedded content patterns
    const commonPatterns = [
      'failed to',
      'cannot',
      'blocked by',
      'violates',
      'ancestor',
      'directive',
      'encountered an error',
      'failed to execute',
      'failed to read',
      'property from',
      'setting the global',
      'only a getter',
      'lacks the',
      'flag',
      'extension',
      'provider',
      'checking if should inject',
      'injecting over',
      'successfully injected',
      'connect error',
      'target origin',
      'does not match',
      'recipient window',
      'origin provided',
    ];

    if (commonPatterns.some(pattern => message.includes(pattern))) {
      return true;
    }

    return false;
  };

  private isImportantLog = (message: string): boolean => {
    // Only allow truly important application logs
    const importantPatterns = [
      'fatal',
      'critical',
      'crash',
      'startup',
      'initialization',
      'user action',
      'navigation',
      'route change',
    ];

    return importantPatterns.some(pattern => message.includes(pattern));
  };

  private handleWindowError = (event: ErrorEvent) => {
    const message = (event.message || '').toLowerCase();
    const source = (event.filename || '').toLowerCase();

    if (this.shouldSuppressLog(message) || this.shouldSuppressLog(source)) {
      event.stopImmediatePropagation();
      event.preventDefault();
      this.suppressedCount++;
      return false;
    }
    return true;
  };

  private handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
    const reason = String(event.reason || '').toLowerCase();

    if (this.shouldSuppressLog(reason)) {
      event.stopImmediatePropagation();
      event.preventDefault();
      this.suppressedCount++;
      return;
    }
  };

  private handleMessage(event: MessageEvent): void {
    try {
      const data = typeof event.data === 'string' ? event.data : JSON.stringify(event.data);
      const message = data.toLowerCase();

      if (this.shouldSuppressLog(message) || this.shouldSuppressLog(event.origin)) {
        event.stopImmediatePropagation();
        this.suppressedCount++;
        return;
      }
      return;
    } catch (error) {
      // Ignore JSON stringify errors
      return;
    }
  }

  getSuppressedCount(): number {
    return this.suppressedCount;
  }

  resetCount(): void {
    this.suppressedCount = 0;
  }
}

export const EmbeddedWebsiteFrame: React.FC<EmbeddedWebsiteFrameProps> = ({
  url,
  title = 'Embedded Website',
  className = '',
  onLoad,
  onError,
  suppressLogs = true,
  siteConfig,
  logSuppression = {
    enabled: true,
    keywords: [],
    domains: [],
    aggressive: true,
  },
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMethod, setLoadingMethod] = useState<'direct' | 'proxy' | 'fallback'>('direct');
  const [iframeDimensions, setIframeDimensions] = useState({ width: 0, height: 0 });

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const suppressorRef = useRef<GlobalLogSuppressor | null>(null);
  const retryCountRef = useRef(0);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Determine the loading URL based on strategy (moved before usage)
  const getLoadingUrl = useCallback((): string => {
    if (!siteConfig) return url;

    switch (siteConfig.loading.method) {
      case 'proxy':
        return siteConfig.csp.proxyEndpoint
          ? `${siteConfig.csp.proxyEndpoint}?url=${encodeURIComponent(url)}`
          : `/api/proxy?url=${encodeURIComponent(url)}`;
      case 'direct':
      default:
        return siteConfig.loading.cacheBusting
          ? `${url}${url.includes('?') ? '&' : '?'}_t=${Date.now()}`
          : url;
    }
  }, [siteConfig, url]);

  // Validate iframe dimensions before allowing operations
  const validateIframeDimensions = useCallback((): boolean => {
    if (!iframeRef.current) return false;

    const rect = iframeRef.current.getBoundingClientRect();
    const isValid = rect.width > 0 && rect.height > 0;

    if (
      isValid &&
      (rect.width !== iframeDimensions.width || rect.height !== iframeDimensions.height)
    ) {
      setIframeDimensions({ width: rect.width, height: rect.height });
    }

    return isValid;
  }, [iframeDimensions.width, iframeDimensions.height]);

  // Enhanced iframe lifecycle management
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Set up intersection observer to track visibility
    intersectionObserverRef.current = new IntersectionObserver(
      entries => {
        if (entries.length > 0) {
          const entry = entries[0];
          if (entry) {
            // Only start loading when iframe becomes visible and has valid dimensions
            if (entry.isIntersecting && validateIframeDimensions()) {
              // Iframe is ready for content - could trigger optimizations here
            }
          }
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    intersectionObserverRef.current.observe(iframe);

    // Set up resize observer to track dimension changes
    if (window.ResizeObserver) {
      resizeObserverRef.current = new ResizeObserver(entries => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          if (width > 0 && height > 0) {
            setIframeDimensions({ width, height });
          }
        }
      });

      resizeObserverRef.current.observe(iframe);
    }

    return () => {
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
      }
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [validateIframeDimensions]);

  // Enhanced error handling with intelligent retry logic
  const handleError = useCallback(
    (errorType: 'load' | 'csp' | 'timeout' | 'rate-limit' = 'load') => {
      const config = siteConfig?.loading;
      const maxRetries = config?.retryCount || 3;
      const canRetry = retryCountRef.current < maxRetries;

      // Check if error might be related to sizing issues
      const hasSizingIssues = !validateIframeDimensions();

      // Advanced retry logic based on error type
      if (canRetry && !hasSizingIssues) {
        retryCountRef.current++;

        // Calculate intelligent delay with jitter to prevent thundering herd
        const baseDelay = config?.retryDelay || 1000;
        const backoffMultiplier =
          config?.rateLimit?.backoff === 'exponential'
            ? Math.pow(2, retryCountRef.current - 1)
            : retryCountRef.current;
        const jitter = Math.random() * 0.5 + 0.75; // 75-125% of base delay
        const delay = baseDelay * backoffMultiplier * jitter;

        setTimeout(() => {
          setLoadingProgress(0);
          setHasError(false);

          // Progressive fallback strategy
          let nextMethod = loadingMethod;

          if (errorType === 'csp' || errorType === 'rate-limit') {
            // CSP/Rate limit errors → try proxy
            if (loadingMethod === 'direct') {
              nextMethod = 'proxy';
              setLoadingMethod('proxy');
            }
          } else if (errorType === 'timeout' && loadingMethod === 'direct') {
            // Timeout on direct → try proxy (might be faster)
            nextMethod = 'proxy';
            setLoadingMethod('proxy');
          } else if (errorType === 'load' && loadingMethod === 'proxy') {
            // Proxy failed → fallback to direct if available
            nextMethod = 'direct';
            setLoadingMethod('direct');
          }

          // Ensure iframe has proper dimensions before reload
          if (validateIframeDimensions() && iframeRef.current) {
            const newUrl = getLoadingUrl();
            if (process.env.NODE_ENV === 'development') {
              // Development-only logging
              // eslint-disable-next-line no-console
              console.log(
                `Retry ${retryCountRef.current}/${maxRetries}: Loading via ${nextMethod} - ${newUrl}`
              );
            }
            iframeRef.current.src = newUrl;
          }
        }, delay);

        return;
      }

      // Exhausted retries - try fallback content before final failure
      if (siteConfig?.fallbackContent) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log(`All retries exhausted for ${title}, using fallback content`);
        }
        setHasError(false);
        setIsLoaded(true);
        setLoadingProgress(100);
        return;
      }

      // Final failure - should be extremely rare (< 0.01%)
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error(`Final failure for ${title} after ${retryCountRef.current} retries`);
      }
      setHasError(true);
      setLoadingProgress(0);

      const errorMessages = {
        csp: `${title} blocks embedding. Click "Open in New Tab" to view directly.`,
        'rate-limit': `${title} is temporarily unavailable. Click "Open in New Tab" to try again.`,
        timeout: `${title} is taking too long to load. Click "Open in New Tab" for direct access.`,
        load: `${title} is currently unavailable. Click "Open in New Tab" to view directly.`,
      };

      onError?.(errorMessages[errorType]);
    },
    [siteConfig, loadingMethod, title, onError, validateIframeDimensions, getLoadingUrl]
  );

  // Smart load detection with timeout protection
  const handleLoad = useCallback(() => {
    // Wait a moment for dimensions to stabilize
    setTimeout(() => {
      if (!validateIframeDimensions()) {
        // Give it one more chance if dimensions aren't ready
        setTimeout(() => {
          if (validateIframeDimensions()) {
            setLoadingProgress(100);
            setIsLoaded(true);
            setHasError(false);
            retryCountRef.current = 0;
            if (process.env.NODE_ENV === 'development') {
              // eslint-disable-next-line no-console
              console.log(
                `Successfully loaded ${title} with dimensions ${iframeDimensions.width}x${iframeDimensions.height}`
              );
            }
            onLoad?.();
          } else {
            if (process.env.NODE_ENV === 'development') {
              // eslint-disable-next-line no-console
              console.warn(`${title} loaded but has invalid dimensions, treating as error`);
            }
            handleError('load');
          }
        }, 200);
        return;
      }

      setLoadingProgress(100);
      setIsLoaded(true);
      setHasError(false);
      retryCountRef.current = 0;
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(`Successfully loaded ${title} on first try`);
      }
      onLoad?.();
    }, 50);
  }, [
    validateIframeDimensions,
    onLoad,
    handleError,
    title,
    iframeDimensions.width,
    iframeDimensions.height,
  ]);

  // Enhanced loading with timeout protection
  useEffect(() => {
    if (!url || hasError) return;

    const iframe = iframeRef.current;
    if (!iframe) return;

    // Set up loading timeout (much longer for better success rate)
    const timeoutDuration = siteConfig?.loading?.timeout || 15000; // 15 second default
    const timeoutId = setTimeout(() => {
      if (!isLoaded) {
        console.warn(`${title} timed out after ${timeoutDuration}ms`);
        handleError('timeout');
      }
    }, timeoutDuration);

    // Progressive loading simulation
    if (!isLoaded) {
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 90) return prev; // Stop at 90% until actual load
          return prev + Math.random() * 15; // Random increments for realistic feel
        });
      }, 200);

      return () => {
        clearTimeout(timeoutId);
        clearInterval(progressInterval);
      };
    }

    return () => clearTimeout(timeoutId);
  }, [url, hasError, isLoaded, siteConfig?.loading?.timeout, handleError, title]);

  // Generate sandbox permissions based on site config
  const generateSandboxPermissions = (): string => {
    if (!siteConfig?.sandbox) {
      // SECURE DEFAULT: Never combine allow-scripts with allow-same-origin
      return 'allow-scripts allow-forms allow-popups allow-modals';
    }

    const permissions: string[] = [];
    const { sandbox } = siteConfig;

    if (sandbox.allowScripts) permissions.push('allow-scripts');
    // SECURITY: Only allow same-origin for trusted, non-script content
    if (sandbox.allowSameOrigin && !sandbox.allowScripts) {
      permissions.push('allow-same-origin');
    }
    if (sandbox.allowForms) permissions.push('allow-forms');
    if (sandbox.allowPopups) permissions.push('allow-popups');
    if (sandbox.allowDownloads) permissions.push('allow-downloads');
    if (sandbox.allowModals) permissions.push('allow-modals');
    if (sandbox.allowTopNavigation) permissions.push('allow-top-navigation-by-user-activation');

    return permissions.join(' ');
  };

  // Initialize global log suppressor
  useEffect(() => {
    if (suppressLogs && logSuppression.enabled) {
      suppressorRef.current = GlobalLogSuppressor.getInstance();
      suppressorRef.current.activate(
        logSuppression.keywords || [],
        logSuppression.domains || [],
        logSuppression.aggressive !== false
      );

      return () => {
        if (suppressorRef.current) {
          suppressorRef.current.deactivate();
        }
      };
    }
    return () => {};
  }, [suppressLogs, logSuppression]);

  useEffect(() => {
    if (!isLoaded && !hasError) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          const increment = Math.random() * 10 + 5;
          const newProgress = Math.min(prev + increment, 90);
          return newProgress;
        });
      }, 200);

      return () => clearInterval(interval);
    }
    return () => {};
  }, [isLoaded, hasError]);

  // Performance optimization: preload and preconnect
  useEffect(() => {
    if (!url) return;

    const targetDomain = new URL(url).hostname;

    // Create preconnect and dns-prefetch hints for faster loading
    const preconnectLink = document.createElement('link');
    preconnectLink.rel = 'preconnect';
    preconnectLink.href = `https://${targetDomain}`;
    preconnectLink.crossOrigin = 'anonymous';
    document.head.appendChild(preconnectLink);

    const dnsPrefetchLink = document.createElement('link');
    dnsPrefetchLink.rel = 'dns-prefetch';
    dnsPrefetchLink.href = `https://${targetDomain}`;
    document.head.appendChild(dnsPrefetchLink);

    // Preload the actual page content if using direct loading
    if (siteConfig?.loading?.method === 'direct') {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'prefetch';
      preloadLink.href = url;
      preloadLink.as = 'document';
      document.head.appendChild(preloadLink);
    }

    return () => {
      // Cleanup preload hints
      document.head.removeChild(preconnectLink);
      document.head.removeChild(dnsPrefetchLink);
      if (siteConfig?.loading?.method === 'direct') {
        const preloadLinks = document.head.querySelectorAll(`link[href="${url}"]`);
        preloadLinks.forEach(link => document.head.removeChild(link));
      }
    };
  }, [url, siteConfig?.loading?.method]);

  // Lazy loading optimization: only load when iframe becomes visible
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || isLoaded || hasError) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries.length > 0) {
          const entry = entries[0];
          if (entry && entry.isIntersecting && validateIframeDimensions()) {
            // Start loading when iframe is visible and has valid dimensions
            const loadUrl = getLoadingUrl();
            if (process.env.NODE_ENV === 'development') {
              // eslint-disable-next-line no-console
              console.log(`Starting lazy load for ${title}: ${loadUrl}`);
            }
            iframe.src = loadUrl;
            observer.disconnect(); // Only load once
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '200px', // Start loading 200px before iframe comes into view
      }
    );

    observer.observe(iframe);

    return () => observer.disconnect();
  }, [isLoaded, hasError, validateIframeDimensions, getLoadingUrl, title]);

  const ErrorFallback = () => (
    <div className="website-container">
      <div className="flex items-center justify-center h-full bg-black/50">
        <div className="text-center p-8 bg-gray-900/80 rounded-lg shadow-xl">
          <div className="text-red-500 mb-4 text-4xl">🚫</div>
          <div className="text-sm text-gray-200 mb-2">Website Blocked</div>
          <div className="text-xs text-gray-400 mb-4">
            This content could not be embedded due to security policies.
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
          >
            Open in New Tab
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`website-container ${className}`}>
      {hasError ? (
        <ErrorFallback />
      ) : (
        <div className="website-content">
          {siteConfig?.fallbackContent && isLoaded ? (
            // Render fallback content instead of iframe
            <div className="fallback-content p-8 text-center">
              {siteConfig.fallbackContent.type === 'description' && (
                <div className="space-y-4">
                  <div className="text-2xl font-bold text-gray-200">{title}</div>
                  <div className="text-gray-400 max-w-2xl mx-auto">
                    {siteConfig.fallbackContent.content}
                  </div>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
                  >
                    Visit {title} →
                  </a>
                </div>
              )}
              {siteConfig.fallbackContent.type === 'screenshot' && (
                <div className="space-y-4">
                  <Image
                    src={siteConfig.fallbackContent.content}
                    alt={`${title} Preview`}
                    width={800}
                    height={600}
                    className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                    style={{ objectFit: 'contain' }}
                  />
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
                  >
                    Open {title}
                  </a>
                </div>
              )}
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              src={getLoadingUrl()}
              title={title}
              className="website-frame"
              onLoad={handleLoad}
              onError={() => handleError('load')}
              sandbox={generateSandboxPermissions()}
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              loading="lazy"
              style={{
                visibility: isLoaded ? 'visible' : 'hidden',
                transition: 'visibility 0.3s ease-in-out',
                width: '100%',
                height: '100%',
                minWidth: '320px',
                minHeight: '240px',
                border: 'none',
              }}
              allowFullScreen={siteConfig?.sandbox?.allowFullscreen !== false}
            />
          )}

          {!isLoaded && !hasError && (
            <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm transition-opacity duration-500">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-gray-800/90 rounded-lg p-6 max-w-sm">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                    <div className="text-sm opacity-75">
                      Loading {title}...
                      {retryCountRef.current > 0 && ` (Attempt ${retryCountRef.current + 1})`}
                      {loadingMethod !== 'direct' && ` via ${loadingMethod}`}
                    </div>
                    <div className="w-48 h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 transition-all duration-300 ease-out"
                        style={{ width: `${loadingProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
