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
        <div className="absolute inset-0 bg-gray-900 border border-purple-500 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="text-purple-500 text-4xl mb-4">🏳️‍🌈</div>
            <h3 className="text-lg font-semibold text-white mb-2">Queer Alliance</h3>
            <p className="text-sm text-gray-300 mb-4">{errorMessage}</p>
            {fallbackContent || (
              <div className="text-center space-y-4">
                <button
                  onClick={retryLoad}
                  className="px-4 py-2 text-white rounded mr-2 transition-colors"
                  style={{
                    background:
                      'linear-gradient(45deg, #e40303, #ff8c00, #ffed00, #008018, #0066cc, #732982)',
                  }}
                >
                  Retry
                </button>
                <a
                  href={siteConfig.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                >
                  Visit Queer Alliance
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
