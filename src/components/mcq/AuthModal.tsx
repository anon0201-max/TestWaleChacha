'use client';

import { useState, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Mail, Lock, User, Phone, Eye, EyeOff,
  Loader2, ArrowRight, LogIn, UserPlus, CheckCircle2,
  KeyRound, ShieldCheck, ArrowLeft, RotateCcw,
} from 'lucide-react';
import { Logo } from './Logo';

// Forgot password flow states
type ForgotStep = 'enter-email' | 'enter-otp' | 'enter-password' | 'done';

export function AuthModal() {
  const {
    showAuthModal, setShowAuthModal, user, setUser, deviceId,
    setStudentData, pendingTestId, setPendingTestId, setCurrentTest,
    setIsTestActive, clearAnswers, setCurrentQuestionIndex, setTimeRemaining,
  } = useAppStore();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Forgot password state
  const [forgotStep, setForgotStep] = useState<ForgotStep>('enter-email');
  const [otpValue, setOtpValue] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [sentOtp, setSentOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpCooldown, setOtpCooldown] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Track the previous showAuthModal value so we can sync `mode` ONLY when it changes
  const [prevShowAuthModal, setPrevShowAuthModal] = useState<'login' | 'signup' | null>(showAuthModal);
  if (showAuthModal !== prevShowAuthModal) {
    setPrevShowAuthModal(showAuthModal);
    if (showAuthModal && showAuthModal !== null) {
      setMode(showAuthModal);
      setError('');
      setSuccess('');
      setForgotStep('enter-email');
      setOtpValue('');
      setSentOtp('');
      setResetToken('');
      setNewPassword('');
      setConfirmNewPassword('');
    }
  }

  async function startPendingTest() {
    const testId = pendingTestId;
    if (!testId) return;
    setPendingTestId(null);
    try {
      const res = await fetch(`/api/tests/${testId}?testId=${testId}`);
      if (res.ok) {
        const testData = await res.json();
        setCurrentTest(testData);
        clearAnswers();
        setCurrentQuestionIndex(0);
        setTimeRemaining(testData.timeLimit);
        setIsTestActive(true);
        useAppStore.getState().setView('test-taking');
      }
    } catch { /* silent */ }
  }

  function handleClose() {
    setShowAuthModal(null);
    setError('');
    setSuccess('');
    setMode('login');
    setName('');
    setEmail('');
    setPassword('');
    setPhone('');
    setForgotStep('enter-email');
    setOtpValue('');
    setSentOtp('');
    setResetToken('');
    setNewPassword('');
    setConfirmNewPassword('');
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function switchMode(newMode: 'login' | 'signup' | 'forgot') {
    setMode(newMode);
    setError('');
    setSuccess('');
    setNewPassword('');
    setConfirmNewPassword('');
    setForgotStep('enter-email');
    setOtpValue('');
    setSentOtp('');
    setResetToken('');
  }

  function startOtpTimer() {
    setOtpTimer(60);
    setOtpCooldown(true);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          setOtpCooldown(false);
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  async function handleLogin() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, deviceId }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.student);
        setStudentData({ freeTestsUsed: data.student.freeTestsUsed, isSubscribed: data.student.isSubscribed });
        handleClose();
        if (pendingTestId) startPendingTest();
      } else {
        setError(data.message || data.error || 'Login failed');
      }
    } catch { setError('Server error. Please try again.'); }
    setLoading(false);
  }

  async function handleSendOtp() {
    setLoading(true);
    setError('');
    setSuccess('');
    if (!email) {
      setError('Email is required');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSentOtp(data.otp || '');
        setForgotStep('enter-otp');
        setOtpValue('');
        setSuccess('');
        startOtpTimer();
      } else {
        setError(data.message || data.error || 'Failed to send OTP');
      }
    } catch { setError('Server error. Please try again.'); }
    setLoading(false);
  }

  async function handleVerifyOtp() {
    setLoading(true);
    setError('');
    if (!otpValue || otpValue.length !== 6) {
      setError('Please enter the 6-digit OTP');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpValue }),
      });
      const data = await res.json();
      if (data.success) {
        setResetToken(data.resetToken);
        setForgotStep('enter-password');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setError(data.message || data.error || 'Invalid OTP');
      }
    } catch { setError('Server error. Please try again.'); }
    setLoading(false);
  }

  async function handleResetPassword() {
    setLoading(true);
    setError('');
    if (!newPassword || !confirmNewPassword) {
      setError('New password and confirm password are required');
      setLoading(false);
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword, resetToken }),
      });
      const data = await res.json();
      if (data.success) {
        setForgotStep('done');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setError(data.message || data.error || 'Failed to reset password');
      }
    } catch { setError('Server error. Please try again.'); }
    setLoading(false);
  }

  async function handleSignup() {
    setLoading(true);
    setError('');
    if (!name || !email || !password) {
      setError('Name, email, and password are required');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, deviceId }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.student);
        setStudentData({ freeTestsUsed: data.student.freeTestsUsed, isSubscribed: data.student.isSubscribed });
        handleClose();
        if (pendingTestId) startPendingTest();
      } else {
        setError(data.message || data.error || 'Signup failed');
      }
    } catch { setError('Server error. Please try again.'); }
    setLoading(false);
  }

  if (!showAuthModal) return null;

  const tabClass = (active: boolean) =>
    active
      ? 'border-white text-white bg-white/10'
      : 'border-transparent text-white/60 hover:text-white';

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
          className="rounded-2xl max-w-md w-full shadow-2xl overflow-hidden" style={{ backgroundColor: '#1C1C84' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-[#2525A0] to-[#1C1C84] p-6 text-white relative">
            <button onClick={handleClose} className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/20 transition-colors">
              <X className="w-4 h-4" />
            </button>
            <div className="mb-3">
              <Logo size="md" variant="light" />
            </div>
            <h2 className="text-xl font-bold">
              {mode === 'login' ? 'Welcome Back!' : mode === 'forgot' ? 'Reset Password' : 'Create Account'}
            </h2>
            <p className="text-blue-200/80 text-sm mt-1">
              {mode === 'login'
                ? 'Login to track your progress and unlock all tests'
                : mode === 'forgot'
                  ? forgotStep === 'enter-email'
                    ? 'Enter your email to receive an OTP'
                    : forgotStep === 'enter-otp'
                      ? 'Enter the OTP sent to your email'
                      : forgotStep === 'enter-password'
                        ? 'Set your new password'
                        : 'Password reset successful!'
                  : 'Sign up for 2 free mock tests and detailed solutions'}
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex border-b border-white/10">
            <button onClick={() => switchMode('login')} className={'flex-1 py-3 text-sm font-medium transition-all border-b-2 ' + tabClass(mode === 'login')}>
              <LogIn className="w-4 h-4 inline mr-1.5" /> Login
            </button>
            <button onClick={() => switchMode('signup')} className={'flex-1 py-3 text-sm font-medium transition-all border-b-2 ' + tabClass(mode === 'signup')}>
              <UserPlus className="w-4 h-4 inline mr-1.5" /> Sign Up
            </button>
          </div>

          {/* Form */}
          <div className="p-5 space-y-4" style={{ backgroundColor: '#1A1A7A' }}>
            {error && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">{error}</motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl p-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />{success}
              </motion.div>
            )}

            {/* ===== SIGNUP: Name field ===== */}
            {mode === 'signup' && (
              <div>
                <Label className="text-xs font-medium text-blue-200/80 mb-1.5 block">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/70" />
                  <Input placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} className="pl-9 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40" />
                </div>
              </div>
            )}

            {/* ===== EMAIL field (login, signup, forgot step 1) ===== */}
            {(mode === 'login' || mode === 'signup' || (mode === 'forgot' && forgotStep === 'enter-email')) && (
              <div>
                <Label className="text-xs font-medium text-blue-200/80 mb-1.5 block">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/70" />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={mode === 'forgot' && forgotStep !== 'enter-email'}
                    className="pl-9 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 disabled:opacity-60"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && mode === 'login') handleLogin();
                      if (e.key === 'Enter' && mode === 'forgot' && forgotStep === 'enter-email') handleSendOtp();
                    }}
                  />
                </div>
              </div>
            )}

            {/* ===== PASSWORD field (login, signup) ===== */}
            {mode !== 'forgot' && (
              <div>
                <Label className="text-xs font-medium text-blue-200/80 mb-1.5 block">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/70" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={mode === 'login' ? 'Enter your password' : 'Min 6 characters'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && mode === 'login') handleLogin();
                      if (e.key === 'Enter' && mode === 'signup') handleSignup();
                    }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {mode === 'login' && (
                  <p className="text-right mt-1.5">
                    <button onClick={() => switchMode('forgot')} className="text-xs text-blue-300 hover:text-white font-medium">Forgot Password?</button>
                  </p>
                )}
              </div>
            )}

            {/* ===== FORGOT PASSWORD: Step indicator ===== */}
            {mode === 'forgot' && forgotStep !== 'done' && (
              <div className="flex items-center gap-2 px-1">
                {['enter-email', 'enter-otp', 'enter-password'].map((step, i) => (
                  <div key={step} className="flex items-center gap-2 flex-1">
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold shrink-0 ${
                      forgotStep === step ? 'bg-amber-400 text-[#1C1C84]' :
                      ['enter-email', 'enter-otp', 'enter-password'].indexOf(forgotStep) > i
                        ? 'bg-emerald-400 text-white' : 'bg-white/10 text-white/40'
                    }`}>
                      {['enter-email', 'enter-otp', 'enter-password'].indexOf(forgotStep) > i ? <CheckCircle2 className="w-3 h-3" /> : i + 1}
                    </div>
                    {i < 2 && <div className={`flex-1 h-0.5 ${['enter-email', 'enter-otp', 'enter-password'].indexOf(forgotStep) > i ? 'bg-emerald-400' : 'bg-white/10'}`} />}
                  </div>
                ))}
              </div>
            )}

            {/* ===== FORGOT: Step 1 - Send OTP ===== */}
            {mode === 'forgot' && forgotStep === 'enter-email' && (
              <div className="bg-white/10 rounded-xl p-3 flex items-start gap-2 text-xs text-blue-200">
                <KeyRound className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Enter the email you registered with. We'll send a <strong>6-digit OTP</strong> to verify your identity.</span>
              </div>
            )}

            {/* ===== FORGOT: Step 2 - Enter OTP ===== */}
            {mode === 'forgot' && forgotStep === 'enter-otp' && (
              <>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-blue-200/80">
                    <ShieldCheck className="w-4 h-4 text-blue-300" />
                    <span>Enter the 6-digit OTP sent to <strong className="text-white">{email}</strong></span>
                  </div>
                  <div className="flex justify-center py-2">
                    <InputOTP
                      maxLength={6}
                      value={otpValue}
                      onChange={(value) => { setOtpValue(value); setError(''); }}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="w-10 h-12 text-lg font-bold bg-white/10 border-white/20 text-white" />
                        <InputOTPSlot index={1} className="w-10 h-12 text-lg font-bold bg-white/10 border-white/20 text-white" />
                        <InputOTPSlot index={2} className="w-10 h-12 text-lg font-bold bg-white/10 border-white/20 text-white" />
                        <InputOTPSeparator />
                        <InputOTPSlot index={3} className="w-10 h-12 text-lg font-bold bg-white/10 border-white/20 text-white" />
                        <InputOTPSlot index={4} className="w-10 h-12 text-lg font-bold bg-white/10 border-white/20 text-white" />
                        <InputOTPSlot index={5} className="w-10 h-12 text-lg font-bold bg-white/10 border-white/20 text-white" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {sentOtp && (
                    <div className="bg-amber-500/10 border border-amber-400/20 rounded-lg p-2.5 text-center">
                      <p className="text-[10px] text-amber-300/70 mb-1">Development Mode — OTP Preview</p>
                      <p className="text-lg font-mono font-bold text-amber-300 tracking-widest">{sentOtp}</p>
                      <p className="text-[10px] text-amber-300/50 mt-1">In production, this will be sent via email</p>
                    </div>
                  )}
                </div>
                <Button
                  className="w-full bg-white text-[#1C1C84] hover:bg-white/90 h-11 font-semibold"
                  onClick={handleVerifyOtp}
                  disabled={loading || otpValue.length !== 6}
                >
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying...</> : <>Verify OTP<ArrowRight className="w-4 h-4 ml-2" /></>}
                </Button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setForgotStep('enter-email'); setOtpValue(''); }}
                    className="text-xs text-blue-300 hover:text-white font-medium flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3 h-3" /> Change Email
                  </button>
                  <div className="flex-1" />
                  <button
                    onClick={handleSendOtp}
                    disabled={otpCooldown || loading}
                    className="text-xs text-blue-300 hover:text-white font-medium flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <RotateCcw className="w-3 h-3" />
                    {otpCooldown ? `Resend in ${otpTimer}s` : 'Resend OTP'}
                  </button>
                </div>
              </>
            )}

            {/* ===== FORGOT: Step 3 - New Password ===== */}
            {mode === 'forgot' && forgotStep === 'enter-password' && (
              <>
                <div className="flex items-center gap-2 text-xs text-blue-200/80">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>OTP verified! Now set your new password.</span>
                </div>
                <div>
                  <Label className="text-xs font-medium text-blue-200/80 mb-1.5 block">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/70" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-9 pr-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-medium text-blue-200/80 mb-1.5 block">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/70" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="pl-9 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                      onKeyDown={(e) => e.key === 'Enter' && handleResetPassword()}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setForgotStep('enter-otp'); setNewPassword(''); setConfirmNewPassword(''); }}
                    className="text-xs text-blue-300 hover:text-white font-medium flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3 h-3" /> Back to OTP
                  </button>
                </div>
              </>
            )}

            {/* ===== FORGOT: Done ===== */}
            {mode === 'forgot' && forgotStep === 'done' && (
              <div className="text-center py-4 space-y-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15, delay: 0.1 }}
                  className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto"
                >
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </motion.div>
                <p className="text-white font-semibold">Password Reset Successfully!</p>
                <p className="text-blue-200/80 text-sm">You can now login with your new password.</p>
                <Button
                  className="w-full bg-white text-[#1C1C84] hover:bg-white/90 h-11 font-semibold"
                  onClick={() => switchMode('login')}
                >
                  <LogIn className="w-4 h-4 mr-2" />Login Now
                </Button>
              </div>
            )}

            {/* ===== SIGNUP: Phone field ===== */}
            {mode === 'signup' && (
              <div>
                <Label className="text-xs font-medium text-blue-200/80 mb-1.5 block">Phone Number <span className="text-blue-200/40">(Optional)</span></Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/70" />
                  <Input placeholder="+91 XXXXX XXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-9 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40" />
                </div>
              </div>
            )}

            {/* ===== SIGNUP: Info ===== */}
            {mode === 'signup' && (
              <div className="bg-white/10 rounded-xl p-3 flex items-start gap-2 text-xs text-blue-200">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Get <strong>2 free mock tests</strong> on signup with detailed solutions and performance tracking</span>
              </div>
            )}

            {/* ===== Main action button (login, signup, forgot step 1, forgot step 3) ===== */}
            {(mode !== 'forgot' || forgotStep === 'enter-email' || forgotStep === 'enter-password') && forgotStep !== 'done' && forgotStep !== 'enter-otp' && (
              <Button
                className="w-full bg-white text-[#1C1C84] hover:bg-white/90 h-11 font-semibold"
                onClick={
                  mode === 'forgot' && forgotStep === 'enter-email' ? handleSendOtp :
                  mode === 'forgot' && forgotStep === 'enter-password' ? handleResetPassword :
                  mode === 'login' ? handleLogin : handleSignup
                }
                disabled={
                  loading ||
                  !email ||
                  (mode === 'login' && !password) ||
                  (mode === 'signup' && (!name || !password)) ||
                  (mode === 'forgot' && forgotStep === 'enter-password' && (!newPassword || !confirmNewPassword))
                }
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{mode === 'forgot' ? 'Processing...' : mode === 'login' ? 'Logging in...' : 'Creating account...'}</>
                ) : (
                  <>{mode === 'forgot' ? (forgotStep === 'enter-email' ? 'Send OTP' : 'Reset Password') : mode === 'login' ? 'Login' : 'Create Account'}<ArrowRight className="w-4 h-4 ml-2" /></>
                )}
              </Button>
            )}

            {/* ===== Footer links ===== */}
            {forgotStep !== 'done' && (
              <p className="text-center text-xs text-white/60">
                {mode === 'forgot'
                  ? 'Remember your password? '
                  : mode === 'login'
                    ? "Don't have an account? "
                    : 'Already have an account? '
                }
                <button
                  onClick={() => switchMode(
                    mode === 'forgot' ? 'login' :
                    mode === 'login' ? 'signup' : 'login'
                  )}
                  className="text-blue-300 hover:text-white font-medium"
                >
                  {mode === 'forgot' ? 'Login here' : mode === 'login' ? 'Sign up free' : 'Login here'}
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
