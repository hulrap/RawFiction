import React from 'react';
import { EmbeddedWebsiteFrame } from '../../shared/EmbeddedWebsiteFrame';

export const ZeroGravWebsite: React.FC = () => {
  return (
    <div className="h-full w-full">
      <EmbeddedWebsiteFrame
        url="https://zerograv.xyz"
        title="Zero Grav Official Website"
        isActive={true}
        allowScrolling={true}
      />
    </div>
  );
}; 