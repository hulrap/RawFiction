import React from 'react';
import { EmbeddedWebsiteFrame } from '../../shared/EmbeddedWebsiteFrame';
import { ProjectProps } from '../../shared/types';

export const DaswallensteinCard: React.FC<ProjectProps> = ({ isActive = true }) => {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-1">
        <EmbeddedWebsiteFrame
          url="https://daswallenstein.wien"
          title="Das Wallenstein"
          isActive={isActive}
          allowScrolling={true}
        />
      </div>
    </div>
  );
}; 