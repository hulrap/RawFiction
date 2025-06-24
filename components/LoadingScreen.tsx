import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [text, setText] = useState<string[]>([]);
  const lines = [
    "This is not a software or AI,",
    "I will visit you",
    "with pizza."
  ];
  const [isVisible, setIsVisible] = useState(true);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const typeNextCharacter = () => {
      if (currentLine < lines.length) {
        const currentText = lines[currentLine];
        if (currentChar < currentText.length) {
          setText(prev => {
            const newLines = [...prev];
            if (!newLines[currentLine]) newLines[currentLine] = '';
            newLines[currentLine] = currentText.substring(0, currentChar + 1);
            return newLines;
          });
          setCurrentChar(prev => prev + 1);
          timeoutId = setTimeout(typeNextCharacter, 50);
        } else {
          // Move to next line after a pause
          timeoutId = setTimeout(() => {
            setCurrentLine(prev => prev + 1);
            setCurrentChar(0);
            timeoutId = setTimeout(typeNextCharacter, 50);
          }, 150); // Pause between lines
        }
      } else {
        // All lines complete
        setTimeout(() => {
          setIsVisible(false);
        }, 750);
      }
    };

    timeoutId = setTimeout(typeNextCharacter, 50);

    // Auto-complete after 3 seconds
    const autoCompleteTimeout = setTimeout(() => {
      clearTimeout(timeoutId);
      setText(lines);
      setTimeout(() => {
        setIsVisible(false);
      }, 750);
    }, 2250);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(autoCompleteTimeout);
    };
  }, [currentLine, currentChar]);

  const handleTransitionEnd = () => {
    if (!isVisible) {
      onComplete();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] backdrop-blur-xl bg-black/50 flex items-center justify-center transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        {text.map((line, index) => (
          <h1 
            key={index}
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white text-center leading-tight"
          >
            {line}
          </h1>
        ))}
      </div>
    </div>
  );
}; 