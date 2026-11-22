# SWK Properties (`SWKPROPERTY.COM`) — Avenlo-Inspired Dubai Architectural Redesign

**Date:** 2026-11-22
**Repository:** `https://github.com/swkpropertiesuae/SWKPROPERTY.COM` (local clone: `C:\Users\shamh\.gemini\antigravity\scratch\SWKPROPERTY.COM`)
**Reference Inspiration:** `https://avenlo.framer.website/`
**Selected Approach:** Approach A — Pure Avenlo Light-First Swiss Monochrome + Dubai Developer Pulse

---

## 1. Intent & The Why

The existing `SWKPROPERTY.COM` website feels AI-generated, overly dark, visually cluttered, and lacks architectural authority or a "WOW" factor. SWK Properties LLC (RERA ORN 51517, Sheikh Zayed Road, Dubai) needs a bright, confident, architectural digital presence inspired directly by **Avenlo** (`https://avenlo.framer.website/`).

The redesigned website must:
1. **Project high-trust architectural presence** using generous white space, crisp editorial typography, vertical architectural grid lines, and full-bleed Dubai photography rather than dark glassmorphism or generic gold-on-black templates.
2. **Drive client growth & qualified enquiries** through clear advisor positioning, transparent DLD/mortgage tooling, verified client voices, and frictionless consultation flows wired to `/api/enquiries` and WhatsApp.
3. **Showcase what is happening right now in Dubai real estate**, placing SWK's **27+ UAE master developers** and **108+ off-plan launches** front and center so buyers and investors immediately see new releases, payment plans, and architectural masterplans across Dubai and the wider UAE.

---

## 2. Goals, Non-Goals & Anti-Goals

### Goals
- Recreate the entire visual language, layout cadence, typography hierarchy, and interaction feel of **Avenlo** across **all 28 existing routes** in `SWKPROPERTY.COM` plus a new `/agents` index route (29 total `page.tsx` routes + `not-found.tsx`).
- Replace the old open SWK logo & favicon with the user's newly uploaded self-contained **SWK crest emblem** (with checkerboard cleanly stripped to true alpha transparency) and uploaded **`favicon_(1).ico`**, paired with a clean `SWK Properties / DUBAI REAL ESTATE` typographic lockup on pure `#FFFFFF`.
- Elevate Dubai's live developer ecosystem (new off-plan launches, 27+ master developers, 8 core Dubai communities) into Avenlo's editorial rhythm without turning the page into a cluttered listing portal.
- Rebuild `/calculators` using Avenlo's signature two-column interactive calculator aesthetic (clean white slider card left, `#121212` obsidian live summary card right with SVG donut breakdown chart and `#51FEC0` mint-green payoff area chart + year-by-year table), tailored to Dubai AED mortgages, DLD 4% transfer fees, and net rental yields.
- Keep 100% compatibility with the existing Next.js 16 + Tailwind CSS 4 + Framer Motion + Cloudflare OpenNext deployment pipeline, `/api/enquiries`, `src/data/*`, `src/lib/*`, `public/img/*` (296 real Dubai images), UAE PDPL/RERA compliance, and `npm run audit:seo`.

### Non-Goals
- Do not break the existing sales enquiry payload or delivery channels (`LEAD_WEBHOOK_URL`, `RESEND_API_KEY`, `MEDIA` R2 archive) in `src/app/api/enquiries/route.ts`, Cloudflare Worker redirect/R2 logic (`worker/index.js`), or `src/data/*.json` factual data. *(Engineering call: `/api/enquiries/route.ts` receives one strictly additive branch for `context: "newsletter"` so the Avenlo footer newsletter card works cleanly under UAE PDPL and zero-silent-drop rules without changing existing sales-lead validation or routing.)*
- Do not invent fake DLD Trakheesi permits, fake BRN numbers, fake QR images, or fake client testimonials.
- Do not build an external CMS or database; all content stays statically/server-rendered from `src/data/*` and `src/lib/*`.
- Do not build a full Arabic localization in this pass. *(Design/engineering call: retire the previous incomplete `EN / العربية` toggle that only translated 7 nav labels while flipping English pages to `dir="rtl"` and breaking tight Latin Switzer tracking; remove the unused `swk_lang` entry from `/cookies` so PDPL inventory remains truthful.)*

### Anti-Goals (What Would Make This a Failure)
- Retaining any "AI-generic" artifacts from the previous design: spinning 3D dish-orbit hero carousels, heavy dark sticky announcement ribbons, unsolicited timed hype toast popups ("Imtiaz Kore VIP Launch Drop!" banners), neon shimmer bars, dark glassmorphic cards on dark backgrounds, or gold-gradient buttons.
- Letting dark sections overwhelm the light-first editorial balance (dark `#121212` is reserved strictly for high-contrast architectural punctuation: Services + Track Record band, dark Mortgage summary panel, and Footer).
- Breaking `scripts/seo-audit.mjs` (duplicate titles, >60-char titles, >175-char descriptions, missing canonicals, `h1 !== 1`, or broken links/assets) or RERA/PDPL compliance rules in `docs/COMPLIANCE.md`.

---

## 3. Technical, Brand & Regulatory Constraints

1. **Framework & Hosting:** Next.js `16.4.5` (App Router), React `19.3.0`, Tailwind CSS `4`, Framer Motion `14.9.1`, Lucide React, deployed via `@opennextjs/cloudflare` with `worker/index.js` and `next.config.ts` (`images: { unoptimized: true }`). Keep `next/font` and CSS compatible with Turbopack + OpenNext.
2. **RERA & DLD Compliance (`docs/COMPLIANCE.md`):**
   - Display `SWK Properties LLC` and `RERA ORN 51517` clearly on every page (footer + hero/subpage regulatory cue + JSON-LD).
   - Preserve the `isPermitVerified` / `dld.permitVerified` gate in `src/lib/listings.ts`: unverified listings remain `noindex` and excluded from `sitemap.ts`, and never render fabricated permits, BRNs, or fake Madmoun QR codes.
   - Keep `Developer Render` labels on off-plan architectural visuals, AED as primary quoted currency (with foreign currency conversions clearly marked approximate), and developer trademark attribution in the footer.
