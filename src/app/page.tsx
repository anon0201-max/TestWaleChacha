'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { HomePage } from '@/components/mcq/HomePage';
import { TestListPage } from '@/components/mcq/TestListPage';
import { TestTakingPage } from '@/components/mcq/TestTakingPage';
import { ResultsPage } from '@/components/mcq/ResultsPage';
import { MyAttemptsPage } from '@/components/mcq/MyAttemptsPage';
import { AdminPanel } from '@/components/mcq/AdminPanel';
import { SubscriptionModal } from '@/components/mcq/SubscriptionModal';
import { AuthModal } from '@/components/mcq/AuthModal';
import { AppHeader } from '@/components/mcq/AppHeader';
import { AppFooter } from '@/components/mcq/AppFooter';
import { PwaInstallPrompt } from '@/components/PwaInstallPrompt';

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
            {currentView === 'admin' && <AdminPanel />}
            {currentView === 'test-taking' && <TestTakingPage />}
          </>
        ) : (
          <div className="max-w-6xl mx-auto px-4 py-6">
            {currentView === 'home' && <HomePage />}
            {currentView === 'tests' && <TestListPage />}
            {currentView === 'results' && <ResultsPage />}
            {currentView === 'my-attempts' && <MyAttemptsPage />}
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
