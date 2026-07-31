import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - TestWaleChacha',
  description: 'Get in touch with TestWaleChacha for queries, feedback, or support regarding mock tests for SSC, UPSC, IBPS, RRB and other government exams.',
  alternates: { canonical: 'https://test-wale-chacha.vercel.app/contact' },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <a
          href="https://test-wale-chacha.vercel.app"
          className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 mb-6"
        >
          ← Back to TestWaleChacha
        </a>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
        <p className="text-gray-500 mb-8">Last updated: July 31, 2026</p>

        <div className="space-y-8">
          {/* Get in Touch */}
          <section className="bg-gray-50 rounded-xl p-6 border">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Have a question, feedback, or need help with your mock tests? We&apos;d love to hear from you.
              Reach out to us through any of the channels below and we&apos;ll get back to you as soon as possible.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.638l4.694-1.228A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.4 0-4.637-.705-6.516-1.917l-.473-.298-3.312.866.89-3.217-.332-.5A9.953 9.953 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">WhatsApp</h3>
                  <p className="text-gray-500 text-sm mt-1">Fastest way to reach us</p>
                  <a
                    href="https://whatsapp.com/channel/0029VbDsNS4A2pL5AnlWwm1G"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                  >
                    Join our WhatsApp Channel →
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-500 text-sm mt-1">For detailed queries or support</p>
                  <a
                    href="mailto:testwalechacha@gmail.com"
                    className="inline-block mt-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                  >
                    testwalechacha@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Response Time */}
          <section className="bg-gray-50 rounded-xl p-6 border">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Response Time</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0"></span>
                WhatsApp Channel: Instant updates and announcements
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0"></span>
                Email: We typically respond within 24-48 hours
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0"></span>
                Support hours: Monday to Saturday, 10 AM - 8 PM IST
              </li>
            </ul>
          </section>

          {/* FAQ */}
          <section className="bg-gray-50 rounded-xl p-6 border">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">How do I report a wrong question or answer?</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Send us the test name and question number on our WhatsApp Channel or email us at testwalechacha@gmail.com. We&apos;ll review and correct it promptly.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">I faced payment issues. Who do I contact?</h3>
                <p className="text-gray-600 text-sm mt-1">
                  For payment-related queries, email us at testwalechacha@gmail.com with your registered email and payment details. We resolve payment issues within 24 hours.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Can I request a specific exam or topic?</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Yes! Suggest new exam categories or topics through our WhatsApp Channel. We regularly add new tests based on user requests.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">I want to partner or advertise with TestWaleChacha.</h3>
                <p className="text-gray-600 text-sm mt-1">
                  For business inquiries, partnerships, or advertising, email us at testwalechacha@gmail.com with the subject &ldquo;Business Inquiry&rdquo;.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