3. **UAE PDPL & AML Compliance:**
   - Keep `Analytics` + `CONSENT_DEFAULT_SCRIPT` (Google Consent Mode v2) in `src/app/layout.tsx`, the UAE PDPL cookie consent banner in `FloatingChrome`, unticked marketing consent checkbox in `EnquiryForm`, and full legal copy on `/privacy`, `/terms`, and `/cookies`.
   - Never collect passport/Emirates ID uploads via forms; keep PII stripped from `dataLayer` events in `src/lib/prefs.tsx`.
4. **Automated Release Gate (`README.md`):**
   - `npm run typecheck` (TypeScript clean)
   - `npm run lint` (ESLint clean)
   - `npm run build` (Next.js production build clean)
   - `npm run audit:seo` against running production server (`0` broken links/assets, `0` duplicate titles, every page title `<= 60` chars, description `1..175` chars, valid canonical, exactly one `<h1>`).
   - **Known repo defect & static-shadowing fix *(engineering call)*:** `src/app/sitemap.ts`, `src/lib/llms.ts`, and committed static copies in `public/{sitemap.xml,robots.txt,llms.txt,llms-full.txt}` + repo root currently reference non-existent `"/corporate-kit"` and omit `"/agents"`. Because `public/` assets shadow App Router routes in Next.js and Cloudflare OpenNext (`wrangler.jsonc`), remove the shadowing static copies in `public/` so `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/llms.txt/route.ts`, and `src/app/llms-full.txt/route.ts` are the live single source of truth, fix `/corporate-kit` → remove & add `/agents` in `sitemap.ts` + `llms.ts`, and refresh the repo-root reference copies from the verified production build.

---

## 4. Approaches Considered & Decision

| Approach | Summary | Trade-off | Status |
| --- | --- | --- | --- |
| **Approach A: Pure Avenlo Light-First Swiss Monochrome + Dubai Developer Pulse** | Pure `#FFFFFF` / `#F7F7F7` light canvas with selective `#121212` obsidian contrast bands, `#8B8B8B` split-tone headings, Avenlo's `#51FEC0` / `#10B981` mint-emerald accents for live status dots and calculator charts, and the user's uploaded gold-bordered SWK crest as the sole gold focal point. Dedicated Dubai Developer Launches & 2026 Releases pulse integrated into Avenlo's homepage cadence. | Retires the old serif + champagne-gold theme completely to achieve unmistakable international architectural authority and zero "AI template" feel. | **Selected by user** |
| **Approach B: Avenlo Light-First + Champagne-Gold Accents** | Same Avenlo structure and Dubai Developer Pulse, but replaces Avenlo's `#51FEC0` mint accent with SWK's matte champagne-gold (`#94652C` / `#DCB888`) across charts, active tags, and highlights. | Stronger tie to the legacy gold brand kit, but softer chart/status contrast and closer to conventional Dubai brokerage styling. | Rejected |

---

## 5. Brand Asset Pipeline

1. **Uploaded SWK Crest (`C:\Users\shamh\.gemini\antigravity\brain\2cffebd9-1140-45c6-b223-5f1012a59a8e\.user_uploaded\media_1795352427370_a501e575.jpg`):**
   - Extract the crest cleanly onto true alpha transparency (removing the outer checkerboard pixels with clean anti-aliased edge matting, preserving the dark interior fill and crisp outer gold border).
   - Export web-ready assets into `public/brand/`:
     - `public/brand/swk-crest-2026.png` (`512×512` transparent PNG)
     - `public/brand/swk-crest-2026.webp` (`512×512` & `192×192` transparent WebP for crisp Retina header/footer/mobile rendering)
   - Visually verify the extracted transparent crest over both `#FFFFFF` and `#121212` backgrounds to ensure zero halo or leftover checkerboard pixels.
2. **Uploaded Favicon (`C:\Users\shamh\.gemini\antigravity\brain\2cffebd9-1140-45c6-b223-5f1012a59a8e\.user_uploaded\media_1795352427174_569a47e7.ico`):**
   - Copy to `public/favicon.ico` and regenerate matching `public/favicon-16.png`, `public/favicon-32.png`, `public/favicon-48.png`, `public/favicon-96.png`, `public/favicon-192.png`, `public/favicon-512.png`, and `public/apple-touch-icon.png` from the uploaded high-res crest so browser tabs, bookmarks, and PWA icons match cleanly.
3. **Header & Footer Brand Lockup (Avenlo Pattern):**
   - Top-left lockup pairs the transparent SWK crest (`42px–46px` tall, explicit width/height) with clean Swiss typography: bold `SWK` / `SWK Properties` (`#121212` on light, `#FFFFFF` on dark) above muted tracked uppercase `DUBAI REAL ESTATE` (`#8B8B8B`, `10px`, `tracking-[0.22em]`).

---

## 6. Avenlo-Inspired Design System (`globals.css` & `layout.tsx`)

### 6.1 Color Tokens
- **Light Canvases:**
  - `--bg-white: #FFFFFF` (primary page background, hero, header, cards on `#F7F7F7`)
  - `--bg-offwhite: #F7F7F7` (alternating architectural bands: Acquisition Stages, Testimonials, FAQ, filter bars, soft card containers)
  - `--bg-cta-light: #F5F5F5` (bracketed button fill on light canvases)
  - `--bg-subtle: #F0F0F0` / `#ECECEC` (office info card on `/contact`, subtle chip fills)
- **Dark Contrast Canvases:**
  - `--bg-obsidian: #121212` (Services + Track Record band, dark Mortgage summary card, Footer, dark primary pills)
  - `--bg-obsidian-card: #1E1E1E` (Footer newsletter card, service-row arrow tiles, dark frosted pills)
  - `--border-dark: #2B2B2B` / `rgba(255, 255, 255, 0.16)`
