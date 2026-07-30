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

export type AppView = 'home' | 'tests' | 'test-taking' | 'results' | 'admin' | 'my-attempts';

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
  questionImage?: string | null;
  negativeMark?: number;
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
  icon?: string;
  isActive: boolean;
  isLocked: boolean;
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
  ranking?: { rank: number; total: number };
}

interface AttemptHistory {
  id: string;
  testId: string;
  test: { id: string; title: string; category: { name: string; color: string } };
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: number;
  createdAt: string;
  completed: boolean;
}

interface AdminData {
  isLoggedIn: boolean;
  stats: { totalStudents: number; totalTests: number; totalQuestions: number; totalAttempts: number; totalPayments: number; totalPaidStudents: number; totalFreeStudents: number };
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

  // Attempt History
  attemptHistory: AttemptHistory[];
  setAttemptHistory: (history: AttemptHistory[]) => void;

  // Subscription
  showSubscriptionModal: boolean;
  setShowSubscriptionModal: (show: boolean) => void;


  // Auth Modal
  showAuthModal: 'login' | 'signup' | null;
  setShowAuthModal: (show: 'login' | 'signup' | null) => void;

  // Pending test (to start after login)
  pendingTestId: string | null;
  setPendingTestId: (id: string | null) => void;

  // Admin
  adminData: AdminData;
  setAdminData: (data: Partial<AdminData>) => void;

  // Theme
  themeColor: string;
  setThemeColor: (color: string) => void;
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
        freeTestsRemaining: Math.max(0, user?.freeTestsRemaining ?? 5),
        isSubscribed: user?.isSubscribed ?? false,
      }),
      logout: () => set({
        user: null,
        isLoggedIn: false,
        freeTestsUsed: 0,
        freeTestsRemaining: 5,
        isSubscribed: false,
        attemptHistory: [],
      }),

      // Student
      freeTestsUsed: 0,
      freeTestsRemaining: 5,
      isSubscribed: false,
      setStudentData: (data) => set({
        freeTestsUsed: data.freeTestsUsed ?? 0,
        freeTestsRemaining: Math.max(0, 5 - (data.freeTestsUsed ?? 0)),
        isSubscribed: data.isSubscribed ?? false,
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

      attemptHistory: [],
      setAttemptHistory: (history) => set({ attemptHistory: history }),

      showSubscriptionModal: false,
      setShowSubscriptionModal: (show) => set({ showSubscriptionModal: show }),


      showAuthModal: null,
      setShowAuthModal: (show) => set({ showAuthModal: show }),

      pendingTestId: null,
      setPendingTestId: (id) => set({ pendingTestId: id }),

      adminData: { isLoggedIn: false, stats: { totalStudents: 0, totalTests: 0, totalQuestions: 0, totalAttempts: 0, totalPayments: 0, totalPaidStudents: 0, totalFreeStudents: 0 } },
      setAdminData: (data) => set((state) => ({ adminData: { ...state.adminData, ...data } })),

      // Theme
      themeColor: 'blue',
      setThemeColor: (color) => set({ themeColor: color }),
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
        themeColor: state.themeColor,
      }),
      merge: (persisted, current) => {
        // Guard against corrupt/invalid localStorage data — never crash the app
        try {
          if (!persisted || typeof persisted !== 'object') return current;
          const p = persisted as Record<string, unknown>;

          // Deep-validate user object: must have expected fields (id, name)
          // to prevent crash when old code corrupted localStorage
          let safeUser: typeof current.user = null;
          if (p.user && typeof p.user === 'object' && !Array.isArray(p.user)) {
            const u = p.user as Record<string, unknown>;
            if (typeof u.id === 'string' && typeof u.name === 'string' && u.name.length > 0) {
              safeUser = u as typeof current.user;
            }
          }

          return {
            ...current,
            deviceId: typeof p.deviceId === 'string' ? p.deviceId : current.deviceId,
            user: safeUser,
            isLoggedIn: safeUser ? true : false,
            freeTestsUsed: Number(p.freeTestsUsed) || 0,
            freeTestsRemaining: Number(p.freeTestsRemaining) || 5,
            isSubscribed: typeof p.isSubscribed === 'boolean' ? p.isSubscribed : false,
            themeColor: typeof p.themeColor === 'string' ? p.themeColor : current.themeColor,
          };
        } catch {
          return current;
        }
      },
    }
  )
);

// Helper: open subscription modal — but if user not logged in, open auth modal first
export function handleSubscribeClick() {
  const state = useAppStore.getState();
  if (!state.isLoggedIn) {
    useAppStore.getState().setShowAuthModal('login');
  } else {
    useAppStore.getState().setShowSubscriptionModal(true);
  }
}
