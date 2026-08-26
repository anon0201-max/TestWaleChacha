import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How It Works | TestWaleChacha - Step by Step Guide',
  description: 'Learn how to use TestWaleChacha for your government exam preparation. Complete step-by-step guide: sign up, take mock tests, review solutions, track performance, and improve your score.',
};

const BASE_URL = 'https://testwalechacha.online';
const SITE_NAME = 'TestWaleChacha';

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 text-sm font-medium mb-8 transition-colors"
        >
          &larr; Back to {SITE_NAME}
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">How TestWaleChacha Works</h1>
        <p className="text-gray-600 text-[15px] mb-2">A complete step-by-step guide to getting started with your mock test preparation journey.</p>
        <p className="text-sm text-gray-500 mb-10">Last updated: August 17, 2026</p>

        <div className="space-y-10 text-gray-700 leading-relaxed text-[15px]">

          {/* Overview */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Getting Started Is Easy</h2>
            <p>
              {SITE_NAME} is designed to be simple and straightforward so you can focus on what matters most — your exam preparation. Whether you are a first-time user or a returning student, the entire process from sign-up to reviewing your results takes just a few minutes. Here is a detailed walkthrough of how our platform works.
            </p>
          </section>

          {/* Step 1 */}
          <section>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">1</div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Create Your Free Account</h2>
                <p className="mb-3">
                  The first step is to create a free account on {SITE_NAME}. This takes less than 2 minutes and gives you immediate access to 2 free mock tests. Here is what you need to do:
                </p>
                <ol className="list-decimal pl-6 space-y-2 mb-3">
                  <li>Click the <strong>&quot;Sign Up&quot;</strong> button on the homepage or in the top navigation bar.</li>
                  <li>Enter your <strong>full name</strong> — this will appear on your test results and performance reports.</li>
                  <li>Enter your <strong>mobile number</strong> — this is used for account verification and important notifications.</li>
                  <li>Set a <strong>password</strong> (minimum 6 characters) to secure your account.</li>
                  <li>You will receive an <strong>OTP (One-Time Password)</strong> on your mobile number. Enter the OTP to verify your account.</li>
                  <li>That&apos;s it! Your account is now active and you can start taking tests immediately.</li>
                </ol>
                <p>
                  <strong>Important:</strong> We only collect the minimum information needed — your name, mobile number, and password. We do not ask for unnecessary details like your address, age, or educational qualification during sign-up. Your data is protected as per our <a href="/privacy-policy" className="text-emerald-600 hover:text-emerald-700 underline">Privacy Policy</a>.
                </p>
              </div>
            </div>
          </section>

          {/* Step 2 */}
          <section>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">2</div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Browse and Select a Mock Test</h2>
                <p className="mb-3">
                  Once you are logged in, you can browse our collection of mock tests. Here is how to find the right test for you:
                </p>
                <ol className="list-decimal pl-6 space-y-2 mb-3">
                  <li>From the <strong>homepage</strong>, you will see popular test categories displayed as cards — SSC, Banking, Railways, UPSC, Teaching, Defence, State PSC, and General.</li>
                  <li>Click on any <strong>category card</strong> or use the <strong>&quot;Mock Tests&quot;</strong> tab in the navigation to see all available tests.</li>
                  <li>Each test card shows important information: <strong>test name</strong>, <strong>number of questions</strong>, <strong>time limit</strong>, <strong>difficulty level</strong> (easy/medium/hard), and whether it is <strong>free or locked</strong>.</li>
                  <li>You can also see which <strong>category</strong> and <strong>exam</strong> the test belongs to, helping you choose the most relevant test for your preparation.</li>
                  <li>Free users can take up to 2 tests (marked with a green &quot;Free&quot; badge or unlocked icon). PRO subscribers have access to all tests.</li>
                </ol>
                <p>
                  <strong>Tip:</strong> We recommend starting with a test that matches your current preparation level. If you are just beginning your preparation, start with easy or medium difficulty tests. As you improve, move on to harder tests to challenge yourself.
                </p>
              </div>
            </div>
          </section>

          {/* Step 3 */}
          <section>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">3</div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Take the Mock Test</h2>
                <p className="mb-3">
                  This is where the real practice happens. Our test interface is designed to closely match the actual government exam experience:
                </p>
                <ol className="list-decimal pl-6 space-y-2 mb-3">
                  <li>Click on a test card to see its details — test name, description, number of questions, time limit, and difficulty.</li>
                  <li>Click <strong>&quot;Start Test&quot;</strong> to begin. The timer will start immediately, just like in a real exam.</li>
                  <li><strong>Read each question carefully</strong> and select the correct option (A, B, C, or D).</li>
                  <li>Use the <strong>question palette</strong> (typically on the right side on desktop, or accessible via a button on mobile) to navigate between questions. The palette shows which questions you have answered (green), not answered (red), and flagged for review (orange).</li>
                  <li>You can <strong>flag questions</strong> you are unsure about and come back to them later.</li>
                  <li>The <strong>countdown timer</strong> at the top shows the remaining time. If time runs out, your test will be automatically submitted.</li>
                  <li>Click <strong>&quot;Submit Test&quot;</strong> when you are done (or when the timer expires). You will see a confirmation dialog before final submission.</li>
                </ol>
                <p>
                  <strong>About Negative Marking:</strong> Most tests have negative marking (typically -0.25 for each wrong answer). The specific value is shown before you start the test. This matches the pattern of actual government exams and helps you practice the right strategy — answer confidently and avoid random guessing.
                </p>
              </div>
            </div>
          </section>

          {/* Step 4 */}
          <section>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">4</div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Review Your Results and Solutions</h2>
                <p className="mb-3">
                  After submitting your test, you immediately see a detailed results page. This is one of the most valuable parts of your preparation:
                </p>
                <ol className="list-decimal pl-6 space-y-2 mb-3">
                  <li><strong>Score Summary:</strong> See your total score, maximum possible score, and percentage at a glance.</li>
                  <li><strong>Question Breakdown:</strong> View how many questions you got right, wrong, and left unanswered.</li>
                  <li><strong>Time Analysis:</strong> See how much time you spent on the test and your average time per question.</li>
                  <li><strong>Detailed Solutions:</strong> Scroll through each question to see your answer, the correct answer, and a step-by-step explanation. This is where real learning happens — understanding why an answer is correct (or why your answer was wrong) is more valuable than the score itself.</li>
                  <li><strong>Section-wise Analysis:</strong> If the test has multiple sections, see your performance breakdown by section to identify weak areas.</li>
                </ol>
                <p>
                  <strong>Tip:</strong> Don&apos;t just check your score — spend time reading every explanation, even for questions you got right. This reinforces your understanding and helps you learn shortcuts and methods you might not have known.
                </p>
              </div>
            </div>
          </section>

          {/* Step 5 */}
          <section>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">5</div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Track Your Progress Over Time</h2>
                <p className="mb-3">
                  Consistent practice and progress tracking are key to exam success. Here is how to use our tracking features:
                </p>
                <ol className="list-decimal pl-6 space-y-2 mb-3">
                  <li>Go to <strong>&quot;My Attempts&quot;</strong> from the header navigation to see your complete test history.</li>
                  <li>Each attempt shows the test name, date, score, and accuracy percentage.</li>
                  <li>Click on any past attempt to <strong>review the full test, your answers, and solutions</strong> again.</li>
                  <li><strong>Retake tests</strong> to measure your improvement — compare your new score with previous attempts.</li>
                  <li>Identify patterns in your performance — are you consistently weak in a particular subject or topic? Use this insight to focus your study efforts.</li>
                </ol>
                <p>
                  <strong>Recommended Strategy:</strong> Take a test, review solutions thoroughly, study the weak topics for 2-3 days, then retake the same test or a similar one. This cycle of &quot;test → review → study → retest&quot; is one of the most effective preparation strategies used by successful candidates.
                </p>
              </div>
            </div>
          </section>

          {/* Step 6 */}
          <section>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg">6</div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Upgrade to PRO for Unlimited Access</h2>
                <p className="mb-3">
                  After using your 2 free tests, you can upgrade to the PRO plan for unlimited access to all mock tests:
                </p>
                <ol className="list-decimal pl-6 space-y-2 mb-3">
                  <li>Click the <strong>&quot;Subscribe&quot;</strong> button or the <strong>Crown icon</strong> in the header.</li>
                  <li>You will see the PRO plan details: <strong>unlimited access to all tests for &#8377;100</strong> (one-time payment, not monthly).</li>
                  <li>Click <strong>&quot;Subscribe Now&quot;</strong> to proceed to the secure Razorpay payment page.</li>
                  <li>Pay using <strong>UPI, debit card, credit card, net banking, or wallet</strong>.</li>
                  <li>Once payment is confirmed, your account is <strong>instantly upgraded</strong> to PRO — no waiting, no manual activation.</li>
                  <li>All locked tests are now accessible. Take as many tests as you want, anytime.</li>
                </ol>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-3">
                  <p className="font-semibold text-amber-800 text-sm mb-1">Why PRO is worth it:</p>
                  <ul className="list-disc pl-5 text-amber-900 text-sm space-y-1">
                    <li>Just &#8377;100 for unlimited access — no monthly fees, no hidden charges</li>
                    <li>Access to all current and future tests across all exam categories</li>
                    <li>Complete performance history and analytics</li>
                    <li>Compared to coaching test series that cost &#8377;500-2000, this is the most affordable option</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Best Practices */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Best Practices for Effective Preparation</h2>
            <p className="mb-4">Here are some tips from our team and successful exam candidates to help you make the most of {SITE_NAME}:</p>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-1">Practice Regularly</h3>
                <p>Consistency is more important than intensity. Taking 1-2 tests every day is better than taking 10 tests in one day and then not practicing for a week. Set a daily schedule and stick to it.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-1">Review Every Solution</h3>
                <p>The real learning happens after the test. Spend at least as much time reviewing solutions as you spent taking the test. Understand the reasoning behind every correct answer and learn from every mistake.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-1">Simulate Exam Conditions</h3>
                <p>Take tests in a quiet environment without distractions. Don&apos;t pause or look up answers during the test. Treat every mock test as if it were the real exam. This builds the mental stamina and focus needed on exam day.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-1">Focus on Weak Areas</h3>
                <p>Use your performance analytics to identify subjects and topics where you score lower. Spend extra time studying these areas and then take tests specifically in those categories to measure improvement.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-1">Manage Negative Marking Smartly</h3>
                <p>Since our tests have negative marking like real exams, practice the art of selective answering. Attempt questions you are confident about first. Flag uncertain questions and come back to them. Only guess when you can eliminate at least 2 options.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-1">Track and Compare</h3>
                <p>Retake tests after studying to see your improvement. Compare scores across attempts to stay motivated and identify if your preparation strategy is working. If your scores are not improving, adjust your study plan accordingly.</p>
              </div>
            </div>
          </section>

          {/* Comparison table */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Free vs PRO Comparison</h2>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-3 font-semibold text-gray-900">Feature</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-900">Free</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-900">PRO (&#8377;100)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="px-4 py-3">Mock Tests</td><td className="text-center px-4 py-3">2 tests</td><td className="text-center px-4 py-3 text-emerald-600 font-semibold">Unlimited</td></tr>
                  <tr className="bg-gray-50/50"><td className="px-4 py-3">Exam Categories</td><td className="text-center px-4 py-3">All categories</td><td className="text-center px-4 py-3 text-emerald-600 font-semibold">All categories</td></tr>
                  <tr><td className="px-4 py-3">Test Interface</td><td className="text-center px-4 py-3">Full access</td><td className="text-center px-4 py-3 text-emerald-600 font-semibold">Full access</td></tr>
                  <tr className="bg-gray-50/50"><td className="px-4 py-3">Detailed Solutions</td><td className="text-center px-4 py-3">Full access</td><td className="text-center px-4 py-3 text-emerald-600 font-semibold">Full access</td></tr>
                  <tr><td className="px-4 py-3">Performance Analytics</td><td className="text-center px-4 py-3">Full access</td><td className="text-center px-4 py-3 text-emerald-600 font-semibold">Full access</td></tr>
                  <tr className="bg-gray-50/50"><td className="px-4 py-3">New Test Access</td><td className="text-center px-4 py-3">Locked</td><td className="text-center px-4 py-3 text-emerald-600 font-semibold">Instant access</td></tr>
                  <tr><td className="px-4 py-3">Price</td><td className="text-center px-4 py-3">Free</td><td className="text-center px-4 py-3 font-semibold">&#8377;100 (one-time)</td></tr>
                </tbody>
              </table>
            </div>
          </section>

        </div>

        {/* CTA */}
        <div className="mt-12 bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Ready to Start Your Preparation?</h2>
          <p className="text-sm text-gray-600 mb-4">Sign up for free and take your first mock test in under 2 minutes.</p>
          <a
            href="/"
            className="inline-flex items-center justify-center bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold text-sm hover:bg-emerald-700 transition-colors"
          >
            Start Free Mock Test
          </a>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </div>
      </div>
    </main>
  );
}
