import type { Metadata } from "next";
import { SITE } from "@/lib/swk";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { AvenloPageHeader } from "@/components/avenlo/page-header";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Use & Regulatory Disclosures — SWK Properties",
  description:
    "Website Terms of Use, RERA ORN 51517 brokerage disclosures, off-plan render notices, AED pricing disclaimers, and governing law for SWK Properties Dubai.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="bg-white">
      <JsonLd
        id="ld-terms-breadcrumb"
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Terms of Use", path: "/terms" },
        ])}
      />

      <AvenloPageHeader
        eyebrow={`RERA ORN ${SITE.orn} · REGULATORY DISCLOSURES`}
        title="Terms of Use"
        italic="& Disclosures"
        compact
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Terms of Use" },
        ]}
        meta={
          <span>
            Effective Date: November 2026 · {SITE.legalName}, {SITE.address.full}
          </span>
        }
      />

      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-8 space-y-10 text-[15px] leading-[1.75] text-[#4a4a4a]">
        {[
          {
            h: "1. Informational Purpose & No Financial, Legal, or Immigration Advice",
            p: `All property listings, developer profiles, community guides, market briefings, and calculator outputs on ${SITE.domain} are provided by ${SITE.legalName} (RERA ORN ${SITE.orn}) for general informational purposes only. Nothing on this website constitutes a binding offer, financial or investment advice, mortgage pre-approval, tax counsel, or UAE residency/Golden Visa guarantee.`,
          },
          {
            h: "2. Off-Plan Renders, Handover Dates & Indicative Pricing",
            p: "Images shown on off-plan project pages include artist concepts and developer architectural renders supplied for illustrative purposes. Final unit dimensions, views, finishes, payment milestones, escrow bank details, and expected handover windows are governed solely by the official Sale and Purchase Agreement (SPA) registered via Oqood with the Dubai Land Department (DLD).",
          },
          {
            h: "3. Currency & Area Unit Conversions",
            p: "All property transactions in Dubai are denominated in United Arab Emirates Dirhams (AED). Foreign currency figures (USD, EUR, GBP, INR, RUB) and square-metre (sq m) conversions displayed through the site controls are approximate reference calculations only.",
          },
          {
            h: "4. Developer Names & Trademarks",
            p: "Third-party developer names, logos, and project titles (including Emaar, DAMAC, Nakheel, Meraas, Sobha, Binghatti, Aldar, Ellington, Omniyat, Azizi, Arada, and others) remain the intellectual property of their respective owners and are used solely to identify UAE developments without implying exclusive agency unless stated in writing.",
          },
          {
            h: "5. Brokerage Commission",
            p: "Commission is agreed in writing before any service under the applicable RERA form (Form A for sellers and landlords, Form B for buyers and tenants). On primary off-plan launches, the developer normally pays our commission. DLD, Ejari, trustee, and bank fees are charged by the relevant authority or lender and are separate from brokerage fees.",
          },
          {
            h: "6. Listing Accuracy",
            p: `Secondary and rental listings are advertised only under a valid DLD Trakheesi permit. Availability, prices, and specifications can change without notice and are confirmed in writing before any reservation. Report any inaccuracy to ${SITE.email}.`,
          },
          {
            h: "7. Intellectual Property & Limitation of Liability",
            p: `The SWK Properties name, crest, logos, and original content belong to ${SITE.legalName}. To the extent permitted by UAE law, SWK Properties is not liable for losses arising from reliance on general website information, calculators, or third-party links.`,
          },
          {
            h: "8. Governing Law & Jurisdiction",
            p: "These Terms of Use are governed by the federal laws of the United Arab Emirates and the laws of the Emirate of Dubai. Any dispute arising out of the use of this website is subject to the exclusive jurisdiction of the competent courts of Dubai, UAE.",
          },
        ].map((item) => (
          <section key={item.h}>
            <h2 className="text-2xl font-medium tracking-[-0.03em] text-[#121212]">{item.h}</h2>
            <p className="mt-3">{item.p}</p>
          </section>
        ))}
      </article>
    </div>
  );
}
