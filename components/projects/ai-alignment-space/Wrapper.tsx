import React, { useState, useCallback, memo } from 'react';
import { EmbeddedWebsiteFrame } from '../../shared/EmbeddedWebsiteFrame';
import { LoadingScreen } from './Loading';
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

export const EmbeddedWrapper: React.FC<EmbeddedWrapperProps> = memo(
  ({ id, siteConfig, className = '', style, onError, onSuccess }) => {
    const [loadingState, setLoadingState] = useState({
      isLoading: true,
      hasError: false,
      errorMessage: '',
      isCloudflareBlocked: false,
    });

    const handleLoadSuccess = useCallback(() => {
      console.log('AI Alignment Space loaded successfully');
      setLoadingState({
        isLoading: false,
        hasError: false,
        errorMessage: '',
        isCloudflareBlocked: false,
      });
      onSuccess?.();
    }, [onSuccess]);

    const handleLoadError = useCallback(
      (error: string) => {
        console.log('AI Alignment Space load error:', error);

        // Check if it's a Cloudflare protection issue (more comprehensive detection)
        const isCloudflareBlocked =
          error.includes('cloudflare') ||
          error.includes('DDoS') ||
          error.includes('protection') ||
          error.includes('challenge') ||
          error.includes('429') ||
          error.includes('Too Many Requests') ||
          error.includes('Rate limit') ||
          // Detect localhost-specific blocking
          window.location.hostname === 'localhost';

        setLoadingState({
          isLoading: false,
          hasError: true,
          errorMessage: error,
          isCloudflareBlocked,
        });
        onError?.(error);
      },
      [onError]
    );

    const handleRetry = useCallback(() => {
      setLoadingState(prev => ({
        ...prev,
        isLoading: true,
        hasError: false,
        errorMessage: '',
      }));
    }, []);

    if (loadingState.isLoading) {
      return (
        <div className={`relative ${className}`} style={style}>
          <LoadingScreen
            title="AI Alignment Space"
            message="Loading AI safety research platform..."
          />
        </div>
      );
    }

    if (loadingState.hasError) {
      return (
        <div className={`relative ${className}`} style={style}>
          <div className="absolute inset-0 bg-gray-900 border border-yellow-600 flex items-center justify-center">
            <div className="text-center p-8 max-w-md">
              <div className="text-yellow-500 text-4xl mb-4">🤖</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {loadingState.isCloudflareBlocked
                  ? 'AI Alignment Space Protected'
                  : 'AI Alignment Space Unavailable'}
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                {loadingState.isCloudflareBlocked
                  ? 'The AI safety research platform is protected by Cloudflare DDoS protection on localhost. This will work properly when deployed to production.'
                  : 'The AI safety research platform is temporarily unavailable.'}
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleRetry}
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
                  Visit AI Alignment Space
                </a>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                AI Alignment Space is dedicated to advancing AI safety research and fostering
                collaboration in the AI alignment community.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div id={id} className={`relative ${className}`} style={style}>
        <EmbeddedWebsiteFrame
          url={siteConfig.url}
          title={siteConfig.title}
          siteConfig={siteConfig}
          onLoad={handleLoadSuccess}
          onError={handleLoadError}
        />
      </div>
    );
  }
);

EmbeddedWrapper.displayName = 'EmbeddedWrapper';
