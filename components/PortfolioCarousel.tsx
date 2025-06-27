import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { NavigationControls } from './NavigationControls';

// Lazy load all project components for better performance
const WelcomeCard = lazy(() =>
  import('./projects/welcome/WelcomeCard').then(module => ({ default: module.WelcomeCard }))
);
const RawFictionCard = lazy(() =>
  import('./projects/raw-fiction/RawFictionCard').then(module => ({
    default: module.RawFictionCard,
  }))
);
const AiInstructorCard = lazy(() =>
  import('./projects/ai-instructor/AiInstructorCard').then(module => ({
    default: module.AiInstructorCard,
  }))
);
const AiAlignmentCard = lazy(() =>
  import('./projects/ai-alignment-space/AiAlignmentCard').then(module => ({
    default: module.AiAlignmentCard,
  }))
);
const DaswallensteinCard = lazy(() =>
  import('./projects/daswallenstein/DaswallensteinCard').then(module => ({
    default: module.DaswallensteinCard,
  }))
);
const RealEyesCard = lazy(() =>
  import('./projects/real-eyes/RealEyesCard').then(module => ({ default: module.RealEyesCard }))
);
const MannerImGartenCard = lazy(() =>
  import('./projects/manner-im-garten/MannerImGartenCard').then(module => ({
    default: module.MannerImGartenCard,
  }))
);
const ConfidentialCard = lazy(() =>
  import('./projects/confidential/ConfidentialCard').then(module => ({
    default: module.ConfidentialCard,
  }))
);
const CryptohiphopCard = lazy(() =>
  import('./projects/cryptohiphop/CryptohiphopCard').then(module => ({
    default: module.CryptohiphopCard,
  }))
);
const ZeroGravCard = lazy(() =>
  import('./projects/zero-grav/ZeroGravCard').then(module => ({ default: module.ZeroGravCard }))
);
const SocialMediaCard = lazy(() =>
  import('./projects/social-media-consulting/SocialMediaCard').then(module => ({
    default: module.SocialMediaCard,
  }))
);
const AllianceCard = lazy(() =>
  import('./projects/alliance/AllianceCard').then(module => ({ default: module.AllianceCard }))
);
const LegalCard = lazy(() =>
  import('./projects/legal/LegalCard').then(module => ({ default: module.LegalCard }))
);

// Loading fallback component
const CardLoadingFallback: React.FC = () => (
  <div className="card-glass p-8 flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand-accent)]"></div>
  </div>
);

interface PortfolioProject {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  description: string;
  websiteUrl?: string;
}

