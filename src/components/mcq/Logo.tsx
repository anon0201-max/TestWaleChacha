'use client';

import { GraduationCap } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'light' | 'dark';
  className?: string;
}

/**
 * TestWaleChaha brand logo.
 * - Gradient badge with "T" + graduation cap icon
 * - Wordmark: "TestWale" (bold) + "Chaha" (accent gradient)
 */
export function Logo({ size = 'md', showText = true, variant = 'dark', className = '' }: LogoProps) {
  const sizes = {
    sm: { badge: 'w-7 h-7 rounded-lg', icon: 'w-4 h-4', text: 'text-base', t: 'text-sm' },
    md: { badge: 'w-9 h-9 rounded-xl', icon: 'w-5 h-5', text: 'text-lg', t: 'text-base' },
    lg: { badge: 'w-12 h-12 rounded-2xl', icon: 'w-7 h-7', text: 'text-2xl', t: 'text-xl' },
  };
  const s = sizes[size];

  const textColor = variant === 'light' ? 'text-white' : 'text-gray-900';
  const subColor = variant === 'light' ? 'text-blue-100' : 'text-muted-foreground';

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className={`${s.badge} bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 flex items-center justify-center shadow-sm shrink-0 relative overflow-hidden`}>
        {/* subtle shine */}
        <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30" />
        <GraduationCap className={`${s.icon} text-white relative z-10`} />
      </span>
      {showText && (
        <span className={`font-extrabold ${s.text} ${textColor} tracking-tight leading-none`}>
          TestWale<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Chaha</span>
        </span>
      )}
    </span>
  );
}
