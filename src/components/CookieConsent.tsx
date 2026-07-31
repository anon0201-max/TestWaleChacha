'use client';

import { useState, useCallback } from 'react';

function getInitialConsent(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('cookie-consent');
  } catch {
    return null;
  }
}

export function CookieConsent() {
  const [consent, setConsent] = useState<string | null>(() => getInitialConsent());

  const visible = consent === null;

  const handleAccept = useCallback(() => {
    try {
      localStorage.setItem('cookie-consent', 'accepted');
    } catch {
      // ignore
    }
    setConsent('accepted');
  }, []);

  const handleDecline = useCallback(() => {
    try {
      localStorage.setItem('cookie-consent', 'declined');
    } catch {
      // ignore
    }
    setConsent('declined');
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-300 text-center sm:text-left">
          We use cookies to improve your experience and for Google Ads.{' '}
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white transition-colors"
          >
            Learn more
          </a>
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors font-medium"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
