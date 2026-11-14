# SWK Properties — swkpropertiesuae.com

Corporate website of **SWK Properties LLC**, a RERA-licensed Dubai real estate brokerage (ORN 51517),
Office 54, 27th Floor, Al Saqr Business Tower, Sheikh Zayed Road, Dubai.

Next.js 16 (App Router, React 19, Tailwind CSS 4) served from a Cloudflare Worker through the
OpenNext adapter.

## Documentation

| Document | Contents |
| --- | --- |
| [docs/AUDIT-2026-11.md](docs/AUDIT-2026-11.md) | Full audit: every defect found, how it was fixed, and open owner actions |
| [docs/BRAND.md](docs/BRAND.md) | Matte Gold brand kit, asset map, logo usage rules |
| [docs/SEO-AEO-GEO.md](docs/SEO-AEO-GEO.md) | Search, answer-engine, AI/LLM and local SEO implementation plus the off-site (backlinks, citations, social) playbook |
| [docs/COMPLIANCE.md](docs/COMPLIANCE.md) | UAE legal and regulatory checklist (RERA, DLD Trakheesi, PDPL, AML) |

## Commands

```bash
npm ci                     # install exact dependency versions
npm run dev                # local dev server on http://localhost:3000
npm run typecheck          # TypeScript
npm run lint               # ESLint
npm run build              # production Next.js build
npm start                  # serve the production build
npm run audit:seo          # crawl the running build: broken links, titles, canonicals, h1 (exit 1 on failure)
npm run build:cloudflare   # build + package for Cloudflare Workers
npm run preview:cloudflare # run the Worker locally
npm run deploy             # deploy the Worker
```

Release gate: `npm run typecheck && npm run lint && npm run build`, then `npm start` and
`npm run audit:seo` must pass.

## Project structure

```
brand/SWK_Matte_Gold_Brand_Kit/   source brand kit (not deployed; see docs/BRAND.md)
public/brand/                     web logo/emblem files used by the site
public/favicon*, apple-touch-icon.png, og-default.jpg
src/app/                          routes (App Router); sitemap.ts, robots.ts, manifest.ts,
                                  llms.txt/, llms-full.txt/, api/enquiries/
src/components/site/              header, footer, forms, cards, map embed
src/components/seo/               JSON-LD and consent-mode analytics
src/components/sections, ui/      page sections and visual components
src/data/*.json                   content: communities, developers, team, FAQ, testimonials, blog
src/lib/                          typed data access, SEO helpers (seo.ts), llms.txt builder, areas (pSEO)
worker/index.js                   Cloudflare entry: legacy redirects, R2 video, then Next.js
scripts/seo-audit.mjs             crawler used by `npm run audit:seo`
```

Company facts (phone, address, ORN, licence, social profiles) live in one place:
`src/lib/swk.ts` → `SITE`. Everything else (footer, schema.org, llms.txt) reads from it.

## Environment variables

See [.env.example](.env.example). Summary:

| Variable | Purpose |
| --- | --- |
| `LEAD_WEBHOOK_URL`, `LEAD_WEBHOOK_SECRET` | Send each enquiry to a CRM / Zapier / Make webhook |
| `RESEND_API_KEY`, `LEAD_EMAIL_TO`, `LEAD_EMAIL_FROM` | Email each enquiry via Resend |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager (GA4, Ads, Meta, TikTok, LinkedIn tags) in Consent Mode v2 |
| `NEXT_PUBLIC_*_VERIFICATION` | Google, Bing, Yandex, Facebook domain verification meta tags |

Enquiries are also archived to the `MEDIA` R2 bucket under the private `leads/` prefix. If no channel
stores a lead, the API returns an error and the visitor is pointed to WhatsApp, so leads are never
silently dropped. Configure at least the webhook or email channel before launch.

## Cloudflare production deployment

The `swkpropertiesuae-site` Worker serves the app through `@opennextjs/cloudflare`.

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Root directory | `/` |
| Build command | `npm run build:cloudflare` |
| Deploy command | `npm run deploy` |

Cloudflare installs dependencies from `package-lock.json` (npm 10). `wrangler.jsonc` keeps both custom
domains and the `MEDIA` binding to the `swk-media` R2 bucket. `worker/index.js` preserves legacy
redirects from the retired static site and serves the large hero videos from R2 with byte ranges.
The `/api/enquiries` handler needs this Worker deployment; a static export cannot replace it.

Secrets: `npx wrangler secret put RESEND_API_KEY` (and `LEAD_WEBHOOK_SECRET`). Public `NEXT_PUBLIC_*`
values must be present at build time (Workers Builds → Variables).
