import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ) | TestWaleChacha',
  description: 'Get answers to common questions about TestWaleChacha — how to take mock tests, pricing, subscription, exam categories, negative marking, and more. Complete guide for Indian government exam aspirants.',
};

const BASE_URL = 'https://www.testwalechacha.online';
const SITE_NAME = 'TestWaleChacha';

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 text-sm font-medium mb-8 transition-colors"
        >
          &larr; Back to {SITE_NAME}
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: August 17, 2026</p>

        <div className="space-y-10 text-gray-700 leading-relaxed text-[15px]">

          {/* ===== GENERAL ===== */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 text-sm font-bold shrink-0">1</span>
              General Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What is TestWaleChacha?</h3>
                <p>
                  {SITE_NAME} is India&apos;s affordable online mock test platform built specifically for government and competitive exam aspirants. We provide timed mock tests that simulate the actual exam environment with a real exam-like interface, detailed solutions for every question, performance analytics, and progress tracking. Our platform covers major exams including SSC CGL, IBPS PO, RRB NTPC, UPSC Civil Services, CTET, CDS, NDA, and State PSC exams. The platform is designed to be mobile-first so you can practice anytime, anywhere from your phone or computer.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Is TestWaleChacha free to use?</h3>
                <p>
                  Yes, {SITE_NAME} offers a free tier that includes 2 free mock tests. You can sign up for free, take your first 2 tests at no cost, and experience the full platform features including the exam interface, timer, solutions, and performance analytics. After the free tests, you can upgrade to our PRO plan for unlimited access to all tests for just &#8377;100. This is one of the most affordable pricing plans available for any online mock test platform in India.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How is TestWaleChacha different from other mock test platforms?</h3>
                <p>
                  {SITE_NAME} stands out in several ways. First, our pricing is extremely affordable at just &#8377;100 for unlimited access to all tests — most competitors charge &#8377;500 to &#8377;2000 or more for similar access. Second, our interface closely replicates the actual government exam environment including timers, question palettes, section navigation, and negative marking — so there are no surprises on exam day. Third, every question comes with detailed step-by-step explanations so you can learn from your mistakes. Fourth, our platform is fully mobile-optimized so you can practice during commutes or breaks. Finally, we provide subject-wise and topic-wise performance analytics that help you identify and improve on your weak areas.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Who should use TestWaleChacha?</h3>
                <p>
                  {SITE_NAME} is designed for anyone preparing for Indian government and competitive examinations. This includes students preparing for SSC exams (CGL, CHSL, MTS, GD Constable, Stenographer), banking exams (IBPS PO, IBPS Clerk, IBPS SO, SBI PO, RBI Grade B), railway exams (RRB NTPC, RRB ALP, RRB Group D, RRB JE), UPSC Civil Services Prelims (both GS Paper and CSAT), teaching exams (CTET Paper I and Paper II, State TET), defence exams (CDS, NDA), State Public Service Commission exams, and other government entrance examinations. Whether you are a first-time aspirant or an experienced candidate looking for additional practice, our platform has tests suited for all preparation levels.
                </p>
              </div>
            </div>
          </section>

          {/* ===== ACCOUNT & REGISTRATION ===== */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 text-sm font-bold shrink-0">2</span>
              Account &amp; Registration
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How do I create an account on TestWaleChacha?</h3>
                <p>
                  Creating an account is simple and free. Click the &quot;Sign Up&quot; button on the homepage or in the header. You can register using your mobile number. Enter your name, mobile number, and set a password. You will receive an OTP on your mobile number for verification. Once verified, your account will be created and you can immediately start taking free mock tests. The entire process takes less than 2 minutes.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I use TestWaleChacha without creating an account?</h3>
                <p>
                  No, you need to create a free account to take mock tests on {SITE_NAME}. This is because we need to save your test attempts, performance data, and progress. Your account also ensures that your free test usage is tracked fairly. The registration process is completely free and takes less than 2 minutes — we only ask for your name, mobile number, and a password.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">I forgot my password. How do I reset it?</h3>
                <p>
                  You can reset your password from the login page. Click on &quot;Forgot Password&quot; and enter your registered mobile number. You will receive an OTP for verification. Once verified, you can set a new password for your account. If you continue to face issues, please contact us at testwalechacha@gmail.com and we will help you resolve the problem.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Is my personal data safe with TestWaleChacha?</h3>
                <p>
                  Yes, we take your privacy and data security very seriously. We collect only the minimum information necessary to provide our services (name, mobile number, email). We do not sell or share your personal data with third parties for marketing purposes. Our platform uses secure encryption for data transmission and follows the Digital Personal Data Protection Act (DPDPA) 2023 guidelines. You can read our complete <a href="/privacy-policy" className="text-emerald-600 hover:text-emerald-700 underline">Privacy Policy</a> for detailed information about how we handle your data.
                </p>
              </div>
            </div>
          </section>

          {/* ===== TESTS & EXAM PREPARATION ===== */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 text-sm font-bold shrink-0">3</span>
              Tests &amp; Exam Preparation
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Which exams does TestWaleChacha cover?</h3>
                <p className="mb-3">
                  We cover a wide range of Indian government and competitive examinations across multiple categories:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 mb-3">
                  <li><strong>SSC:</strong> CGL, CHSL, MTS, GD Constable, Stenographer, CPO, JE</li>
                  <li><strong>Banking:</strong> IBPS PO, IBPS Clerk, IBPS SO, SBI PO, SBI Clerk, RBI Grade B, RBI Assistant</li>
                  <li><strong>Railways (RRB):</strong> NTPC, ALP, Group D, JE, Paramedical</li>
                  <li><strong>UPSC:</strong> Civil Services Prelims (GS Paper I &amp; CSAT)</li>
                  <li><strong>Teaching:</strong> CTET Paper I, CTET Paper II, State TET exams</li>
                  <li><strong>Defence:</strong> CDS (IMA, INA, AFA, OTA), NDA (Mathematics &amp; General Ability)</li>
                  <li><strong>State PSC:</strong> Various state-level public service commission exams</li>
                  <li><strong>General:</strong> GK, Current Affairs, Reasoning, and Aptitude tests</li>
                </ul>
                <p>We are continuously adding new tests and exam categories. If you need a specific exam that is not listed, please <a href="/contact" className="text-emerald-600 hover:text-emerald-700 underline">contact us</a> and we will try to add it.</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How are the mock tests structured?</h3>
                <p>
                  Our mock tests are designed to closely simulate the actual exam experience. Each test has a fixed number of questions, a time limit (usually 15 to 60 minutes depending on the exam type), and may include negative marking (typically 0.25 marks deducted for each wrong answer, similar to actual exams). The test interface includes a real-time countdown timer, a question palette showing answered/unanswered/flagged questions, and section-wise navigation. After completing a test, you receive detailed results including your score, correct/incorrect/unanswered counts, time taken per question, and detailed explanations for every question.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Is there negative marking in the tests?</h3>
                <p>
                  Yes, most of our tests include negative marking to simulate the actual exam conditions. Typically, 0.25 marks (or 1/4th of the question marks) are deducted for each wrong answer. The specific negative marking value is displayed before you start each test so you know exactly what to expect. Negative marking is a common feature in government exams like SSC CGL, IBPS PO, and UPSC — practicing with negative marking helps you develop the right exam strategy and avoid unnecessary guesswork.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I pause a test and resume it later?</h3>
                <p>
                  Currently, our tests are designed to be completed in a single sitting, similar to the actual exam conditions. Once you start a test, the timer begins and you must complete it within the allotted time. This design choice is intentional — real government exams do not allow pausing or resuming. By practicing under real exam conditions, you build the stamina and time management skills needed for the actual exam day. However, you can review your completed tests and solutions at any time from the &quot;My Attempts&quot; section.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How detailed are the solutions provided?</h3>
                <p>
                  Every question in our mock tests comes with a detailed explanation. The solution includes the correct answer, the reasoning behind it, and step-by-step working where applicable. For reasoning and quantitative aptitude questions, the solution explains the method and shortcuts. For general knowledge questions, the solution provides relevant context and additional information. These explanations help you understand not just the answer, but the concept behind it — so you can tackle similar questions in the actual exam with confidence.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How often are new tests added?</h3>
                <p>
                  We add new tests regularly based on upcoming exam schedules, user demand, and current affairs. Our content team continuously creates fresh questions to keep the question bank updated and relevant. We also add new exam categories when there is sufficient demand. To stay updated about new test additions, you can join our <a href="https://whatsapp.com/channel/0029VbDsNS4A2pL5AnlWwm1G" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 underline">WhatsApp Channel</a> where we announce all new additions.
                </p>
              </div>
            </div>
          </section>

          {/* ===== SUBSCRIPTION & PAYMENT ===== */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 text-sm font-bold shrink-0">4</span>
              Subscription &amp; Payment
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What is the PRO subscription plan?</h3>
                <p>
                  The PRO subscription plan gives you unlimited access to all mock tests on {SITE_NAME} for a one-time payment of &#8377;100. This is not a monthly subscription — you pay once and get access to all current and future tests. There are no hidden charges, no recurring payments, and no additional fees. With the PRO plan, you can take as many tests as you want, review all solutions, and track your complete performance history. This makes it one of the most cost-effective mock test platforms available for Indian exam preparation.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How do I subscribe to the PRO plan?</h3>
                <p>
                  Subscribing is simple. After logging in, click on the &quot;Subscribe&quot; button (or the Crown icon in the header). You will be redirected to a secure payment page powered by Razorpay. We accept UPI, debit cards, credit cards, net banking, and wallets. Once the payment is completed, your account is instantly upgraded to PRO and you get immediate access to all tests. The entire process takes less than a minute.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Is the payment secure?</h3>
                <p>
                  Yes, absolutely. We use <strong>Razorpay</strong> — one of India&apos;s most trusted and widely used payment gateways — to process all payments. Razorpay is PCI DSS compliant and uses bank-grade encryption to protect your payment information. We never store your card details or banking credentials on our servers. All transactions are processed securely through Razorpay&apos;s infrastructure. You will receive a payment confirmation receipt from Razorpay via email after a successful transaction.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I get a refund after subscribing?</h3>
                <p>
                  We offer a limited refund policy. If you are not satisfied with the PRO plan, you can request a refund within 24 hours of purchase, provided you have attempted no more than 2 tests after subscribing. Refund requests can be sent to testwalechacha@gmail.com. For complete details, please read our <a href="/refund-policy" className="text-emerald-600 hover:text-emerald-700 underline">Refund &amp; Cancellation Policy</a>.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How many free tests do I get before subscribing?</h3>
                <p>
                  Every new user gets 2 free mock tests upon registration. These free tests give you a complete experience of the platform — including the exam interface, timer, question palette, solutions, and performance analytics. After using your 2 free tests, you will need to subscribe to the PRO plan (&#8377;100) to continue taking tests. We believe that trying the platform first is the best way for you to evaluate its quality before making any payment.
                </p>
              </div>
            </div>
          </section>

          {/* ===== TECHNICAL ===== */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 text-sm font-bold shrink-0">5</span>
              Technical &amp; Platform
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I use TestWaleChacha on my mobile phone?</h3>
                <p>
                  Yes, {SITE_NAME} is fully optimized for mobile devices. Our platform uses a responsive design that works perfectly on smartphones, tablets, laptops, and desktop computers. The test interface, question navigation, and timer are all designed for touch screens. You can practice during your commute, lunch breaks, or any free time — all you need is a web browser (Chrome, Safari, Firefox, or Edge) and an internet connection. We also support PWA (Progressive Web App) installation so you can add TestWaleChacha to your home screen like a native app for quick access.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Do I need to download any app?</h3>
                <p>
                  No, you do not need to download any app from the Play Store or App Store. {SITE_NAME} works entirely in your web browser. Simply visit our website, log in, and start taking tests. However, we do offer a PWA (Progressive Web App) feature — when you visit our site on mobile, your browser may show an &quot;Install App&quot; prompt. If you install it, you get an app-like icon on your home screen for quick access, but the experience is exactly the same as the website.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What browsers are supported?</h3>
                <p>
                  {SITE_NAME} works on all modern web browsers including Google Chrome (recommended), Mozilla Firefox, Apple Safari, Microsoft Edge, and Samsung Internet. We recommend using the latest version of your preferred browser for the best experience. The platform requires JavaScript to be enabled for the test interface and timer to function correctly.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I use TestWaleChacha offline?</h3>
                <p>
                  No, an active internet connection is required to use {SITE_NAME}. This is because our tests are served from our servers and your results and performance data are saved in real-time. We recommend using a stable internet connection, especially during tests, to ensure the timer and submission work correctly. A minimum speed of 2G or above is sufficient as our platform is optimized for low-bandwidth usage.
                </p>
              </div>
            </div>
          </section>

          {/* ===== RESULTS & PERFORMANCE ===== */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 text-sm font-bold shrink-0">6</span>
              Results &amp; Performance
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How can I view my previous test results?</h3>
                <p>
                  After completing any test, you can view your results immediately. To see all your past test results, go to the &quot;My Attempts&quot; section from the header menu. This section shows a complete history of all tests you have taken, including your score, total marks, correct/incorrect/unanswered counts, and the date and time of each attempt. You can click on any past attempt to review the questions, your answers, and the detailed solutions.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What kind of performance analytics do you provide?</h3>
                <p>
                  Our performance analytics help you understand your strengths and weaknesses across different subjects and topics. After each test, you can see your overall score, accuracy percentage, time efficiency, and a breakdown of correct/incorrect answers. Over multiple attempts, you can track your improvement trends. The analytics help you identify which topics need more practice and which areas you are strong in — allowing you to plan your preparation more effectively.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I retake the same test multiple times?</h3>
                <p>
                  Yes, you can retake any test multiple times. Each attempt is recorded separately in your &quot;My Attempts&quot; history. Retaking tests is actually a great strategy — it helps you reinforce concepts, improve your speed, and track your improvement over time. Many of our users retake tests after studying the solutions to measure their progress.
                </p>
              </div>
            </div>
          </section>

          {/* ===== SUPPORT ===== */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 text-sm font-bold shrink-0">7</span>
              Support &amp; Contact
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How can I contact TestWaleChacha for support?</h3>
                <p>
                  You can reach us through multiple channels. You can use the <a href="/contact" className="text-emerald-600 hover:text-emerald-700 underline">Contact Us</a> form on our website to send us a message. You can also email us directly at testwalechacha@gmail.com. For quick updates and announcements, join our <a href="https://whatsapp.com/channel/0029VbDsNS4A2pL5AnlWwm1G" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 underline">WhatsApp Channel</a>. We typically respond to all queries within 24 hours.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">I found an error in a question or solution. What should I do?</h3>
                <p>
                  We strive for accuracy in all our content, but if you find an error in any question, answer, or solution, please let us know immediately. You can report it through the <a href="/contact" className="text-emerald-600 hover:text-emerald-700 underline">Contact Us</a> page or email us at testwalechacha@gmail.com with the test name, question number, and the issue you found. Our content team will review and correct it as soon as possible. We appreciate your feedback as it helps us improve the quality of our platform for all users.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">I want a specific exam or test added. Can you add it?</h3>
                <p>
                  Yes, we welcome suggestions for new exams and tests. If there is a specific exam, subject, or topic that you would like us to add, please send us a request through the <a href="/contact" className="text-emerald-600 hover:text-emerald-700 underline">Contact Us</a> page or message us on our <a href="https://whatsapp.com/channel/0029VbDsNS4A2pL5AnlWwm1G" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 underline">WhatsApp Channel</a>. We prioritize adding content based on user demand and upcoming exam schedules. Your suggestion helps us understand what our users need most.
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* CTA */}
        <div className="mt-12 bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Still have questions?</h2>
          <p className="text-sm text-gray-600 mb-4">We&apos;re here to help. Reach out and we&apos;ll get back to you within 24 hours.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-emerald-700 transition-colors"
            >
              Contact Us
            </a>
            <a
              href="https://whatsapp.com/channel/0029VbDsNS4A2pL5AnlWwm1G"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-white text-emerald-700 border border-emerald-300 px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-emerald-50 transition-colors"
            >
              Join WhatsApp Channel
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </div>
      </div>
    </main>
  );
}
