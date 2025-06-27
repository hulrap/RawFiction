import React, { useCallback } from 'react';
import { EmbeddedWrapper } from './Wrapper';
import { EmbeddedWebsiteFrame } from '../../shared/EmbeddedWebsiteFrame';
import type { ProjectProps, TabItem } from '../../shared/types';

export const ZeroGravCard: React.FC<ProjectProps> = ({ isActive: _isActive = true }) => {
  const handleError = useCallback((error: string) => {
    console.error(`Zero Grav error: ${error}`);
  }, []);

  const handleSuccess = useCallback(() => {
    console.log(`Zero Grav success`);
  }, []);

  const tabs: TabItem[] = [
    {
      id: 'zerograv',
      title: 'Zero Grav',
      content: (
        <div className="h-full w-full relative">
          <EmbeddedWebsiteFrame url="https://zerograv.xyz" title="Zero Grav Platform" />
        </div>
      ),
    },
    {
      id: 'opensea',
      title: 'OpenSea',
      content: (
        <div className="h-full w-full relative">
          <EmbeddedWebsiteFrame url="https://opensea.io" title="OpenSea NFT Marketplace" />
        </div>
      ),
    },
  ];

  return (
    <EmbeddedWrapper
      id="zero-grav"
      tabs={tabs}
      className="h-full w-full"
      onError={handleError}
      onSuccess={handleSuccess}
    />
  );
};
