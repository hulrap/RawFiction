import { memo } from 'react';
import { EmbeddedWrapper } from './Wrapper';

interface DasWallensteinCardProps {
  id: string;
  className?: string;
  style?: React.CSSProperties;
}

export const DaswallensteinCard: React.FC<DasWallensteinCardProps> = memo(
  ({ id, className, style }) => {
    return (
      <EmbeddedWrapper
        id={id}
        url="https://www.daswallenstein.wien/"
        title="Das Wallenstein"
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
  }
);

DaswallensteinCard.displayName = 'DaswallensteinCard';
