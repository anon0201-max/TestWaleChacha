import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.testwalechacha.online",
      lastModified: new Date("2026-07-31"),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: "https://www.testwalechacha.online/privacy-policy",
      lastModified: new Date("2026-07-31"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: "https://www.testwalechacha.online/terms",
      lastModified: new Date("2026-07-31"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: "https://www.testwalechacha.online/refund-policy",
      lastModified: new Date("2026-07-31"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: "https://www.testwalechacha.online/about",
      lastModified: new Date("2026-08-17"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: "https://www.testwalechacha.online/faq",
      lastModified: new Date("2026-08-17"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://www.testwalechacha.online/how-it-works",
      lastModified: new Date("2026-08-17"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://www.testwalechacha.online/contact",
      lastModified: new Date("2026-07-31"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: "https://www.testwalechacha.online/ssc-mock-tests",
      lastModified: new Date("2026-07-31"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://www.testwalechacha.online/banking-mock-tests",
      lastModified: new Date("2026-07-31"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://www.testwalechacha.online/railway-mock-tests",
      lastModified: new Date("2026-07-31"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://www.testwalechacha.online/upsc-mock-tests",
      lastModified: new Date("2026-07-31"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://www.testwalechacha.online/teaching-mock-tests",
      lastModified: new Date("2026-07-31"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://www.testwalechacha.online/state-psc-mock-tests",
      lastModified: new Date("2026-07-31"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://www.testwalechacha.online/defence-mock-tests",
      lastModified: new Date("2026-07-31"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://www.testwalechacha.online/general-mock-tests",
      lastModified: new Date("2026-07-31"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
