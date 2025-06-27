import React, { useState, useEffect } from 'react';

interface SimpleLoadingScreenProps {
  onComplete: () => void;
}

export const SimpleLoadingScreen: React.FC<SimpleLoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    // Cursor blinking animation
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    // Progress animation over 3 seconds
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 100 / 30; // 30 updates over 3 seconds
      });
    }, 100);

    // Complete loading after 3 seconds
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearInterval(cursorInterval);
      clearInterval(progressInterval);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black text-green-400 font-mono flex items-center justify-center">
      <div className="text-center">
        <div className="text-green-500 text-lg mb-8 whitespace-pre font-mono">
          {`██████╗  ██████╗ ██████╗ ████████╗███████╗ ██████╗ ██╗     ██╗ ██████╗
██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝██╔═══██╗██║     ██║██╔═══██╗
██████╔╝██║   ██║██████╔╝   ██║   █████╗  ██║   ██║██║     ██║██║   ██║
██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══╝  ██║   ██║██║     ██║██║   ██║
██║     ╚██████╔╝██║  ██║   ██║   ██║     ╚██████╔╝███████╗██║╚██████╔╝
╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝      ╚═════╝ ╚══════╝╚═╝ ╚═════╝`}
        </div>

        <div className="mb-6">
          <div className="text-green-400 text-xl mb-2">
            Loading Portfolio
            <span className={`inline-block ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'}`}>
              █
            </span>
          </div>
          <div className="text-green-600 text-sm">Please wait...</div>
        </div>

        <div className="w-80 mx-auto">
          <div className="flex items-center space-x-4">
            <div className="flex-1 h-2 bg-green-950 border border-green-800 rounded">
              <div
                className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded transition-all duration-100"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <span className="text-green-400 text-sm font-mono w-12">
              {Math.round(Math.min(progress, 100))}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
