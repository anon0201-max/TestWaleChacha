'use client';

import { GraduationCap, Heart, Crown } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function AppFooter() {
  const { isSubscribed, setView } = useAppStore();

  return (
    <footer className="border-t mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>QuizMaster - MCQ Practice Platform</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>5 Free Tests | ₹100 Unlimited</span>
            {!isSubscribed && (
              <button
                onClick={() => {
                  useAppStore.getState().setShowSubscriptionModal(true);
                }}
                className="flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium transition-colors"
              >
                <Crown className="w-3 h-3" />
                Upgrade to Pro
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for Students
          </div>
        </div>
      </div>
    </footer>
  );
}
