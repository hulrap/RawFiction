import React, { useState, useCallback } from 'react';
import { EmbeddedWebsiteFrame } from '../../shared/EmbeddedWebsiteFrame';
import type { TabItem } from '../../shared/types';

interface EmbeddedWrapperProps {
  id: string;
  tabs: TabItem[];
  className?: string;
  style?: React.CSSProperties;
  fallbackContent?: React.ReactNode;
  onError?: (error: string) => void;
  onSuccess?: () => void;
}

export const EmbeddedWrapper: React.FC<EmbeddedWrapperProps> = ({
  id,
  tabs,
  className = '',
  style,
  fallbackContent,
  onError: _onError,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id || '');
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Find the website tab (assumed to be the first tab with EmbeddedWebsiteFrame)
  const websiteTab = tabs.find(
    tab => React.isValidElement(tab.content) && tab.content.type === EmbeddedWebsiteFrame
  );

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onSuccess?.();
  };

  const retryLoad = useCallback(() => {
    setHasError(false);
    setErrorMessage('');
  }, []);

  // Show error state only for website tab
  if (hasError && activeTab === websiteTab?.id) {
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
                  href="https://ai-instructor.me"
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

  return (
    <div id={id} className={`relative ${className}`} style={style}>
      {/* Tab structure */}
      <div className="tab-container h-full">
        <div className="tab-header">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.title}
            </button>
          ))}
        </div>

        <div className="tab-content content-area">
          {tabs.find(tab => tab.id === activeTab)?.content}
        </div>
      </div>
    </div>
  );
};
