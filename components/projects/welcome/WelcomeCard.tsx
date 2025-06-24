import React, { useState, useEffect } from 'react';
import { ProjectProps } from '../../shared/types';

export const WelcomeCard: React.FC<ProjectProps> = ({ isActive = true }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  
  const fullText = "Wake up....\n\nYou have arrived at my site.\n\nIn here you get a glimpse into my matrix.";

  // Matrix typing effect
  useEffect(() => {
    if (!isActive) return;

    const timer = setTimeout(() => {
      if (currentIndex < fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [currentIndex, fullText, isActive]);

  // Cursor blink effect
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 600);

    return () => clearInterval(cursorTimer);
  }, []);

  // Reset when becomes active
  useEffect(() => {
    if (isActive) {
      setDisplayText('');
      setCurrentIndex(0);
    }
  }, [isActive]);

  const formatText = (text: string) => {
    return text.split('\n').map((line, index) => (
      <div key={index} className="matrix-line">
        <span className="matrix-text text-lg md:text-xl">
          {line || '\u00A0'}
        </span>
      </div>
    ));
  };

  return (
    <div className="matrix-container h-full w-full flex items-center justify-center p-8 relative">
      <div className="matrix-rain"></div>
      
      <div className="max-w-4xl text-center space-y-8 z-10 relative">
        <div className="space-y-4">
          {formatText(displayText)}
          {showCursor && currentIndex >= fullText.length && (
            <span className="matrix-cursor inline-block w-3 h-6 ml-2"></span>
          )}
        </div>

        {currentIndex >= fullText.length && (
          <div className="mt-12 animate-fade-in-up">
            <div className="grid md:grid-cols-3 gap-6 mt-16">
              <div className="card-glass p-6 border border-[var(--brand-matrix-green)] hover:bg-[rgba(0,255,65,0.05)] transition-all duration-300">
                <div className="matrix-text text-2xl font-bold mb-3">10+</div>
                <div className="text-sm opacity-75">Projects</div>
              </div>
              
              <div className="card-glass p-6 border border-[var(--brand-matrix-green)] hover:bg-[rgba(0,255,65,0.05)] transition-all duration-300">
                <div className="matrix-text text-2xl font-bold mb-3">∞</div>
                <div className="text-sm opacity-75">Possibilities</div>
              </div>

              <div className="card-glass p-6 border border-[var(--brand-matrix-green)] hover:bg-[rgba(0,255,65,0.05)] transition-all duration-300">
                <div className="matrix-text text-2xl font-bold mb-3">3D</div>
                <div className="text-sm opacity-75">Experience</div>
              </div>
            </div>

            <div className="mt-12 card-anthracite p-8 border border-[var(--brand-matrix-green)] bg-[rgba(0,255,65,0.02)]">
              <div className="matrix-text text-center">
                <div className="text-lg mb-4">// Navigation Instructions</div>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>🖱️ Scroll to rotate</div>
                  <div>⌨️ Arrow keys navigate</div>
                  <div>📱 Swipe on mobile</div>
                </div>
              </div>
            </div>

            <div className="mt-8 opacity-60">
              <div className="matrix-text text-xs">
                [ Press any key to enter the matrix ]
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 