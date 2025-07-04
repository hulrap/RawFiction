'use client';

import { useState, useEffect, useCallback } from 'react';
import Background from '@/components/Background';
import { PortfolioCarousel } from '@/components/PortfolioCarousel';
import { IntegratedLoadingScreen } from '@/components/shared/IntegratedLoadingScreen';
import * as THREE from 'three';

// Constants
const TOTAL_PROJECTS = 13; // Set this to the actual number of projects

export default function ClientWrapper() {
  const [isMounted, setIsMounted] = useState(false);
  const [backgroundReady, setBackgroundReady] = useState(false);
  const [readyCards, setReadyCards] = useState<Set<number>>(new Set());
  const [showCarousel, setShowCarousel] = useState(false);
  const [mouse, setMouse] = useState(new THREE.Vector2(0, 0));

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

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = event;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    // Convert to NDC (-1 to +1) for Three.js
    setMouse(
      new THREE.Vector2(((clientX - left) / width) * 2 - 1, -((clientY - top) / height) * 2 + 1)
    );
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{ width: '100vw', height: '100vh', position: 'relative' }}
    >
      <Background onReady={handleBackgroundReady} mouse={mouse} />
      {backgroundReady && (
        <IntegratedLoadingScreen
          loadedCount={readyCards.size}
          totalCount={TOTAL_PROJECTS}
          isReady={showCarousel}
        />
      )}
      <PortfolioCarousel onCardReady={handleCardReady} showCarousel={showCarousel} />
    </div>
  );
}
