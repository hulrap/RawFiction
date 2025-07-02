import React, { memo, useCallback } from 'react';
import { EmbeddedWrapper } from './Wrapper';
import type { SiteConfig } from '../../shared/types';

interface AiAlignmentCardProps {
  id: string;
  className?: string;
  style?: React.CSSProperties;
}

export const AiAlignmentCard: React.FC<AiAlignmentCardProps> = memo(({ id, className, style }) => {
  const handleSuccess = useCallback(() => {}, []);

  // Simple direct loading configuration for AI Alignment Space
  const aiAlignmentConfig: SiteConfig = {
    url: 'https://ai-alignment.space',
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

  return (
    <EmbeddedWrapper
      id={id}
      siteConfig={aiAlignmentConfig}
      className={className ?? 'h-full w-full'}
      style={style ?? {}}
      onSuccess={handleSuccess}
    />
  );
});

AiAlignmentCard.displayName = 'AiAlignmentCard';
