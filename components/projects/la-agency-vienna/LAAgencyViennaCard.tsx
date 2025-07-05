import React from 'react';
import { EmbeddedWrapper } from './Wrapper';
import { EmbeddedWebsiteFrame } from '../../shared/EmbeddedWebsiteFrame';
import type { ProjectProps, TabItem } from '../../shared/types';

// Overview content for LA Agency Vienna
const OverviewContent: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-start pt-8 pb-4 px-4 sm:px-6 md:px-8 lg:px-12 overflow-auto">
      <div className="card-glass w-full max-w-2xl mx-auto p-6 sm:p-8 md:p-10 text-center rounded-xl backdrop-blur-sm">
        {/* LA Agency branding */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-[var(--brand-fg)]">
            L.A. Agency Vienna
          </h2>
          <p className="text-lg text-[var(--brand-fg)] opacity-70">
            Creative Agency & Production House
          </p>
        </div>

        {/* Project description */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-[var(--brand-fg)] text-center">
            About the Project
          </h3>
          <div className="space-y-4 text-sm sm:text-base text-[var(--brand-fg)] opacity-80 leading-relaxed text-justify">
            <p>
              L.A. Agency Vienna is a creative agency and production house that specializes in
              innovative content creation, branding, and digital experiences. Based in Vienna, they
              combine Austrian precision with Los Angeles creative energy.
            </p>
            <p>
              The agency focuses on creating compelling narratives across multiple platforms,
              working with clients to develop unique brand identities and engaging content that
              resonates with their target audiences.
            </p>
          </div>
        </div>

        {/* Visit website button */}
        <button
          onClick={() =>
            window.open('https://la-agency-vienna.com/', '_blank', 'noopener,noreferrer')
          }
          className="w-full max-w-xs mx-auto bg-white hover:bg-gray-100 text-gray-900 font-semibold py-4 px-8 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        >
          Visit Website
        </button>
      </div>
    </div>
  );
};

interface LAAgencyViennaCardProps extends ProjectProps {
  id: string;
  className?: string;
  style?: React.CSSProperties;
}

export const LAAgencyViennaCard: React.FC<LAAgencyViennaCardProps> = ({
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
          url="https://la-agency-vienna.com/"
          title="L.A. Agency Vienna"
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
      className={`h-full w-full ${className || ''}`}
      style={style || {}}
    />
  );
};

LAAgencyViennaCard.displayName = 'LAAgencyViennaCard';
