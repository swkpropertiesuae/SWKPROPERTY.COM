"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";

export type CurrencyCode = "AED" | "USD" | "EUR" | "GBP" | "INR" | "RUB";
export type AreaUnit = "sqft" | "sqm";
export type LanguageCode = "en" | "ar";

export const CURRENCY_RATES: Record<
  CurrencyCode,
  { symbol: string; rateFromAed: number; label: string }
> = {
  AED: { symbol: "AED", rateFromAed: 1, label: "AED · UAE Dirham (Primary)" },
  USD: { symbol: "US$", rateFromAed: 1 / 3.6725, label: "USD · US Dollar (Approx.)" },
  EUR: { symbol: "€", rateFromAed: 0.251, label: "EUR · Euro (Approx.)" },
  GBP: { symbol: "£", rateFromAed: 0.214, label: "GBP · British Pound (Approx.)" },
  INR: { symbol: "₹", rateFromAed: 23.0, label: "INR · Indian Rupee (Approx.)" },
  RUB: { symbol: "₽", rateFromAed: 25.4, label: "RUB · Russian Ruble (Approx.)" },
};

export type AnalyticsEventName =
  | "property_view"
  | "property_search"
  | "search_no_results"
  | "form_start"
  | "enquiry_success"
  | "whatsapp_click"
  | "phone_click"
  | "brochure_download"
  | "viewing_booked"
  | "lead_qualified"
  | "deal_won";

export interface AttributionSnapshot {
  firstTouchSource: string;
  firstTouchAt: string;
  latestTouchSource: string;
  latestTouchAt: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  referrer: string;
}

export interface CookieConsentState {
  decided: boolean;
  essential: true;
  analytics: boolean;
  preferences: boolean;
  updatedAt: string;
}

interface PrefsContextValue {
  hydrated: boolean;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  areaUnit: AreaUnit;
  setAreaUnit: (u: AreaUnit) => void;
  lang: LanguageCode;
  setLang: (l: LanguageCode) => void;
  formatPrice: (aed: number, opts?: { compact?: boolean; includeApprox?: boolean }) => string;
  formatArea: (sqFt: number) => string;
  savedSlugs: string[];
  toggleSaved: (slug: string) => void;
  compareSlugs: string[];
  toggleCompare: (slug: string) => void;
  clearCompare: () => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  assistantOpen: boolean;
  setAssistantOpen: (open: boolean) => void;
  cookieConsent: CookieConsentState;
  updateCookieConsent: (partial: { analytics: boolean; preferences: boolean }) => void;
  attribution: AttributionSnapshot;
  trackEvent: (event: AnalyticsEventName, payload?: Record<string, string | number | boolean>) => void;
  toastMessage: string | null;
  notify: (msg: string) => void;
}

const DEFAULT_ATTRIBUTION: AttributionSnapshot = {
  firstTouchSource: "direct",
  firstTouchAt: "",
  latestTouchSource: "direct",
  latestTouchAt: "",
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmTerm: "",
  utmContent: "",
  referrer: "",
};

const DEFAULT_CONSENT: CookieConsentState = {
  decided: false,
  essential: true,
  analytics: false,
  preferences: false,
  updatedAt: "",
};

const SAFE_SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{0,160}$/i;
const PII_KEY_PATTERN = /(?:email|mail|phone|mobile|tel|whatsapp|name|passport|emirates|card|password|token|secret|address)/i;

function clipParam(val: string | null, max = 100): string {
  return val ? val.replace(/[\r\n\t]+/g, " ").trim().slice(0, max) : "";
}

function parseSlugList(raw: string | null, max = 50): string[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is string => typeof item === "string" && SAFE_SLUG_PATTERN.test(item))
      .slice(0, max);
  } catch {
    return [];
  }
}

