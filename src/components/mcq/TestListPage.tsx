'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAppStore, handleSubscribeClick } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Clock, BookOpen, ArrowLeft, Play, Filter, X, Lock, Zap, RotateCcw, Crown, Target, Users, ChevronRight } from 'lucide-react';

export function TestListPage() {
  const {
    setView, tests, categories, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery,
    setCurrentTest, setIsTestActive, clearAnswers, setCurrentQuestionIndex, setTimeRemaining,
    freeTestsRemaining, isSubscribed, user, isLoggedIn, setShowAuthModal, setPendingTestId,
  } = useAppStore();

  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [attemptedTestIds, setAttemptedTestIds] = useState<Set<string>>(new Set());

  const filteredTests = useMemo(() => {
    let result = tests;
    if (selectedCategory) result = result.filter((t) => t.categoryId === selectedCategory);
    if (difficultyFilter) result = result.filter((t) => t.difficulty === difficultyFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    return result;
  }, [tests, selectedCategory, difficultyFilter, searchQuery]);

  const selectedCategoryName = categories.find((c) => c.id === selectedCategory)?.name;

  // Fetch user's attempted test IDs
  useEffect(() => {
    if (!isLoggedIn || !user?.id) return;
    let cancelled = false;
    fetch(`/api/attempts?studentId=${user.id}`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (!cancelled) {
          const ids = new Set((data || []).map((a: { testId: string }) => a.testId));
          setAttemptedTestIds(ids);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [isLoggedIn, user?.id]);

  function isTestLocked(test: (typeof tests)[0]) {
    // Subscribed users: everything unlocked
    if (isSubscribed) return false;
    // Test has isLocked flag set by admin → locked for non-subscribed
    if (test.isLocked) return true;
    // Not logged in: locked
    if (!isLoggedIn) return true;
    // Free user with no remaining tests: locked
    if (freeTestsRemaining <= 0) return true;
    // Default: unlocked (admin can set isLocked to control per-test)
    return false;
  }

  async function handleStartTest(test: (typeof tests)[0]) {
    try {
      const res = await fetch(`/api/tests/${test.id}?testId=${test.id}`);
      if (res.ok) setCurrentTest(await res.json());
      else setCurrentTest(test);
    } catch { setCurrentTest(test); }
    clearAnswers();
    setCurrentQuestionIndex(0);
    setTimeRemaining(test.timeLimit);
    setIsTestActive(true);
    useAppStore.getState().setView('test-taking');
  }

  function handleClick(test: (typeof tests)[0]) {
    // Login gate: if not logged in, show auth modal and track pending test
    if (!isLoggedIn) {
      setPendingTestId(test.id);
      setShowAuthModal('signup');
      return;
    }
    // Test is locked (admin marked as locked or free tests exhausted)
    if (isTestLocked(test)) {
      handleSubscribeClick();
      return;
    }
    handleStartTest(test);
  }

  const diffColors = { easy: 'bg-green-100 text-green-700', medium: 'bg-amber-100 text-amber-700', hard: 'bg-red-100 text-red-700' };

  const totalQuestions = filteredTests.reduce((s, t) => s + (t._count?.questions || t.totalQuestions || 0), 0);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Button variant="ghost" size="icon" onClick={() => setView('home')}><ArrowLeft className="w-5 h-5" /></Button>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold truncate">{selectedCategoryName || 'All Mock Tests'}</h1>
            <p className="text-[11px] text-muted-foreground">
              {filteredTests.length} Test Series · {totalQuestions} Total Questions
              {isLoggedIn && !isSubscribed && (
                <Badge variant="secondary" className="ml-1.5 text-[10px]">
                  <Zap className="w-2.5 h-2.5 mr-0.5" />{freeTestsRemaining} free
                </Badge>
              )}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="shrink-0">
          <Filter className="w-3.5 h-3.5 sm:mr-1" /><span className="hidden sm:inline">Filters</span>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search tests..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-10" />
        {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-muted-foreground" /></button>}
      </div>

      {showFilters && (
        <div className="space-y-3 animate-slide-down">
          <div className="flex flex-wrap gap-1.5">
            <Button variant={selectedCategory === null ? 'default' : 'outline'} size="sm" className="text-xs h-7" onClick={() => setSelectedCategory(null)}>All</Button>
            {categories.map((cat) => (
              <Button key={cat.id || cat._id || cat.name} variant={selectedCategory === (cat.id || cat._id) ? 'default' : 'outline'} size="sm" className="text-xs h-7" onClick={() => setSelectedCategory(selectedCategory === (cat.id || cat._id) ? null : (cat.id || cat._id))}>
                {cat.name || 'Unknown'}<span className="ml-1 opacity-60">({cat._count?.tests || 0})</span>
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-xs text-muted-foreground mr-1">Level:</span>
            {['easy', 'medium', 'hard'].map((d) => (
              <Button key={d} variant={difficultyFilter === d ? 'default' : 'outline'} size="sm" className={`text-xs h-7 ${difficultyFilter === d ? diffColors[d as keyof typeof diffColors] : ''}`} onClick={() => setDifficultyFilter(difficultyFilter === d ? null : d)}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Test Cards - Testbook Style */}
      <div className="space-y-3">
        {filteredTests.map((test) => (
          <div key={test.id || test._id || test.title} className="animate-fade-in card-hover-transform">
            <Card className="hover:shadow-md transition-all border-0 shadow-sm relative">
              {/* Lock overlay for locked tests */}
              {isTestLocked(test) && (
                <div className="absolute top-3 right-3 z-10">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <Crown className="w-4 h-4 text-amber-600" />
                  </div>
                </div>
              )}
              {!isLoggedIn && (
                <div className="absolute top-3 right-3 z-10">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              )}
              <CardContent className="p-4 md:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                      <Badge variant="secondary" className="text-[10px]">{test.category?.name || test.examType || 'General'}</Badge>
                      <Badge className={diffColors[test.difficulty as keyof typeof diffColors] + ' text-[10px]'}>{test.difficulty || 'medium'}</Badge>
                      {test.isLocked && (
                        <Badge className="text-[10px] bg-amber-100 text-amber-700 border-0">
                          <Lock className="w-2.5 h-2.5 mr-0.5" />PRO Only
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm md:text-base truncate">{test.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{test.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{test._count?.questions || test.totalQuestions || 0} Qs</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{Math.floor(test.timeLimit / 60)} min</span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {isTestLocked(test) ? (
                      <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 w-full sm:w-auto text-white" onClick={() => handleClick(test)}>
                        <Crown className="w-4 h-4 mr-1" />Subscribe to Unlock
                      </Button>
                    ) : !isLoggedIn ? (
                      <Button size="sm" className="bg-gray-500 hover:bg-gray-600 w-full sm:w-auto" onClick={() => handleClick(test)}>
                        <Lock className="w-4 h-4 mr-1" />Login to attempt
                      </Button>
                    ) : attemptedTestIds.has(test.id) ? (
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button size="sm" variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 flex-1" onClick={() => handleClick(test)}>
                          <RotateCcw className="w-4 h-4 mr-1" />Re-attempt
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto" onClick={() => handleClick(test)}>
                        <Play className="w-4 h-4 mr-1" />Start Test
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {filteredTests.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium">No tests found</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => { setSelectedCategory(null); setDifficultyFilter(null); setSearchQuery(''); }}>Clear Filters</Button>
        </div>
      )}
    </div>
  );
}
