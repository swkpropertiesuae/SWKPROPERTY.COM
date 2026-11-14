import type { Metadata } from "next"
import { ShieldCheck } from "lucide-react"
import { SITE } from "@/lib/swk"
import { buildMetadata, breadcrumbSchema } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"

export const metadata: Metadata = buildMetadata({
  title: "Terms of Use & Regulatory Disclaimers — SWK Properties Dubai",
  description:
    "Website Terms of Use, RERA ORN 51517 brokerage disclosures, off-plan render notices, currency conversion disclaimers, and intellectual property terms for SWK Properties.",
  path: "/terms",
})

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#17130e]">
      <JsonLd
        id="ld-terms-breadcrumb"
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Terms of Use", path: "/terms" },
        ])}
      />

      <div className="mx-auto max-w-4xl px-4 py-16 space-y-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#94652c]/35 bg-[#f6ead7] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#94652c]">
            <ShieldCheck className="h-3.5 w-3.5" /> RERA ORN {SITE.orn} · Website Terms & Disclaimers
          </span>
          <h1 className="mt-4 font-serif text-3xl md:text-5xl font-semibold text-[#17130e]">
            Terms of Use & Regulatory Disclosures
          </h1>
          <p className="mt-2 text-xs text-[#786e60]">
            Effective Date: October 2026 · {SITE.legalName}, {SITE.address.full}
          </p>
        </div>

        <section className="rounded-3xl border border-[#e6dfd2] bg-white p-6 md:p-8 space-y-6 text-sm text-[#4a4237] leading-relaxed">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#17130e]">
              1. Information Purpose & No Financial, Legal, or Immigration Advice
            </h2>
            <p className="mt-2">
              All property listings, developer profiles, community guides, market briefings, and calculator outputs on `{SITE.domain}` are provided by {SITE.legalName} (RERA ORN {SITE.orn}) for general informational purposes only. Nothing on this website constitutes a binding offer, financial or investment advice, mortgage pre-approval, tax counsel, or UAE residency/Golden Visa guarantee.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#17130e]">
              2. Off-Plan Renders, Handover Dates & Indicative Pricing
            </h2>
            <p className="mt-2">
              Images shown on off-plan project pages include artist concepts and architectural renders supplied for illustrative purposes. Final unit dimensions, views, finishes, payment milestones, escrow bank details, and expected handover windows are governed solely by the Sale and Purchase Agreement (SPA) registered via Oqood with the Dubai Land Department (DLD).
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#17130e]">
              3. Currency & Area Unit Conversions
            </h2>
            <p className="mt-2">
              All property transactions in Dubai are denominated in United Arab Emirates Dirhams (`AED`). Foreign currency figures (`USD`, `EUR`, `GBP`, `INR`, `RUB`) and square-metre (`sq m`) conversions displayed via our header utility bar are approximate reference calculations only.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#17130e]">
              4. Developer Names & Trademarks
            </h2>
            <p className="mt-2">
              Third-party developer names, logos, and project titles (including Emaar, DAMAC, Nakheel, Meraas, Sobha, Binghatti, Aldar, Ellington, Omniyat, and others) remain the intellectual property of their respective owners and are referenced strictly to identify projects across the UAE market without implying exclusive developer agency unless explicitly stated in writing.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#17130e]">5. Brokerage Commission</h2>
            <p className="mt-2">
              Commission is agreed in writing before any service under the applicable RERA form (Form A for sellers and landlords, Form B
              for buyers and tenants). On developer off-plan sales the developer normally pays our commission. DLD, Ejari, trustee and
              mortgage fees are charged by the relevant authority or provider and are separate from our fees.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#17130e]">6. Listing Accuracy</h2>
            <p className="mt-2">
              Listings are advertised only under a valid DLD Trakheesi permit. Availability, prices and specifications can change without
              notice and are confirmed in writing before any reservation. Report an inaccurate listing to {SITE.email}.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#17130e]">7. Intellectual Property & Acceptable Use</h2>
            <p className="mt-2">
              The SWK Properties name, emblem, logos and original website content belong to {SITE.legalName}. Do not copy, scrape or
              republish them without written permission. Third-party links are provided for convenience; we are not responsible for their
              content.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#17130e]">8. Limitation of Liability</h2>
            <p className="mt-2">
              To the extent permitted by UAE law, SWK Properties is not liable for losses arising from reliance on general website
              information, calculators or third-party data. Nothing here limits liability that cannot be excluded by law.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#17130e]">
              9. Governing Law & Jurisdiction
            </h2>
            <p className="mt-2">
              These Terms of Use are governed by the federal laws of the United Arab Emirates and the laws of the Emirate of Dubai. Any dispute arising out of the use of this website shall be subject to the exclusive jurisdiction of the competent courts of Dubai, UAE.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