function parseConsent(raw: string | null): CookieConsentState | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const obj = parsed as Record<string, unknown>;
    return {
      decided: Boolean(obj.decided),
      essential: true,
      analytics: Boolean(obj.analytics),
      preferences: Boolean(obj.preferences),
      updatedAt: typeof obj.updatedAt === "string" ? obj.updatedAt.slice(0, 40) : "",
    };
  } catch {
    return null;
  }
}

function parseAttribution(raw: string | null): AttributionSnapshot | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const obj = parsed as Record<string, unknown>;
    const str = (k: string) => (typeof obj[k] === "string" ? (obj[k] as string).slice(0, 140) : "");
    return {
      firstTouchSource: str("firstTouchSource") || "direct",
      firstTouchAt: str("firstTouchAt"),
      latestTouchSource: str("latestTouchSource") || "direct",
      latestTouchAt: str("latestTouchAt"),
      utmSource: str("utmSource"),
      utmMedium: str("utmMedium"),
      utmCampaign: str("utmCampaign"),
      utmTerm: str("utmTerm"),
      utmContent: str("utmContent"),
      referrer: str("referrer"),
    };
  } catch {
    return null;
  }
}

function extractReferrerHost(referrer: string, currentHost: string): string {
  if (!referrer) return "direct";
  try {
    const u = new URL(referrer);
    if (u.hostname.toLowerCase() === currentHost.toLowerCase()) return "direct";
    return u.hostname.slice(0, 120);
  } catch {
    return "direct";
  }
}

const PrefsContext = createContext<PrefsContextValue | null>(null);

