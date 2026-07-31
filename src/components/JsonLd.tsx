'use client';

const SITE_URL = 'https://test-wale-chacha.vercel.app';

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'TestWaleChacha',
  alternateName: 'Test Wale Chacha',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/logo.png`,
  },
  description:
    'Free online mock test platform for SSC, UPSC, IBPS, RRB, CTET and other government exams in India.',
  sameAs: [
    'https://whatsapp.com/channel/0029VbDsNS4A2pL5AnlWwm1G',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'testwalechacha@gmail.com',
    contactType: 'customer support',
    availableLanguage: ['English', 'Hindi'],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is TestWaleChacha free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! TestWaleChacha offers free mock tests for government exams like SSC CGL, UPSC, IBPS PO, and RRB NTPC. New users get 5 free tests, and PRO subscription for unlimited access starts at just ₹100.',
      },
    },
    {
      '@type': 'Question',
      name: 'What exams does TestWaleChacha cover?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'TestWaleChacha covers SSC CGL, SSC CHSL, UPSC CSE, IBPS PO, SBI PO, RRB NTPC, State PSC, Teaching (CTET, TET), Defence (CDS, NDA), and more. New tests are added regularly.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does TestWaleChacha provide a real exam interface?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! TestWaleChacha provides a real exam-like interface with question palette, countdown timer, mark for review, color-coded question status, and detailed solutions after submission.',
      },
    },
    {
      '@type': 'Question',
      name: 'How to prepare for SSC CGL with mock tests?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Start with topic-wise mock tests to strengthen individual subjects like Reasoning, Quantitative Aptitude, English, and GK. Then take full-length mock tests to practice time management. Review detailed solutions to identify weak areas.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use TestWaleChacha on mobile?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! TestWaleChacha is fully responsive and works on mobile phones and tablets. You can also install it as a PWA for quick access and a native app-like experience.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the price of TestWaleChacha subscription?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'TestWaleChacha PRO subscription costs ₹100 and gives unlimited access to all mock tests across all exam categories — SSC, UPSC, Banking, Railways, State PSC, Teaching, and Defence.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where can I find free SSC CGL mock test online?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'TestWaleChacha provides free SSC CGL mock tests online with real exam pattern covering Quantitative Aptitude, Reasoning, English, and General Awareness. Detailed solutions included.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a free mock test for IBPS PO Prelims?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! TestWaleChacha offers free IBPS PO Prelims mock tests with Reasoning, Quantitative Aptitude, English Language, and General Awareness sections with timer.',
      },
    },
    {
      '@type': 'Question',
      name: 'How to get free mock test for UPSC CSE Prelims online?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sign up free on TestWaleChacha and get 5 free mock tests including UPSC CSE Prelims GS Paper 1 and CSAT with History, Geography, Polity, Economy, Science and Current Affairs.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which is the best free mock test platform for government exams in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'TestWaleChacha provides free mock tests with real exam-like interface, question palette, timer, detailed solutions, and performance analytics covering SSC, UPSC, Banking, Railways, and more.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I practice RRB NTPC mock test free online?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! TestWaleChacha offers free RRB NTPC mock tests with CBT-based interface covering Mathematics, General Intelligence, General Science, and General Awareness.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are there free CTET mock tests with answers and explanation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'TestWaleChacha provides free CTET Paper 1 and Paper 2 mock tests with detailed answers and explanations for Child Development, Pedagogy, Language, Mathematics, Science, and Social Studies.',
      },
    },
  ],
};

const categoryListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Government Exam Mock Test Categories',
  description: 'Browse free mock tests by exam category on TestWaleChacha',
  numberOfItems: 8,
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'SSC Mock Tests', url: `${SITE_URL}/ssc-mock-tests` },
    { '@type': 'ListItem', position: 2, name: 'Banking Mock Tests', url: `${SITE_URL}/banking-mock-tests` },
    { '@type': 'ListItem', position: 3, name: 'Railway Mock Tests', url: `${SITE_URL}/railway-mock-tests` },
    { '@type': 'ListItem', position: 4, name: 'UPSC Mock Tests', url: `${SITE_URL}/upsc-mock-tests` },
    { '@type': 'ListItem', position: 5, name: 'Teaching Mock Tests', url: `${SITE_URL}/teaching-mock-tests` },
    { '@type': 'ListItem', position: 6, name: 'State PSC Mock Tests', url: `${SITE_URL}/state-psc-mock-tests` },
    { '@type': 'ListItem', position: 7, name: 'Defence Mock Tests', url: `${SITE_URL}/defence-mock-tests` },
    { '@type': 'ListItem', position: 8, name: 'General Studies Mock Tests', url: `${SITE_URL}/general-mock-tests` },
  ],
};

// SoftwareApplication without fake ratings
const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'TestWaleChacha',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '0',
    highPrice: '100',
    priceCurrency: 'INR',
    offerCount: '2',
  },
};

export default function JsonLd() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
    </>
  );
}
