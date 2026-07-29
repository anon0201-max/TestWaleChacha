const SITE_URL = "https://test-wale-chacha.vercel.app";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "TestWaleChacha",
  url: SITE_URL,
  description:
    "Practice free online mock tests for SSC CGL, UPSC CSE, IBPS PO, RRB NTPC, State PSC and more government exams. Real exam interface with timer, question palette & detailed solutions.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Organization",
    name: "TestWaleChacha",
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
    },
  },
};

const eduJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "TestWaleChacha",
  url: SITE_URL,
  description:
    "Free Government Exam Mock Test Platform for SSC, UPSC, Banking, Railways, State PSC exams",
  sameAs: [],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "Mock Tests",
      item: `${SITE_URL}/tests`,
    },
  ],
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eduJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}
