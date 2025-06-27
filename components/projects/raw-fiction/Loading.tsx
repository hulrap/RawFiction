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
  priorityQueue: string[];
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
    priorityQueue: [],
  });

  const { tabs, images, batchSize = 3, intersectionThreshold = 0.1, preloadDistance = 2 } = config;

  const loadingTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const intersectionObserver = useRef<IntersectionObserver>();
  const loadingBatch = useRef<Set<string>>(new Set());

  // Initialize intersection observer for image lazy loading
  useEffect(() => {
    intersectionObserver.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const imageId = entry.target.getAttribute('data-image-id');
          if (imageId && entry.isIntersecting) {
            setState(prev => ({
              ...prev,
              visibleImages: new Set([...prev.visibleImages, imageId]),
            }));
            queueImageLoad(imageId, 'medium');
          }
        });
      },
      { threshold: intersectionThreshold }
    );

    return () => {
      intersectionObserver.current?.disconnect();
    };
  }, [intersectionThreshold]);

  // Priority-based loading queue management
  const queueImageLoad = useCallback(
    (imageId: string, priority: 'high' | 'medium' | 'low') => {
      setState(prev => {
        if (prev.imagesLoaded.has(imageId) || loadingBatch.current.has(imageId)) {
          return prev;
        }

        const newQueue = [...prev.priorityQueue];
        const image = images.find(img => img.id === imageId);

        if (image) {
          // Insert based on priority
          const priorityIndex =
            priority === 'high'
              ? 0
              : priority === 'medium'
                ? Math.floor(newQueue.length / 2)
                : newQueue.length;
          newQueue.splice(priorityIndex, 0, imageId);
        }

        return {
          ...prev,
          priorityQueue: newQueue,
        };
      });
    },
    [images]
  );

  // Process loading queue in batches
  const processLoadingQueue = useCallback(() => {
    setState(prev => {
      if (prev.priorityQueue.length === 0 || loadingBatch.current.size >= batchSize) {
        return prev;
      }

      const toLoad = prev.priorityQueue.slice(0, batchSize - loadingBatch.current.size);
      toLoad.forEach(imageId => {
        loadingBatch.current.add(imageId);

        const image = images.find(img => img.id === imageId);
        if (image) {
          const img = new Image();
          img.onload = () => handleImageLoaded(imageId);
          img.onerror = () => handleImageError(imageId);
          img.src = image.src;
        }
      });

      return {
        ...prev,
        priorityQueue: prev.priorityQueue.slice(toLoad.length),
      };
    });
  }, [batchSize, images]);

  const handleImageLoaded = useCallback(
    (imageId: string) => {
      loadingBatch.current.delete(imageId);
      setState(prev => ({
        ...prev,
        imagesLoaded: new Set([...prev.imagesLoaded, imageId]),
      }));

      // Process next batch
      setTimeout(processLoadingQueue, 50);
    },
    [processLoadingQueue]
  );

  const handleImageError = useCallback(
    (imageId: string) => {
      loadingBatch.current.delete(imageId);
      console.warn(`Failed to load image: ${imageId}`);

      // Continue with next batch even on error
      setTimeout(processLoadingQueue, 50);
    },
    [processLoadingQueue]
  );

  // Tab loading management
  const loadTab = useCallback(
    (tabId: string) => {
      setState(prev => ({
        ...prev,
        activeTab: tabId,
        isTabLoading: true,
      }));

      const tab = tabs.find(t => t.id === tabId);
      if (!tab) return;

      // Load tab content with delay simulation
      const loadingTimeout = setTimeout(
        () => {
          setState(prev => ({
            ...prev,
            tabsLoaded: new Set([...prev.tabsLoaded, tabId]),
            isTabLoading: false,
          }));

          // Preload adjacent tabs
          const currentIndex = tabs.findIndex(t => t.id === tabId);
          for (let i = 1; i <= preloadDistance; i++) {
            const nextIndex = currentIndex + i;
            const prevIndex = currentIndex - i;

            if (nextIndex < tabs.length && tabs[nextIndex]) {
              preloadTab(tabs[nextIndex].id);
            }
            if (prevIndex >= 0 && tabs[prevIndex]) {
              preloadTab(tabs[prevIndex].id);
            }
          }

          // Load high-priority images for this tab
          const tabImages = images.filter(img => img.tabId === tabId && img.priority === 'high');
          tabImages.forEach(img => queueImageLoad(img.id, 'high'));
          processLoadingQueue();
        },
        tab.priority === 'immediate' ? 100 : 300
      );

      loadingTimeouts.current.set(tabId, loadingTimeout);
    },
    [tabs, preloadDistance, images, queueImageLoad, processLoadingQueue]
  );

  const preloadTab = useCallback(
    (tabId: string) => {
      if (state.tabsLoaded.has(tabId)) return;

      const tab = tabs.find(t => t.id === tabId);
      if (!tab || tab.priority === 'lazy') return;

      const preloadTimeout = setTimeout(() => {
        setState(prev => ({
          ...prev,
          tabsLoaded: new Set([...prev.tabsLoaded, tabId]),
        }));
      }, 1000);

      loadingTimeouts.current.set(`preload-${tabId}`, preloadTimeout);
    },
    [tabs, state.tabsLoaded]
  );

  // Gallery loading management
  const openGallery = useCallback(
    (galleryId: string, tabId: string) => {
      setState(prev => ({
        ...prev,
        isGalleryOpen: true,
        galleriesLoaded: new Set([...prev.galleriesLoaded, galleryId]),
      }));

      // Load all medium priority images for this gallery
      const galleryImages = images.filter(
        img => img.galleryId === galleryId && img.tabId === tabId
      );

      galleryImages.forEach(img => {
        queueImageLoad(img.id, img.priority);
      });

      processLoadingQueue();
    },
    [images, queueImageLoad, processLoadingQueue]
  );

  const closeGallery = useCallback(() => {
    setState(prev => ({
      ...prev,
      isGalleryOpen: false,
    }));
  }, []);

  // Observe image elements for lazy loading
  const observeImage = useCallback((element: HTMLElement, imageId: string) => {
    if (intersectionObserver.current) {
      element.setAttribute('data-image-id', imageId);
      intersectionObserver.current.observe(element);
    }
  }, []);

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

  // Auto-process queue
  useEffect(() => {
    const interval = setInterval(processLoadingQueue, 100);
    return () => clearInterval(interval);
  }, [processLoadingQueue]);

  // Cleanup
  useEffect(() => {
    return () => {
      loadingTimeouts.current.forEach(timeout => clearTimeout(timeout));
      loadingTimeouts.current.clear();
      intersectionObserver.current?.disconnect();
    };
  }, []);

  return {
    state,
    actions: {
      loadTab,
      preloadTab,
      openGallery,
      closeGallery,
      queueImageLoad,
      observeImage,
      unobserveImage,
      processLoadingQueue,
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

  const getLuxuryIcon = () => {
    switch (type) {
      case 'tab':
        return '👗'; // Dress for fashion content
      case 'gallery':
        return '📸'; // Camera for high-fashion photography
      default:
        return '✨'; // Sparkles for luxury loading
    }
  };

  const getFashionMessage = () => {
    if (message) return message;

    switch (type) {
      case 'tab':
        return 'Curating fashion content...';
      case 'gallery':
        return 'Loading high-resolution imagery...';
      default:
        return 'Preparing luxury experience...';
    }
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-10 backdrop-blur-sm">
      <div className="text-center bg-gradient-to-br from-purple-900 to-pink-900 border border-purple-400/50 rounded-xl p-8 shadow-2xl max-w-sm mx-4">
        <div className="text-4xl mb-4 animate-pulse">{getLuxuryIcon()}</div>
        <div className="text-purple-100 text-sm font-medium mb-4 leading-relaxed">
          {getFashionMessage()}
        </div>
        <div className="w-48 bg-gradient-to-r from-purple-800 to-pink-800 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-300 h-3 rounded-full transition-all duration-700 ease-out shadow-lg"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs text-purple-300 mt-3 font-medium tracking-wider">
          {progress}% LOADED
        </div>
        <div className="text-xs text-pink-400 mt-1 opacity-75">
          Raw Fiction • High Fashion Loading
        </div>
      </div>
    </div>
  );
};
