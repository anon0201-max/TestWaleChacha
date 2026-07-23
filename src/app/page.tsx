'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { HomePage } from '@/components/mcq/HomePage';
import { TestListPage } from '@/components/mcq/TestListPage';
import { TestTakingPage } from '@/components/mcq/TestTakingPage';
import { ResultsPage } from '@/components/mcq/ResultsPage';
import { SubscriptionModal } from '@/components/mcq/SubscriptionModal';
import { AppHeader } from '@/components/mcq/AppHeader';
import { AppFooter } from '@/components/mcq/AppFooter';

export default function Page() {
  const {
    currentView,
    deviceId,
    setCategories,
    setTests,
    setStudentData,
  } = useAppStore();

  // Load data on mount
  useEffect(() => {
    async function loadData() {
      try {
        // Fetch categories
        const catRes = await fetch('/api/categories');
        if (catRes.ok) {
          const categories = await catRes.json();
          setCategories(categories);
        }

        // Fetch tests
        const testRes = await fetch('/api/tests');
        if (testRes.ok) {
          const tests = await testRes.json();
          setTests(tests);
        }

        // Fetch student data
        if (deviceId) {
          const studentRes = await fetch(`/api/student?deviceId=${deviceId}`);
          if (studentRes.ok) {
            const student = await studentRes.json();
            setStudentData({
              freeTestsUsed: student.freeTestsUsed,
              isSubscribed: student.isSubscribed,
            });
          }
        }
      } catch {
        // Error handling - data will be empty
      }
    }

    loadData();
  }, [deviceId, setCategories, setTests, setStudentData]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {currentView === 'home' && <HomePage />}
          {currentView === 'tests' && <TestListPage />}
          {currentView === 'test-taking' && <TestTakingPage />}
          {currentView === 'results' && <ResultsPage />}
        </div>
      </main>

      <AppFooter />
      <SubscriptionModal />
    </div>
  );
}
