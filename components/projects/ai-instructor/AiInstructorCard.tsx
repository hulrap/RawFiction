import React, { memo } from 'react';
import { EmbeddedWrapper } from './Wrapper';
import type { SiteConfig } from '../../shared/types';

interface AiInstructorCardProps {
  id: string;
  className?: string;
  style?: React.CSSProperties;
}

export const AiInstructorCard: React.FC<AiInstructorCardProps> = memo(
  ({ id, className, style }) => {
    // Component mounted
    React.useEffect(() => {
      console.log('AI Instructor initialized');
    }, [id]);

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

    return (
      <EmbeddedWrapper
        id={id}
        siteConfig={aiInstructorConfig}
        className={`h-full w-full ${className}`}
        {...(style && { style })}
      />
    );
  }
);

AiInstructorCard.displayName = 'AiInstructorCard';
