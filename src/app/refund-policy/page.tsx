import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | TestWaleChacha',
  description: 'Read the Refund and Cancellation Policy of TestWaleChacha. Understand the conditions for subscription refunds, how to request a refund, and processing timelines.',
};

const BASE_URL = 'https://test-wale-chacha.vercel.app';
const SITE_NAME = 'TestWaleChacha';
const EMAIL = 'testwalechacha@gmail.com';

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 text-sm font-medium mb-8 transition-colors"
        >
          &larr; Back to {SITE_NAME}
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Refund &amp; Cancellation Policy</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: July 31, 2026</p>

        <div className="space-y-8 text-gray-700 leading-relaxed text-[15px]">
          {/* Overview */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Overview</h2>
            <p>
              At {SITE_NAME}, we strive to provide a high-quality experience for all our users. We understand that there may be situations where you are not satisfied with your subscription purchase. This Refund &amp; Cancellation Policy outlines the conditions under which we process refunds and cancellations for subscription purchases made through our platform.
            </p>
          </section>

          {/* Subscription Refund Policy */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Subscription Refund Policy</h2>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">2.1 Eligibility for Refund</h3>
            <p className="mb-3">
              You may be eligible for a refund under the following conditions:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li><strong>Within 24 hours:</strong> If you request a refund within 24 hours of your subscription purchase and have not taken more than 2 mock tests, you are eligible for a full refund of &#8377;100.</li>
              <li><strong>Technical Issues:</strong> If you are unable to access the paid services due to a verified technical issue on our end that we are unable to resolve within 48 hours of your reporting it, you are eligible for a full refund.</li>
              <li><strong>Duplicate Payment:</strong> If you were charged twice for the same subscription due to a payment processing error, the duplicate charge will be refunded in full.</li>
              <li><strong>Service Deficiency:</strong> If the subscription features promised at the time of purchase are not available or significantly differ from what was described, you may request a refund.</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mt-5 mb-2">2.2 Non-Refundable Situations</h3>
            <p className="mb-3">The following situations are NOT eligible for a refund:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Refund requests made more than 24 hours after purchase</li>
              <li>Requests where the user has completed more than 2 mock tests under the subscription</li>
              <li>Subscription expiry or unused subscription time at the end of the billing period</li>
              <li>Issues caused by the user&apos;s device, browser, or internet connectivity</li>
              <li>Change of mind after extensive use of the subscription</li>
              <li>Purchase of a subscription when a free tier is available and was not utilized first</li>
              <li>Account termination due to violation of our Terms &amp; Conditions</li>
            </ul>
          </section>

          {/* How to Request */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How to Request a Refund</h2>
            <p className="mb-3">To request a refund, please follow these steps:</p>
            <ol className="list-decimal pl-6 space-y-1.5 mb-3">
              <li>Send an email to <a href={`mailto:${EMAIL}`} className="text-emerald-600 hover:text-emerald-700 underline">{EMAIL}</a> with the subject line &quot;Refund Request — [Your Name/Email]&quot;</li>
              <li>Include the following information in your email:</li>
            </ol>
            <ul className="list-disc pl-8 space-y-1 mb-3">
              <li>Your registered email address</li>
              <li>Date of subscription purchase</li>
              <li>Razorpay Payment ID or transaction reference number</li>
              <li>Reason for the refund request</li>
              <li>Any screenshots or evidence supporting your claim (for technical issues)</li>
            </ul>
            <p>
              Alternatively, you may contact us via our WhatsApp channel for initial support, but the formal refund request must be submitted via email.
            </p>
          </section>

          {/* Processing Time */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Refund Processing Time</h2>
            <p className="mb-3">
              Once your refund request is received and approved, the following timelines apply:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li><strong>Review Period:</strong> We will review your refund request within 3 to 5 business days of receiving it.</li>
              <li><strong>Approval Communication:</strong> You will receive an email confirming or denying your refund request.</li>
              <li><strong>Refund Initiation:</strong> Approved refunds will be initiated within 2 business days of approval.</li>
              <li><strong>Refund Crediting:</strong> The refund will be credited back to your original payment method (UPI, bank account, card, or wallet) within 5 to 10 business days, depending on your bank or payment provider&apos;s processing time.</li>
            </ul>
            <p className="mt-3">
              Please note that the exact refund processing timeline may vary depending on your bank or payment provider and is beyond our control once the refund has been initiated by Razorpay.
            </p>
          </section>

          {/* Cancellation */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Subscription Cancellation</h2>
            <p className="mb-3">
              You may cancel your subscription at any time by:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 mb-3">
              <li>Contacting us via email at <a href={`mailto:${EMAIL}`} className="text-emerald-600 hover:text-emerald-700 underline">{EMAIL}</a></li>
              <li>Using the account settings within the platform (if available)</li>
            </ul>
            <p className="mb-3">
              Upon cancellation:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Your subscription will remain active until the end of the current billing period</li>
              <li>You will retain access to all premium features until the subscription expires</li>
              <li>No further charges will be applied after cancellation</li>
              <li>No prorated refund will be issued for the remaining unused days, except in cases covered under Section 2.1</li>
            </ul>
          </section>

          {/* Free Tier */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Free Tier</h2>
            <p>
              {SITE_NAME} offers a free tier with limited access to mock tests and basic features. The free tier is provided at no cost and does not require any payment. No refund or cancellation applies to the free tier, as it is not a paid service. We encourage users to try the free tier before subscribing to the premium plan to evaluate whether the platform meets their needs.
            </p>
          </section>

          {/* Chargebacks */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Chargebacks</h2>
            <p>
              If you initiate a chargeback or dispute through your bank or payment provider without first contacting us for a refund, we reserve the right to suspend or terminate your account. Chargebacks should be a last resort after all other resolution methods have been exhausted. Please contact us first at <a href={`mailto:${EMAIL}`} className="text-emerald-600 hover:text-emerald-700 underline">{EMAIL}</a> for any billing concerns.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Changes to This Policy</h2>
            <p>
              We may update this Refund &amp; Cancellation Policy from time to time. Any changes will be posted on this page with a revised &quot;Last updated&quot; date. We encourage you to review this policy periodically. In case of any conflict between this policy and our Terms &amp; Conditions, this policy shall prevail with respect to refund matters.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Contact Us</h2>
            <p className="mb-3">If you have any questions about this Refund &amp; Cancellation Policy or need assistance with a refund request, please contact us:</p>
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
