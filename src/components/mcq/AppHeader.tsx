'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Zap, GraduationCap, LogIn, LogOut, UserCircle, History } from 'lucide-react';

export function AppHeader() {
  const {
    currentView, setView, freeTestsRemaining, isSubscribed,
    isLoggedIn, user, logout, setShowAuthModal,
  } = useAppStore();
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

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
    <header className="sticky top-0 z-30 border-b bg-white relative">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <button onClick={() => setView('home')} className="flex items-center gap-2 font-bold text-lg hover:text-blue-600 transition-colors relative z-10">
          <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="hidden sm:inline">QuizMaster</span>
        </button>

        <nav className="flex items-center gap-1 sm:gap-2 relative z-10">
          {/* Mock Tests - show on home page */}
          {currentView === 'home' && (
            <Button variant="ghost" size="sm" className="text-sm" onClick={() => setView('tests')}>Mock Tests</Button>
          )}

          {/* Home button - show on other pages */}
          {currentView !== 'home' && currentView !== 'test-taking' && currentView !== 'admin' && (
            <Button variant="ghost" size="sm" className="text-sm" onClick={() => setView('home')}>Home</Button>
          )}

          {/* My Tests - logged in users */}
          {isLoggedIn && currentView !== 'test-taking' && currentView !== 'admin' && currentView !== 'my-attempts' && (
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm gap-1" onClick={() => setView('my-attempts')}>
              <History className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">My Tests</span>
            </Button>
          )}

          {/* Admin back button */}
          {currentView === 'admin' && (
            <Button variant="ghost" size="sm" className="text-sm" onClick={() => setView('home')}>← Back to Site</Button>
          )}

          {/* Subscription / Login Status */}
          {currentView !== 'test-taking' && (
            <>
              {isLoggedIn && user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setShowProfile(!showProfile)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline text-sm font-medium max-w-[100px] truncate">{user.name}</span>
                  </button>

                  {showProfile && (
                    <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-xl shadow-lg border p-2 z-50">
                      <div className="px-3 py-2 border-b mb-1">
                        <p className="font-semibold text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="px-3 py-2 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Free tests used</span>
                          <span className="font-medium">{user.freeTestsUsed}/5</span>
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
                      <div className="border-t mt-1 pt-1">
                        <button
                          onClick={() => { setShowProfile(false); setView('my-attempts'); }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-50 text-gray-700"
                        >
                          <History className="w-4 h-4" /> My Test History
                        </button>
                        {!isSubscribed && (
                          <button
                            onClick={() => { setShowProfile(false); useAppStore.getState().setShowSubscriptionModal(true); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-blue-50 text-blue-700 font-medium"
                          >
                            <Crown className="w-4 h-4" /> Upgrade to Pro — ₹100
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
                    <Badge variant="secondary" className="gap-1 text-xs hidden sm:flex"><Zap className="w-3 h-3" />{freeTestsRemaining} free</Badge>
                  )}
                  <Button size="sm" variant="outline" className="text-xs" onClick={() => setShowAuthModal('login')}>
                    <LogIn className="w-3.5 h-3.5 mr-1" />
                    <span className="hidden sm:inline">Login</span>
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs" onClick={() => setShowAuthModal('signup')}>
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
