'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  BookmarkPlus,
  X,
  AlertTriangle,
  Send,
  User,
  RotateCcw,
  Languages,
} from 'lucide-react';

function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

type QuestionStatus = 'not-visited' | 'not-answered' | 'answered' | 'marked' | 'marked-answered';

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

  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [showInstructions, setShowInstructions] = useState(true);

  const questions = currentTest?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  // Visit current question when navigating
  if (currentQuestion && isTestActive && !visited.has(currentQuestion.id)) {
    setVisited((prev) => new Set(prev).add(currentQuestion.id));
  }

  // Derive question statuses from state (no setState in effects!)
  function getStatus(qid: string): QuestionStatus {
    const isVisited = visited.has(qid);
    const isAnswered = qid in answers;
    const isMarked = markedForReview.has(qid);
    if (!isVisited) return 'not-visited';
    if (isMarked && isAnswered) return 'marked-answered';
    if (isMarked) return 'marked';
    if (isAnswered) return 'answered';
    return 'not-answered';
  }

  // Update status when answer changes
  function handleSelectAnswer(questionId: string, option: string) {
    setAnswer(questionId, option);
  }

  function handleMarkForReview() {
    if (!currentQuestion) return;
    setMarkedForReview((prev) => {
      const next = new Set(prev);
      if (next.has(currentQuestion.id)) next.delete(currentQuestion.id);
      else next.add(currentQuestion.id);
      return next;
    });
  }

  function handleClearResponse() {
    if (!currentQuestion) return;
    const newAnswers = { ...answers };
    delete newAnswers[currentQuestion.id];
    useAppStore.setState({ answers: newAnswers });
  }

  function handleSaveAndNext() {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }

  const handleSubmitTest = useCallback(async () => {
    if (!currentTest || !deviceId) return;
    setIsTestActive(false);
    const timeTaken = currentTest.timeLimit - timeRemaining;
    try {
      const res = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, testId: currentTest.id, answers, timeTaken }),
      });
      const data = await res.json();
      if (data.error === 'FREE_LIMIT_REACHED') {
        setShowSubscriptionModal(true);
        setView('home');
        return;
      }
      setLastResult(data);
      setView('results');
    } catch { setView('home'); }
  }, [currentTest, deviceId, answers, timeRemaining, setLastResult, setIsTestActive, setView, setShowSubscriptionModal]);

  // Timer
  useEffect(() => {
    if (!isTestActive || timeRemaining <= 0) return;
    const timer = setInterval(() => { setTimeRemaining(timeRemaining - 1); }, 1000);
    return () => clearInterval(timer);
  }, [isTestActive, timeRemaining, setTimeRemaining]);

  // Auto-submit
  useEffect(() => {
    if (timeRemaining <= 0 && isTestActive) handleSubmitTest();
  }, [timeRemaining, isTestActive, handleSubmitTest]);

  if (!currentTest || !currentQuestion) return null;

  const options = [
    { key: 'A', value: currentQuestion.optionA },
    { key: 'B', value: currentQuestion.optionB },
    { key: 'C', value: currentQuestion.optionC },
    { key: 'D', value: currentQuestion.optionD },
  ];

  const isTimeLow = timeRemaining <= 60;
  const answeredCount = Object.keys(answers).length;
  const markedCount = markedForReview.size;
  const notVisitedCount = questions.filter(q => !visited.has(q.id)).length;
  const notAnsweredCount = questions.filter(q => visited.has(q.id) && !(q.id in answers)).length;

  const paletteColors: Record<QuestionStatus, string> = {
    'not-visited': 'bg-gray-200 text-gray-600',
    'not-answered': 'bg-red-500 text-white',
    'answered': 'bg-green-600 text-white',
    'marked': 'bg-purple-600 text-white',
    'marked-answered': 'bg-purple-500 text-white ring-2 ring-green-400',
  };

  const paletteLabels: Record<QuestionStatus, string> = {
    'not-visited': 'Not Visited',
    'not-answered': 'Not Answered',
    'answered': 'Answered',
    'marked': 'Marked for Review',
    'marked-answered': 'Marked & Answered',
  };

  // Instructions modal
  if (showInstructions) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
        <Card className="border-2 border-blue-200">
          <CardContent className="p-6 md:p-8">
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold text-blue-900">{currentTest.examName}</h1>
              <p className="text-lg text-blue-700 mt-1">{currentTest.title}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 mb-6 space-y-3 text-sm">
              <div className="flex justify-between"><span>Total Questions:</span><span className="font-semibold">{totalQuestions}</span></div>
              <div className="flex justify-between"><span>Time Duration:</span><span className="font-semibold">{formatTime(currentTest.timeLimit)}</span></div>
              <div className="flex justify-between"><span>Difficulty:</span><Badge variant="secondary">{currentTest.difficulty}</Badge></div>
            </div>
            <h3 className="font-semibold text-base mb-3">Instructions:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground mb-6 list-disc pl-5">
              <li>Each question carries equal marks. No negative marking for this test.</li>
              <li>You can navigate between questions using the Question Palette.</li>
              <li>Use <strong>Save &amp; Next</strong> to save your answer and move to next question.</li>
              <li>Use <strong>Mark for Review</strong> to flag a question for later review.</li>
              <li>Use <strong>Clear Response</strong> to remove your selected answer.</li>
              <li>The test will auto-submit when the timer reaches zero.</li>
            </ul>
            <div className="flex items-center justify-center gap-4 text-xs mb-6">
              {(['not-visited', 'not-answered', 'answered', 'marked', 'marked-answered'] as QuestionStatus[]).map((status) => (
                <div key={status} className="flex items-center gap-1.5">
                  <div className={`w-5 h-5 rounded ${paletteColors[status]}`} />
                  <span>{paletteLabels[status]}</span>
                </div>
              ))}
            </div>
            <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base" onClick={() => setShowInstructions(false)}>
              I have read the instructions — Start Test
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* TOP BAR - Government Exam Style */}
      <div className="bg-blue-900 text-white px-3 py-2 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2 min-w-0">
          <Button variant="ghost" size="icon" className="text-white hover:bg-blue-800 h-8 w-8 shrink-0" onClick={() => { if (confirm('Quit test? Your progress will be lost.')) { setIsTestActive(false); clearAnswers(); setMarkedForReview(new Set()); setView('tests'); } }}>
            <X className="w-4 h-4" />
          </Button>
          <div className="min-w-0 hidden sm:block">
            <p className="text-xs text-blue-300 truncate">{currentTest.examName} — {currentTest.category.name}</p>
            <p className="text-sm font-medium truncate">{currentTest.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')} className="flex items-center gap-1 text-xs bg-blue-800 hover:bg-blue-700 px-2.5 py-1.5 rounded-lg transition-colors">
            <Languages className="w-3.5 h-3.5" />
            {language === 'en' ? 'हिंदी' : 'English'}
          </button>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono font-bold text-lg ${isTimeLow ? 'bg-red-600 animate-pulse' : 'bg-blue-800'}`}>
            <Clock className="w-4 h-4" />
            {formatTime(timeRemaining)}
          </div>
          <button className="flex items-center gap-1.5 bg-blue-800 hover:bg-blue-700 px-3 py-1.5 rounded-lg text-xs transition-colors">
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Candidate</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: Question Area */}
        <div className="flex-1 overflow-y-auto p-3 md:p-5">
          <AnimatePresence mode="wait">
            <motion.div key={currentQuestionIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.15 }}>
              <div className="max-w-3xl mx-auto">
                {/* Question Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs">
                      Question {currentQuestionIndex + 1} of {totalQuestions}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Section: {currentQuestion.section || 'General'}
                    </Badge>
                  </div>
                  {markedForReview.has(currentQuestion.id) && (
                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 text-xs">
                      <Flag className="w-3 h-3 mr-1" /> Marked for Review
                    </Badge>
                  )}
                </div>

                {/* Question Text */}
                <div className="bg-white border rounded-xl p-4 md:p-6 mb-4 shadow-sm">
                  <p className="text-base md:text-lg font-medium leading-relaxed">{currentQuestion.question}</p>
                </div>

                {/* Options */}
                <div className="space-y-2.5 mb-6">
                  {options.map((opt) => {
                    const isSelected = answers[currentQuestion.id] === opt.key;
                    return (
                      <motion.button
                        key={opt.key}
                        whileTap={{ scale: 0.995 }}
                        onClick={() => handleSelectAnswer(currentQuestion.id, opt.key)}
                        className={`w-full text-left p-3.5 md:p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/30'
                        }`}
                      >
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold border-2 transition-all ${
                          isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 text-gray-500'
                        }`}>
                          {opt.key}
                        </span>
                        <span className={`pt-1 text-sm md:text-base ${isSelected ? 'font-medium text-blue-900' : 'text-gray-700'}`}>
                          {opt.value}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Action Buttons - Testbook Style */}
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleClearResponse} disabled={!answers[currentQuestion.id]}>
                    <RotateCcw className="w-3.5 h-3.5 mr-1" /> Clear Response
                  </Button>
                  <Button variant="outline" size="sm" className={markedForReview.has(currentQuestion.id) ? 'border-purple-500 text-purple-700 bg-purple-50' : ''} onClick={handleMarkForReview}>
                    <Flag className="w-3.5 h-3.5 mr-1" /> {markedForReview.has(currentQuestion.id) ? 'Unmark' : 'Mark for Review'}
                  </Button>
                  <div className="flex-1" />
                  <Button variant="outline" size="sm" onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))} disabled={currentQuestionIndex === 0}>
                    <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveAndNext} disabled={currentQuestionIndex >= totalQuestions - 1}>
                    Save &amp; Next <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT: Question Palette - Testbook Style */}
        <div className="hidden md:flex flex-col w-72 border-l bg-gray-50 shrink-0">
          <div className="p-3 border-b bg-white">
            <h3 className="font-semibold text-sm text-blue-900">Question Palette</h3>
          </div>

          {/* Palette Grid */}
          <div className="p-3 flex-1 overflow-y-auto">
            <div className="grid grid-cols-5 gap-1.5 mb-4">
              {questions.map((q, i) => {
                const status = getStatus(q.id);
                const isCurrent = i === currentQuestionIndex;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(i)}
                    className={`w-10 h-10 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                      paletteColors[status]
                    } ${isCurrent ? 'ring-2 ring-blue-400 ring-offset-1 scale-105' : 'hover:scale-105'}`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="space-y-1.5 text-xs">
              {(['not-visited', 'not-answered', 'answered', 'marked', 'marked-answered'] as QuestionStatus[]).map((status) => (
                <div key={status} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${paletteColors[status]}`} />
                  <span>{paletteLabels[status]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats + Submit */}
          <div className="p-3 border-t bg-white space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-green-50 rounded-lg p-2 text-center">
                <p className="font-bold text-green-700 text-base">{answeredCount}</p>
                <p className="text-green-600">Answered</p>
              </div>
              <div className="bg-red-50 rounded-lg p-2 text-center">
                <p className="font-bold text-red-700 text-base">{notAnsweredCount}</p>
                <p className="text-red-600">Not Answered</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-2 text-center">
                <p className="font-bold text-purple-700 text-base">{markedCount}</p>
                <p className="text-purple-600">Marked</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-2 text-center">
                <p className="font-bold text-gray-700 text-base">{notVisitedCount}</p>
                <p className="text-gray-500">Not Visited</p>
              </div>
            </div>
            <Button className="w-full bg-red-600 hover:bg-red-700 h-10 font-semibold" onClick={() => setShowConfirmSubmit(true)}>
              <Send className="w-4 h-4 mr-1.5" /> Submit Test
            </Button>
          </div>
        </div>
      </div>

      {/* MOBILE: Bottom bar with palette toggle and submit */}
      <div className="md:hidden border-t bg-white p-2 shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => setShowProfilePanel(!showProfilePanel)}>
            <BookmarkPlus className="w-3.5 h-3.5 mr-1" /> Palette
          </Button>
          <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={handleMarkForReview}>
            <Flag className="w-3.5 h-3.5 mr-1" /> {markedForReview.has(currentQuestion.id) ? 'Unmark' : 'Mark'}
          </Button>
          <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs" onClick={handleSaveAndNext}>
            Save &amp; Next
          </Button>
          <Button size="sm" className="flex-1 bg-red-600 hover:bg-red-700 text-xs" onClick={() => setShowConfirmSubmit(true)}>
            Submit
          </Button>
        </div>

        {/* Mobile Palette */}
        <AnimatePresence>
          {showProfilePanel && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t mt-2">
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold">Question Palette</span>
                  <button onClick={() => setShowProfilePanel(false)}><X className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-8 gap-1 mb-3">
                  {questions.map((q, i) => {
                    const status = getStatus(q.id);
                    const isCurrent = i === currentQuestionIndex;
                    return (
                      <button key={q.id} onClick={() => { setCurrentQuestionIndex(i); setShowProfilePanel(false); }}
                        className={`w-8 h-8 rounded text-xs font-bold flex items-center justify-center ${paletteColors[status]} ${isCurrent ? 'ring-2 ring-blue-400' : ''}`}>
                        {i + 1}
                      </button>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-3 text-[10px]">
                  {(['not-visited', 'not-answered', 'answered', 'marked'] as QuestionStatus[]).map((s) => (
                    <div key={s} className="flex items-center gap-1">
                      <div className={`w-3 h-3 rounded ${paletteColors[s]}`} />
                      <span>{paletteLabels[s]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Submit Confirmation */}
      <AnimatePresence>
        {showConfirmSubmit && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowConfirmSubmit(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-center mb-2">Submit Test?</h3>
              <div className="bg-gray-50 rounded-xl p-3 mb-4 space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Answered:</span><span className="font-semibold text-green-700">{answeredCount}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Not Answered:</span><span className="font-semibold text-red-700">{totalQuestions - answeredCount}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Marked for Review:</span><span className="font-semibold text-purple-700">{markedCount}</span></div>
              </div>
              {totalQuestions - answeredCount > 0 && (
                <p className="text-sm text-amber-600 text-center mb-4 font-medium">⚠️ {totalQuestions - answeredCount} questions are unanswered!</p>
              )}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowConfirmSubmit(false)}>Go Back</Button>
                <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={() => { setShowConfirmSubmit(false); handleSubmitTest(); }}>Submit Now</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
