export async function GET() {
  const SITE_URL = 'https://testwalechacha.online';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
  <loc>${SITE_URL}</loc>
  <lastmod>2026-07-30</lastmod>
  <changefreq>daily</changefreq>
  <priority>1.0</priority>
</url>
<url>
  <loc>${SITE_URL}/?view=tests</loc>
  <lastmod>2026-07-30</lastmod>
  <changefreq>daily</changefreq>
  <priority>0.9</priority>
</url>
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
