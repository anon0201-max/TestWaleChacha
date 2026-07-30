'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore, handleSubscribeClick } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Zap, LogIn, LogOut, UserCircle, History, Receipt, CheckCircle2, Menu, X, Download } from 'lucide-react';
import { Logo } from './Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { usePwaInstall } from '@/hooks/use-pwa-install';
import { motion, AnimatePresence } from 'framer-motion';

interface PaymentInfo {
  id: string;
  amount: number;
  currency: string;
  status: string;
  razorpayOrderId: string | null;
  createdAt: string;
}

export function AppHeader() {
  const {
    currentView, setView, freeTestsRemaining, isSubscribed,
    isLoggedIn, user, logout, setShowAuthModal,
  } = useAppStore();
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [payment, setPayment] = useState<PaymentInfo | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  // PWA install hook
  const { platform, standalone, canInstall, triggerInstall } = usePwaInstall();

  // Handle install button click
  async function handleInstallClick() {
    setMobileMenuOpen(false);
    if (platform === 'ios' || platform === 'unknown') {
      setShowInstallModal(true);
    } else {
      const installed = await triggerInstall();
      if (!installed) setShowInstallModal(true);
    }
  }

  // Fetch payment when profile opens
  useEffect(() => {
    if (!showProfile || !isSubscribed || !user?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/student/payments?studentId=${user!.id}`);
        if (res.ok && !cancelled) {
          const payments: PaymentInfo[] = await res.json();
          if (!cancelled) setPayment(payments[0] || null);
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [showProfile, isSubscribed, user?.id]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on view change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileMenuOpen(false);
  }, [currentView]);

  const showInstallButton = canInstall && !standalone && currentView !== 'test-taking';

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-[#1C1C84]/20 relative" style={{ backgroundColor: '#1C1C84' }}>
        <div className="w-full px-3 sm:px-6 lg:px-12 xl:px-16 h-12 sm:h-14 flex items-center justify-between">
          <button onClick={() => { setView('home'); setMobileMenuOpen(false); }} className="flex items-center gap-2 hover:opacity-80 transition-opacity relative z-10 text-white shrink-0">
            <Logo size="sm" variant="light" />
          </button>

          {/* Desktop Nav (sm and above) */}
          <nav className="hidden sm:flex items-center gap-2 relative z-10" aria-label="Main navigation">
            {/* Mock Tests - show on home page */}
            {currentView === 'home' && (
              <Button variant="ghost" size="sm" className="text-sm text-white hover:bg-white/10" onClick={() => setView('tests')}>Mock Tests</Button>
            )}

            {/* Home button - show on other pages */}
            {currentView !== 'home' && currentView !== 'test-taking' && currentView !== 'admin' && (
              <Button variant="ghost" size="sm" className="text-sm text-white hover:bg-white/10" onClick={() => setView('home')}>Home</Button>
            )}

            {/* My Tests - logged in users */}
            {isLoggedIn && currentView !== 'test-taking' && currentView !== 'admin' && currentView !== 'my-attempts' && (
              <Button variant="ghost" size="sm" className="text-sm gap-1 text-white hover:bg-white/10" onClick={() => setView('my-attempts')}>
                <History className="w-3.5 h-3.5" />
                My Tests
              </Button>
            )}

            {/* Admin back button */}
            {currentView === 'admin' && (
              <Button variant="ghost" size="sm" className="text-sm text-white hover:bg-white/10" onClick={() => setView('home')}>← Back to Site</Button>
            )}

            {/* Subscription / Login Status */}
            {currentView !== 'test-taking' && (
              <>
                <ThemeToggle />

                {/* Install App button - desktop */}
                {showInstallButton && (
                  <button
                    onClick={handleInstallClick}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-white animate-fade-in"
                    title="Install App"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-xs font-medium hidden lg:inline">Install App</span>
                  </button>
                )}

                {isLoggedIn && user ? (
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setShowProfile(!showProfile)}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        isSubscribed ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-blue-600 text-white'
                      }`}>
                        {(user.name || '?').charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium max-w-[100px] truncate text-white">{user.name}</span>
                    </button>

                    {showProfile && (
                      <div className="absolute right-0 top-full mt-1 w-72 bg-white rounded-xl shadow-lg border p-2 z-50">
                        {/* Header */}
                        <div className="px-3 py-2 border-b mb-1">
                          <p className="font-semibold text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>

                        {/* Payment Bill - if subscribed */}
                        {isSubscribed && payment && (
                          <div className="mx-2 mb-1 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-3 border border-emerald-100">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-xs font-semibold text-emerald-700">PRO Active</span>
                            </div>
                            <div className="text-xs space-y-0.5">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Amount</span>
                                <span className="font-bold text-emerald-700">₹{payment.amount / 100}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Date</span>
                                <span className="font-medium">{new Date(payment.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                              </div>
                              {payment.razorpayOrderId && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Order ID</span>
                                  <span className="font-mono text-[10px]">{payment.razorpayOrderId.slice(0, 12)}...</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Payment Bill - subscribed but payment fetching */}
                        {isSubscribed && !payment && (
                          <div className="mx-2 mb-1 bg-amber-50 rounded-lg p-3 border border-amber-100 flex items-center gap-2">
                            <Crown className="w-4 h-4 text-amber-500" />
                            <div>
                              <p className="text-xs font-semibold text-amber-700">PRO Member</p>
                              <p className="text-[10px] text-amber-600">Unlimited access to all tests</p>
                            </div>
                          </div>
                        )}

                        {/* Stats */}
                        <div className="px-3 py-2 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Free tests used</span>
                            <span className="font-medium">{isSubscribed ? '∞' : `${user.freeTestsUsed}/2`}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Status</span>
                            {isSubscribed ? (
                              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-[10px]"><Crown className="w-2.5 h-2.5 mr-0.5" />PRO</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-[10px]">Free Plan</Badge>
                            )}
                          </div>
                        </div>

                        {/* Subscription CTA - if not subscribed */}
                        {!isSubscribed && (
                          <div className="mx-2 mb-1 bg-blue-50 rounded-lg p-3 border border-blue-100">
                            <div className="flex items-center gap-2 mb-2">
                              <Zap className="w-4 h-4 text-blue-600" />
                              <div>
                                <p className="text-xs font-semibold text-blue-700">{freeTestsRemaining} free tests left</p>
                                <p className="text-[10px] text-blue-600">Upgrade for unlimited access</p>
                              </div>
                            </div>
                            <button
                              onClick={() => { setShowProfile(false); handleSubscribeClick(); }}
                              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all"
                            >
                              <Crown className="w-3.5 h-3.5" /> Subscribe Now — ₹100
                            </button>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="border-t mt-1 pt-1">
                          <button
                            onClick={() => { setShowProfile(false); setView('my-attempts'); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-50 text-gray-700"
                          >
                            <History className="w-4 h-4" /> My Test History
                          </button>
                          {isSubscribed && payment && (
                            <button
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-emerald-50 text-emerald-700"
                            >
                              <Receipt className="w-4 h-4" /> View Bill
                            </button>
                          )}
                          <button
                            onClick={() => { setShowProfile(false); logout(); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-red-50 text-red-600"
                          >
                            <LogOut className="w-4 h-4" /> Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {!isSubscribed && (
                      <Badge className="gap-1 text-xs flex bg-white/20 text-white border-0 hover:bg-white/30"><Zap className="w-3 h-3" />{freeTestsRemaining} free</Badge>
                    )}
                    <Button size="sm" className="text-xs bg-transparent border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-[#1C1C84] font-semibold transition-all" onClick={() => setShowAuthModal('login')}>
                      <LogIn className="w-3.5 h-3.5 mr-1" />
                      Login
                    </Button>
                    <Button size="sm" className="text-xs bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 font-semibold shadow-lg shadow-amber-500/20 transition-all" onClick={() => setShowAuthModal('signup')}>
                      <UserCircle className="w-3.5 h-3.5 mr-1" />
                      Sign Up
                    </Button>
                  </>
                )}
              </>
            )}
          </nav>

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/10 text-white transition-colors relative z-10"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && currentView !== 'test-taking' && (
          <div className="sm:hidden bg-[#15156a] border-t border-white/10 px-4 py-3 z-40" role="navigation" aria-label="Mobile navigation">
            <div className="flex flex-col gap-1">
              {/* Navigation Links */}
              {currentView !== 'home' && currentView !== 'admin' && (
                <button onClick={() => setView('home')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white hover:bg-white/10 text-sm font-medium transition-colors">
                  Mock Tests
                </button>
              )}
              {currentView !== 'home' && currentView !== 'admin' && (
                <button onClick={() => setView('home')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white hover:bg-white/10 text-sm font-medium transition-colors">
                  Home
                </button>
              )}
              {currentView === 'home' && (
                <button onClick={() => setView('tests')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white hover:bg-white/10 text-sm font-medium transition-colors">
                  Mock Tests
                </button>
              )}
              {isLoggedIn && currentView !== 'admin' && currentView !== 'my-attempts' && (
                <button onClick={() => setView('my-attempts')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white hover:bg-white/10 text-sm font-medium transition-colors">
                  <History className="w-4 h-4" /> My Tests
                </button>
              )}
              {currentView === 'admin' && (
                <button onClick={() => setView('home')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white hover:bg-white/10 text-sm font-medium transition-colors">
                  ← Back to Site
                </button>
              )}

              {/* Divider */}
              <div className="border-t border-white/10 my-1.5" />

              {/* Install App - mobile */}
              {showInstallButton && (
                <>
                  <button
                    onClick={handleInstallClick}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-cyan-300 hover:bg-cyan-500/10 text-sm font-medium transition-colors"
                  >
                    <Download className="w-4 h-4" /> Install App
                  </button>
                  <div className="border-t border-white/10 my-1.5" />
                </>
              )}

              {/* Theme Toggle in mobile */}
              <div className="flex items-center gap-3 px-3 py-2.5">
                <ThemeToggle />
                <span className="text-xs text-white/70">Dark Mode</span>
                {!isSubscribed && (
                  <Badge className="gap-1 text-[10px] ml-auto bg-white/20 text-white border-0"><Zap className="w-2.5 h-2.5" />{freeTestsRemaining} free</Badge>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-white/10 my-1.5" />

              {/* Auth Buttons / Profile */}
              {isLoggedIn && user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                      isSubscribed ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-blue-600 text-white'
                    }`}>
                      {(user.name || '?').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-white/60">{isSubscribed ? 'PRO Member' : `Free Plan`}</p>
                    </div>
                    {isSubscribed && <Crown className="w-4 h-4 text-amber-400" />}
                  </div>

                  {/* Mobile Logout Button */}
                  <button
                    onClick={() => { setMobileMenuOpen(false); logout(); }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-300 hover:bg-red-500/10 text-sm font-medium transition-colors w-full"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2 px-3">
                  <Button size="sm" className="flex-1 text-xs bg-transparent border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-[#1C1C84] font-semibold transition-all" onClick={() => { setMobileMenuOpen(false); setShowAuthModal('login'); }}>
                    <LogIn className="w-3.5 h-3.5 mr-1" /> Login
                  </Button>
                  <Button size="sm" className="flex-1 text-xs bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 font-semibold shadow-lg shadow-amber-500/20 transition-all" onClick={() => { setMobileMenuOpen(false); setShowAuthModal('signup'); }}>
                    <UserCircle className="w-3.5 h-3.5 mr-1" /> Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Install App Modal */}
      <AnimatePresence>
        {showInstallModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50"
            onClick={() => setShowInstallModal(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#1C1C84] to-[#2D2BA8] px-5 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Download className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base">Install TestWaleChacha</h3>
                      <p className="text-white/70 text-xs">Add to Home Screen for quick access</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowInstallModal(false)}
                    className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Body - platform specific instructions */}
              <div className="px-5 py-4">
                {platform === 'ios' ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">Follow these steps to install the app on your iPhone/iPad:</p>
                    <div className="space-y-3">
                      {[
                        { step: 1, icon: '🖱️', text: 'Tap the Share button at the bottom of Safari' },
                        { step: 2, icon: '📋', text: 'Scroll down and tap "Add to Home Screen"' },
                        { step: 3, icon: '➕', text: 'Tap "Add" in the top right corner' },
                        { step: 4, icon: '🎉', text: 'The app icon will appear on your home screen!' },
                      ].map((item) => (
                        <div key={item.step} className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-full bg-[#1C1C84] text-white flex items-center justify-center text-xs font-bold shrink-0">
                            {item.step}
                          </div>
                          <div className="text-sm text-gray-700 leading-relaxed">
                            <span className="mr-1.5">{item.icon}</span>
                            {item.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : platform === 'android' ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">Install the app for quick access and offline use:</p>
                    <button
                      onClick={async () => {
                        const installed = await triggerInstall();
                        if (installed) setShowInstallModal(false);
                      }}
                      className="w-full bg-[#1C1C84] hover:bg-[#15156a] text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Install Now
                    </button>
                    <p className="text-xs text-gray-400 text-center">Or tap &ldquo;Add to Home Screen&rdquo; from your browser menu</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">To install the app:</p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#1C1C84] text-white flex items-center justify-center text-xs font-bold shrink-0">1</div>
                        <p className="text-sm text-gray-700 leading-relaxed">Click the install icon <span className="inline-block px-1.5 py-0.5 bg-gray-100 rounded text-xs">⊕</span> in your browser&apos;s address bar</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#1C1C84] text-white flex items-center justify-center text-xs font-bold shrink-0">2</div>
                        <p className="text-sm text-gray-700 leading-relaxed">Click &ldquo;Install&rdquo; when prompted</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 pb-4">
                <button
                  onClick={() => setShowInstallModal(false)}
                  className="w-full py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
