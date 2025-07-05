import React from 'react';
import { StandardLoadingScreen } from '../../shared/StandardLoadingScreen';

interface LoadingScreenProps {
  title: string;
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  title: _title,
  message: _message = 'Loading...',
}) => {
  // Use standardized loading screen - ignore custom title and message for visual consistency
  return <StandardLoadingScreen />;
};
