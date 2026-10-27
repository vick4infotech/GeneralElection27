# Organic search and AI-crawler launch checklist

## Already implemented
- Server-rendered Next.js main pages, candidate directory and party directory (metadata generated for individual names).
- Readable semantic HTML and H1/H2 hierarchy, explicit author/operator, attributed facts and direct links to INEC.
- Descriptive unique page titles and meta descriptions, canonical URLs and Open Graph social preview.
- `/robots.txt` permits normal search and AI crawling of published information while excluding application API endpoints.
- `/sitemap.xml` contains the main public pages, 18 candidate profiles and 22 party profiles. *State placeholder pages stay `noindex` until they have distinct verified information.*
- JSON-LD structured data (WebSite, Organization, WebPage, FAQPage, Person, BreadcrumbList), with text on the pages that matches the facts encoded in schema.
- `/voter-guide`, `/election-2027/timetable`, `/election-results`, `/parties`, `/candidates` and `/games` provide topic-specific crawlable entry points.
- Optional `/llms.txt` is a navigation summary, **not a substitute for traditional SEO**. Google does not require it for AI Search experiences.
- Fast-loading vector national flag assets, dismissible welcome branding, mobile-responsive and reduced-motion variants.

## Still required after deployment
1. Add the domain to Google Search Console and Bing Webmaster Tools. Verify domain ownership using DNS.
2. Open `https://generalelection2027.com/robots.txt`, `/sitemap.xml` and each main page. Confirm HTTP 200 responses and no login gate or `noindex` for public information.
3. Submit sitemap and inspect indexing. Fix any server errors, blocked routes and broken images. **No tool can guarantee every query will rank.**
4. Publish accurate original reporting with author names, timestamps, corrections, and citations. Keep election dates and nominations updated. Do not auto-generate duplicate low-value keyword pages.
5. Add individual state guides only as material with useful verified details becomes available; previously created placeholder state pages intentionally remain `noindex`.
6. Complete professional licensing for candidate photos and all 22 party symbols. Keep image alt text descriptive and image credits accessible.
7. Test Core Web Vitals on mobile: minimize third-party widgets, keep interactive game scripts restricted to `/games`, optimize media sizes and use a content delivery network.
8. Monitor abuse of the voluntary visitor poll. Explain clearly that website visitor preferences are not national voting forecasts.
9. Check privacy compliance for political preference responses and Meta login, including a withdrawal process and data retention.
10. Do not claim that LLMs will index every page. AI providers have independent discovery and ranking policies.

## Suggested organic content topics
Instead of stuffing keywords into metadata, answer these specific Nigerian search intents in full, source-backed articles: 2027 presidential election date; INEC election timetable; Nigerian political parties 2027; presidential candidates and running mates; eligibility for voter registration; PVC status; BVAS explained; polling unit lookup; Senate and House of Representatives voting; governorship and state House of Assembly elections; official election results and declared winners *after* voting; official versus website polls; game simulation rules. Include related-article links to other relevant sections.

Source: https://developers.google.com/search/docs/appearance/ai-features
