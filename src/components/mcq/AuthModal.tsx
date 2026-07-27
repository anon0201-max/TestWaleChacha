'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Mail, Lock, User, Phone, Eye, EyeOff,
  Loader2, ArrowRight, LogIn, UserPlus, CheckCircle2,
} from 'lucide-react';
import { Logo } from './Logo';

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

  // Track the previous showAuthModal value so we can sync `mode` ONLY when it changes
  // (official React pattern: "adjusting state when a prop changes").
  // This lets the user freely toggle login/signup inside the modal via switchMode(),
  // while still respecting the mode requested by the external opener (header/footer).
  const [prevShowAuthModal, setPrevShowAuthModal] = useState<'login' | 'signup' | null>(showAuthModal);
  if (showAuthModal !== prevShowAuthModal) {
    setPrevShowAuthModal(showAuthModal);
    if (showAuthModal && showAuthModal !== null) {
      setMode(showAuthModal);
      setError('');
      setSuccess('');
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
  }

  function switchMode(newMode: 'login' | 'signup' | 'forgot') {
    setMode(newMode);
    setError('');
    setSuccess('');
    setNewPassword('');
    setConfirmNewPassword('');
  }

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

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
        setError(data.error || 'Login failed');
      }
    } catch { setError('Server error. Please try again.'); }
    setLoading(false);
  }

  async function handleResetPassword() {
    setLoading(true);
    setError('');
    setSuccess('');
    if (!email || !newPassword || !confirmNewPassword) {
      setError('Email, new password, and confirm password are required');
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
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Password reset successfully! You can now login with your new password.');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setError(data.error || 'Failed to reset password');
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
        setError(data.error || 'Signup failed');
      }
    } catch { setError('Server error. Please try again.'); }
    setLoading(false);
  }

  if (!showAuthModal) return null;

  const tabClass = (active: boolean) =>
    active
      ? 'border-blue-600 text-blue-700 bg-blue-50/50'
      : 'border-transparent text-muted-foreground hover:text-foreground';

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
          className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="auth-modal-theme bg-gradient-to-br p-6 text-white relative">
            <button onClick={handleClose} className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/20 transition-colors">
              <X className="w-4 h-4" />
            </button>
            <div className="mb-3">
              <Logo size="md" variant="light" />
            </div>
            <h2 className="text-xl font-bold">
              {mode === 'login' ? 'Welcome Back!' : mode === 'forgot' ? 'Reset Password' : 'Create Account'}
            </h2>
            <p className="text-blue-200 text-sm mt-1">
              {mode === 'login'
                ? 'Login to track your progress and unlock all tests'
                : mode === 'forgot'
                  ? 'Enter your email to set a new password'
                  : 'Sign up for 5 free mock tests and detailed solutions'}
            </p>
          </div>

          {/* Mode Tabs */}
          <div className={`flex border-b ${mode === 'forgot' ? '' : ''}`}>
            <button onClick={() => switchMode('login')} className={'flex-1 py-3 text-sm font-medium transition-all border-b-2 ' + tabClass(mode === 'login')}>
              <LogIn className="w-4 h-4 inline mr-1.5" /> Login
            </button>
            <button onClick={() => switchMode('signup')} className={'flex-1 py-3 text-sm font-medium transition-all border-b-2 ' + tabClass(mode === 'signup')}>
              <UserPlus className="w-4 h-4 inline mr-1.5" /> Sign Up
            </button>
          </div>

          {/* Form */}
          <div className="p-5 space-y-4">
            {error && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">{error}</motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl p-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />{success}
              </motion.div>
            )}

            {mode === 'signup' && (
              <div>
                <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} className="pl-9 h-11" />
                </div>
              </div>
            )}

            <div>
              <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9 h-11" />
              </div>
              {mode === 'login' && (
                <p className="text-right mt-1">
                  <button onClick={() => switchMode('forgot')} className="text-xs text-blue-600 hover:text-blue-700 font-medium">Forgot Password?</button>
                </p>
              )}
            </div>

            {mode !== 'forgot' && (
            <div>
              <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={mode === 'login' ? 'Enter your password' : 'Min 6 characters'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-10 h-11"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            )}

            {mode === 'forgot' && (
              <>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-9 pr-10 h-11"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="pl-9 h-11"
                      onKeyDown={(e) => e.key === 'Enter' && handleResetPassword()}
                    />
                  </div>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 flex items-start gap-2 text-xs text-amber-700">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Enter the email you registered with and set a new password. Your old password will be replaced.</span>
                </div>
              </>
            )}
            {mode === 'signup' && (
              <div>
                <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Phone Number <span className="text-muted-foreground/60">(Optional)</span></Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="+91 XXXXX XXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-9 h-11" />
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div className="bg-blue-50 rounded-xl p-3 flex items-start gap-2 text-xs text-blue-700">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Get <strong>5 free mock tests</strong> on signup with detailed solutions and performance tracking</span>
              </div>
            )}

            <Button className="w-full bg-blue-600 hover:bg-blue-700 h-11 font-semibold" onClick={mode === 'forgot' ? handleResetPassword : mode === 'login' ? handleLogin : handleSignup} disabled={loading || !email || (mode !== 'forgot' && !password) || (mode === 'forgot' && (!newPassword || !confirmNewPassword))}>
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{mode === 'forgot' ? 'Resetting...' : mode === 'login' ? 'Logging in...' : 'Creating account...'}</>
              ) : (
                <>{mode === 'forgot' ? 'Reset Password' : mode === 'login' ? 'Login' : 'Create Account'}<ArrowRight className="w-4 h-4 ml-2" /></>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              {mode === 'forgot' ? 'Remember your password? ' : mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button onClick={() => switchMode(mode === 'forgot' ? 'login' : mode === 'login' ? 'signup' : 'login')} className="text-blue-600 hover:text-blue-700 font-medium">
                {mode === 'forgot' ? 'Login here' : mode === 'login' ? 'Sign up free' : 'Login here'}
              </button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
