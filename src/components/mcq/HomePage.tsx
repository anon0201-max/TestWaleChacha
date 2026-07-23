'use client';

import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  GraduationCap, Trophy, Zap, ArrowRight, BookOpen, Shield, Crown, Star, BarChart3, Users, Clock, Lock,
} from 'lucide-react';

const examTypes = ['SSC', 'UPSC', 'Banking', 'Railways', 'General'];

export function HomePage() {
  const { setView, categories, freeTestsRemaining, isSubscribed, setView: setAppView } = useAppStore();

  return (
    <div className="space-y-8">
      {/* Hero - Navy Blue Testbook Style */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-800 via-blue-900 to-slate-900 p-8 md:p-12 text-white">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-5 right-20 w-40 h-40 border border-white rounded-full" />
          <div className="absolute bottom-5 left-10 w-60 h-60 border border-white rounded-full" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              {examTypes.map((t) => (
                <Badge key={t} className="bg-white/15 text-white/90 hover:bg-white/20 border-0 text-xs">{t}</Badge>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              India&apos;s #1 <span className="text-cyan-400">Free Mock Test</span> Platform
            </h1>
            <p className="text-blue-200 mb-6 max-w-lg">
              Practice government exam mock tests for SSC CGL, UPSC, IBPS PO, RRB NTPC and more. Real exam interface with question palette &amp; timer.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-8 h-12" onClick={() => setView('tests')}>
                Start Free Test <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              {isSubscribed ? (
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Crown className="w-5 h-5 mr-2 text-amber-400" /> PRO Member
                </Button>
              ) : (
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" onClick={() => useAppStore.getState().setShowSubscriptionModal(true)}>
                  <Lock className="w-4 h-4 mr-2" /> Unlock All — ₹100
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: BarChart3, label: 'Test Series', value: `${categories.reduce((s, c) => s + c._count.tests, 0)}+`, color: 'bg-blue-100 text-blue-700' },
          { icon: BookOpen, label: 'Questions', value: '100+', color: 'bg-green-100 text-green-700' },
          { icon: Users, label: 'Exam Types', value: '5+', color: 'bg-purple-100 text-purple-700' },
          { icon: Star, label: 'Free Tests', value: freeTestsRemaining, color: 'bg-amber-100 text-amber-700' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="hover:shadow-md transition-shadow border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${stat.color}`}><stat.icon className="w-5 h-5" /></div>
                <div><p className="text-xl font-bold">{stat.value}</p><p className="text-xs text-muted-foreground">{stat.label}</p></div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Exam Categories */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Popular Exam Categories</h2>
          <Button variant="ghost" size="sm" onClick={() => setView('tests')}>View All <ArrowRight className="w-4 h-4 ml-1" /></Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categories.map((cat, i) => (
            <motion.button key={cat.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => { useAppStore.getState().setSelectedCategory(cat.id); setView('tests'); }}
              className="text-left group"
            >
              <Card className="border-0 shadow-sm hover:shadow-lg transition-all overflow-hidden">
                <div className="h-1.5" style={{ backgroundColor: cat.color }} />
                <CardContent className="p-4">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2 text-white text-sm font-bold" style={{ backgroundColor: cat.color }}>
                    {cat.name.charAt(0)}
                  </div>
                  <h3 className="font-semibold text-sm leading-tight group-hover:text-blue-600 transition-colors truncate">{cat.name}</h3>
                  <p className="text-[11px] text-muted-foreground mt-1">{cat.examType} · {cat._count.tests} tests</p>
                </CardContent>
              </Card>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-xl font-bold mb-4">Why Choose QuizMaster?</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: BarChart3, title: 'Real Exam Interface', desc: 'Question palette, mark for review, timer — exactly like SSC/UPSC online exam.' },
            { icon: Trophy, title: 'Detailed Solutions', desc: 'Every question has explanations. Learn from your mistakes.' },
            { icon: Clock, title: 'Performance Tracking', desc: 'Track your attempts, scores, and improvement over time.' },
          ].map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
              <Card className="h-full border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      {!isSubscribed && (
        <section className="rounded-2xl border-2 border-blue-200 bg-blue-50/50 p-8 text-center">
          <Crown className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h2 className="text-2xl font-bold mb-2">Get Unlimited Access — ₹100</h2>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            {freeTestsRemaining} free tests remaining. Unlock all {categories.reduce((s, c) => s + c._count.tests, 0)}+ tests with detailed solutions.
          </p>
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8" onClick={() => useAppStore.getState().setShowSubscriptionModal(true)}>
            Subscribe Now <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </section>
      )}
    </div>
  );
}
