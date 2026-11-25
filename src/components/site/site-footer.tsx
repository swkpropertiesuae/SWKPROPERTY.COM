"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUp, Check, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";
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

const FOOTER_TC_CLAUSES = [
  {
    title: "1. Developer-Dependent Pricing & Availability",
    text: "All properties, starting prices (including Hot Projects such as Azizi Venice Studio, Binghatti Studio, and Tarrad Residences), payment plans, unit sizes, incentives, and handover dates depend strictly on the respective developer, owner, and current prevailing market conditions and are subject to change or withdrawal without prior notice. Website content does not constitute a binding offer.",
  },
  {
    title: "2. Off-Plan Fees, RERA Escrow & Developers Admin Fees",
    text: "Primary off-plan purchases in Dubai carry no mortgage registration fees, no DLD Registration Trustee fees, and typically 0% buyer agency commission. Buyers pay applicable 4% DLD Oqood registration fees plus approximate Developers Admin fees of AED 4,000–5,500 (varying by developer) as governed solely by the official SPA and Dubai Law No. 8 of 2007 escrow rules.",
  },
  {
    title: "3. Calculator, Currency & Advisory Disclaimer",
    text: "All UAE mortgage repayments, DLD upfront cost outputs, rental yields, and foreign currency conversions are indicative mathematical estimates in UAE Dirhams (AED) for general information only—not financial, mortgage, investment, Golden Visa, or tax advice. Bank financing is subject to UAE Central Bank LTV/DBR guidelines and independent lender underwriting.",
  },
  {
    title: "4. Trademarks, AML/PDPL Compliance & Governing Law",
    text: "Developer names, logos, and architectural renders remain the intellectual property of their respective owners. SWK Properties LLC (RERA ORN 51517) operates under UAE AML/CTF Law (Federal Decree-Law No. 20 of 2018), UAE PDPL (Federal Decree-Law No. 45 of 2021), and UAE Cybercrime Law (Federal Decree-Law No. 34 of 2021). Governed exclusively by UAE federal law and the laws of the Emirate of Dubai (Dubai Courts).",
  },
];

