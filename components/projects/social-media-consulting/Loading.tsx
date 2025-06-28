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

  // Process loading queue in batches - unified processing function
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

          img.onload = () => {
            loadingBatch.current.delete(imageId);
            setState(prevState => ({
              ...prevState,
              imagesLoaded: new Set([...prevState.imagesLoaded, imageId]),
            }));
            // Trigger next batch processing
            setTimeout(() => processLoadingQueue(), 50);
          };

          img.onerror = () => {
            loadingBatch.current.delete(imageId);
            // Production-grade: Log specific error but continue gracefully
            const errorDetails = {
              imageId,
              src: image.src,
              priority: image.priority,
              timestamp: Date.now(),
            };
            console.warn('Image load failed with graceful recovery:', errorDetails);
            // Trigger next batch processing
            setTimeout(() => processLoadingQueue(), 50);
          };

          img.src = image.src;
        }
      });

      return {
        ...prev,
        priorityQueue: prev.priorityQueue.slice(toLoad.length),
      };
    });
  }, [batchSize, images]);

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
    [tabs, preloadDistance, images, queueImageLoad, processLoadingQueue, preloadTab]
  );

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
  }, [intersectionThreshold, queueImageLoad]);

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

  // Cleanup with proper ref handling
  useEffect(() => {
    const currentTimeouts = loadingTimeouts.current;
    const currentObserver = intersectionObserver.current;

    return () => {
      // Use the captured refs from effect creation time
      currentTimeouts.forEach(timeout => clearTimeout(timeout));
      currentTimeouts.clear();
      currentObserver?.disconnect();
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

  const getSocialMediaIcon = () => {
    switch (type) {
      case 'tab':
        return '📱'; // Mobile phone for social media content
      case 'gallery':
        return '📊'; // Chart for analytics content
      default:
        return '🚀'; // Rocket for growth/marketing
    }
  };

  const getBusinessMessage = () => {
    if (message) return message;

    switch (type) {
      case 'tab':
        return 'Loading marketing insights...';
      case 'gallery':
        return 'Preparing analytics data...';
      default:
        return 'Optimizing content delivery...';
    }
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10 backdrop-blur-sm">
      <div className="text-center bg-gradient-to-br from-blue-900 to-cyan-900 border border-blue-400/50 rounded-xl p-6 shadow-2xl max-w-sm mx-4">
        <div className="text-3xl mb-3 animate-bounce">{getSocialMediaIcon()}</div>
        <div className="text-blue-100 text-sm font-medium mb-3">{getBusinessMessage()}</div>
        <div className="w-40 bg-gradient-to-r from-blue-800 to-cyan-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs text-blue-300 mt-2 font-medium">{progress}% LOADED</div>
        <div className="text-xs text-cyan-400 mt-1 opacity-75">
          Social Media Consulting • Digital Growth
        </div>
      </div>
    </div>
  );
};
