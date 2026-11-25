"use client";

import { useEffect } from "react";
import { usePrefs } from "@/lib/prefs";

const RAW_GTM = process.env.NEXT_PUBLIC_GTM_ID || "GTM-NMJ9MVNG";
const RAW_GA = process.env.NEXT_PUBLIC_GA_ID || "G-1FXMV3FTYL";

export const GTM_ID = /^GTM-[A-Z0-9]{4,16}$/.test(RAW_GTM) ? RAW_GTM : "";
export const GA_ID = /^G-[A-Z0-9]{4,16}$/.test(RAW_GA) ? RAW_GA : "";

type Gtag = (...args: unknown[]) => void;

/**
 * Google Tag Manager & direct GA4 (gtag.js) with UAE PDPL / Consent Mode v2.
 * All non-essential storage defaults to "denied" until the visitor grants consent.
 */
export function Analytics() {
  const { cookieConsent } = usePrefs();

  useEffect(() => {
    if ((!GTM_ID && !GA_ID) || !cookieConsent.decided) return;
    const gtag = (window as unknown as { gtag?: Gtag }).gtag;
    const state = (on: boolean) => (on ? "granted" : "denied");
    gtag?.("consent", "update", {
      analytics_storage: state(cookieConsent.analytics),
      ad_storage: state(cookieConsent.analytics),
      ad_user_data: state(cookieConsent.analytics),
      ad_personalization: state(cookieConsent.analytics),
      functionality_storage: state(cookieConsent.preferences),
      personalization_storage: state(cookieConsent.preferences),
    });
  }, [cookieConsent]);

  if (!GTM_ID) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(GTM_ID)}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}

/**
 * Inline Consent Mode v2 + GA4 config; runs in <head> before GTM/gtag loads.
 * Strictly defaults analytics_storage, ad_storage & functionality_storage to 'denied' (UAE PDPL).
 */
export const CONSENT_DEFAULT_SCRIPT = [
  "window.dataLayer = window.dataLayer || [];",
  "function gtag(){dataLayer.push(arguments);}",
  "window.gtag = gtag;",
  "gtag('js', new Date());",
  "gtag('consent', 'default', {",
  "  ad_storage: 'denied',",
  "  ad_user_data: 'denied',",
  "  ad_personalization: 'denied',",
  "  analytics_storage: 'denied',",
  "  functionality_storage: 'denied',",
  "  personalization_storage: 'denied',",
  "  security_storage: 'granted',",
  "  wait_for_update: 500",
  "});",
  "gtag('set', 'ads_data_redaction', true);",
  ...(GA_ID ? [`gtag('config', '${GA_ID}', { anonymize_ip: true });`] : []),
].join(" ");
