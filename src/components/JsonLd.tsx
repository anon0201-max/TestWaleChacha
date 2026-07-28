export default function JsonLd() {
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'TestWaleChacha',
    url: 'https://test-wale-chacha.vercel.app',
    description: 'Free online mock tests for SSC CGL, UPSC, IBPS PO, RRB NTPC and more government exams.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://test-wale-chacha.vercel.app/?view=tests&search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TestWaleChacha',
    url: 'https://test-wale-chacha.vercel.app',
    logo: 'https://test-wale-chacha.vercel.app/logo.png',
    description: 'India\'s #1 free mock test platform for government exam preparation.',
    sameAs: [],
  };

  const educationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'TestWaleChacha',
    url: 'https://test-wale-chacha.vercel.app',
    description: 'Free online mock tests for Indian government exams including SSC, UPSC, Banking, Railways and State PSC.',
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'Free Mock Tests',
        price: '0',
        priceCurrency: 'INR',
        description: '5 free mock test attempts for new users',
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'Pro Subscription - Unlimited Mock Tests',
        price: '100',
        priceCurrency: 'INR',
        description: 'Unlimited mock test access for all exam categories',
        availability: 'https://schema.org/InStock',
      },
    ],
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://test-wale-chacha.vercel.app',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Mock Tests',
        item: 'https://test-wale-chacha.vercel.app/?view=tests',
      },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is TestWaleChacha free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! TestWaleChacha offers 5 free mock test attempts for new users. After that, you can get unlimited access for just ₹100.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which exams does TestWaleChacha cover?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'TestWaleChacha covers SSC CGL/CHSL, UPSC CSE, IBPS PO/Clerk, RRB NTPC, State PSC, Defence and other government exams.',
        },
      },
      {
        '@type': 'Question',
        name: 'What features does TestWaleChacha provide?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Real exam interface with question palette, countdown timer, detailed solutions, performance tracking, and personal dashboard to analyze your progress.',
        },
      },
      {
        '@type': 'Question',
        name: 'How is TestWaleChacha different from other mock test platforms?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'TestWaleChacha provides a real exam-like interface used in actual government exams, with question palette navigation, section-wise timing, and instant result analysis — completely free.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(educationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
