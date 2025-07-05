import React from 'react';
import { EmbeddedWrapper } from './Wrapper';
import { EmbeddedWebsiteFrame } from '../../shared/EmbeddedWebsiteFrame';
import type { ProjectProps, TabItem } from '../../shared/types';

// Overview content for Das Wallenstein
const OverviewContent: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-start pt-8 pb-4 px-4 sm:px-6 md:px-8 lg:px-12 overflow-auto">
      <div className="card-glass w-full max-w-2xl mx-auto p-6 sm:p-8 md:p-10 text-center rounded-xl backdrop-blur-sm">
        {/* Das Wallenstein branding */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-[var(--brand-fg)]">
            Das Wallenstein
          </h2>
          <p className="text-lg text-[var(--brand-fg)] opacity-70">Vienna Cultural Venue</p>
        </div>

        {/* Project description */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-[var(--brand-fg)] text-center">
            Supporting the Family Business
          </h3>
          <div className="space-y-4 text-sm sm:text-base text-[var(--brand-fg)] opacity-80 leading-relaxed text-justify">
            <p>
              I helped shape the digital presence and business strategy for Das Wallenstein,
              supporting my mother who runs this distinguished cultural venue in Vienna&apos;s
              heart. My role involved developing the website architecture, optimizing the online
              experience, and providing strategic consulting for business operations that bridge
              traditional Austrian culture with contemporary artistic expression.
            </p>
            <p>
              Through ongoing consultation, I assist with digital marketing strategies, event
              planning coordination, and operational improvements that help Das Wallenstein maintain
              its position as an essential part of Vienna&apos;s vibrant cultural landscape while
              adapting to modern business challenges.
            </p>
          </div>
        </div>

        {/* Visit website button */}
        <button
          onClick={() =>
            window.open('https://www.daswallenstein.wien/', '_blank', 'noopener,noreferrer')
          }
          className="w-full max-w-xs mx-auto bg-white hover:bg-gray-100 text-gray-900 font-semibold py-4 px-8 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        >
          Visit Website
        </button>
      </div>
    </div>
  );
};

interface DasWallensteinCardProps extends ProjectProps {
  id: string;
  className?: string;
  style?: React.CSSProperties;
}

export const DaswallensteinCard: React.FC<DasWallensteinCardProps> = ({
  id,
  className,
  style,
  isActive: _isActive = true,
}) => {
  const handleLoadComplete = (_success: boolean) => {
    // Load complete handler
  };

  const handleError = (_error: string) => {
    // Error handler
  };

  const tabs: TabItem[] = [
    {
      id: 'website',
      title: 'Website',
      content: (
        <EmbeddedWebsiteFrame
          url="https://www.daswallenstein.wien/"
          title="Das Wallenstein"
          className="h-full w-full"
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
      className={className || 'h-full w-full'}
      style={style || {}}
      fallbackContent={
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">Das Wallenstein Unavailable</h3>
          <p className="text-sm text-gray-600 mb-6">
            The Vienna cultural venue is temporarily unavailable.
          </p>
          <div className="space-y-2">
            <p className="text-xs text-gray-500">
              Das Wallenstein represents Vienna&apos;s rich cultural heritage and contemporary
              artistic expression.
            </p>
          </div>
        </div>
      }
    />
  );
};

DaswallensteinCard.displayName = 'DaswallensteinCard';
