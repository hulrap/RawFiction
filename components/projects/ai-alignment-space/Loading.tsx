import React from 'react';

interface LoadingScreenProps {
  title: string;
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ title, message = 'Loading...' }) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-300">{message}</p>
      </div>
    </div>
  );
};
