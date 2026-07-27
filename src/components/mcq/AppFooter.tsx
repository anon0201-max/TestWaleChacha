'use client';

import { Heart, Crown, UserCircle, Shield, History, BookOpen, Zap, Trophy, Phone, Mail, MapPin, ArrowUp } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Logo } from './Logo';

export function AppFooter() {
  const { isSubscribed, isLoggedIn, setShowSubscriptionModal, setShowAuthModal, setView } = useAppStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-auto">
      {/* Top CTA Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
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
                onClick={() => setShowSubscriptionModal(true)}
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

      {/* Main Footer */}
      <div className="bg-gray-900 text-gray-300">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div>
              <div className="mb-4">
                <Logo size="md" variant="light" />
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                India&apos;s #1 free mock test platform for government exam preparation. Practice SSC, UPSC, Banking, Railways &amp; more with real exam interface.
              </p>
              <div className="flex gap-3">
                {['SSC', 'UPSC', 'IBPS', 'RRB'].map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-1 rounded-full bg-gray-800 text-gray-400 border border-gray-700 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Popular Exams */}
            <div>
              <h4 className="font-semibold text-white text-sm mb-4 uppercase tracking-wider">Popular Exams</h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  'SSC CGL / CHSL',
                  'UPSC Civil Services',
                  'Banking IBPS / SBI',
                  'Railways RRB NTPC',
                  'State PSC Exams',
                  'General Knowledge',
                ].map((exam) => (
                  <li
                    key={exam}
                    className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-2 group"
                    onClick={() => { useAppStore.getState().setSelectedCategory(null); setView('tests'); scrollToTop(); }}
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-emerald-400 transition-colors" />
                    {exam}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white text-sm mb-4 uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2.5 text-sm">
                <li
                  className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-2.5 group"
                  onClick={() => { setView('tests'); scrollToTop(); }}
                >
                  <BookOpen className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 transition-colors" />
                  Browse All Tests
                </li>
                {isLoggedIn && (
                  <li
                    className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-2.5 group"
                    onClick={() => { setView('my-attempts'); scrollToTop(); }}
                  >
                    <History className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 transition-colors" />
                    My Test History
                  </li>
                )}
                <li
                  className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-2.5 group"
                  onClick={() => { setView('tests'); scrollToTop(); }}
                >
                  <Trophy className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 transition-colors" />
                  Free Mock Tests
                </li>
                {!isLoggedIn ? (
                  <li
                    className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-2.5 group"
                    onClick={() => setShowAuthModal('signup')}
                  >
                    <UserCircle className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 transition-colors" />
                    Sign Up Free
                  </li>
                ) : !isSubscribed ? (
                  <li
                    className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-2.5 group"
                    onClick={() => setShowSubscriptionModal(true)}
                  >
                    <Crown className="w-4 h-4 text-amber-500" />
                    <span className="text-amber-400 font-medium">Upgrade to Pro — ₹100</span>
                  </li>
                ) : (
                  <li className="flex items-center gap-2.5 text-amber-400 font-medium">
                    <Crown className="w-4 h-4" />
                    PRO Member ✨
                  </li>
                )}
              </ul>
            </div>

            {/* Features */}
            <div>
              <h4 className="font-semibold text-white text-sm mb-4 uppercase tracking-wider">Why TestWaleChacha?</h4>
              <div className="space-y-3.5">
                {[
                  { icon: '🎯', title: '5 Free Tests', desc: 'Sign up & start immediately' },
                  { icon: '🖥️', title: 'Real Exam UI', desc: 'Timer, palette, mark & review' },
                  { icon: '📊', title: 'Rankings', desc: 'Compare with all test takers' },
                  { icon: '💡', title: 'Detailed Solutions', desc: 'Learn from every question' },
                  { icon: '📱', title: 'Works on Mobile', desc: 'Practice anywhere, anytime' },
                ].map((feat) => (
                  <div key={feat.title} className="flex items-start gap-2.5 text-sm">
                    <span className="text-base leading-none mt-0.5">{feat.icon}</span>
                    <div>
                      <p className="text-white font-medium text-xs">{feat.title}</p>
                      <p className="text-gray-500 text-xs">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact & Stats Bar */}
          <div className="border-t border-gray-800 pt-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 items-center">
              <div className="flex items-center gap-2 text-sm text-gray-400 justify-start">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="break-all">support@testwalechacha.in</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400 justify-start sm:justify-center">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>+91 8340197418</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400 justify-start sm:justify-end">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>© {new Date().getFullYear()} TestWaleChacha. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <button
                onClick={() => setView('admin')}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-400 transition-colors"
              >
                <Shield className="w-3 h-3" /> Admin
              </button>
              <span className="text-gray-700">•</span>
              <span className="flex items-center gap-1 text-gray-500">
                Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> in India
              </span>
              <span className="text-gray-700">•</span>
              <button
                onClick={scrollToTop}
                className="flex items-center gap-1 text-gray-600 hover:text-emerald-400 transition-colors group"
              >
                Back to top <ArrowUp className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
