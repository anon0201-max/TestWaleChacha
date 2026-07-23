'use client';

import { GraduationCap, Heart, Crown, UserCircle, Shield } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function AppFooter() {
  const { isSubscribed, isLoggedIn, setShowSubscriptionModal, setShowAuthModal, setView } = useAppStore();

  function openAdmin() {
    setView('admin');
  }

  return (
    <footer className="border-t bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span>QuizMaster — Free Government Exam Mock Tests</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>SSC | UPSC | Banking | Railways</span>
            {!isLoggedIn ? (
              <button onClick={() => setShowAuthModal('signup')} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium">
                <UserCircle className="w-3 h-3" /> Sign Up Free
              </button>
            ) : !isSubscribed ? (
              <button onClick={() => setShowSubscriptionModal(true)} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium">
                <Crown className="w-3 h-3" /> ₹100 Unlimited
              </button>
            ) : null}
            <button onClick={openAdmin} className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors">
              <Shield className="w-3 h-3" /> Admin
            </button>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> in India
          </div>
        </div>
      </div>
    </footer>
  );
}
