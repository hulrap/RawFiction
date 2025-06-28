import React from 'react';
import { EmbeddedWrapper } from './Wrapper';
import { EmbeddedWebsiteFrame } from '../../shared/EmbeddedWebsiteFrame';
import { createComponentLogger } from '@/lib/console';
import type { ProjectProps, TabItem, SiteConfig } from '../../shared/types';

const logger = createComponentLogger('ZeroGrav');

export const ZeroGravCard: React.FC<ProjectProps> = ({ isActive: _isActive = true }) => {
  const handleLoadComplete = (site: 'primary' | 'secondary', success: boolean) => {
    logger.log(`${site} site ${success ? 'loaded successfully' : 'failed to load'}`);
  };

  const handleError = (site: 'primary' | 'secondary', error: string) => {
    logger.warn(`${site} site error:`, error);
  };

  // Site-specific configurations
  const zeroGravConfig: SiteConfig = {
    url: 'https://zerograv.xyz',
    title: 'Zero Grav',
    csp: {
      frameAncestors: ['*'], // More permissive for art sites
      bypassCSP: false,
      useProxy: false,
    },
    loading: {
      method: 'direct',
      timeout: 15000,
      retryCount: 2,
      retryDelay: 3000,
      enablePreconnect: true,
      cacheBusting: false,
      rateLimit: {
        enabled: true,
        delay: 2000,
        backoff: 'exponential',
      },
    },
    sandbox: {
      allowScripts: true,
      allowSameOrigin: false, // Prevent sandbox escape - don't combine with allowScripts
      allowForms: true,
      allowPopups: true,
      allowFullscreen: true,
      allowDownloads: false,
      allowModals: true,
      allowTopNavigation: false,
      strictMode: false,
    },
  };

  const openSeaConfig: SiteConfig = {
    url: 'https://opensea.io/collection/zero-grav',
    title: 'OpenSea',
    csp: {
      frameAncestors: 'none', // OpenSea blocks framing
      bypassCSP: true,
      useProxy: true,
      proxyEndpoint: '/api/proxy',
    },
    loading: {
      method: 'proxy', // Start with proxy due to CSP restrictions
      timeout: 20000,
      retryCount: 3,
      retryDelay: 5000,
      enablePreconnect: false,
      cacheBusting: true,
      rateLimit: {
        enabled: true,
        delay: 5000,
        backoff: 'exponential',
      },
    },
    sandbox: {
      allowScripts: true,
      allowSameOrigin: false, // More restrictive for marketplace
      allowForms: true,
      allowPopups: false,
      allowFullscreen: false,
      allowDownloads: false,
      allowModals: true,
      allowTopNavigation: false,
      strictMode: true,
    },
    fallbackContent: {
      type: 'description',
      content:
        'OpenSea marketplace for Zero Grav NFT collection. Due to security restrictions, this content must be viewed directly on OpenSea.',
    },
  };

  const tabs: TabItem[] = [
    {
      id: 'zerograv',
      title: 'Zero Grav',
      content: (
        <EmbeddedWebsiteFrame
          url={zeroGravConfig.url}
          title={zeroGravConfig.title}
          className="h-full w-full"
          siteConfig={zeroGravConfig}
          suppressLogs={true}
          logSuppression={{
            enabled: true,
            keywords: ['zerograv', 'zero-grav'],
            domains: ['zerograv.xyz'],
            aggressive: true,
          }}
          onLoad={() => handleLoadComplete('primary', true)}
          onError={error => handleError('primary', error)}
        />
      ),
    },
    {
      id: 'opensea',
      title: 'OpenSea',
      content: (
        <EmbeddedWebsiteFrame
          url={openSeaConfig.url}
          title={openSeaConfig.title}
          className="h-full w-full"
          siteConfig={openSeaConfig}
          suppressLogs={true}
          logSuppression={{
            enabled: true,
            keywords: ['opensea', 'frame-ancestors', 'CSP'],
            domains: ['opensea.io'],
            aggressive: true,
          }}
          onLoad={() => handleLoadComplete('secondary', true)}
          onError={error => handleError('secondary', error)}
        />
      ),
    },
  ];

  return <EmbeddedWrapper id="zero-grav" tabs={tabs} className="h-full w-full dapp-container" />;
};
