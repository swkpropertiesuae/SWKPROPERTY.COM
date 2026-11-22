# SWK Properties (`SWKPROPERTY.COM`) Avenlo-Inspired Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recreate the entire `SWKPROPERTY.COM` Dubai real estate website across all 28 existing routes plus a new `/agents` index page using Avenlo's (`https://avenlo.framer.website/`) light-first Swiss architectural aesthetic, the user's newly uploaded transparent SWK crest & favicon, and a dedicated Dubai Developer Launches pulse.

**Architecture:** Build on a new git branch (`feat/avenlo-redesign`) inside the existing Next.js 16 + Tailwind CSS 4 + Framer Motion + Cloudflare OpenNext repo. Replace the heavy dark/gold UI layer with self-hosted **Switzer** typography, crisp `#FFFFFF`/`#F7F7F7` canvases, vertical hairline grids, corner-bracketed CTAs, selective `#121212` obsidian bands, and `#51FEC0` mint-emerald live launch indicators & SVG charts, while keeping all `src/data/*`, `src/lib/*`, `public/img/*` (296 assets), `worker/index.js`, `/api/enquiries`, RERA ORN 51517 / Trakheesi compliance, and UAE PDPL gates intact.

**Tech Stack:** Next.js 16.4.5 (App Router), React 19.3.0, Tailwind CSS 4 (`@tailwindcss/turbopack`), Framer Motion 14.9.1, Lucide React, `@opennextjs/cloudflare`, TypeScript 5.

**Spec:** `docs/superpowers/specs/2026-11-22-avenlo-swk-redesign-design.md`

## Global Constraints

- Display `SWK Properties LLC` and `RERA ORN 51517` clearly on every page; never invent Trakheesi permit numbers, BRNs, Madmoun QR codes, or star ratings (`docs/COMPLIANCE.md`).
- Preserve `isPermitVerified` gating on `/properties/[slug]` (`noindex` + excluded from sitemap while unverified) and `Developer Render` notices on off-plan visuals.
- Keep UAE PDPL Consent Mode v2 (`Analytics` + `CONSENT_DEFAULT_SCRIPT`), cookie consent controls, unticked marketing opt-in checkboxes on every form (including the footer newsletter card), and zero PII in `dataLayer`.
- Quote prices primarily in `AED` with foreign conversions explicitly marked approximate; use UAE Central Bank LTV presets (`20%` Resident / `40%` Non-Resident) on `/calculators`.
- Pass the full release gate: `npm.cmd run typecheck && npm.cmd run lint && npm.cmd run build`, then `npm.cmd start` and `npm.cmd run audit:seo` (`0` broken links/assets, `0` duplicate titles, title `<= 60` chars, description `1..175` chars, exact canonical, exactly one `<h1>` per page).
- Windows shell note: invoke `npm.cmd` (not `npm`) under PowerShell due to execution policy restrictions.

## Review Focus

- **Checkerboard extraction artifacts on uploaded SWK crest:** Flood-filling the JPG checkerboard must leave zero grey/white fringe on both `#FFFFFF` header and `#121212` dark surfaces — verified visually in Task 1.
- **Newsletter endpoint vs. sales enquiry validation:** `POST /api/enquiries` with `{ context: "newsletter", email, marketingConsent: true }` must accept valid email-only subscriptions, reject missing consent (`400`), and still enforce `name` + `phone` for non-newsletter enquiries — verified via node test script in Task 3.
- **Shadowing static `public/sitemap.xml`:** Deleting `public/{sitemap.xml,robots.txt,llms.txt,llms-full.txt}` ensures `src/app/sitemap.ts` (without `/corporate-kit`, with `/agents`) is actually served by Next.js/OpenNext — verified via live crawl in Task 9.
- **Single `<h1>` & metadata bounds across all 29 routes + dynamic slugs:** Every page must render exactly one `<h1>` (no duplicate hidden `sr-only` `<h1>` alongside a visible `<h1>`) and stay within `<= 60` char title / `<= 175` char description — verified by `npm.cmd run audit:seo` in Task 9.
- **Zero horizontal overflow & clean contrast on mobile (`390×844`) and desktop (`1280×800`):** Full-bleed residence panels, monumental `SWK` footer wordmark, floating bottom nav pill, and SVG charts must never clip or cause horizontal scroll — verified visually via live browser audit in Task 9.

