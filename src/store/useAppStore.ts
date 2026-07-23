import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Generate a unique device ID
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

export type AppView = 'home' | 'tests' | 'test-detail' | 'test-taking' | 'results';

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
}

interface TestInfo {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  difficulty: string;
  timeLimit: number;
  totalQuestions: number;
  category: {
    id: string;
    name: string;
    slug: string;
    icon: string;
    color: string;
  };
  questions: TestQuestion[];
  _count?: { questions: number };
}

interface CategoryInfo {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  _count: { tests: number };
}

interface AttemptResult {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  answerDetails: {
    questionId: string;
    userAnswer: string | null;
    correctOption: string;
    isCorrect: boolean;
  }[];
  timeTaken: number;
  test: {
    title: string;
    category: { name: string };
  };
}

interface AppState {
  // Navigation
  currentView: AppView;
  setView: (view: AppView) => void;

  // Device
  deviceId: string;

  // Student
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

  // Subscription modal
  showSubscriptionModal: boolean;
  setShowSubscriptionModal: (show: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Navigation
      currentView: 'home',
      setView: (view) => set({ currentView: view }),

      // Device
      deviceId: generateDeviceId(),

      // Student
      freeTestsUsed: 0,
      freeTestsRemaining: 5,
      isSubscribed: false,
      setStudentData: (data) =>
        set({
          freeTestsUsed: data.freeTestsUsed,
          freeTestsRemaining: Math.max(0, 5 - data.freeTestsUsed),
          isSubscribed: data.isSubscribed,
        }),

      // Categories
      categories: [],
      setCategories: (cats) => set({ categories: cats }),

      // Tests
      tests: [],
      setTests: (t) => set({ tests: t }),
      selectedCategory: null,
      setSelectedCategory: (cat) => set({ selectedCategory: cat }),
      searchQuery: '',
      setSearchQuery: (q) => set({ searchQuery: q }),

      // Current Test
      currentTest: null,
      setCurrentTest: (test) => set({ currentTest: test }),

      // Test Taking
      answers: {},
      setAnswer: (questionId, answer) =>
        set((state) => ({ answers: { ...state.answers, [questionId]: answer } })),
      clearAnswers: () => set({ answers: {} }),
      timeRemaining: 0,
      setTimeRemaining: (time) => set({ timeRemaining: time }),
      isTestActive: false,
      setIsTestActive: (active) => set({ isTestActive: active }),
      currentQuestionIndex: 0,
      setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),

      // Results
      lastResult: null,
      setLastResult: (result) => set({ lastResult: result }),

      // Subscription Modal
      showSubscriptionModal: false,
      setShowSubscriptionModal: (show) => set({ showSubscriptionModal: show }),
    }),
    {
      name: 'mcq-app-storage',
      partialize: (state) => ({
        deviceId: state.deviceId,
        freeTestsUsed: state.freeTestsUsed,
        freeTestsRemaining: state.freeTestsRemaining,
        isSubscribed: state.isSubscribed,
      }),
    }
  )
);
