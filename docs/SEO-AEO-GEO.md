# Search, Answer-Engine & AI Visibility

What is built into the site, how to verify it, and the off-site work that code cannot do.

## 1. Technical SEO (implemented)

| Area | Implementation | Where |
| --- | --- | --- |
| Titles & descriptions | `buildMeta()` fits every title to ≤ 60 chars and description to ≤ 160 chars, adds the brand only when it fits | `src/lib/seo.ts` |
| Canonicals | Absolute canonical on every page; client pages get metadata from segment layouts | `buildMeta`, `src/app/*/layout.tsx` |
| Robots meta | Indexable pages: `max-image-preview:large`. Unverified listings: `noindex, follow` | `buildMeta`, `properties/[slug]` |
| Headings | Exactly one `<h1>` per page (checked by `npm run audit:seo`) | — |
| Sitemap | All static pages, guides, insights, services, communities, developers, off-plan projects and area hubs, with image entries. Unverified listings excluded | `src/app/sitemap.ts` |
| robots.txt | Explicit allow for search and AI crawlers; `/api/` and `/thank-you` blocked | `src/app/robots.ts` |
| Crawlable inventory | `/properties` renders hero + full listing index server-side before the client filter loads | `src/app/properties/page.tsx` |
| Internal linking | Footer hubs, `/guides` hub, area chips on `/off-plan`, related areas on each hub; zero broken internal links | — |
| Performance | Static prerender of 240+ routes, long cache headers for `/brand` and `/img`, lazy maps, preloaded hero | `next.config.ts` |
| Security headers | HSTS, nosniff, frame-ancestors, referrer policy, permissions policy | `next.config.ts` |
| PWA | Web manifest with brand icons and shortcuts | `src/app/manifest.ts` |

## 2. Structured data (schema.org JSON-LD)

| Page type | Types |
| --- | --- |
| All pages | `RealEstateAgent` + `LocalBusiness` (ORN identifier, address, geo, hours, `hasMap`, `sameAs`, `knowsAbout`), `WebSite` with `SearchAction` |
| Listings | `RealEstateListing` + `Offer`, `BreadcrumbList` |
| Off-plan hub, area hubs, guides hub | `ItemList`, `BreadcrumbList`, `FAQPage` (area hubs) |
| Guides & insights | `Article` with `speakable`, `FAQPage` |
| Services | `Service` |
| Communities | `Place` |
| Agents | `Person` (`worksFor` the organization, languages, areas served, BRN when set) |
| Calculators | `WebPage` → `WebApplication` |

Validate with Google's Rich Results Test and the Schema.org validator after each deploy.

## 3. AEO / GEO / AIO — answer engines and LLMs

- `/llms.txt` (index) and `/llms-full.txt` (full corpus: FAQs, guides, services, communities,
  insights, project list, advisors) follow the llmstxt.org convention and are generated from the
  same data as the pages, so they never drift.
- robots.txt explicitly allows GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot,
  PerplexityBot, Google-Extended, Applebot-Extended, Meta-ExternalAgent, Amazonbot, Bingbot and others.
- Content pattern for citation: each guide and insight opens with a one-paragraph **direct answer**,
  then key takeaways, then FAQs. Keep this structure for new content.
- Entity consistency: the name, address and phone (NAP) come only from `SITE` in `src/lib/swk.ts`.
  Use exactly the same NAP on every external profile.

## 4. Local SEO & maps

- Key-less Google Maps embeds (`src/components/site/map-embed.tsx`) on Contact, each community guide,
  each off-plan project, each area hub and each listing, all with a "Get directions" link.
- `hasMap`, `geo` and opening hours in the Organization schema.

## 5. Programmatic SEO (pSEO)

| Template | Count | Source |
| --- | --- | --- |
| `/off-plan/[slug]` | 131 projects | `src/lib/developers.ts` |
| `/off-plan/in/[area]` | areas with ≥ 3 tracked projects (currently 10) | `src/lib/areas.ts` |
| `/developers/[slug]` | 27 | `src/data/developers.json` |
| `/communities/[slug]` | 8 | `src/data/communities.json` |
| `/services/[slug]`, `/guides/[slug]`, `/insights/[slug]`, `/agents/[slug]` | 8 / 4 / 10 / 8 | `src/lib/*` |

Rule: a template page is only generated when it has enough unique data (see `MIN_PROJECTS` in
`areas.ts`). Do not add thin combinations (e.g. community × bedroom count) until the listing inventory
supports them.

## 6. Social, messenger and link previews

Open Graph and Twitter cards on every page (default `og-default.jpg`, 1200×630); WhatsApp, Telegram,
LinkedIn, Facebook, X and Slack all read these. Verify with the Facebook Sharing Debugger, LinkedIn
Post Inspector and X Card Validator. Add profile URLs to `SITE.socials` as they go live; they appear in
the footer and in `sameAs` automatically.

## 7. Analytics & conversion tracking

`NEXT_PUBLIC_GTM_ID` loads Google Tag Manager in Consent Mode v2 (all ad/analytics storage denied until
the visitor accepts). Configure inside GTM: GA4, Google Ads conversions, Meta Pixel + Conversions API,
TikTok Pixel, LinkedIn Insight, Snap Pixel, Microsoft Clarity/UET. The site pushes these events to
`dataLayer`: `form_start`, `enquiry_success`, `lead_qualified`, `whatsapp_click`, `phone_click`, `viewing_booked`, `property_view` and others
(`AnalyticsEventName` in `src/lib/prefs.tsx`). PII is stripped before every push.

## 8. Off-site playbook (owner actions — cannot be done in code)

Backlinks and citations must be earned on third-party sites. Priority order:

1. **Google Business Profile** — category "Real estate agency", exact NAP, hours, photos of the office,
   ORN in description; collect reviews after each deal. Add the profile URL to `SITE.socials.googleBusinessProfile`.
2. **Bing Places**, **Apple Business Connect**, **Waze**, **Foursquare** — same NAP.
3. **Search consoles** — Google Search Console, Bing Webmaster Tools, Yandex Webmaster: verify via the
   `NEXT_PUBLIC_*_VERIFICATION` variables, submit `https://www.swkpropertiesuae.com/sitemap.xml`.
   Enable IndexNow in Bing Webmaster Tools.
4. **Portals** (strong, relevant links): Property Finder, Bayut, Dubizzle — agency profile linking to the site.
5. **Regulator and business directories**: DLD/RERA broker directory (Dubai REST app), Dubai Chamber,
   Dubai Economy business directory, Yellow Pages UAE, Connect.ae, Yelp UAE.
6. **Developer partner pages**: ask each partner developer (Emaar, DAMAC, Sobha, Azizi …) to list SWK on
   their broker/partner pages.
7. **Digital PR**: quarterly market commentary (use `/insights` data) pitched to Gulf News, Khaleej Times,
   Arabian Business, Zawya, The National; guest posts on expat and investor blogs.
8. **Social profiles**: LinkedIn company page, Instagram, Facebook, YouTube (project walkthroughs), TikTok;
   WhatsApp Business with catalogue and the site link.
9. **Reviews**: Google reviews from verified clients only. Do not add `aggregateRating` schema from
   on-site testimonials (self-serving reviews are not eligible and risk a manual action).

## 9. Monitoring

- `npm run audit:seo` before every release (CI-friendly, exits 1 on failure).
- Search Console coverage, Core Web Vitals and Rich Results reports weekly.
- Track AI visibility by asking ChatGPT, Perplexity, Gemini and Copilot "best real estate brokerage in
  Dubai for off-plan" style prompts monthly and noting citations.
