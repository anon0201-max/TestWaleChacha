'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'twc_pwa_dismissed_at';
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

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
 * "Add to Home Screen" / Install App prompt.
 * - Listens for the browser's `beforeinstallprompt` event
 * - Shows an install banner when the app is installable
 * - On iOS (no beforeinstallprompt), shows instructions to use Safari's Share → Add to Home Screen
 */
export function PwaInstallPrompt() {
  const [showBanner, setShowBanner] = useState(false);
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const [promptReady, setPromptReady] = useState(false);

  const platform = useMemo(() => getPlatform(), []);
  const standalone = useMemo(() => isStandaloneMode(), []);

  const dismiss = useCallback(() => {
    setShowBanner(false);
    markDismissed();
  }, []);

  const handleInstall = useCallback(async () => {
    const prompt = deferredPromptRef.current;
    if (prompt) {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome === 'accepted') {
        setShowBanner(false);
        deferredPromptRef.current = null;
        setPromptReady(false);
      } else {
        dismiss();
      }
    }
  }, [dismiss]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (standalone) return;
    if (wasDismissedRecently()) return;

    const handler = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
      setPromptReady(true);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // For iOS, show a gentle prompt after a delay (iOS doesn't support beforeinstallprompt)
    const plat = getPlatform();
    let iosTimer: ReturnType<typeof setTimeout> | undefined;
    if (plat === 'ios') {
      iosTimer = setTimeout(() => setShowBanner(true), 4000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      if (iosTimer) clearTimeout(iosTimer);
    };
  }, [standalone]);

  // Don't show anything if already installed as PWA
  if (standalone) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header strip */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Smartphone className="w-4 h-4" />
                <span className="text-sm font-semibold">Install TestWaleChacha</span>
              </div>
              <button
                onClick={dismiss}
                className="text-white/80 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                {platform === 'ios' ? (
                  <>Tap <strong>Share</strong> <span className="inline-block px-1.5 py-0.5 bg-gray-100 rounded text-xs">⎙</span> then <strong>&ldquo;Add to Home Screen&rdquo;</strong> to install the app.</>
                ) : (
                  <>Install the app on your device for quick access &amp; offline use.</>
                )}
              </p>

              {platform === 'ios' ? (
                <Button
                  onClick={dismiss}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white"
                  size="sm"
                >
                  Got it
                </Button>
              ) : (
                <Button
                  onClick={handleInstall}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-1.5" /> Add to Home Screen
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
