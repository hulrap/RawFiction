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

// Import types
import type { ProjectProps } from './shared/types';

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
    title: 'Welcome to the Portfolioverse',
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
  const totalProjects = PORTFOLIO_PROJECTS.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [wheelEnabled, setWheelEnabled] = useState(true);
  // Zero latency initialization - preload critical cards immediately
  const [loadedCards, setLoadedCards] = useState<Set<number>>(() => {
    const initialCards = new Set<number>();

    // Load all lightweight cards immediately (zero cost)
    for (let i = 0; i < totalProjects; i++) {
      const lightweightIds = ['welcome', 'confidential', 'legal'];
      const projectId = PORTFOLIO_PROJECTS[i]?.id;
      if (projectId && lightweightIds.includes(projectId)) {
        initialCards.add(i);
      }
    }

    // Preload navigation sequence: last, first, second, third, fourth
    const navigationOrder = [
      totalProjects - 1, // last (Legal)
      0, // first (Welcome)
      1, // second (Raw Fiction)
      2, // third (AI Instructor)
      3, // fourth (AI Alignment)
    ];

    navigationOrder.forEach(index => {
      if (index < totalProjects) {
        initialCards.add(index);
      }
    });

    return initialCards;
  });
  const [loadingQueue, setLoadingQueue] = useState<number[]>([]);

  // Determine which cards are lightweight (static text) vs heavy (embedded sites)
  const isLightweightCard = useCallback((index: number) => {
    const lightweightIds = ['welcome', 'confidential', 'legal'];
    const projectId = PORTFOLIO_PROJECTS[index]?.id;
    return projectId ? lightweightIds.includes(projectId) : false;
  }, []);

  // Components are now loaded on demand without preloading

  // Smart navigation-based loading system
  useEffect(() => {
    const getNavigationOrder = () => {
      // Navigation order: last, first, second, then third, fourth, etc.
      const lastIndex = totalProjects - 1;
      const firstIndex = 0;
      const secondIndex = 1;

      const navigationOrder = [lastIndex, firstIndex, secondIndex];

      // Add remaining cards in order (third, fourth, etc.)
      for (let i = 2; i < totalProjects - 1; i++) {
        navigationOrder.push(i);
      }

      return navigationOrder;
    };

    const getVisibleCards = () => {
      const previousIndex = (currentIndex - 1 + totalProjects) % totalProjects;
      const nextIndex = (currentIndex + 1) % totalProjects;
      return [previousIndex, currentIndex, nextIndex];
    };

    const getLoadPriority = (index: number) => {
      const visibleCards = getVisibleCards();
      const navigationOrder = getNavigationOrder();

      // Instant load for lightweight cards
      if (isLightweightCard(index)) return 0;

      // Highest priority for visible cards
      if (visibleCards.includes(index)) {
        if (index === currentIndex) return 1; // Current card
        return 2; // Side cards
      }

      // Medium priority based on navigation order
      const navOrderIndex = navigationOrder.indexOf(index);
      if (navOrderIndex !== -1) return 10 + navOrderIndex;

      return 999; // Very low priority for others
    };

    // Create optimized loading queue
    const unloadedCards = Array.from({ length: totalProjects }, (_, i) => i).filter(
      i => !loadedCards.has(i)
    );

    const priorityQueue = unloadedCards
      .sort((a, b) => getLoadPriority(a) - getLoadPriority(b))
      .slice(0, 5); // Limit concurrent loading

    setLoadingQueue(priorityQueue);
  }, [currentIndex, totalProjects, loadedCards, isLightweightCard]);

  // Zero latency loading - process immediately
  useEffect(() => {
    if (loadingQueue.length === 0) return;

    // Process all queued cards immediately - no delays
    const processAllQueued = () => {
      setLoadedCards(prev => {
        const newLoaded = new Set(prev);
        loadingQueue.forEach(index => newLoaded.add(index));
        return newLoaded;
      });
      setLoadingQueue([]);
    };

    // Use immediate execution for zero latency
    processAllQueued();
  }, [loadingQueue]);

  // Background preloader - load all remaining cards immediately after mount
  useEffect(() => {
    const backgroundLoad = () => {
      setLoadedCards(prev => {
        const allCards = new Set(prev);
        // Load ALL cards for zero latency navigation
        for (let i = 0; i < totalProjects; i++) {
          allCards.add(i);
        }
        return allCards;
      });
    };

    // Load everything in the background immediately
    const timer = setTimeout(backgroundLoad, 0);
    return () => clearTimeout(timer);
  }, [totalProjects]);

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
          x: -320,
          y: 20,
          z: -100,
          rotX: 5,
          rotY: 25,
          scale: 0.85,
          opacity: 0.8,
          zIndex: 50,
          pointerEvents: 'auto',
          cursor: 'pointer',
        },
        right: {
          x: 320,
          y: 20,
          z: -100,
          rotX: 5,
          rotY: -25,
          scale: 0.85,
          opacity: 0.8,
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
      // Handle navigation errors silently
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

        // Prioritize loading the target card immediately
        setLoadedCards(prev => new Set([...prev, index]));

        // Match the CSS transition duration
        setTimeout(() => setIsTransitioning(false), 900);
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
        setTimeout(() => setWheelEnabled(true), 900);

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
      <div className="carousel-container">
        <div className="carousel-wrapper">
          {PORTFOLIO_PROJECTS.map((project, index) => {
            const Component = project.component;
            const shouldLoad = loadedCards.has(index);
            const isLightweight = isLightweightCard(index);

            return (
              <ErrorBoundary key={project.id} id={project.id}>
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
                    {shouldLoad || isLightweight ? (
                      // Zero latency rendering - no loading states for preloaded components
                      shouldLoad ? (
                        <Component id={project.id} />
                      ) : (
                        <Suspense fallback={null}>
                          <Component id={project.id} />
                        </Suspense>
                      )
                    ) : (
                      <div className="card-glass p-8 flex items-center justify-center opacity-50">
                        <div className="text-sm text-[var(--brand-accent)]">Loading...</div>
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
