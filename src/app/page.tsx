'use client';

import React, { useEffect, Suspense, lazy } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { HomePage } from '@/components/mcq/HomePage';
import { TestListPage } from '@/components/mcq/TestListPage';
import { SubscriptionModal } from '@/components/mcq/SubscriptionModal';
import { AuthModal } from '@/components/mcq/AuthModal';
import { AppHeader } from '@/components/mcq/AppHeader';
import { AppFooter } from '@/components/mcq/AppFooter';
import { PwaInstallPrompt } from '@/components/PwaInstallPrompt';

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
        setCategories(catRes);
        setTests(testRes);

        // If logged in, refresh user data from server
        if (user?.id) {
          const meRes = await fetch(`/api/auth/me?studentId=${user.id}`);
          if (meRes.ok) {
            const meData = await meRes.json();
            setUser(meData);
          }
        } else if (deviceId) {
          // Guest: fetch student by deviceId
          const studentRes = await fetch(`/api/student?deviceId=${deviceId}`);
          if (studentRes.ok) {
            const studentData = await studentRes.json();
            setStudentData({ freeTestsUsed: studentData.freeTestsUsed, isSubscribed: studentData.isSubscribed });
          }
        }
      } catch {}
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
          <div className="max-w-6xl mx-auto px-4 py-6">
            {currentView === 'home' && <HomePage />}
            {currentView === 'tests' && <TestListPage />}
            {currentView === 'results' && <Suspense fallback={<RouteFallback />}><ResultsPage /></Suspense>}
            {currentView === 'my-attempts' && <Suspense fallback={<RouteFallback />}><MyAttemptsPage /></Suspense>}
          </div>
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
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    }>
      <AppContent />
    </Suspense>
  );
}
