'use client';

import { Crown, UserCircle, Zap, ArrowUp, Heart, MessageCircle, Mail, Phone, BookOpen } from 'lucide-react';
import { useAppStore, handleSubscribeClick } from '@/store/useAppStore';
import { CookieConsent } from '@/components/CookieConsent';

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
            <p className="text-emerald-100 text-sm mt-1">Start with 2 free tests — No credit card needed!</p>
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

      {/* Main Footer Content */}
      <div className="bg-gray-900 py-8 sm:py-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  T
                </div>
                <span className="text-white font-bold text-lg">TestWaleChacha</span>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-3">
                Government exam preparation made easy. Real exam interface, detailed solutions, and performance tracking.
              </p>
              <a
                href="https://whatsapp.com/channel/0029VbDsNS4A2pL5AnlWwm1G"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-green-400 hover:text-green-300 text-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Channel
              </a>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Quick Links</h4>
              <ul className="space-y-2">
                <li><button onClick={() => { setView('home'); scrollToTop(); }} className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">Home</button></li>
                <li><button onClick={() => { setView('tests'); scrollToTop(); }} className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">All Tests</button></li>
                <li><button onClick={() => { setView('my-attempts'); scrollToTop(); }} className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">My Attempts</button></li>
                <li><button onClick={handleSubscribeClick} className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">Subscribe — ₹100</button></li>
                <li><a href="https://www.testwalechacha.online/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">Privacy Policy</a></li>
                <li><a href="https://www.testwalechacha.online/terms" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">Terms &amp; Conditions</a></li>
                <li><a href="https://www.testwalechacha.online/refund-policy" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">Refund Policy</a></li>
                <li><a href="https://www.testwalechacha.online/about" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">About Us</a></li>
                <li><a href="https://www.testwalechacha.online/faq" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">FAQ</a></li>
                <li><a href="https://www.testwalechacha.online/how-it-works" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">How It Works</a></li>
                <li><a href="https://www.testwalechacha.online/contact" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">Contact Us</a></li>
              </ul>
            </div>

            {/* Exam Categories */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Exam Categories</h4>
              <ul className="space-y-2">
                {['SSC CGL', 'IBPS PO', 'RRB NTPC', 'UPSC', 'Teaching'].map((exam) => (
                  <li key={exam}>
                    <button onClick={() => { setView('tests'); scrollToTop(); }} className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">
                      {exam}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Contact Us</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://whatsapp.com/channel/0029VbDsNS4A2pL5AnlWwm1G"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-gray-400 hover:text-white text-xs sm:text-sm transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                  </a>
                </li>
                <li>
                  <a href="mailto:testwalechacha@gmail.com" className="flex items-center gap-1.5 text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">
                    <Mail className="w-3.5 h-3.5" /> testwalechacha@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="text-xs text-gray-500">
              © {new Date().getFullYear()} TestWaleChacha. All rights reserved.
            </span>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-gray-600">
                <a href="https://www.testwalechacha.online/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">Privacy</a>
                {' · '}
                <a href="https://www.testwalechacha.online/terms" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">Terms</a>
                {' · '}
                <a href="https://www.testwalechacha.online/refund-policy" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">Refund Policy</a>
                {' · '}
                <a href="https://www.testwalechacha.online/about" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">About Us</a>
                {' · '}
                <a href="https://www.testwalechacha.online/faq" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">FAQ</a>
                {' · '}
                <a href="https://www.testwalechacha.online/how-it-works" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">How It Works</a>
                {' · '}
                <a href="https://www.testwalechacha.online/contact" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">Contact</a>
              </span>
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
      <CookieConsent />
    </footer>
  );
}
