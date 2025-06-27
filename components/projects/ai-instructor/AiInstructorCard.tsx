import { memo } from 'react';
import { EmbeddedWebsiteFrame } from '../../shared/EmbeddedWebsiteFrame';

interface AiInstructorCardProps {
  id: string;
  className?: string;
  style?: React.CSSProperties;
}

export const AiInstructorCard: React.FC<AiInstructorCardProps> = memo(
  ({ id, className, style }) => {
    return (
      <div id={id} className={`h-full w-full ${className}`} style={style}>
        <EmbeddedWebsiteFrame url="https://www.ai-instructor.me/" title="AI Instructor" />
      </div>
    );
  }
);

AiInstructorCard.displayName = 'AiInstructorCard';
