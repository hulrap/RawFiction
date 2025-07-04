import React, { useState, useEffect, useCallback, lazy, Suspense, useMemo, useRef } from 'react';
import { NavigationControls } from './NavigationControls';
import { CardWithOverlay } from './CardWithOverlay';
import { audioManager } from '@/lib/audioManager';

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

// Memoized card component for performance
const PortfolioCard = React.memo<{
  readonly project: PortfolioProject;
  readonly style: React.CSSProperties & { carouselPosition: string };
  readonly isRevealed: boolean;
  readonly onShatter: () => void;
  readonly onCardReady: () => void;
  readonly onClick: (e: React.MouseEvent) => void;
}>(({ project, style, isRevealed, onShatter, onCardReady, onClick }) => {
  const Component = project.component;
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <ErrorBoundary key={project.id} id={project.id}>
      <div
        ref={cardRef}
        className={`portfolio-card space-card performance-optimized ${
          style.carouselPosition === 'center' ? 'active-card' : ''
        }`}
        style={style}
        onClick={onClick}
      >
        <CardWithOverlay
          title={project.title}
          isRevealed={isRevealed}
          onShatter={onShatter}
          carouselPosition={style.carouselPosition}
          onOverlayReady={onCardReady}
          forceHighQuality={style.carouselPosition !== 'hidden'}
          cardRef={cardRef}
        >
          <Suspense fallback={null}>
            <Component id={project.id} />
          </Suspense>
        </CardWithOverlay>
      </div>
    </ErrorBoundary>
  );
});

PortfolioCard.displayName = 'PortfolioCard';

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

export const PortfolioCarousel: React.FC<PortfolioCarouselProps> = React.memo(
  ({ onCardReady, showCarousel }) => {
    // Memoize total projects count
    const totalProjects = useMemo(() => PORTFOLIO_PROJECTS.length, []);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [wheelEnabled, setWheelEnabled] = useState(true);
    const [shatteredCards, setShatteredCards] = useState<Set<number>>(new Set());

    // All cards are loaded immediately now - no selective loading needed

    // Track card overlay readiness for global loading screen
    const handleCardReady = useCallback(
      (cardIndex: number) => {
        onCardReady(cardIndex);
      },
      [onCardReady]
    );

    // Memoized transform definitions (expensive object creation)
    const transformDefinitions = useMemo(
      () => ({
        center: {
          x: 0,
          y: 0,
          z: 0,
          rotX: 0,
          rotY: 0,
          scale: 1.0,
          opacity: 1,
          zIndex: 100,
          pointerEvents: 'auto' as const,
          cursor: 'default' as const,
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
          pointerEvents: 'auto' as const,
          cursor: 'pointer' as const,
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
          pointerEvents: 'auto' as const,
          cursor: 'pointer' as const,
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
          pointerEvents: 'none' as const,
          cursor: 'default' as const,
        },
      }),
      []
    );

    // Memoized position calculation function
    const getCardPosition = useCallback(
      (index: number): 'left' | 'center' | 'right' | 'hidden' => {
        if (index === currentIndex) {
          return 'center';
        }
        if (index === (currentIndex + 1) % totalProjects) {
          return 'right';
        }
        if (index === (currentIndex - 1 + totalProjects) % totalProjects) {
          return 'left';
        }
        return 'hidden';
      },
      [currentIndex, totalProjects]
    );

    // 3-Card positioning system: always show exactly 3 cards (previous, current, next)
    const getCardTransform = useCallback(
      (index: number) => {
        const position = getCardPosition(index);
        const transform = transformDefinitions[position];

        return {
          transform: `
          translate(-50%, -50%)
          translate3d(${transform.x}px, ${transform.y}px, ${transform.z}px)
          rotateX(${transform.rotX}deg)
          rotateY(${transform.rotY}deg)
          scale(${transform.scale})
        `,
          opacity: transform.opacity,
          pointerEvents: transform.pointerEvents,
          zIndex: transform.zIndex,
          cursor: transform.cursor,
          // Expose transform data for WebGL compensation
          carouselPosition: position,
        } as React.CSSProperties & {
          carouselPosition: string;
        };
      },
      [getCardPosition, transformDefinitions]
    );

    // Safe navigation functions with circuit breaker
    const goToNext = useCallback(() => {
      try {
        if (isTransitioning) return;
        audioManager.playNavigation();
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
        audioManager.playNavigation();
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
          className={`carousel-container transition-all duration-1000 ease-out ${
            showCarousel
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8 pointer-events-none'
          }`}
        >
          <div className="carousel-wrapper">
            {PORTFOLIO_PROJECTS.map((project, index) => {
              const style = getCardTransform(index);
              const isCenter = style.carouselPosition === 'center';

              // A card is revealed ONLY if it's in the center AND has been clicked.
              const isRevealed = isCenter && shatteredCards.has(index);

              // All cards now use sealed box architecture with immediate overlay

              return (
                <PortfolioCard
                  key={project.id}
                  project={project}
                  style={style}
                  isRevealed={isRevealed}
                  onShatter={() => {
                    setShatteredCards(prev => new Set([...prev, index]));
                  }}
                  onCardReady={() => handleCardReady(index)}
                  onClick={e => {
                    if (index !== currentIndex && !isTransitioning) {
                      const target = e.target as HTMLElement;
                      if (!target.closest('button, a, [role="button"]')) {
                        e.preventDefault();
                        e.stopPropagation();
                        goToIndex(index);
                      }
                    }
                  }}
                />
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
  }
);
