'use client';

import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Zap, GraduationCap, Shield } from 'lucide-react';

export function AppHeader() {
  const { currentView, setView, freeTestsRemaining, isSubscribed } = useAppStore();

  return (
    <header className="sticky top-0 z-30 border-b bg-white relative">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <button onClick={() => setView('home')} className="flex items-center gap-2 font-bold text-lg hover:text-blue-600 transition-colors relative z-10">
          <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="hidden sm:inline">QuizMaster</span>
        </button>
        <nav className="flex items-center gap-2 relative z-10">
          {currentView === 'home' && (
            <Button variant="ghost" size="sm" className="text-sm" onClick={() => setView('tests')}>Mock Tests</Button>
          )}
          {currentView === 'home' && (
            <Button variant="ghost" size="sm" className="text-sm" onClick={() => setView('admin')}><Shield className="w-3.5 h-3.5 mr-1" />Admin</Button>
          )}
          {currentView !== 'home' && currentView !== 'test-taking' && currentView !== 'admin' && (
            <Button variant="ghost" size="sm" className="text-sm" onClick={() => setView('home')}>Home</Button>
          )}
          {currentView === 'admin' && (
            <Button variant="ghost" size="sm" className="text-sm" onClick={() => setView('home')}>← Back to Site</Button>
          )}
          {currentView !== 'test-taking' && (
            <>
              {isSubscribed ? (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0"><Crown className="w-3 h-3 mr-1" />PRO</Badge>
              ) : (
                <Badge variant="secondary" className="gap-1"><Zap className="w-3 h-3" />{freeTestsRemaining} free left</Badge>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
