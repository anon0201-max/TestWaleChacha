import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false,
  allowedDevOrigins: [
    "space-z.ai",
    "*.space-z.ai",
  ],
  // Rewrite /sitemap.xml to API route (bypass Vercel static file headers)
  async rewrites() {
    return [
      { source: '/sitemap.xml', destination: '/api/sitemap-xml' },
    ];
  },
  async headers() {
    return [
      // Security & SEO headers for all routes
      {
        source: "/(.*)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, OPTIONS, POST, PUT, DELETE" },
          { key: "Access-Control-Allow-Headers", value: "*" },
          // Security headers
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      // Cache static assets aggressively
      {
        source: "/(logo|icon-192|icon-512|icon-maskable-192|icon-maskable-512|apple-touch-icon|og-image|logo)\.(png|svg|jpg)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // Cache manifest and SW
      {
        source: "/(manifest\.json|sw\.js)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
      // Cache Google verification
      {
        source: "/googleabb88179bbb562dd\.html",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // Cache ads.txt
      {
        source: "/ads\.txt",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
