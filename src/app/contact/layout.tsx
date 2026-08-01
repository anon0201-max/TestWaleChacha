import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - TestWaleChacha',
  description: 'Get in touch with TestWaleChacha for queries, feedback, or support regarding mock tests for SSC, UPSC, IBPS, RRB and other government exams.',
  alternates: { canonical: 'https://test-wale-chacha.vercel.app/contact' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}