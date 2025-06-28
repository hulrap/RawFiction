import React, { useState, useEffect } from 'react';
import type { TabItem } from './types';

interface TabContainerProps {
  tabs: TabItem[];
  defaultTab?: string;
  className?: string;
}

export const TabContainer: React.FC<TabContainerProps> = ({ tabs, defaultTab, className = '' }) => {
  const [activeTab, setActiveTab] = useState(() => {
    // Ensure we have a valid default tab
    if (defaultTab && tabs.some(tab => tab.id === defaultTab)) {
      return defaultTab;
    }
    return tabs[0]?.id || '';
  });

  // Update active tab when tabs or defaultTab changes
  useEffect(() => {
    const validDefaultTab =
      defaultTab && tabs.some(tab => tab.id === defaultTab) ? defaultTab : tabs[0]?.id;

    if (validDefaultTab) {
      // Always set to the valid default tab when tabs/defaultTab changes
      // This ensures we have a valid tab selection without reading activeTab
      setActiveTab(validDefaultTab);
    }
  }, [tabs, defaultTab]);

  // Don't render if no tabs
  if (!tabs.length) {
    return <div className={`tab-container ${className}`}>No content available</div>;
  }

  // Ensure activeTab is valid for current tabs, fallback if needed
  const currentActiveTab = tabs.some(tab => tab.id === activeTab) ? activeTab : tabs[0]?.id || '';

  return (
    <div className={`tab-container ${className}`}>
      <div className="tab-header">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${currentActiveTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.title}
          </button>
        ))}
      </div>

      <div className="tab-content content-area">
        {tabs.find(tab => tab.id === currentActiveTab)?.content || <div>Loading content...</div>}
      </div>
    </div>
  );
};
