'use client';

import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'light' | 'dark';
  className?: string;
}

/**
 * TestWaleChacha brand logo.
 * - Circular badge image (Chacha mascot with clipboard + book)
 * - Wordmark: "TestWale" (bold) + "Chacha" (accent gradient)
 */
export function Logo({ size = 'md', showText = true, variant = 'dark', className = '' }: LogoProps) {
  const sizes = {
    sm: { box: 'w-7 h-7', text: 'text-base', t: 'text-sm' },
    md: { box: 'w-9 h-9', text: 'text-lg', t: 'text-base' },
    lg: { box: 'w-12 h-12', text: 'text-2xl', t: 'text-xl' },
  };
  const s = sizes[size];

  const textColor = variant === 'light' ? 'text-white' : 'text-gray-900';
  const subColor = variant === 'light' ? 'text-orange-200' : 'text-muted-foreground';

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className={`${s.box} relative rounded-full overflow-hidden shrink-0 ring-1 ring-black/10`}>
        <Image
          src="/logo.png"
          alt="TestWaleChacha logo"
          fill
          sizes="(max-width: 768px) 36px, 48px"
          className="object-cover pointer-events-none"
          priority
        />
      </span>
      {showText && (
        <span className={`font-extrabold ${s.text} ${textColor} tracking-tight leading-none`}>
          TestWale<span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">Chacha</span>
        </span>
      )}
    </span>
  );
}
