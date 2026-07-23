'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown,
  CheckCircle2,
  Zap,
  BookOpen,
  Shield,
  Star,
  X,
  Sparkles,
} from 'lucide-react';

export function SubscriptionModal() {
  const { showSubscriptionModal, setShowSubscriptionModal, deviceId } = useAppStore();
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  if (!showSubscriptionModal) return null;

  async function handleSubscribe() {
    setIsSubscribing(true);
    try {
      // Update student info
      await fetch('/api/student', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, name: name || 'Pro Student' }),
      });

      // Subscribe
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId }),
      });

      if (res.ok) {
        const data = await res.json();
        useAppStore.getState().setStudentData({ freeTestsUsed: 0, isSubscribed: true });
        setSubscribed(true);
      }
    } catch {
      // Handle error
    }
    setIsSubscribing(false);
  }

  function handleClose() {
    setShowSubscriptionModal(false);
    if (subscribed) {
      setSubscribed(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25 }}
          className="bg-background rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {subscribed ? (
            /* Success State */
            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
              >
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">Welcome to Pro! 🎉</h2>
              <p className="text-muted-foreground mb-6">
                Your unlimited access has been activated. You can now take all tests without any limits!
              </p>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 w-full"
                size="lg"
                onClick={handleClose}
              >
                Start Practicing Now
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 p-6 text-white relative">
                <button
                  onClick={handleClose}
                  className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <Crown className="w-10 h-10 mb-3" />
                <h2 className="text-2xl font-bold">Unlock Unlimited Tests</h2>
                <p className="text-white/80 text-sm mt-1">
                  Get unlimited access to all 170+ questions
                </p>
              </div>

              {/* Features */}
              <div className="p-6 space-y-4">
                <div className="text-center mb-4">
                  <span className="text-4xl font-bold">₹100</span>
                  <span className="text-muted-foreground ml-1">/ one-time</span>
                </div>

                <div className="space-y-3">
                  {[
                    { icon: BookOpen, text: 'Unlimited test attempts' },
                    { icon: Zap, text: 'Access to all 8 categories' },
                    { icon: Star, text: '170+ MCQ questions' },
                    { icon: Shield, text: 'Detailed answer explanations' },
                  ].map((feature) => (
                    <div key={feature.text} className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600">
                        <feature.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm">{feature.text}</span>
                    </div>
                  ))}
                </div>

                {/* Form */}
                <div className="space-y-3 pt-2">
                  <div>
                    <Label htmlFor="name">Your Name (Optional)</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold h-12"
                  onClick={handleSubscribe}
                  disabled={isSubscribing}
                >
                  {isSubscribing ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <>
                      Subscribe for ₹100
                      <Crown className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  One-time payment. No recurring charges.
                </p>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