export function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [currency, setCurrencyState] = useState<CurrencyCode>("AED");
  const [areaUnit, setAreaUnitState] = useState<AreaUnit>("sqft");
  const [lang, setLangState] = useState<LanguageCode>("en");
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [cookieConsent, setCookieConsent] = useState<CookieConsentState>(DEFAULT_CONSENT);
  const [attribution, setAttribution] = useState<AttributionSnapshot>(DEFAULT_ATTRIBUTION);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const notify = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
      toastTimerRef.current = null;
    }, 3500);
  }, []);

  const captureAttributionSnapshot = useCallback((persist: boolean) => {
    try {
      const params = new URLSearchParams(window.location.search);
      const utmSource = clipParam(params.get("utm_source"), 80);
      const utmMedium = clipParam(params.get("utm_medium"), 80);
      const utmCampaign = clipParam(params.get("utm_campaign"), 100);
      const utmTerm = clipParam(params.get("utm_term"), 100);
      const utmContent = clipParam(params.get("utm_content"), 100);
      const refHost = extractReferrerHost(document.referrer || "", window.location.hostname);
      const nowIso = new Date().toISOString();
      const sourceLabel = utmSource ? `${utmSource}/${utmMedium || "referral"}` : refHost;

      const existingAttr = persist ? parseAttribution(localStorage.getItem("swk_attribution")) : null;
      const nextAttr: AttributionSnapshot = {
        firstTouchSource: existingAttr?.firstTouchSource || sourceLabel,
        firstTouchAt: existingAttr?.firstTouchAt || nowIso,
        latestTouchSource: sourceLabel,
        latestTouchAt: nowIso,
        utmSource: utmSource || existingAttr?.utmSource || "",
        utmMedium: utmMedium || existingAttr?.utmMedium || "",
        utmCampaign: utmCampaign || existingAttr?.utmCampaign || "",
        utmTerm: utmTerm || existingAttr?.utmTerm || "",
        utmContent: utmContent || existingAttr?.utmContent || "",
        referrer: refHost,
      };
      setAttribution(nextAttr);
      if (persist) {
        localStorage.setItem("swk_attribution", JSON.stringify(nextAttr));
      }
    } catch {
      // ignore storage errors in private mode
    }
  }, []);

  // Hydrate saved preferences safely from localStorage after mount (isolated try/catch per key).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const savedCurr = localStorage.getItem("swk_currency");
      if (savedCurr && Object.hasOwn(CURRENCY_RATES, savedCurr)) {
        setCurrencyState(savedCurr as CurrencyCode);
      }

      const savedUnit = localStorage.getItem("swk_area_unit");
      if (savedUnit === "sqft" || savedUnit === "sqm") {
        setAreaUnitState(savedUnit);
      }

      document.documentElement.lang = "en";
      document.documentElement.dir = "ltr";

      setSavedSlugs(parseSlugList(localStorage.getItem("swk_saved_slugs"), 50));
      setCompareSlugs(parseSlugList(localStorage.getItem("swk_compare_slugs"), 4));

      const parsedConsent = parseConsent(localStorage.getItem("swk_cookie_consent"));
      if (parsedConsent) {
        setCookieConsent(parsedConsent);
        // Only persist attribution to localStorage when visitor has consented to analytics (UAE PDPL).
        captureAttributionSnapshot(parsedConsent.analytics);
      } else {
        // Keep attribution strictly ephemeral in memory until analytics consent is granted.
        captureAttributionSnapshot(false);
      }
    } catch {
      // ignore storage errors in private mode
    } finally {
      setHydrated(true);
    }
  }, [captureAttributionSnapshot]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const setCurrency = useCallback((c: CurrencyCode) => {
    if (!Object.hasOwn(CURRENCY_RATES, c)) return;
    setCurrencyState(c);
    try {
      localStorage.setItem("swk_currency", c);
    } catch {}
  }, []);

  const setAreaUnit = useCallback((u: AreaUnit) => {
    if (u !== "sqft" && u !== "sqm") return;
    setAreaUnitState(u);
    try {
      localStorage.setItem("swk_area_unit", u);
    } catch {}
  }, []);

  const setLang = useCallback((l: LanguageCode) => {
    setLangState(l);
    if (typeof document !== "undefined") {
      document.documentElement.lang = l;
      document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    }
    try {
      localStorage.setItem("swk_lang", l);
    } catch {}
  }, []);

  const toggleSaved = useCallback(
    (slug: string) => {
      if (!SAFE_SLUG_PATTERN.test(slug)) return;
      setSavedSlugs((prev) => {
        const exists = prev.includes(slug);
        const next = exists ? prev.filter((item) => item !== slug) : [...prev, slug].slice(0, 50);
        try {
          localStorage.setItem("swk_saved_slugs", JSON.stringify(next));
        } catch {}
        notify(exists ? "Removed from your shortlist" : "Saved to your property shortlist");
        return next;
      });
    },
    [notify]
  );

  const toggleCompare = useCallback(
    (slug: string) => {
      if (!SAFE_SLUG_PATTERN.test(slug)) return;
      setCompareSlugs((prev) => {
        const exists = prev.includes(slug);
        if (!exists && prev.length >= 4) {
          notify("Compare up to 4 properties at once");
          return prev;
        }
        const next = exists ? prev.filter((item) => item !== slug) : [...prev, slug];
        try {
          localStorage.setItem("swk_compare_slugs", JSON.stringify(next));
        } catch {}
        notify(exists ? "Removed from comparison" : "Added to comparison drawer");
        return next;
      });
    },
    [notify]
  );

  const clearCompare = useCallback(() => {
    setCompareSlugs([]);
    try {
      localStorage.removeItem("swk_compare_slugs");
    } catch {}
  }, []);

  const updateCookieConsent = useCallback(
    (partial: { analytics: boolean; preferences: boolean }) => {
      const next: CookieConsentState = {
        decided: true,
        essential: true,
        analytics: Boolean(partial.analytics),
        preferences: Boolean(partial.preferences),
        updatedAt: new Date().toISOString(),
      };
      setCookieConsent(next);
      try {
        localStorage.setItem("swk_cookie_consent", JSON.stringify(next));
        if (next.analytics) {
          captureAttributionSnapshot(true);
        } else {
          localStorage.removeItem("swk_attribution");
        }
      } catch {}
      notify("Cookie preferences saved");
    },
    [captureAttributionSnapshot, notify]
  );

  const formatPrice = useCallback(
    (aed: number, opts?: { compact?: boolean; includeApprox?: boolean }) => {
      const safeAed = Number.isFinite(aed) && aed >= 0 ? aed : 0;
      const aedFormatted = opts?.compact
        ? safeAed >= 1_000_000
          ? `AED ${(safeAed / 1_000_000).toFixed(2).replace(/\.00$/, "")}M`
          : `AED ${Math.round(safeAed / 1000)}K`
        : `AED ${Math.round(safeAed).toLocaleString("en-US")}`;

      if (currency === "AED" || !Object.hasOwn(CURRENCY_RATES, currency)) return aedFormatted;

      const info = CURRENCY_RATES[currency];
      const converted = Math.round(safeAed * info.rateFromAed);
      const convFormatted = opts?.compact
        ? converted >= 1_000_000
          ? `${info.symbol} ${(converted / 1_000_000).toFixed(2)}M`
          : `${info.symbol} ${converted.toLocaleString("en-US")}`
        : `${info.symbol} ${converted.toLocaleString("en-US")}`;

      if (opts?.includeApprox === false) {
        return `${aedFormatted} (${convFormatted})`;
      }
      return `${aedFormatted} · Approx. ${convFormatted}`;
    },
    [currency]
  );

  const formatArea = useCallback(
    (sqFt: number) => {
      const safeSqFt = Number.isFinite(sqFt) && sqFt >= 0 ? Math.round(sqFt) : 0;
      if (areaUnit === "sqft") {
        return `${safeSqFt.toLocaleString("en-US")} sq ft`;
      }
      const sqM = Math.round(safeSqFt * 0.092903);
      return `${sqM.toLocaleString("en-US")} sq m (${safeSqFt.toLocaleString("en-US")} sq ft)`;
    },
    [areaUnit]
  );

  // UAE PDPL-compliant Event Tracking — gated behind explicit analytics consent & strips any PII keys
  const trackEvent = useCallback(
    (event: AnalyticsEventName, payload?: Record<string, string | number | boolean>) => {
      if (!cookieConsent.decided || !cookieConsent.analytics) return;
      try {
        const safePayload: Record<string, string | number | boolean> = {};
        if (payload) {
          for (const [k, v] of Object.entries(payload)) {
            if (PII_KEY_PATTERN.test(k)) continue;
            if (typeof v === "string") safePayload[k] = v.slice(0, 120);
            else if (typeof v === "number" && Number.isFinite(v)) safePayload[k] = v;
            else if (typeof v === "boolean") safePayload[k] = v;
          }
        }

        const record = {
          event,
          timestamp: new Date().toISOString(),
          path: typeof window !== "undefined" ? window.location.pathname : "",
          payload: safePayload,
        };

        if (typeof window !== "undefined") {
          const w = window as unknown as { dataLayer?: unknown[] };
          w.dataLayer = w.dataLayer || [];
          w.dataLayer.push(record);
        }
      } catch {
        // non-blocking
      }
    },
    [cookieConsent.analytics, cookieConsent.decided]
  );

  return (
    <PrefsContext.Provider
      value={{
        hydrated,
        currency,
        setCurrency,
        areaUnit,
        setAreaUnit,
        lang,
        setLang,
        formatPrice,
        formatArea,
        savedSlugs,
        toggleSaved,
        compareSlugs,
        toggleCompare,
        clearCompare,
        drawerOpen,
        setDrawerOpen,
        assistantOpen,
        setAssistantOpen,
        cookieConsent,
        updateCookieConsent,
        attribution,
        trackEvent,
        toastMessage,
        notify,
      }}
    >
      {children}
    </PrefsContext.Provider>
  );
}

export function usePrefs() {
  const ctx = useContext(PrefsContext);
  if (!ctx) {
    throw new Error("usePrefs must be used within PrefsProvider");
  }
  return ctx;
}
