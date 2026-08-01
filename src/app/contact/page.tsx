'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Loader2, Send, CheckCircle2, MessageSquare, Phone, Mail } from 'lucide-react';

type FormState = 'idle' | 'loading' | 'success';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) e.name = 'Enter a valid name';
    if (!/^[6-9]\d{9}$/.test(mobile.replace(/\s/g, ''))) e.mobile = 'Enter a valid 10-digit mobile number';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';
    if (!description.trim() || description.trim().length < 10) e.description = 'At least 10 characters required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setFormState('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mobile, email, description }),
      });
      const data = await res.json();
      if (data.success) {
        setFormState('success');
        toast.success('Message sent successfully!');
        setName(''); setMobile(''); setEmail(''); setDescription('');
        setTimeout(() => setFormState('idle'), 3000);
      } else {
        toast.error(data.error || 'Something went wrong');
        setFormState('idle');
      }
    } catch {
      toast.error('Network error. Please try again.');
      setFormState('idle');
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <a
          href="/"
          className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 mb-6"
        >
          ← Back to TestWaleChacha
        </a>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
        <p className="text-gray-500 mb-8 text-sm sm:text-base">Have a question or feedback? Fill the form below or reach us directly.</p>

        <div className="space-y-8">
          {/* Contact Form */}
          <Card className="border shadow-sm">
            <CardContent className="p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                Send us a Message
              </h2>
              <p className="text-xs text-gray-500 mb-5">We&apos;ll get back to you within 24-48 hours.</p>

              <AnimatePresence mode="wait">
                {formState === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Message Sent!</h3>
                    <p className="text-sm text-gray-500 mt-1">Thank you for reaching out. We&apos;ll respond soon.</p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="name" className="text-xs font-medium text-gray-700 mb-1.5 block">
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setErrors(prev => ({ ...prev, name: '' })); }}
                        placeholder="Enter your name"
                        className="h-11"
                      />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="mobile" className="text-xs font-medium text-gray-700 mb-1.5 block">
                          Mobile Number <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">+91</span>
                          <Input
                            id="mobile"
                            value={mobile}
                            onChange={(e) => { setMobile(e.target.value.replace(/\D/g, '').slice(0, 10)); setErrors(prev => ({ ...prev, mobile: '' })); }}
                            placeholder="10-digit number"
                            className="h-11 pl-10"
                            type="tel"
                            maxLength={10}
                          />
                        </div>
                        {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>}
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-xs font-medium text-gray-700 mb-1.5 block">
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }}
                          placeholder="your@email.com"
                          className="h-11"
                        />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-xs font-medium text-gray-700 mb-1.5 block">
                        Message <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => { setDescription(e.target.value); setErrors(prev => ({ ...prev, description: '' })); }}
                        placeholder="Describe your query, feedback, or issue in detail..."
                        className="min-h-[120px] resize-y"
                        rows={5}
                      />
                      {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                    </div>

                    <Button
                      type="submit"
                      disabled={formState === 'loading'}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-11"
                    >
                      {formState === 'loading' ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
                      ) : (
                        <><Send className="w-4 h-4 mr-2" /> Submit</>
                      )}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Direct Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="https://whatsapp.com/channel/0029VbDsNS4A2pL5AnlWwm1G"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Card className="border shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">WhatsApp Channel</h3>
                    <p className="text-xs text-gray-500 mt-1">Fastest way to reach us for updates</p>
                  </div>
                </CardContent>
              </Card>
            </a>

            <a href="mailto:testwalechacha@gmail.com">
              <Card className="border shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Email Us</h3>
                    <p className="text-xs text-gray-500 mt-1">testwalechacha@gmail.com</p>
                  </div>
                </CardContent>
              </Card>
            </a>
          </div>

          {/* FAQ */}
          <section className="bg-gray-50 rounded-xl p-5 sm:p-6 border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 text-sm">How do I report a wrong question or answer?</h3>
                <p className="text-gray-600 text-xs mt-1">
                  Send us the test name and question number via the form above, WhatsApp Channel, or email. We&apos;ll review and correct it promptly.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 text-sm">I faced payment issues. Who do I contact?</h3>
                <p className="text-gray-600 text-xs mt-1">
                  Email us at testwalechacha@gmail.com with your registered email and payment details. We resolve payment issues within 24 hours.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 text-sm">Can I request a specific exam or topic?</h3>
                <p className="text-gray-600 text-xs mt-1">
                  Yes! Use the form above or suggest through our WhatsApp Channel. We regularly add new tests based on user requests.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 text-sm">I want to partner or advertise with TestWaleChacha.</h3>
                <p className="text-gray-600 text-xs mt-1">
                  For business inquiries, email us at testwalechacha@gmail.com with the subject &ldquo;Business Inquiry&rdquo;.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}