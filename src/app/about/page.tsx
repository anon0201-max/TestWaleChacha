import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us | TestWaleChacha',
  description: 'Learn about TestWaleChacha — our mission, team, and commitment to helping Indian students crack government exams with free and affordable online mock tests.',
};

const BASE_URL = 'https://www.testwalechacha.online';
const SITE_NAME = 'TestWaleChacha';
const EMAIL = 'testwalechacha@gmail.com';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 text-sm font-medium mb-8 transition-colors"
        >
          &larr; Back to {SITE_NAME}
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">About Us</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: July 31, 2026</p>

        <div className="space-y-8 text-gray-700 leading-relaxed text-[15px]">
          {/* Mission */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Our Mission</h2>
            <p>
              At {SITE_NAME}, our mission is to make high-quality exam preparation accessible and affordable for every Indian student aspiring to crack government and competitive examinations. We believe that talent and dedication should not be limited by the availability of expensive coaching or study materials. Our platform bridges this gap by providing a realistic, exam-like practice environment right from your mobile device or computer.
            </p>
          </section>

          {/* What We Do */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">What is {SITE_NAME}?</h2>
            <p className="mb-3">
              {SITE_NAME} is an online mock test platform designed specifically for Indian competitive exam aspirants. We provide:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li><strong>Realistic Mock Tests:</strong> Timed tests that simulate the actual exam interface and environment</li>
              <li><strong>Detailed Solutions:</strong> Step-by-step explanations for every question to help you understand concepts</li>
              <li><strong>Performance Analytics:</strong> Subject-wise and topic-wise analysis of your test performance</li>
              <li><strong>Progress Tracking:</strong> Track your improvement over time with detailed attempt history</li>
              <li><strong>Free &amp; Affordable Plans:</strong> Start with 2 free tests and unlock unlimited access for just &#8377;100</li>
              <li><strong>Mobile-First Design:</strong> Practice anytime, anywhere on any device</li>
            </ul>
          </section>

          {/* Exam Categories */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Exam Categories We Cover</h2>
            <p className="mb-3">
              We offer mock tests for a wide range of Indian government and competitive examinations:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
              {[
                { name: 'SSC', desc: 'CGL, CHSL, MTS, GD, Stenographer' },
                { name: 'UPSC', desc: 'Civil Services Prelims (GS & CSAT)' },
                { name: 'IBPS', desc: 'PO, Clerk, SO, RRB' },
                { name: 'RRB', desc: 'NTPC, ALP, Group D, JE' },
                { name: 'CTET', desc: 'Paper I & Paper II' },
                { name: 'CDS', desc: 'IMA, INA, AFA, OTA' },
                { name: 'NDA', desc: 'Mathematics & General Ability' },
                { name: 'State PSC', desc: 'Various state-level examinations' },
              ].map((exam) => (
                <div key={exam.name} className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                  <p className="font-semibold text-emerald-800 text-sm">{exam.name}</p>
                  <p className="text-emerald-700 text-xs mt-0.5">{exam.desc}</p>
                </div>
              ))}
            </div>
            <p>
              We are continuously adding new tests and exam categories based on user demand and upcoming examination schedules.
            </p>
          </section>

          {/* Our Team */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Our Team</h2>
            <p className="mb-3">
              {SITE_NAME} is built by a passionate team of educators, developers, and exam preparation enthusiasts. Our team includes:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li><strong>Content Creators:</strong> Experienced educators and subject matter experts who design exam-quality questions and detailed solutions</li>
              <li><strong>Technology Team:</strong> Skilled developers who build and maintain a seamless, fast, and mobile-friendly platform</li>
              <li><strong>Support Team:</strong> Dedicated support staff available via email and WhatsApp to assist you with any issues</li>
            </ul>
            <p className="mt-3">
              Together, we are committed to providing the best possible preparation experience for every aspirant on our platform.
            </p>
          </section>

          {/* Why Choose Us */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Why Choose {SITE_NAME}?</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">1</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Affordable Pricing</h3>
                  <p className="mt-1">Unlimited access to all mock tests for just &#8377;100. We keep our pricing minimal so that cost is never a barrier to quality education.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">2</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Exam-Like Interface</h3>
                  <p className="mt-1">Practice in a real exam-like environment with timers, question palettes, and section navigation — so there are no surprises on exam day.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">3</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Detailed Explanations</h3>
                  <p className="mt-1">Every question comes with a step-by-step explanation so you can learn from your mistakes and strengthen your weak areas.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">4</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Mobile Friendly</h3>
                  <p className="mt-1">Our platform is optimized for mobile devices, so you can practice on the go — during commutes, breaks, or any free time.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">5</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Performance Tracking</h3>
                  <p className="mt-1">Track your progress with detailed analytics — see your strengths, weaknesses, and improvement trends over time.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Our Numbers */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Our Growing Community</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-emerald-600">50+</p>
                <p className="text-xs text-gray-600 mt-1">Mock Tests</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-emerald-600">₹100</p>
                <p className="text-xs text-gray-600 mt-1">PRO Plan</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-emerald-600">8+</p>
                <p className="text-xs text-gray-600 mt-1">Exam Categories</p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Get in Touch</h2>
            <p className="mb-3">
              We would love to hear from you! Whether you have feedback, suggestions, or questions, feel free to reach out:
            </p>
            <div className="bg-gray-50 rounded-lg p-5 space-y-2">
              <p><strong>{SITE_NAME}</strong></p>
              <p>Email: <a href={`mailto:${EMAIL}`} className="text-emerald-600 hover:text-emerald-700 underline">{EMAIL}</a></p>
              <p>Website: <a href={BASE_URL} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 underline">{BASE_URL}</a></p>
              <p>WhatsApp Channel: <a href="https://whatsapp.com/channel/0029VbDsNS4A2pL5AnlWwm1G" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 underline">Join Now</a></p>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </div>
      </div>
    </main>
  );
}
