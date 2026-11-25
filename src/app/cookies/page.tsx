"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { usePrefs } from "@/lib/prefs";
import { AvenloPageHeader } from "@/components/avenlo/page-header";

const TRACKER_INVENTORY = [
  {
    name: "swk_cookie_consent",
    category: "Essential",
    storage: "localStorage",
    purpose: "Stores your cookie and analytics consent choices so you are not re-prompted on every visit.",
    retention: "Until changed or cleared",
  },
  {
    name: "swk_intro_seen",
    category: "Essential",
    storage: "sessionStorage",
    purpose: "Prevents the brief architectural page-load reveal from repeating during the same browser session.",
    retention: "Current browser tab session",
  },
  {
    name: "swk_currency, swk_area_unit",
    category: "Preferences",
    storage: "localStorage",
    purpose: "Remembers your display currency (AED/USD/EUR/GBP/INR/RUB) and area unit (sq ft / sq m).",
    retention: "Until cleared",
  },
  {
    name: "swk_saved_slugs, swk_compare_slugs, swk_saved_searches",
    category: "Preferences",
    storage: "localStorage",
    purpose: "Stores shortlisted residences, comparison tray items, and saved search filters locally in your browser.",
    retention: "Until cleared",
  },
  {
    name: "swk_attribution",
    category: "Analytics",
    storage: "localStorage",
    purpose: "Records first-touch and latest-touch UTM referral parameters for enquiry channel attribution.",
    retention: "Until cleared",
  },
  {
    name: "Google Tag Manager / Analytics (_ga, _gcl_*)",
    category: "Analytics",
    storage: "Third-party cookies",
    purpose: "Measures site performance under Google Consent Mode v2 and remains disabled unless you opt in.",
    retention: "Up to 13 months (per Google)",
  },
  {
    name: "Google Maps embeds",
    category: "Third-party",
    storage: "Third-party cookies",
    purpose: "Displays Dubai office, community, and property locations when a map iframe loads.",
    retention: "Per Google's policy",
  },
];

export default function CookieSettingsPage() {
  const { cookieConsent, updateCookieConsent } = usePrefs();
  const [analytics, setAnalytics] = React.useState(cookieConsent?.analytics ?? false);
  const [preferences, setPreferences] = React.useState(cookieConsent?.preferences ?? true);
  const [savedToast, setSavedToast] = React.useState(false);
  const toastTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  const [syncedConsent, setSyncedConsent] = React.useState(cookieConsent);
  if (cookieConsent !== syncedConsent) {
    setSyncedConsent(cookieConsent);
    if (cookieConsent) {
      setAnalytics(cookieConsent.analytics);
      setPreferences(cookieConsent.preferences);
    }
  }

  const persist = (nextA: boolean, nextP: boolean) => {
    setAnalytics(nextA);
    setPreferences(nextP);
    updateCookieConsent({ analytics: nextA, preferences: nextP });
    setSavedToast(true);
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => {
      setSavedToast(false);
      toastTimerRef.current = null;
    }, 3000);
  };

  return (
    <div className="bg-transparent">
      <AvenloPageHeader
        eyebrow="UAE PDPL · GRANULAR CONSENT & STORAGE"
        title="Cookie Settings"
        italic="& Storage Inventory"
        lead="Control how SWK Properties uses browser storage and analytics. Essential storage stays active for security and consent memory; adjust Preferences and Analytics below anytime."
        compact
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Cookies" },
        ]}
      />

      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-8 space-y-12">
        {/* Interactive Consent Panel */}
        <section className="rounded-2xl border border-white/80 bg-white/86 backdrop-blur-xl shadow-[0_18px_48px_rgba(12,56,96,0.09)] p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4 border-b border-black/[0.08] pb-5">
            <div>
              <h2 className="text-base font-medium text-[#121212]">
                1. Strictly Necessary &amp; Security Storage
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-[#666666]">
                Required for form spam protection, duplicate-submission prevention, and saving your privacy consent choice.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[#121212] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[#51fec0]">
              Always Active
            </span>
          </div>

          <div className="flex items-start justify-between gap-4 border-b border-black/[0.08] pb-5">
            <div>
              <h2 className="text-base font-medium text-[#121212]">
                2. Functional Preferences (Currency, sq ft/sq m &amp; Shortlist)
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-[#666666]">
                Remembers your preferred reference currency, area unit, saved searches, and shortlisted residences.
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences}
              onChange={(e) => setPreferences(e.target.checked)}
              aria-label="Enable Functional Preferences"
              className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-[#121212]"
            />
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-medium text-[#121212]">
                3. Analytics &amp; Enquiry Attribution (Google Consent Mode v2)
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-[#666666]">
                Measures anonymous search, calculator, and UTM performance without sharing personal contact details.
              </p>
            </div>
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              aria-label="Enable Analytics"
              className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-[#121212]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-black/[0.08] pt-5">
            <button
              type="button"
              onClick={() => persist(analytics, preferences)}
              className="cursor-pointer rounded-full bg-[#121212] px-6 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-white hover:bg-[#2b2b2b]"
            >
              Save Preferences
            </button>
            <button
              type="button"
              onClick={() => persist(true, true)}
              className="cursor-pointer rounded-full border border-black/15 bg-white px-5 py-2.5 text-xs font-medium text-[#121212] hover:bg-[#ececec]"
            >
              Accept All
            </button>
            <button
              type="button"
              onClick={() => persist(false, false)}
              className="cursor-pointer rounded-full border border-black/15 bg-white px-5 py-2.5 text-xs font-medium text-[#525252] hover:text-[#121212]"
            >
              Essential Only
            </button>
            {savedToast ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0e9f6e]">
                <Check className="h-4 w-4" /> Preferences saved
              </span>
            ) : null}
          </div>
        </section>

        {/* Storage Inventory Table */}
        <section className="space-y-4">
          <h2 className="text-2xl font-medium tracking-[-0.03em] text-[#121212]">
            Complete Cookie &amp; Browser Storage Inventory
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-black/[0.08]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f7f7f7] text-[#121212]">
                <tr>
                  <th className="p-4 font-medium">Key / Identifier</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Mechanism</th>
                  <th className="p-4 font-medium">Purpose</th>
                  <th className="p-4 font-medium">Retention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.06] text-[#525252]">
                {TRACKER_INVENTORY.map((row) => (
                  <tr key={row.name}>
                    <td className="p-4 font-mono text-[#121212]">{row.name}</td>
                    <td className="p-4">{row.category}</td>
                    <td className="p-4">{row.storage}</td>
                    <td className="p-4 leading-relaxed">{row.purpose}</td>
                    <td className="p-4">{row.retention}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
