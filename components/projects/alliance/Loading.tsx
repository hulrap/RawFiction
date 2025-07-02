import React, { useEffect, useState } from 'react';
import type { SiteConfig } from '../../shared/types';

interface LoadingProps {
  config: SiteConfig;
  onError: (error: string) => void;
}

export const Loading: React.FC<LoadingProps> = ({ config, onError }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simple progress simulation
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 15;
        if (next >= 90) {
          clearInterval(interval);
          // Don't complete automatically - let the iframe onLoad handle completion
          return 90;
        }
        return next;
      });
    }, 200);

    // Timeout fallback
    const timeout = setTimeout(() => {
      onError('Loading timeout');
    }, config.loading.timeout || 30000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [config.loading.timeout, onError]);

  return (
    <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10">
      <div className="text-center">
        <div className="relative mb-4">
          <div className="w-12 h-12 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Connecting to Queer Alliance</h3>
        <div className="w-48 bg-gray-700 rounded-full h-2 mb-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-300">Building inclusive communities...</p>
      </div>
    </div>
  );
};
