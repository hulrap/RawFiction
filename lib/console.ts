/**
 * Production-Grade Console Utility
 * Provides safe logging that's automatically stripped in production
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ConsoleUtility {
  log: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  info: (...args: any[]) => void;
  debug: (...args: any[]) => void;
  group: (label?: string) => void;
  groupEnd: () => void;
  time: (label?: string) => void;
  timeEnd: (label?: string) => void;
}

const createSafeConsole = (): ConsoleUtility => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  // In production, return no-op functions
  if (!isDevelopment) {
    const noop = () => {};
    return {
      log: noop,
      warn: noop,
      error: noop,
      info: noop,
      debug: noop,
      group: noop,
      groupEnd: noop,
      time: noop,
      timeEnd: noop,
    };
  }

  // In development, return actual console methods
  /* eslint-disable no-console */
  return {
    log: console.log.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
    info: console.info.bind(console),
    debug: console.debug.bind(console),
    group: console.group?.bind(console) || (() => {}),
    groupEnd: console.groupEnd?.bind(console) || (() => {}),
    time: console.time?.bind(console) || (() => {}),
    timeEnd: console.timeEnd?.bind(console) || (() => {}),
  };
  /* eslint-enable no-console */
};

// Export the safe console utility
export const safeConsole = createSafeConsole();

// Export individual methods for convenience
export const { log, warn, error, info, debug, group, groupEnd, time, timeEnd } = safeConsole;

// Export a component-specific logger factory
export const createComponentLogger = (componentName: string) => ({
  log: (...args: any[]) => safeConsole.log(`[${componentName}]`, ...args),
  warn: (...args: any[]) => safeConsole.warn(`[${componentName}]`, ...args),
  error: (...args: any[]) => safeConsole.error(`[${componentName}]`, ...args),
  info: (...args: any[]) => safeConsole.info(`[${componentName}]`, ...args),
  debug: (...args: any[]) => safeConsole.debug(`[${componentName}]`, ...args),
});
/* eslint-enable @typescript-eslint/no-explicit-any */

// Export performance logging utility
export const createPerformanceLogger = (label: string) => ({
  start: () => safeConsole.time(label),
  end: () => safeConsole.timeEnd(label),
  mark: (message: string) => safeConsole.log(`[${label}] ${message}`),
});

// Export error reporting utility for production
export const reportError = (error: Error, context?: string) => {
  if (process.env.NODE_ENV === 'production') {
    // In production, could send to error reporting service
    // For now, we'll use a minimal console.error that won't be stripped
    // eslint-disable-next-line no-console
    console.error('[Error]', context || 'Unknown context', error.message);
  } else {
    // In development, full error logging
    // eslint-disable-next-line no-console
    console.error(`[Error] ${context || 'Unknown context'}:`, error);
  }
};

export default safeConsole;
