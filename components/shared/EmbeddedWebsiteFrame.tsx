import React, { useState } from 'react';
import { WebsiteEmbedProps } from './types';

export const EmbeddedWebsiteFrame: React.FC<WebsiteEmbedProps> = ({
  url,
  title,
  isActive,
  allowScrolling = true
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="website-container">
      {isLoading && (
        <div className="website-loading">
          <div className="animate-shimmer-glass">
            Loading {title}...
          </div>
        </div>
      )}
      
      {hasError ? (
        <div className="flex items-center justify-center h-full">
          <div className="card-glass p-8 text-center">
            <h3 className="heading-card mb-4">Unable to load website</h3>
            <p className="text-sm opacity-75 mb-4">
              The website {title} could not be embedded directly.
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Visit {title} →
            </a>
          </div>
        </div>
      ) : (
        <iframe
          src={url}
          className={`embedded-website ${allowScrolling ? 'content-area' : ''}`}
          title={title}
          onLoad={handleLoad}
          onError={handleError}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          style={{
            display: isLoading ? 'none' : 'block'
          }}
        />
      )}
    </div>
  );
}; 