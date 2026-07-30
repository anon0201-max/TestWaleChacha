'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
  Trophy, Clock, Target, History, BookOpen, ChevronRight, ArrowLeft,
  TrendingUp, BarChart3, Star, Zap, Crown, Medal, Award,
} from 'lucide-react';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function MyAttemptsPage() {
  const { user, isLoggedIn, setView, setShowAuthModal, setLastResult, setCurrentTest, setCurrentQuestionIndex, setTimeRemaining, setIsTestActive, clearAnswers } = useAppStore();
  const [attempts, setAttempts] = useState<Array<{
    id: string;
    testId: string;
    test: { id: string; title: string; category: { name: string; color: string } };
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    timeTaken: number;
    createdAt: string;
    completed: boolean;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [viewingAttempt, setViewingAttempt] = useState<string | null>(null);

  async function handleViewAttempt(attempt: typeof attempts[0]) {
    if (viewingAttempt) return;
    setViewingAttempt(attempt.id);
    try {
      // Fetch test with questions so results page can show answer review
      const testRes = await fetch(`/api/tests/${attempt.testId}?testId=${attempt.testId}`);
      if (testRes.ok) {
        const testData = await testRes.json();
        setCurrentTest(testData);
        clearAnswers();
        setCurrentQuestionIndex(0);
        setTimeRemaining(Number(testData.timeLimit) || 600);
        setIsTestActive(false);

        // Build result data from history attempt
        setLastResult({
          score: attempt.score,
          correctAnswers: attempt.correctAnswers,
          totalQuestions: attempt.totalQuestions,
          answerDetails: [],
          timeTaken: attempt.timeTaken,
          test: { title: attempt.test?.title || '', category: { name: attempt.test?.category?.name || '' } },
        } as any);
        setView('results');
      } else {
        setView('tests');
      }
    } catch {
      setView('tests');
    }
    setViewingAttempt(null);
  }

  useEffect(() => {
    if (!user?.id) { return; }
    let cancelled = false;
    fetch(`/api/attempts?studentId=${user.id}`)
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (!cancelled) setAttempts(data); })
      .catch(() => { if (!cancelled) setAttempts([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user?.id]);

  if (!isLoggedIn) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
          <History className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold mb-2">Please Login to View Attempts</h2>
        <p className="text-sm text-muted-foreground mb-4">Login to see your test history, scores and rankings.</p>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowAuthModal('login')}>
          Login Now
        </Button>
      </div>
    );
  }

  const totalAttempts = attempts.length;
  const avgScore = totalAttempts > 0 ? Math.round(attempts.reduce((s, a) => s + a.score, 0) / totalAttempts) : 0;
  const bestScore = totalAttempts > 0 ? Math.max(...attempts.map(a => a.score)) : 0;
  const bestTime = totalAttempts > 0 ? Math.min(...attempts.map(a => a.timeTaken)) : 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => setView('home')}><ArrowLeft className="w-5 h-5" /></Button>
        <div>
          <h1 className="text-xl font-bold">My Test History</h1>
          <p className="text-xs text-muted-foreground">{user.name} — All your past attempts</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: BarChart3, label: 'Total Attempts', value: totalAttempts, color: 'bg-blue-100 text-blue-700' },
          { icon: TrendingUp, label: 'Avg Score', value: `${avgScore}%`, color: 'bg-emerald-100 text-emerald-700' },
          { icon: Trophy, label: 'Best Score', value: `${bestScore}%`, color: 'bg-amber-100 text-amber-700' },
          { icon: Clock, label: 'Fastest Time', value: bestTime > 0 ? formatTime(bestTime) : '--', color: 'bg-purple-100 text-purple-700' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${stat.color}`}><stat.icon className="w-5 h-5" /></div>
                <div>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Attempt List */}
      <h2 className="text-base font-bold">Attempt History</h2>
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : attempts.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-10 text-center">
            <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium">No attempts yet</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Start taking tests to see your history here!</p>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setView('tests')}>
              <BookOpen className="w-4 h-4 mr-2" /> Browse Tests
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {attempts.map((attempt, i) => (
            <motion.div key={attempt.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.3) }}>
              <Card className={`hover:shadow-md transition-all border-0 shadow-sm cursor-pointer ${viewingAttempt === attempt.id ? 'opacity-60 pointer-events-none' : 'hover:border-blue-200'}`} onClick={() => handleViewAttempt(attempt)}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white text-sm font-bold" style={{ backgroundColor: attempt.test?.category?.color || '#1e40af' }}>
                      {attempt.test?.category?.name?.charAt(0) || 'T'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{attempt.test?.title || 'Unknown Test'}</h3>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <Badge variant="secondary" className="text-[10px]">{attempt.test?.category?.name || 'General'}</Badge>
                        <span className="text-[10px] text-muted-foreground">{formatDate(attempt.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-center">
                        <p className={`text-lg font-bold ${attempt.score >= 70 ? 'text-emerald-600' : attempt.score >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{attempt.score}%</p>
                        <p className="text-[10px] text-muted-foreground">{attempt.correctAnswers}/{attempt.totalQuestions}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">{formatTime(attempt.timeTaken)}</p>
                        <p className="text-[10px] text-muted-foreground">Time</p>
                      </div>
                      {attempt.score >= 90 && <Medal className="w-5 h-5 text-amber-500" />}
                      {attempt.score >= 70 && attempt.score < 90 && <Star className="w-5 h-5 text-blue-500" />}
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
