'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Background from '@/components/Background';
import { PortfolioCarousel } from '@/components/PortfolioCarousel';
import { IntegratedLoadingScreen } from '@/components/shared/IntegratedLoadingScreen';
import * as THREE from 'three';
import { audioManager } from '@/lib/audioManager';

// Constants
const TOTAL_PROJECTS = 13; // Set this to the actual number of projects

export default function ClientWrapper() {
  const [isMounted, setIsMounted] = useState(false);
  const [backgroundReady, setBackgroundReady] = useState(false);
  const [readyCards, setReadyCards] = useState<Set<number>>(new Set());
  const [audioReady, setAudioReady] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);
  const [mouse, setMouse] = useState(new THREE.Vector2(0, 0));
  const [audioInitialized, setAudioInitialized] = useState(false);

  const lastMousePosition = useRef({ x: 0, y: 0 });
  const lastMouseTime = useRef(0);
  const mouseInactivityTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMounted(true);

    // Preload audio system
    const preloadAudio = async () => {
      try {
        await audioManager.preload();
        setAudioReady(true);
        console.log('Audio preloaded successfully');
      } catch (error) {
        console.error('Failed to preload audio:', error);
        // Still mark as ready to not block the site
        setAudioReady(true);
      }
    };

    preloadAudio();

    return () => {
      audioManager.stopHover(); // Clean up on unmount
      if (mouseInactivityTimer.current) {
        clearTimeout(mouseInactivityTimer.current);
      }
    };
  }, []);

  const handleBackgroundReady = useCallback(() => {
    setBackgroundReady(true);
  }, []);

  const handleCardReady = useCallback((cardIndex: number) => {
    setReadyCards(prev => new Set(prev).add(cardIndex));
  }, []);

  const allCardsReady = readyCards.size === TOTAL_PROJECTS;
  const allSystemsReady = allCardsReady && audioReady;

  useEffect(() => {
    if (!allSystemsReady) {
      return;
    }

    const timer = setTimeout(() => {
      setShowCarousel(true);
    }, 1000);

    // Cleanup function
    return () => {
      clearTimeout(timer);
    };
  }, [allSystemsReady]);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!audioInitialized) {
        audioManager.startHover();
        setAudioInitialized(true);
      }

      const { clientX, clientY, currentTarget } = event;
      const { left, top, width, height } = currentTarget.getBoundingClientRect();

      const now = performance.now();
      const deltaX = clientX - lastMousePosition.current.x;
      const deltaY = clientY - lastMousePosition.current.y;
      const deltaTime = now - lastMouseTime.current;

      if (deltaTime > 0) {
        const speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / deltaTime;
        const normalizedSpeed = Math.min(speed / 10, 1.0); // Normalize and cap speed
        audioManager.updateHoverIntensity(normalizedSpeed);
      }

      lastMousePosition.current = { x: clientX, y: clientY };
      lastMouseTime.current = now;

      // Clear any existing inactivity timer
      if (mouseInactivityTimer.current) {
        clearTimeout(mouseInactivityTimer.current);
      }

      // Set a timer to reduce intensity if mouse stops moving
      mouseInactivityTimer.current = setTimeout(() => {
        audioManager.updateHoverIntensity(0);
      }, 100); // Reduce intensity after 100ms of no movement

      // Convert to NDC (-1 to +1) for Three.js
      setMouse(
        new THREE.Vector2(((clientX - left) / width) * 2 - 1, -((clientY - top) / height) * 2 + 1)
      );
    },
    [audioInitialized]
  );

  const handleMouseLeave = useCallback(() => {
    // Stop audio when mouse leaves the screen
    audioManager.updateHoverIntensity(0);
    if (mouseInactivityTimer.current) {
      clearTimeout(mouseInactivityTimer.current);
    }
  }, []);

  if (!isMounted) {
    return null;
  }

  // Calculate total loading items (cards + audio)
  const totalLoadingItems = TOTAL_PROJECTS + 1; // +1 for audio
  const loadedItems = readyCards.size + (audioReady ? 1 : 0);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ width: '100vw', height: '100vh', position: 'relative' }}
    >
      <Background onReady={handleBackgroundReady} mouse={mouse} />
      {backgroundReady && (
        <IntegratedLoadingScreen
          loadedCount={loadedItems}
          totalCount={totalLoadingItems}
          isReady={showCarousel}
        />
      )}
      <PortfolioCarousel onCardReady={handleCardReady} showCarousel={showCarousel} />
    </div>
  );
}
