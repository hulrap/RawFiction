import React, { useState, useEffect, useRef, useCallback } from 'react';

interface SmoothTypewriterProps {
  content: string;
  isActive: boolean;
  onComplete?: () => void;
  speed?: number;
  className?: string;
  onScroll?: () => void;
}

interface TypedLine {
  text: string;
  isComplete: boolean;
  currentText: string;
}

export const SmoothTypewriter: React.FC<SmoothTypewriterProps> = ({
  content,
  isActive,
  onComplete,
  speed = 70, // Optimal speed: 80ms per character (12.5 chars/sec) for readability
  className = '',
  onScroll
}) => {
  const [lines, setLines] = useState<TypedLine[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentLineIndexRef = useRef(0);
  const currentCharIndexRef = useRef(0);
  const linesRef = useRef<TypedLine[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep lines ref in sync with state
  useEffect(() => {
    linesRef.current = lines;
  }, [lines]);

  // Auto-scroll to bottom when new text appears
  const scrollToBottom = useCallback(() => {
    // Call the parent's scroll handler first (this scrolls the main window area)
    if (onScroll) {
      onScroll();
    }
    // Then scroll this component into view if needed
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [onScroll]);

  // Split content into lines and initialize typing state
  const initializeLines = useCallback(() => {
    const contentLines = content.split('\n').filter(line => line.trim() !== '');
    const initialLines = contentLines.map(text => ({
      text: text.trim(),
      isComplete: false,
      currentText: ''
    }));
    setLines(initialLines);
    linesRef.current = initialLines;
    currentLineIndexRef.current = 0;
    currentCharIndexRef.current = 0;
  }, [content]);

  const startTyping = useCallback(() => {
    if (isTyping || linesRef.current.length === 0) return;
    
    setIsTyping(true);
    currentLineIndexRef.current = 0;
    currentCharIndexRef.current = 0;

    const typeNextCharacter = () => {
      const currentLineIndex = currentLineIndexRef.current;
      const currentCharIndex = currentCharIndexRef.current;
      
      // Check if we've completed all lines
      if (currentLineIndex >= linesRef.current.length) {
        setIsTyping(false);
        // CRITICAL: Only call onComplete once per typing session
        if (!hasCompleted) {
          setHasCompleted(true);
          if (onComplete) {
            console.log('SmoothTypewriter: Calling onComplete after delay');
            setTimeout(onComplete, 1500);
          }
        }
        return;
      }

      const currentLine = linesRef.current[currentLineIndex];
      if (!currentLine) {
        setIsTyping(false);
        return;
      }

      // If current line is complete, move to next line
      if (currentLine.isComplete) {
        currentLineIndexRef.current++;
        currentCharIndexRef.current = 0;
        timeoutRef.current = setTimeout(typeNextCharacter, 100);
        return;
      }

      // Type next character in current line
      if (currentCharIndex < currentLine.text.length) {
        const newText = currentLine.text.slice(0, currentCharIndex + 1);
        
        setLines(prev => {
          const newLines = prev.map((line, index) => 
            index === currentLineIndex 
              ? { ...line, currentText: newText }
              : line
          );
          linesRef.current = newLines;
          return newLines;
        });
        
        currentCharIndexRef.current++;
        
        // Auto-scroll to follow typing progress
        setTimeout(scrollToBottom, 38);
        
        timeoutRef.current = setTimeout(typeNextCharacter, speed);
      } else {
        // Current line is complete
        setLines(prev => {
          const newLines = prev.map((line, index) => 
            index === currentLineIndex 
              ? { ...line, isComplete: true }
              : line
          );
          linesRef.current = newLines;
          return newLines;
        });
        
        currentLineIndexRef.current++;
        currentCharIndexRef.current = 0;
        
        // Auto-scroll when line completes
        setTimeout(scrollToBottom, 75);
        
        timeoutRef.current = setTimeout(typeNextCharacter, 150); // Longer pause after line completion for processing
      }
    };

    // Start typing
    timeoutRef.current = setTimeout(typeNextCharacter, 75);
  }, [speed, onComplete, isTyping]);

  // Initialize lines when content changes
  useEffect(() => {
    if (content) {
      setHasCompleted(false); // Reset completion state for new content
      initializeLines();
    }
  }, [content, initializeLines]);

  // Start typing when component becomes active
  useEffect(() => {
    if (isActive && linesRef.current.length > 0 && !isTyping) {
      setTimeout(() => {
        startTyping();
      }, 75);
    }
  }, [isActive, startTyping, isTyping]);

  // Reset when becomes inactive (but only if not completed)
  useEffect(() => {
    if (!isActive && !hasCompleted) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsTyping(false);
      currentLineIndexRef.current = 0;
      currentCharIndexRef.current = 0;
      setLines([]);
      linesRef.current = [];
    }
  }, [isActive, hasCompleted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Restart typing on click
  const handleClick = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsTyping(false);
    setHasCompleted(false); // Reset completion state
    currentLineIndexRef.current = 0;
    currentCharIndexRef.current = 0;
    initializeLines();
    setTimeout(() => startTyping(), 150);
  }, [startTyping, initializeLines]);

  if (lines.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className="space-y-3 flex flex-col items-start w-full">
      {lines.map((line, index) => {
        const currentLineIndex = currentLineIndexRef.current;
        const shouldShow = index <= currentLineIndex || line.isComplete;
        const displayText = line.isComplete ? line.text : line.currentText;
        const showCursor = index === currentLineIndex && !line.isComplete && isTyping;
        
        if (!shouldShow) return null;
        
        return (
          <div 
            key={index}
            className={`bg-white/10 text-white/90 font-mono text-sm leading-relaxed px-4 py-2 rounded-2xl cursor-pointer hover:bg-white/15 transition-colors min-h-[2.5rem] flex items-start w-full ${className}`}
            onClick={handleClick}
          >
            <div className="w-full break-words min-h-[1.5rem]">
              {displayText || '\u00A0'} {/* Non-breaking space to maintain height when empty */}
              {showCursor && <span className="animate-pulse">|</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}; 