- **Ink & Hairlines:**
  - `--ink-primary: #121212`
  - `--ink-secondary: #525252` (body prose on light for accessible contrast)
  - `--ink-muted: #8B8B8B` (Avenlo signature split-tone heading second half, unrevealed scroll text, subtitles)
  - `--ink-subtle: #A7A7A7`
  - `--border-light: #E5E5E5` / `#CFCFCF` (stronger dividers & input borders)
  - `--grid-line: rgba(18, 18, 18, 0.045)` (vertical architectural background hairline columns)
- **Live Status & Chart Accents:**
  - `--accent-mint: #51FEC0` (dark-surface highlights, Mortgage donut service-charge arc, payoff area chart fill & stroke, hover accents on `#121212`)
  - `--accent-mint-deep: #0E9F6E` / `#10B981` (accessible emerald text/dots on `#FFFFFF`)
  - `--status-sale: #62C584` (Ready / For Sale dot)
  - `--status-launch: #51FEC0` (New Off-Plan Launch dot)
  - `--status-offer: #A5CE3A` (Priority / Under Offer dot)
  - `--status-sold: #DC2626` (Sold / Reserved dot)

### 6.2 Typography
- **Font Family:** Load **Switzer** (the exact Avenlo typeface — weights `300, 400, 500, 600, 700` in normal and italic, sourced cleanly via Fontshare CSS or self-hosted `.woff2` files via `next/font/local` with `Inter` via `next/font/google` as guaranteed fallback so there is zero layout shift and crisp rendering offline/in Workers). `JetBrains Mono` / `Geist Mono` only for unit reference codes and numerical tabular figures (`tabular-nums`).
- **Signature Typographic Patterns:**
  1. **Eyebrow:** Small solid square glyph `▪` (`6px × 6px` `#121212` on light, `#FFFFFF` on dark) + `12px–13px` uppercase label, weight `500`, `tracking-[0.2em]`.
  2. **Monumental Mixed Roman / Italic H1:** `clamp(3.1rem, 8.8vw, 8.2rem)`, weight `500`, line-height `0.98`, tight negative tracking `-0.048em`, pairing roman weight `500` words with optical *italic* weight `300/400` contrast words (e.g., `Shape your future` *`in Dubai`* or `Own the skyline` *`before it rises`*).
  3. **Split-Tone Editorial H2:** `clamp(2.1rem, 4.4vw, 3.6rem)`, weight `500`, line-height `1.06`, tracking `-0.04em` — first clause in `#121212` (or `#FFFFFF` on dark), second clause in `#8B8B8B`.
  4. **Full-Bleed Residence Title (H3):** `clamp(2rem, 3.8vw, 3.25rem)`, weight `300` (Light), tracking `-0.035em`, pure `#FFFFFF`.
  5. **Body Copy:** `15px–17px`, line-height `1.6`, tracking `-0.015em`.

### 6.3 Signature Components & Micro-Interactions
- **Architectural Vertical Hairline Grid (`ArchitecturalGridBackdrop`):** Repeating subtle vertical lines (`24px–32px` cadence or responsive architectural columns at `rgba(18,18,18,0.04)`) spanning the top light hero and every subpage header band, fading cleanly into white at the bottom edge.
- **Corner-Bracketed CTA (`BracketButton`):** Sharp `0px` rectangular button (`#F5F5F5` fill on light, `#121212`/`rgba(18,18,18,0.88)` fill on dark/image) framed by delicate `7px × 7px` corner `L`-brackets (`1px` `#CFCFCF` on light, `rgba(255,255,255,0.45)` on dark) at all four corners. On hover (`240ms ease`), background smoothly inverts (`#121212` with `#FFFFFF` text on light; `#FFFFFF` with `#121212` text on dark) and brackets tighten subtly.
- **Blur-to-Sharp Page Headline Reveal (`BlurRevealText`):** Subpage headings and hero display lines animate smoothly from slight blur + subtle upward offset to crisp sharp focus (respecting `prefers-reduced-motion`).
- **Scroll-Linked Word Reveal (`ScrollRevealStatement`):** Editorial statement transitions word-by-word from `#8B8B8B` to `#121212` as the user scrolls through the section (powered by Framer Motion `useScroll` + `useTransform`).
- **Minimal Preloader (Optional First-Visit Only):** Lightweight session-scoped (`sessionStorage`) `000% → 100%` `#121212` architectural reveal with the SWK crest lasting `< 900ms` (skipped automatically on subsequent navigations, crawlers, and `prefers-reduced-motion` so Lighthouse / SEO crawl is instant).

---

## 7. Global Chrome: Header, Floating Bottom Pill, Footer & Utilities

