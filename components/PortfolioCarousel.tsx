import React, { useState, useEffect, useCallback } from 'react';
import { NavigationControls } from './NavigationControls';

// Import project components
import { WelcomeCard } from './projects/welcome/WelcomeCard';
import { RawFictionCard } from './projects/raw-fiction/RawFictionCard';
import { AiInstructorCard } from './projects/ai-instructor/AiInstructorCard';
import { AiAlignmentCard } from './projects/ai-alignment-space/AiAlignmentCard';
import { DaswallensteinCard } from './projects/daswallenstein/DaswallensteinCard';
import { RealEyesCard } from './projects/real-eyes/RealEyesCard';
import { MannerImGartenCard } from './projects/manner-im-garten/MannerImGartenCard';
import { ConfidentialCard } from './projects/confidential/ConfidentialCard';
import { CryptohiphopCard } from './projects/cryptohiphop/CryptohiphopCard';
import { ZeroGravCard } from './projects/zero-grav/ZeroGravCard';
import { SocialMediaCard } from './projects/social-media-consulting/SocialMediaCard';
import { AllianceCard } from './projects/alliance/AllianceCard';
import { LegalCard } from './projects/legal/LegalCard';

interface PortfolioProject {
  id: string;
  title: string;
  component: React.ComponentType;
  description: string;
}

const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'welcome',
    title: 'Welcome to the Matrix',
    component: WelcomeCard,
    description: 'Enter the digital realm and explore the portfolio'
  },
  {
    id: 'raw-fiction',
    title: 'Raw Fiction',
    component: RawFictionCard,
    description: 'Fashion brand with images and videos'
  },
  {
    id: 'ai-instructor',
    title: 'AI Instructor',
    component: AiInstructorCard,
    description: 'Personal AI mentor website'
  },
  {
    id: 'ai-alignment-space',
    title: 'AI Alignment Space',
    component: AiAlignmentCard,
    description: 'AI safety research platform'
  },
  {
    id: 'daswallenstein',
    title: 'Das Wallenstein',
    component: DaswallensteinCard,
    description: 'Vienna-based website'
  },
  {
    id: 'real-eyes',
    title: 'Real Eyes',
    component: RealEyesCard,
    description: 'Event series with 7 different events'
  },
  {
    id: 'manner-im-garten',
    title: 'Männer im Garten',
    component: MannerImGartenCard,
    description: 'Event series with 8 different events'
  },
  {
    id: 'alliance',
    title: 'Alliance',
    component: AllianceCard,
    description: 'Inclusive community platform and advocacy'
  },
  {
    id: 'confidential',
    title: 'Confidential',
    component: ConfidentialCard,
    description: 'Luxury fashion brand showcase'
  },
  {
    id: 'cryptohiphop',
    title: 'Crypto Hip Hop',
    component: CryptohiphopCard,
    description: 'Blockchain music platform'
  },
  {
    id: 'zero-grav',
    title: '1080 Zero Grav',
    component: ZeroGravCard,
    description: 'NFT collection with dual websites'
  },
  {
    id: 'social-media-consulting',
    title: 'Social Media Consulting',
    component: SocialMediaCard,
    description: 'Traffic generation and consulting'
  },
  {
    id: 'legal',
    title: 'Legal Information',
    component: LegalCard,
    description: 'Privacy policy, cookies, and legal documents'
  }
];

interface PortfolioCarouselProps {
  isReady: boolean;
}

export const PortfolioCarousel: React.FC<PortfolioCarouselProps> = ({ isReady }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [wheelEnabled, setWheelEnabled] = useState(true);

  const totalProjects = PORTFOLIO_PROJECTS.length;
  const anglePerProject = 360 / totalProjects;

  // Calculate 3D positions for each card
  const getCardTransform = useCallback((index: number) => {
    const angle = (index - currentIndex) * anglePerProject;
    const radius = window.innerWidth > 768 ? 1200 : 800;
    const translateZ = radius;
    
    return {
      transform: `
        rotateY(${angle}deg) 
        translateZ(${translateZ}px) 
        rotateY(${-angle}deg)
      `,
      opacity: Math.abs(angle) > 90 ? 0 : 1,
      pointerEvents: index === currentIndex ? 'auto' : 'none'
    } as React.CSSProperties;
  }, [currentIndex, anglePerProject]);

  // Navigation functions
  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % totalProjects);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning, totalProjects]);

  const goToPrevious = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + totalProjects) % totalProjects);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning, totalProjects]);

  const goToIndex = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning, currentIndex]);

  // Wheel navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!wheelEnabled || isTransitioning) {
        e.preventDefault();
        return;
      }

      // Check if we're scrolling within an embedded website
      const target = e.target as HTMLElement;
      const isInEmbeddedSite = target.closest('.embedded-website') || 
                               target.closest('.website-container') ||
                               target.closest('.content-area');
      
      if (isInEmbeddedSite) {
        // Allow normal scrolling within embedded content
        return;
      }

      e.preventDefault();
      
      // Temporarily disable wheel to prevent rapid firing
      setWheelEnabled(false);
      setTimeout(() => setWheelEnabled(true), 900);

      if (e.deltaY > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [goToNext, goToPrevious, wheelEnabled, isTransitioning]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious, goToIndex, isTransitioning, totalProjects]);

  // Touch/swipe support
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isTransitioning) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;

      // Check if it's a horizontal swipe (more horizontal than vertical)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          goToPrevious();
        } else {
          goToNext();
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [goToNext, goToPrevious, isTransitioning]);

  if (!isReady) {
    return null;
  }

  return (
    <div className="carousel-container">
      <div 
        className="carousel-wrapper"
        style={{
          transform: `rotateY(${-currentIndex * anglePerProject}deg)`
        }}
      >
        {PORTFOLIO_PROJECTS.map((project, index) => {
          const Component = project.component;
          return (
            <div
              key={project.id}
              className="portfolio-card"
              style={getCardTransform(index)}
            >
              <div className="glass-overlay" />
              <Component />
            </div>
          );
        })}
      </div>

      <NavigationControls
        projects={PORTFOLIO_PROJECTS}
        currentIndex={currentIndex}
        onNavigate={goToIndex}
        onNext={goToNext}
        onPrevious={goToPrevious}
        isTransitioning={isTransitioning}
      />
    </div>
  );
}; 