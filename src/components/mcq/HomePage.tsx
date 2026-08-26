'use client';

import { useAppStore, handleSubscribeClick } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, useInView } from 'framer-motion';
import React, { useState, useRef } from 'react';
import { AdBanner } from '@/components/AdSense';
import { getCategoryIcon } from './icons';
import {
  Trophy, ArrowRight, BookOpen, Crown, BarChart3, Users, Clock, Lock, UserCircle,
  Play, Shield, TrendingUp, Target, MessageCircle, GraduationCap, Flame, Sparkles, ChevronDown,
} from 'lucide-react';

const examTabs = ['SSC', 'Banking', 'Railways', 'UPSC', 'Teaching', 'State', 'Defence', 'Other'];

// ── FAQ Accordion ──
const faqs = [
  {
    q: 'Is TestWaleChacha free to use?',
    a: 'Yes! TestWaleChacha offers free mock tests for government exams like SSC CGL, UPSC, IBPS PO, and RRB NTPC. New users get 2 free tests, and PRO subscription for unlimited access starts at just ₹100.',
  },
  {
    q: 'What exams does TestWaleChacha cover?',
    a: 'We cover all major government exams — SSC CGL, SSC CHSL, UPSC CSE, IBPS PO, SBI PO, RRB NTPC, State PSC, Teaching (CTET/TET), Defence (CDS/NDA), and more. New tests are added regularly.',
  },
  {
    q: 'Does it have a real exam-like interface?',
    a: 'Yes! You get a real exam-like interface with question palette to navigate between questions, countdown timer, mark for review, color-coded status, and detailed solutions after submission — exactly like the actual SSC/UPSC exam.',
  },
  {
    q: 'How to prepare for SSC CGL with mock tests?',
    a: 'Start with topic-wise tests to strengthen individual subjects (Reasoning, Quant, English, GK). Then take full-length mocks for time management practice. Review detailed solutions to identify weak areas. Consistent practice of 2-3 tests daily builds speed and accuracy.',
  },
  {
    q: 'Can I use TestWaleChacha on mobile?',
    a: 'Absolutely! TestWaleChacha is fully responsive and works perfectly on mobile phones and tablets. You can also install it as a PWA (Progressive Web App) for quick access and a native app-like experience. Practice anytime, anywhere.',
  },
  {
    q: 'What is the price of PRO subscription?',
    a: 'TestWaleChacha PRO costs just ₹100 and gives you unlimited access to all mock tests across all exam categories — SSC, UPSC, Banking, Railways, State PSC, Teaching, and Defence. One of the most affordable platforms in India.',
  },
  {
    q: 'Where can I find free SSC CGL mock test online?',
    a: 'TestWaleChacha provides free SSC CGL mock tests online with real exam pattern — 100 questions, 60 minutes, covering Quantitative Aptitude, Reasoning, English, and General Awareness. Detailed solutions included after every test.',
  },
  {
    q: 'Is there a free mock test for IBPS PO Prelims?',
    a: 'Yes! TestWaleChacha offers free IBPS PO Prelims mock tests with Reasoning, Quantitative Aptitude, English Language, and General Awareness sections. Practice with timer and question palette just like the actual IBPS exam.',
  },
  {
    q: 'How to get free mock test for UPSC CSE Prelims online?',
    a: 'Sign up free on TestWaleChacha and get 2 free mock tests including UPSC CSE Prelims GS Paper 1 and CSAT. Questions cover History, Geography, Polity, Economy, Science and Current Affairs with detailed explanations.',
  },
  {
    q: 'Which is the best free mock test platform for government exams in India?',
    a: 'TestWaleChacha is one of the best free mock test platforms in India with real exam-like interface, question palette, timer, detailed solutions, and performance analytics. Covers SSC, UPSC, Banking, Railways, and more. PRO plan at just ₹100.',
  },
  {
    q: 'Can I practice RRB NTPC mock test free online?',
    a: 'Yes! TestWaleChacha offers free RRB NTPC mock tests with CBT-based interface. Practice Mathematics, General Intelligence, General Science, and General Awareness questions with timer and detailed solutions.',
  },
  {
    q: 'Are there free CTET mock tests with answers and explanation?',
    a: 'TestWaleChacha provides free CTET Paper 1 and Paper 2 mock tests with detailed answers and explanations. Practice Child Development, Pedagogy, Language, Mathematics, Science, and Social Studies questions.',
  },
];

function FaqAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div className="max-w-3xl mx-auto space-y-2">
      {faqs.map((faq, i) => (
        <motion.div
          key={i}
          custom={i}
          variants={fadeUp}
          className="border border-gray-200 rounded-xl overflow-hidden bg-white"
        >
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 text-left hover:bg-gray-50 transition-colors"
            aria-expanded={openIdx === i}
          >
            <h3 className="font-semibold text-sm sm:text-base pr-4">{faq.q}</h3>
            <ChevronDown className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-200 ${openIdx === i ? 'rotate-180' : ''}`} />
          </button>
          <div className={`overflow-hidden transition-all duration-200 ${openIdx === i ? 'max-h-60' : 'max-h-0'}`}>
            <p className="px-4 sm:px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── Scroll-triggered animation helpers ──
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  })
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

// Scroll-triggered section wrapper — items animate in as they enter viewport
function ScrollSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const show = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.section ref={ref} initial="hidden" animate={show ? 'visible' : 'hidden'} variants={stagger} className={className}>
      {children}
    </motion.section>
  );
}

// Skeleton
function CategoriesSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i}>
          <Card className="border border-gray-100/80 bg-gradient-to-br from-white to-blue-50/30 shadow-md"><CardContent className="p-4">
            <Skeleton className="w-9 h-9 rounded-lg mb-2" />
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-3 w-16" />
          </CardContent></Card>
        </div>
      ))}
    </div>
  );
}

// 3D-style card with subtle colored gradient bg
function Card3D({ children, className = '', bgTo = 'to-blue-50/30', onClick }: {
  children: React.ReactNode; className?: string; bgTo?: string; onClick?: () => void;
}) {
  return (
    <Card
      className={`border border-gray-100/80 bg-gradient-to-br from-white ${bgTo} shadow-md hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer ${className}`}
      onClick={onClick}
    >
      {children}
    </Card>
  );
}

export function HomePage() {
  const { setView, categories, tests, freeTestsRemaining, isSubscribed, isLoggedIn, setShowAuthModal, setSelectedCategory } = useAppStore();
  const isDataLoaded = categories.length > 0;
  const popularTests = tests.slice(0, 8);

  return (
    <div className="pb-24">
      {/* ===== HERO ===== */}
      <section
        className="relative text-white mb-6 sm:mb-8 hero-banner-rounded mt-3"
        style={{ background: 'linear-gradient(135deg, #0D1B4C 0%, #1C1C84 40%, #2525A0 70%, #1a1a6e 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full border border-white/10" />
          <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full border border-white/5" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full border border-white/5" />
          <div className="absolute top-1/2 right-1/4 w-4 h-4 rounded-full bg-cyan-400/30" />
          <div className="absolute top-1/3 left-1/3 w-3 h-3 rounded-full bg-amber-400/20" />
          <div className="absolute bottom-1/4 right-1/3 w-2 h-2 rounded-full bg-white/20" />
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-3xl" />
        </div>

        <div className="relative z-10 px-4 sm:px-6 lg:px-12 xl:px-16 py-6 sm:py-14 md:py-20 max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12 xl:gap-16">

            {/* ── Left ── */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex-1 lg:max-w-2xl"
            >
              {/* Pills */}
              <div className="hidden sm:flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                {examTabs.map((t, i) => (
                  <motion.span
                    key={t}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.04, duration: 0.3 }}
                  >
                    <Badge className="bg-white/10 backdrop-blur-sm text-white/80 border border-white/10 hover:bg-white/20 text-[10px] sm:text-xs px-2.5 py-0.5 cursor-default transition-colors">{t}</Badge>
                  </motion.span>
                ))}
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="text-xl sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-5xl font-extrabold leading-tight mb-2 sm:mb-4"
              >
                Free Online Mock Tests for{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent">SSC, UPSC, IBPS &amp; RRB</span>
              </motion.h1>
              <p className="text-sm sm:text-base text-white/70 mb-3 sm:mb-4 max-w-lg leading-relaxed">
                Mock tests jo dil ki tayyari karayein! SSC CGL, UPSC, IBPS PO, RRB NTPC aur bahut saare government exams ke liye real exam jaisa interface — Question Palette, Timer aur detailed analysis ke saath.
              </p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="hidden sm:flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm sm:text-base text-white/60 mb-3 sm:mb-4"
              >
                <span className="text-cyan-400 font-semibold flex items-center gap-1"><Sparkles className="w-4 h-4" />Pehle Practice</span>
                <span className="text-white/30">▸</span>
                <span className="text-cyan-400 font-semibold flex items-center gap-1"><Target className="w-4 h-4" />Phir Analyse</span>
                <span className="text-white/30">▸</span>
                <span className="text-cyan-400 font-semibold flex items-center gap-1"><Trophy className="w-4 h-4" />Phir Crack</span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-xs sm:text-sm text-white/40 mb-4 sm:mb-8 max-w-lg"
              >
                Government exam preparation platform with free MCQ practice tests, detailed solutions, and performance analytics. Works on mobile, tablet &amp; desktop.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="flex flex-wrap gap-2 sm:gap-3"
              >
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-bold px-5 sm:px-8 h-10 sm:h-12 text-sm sm:text-base rounded-xl shadow-lg shadow-cyan-500/25 transition-all" onClick={() => setView('tests')}>
                  Free Test Shuru Karein <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                {isLoggedIn ? (
                  isSubscribed ? (
                    <Button size="lg" variant="outline" className="border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 rounded-xl"><Crown className="w-5 h-5 mr-2 text-amber-400" /> PRO Member</Button>
                  ) : (
                    <Button size="lg" variant="outline" className="border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 rounded-xl" onClick={handleSubscribeClick}><Lock className="w-4 h-4 mr-2" /> Sab Tests Unlock — ₹100</Button>
                  )
                ) : (
                  <Button size="lg" variant="outline" className="border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 rounded-xl" onClick={() => setShowAuthModal('signup')}><UserCircle className="w-5 h-5 mr-2" /> Free Me Signup</Button>
                )}
              </motion.div>
            </motion.div>

            {/* ── Right: Stats (desktop only) ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="hidden lg:block lg:w-80 xl:w-96 shrink-0"
            >
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  { icon: Users, value: `${categories.length}+`, label: 'Exam Categories', color: 'from-blue-500/20 to-blue-600/10', iconColor: 'text-blue-400' },
                  { icon: Flame, value: `${tests.length}+`, label: 'Mock Tests', color: 'from-orange-500/20 to-orange-600/10', iconColor: 'text-orange-400' },
                  { icon: GraduationCap, value: 'Free', label: `${freeTestsRemaining} Tests on Signup`, color: 'from-emerald-500/20 to-emerald-600/10', iconColor: 'text-emerald-400' },
                  { icon: Crown, value: '₹100', label: 'PRO Unlimited', color: 'from-amber-500/20 to-amber-600/10', iconColor: 'text-amber-400' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
                    className={`rounded-xl bg-gradient-to-br ${stat.color} backdrop-blur-sm border border-white/10 p-4 sm:p-5 shadow-lg`}
                  >
                    <stat.icon className={`w-6 h-6 ${stat.iconColor} mb-2`} />
                    <p className="text-xl sm:text-2xl font-extrabold text-white">{stat.value}</p>
                    <p className="text-[10px] sm:text-xs text-white/50 mt-0.5">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== POPULAR EXAMS ===== */}
      <ScrollSection className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 mt-6 sm:mt-8">
        <motion.div variants={fadeUp} custom={0}>
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Popular Exam Categories</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Exams ke hisaab se mock tests — abhi shuru karein</p>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700" onClick={() => setView('tests')}>
              View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} custom={1}>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-4 pb-1 -mx-1 px-1">
            {examTabs.map((tab) => (
              <button key={tab} className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-white border border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 hover:shadow-sm text-gray-600 transition-all whitespace-nowrap shrink-0">
                {tab} Exams
              </button>
            ))}
          </div>
        </motion.div>

        {isDataLoaded ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {categories.map((cat, idx) => (
              <motion.div key={cat.id || cat._id || cat.name} custom={idx} variants={fadeUp} onClick={() => { setSelectedCategory(cat.id || cat._id); setView('tests'); }} className="text-left group">
                <Card3D className="h-full overflow-hidden" bgTo="to-indigo-50/40">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-start gap-2.5 sm:gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: cat.color || '#1C1C84' }}>
                        {(() => { const CatIcon = getCategoryIcon(cat.name || ''); return <CatIcon className="w-4 h-4 sm:w-5 sm:h-5" />; })()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-xs sm:text-sm leading-tight group-hover:text-blue-600 transition-colors truncate">{cat.name || 'Unknown'}</h3>
                        <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">{cat._count?.tests || 0} Tests</p>
                      </div>
                    </div>
                  </CardContent>
                </Card3D>
              </motion.div>
            ))}
          </div>
        ) : <CategoriesSkeleton />}
      </ScrollSection>

      {/* ===== POPULAR TEST SERIES ===== */}
      {popularTests.length > 0 && (
        <ScrollSection className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 mt-6 sm:mt-8">
          <motion.div variants={fadeUp} custom={0}>
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <div>
                <h2 className="text-lg sm:text-xl font-bold">Popular Test Series</h2>
                <p className="text-xs text-muted-foreground mt-0.5">In bahut popular tests ko pehle try karein</p>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700" onClick={() => setView('tests')}>
                View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </motion.div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">
            {popularTests.map((test, idx) => (
              <motion.div key={test.id || test._id} custom={idx} variants={fadeUp} className="shrink-0 w-[260px] sm:w-[280px]">
                <Card3D className="h-full overflow-hidden relative" bgTo="to-teal-50/40" onClick={() => { setSelectedCategory(test.categoryId); setView('tests'); }}>
                  <div className="absolute -right-1 -bottom-1 text-6xl opacity-[0.07] pointer-events-none select-none leading-none text-gray-800">
                    {(() => { const TIcon = getCategoryIcon(test.category?.name || ''); return <TIcon />; })()}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-[10px]">{test.category?.name || 'General'}</Badge>
                      {test.isLocked && (
                        <Badge className="text-[10px] bg-amber-100 text-amber-700 border-0 gap-0.5"><Crown className="w-2.5 h-2.5" />PRO</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{test.title}</h3>
                    <p className="text-[11px] text-muted-foreground line-clamp-1 mb-3">{test.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-3">
                      <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{test._count?.questions || test.totalQuestions || 0} Qs</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{Math.floor(test.timeLimit / 60)} min</span>
                      <span className="flex items-center gap-1"><Target className="w-3 h-3" />{test.difficulty}</span>
                    </div>
                    <Button size="sm" className={`w-full text-xs font-semibold h-9 ${test.isLocked ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`} onClick={(e) => { e.stopPropagation(); setSelectedCategory(test.categoryId); setView('tests'); }}>
                      {test.isLocked ? <><Crown className="w-3.5 h-3.5 mr-1" />Subscribe to Unlock</> : <><Play className="w-3.5 h-3.5 mr-1" />Test Shuru Karein</>}
                    </Button>
                  </CardContent>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </ScrollSection>
      )}

      {/* ===== AD BANNER ===== */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 mt-6 sm:mt-8">
        <AdBanner />
      </div>

      {/* ===== FEATURES ===== */}
      <ScrollSection className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 mt-6 sm:mt-8">
        <motion.h2 variants={fadeUp} custom={0} className="text-lg sm:text-xl font-bold mb-1">TestWaleChacha Kyun Choose Karein?</motion.h2>
        <motion.p variants={fadeUp} custom={1} className="text-xs text-muted-foreground mb-4 sm:mb-5">Government exam crack karne ke liye sab kuch ek jagah</motion.p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { icon: BarChart3, title: 'Real Exam Interface', desc: 'Question palette, mark for review, timer — bilkul real SSC/UPSC exam jaisa.', color: 'bg-blue-50 text-blue-600', gradient: 'to-blue-50/50' },
            { icon: Trophy, title: 'Detailed Solutions', desc: 'Har question ka detailed explanation. Galtiyon se seekhein.', color: 'bg-emerald-50 text-emerald-600', gradient: 'to-emerald-50/50' },
            { icon: TrendingUp, title: 'Performance Track', desc: 'Apne attempts, scores aur improvement track karein.', color: 'bg-purple-50 text-purple-600', gradient: 'to-purple-50/50' },
            { icon: Shield, title: 'Personal Dashboard', desc: 'Saare test attempts, scores aur rankings ek jagah.', color: 'bg-amber-50 text-amber-600', gradient: 'to-amber-50/50' },
          ].map((item, idx) => (
            <motion.div key={item.title} custom={idx + 2} variants={fadeUp}>
              <Card3D className="h-full" bgTo={item.gradient}>
                <CardContent className="p-4 sm:p-5">
                  <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mb-3 shadow-sm`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card3D>
            </motion.div>
          ))}
        </div>
      </ScrollSection>



      {/* ===== AD BANNER ===== */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 mt-6 sm:mt-8">
        <AdBanner />
      </div>

      {/* ===== PRICING CTA ===== */}
      {!isSubscribed && (
        <ScrollSection className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 mt-6 sm:mt-8">
          <motion.div variants={fadeUp} custom={0} className="relative overflow-hidden rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-6 sm:p-8 text-center shadow-xl shadow-amber-200/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-200/20 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-400/30">
                <Crown className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Sab Tests Unlock — Sirf ₹100</h2>
              <p className="text-sm text-muted-foreground mb-5 sm:mb-6 max-w-md mx-auto">
                {isLoggedIn
                  ? `${freeTestsRemaining} free tests bache hain. Saare ${categories.reduce((s, c) => s + (c?._count?.tests || 0), 0)}+ tests unlimited access ke liye subscribe karein.`
                  : `Free signup ke saath mock tests milein, phir sirf ₹100 me sab unlimited.`
                }
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {!isLoggedIn && (
                  <Button size="lg" variant="outline" className="font-semibold px-6 sm:px-8 h-11 rounded-xl border-gray-300" onClick={() => setShowAuthModal('signup')}>
                    <UserCircle className="w-4 h-4 mr-2" /> Free Signup
                  </Button>
                )}
                <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-6 sm:px-8 h-11 rounded-xl shadow-lg shadow-amber-500/25" onClick={handleSubscribeClick}>
                  Abhi Subscribe Karein — ₹100 <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        </ScrollSection>
      )}

      {/* ===== MOBILE STATS (above footer, mobile/tablet only) ===== */}
      <ScrollSection className="lg:hidden max-w-[1400px] mx-auto px-4 sm:px-6 mt-6 sm:mt-8">
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Users, value: `${categories.length}+`, label: 'Exam Categories', bg: 'bg-blue-50', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
            { icon: Flame, value: `${tests.length}+`, label: 'Mock Tests', bg: 'bg-orange-50', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
            { icon: GraduationCap, value: 'Free', label: `${freeTestsRemaining} Tests on Signup`, bg: 'bg-emerald-50', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
            { icon: Crown, value: '₹100', label: 'PRO Unlimited', bg: 'bg-amber-50', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
          ].map((stat, i) => (
            <motion.div key={stat.label} custom={i} variants={fadeUp}>
              <div className={`${stat.bg} rounded-xl p-3.5 border border-gray-100/80 shadow-sm`}>
                <div className={`w-8 h-8 ${stat.iconBg} rounded-lg flex items-center justify-center mb-2`}>
                  <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
                </div>
                <p className="text-lg sm:text-xl font-extrabold text-gray-900">{stat.value}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollSection>

      {/* ===== FAQ SECTION ===== */}
      <ScrollSection className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 mt-6 sm:mt-8">
        <motion.div variants={fadeUp} custom={0} className="text-center mb-5">
          <h2 className="text-lg sm:text-xl font-bold">Frequently Asked Questions</h2>
          <p className="text-xs text-muted-foreground mt-1">Mock tests, exams aur platform ke baare mein common sawaal</p>
        </motion.div>
        <FaqAccordion />
      </ScrollSection>

      {/* ===== WHATSAPP ===== */}
      <motion.a
        href="https://whatsapp.com/channel/0029VbDsNS4A2pL5AnlWwm1G"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed bottom-20 right-4 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 transition-colors group"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-[10px] sm:text-xs px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat with us!
        </span>
      </motion.a>
    </div>
  );
}
