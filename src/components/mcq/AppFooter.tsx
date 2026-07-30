'use client';

import { Crown, UserCircle, Zap, Shield, ArrowUp } from 'lucide-react';
import { useAppStore, handleSubscribeClick } from '@/store/useAppStore';

export function AppFooter() {
  const { isSubscribed, isLoggedIn, setShowAuthModal, setView } = useAppStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-auto">
      {/* Top CTA Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-white text-center sm:text-left">
            <h3 className="font-bold text-lg flex items-center gap-2 justify-center sm:justify-start">
              <Zap className="w-5 h-5" /> Ready to crack your exam?
            </h3>
            <p className="text-emerald-100 text-sm mt-1">Start with 5 free tests — No credit card needed!</p>
          </div>
          <div className="flex gap-3">
            {!isLoggedIn ? (
              <button
                onClick={() => setShowAuthModal('signup')}
                className="bg-white text-emerald-700 px-5 py-2 rounded-lg font-semibold text-sm hover:bg-emerald-50 transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                Sign Up Free
              </button>
            ) : !isSubscribed ? (
              <button
                onClick={handleSubscribeClick}
                className="bg-amber-400 text-amber-900 px-5 py-2 rounded-lg font-semibold text-sm hover:bg-amber-300 transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-1.5"
              >
                <Crown className="w-4 h-4" /> Get Pro — ₹100
              </button>
            ) : null}
            <button
              onClick={() => { setView('tests'); scrollToTop(); }}
              className="bg-emerald-500/30 text-white border border-white/30 px-5 py-2 rounded-lg font-semibold text-sm hover:bg-emerald-500/50 transition-all hover:scale-105 active:scale-95"
            >
              Browse Tests
            </button>
          </div>
        </div>
      </div>

      {/* Minimal Bottom Bar */}
      <div className="bg-gray-900 py-4">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-xs text-gray-500">© {new Date().getFullYear()} TestWaleChacha. All rights reserved.</span>
          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => setView('admin')}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-400 transition-colors"
            >
              <Shield className="w-3 h-3" /> Admin
            </button>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-gray-600 hover:text-emerald-400 transition-colors group"
            >
              Back to top <ArrowUp className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
