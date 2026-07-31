'use client';

import { useEffect, useRef } from 'react';

type AdFormat = 'auto' | 'horizontal' | 'vertical' | 'rectangle';

interface AdSenseProps {
  /** Ad slot ID from Google AdSense (e.g. "1234567890") */
  adSlot: string;
  /** Ad format - auto lets Google decide the best size */
  adFormat?: AdFormat;
  /** Responsive - fills available width */
  responsive?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Style override for the ad container */
  style?: React.CSSProperties;
}

/**
 * Google AdSense ad unit component.
 * Use this to place manual ad units on the page.
 * Each ad unit needs a unique adSlot ID from your AdSense dashboard.
 */
export function AdUnit({
  adSlot,
  adFormat = 'auto',
  responsive = true,
  className = '',
  style,
}: AdSenseProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    // Only push ads when the adsbygoogle script has loaded
    const tryPush = () => {
      try {
        if (typeof (window as any).adsbygoogle !== 'undefined' && !pushed.current) {
          pushed.current = true;
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        }
      } catch {
        // Ad blocker or script not loaded - silently fail
      }
    };

    // Try immediately and also after a short delay for script loading
    tryPush();
    const timer = setTimeout(tryPush, 1000);
    return () => clearTimeout(timer);
  }, [adSlot]);

  return (
    <div className={`w-full flex justify-center ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: 'block',
          ...style,
        }}
        data-ad-client="ca-pub-1061914422695539"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}

/**
 * Placeholder-style ad banner for positions where you haven't
 * created a specific ad unit yet. Uses auto-ads / anchor ads.
 */
export function AdBanner({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full flex justify-center my-3 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-1061914422695539"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
