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
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  ArrowLeft, LogOut, Plus, Trash2, BarChart3, BookOpen, Users, CreditCard,
  Save, Shield, FileText, Settings, Edit2, Eye, EyeOff, Copy, CheckCircle2,
  ChevronRight, ChevronDown, GripVertical, X, AlertTriangle, Search, LayoutGrid,
  HelpCircle, Pencil, Camera, FileUp, Upload, Loader2,
} from 'lucide-react';

// ==================== ADMIN LOGIN ====================
function AdminLogin() {
  const { setAdminData } = useAppStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="w-full max-w-sm shadow-xl border-0">
          <CardContent className="p-6">
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
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setView('home')} className="h-9 w-9">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-700" />
              <div>
                <h1 className="text-base font-bold text-gray-900">Admin Panel</h1>
                <p className="text-[11px] text-muted-foreground -mt-0.5">Manage tests, questions & categories</p>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setAdminData({ isLoggedIn: false })} className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <LogOut className="w-3.5 h-3.5 mr-1.5" /> Logout
          </Button>
        </div>
      </div>

      {/* Admin Content */}
      <div className="max-w-7xl mx-auto px-4 py-5">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {[
            { icon: Users, label: 'Students', value: stats.totalStudents, color: 'bg-blue-50 text-blue-700', iconBg: 'bg-blue-100' },
            { icon: FileText, label: 'Tests', value: stats.totalTests, color: 'bg-emerald-50 text-emerald-700', iconBg: 'bg-emerald-100' },
            { icon: HelpCircle, label: 'Questions', value: stats.totalQuestions, color: 'bg-amber-50 text-amber-700', iconBg: 'bg-amber-100' },
            { icon: CreditCard, label: 'Payments', value: stats.totalPayments, color: 'bg-purple-50 text-purple-700', iconBg: 'bg-purple-100' },
          ].map((item) => (
            <Card key={item.label} className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-xl ${item.iconBg}`}><item.icon className={`w-5 h-5 ${item.color.split(' ')[1]}`} /></div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                  <p className="text-[11px] text-muted-foreground">{item.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white border mb-5 h-auto p-1 w-full sm:w-auto">
            <TabsTrigger value="dashboard" className="text-xs gap-1.5 data-[state=active]:bg-blue-700 data-[state=active]:text-white">
              <LayoutGrid className="w-3.5 h-3.5" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="categories" className="text-xs gap-1.5 data-[state=active]:bg-blue-700 data-[state=active]:text-white">
              <BookOpen className="w-3.5 h-3.5" /> Categories
            </TabsTrigger>
            <TabsTrigger value="tests" className="text-xs gap-1.5 data-[state=active]:bg-blue-700 data-[state=active]:text-white">
              <FileText className="w-3.5 h-3.5" /> Tests
            </TabsTrigger>
            <TabsTrigger value="create-test" className="text-xs gap-1.5 data-[state=active]:bg-blue-700 data-[state=active]:text-white">
              <Plus className="w-3.5 h-3.5" /> Create Test
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminDashboardContent />
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
        </Tabs>
      </div>
    </div>
  );
}

// ==================== DASHBOARD ====================
function AdminDashboardContent() {
  const { tests, categories } = useAppStore();

  return (
    <div className="space-y-5">
      {/* Quick Stats */}
      <div className="grid sm:grid-cols-3 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
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
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Active Tests</span>
              <Badge variant="secondary" className="text-[10px]">{tests.filter(t => t.isActive).length}</Badge>
            </div>
            <div className="space-y-1.5">
              {tests.slice(0, 4).map((t) => (
                <div key={t.id} className="flex items-center justify-between text-xs">
                  <span className="truncate max-w-[150px]">{t.title}</span>
                  <span className="text-muted-foreground">{t.totalQuestions}Q</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Quick Actions</span>
            </div>
            <div className="space-y-2">
              <Button size="sm" variant="outline" className="w-full justify-start text-xs gap-2 h-8" onClick={() => {}}>
                <Plus className="w-3.5 h-3.5" /> Add New Test
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start text-xs gap-2 h-8" onClick={() => {}}>
                <Plus className="w-3.5 h-3.5" /> Add Category
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tests */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold mb-3">All Tests</h3>
          <div className="space-y-2">
            {tests.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No tests yet. Create your first test!</p>
            ) : (
              tests.map((test) => (
                <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                      {test.category?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{test.title}</p>
                      <p className="text-[11px] text-muted-foreground">{test.category?.name} · {test.totalQuestions} questions · {test.difficulty}</p>
                    </div>
                  </div>
                  <Badge variant={test.isActive ? 'default' : 'secondary'} className="text-[10px]">
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
    <div className="space-y-4">
      {/* Add Category */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
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
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold mb-3">All Categories ({categories.length})</h3>
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-10 rounded-full" style={{ backgroundColor: cat.color }} />
                  <div>
                    <p className="text-sm font-medium">{cat.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="secondary" className="text-[10px]">{cat.examType}</Badge>
                      <span className="text-[10px] text-muted-foreground">{cat._count.tests} tests</span>
                      <span className="text-[10px] text-muted-foreground">/{cat.slug}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
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
    // Refetch
    const res = await fetch(`/api/tests/${testId}`);
    if (res.ok) {
      const data = await res.json();
      setTestQuestions(prev => ({ ...prev, [testId]: data.questions || [] }));
    }
    onRefresh();
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">All Tests ({tests.length})</h3>
        <Badge variant="secondary" className="text-[10px]">{tests.reduce((s, t) => s + t.totalQuestions, 0)} total questions</Badge>
      </div>

      {tests.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-10 text-center">
            <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No tests yet. Go to &quot;Create Test&quot; tab to add your first test.</p>
          </CardContent>
        </Card>
      ) : (
        tests.map((test) => (
          <Card key={test.id} className="border-0 shadow-sm overflow-hidden">
            {/* Test Header */}
            <div
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => fetchQuestions(test.id)}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: test.category?.color || '#1e40af' }}>
                  {test.category?.name?.charAt(0) || 'T'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{test.title}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <Badge variant="secondary" className="text-[10px]">{test.category?.name}</Badge>
                    <span className="text-[10px] text-muted-foreground">{test.totalQuestions} questions</span>
                    <span className="text-[10px] text-muted-foreground">{test.difficulty}</span>
                    <span className="text-[10px] text-muted-foreground">{Math.floor(test.timeLimit / 60)}min</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
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
                  <div className="border-t bg-gray-50 p-4 space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-semibold text-muted-foreground">
                        Questions ({(testQuestions[test.id] || []).length})
                      </h4>
                    </div>
                    {(testQuestions[test.id] || []).length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">No questions in this test</p>
                    ) : (
                      (testQuestions[test.id] as Array<Record<string, unknown>>).map((q, i) => (
                        <div key={String(q.id)} className="bg-white rounded-lg p-3 border text-xs group">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-blue-700 shrink-0">Q{i + 1}.</span>
                                <span className="text-gray-700">{String(q.question).substring(0, 100)}{String(q.question).length > 100 ? '...' : ''}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-1 ml-5 text-muted-foreground">
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
                              className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
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

  // File input refs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const answersInputRef = useRef<HTMLInputElement>(null);
  const explanationsInputRef = useRef<HTMLInputElement>(null);

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

  async function handleImageExtract(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setExtractingImage(true);
    setExtractElapsed(0);

    // Start a timer to show elapsed seconds
    const startTime = Date.now();
    const timerInterval = setInterval(() => {
      setExtractElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    try {
      const formData = new FormData();
      formData.append('image', file);

      // Use AbortController with 3-minute timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 180000);

      const res = await fetch('/api/admin/extract-question', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      if (data.success && data.questions && data.questions.length > 0) {
        // Handle multiple questions from image
        const newQuestions: QuestionForm[] = data.questions.map((q: any) => ({
          question: q.question || '',
          optionA: q.optionA || '',
          optionB: q.optionB || '',
          optionC: q.optionC || '',
          optionD: q.optionD || '',
          correctOption: q.correctOption || 'A',
          explanation: q.explanation || '',
          section: q.section || 'General',
          negativeMark: q.negativeMark || '0',
        }));
        setQuestions([...questions, ...newQuestions]);
        toast.success(`✅ ${data.questions.length} questions extracted from image!`);
      } else if (data.success && data.question) {
        // Fallback: single question
        const newQ: QuestionForm = {
          question: data.question.question || '',
          optionA: data.question.optionA || '',
          optionB: data.question.optionB || '',
          optionC: data.question.optionC || '',
          optionD: data.question.optionD || '',
          correctOption: data.question.correctOption || 'A',
          explanation: data.question.explanation || '',
          section: data.question.section || 'General',
          negativeMark: data.question.negativeMark || '0',
        };
        setQuestions([...questions, newQ]);
        toast.success('1 question extracted from image!');
      } else {
        toast.error(data.error || 'Failed to extract questions from image');
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        toast.error('Request timed out (3 min). Try a smaller image or fewer questions.');
      } else {
        toast.error('Failed to extract questions. Please try again.');
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
      const res = await fetch('/api/admin/import-answers', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Updated ${data.updated} correct answers successfully!`);
      } else {
        toast.error(data.error || 'Failed to import answers');
      }
    } catch {
      toast.error('Failed to import answers. Please try again.');
    } finally {
      setImportingAnswers(false);
      e.target.value = '';
    }
  }

  async function handleImportExplanations(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportingExplanations(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('testId', createdTestId);
      const res = await fetch('/api/admin/import-explanations', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Updated ${data.updated} explanations successfully!`);
      } else {
        toast.error(data.error || 'Failed to import explanations');
      }
    } catch {
      toast.error('Failed to import explanations. Please try again.');
    } finally {
      setImportingExplanations(false);
      e.target.value = '';
    }
  }

  return (
    <div className="space-y-5">
      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-2">
        {[
          { n: 1, label: 'Test Details' },
          { n: 2, label: 'Add Questions' },
          { n: 3, label: 'Done' },
        ].map((s) => (
          <div key={s.n} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step > s.n ? 'bg-green-600 text-white' : step === s.n ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step > s.n ? <CheckCircle2 className="w-4 h-4" /> : s.n}
            </div>
            <span className={`text-xs font-medium ${step === s.n ? 'text-gray-900' : 'text-muted-foreground'}`}>{s.label}</span>
            {s.n < 3 && <div className={`w-8 h-0.5 ${step > s.n ? 'bg-green-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Test Details */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5 space-y-4">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2 mb-1"><FileText className="w-5 h-5 text-blue-600" /> Test Information</h3>
                <p className="text-xs text-muted-foreground">Fill in the basic details for your mock test</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label className="text-xs font-medium">Test Title *</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., SSC CGL 2024 - General Awareness" className="h-11" />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-xs font-medium">Description</Label>
                  <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Brief description of this test..." className="min-h-[80px] resize-none" />
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
                  <Label className="text-xs font-medium">Time Limit (seconds)</Label>
                  <Input type="number" value={time} onChange={(e) => setTime(e.target.value)} className="h-11" />
                  <p className="text-[10px] text-muted-foreground mt-1">600 seconds = 10 minutes</p>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button className="bg-blue-700 hover:bg-blue-800 font-semibold" onClick={createTest} disabled={!title || !catId}>
                  Next: Add Questions <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 2: Add Questions */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          {/* Quick Stats Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-xs">{questions.length} questions</Badge>
              <Badge variant="outline" className="text-xs">
                {questions.filter(q => q.question.trim() && q.optionA.trim()).length} complete
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={addQuestion} className="gap-1.5 text-xs">
              <Plus className="w-3.5 h-3.5" /> Add Question
            </Button>
          </div>

          {/* Hidden file inputs */}
          <input
            type="file"
            ref={imageInputRef}
            accept="image/*"
            onChange={handleImageExtract}
            className="hidden"
          />
          <input
            type="file"
            ref={answersInputRef}
            accept=".txt,.csv"
            onChange={handleImportAnswers}
            className="hidden"
          />
          <input
            type="file"
            ref={explanationsInputRef}
            accept=".txt"
            onChange={handleImportExplanations}
            className="hidden"
          />

          {/* Import Actions Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => imageInputRef.current?.click()}
              disabled={extractingImage}
              className="gap-1.5 text-xs"
            >
              {extractingImage ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Camera className="w-3.5 h-3.5" />
              )}
              {extractingImage ? `Extracting... (${extractElapsed}s)` : '📸 Upload Image (All Ques)'}
            </Button>
            {extractingImage && (
              <span className="text-xs text-amber-600 font-medium animate-pulse">
                ⏳ VLM processing image — please wait (can take 30-60s for large images)
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => answersInputRef.current?.click()}
              disabled={importingAnswers}
              className="gap-1.5 text-xs"
            >
              {importingAnswers ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileUp className="w-3.5 h-3.5" />
              )}
              {importingAnswers ? 'Importing...' : 'Import Correct Answers'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => explanationsInputRef.current?.click()}
              disabled={importingExplanations}
              className="gap-1.5 text-xs"
            >
              {importingExplanations ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              {importingExplanations ? 'Importing...' : 'Import Explanations'}
            </Button>
          </div>

          {/* Questions */}
          <div className="space-y-3">
            {questions.map((q, i) => (
              <Card key={i} className={`border shadow-sm overflow-hidden ${q.question.trim() && q.optionA.trim() ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-amber-400'}`}>
                <CardContent className="p-4 space-y-3">
                  {/* Question Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                      <span className="text-xs text-muted-foreground">Section: </span>
                      <Input
                        value={q.section}
                        onChange={(e) => updateQ(i, 'section', e.target.value)}
                        placeholder="General"
                        className="w-32 h-7 text-xs"
                      />
                    </div>
                    <div className="flex items-center gap-1">
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
                  <Textarea
                    value={q.question}
                    onChange={(e) => updateQ(i, 'question', e.target.value)}
                    placeholder="Type your question here..."
                    className="min-h-[60px] resize-none text-sm"
                  />

                  {/* Options - 2x2 Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                      <div key={opt} className="relative">
                        <div className={`absolute left-0 top-0 w-6 h-6 rounded-l-md flex items-center justify-center text-xs font-bold text-white ${q.correctOption === opt ? 'bg-green-600' : 'bg-gray-300'}`}>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <Label className="text-[10px] text-muted-foreground">Explanation (optional)</Label>
                      <Input
                        value={q.explanation}
                        onChange={(e) => updateQ(i, 'explanation', e.target.value)}
                        placeholder="Why is this the correct answer?"
                        className="h-9 text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] text-muted-foreground">Negative Marking</Label>
                      <Input
                        type="number"
                        step="0.25"
                        value={q.negativeMark}
                        onChange={(e) => updateQ(i, 'negativeMark', e.target.value)}
                        placeholder="0"
                        className="h-9 text-xs"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 sticky bottom-4 bg-gray-50 py-3 px-2 rounded-xl border">
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
                  <><Save className="w-4 h-4 mr-2" /> Save {questions.filter(q => q.question.trim() && q.optionA.trim()).length} Questions</>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 3: Success */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Created Successfully!</h2>
          <p className="text-muted-foreground mb-1">
            <strong>&quot;{title}&quot;</strong> has been created with <strong>{savedCount} questions</strong>
          </p>
          <p className="text-sm text-muted-foreground mb-6">Students can now see and attempt this test from the Mock Tests page.</p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={resetAll}>
              <Plus className="w-4 h-4 mr-2" /> Create Another Test
            </Button>
            <Button className="bg-blue-700 hover:bg-blue-800" onClick={() => useAppStore.getState().setView('tests')}>
              View All Tests
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
