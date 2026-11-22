# SWK Properties — swkpropertiesuae.com

Corporate website of **SWK Properties LLC**, a RERA-licensed Dubai real estate brokerage (**ORN 51517**), 25th Floor, Al Saqr Building, Sheikh Zayed Road, Dubai, UAE.

Built with **Next.js 16** (App Router, React 19, Tailwind CSS 4, TypeScript) and deployed on **Cloudflare Workers** via `@opennextjs/cloudflare` (custom domains `swkpropertiesuae.com` / `www.swkpropertiesuae.com`) and **Vercel**.

## Commands

```bash
npm ci                     # install exact dependency versions
npm run dev                # local dev server on http://localhost:3000
npm run typecheck          # TypeScript check (tsc --noEmit)
npm run lint               # ESLint
npm run build              # production Next.js build
npm start                  # serve production build locally
npm run audit:seo          # crawl running build for broken links, titles, canonicals, h1
npm run build:cloudflare   # build + package for Cloudflare Workers (@opennextjs/cloudflare)
npm run preview:cloudflare # run the Cloudflare Worker locally
npm run deploy             # deploy the Cloudflare Worker
```

## Project Structure

```text
public/brand/              unified transparent SWK Crest Icon & Calligraphic Wordmark
public/favicon*,           transparent favicons, Apple Touch Icon, PWA app icons, OG image
public/fonts/              self-hosted Switzer typography (woff2)
public/img/                high-resolution UAE real estate, developer, project & team photography
src/app/                   App Router pages, API route (/api/enquiries), dynamic SEO/AEO/GEO endpoints
                           (sitemap.ts, robots.ts, manifest.ts, llms.txt/, llms-full.txt/)
src/components/avenlo/     core layout sections, animated developers directory, page headers, motion
src/components/insights/   interactive Dubai market insights archive explorer
src/components/seo/        JSON-LD structured data (RealEstateAgent, FAQPage, Article, Speakable) & analytics
src/components/site/       header, footer, floating chrome, forms, property cards, popups, FAQ, map
src/components/ui/         WebGL Mesh Drift shader background, horizontal decks, interactive carousels & cards
src/data/                  typed Dubai inventory, master developers, communities, team, testimonials & blog shards
src/lib/                   data loaders, SEO/AEO/GEO helpers, llms.txt builder, calculators & pSEO utilities
worker/index.js            Cloudflare Worker entry: canonical www redirect, legacy redirects, R2 media & Next.js
scripts/seo-audit.mjs      automated link, canonical & metadata crawler
```

All brokerage facts (phone, Sheikh Zayed Road 25th Floor address, ORN `51517`, licence, social profiles) live in one source of truth: `src/lib/swk.ts` (`SITE`).

## Environment Variables

See `.env.example`:

| Variable | Purpose |
| --- | --- |
| `LEAD_WEBHOOK_URL`, `LEAD_WEBHOOK_SECRET` | Forward enquiries to CRM / Make / Zapier webhook |
| `RESEND_API_KEY`, `LEAD_EMAIL_TO`, `LEAD_EMAIL_FROM` | Send enquiry notifications via Resend |
| `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA_ID` | Google Tag Manager & GA4 (Consent Mode v2) |
| `NEXT_PUBLIC_*_VERIFICATION` | Google, Bing, Yandex, and Meta domain verification tags |

## Production Deployment

Merging into `main` triggers automatic production deployments:

- **Cloudflare Workers Builds (`swkpropertiesuae-site`)**: runs `npm run build:cloudflare` & `npm run deploy` serving `https://www.swkpropertiesuae.com` (with `wrangler.jsonc` & `worker/index.js`).
- **Vercel**: builds and deploys Next.js App Router directly from `main`.
