# SWK Brand — Matte Gold Kit

Source: `SWK_Matte_Gold_Brand_Kit.zip`, stored unmodified in `brand/SWK_Matte_Gold_Brand_Kit/`
(four brands: SWK Properties, SWK OS, SWK Rent, SWK ONE). Only **SWK Properties** assets are used on
this website. The kit folder is not deployed; web-ready copies live in `public/`.

The previous rose-gold "portal" identity (`public/brand/*` lockups, crest, map pin, app icons,
`scripts/make-favicons.mjs`) was removed in full.

## Web asset map

| File in `public/` | Kit source | Used for |
| --- | --- | --- |
| `brand/swk-logo-horizontal.svg` | `Logos/SWK_Properties_Horizontal_Logo_Transparent.svg` (viewBox cropped to artwork) | Site header, footer (vector, sharp at any size) |
| `brand/swk-logo-horizontal-charcoal.svg` | `Logos/SWK_Properties_Horizontal_Logo.svg` | Light backgrounds, press |
| `brand/swk-logo-horizontal-4096.png` / `-charcoal-4096.png` | highest-resolution horizontal PNGs | Email, portals, print |
| `brand/swk-logo-stacked.svg` / `-charcoal.svg`, `swk-logo-stacked-4096.png` / `-charcoal-4096.png` | stacked logo, vector + 4096 px | Social profile art, print |
| `brand/swk-wordmark.svg` / `-charcoal.svg` | wordmark logo | Compact placements |
| `brand/swk-emblem.svg` / `-charcoal.svg` | `Icon/SWK_Emblem*.svg` | Map pins, modal headers, concierge |
| `brand/swk-emblem-2048.png` / `-charcoal-2048.png` | 2048 px emblem | Avatars, print |
| `brand/swk-emblem-charcoal-1024.png` | `Icon/SWK_Emblem_1024.png` | schema.org `logo` |
| `favicon.svg`, `favicon-16.svg`, `favicon-16…512.png`, `apple-touch-icon.png` | `Favicon/*` | Browser tabs, iOS home screen |
| `favicon.ico` | 16/32/48 from kit + 64/128/256 downscaled from kit 512 | Legacy browsers, Windows, Google SERP favicon |
| `app-icon-1024.png`, `app-icon-512.png` | `App_Icons/Emblem_and_SWK` iOS 1024 / Google Play 512 | PWA manifest (any + maskable) |
| `og-default.jpg` | Generated: skyline + vector logo at 600 dpi, 1200×630, JPEG q92 4:4:4 | Default Open Graph / WhatsApp preview |

## Developer logos

`public/img/developers/` holds official brandmarks only (Emaar, Nakheel, Binghatti, DAMAC, Sobha, Aldar, Azizi,
Danube, Arada, Samana, Empire, Dubai Properties, Imtiaz, Omniyat, HH Development). Twelve invented placeholder
marks were removed; those developers show their name as text until an official logo file is added to
`public/img/developers/` and mapped in `LOGOS` in `src/lib/developers.ts`. Developer names and logos are
trademarks of their owners, used only to identify their projects (see footer notice).

Native app icon sets (`App_Icons/…/iOS`, `…/Android/res`) are kept in the kit for future mobile apps.

## Usage rules

- The gold artwork is designed for dark surfaces. On the site it sits on the navy header/footer
  (`#0b1220`, `#0f2244`). On light backgrounds use the `-charcoal` versions, which carry their own
  charcoal plate.
- Do not recolour, add shadows, stretch or rotate the logo. Keep clear space of at least the height
  of the "S" around the horizontal logo.
- Minimum sizes: horizontal logo 120 px wide on screen; emblem 16 px (use the favicon set below 24 px,
  its 16 px artwork is pixel-hinted).
- Always pass explicit `width`/`height` (870×311 for the horizontal SVG) to avoid layout shift.

## Regenerating the OG image

`public/og-default.jpg` was composed with `sharp` (bundled with Next.js) from
`public/img/hero/dubai-skyline-hero.webp` and `public/brand/swk-logo-horizontal.svg`. Replace the file
with any 1200×630 JPEG to change the default social preview.
