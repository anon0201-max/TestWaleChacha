'use client';

const SITE_URL = 'https://test-wale-chacha.vercel.app';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'TestWaleChacha',
  alternateName: 'TestWale Chacha',
  url: SITE_URL,
  description:
    'Practice free online mock tests for SSC CGL, UPSC CSE, IBPS PO, RRB NTPC, State PSC and more government exams. Real exam interface with timer, question palette & detailed solutions.',
  publisher: {
    '@type': 'Organization',
    name: 'TestWaleChacha',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo.png`,
    },
  },
};

// Separate Organization schema — helps Google identify site name
const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TestWaleChacha',
  alternateName: 'TestWale Chacha',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/logo.png`,
  },
  sameAs: [
    'https://whatsapp.com/channel/0029VbDsNS4A2pL5AnlWwm1G',
  ],
};

const eduJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'TestWaleChacha',
  url: SITE_URL,
  description:
    'Free Government Exam Mock Test Platform for SSC, UPSC, Banking, Railways, State PSC, Teaching and Defence exams',
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
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Mock Tests',
      item: `${SITE_URL}/?view=tests`,
    },
  ],
};

// FAQ Schema — helps appear in Google "People Also Ask"
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is TestWaleChacha free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! TestWaleChacha offers free mock tests for government exams like SSC CGL, UPSC, IBPS PO, and RRB NTPC. New users get 5 free tests, and all paid plans start at just ₹100 for unlimited access to all test series.',
      },
    },
    {
      '@type': 'Question',
      name: 'What exams does TestWaleChacha cover?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'TestWaleChacha covers all major government exams including SSC CGL, SSC CHSL, UPSC CSE, IBPS PO, SBI PO, RRB NTPC, State PSC exams, Teaching exams (CTET, TET), Defence exams (CDS, NDA), and more. New tests are added regularly.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does TestWaleChacha provide a real exam interface?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! TestWaleChacha provides a real exam-like interface with features like question palette, countdown timer, mark for review, color-coded question status, and detailed solutions after submission — just like the actual SSC/UPSC exam.',
      },
    },
    {
      '@type': 'Question',
      name: 'How to prepare for SSC CGL with mock tests?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Start with topic-wise mock tests on TestWaleChacha to strengthen individual subjects like Reasoning, Quantitative Aptitude, English, and GK. Then take full-length mock tests to practice time management. Review detailed solutions to identify weak areas. Consistent practice with 2-3 tests daily helps build speed and accuracy for SSC CGL.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use TestWaleChacha on mobile?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! TestWaleChacha is fully responsive and works perfectly on mobile phones and tablets. You can also install it as a PWA (Progressive Web App) for quick access and a native app-like experience. Practice mock tests anytime, anywhere.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the price of TestWaleChacha subscription?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'TestWaleChacha PRO subscription costs just ₹100 and gives you unlimited access to all mock tests across all exam categories including SSC, UPSC, Banking, Railways, State PSC, Teaching, and Defence exams. It is one of the most affordable test platforms in India.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where can I find free SSC CGL mock test online?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'TestWaleChacha provides free SSC CGL mock tests online with real exam pattern — 100 questions, 60 minutes, covering Quantitative Aptitude, Reasoning, English, and General Awareness. Detailed solutions included after every test.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a free mock test for IBPS PO Prelims?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! TestWaleChacha offers free IBPS PO Prelims mock tests with Reasoning, Quantitative Aptitude, English Language, and General Awareness sections. Practice with timer and question palette just like the actual IBPS exam.',
      },
    },
    {
      '@type': 'Question',
      name: 'How to get free mock test for UPSC CSE Prelims online?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sign up free on TestWaleChacha and get 5 free mock tests including UPSC CSE Prelims GS Paper 1 and CSAT. Questions cover History, Geography, Polity, Economy, Science and Current Affairs with detailed explanations.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which is the best free mock test platform for government exams in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'TestWaleChacha is one of the best free mock test platforms in India with real exam-like interface, question palette, timer, detailed solutions, and performance analytics. Covers SSC, UPSC, Banking, Railways, and more. PRO plan at just ₹100.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I practice RRB NTPC mock test free online?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! TestWaleChacha offers free RRB NTPC mock tests with CBT-based interface. Practice Mathematics, General Intelligence, General Science, and General Awareness questions with timer and detailed solutions.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are there free CTET mock tests with answers and explanation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'TestWaleChacha provides free CTET Paper 1 and Paper 2 mock tests with detailed answers and explanations. Practice Child Development, Pedagogy, Language, Mathematics, Science, and Social Studies questions.',
      },
    },
  ],
};

// ItemList schema for exam categories
const categoryListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Government Exam Mock Test Categories',
  description: 'Browse free mock tests by exam category on TestWaleChacha',
  numberOfItems: 8,
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'SSC Mock Tests', url: `${SITE_URL}/?view=tests` },
    { '@type': 'ListItem', position: 2, name: 'Banking Mock Tests', url: `${SITE_URL}/?view=tests` },
    { '@type': 'ListItem', position: 3, name: 'Railways Mock Tests', url: `${SITE_URL}/?view=tests` },
    { '@type': 'ListItem', position: 4, name: 'UPSC Mock Tests', url: `${SITE_URL}/?view=tests` },
    { '@type': 'ListItem', position: 5, name: 'Teaching Mock Tests', url: `${SITE_URL}/?view=tests` },
    { '@type': 'ListItem', position: 6, name: 'State PSC Mock Tests', url: `${SITE_URL}/?view=tests` },
    { '@type': 'ListItem', position: 7, name: 'Defence Mock Tests', url: `${SITE_URL}/?view=tests` },
    { '@type': 'ListItem', position: 8, name: 'Other Exam Mock Tests', url: `${SITE_URL}/?view=tests` },
  ],
};

// Review/AggregateRating schema
const reviewJsonLd = {
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
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '100',
    bestRating: '5',
    worstRating: '1',
  },
};

export default function JsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eduJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewJsonLd) }}
      />
    </>
  );
}
