'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  Check,
  AlertTriangle,
} from 'lucide-react';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function TestTakingPage() {
  const {
    currentTest,
    answers,
    setAnswer,
    timeRemaining,
    setTimeRemaining,
    isTestActive,
    setIsTestActive,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    deviceId,
    setView,
    setLastResult,
    clearAnswers,
    setShowSubscriptionModal,
  } = useAppStore();

  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  const questions = currentTest?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;

  const handleSubmitTest = useCallback(async () => {
    if (!currentTest || !deviceId) return;

    setIsTestActive(false);
    const timeTaken = currentTest.timeLimit - timeRemaining;

    try {
      const res = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId,
          testId: currentTest.id,
          answers,
          timeTaken,
        }),
      });

      const data = await res.json();

      if (data.error === 'FREE_LIMIT_REACHED') {
        setShowSubscriptionModal(true);
        setView('home');
        return;
      }

      setLastResult(data);
      setView('results');
    } catch {
      setView('home');
    }
  }, [currentTest, deviceId, answers, timeRemaining, setLastResult, setIsTestActive, setView, setShowSubscriptionModal]);

  // Timer
  useEffect(() => {
    if (!isTestActive || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(timeRemaining - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isTestActive, timeRemaining, setTimeRemaining]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeRemaining <= 0 && isTestActive) {
      handleSubmitTest();
    }
  }, [timeRemaining, isTestActive, handleSubmitTest]);

  // Keyboard navigation
  useEffect(() => {
    if (!isTestActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'n') {
        setCurrentQuestionIndex(Math.min(currentQuestionIndex + 1, totalQuestions - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'p') {
        setCurrentQuestionIndex(Math.max(currentQuestionIndex - 1, 0));
      } else if (e.key === '1') setAnswer(currentQuestion.id, 'A');
      else if (e.key === '2') setAnswer(currentQuestion.id, 'B');
      else if (e.key === '3') setAnswer(currentQuestion.id, 'C');
      else if (e.key === '4') setAnswer(currentQuestion.id, 'D');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTestActive, currentQuestionIndex, totalQuestions, currentQuestion, setAnswer, setCurrentQuestionIndex]);

  if (!currentTest || !currentQuestion) return null;

  const options = [
    { key: 'A', value: currentQuestion.optionA },
    { key: 'B', value: currentQuestion.optionB },
    { key: 'C', value: currentQuestion.optionC },
    { key: 'D', value: currentQuestion.optionD },
  ];

  const isTimeLow = timeRemaining <= 60;
  const progressPercent = (answeredCount / totalQuestions) * 100;

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b pb-3 pt-1">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const confirmed = window.confirm('Are you sure? Your progress will be lost.');
                if (confirmed) {
                  setIsTestActive(false);
                  clearAnswers();
                  setView('tests');
                }
              }}
              className="shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="font-semibold text-sm md:text-base truncate">{currentTest.title}</h1>
              <p className="text-xs text-muted-foreground">{currentTest.category.name}</p>
            </div>
          </div>
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg shrink-0 ${
              isTimeLow ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-muted'
            }`}
          >
            <Clock className={`w-4 h-4 ${isTimeLow ? 'text-red-600' : ''}`} />
            <span className={`font-mono font-bold ${isTimeLow ? 'text-red-600' : ''}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <Progress value={progressPercent} className="h-2 flex-1" />
          <span className="text-xs text-muted-foreground shrink-0">
            {answeredCount}/{totalQuestions}
          </span>
        </div>
      </div>

      {/* Question Navigation Dots (mobile) */}
      <div className="flex flex-wrap gap-1.5 md:hidden justify-center">
        {questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => setCurrentQuestionIndex(i)}
            className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center transition-all ${
              i === currentQuestionIndex
                ? 'bg-emerald-600 text-white scale-110'
                : answers[q.id]
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Question Card */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Question Number Grid (desktop) */}
        <div className="hidden md:block shrink-0">
          <Card className="p-3">
            <h3 className="text-xs font-semibold text-muted-foreground mb-2">Questions</h3>
            <div className="grid grid-cols-5 gap-1.5">
              {questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(i)}
                  className={`w-9 h-9 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                    i === currentQuestionIndex
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                      : answers[q.id]
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Question Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1"
          >
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </Badge>
                  {answers[currentQuestion.id] && (
                    <Badge className="bg-emerald-100 text-emerald-700">
                      <Check className="w-3 h-3 mr-1" />
                      Answered
                    </Badge>
                  )}
                </div>

                <h2 className="text-lg md:text-xl font-semibold mb-6 leading-relaxed">
                  {currentQuestion.question}
                </h2>

                <div className="space-y-3">
                  {options.map((opt) => {
                    const isSelected = answers[currentQuestion.id] === opt.key;
                    return (
                      <motion.button
                        key={opt.key}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setAnswer(currentQuestion.id, opt.key)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-start gap-3 ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-muted hover:border-emerald-200 hover:bg-emerald-50/50'
                        }`}
                      >
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold transition-all ${
                            isSelected
                              ? 'bg-emerald-600 text-white'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {opt.key}
                        </span>
                        <span className={`pt-0.5 ${isSelected ? 'font-medium text-emerald-800' : ''}`}>
                          {opt.value}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {answeredCount === totalQuestions && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="hidden sm:block"
            >
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setShowConfirmSubmit(true)}
              >
                <Flag className="w-4 h-4 mr-1" />
                Submit Test
              </Button>
            </motion.div>
          )}
        </div>

        {currentQuestionIndex < totalQuestions - 1 ? (
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 sm:hidden"
            onClick={() => setShowConfirmSubmit(true)}
          >
            <Flag className="w-4 h-4 mr-1" />
            Submit
          </Button>
        )}
      </div>

      {/* Submit Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmSubmit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowConfirmSubmit(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-2xl p-6 max-w-sm w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Submit Test?</h3>
                <p className="text-muted-foreground mb-4">
                  You&apos;ve answered {answeredCount} out of {totalQuestions} questions.
                  {answeredCount < totalQuestions && (
                    <span className="block mt-1 text-amber-600 font-medium">
                      {totalQuestions - answeredCount} questions are unanswered!
                    </span>
                  )}
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowConfirmSubmit(false)}
                  >
                    Continue
                  </Button>
                  <Button
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    onClick={handleSubmitTest}
                  >
                    Submit Now
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
