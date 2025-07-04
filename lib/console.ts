/**
 * Production-Grade Console Utility
 * Provides safe logging that's automatically stripped in production
 */

// Strict types for console parameters
type LoggableValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Error
  | object
  | symbol
  | bigint;
type LogParameters = readonly [
  message?: LoggableValue,
  ...optionalParams: readonly LoggableValue[],
];

interface ConsoleUtility {
  readonly log: (...args: LogParameters) => void;
  readonly warn: (...args: LogParameters) => void;
  readonly error: (...args: LogParameters) => void;
  readonly info: (...args: LogParameters) => void;
  readonly debug: (...args: LogParameters) => void;
  readonly group: (label?: string) => void;
  readonly groupEnd: () => void;
  readonly time: (label?: string) => void;
  readonly timeEnd: (label?: string) => void;
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

// Export a component-specific logger factory with strict typing
export const createComponentLogger = (
  componentName: string
): Readonly<{
  readonly log: (...args: LogParameters) => void;
  readonly warn: (...args: LogParameters) => void;
  readonly error: (...args: LogParameters) => void;
  readonly info: (...args: LogParameters) => void;
  readonly debug: (...args: LogParameters) => void;
}> => ({
  log: (...args: LogParameters) => safeConsole.log(`[${componentName}]`, ...args),
  warn: (...args: LogParameters) => safeConsole.warn(`[${componentName}]`, ...args),
  error: (...args: LogParameters) => safeConsole.error(`[${componentName}]`, ...args),
  info: (...args: LogParameters) => safeConsole.info(`[${componentName}]`, ...args),
  debug: (...args: LogParameters) => safeConsole.debug(`[${componentName}]`, ...args),
});

// Export performance logging utility with strict typing
export const createPerformanceLogger = (
  label: string
): Readonly<{
  readonly start: () => void;
  readonly end: () => void;
  readonly mark: (message: string) => void;
}> => ({
  start: () => safeConsole.time(label),
  end: () => safeConsole.timeEnd(label),
  mark: (message: string) => safeConsole.log(`[${label}] ${message}`),
});

// Export error reporting utility for production with strict typing
export const reportError = (error: Error, context?: string): void => {
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
