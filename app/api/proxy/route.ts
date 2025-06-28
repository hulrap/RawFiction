import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface ProxyError {
  code:
    | 'INVALID_URL'
    | 'FORBIDDEN_DOMAIN'
    | 'FETCH_ERROR'
    | 'TIMEOUT'
    | 'RATE_LIMIT'
    | 'INTERNAL_ERROR'
    | 'UNKNOWN_ERROR';
  message: string;
  details?: string;
}

// In-memory cache for responses (in production, use Redis or similar)
interface CacheEntry {
  content: string;
  headers: Record<string, string>;
  timestamp: number;
  ttl: number;
}

const responseCache = new Map<string, CacheEntry>();
const pendingRequests = new Map<string, Promise<NextResponse>>();
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Cache configuration
const CACHE_CONFIG = {
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
  MAX_CACHE_SIZE: 100, // Maximum cached responses
  RATE_LIMIT_WINDOW: 60 * 1000, // 1 minute
  RATE_LIMIT_MAX: 10, // 10 requests per minute per domain
};

// Intelligent cache key generation
function generateCacheKey(url: string): string {
  const urlObj = new URL(url);
  // Include domain and path, exclude query params that change frequently
  return `${urlObj.hostname}${urlObj.pathname}`;
}

// Rate limiting check
function checkRateLimit(domain: string): boolean {
  const now = Date.now();
  const current = requestCounts.get(domain) || {
    count: 0,
    resetTime: now + CACHE_CONFIG.RATE_LIMIT_WINDOW,
  };

  if (now > current.resetTime) {
    // Reset the window
    requestCounts.set(domain, { count: 1, resetTime: now + CACHE_CONFIG.RATE_LIMIT_WINDOW });
    return true;
  }

  if (current.count >= CACHE_CONFIG.RATE_LIMIT_MAX) {
    return false; // Rate limited
  }

  requestCounts.set(domain, { ...current, count: current.count + 1 });
  return true;
}

