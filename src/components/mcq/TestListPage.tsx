'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  Search,
  Clock,
  BookOpen,
  ArrowLeft,
  Play,
  Filter,
  X,
  Sparkles,
  Lock,
  Zap,
} from 'lucide-react';

export function TestListPage() {
  const {
    setView,
    tests,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    setCurrentTest,
    setIsTestActive,
    clearAnswers,
    setCurrentQuestionIndex,
    setTimeRemaining,
    freeTestsRemaining,
    isSubscribed,
    setView: setAppView,
  } = useAppStore();

  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredTests = useMemo(() => {
    let result = tests;
    if (selectedCategory) {
      result = result.filter((t) => t.categoryId === selectedCategory);
    }
    if (difficultyFilter) {
      result = result.filter((t) => t.difficulty === difficultyFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [tests, selectedCategory, difficultyFilter, searchQuery]);

  const selectedCategoryName = categories.find((c) => c.id === selectedCategory)?.name;

  async function handleStartTest(test: (typeof tests)[0]) {
    try {
      const res = await fetch(`/api/tests/${test.id}?testId=${test.id}`);
      if (res.ok) {
        const fullTest = await res.json();
        setCurrentTest(fullTest);
      } else {
        setCurrentTest(test);
      }
    } catch {
      setCurrentTest(test);
    }
    clearAnswers();
    setCurrentQuestionIndex(0);
    setTimeRemaining(test.timeLimit);
    setIsTestActive(true);
    setAppView('test-taking');
  }

  function handleStartTestClick(test: (typeof tests)[0]) {
    if (!isSubscribed && freeTestsRemaining <= 0) {
      useAppStore.getState().setShowSubscriptionModal(true);
      return;
    }
    handleStartTest(test);
  }

  const difficultyColors = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-amber-100 text-amber-700',
    hard: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setView('home')} className="shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {selectedCategoryName || 'All Tests'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {filteredTests.length} tests available
              {!isSubscribed && (
                <span className="ml-2">
                  <Badge variant="secondary" className="text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    {freeTestsRemaining} free tests left
                  </Badge>
                </span>
              )}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="shrink-0"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search tests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4"
          >
            {/* Category filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All Categories
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                >
                  {cat.name}
                  <span className="ml-1 text-xs opacity-70">({cat._count.tests})</span>
                </Button>
              ))}
            </div>

            {/* Difficulty filters */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground self-center mr-2">Difficulty:</span>
              {['easy', 'medium', 'hard'].map((d) => (
                <Button
                  key={d}
                  variant={difficultyFilter === d ? 'default' : 'outline'}
                  size="sm"
                  className={difficultyFilter === d ? difficultyColors[d as keyof typeof difficultyColors] : ''}
                  onClick={() => setDifficultyFilter(difficultyFilter === d ? null : d)}
                >
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Test Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTests.map((test, i) => (
          <motion.div
            key={test.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.03, 0.3) }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-200 group border-0 shadow-sm">
              <CardContent className="p-5 flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
                  <Badge
                    variant="secondary"
                    className={difficultyColors[test.difficulty as keyof typeof difficultyColors]}
                  >
                    {test.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    {Math.floor(test.timeLimit / 60)}min
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-emerald-600 transition-colors leading-tight">
                  {test.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                  {test.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <BookOpen className="w-4 h-4" />
                    {test.totalQuestions || test._count?.questions || test.questions?.length} Questions
                  </div>
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => handleStartTestClick(test)}
                  >
                    {!isSubscribed && freeTestsRemaining <= 0 ? (
                      <>
                        <Lock className="w-4 h-4 mr-1" />
                        Unlock
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-1" />
                        Start
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredTests.length === 0 && (
        <div className="text-center py-16">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No tests found</h3>
          <p className="text-muted-foreground mt-2">Try changing your search or filters</p>
          <Button variant="outline" className="mt-4" onClick={() => { setSelectedCategory(null); setDifficultyFilter(null); setSearchQuery(''); }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
