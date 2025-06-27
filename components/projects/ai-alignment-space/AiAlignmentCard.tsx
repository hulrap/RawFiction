import { memo, useCallback } from 'react';
import { EmbeddedWrapper } from './Wrapper';

interface AiAlignmentCardProps {
  id: string;
  className?: string;
  style?: React.CSSProperties;
}

export const AiAlignmentCard: React.FC<AiAlignmentCardProps> = memo(({ id, className, style }) => {
  const handleError = useCallback((error: string) => {
    console.error(`AI Alignment Space error: ${error}`);
    // Could integrate with analytics or error reporting here
  }, []);

  const handleSuccess = useCallback(() => {
    console.log('AI Alignment Space loaded successfully');
    // Could trigger analytics events here
  }, []);

  return (
    <EmbeddedWrapper
      id={id}
      url="https://www.ai-alignment.space/"
      title="AI Alignment Space"
      className={className || 'h-full w-full'}
      style={style || {}}
      onError={handleError}
      onSuccess={handleSuccess}
      fallbackContent={
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">AI Alignment Space Unavailable</h3>
          <p className="text-sm text-gray-600 mb-6">
            The AI safety research platform is temporarily unavailable.
          </p>
          <div className="space-y-2">
            <p className="text-xs text-gray-500">
              AI Alignment Space is dedicated to advancing AI safety research and fostering
              collaboration in the AI alignment community.
            </p>
          </div>
        </div>
      }
    />
  );
});

AiAlignmentCard.displayName = 'AiAlignmentCard';
