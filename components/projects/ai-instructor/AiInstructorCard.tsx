import React, { memo } from 'react';
import { EmbeddedWebsiteFrame } from '../../shared/EmbeddedWebsiteFrame';
import type { SiteConfig } from '../../shared/types';

interface AiInstructorCardProps {
  id: string;
  className?: string;
  style?: React.CSSProperties;
}

export const AiInstructorCard: React.FC<AiInstructorCardProps> = memo(
  ({ id, className, style }) => {
    // Enhanced configuration for AI Instructor to handle TypewriterOverlay spam
    const aiInstructorConfig: SiteConfig = {
      url: 'https://www.ai-instructor.me/',
      title: 'AI Instructor',
      csp: {
        frameAncestors: ['*'], // AI Instructor allows framing
        bypassCSP: false,
        useProxy: false,
      },
      loading: {
        method: 'direct',
        timeout: 20000,
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
        allowSameOrigin: false, // Secure: prevent sandbox escape
        allowForms: true,
        allowPopups: false,
        allowFullscreen: false,
        allowDownloads: false,
        allowModals: true,
        allowTopNavigation: false,
        strictMode: false,
      },
    };

    return (
      <div id={id} className={`h-full w-full ${className}`} style={style}>
        <EmbeddedWebsiteFrame
          url={aiInstructorConfig.url}
          title={aiInstructorConfig.title}
          siteConfig={aiInstructorConfig}
          suppressLogs={true}
          logSuppression={{
            enabled: true,
            keywords: [
              'ai-instructor',
              // TypewriterOverlay spam - most comprehensive suppression
              'typewriteroverlay',
              'smoothtypewriter',
              'useeffect',
              'transitionstate',
              'isactive',
              'shouldshow',
              'hascompletedtyping',
              'autoseqcompleted',
              'alreadycalled',
              'window became inactive',
              'resetting typewriter state',
              'auto-sequence',
              'processing auto-sequence',
              'transitioning from',
              'current window',
              'next index',
              'setting shouldshowtypewriter',
              'not resetting completion state',
              'calling oncomplete',
              'typing completed',
              'ignoring duplicate',
              'showing completed content',
              'hascompletedautosequencetyping',
              // All the specific state transitions
              'transitionstate=idle',
              'transitionstate=typing',
              'transitionstate=minimizing',
              'isactive=true',
              'isactive=false',
              'shouldshow=true',
              'shouldshow=false',
              'hascompleted=true',
              'hascompleted=false',
              'autoseqcompleted=true',
              'autoseqcompleted=false',
              // Page-specific spam
              'for contact',
              'for packages',
              'for experience',
              'for ai-instructor',
              'for problem',
              'for first',
              'for imprint',
              // State management spam
              'void 0',
              '.concat(',
              'null == e',
              'starting initial auto-sequence',
              'only happen once',
              // Page build artifacts
              'page-3bcca4894a50cba5.js',
              'main.js',
              'polyfills.js',
              // General AI instructor domain patterns
              'localstorage is not enabled',
              "failed to read the 'localstorage' property",
              'the document is sandboxed',
            ],
            domains: ['ai-instructor.me', 'www.ai-instructor.me'],
            aggressive: true,
          }}
        />
      </div>
    );
  }
);

AiInstructorCard.displayName = 'AiInstructorCard';
