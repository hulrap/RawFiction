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
        <div className="absolute inset-0 bg-gray-900 border border-yellow-600 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="text-yellow-500 text-4xl mb-4">🤖</div>
            <h3 className="text-lg font-semibold text-white mb-2">AI Alignment Space</h3>
            <p className="text-sm text-gray-300 mb-4">
              {errorMessage || 'The AI safety research platform cannot be embedded.'}
            </p>
            {fallbackContent || (
              <div className="text-center space-y-4">
                <p className="text-xs text-gray-400 mb-4">
                  AI Alignment Space is dedicated to advancing AI safety research and fostering
                  collaboration in the AI alignment community.
                </p>
                <button
                  onClick={retryLoad}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded mr-2"
                >
                  Retry
                </button>
                <a
                  href={siteConfig.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                >
                  Visit AI Alignment Space →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show the iframe directly - no persistent loading screen
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