---

### Task 1: Branch Setup, Dependencies, Uploaded Crest/Favicon Extraction & Local Switzer Fonts

**Files:**
- Create: `public/brand/swk-crest-2026.png`, `public/brand/swk-crest-2026.webp`, `public/fonts/Switzer-*.woff2`
- Modify: `public/favicon.ico`, `public/favicon-{16,32,48,96,192,512}.png`, `public/apple-touch-icon.png`

**Interfaces:**
- Produces: Transparent crest at `/brand/swk-crest-2026.png` & `/brand/swk-crest-2026.webp`, updated `/favicon.ico` & PNG favicons, and local Switzer `.woff2` files in `public/fonts/` (`Light`, `LightItalic`, `Regular`, `Italic`, `Medium`, `MediumItalic`, `Semibold`, `Bold`).

- [ ] **Step 1:** Create git branch `feat/avenlo-redesign` from `main` and run `npm.cmd ci` to install exact dependencies.
- [ ] **Step 2:** Extract the user's uploaded SWK crest (`media_1795352427370_a501e575.jpg`) onto true RGBA transparency via a Python Pillow script (border flood-fill across the outer checkerboard cells + clean alpha feathering preserving the gold border and dark core), save `public/brand/swk-crest-2026.png` (`512×512`) and `public/brand/swk-crest-2026.webp`, and verify visually by rendering a composite proof on white + obsidian backgrounds and inspecting it with `read_file`.
- [ ] **Step 3:** Copy uploaded `media_1795352427174_569a47e7.ico` to `public/favicon.ico` and generate matching `public/favicon-{16,32,48,96,192,512}.png` and `public/apple-touch-icon.png` from the transparent crest.
- [ ] **Step 4:** Download Switzer `.woff2` weights (`300`, `300 italic`, `400`, `400 italic`, `500`, `500 italic`, `600`, `700`) from Fontshare's CSS manifest into `public/fonts/` and verify all 8 files are non-empty valid WOFF2 binaries.
- [ ] **Step 5:** Commit design spec, plan, brand assets, favicons, and local Switzer fonts on `feat/avenlo-redesign`.

---

### Task 2: Avenlo Design System (`globals.css`, `layout.tsx`, `template.tsx`) & Shared Primitives (`src/components/avenlo/*`)

**Files:**
- Modify: `src/app/globals.css`, `src/app/layout.tsx`, `src/app/template.tsx`
- Create: `src/components/avenlo/bracket-button.tsx`, `src/components/avenlo/page-header.tsx`, `src/components/avenlo/motion.tsx`, `src/components/avenlo/preloader.tsx`

**Interfaces:**
- Produces:
  - `BracketButton` / `BracketLink`: `{ href?, onClick?, children, variant?: "light" | "dark" | "ghost", size?: "sm" | "md" | "lg", fullWidth?: boolean, className?, type?, disabled? }`
  - `AvenloPageHeader`: `{ eyebrow: string, title: ReactNode, italicSuffix?: string, lead?: string, align?: "center" | "left", breadcrumb?: { label: string, href?: string }[], meta?: ReactNode, actions?: ReactNode, compact?: boolean }` — renders the single `<h1>` per inner page over the architectural vertical hairline grid.
  - `SectionEyebrow`: `{ children: ReactNode, tone?: "light" | "dark", className? }`
  - `SplitHeading`: `{ primary: ReactNode, muted?: ReactNode, as?: "h2" | "h3", tone?: "light" | "dark", align?: "left" | "center", size?: "md" | "lg", className? }`
  - `ScrollRevealStatement`: `{ text: string, className? }` (scroll-linked `#8B8B8B` → `#121212` word reveal)
  - `BlurReveal`: `{ children: ReactNode, delay?: number, className? }`
  - `LiveStatusDot`: `{ label: string, tone?: "launch" | "sale" | "offer" | "sold", surface?: "light" | "dark" }`
  - `CtaBanner`: `{ eyebrow?: string, primary?: string, italic?: string, primaryHref?: string, primaryLabel?: string, secondaryHref?: string, secondaryLabel?: string }`
  - `AvenloPreloader`: session-scoped `<900ms` `#121212` preloader.

