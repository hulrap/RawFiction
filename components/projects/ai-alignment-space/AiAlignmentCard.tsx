import React, { memo } from 'react';
import { EmbeddedWrapper } from './Wrapper';
import { EmbeddedWebsiteFrame } from '../../shared/EmbeddedWebsiteFrame';
import type { SiteConfig, ProjectProps, TabItem } from '../../shared/types';

// Overview content for AI Alignment Space
const OverviewContent: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-start pt-8 pb-4 px-4 sm:px-6 md:px-8 lg:px-12 overflow-auto">
      <div className="card-glass w-full max-w-2xl mx-auto p-6 sm:p-8 md:p-10 text-center rounded-xl backdrop-blur-sm">
        {/* AI Alignment Space branding */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-[var(--brand-fg)]">
            AI Alignment Space
          </h2>
          <p className="text-lg text-[var(--brand-fg)] opacity-70">AI Safety Research Platform</p>
        </div>

        {/* Project description */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-[var(--brand-fg)] text-center">
            What I Built Here
          </h3>
          <div className="space-y-4 text-sm sm:text-base text-[var(--brand-fg)] opacity-80 leading-relaxed text-justify">
            <p>
              I transformed an abstract idea into an interactive 3D knowledge universe without any
              programming background, using AI collaboration as my creative partner. Starting with
              handwritten notes, I developed a 650-page comprehensive framework that evolved into
              2,500+ interconnected nodes representing the entire AI alignment research domain.
            </p>
            <p>
              Through 5+ months of intensive work with Claude and OpenAI models, I created both the
              technical implementation using Three.js/WebGL and the artistic vision of organizing
              knowledge as a spherical cosmos. This represents one of approximately 200 knowledge
              spheres I&apos;m developing, demonstrating a new paradigm for human-AI collaborative
              knowledge creation that cost around $2,000 in AI credits to develop.
            </p>
          </div>
        </div>

        {/* Visit website button */}
        <button
          onClick={() =>
            window.open('https://ai-alignment-space.org', '_blank', 'noopener,noreferrer')
          }
          className="w-full max-w-xs mx-auto bg-white hover:bg-gray-100 text-gray-900 font-semibold py-4 px-8 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        >
          Visit Research Platform
        </button>
      </div>
    </div>
  );
};

interface AiAlignmentCardProps extends ProjectProps {
  id: string;
  className?: string;
  style?: React.CSSProperties;
}

export const AiAlignmentCard: React.FC<AiAlignmentCardProps> = memo(
  ({ id, className, style, isActive: _isActive = true }) => {
    const handleLoadComplete = (_success: boolean) => {
      // Load complete handler
    };

    const handleError = (_error: string) => {
      // Error handler
    };

    // Simple direct loading configuration for AI Alignment Space
    const aiAlignmentConfig: SiteConfig = {
      url: 'https://ai-alignment-space.org',
      title: 'AI Alignment Space',
      csp: {
        frameAncestors: ['*'],
        bypassCSP: false,
      },
      loading: {
        method: 'direct', // Direct loading
        timeout: 30000,
        retryCount: 2,
        retryDelay: 2000,
        preloadDelay: 0,
        enablePreconnect: true,
        cacheBusting: false,
        rateLimit: {
          enabled: false,
          delay: 0,
          backoff: 'linear',
        },
      },
      sandbox: {
        allowScripts: true,
        allowSameOrigin: true, // Allow same origin for full functionality
        allowForms: true,
        allowPopups: false,
        allowDownloads: false,
        allowModals: true,
        allowTopNavigation: false,
        strictMode: false,
      },
    };

    const tabs: TabItem[] = [
      {
        id: 'website',
        title: 'Website',
        content: (
          <EmbeddedWebsiteFrame
            url={aiAlignmentConfig.url}
            title={aiAlignmentConfig.title}
            className="h-full w-full"
            siteConfig={aiAlignmentConfig}
            onLoad={() => handleLoadComplete(true)}
            onError={error => handleError(error)}
          />
        ),
      },
      {
        id: 'overview',
        title: 'Overview',
        content: <OverviewContent />,
      },
    ];

    return (
      <EmbeddedWrapper
        id={id}
        tabs={tabs}
        className={`h-full w-full ${className}`}
        {...(style && { style })}
      />
    );
  }
);

AiAlignmentCard.displayName = 'AiAlignmentCard';
