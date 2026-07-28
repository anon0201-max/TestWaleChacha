'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown, CheckCircle2, Zap, BookOpen, Shield, Star, X, Sparkles, ArrowRight, Loader2,
} from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function SubscriptionModal() {
  const { showSubscriptionModal, setShowSubscriptionModal, deviceId, user, setUser, setStudentData } = useAppStore();
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');

  const studentId = user?.id || null;

  // Load Razorpay script
  useEffect(() => {
    if (showSubscriptionModal && typeof document !== 'undefined') {
      if (document.getElementById('razorpay-script')) return;
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, [showSubscriptionModal]);

  if (!showSubscriptionModal) return null;

  function handleClose() {
    setShowSubscriptionModal(false);
    setTimeout(() => setStep('form'), 200);
  }

  async function handlePay() {
    setStep('processing');

    try {
      // Step 1: Create Razorpay order from backend
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 100, deviceId: deviceId || undefined, studentId }),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.id) {
        setStep('form');
        alert('Failed to create payment order. Please try again.');
        return;
      }

      // Step 2: Open Razorpay Checkout
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'TestWaleChacha',
        description: 'Pro Subscription — Unlimited Mock Tests',
        image: 'https://test-wale-chacha.vercel.app/logo.png',
        order_id: orderData.id,
        handler: async function (response: any) {
          // Step 3: Verify payment on backend
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                studentId,
                deviceId: studentId ? undefined : deviceId,
                amount: orderData.amount,
              }),
            });
            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              if (verifyData.student) {
                setUser(verifyData.student);
              } else {
                setStudentData({ freeTestsUsed: 0, isSubscribed: true });
              }
              setStep('success');
            } else {
              setStep('form');
              alert('Payment verification failed. Contact support.');
            }
          } catch {
            setStep('form');
            alert('Error verifying payment. Please try again.');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: '',
        },
        notes: {
          deviceId: deviceId || '',
          studentId: studentId || '',
        },
        theme: {
          color: '#1d4ed8',
        },
        modal: {
          ondismiss: function () {
            setStep('form');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (_response: any) {
        setStep('form');
        alert('Payment failed. Please try again.');
      });
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
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
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Opening Payment...</h3>
              <p className="text-sm text-muted-foreground mt-1">Razorpay payment window is opening</p>
            </div>
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
                <div className="bg-gray-50 rounded-xl p-3 text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Payment Method</span>
                    <span className="text-xs font-medium">UPI, Cards & Wallets</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-xs">Powered by</span>
                    <span className="text-xs font-semibold text-gray-700">Razorpay</span>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2zm4 8h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                  </div>
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
                <Button className="w-full bg-blue-600 hover:bg-blue-700 h-11 font-semibold" onClick={handlePay} disabled={step === 'processing'}>
                  {step === 'processing' ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</> : <>Pay ₹100 Securely <ArrowRight className="w-4 h-4 ml-2 hidden sm:inline" /></>}
                </Button>
                <p className="text-[10px] text-center text-muted-foreground">🔒 Secured by Razorpay — 256-bit SSL encryption</p>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
