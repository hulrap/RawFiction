'use client';

import { useState } from 'react';
import { SimpleLoadingScreen } from '@/components/shared/SimpleLoadingScreen';
import { Suspense, lazy } from 'react';

// Lazy load the main carousel for better performance
const PortfolioCarousel = lazy(() =>
  import('@/components/PortfolioCarousel').then(module => ({ default: module.PortfolioCarousel }))
);

export default function ClientWrapper() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <SimpleLoadingScreen onComplete={handleLoadingComplete} />
      ) : (
        <Suspense fallback={<SimpleLoadingScreen onComplete={() => {}} />}>
          <PortfolioCarousel />
        </Suspense>
      )}
    </>
  );
}
