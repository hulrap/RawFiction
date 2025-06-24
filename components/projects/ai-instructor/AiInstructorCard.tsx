import React from 'react';
import { EmbeddedWebsiteFrame } from '../../shared/EmbeddedWebsiteFrame';
import { ProjectProps } from '../../shared/types';

export const AiInstructorCard: React.FC<ProjectProps> = ({ isActive = true }) => {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-1">
        <EmbeddedWebsiteFrame
          url="https://ai-instructor.me"
          title="AI Instructor"
          isActive={isActive}
          allowScrolling={true}
        />
      </div>
    </div>
  );
}; 