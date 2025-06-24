import React, { useState } from 'react';
import { TabItem } from './types';

interface TabContainerProps {
  tabs: TabItem[];
  defaultTab?: string;
  className?: string;
}

export const TabContainer: React.FC<TabContainerProps> = ({
  tabs,
  defaultTab,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div className={`tab-container ${className}`}>
      <div className="tab-header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.title}
          </button>
        ))}
      </div>
      
      <div className="tab-content content-area">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}; 