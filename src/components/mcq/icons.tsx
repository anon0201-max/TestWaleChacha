'use client';

import {
  Shield, Landmark, Train, GraduationCap, BookOpen, Globe, Calculator,
  Beaker, Monitor, Newspaper, Scale, Banknote, Plane, Stethoscope,
  Briefcase, PenTool, FileText, MapPin, Scroll, Brain, TrendingUp,
  type LucideIcon,
} from 'lucide-react';

// Map category name keywords → Lucide icon
const keywordMap: [string, LucideIcon][] = [
  ['ssc', Shield],
  ['cgl', Shield],
  ['bank', Banknote],
  ['ibps', Banknote],
  ['railway', Train],
  ['rrb', Train],
  ['upsc', Landmark],
  ['civil', Landmark],
  ['english', BookOpen],
  ['grammar', BookOpen],
  ['math', Calculator],
  ['reasoning', Brain],
  ['science', Beaker],
  ['tech', Monitor],
  ['computer', Monitor],
  ['current', Newspaper],
  ['affair', Newspaper],
  ['gk', Globe],
  ['general knowledge', Globe],
  ['geography', Globe],
  ['history', Scroll],
  ['polity', Scale],
  ['economy', TrendingUp],
  ['defence', Shield],
  ['army', Shield],
  ['navy', Shield],
  ['air force', Plane],
  ['teaching', PenTool],
  ['ctet', PenTool],
  ['bihar', MapPin],
  ['state', MapPin],
  ['hindi', BookOpen],
  ['physics', Beaker],
  ['chemistry', Beaker],
  ['biology', Stethoscope],
  ['medical', Stethoscope],
  ['law', Scale],
  ['police', Shield],
  ['si', Shield],
  ['constable', Shield],
];

export function getCategoryIcon(name: string): LucideIcon {
  if (!name) return BookOpen;
  const lower = name.toLowerCase();
  for (const [keyword, icon] of keywordMap) {
    if (lower.includes(keyword)) return icon;
  }
  return BookOpen;
}
