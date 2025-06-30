import React, { useRef } from 'react';
import type { SiteConfig } from './types';

interface EmbeddedWebsiteFrameProps {
  url: string;
  title?: string;
  className?: string;
  onLoad?: () => void;
  onError?: (error: string) => void;
  siteConfig?: SiteConfig;
}

export const EmbeddedWebsiteFrame: React.FC<EmbeddedWebsiteFrameProps> = ({
  url,
  title = 'Embedded Website',
  className = '',
  onLoad,
  onError,
  siteConfig,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Prevent scroll event bubbling from iframe
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const preventWheelBubbling = (e: WheelEvent) => {
      // If the scroll is happening within the iframe container, prevent it from bubbling
      e.stopPropagation();
    };

    const preventTouchBubbling = (e: TouchEvent) => {
      // If the touch is happening within the iframe container, prevent it from bubbling
      e.stopPropagation();
    };

    // Add event listeners to prevent scroll capture
    container.addEventListener('wheel', preventWheelBubbling, { passive: false });
    container.addEventListener('touchmove', preventTouchBubbling, { passive: false });

    return () => {
      container.removeEventListener('wheel', preventWheelBubbling);
      container.removeEventListener('touchmove', preventTouchBubbling);
    };
  }, []);

  // Generate sandbox permissions from config
  const getSandboxPermissions = (): string => {
    const sandbox = siteConfig?.sandbox;
    if (!sandbox) {
      return 'allow-scripts allow-forms';
    }

    const permissions: string[] = [];
    if (sandbox.allowScripts) permissions.push('allow-scripts');
    if (sandbox.allowSameOrigin) permissions.push('allow-same-origin');
    if (sandbox.allowForms) permissions.push('allow-forms');
    if (sandbox.allowPopups) permissions.push('allow-popups');
    if (sandbox.allowDownloads) permissions.push('allow-downloads');
    if (sandbox.allowModals) permissions.push('allow-modals');
    if (sandbox.allowTopNavigation) permissions.push('allow-top-navigation');

    return permissions.join(' ') || 'allow-scripts allow-forms';
  };

  const handleIframeLoad = () => {
    onLoad?.();
  };

  const handleIframeError = () => {
    onError?.('Failed to load iframe');
  };

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full ${className}`}
      style={{
        overscrollBehavior: 'contain',
        touchAction: 'pan-x pan-y',
        contain: 'layout style paint',
      }}
    >
      <iframe
        ref={iframeRef}
        src={url}
        title={title}
        className="w-full h-full border-0 website-frame"
        sandbox={getSandboxPermissions()}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        style={{
          minHeight: '100%',
          minWidth: '100%',
          overscrollBehavior: 'contain',
          touchAction: 'pan-x pan-y',
        }}
      />
    </div>
  );
};
