import { useState, useEffect, useCallback, useRef } from 'react';

export interface ContentLoadingState {
  tabsLoaded: Set<string>;
  imagesLoaded: Set<string>;
  galleriesLoaded: Set<string>;
  activeTab: string;
  isTabLoading: boolean;
  isGalleryOpen: boolean;
  visibleImages: Set<string>;
  loadingProgress: number;
}

export interface ImageLoadingConfig {
  id: string;
  src: string;
  alt: string;
  priority: 'high' | 'medium' | 'low';
  tabId?: string;
  galleryId?: string;
}

export interface TabLoadingConfig {
  id: string;
  title: string;
  hasGallery?: boolean;
  imageCount?: number;
  priority: 'immediate' | 'preload' | 'lazy';
}

export interface ContentLoadingConfig {
  tabs: TabLoadingConfig[];
  images: ImageLoadingConfig[];
  batchSize?: number;
  intersectionThreshold?: number;
  preloadDistance?: number;
}

export const useContentLoading = (config: ContentLoadingConfig) => {
  const [state, setState] = useState<ContentLoadingState>({
    tabsLoaded: new Set(),
    imagesLoaded: new Set(),
    galleriesLoaded: new Set(),
    activeTab: '',
    isTabLoading: false,
    isGalleryOpen: false,
    visibleImages: new Set(),
    loadingProgress: 0,
  });

  const {
    tabs,
    images,
    batchSize: _batchSize = 4,
    intersectionThreshold: _intersectionThreshold = 0.1,
    preloadDistance: _preloadDistance = 2,
  } = config;

  const loadingTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const intersectionObserver = useRef<IntersectionObserver>();

  // Simplified image loading function
  const queueImageLoad = useCallback(
    (imageId: string, _priority: 'high' | 'medium' | 'low' = 'medium') => {
      if (state.imagesLoaded.has(imageId)) return;

      setState(prev => ({
        ...prev,
        imagesLoaded: new Set([...prev.imagesLoaded, imageId]),
      }));
    },
    [state.imagesLoaded]
  );

  // Simplified tab loading
  const loadTab = useCallback(
    (tabId: string) => {
      if (state.tabsLoaded.has(tabId)) return;

      setState(prev => ({
        ...prev,
        isTabLoading: true,
        activeTab: tabId,
      }));

      const timeout = setTimeout(() => {
        setState(prev => ({
          ...prev,
          tabsLoaded: new Set([...prev.tabsLoaded, tabId]),
          isTabLoading: false,
        }));
      }, 500);

      loadingTimeouts.current.set(tabId, timeout);
    },
    [state.tabsLoaded]
  );

  // Gallery management
  const openGallery = useCallback((galleryId: string, _tabId: string) => {
    setState(prev => ({
      ...prev,
      isGalleryOpen: true,
      galleriesLoaded: new Set([...prev.galleriesLoaded, galleryId]),
    }));
  }, []);

  const closeGallery = useCallback(() => {
    setState(prev => ({
      ...prev,
      isGalleryOpen: false,
    }));
  }, []);

  // Simple image observation
  const observeImage = useCallback(
    (element: HTMLElement, imageId: string) => {
      if (!element || state.imagesLoaded.has(imageId)) return;

      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              queueImageLoad(imageId);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '50px' }
      );

      observer.observe(element);
    },
    [state.imagesLoaded, queueImageLoad]
  );

  const unobserveImage = useCallback((element: HTMLElement) => {
    if (intersectionObserver.current) {
      intersectionObserver.current.unobserve(element);
    }
  }, []);

  // Calculate loading progress
  useEffect(() => {
    const totalTabs = tabs.length;
    const totalImages = images.length;
    const loadedTabs = state.tabsLoaded.size;
    const loadedImages = state.imagesLoaded.size;

    const progress = Math.round(
      ((loadedTabs / totalTabs) * 0.3 + (loadedImages / totalImages) * 0.7) * 100
    );

    setState(prev => ({
      ...prev,
      loadingProgress: progress,
    }));
  }, [state.tabsLoaded.size, state.imagesLoaded.size, tabs.length, images.length]);

  // Cleanup
  useEffect(() => {
    const timeoutsRef = loadingTimeouts.current;

    return () => {
      timeoutsRef.forEach(timeout => clearTimeout(timeout));
      timeoutsRef.clear();
    };
  }, []);

  return {
    state,
    actions: {
      loadTab,
      openGallery,
      closeGallery,
      queueImageLoad,
      observeImage,
      unobserveImage,
    },
  };
};

export const ContentLoadingIndicator: React.FC<{
  isLoading: boolean;
  progress: number;
  type: 'tab' | 'gallery' | 'general';
  message?: string;
}> = ({ isLoading, progress, type, message }) => {
  if (!isLoading) return null;

  const getLoadingIcon = () => {
    switch (type) {
      case 'tab':
        return '💎';
      case 'gallery':
        return '📸';
      default:
        return '🚀';
    }
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div className="text-center bg-gray-800 rounded-lg p-4">
        <div className="text-2xl mb-2">{getLoadingIcon()}</div>
        <div className="text-white text-sm mb-2">{message || `Loading ${type}...`}</div>
        <div className="w-32 bg-gray-700 rounded-full h-1">
          <div
            className="h-1 rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #a855f7, #9333ea, #7c3aed, #6d28d9)',
            }}
          />
        </div>
        <div className="text-xs text-gray-400 mt-1">{progress}%</div>
      </div>
    </div>
  );
};
