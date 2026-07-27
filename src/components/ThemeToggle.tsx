'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Palette } from 'lucide-react';

const themeColors = [
  { name: 'Blue', key: 'blue', bg: 'bg-blue-600', ring: 'ring-blue-400' },
  { name: 'Emerald', key: 'emerald', bg: 'bg-emerald-600', ring: 'ring-emerald-400' },
  { name: 'Purple', key: 'purple', bg: 'bg-purple-600', ring: 'ring-purple-400' },
  { name: 'Rose', key: 'rose', bg: 'bg-rose-600', ring: 'ring-rose-400' },
  { name: 'Orange', key: 'orange', bg: 'bg-orange-600', ring: 'ring-orange-400' },
  { name: 'Teal', key: 'teal', bg: 'bg-teal-600', ring: 'ring-teal-400' },
  { name: 'Cyan', key: 'cyan', bg: 'bg-cyan-600', ring: 'ring-cyan-400' },
  { name: 'Amber', key: 'amber', bg: 'bg-amber-600', ring: 'ring-amber-400' },
];

export function ThemeToggle() {
  const { themeColor, setThemeColor } = useAppStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeColor);
  }, [themeColor]);

  // Load saved theme on mount
  useEffect(() => {
    const saved = useAppStore.getState().themeColor;
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentTheme = themeColors.find(c => c.key === themeColor) || themeColors[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        title="Change theme color"
      >
        <Palette className="w-4 h-4 text-muted-foreground" />
        <div className={`w-3.5 h-3.5 rounded-full ${currentTheme.bg} ring-2 ring-offset-1 ${currentTheme.ring}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border p-3 z-50 w-48">
          <p className="text-xs font-semibold text-muted-foreground mb-2 px-1">Theme Color</p>
          <div className="grid grid-cols-4 gap-2">
            {themeColors.map((color) => (
              <button
                key={color.key}
                onClick={() => { setThemeColor(color.key); setOpen(false); }}
                className={`w-9 h-9 rounded-lg ${color.bg} transition-all flex items-center justify-center ${
                  themeColor === color.key
                    ? 'ring-2 ring-offset-2 scale-110 ' + color.ring
                    : 'hover:scale-110 opacity-70 hover:opacity-100'
                }`}
                title={color.name}
              >
                {themeColor === color.key && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
