# SWK Brand — Matte Gold Kit

Source: `SWK_Matte_Gold_Brand_Kit.zip`, stored unmodified in `brand/SWK_Matte_Gold_Brand_Kit/`
(four brands: SWK Properties, SWK OS, SWK Rent, SWK ONE). Only **SWK Properties** assets are used on
this website. The kit folder is not deployed; web-ready copies live in `public/`.

The previous rose-gold "portal" identity (`public/brand/*` lockups, crest, map pin, app icons,
`scripts/make-favicons.mjs`) was removed in full.

## Web asset map

| File in `public/` | Kit source | Used for |
| --- | --- | --- |
| `brand/swk-logo-horizontal.svg` | `Logos/SWK_Properties_Horizontal_Logo_Transparent.svg` (viewBox cropped to artwork) | Site header, footer |
| `brand/swk-logo-horizontal-charcoal.svg` | `Logos/SWK_Properties_Horizontal_Logo.svg` | Light backgrounds, press |
| `brand/swk-logo-horizontal-1024.png` / `-charcoal-1024.png` | matching 1024 px PNGs | Email, third-party profiles |
| `brand/swk-logo-stacked.svg` | `Logos/SWK_Properties_Stacked_Logo_Transparent.svg` (cropped) | Available for hero / print layouts |
| `brand/swk-logo-stacked-charcoal-1024.png` | `Logos/SWK_Properties_Stacked_Logo_1024.png` | Social profile cover art |
| `brand/swk-wordmark.svg` | `Logos/SWK_Properties_Wordmark_Logo_Transparent.svg` | Compact placements |
| `brand/swk-emblem.svg` | `Icon/SWK_Emblem_Transparent.svg` (cropped) | Map pins, dark modal headers, concierge header |
| `brand/swk-emblem-charcoal.svg` | `Icon/SWK_Emblem.svg` | Emblem on light surfaces (concierge button) |
| `brand/swk-emblem-512.png` / `swk-emblem-charcoal-512.png` | `Icon/SWK_Emblem_*512.png` | schema.org `logo` (square, 512 px) |
| `favicon.ico`, `favicon.svg`, `favicon-16/32/48/96/192/512.png`, `favicon-16.svg`, `apple-touch-icon.png` | `Favicon/*` | Browser tabs, PWA manifest, iOS home screen |
| `og-default.jpg` | Generated: skyline + horizontal logo, 1200×630 | Default Open Graph / Twitter / WhatsApp preview |

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
