import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';

export interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  componentId?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  quality?: number;
  sizes?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

interface LoadingState {
  loaded: boolean;
  error: boolean;
  attempts: number;
  lastAttempt: number;
}

interface ImageMetrics {
  loadTime: number;
  retries: number;
  cacheHit: boolean;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  componentId,
  priority = false,
  placeholder = 'empty',
  quality = 85,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  fill = false,
  width,
  height,
  style,
  onLoad,
  onError,
}) => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    loaded: false,
    error: false,
    attempts: 0,
    lastAttempt: 0,
  });

  const [isVisible, setIsVisible] = useState(false);
  const [_metrics, setMetrics] = useState<ImageMetrics>({
    loadTime: 0,
    retries: 0,
    cacheHit: false,
  });

  const imgRef = useRef<HTMLDivElement>(null);
  const loadStartTime = useRef<number>(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();

  // Production-grade intersection observer
  useEffect(() => {
    if (priority) {
      setIsVisible(true);
      return;
    }

    const element = imgRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        if (entry?.isIntersecting && !isVisible) {
          setIsVisible(true);
          if (process.env.NODE_ENV !== 'production') {
            // Development-only visibility logging
          }
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [isVisible, priority, componentId]);

  // Production-grade retry logic with exponential backoff
  const handleImageError = useCallback(
    (error?: Error) => {
      const now = Date.now();
      const timeSinceLastAttempt = now - loadingState.lastAttempt;

      if (loadingState.attempts < 3 && timeSinceLastAttempt > 1000) {
        const retryDelay = Math.min(1000 * Math.pow(2, loadingState.attempts), 5000);

        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.warn(
            `LazyImage: Retrying ${componentId || src} in ${retryDelay}ms (attempt ${loadingState.attempts + 1})`
          );
        }

        retryTimeoutRef.current = setTimeout(() => {
          setLoadingState(prev => ({
            ...prev,
            attempts: prev.attempts + 1,
            lastAttempt: Date.now(),
            error: false,
          }));
        }, retryDelay);

        setMetrics(prev => ({ ...prev, retries: prev.retries + 1 }));
      } else {
        setLoadingState(prev => ({ ...prev, error: true }));
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error(
            `LazyImage: Failed to load ${componentId || src} after ${loadingState.attempts} attempts`,
            error
          );
        }
        onError?.();
      }
    },
    [loadingState.attempts, loadingState.lastAttempt, componentId, src, onError]
  );

  // Production-grade load success handler
  const handleImageLoad = useCallback(() => {
    const loadTime = Date.now() - loadStartTime.current;

    setLoadingState(prev => ({ ...prev, loaded: true, error: false }));
    setMetrics(prev => ({
      ...prev,
      loadTime,
      cacheHit: loadTime < 50, // Likely cached if loads very quickly
    }));

    if (process.env.NODE_ENV !== 'production') {
      // Development-only load logging
    }

    onLoad?.();
  }, [onLoad]);

  // Production-grade load initiation
  useEffect(() => {
    if (isVisible && !loadingState.loaded && !loadingState.error) {
      loadStartTime.current = Date.now();
    }
  }, [isVisible, loadingState.loaded, loadingState.error]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  // Production-grade error fallback
  if (loadingState.error && loadingState.attempts >= 3) {
    return (
      <div
        ref={imgRef}
        className={`${className} flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-gray-400`}
        style={style}
        data-component-id={componentId}
        data-testid="lazy-image-error"
      >
        <div className="text-center p-4">
          <div className="text-2xl mb-2">🖼️</div>
          <div className="text-xs opacity-75">
            {componentId ? `${componentId}: Image unavailable` : 'Image unavailable'}
          </div>
        </div>
      </div>
    );
  }

  // Production-grade loading placeholder
  if (!isVisible || (!loadingState.loaded && !loadingState.error)) {
    return (
      <div
        ref={imgRef}
        className={`${className} flex items-center justify-center bg-gradient-to-br from-gray-800/50 to-gray-700/50 animate-pulse`}
        style={style}
        data-component-id={componentId}
        data-testid="lazy-image-loading"
      >
        {isVisible && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mx-auto mb-2"></div>
            <div className="text-xs text-gray-400">
              {loadingState.attempts > 0 ? `Retry ${loadingState.attempts}...` : 'Loading...'}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Production-grade Next.js Image with proper error handling
  return (
    <div
      ref={imgRef}
      className={className}
      style={style}
      data-component-id={componentId}
      data-testid="lazy-image-loaded"
    >
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        sizes={sizes}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        className="object-cover w-full h-full"
        onLoad={handleImageLoad}
        onError={() => handleImageError()}
        style={{
          objectFit: 'cover',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};