- [ ] **Step 1:** Rewrite `src/app/globals.css` with Avenlo Swiss monochrome tokens (`#FFFFFF`, `#F7F7F7`, `#F5F5F5`, `#121212`, `#1E1E1E`, `#8B8B8B`, `#51FEC0`, `#10B981`), `.bg-arch-grid` vertical hairline grid pattern, range-slider thumb styling, and reduced-motion-safe transitions.
- [ ] **Step 2:** Update `src/app/layout.tsx` to load local `Switzer` via `next/font/local` (`--font-switzer`) + `Inter` (`--font-inter`) + `Geist_Mono` (`--font-geist-mono`), set `bg-white text-[#121212]`, `themeColor: "#ffffff"`, and mount `AvenloPreloader` cleanly without blocking SSR HTML.
- [ ] **Step 3:** Create `src/components/avenlo/bracket-button.tsx`, `motion.tsx`, `page-header.tsx`, and `preloader.tsx`.
- [ ] **Step 4:** Verify TypeScript compilation (`npx tsc --noEmit` on new files / full project once compatible).

---

### Task 3: Global Chrome, Shared Site Components, `/api/enquiries` Newsletter Branch & SEO Hygiene

**Files:**
- Modify: `src/app/api/enquiries/route.ts`, `src/lib/prefs.tsx`, `src/app/sitemap.ts`, `src/lib/llms.ts`
- Delete: `public/sitemap.xml`, `public/robots.txt`, `public/llms.txt`, `public/llms-full.txt`
- Modify: `src/components/site/site-header.tsx`, `src/components/site/site-footer.tsx`, `src/components/site/floating-chrome.tsx`, `src/components/site/enquiry-form.tsx`, `src/components/site/faq.tsx`, `src/components/site/property-card.tsx`, `src/components/site/property-detail-client.tsx`

**Interfaces:**
- Consumes: `BracketButton`, `BracketLink`, `SectionEyebrow`, `SplitHeading`, `LiveStatusDot` from Task 2; `SITE`, `LISTINGS`, `projects`, `usePrefs`.
- Produces: Updated global chrome, clean monochrome `PropertyCard`, `EnquiryForm`, `Faq`, `PropertyDetailClient`, newsletter-capable `POST /api/enquiries`, and live sitemap/llms without `/corporate-kit` and with `/agents`.

- [ ] **Step 1:** Extend `src/app/api/enquiries/route.ts` with a dedicated additive `context === "newsletter"` handler requiring valid `email` + `marketingConsent === true`, logging `type: "newsletter"` via `deliver()`, while keeping existing sales enquiry validation untouched.
- [ ] **Step 2:** Clean `src/lib/prefs.tsx` to keep currency, area unit, shortlist, compare, cookie consent, and attribution (retiring the broken `dir="rtl"` mutation).
- [ ] **Step 3:** Fix `src/app/sitemap.ts` and `src/lib/llms.ts` (remove `/corporate-kit`, add `/agents`) and delete shadowing static files in `public/{sitemap.xml,robots.txt,llms.txt,llms-full.txt}`.
- [ ] **Step 4:** Rebuild `site-header.tsx` (light `84px` Avenlo bar with uploaded transparent SWK crest, `+ PROPERTIES`, `+ OFF-PLAN`, `+ DEVELOPERS`, `+ SERVICES`, `+ PAGES` 3-col mega popover with currency/unit/shortlist controls, `[BOOK A CALL]`), `floating-chrome.tsx` (centered frosted dark `SWK Properties ≡` bottom pill + upward quick menu, PDPL consent card, monochrome Shortlist/Compare drawer, subtle WhatsApp + Concierge, zero hype promo popups), and `site-footer.tsx` (`#121212`, `#1E1E1E` newsletter card with PDPL checkbox, 3 link cols, RERA/AED/trademark legal strip, monumental clipped `SWK` wordmark + 3 bottom floating pills).
- [ ] **Step 5:** Restyle `enquiry-form.tsx`, `faq.tsx`, `property-card.tsx`, and `property-detail-client.tsx` to pure Avenlo aesthetic (crisp `rounded-2xl` white cards, Avenlo tabbed floor plans & 16-item amenities grid, `BracketButton` actions, RERA/Trakheesi compliance preserved).
- [ ] **Step 6:** Run `npm.cmd run typecheck` and commit Task 2 + Task 3 cleanly.