### 7.1 Desktop & Mobile Header (`src/components/site/site-header.tsx`)
- **Removed:** Old dark sticky announcement bar (`RERA ORN` ribbon), navy glass pill bar, heavy dark scrolled backdrop.
- **New Avenlo Light Header (`84px–92px` height, sticky `bg-white/92 backdrop-blur-md border-b border-black/[0.06]`):**
  - **Left:** Transparent uploaded SWK crest + `SWK Properties` / `DUBAI REAL ESTATE`.
  - **Center-Right Primary Nav (desktop `lg+`):** `+ PROPERTIES`, `+ OFF-PLAN`, `+ DEVELOPERS`, `+ SERVICES`, `+ PAGES` (each prefixed with a thin `+` glyph, `12px–13px` uppercase, `tracking-[0.12em]`, `#121212`).
  - **`+ PAGES` Mega Popover (`#swk-pages-panel`):** Crisp white `rounded-2xl` floating panel (`min-w-[660px]`, `p-8`, `shadow-[0_24px_60px_rgba(18,18,18,0.14)]`, `border border-black/8`) arranged in a **3-column architectural index** covering ALL site sections:
    - Col 1 (*Explore*): Home (`/`), All Properties (`/properties`), Buy Ready (`/buy`), Rent & Leasing (`/rent`), Off-Plan Launches (`/off-plan`), List Your Property (`/list-your-property`)
    - Col 2 (*Dubai Ecosystem*): 27+ Master Developers (`/developers`), Dubai Communities (`/communities`), Advisory Services (`/services`), Advisors & Team (`/agents`), Market Insights (`/insights`), Dubai Property Guides (`/guides`)
    - Col 3 (*Tools & Firm*): Mortgage & DLD Calculator (`/calculators`), About SWK (`/about`), FAQ (`/faq`), Contact & Office (`/contact`), Privacy Policy (`/privacy`)
    - **Bottom Utility Strip inside dropdown + mobile drawer:** Compact AED/USD/EUR/GBP/INR/RUB currency selector, `sq ft / sq m` toggle, and Saved Shortlist count trigger (opens Shortlist/Compare drawer). *(Design call: removes the broken half-RTL `EN / العربية` stub until real Arabic pages exist.)* Keeping utilities here preserves all core `PrefsProvider` functionality while keeping the main header 100% clean and Avenlo-minimal!
  - **Far Right CTA:** Corner-bracketed `[BOOK A CALL]` button linking to `/contact` (on mobile: compact menu toggle + `[CALL]`/`[BOOK]`).

### 7.2 Floating Frosted Bottom Navigation Pill (`src/components/site/floating-chrome.tsx`)
- Centered near the bottom viewport edge (`bottom-5`, `z-40`), replicating Avenlo's signature dark frosted pill (`bg-[#121212]/80 backdrop-blur-xl text-white rounded-xl px-4 py-2.5 shadow-2xl border border-white/12`):
  - Displays small SWK crest + `SWK Properties` on left and `≡` menu toggle on right (plus a tiny badge dot if properties are saved/compared).
  - Clicking expands a sleek upward dark frosted quick-menu card (`Properties`, `Off-Plan Launches`, `Developers`, `Services`, `Calculators`, `Agents`, `Insights`, `Contact`, plus quick toggles for Currency, Shortlist Drawer, and WhatsApp).
- **Cleaned-Up `FloatingChrome`:**
  - **Removed permanently:** The timed animated hype promo banner ("Imtiaz Kore VIP Launch Drop!" / "Azizi Florence Waterfront Release!") that felt spammy and AI-generic.
  - **Retained cleanly:**
    - Subtle bottom-right **WhatsApp** quick icon button (`#25D366` / minimal dark-ringed architectural button) and compact **AI Concierge** button (styled in crisp monochrome `#FFFFFF`/`#121212` instead of warm ivory/gold).
    - **UAE PDPL Cookie Consent Card** (crisp white `rounded-2xl`, monochrome `#121212` primary button).
    - **Saved Shortlist & Side-by-Side Comparison Drawer** (restyled in crisp `#FFFFFF` / `#F7F7F7` / `#121212`).

### 7.3 Dark Architectural Footer (`src/components/site/site-footer.tsx`)
- Pure `#121212` obsidian canvas, structured cleanly after Avenlo's footer:
  - **Top 4-Column Row (`max-w-[1260px]`):**
    1. **Newsletter / Dubai Launch Notes Card (`bg-[#1E1E1E] rounded-2xl p-6`):** `NEWSLETTER` uppercase label, `Dubai launch notes, once a month.` heading, `#121212` email input (`border-[#333]`), an unticked compact UAE PDPL marketing-consent checkbox (`Monthly Dubai market notes — unsubscribe anytime`), and full-width `#FFFFFF` `SUBSCRIBE` button wired to `POST /api/enquiries` (`context: "newsletter"`). *(Engineering call: add a dedicated email-only `context === "newsletter"` branch in `src/app/api/enquiries/route.ts` requiring valid `email` + `marketingConsent: true`, logging as `type: "newsletter"` through the existing webhook/Resend/R2 `deliver()` pipeline without polluting sales-agent routing, and returning an explicit error + email/WhatsApp fallback if no delivery channel succeeds so zero leads are silently dropped.)*
    2. **MAIN PAGES (2-col sub-grid):** Home, About, Properties, Off-Plan, Developers, Communities, Agents, Insights, Guides, FAQ, Contact, Privacy, Terms, Cookies.
    3. **SERVICES & TOOLS:** Off-Plan Advisory, Secondary Sales, Leasing & Ejari, Investment Advisory, Property Management, Mortgage Assistance, Mortgage & DLD Calculator, List Your Property.
    4. **DUBAI OFFICE:** `Office 54, 27th Floor, Al Saqr Business Tower, Sheikh Zayed Road, Dubai, UAE`, `info@swkpropertiesuae.com`, `+971 56 433 0448`, `Sun–Thu 9:00–19:00 · Sat 10:00–16:00 GST`, and compact **RERA ORN 51517** compliance badge linking to `dubailand.gov.ae`.
  - **Compact Legal & Regulatory Strip (`border-t border-white/10 text-[11px] text-white/55`):** Preserves AED pricing disclaimer, off-plan developer render disclaimer, and developer trademark notice required by `docs/COMPLIANCE.md`.
  - **Monumental Clipped Wordmark Band (`h-[220px] md:h-[300px] overflow-hidden relative`):** Giant subtle dark-on-dark `SWK Properties` / `SWK` wordmark (`text-[22vw] leading-none font-medium tracking-[-0.04em] text-white/[0.06] select-none`), overlaid at the bottom by Avenlo's **3 floating dark pill capsules**:
    - Left pill: Social links (`Instagram`, `LinkedIn`, `WhatsApp`)
    - Center pill: `© 2026 SWK Properties LLC · RERA ORN 51517`
    - Right pill: `BACK TO TOP ↑` smooth-scroll button

---

