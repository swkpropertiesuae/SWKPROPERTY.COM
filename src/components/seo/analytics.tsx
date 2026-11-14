"use client"

import Script from "next/script"
import { useEffect } from "react"
import { usePrefs } from "@/lib/prefs"

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

type Gtag = (...args: unknown[]) => void

/**
 * Google Tag Manager with Consent Mode v2. Consent defaults to "denied" (set in the root layout)
 * and is updated here from the visitor's cookie choice. GA4, Google Ads, Meta Pixel, TikTok,
 * LinkedIn Insight, Snap and Microsoft Clarity/UET are configured as tags inside the GTM container.
 * Renders nothing when NEXT_PUBLIC_GTM_ID is not set.
 */
export function Analytics() {
  const { cookieConsent } = usePrefs()

  useEffect(() => {
    if (!GTM_ID || !cookieConsent.decided) return
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

  if (!GTM_ID) return null
  return (
    <>
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  )
}

/** Inline Consent Mode v2 defaults; must run before GTM loads. */
export const CONSENT_DEFAULT_SCRIPT = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',personalization_storage:'denied',security_storage:'granted',wait_for_update:500});gtag('set','ads_data_redaction',true);`
