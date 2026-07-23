'use client';

import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import {
  Trophy,
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Home,
  Star,
  Target,
  Zap,
  Crown,
} from 'lucide-react';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function ResultsPage() {
  const { lastResult, setView, clearAnswers, currentTest, freeTestsRemaining, isSubscribed } = useAppStore();

  if (!lastResult || !currentTest) {
    setView('home');
    return null;
  }

  const { score, correctAnswers, totalQuestions, answerDetails, timeTaken } = lastResult;
  const percentage = score;
  const incorrectAnswers = totalQuestions - correctAnswers;

  const getGrade = () => {
    if (percentage >= 90) return { label: 'Excellent!', emoji: '🏆', color: 'text-emerald-600' };
    if (percentage >= 70) return { label: 'Great Job!', emoji: '⭐', color: 'text-blue-600' };
    if (percentage >= 50) return { label: 'Good Try!', emoji: '👍', color: 'text-amber-600' };
    return { label: 'Keep Practicing!', emoji: '💪', color: 'text-red-600' };
  };

  const grade = getGrade();

  return (
    <div className="space-y-6">
      {/* Score Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 p-8 text-white">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <span className="text-6xl mb-4 block">{grade.emoji}</span>
            </motion.div>
            <h1 className={`text-3xl font-bold mb-2 ${grade.color}`}>
              {grade.label}
            </h1>
            <p className="text-white/80 mb-4">{currentTest.title}</p>
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold">{percentage}%</div>
                <div className="text-sm text-white/70">Score</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="text-4xl font-bold">{correctAnswers}/{totalQuestions}</div>
                <div className="text-sm text-white/70">Correct</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="text-4xl font-bold">{formatTime(timeTaken)}</div>
                <div className="text-sm text-white/70">Time</div>
              </div>
            </div>
          </div>
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
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xl font-bold mb-4">Answer Review</h2>
        <div className="space-y-3">
          {answerDetails.map((detail, i) => {
            const question = currentTest.questions.find((q) => q.id === detail.questionId);
            if (!question) return null;

            const optionMap: Record<string, string> = {
              A: question.optionA,
              B: question.optionB,
              C: question.optionC,
              D: question.optionD,
            };

            return (
              <motion.div
                key={detail.questionId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.03 }}
              >
                <Card className={`border-0 shadow-sm ${detail.isCorrect ? '' : 'ring-1 ring-red-200'}`}>
                  <CardContent className="p-4 md:p-5">
                    <div className="flex items-start gap-3">
                      <div className={`shrink-0 mt-0.5 ${detail.isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
                        {detail.isCorrect ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <XCircle className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm mb-2">
                          Q{i + 1}. {question.question}
                        </p>
                        <div className="space-y-1.5">
                          {!detail.isCorrect && detail.userAnswer && (
                            <div className="flex items-start gap-2 text-sm">
                              <Badge variant="destructive" className="shrink-0 text-xs">Your Answer</Badge>
                              <span className="text-red-700 font-medium">
                                {detail.userAnswer}. {optionMap[detail.userAnswer] || 'Not Answered'}
                              </span>
                            </div>
                          )}
                          <div className="flex items-start gap-2 text-sm">
                            <Badge className="bg-emerald-100 text-emerald-700 shrink-0 text-xs">Correct</Badge>
                            <span className="text-emerald-700 font-medium">
                              {detail.correctOption}. {optionMap[detail.correctOption]}
                            </span>
                          </div>
                          {!detail.isCorrect && question.explanation && (
                            <p className="text-xs text-muted-foreground mt-2 pl-0 border-l-2 border-muted pl-3">
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

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-3 justify-center"
      >
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            clearAnswers();
            setView('tests');
          }}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Take Another Test
        </Button>
        <Button
          size="lg"
          className="bg-emerald-600 hover:bg-emerald-700"
          onClick={() => {
            clearAnswers();
            setView('home');
          }}
        >
          <Home className="w-4 h-4 mr-2" />
          Back to Home
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
