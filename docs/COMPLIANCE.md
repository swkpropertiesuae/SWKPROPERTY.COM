# UAE Legal & Regulatory Checklist

Status of the website against the rules that apply to a Dubai real estate brokerage. This is an
engineering checklist, not legal advice; have the firm's compliance officer or counsel sign it off.

Legend: ✅ done in code · ⚠️ owner action required

## RERA / Dubai Land Department advertising

| Requirement | Status |
| --- | --- |
| Brokerage name and RERA ORN on every page (footer, schema, OG image) | ✅ |
| Listings advertised only with a valid Trakheesi permit, permit number shown | ✅ gate built: `dld.permitVerified` in `src/lib/listings.ts`. ⚠️ All 13 listings carried placeholder permit/BRN/QR values; they are now hidden, the listing pages are `noindex` and excluded from the sitemap until real values are entered and `permitVerified: true` is set |
| Broker BRN shown with each agent / listing | ✅ field `brn` in `src/data/team.json`, rendered only when filled. ⚠️ Enter each agent's real BRN (fabricated `BRN-51517-XX` values were removed) |
| DLD Madmoun / Trakheesi QR on listings | ⚠️ The fake QR graphic was removed. Add the DLD-issued QR image per listing when permits are verified |
| No misleading claims (ratings, "verified" badges without evidence) | ✅ Fake star ratings and "shortlisted" counters removed from the hero; "Escrow Verified" claims changed to "Escrow Registered" (statutory for off-plan under Law 8/2007) |
| Render disclaimers on off-plan visuals | ✅ |
| Commission disclosure (Form A / Form B) | ✅ Terms §5 |
| Dubai Economy (DET) commercial licence number | ⚠️ Set `SITE.tradeLicense` in `src/lib/swk.ts`; it then appears in the footer and schema |

## UAE PDPL (Federal Decree-Law No. 45 of 2021)

| Requirement | Status |
| --- | --- |
| Privacy notice: controller, data collected, purposes, lawful basis, sharing, retention, rights | ✅ `/privacy` |
| Processors disclosed (hosting, email/CRM, maps, analytics, WhatsApp) | ✅ `/privacy` §6 |
| Consent before analytics/ad cookies | ✅ banner + Google Consent Mode v2 (`src/components/seo/analytics.tsx`) |
| Accurate cookie inventory | ✅ `/cookies` now lists the real storage keys and third-party cookies |
| Marketing opt-in separate from enquiry consent | ✅ unticked checkbox on forms; recorded in each lead |
| Data minimisation in analytics | ✅ name/email/phone stripped before `dataLayer` |
| Rights requests channel | ✅ email/phone in `/privacy` §5 |

## Anti-money laundering (Federal Decree-Law No. 20 of 2018)

| Requirement | Status |
| --- | --- |
| Disclose KYC and 5-year record retention | ✅ `/privacy` §7 |
| No ID documents collected via website forms | ✅ |

## Consumer & general

| Requirement | Status |
| --- | --- |
| Terms of use, limitation of liability, governing law (Dubai) | ✅ `/terms` |
| Prices in AED; conversions marked approximate | ✅ footer notice |
| Copyright line with legal entity | ✅ footer |
| Developer trademarks attributed | ✅ footer |
| Accessibility basics (skip link, alt text, one h1, focusable controls) | ✅ |

## Lead handling

| Requirement | Status |
| --- | --- |
| Every enquiry is stored or delivered | ✅ webhook / email / R2 archive; error shown if none succeeds. ⚠️ Configure `LEAD_WEBHOOK_URL` or `RESEND_API_KEY` in production |
| Spam protection | ✅ honeypot + 45 s duplicate window + input length limits |

## Content items to confirm with the business

- Author "Rahma Tahir" appears on two insights but is not in `team.json`; add the profile or reassign.
- Team stats ("140+ verified transactions" etc.) and company stats ("18+ years", "108+ projects") must
  be substantiated if challenged.
- Testimonials must be from real, consenting clients (`approved: true` in `testimonials.json`).