---

### Task 4: Flagship Homepage (`src/app/page.tsx` + `src/components/sections/home-sections.tsx`)

**Files:**
- Modify: `src/components/sections/home-sections.tsx`, `src/app/page.tsx`

**Interfaces:**
- Consumes: Task 2 Avenlo primitives, `SITE`, `stats`, `communities`, `team`, `testimonials`, `horizontalTestimonials`, `developers`, `projects`, `priorityProjects`, `LISTINGS`, `blogArticles`, `faqs`.
- Produces: Complete 10-band Avenlo + Dubai Developer Pulse homepage with exactly one `<h1>` (the visible hero display title).

- [ ] **Step 1:** Build modular homepage bands in `src/components/sections/home-sections.tsx`:
  - `AvenloHero` (hairline grid, `▪ RERA ORN 51517 · DUBAI & UAE REAL ESTATE`, mixed Roman/*Italic* `<h1>`, `[WORK WITH US]`, arched advisor portrait + `18+ Years`, play/brief modal button + editorial note, full-width Dubai skyline over `Since 2008` watermark).
  - `EditorialBento` (`ScrollRevealStatement` + 3 capability pills + 2-card bento: interactive client quote card left, vibrant Dubai launch photo with frosted glass investor/advisor overlay right).
  - `DubaiDeveloperPulse` (official developer brandmark strip + interactive category filter pills + 6 live 2026 developer launch cards with mint dots and payment plans).
  - `FullBleedResidences` (6 full-bleed `760px–800px` flagship Dubai architectural panels with live status dots, light `50px` titles, pipe specs, render notes, and dark bracketed `[VIEW RESIDENCE]` CTAs).
  - `ServicesAndTrackRecord` (`#121212` obsidian band: `01–04` interactive service rows + 3 tall photo service cards + credential laurels & `2×2` white Track Record cards).
  - `CommunitiesAndTicker` (white uppercase marquee ticker + 8 Dubai communities architectural strip).
  - `AcquisitionStagesWave` (`#F7F7F7` 4-column staggered wave `01`–`04`).
  - `ClientVoicesAndFaq` (horizontal testimonial card strip + hairline divider + 2-column Avenlo FAQ accordion).
  - `InsightsPreview` (3-column editorial journal preview + guides links).
- [ ] **Step 2:** Wire `src/app/page.tsx` cleanly to compose all 10 bands + `CtaBanner`, ensuring zero duplicate `<h1>` tags.
- [ ] **Step 3:** Run `npm.cmd run typecheck` and commit.

---

### Task 5: Property Discovery, Ready/Rent, Off-Plan & Vendor Routes (8 Routes)

**Files:**
- Modify: `src/app/properties/page.tsx`, `src/app/properties/layout.tsx`, `src/app/properties/[slug]/page.tsx`, `src/app/buy/page.tsx`, `src/app/rent/page.tsx`, `src/app/off-plan/page.tsx`, `src/app/off-plan/layout.tsx`, `src/app/off-plan/[slug]/page.tsx`, `src/app/off-plan/in/[area]/page.tsx`, `src/app/list-your-property/page.tsx`

**Interfaces:**
- Consumes: `AvenloPageHeader`, `BracketLink`, `LiveStatusDot`, `CtaBanner`, `PropertyCard`, `PropertyDetailClient`, `EnquiryForm`, `LISTINGS`, `projects`, `developers`, `offPlanAreas`, `usePrefs`.

- [ ] **Step 1:** Rebuild `/properties` with Avenlo centered header, pill filter bar (`All`, `Buy Ready`, `Rent`, `Off-Plan`, `Apartments`, `Villas`, `Townhouses`, `Penthouses`), clean search/community/beds/price bar, URL query-param sync, `Save Search` (`swk_saved_searches`) & `Share URL`, `Grid / Map` toggle, and collapsible `More Filters` slide-over drawer preserving all 18 filters.
- [ ] **Step 2:** Rebuild `/buy`, `/rent`, `/properties/[slug]` (preserving `noindex` for unverified permits), and `/list-your-property` (with staggered 4-stage Form A mandate wave + vendor form).
- [ ] **Step 3:** Rebuild `/off-plan` (Dubai & UAE 108+ launches hub with emirate/developer/community pills & featured launches), `/off-plan/[slug]` (Avenlo centered header, dual bracket CTAs, large architectural visual with render disclosure, specs & related releases, enquiry form), and `/off-plan/in/[area]` (pSEO area hubs).
- [ ] **Step 4:** Verify `npm.cmd run typecheck` and commit.

---

### Task 6: Developers, Communities & Services Routes (6 Routes)

**Files:**
- Modify: `src/app/developers/page.tsx`, `src/app/developers/[slug]/page.tsx`, `src/app/communities/page.tsx`, `src/app/communities/[slug]/page.tsx`, `src/app/services/page.tsx`, `src/app/services/[slug]/page.tsx`

**Interfaces:**
- Consumes: `AvenloPageHeader`, `BracketLink`, `SplitHeading`, `SectionEyebrow`, `CtaBanner`, `Faq`, `EnquiryForm`, `developers`, `communityGuides`, `servicePages`.

- [ ] **Step 1:** Rebuild `/developers` (Emirate filter pills + clean white brandmark cards) and `/developers/[slug]` (split header, facts table, project catalog grid, developer allocation form).
- [ ] **Step 2:** Rebuild `/communities` and `/communities/[slug]` (editorial neighborhood guide, 4-metric bar, pros/considerations, active off-plan & ready listings in area, enquiry form).
- [ ] **Step 3:** Rebuild `/services` (split Avenlo header, numbered `01–08` interactive rows, visual cards) and `/services/[slug]` (centered header, Avenlo 4-row metadata table, scope deliverables, process steps, FAQ, numbered `01–08` cross-links, enquiry form).
- [ ] **Step 4:** Verify `npm.cmd run typecheck` and commit.

---

### Task 7: About, Agents (`/agents` NEW + `[slug]`), Insights, Guides & Interactive Calculators (8 Routes)

**Files:**
- Create: `src/app/agents/page.tsx`, `src/components/avenlo/calculator-charts.tsx`
- Modify: `src/app/about/page.tsx`, `src/app/agents/[slug]/page.tsx`, `src/app/insights/page.tsx`, `src/app/insights/[slug]/page.tsx`, `src/app/guides/page.tsx`, `src/app/guides/[slug]/page.tsx`, `src/app/calculators/page.tsx`, `src/app/calculators/layout.tsx`

**Interfaces:**
- Consumes: `AvenloPageHeader`, `BracketLink`, `SplitHeading`, `CtaBanner`, `EnquiryForm`, `team`, `blogArticles`, `GUIDES`, `LISTINGS`, `usePrefs`.
- Produces: Reusable SVG chart components in `calculator-charts.tsx` (`DonutChart`, `PayoffAreaChart`, `MilestoneBarChart`, `ComparisonBarChart` in `#FFFFFF`, `#51FEC0`, `#8B8B8B` for `#121212` obsidian panels) and new `/agents` index route.

- [ ] **Step 1:** Create `/agents` (`▪ THE TEAM` / `The advisors you will actually deal with`, 3-col portrait grid for all 8 advisors in `team.json` with `<= 60` char SEO title) and rebuild `/agents/[slug]` (Avenlo 2-col profile, specialties, top developers, optional BRN only when filled, assigned listings, enquiry form) and `/about` (editorial arched photo strip, scroll-reveal statement, RERA ORN 51517 governance, team link, Sheikh Zayed Road office card).
- [ ] **Step 2:** Rebuild `/insights`, `/insights/[slug]` (single-column long-form editorial reading layout), `/guides`, and `/guides/[slug]` (executive direct-answer callout, crisp `#F7F7F7` comparison tables, FAQ).
- [ ] **Step 3:** Create `src/components/avenlo/calculator-charts.tsx` and rebuild `src/app/calculators/page.tsx` with all **5 Dubai financial modes** (`UAE Mortgage` with `20%` Resident / `40%` Non-Resident LTV presets + donut + `#51FEC0` payoff area chart & collapsible year-by-year amortization table, `DLD 4% Upfront Costs`, `Off-Plan Schedule`, `Net Rental Yield`, `5-Year Buy vs Rent`), each rendered in Avenlo's 2-column white-sliders + `#121212` obsidian summary layout with approximate-estimate disclaimer.
- [ ] **Step 4:** Verify `npm.cmd run typecheck` and commit.

---

### Task 8: Contact, FAQ, Legal, Thank-You, 404 & Unused Legacy Component Cleanup (7 Routes + `not-found.tsx`)

**Files:**
- Modify: `src/app/contact/page.tsx`, `src/app/faq/page.tsx`, `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`, `src/app/cookies/page.tsx`, `src/app/thank-you/page.tsx`, `src/app/not-found.tsx`
- Delete (if confirmed zero imports): `src/components/ui/dish-orbit-carousel.tsx`, `src/components/ui/viewfinder-flip-carousel.tsx`, `src/components/ui/glassmorphism-trust-hero.tsx`, `src/components/ui/lively-page-hero.tsx`, `src/components/ui/nearby-walk-menu.tsx`, `src/components/ui/interactive-selector.tsx`, `src/components/ui/timeline.tsx`, `src/components/ui/infinite-moving-cards.tsx`, `src/components/ui/not-found.tsx`

- [ ] **Step 1:** Rebuild `/contact` (Avenlo 2-col split: left `#F5F5F5` `THE OFFICE` card + embedded map, right crisp `EnquiryForm`), `/faq` (category pills + accordion), `/privacy`, `/terms`, `/cookies` (remove retired `swk_lang`, keep accurate storage & PDPL toggles), `/thank-you`, and `not-found.tsx` (`▪ ERROR 404` / `This address does not exist` + dual bracketed CTAs).
- [ ] **Step 2:** Verify zero remaining imports of retired legacy components via search, then delete those obsolete files.
- [ ] **Step 3:** Run `npm.cmd run typecheck` and `npm.cmd run lint`, fix every warning/error, and commit.

---

### Task 9: Full Release Gate, Newsletter API Check, Static Reference Sync & Live Visual Browser QA

**Files:**
- Modify (synced from live build): `sitemap.xml`, `robots.txt`, `llms.txt`, `llms-full.txt` (repo root reference copies only; `public/` stays clean so dynamic routes serve live output)

- [ ] **Step 1:** Run full release gate: `npm.cmd run typecheck && npm.cmd run lint && npm.cmd run build`.
- [ ] **Step 2:** Start local production server (`npm.cmd start` on port `3000`) and run `npm.cmd run audit:seo` — confirm `SEO audit passed` with `0` broken links, `0` duplicate titles, and `0` metadata/H1 issues across every route.
- [ ] **Step 3:** Test `POST /api/enquiries` against live server for (a) newsletter missing consent → `400`, (b) newsletter valid email + consent (verifying validation passes past field checks), and (c) standard enquiry missing phone → `400`.
- [ ] **Step 4:** Sync root `sitemap.xml`, `robots.txt`, `llms.txt`, `llms-full.txt` from the verified running build so repo-root reference files match the dynamic routes cleanly.
- [ ] **Step 5:** Invoke `browser` subagent (`Model: "flash"`) against `http://localhost:3000` to capture desktop (`1280×800`) and mobile (`390×844`) screenshots of `/`, `/properties`, `/off-plan`, `/developers`, `/calculators`, `/agents`, and `/contact`, plus inspect console errors and horizontal overflow (`scrollWidth <= innerWidth`). Visually inspect screenshots with `read_file`, fix any polish issues found, re-run release gate, stop the dev/prod server cleanly, and make final commit on `feat/avenlo-redesign`.
