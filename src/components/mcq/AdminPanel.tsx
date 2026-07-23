'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
  ArrowLeft, LogOut, Plus, Trash2, BarChart3, BookOpen, Users, CreditCard, ChevronDown, ChevronUp, Save, Shield, FileText,
} from 'lucide-react';

export function AdminPanel() {
  const { setView, setAdminData, adminData, categories, setCategories, setTests } = useAppStore();
  const [tab, setTab] = useState<'dashboard' | 'categories' | 'tests' | 'create-test'>('dashboard');
  const [loading, setLoading] = useState(false);

  async function fetchStats() {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setAdminData({ stats: data });
      }
    } catch {}
  }

  useEffect(() => {
    if (adminData.isLoggedIn) fetchStats();
  }, [adminData.isLoggedIn]);

  async function fetchCategories() {
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) setCategories(await res.json());
    } catch {}
  }

  async function fetchTests() {
    try {
      const res = await fetch('/api/admin/tests');
      if (res.ok) setTests(await res.json());
    } catch {}
  }

  if (!adminData.isLoggedIn) return <AdminLogin />;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setView('home')}><ArrowLeft className="w-5 h-5" /></Button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2"><Shield className="w-5 h-5 text-blue-600" /> Admin Panel</h1>
            <p className="text-xs text-muted-foreground">Manage your quiz platform</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setAdminData({ isLoggedIn: false })}>
          <LogOut className="w-4 h-4 mr-1" /> Logout
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-lg p-1">
        {(['dashboard', 'categories', 'tests', 'create-test'] as const).map((t) => (
          <button key={t} onClick={() => { setTab(t); if (t === 'categories') fetchCategories(); if (t === 'tests') fetchTests(); }}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${tab === t ? 'bg-white shadow-sm text-blue-900' : 'text-muted-foreground hover:text-foreground'}`}>
            {t === 'dashboard' && <><BarChart3 className="w-3.5 h-3.5 inline mr-1" /> Dashboard</>}
            {t === 'categories' && <><BookOpen className="w-3.5 h-3.5 inline mr-1" /> Categories</>}
            {t === 'tests' && <><FileText className="w-3.5 h-3.5 inline mr-1" /> Tests</>}
            {t === 'create-test' && <><Plus className="w-3.5 h-3.5 inline mr-1" /> New Test</>}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && <AdminDashboard />}
      {tab === 'categories' && <AdminCategories onRefresh={fetchCategories} />}
      {tab === 'tests' && <AdminTests onRefresh={fetchTests} />}
      {tab === 'create-test' && <AdminCreateTest />}
    </div>
  );
}

function AdminLogin() {
  const { setAdminData } = useAppStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="max-w-sm mx-auto">
      <Card>
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <Shield className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h2 className="text-lg font-bold">Admin Login</h2>
            <p className="text-xs text-muted-foreground mt-1">Default: admin / admin123</p>
          </div>
          <div className="space-y-3">
            <div><Label>Username</Label><Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" /></div>
            <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="admin123" /></div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleLogin} disabled={loading || !username || !password}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminDashboard() {
  const { adminData } = useAppStore();
  const { stats } = adminData;
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { icon: Users, label: 'Students', value: stats.totalStudents, color: 'bg-blue-100 text-blue-700' },
        { icon: FileText, label: 'Tests', value: stats.totalTests, color: 'bg-green-100 text-green-700' },
        { icon: BookOpen, label: 'Questions', value: stats.totalQuestions, color: 'bg-amber-100 text-amber-700' },
        { icon: CreditCard, label: 'Payments', value: stats.totalPayments, color: 'bg-purple-100 text-purple-700' },
      ].map((item) => (
        <Card key={item.label}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${item.color}`}><item.icon className="w-5 h-5" /></div>
            <div><p className="text-2xl font-bold">{item.value}</p><p className="text-xs text-muted-foreground">{item.label}</p></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AdminCategories({ onRefresh }: { onRefresh: () => void }) {
  const { categories, setCategories } = useAppStore();
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newExamType, setNewExamType] = useState('General');

  async function handleAdd() {
    if (!newName || !newSlug) return;
    await fetch('/api/admin/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newName, slug: newSlug, examType: newExamType }) });
    setNewName(''); setNewSlug('');
    onRefresh();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this category and all its tests?')) return;
    await fetch('/api/admin/categories', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    onRefresh();
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="text-sm font-semibold">Add New Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Input placeholder="Name" value={newName} onChange={(e) => { setNewName(e.target.value); setNewSlug(e.target.value.toLowerCase().replace(/\s+/g, '-')); }} />
            <Input placeholder="Slug" value={newSlug} onChange={(e) => setNewSlug(e.target.value)} />
            <select className="border rounded-md px-3 py-2 text-sm" value={newExamType} onChange={(e) => setNewExamType(e.target.value)}>
              {['General', 'SSC', 'UPSC', 'Banking', 'Railways', 'State', 'Defence'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={handleAdd} disabled={!newName}><Plus className="w-4 h-4 mr-1" /> Add</Button>
        </CardContent>
      </Card>
      <div className="space-y-2">
        {categories.map((cat) => (
          <Card key={cat.id}>
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-8 rounded" style={{ backgroundColor: cat.color }} />
                <div>
                  <p className="text-sm font-medium">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">{cat.examType} · {cat._count.tests} tests</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(cat.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AdminTests({ onRefresh }: { onRefresh: () => void }) {
  const { tests } = useAppStore();
  async function handleDelete(id: string) {
    if (!confirm('Delete this test and all questions?')) return;
    await fetch('/api/admin/tests', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    onRefresh();
  }
  return (
    <div className="space-y-2">
      {tests.map((test) => (
        <Card key={test.id}>
          <CardContent className="p-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{test.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-[10px]">{test.category.name}</Badge>
                <Badge variant="outline" className="text-[10px]">{test.totalQuestions} Qs</Badge>
                <span className="text-[10px] text-muted-foreground">{test.difficulty} · {Math.floor(test.timeLimit / 60)}min</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(test.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AdminCreateTest() {
  const { categories, setTests } = useAppStore();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [catId, setCatId] = useState('');
  const [diff, setDiff] = useState('medium');
  const [time, setTime] = useState('600');
  const [examName, setExamName] = useState('');
  const [questions, setQuestions] = useState([{ question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'A', explanation: '' }]);
  const [step, setStep] = useState(1);
  const [createdTestId, setCreatedTestId] = useState('');
  const [saved, setSaved] = useState(false);

  function addQuestion() {
    setQuestions([...questions, { question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'A', explanation: '' }]);
  }
  function updateQ(i: number, field: string, value: string) {
    const updated = [...questions];
    updated[i] = { ...updated[i], [field]: value };
    setQuestions(updated);
  }
  function removeQ(i: number) {
    setQuestions(questions.filter((_, idx) => idx !== i));
  }

  async function createTest() {
    if (!title || !catId) return;
    const res = await fetch('/api/admin/tests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, description: desc, categoryId: catId, difficulty: diff, timeLimit: parseInt(time), examName: examName || 'Practice Test' }) });
    const data = await res.json();
    setCreatedTestId(data.id);
    setStep(2);
  }

  async function saveQuestions() {
    const valid = questions.filter(q => q.question && q.optionA && q.optionB && q.optionC && q.optionD);
    if (valid.length === 0) return;
    const res = await fetch('/api/admin/tests/questions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ testId: createdTestId, questions: valid }) });
    if (res.ok) setSaved(true);
  }

  return (
    <div className="space-y-4">
      {step === 1 && (
        <Card>
          <CardContent className="p-5 space-y-4">
            <h3 className="font-semibold">Step 1: Create Test</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2"><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Test title" /></div>
              <div className="sm:col-span-2"><Label>Description</Label><Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Brief description" /></div>
              <div><Label>Category</Label>
                <select className="w-full border rounded-md px-3 py-2 text-sm" value={catId} onChange={(e) => setCatId(e.target.value)}>
                  <option value="">Select category...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div><Label>Exam Name</Label><Input value={examName} onChange={(e) => setExamName(e.target.value)} placeholder="e.g., SSC CGL 2024" /></div>
              <div><Label>Difficulty</Label>
                <select className="w-full border rounded-md px-3 py-2 text-sm" value={diff} onChange={(e) => setDiff(e.target.value)}>
                  {['easy', 'medium', 'hard'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div><Label>Time (seconds)</Label><Input type="number" value={time} onChange={(e) => setTime(e.target.value)} /></div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={createTest} disabled={!title || !catId}>Create Test & Add Questions →</Button>
          </CardContent>
        </Card>
      )}
      {step === 2 && !saved && (
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Step 2: Add Questions ({questions.length})</h3>
              <Button variant="outline" size="sm" onClick={addQuestion}><Plus className="w-3.5 h-3.5 mr-1" /> Add</Button>
            </div>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {questions.map((q, i) => (
                <div key={i} className="border rounded-xl p-4 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-600">Question {i + 1}</span>
                    {questions.length > 1 && <button onClick={() => removeQ(i)} className="text-red-500 hover:text-red-700"><Trash2 className="w-3.5 h-3.5" /></button>}
                  </div>
                  <Input placeholder="Question text" value={q.question} onChange={(e) => updateQ(i, 'question', e.target.value)} />
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Option A" value={q.optionA} onChange={(e) => updateQ(i, 'optionA', e.target.value)} />
                    <Input placeholder="Option B" value={q.optionB} onChange={(e) => updateQ(i, 'optionB', e.target.value)} />
                    <Input placeholder="Option C" value={q.optionC} onChange={(e) => updateQ(i, 'optionC', e.target.value)} />
                    <Input placeholder="Option D" value={q.optionD} onChange={(e) => updateQ(i, 'optionD', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><Label className="text-xs">Correct Answer</Label>
                      <select className="w-full border rounded-md px-3 py-2 text-sm" value={q.correctOption} onChange={(e) => updateQ(i, 'correctOption', e.target.value)}>
                        {['A', 'B', 'C', 'D'].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div><Label className="text-xs">Explanation</Label><Input placeholder="Optional" value={q.explanation} onChange={(e) => updateQ(i, 'explanation', e.target.value)} /></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>← Back</Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={saveQuestions} disabled={questions.filter(q => q.question && q.optionA).length === 0}>
                <Save className="w-4 h-4 mr-1" /> Save {questions.filter(q => q.question && q.optionA).length} Questions
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      {saved && (
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center py-8">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-xl font-bold mb-2">Test Created Successfully!</h2>
          <p className="text-muted-foreground mb-4">{questions.filter(q => q.question).length} questions added to "{title}"</p>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { setStep(1); setTitle(''); setDesc(''); setQuestions([{ question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'A', explanation: '' }]); setSaved(false); setCreatedTestId(''); }}>
            Create Another Test
          </Button>
        </motion.div>
      )}
    </div>
  );
}
