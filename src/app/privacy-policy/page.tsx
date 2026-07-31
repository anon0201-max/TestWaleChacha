import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | TestWaleChacha',
  description: 'Learn how TestWaleChacha collects, uses, and protects your personal data. Read our complete privacy policy including DPDPA 2023 compliance, cookie usage, and user rights.',
};

const BASE_URL = 'https://test-wale-chacha.vercel.app';
const SITE_NAME = 'TestWaleChacha';
const EMAIL = 'testwalechacha@gmail.com';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 text-sm font-medium mb-8 transition-colors"
        >
          &larr; Back to {SITE_NAME}
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: July 31, 2026</p>

        <div className="space-y-8 text-gray-700 leading-relaxed text-[15px]">
          {/* Introduction */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
            <p>
              {SITE_NAME} (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website {BASE_URL} (the &quot;Service&quot;). By accessing or using our Service, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">2.1 Personal Data</h3>
            <p className="mb-3">We may collect the following personal data that you voluntarily provide:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Name and email address (during registration or subscription)</li>
              <li>Phone number (optional, provided during sign-up)</li>
              <li>Payment information processed securely through Razorpay (we do not store card/bank details)</li>
              <li>Exam performance data, test scores, and attempt history</li>
              <li>Any information you provide when contacting our support team</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mt-5 mb-2">2.2 Automatically Collected Data</h3>
            <p className="mb-3">When you access our Service, we may automatically collect:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>IP address and approximate geographic location</li>
              <li>Browser type, device type, and operating system</li>
              <li>Pages visited, time spent, and navigation patterns</li>
              <li>Referral source and search queries used to find our site</li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Cookies and Tracking Technologies</h2>
            <p className="mb-3">We use cookies and similar tracking technologies to enhance your experience. These include:</p>
            <ul className="list-disc pl-6 space-y-1.5 mb-3">
              <li><strong>Essential Cookies:</strong> Required for the Service to function (e.g., authentication, session management)</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our platform</li>
              <li><strong>Advertising Cookies:</strong> Used by Google Ads for remarketing and ad performance tracking</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
            </ul>
            <p>
              You can manage your cookie preferences through your browser settings. Note that disabling certain cookies may affect the functionality of the Service.
            </p>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Third-Party Services</h2>
            <p className="mb-3">We use the following third-party services that may collect your data:</p>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">4.1 Google Ads</h3>
            <p className="mb-3">
              We use Google Ads to promote our services. Google may use cookies and similar technologies to serve ads based on your prior visits to our website and other websites. You can opt out of personalized advertising by visiting{' '}
              <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 underline">
                Google Ads Settings
              </a>.
            </p>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">4.2 Razorpay</h3>
            <p className="mb-3">
              All payment transactions on {SITE_NAME} are processed securely through Razorpay Payment Gateway. Razorpay is PCI DSS compliant and handles all payment data in accordance with their own privacy policy. We do not store, process, or have access to your full payment card details.
            </p>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">4.3 Google Analytics</h3>
            <p>
              We may use Google Analytics to understand user behavior and improve our platform. Google Analytics collects information anonymously and reports website trends without identifying individual users.
            </p>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. How We Use Your Information</h2>
            <p className="mb-3">We use the collected information for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Providing and maintaining our online mock test platform</li>
              <li>Processing subscription payments and managing your account</li>
              <li>Delivering and improving test content, performance analytics, and study recommendations</li>
              <li>Communicating with you regarding your account, subscription, or support requests</li>
              <li>Sending promotional communications (with your consent, which you may withdraw at any time)</li>
              <li>Analyzing usage patterns to improve user experience and platform performance</li>
              <li>Complying with legal obligations and enforcing our Terms &amp; Conditions</li>
            </ul>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Data Sharing and Disclosure</h2>
            <p className="mb-3">We do not sell your personal data. We may share your information only in the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li><strong>With service providers:</strong> Razorpay (payments), Google (analytics and advertising), and hosting providers</li>
              <li><strong>For legal compliance:</strong> When required by law, regulation, legal process, or governmental request</li>
              <li><strong>For safety:</strong> To protect the rights, property, or safety of {SITE_NAME}, our users, or the public</li>
              <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets (with notice)</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal data, including HTTPS encryption, secure payment processing via Razorpay, access controls, and regular security assessments. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          {/* User Rights */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Your Rights</h2>
            <p className="mb-3">Under applicable data protection laws, you have the following rights:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li><strong>Right to Access:</strong> Request a copy of your personal data we hold</li>
              <li><strong>Right to Correction:</strong> Request correction of inaccurate or incomplete data</li>
              <li><strong>Right to Deletion:</strong> Request deletion of your personal data (subject to legal obligations)</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw your consent for data processing at any time</li>
              <li><strong>Right to Data Portability:</strong> Request your data in a structured, machine-readable format</li>
              <li><strong>Right to Opt Out:</strong> Opt out of marketing communications and personalized advertising</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, please contact us at <a href={`mailto:${EMAIL}`} className="text-emerald-600 hover:text-emerald-700 underline">{EMAIL}</a>.
            </p>
          </section>

          {/* DPDPA 2023 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. DPDPA 2023 Compliance</h2>
            <p className="mb-3">
              {SITE_NAME} is committed to complying with the Digital Personal Data Protection Act, 2023 (DPDPA 2023) of India. In accordance with the DPDPA:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>We collect and process personal data only with your consent and for lawful, specified purposes</li>
              <li>We take reasonable security safeguards to protect your personal data</li>
              <li>We do not retain personal data beyond the period necessary for the purposes for which it was collected</li>
              <li>We provide a mechanism for you to withdraw consent and request deletion of your data</li>
              <li>We will notify the Data Protection Board and affected users in the event of a personal data breach</li>
              <li>Children&apos;s data (individuals under 18 years) is processed only with verifiable parental consent</li>
            </ul>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Children&apos;s Privacy</h2>
            <p>
              Our Service is not directed at children under the age of 13. We do not knowingly collect personal data from children under 13. If you are a parent or guardian and believe your child has provided us with personal data, please contact us at <a href={`mailto:${EMAIL}`} className="text-emerald-600 hover:text-emerald-700 underline">{EMAIL}</a> and we will take steps to delete such information. For users between 13 and 17 years of age, we may collect personal data only with verifiable parental or guardian consent as required under DPDPA 2023.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Data Retention</h2>
            <p>
              We retain your personal data only for as long as necessary to fulfill the purposes described in this Privacy Policy, unless a longer retention period is required or permitted by law. When your account is deleted, we will remove your personal data from our active records within a reasonable timeframe, except where we are required to retain it for legal, accounting, or regulatory purposes.
            </p>
          </section>

          {/* International Transfers */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">12. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your jurisdiction. By using our Service, you consent to such transfers. We take appropriate safeguards to ensure your data is protected during international transfers.
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">13. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by posting the updated policy on this page with a revised &quot;Last updated&quot; date. We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">14. Contact Us</h2>
            <p className="mb-3">If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
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
