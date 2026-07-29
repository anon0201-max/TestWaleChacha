'use client';

import { useAppStore, handleSubscribeClick } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import {
  Trophy, ArrowRight, BookOpen, Crown, Star, BarChart3, Users, Clock, Lock, UserCircle, History,
  ChevronRight, Zap, Play, Shield, TrendingUp, Target, MessageCircle,
} from 'lucide-react';

const examTabs = ['SSC', 'Banking', 'Railways', 'UPSC', 'Teaching', 'State', 'Defence', 'Other'];

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

// Animated Counter
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  return (
    <span>
      {target}{suffix}
    </span>
  );
}

export function HomePage() {
  const { setView, categories, tests, freeTestsRemaining, isSubscribed, isLoggedIn, setShowAuthModal, setSelectedCategory } = useAppStore();
  const isDataLoaded = categories.length > 0;

  const popularTests = tests.slice(0, 8);

  return (
    <div className="space-y-6 sm:space-y-8 pb-24">
      {/* ===== HERO SECTION — Full-width Testbook Style ===== */}
      <section className="relative overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #0D1B4C 0%, #1C1C84 40%, #2525A0 70%, #1a1a6e 100%)' }}>
        {/* Decorative Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full border border-white/10" />
          <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full border border-white/5" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full border border-white/5" />
          <div className="absolute top-1/2 right-1/4 w-4 h-4 rounded-full bg-cyan-400/30" />
          <div className="absolute top-1/3 left-1/3 w-3 h-3 rounded-full bg-amber-400/20" />
          <div className="absolute bottom-1/4 right-1/3 w-2 h-2 rounded-full bg-white/20" />
        </div>

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-20 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            {/* Exam Tag Pills */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6">
              {examTabs.map((t) => (
                <Badge key={t} className="bg-white/10 backdrop-blur-sm text-white/80 border border-white/10 hover:bg-white/20 text-[10px] sm:text-xs px-2.5 py-0.5 cursor-default transition-colors">
                  {t}
                </Badge>
              ))}
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-3 sm:mb-4">
              One Destination for{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent">Complete Exam Preparation</span>
            </h1>

            {/* Subtitle Steps */}
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm sm:text-base text-white/60 mb-3 sm:mb-4">
              <span className="text-cyan-400 font-semibold">Learn</span>
              <span className="text-white/30">▸</span>
              <span className="text-cyan-400 font-semibold">Practice</span>
              <span className="text-white/30">▸</span>
              <span className="text-cyan-400 font-semibold">Improve</span>
              <span className="text-white/30">▸</span>
              <span className="text-cyan-400 font-semibold">Succeed</span>
            </div>

            <p className="text-sm sm:text-base text-white/50 mb-6 sm:mb-8 max-w-lg">
              Start your preparation for government exams — SSC CGL, UPSC, IBPS PO, RRB NTPC and more. Real exam interface with question palette &amp; timer.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-bold px-6 sm:px-8 h-11 sm:h-12 text-sm sm:text-base rounded-xl shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40"
                onClick={() => setView('tests')}
              >
                Start Free Test <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              {isLoggedIn ? (
                isSubscribed ? (
                  <Button size="lg" variant="outline" className="border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 rounded-xl">
                    <Crown className="w-5 h-5 mr-2 text-amber-400" /> PRO Member
                  </Button>
                ) : (
                  <Button size="lg" variant="outline" className="border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 rounded-xl" onClick={handleSubscribeClick}>
                    <Lock className="w-4 h-4 mr-2" /> Unlock All — ₹100
                  </Button>
                )
              ) : (
                <Button size="lg" variant="outline" className="border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 rounded-xl" onClick={() => setShowAuthModal('signup')}>
                  <UserCircle className="w-5 h-5 mr-2" /> Sign Up Free
                </Button>
              )}
            </div>
          </motion.div>

          {/* Stats Counter — Right side on desktop, below on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-10 sm:mt-14 md:absolute md:right-8 md:top-1/2 md:-translate-y-1/2 md:grid-cols-2 md:w-72 lg:w-80"
          >
            {[
              { value: '8.8+', label: 'Registered Students', suffix: ' Crore' },
              { value: '242+', label: 'Tests Attempted', suffix: ' Crore' },
              { value: '4+', label: 'Student Selections', suffix: ' Lacs' },
              { value: '5.5+', label: 'Classes Attended', suffix: ' Crore' },
            ].map((stat, i) => (
              <div key={stat.label} className="text-center sm:text-left">
                <p className="text-xl sm:text-2xl font-extrabold text-white">
                  {stat.value}<span className="text-cyan-400">{stat.suffix}</span>
                </p>
                <p className="text-[10px] sm:text-xs text-white/50 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== POPULAR EXAMS SECTION ===== */}
      <section>
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-bold">Popular Exam Categories</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Get exam-ready with concepts, questions and study notes</p>
          </div>
          <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700" onClick={() => setView('tests')}>
            View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>

        {/* Horizontal scrollable exam tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-4 pb-1 -mx-1 px-1">
          {examTabs.map((tab) => (
            <button
              key={tab}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-white border border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 text-gray-600 transition-colors whitespace-nowrap shrink-0"
            >
              {tab} Exams
            </button>
          ))}
        </div>

        {/* Exam Category Cards */}
        {isDataLoaded ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {categories.map((cat, idx) => (
              <motion.button
                key={cat.id || cat._id || cat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => { setSelectedCategory(cat.id || cat._id); setView('tests'); }}
                className="text-left group card-hover-transform"
              >
                <Card className="border-0 shadow-sm hover:shadow-lg transition-all overflow-hidden h-full">
                  <div className="h-1" style={{ backgroundColor: cat.color || '#1C1C84' }} />
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-start gap-2.5 sm:gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ backgroundColor: cat.color || '#1C1C84' }}>
                        {cat.name?.charAt(0) || '?'}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-xs sm:text-sm leading-tight group-hover:text-blue-600 transition-colors truncate">{cat.name || 'Unknown'}</h3>
                        <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">
                          {cat._count?.tests || 0} Tests
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.button>
            ))}
          </div>
        ) : (
          <CategoriesSkeleton />
        )}
      </section>

      {/* ===== POPULAR TEST SERIES — Horizontal Scroll ===== */}
      {popularTests.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Popular Test Series</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Boost your preparation with structured mock tests</p>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700" onClick={() => setView('tests')}>
              View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">
            {popularTests.map((test, idx) => (
              <motion.div
                key={test.id || test._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="shrink-0 w-[260px] sm:w-[280px]"
              >
                <Card className="border-0 shadow-sm hover:shadow-lg transition-all overflow-hidden cursor-pointer h-full" onClick={() => { setSelectedCategory(test.categoryId); setView('tests'); }}>
                  <div className="h-1.5" style={{ backgroundColor: test.category?.color || '#1C1C84' }} />
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-[10px]">{test.category?.name || 'General'}</Badge>
                      {test.isLocked && (
                        <Badge className="text-[10px] bg-amber-100 text-amber-700 border-0 gap-0.5">
                          <Crown className="w-2.5 h-2.5" />PRO
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{test.title}</h3>
                    <p className="text-[11px] text-muted-foreground line-clamp-1 mb-3">{test.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-3">
                      <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{test._count?.questions || test.totalQuestions || 0} Qs</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{Math.floor(test.timeLimit / 60)} min</span>
                      <span className="flex items-center gap-1"><Target className="w-3 h-3" />{test.difficulty}</span>
                    </div>
                    <Button
                      size="sm"
                      className={`w-full text-xs font-semibold h-9 ${
                        test.isLocked
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                      onClick={(e) => { e.stopPropagation(); setSelectedCategory(test.categoryId); setView('tests'); }}
                    >
                      {test.isLocked ? (
                        <><Crown className="w-3.5 h-3.5 mr-1" />Subscribe to Unlock</>
                      ) : (
                        <><Play className="w-3.5 h-3.5 mr-1" />Start Test</>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ===== FEATURES SECTION ===== */}
      <section>
        <h2 className="text-lg sm:text-xl font-bold mb-1">Why Choose TestWaleChacha?</h2>
        <p className="text-xs text-muted-foreground mb-4 sm:mb-5">Everything you need to crack government exams</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { icon: BarChart3, title: 'Real Exam Interface', desc: 'Question palette, mark for review, timer — exactly like SSC/UPSC online exam.', color: 'bg-blue-50 text-blue-600' },
            { icon: Trophy, title: 'Detailed Solutions', desc: 'Every question has explanations. Learn from your mistakes.', color: 'bg-emerald-50 text-emerald-600' },
            { icon: TrendingUp, title: 'Performance Tracking', desc: 'Track your attempts, scores, and improvement over time.', color: 'bg-purple-50 text-purple-600' },
            { icon: Shield, title: 'Personal Dashboard', desc: 'All your test attempts, scores, and rankings in one place.', color: 'bg-amber-50 text-amber-600' },
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.1 }}
            >
              <Card className="h-full border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-5">
                  <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mb-3`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== PRICING CTA SECTION ===== */}
      {!isSubscribed && (
        <section className="relative overflow-hidden rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-6 sm:p-8 text-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-200/20 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-400/30">
              <Crown className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Get Unlimited Access — ₹100</h2>
            <p className="text-sm text-muted-foreground mb-5 sm:mb-6 max-w-md mx-auto">
              {isLoggedIn
                ? `${freeTestsRemaining} free tests remaining. Unlock all ${categories.reduce((s, c) => s + (c?._count?.tests || 0), 0)}+ tests with detailed solutions.`
                : `Sign up free to get mock tests, then unlock unlimited access for just ₹100.`
              }
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {!isLoggedIn && (
                <Button size="lg" variant="outline" className="font-semibold px-6 sm:px-8 h-11 rounded-xl border-gray-300" onClick={() => setShowAuthModal('signup')}>
                  <UserCircle className="w-4 h-4 mr-2" /> Sign Up Free
                </Button>
              )}
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-6 sm:px-8 h-11 rounded-xl shadow-lg shadow-amber-500/25"
                onClick={handleSubscribeClick}
              >
                Subscribe Now — ₹100 <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ===== FOOTER LINKS (embedded) ===== */}
      <section className="text-center text-xs text-muted-foreground space-y-2 pt-4">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          <span className="cursor-pointer hover:text-blue-600">About Us</span>
          <span className="cursor-pointer hover:text-blue-600">Contact</span>
          <span className="cursor-pointer hover:text-blue-600">Privacy Policy</span>
          <span className="cursor-pointer hover:text-blue-600">Terms</span>
        </div>
        <p>© 2025 TestWaleChacha. All rights reserved.</p>
      </section>

      {/* ===== FLOATING WHATSAPP BUTTON ===== */}
      <a
        href="https://wa.me/919999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-4 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 transition-all hover:scale-110 group"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-[10px] sm:text-xs px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat with us!
        </span>
      </a>
    </div>
  );
}
