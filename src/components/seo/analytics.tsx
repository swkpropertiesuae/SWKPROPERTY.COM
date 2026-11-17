"use client"

import { useEffect } from "react"
import { usePrefs } from "@/lib/prefs"

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-NMJ9MVNG"
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-1FXMV3FTYL"

type Gtag = (...args: unknown[]) => void

/**
 * Google Tag Manager & direct GA4 (gtag.js) with Consent Mode v2.
 * Consent defaults to "denied" (set in the root layout) and is updated here from the visitor's
 * cookie choice. Renders nothing when neither NEXT_PUBLIC_GTM_ID nor NEXT_PUBLIC_GA_ID is set.
 */
export function Analytics() {
  const { cookieConsent } = usePrefs()

  useEffect(() => {
    if ((!GTM_ID && !GA_ID) || !cookieConsent.decided) return
    const gtag = (window as unknown as { gtag?: Gtag }).gtag
    const state = (on: boolean) => (on ? "granted" : "denied")
    gtag?.("consent", "update", {
      analytics_storage: state(cookieConsent.analytics),
      ad_storage: state(cookieConsent.analytics),
      ad_user_data: state(cookieConsent.analytics),
      ad_personalization: state(cookieConsent.analytics),
      functionality_storage: state(cookieConsent.preferences),
      personalization_storage: state(cookieConsent.preferences),
    })
  }, [cookieConsent])

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  )
}

/** Inline Consent Mode v2 + GA4 config; runs in <head> before GTM/gtag loads. */
export const CONSENT_DEFAULT_SCRIPT = `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} window.gtag = gtag; gtag('js', new Date()); gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted', functionality_storage: 'granted', personalization_storage: 'denied', security_storage: 'granted', wait_for_update: 500 }); gtag('set', 'ads_data_redaction', true); gtag('config', 'G-1FXMV3FTYL');`
