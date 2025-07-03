import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { NavigationControls } from './NavigationControls';
import { CardWithOverlay } from './CardWithOverlay';

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

// Import types
import type { ProjectProps } from './shared/types';

interface PortfolioCarouselProps {
  onCardReady: (cardIndex: number) => void;
  showCarousel: boolean;
}

interface PortfolioProject {
  id: string;
  title: string;
  component: React.ComponentType<ProjectProps>;
  description: string;
  websiteUrl?: string;
}

// Error Boundary with Recovery
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode; id?: string },
  { hasError: boolean; errorCount: number; lastErrorTime: number }
> {
  private retryTimeout?: NodeJS.Timeout;

  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode; id?: string }) {
    super(props);
    this.state = { hasError: false, errorCount: 0, lastErrorTime: 0 };
  }

  static getDerivedStateFromError(error: Error) {
    // Log error for debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught error:', error);
    }
    return { hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const now = Date.now();
    this.setState(prev => ({
      errorCount: prev.errorCount + 1,
      lastErrorTime: now,
    }));

    // Auto-recovery for transient errors
    if (this.state.errorCount < 3) {
      this.retryTimeout = setTimeout(
        () => {
          this.setState({ hasError: false });
        },
        Math.min(1000 * Math.pow(2, this.state.errorCount), 5000)
      );
    }

    if (process.env.NODE_ENV === 'development') {
      console.error(`ErrorBoundary [${this.props.id}]:`, error, errorInfo);
    }
  }

  override componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  override render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="card-glass p-8 text-center">
            <div className="text-[var(--brand-accent)] mb-4 text-4xl">⚠️</div>
            <div className="text-sm opacity-75 mb-4">
              Component Error ({this.state.errorCount}/3)
            </div>
            {this.state.errorCount < 3 && (
              <div className="text-xs text-gray-500">
                Auto-recovering in {Math.min(1000 * Math.pow(2, this.state.errorCount), 5000)}ms...
              </div>
            )}
            {this.state.errorCount >= 3 && (
              <button
                onClick={() => this.setState({ hasError: false, errorCount: 0 })}
                className="btn-glass mt-4"
              >
                Manual Retry
              </button>
            )}
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
    title: 'Portfolioverse',
    component: WelcomeCard,
    description: 'Enter the digital realm and explore the portfolio',
  },
  {
    id: 'raw-fiction',
    title: 'Raw Fiction',
    component: RawFictionCard,
    description: 'Fashion brand with images and videos',
    websiteUrl: 'https://rawfiction.xyz',
  },
  {
    id: 'ai-instructor',
    title: 'AI Instructor',
    component: AiInstructorCard,
    description: 'Personal AI mentor website',
    websiteUrl: 'https://ai-instructor.me',
  },
  {
    id: 'ai-alignment-space',
    title: 'AI Alignment Space',
    component: AiAlignmentCard,
    description: 'AI safety research platform',
    websiteUrl: 'https://ai-alignment.space',
  },
  {
    id: 'daswallenstein',
    title: 'Das Wallenstein',
    component: DaswallensteinCard,
    description: 'Vienna-based website',
    websiteUrl: 'https://daswallenstein.wien',
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
    title: 'Zero Grav',
    component: ZeroGravCard,
    description: 'NFT collection with dual websites',
    websiteUrl: 'https://zerograv.xyz',
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

export const PortfolioCarousel: React.FC<PortfolioCarouselProps> = ({
  onCardReady,
  showCarousel,
}) => {
  const totalProjects = PORTFOLIO_PROJECTS.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [wheelEnabled, setWheelEnabled] = useState(true);
  const [shatteredCards, setShatteredCards] = useState<Set<number>>(new Set());
  const [visitedCards, setVisitedCards] = useState<Set<number>>(new Set([0])); // Track visited cards

  // All cards are loaded immediately now - no selective loading needed

  // Mark current card as visited when it changes
  useEffect(() => {
    setVisitedCards(prev => new Set([...prev, currentIndex]));
  }, [currentIndex]);

  // Persistent shattered state: once a card is revealed, it stays revealed
  // No cleanup based on currentIndex - let cards stay revealed after being shattered

  // Track card overlay readiness for global loading screen
  const handleCardReady = useCallback(
    (cardIndex: number) => {
      onCardReady(cardIndex);
    },
    [onCardReady]
  );

  // 3-Card positioning system: always show exactly 3 cards (previous, current, next)
  const getCardTransform = useCallback(
    (index: number) => {
      // Calculate which position this card should be in
      let position: 'left' | 'center' | 'right' | 'hidden';

      // Current card is always center
      if (index === currentIndex) {
        position = 'center';
      }
      // Next card is on the right
      else if (index === (currentIndex + 1) % totalProjects) {
        position = 'right';
      }
      // Previous card is on the left
      else if (index === (currentIndex - 1 + totalProjects) % totalProjects) {
        position = 'left';
      }
      // All other cards are hidden
      else {
        position = 'hidden';
      }

      // Define positions for the 3-card layout
      const transforms = {
        center: {
          x: 0,
          y: 0,
          z: 0,
          rotX: 0,
          rotY: 0,
          scale: 1.0,
          opacity: 1,
          zIndex: 100,
          pointerEvents: 'auto',
          cursor: 'default',
        },
        left: {
          x: -500,
          y: 30,
          z: -200,
          rotX: 8,
          rotY: 35,
          scale: 0.75,
          opacity: 1,
          zIndex: 50,
          pointerEvents: 'auto',
          cursor: 'pointer',
        },
        right: {
          x: 500,
          y: 30,
          z: -200,
          rotX: 8,
          rotY: -35,
          scale: 0.75,
          opacity: 1,
          zIndex: 50,
          pointerEvents: 'auto',
          cursor: 'pointer',
        },
        hidden: {
          x: 0,
          y: 0,
          z: -1000,
          rotX: 0,
          rotY: 0,
          scale: 0.1,
          opacity: 0,
          zIndex: 0,
          pointerEvents: 'none',
          cursor: 'default',
        },
      };

      const transform = transforms[position];

      return {
        transform: `
          translate(-50%, -50%)
          translate3d(${transform.x}px, ${transform.y}px, ${transform.z}px)
          rotateX(${transform.rotX}deg)
          rotateY(${transform.rotY}deg)
          scale(${transform.scale})
        `,
        opacity: transform.opacity,
        pointerEvents: transform.pointerEvents as 'auto' | 'none',
        zIndex: transform.zIndex,
        cursor: transform.cursor,
        // Expose transform data for WebGL compensation
        carouselPosition: position,
        carouselTransform: transform,
      } as React.CSSProperties & {
        carouselPosition: string;
        carouselTransform: typeof transform;
      };
    },
    [currentIndex, totalProjects]
  );

  // Safe navigation functions with circuit breaker
  const goToNext = useCallback(() => {
    try {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentIndex(prev => (prev + 1) % totalProjects);
      setTimeout(() => setIsTransitioning(false), 100);
    } catch (error) {
      // Handle navigation errors silently
      setIsTransitioning(false);
    }
  }, [isTransitioning, totalProjects]);

  const goToPrevious = useCallback(() => {
    try {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentIndex(prev => (prev - 1 + totalProjects) % totalProjects);
      setTimeout(() => setIsTransitioning(false), 100);
    } catch (error) {
      // Handle navigation errors silently
      setIsTransitioning(false);
    }
  }, [isTransitioning, totalProjects]);

  const goToIndex = useCallback(
    (index: number) => {
      try {
        if (isTransitioning || index === currentIndex || index < 0 || index >= totalProjects)
          return;

        setIsTransitioning(true);
        setCurrentIndex(index);

        // Mark card as visited when navigating to it
        setVisitedCards(prev => new Set([...prev, index]));

        // Match the CSS transition duration
        setTimeout(() => setIsTransitioning(false), 50);
      } catch (error) {
        // Handle navigation errors silently
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
        setTimeout(() => setWheelEnabled(true), 400);

        if (e.deltaY > 0) {
          goToNext();
        } else {
          goToPrevious();
        }
      } catch (error) {
        // Handle wheel navigation errors silently
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
        // Handle keyboard navigation errors silently
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
        // Handle touch start errors silently
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
        // Handle touch navigation errors silently
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
      {/* Global Loading Screen - Wait for all card overlays */}
      <div
        className={`carousel-container transition-opacity duration-1000 ${
          showCarousel ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="carousel-wrapper">
          {PORTFOLIO_PROJECTS.map((project, index) => {
            const Component = project.component;
            const cardTransform = getCardTransform(index);
            const isVisited = visitedCards.has(index);
            const isCenter = cardTransform.carouselPosition === 'center';

            // Fixed rule: once a card is shattered (revealed), it stays revealed regardless of position
            const wasShattered = shatteredCards.has(index);
            const shouldShowOverlay = !wasShattered;
            // Non-center cards get immediate overlay for smooth transitions (only if they need overlay)
            const needsImmediateOverlay = !isCenter && shouldShowOverlay;

            return (
              <ErrorBoundary key={project.id} id={project.id}>
                <div
                  className={`portfolio-card space-card performance-optimized ${
                    index === currentIndex ? 'active-card' : ''
                  }`}
                  style={cardTransform}
                  onClick={e => {
                    // Allow navigation to visited cards or adjacent cards
                    const canNavigate =
                      index !== currentIndex &&
                      !isTransitioning &&
                      (isVisited || cardTransform.carouselPosition !== 'hidden');

                    if (canNavigate) {
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
                  {/* ALWAYS render CardWithOverlay for consistent cube grid quality */}
                  <CardWithOverlay
                    title={project.title}
                    isOverlayVisible={shouldShowOverlay}
                    needsImmediateOverlay={needsImmediateOverlay}
                    onShatter={() => {
                      setShatteredCards(prev => new Set([...prev, index]));
                    }}
                    carouselPosition={cardTransform.carouselPosition}
                    carouselTransform={cardTransform.carouselTransform}
                    forceHighQuality={true} // Force high quality for all cards
                    onOverlayReady={() => handleCardReady(index)}
                  >
                    {/* Always load all content immediately for instant reveal */}
                    <Suspense
                      fallback={
                        <div className="card-glass p-8 flex items-center justify-center opacity-50">
                          <div className="text-sm text-[var(--brand-accent)]">Loading...</div>
                        </div>
                      }
                    >
                      <Component id={project.id} />
                    </Suspense>
                  </CardWithOverlay>
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
