'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports with SSR disabled to prevent hydration issues
const Background = dynamic(
  () => import('@/components/Background').then(mod => ({ default: mod.Background })),
  {
    ssr: false,
  }
);

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
      {/* Bio-Inspired 3D Background - RawFiction Engine */}
      <Background
        enableWebGPU={false}
        enablePathTracing={false}
        enableSmartSwarm={true}
        enableNeuralParticles={false}
        quality="low"
        enableMouseInteraction={false}
        className="fixed inset-0 -z-10"
      />

      <PortfolioCarousel />
    </>
  );
}
