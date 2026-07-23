import { create } from 'zustand';
import { persist } from 'zustand/middleware';

function generateDeviceId(): string {
  if (typeof window !== 'undefined') {
    let id = localStorage.getItem('mcq_device_id');
    if (!id) {
      id = 'dev_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      localStorage.setItem('mcq_device_id', id);
    }
    return id;
  }
  return '';
}

export type AppView = 'home' | 'tests' | 'test-taking' | 'results' | 'admin';

interface UserInfo {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  freeTestsUsed: number;
  freeTestsRemaining: number;
  isSubscribed: boolean;
  subscriptionAt?: string | null;
}

interface TestQuestion {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation?: string | null;
  order: number;
  section?: string;
}

interface TestInfo {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  difficulty: string;
  timeLimit: number;
  totalQuestions: number;
  examName?: string;
  category: { id: string; name: string; slug: string; icon: string; color: string; examType?: string };
  questions: TestQuestion[];
  _count?: { questions: number };
}

interface CategoryInfo {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  examType?: string;
  _count: { tests: number };
}

interface AttemptResult {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  answerDetails: { questionId: string; userAnswer: string | null; correctOption: string; isCorrect: boolean }[];
  timeTaken: number;
  test: { title: string; category: { name: string } };
}

interface AdminData {
  isLoggedIn: boolean;
  stats: { totalStudents: number; totalTests: number; totalQuestions: number; totalAttempts: number; totalPayments: number };
}

interface AppState {
  currentView: AppView;
  setView: (view: AppView) => void;
  deviceId: string;

  // Auth
  user: UserInfo | null;
  isLoggedIn: boolean;
  setUser: (user: UserInfo | null) => void;
  logout: () => void;

  // Student (fallback for guests)
  freeTestsUsed: number;
  freeTestsRemaining: number;
  isSubscribed: boolean;
  setStudentData: (data: { freeTestsUsed: number; isSubscribed: boolean }) => void;

  // Categories & Tests
  categories: CategoryInfo[];
  setCategories: (cats: CategoryInfo[]) => void;
  tests: TestInfo[];
  setTests: (t: TestInfo[]) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Current Test
  currentTest: TestInfo | null;
  setCurrentTest: (test: TestInfo | null) => void;

  // Test Taking
  answers: Record<string, string>;
  setAnswer: (questionId: string, answer: string) => void;
  clearAnswers: () => void;
  timeRemaining: number;
  setTimeRemaining: (time: number) => void;
  isTestActive: boolean;
  setIsTestActive: (active: boolean) => void;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;

  // Results
  lastResult: AttemptResult | null;
  setLastResult: (result: AttemptResult | null) => void;

  // Subscription
  showSubscriptionModal: boolean;
  setShowSubscriptionModal: (show: boolean) => void;

  // Auth Modal
  showAuthModal: 'login' | 'signup' | null;
  setShowAuthModal: (show: 'login' | 'signup' | null) => void;

  // Admin
  adminData: AdminData;
  setAdminData: (data: Partial<AdminData>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentView: 'home',
      setView: (view) => set({ currentView: view }),
      deviceId: generateDeviceId(),

      // Auth
      user: null,
      isLoggedIn: false,
      setUser: (user) => set({
        user,
        isLoggedIn: !!user,
        freeTestsUsed: user?.freeTestsUsed ?? 0,
        freeTestsRemaining: user?.freeTestsRemaining ?? 5,
        isSubscribed: user?.isSubscribed ?? false,
      }),
      logout: () => set({
        user: null,
        isLoggedIn: false,
        freeTestsUsed: 0,
        freeTestsRemaining: 5,
        isSubscribed: false,
      }),

      // Student
      freeTestsUsed: 0,
      freeTestsRemaining: 5,
      isSubscribed: false,
      setStudentData: (data) => set({
        freeTestsUsed: data.freeTestsUsed,
        freeTestsRemaining: Math.max(0, 5 - data.freeTestsUsed),
        isSubscribed: data.isSubscribed,
      }),

      categories: [],
      setCategories: (cats) => set({ categories: cats }),
      tests: [],
      setTests: (t) => set({ tests: t }),
      selectedCategory: null,
      setSelectedCategory: (cat) => set({ selectedCategory: cat }),
      searchQuery: '',
      setSearchQuery: (q) => set({ searchQuery: q }),

      currentTest: null,
      setCurrentTest: (test) => set({ currentTest: test }),

      answers: {},
      setAnswer: (questionId, answer) => set((state) => ({ answers: { ...state.answers, [questionId]: answer } })),
      clearAnswers: () => set({ answers: {} }),
      timeRemaining: 0,
      setTimeRemaining: (time) => set({ timeRemaining: time }),
      isTestActive: false,
      setIsTestActive: (active) => set({ isTestActive: active }),
      currentQuestionIndex: 0,
      setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),

      lastResult: null,
      setLastResult: (result) => set({ lastResult: result }),

      showSubscriptionModal: false,
      setShowSubscriptionModal: (show) => set({ showSubscriptionModal: show }),

      showAuthModal: null,
      setShowAuthModal: (show) => set({ showAuthModal: show }),

      adminData: { isLoggedIn: false, stats: { totalStudents: 0, totalTests: 0, totalQuestions: 0, totalAttempts: 0, totalPayments: 0 } },
      setAdminData: (data) => set((state) => ({ adminData: { ...state.adminData, ...data } })),
    }),
    {
      name: 'mcq-app-storage',
      partialize: (state) => ({
        deviceId: state.deviceId,
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        freeTestsUsed: state.freeTestsUsed,
        freeTestsRemaining: state.freeTestsRemaining,
        isSubscribed: state.isSubscribed,
      }),
    }
  )
);
