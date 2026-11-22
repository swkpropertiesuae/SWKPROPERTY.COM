"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUp, Check } from "lucide-react";
import { SITE } from "@/lib/swk";
import { usePrefs } from "@/lib/prefs";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <div
        className={`inline-flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[#121212]/75 ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        <span className="inline-block h-[5px] w-[5px] bg-[#121212]" aria-hidden="true" />
        <span>{eyebrow}</span>
      </div>
      <h2 className="mt-4 text-[30px] sm:text-[42px] md:text-[50px] font-medium leading-[1.06] tracking-[-0.04em] text-[#121212]">
        {title}
      </h2>
      {lead ? (
        <p className="mt-4 text-[15px] sm:text-[17px] leading-[1.6] text-[#525252]">{lead}</p>
      ) : null}
    </div>
  );
}

const SOCIAL_LINKS: [string, string][] = [
  ["Instagram", SITE.socials.instagram],
  ["LinkedIn", SITE.socials.linkedin],
  ["Facebook", SITE.socials.facebook],
  ["YouTube", SITE.socials.youtube],
  ["TikTok", SITE.socials.tiktok],
  ["X", SITE.socials.x],
];

export function SiteFooter() {
  const { trackEvent, attribution } = usePrefs();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!email.trim()) {
      setErrorMsg("Enter your email address.");
      return;
    }
    if (!consent) {
      setErrorMsg("Tick the consent box to subscribe.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          context: "newsletter",
          email: email.trim(),
          marketingConsent: true,
          pageUrl: typeof window !== "undefined" ? window.location.href : SITE.url,
          attribution,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || `Could not subscribe. Email ${SITE.email} directly.`);
      } else {
        setSubscribed(true);
        setEmail("");
        setConsent(false);
        trackEvent("enquiry_success", { context: "newsletter" });
      }
    } catch {
      setErrorMsg(`Network error. Email ${SITE.email} or message us on WhatsApp.`);
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative w-full overflow-hidden bg-[#121212] text-white">
      <div className="mx-auto max-w-[1260px] px-4 pt-20 pb-8 sm:px-8">
        {/* Top 4-Column Avenlo Architecture */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Col 1: Elevated #1E1E1E Newsletter Card */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-white/[0.08] bg-[#1e1e1e] p-6 sm:p-7">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8b8b8b]">
                NEWSLETTER
              </p>
              <h3 className="mt-2.5 text-[20px] font-medium tracking-[-0.025em] text-white">
                Dubai launch notes, once a month.
              </h3>

              {subscribed ? (
                <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-[#51fec0]/30 bg-[#121212] px-4 py-3.5 text-sm text-[#51fec0]">
                  <Check className="h-4 w-4 shrink-0" />
                  <span>Subscribed. Look out for our next Dubai briefing.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="mt-5 space-y-3" noValidate>
                  <div>
                    <label htmlFor="footer-newsletter-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="footer-newsletter-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      autoComplete="email"
                      className="w-full rounded-lg border border-[#333333] bg-[#121212] px-4 py-3 text-sm text-white placeholder:text-[#8b8b8b] focus:border-white focus:outline-none"
                    />
                  </div>
                  <label className="flex cursor-pointer items-start gap-2.5 text-[11px] leading-snug text-[#a7a7a7]">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[#51fec0]"
                    />
                    <span>
                      Send me monthly Dubai market &amp; developer launch updates (UAE PDPL opt-in; unsubscribe anytime).
                    </span>
                  </label>
                  {errorMsg ? (
                    <p className="text-xs text-rose-400" role="alert">
                      {errorMsg}
                    </p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full cursor-pointer rounded-lg bg-white px-5 py-3 text-[12px] font-medium uppercase tracking-[0.16em] text-[#121212] transition-colors hover:bg-[#51fec0] disabled:opacity-50"
                  >
                    {submitting ? "Subscribing..." : "Subscribe"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Col 2: MAIN PAGES (2-col subgrid) */}
          <div className="lg:col-span-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8b8b8b]">
              MAIN PAGES
            </p>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-[14px] text-white/85">
              <Link href="/" className="hover:text-[#51fec0] transition-colors">Home</Link>
              <Link href="/agents" className="hover:text-[#51fec0] transition-colors">Advisors</Link>
              <Link href="/about" className="hover:text-[#51fec0] transition-colors">About</Link>
              <Link href="/insights" className="hover:text-[#51fec0] transition-colors">Insights</Link>
              <Link href="/properties" className="hover:text-[#51fec0] transition-colors">Properties</Link>
              <Link href="/guides" className="hover:text-[#51fec0] transition-colors">Guides</Link>
              <Link href="/off-plan" className="hover:text-[#51fec0] transition-colors">Off-Plan</Link>
              <Link href="/faq" className="hover:text-[#51fec0] transition-colors">FAQ</Link>
              <Link href="/developers" className="hover:text-[#51fec0] transition-colors">Developers</Link>
              <Link href="/contact" className="hover:text-[#51fec0] transition-colors">Contact</Link>
              <Link href="/communities" className="hover:text-[#51fec0] transition-colors">Communities</Link>
              <Link href="/privacy" className="hover:text-[#51fec0] transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-[#51fec0] transition-colors">Terms</Link>
              <Link href="/cookies" className="hover:text-[#51fec0] transition-colors">Cookies</Link>
            </div>
          </div>

          {/* Col 3: SERVICES & TOOLS */}
          <div className="lg:col-span-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8b8b8b]">
              SERVICES
            </p>
            <ul className="mt-4 space-y-2.5 text-[14px] text-white/85">
              <li><Link href="/services/off-plan-advisory" className="hover:text-[#51fec0] transition-colors">Off-Plan Advisory</Link></li>
              <li><Link href="/services/secondary-market" className="hover:text-[#51fec0] transition-colors">Buying &amp; Selling</Link></li>
              <li><Link href="/services/leasing-rental" className="hover:text-[#51fec0] transition-colors">Leasing &amp; Ejari</Link></li>
              <li><Link href="/services/investment-advisory" className="hover:text-[#51fec0] transition-colors">Investment Advisory</Link></li>
              <li><Link href="/services/property-management" className="hover:text-[#51fec0] transition-colors">Management</Link></li>
              <li><Link href="/calculators" className="hover:text-[#51fec0] transition-colors">Mortgage Calculator</Link></li>
              <li><Link href="/list-your-property" className="hover:text-[#51fec0] transition-colors">List Your Property</Link></li>
            </ul>
          </div>

          {/* Col 4: DUBAI OFFICE & RERA CREDENTIAL */}
          <div className="lg:col-span-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8b8b8b]">
              OFFICE
            </p>
            <div className="mt-4 space-y-2.5 text-[14px] text-white/85 leading-relaxed">
              <p>{SITE.address.full}</p>
              <p>
                <a href={`mailto:${SITE.email}`} className="hover:text-[#51fec0] transition-colors">
                  {SITE.email}
                </a>
              </p>
              <p className="flex flex-wrap items-center gap-2">
                <a
                  href={`tel:${SITE.phoneRaw}`}
                  onClick={() => trackEvent("phone_click", { location: "footer" })}
                  className="hover:text-[#51fec0] transition-colors"
                >
                  {SITE.phone}
                </a>
                <span className="text-white/30">·</span>
                <a
                  href={SITE.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("whatsapp_click", { location: "footer" })}
                  className="inline-flex items-center gap-1 text-[#51fec0] hover:underline"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5" />
                  <span>WhatsApp</span>
                </a>
              </p>
              <p className="text-xs text-[#8b8b8b]">{SITE.hours.full}</p>
            </div>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#1e1e1e] px-3.5 py-1.5 text-[11px] text-white/85">
              <span className="h-1.5 w-1.5 rounded-full bg-[#51fec0]" aria-hidden="true" />
              <span>
                RERA ORN <strong>{SITE.reraOrn}</strong>
                {SITE.tradeLicense ? ` · Licence ${SITE.tradeLicense}` : ""} ·{" "}
                <a
                  href="https://dubailand.gov.ae"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[#51fec0]"
                >
                  dubailand.gov.ae
                </a>
              </span>
            </div>
          </div>
        </div>

        {/* Mandatory RERA, AED & Trademark Disclosures */}
        <div className="mt-14 border-t border-white/[0.08] pt-6 text-[11px] leading-relaxed text-[#8b8b8b] space-y-1.5">
          <p>
            <strong className="text-white/75 font-medium">Regulatory &amp; Pricing Notice:</strong> Primary prices are quoted in UAE Dirhams (AED). Foreign currency conversions and calculator outputs are approximate and for general information only—not financial, tax, or legal advice. Off-plan visuals include developer architectural renders; floor plans, service charges, payment plans, and handover timelines are governed by the official Sales &amp; Purchase Agreement (SPA) and Dubai Land Department (DLD) registration.
          </p>
          <p>
            <strong className="text-white/75 font-medium">Developer Trademarks:</strong> Developer names, logos, and project imagery remain the property of their respective developers and are used solely to identify UAE developments. {SITE.legalName} is an independent RERA-licensed brokerage (ORN {SITE.reraOrn}).
          </p>
        </div>
      </div>

      {/* Monumental Clipped SWK Wordmark Band + 3 Floating Pills (Avenlo Signature) */}
      <div className="relative mx-auto max-w-[1260px] overflow-hidden px-4 pt-8 pb-24 sm:px-8 sm:pt-12 sm:pb-24">
        <div
          aria-hidden="true"
          className="pointer-events-none select-none text-center text-[24vw] xl:text-[310px] font-medium leading-[0.8] tracking-[-0.055em] text-white/[0.08]"
        >
          SWK
        </div>

        <div className="relative z-10 -mt-10 sm:-mt-16 flex flex-col items-center justify-between gap-3 sm:flex-row">
          {/* Pill 1: Socials */}
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-[#1e1e1e]/95 px-4 py-2 text-xs text-white/80 backdrop-blur-md">
            {SOCIAL_LINKS.filter(([, href]) => href).map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer me"
                className="hover:text-[#51fec0] transition-colors"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Pill 2: Copyright */}
          <div className="inline-flex items-center rounded-full border border-white/10 bg-[#1e1e1e]/95 px-4 py-2 text-xs text-white/70 backdrop-blur-md">
            © {new Date().getFullYear()} {SITE.legalName}. All rights reserved. RERA ORN {SITE.reraOrn}.
          </div>

          {/* Pill 3: Back to Top */}
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-[#1e1e1e]/95 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-white/85 backdrop-blur-md transition-colors hover:bg-white hover:text-[#121212]"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
