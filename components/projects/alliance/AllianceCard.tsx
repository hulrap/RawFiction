import React, { memo, useCallback } from 'react';
import { EmbeddedWrapper } from './Wrapper';
import type { SiteConfig } from '../../shared/types';

interface AllianceCardProps {
  id: string;
  className?: string;
  style?: React.CSSProperties;
}

export const AllianceCard: React.FC<AllianceCardProps> = memo(({ id, className, style }) => {
  const handleSuccess = useCallback(() => {
    // Could trigger analytics events here
  }, []);

  // Site-specific configuration for queer-alliance.com
  const queerAllianceConfig: SiteConfig = {
    url: 'https://www.queer-alliance.com/',
    title: 'Queer Alliance',
    csp: {
      frameAncestors: 'none', // Site blocks all framing
      bypassCSP: true,
      useProxy: true,
      proxyEndpoint: '/api/proxy',
    },
    loading: {
      method: 'proxy', // Start with proxy due to strict CSP
      timeout: 25000,
      retryCount: 3,
      retryDelay: 5000,
      enablePreconnect: false, // Skip preconnect since we're using proxy
      cacheBusting: true,
      rateLimit: {
        enabled: true,
        delay: 3000,
        backoff: 'exponential',
      },
    },
    sandbox: {
      allowScripts: true,
      allowSameOrigin: false, // More restrictive for community sites
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
        'Queer Alliance is dedicated to building inclusive communities and supporting LGBTQ+ individuals worldwide. Due to security restrictions, this content must be viewed directly on their website.',
    },
  };

  return (
    <EmbeddedWrapper
      id={id}
      siteConfig={queerAllianceConfig}
      className={className || 'h-full w-full'}
      style={style || {}}
      onSuccess={handleSuccess}
      fallbackContent={
        <div className="text-center p-8">
          <div className="text-purple-500 text-4xl mb-4">🏳️‍🌈</div>
          <h3 className="text-lg font-semibold mb-4 text-white">Queer Alliance Community</h3>
          <p className="text-sm text-gray-300 mb-6">
            The LGBTQ+ community platform is protected by security policies that prevent embedding.
          </p>
          <div className="space-y-4">
            <p className="text-xs text-gray-400">
              Queer Alliance is dedicated to building inclusive communities and supporting LGBTQ+
              individuals worldwide through advocacy, resources, and safe spaces.
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
});

AllianceCard.displayName = 'AllianceCard';
