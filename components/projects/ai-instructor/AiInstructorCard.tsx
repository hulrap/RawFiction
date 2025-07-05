import React, { memo } from 'react';
import { EmbeddedWrapper } from './Wrapper';
import { EmbeddedWebsiteFrame } from '../../shared/EmbeddedWebsiteFrame';
import type { SiteConfig, ProjectProps, TabItem } from '../../shared/types';

// Overview content for AI Instructor
const OverviewContent: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-start pt-8 pb-4 px-4 sm:px-6 md:px-8 lg:px-12 overflow-auto">
      <div className="card-glass w-full max-w-2xl mx-auto p-6 sm:p-8 md:p-10 text-center rounded-xl backdrop-blur-sm">
        {/* AI Instructor branding */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-[var(--brand-fg)]">
            AI Instructor
          </h2>
        </div>

        {/* Project description */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-[var(--brand-fg)] text-center">
            Inventing a New Profession
          </h3>
          <div className="space-y-4 text-sm sm:text-base text-[var(--brand-fg)] opacity-80 leading-relaxed text-justify">
            <p>
              I pioneered an entirely new profession: personally counseling individuals in 1:1
              sessions to guide them through AI technology in highly adaptive, customized formats.
              Unlike typical AI implementations that focus on making companies more efficient or
              automated, my approach uniquely empowers individuals to harness AI for their personal
              growth, learning, and problem-solving needs.
            </p>
            <p>
              I built the complete AI Instructor platform in a single day, starting from zero lines
              of code and reaching full production deployment. Using pure TypeScript, I developed
              everything from initial branding concepts to the live website architecture,
              demonstrating rapid prototyping capabilities while creating a sophisticated platform
              that delivers personalized AI guidance sessions tailored to each individual&apos;s
              unique circumstances and goals.
            </p>
          </div>
        </div>

        {/* Visit website button */}
        <button
          onClick={() => window.open('https://ai-instructor.me', '_blank', 'noopener,noreferrer')}
          className="w-full max-w-xs mx-auto bg-white hover:bg-gray-100 text-gray-900 font-semibold py-4 px-8 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        >
          Visit Platform
        </button>
      </div>
    </div>
  );
};

interface AiInstructorCardProps extends ProjectProps {
  id: string;
  className?: string;
  style?: React.CSSProperties;
}

export const AiInstructorCard: React.FC<AiInstructorCardProps> = memo(
  ({ id, className, style, isActive: _isActive = true }) => {
    const handleLoadComplete = (_success: boolean) => {
      // Load complete handler
    };

    const handleError = (_error: string) => {
      // Error handler
    };

    // Simple direct loading configuration for AI Instructor
    const aiInstructorConfig: SiteConfig = {
      url: 'https://ai-instructor.me',
      title: 'AI Instructor',
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
            url={aiInstructorConfig.url}
            title={aiInstructorConfig.title}
            className="h-full w-full"
            siteConfig={aiInstructorConfig}
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

AiInstructorCard.displayName = 'AiInstructorCard';
