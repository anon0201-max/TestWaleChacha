'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  ArrowLeft, LogOut, Plus, Trash2, BarChart3, BookOpen, Users, CreditCard,
  Save, Shield, FileText, Settings, Edit2, Eye, EyeOff, Copy, CheckCircle2,
  Crown, ChevronRight, ChevronDown, GripVertical, X, AlertTriangle, Search, LayoutGrid,
  HelpCircle, Pencil, Camera, FileUp, Upload, Loader2, Filter, Receipt, UserX, Wallet, BadgeCheck, BadgeX,
  Menu,
} from 'lucide-react';

// ==================== ADMIN LOGIN ====================
function AdminLogin() {
  const { setAdminData } = useAppStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [adminForgotOpen, setAdminForgotOpen] = useState(false);
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleLogin() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        setAdminData({ isLoggedIn: true });
      } else {
        setError(data.error || 'Login failed');
      }
    } catch { setError('Server error'); }
    setLoading(false);
  }

  async function handleAdminForgotPassword() {
    setForgotMsg(null);
    if (!forgotNewPassword || !forgotConfirmPassword) {
      setForgotMsg({ type: 'error', text: 'All fields are required' });
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotMsg({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    if (forgotNewPassword.length < 4) {
      setForgotMsg({ type: 'error', text: 'Password must be at least 4 characters' });
      return;
    }
    setForgotLoading(true);
    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: '', newPassword: forgotNewPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setForgotMsg({ type: 'success', text: 'Admin password reset successfully! You can now login with the new password.' });
        setForgotNewPassword('');
        setForgotConfirmPassword('');
      } else {
        setForgotMsg({ type: 'error', text: data.error || 'Failed to reset password' });
      }
    } catch {
      setForgotMsg({ type: 'error', text: 'Server error. Please try again.' });
    }
    setForgotLoading(false);
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 pt-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
        <Card className="w-full max-w-md mx-auto shadow-xl border-0">
          <CardContent className="p-5 sm:p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-700 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Admin Login</h2>
              <p className="text-xs text-muted-foreground mt-1">Enter credentials to manage tests & questions</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Username</Label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" className="h-11" />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 pr-10"
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <p className="text-right">
                <button onClick={() => setAdminForgotOpen(true)} className="text-xs text-blue-600 hover:text-blue-700 font-medium">Forgot Password?</button>
              </p>
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
                </motion.div>
              )}
              <Button className="w-full bg-blue-700 hover:bg-blue-800 h-11 font-semibold" onClick={handleLogin} disabled={loading || !username || !password}>
                {loading ? 'Logging in...' : 'Login to Admin Panel'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Admin Forgot Password Dialog */}
        <Dialog open={adminForgotOpen} onOpenChange={(open) => { if (!open) { setAdminForgotOpen(false); setForgotMsg(null); } }}>
          <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base"><Shield className="w-5 h-5 text-blue-600" />Reset Admin Password</DialogTitle>
              <DialogDescription className="text-xs">Set a new password for admin login</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              {forgotMsg && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-xl text-sm flex items-center gap-2 border ${
                    forgotMsg.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
                  }`}>
                  {forgotMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                  {forgotMsg.text}
                </motion.div>
              )}
              <div>
                <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">New Password</Label>
                <Input type="password" value={forgotNewPassword} onChange={(e) => setForgotNewPassword(e.target.value)} placeholder="Enter new password (min 4 chars)" className="h-11" />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Confirm New Password</Label>
                <Input type="password" value={forgotConfirmPassword} onChange={(e) => setForgotConfirmPassword(e.target.value)} placeholder="Confirm new password" className="h-11" onKeyDown={(e) => e.key === 'Enter' && handleAdminForgotPassword()} />
              </div>
              <div className="flex gap-2">
                <DialogClose asChild>
                  <Button variant="outline" className="flex-1 h-11">Cancel</Button>
                </DialogClose>
                <Button className="flex-1 h-11 bg-blue-700 hover:bg-blue-800 font-semibold" onClick={handleAdminForgotPassword} disabled={forgotLoading || !forgotNewPassword || !forgotConfirmPassword}>
                  {forgotLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Resetting...</> : <><Save className="w-4 h-4 mr-2" />Reset Password</>}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}

// ==================== ADMIN PANEL ====================
export function AdminPanel() {
  const { setView, setAdminData, adminData, categories, setCategories, tests, setTests } = useAppStore();
  const [activeTab, setActiveTab] = useState('dashboard');

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setAdminData({ stats: data });
      }
    } catch {}
  }, [setAdminData]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) setCategories(await res.json());
    } catch {}
  }, [setCategories]);

  const fetchTests = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/tests');
      if (res.ok) setTests(await res.json());
    } catch {}
  }, [setTests]);

  useEffect(() => {
    if (adminData.isLoggedIn) {
      fetchStats();
      fetchCategories();
      fetchTests();
    }
  }, [adminData.isLoggedIn, fetchStats, fetchCategories, fetchTests]);

  if (!adminData.isLoggedIn) return <AdminLogin />;

  const stats = adminData.stats;

  return (
    <div className="min-h-[80vh] bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white border-b sticky top-14 z-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Button variant="ghost" size="icon" onClick={() => setView('home')} className="h-9 w-9 shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2 min-w-0">
              <Shield className="w-5 h-5 text-blue-700 shrink-0" />
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base font-bold text-gray-900 truncate">Admin Panel</h1>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground -mt-0.5 hidden sm:block">Manage tests, questions & categories</p>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setAdminData({ isLoggedIn: false })} className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0">
            <LogOut className="w-3.5 h-3.5 sm:mr-1.5" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>

      {/* Admin Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-5">
        {/* Stats Cards — more compact on mobile */}
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-4 sm:mb-5">
          {[
            { icon: Users, label: 'Users', value: stats.totalStudents, color: 'bg-blue-50 text-blue-700', iconBg: 'bg-blue-100' },
            { icon: BadgeCheck, label: 'Paid', value: stats.totalPaidStudents, color: 'bg-emerald-50 text-emerald-700', iconBg: 'bg-emerald-100' },
            { icon: BadgeX, label: 'Free', value: stats.totalFreeStudents, color: 'bg-gray-50 text-gray-600', iconBg: 'bg-gray-100' },
            { icon: FileText, label: 'Tests', value: stats.totalTests, color: 'bg-indigo-50 text-indigo-700', iconBg: 'bg-indigo-100' },
            { icon: HelpCircle, label: 'Questions', value: stats.totalQuestions, color: 'bg-amber-50 text-amber-700', iconBg: 'bg-amber-100' },
            { icon: CreditCard, label: 'Payments', value: stats.totalPayments, color: 'bg-purple-50 text-purple-700', iconBg: 'bg-purple-100' },
          ].map((item) => (
            <Card key={item.label} className="border-0 shadow-sm">
              <CardContent className="p-2 sm:p-3 lg:p-4 flex flex-col lg:flex-row items-center gap-1.5 lg:gap-3">
                <div className={`p-1.5 sm:p-2 rounded-lg lg:rounded-xl ${item.iconBg}`}><item.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 ${item.color.split(' ')[1]}`} /></div>
                <div className="text-center lg:text-left">
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">{item.value}</p>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground leading-tight">{item.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs — horizontally scrollable on mobile, icon-only on mobile */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="mb-4 sm:mb-5 -mx-3 sm:mx-0">
            <TabsList className="bg-white border mb-0 h-auto p-1 w-full inline-flex overflow-x-auto no-scrollbar gap-0.5">
              {[
                { value: 'dashboard', icon: LayoutGrid, label: 'Dashboard' },
                { value: 'categories', icon: BookOpen, label: 'Categories' },
                { value: 'tests', icon: FileText, label: 'Tests' },
                { value: 'create-test', icon: Plus, label: 'Create' },
                { value: 'users', icon: Users, label: 'Users' },
                { value: 'payments', icon: Wallet, label: 'Payments' },
                { value: 'settings', icon: Settings, label: 'Settings' },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="text-xs gap-1 sm:gap-1.5 data-[state=active]:bg-blue-700 data-[state=active]:text-white whitespace-nowrap flex-shrink-0 px-2 sm:px-3 py-2"
                >
                  <tab.icon className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="dashboard">
            <AdminDashboardContent onNavigate={setActiveTab} />
          </TabsContent>
          <TabsContent value="categories">
            <AdminCategoriesTab onRefresh={fetchCategories} />
          </TabsContent>
          <TabsContent value="tests">
            <AdminTestsTab onRefresh={fetchTests} />
          </TabsContent>
          <TabsContent value="create-test">
            <AdminCreateTestTab onCreated={fetchTests} />
          </TabsContent>
          <TabsContent value="users">
            <AdminUsersTab onRefresh={fetchStats} />
          </TabsContent>
          <TabsContent value="payments">
            <AdminPaymentsTab />
          </TabsContent>
          <TabsContent value="settings">
            <AdminSettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ==================== DASHBOARD ====================
function AdminDashboardContent({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { tests, categories } = useAppStore();

  return (
    <div className="space-y-3 sm:space-y-5">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Categories</span>
              <Badge variant="secondary" className="text-[10px]">{categories.length}</Badge>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {categories.slice(0, 6).map((cat) => (
                <Badge key={cat.id} className="text-[10px] font-normal" style={{ backgroundColor: cat.color + '20', color: cat.color, border: 'none' }}>
                  {cat.name}
                </Badge>
              ))}
              {categories.length > 6 && <Badge variant="secondary" className="text-[10px]">+{categories.length - 6}</Badge>}
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Active Tests</span>
              <Badge variant="secondary" className="text-[10px]">{tests.filter(t => t.isActive).length}</Badge>
            </div>
            <div className="space-y-1.5">
              {tests.slice(0, 4).map((t) => (
                <div key={t.id} className="flex items-center justify-between text-xs">
                  <span className="truncate max-w-[120px] sm:max-w-[150px]">{t.title}</span>
                  <span className="text-muted-foreground">{t.totalQuestions}Q</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Quick Actions</span>
            </div>
            <div className="space-y-2">
              <Button size="sm" variant="outline" className="w-full justify-start text-xs gap-2 h-8" onClick={() => onNavigate('create-test')}>
                <Plus className="w-3.5 h-3.5" /> Add New Test
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start text-xs gap-2 h-8" onClick={() => onNavigate('categories')}>
                <Plus className="w-3.5 h-3.5" /> Add Category
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tests */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-3 sm:p-4">
          <h3 className="text-sm font-semibold mb-3">All Tests</h3>
          <div className="space-y-2">
            {tests.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No tests yet. Create your first test!</p>
            ) : (
              tests.map((test) => (
                <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                      {test.category?.name?.charAt(0) || '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{test.title}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{test.category?.name} · {test.totalQuestions}Q · {test.difficulty}</p>
                    </div>
                  </div>
                  <Badge variant={test.isActive ? 'default' : 'secondary'} className="text-[10px] shrink-0">
                    {test.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ==================== CATEGORIES TAB ====================
function AdminCategoriesTab({ onRefresh }: { onRefresh: () => void }) {
  const { categories, setCategories } = useAppStore();
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newExamType, setNewExamType] = useState('General');
  const [adding, setAdding] = useState(false);

  async function handleAdd() {
    if (!newName || !newSlug) return;
    setAdding(true);
    await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, slug: newSlug, examType: newExamType }),
    });
    setNewName(''); setNewSlug('');
    setAdding(false);
    onRefresh();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this category and ALL its tests & questions? This cannot be undone.')) return;
    await fetch('/api/admin/categories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    onRefresh();
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Add Category */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-3 sm:p-5">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Plus className="w-4 h-4 text-blue-600" /> Add New Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <Label className="text-xs">Category Name</Label>
              <Input
                placeholder="e.g., SSC CGL"
                value={newName}
                onChange={(e) => { setNewName(e.target.value); setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')); }}
                className="h-10"
              />
            </div>
            <div>
              <Label className="text-xs">URL Slug</Label>
              <Input placeholder="ssc-cgl" value={newSlug} onChange={(e) => setNewSlug(e.target.value)} className="h-10" />
            </div>
            <div>
              <Label className="text-xs">Exam Type</Label>
              <select className="w-full border rounded-md px-3 py-2 text-sm h-10 bg-white" value={newExamType} onChange={(e) => setNewExamType(e.target.value)}>
                {['General', 'SSC', 'UPSC', 'Banking', 'Railways', 'State', 'Defence'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <Button size="sm" className="bg-blue-700 hover:bg-blue-800 mt-3" onClick={handleAdd} disabled={!newName || !newSlug || adding}>
            {adding ? 'Adding...' : <><Plus className="w-3.5 h-3.5 mr-1" /> Add Category</>}
          </Button>
        </CardContent>
      </Card>

      {/* Categories List */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-3 sm:p-5">
          <h3 className="text-sm font-semibold mb-3">All Categories ({categories.length})</h3>
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="w-2 h-8 sm:h-10 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{cat.name}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <Badge variant="secondary" className="text-[10px]">{cat.examType}</Badge>
                      <span className="text-[10px] text-muted-foreground">{cat._count.tests} tests</span>
                      <span className="text-[10px] text-muted-foreground hidden sm:inline">/{cat.slug}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDelete(cat.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {categories.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No categories yet</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ==================== TESTS TAB ====================
function AdminTestsTab({ onRefresh }: { onRefresh: () => void }) {
  const { tests } = useAppStore();
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);
  const [testQuestions, setTestQuestions] = useState<Record<string, unknown[]>>({});
  const [loadingQ, setLoadingQ] = useState<string | null>(null);

  async function fetchQuestions(testId: string) {
    if (testQuestions[testId]) {
      setExpandedTestId(expandedTestId === testId ? null : testId);
      return;
    }
    setLoadingQ(testId);
    try {
      const res = await fetch(`/api/tests/${testId}`);
      if (res.ok) {
        const data = await res.json();
        setTestQuestions(prev => ({ ...prev, [testId]: data.questions || [] }));
        setExpandedTestId(testId);
      }
    } catch {}
    setLoadingQ(null);
  }

  async function handleDeleteTest(id: string) {
    if (!confirm('Delete this test and ALL its questions? This cannot be undone.')) return;
    await fetch('/api/admin/tests', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    onRefresh();
  }

  async function handleDeleteQuestion(questionId: string, testId: string) {
    if (!confirm('Delete this question?')) return;
    await fetch('/api/admin/tests/questions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId }),
    });
    const res = await fetch(`/api/tests/${testId}`);
    if (res.ok) {
      const data = await res.json();
      setTestQuestions(prev => ({ ...prev, [testId]: data.questions || [] }));
    }
    onRefresh();
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">Tests ({tests.length})</h3>
        <Badge variant="secondary" className="text-[10px] shrink-0">{tests.reduce((s, t) => s + t.totalQuestions, 0)}Q</Badge>
      </div>

      {tests.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-10 text-center">
            <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No tests yet. Go to &quot;Create&quot; tab to add your first test.</p>
          </CardContent>
        </Card>
      ) : (
        tests.map((test) => (
          <Card key={test.id} className="border-0 shadow-sm overflow-hidden">
            <div
              className="p-3 sm:p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors gap-2"
              onClick={() => fetchQuestions(test.id)}
            >
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: test.category?.color || '#1e40af' }}>
                  {test.category?.name?.charAt(0) || 'T'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{test.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <Badge variant="secondary" className="text-[10px]">{test.category?.name}</Badge>
                    <span className="text-[10px] text-muted-foreground">{test.totalQuestions}Q</span>
                    <span className="text-[10px] text-muted-foreground hidden sm:inline">{test.difficulty}</span>
                    <span className="text-[10px] text-muted-foreground">{Math.floor(test.timeLimit / 60)}m</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                {loadingQ === test.id ? (
                  <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={(e) => { e.stopPropagation(); handleDeleteTest(test.id); }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    {expandedTestId === test.id ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Questions List */}
            <AnimatePresence>
              {expandedTestId === test.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="border-t bg-gray-50 p-3 sm:p-4 space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground">
                      Questions ({(testQuestions[test.id] || []).length})
                    </h4>
                    {(testQuestions[test.id] || []).length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">No questions in this test</p>
                    ) : (
                      (testQuestions[test.id] as Array<Record<string, unknown>>).map((q, i) => (
                        <div key={String(q.id)} className="bg-white rounded-lg p-3 border text-xs group">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-blue-700 shrink-0">Q{i + 1}.</span>
                                <span className="text-gray-700">{String(q.question).substring(0, 80)}{String(q.question).length > 80 ? '...' : ''}</span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.5 ml-5 text-muted-foreground">
                                <div className={String(q.correctOption) === 'A' ? 'text-green-700 font-medium' : ''}>
                                  A. {String(q.optionA)}
                                </div>
                                <div className={String(q.correctOption) === 'B' ? 'text-green-700 font-medium' : ''}>
                                  B. {String(q.optionB)}
                                </div>
                                <div className={String(q.correctOption) === 'C' ? 'text-green-700 font-medium' : ''}>
                                  C. {String(q.optionC)}
                                </div>
                                <div className={String(q.correctOption) === 'D' ? 'text-green-700 font-medium' : ''}>
                                  D. {String(q.optionD)}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                              onClick={() => handleDeleteQuestion(String(q.id), test.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))
      )}
    </div>
  );
}

// ==================== CREATE TEST TAB ====================
interface QuestionForm {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation: string;
  section: string;
  negativeMark: string;
}

const emptyQuestion = (): QuestionForm => ({
  question: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correctOption: 'A',
  explanation: '',
  section: 'General',
  negativeMark: '0',
});

function AdminCreateTestTab({ onCreated }: { onCreated: () => void }) {
  const { categories } = useAppStore();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Test details
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [catId, setCatId] = useState('');
  const [diff, setDiff] = useState('medium');
  const [time, setTime] = useState('600');
  const [examName, setExamName] = useState('');

  // Step 2: Questions
  const [questions, setQuestions] = useState<QuestionForm[]>([emptyQuestion()]);
  const [createdTestId, setCreatedTestId] = useState('');

  // Step 3: Done
  const [savedCount, setSavedCount] = useState(0);
  const [saving, setSaving] = useState(false);

  // Import states
  const [extractingImage, setExtractingImage] = useState(false);
  const [extractElapsed, setExtractElapsed] = useState(0);
  const [importingAnswers, setImportingAnswers] = useState(false);
  const [importingExplanations, setImportingExplanations] = useState(false);
  const [fillStatus, setFillStatus] = useState<{ msg: string; type: 'info' | 'success' | 'error' } | null>(null);

  // Count dialog state
  const [showCountDialog, setShowCountDialog] = useState(false);
  const [questionCount, setQuestionCount] = useState('');
  const fillStartIndexRef = useRef<number>(0);

  // File input refs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const answersInputRef = useRef<HTMLInputElement>(null);
  const explanationsInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const filledCount = questions.filter(q => q.question.trim() !== '').length;
    console.log(`📊 questions state changed — total: ${questions.length}, filled: ${filledCount}, empty: ${questions.length - filledCount}`);
  }, [questions]);

  function addQuestion() {
    setQuestions([...questions, emptyQuestion()]);
  }

  function updateQ(i: number, field: keyof QuestionForm, value: string) {
    const updated = [...questions];
    updated[i] = { ...updated[i], [field]: value };
    setQuestions(updated);
  }

  function removeQ(i: number) {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, idx) => idx !== i));
  }

  function duplicateQ(i: number) {
    const updated = [...questions];
    updated.splice(i + 1, 0, { ...questions[i] });
    setQuestions(updated);
  }

  async function createTest() {
    if (!title || !catId) return;
    const res = await fetch('/api/admin/tests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description: desc, categoryId: catId, difficulty: diff, timeLimit: parseInt(time), examName: examName || 'Practice Test' }),
    });
    const data = await res.json();
    setCreatedTestId(data.id);
    setStep(2);
  }

  async function saveQuestions() {
    const valid = questions.filter(q => q.question.trim() && q.optionA.trim() && q.optionB.trim() && q.optionC.trim() && q.optionD.trim());
    if (valid.length === 0) return;
    setSaving(true);
    const res = await fetch('/api/admin/tests/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testId: createdTestId, questions: valid }),
    });
    if (res.ok) {
      const data = await res.json();
      setSavedCount(data.created || valid.length);
      setStep(3);
    }
    setSaving(false);
  }

  function resetAll() {
    setStep(1);
    setTitle('');
    setDesc('');
    setCatId('');
    setDiff('medium');
    setTime('600');
    setExamName('');
    setQuestions([emptyQuestion()]);
    setCreatedTestId('');
    setSavedCount(0);
  }

  function openCountDialog() {
    if (extractingImage) return;
    setQuestionCount('');
    setShowCountDialog(true);
  }

  function confirmCountAndPickImage() {
    const n = parseInt(questionCount, 10);
    if (!n || n < 1 || n > 200) {
      toast.error('Please enter a valid number between 1 and 200');
      return;
    }
    setQuestions(prev => {
      let cleaned = prev.filter(q => {
        const isEmpty = !q.question.trim() && !q.optionA.trim() && !q.optionB.trim() && !q.optionC.trim() && !q.optionD.trim() && !q.explanation.trim();
        return !isEmpty;
      });
      fillStartIndexRef.current = cleaned.length;
      const newBoxes: QuestionForm[] = Array.from({ length: n }, () => emptyQuestion());
      return [...cleaned, ...newBoxes];
    });
    setShowCountDialog(false);
    toast.success(`✅ ${n} empty question boxes created! Ab image select karein...`);
    setTimeout(() => {
      imageInputRef.current?.click();
    }, 100);
  }

  function fillQuestionsFromExtract(extracted: QuestionForm[]): number {
    if (!extracted || extracted.length === 0) {
      setFillStatus({ msg: '⚠️ No questions received from VLM to fill.', type: 'error' });
      return 0;
    }
    setFillStatus({ msg: `🔧 Filling ${extracted.length} questions into boxes...`, type: 'info' });
    let filledCount = 0;
    setQuestions(prev => {
      const next = [...prev];
      let startIdx = -1;
      for (let i = 0; i < next.length; i++) {
        if (!next[i].question.trim()) { startIdx = i; break; }
      }
      if (startIdx === -1) {
        for (const ex of extracted) { next.push(ex); filledCount++; }
      } else {
        for (let k = 0; k < extracted.length; k++) {
          const targetIdx = startIdx + k;
          if (targetIdx < next.length) { next[targetIdx] = { ...next[targetIdx], ...extracted[k] }; }
          else { next.push(extracted[k]); }
          filledCount++;
        }
      }
      return next;
    });
    setTimeout(() => {
      setFillStatus({ msg: `✅ ${extracted.length} questions filled into boxes!`, type: 'success' });
      setTimeout(() => setFillStatus(null), 8000);
    }, 100);
    return filledCount;
  }

  async function handleImageExtract(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);
    setExtractingImage(true);
    setExtractElapsed(0);
    const startTime = Date.now();
    const timerInterval = setInterval(() => {
      setExtractElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    try {
      let totalExtracted = 0;
      let hasError = false;
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const formData = new FormData();
        formData.append('image', file);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 300000);
        try {
          setFillStatus({ msg: `📤 Uploading image to VLM... (this can take 1-3 minutes)`, type: 'info' });
          const res = await fetch('/api/admin/extract-question', { method: 'POST', body: formData, signal: controller.signal });
          clearTimeout(timeoutId);
          if (!res.ok) {
            const errText = await res.text().catch(() => 'Unknown error');
            setFillStatus({ msg: `❌ VLM error (HTTP ${res.status}): ${errText.substring(0, 100)}`, type: 'error' });
            toast.error(`Image ${i + 1}: VLM returned HTTP ${res.status}`);
            hasError = true;
            continue;
          }
          const data = await res.json();
          if (data.success && data.questions && data.questions.length > 0) {
            const newQuestions: QuestionForm[] = data.questions.map((q: any) => ({
              question: q.question || '', optionA: q.optionA || '', optionB: q.optionB || '', optionC: q.optionC || '', optionD: q.optionD || '',
              correctOption: q.correctOption || 'A', explanation: q.explanation || '', section: q.section || 'General', negativeMark: q.negativeMark || '0',
            }));
            fillQuestionsFromExtract(newQuestions);
            totalExtracted += newQuestions.length;
            toast.success(`Image ${i + 1}: ${newQuestions.length} questions extracted & filled!`);
          } else if (data.success && data.question) {
            const newQ: QuestionForm = {
              question: data.question.question || '', optionA: data.question.optionA || '', optionB: data.question.optionB || '', optionC: data.question.optionC || '', optionD: data.question.optionD || '',
              correctOption: data.question.correctOption || 'A', explanation: data.question.explanation || '', section: data.question.section || 'General', negativeMark: data.question.negativeMark || '0',
            };
            fillQuestionsFromExtract([newQ]);
            totalExtracted += 1;
            toast.success(`Image ${i + 1}: 1 question extracted & filled!`);
          } else {
            hasError = true;
            setFillStatus({ msg: `❌ ${data.error || 'Failed to extract questions'}`, type: 'error' });
            toast.error(`Image ${i + 1}: ${data.error || 'Failed to extract'}`);
          }
        } catch (err: any) {
          clearTimeout(timeoutId);
          hasError = true;
          if (err?.name === 'AbortError') {
            setFillStatus({ msg: '❌ Timed out (5 min). Try a smaller image.', type: 'error' });
          } else {
            setFillStatus({ msg: `❌ ${err?.message || 'Failed to extract'}`, type: 'error' });
          }
        }
      }
      if (totalExtracted > 0) {
        toast.success(`🎉 Total: ${totalExtracted} questions extracted!`);
      } else if (!hasError) {
        toast.error('No questions could be extracted. Empty boxes remain for manual entry.');
      }
    } finally {
      clearInterval(timerInterval);
      setExtractingImage(false);
      setExtractElapsed(0);
      e.target.value = '';
    }
  }

  async function handleImportAnswers(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportingAnswers(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('testId', createdTestId);
      const res = await fetch('/api/admin/import-answers', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) { toast.success(`Updated ${data.updated} correct answers successfully!`); }
      else { toast.error(data.error || 'Failed to import answers'); }
    } catch { toast.error('Failed to import answers.'); }
    finally { setImportingAnswers(false); e.target.value = ''; }
  }

  async function handleImportExplanations(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportingExplanations(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('testId', createdTestId);
      const res = await fetch('/api/admin/import-explanations', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) { toast.success(`Updated ${data.updated} explanations successfully!`); }
      else { toast.error(data.error || 'Failed to import explanations'); }
    } catch { toast.error('Failed to import explanations.'); }
    finally { setImportingExplanations(false); e.target.value = ''; }
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Step Indicator — compact on mobile */}
      <div className="flex items-center gap-1 sm:gap-2 mb-2 overflow-x-auto">
        {[
          { n: 1, label: 'Details' },
          { n: 2, label: 'Questions' },
          { n: 3, label: 'Done' },
        ].map((s) => (
          <div key={s.n} className="flex items-center gap-1 sm:gap-2 shrink-0">
            <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step > s.n ? 'bg-green-600 text-white' : step === s.n ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step > s.n ? <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" /> : s.n}
            </div>
            <span className={`text-xs font-medium hidden sm:inline ${step === s.n ? 'text-gray-900' : 'text-muted-foreground'}`}>{s.label}</span>
            {s.n < 3 && <div className={`w-4 sm:w-8 h-0.5 ${step > s.n ? 'bg-green-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Test Details */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 sm:p-5 space-y-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold flex items-center gap-2 mb-1"><FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" /> Test Information</h3>
                <p className="text-xs text-muted-foreground">Fill in the basic details for your mock test</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="sm:col-span-2">
                  <Label className="text-xs font-medium">Test Title *</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., SSC CGL 2024 - General Awareness" className="h-11" />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-xs font-medium">Description</Label>
                  <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Brief description..." className="min-h-[70px] sm:min-h-[80px] resize-none" />
                </div>
                <div>
                  <Label className="text-xs font-medium">Category *</Label>
                  <select className="w-full border rounded-md px-3 py-2.5 text-sm h-11 bg-white" value={catId} onChange={(e) => setCatId(e.target.value)}>
                    <option value="">Select category...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name} ({c.examType})</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-xs font-medium">Exam Name</Label>
                  <Input value={examName} onChange={(e) => setExamName(e.target.value)} placeholder="e.g., SSC CGL 2024" className="h-11" />
                </div>
                <div>
                  <Label className="text-xs font-medium">Difficulty</Label>
                  <select className="w-full border rounded-md px-3 py-2.5 text-sm h-11 bg-white" value={diff} onChange={(e) => setDiff(e.target.value)}>
                    {['easy', 'medium', 'hard'].map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-xs font-medium">Time Limit (sec)</Label>
                  <Input type="number" value={time} onChange={(e) => setTime(e.target.value)} className="h-11" />
                  <p className="text-[10px] text-muted-foreground mt-1">600s = 10min</p>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button className="bg-blue-700 hover:bg-blue-800 font-semibold" onClick={createTest} disabled={!title || !catId}>
                  Next <ChevronRight className="w-4 h-4 ml-1 sm:ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 2: Add Questions */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3 sm:space-y-4">
          {/* Quick Stats Bar */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">{questions.length}Q</Badge>
              <Badge variant="outline" className="text-xs">
                {questions.filter(q => q.question.trim() && q.optionA.trim()).length} done
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={addQuestion} className="gap-1.5 text-xs">
              <Plus className="w-3.5 h-3.5" /> Add Q
            </Button>
          </div>

          {/* Hidden file inputs */}
          <input type="file" ref={imageInputRef} accept="image/*" onChange={handleImageExtract} className="hidden" />
          <input type="file" ref={answersInputRef} accept=".txt,.csv" onChange={handleImportAnswers} className="hidden" />
          <input type="file" ref={explanationsInputRef} accept=".txt" onChange={handleImportExplanations} className="hidden" />

          {/* Import Actions Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            {fillStatus && (
              <div className={`w-full p-2.5 sm:p-3 rounded-lg border flex items-center gap-2 text-xs sm:text-sm font-medium ${
                fillStatus.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
                fillStatus.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
                'bg-blue-50 border-blue-200 text-blue-800'
              }`}>
                {fillStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> :
                 fillStatus.type === 'error' ? <AlertTriangle className="w-4 h-4 shrink-0" /> :
                 <Loader2 className="w-4 h-4 shrink-0 animate-spin" />}
                <span className="break-all">{fillStatus.msg}</span>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={openCountDialog} disabled={extractingImage} className="gap-1.5 text-xs">
              {extractingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{extractingImage ? `Extracting... (${extractElapsed}s)` : '📸 Upload Image'}</span>
              <span className="sm:hidden">{extractingImage ? `${extractElapsed}s` : '📸'}</span>
            </Button>
            {extractingImage && (
              <div className="w-full p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-700 font-medium animate-pulse mb-1">
                  ⏳ VLM image se questions padh raha hai...
                </p>
                <div className="w-full bg-amber-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${Math.min((extractElapsed / 60) * 100, 95)}%` }} />
                </div>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={() => answersInputRef.current?.click()} disabled={importingAnswers} className="gap-1.5 text-xs">
              {importingAnswers ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileUp className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{importingAnswers ? 'Importing...' : 'Answers'}</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => explanationsInputRef.current?.click()} disabled={importingExplanations} className="gap-1.5 text-xs">
              {importingExplanations ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{importingExplanations ? 'Importing...' : 'Explanations'}</span>
            </Button>
          </div>

          {/* Questions */}
          <div className="space-y-3">
            {questions.map((q, i) => (
              <Card key={i} className={`border shadow-sm overflow-hidden ${q.question.trim() && q.optionA.trim() ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-amber-400'}`}>
                <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                  {/* Question Header */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground shrink-0">Section:</span>
                      <Input value={q.section} onChange={(e) => updateQ(i, 'section', e.target.value)} placeholder="General" className="w-24 sm:w-32 h-7 text-xs" />
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => duplicateQ(i)} className="p-1.5 rounded hover:bg-gray-100 text-muted-foreground hover:text-blue-600 transition-colors" title="Duplicate">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      {questions.length > 1 && (
                        <button onClick={() => removeQ(i)} className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Question Text */}
                  <Textarea value={q.question} onChange={(e) => updateQ(i, 'question', e.target.value)} placeholder="Type your question here..." className="min-h-[50px] sm:min-h-[60px] resize-none text-sm" />

                  {/* Options - stacked on mobile, 2-col on sm+ */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                    {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                      <div key={opt} className="relative">
                        <div className={`absolute left-0 top-0 w-6 h-6 sm:w-6 sm:h-6 rounded-l-md flex items-center justify-center text-xs font-bold text-white ${q.correctOption === opt ? 'bg-green-600' : 'bg-gray-300'}`}>
                          {opt}
                        </div>
                        <Input
                          value={q[`option${opt}` as keyof QuestionForm]}
                          onChange={(e) => updateQ(i, `option${opt}` as keyof QuestionForm, e.target.value)}
                          placeholder={`Option ${opt}`}
                          className={`pl-9 h-10 text-sm ${q.correctOption === opt ? 'border-green-500 bg-green-50/50' : ''}`}
                        />
                        <button
                          onClick={() => updateQ(i, 'correctOption', opt)}
                          className={`absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            q.correctOption === opt ? 'border-green-600 bg-green-600' : 'border-gray-300 hover:border-green-400'
                          }`}
                          title={`Set ${opt} as correct answer`}
                        >
                          {q.correctOption === opt && <div className="w-2 h-2 rounded-full bg-white" />}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Explanation & Negative Marking */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                    <div>
                      <Label className="text-[10px] text-muted-foreground">Explanation</Label>
                      <Input value={q.explanation} onChange={(e) => updateQ(i, 'explanation', e.target.value)} placeholder="Why is this correct?" className="h-9 text-xs" />
                    </div>
                    <div>
                      <Label className="text-[10px] text-muted-foreground">Neg. Marking</Label>
                      <Input type="number" step="0.25" value={q.negativeMark} onChange={(e) => updateQ(i, 'negativeMark', e.target.value)} placeholder="0" className="h-9 text-xs" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons — stacked on mobile */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 sticky bottom-2 bg-gray-50 py-2 px-1 rounded-xl border">
            <Button variant="outline" onClick={() => setStep(1)} className="gap-1.5">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={addQuestion} className="gap-1.5 text-xs">
                <Plus className="w-3.5 h-3.5" /> Add More
              </Button>
              <Button className="bg-blue-700 hover:bg-blue-800 font-semibold" onClick={saveQuestions} disabled={saving || questions.filter(q => q.question.trim() && q.optionA.trim()).length === 0}>
                {saving ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> Saving...</>
                ) : (
                  <><Save className="w-4 h-4 mr-1 sm:mr-2" /> Save {questions.filter(q => q.question.trim() && q.optionA.trim()).length}Q</>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 3: Success */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 sm:py-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Test Created!</h2>
          <p className="text-sm text-muted-foreground mb-1">
            <strong>&quot;{title}&quot;</strong> with <strong>{savedCount} questions</strong>
          </p>
          <p className="text-xs text-muted-foreground mb-6">Students can now attempt this test.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 px-4">
            <Button variant="outline" onClick={resetAll}>
              <Plus className="w-4 h-4 mr-2" /> Create Another
            </Button>
            <Button className="bg-blue-700 hover:bg-blue-800" onClick={() => useAppStore.getState().setView('tests')}>
              View All Tests
            </Button>
          </div>
        </motion.div>
      )}

      {/* Count Dialog */}
      <Dialog open={showCountDialog} onOpenChange={setShowCountDialog}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Camera className="w-5 h-5 text-blue-600" />
              Kitne questions hain?
            </DialogTitle>
            <DialogDescription className="text-xs">
              Image me jitne questions hain, wo number yahan likhein.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Label htmlFor="qcount" className="text-xs font-medium mb-1.5 block">Kitne questions? (1-200)</Label>
            <Input
              id="qcount"
              type="number"
              min={1} max={200}
              autoFocus
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); confirmCountAndPickImage(); } }}
              placeholder="e.g., 34"
              className="h-12 text-lg font-semibold text-center"
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {[10, 25, 34, 50, 75, 100].map(preset => (
                <button key={preset} type="button" onClick={() => setQuestionCount(String(preset))}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                    questionCount === String(preset) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}>
                  {preset}
                </button>
              ))}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="gap-1.5"><X className="w-4 h-4" /> Cancel</Button>
            </DialogClose>
            <Button className="bg-blue-700 hover:bg-blue-800 gap-1.5" onClick={confirmCountAndPickImage} disabled={!questionCount || parseInt(questionCount) < 1}>
              <Camera className="w-4 h-4" /> Select Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ==================== USERS TAB ====================
interface StudentRow {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  deviceId: string;
  freeTestsUsed: number;
  isSubscribed: boolean;
  subscriptionAt: string | null;
  createdAt: string;
  totalAttempts: number;
  totalPayments: number;
  lastPayment: { id: string; amount: number; currency: string; status: string; createdAt: string } | null;
}

function AdminUsersTab({ onRefresh }: { onRefresh: () => void }) {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [filter, setFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<StudentRow | null>(null);
  const [summary, setSummary] = useState({ totalStudents: 0, totalPaid: 0, totalFree: 0 });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ filter, search });
        const res = await fetch(`/api/admin/students?${params}`);
        if (res.ok && !cancelled) {
          const data = await res.json();
          if (!cancelled) { setStudents(data.students); setSummary(data.summary); }
        }
      } catch {}
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [filter, search, reloadKey]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(deleteTarget.id);
    try {
      const res = await fetch('/api/admin/students', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteTarget.id }),
      });
      if (res.ok) {
        toast.success(`User "${deleteTarget.name}" deleted`);
        setShowDeleteDialog(false);
        setDeleteTarget(null);
        setReloadKey(k => k + 1);
        onRefresh();
      }
    } catch {}
    setDeleting(null);
  }

  const filters = [
    { key: 'all' as const, label: 'All', count: summary.totalStudents },
    { key: 'free' as const, label: 'Free', count: summary.totalFree },
    { key: 'paid' as const, label: 'Paid', count: summary.totalPaid },
  ];

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Filter Bar */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
              {filters.map(f => (
                <button
                  key={f.key}
                  onClick={() => { setFilter(f.key); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    filter === f.key ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f.label} ({f.count})
                </button>
              ))}
            </div>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search name, email, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List — Card layout on mobile, Table on desktop */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-sm text-muted-foreground">Loading users...</span>
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">No users found</div>
      ) : (
        <>
          {/* Mobile: Card Layout */}
          <div className="space-y-2 sm:hidden">
            {students.map((student) => (
              <Card key={student.id} className="border-0 shadow-sm overflow-hidden">
                <div className="p-3 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      student.isSubscribed ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{student.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{student.email || student.phone || student.deviceId}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {student.isSubscribed ? (
                          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-[10px] gap-0.5 px-1.5 py-0">
                            <Crown className="w-2.5 h-2.5" /> Paid
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            Free ({student.freeTestsUsed}/5)
                          </Badge>
                        )}
                        <span className="text-[10px] text-muted-foreground">{student.totalAttempts} attempts</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {student.subscriptionAt && (
                      <button className="p-1.5 rounded-md hover:bg-blue-50 text-blue-600 transition-colors" title={`Subscribed: ${new Date(student.subscriptionAt).toLocaleDateString()}`}>
                        <Receipt className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => { setDeleteTarget(student); setShowDeleteDialog(true); }}
                      className="p-1.5 rounded-md hover:bg-red-50 text-red-500 transition-colors"
                      title="Delete user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Desktop: Table Layout */}
          <div className="hidden sm:block">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-gray-50 border-b text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <div className="col-span-3">User</div>
                  <div className="col-span-2">Email</div>
                  <div className="col-span-1">Phone</div>
                  <div className="col-span-2 text-center">Status</div>
                  <div className="col-span-2 text-center">Activity</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>
                <div className="max-h-[60vh] overflow-y-auto">
                  {students.map((student) => (
                    <div key={student.id} className="grid grid-cols-12 gap-2 px-4 py-3 border-b last:border-0 hover:bg-gray-50/50 transition-colors items-center group">
                      <div className="col-span-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            student.isSubscribed ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-gray-200 text-gray-600'
                          }`}>
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{student.name}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2"><p className="text-xs truncate">{student.email || '—'}</p></div>
                      <div className="col-span-1"><p className="text-xs truncate">{student.phone || '—'}</p></div>
                      <div className="col-span-2 flex justify-center">
                        {student.isSubscribed ? (
                          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-[10px] gap-0.5">
                            <Crown className="w-2.5 h-2.5" /> Paid
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px]">Free ({student.freeTestsUsed}/5)</Badge>
                        )}
                      </div>
                      <div className="col-span-2 flex flex-col items-center gap-0.5">
                        <span className="text-xs font-medium">{student.totalAttempts} attempts</span>
                        {student.lastPayment && <span className="text-[10px] text-emerald-600">Paid ₹{student.lastPayment.amount / 100}</span>}
                      </div>
                      <div className="col-span-2 flex justify-end gap-1">
                        {student.subscriptionAt && (
                          <button className="p-1.5 rounded-md hover:bg-blue-50 text-blue-600 transition-colors" title={`Subscribed: ${new Date(student.subscriptionAt).toLocaleDateString()}`}>
                            <Receipt className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => { setDeleteTarget(student); setShowDeleteDialog(true); }}
                          className="p-1.5 rounded-md hover:bg-red-50 text-red-500 transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" /> Delete User
            </DialogTitle>
            <DialogDescription className="text-xs">
              Delete <strong>{deleteTarget?.name}</strong> permanently? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {deleteTarget && (
            <div className="bg-red-50 rounded-xl p-3 text-xs space-y-1">
              <p><span className="text-muted-foreground">Name:</span> <strong>{deleteTarget.name}</strong></p>
              <p><span className="text-muted-foreground">Email:</span> {deleteTarget.email || '—'}</p>
              <p><span className="text-muted-foreground">Status:</span> {deleteTarget.isSubscribed ? 'Paid' : 'Free'}</p>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" size="sm">Cancel</Button></DialogClose>
            <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 mr-1" />}
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ==================== SETTINGS TAB ====================
function AdminSettingsTab() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleResetPassword() {
    setMessage(null);
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'All fields are required' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    if (newPassword.length < 4) {
      setMessage({ type: 'error', text: 'New password must be at least 4 characters' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Password updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to reset password' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Server error.' });
    }
    setLoading(false);
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 sm:p-5">
          <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" /> Reset Admin Password
          </h3>
          <p className="text-xs text-muted-foreground mb-4">Change your admin login password.</p>

          {message && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
              className={`mb-4 p-3 rounded-xl text-sm flex items-center gap-2 border ${
                message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
              }`}>
              {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
              <span className="break-all">{message.text}</span>
            </motion.div>
          )}

          <div className="space-y-3 max-w-md">
            <div>
              <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Current Password</Label>
              <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" className="h-11" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">New Password</Label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password (min 4 chars)" className="h-11" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Confirm New Password</Label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className="h-11" onKeyDown={(e) => e.key === 'Enter' && handleResetPassword()} />
            </div>
            <Button className="bg-blue-700 hover:bg-blue-800 font-semibold" onClick={handleResetPassword} disabled={loading || !currentPassword || !newPassword || !confirmPassword}>
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Updating...</> : <><Save className="w-4 h-4 mr-2" />Update Password</>}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ==================== PAYMENTS TAB ====================
interface PaymentRow {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string | null;
  amount: number;
  currency: string;
  status: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  createdAt: string;
}

function AdminPaymentsTab() {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/payments');
        if (res.ok) setPayments(await res.json());
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  const totalRevenue = payments.reduce((s, p) => s + (p.status === 'completed' ? p.amount : 0), 0);

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Revenue Summary */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-3 sm:p-4 flex flex-row sm:flex-col items-start sm:items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100">
              <CreditCard className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">₹{totalRevenue / 100}</p>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground">Revenue ({payments.filter(p => p.status === 'completed').length} paid)</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs shrink-0">
            {payments.length} total
          </Badge>
        </CardContent>
      </Card>

      {/* Payments */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-sm text-muted-foreground">Loading payments...</span>
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">No payments yet</div>
      ) : (
        <>
          {/* Mobile: Card Layout */}
          <div className="space-y-2 sm:hidden">
            {payments.map((p) => (
              <Card key={p.id} className="border-0 shadow-sm">
                <div className="p-3 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{p.studentName}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{p.studentEmail || '—'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`text-[10px] border-0 ${
                        p.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                      }`}>
                        {p.status === 'completed' ? '✓ Success' : p.status}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-base font-bold text-gray-900 shrink-0">₹{p.amount / 100}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Desktop: Table Layout */}
          <div className="hidden sm:block">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-gray-50 border-b text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <div className="col-span-3">Student</div>
                  <div className="col-span-2 text-center">Amount</div>
                  <div className="col-span-2 text-center">Status</div>
                  <div className="col-span-3">Order ID</div>
                  <div className="col-span-2 text-right">Date</div>
                </div>
                <div className="max-h-[60vh] overflow-y-auto">
                  {payments.map((p) => (
                    <div key={p.id} className="grid grid-cols-12 gap-2 px-4 py-3 border-b last:border-0 hover:bg-gray-50/50 transition-colors items-center">
                      <div className="col-span-3">
                        <p className="text-sm font-medium truncate">{p.studentName}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{p.studentEmail || '—'}</p>
                      </div>
                      <div className="col-span-2 text-center">
                        <p className="text-sm font-bold">₹{p.amount / 100}</p>
                      </div>
                      <div className="col-span-2 flex justify-center">
                        <Badge className={`text-[10px] border-0 ${
                          p.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                        }`}>
                          {p.status === 'completed' ? '✓ Success' : p.status}
                        </Badge>
                      </div>
                      <div className="col-span-3">
                        <p className="text-[10px] text-muted-foreground font-mono truncate">{p.razorpayOrderId || '—'}</p>
                      </div>
                      <div className="col-span-2 text-right">
                        <p className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
