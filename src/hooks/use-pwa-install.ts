'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'twc_pwa_dismissed_at';
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

// Share the deferred prompt globally so both banner and navbar can access it
let _globalDeferredPrompt: BeforeInstallPromptEvent | null = null;

function getPlatform(): 'android' | 'ios' | 'desktop' | 'unknown' {
  if (typeof window === 'undefined') return 'unknown';
  const ua = navigator.userAgent.toLowerCase();
  if (/android/.test(ua)) return 'android';
  if (/iphone|ipad|ipod/.test(ua) || (/macintosh/.test(ua) && 'ontouchend' in document)) return 'ios';
  if (/windows|macintosh|linux/.test(ua)) return 'desktop';
  return 'unknown';
}

function isStandaloneMode(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function wasDismissedRecently(): boolean {
  try {
    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0);
    return !!(dismissedAt && Date.now() - dismissedAt < DISMISS_DURATION);
  } catch {
    return false;
  }
}

function markDismissed(): void {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    // ignore
  }
}

/**
 * Shared hook for PWA install functionality.
 * Used by both PwaInstallPrompt (auto banner) and AppHeader (manual button).
 */
export function usePwaInstall() {
  const [promptReady, setPromptReady] = useState(false);
  // Used to force re-render when global deferred prompt changes

  const platform = useMemo(() => getPlatform(), []);
  const standalone = useMemo(() => isStandaloneMode(), []);

  // Listen for beforeinstallprompt globally
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (standalone) return;

    const handler = (e: Event) => {
      e.preventDefault();
      _globalDeferredPrompt = e as BeforeInstallPromptEvent;
      setPromptReady(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [standalone]);

  /**
   * Trigger the native install prompt (Android/Chrome).
   * Returns true if prompt was shown, false otherwise.
   */
  const triggerInstall = useCallback(async (): Promise<boolean> => {
    const prompt = _globalDeferredPrompt;
    if (prompt) {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome === 'accepted') {
        _globalDeferredPrompt = null;
        setPromptReady(false);
        return true;
      }
      return false;
    }
    return false;
  }, []);

  /**
   * Check if install is possible and not already dismissed.
   */
  const canInstall = useMemo(() => {
    if (standalone) return false;
    return true; // Always show install button; modal handles platform-specific instructions
  }, [standalone]);

  const wasRecentlyDismissed = useMemo(() => wasDismissedRecently(), []);

  return {
    platform,
    standalone,
    canInstall,
    promptReady,
    wasRecentlyDismissed,
    triggerInstall,
    markDismissed,
    dismissDuration: DISMISS_DURATION,
  };
}

export { getPlatform, isStandaloneMode, wasDismissedRecently, markDismissed, DISMISS_KEY };
export type { BeforeInstallPromptEvent };
