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
                  href="https://www.queer-alliance.com/"
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
