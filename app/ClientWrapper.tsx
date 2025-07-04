'use client';

import { useState, useEffect, useCallback } from 'react';
import Background from '@/components/Background';
import { PortfolioCarousel } from '@/components/PortfolioCarousel';
import { IntegratedLoadingScreen } from '@/components/shared/IntegratedLoadingScreen';

// Constants
const TOTAL_PROJECTS = 13; // Set this to the actual number of projects

export default function ClientWrapper() {
  const [isMounted, setIsMounted] = useState(false);
  const [backgroundReady, setBackgroundReady] = useState(false);
  const [readyCards, setReadyCards] = useState<Set<number>>(new Set());
  const [showCarousel, setShowCarousel] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleBackgroundReady = useCallback(() => {
    setBackgroundReady(true);
  }, []);

  const handleCardReady = useCallback((cardIndex: number) => {
    setReadyCards(prev => new Set(prev).add(cardIndex));
  }, []);

  const allCardsReady = readyCards.size === TOTAL_PROJECTS;

  useEffect(() => {
    if (!allCardsReady) {
      return;
    }

    const timer = setTimeout(() => {
      setShowCarousel(true);
    }, 1000);

    // Cleanup function
    return () => {
      clearTimeout(timer);
    };
  }, [allCardsReady]);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Background onReady={handleBackgroundReady} />
      {backgroundReady && (
        <IntegratedLoadingScreen
          loadedCount={readyCards.size}
          totalCount={TOTAL_PROJECTS}
          isReady={showCarousel}
        />
      )}
      <PortfolioCarousel onCardReady={handleCardReady} showCarousel={showCarousel} />
    </>
  );
}
