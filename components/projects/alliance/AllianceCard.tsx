import React, { memo, useCallback } from 'react';
import { EmbeddedWrapper } from './Wrapper';
import { EmbeddedWebsiteFrame } from '../../shared/EmbeddedWebsiteFrame';
import type { SiteConfig, ProjectProps, TabItem } from '../../shared/types';

// Overview content for Queer Alliance
const OverviewContent: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-start pt-8 pb-4 px-4 sm:px-6 md:px-8 lg:px-12 overflow-auto">
      <div className="card-glass w-full max-w-2xl mx-auto p-6 sm:p-8 md:p-10 text-center rounded-xl backdrop-blur-sm">
        {/* Queer Alliance branding */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-[var(--brand-fg)]">
            Queer Alliance
          </h2>
          <p className="text-lg text-[var(--brand-fg)] opacity-70">LGBTQIA+ Community Platform</p>
        </div>

        {/* Project description */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-[var(--brand-fg)] text-center">
            Building a Secure Community Platform
          </h3>
          <div className="space-y-4 text-sm sm:text-base text-[var(--brand-fg)] opacity-80 leading-relaxed text-justify">
            <p>
              I developed a high-security, full-stack TypeScript platform for Queer Alliance,
              implementing enterprise-grade security measures crucial for protecting LGBTQIA+
              community members. The technical architecture includes Stripe payment integration,
              Supabase database management, Vercel hosting with automated CI/CD pipelines, and
              Resend email services for secure communications.
            </p>
            <p>
              The platform features comprehensive user profiles with extensive customization
              options, high-end responsive design, and robust security protocols. Every aspect was
              designed with privacy and safety in mind, recognizing the importance of creating
              secure digital spaces where LGBTQIA+ individuals can connect, access resources, and
              build community without compromising their personal security or identity.
            </p>
          </div>
        </div>

        {/* Visit website button */}
        <button
          onClick={() =>
            window.open('https://www.queer-alliance.com/', '_blank', 'noopener,noreferrer')
          }
          className="w-full max-w-xs mx-auto bg-white hover:bg-gray-100 text-gray-900 font-semibold py-4 px-8 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        >
          Visit Community
        </button>
      </div>
    </div>
  );
};

interface AllianceCardProps extends ProjectProps {
  id: string;
  className?: string;
  style?: React.CSSProperties;
}

export const AllianceCard: React.FC<AllianceCardProps> = memo(
  ({ id, className, style, isActive: _isActive = true }) => {
    const handleSuccess = useCallback(() => {}, []);

    const handleLoadComplete = (_success: boolean) => {
      // Load complete handler
    };

    const handleError = (_error: string) => {
      // Error handler
    };

    // Simple direct loading configuration
    const queerAllianceConfig: SiteConfig = {
      url: 'https://www.queer-alliance.com/',
      title: 'Queer Alliance',
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
        allowSameOrigin: true, // Required for Vercel security challenge to complete
        allowForms: true,
        allowPopups: false,
        allowDownloads: false,
        allowModals: true, // Required for Vercel security challenge
        allowTopNavigation: false,
        strictMode: false, // Required for Vercel security challenge
      },
    };

    const tabs: TabItem[] = [
      {
        id: 'website',
        title: 'Website',
        content: (
          <EmbeddedWebsiteFrame
            url={queerAllianceConfig.url}
            title={queerAllianceConfig.title}
            className="h-full w-full"
            siteConfig={queerAllianceConfig}
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
        className={className ?? 'h-full w-full'}
        style={style ?? {}}
        onSuccess={handleSuccess}
        fallbackContent={
          <div className="text-center p-8">
            <div className="text-purple-500 text-4xl mb-4">🏳️‍🌈</div>
            <h3 className="text-lg font-semibold mb-4 text-white">Queer Alliance Community</h3>
            <p className="text-sm text-gray-300 mb-6">
              The LGBTQIA+ community platform is protected by security policies that prevent
              embedding.
            </p>
            <div className="space-y-4">
              <p className="text-xs text-gray-400">
                Queer Alliance is dedicated to building inclusive communities and supporting
                LGBTQIA+ individuals worldwide through advocacy, resources, and safe spaces.
              </p>
              <a
                href={queerAllianceConfig.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 text-white rounded-lg transition-colors"
                style={{
                  background:
                    'linear-gradient(45deg, #e40303, #ff8c00, #ffed00, #008018, #0066cc, #732982)',
                }}
              >
                Visit Queer Alliance →
              </a>
            </div>
          </div>
        }
      />
    );
  }
);

AllianceCard.displayName = 'AllianceCard';
