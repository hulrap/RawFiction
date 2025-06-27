import { memo } from 'react';

import { EmbeddedWebsiteFrame } from '../../shared/EmbeddedWebsiteFrame';

interface LAAgencyViennaCardProps {
  id: string;
  className?: string;
  style?: React.CSSProperties;
}

export const LAAgencyViennaCard: React.FC<LAAgencyViennaCardProps> = memo(
  ({ id, className, style }) => {
    return (
      <div id={id} className={`h-full w-full ${className}`} style={style}>
        <EmbeddedWebsiteFrame url="https://la-agency-vienna.com/" title="L.A. Agency Vienna" />
      </div>
    );
  }
);

LAAgencyViennaCard.displayName = 'LAAgencyViennaCard';
