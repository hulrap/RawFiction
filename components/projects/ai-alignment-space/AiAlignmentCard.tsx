import React from 'react';
import { EmbeddedWebsiteFrame } from '../../shared/EmbeddedWebsiteFrame';
import { ProjectProps } from '../../shared/types';

export const AiAlignmentCard: React.FC<ProjectProps> = ({ isActive = true }) => {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-1">
        <EmbeddedWebsiteFrame
          url="https://ai-alignment.space"
          title="AI Alignment Space"
          isActive={isActive}
          allowScrolling={true}
        />
      </div>
    </div>
  );
}; 