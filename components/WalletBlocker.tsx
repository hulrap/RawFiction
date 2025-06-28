'use client';

import { useEffect } from 'react';

export const WalletBlocker = () => {
  useEffect(() => {
    // Only run on client-side to avoid hydration issues
    if (typeof window === 'undefined') return;

    // Simple wallet API blocking
    const BLOCKED_APIS = [
      'ethereum',
      'web3',
      'solana',
      'phantom',
      'metamask',
      'coinbaseWallet',
      'keplr',
      'yoroi',
      'cardano',
      'trustWallet',
      'binanceChain',
      'okxWallet',
      'getOfflineSigner',
      'cosmostation',
      'leap',
      'lace',
    ];

    // Block wallet APIs
    BLOCKED_APIS.forEach(api => {
      try {
        if (Object.prototype.hasOwnProperty.call(window, api)) {
          delete (window as unknown as Record<string, unknown>)[api];
        }
        Object.defineProperty(window, api, {
          get: () => undefined,
          set: () => false,
          configurable: false,
          enumerable: false,
        });
      } catch (e) {
        // Silent fail
      }
    });

    // Block extension messages
    const handleMessage = (event: MessageEvent): boolean => {
      if (event.data && typeof event.data === 'object') {
        try {
          const dataStr = JSON.stringify(event.data).toLowerCase();
          if (
            dataStr.includes('wallet') ||
            dataStr.includes('ethereum') ||
            dataStr.includes('metamask') ||
            dataStr.includes('yoroi') ||
            dataStr.includes('keplr')
          ) {
            event.stopImmediatePropagation();
            event.preventDefault();
            return false;
          }
        } catch (e) {
          // Silent fail
        }
      }
      return true; // Allow event to proceed normally
    };

    window.addEventListener('message', handleMessage, true);

    // Cleanup interval
    const cleanupInterval = setInterval(() => {
      // Remove wallet extension elements
      try {
        document
          .querySelectorAll('[id*="metamask"], [id*="yoroi"], [id*="keplr"], [id*="wallet"]')
          .forEach(el => {
            if (el.tagName !== 'IFRAME') {
              el.remove();
            }
          });
      } catch (e) {
        // Silent fail
      }
    }, 2000);

    return () => {
      window.removeEventListener('message', handleMessage, true);
      clearInterval(cleanupInterval);
    };
  }, []);

  // This component renders nothing
  return null;
};