// Cache cleanup to prevent memory leaks
function cleanupCache(): void {
  const now = Date.now();
  const entries = Array.from(responseCache.entries());

  // Remove expired entries
  for (const [key, entry] of entries) {
    if (now > entry.timestamp + entry.ttl) {
      responseCache.delete(key);
    }
  }

  // If still too large, remove oldest entries
  if (responseCache.size > CACHE_CONFIG.MAX_CACHE_SIZE) {
    const sortedEntries = entries
      .sort((a, b) => a[1].timestamp - b[1].timestamp)
      .slice(0, responseCache.size - CACHE_CONFIG.MAX_CACHE_SIZE);

    for (const [key] of sortedEntries) {
      responseCache.delete(key);
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    // Input validation
    const url = request.nextUrl.searchParams.get('url');
    if (!url) {
      return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
    }

    // Validate and parse URL
    let targetUrl: URL;
    try {
      targetUrl = new URL(url);
    } catch {
      const error: ProxyError = {
        code: 'INVALID_URL',
        message: 'Invalid URL format',
        details: 'The provided URL is not properly formatted',
      };

      return NextResponse.json(
        { error: error.message, code: error.code, details: error.details },
        { status: 400 }
      );
    }

    // Security check
    if (!['http:', 'https:'].includes(targetUrl.protocol)) {
      const error: ProxyError = {
        code: 'INVALID_URL',
        message: 'Invalid protocol',
        details: 'Only HTTP and HTTPS protocols are allowed',
      };

      return NextResponse.json(
        { error: error.message, code: error.code, details: error.details },
        { status: 400 }
      );
    }

    // Generate cache key and check cache first
    const cacheKey = generateCacheKey(url);
    const cachedEntry = responseCache.get(cacheKey);

    if (cachedEntry && Date.now() < cachedEntry.timestamp + cachedEntry.ttl) {
      // Return cached response
      return new NextResponse(cachedEntry.content, {
        status: 200,
        headers: {
          ...cachedEntry.headers,
          'X-Cache-Status': 'HIT',
          'X-Cache-Age': Math.floor((Date.now() - cachedEntry.timestamp) / 1000).toString(),
        },
      });
    }

    // Check if there's already a pending request for this URL (request deduplication)
    if (pendingRequests.has(cacheKey)) {
      const pendingResponse = await pendingRequests.get(cacheKey);
      if (pendingResponse) {
        return pendingResponse;
      }
    }

    // Rate limiting check
    if (!checkRateLimit(targetUrl.hostname)) {
      const error: ProxyError = {
        code: 'RATE_LIMIT',
        message: 'Rate limit exceeded',
        details: `Too many requests to ${targetUrl.hostname}. Please try again later.`,
      };

      return NextResponse.json(
        { error: error.message, code: error.code, details: error.details },
        { status: 429 }
      );
    }

    // Create a promise for this request to enable deduplication
    const requestPromise = (async (): Promise<NextResponse> => {
      try {
        // Fetch the content
        const response = await fetch(targetUrl.toString(), {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; RawFiction-Portfolio/1.0)',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
          signal: AbortSignal.timeout(30000), // 30 second timeout
        });

        if (!response.ok) {
          const error: ProxyError = {
            code: response.status === 429 ? 'RATE_LIMIT' : 'FETCH_ERROR',
            message: `Failed to fetch content: ${response.status} ${response.statusText}`,
            details: `Target responded with status ${response.status}`,
          };

          return NextResponse.json(
            { error: error.message, code: error.code, details: error.details },
            { status: response.status === 429 ? 429 : 502 }
          );
        }

        // Get the content
        let content = await response.text();

        // Enhanced HTML modification for better iframe compatibility
        content = content
          // Remove ALL CSP-related headers and meta tags (comprehensive)
          .replace(/<meta[^>]*http-equiv\s*=\s*["']?Content-Security-Policy["']?[^>]*>/gi, '')
          .replace(/<meta[^>]*name\s*=\s*["']?Content-Security-Policy["']?[^>]*>/gi, '')
          // Remove frame-ancestors and related CSP directives
          .replace(/frame-ancestors[^;]*;?/gi, '')
          .replace(/x-frame-options[^;]*;?/gi, '')
          // Remove other restrictive headers
          .replace(/<meta[^>]*http-equiv\s*=\s*["']?X-Frame-Options["']?[^>]*>/gi, '')
          // Inject base tag for relative URLs (early in head)
          .replace(/<head([^>]*)>/i, `<head$1><base href="${targetUrl.origin}/">`)
          // Add permissive CSP that allows framing
          .replace(
            /<head([^>]*)>/i,
            "<head$1><meta http-equiv=\"Content-Security-Policy\" content=\"frame-ancestors *; script-src 'self' 'unsafe-inline' 'unsafe-eval' *; style-src 'self' 'unsafe-inline' *;\">"
          )
          // Remove problematic window/parent detection scripts
          .replace(
            /<script[^>]*>\s*(?:if\s*\(\s*(?:window\.top|parent\.window|window\.parent|top\s*!==\s*self)[^}]*\{[^}]*\}|window\.top[^;]*;)[^<]*<\/script>/gi,
            ''
          )
          // Enhanced error suppression and compatibility layer
          .replace(
            /<head([^>]*)>/i,
            `<head$1><script>
            // Comprehensive iframe compatibility layer
            (function() {
              'use strict';

              // Graceful localStorage fallback for sandboxed iframes
              if (typeof Storage !== "undefined") {
                try {
                  localStorage.getItem('test');
                } catch (e) {
                  console.log('LocalStorage not available, using in-memory fallback');
                  const memoryStorage = {};
                  window.localStorage = {
                    getItem: function(key) { return memoryStorage[key] || null; },
                    setItem: function(key, value) { memoryStorage[key] = String(value); },
                    removeItem: function(key) { delete memoryStorage[key]; },
                    clear: function() { for (let key in memoryStorage) delete memoryStorage[key]; },
                    key: function(index) { return Object.keys(memoryStorage)[index] || null; },
                    get length() { return Object.keys(memoryStorage).length; }
                  };
                  // Also set sessionStorage fallback
                  window.sessionStorage = window.localStorage;
                }
              }

              // WordPress/jQuery compatibility fixes
              if (typeof jQuery !== 'undefined' || typeof $ !== 'undefined') {
                // Suppress jQuery migrate warnings
                if (window.jQuery && window.jQuery.migrateWarnings) {
                  window.jQuery.migrateWarnings = [];
                }
                // Prevent jQuery from breaking in iframes
                $(document).ready(function() {
                  // Disable problematic jQuery features in iframe context
                  if (window.self !== window.top) {
                    $('form').attr('target', '_blank');
                  }
                });
              }

              // Comprehensive error suppression
              const originalError = window.onerror;
              window.onerror = function(message, source, lineno, colno, error) {
                const msg = String(message).toLowerCase();
                if (msg.includes('localstorage') ||
                    msg.includes('sandbox') ||
                    msg.includes('frame-ancestors') ||
                    msg.includes('content security policy') ||
                    msg.includes('csp') ||
                    msg.includes('violates the following') ||
                    msg.includes('refused to frame') ||
                    msg.includes('timely.fun') ||
                    msg.includes('events.timely.fun') ||
                    msg.includes('getimagedata') ||
                    msg.includes('source width is 0') ||
                    msg.includes('source height is 0') ||
                    msg.includes('indexsizeerror') ||
                    msg.includes('typewriteroverlay') ||
                    msg.includes('jqmigrate')) {
                  return true; // Suppress these errors
                }
                return originalError ? originalError.apply(this, arguments) : false;
              };

              // Suppress unhandled promise rejections
              window.addEventListener('unhandledrejection', function(event) {
                const reason = String(event.reason).toLowerCase();
                if (reason.includes('localstorage') ||
                    reason.includes('sandbox') ||
                    reason.includes('csp') ||
                    reason.includes('frame')) {
                  event.preventDefault();
                }
              });

              // Canvas error prevention
              const originalGetContext = HTMLCanvasElement.prototype.getContext;
              HTMLCanvasElement.prototype.getContext = function(contextType, contextAttributes) {
                try {
                  // Ensure canvas has valid dimensions before creating context
                  if (this.width === 0 || this.height === 0) {
                    this.width = Math.max(this.width, 1);
                    this.height = Math.max(this.height, 1);
                  }
                  return originalGetContext.call(this, contextType, contextAttributes);
                } catch (error) {
                  console.log('Canvas context creation failed, using fallback');
                  return null;
                }
              };

              // Prevent canvas getImageData errors
              if (window.CanvasRenderingContext2D) {
                const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;
                CanvasRenderingContext2D.prototype.getImageData = function(sx, sy, sw, sh) {
                  try {
                    if (sw <= 0 || sh <= 0) {
                      console.log('Invalid canvas dimensions, skipping getImageData');
                      return { data: new Uint8ClampedArray(4), width: 1, height: 1 };
                    }
                    return originalGetImageData.call(this, sx, sy, sw, sh);
                  } catch (error) {
                    console.log('getImageData failed, returning empty data');
                    return { data: new Uint8ClampedArray(4), width: 1, height: 1 };
                  }
                };
              }

            })();
            </script>`
          );

        // Prepare response headers
        const responseHeaders = {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Frame-Options': 'SAMEORIGIN',
          'Cache-Control': 'public, max-age=300', // 5 minute cache
          'Access-Control-Allow-Origin': '*',
          'X-Proxy-Target': targetUrl.hostname,
          'X-Proxy-Status': 'success',
          'X-Cache-Status': 'MISS',
        };

        // Cache the response for future requests
        const cacheEntry: CacheEntry = {
          content,
          headers: responseHeaders,
          timestamp: Date.now(),
          ttl: CACHE_CONFIG.DEFAULT_TTL,
        };

        responseCache.set(cacheKey, cacheEntry);

        // Clean up cache periodically
        if (responseCache.size > CACHE_CONFIG.MAX_CACHE_SIZE * 0.8) {
          cleanupCache();
        }

        return new NextResponse(content, {
          status: 200,
          headers: responseHeaders,
        });
      } finally {
        // Remove from pending requests when done
        pendingRequests.delete(cacheKey);
      }
    })();

    // Store the promise in the pending requests map
    pendingRequests.set(cacheKey, requestPromise);

    try {
      return await requestPromise;
    } finally {
      // Ensure cleanup even if something goes wrong
      pendingRequests.delete(cacheKey);
    }
  } catch (error) {
    console.error('Proxy error:', error);

    let errorResponse: ProxyError;

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorResponse = {
          code: 'TIMEOUT',
          message: 'Request timed out',
          details: 'The target site took too long to respond',
        };
      } else {
        errorResponse = {
          code: 'INTERNAL_ERROR',
          message: 'Internal proxy error',
          details: error.message,
        };
      }
    } else {
      errorResponse = {
        code: 'UNKNOWN_ERROR',
        message: 'An unknown error occurred',
      };
    }

    return NextResponse.json(
      {
        error: errorResponse.message,
        code: errorResponse.code,
        details: errorResponse.details,
      },
      { status: 500 }
    );
  }
}
