import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://test-wale-chacha.vercel.app",
      lastModified: new Date("2026-07-31"),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: "https://test-wale-chacha.vercel.app/?view=tests",
      lastModified: new Date("2026-07-31"),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];
}
