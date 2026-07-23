'use client';

import { GraduationCap, Heart, Crown, UserCircle, Shield, History, BookOpen } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function AppFooter() {
  const { isSubscribed, isLoggedIn, setShowSubscriptionModal, setShowAuthModal, setView } = useAppStore();

  return (
    <footer className="border-t bg-white mt-auto">
      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">QuizMaster</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              India&apos;s #1 free mock test platform for government exams. Practice SSC, UPSC, Banking, Railways &amp; more.
            </p>
          </div>

          {/* Exam Categories */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Exam Categories</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-blue-600 transition-colors cursor-pointer" onClick={() => { useAppStore.getState().setSelectedCategory(null); setView('tests'); }}>SSC CGL / CHSL</li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer" onClick={() => setView('tests')}>UPSC Civil Services</li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer" onClick={() => setView('tests')}>Banking IBPS / SBI</li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer" onClick={() => setView('tests')}>Railways RRB NTPC</li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer" onClick={() => setView('tests')}>General Knowledge</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1.5" onClick={() => setView('tests')}>
                <BookOpen className="w-3.5 h-3.5" /> Browse All Tests
              </li>
              {isLoggedIn && (
                <li className="hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1.5" onClick={() => setView('my-attempts')}>
                  <History className="w-3.5 h-3.5" /> My Test History
                </li>
              )}
              {!isLoggedIn ? (
                <li className="hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1.5" onClick={() => setShowAuthModal('signup')}>
                  <UserCircle className="w-3.5 h-3.5" /> Sign Up Free
                </li>
              ) : !isSubscribed ? (
                <li className="hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1.5" onClick={() => setShowSubscriptionModal(true)}>
                  <Crown className="w-3.5 h-3.5 text-amber-500" /> Upgrade to Pro — ₹100
                </li>
              ) : (
                <li className="flex items-center gap-1.5 text-amber-600 font-medium">
                  <Crown className="w-3.5 h-3.5" /> PRO Member ✨
                </li>
              )}
              <li className="hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1.5" onClick={() => setView('tests')}>
                <BookOpen className="w-3.5 h-3.5" /> Free Mock Tests
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold text-sm mb-3">About</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-gray-700">5 Free Tests</strong> — Sign up and practice immediately
              </p>
              <p>
                <strong className="text-gray-700">Real Exam Interface</strong> — Question palette, timer, mark for review
              </p>
              <p>
                <strong className="text-gray-700">₹100 Unlimited</strong> — Access all tests with detailed solutions
              </p>
              <p>
                <strong className="text-gray-700">Rankings</strong> — See your rank among all test takers
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">SSC | UPSC | Banking | Railways</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <button onClick={() => setView('admin')} className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors">
              <Shield className="w-3 h-3" /> Admin
            </button>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">© {new Date().getFullYear()} QuizMaster</span>
            <span className="text-muted-foreground">•</span>
            <span className="flex items-center gap-1 text-muted-foreground">
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> in India
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
