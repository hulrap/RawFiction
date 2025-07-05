import React from 'react';
import { EmbeddedWrapper } from './Wrapper';
import { EmbeddedWebsiteFrame } from '../../shared/EmbeddedWebsiteFrame';
import { createComponentLogger } from '@/lib/console';
import type { ProjectProps, TabItem, SiteConfig } from '../../shared/types';

const logger = createComponentLogger('ZeroGrav');

// Overview content for Zero Grav project
const OverviewContent: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-start pt-8 pb-4 px-4 sm:px-6 md:px-8 lg:px-12 overflow-auto">
      <div className="card-glass w-full max-w-2xl mx-auto p-6 sm:p-8 md:p-10 text-center rounded-xl backdrop-blur-sm">
        {/* Zero Grav branding */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-[var(--brand-fg)]">
            1080 Zero Grav
          </h2>
          <p className="text-lg text-[var(--brand-fg)] opacity-70">NFT Art & Skateboard Culture</p>
        </div>

        {/* Project description */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-[var(--brand-fg)] text-center">
            My Role in the Project
          </h3>
          <div className="space-y-4 text-sm sm:text-base text-[var(--brand-fg)] opacity-80 leading-relaxed text-justify">
            <p>
              I served as the project coordinator responsible for tying together all aspects of this
              pioneering conceptual artwork that bridges skateboard culture and crypto finance. As a
              former NFT trader and blockchain enthusiast, I brought both technical understanding
              and cultural insight to this innovative intersection of boarding culture and DeFi.
            </p>
            <p>
              Working alongside renowned artists Gerald Nestler and Sylvia Eckermann, I coordinated
              the conceptualization, creation, marketing and publishing of this dynamic NFT
              collection. The project explores the striking parallels between boarding culture and
              derivative finance - both involving speculative, volatile movements and performative
              exposure to risk, transforming the NFT space into a digital skatepark where volatility
              becomes aesthetic movement.
            </p>
          </div>
        </div>

        {/* Visit website button */}
        <button
          onClick={() => window.open('https://zerograv.xyz', '_blank', 'noopener,noreferrer')}
          className="w-full max-w-xs mx-auto bg-white hover:bg-gray-100 text-gray-900 font-semibold py-4 px-8 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        >
          Visit Project
        </button>
      </div>
    </div>
  );
};

// Simple static OpenSea card
const OpenSeaCollectionCard: React.FC = () => {
  const openOpenSea = () => {
    window.open('https://opensea.io/collection/zero-grav', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 overflow-auto">
      <div className="card-glass w-full max-w-md mx-auto p-6 sm:p-8 md:p-10 text-center rounded-xl backdrop-blur-sm">
        {/* OpenSea branding */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-[var(--brand-fg)]">
            1080 Zero Grav Collection
          </h2>
        </div>

        {/* Main message */}
        <div className="mb-8">
          <p className="text-base sm:text-lg text-[var(--brand-fg)] opacity-80 leading-relaxed">
            Explore the full interactive collection on OpenSea
          </p>
        </div>

        {/* Explore button */}
        <button
          onClick={openOpenSea}
          className="w-full max-w-xs mx-auto bg-white hover:bg-gray-100 text-gray-900 font-semibold py-4 px-8 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        >
          Explore
        </button>
      </div>
    </div>
  );
};

export const ZeroGravCard: React.FC<ProjectProps> = ({ isActive: _isActive = true }) => {
  const handleLoadComplete = (success: boolean) => {
    logger.log(`Zero Grav site ${success ? 'loaded successfully' : 'failed to load'}`);
  };

  const handleError = (error: string) => {
    logger.warn(`Zero Grav site error:`, error);
  };

  // Configuration for Zero Grav main site only
  const zeroGravConfig: SiteConfig = {
    url: 'https://zerograv.xyz',
    title: 'Zero Grav',
    csp: {
      frameAncestors: ['*'],
      bypassCSP: false,
    },
    loading: {
      method: 'direct',
      timeout: 20000,
      retryCount: 3,
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
      allowSameOrigin: false,
      allowForms: true,
      allowPopups: true,
      allowDownloads: false,
      allowModals: true,
      allowTopNavigation: false,
      strictMode: false,
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
          onLoad={() => handleLoadComplete(true)}
          onError={error => handleError(error)}
        />
      ),
    },
    {
      id: 'opensea',
      title: 'OpenSea',
      content: <OpenSeaCollectionCard />,
    },
    {
      id: 'overview',
      title: 'Overview',
      content: <OverviewContent />,
    },
  ];

  return <EmbeddedWrapper id="zero-grav" tabs={tabs} className="h-full w-full dapp-container" />;
};
