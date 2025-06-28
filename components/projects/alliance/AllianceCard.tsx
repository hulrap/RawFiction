import React, { memo, useCallback } from 'react';
import { EmbeddedWrapper } from './Wrapper';

interface AllianceCardProps {
  id: string;
  className?: string;
  style?: React.CSSProperties;
}

export const AllianceCard: React.FC<AllianceCardProps> = memo(({ id, className, style }) => {

  const handleSuccess = useCallback(() => {
    // Could trigger analytics events here
  }, []);

  return (
    <EmbeddedWrapper
      id={id}
      url="https://www.queer-alliance.com/"
      title="Queer Alliance"
      className={className || 'h-full w-full'}
      style={style || {}}
      onSuccess={handleSuccess}
      fallbackContent={
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">Queer Alliance Unavailable</h3>
          <p className="text-sm text-gray-600 mb-6">
            The LGBTQ+ community platform is temporarily unavailable.
          </p>
          <div className="space-y-2">
            <p className="text-xs text-gray-500">
              Queer Alliance is dedicated to building inclusive communities and supporting LGBTQ+
              individuals worldwide.
            </p>
          </div>
        </div>
      }
    />
  );
});

AllianceCard.displayName = 'AllianceCard';
