---
Task ID: 1
Agent: Main Agent
Task: Improve SEO for Google search ranking - add server-rendered SEO content, fix sitemap, expand FAQ, improve hero H1

Work Log:
- Created `/src/components/SeoContent.tsx` — server-rendered, visually hidden (1px clip) but crawler-readable SEO block with comprehensive keyword-rich English text covering SSC, UPSC, IBPS, RRB, State PSC, CTET, CDS, NDA exams
- Added SeoContent to `layout.tsx` (server component) so Googlebot can read it without JS rendering
- Fixed sitemap: created static `public/sitemap.xml`, removed API route `/api/sitemap-xml/` and Next.js rewrite from `next.config.ts`
- Added sitemap-specific cache headers in `next.config.ts`
- Expanded FAQ from 6 to 12 questions with long-tail keyword targeting ("free SSC CGL mock test online", "IBPS PO free mock test", etc.)
- Updated FAQ JSON-LD schema to match expanded FAQ (12 Q&As)
- Changed hero H1 from Hindi-only to English keywords: "Free Online Mock Tests for SSC, UPSC, IBPS & RRB"
- Added English subtitle paragraph with more keywords
- Updated meta title to lead with keywords: "Free Mock Tests for SSC, UPSC, IBPS, RRB NTPC Online"
- Expanded meta description to include CTET, CDS, NDA
- Expanded keywords array from 22 to 35+ long-tail keywords
- Updated OG and Twitter card titles/descriptions

Stage Summary:
- Server-rendered SEO content verified in HTML output — Google can read 1000+ words of keyword-rich English text without JS
- Static sitemap.xml serves correctly (HTTP 200, 454 bytes)
- Page compiles successfully (GET / 200)
- 12 FAQ Q&As with long-tail keyword targeting
- Hero H1 now contains primary English keywords
