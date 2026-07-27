'use client';

import { useEffect } from 'react';

/**
 * Registers the service worker for PWA support.
 * Runs only in production-ish environments (not during SSR).
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    // Register after page load to avoid blocking
    const register = () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => {
          // SW registered successfully
        })
        .catch(() => {
          // SW registration failed — silently ignore (PWA not critical)
        });
    };

    if (document.readyState === 'complete') {
      register();
    } else {
      window.addEventListener('load', register);
      return () => window.removeEventListener('load', register);
    }
  }, []);

  return null;
}
