'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { usePwaInstall, markDismissed, DISMISS_KEY } from '@/hooks/use-pwa-install';

/**
 * "Add to Home Screen" / Install App prompt — auto-showing banner.
 * Works with the shared usePwaInstall hook so the navbar button can also trigger install.
 * - Shows banner on first visit (Android) or after delay (iOS)
 * - Respects 7-day dismiss period
 */
export function PwaInstallPrompt() {
  const [showBanner, setShowBanner] = useState(false);

  const { platform, standalone, promptReady, triggerInstall, wasRecentlyDismissed } = usePwaInstall();

  const dismiss = useCallback(() => {
    setShowBanner(false);
    markDismissed();
  }, []);

  const handleInstall = useCallback(async () => {
    const installed = await triggerInstall();
    if (installed) {
      setShowBanner(false);
    } else {
      dismiss();
    }
  }, [triggerInstall, dismiss]);

  // Show banner when prompt is ready (Android) or after delay (iOS)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (standalone) return;
    if (wasRecentlyDismissed) return;

    // iOS: show after a delay
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (platform === 'ios') {
      timer = setTimeout(() => setShowBanner(true), 4000);
    }

    // Android: show when prompt fires (via promptReady change)
    if (platform === 'android' && promptReady) {
      timer = setTimeout(() => setShowBanner(true), 500);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [standalone, wasRecentlyDismissed, promptReady, platform]);

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
            <div className="bg-gradient-to-r from-[#1C1C84] to-[#2D2BA8] px-4 py-2.5 flex items-center justify-between">
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
                  className="w-full bg-[#1C1C84] hover:bg-[#15156a] text-white"
                  size="sm"
                >
                  Got it
                </Button>
              ) : (
                <Button
                  onClick={handleInstall}
                  className="w-full bg-[#1C1C84] hover:bg-[#15156a] text-white"
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
