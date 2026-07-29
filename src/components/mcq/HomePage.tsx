'use client';

import { useAppStore, handleSubscribeClick } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import {
  Trophy, ArrowRight, BookOpen, Crown, Star, BarChart3, Users, Clock, Lock, UserCircle, History,
} from 'lucide-react';

const examTypes = ['SSC', 'UPSC', 'Banking', 'Railways', 'General'];

// Skeleton for categories grid
function CategoriesSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i}>
          <Card className="border-0 shadow-sm">
            <Skeleton className="h-1.5 w-full" />
            <CardContent className="p-4">
              <Skeleton className="w-9 h-9 rounded-lg mb-2" />
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}

export function HomePage() {
  const { setView, categories, freeTestsRemaining, isSubscribed, isLoggedIn, setShowAuthModal } = useAppStore();

  const isDataLoaded = categories.length > 0;

  return (
    <div className="space-y-8">
      {/* Hero - Navy Blue Testbook Style */}
      <section className="hero-theme relative overflow-hidden rounded-2xl p-6 sm:p-8 md:p-12 text-white">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-5 right-20 w-40 h-40 border border-white rounded-full" />
          <div className="absolute bottom-5 left-10 w-60 h-60 border border-white rounded-full" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {examTypes.map((t) => (
                <Badge key={t} className="bg-white/15 text-white/90 hover:bg-white/20 border-0 text-xs">{t}</Badge>
              ))}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              India&apos;s #1 <span className="text-cyan-400">Free Mock Test</span> Platform
            </h1>
            <p className="text-sm sm:text-base text-white/70 mb-6 max-w-lg">
              Practice government exam mock tests for SSC CGL, UPSC, IBPS PO, RRB NTPC and more. Real exam interface with question palette &amp; timer.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="theme-btn text-white font-semibold px-6 sm:px-8 h-11 sm:h-12 text-sm sm:text-base" onClick={() => setView('tests')}>
                Start Free Test <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              {isLoggedIn ? (
                isSubscribed ? (
                  <Button size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
                    <Crown className="w-5 h-5 mr-2 text-amber-400" /> PRO Member
                  </Button>
                ) : (
                  <Button size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white" onClick={handleSubscribeClick}>
                    <Lock className="w-4 h-4 mr-2" /> Unlock All — ₹100
                  </Button>
                )
              ) : (
                <Button size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white" onClick={() => setShowAuthModal('signup')}>
                  <UserCircle className="w-5 h-5 mr-2" /> Sign Up Free
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: BarChart3, label: 'Test Series', value: `${categories.reduce((s, c) => s + (c?._count?.tests || 0), 0)}+`, color: 'bg-blue-100 text-blue-700' },
          { icon: BookOpen, label: 'Questions', value: '100+', color: 'bg-green-100 text-green-700' },
          { icon: Users, label: 'Exam Types', value: '5+', color: 'bg-purple-100 text-purple-700' },
          { icon: Star, label: 'Free Tests', value: freeTestsRemaining, color: 'bg-amber-100 text-amber-700' },
        ].map((stat) => (
          <div key={stat.label} className="animate-fade-in">
            <Card className="hover:shadow-md transition-shadow border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${stat.color}`}><stat.icon className="w-5 h-5" /></div>
                <div><p className="text-xl font-bold">{stat.value}</p><p className="text-xs text-muted-foreground">{stat.label}</p></div>
              </CardContent>
            </Card>
          </div>
        ))}
      </section>

      {/* Exam Categories */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Popular Exam Categories</h2>
          <Button variant="ghost" size="sm" onClick={() => setView('tests')}>View All <ArrowRight className="w-4 h-4 ml-1" /></Button>
        </div>
        {isDataLoaded ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {categories.map((cat) => (
              <button key={cat.id || cat._id || cat.name}
                onClick={() => { useAppStore.getState().setSelectedCategory(cat.id || cat._id); setView('tests'); }}
                className="text-left group card-hover-transform"
              >
                <Card className="border-0 shadow-sm hover:shadow-lg transition-all overflow-hidden">
                  <div className="h-1.5" style={{ backgroundColor: cat.color || '#1e40af' }} />
                  <CardContent className="p-4">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2 text-white text-sm font-bold" style={{ backgroundColor: cat.color || '#1e40af' }}>
                      {cat.name?.charAt(0) || '?'}
                    </div>
                    <h3 className="font-semibold text-sm leading-tight group-hover:text-blue-600 transition-colors truncate">{cat.name || 'Unknown'}</h3>
                    <p className="text-[11px] text-muted-foreground mt-1">{cat.examType || 'General'} · {cat._count?.tests || 0} tests</p>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        ) : (
          <CategoriesSkeleton />
        )}
      </section>

      {/* Features */}
      <section>
        <h2 className="text-xl font-bold mb-4">Why Choose TestWaleChacha?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: BarChart3, title: 'Real Exam Interface', desc: 'Question palette, mark for review, timer — exactly like SSC/UPSC online exam.' },
            { icon: Trophy, title: 'Detailed Solutions', desc: 'Every question has explanations. Learn from your mistakes.' },
            { icon: Clock, title: 'Performance Tracking', desc: 'Track your attempts, scores, and improvement over time.' },
            { icon: History, title: 'Personal Dashboard', desc: 'Track all your test attempts, scores, and rankings in one place.' },
          ].map((item) => (
            <div key={item.title} className="animate-fade-in">
              <Card className="h-full border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      {!isSubscribed && (
        <section className="rounded-2xl border-2 border-blue-200 bg-blue-50/50 p-6 sm:p-8 text-center">
          <Crown className="w-10 h-10 sm:w-12 sm:h-12 text-amber-500 mx-auto mb-3" />
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Get Unlimited Access — ₹100</h2>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            {isLoggedIn
              ? `${freeTestsRemaining} free tests remaining. Unlock all ${categories.reduce((s, c) => s + (c?._count?.tests || 0), 0)}+ tests with detailed solutions.`
              : `Sign up free to get 5 mock tests, then unlock unlimited access for just ₹100.`
            }
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {!isLoggedIn && (
              <Button size="lg" variant="outline" className="font-semibold px-8" onClick={() => setShowAuthModal('signup')}>
                Sign Up Free
              </Button>
            )}
            <Button size="lg" className="theme-btn text-white font-semibold px-8" onClick={handleSubscribeClick}>
              Subscribe Now — ₹100 <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
