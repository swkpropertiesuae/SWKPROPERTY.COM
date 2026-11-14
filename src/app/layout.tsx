import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond, Raleway } from "next/font/google";
import "./globals.css";
import { PrefsProvider } from "@/lib/prefs";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { FloatingChrome } from "@/components/site/floating-chrome";
import Script from "next/script";
import { JsonLd } from "@/components/seo/json-ld";
import { Analytics, CONSENT_DEFAULT_SCRIPT } from "@/components/seo/analytics";
import { KEYWORDS, OG_DEFAULT, organizationLd, websiteLd } from "@/lib/seo";
import { SITE } from "@/lib/swk";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const serif = Cormorant_Garamond({
  variable: "--font-serif-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});
const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#0f2244",
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
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } : {}),
      ...(process.env.NEXT_PUBLIC_YANDEX_VERIFICATION ? { "yandex-verification": process.env.NEXT_PUBLIC_YANDEX_VERIFICATION } : {}),
      ...(process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION ? { "facebook-domain-verification": process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION } : {}),
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48 64x64 128x128 256x256" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${serif.variable} ${raleway.variable} min-h-screen overflow-x-clip bg-[#faf7f2] text-[#0f2244] antialiased selection:bg-[#0f2244] selection:text-white`}
      >
        {process.env.NEXT_PUBLIC_GTM_ID ? (
          <Script id="consent-default" strategy="beforeInteractive">
            {CONSENT_DEFAULT_SCRIPT}
          </Script>
        ) : null}
        <JsonLd data={[organizationLd, websiteLd]} />
        <PrefsProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-[#0f2244] focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:text-white"
          >
            Skip to main content
          </a>
          <SiteHeader />
          <main id="main-content" className="min-h-[70vh] pb-20">
            {children}
          </main>
          <SiteFooter />
          <FloatingChrome />
          <Analytics />
        </PrefsProvider>
      </body>
    </html>
  );
}
