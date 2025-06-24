'use client';

import React, { useState } from 'react';
import { PortfolioCarousel } from '@/components/PortfolioCarousel';
import { Background } from '@/components/Background';
import { LoadingScreen } from '@/components/LoadingScreen';

const ClientWrapper: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <Background />
      <main className={`relative min-h-screen text-[var(--brand-fg)] overflow-hidden transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <PortfolioCarousel isReady={!isLoading} />
      </main>
    </>
  );
};

export default ClientWrapper; 