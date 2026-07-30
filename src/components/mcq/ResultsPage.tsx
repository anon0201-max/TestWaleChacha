'use client';

import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Trophy, ArrowLeft, Clock, CheckCircle2, XCircle, RotateCcw, Home,
  Star, Target, Zap, Crown, Medal, Award, TrendingUp, Users, Play, Loader2,
} from 'lucide-react';

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds) || seconds < 0) return '0:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function ResultsPage() {
  const { lastResult, setView, clearAnswers, currentTest, freeTestsRemaining, isSubscribed, user, setCurrentTest, setIsTestActive, setCurrentQuestionIndex, setTimeRemaining } = useAppStore();
  const [rankings, setRankings] = useState<Array<{ studentId: string; studentName: string; score: number; timeTaken: number; rank: number }>>([]);
  const [loadingRankings, setLoadingRankings] = useState(true);
  const [reattemptLoading, setReattemptLoading] = useState(false);

  // Fetch rankings when results load
  useEffect(() => {
    if (!lastResult || !currentTest) return;
    let cancelled = false;
    fetch(`/api/attempts?rankings=true&testId=${currentTest.id}`)
      .then(r => r.ok ? r.json() : { rankings: [] })
      .then(data => { if (!cancelled) setRankings(data.rankings || []); })
      .catch(() => { if (!cancelled) setRankings([]); })
      .finally(() => { if (!cancelled) setLoadingRankings(false); });
    return () => { cancelled = true; };
  }, [lastResult, currentTest]);

  // Redirect to home if no result/test data (useEffect-based to avoid setState during render)
  useEffect(() => {
    if (!lastResult || !currentTest) {
      setView('home');
    }
  }, [lastResult, currentTest, setView]);

  if (!lastResult || !currentTest) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  const { score, correctAnswers, totalQuestions, answerDetails, timeTaken } = lastResult;
  const percentage = score;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const myRank = rankings.find(r => r.studentId === user?.id);

  const getGrade = () => {
    if (percentage >= 90) return { label: 'Excellent!', emoji: '🏆', color: 'text-emerald-600', gradient: 'from-emerald-500 via-teal-500 to-cyan-600' };
    if (percentage >= 70) return { label: 'Great Job!', emoji: '⭐', color: 'text-blue-600', gradient: 'from-blue-500 via-blue-600 to-indigo-600' };
    if (percentage >= 50) return { label: 'Good Try!', emoji: '👍', color: 'text-amber-600', gradient: 'from-amber-500 via-orange-500 to-red-500' };
    return { label: 'Keep Practicing!', emoji: '💪', color: 'text-red-600', gradient: 'from-red-500 via-orange-500 to-amber-500' };
  };

  const grade = getGrade();

  async function handleReAttempt() {
    if (!currentTest || reattemptLoading) return;
    setReattemptLoading(true);
    try {
      const res = await fetch(`/api/tests/${currentTest.id}?testId=${currentTest.id}`);
      let timeLimit = currentTest.timeLimit;
      if (res.ok) {
        const testData = await res.json();
        setCurrentTest(testData);
        timeLimit = testData.timeLimit;
      }
      clearAnswers();
      setCurrentQuestionIndex(0);
      setTimeRemaining(timeLimit);
      setIsTestActive(true);
      useAppStore.getState().setView('test-taking');
    } catch {
      setReattemptLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Score Header */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className={`bg-gradient-to-br ${grade.gradient} px-4 py-6 sm:p-8 text-white`}>
            <div className="flex flex-col items-center text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
                <span className="text-5xl sm:text-6xl mb-3 block">{grade.emoji}</span>
              </motion.div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">{grade.label}</h1>
              <p className="text-white/80 mb-4 text-sm sm:text-base max-w-md truncate px-2">{currentTest.title}</p>
              <div className="flex items-center justify-center gap-4 sm:gap-6 w-full">
                <div className="flex-1 text-center">
                  <div className="text-2xl sm:text-4xl font-bold">{percentage}%</div>
                  <div className="text-xs sm:text-sm text-white/70">Score</div>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div className="flex-1 text-center">
                  <div className="text-2xl sm:text-4xl font-bold">{correctAnswers}/{totalQuestions}</div>
                  <div className="text-xs sm:text-sm text-white/70">Correct</div>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div className="flex-1 text-center">
                  <div className="text-2xl sm:text-4xl font-bold">{formatTime(timeTaken)}</div>
                  <div className="text-xs sm:text-sm text-white/70">Time</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Ranking Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-amber-900">Your Ranking</h3>
              {myRank && (
                <Badge className="bg-amber-600 text-white ml-auto">
                  <Award className="w-3 h-3 mr-1" /> Rank #{myRank.rank} of {rankings.length}
                </Badge>
              )}
            </div>
          </div>
          <CardContent className="p-4">
            {loadingRankings ? (
              <div className="flex items-center justify-center py-6">
                <div className="w-6 h-6 border-2 border-amber-300 border-t-amber-600 rounded-full animate-spin" />
                <span className="ml-2 text-sm text-muted-foreground">Loading rankings...</span>
              </div>
            ) : rankings.length > 0 ? (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {rankings.slice(0, 10).map((r) => {
                  const isMe = r.studentId === user?.id;
                  return (
                    <div key={r.rank} className={`flex items-center justify-between p-2.5 rounded-lg ${isMe ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          r.rank === 1 ? 'bg-amber-400 text-amber-900' : r.rank === 2 ? 'bg-gray-300 text-gray-700' : r.rank === 3 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {r.rank <= 3 ? ['🥇', '🥈', '🥉'][r.rank - 1] : `#${r.rank}`}
                        </div>
                        <p className={`font-medium text-sm truncate ${isMe ? 'text-blue-700' : 'text-gray-800'}`}>{r.studentName}{isMe ? ' (You)' : ''}</p>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-muted-foreground shrink-0 ml-2">
                        <span className="font-bold text-foreground">{r.score}%</span>
                        <span className="tabular-nums">{formatTime(r.timeTaken)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No rankings yet. Be the first to attempt this test!</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Target, label: 'Accuracy', value: `${percentage}%`, color: 'text-emerald-600 bg-emerald-50' },
          { icon: CheckCircle2, label: 'Correct', value: correctAnswers, color: 'text-green-600 bg-green-50' },
          { icon: XCircle, label: 'Incorrect', value: incorrectAnswers, color: 'text-red-600 bg-red-50' },
          { icon: Clock, label: 'Time Taken', value: formatTime(timeTaken), color: 'text-amber-600 bg-amber-50' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${stat.color}`}><stat.icon className="w-5 h-5" /></div>
                <div>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Detailed Answers */}
      {Array.isArray(answerDetails) && answerDetails.length > 0 && (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <h2 className="text-xl font-bold mb-4">Answer Review</h2>
        <div className="space-y-3">
          {answerDetails.map((detail, i) => {
            const question = currentTest.questions?.find((q) => q.id === detail.questionId);
            if (!question) return null;
            const optionMap: Record<string, string> = { A: question.optionA, B: question.optionB, C: question.optionC, D: question.optionD };
            return (
              <motion.div key={detail.questionId} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.03 }}>
                <Card className={`border-0 shadow-sm ${detail.isCorrect ? '' : 'ring-1 ring-red-200'}`}>
                  <CardContent className="p-4 md:p-5">
                    <div className="flex items-start gap-3">
                      <div className={`shrink-0 mt-0.5 ${detail.isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
                        {detail.isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm mb-2">Q{i + 1}. {question.question}</p>
                        <div className="space-y-1.5">
                          {!detail.isCorrect && detail.userAnswer && (
                            <div className="flex items-start gap-2 text-sm">
                              <Badge variant="destructive" className="shrink-0 text-xs">Your Answer</Badge>
                              <span className="text-red-700 font-medium">{detail.userAnswer}. {optionMap[detail.userAnswer] || 'Not Answered'}</span>
                            </div>
                          )}
                          <div className="flex items-start gap-2 text-sm">
                            <Badge className="bg-emerald-100 text-emerald-700 shrink-0 text-xs">Correct</Badge>
                            <span className="text-emerald-700 font-medium">{detail.correctOption}. {optionMap[detail.correctOption]}</span>
                          </div>
                          {question.explanation && (
                            <p className="text-xs text-muted-foreground mt-2 pl-3 border-l-2 border-blue-200">
                              💡 {question.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      )}

      {/* Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="outline" size="lg" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800" onClick={handleReAttempt} disabled={reattemptLoading}>
          {reattemptLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Starting...</> : <><RotateCcw className="w-4 h-4 mr-2" />Re-attempt This Test</>}
        </Button>
        <Button variant="outline" size="lg" onClick={() => { clearAnswers(); setView('tests'); }}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Take Another Test
        </Button>
        <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => { clearAnswers(); setView('home'); }}>
          <Home className="w-4 h-4 mr-2" /> Back to Home
        </Button>
      </motion.div>

      {!isSubscribed && freeTestsRemaining > 0 && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            {freeTestsRemaining} free test{freeTestsRemaining !== 1 ? 's' : ''} remaining
          </p>
        </div>
      )}
    </div>
  );
}
