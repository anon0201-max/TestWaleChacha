'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Zap, LogIn, LogOut, UserCircle, History, Receipt, CheckCircle2 } from 'lucide-react';
import { Logo } from './Logo';
import { ThemeToggle } from '@/components/ThemeToggle';

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

  return (
    <header className="sticky top-0 z-30 border-b border-[#1C1C84]/20 relative" style={{ backgroundColor: '#1C1C84' }}>
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <button onClick={() => setView('home')} className="flex items-center gap-2 hover:opacity-80 transition-opacity relative z-10 text-white">
          <Logo size="sm" variant="light" />
        </button>

        <nav className="flex items-center gap-1 sm:gap-2 relative z-10">
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
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm gap-1 text-white hover:bg-white/10" onClick={() => setView('my-attempts')}>
              <History className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">My Tests</span>
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
              {isLoggedIn && user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setShowProfile(!showProfile)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isSubscribed ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-blue-600 text-white'
                    }`}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline text-sm font-medium max-w-[100px] truncate text-white">{user.name}</span>
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
                          <span className="font-medium">{isSubscribed ? '∞' : `${user.freeTestsUsed}/5`}</span>
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
                            onClick={() => { setShowProfile(false); useAppStore.getState().setShowSubscriptionModal(true); }}
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
                    <Badge className="gap-1 text-xs hidden sm:flex bg-white/20 text-white border-0 hover:bg-white/30"><Zap className="w-3 h-3" />{freeTestsRemaining} free</Badge>
                  )}
                  <Button size="sm" variant="outline" className="text-xs border-white/30 text-white hover:bg-white/10 hover:text-white" onClick={() => setShowAuthModal('login')}>
                    <LogIn className="w-3.5 h-3.5 mr-1" />
                    <span className="hidden sm:inline">Login</span>
                  </Button>
                  <Button size="sm" className="bg-white text-[#1C1C84] hover:bg-white/90 text-xs font-semibold" onClick={() => setShowAuthModal('signup')}>
                    <UserCircle className="w-3.5 h-3.5 mr-1" />
                    <span className="hidden sm:inline">Sign Up</span>
                  </Button>
                </>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
