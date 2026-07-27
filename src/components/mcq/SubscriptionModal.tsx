'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown, CheckCircle2, Zap, BookOpen, Shield, Star, X, Sparkles, CreditCard, Smartphone, Wallet, ArrowRight,
} from 'lucide-react';

export function SubscriptionModal() {
  const { showSubscriptionModal, setShowSubscriptionModal, deviceId, user, setUser, setStudentData } = useAppStore();
  const [step, setStep] = useState<'form' | 'payment' | 'processing' | 'success'>('form');
  const [payMethod, setPayMethod] = useState('upi');

  const studentId = user?.id || null;

  if (!showSubscriptionModal) return null;

  function handleClose() {
    setShowSubscriptionModal(false);
    setTimeout(() => setStep('form'), 200);
  }

  async function processPayment() {
    setStep('processing');
    try {
      // Create order
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 100, deviceId: deviceId || undefined, studentId }),
      });
      const orderData = await orderRes.json();

      // Verify payment (simulated)
      const verifyRes = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpayOrderId: orderData.id,
          razorpayPaymentId: 'pay_' + Date.now(),
          razorpaySignature: 'sig_' + Date.now(),
          deviceId: studentId ? undefined : deviceId,
          studentId,
          amount: 10000,
        }),
      });
      const verifyData = await verifyRes.json();

      if (verifyRes.ok && verifyData.success) {
        // Update local state
        if (verifyData.student) {
          setUser(verifyData.student);
        } else {
          setStudentData({ freeTestsUsed: 0, isSubscribed: true });
        }
        setStep('success');
      } else {
        setStep('form');
        alert('Payment failed. Please try again.');
      }
    } catch {
      setStep('form');
      alert('Payment error. Please try again.');
    }
  }

  const userName = user?.name || 'Student';

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={handleClose}>
        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: 'spring', damping: 25 }}
          className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>

          {step === 'success' ? (
            <div className="p-8 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}>
                <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
              <p className="text-muted-foreground mb-1">₹100 paid successfully</p>
              <p className="text-sm text-muted-foreground mb-6">Unlimited mock tests unlocked for all categories.</p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 font-semibold" onClick={handleClose}>
                Start Practicing Now <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ) : step === 'processing' ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Processing Payment...</h3>
              <p className="text-sm text-muted-foreground mt-1">Please wait while we verify your payment</p>
            </div>
          ) : step === 'payment' ? (
            <>
              <div className="bg-blue-900 p-4 text-white">
                <div className="flex items-center justify-between">
                  <button onClick={() => setStep('form')} className="text-white/70 hover:text-white"><X className="w-5 h-5" /></button>
                  <span className="text-sm font-medium">Payment</span>
                  <span className="text-lg font-bold">₹100</span>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="bg-blue-50 rounded-xl p-3 flex items-center justify-between">
                  <div><p className="text-sm font-medium">TestWaleChacha Pro - Unlimited</p><p className="text-xs text-muted-foreground">{user?.email || 'One-time payment'}</p></div>
                  <p className="font-bold">₹100</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">PAYMENT METHOD</p>
                  <div className="space-y-2">
                    {[
                      { id: 'upi', icon: Smartphone, label: 'UPI / Google Pay / PhonePe', color: 'border-blue-500 bg-blue-50' },
                      { id: 'card', icon: CreditCard, label: 'Credit / Debit Card', color: '' },
                      { id: 'wallet', icon: Wallet, label: 'Wallets (Paytm, etc.)', color: '' },
                    ].map((m) => (
                      <button key={m.id} onClick={() => setPayMethod(m.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${payMethod === m.id ? m.color : 'border-gray-200 hover:border-gray-300'}`}>
                        <m.icon className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium flex-1">{m.label}</span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payMethod === m.id ? 'border-blue-600' : 'border-gray-300'}`}>
                          {payMethod === m.id && <div className="w-3 h-3 rounded-full bg-blue-600" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                {payMethod === 'upi' && (
                  <div><Label className="text-xs">UPI ID</Label><Input placeholder="yourname@upi" /></div>
                )}
                {payMethod === 'card' && (
                  <div className="space-y-2">
                    <div><Label className="text-xs">Card Number</Label><Input placeholder="1234 5678 9012 3456" /></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><Label className="text-xs">Expiry</Label><Input placeholder="MM/YY" /></div>
                      <div><Label className="text-xs">CVV</Label><Input placeholder="•••" type="password" /></div>
                    </div>
                  </div>
                )}
                <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 font-semibold" onClick={processPayment}>
                  Pay ₹100 Securely
                </Button>
                <p className="text-[10px] text-center text-muted-foreground">🔒 Payment secured by 256-bit SSL encryption</p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-gradient-to-br from-blue-800 to-blue-900 p-5 text-white relative">
                <button onClick={handleClose} className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/20"><X className="w-4 h-4" /></button>
                <Crown className="w-10 h-10 mb-2 text-amber-400" />
                <h2 className="text-xl font-bold">Upgrade to Pro</h2>
                <p className="text-blue-200 text-sm">Unlimited mock tests for all government exams</p>
              </div>
              <div className="p-5 space-y-4">
                <div className="text-center"><span className="text-3xl font-bold">₹100</span><span className="text-muted-foreground text-sm ml-1">one-time</span></div>
                <div className="space-y-2.5">
                  {[
                    { icon: BookOpen, text: 'Unlimited mock test attempts' },
                    { icon: Zap, text: 'All 10+ exam categories' },
                    { icon: Star, text: '100+ questions with solutions' },
                    { icon: Shield, text: 'Real exam-like interface' },
                  ].map((f) => (
                    <div key={f.text} className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600"><f.icon className="w-4 h-4" /></div>
                      <span className="text-sm">{f.text}</span>
                    </div>
                  ))}
                </div>
                {user?.email && (
                  <div className="bg-gray-50 rounded-xl p-3 text-sm">
                    <p className="text-xs text-muted-foreground">Account</p>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                )}
                {!user && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700">
                    <strong>Note:</strong> Please login/signup first for better tracking and to link your subscription.
                  </div>
                )}
                <Button className="w-full bg-blue-600 hover:bg-blue-700 h-11 font-semibold" onClick={() => setStep('payment')}>
                  Proceed to Pay ₹100 <ArrowRight className="w-4 h-4 ml-2 hidden sm:inline" />
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
