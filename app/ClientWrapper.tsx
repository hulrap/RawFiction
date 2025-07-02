'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports with SSR disabled to prevent hydration issues
const Background = dynamic(() => import('@/components/Background'), {
  ssr: false,
});

const PortfolioCarousel = dynamic(
  () => import('@/components/PortfolioCarousel').then(mod => ({ default: mod.PortfolioCarousel })),
  {
    ssr: false,
  }
);

export default function ClientWrapper() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // No loading screen - let PortfolioCarousel handle it
  }

  return (
    <>
      {/* 3D Cube Maze Background - Behind everything */}
      <Background />

      <PortfolioCarousel />
    </>
  );
}