## 8. Homepage Architecture (`src/app/page.tsx`) — 10-Band Avenlo + Dubai Pulse Flow

Preserves exactly **one `<h1>`** on the page (the visible monumental hero headline!) so SEO and visual hierarchy align seamlessly.

1. **Band 1 — Bright Architectural Hero (`#FFFFFF` + Vertical Hairline Grid):**
   - Centered eyebrow: `▪ RERA ORN 51517 · DUBAI & UAE REAL ESTATE`
   - Monumental mixed Roman / *Italic* `<h1>`: `Own the skyline` *`before it rises`* (or `Shape your future` *`in Dubai`*, clean 2-line display composition at `clamp(3.2rem, 8.8vw, 8.2rem)`).
   - Centered corner-bracketed CTA: `[WORK WITH US]` → `/contact` + subtle text link `Explore 108+ Off-Plan Launches →` (`/off-plan`).
   - **Asymmetric Lower Meta Row (exact Avenlo signature):**
     - Left: Quarter-circle arched advisor portrait (`/img/team/haseeb-portrait.webp`) + bold `18+` / `Years in UAE Real Estate`.
     - Right: Circular outlined **Play / Launch Brief** button (opens a clean Dubai Launch & Advisory modal or scrolls smoothly to the Dubai Developer Pulse) + mixed `#121212` / `#8B8B8B` editorial note (`Direct allocations across 27+ UAE developers — comparing payment plans, DLD escrow status, and real handover history.`).
   - **Hero Architectural Visual:** Full-bleed crisp Dubai skyline architectural showcase (`/img/hero/dubai-skyline-hero.webp` / crisp framed cutout presentation) layered cleanly in front of a monumental faint background watermark `Since 2008`.

2. **Band 2 — Scroll-Reveal Editorial Statement & Client Growth Bento (`#FFFFFF` / subtle soft-focus backdrop):**
   - Centered `50px` scroll-linked word-by-word reveal statement (`#8B8B8B` → `#121212`): *"We advise buyers and investors who look past developer brochures — matching capital to floor-plate quality, escrow security, and long-term Dubai appreciation."*
   - Three crisp pill/editorial capability labels: `Off-Plan Intelligence`, `DLD Due Diligence`, `Yield & Exit Strategy`.
   - **2-Card Avenlo Bento Row:**
     - Left white `rounded-2xl` card: Minimal client quote spotlight (cycles through verified approved clients from `testimonials.json` with 3-dot selector, quote, client name, city & transaction context).
     - Right vibrant Dubai architectural photograph (`/img/projects/emaar/rashid-yachts-and-marina.webp` or `/img/communities/downtown-dubai.webp`, `rounded-2xl`) with Avenlo's **frosted glass bottom overlay** displaying stacked SWK advisor avatars + `+` badge, concise line (`Turning a Dubai brief into the right allocation.`), and bold metric (`27+` *`Developers`* / `108+` *`Projects`*).

3. **Band 3 — "What's Happening in Dubai" · Developer Launches & Live Releases (`#F7F7F7`):**
   - Header: `▪ DUBAI MARKET PULSE · 2026 RELEASES`, split-tone H2: `What's launching now` (`#121212`) / `across Dubai & the UAE` (`#8B8B8B`), right-aligned `[ALL 108+ PROJECTS]` bracket CTA.
   - **Official Master Developer Strip:** Clean monochrome-treated architectural grid/marquee of official developer logos (`public/img/developers/`: Emaar, Nakheel, Sobha, DAMAC, Binghatti, Azizi, Aldar, Danube, Arada, Samana, Omniyat, Imtiaz, Dubai Properties, HH Development, Empire) linking to `/developers/[slug]`.
   - **Interactive New-Releases Filter Board:** Clean Avenlo pill filters (`All Launches`, `Waterfront & Islands`, `Branded Towers`, `Master Villas`, `High-Yield Plans`) displaying **6 curated live 2026 developer releases** (`Imtiaz Kore`, `Azizi Venice`, `Emaar The Oasis`, `DAMAC Islands`, `Sobha Century`, `Binghatti Mercedes-Benz`, `The Meriva Dubai Islands`, `Palm Jebel Ali`, `Creek Haven`, etc.) as crisp pure-white `rounded-2xl` architectural cards with crisp image, live mint dot (`NEW RELEASE`), developer name, community, payment plan pill, and `Inspect Release →` link to `/off-plan/[slug]`.

4. **Band 4 — Full-Bleed Architectural Residence Showcase (`6 × 720px–800px` Full-Bleed Viewport Panels):**
   - Replicates Avenlo's breathtaking full-bleed stack using SWK's finest high-res Dubai photography (`Palm Jebel Ali`, `Creek Haven — Dubai Creek Harbour`, `Bugatti Residences by Binghatti`, `Sobha SeaHaven — Dubai Harbour`, `Como Residences — Palm Jumeirah`, `Burj Crown — Downtown Dubai`):
   - Full-bleed edge-to-edge architectural photography with subtle bottom/center dark scrim for contrast.
   - Centered overlay: colored live status dot (`#51FEC0` `NEW LAUNCH` / `#62C584` `FOR SALE`), `50px` light-weight (`300`) residence title, uppercase pipe-separated architectural specs (`PALM JEBEL ALI, DUBAI  |  WATERFRONT VILLAS  |  NAKHEEL`), subtle `Developer Render` indicator where applicable, and Avenlo's dark corner-bracketed `[VIEW RESIDENCE]` CTA linking to `/off-plan/[slug]` or `/properties/[slug]`.

