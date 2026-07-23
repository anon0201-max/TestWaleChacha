'use client';

import { useEffect } from 'react';
import {
  Globe,
  Beaker,
  Calculator,
  Scroll,
  BookOpen,
  Monitor,
  MapPin,
  Newspaper,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Globe,
  Beaker,
  Calculator,
  Scroll,
  BookOpen,
  Monitor,
  MapPin,
  Newspaper,
};

export function getCategoryIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || BookOpen;
}
