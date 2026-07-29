'use client';

import { useState, useEffect, useCallback } from 'react';
import { Sun, Moon } from 'lucide-react';

// Read initial dark mode from localStorage (safe for SSR)
function getInitialDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('mcq-dark-mode') === 'true';
}

export function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);

  // Apply dark mode class on mount
  useEffect(() => {
    if (getInitialDarkMode()) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('mcq-dark-mode', String(next));
      return next;
    });
  }, []);

  return (
    <button
      onClick={toggleDarkMode}
      className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/10 text-white transition-colors"
      title={darkMode ? 'Light Mode' : 'Dark Mode'}
    >
      {darkMode ? (
        <Moon className="w-4 h-4 text-amber-400" />
      ) : (
        <Sun className="w-4 h-4 text-white" />
      )}
    </button>
  );
}