5. **Band 5 — Obsidian Dark Band: Advisory Services & Track Record (`#121212`):**
   - **Part A — Services Header & 4 Interactive Rows:**
     - `▪ WHAT WE PROVIDE`, split-tone H2 (`Taking the guesswork` `#FFFFFF` / `out of Dubai property` `#8B8B8B`), right-aligned `SERVICES / +008`.
     - 4 numbered full-width interactive rows separated by `1px solid #262626`:
       - `01 Off-Plan Advisory` (`/services/off-plan-advisory`)
       - `02 Buying & Selling Ready Homes` (`/services/secondary-market`)
       - `03 Leasing & Ejari Rentals` (`/services/leasing-rental`)
       - `04 Investment & Portfolio Advisory` (`/services/investment-advisory`)
     - Each row displays `Number + Title` | `4 × "+ ..." deliverables` | `#1E1E1E` rounded `→` hover-lit arrow tile (`hover:bg-[#51FEC0] hover:text-[#121212]`).
   - **Part B — Beyond Buying & Selling (3 Vertical Architectural Photo Cards):**
     - Split-tone subheading (`Support beyond` / `buying and selling`) + 3 tall `rounded-2xl` full-bleed cards:
       1. `Mortgage Assistance` (`/services/mortgage-assistance`)
       2. `Property Management` (`/services/property-management`)
       3. `Legal, Golden Visa & Fit-Out` (`/services/legal-documentation`)
     - Each card features clean photo, subtle dark top/bottom scrim, white `24px` title, and white pill `LEARN MORE →`.
   - **Part C — Track Record Figures:**
     - Hairline dark divider, top 2-column split: left side displays 3 clean architectural credential rings/laurels (`RERA ORN 51517`, `27+ Developers`, `Est. 2008 · Dubai`), right side displays split-tone statement (`Eighteen years advising` / `Dubai buyers, landlords and overseas investors — pairing DLD data with on-ground floor-plate intelligence.`).
     - Bottom **2×2 grid of crisp `#FFFFFF` stat cards (`rounded-2xl`, `min-h-[140px]`)** mirroring Avenlo's exact cards:
       - `18+` — Years advising across UAE real estate
       - `27+` — Official UAE master developer partners
       - `108+` — Verified off-plan & masterplan projects
       - `5` — UAE emirates covered (Dubai, Abu Dhabi, Sharjah, RAK, UAQ)

6. **Band 6 — Dubai Communities Horizontal Architectural Strip + Ticker (`#FFFFFF`):**
   - Crisp white uppercase marquee strip separated by `▪` dots (`RERA ORN 51517 ▪ DIRECT DEVELOPER ALLOCATIONS ▪ ESCROW-REGISTERED OFF-PLAN ▪ SHEIKH ZAYED ROAD HQ ▪ DLD TRANSFER & EJARI ADVISORY`).
   - Compact architectural grid/strip of SWK's **8 core Dubai communities** (`Downtown Dubai`, `Palm Jumeirah`, `Dubai Marina`, `Dubai Hills Estate`, `Business Bay`, `Dubai Creek Harbour`, `JVC`, `Sheikh Zayed Road`) linking to `/communities/[slug]` with clean imagery and zero clutter.

7. **Band 7 — Stages of Acquisition Wave (`#F7F7F7`):**
   - Centered `▪ STAGES OF A TRANSACTION`, split-tone H2: `From first brief` / `to Title Deed`.
   - **4-Column Staggered Wave (`Stages Wave`):** Pure white `rounded-2xl` cards alternating vertical rhythm (`01` & `03` with dashed circular step badges; `02` & `04` offset cleanly):
     - `01 Brief & Shortlist` — Define yield, lifestyle, or residency goals; narrow 108+ launches and ready stock to 3–5 contenders.
     - `02 Viewings & DLD Check` — Inspect floor plates, service charges, developer delivery history, and RERA escrow/Trakheesi status.
     - `03 Reservation, Form F & SPA` — Negotiate pricing, confirm payment milestones, review SPA/Form F, and structure finance.
     - `04 Transfer, Oqood & Keys` — Coordinate developer NOC, DLD Trustee transfer or Oqood filing, handover snagging, and Ejari leasing.

8. **Band 8 — Client Stories Strip & 2-Column FAQ (`#F7F7F7`):**
   - **Testimonials:** Centered `▪ WHAT CLIENTS SAY`, split-tone `Judged on outcomes,` / `not on brochures`, clean horizontal scrollable/grid strip of pure white `rounded-2xl` cards from approved `testimonials.json` (`//` mark, quote, square-rounded portrait, name, city & context).
   - **FAQ:** Top hairline divider, 2-column split — left column (`▪ QUESTIONS`, `The things buyers` / `ask us first`, direct Sheikh Zayed Road phone note), right column clean white `rounded-2xl` accordion cards (`+` / `−` toggles) from `faq.json`.

9. **Band 9 — Dubai Market Insights Preview (`#FFFFFF`):**
   - Clean 3-column editorial journal preview (`▪ JOURNAL & BRIEFINGS`, split-tone `Notes from Sheikh` / `Zayed Road`, `[ALL BRIEFINGS]` CTA) showcasing the 3 latest articles from `blog.json` + quick links to `/guides/buying` and `/guides/investing`.

10. **Band 10 — Full-Bleed Architectural CTA Banner + Dark Footer:**
    - Full-bleed `560px–600px` dark Dubai skyline backdrop with subtle blend scrim, centered `▪ GET STARTED`, `64px` white heading `Your next Dubai address` *`starts here`*, dual bracketed CTAs (`[BOOK A CALL]` → `/contact`, `[CALCULATE COSTS]` → `/calculators`), flowing seamlessly into the `#121212` Footer.

---

## 9. Complete Route-by-Route Architecture (All 29 Routes)

