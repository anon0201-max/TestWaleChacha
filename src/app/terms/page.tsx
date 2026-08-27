import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms & Conditions | TestWaleChacha',
  description: 'Read the Terms and Conditions for using TestWaleChacha. Understand your rights and obligations regarding our online mock test platform, subscription, and services.',
};

const BASE_URL = 'https://www.testwalechacha.online';
const SITE_NAME = 'TestWaleChacha';
const EMAIL = 'testwalechacha@gmail.com';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 text-sm font-medium mb-8 transition-colors"
        >
          &larr; Back to {SITE_NAME}
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Terms &amp; Conditions</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: July 31, 2026</p>

        <div className="space-y-8 text-gray-700 leading-relaxed text-[15px]">
          {/* Acceptance */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing, registering for, or using the services provided by {SITE_NAME} (&quot;Service&quot;) through our website at {BASE_URL}, you agree to be bound by these Terms and Conditions (&quot;Terms&quot;). If you do not agree with any part of these Terms, you must not use our Service. We recommend that you read these Terms carefully before using the platform.
            </p>
          </section>

          {/* Services Description */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Description of Services</h2>
            <p className="mb-3">
              {SITE_NAME} provides an online mock test platform designed to help students and aspirants prepare for various Indian government and competitive examinations. Our services include:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Online mock tests for competitive examinations (SSC, UPSC, IBPS, RRB, CTET, CDS, NDA, State PSC, and others)</li>
              <li>Performance analytics and score tracking</li>
              <li>Detailed solutions and explanations for test questions</li>
              <li>Free tier with limited test access and premium subscription with unlimited access</li>
              <li>Exam preparation resources and study material</li>
            </ul>
            <p className="mt-3">
              We reserve the right to modify, suspend, or discontinue any part of the Service at any time without prior notice.
            </p>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Accounts</h2>
            <p className="mb-3">To access certain features of our Service, you must register and create an account. By creating an account, you agree to:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Keep your account credentials confidential and secure</li>
              <li>Accept responsibility for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Not create multiple accounts for the purpose of misuse</li>
            </ul>
            <p className="mt-3">
              We reserve the right to suspend or terminate your account if any information provided is found to be inaccurate, incomplete, or in violation of these Terms.
            </p>
          </section>

          {/* Subscription & Payments */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Subscription and Payments</h2>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">4.1 Subscription Plans</h3>
            <p className="mb-3">
              {SITE_NAME} offers both free and premium subscription plans. The premium subscription is available at a price of &#8377;100 (Indian Rupees) for the subscription period as described at the time of purchase. The free tier provides limited access to mock tests and basic features.
            </p>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">4.2 Payment Processing</h3>
            <p className="mb-3">
              All payments are processed securely through Razorpay Payment Gateway. By subscribing, you authorize {SITE_NAME} to charge the applicable subscription fee through Razorpay. We accept UPI, debit cards, credit cards, net banking, and wallets as supported by Razorpay.
            </p>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">4.3 Subscription Renewal</h3>
            <p className="mb-3">
              Your subscription will be active for the period specified at the time of purchase. We will notify you before your subscription expires. Auto-renewal may apply based on the subscription plan selected.
            </p>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">4.4 Refund Policy</h3>
            <p>
              Refund requests are handled as per our <a href="/refund-policy" className="text-emerald-600 hover:text-emerald-700 underline">Refund &amp; Cancellation Policy</a>. Please review it before making a purchase.
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Intellectual Property</h2>
            <p className="mb-3">
              All content on the {SITE_NAME} platform, including but not limited to test questions, answers, explanations, study materials, logos, graphics, user interface design, and software code, is the intellectual property of {SITE_NAME} or its content licensors and is protected by applicable intellectual property laws.
            </p>
            <p className="mb-3">You are granted a limited, non-exclusive, non-transferable, revocable license to access and use the Service for your personal, non-commercial educational purposes. You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Copy, reproduce, distribute, or publicly display any content from the platform</li>
              <li>Modify, adapt, or create derivative works from any content</li>
              <li>Use any automated means (bots, scrapers) to extract data from the platform</li>
              <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
              <li>Share your account credentials or subscription access with others</li>
            </ul>
          </section>

          {/* User Conduct */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. User Conduct</h2>
            <p className="mb-3">You agree to use the Service in a manner that is lawful, respectful, and fair. You must not:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Attempt to gain unauthorized access to any part of the Service or its related systems</li>
              <li>Use the Service for any unlawful purpose or in violation of any applicable laws or regulations</li>
              <li>Interfere with or disrupt the Service, servers, or networks connected to the Service</li>
              <li>Upload, transmit, or distribute any viruses, malware, or other harmful code</li>
              <li>Share test questions, answers, or proprietary content publicly or on third-party platforms</li>
              <li>Impersonate any person or entity or misrepresent your affiliation with any person or entity</li>
              <li>Engage in any form of cheating, including using unfair means during tests</li>
              <li>Harass, abuse, or threaten other users of the platform</li>
            </ul>
          </section>

          {/* User Content */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. User-Generated Content</h2>
            <p className="mb-3">
              If our Service allows you to submit, post, or transmit any content (such as reviews, feedback, or comments), you retain ownership of such content. However, by submitting content, you grant {SITE_NAME} a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and distribute such content in connection with operating and improving the Service.
            </p>
            <p>
              We reserve the right to remove any user-generated content that violates these Terms or is otherwise objectionable, at our sole discretion and without notice.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Limitation of Liability</h2>
            <p className="mb-3">
              To the fullest extent permitted by applicable law, {SITE_NAME} and its directors, employees, partners, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising from or related to your use of or inability to use the Service.
            </p>
            <p className="mb-3">
              {SITE_NAME} does not guarantee that the test content will guarantee success in any examination. The mock tests are designed for practice purposes only, and actual examination questions may differ. We do not make any representations about the accuracy or completeness of the content.
            </p>
            <p>
              Our total liability to you for any claims arising out of or relating to the Service shall not exceed the amount you have paid to us in the twelve (12) months preceding the claim.
            </p>
          </section>

          {/* Disclaimer */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Disclaimer of Warranties</h2>
            <p>
              The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis without any warranties of any kind, whether express, implied, or statutory, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Service will be uninterrupted, error-free, or free of viruses or other harmful components.
            </p>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless {SITE_NAME}, its affiliates, officers, directors, employees, and agents from and against any and all claims, liabilities, damages, losses, costs, and expenses (including reasonable legal fees) arising out of or in any way connected with your access to or use of the Service, your violation of these Terms, or your violation of any rights of another party.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Governing Law and Dispute Resolution</h2>
            <p className="mb-3">
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of laws provisions. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts in India.
            </p>
            <p>
              Before initiating any legal proceedings, you agree to first attempt to resolve the dispute amicably by contacting us at <a href={`mailto:${EMAIL}`} className="text-emerald-600 hover:text-emerald-700 underline">{EMAIL}</a>. We will endeavor to respond to and resolve your concern within 15 business days.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Termination</h2>
            <p className="mb-3">
              We reserve the right to suspend or terminate your access to the Service at any time, with or without cause, and with or without notice. Upon termination:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Your right to use the Service will immediately cease</li>
              <li>Any active subscription may be subject to our Refund Policy</li>
              <li>Provisions of these Terms that by their nature should survive termination will remain in effect</li>
            </ul>
            <p className="mt-3">
              You may terminate your account at any time by contacting us or deleting your account through the platform settings.
            </p>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">13. Modifications to Terms</h2>
            <p>
              We reserve the right to modify, amend, or update these Terms at any time. We will notify you of significant changes by posting the updated Terms on this page with a revised &quot;Last updated&quot; date and, where appropriate, by sending an email notification to the address associated with your account. Your continued use of the Service after any modifications constitutes your acceptance of the revised Terms.
            </p>
          </section>

          {/* Severability */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">14. Severability</h2>
            <p>
              If any provision of these Terms is held to be invalid, illegal, or unenforceable by a court of competent jurisdiction, such invalidity, illegality, or unenforceability shall not affect any other provision of these Terms, and the remaining provisions shall continue in full force and effect.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">15. Contact Us</h2>
            <p className="mb-3">If you have any questions or concerns about these Terms and Conditions, please contact us:</p>
            <div className="bg-gray-50 rounded-lg p-5 space-y-2">
              <p><strong>{SITE_NAME}</strong></p>
              <p>Email: <a href={`mailto:${EMAIL}`} className="text-emerald-600 hover:text-emerald-700 underline">{EMAIL}</a></p>
              <p>Website: <a href={BASE_URL} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 underline">{BASE_URL}</a></p>
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