// Circuit Breaker Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('Card component error contained:', error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="card-glass p-8 text-center">
            <div className="text-[var(--brand-accent)] mb-4">⚠️</div>
            <div className="text-sm opacity-75">Component Error</div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'welcome',
    title: 'Welcome to the Matrix',
    component: WelcomeCard,
    description: 'Enter the digital realm and explore the portfolio',
  },
  {
    id: 'raw-fiction',
    title: 'Raw Fiction',
    component: RawFictionCard,
    description: 'Fashion brand with images and videos',
    websiteUrl: 'https://raw-fiction.com',
  },
  {
    id: 'ai-instructor',
    title: 'AI Instructor',
    component: AiInstructorCard,
    description: 'Personal AI mentor website',
    websiteUrl: 'https://ai-instructor.com',
  },
  {
    id: 'ai-alignment-space',
    title: 'AI Alignment Space',
    component: AiAlignmentCard,
    description: 'AI safety research platform',
    websiteUrl: 'https://ai-alignment-space.com',
  },
  {
    id: 'daswallenstein',
    title: 'Das Wallenstein',
    component: DaswallensteinCard,
    description: 'Vienna-based website',
    websiteUrl: 'https://daswallenstein.at',
  },
  {
    id: 'real-eyes',
    title: 'Real Eyes',
    component: RealEyesCard,
    description: 'Event series with 7 different events',
    websiteUrl: 'https://real-eyes.events',
  },
  {
    id: 'manner-im-garten',
    title: 'Männer im Garten',
    component: MannerImGartenCard,
    description: 'Event series with 8 different events',
    websiteUrl: 'https://manner-im-garten.at',
  },
  {
    id: 'alliance',
    title: 'Alliance',
    component: AllianceCard,
    description: 'Inclusive community platform and advocacy',
    websiteUrl: 'https://alliance-platform.com',
  },
  {
    id: 'confidential',
    title: 'Confidential',
    component: ConfidentialCard,
    description: 'Luxury fashion brand showcase',
  },
  {
    id: 'cryptohiphop',
    title: 'Crypto Hip Hop',
    component: CryptohiphopCard,
    description: 'Blockchain music platform',
    websiteUrl: 'https://cryptohiphop.io',
  },
  {
    id: 'zero-grav',
    title: '1080 Zero Grav',
    component: ZeroGravCard,
    description: 'NFT collection with dual websites',
    websiteUrl: 'https://1080-zero-grav.com',
  },
  {
    id: 'social-media-consulting',
    title: 'Social Media Consulting',
    component: SocialMediaCard,
    description: 'Traffic generation and consulting',
    websiteUrl: 'https://social-media-consulting.com',
  },
  {
    id: 'legal',
    title: 'Legal Information',
    component: LegalCard,
    description: 'Privacy policy, cookies, and legal documents',
  },
];

