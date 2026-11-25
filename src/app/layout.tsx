import type { Metadata, Viewport } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PrefsProvider } from "@/lib/prefs";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { FloatingChrome } from "@/components/site/floating-chrome";
import { TrendingProjectPopups } from "@/components/site/trending-project-popups";
import { AvenloPreloader } from "@/components/avenlo/preloader";
import { ShaderBackground } from "@/components/ui/shader-background";
import { JsonLd } from "@/components/seo/json-ld";
import { Analytics, CONSENT_DEFAULT_SCRIPT, GA_ID, GTM_ID } from "@/components/seo/analytics";
import { KEYWORDS, OG_DEFAULT, organizationLd, websiteLd } from "@/lib/seo";
import { SITE } from "@/lib/swk";

const switzer = localFont({
  variable: "--font-switzer",
  display: "swap",
  src: [
    { path: "../../public/fonts/Switzer-300-normal.woff2", weight: "300", style: "normal" },
    { path: "../../public/fonts/Switzer-300-italic.woff2", weight: "300", style: "italic" },
    { path: "../../public/fonts/Switzer-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Switzer-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../../public/fonts/Switzer-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/Switzer-500-italic.woff2", weight: "500", style: "italic" },
    { path: "../../public/fonts/Switzer-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/Switzer-700-normal.woff2", weight: "700", style: "normal" },
  ],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "SWK Properties | RERA-Licensed Dubai Real Estate Broker",
    template: "%s | SWK Properties",
  },
  description:
    "SWK Properties LLC (RERA ORN 51517): Dubai real estate brokerage on Sheikh Zayed Road for off-plan launches, ready homes, leasing and property management.",
  keywords: KEYWORDS.home,
  alternates: {
    canonical: SITE.url,
    languages: { "en-AE": SITE.url, "x-default": SITE.url },
  },
  applicationName: SITE.name,
  authors: [{ name: SITE.legalName, url: SITE.url }],
  creator: SITE.legalName,
  publisher: SITE.legalName,
  category: "Real Estate",
  formatDetection: { telephone: true, email: true, address: true },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
        ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
        : {}),
      ...(process.env.NEXT_PUBLIC_YANDEX_VERIFICATION
        ? { "yandex-verification": process.env.NEXT_PUBLIC_YANDEX_VERIFICATION }
        : {}),
      ...(process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION
        ? { "facebook-domain-verification": process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION }
        : {}),
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=3", sizes: "16x16 24x24 32x32 48x48 64x64 128x128 256x256" },
      { url: "/favicon-16.png?v=3", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png?v=3", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48.png?v=3", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96.png?v=3", sizes: "96x96", type: "image/png" },
      { url: "/favicon-192.png?v=3", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512.png?v=3", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png?v=3", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico?v=3"],
  },
  openGraph: {
    type: "website",
    locale: "en_AE",
    url: SITE.url,
    siteName: SITE.name,
    title: "SWK Properties | RERA-Licensed Dubai Real Estate Broker",
    description:
      "Verified off-plan developer launches, DLD Trakheesi-permitted secondary properties, and Ejari leasing from Sheikh Zayed Road, Dubai.",
    images: [
      {
        url: `${SITE.url}${OG_DEFAULT}`,
        width: 1200,
        height: 630,
        alt: "SWK Properties — RERA-licensed Dubai real estate brokerage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SWK Properties | RERA-Licensed Dubai Real Estate Broker",
    description:
      "Off-plan launches, secondary market sales, and leasing across Downtown Dubai, Palm Jumeirah, Dubai Marina & Dubai Hills.",
    images: [`${SITE.url}${OG_DEFAULT}`],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="overflow-x-clip">
      <head>
        <link rel="alternate" type="text/plain" title="LLMs.txt" href="/llms.txt" />
        <link rel="alternate" type="text/plain" title="LLMs Full Corpus" href="/llms-full.txt" />
        <meta name="geo.region" content="AE-DU" />
        <meta name="geo.placename" content="Dubai, United Arab Emirates" />
        <meta name="geo.position" content="25.213925;55.277978" />
        <meta name="ICBM" content="25.213925, 55.277978" />
      </head>
      <body
        className={`${switzer.variable} ${inter.variable} ${geistMono.variable} min-h-screen overflow-x-clip bg-transparent text-[#121212] antialiased selection:bg-[#121212] selection:text-[#51fec0]`}
      >
        <Script
          id="swk-consent-default"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SCRIPT }}
        />
        {GTM_ID ? (
          <Script
            id="swk-gtm"
            src={`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`}
            strategy="afterInteractive"
          />
        ) : null}
        {GA_ID ? (
          <Script
            id="swk-ga4"
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`}
            strategy="afterInteractive"
          />
        ) : null}
        {/* Global 21st.dev Mesh Drift WebGL Wave Canvas — Active Across Every Route */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 h-full w-full overflow-hidden"
        >
          <ShaderBackground className="h-full w-full" />
        </div>

        <JsonLd data={[organizationLd, websiteLd]} />
        <PrefsProvider>
          <div className="relative z-10 flex min-h-screen flex-col">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[130] focus:rounded-full focus:bg-[#121212] focus:px-4 focus:py-2 focus:text-xs focus:font-medium focus:text-white"
            >
              Skip to main content
            </a>
            <AvenloPreloader />
            <SiteHeader />
            <main id="main-content" className="min-h-[70vh] flex-1">
              {children}
            </main>
            <SiteFooter />
            <FloatingChrome />
            <TrendingProjectPopups />
            <Analytics />
          </div>
        </PrefsProvider>
      </body>
    </html>
  );
}
