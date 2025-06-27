import React, { useState, useRef } from 'react';

interface EmbeddedWebsiteFrameProps {
  url: string;
  title?: string;
  className?: string;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

export const EmbeddedWebsiteFrame: React.FC<EmbeddedWebsiteFrameProps> = ({
  url,
  title = 'Embedded Website',
  className = '',
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.('The browser blocked this iframe from loading.');
  };

  // The fallback UI when an iframe fails to load
  const ErrorFallback = () => (
    <div className={`flex items-center justify-center bg-black/50 ${className}`}>
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
          className="text-sm text-cyan-400 hover:text-cyan-300"
        >
          Open in New Tab
        </a>
      </div>
    </div>
  );

  return (
    <div className={`relative w-full h-full ${className}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        </div>
      )}

      {hasError ? (
        <ErrorFallback />
      ) : (
        <iframe
          ref={iframeRef}
          src={url}
          title={title}
          className="w-full h-full border-0"
          onLoad={handleLoad}
          onError={handleError}
          sandbox="allow-scripts allow-same-origin"
          style={{
            visibility: isLoaded ? 'visible' : 'hidden',
            transition: 'visibility 0.3s ease-in-out',
          }}
        />
      )}
    </div>
  );
};