export const PortfolioCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [wheelEnabled, setWheelEnabled] = useState(true);
  const [loadedCards, setLoadedCards] = useState<Set<number>>(new Set([0])); // Start with first card loaded
  const [loadingQueue, setLoadingQueue] = useState<number[]>([]);

  const totalProjects = PORTFOLIO_PROJECTS.length;

  // Components are now loaded on demand without preloading

  // Sequential loading system
  useEffect(() => {
    const getLoadPriority = (index: number) => {
      const relativeIndex = index - currentIndex;
      const normalizedIndex = ((relativeIndex % totalProjects) + totalProjects) % totalProjects;

      // Priority order: current -> immediate neighbors -> visible cards -> rest
      if (normalizedIndex === 0) return 1; // Current card (highest priority)
      if (normalizedIndex === 1 || normalizedIndex === totalProjects - 1) return 2; // Immediate neighbors
      if (normalizedIndex <= 3 || normalizedIndex >= totalProjects - 3) return 3; // Other visible cards
      return 4; // Background cards (lowest priority)
    };

    // Create prioritized loading queue
    const priorityQueue = Array.from({ length: totalProjects }, (_, i) => i)
      .filter(i => !loadedCards.has(i))
      .sort((a, b) => getLoadPriority(a) - getLoadPriority(b))
      .slice(0, 5); // Limit to 5 cards at a time

    setLoadingQueue(priorityQueue);
  }, [currentIndex, totalProjects, loadedCards]);

  // Process loading queue with delays
  useEffect(() => {
    if (loadingQueue.length === 0) return;

    const processNext = () => {
      const nextIndex = loadingQueue[0];
      if (nextIndex !== undefined) {
        setLoadedCards(prev => new Set([...prev, nextIndex]));
        setLoadingQueue(prev => prev.slice(1));
      }
    };

    // Immediate load for current card, delayed for others
    const priority = loadingQueue[0] === currentIndex ? 0 : 1500;
    const timer = setTimeout(processNext, priority);

    return () => clearTimeout(timer);
  }, [loadingQueue, currentIndex]);

  // 3D Space positioning - multiple cards visible like in the image
  const getCardTransform = useCallback(
    (index: number) => {
      const relativeIndex = index - currentIndex;
      const normalizedIndex = ((relativeIndex % totalProjects) + totalProjects) % totalProjects;

      // Define positions for multiple visible cards
      const positions = [
        // Center (active) card
        { x: 0, y: 0, z: 0, rotX: 0, rotY: 0, scale: 1.0, opacity: 1 },
        // Right cards - adjusted for smaller cards
        { x: 280, y: -25, z: -160, rotX: 8, rotY: -25, scale: 0.85, opacity: 0.95 },
        { x: 460, y: -70, z: -320, rotX: 12, rotY: -40, scale: 0.7, opacity: 0.8 },
        // Left cards - adjusted for smaller cards
        { x: -280, y: -25, z: -160, rotX: 8, rotY: 25, scale: 0.85, opacity: 0.95 },
        { x: -460, y: -70, z: -320, rotX: 12, rotY: 40, scale: 0.7, opacity: 0.8 },
        // Background cards - adjusted spacing
        { x: 140, y: 50, z: -450, rotX: -8, rotY: -15, scale: 0.6, opacity: 0.6 },
        { x: -140, y: 50, z: -450, rotX: -8, rotY: 15, scale: 0.6, opacity: 0.6 },
        // Far background - subtle presence
        { x: 0, y: 80, z: -600, rotX: -15, rotY: 0, scale: 0.5, opacity: 0.4 },
      ];

      const position =
        positions[Math.min(normalizedIndex, positions.length - 1)] ||
        positions[positions.length - 1];

      // Production-grade null safety
      if (!position) {
        // Fallback position if something goes wrong
        const fallbackPosition = { x: 0, y: 0, z: -1000, rotX: 0, rotY: 0, scale: 0.1, opacity: 0 };
        return {
          transform: `translate(-50%, -50%) translate3d(${fallbackPosition.x}px, ${fallbackPosition.y}px, ${fallbackPosition.z}px)`,
          opacity: fallbackPosition.opacity,
          pointerEvents: 'none',
          zIndex: 0,
          cursor: 'default',
        } as React.CSSProperties;
      }

      return {
        transform: `
         translate(-50%, -50%)
         translate3d(${position.x}px, ${position.y}px, ${position.z}px)
         rotateX(${position.rotX}deg)
         rotateY(${position.rotY}deg)
         scale(${position.scale})
       `,
        opacity: position.opacity,
        pointerEvents: position.opacity > 0.5 ? 'auto' : 'none', // Allow clicks on visible cards
        zIndex: normalizedIndex === 0 ? 100 : 50 - normalizedIndex,
        cursor: normalizedIndex === 0 ? 'default' : 'pointer',
      } as React.CSSProperties;
    },
    [currentIndex, totalProjects]
  );

  // Safe navigation functions with circuit breaker
  const goToNext = useCallback(() => {
    try {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentIndex(prev => (prev + 1) % totalProjects);
      setTimeout(() => setIsTransitioning(false), 800);
    } catch (error) {
      console.warn('Navigation error contained:', error);
      setIsTransitioning(false);
    }
  }, [isTransitioning, totalProjects]);

  const goToPrevious = useCallback(() => {
    try {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentIndex(prev => (prev - 1 + totalProjects) % totalProjects);
      setTimeout(() => setIsTransitioning(false), 800);
    } catch (error) {
      console.warn('Navigation error contained:', error);
      setIsTransitioning(false);
    }
  }, [isTransitioning, totalProjects]);

  const goToIndex = useCallback(
    (index: number) => {
      try {
        if (isTransitioning || index === currentIndex || index < 0 || index >= totalProjects)
          return;

        console.log(`Navigating from ${currentIndex} to ${index}`); // Debug log
        setIsTransitioning(true);
        setCurrentIndex(index);

        // Prioritize loading the target card immediately
        setLoadedCards(prev => new Set([...prev, index]));

        // Match the CSS transition duration
        setTimeout(() => setIsTransitioning(false), 900);
      } catch (error) {
        console.warn('Navigation error contained:', error);
        setIsTransitioning(false);
      }
    },
    [isTransitioning, currentIndex, totalProjects]
  );

  // Safe wheel navigation with circuit breaker
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      try {
        if (!wheelEnabled || isTransitioning) {
          e.preventDefault();
          return;
        }

        const target = e.target as HTMLElement;
        const isInEmbeddedSite =
          target.closest('.embedded-website') ||
          target.closest('.website-container') ||
          target.closest('.content-area');

        if (isInEmbeddedSite) return;

        e.preventDefault();

        setWheelEnabled(false);
        setTimeout(() => setWheelEnabled(true), 900);

        if (e.deltaY > 0) {
          goToNext();
        } else {
          goToPrevious();
        }
      } catch (error) {
        console.warn('Wheel navigation error contained:', error);
        setWheelEnabled(true);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [goToNext, goToPrevious, wheelEnabled, isTransitioning]);

  // Safe keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      try {
        if (isTransitioning) return;

        switch (e.key) {
          case 'ArrowRight':
          case 'ArrowDown':
            e.preventDefault();
            goToNext();
            break;
          case 'ArrowLeft':
          case 'ArrowUp':
            e.preventDefault();
            goToPrevious();
            break;
          case 'Home':
            e.preventDefault();
            goToIndex(0);
            break;
          case 'End':
            e.preventDefault();
            goToIndex(totalProjects - 1);
            break;
        }
      } catch (error) {
        console.warn('Keyboard navigation error contained:', error);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious, goToIndex, isTransitioning, totalProjects]);

  // Safe touch navigation
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      try {
        if (e.touches?.[0]) {
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
        }
      } catch (error) {
        console.warn('Touch start error contained:', error);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      try {
        if (isTransitioning) return;

        const touch = e.changedTouches?.[0];
        if (!touch) return;

        const touchEndX = touch.clientX;
        const touchEndY = touch.clientY;
        const deltaX = touchEndX - startX;
        const deltaY = touchEndY - startY;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
          if (deltaX > 0) {
            goToPrevious();
          } else {
            goToNext();
          }
        }
      } catch (error) {
        console.warn('Touch navigation error contained:', error);
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [goToNext, goToPrevious, isTransitioning]);

  return (
    <ErrorBoundary
      fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-[var(--brand-bg)]">
          <div className="text-[var(--brand-accent)]">Portfolio unavailable</div>
        </div>
      }
    >
      <div className="carousel-container">
        <div className="carousel-wrapper">
          {PORTFOLIO_PROJECTS.map((project, index) => {
            const Component = project.component;
            const shouldLoad = loadedCards.has(index);
            const isInQueue = loadingQueue.includes(index);

            return (
              <ErrorBoundary key={project.id}>
                <div
                  className="portfolio-card space-card performance-optimized"
                  style={getCardTransform(index)}
                  onClick={e => {
                    // Only allow navigation clicks on non-active cards
                    if (index !== currentIndex && !isTransitioning) {
                      // Navigate unless clicking on buttons or links
                      const target = e.target as HTMLElement;
                      const isButton = target.closest('button, a, [role="button"]');

                      if (!isButton) {
                        e.preventDefault();
                        e.stopPropagation();
                        goToIndex(index);
                      }
                    }
                  }}
                >
                  <div className="glass-overlay" />
                  <div className="card-content-container lazy-container">
                    {shouldLoad ? (
                      <Suspense fallback={<CardLoadingFallback />}>
                        <Component id={project.id} />
                      </Suspense>
                    ) : (
                      <div className="card-glass p-8 flex items-center justify-center opacity-50">
                        <div className="text-sm text-[var(--brand-accent)]">
                          {isInQueue ? 'Queued...' : 'Waiting...'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ErrorBoundary>
            );
          })}
        </div>

        <ErrorBoundary>
          <NavigationControls
            projects={PORTFOLIO_PROJECTS}
            currentIndex={currentIndex}
            onNavigate={goToIndex}
            onNext={goToNext}
            onPrevious={goToPrevious}
            isTransitioning={isTransitioning}
          />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
};
