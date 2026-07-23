'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { HomePage } from '@/components/mcq/HomePage';
import { TestListPage } from '@/components/mcq/TestListPage';
import { TestTakingPage } from '@/components/mcq/TestTakingPage';
import { ResultsPage } from '@/components/mcq/ResultsPage';
import { AdminPanel } from '@/components/mcq/AdminPanel';
import { SubscriptionModal } from '@/components/mcq/SubscriptionModal';
import { AppHeader } from '@/components/mcq/AppHeader';
import { AppFooter } from '@/components/mcq/AppFooter';

export default function Page() {
  const { currentView, deviceId, setCategories, setTests, setStudentData } = useAppStore();

  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, testRes, studentRes] = await Promise.all([
          fetch('/api/categories').then(r => r.ok ? r.json() : []),
          fetch('/api/tests').then(r => r.ok ? r.json() : []),
          deviceId ? fetch(`/api/student?deviceId=${deviceId}`).then(r => r.ok ? r.json() : null) : Promise.resolve(null),
        ]);
        setCategories(catRes);
        setTests(testRes);
        if (studentRes) setStudentData({ freeTestsUsed: studentRes.freeTestsUsed, isSubscribed: studentRes.isSubscribed });
      } catch {}
    }
    loadData();
  }, [deviceId, setCategories, setTests, setStudentData]);

  const isAdminOrTestTaking = currentView === 'admin' || currentView === 'test-taking';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppHeader />
      <main className="flex-1">
        {isAdminOrTestTaking ? (
          <>{currentView === 'admin' && <AdminPanel />}{currentView === 'test-taking' && <TestTakingPage />}</>
        ) : (
          <div className="max-w-6xl mx-auto px-4 py-6">
            {currentView === 'home' && <HomePage />}
            {currentView === 'tests' && <TestListPage />}
            {currentView === 'results' && <ResultsPage />}
          </div>
        )}
      </main>
      {!isAdminOrTestTaking && <AppFooter />}
      <SubscriptionModal />
    </div>
  );
}
