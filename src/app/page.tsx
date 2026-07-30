'use client';

import React, { useEffect, Suspense, lazy, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { HomePage } from '@/components/mcq/HomePage';
import { TestListPage } from '@/components/mcq/TestListPage';
import { SubscriptionModal } from '@/components/mcq/SubscriptionModal';
import { AuthModal } from '@/components/mcq/AuthModal';
import { AppHeader } from '@/components/mcq/AppHeader';
import { AppFooter } from '@/components/mcq/AppFooter';
import { PwaInstallPrompt } from '@/components/PwaInstallPrompt';
import { Button } from '@/components/ui/button';

// Lazy load heavy/conditionally-rendered components to reduce initial bundle
const TestTakingPage = lazy(() => import('@/components/mcq/TestTakingPage').then(m => ({ default: m.TestTakingPage })));
const ResultsPage = lazy(() => import('@/components/mcq/ResultsPage').then(m => ({ default: m.ResultsPage })));
const MyAttemptsPage = lazy(() => import('@/components/mcq/MyAttemptsPage').then(m => ({ default: m.MyAttemptsPage })));
const AdminPanel = lazy(() => import('@/components/mcq/AdminPanel').then(m => ({ default: m.AdminPanel })));

// Shared loading spinner for lazy-loaded routes
function RouteFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
}

// Error boundary to catch client-side crashes gracefully
class ErrorBoundary extends React.Component<{ children: React.ReactNode; fallback: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Store error on window so CrashFallback can display it
    if (typeof window !== 'undefined') {
      (window as any).__NEXT_ERROR__ = error;
    }
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught render error:', error.message, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function CrashFallback() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="text-5xl mb-4">😵</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-500 mb-6">The app encountered an unexpected error. This is usually fixed by refreshing.</p>
        <Button
          onClick={() => {
            // Clear corrupted localStorage and reload
            try {
              localStorage.removeItem('mcq-app-storage');
            } catch { /* ignore */ }
            window.location.reload();
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 h-11"
        >
          🔄 Refresh & Fix
        </Button>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="block mx-auto mt-4 text-xs text-gray-400 hover:text-gray-600"
        >
          {showDetails ? 'Hide' : 'Show'} technical details
        </button>
        {showDetails && (
          <pre className="mt-3 text-left text-xs text-red-500 bg-red-50 p-3 rounded-lg overflow-auto max-h-40 font-mono">
            {typeof window !== 'undefined' && (window as any).__NEXT_ERROR__
              ? `${(window as any).__NEXT_ERROR__.message}\n\n${(window as any).__NEXT_ERROR__.stack?.slice(0, 500) || ''}`
              : 'No details available'}
          </pre>
        )}
      </div>
    </div>
  );
}

function AppContent() {
  const searchParams = useSearchParams();
  const isAdminParam = searchParams.get('admin') === 'true';

  const {
    currentView, deviceId, user, isLoggedIn,
    setCategories, setTests, setStudentData, setUser,
  } = useAppStore();

  // Handle admin route via query param
  useEffect(() => {
    if (isAdminParam && currentView !== 'test-taking') {
      useAppStore.setState({ currentView: 'admin' });
    }
  }, [isAdminParam, currentView]);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, testRes] = await Promise.all([
          fetch('/api/categories').then(r => r.ok ? r.json() : []),
          fetch('/api/tests').then(r => r.ok ? r.json() : []),
        ]);
        setCategories(Array.isArray(catRes) ? catRes : []);
        setTests(Array.isArray(testRes) ? testRes : []);

        // If logged in, refresh user data from server
        if (user?.id) {
          try {
            const meRes = await fetch(`/api/auth/me?studentId=${user.id}`);
            if (meRes.ok) {
              const meData = await meRes.json();
              if (meData.success && meData.student) {
                setUser(meData.student);
              }
            }
          } catch { /* silent */ }
        } else if (deviceId) {
          // Guest: fetch student by deviceId
          try {
            const studentRes = await fetch(`/api/student?deviceId=${deviceId}`);
            if (studentRes.ok) {
              const studentData = await studentRes.json();
              if (studentData && typeof studentData === 'object') {
                setStudentData({
                  freeTestsUsed: Number(studentData.freeTestsUsed) || 0,
                  isSubscribed: Boolean(studentData.isSubscribed),
                });
              }
            }
          } catch { /* silent */ }
        }
      } catch {
        // Network error - don't crash the app
      }
    }
    loadData();
  }, [deviceId, user?.id, setCategories, setTests, setStudentData, setUser]);

  const isAdminOrTestTaking = currentView === 'admin' || currentView === 'test-taking';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <AppHeader />
      <main className="flex-1">
        {isAdminOrTestTaking ? (
          <>
            {currentView === 'admin' && <Suspense fallback={<RouteFallback />}><AdminPanel /></Suspense>}
            {currentView === 'test-taking' && <Suspense fallback={<RouteFallback />}><TestTakingPage /></Suspense>}
          </>
        ) : (
          <>
            {currentView === 'home' && <HomePage />}
            <div className="max-w-[1400px] mx-auto px-4 py-6">
              {currentView === 'tests' && <TestListPage />}
              {currentView === 'results' && <Suspense fallback={<RouteFallback />}><ResultsPage /></Suspense>}
              {currentView === 'my-attempts' && <Suspense fallback={<RouteFallback />}><MyAttemptsPage /></Suspense>}
            </div>
          </>
        )}
      </main>
      {!isAdminOrTestTaking && <AppFooter />}
      <SubscriptionModal />
      <AuthModal />
      <PwaInstallPrompt />
    </div>
  );
}

export default function Page() {
  return (
    <ErrorBoundary fallback={<CrashFallback />}>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      }>
        <AppContent />
      </Suspense>
    </ErrorBoundary>
  );
}
