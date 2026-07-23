'use client';

import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap,
  Trophy,
  Zap,
  ArrowRight,
  Star,
  CheckCircle2,
  Crown,
  BookOpen,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

export function HomePage() {
  const { setView, categories, freeTestsRemaining, isSubscribed } = useAppStore();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 p-8 md:p-16 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 border-0">
              <Zap className="w-3 h-3 mr-1" />
              Free 5 Tests | Then ₹100 for Unlimited
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Master Any Exam with <br />
              <span className="text-yellow-300">MCQ Practice Tests</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-lg">
              Practice thousands of MCQ questions across 8+ categories. Track your progress,
              compete with others, and ace your exams!
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-white text-emerald-700 hover:bg-white/90 font-semibold text-lg px-8 h-12"
                onClick={() => setView('tests')}
              >
                Start Practicing
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              {isSubscribed ? (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 font-semibold"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Pro Member
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 font-semibold"
                >
                  {freeTestsRemaining} Free Tests Left
                </Button>
              )}
            </div>
          </motion.div>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="text-8xl opacity-20"
          >
            🎯
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: GraduationCap, label: 'Categories', value: categories.length || 8, color: 'text-emerald-600 bg-emerald-50' },
          { icon: BookOpen, label: 'Practice Tests', value: '17+', color: 'text-amber-600 bg-amber-50' },
          { icon: Trophy, label: 'Questions', value: '170+', color: 'text-purple-600 bg-purple-50' },
          { icon: Star, label: 'Free Tests', value: freeTestsRemaining, color: 'text-rose-600 bg-rose-50' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 md:p-6 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Browse by Category</h2>
            <p className="text-muted-foreground">Choose your subject and start practicing</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setView('tests')}
            className="hidden sm:flex"
          >
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                useAppStore.getState().setSelectedCategory(cat.id);
                setView('tests');
              }}
              className="group text-left"
            >
              <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden">
                <div
                  className="h-2"
                  style={{ backgroundColor: cat.color }}
                />
                <CardContent className="p-4 md:p-6">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                    style={{ backgroundColor: cat.color + '20', color: cat.color }}
                  >
                    <span className="text-xl font-bold">{cat.name.charAt(0)}</span>
                  </div>
                  <h3 className="font-semibold text-sm md:text-base group-hover:text-emerald-600 transition-colors truncate">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {cat._count.tests} tests available
                  </p>
                </CardContent>
              </Card>
            </motion.button>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section>
        <h2 className="text-2xl font-bold mb-6">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: '1',
              icon: BookOpen,
              title: 'Choose a Test',
              desc: 'Browse from 8+ categories and pick a test that suits you.',
            },
            {
              step: '2',
              icon: CheckCircle2,
              title: 'Answer Questions',
              desc: 'Attempt MCQs with a timer. Think fast and answer accurately.',
            },
            {
              step: '3',
              icon: Trophy,
              title: 'Get Results',
              desc: 'See your score, correct answers, and explanations instantly.',
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <Card className="border-0 shadow-sm h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {item.step}
                  </div>
                  <item.icon className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing CTA */}
      {!isSubscribed && (
        <section className="rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 p-8 text-center">
          <Crown className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Unlock Unlimited Tests</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            You have {freeTestsRemaining} free tests remaining. Get unlimited access to all 170+ questions
            across all categories for just ₹100!
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-lg px-8"
            onClick={() => useAppStore.getState().setShowSubscriptionModal(true)}
          >
            Subscribe for ₹100
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </section>
      )}
    </div>
  );
}