export function SiteFooter() {
  const { trackEvent, attribution } = usePrefs();
  const honeypotId = useId();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [tcExpanded, setTcExpanded] = useState(false);
  const formLoadedAtRef = useRef<number>(0);

  useEffect(() => {
    formLoadedAtRef.current = Date.now();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const trimmedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmedEmail)) {
      setErrorMsg("Enter a valid email address.");
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
          email: trimmedEmail,
          marketingConsent: true,
          companyWebsite,
          formLoadedAt: formLoadedAtRef.current,
          pageUrl: typeof window !== "undefined" ? window.location.href : SITE.url,
          attribution,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
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
      <div className="mx-auto max-w-[1260px] px-4 pt-20 pb-24 sm:px-8">
        {/* Top Brand Row */}
        <div className="mb-14 flex flex-wrap items-center justify-between gap-6 border-b border-white/[0.08] pb-10">
          <Link href="/" className="group inline-flex items-center gap-4" aria-label="SWK Properties Home">
            <img
              src="/brand/swk-icon-192.webp?v=4"
              width={64}
              height={64}
              alt="SWK Properties Emblem"
              loading="lazy"
              className="h-14 w-14 sm:h-16 sm:w-16 object-contain drop-shadow-[0_6px_18px_rgba(212,175,55,0.45)] transition-transform duration-300 group-hover:scale-[1.06]"
            />
            <img
              src="/brand/swk-logo-dark.webp?v=4"
              width={172}
              height={78}
              alt="SWK Properties"
              loading="lazy"
              className="h-12 sm:h-14 w-auto object-contain drop-shadow-[0_4px_16px_rgba(212,175,55,0.28)] transition-transform duration-300 group-hover:scale-[1.02] group-hover:brightness-105"
            />
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#1e1e1e] px-4 py-2 text-xs text-white/85">
            <span className="h-1.5 w-1.5 rounded-full bg-[#51fec0]" aria-hidden="true" />
            <span>
              RERA ORN <strong>{SITE.reraOrn}</strong> · Sheikh Zayed Road, Dubai
            </span>
          </div>
        </div>

        {/* Main 4-Column Architecture */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Col 1: Newsletter Card */}
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
                  {/* Off-screen honeypot */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
                  >
                    <label htmlFor={honeypotId}>Company Website</label>
                    <input
                      id={honeypotId}
                      type="text"
                      name="companyWebsite"
                      tabIndex={-1}
                      autoComplete="off"
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="footer-newsletter-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="footer-newsletter-email"
                      type="email"
                      maxLength={200}
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
                    className="w-full cursor-pointer rounded-lg bg-white px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#121212] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#51fec0] hover:shadow-[0_12px_28px_rgba(81,254,192,0.32)] active:scale-[0.98] disabled:opacity-50"
                  >
                    {submitting ? "Subscribing..." : "Subscribe"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Col 2: MAIN PAGES */}
          <div className="lg:col-span-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8b8b8b]">
              MAIN PAGES
            </p>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-[14px] text-white/85">
              <Link href="/" className="hover:text-[#51fec0] transition-colors">Home</Link>
              <Link href="/agents" className="hover:text-[#51fec0] transition-colors">Our Team</Link>
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
              <Link href="/terms" className="font-medium text-[#51fec0] hover:underline transition-colors">Terms &amp; Conditions</Link>
              <Link href="/cookies" className="hover:text-[#51fec0] transition-colors">Cookies</Link>
            </div>
          </div>

          {/* Col 3: SERVICES */}
          <div className="lg:col-span-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8b8b8b]">
              SERVICES
            </p>
            <ul className="mt-4 space-y-2.5 text-[14px] text-white/85">
              <li><Link href="/services/off-plan-advisory" className="hover:text-[#51fec0] transition-colors">Off-Plan Advisory</Link></li>
              <li><Link href="/services/secondary-market" className="hover:text-[#51fec0] transition-colors">Buying &amp; Selling</Link></li>
              <li><Link href="/services/leasing-rental" className="hover:text-[#51fec0] transition-colors">Leasing &amp; Ejari</Link></li>
              <li><Link href="/properties?type=Office" className="hover:text-[#51fec0] transition-colors">Commercial Spaces</Link></li>
              <li><Link href="/services/investment-advisory" className="hover:text-[#51fec0] transition-colors">Investment Advisory</Link></li>
              <li><Link href="/calculators" className="hover:text-[#51fec0] transition-colors">Mortgage Calculator</Link></li>
              <li><Link href="/list-your-property" className="hover:text-[#51fec0] transition-colors">List Your Property</Link></li>
            </ul>
          </div>

          {/* Col 4: OFFICE & CONTACTS */}
          <div className="lg:col-span-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8b8b8b]">
              OFFICE &amp; DESKS
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
              <p className="text-xs text-white/70">
                UK Advisory (Rex):{" "}
                <a
                  href={`tel:${SITE.ukAdvisoryPhoneRaw}`}
                  className="text-white/90 hover:text-[#51fec0] transition-colors"
                >
                  {SITE.ukAdvisoryPhone}
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

        {/* Prominently Visible Legal Terms & Conditions Box at Footer */}
        <section
          aria-label="Terms and Conditions and Mandatory Regulatory Disclosures"
          className="mt-14 rounded-2xl border border-white/[0.12] bg-[#191919] p-5 sm:p-7"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-4 w-4 shrink-0 text-[#51fec0]" aria-hidden="true" />
              <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                TERMS &amp; CONDITIONS · DEVELOPER PRICING &amp; MARKET DISCLOSURES
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setTcExpanded((v) => !v)}
                aria-expanded={tcExpanded}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-[11px] font-medium text-white/90 hover:border-[#51fec0] hover:text-[#51fec0]"
              >
                <span>{tcExpanded ? "Collapse Legal Clauses" : "View All Clauses"}</span>
                {tcExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
              <Link
                href="/terms"
                className="inline-flex items-center rounded-full bg-[#51fec0] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0a1624] hover:bg-white transition-colors"
              >
                Full Terms &amp; Conditions →
              </Link>
            </div>
          </div>

          <p className="mt-4 text-[12px] leading-relaxed text-white/80">
            <strong className="text-white">Mandatory Pricing &amp; Availability Terms:</strong> All properties, starting prices, unit availability, floor plans, incentives, and payment schedules listed on{" "}
            <strong className="text-white">{SITE.domain}</strong> depend strictly on the respective developer, property owner, and prevailing current market conditions, and are subject to change or withdrawal without prior notice. Nothing on this website constitutes a binding legal offer or financial/tax/mortgage advice. On primary Dubai off-plan purchases, there are{" "}
            <strong className="text-[#51fec0]">no mortgage registration fees</strong> and{" "}
            <strong className="text-[#51fec0]">no trustee fees</strong>; approximate{" "}
            <strong className="text-white">Developers Admin fees (AED 4,000–5,500)</strong> and 4% DLD/Oqood fees apply as confirmed in the official SPA.
          </p>

          <div
            className={`mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 border-t border-white/[0.08] pt-4 text-[11.5px] leading-relaxed text-[#a7a7a7] ${
              tcExpanded ? "grid" : "hidden sm:grid"
            }`}
          >
            {FOOTER_TC_CLAUSES.map((clause) => (
              <div key={clause.title} className="space-y-1">
                <p className="font-semibold text-white/90">{clause.title}</p>
                <p>{clause.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Utility Pill Row */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/[0.08] pt-8 sm:flex-row">
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

          {/* Pill 2: Copyright + Direct Legal Links */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/10 bg-[#1e1e1e]/95 px-4 py-2 text-xs text-white/75 backdrop-blur-md">
            <span>
              © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {SITE.legalName}. RERA ORN {SITE.reraOrn}.
            </span>
            <span className="text-white/30">·</span>
            <Link href="/terms" className="text-[#51fec0] hover:underline">
              Terms &amp; Conditions
            </Link>
            <span className="text-white/30">·</span>
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
          </div>

          {/* Pill 3: Back to Top */}
          <button
            type="button"
            onClick={scrollToTop}
            className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-[#1e1e1e]/95 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-white/90 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-[#51fec0] hover:bg-[#51fec0] hover:text-[#0a1624] hover:shadow-[0_10px_24px_rgba(81,254,192,0.3)]"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