Every inner page shares the **Avenlo Subpage Header Pattern**: `#FFFFFF` canvas + subtle vertical hairline grid + centered (or split) `▪ EYEBROW` + blur-revealed mixed Roman/*Italic* `<h1>` + concise lead + clean action/filter controls — completely retiring the old dark `LivelyPageHero` component.

| Route(s) | Avenlo Redesign Layout & Key Features |
| --- | --- |
| `/` | 10-band Avenlo + Dubai Developer Pulse homepage (Section 8 above). |
| `/properties` | Centered `▪ PROPERTIES` / `Residences across` *`Dubai`* header, Avenlo pill filter bar (`All`, `Buy Ready`, `Rent`, `Off-Plan`, `Apartments`, `Villas`, `Townhouses`, `Penthouses`), clean search/community/bedroom/price row, plus *(design call)* a minimalist `More Filters` slide-over drawer (preserving developer, view, bathrooms, service charge, furnishing, pet policy, near-Metro & amenity filters), a subtle `Grid / Map` toggle (retaining the corridor map view), URL query-param sync (`?q=`, `?purpose=`, `?community=`, etc. so `SearchAction` JSON-LD & `not-found.tsx` work), and `Save Search` (`swk_saved_searches`) / `Share URL` controls. Pure-white editorial property cards with crisp status dot pill, AED price + conversion, specs line, save/compare toggles, and honest permit-status display. |
| `/buy` | Dedicated Ready Secondary Market landing page using Avenlo header, ready-only filtered property showcase, DLD 4% cost summary strip, and Form F / Trustee transfer consultation CTA. |
| `/rent` | Dedicated Annual & Executive Leasing page using Avenlo header, rental-only listings, Ejari & cheque-schedule overview, and tenant/landlord enquiry CTA. |
| `/properties/[slug]` | Exact Avenlo Property Detail layout: centered `▪ Community, Dubai` eyebrow, `64px–80px` title, area + AED price bar, dual bracketed CTAs (`[TALK TO AN AGENT]`, `[MORTGAGE CALCULATOR]`), full-width `rounded-2xl` hero visual, 4-stat spec strip, editorial description + highlights, multi-photo gallery (`A look around, before you visit`), 16-item clean **Amenities grid**, **interactive tabbed Floor Plan breakdown** (rooms & dimensions + `[BOOK A VIEWING]`), DLD/RERA compliance box (respecting `isPermitVerified`), assigned advisor card, and `EnquiryForm`. Preserves `noindex` for unverified permits. |
| `/off-plan` | Flagship **Dubai & UAE Off-Plan Launches Hub** (`108+ projects`): centered Avenlo header (`▪ OFF-PLAN LAUNCHES` / `New projects` *`rising now`*), interactive pill filters by Emirate / Developer / Community / Collection, Featured 2026 Launches row, clean 3-column architectural project grid with live mint dot, developer badge, community, payment tags, and `Developer Render` disclosure. |
| `/off-plan/[slug]` | Mirrors Avenlo's Property Detail elegance for off-plan projects: centered header (`▪ Developer · Community`), dual bracketed CTAs (`[REQUEST FLOOR PLANS]`, `[CALCULATE PAYMENT]`), large architectural visual with subtle render notice, project summary & tags, developer profile link, related releases in the same community/developer, and direct `EnquiryForm` pre-filled with project/developer context. |
| `/off-plan/in/[area]` | Programmatic SEO area launch pages rebuilt with Avenlo hairline-grid header, area highlights, filtered project grid for that community, community guide cross-link, and local enquiry form. |
| `/developers` | Architectural **27+ UAE Master Developers Directory**: centered header (`▪ MASTER DEVELOPERS` / `The builders shaping` *`the UAE`*), Emirate filter pills (`All`, `Dubai`, `Abu Dhabi`, `Sharjah`, `Ras Al Khaimah`), clean white `rounded-2xl` cards showcasing official brandmark (or typographic wordmark where no logo file exists), emirate, headquarters, flagship areas, project count, and `View Profile →`. |
| `/developers/[slug]` | Split Avenlo header with official logo, founding/HQ/emirate facts table, editorial developer overview, full grid of all projects by that developer, and developer-specific allocation enquiry form. |
| `/communities` & `/communities/[slug]` | Architectural Dubai Community Guides: clean 2-col/3-col photography cards on `/communities`; `/communities/[slug]` features centered Avenlo header, full-bleed community image, 4-card neighborhood metrics strip, editorial overview, lifestyle/connectivity bullets, active off-plan projects & listings in that community, FAQ accordion, and specialist enquiry block. |
| `/services` & `/services/[slug]` | Exact Avenlo Services architecture: `/services` has split header (`▪ SERVICES` / `Eight desks, one` *`point of contact`* + `[TALK TO AN AGENT]`), the numbered `01–08` interactive dark/light list rows + visual capability cards + process strip. Each `/services/[slug]` displays centered header, Avenlo's clean **4-row metadata table** (`Best for`, `Scope`, `Process`, `Fee transparency`), structured deliverables, numbered process steps, FAQ accordion, numbered `01–08` cross-links to sibling services, and tailored `EnquiryForm`. |
| `/about` | Exact Avenlo About layout: centered `▪ ABOUT SWK` / `Advising Dubai buyers` *`since 2008`*, arched/editorial architectural photo strip (`/img/about/swk-office.webp`, `/img/about/private-consultation-lounge.jpg`, Dubai skyline), scroll-reveal company statement, 3 capability pillars, RERA ORN 51517 governance block, team preview linking to `/agents`, and Sheikh Zayed Road office card. |
| `/agents` *(New)* & `/agents/[slug]` | Exact Avenlo Team architecture: `/agents` features centered `▪ THE TEAM` / `The advisors you will` *`actually deal with`* and a clean 3-column portrait grid (`rounded-2xl` portraits, name, role, languages, focus areas) for all 8 team members in `team.json`. `/agents/[slug]` features Avenlo's 2-column profile (large rounded portrait left; `About`, experience, specialties, top developers, key projects, optional BRN only when non-empty, direct call/WhatsApp & `[BOOK A CALL]` right) + assigned listings & direct agent enquiry form below. |
| `/insights` & `/insights/[slug]` | Exact Avenlo Journal architecture: `/insights` has `▪ MARKET INSIGHTS` / `Notes from Sheikh` *`Zayed Road`* with category filter pills and clean editorial article rows/cards (`Date · Read time · Category · Title · Excerpt`). `/insights/[slug]` uses Avenlo's uncluttered single-column long-form editorial reading layout (`max-w-3xl`, crisp `24px–32px` headings, generous line-height, key takeaways, related briefings, and advisory CTA). |
| `/guides` & `/guides/[slug]` | Clean architectural handbook hub (`/guides`) and structured long-form Dubai Buyer/Renter/Seller/Investor guides (`/guides/[slug]`) with executive direct-answer callout, crisp comparison tables (`rounded-2xl`, `#F7F7F7` headers), FAQ accordion, and calculator cross-links. |
| `/calculators` | **Avenlo Flagship Interactive Calculator Suite:** Centered `▪ CALCULATORS` / `What it` *`really costs`* header with **5 clean Avenlo mode pills** *(design call — preserves all existing Dubai financial funnels)*: `UAE Mortgage`, `DLD 4% Upfront Costs`, `Off-Plan Schedule`, `Net Rental Yield`, and `5-Year Buy vs Rent`. Every mode uses Avenlo's signature 2-column architecture (crisp `#F7F7F7` input/slider card left + `#121212` obsidian live summary card right with custom SVG visualization in `#FFFFFF`, `#51FEC0` mint, and `#8B8B8B`): <br>• **UAE Mortgage:** Property Price, Down Payment with UAE Central Bank LTV presets (`Resident 20%` / `Non-Resident 40%`), Term, Interest Rate, Monthly Service Charge & Insurance → obsidian card with bold Monthly Payment, **SVG Donut Chart**, 2×2 loan metrics (`Loan Amount`, `LTV`, `Total Interest`, `Total Repaid`), plus full-width bottom card with **interactive `#51FEC0` Mint Payoff Area Chart** (`What you still owe`) & collapsible year-by-year amortization table. <br>• **DLD 4% Upfront Costs:** Secondary vs Off-Plan toggle + Cash vs Mortgage toggle → obsidian card with total cash needed & **SVG Cost Composition Donut** (4% DLD, Trustee/Oqood, Agency/Admin, Mortgage Reg). <br>• **Off-Plan Schedule:** Preserves `60/40`, `70/30`, `80/20`, and `1% Monthly` developer plans → obsidian card with Booking / During Construction / Handover split + **SVG Milestone Timeline Bar Chart** & tranche table (backing all 108+ `[CALCULATE PAYMENT]` links). <br>• **Net Rental Yield:** Price, Annual Rent, Service Charge/sq ft, Management & Vacancy → obsidian card with Gross vs **Net Yield %** & **SVG Annual Cashflow Split**. <br>• **5-Year Buy vs Rent:** Monthly mortgage vs annual rent escalation → obsidian card with 5-year net equity advantage & **SVG Cumulative Outlay Comparison Chart**. <br>Includes AED approximate-estimate disclaimer per `docs/COMPLIANCE.md`. |
| `/list-your-property` | Clean Avenlo Seller & Landlord Mandate page: centered header (`▪ SELL OR LEASE` / `Price on evidence,` *`close cleanly`*), 4-stage staggered mandate process wave (RERA Form A, Marketing & Photography, Buyer Qualification, NOC & DLD Transfer), and dedicated vendor `EnquiryForm` (`context="selling"` / `"renting-out"`). |
| `/contact` | Exact Avenlo Contact layout: centered `▪ GET IN TOUCH` / `Tell us what you` *`are looking for`*, 2-column split — left `#F5F5F5` `rounded-2xl` `THE OFFICE` card (Al Saqr Business Tower address, phone, WhatsApp, email, Dubai GST hours, RERA ORN 51517) + clean embedded map below; right clean white `Send us an enquiry` form (`EnquiryForm` restyled in Avenlo's crisp `rounded-lg` inputs, unticked PDPL marketing checkbox, full-width bracketed `[SEND ENQUIRY]` button). |
| `/faq` | Centered `▪ QUESTIONS` / `Clear answers on` *`Dubai property`*, category pills + crisp white `rounded-2xl` accordion stack + direct call/WhatsApp strip. |
| `/privacy`, `/terms`, `/cookies` | Clean Avenlo typographic legal layouts (`max-w-3xl`, crisp headings, hairline dividers, readable tables for UAE PDPL Cookie Inventory & interactive consent toggles on `/cookies`). |
| `/thank-you` & `not-found.tsx` | Minimal centered Avenlo confirmation (`/thank-you`) with reference details & WhatsApp next steps; clean Avenlo `▪ ERROR 404` / `This address` *`does not exist`* with dual `[BACK TO HOME]` and `[BROWSE PROPERTIES]` bracketed CTAs. |

---

## 10. What Is Left to the Builder

- Exact component file organization inside `src/components/` (retiring unused legacy UI components like `dish-orbit-carousel.tsx`, `viewfinder-flip-carousel.tsx`, `glassmorphism-trust-hero.tsx`, `lively-page-hero.tsx`, `nearby-walk-menu.tsx`, and `interactive-selector.tsx` once replaced, while keeping clean modular Avenlo primitives such as `bracket-button.tsx`, `page-header.tsx`, `scroll-reveal.tsx`, `mortgage-charts.tsx`, `developer-pulse.tsx`, `residence-showcase.tsx`, etc.).
- Exact Framer Motion easing curves, scroll-trigger thresholds, and responsive mobile breakpoint spacing (`390px`, `768px`, `1024px`, `1280px+`) so mobile remains spacious, legible, and overflow-free.
- Exact image crop focal points (`object-center` / `object-top` for advisor portraits) and SVG path geometry for the calculator donut/area charts and laurel/credential emblems.
- Exact `sitemap.ts` update (removing non-existent `/corporate-kit`, adding `/agents`) and ensuring every page's metadata stays strictly within `scripts/seo-audit.mjs` bounds (`<= 60` char title, `1..175` char description, exact canonical, single `<h1>`).
