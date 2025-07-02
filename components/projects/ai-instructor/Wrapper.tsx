import React, { useState, useCallback } from 'react';
import { EmbeddedWebsiteFrame } from '../../shared/EmbeddedWebsiteFrame';
import type { SiteConfig } from '../../shared/types';

interface EmbeddedWrapperProps {
  id: string;
  siteConfig: SiteConfig;
  className?: string;
  style?: React.CSSProperties;
  fallbackContent?: React.ReactNode;
  onError?: (error: string) => void;
  onSuccess?: () => void;
}

export const EmbeddedWrapper: React.FC<EmbeddedWrapperProps> = ({
  id,
  siteConfig,
  className = '',
  style,
  fallbackContent,
  onError,
  onSuccess,
}) => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleIframeLoad = useCallback(() => {
    setHasError(false);
    onSuccess?.();
  }, [onSuccess]);

  const handleIframeError = useCallback(
    (error: string) => {
      setHasError(true);
      setErrorMessage(error);
      onError?.(error);
    },
    [onError]
  );

  const retryLoad = useCallback(() => {
    setHasError(false);
    setErrorMessage('');
  }, []);

  // Show error state
  if (hasError) {
    return (
      <div id={id} className={`relative ${className}`} style={style}>
        <div className="absolute inset-0 bg-gray-900 border border-red-500 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="text-red-500 text-4xl mb-4">🚫</div>
            <h3 className="text-lg font-semibold text-white mb-2">AI Instructor</h3>
            <p className="text-sm text-gray-300 mb-4">{errorMessage}</p>
            {fallbackContent || (
              <div className="text-center space-y-4">
                <button
                  onClick={retryLoad}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded mr-2 transition-colors"
                >
                  Retry
                </button>
                <a
                  href={siteConfig.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                >
                  Visit AI Instructor
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show the iframe directly - no loading screen
  return (
    <div id={id} className={`relative ${className}`} style={style}>
      <EmbeddedWebsiteFrame
        url={siteConfig.url}
        title={siteConfig.title}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        siteConfig={siteConfig}
      />
    </div>
  );
};
