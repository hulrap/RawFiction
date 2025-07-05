/**
 * Standardized Loading Types for Portfolio Cards
 *
 * These interfaces provide consistent external APIs while allowing
 * custom internal implementations per card type.
 */

/**
 * Standardized loading state interface that all cards must implement
 * This ensures consistent external behavior while allowing custom internal logic
 */
export interface CardLoadingState {
  /** Whether the card is currently loading */
  isLoading: boolean;

  /** Whether the card content is ready to display */
  isReady: boolean;

  /** Error message if loading failed, null if no error */
  error: string | null;

  /** Optional progress indicator (0-100) for cards that can track progress */
  progress?: number;
}

/**
 * Standardized props interface for card loading components
 * Allows custom configuration while maintaining consistent callbacks
 */
export interface CardLoadingProps {
  /** Callback when loading is complete and content is ready */
  onComplete: () => void;

  /** Callback when an error occurs during loading */
  onError: (error: string) => void;

  /** Custom configuration object - allows each card to pass specific settings */
  config?: any;

  /** Optional className for styling customization */
  className?: string;
}

/**
 * Standardized hook interface for card loading state management
 * Implementation can be custom per card, but interface is consistent
 */
export interface UseCardLoadingReturn {
  /** Current loading state */
  state: CardLoadingState;

  /** Actions to control loading state */
  actions: {
    /** Start the loading process */
    startLoading: () => void;

    /** Mark content as ready */
    markReady: () => void;

    /** Set an error state */
    setError: (error: string) => void;

    /** Reset loading state */
    reset?: () => void;

    /** Update progress (optional, for cards that support it) */
    setProgress?: (progress: number) => void;
  };
}

/**
 * Configuration interface for embedded website cards
 * Standardizes CSP and loading configurations while allowing customization
 */
export interface EmbeddedWebsiteConfig {
  /** Target URL */
  url: string;

  /** Display title */
  title: string;

  /** CSP configuration */
  csp?: {
    frameAncestors?: string[] | 'none' | 'self' | '*';
    allowedOrigins?: string[];
    bypassCSP?: boolean;
    customHeaders?: Record<string, string>;
  };

  /** Loading strategy configuration */
  loading?: {
    method?: 'direct' | 'fallback' | 'screenshot';
    timeout?: number;
    retryCount?: number;
    retryDelay?: number;
    preloadDelay?: number;
  };

  /** Sandbox configuration */
  sandbox?: {
    allowScripts?: boolean;
    allowSameOrigin?: boolean;
    allowForms?: boolean;
    allowPopups?: boolean;
    allowDownloads?: boolean;
    allowModals?: boolean;
    allowTopNavigation?: boolean;
  };
}

/**
 * Content loading configuration for cards with complex content (images, galleries, etc.)
 */
export interface ContentLoadingConfig {
  /** Tab loading configurations */
  tabs?: Array<{
    id: string;
    title: string;
    hasGallery?: boolean;
    imageCount?: number;
    priority?: 'immediate' | 'preload' | 'lazy';
  }>;

  /** Image loading configurations */
  images?: Array<{
    id: string;
    src: string;
    alt: string;
    priority?: 'high' | 'medium' | 'low';
    tabId?: string;
    galleryId?: string;
  }>;

  /** Loading behavior settings */
  batchSize?: number;
  intersectionThreshold?: number;
  preloadDistance?: number;
}

/**
 * Error recovery configuration
 */
export interface ErrorRecoveryConfig {
  /** Maximum number of retry attempts */
  maxRetries?: number;

  /** Backoff strategy */
  backoffStrategy?: 'linear' | 'exponential';

  /** Base delay for retries (ms) */
  baseDelay?: number;

  /** Maximum delay for retries (ms) */
  maxDelay?: number;

  /** Custom error recovery function */
  onRecovery?: (attempt: number) => void;
}
