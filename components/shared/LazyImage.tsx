import React, { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  componentId?: string; // For component identification in loading systems
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder = '',
  onLoad,
  onError,
  componentId = 'unknown',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      data-component-id={componentId}
      data-lazy-image="true"
    >
      {!isInView ? (
        <div className="absolute inset-0 bg-[var(--brand-glass)] animate-pulse flex items-center justify-center">
          <div className="text-xs text-[var(--brand-accent)] opacity-50">Loading...</div>
        </div>
      ) : (
        <>
          {!isLoaded && !hasError && (
            <div className="absolute inset-0 bg-[var(--brand-glass)] animate-pulse flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--brand-accent)]"></div>
            </div>
          )}

          {hasError ? (
            <div className="absolute inset-0 bg-[var(--brand-glass)] flex items-center justify-center">
              <div className="text-xs text-[var(--brand-accent)] opacity-75">Failed to load</div>
            </div>
          ) : (
            <img
              src={src}
              alt={alt}
              onLoad={handleLoad}
              onError={handleError}
              className={`transition-opacity duration-300 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              } ${className}`}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              data-component-id={componentId}
              data-image-loaded={isLoaded}
            />
          )}

          {placeholder && !isLoaded && !hasError && (
            <div className="absolute inset-0 bg-[var(--brand-glass)] flex items-center justify-center">
              <div className="text-xs text-[var(--brand-accent)] opacity-50">{placeholder}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
