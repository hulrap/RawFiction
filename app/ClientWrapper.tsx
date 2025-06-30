'use client';

import { useState, useEffect } from 'react';
import { SimpleLoadingScreen } from '@/components/shared/SimpleLoadingScreen';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

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
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);

    // Small delay to ensure smooth transition, then fade in content
    setTimeout(() => {
      setShowContent(true);
    }, 100);
  };

  if (!isClient) {
    return <SimpleLoadingScreen onComplete={() => {}} />;
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

      {isLoading ? (
        <SimpleLoadingScreen onComplete={handleLoadingComplete} />
      ) : (
        <div
          className={`transition-opacity duration-700 ${showContent ? 'opacity-100' : 'opacity-0'}`}
        >
          <Suspense fallback={<SimpleLoadingScreen onComplete={() => {}} />}>
            <PortfolioCarousel />
          </Suspense>
        </div>
      )}
    </>
  );
}
