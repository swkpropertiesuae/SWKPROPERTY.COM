import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/swk";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { AvenloPageHeader } from "@/components/avenlo/page-header";

export const metadata: Metadata = buildMetadata({
  title: "Terms & Conditions and Regulatory Disclosures — SWK Properties",
  description:
    "Comprehensive Terms & Conditions of SWK Properties LLC (RERA ORN 51517): developer-dependent property pricing and availability, off-plan escrow and fee rules, UAE mortgage calculator disclaimers, AML/PDPL compliance, and Dubai governing law.",
  path: "/terms",
});

const TERMS_SECTIONS = [
  {
    h: "1. Scope, Acceptance & Legal Capacity",
    p: `These Terms & Conditions ("Terms") govern your access to and use of ${SITE.url} and any real estate information, calculators, brochures, or advisory communications provided by ${SITE.legalName} ("SWK Properties", "we", "us"), a real estate brokerage registered in Dubai, United Arab Emirates under Real Estate Regulatory Agency (RERA) Office Registration Number (ORN) ${SITE.orn}, headquartered at ${SITE.address.full}. By accessing this website, submitting an enquiry, or relying on any content herein, you confirm that you are at least 18 years of age, possess full legal capacity to enter into binding obligations, and agree unconditionally to these Terms.`,
  },
  {
    h: "2. All Properties, Availability & Developer-Dependent Pricing (Current Market Conditions)",
    p: "ALL PROPERTIES, UNITS, FLOOR PLANS, PAYMENT PLANS, PROMOTIONAL OFFERS, LAUNCH ALLOCATIONS, AND PRICES DISPLAYED ON THIS WEBSITE DEPEND STRICTLY ON THE RESPECTIVE MASTER DEVELOPER, PROPERTY OWNER, AND PREVAILING REAL-TIME MARKET CONDITIONS. Developer price lists, unit inventory, bedroom sizes, handover schedules, post-handover terms, and incentives are dynamic and may be revised, repriced, reallocated, suspended, or sold out at any moment without prior notice. Featured starting prices (including Hot Projects such as Azizi Venice Studios, Binghatti Studios, Tarrad Residences, and all other UAE projects) are indicative reference figures only as of publication and do NOT constitute a binding legal offer, reservation, price guarantee, or contract. Final pricing, availability, and payment obligations are confirmed solely in writing via an official developer booking form, Reservation Agreement, Sale & Purchase Agreement (SPA), or signed RERA Form F.",
  },
  {
    h: "3. Informational Purpose — No Financial, Investment, Legal, Tax, or Mortgage Advice",
    p: `All property listings, developer profiles, community guides, market briefings, net-yield projections, and calculator outputs on ${SITE.domain} are published strictly for general informational purposes. Nothing on this website constitutes regulated financial advice, investment solicitation, guaranteed capital appreciation or rental return, bank mortgage pre-approval, legal counsel, or tax advice. Prospective buyers and investors must conduct independent due diligence and obtain qualified legal, financial, and tax advice in both the UAE and their jurisdiction of tax residence prior to committing funds.`,
  },
  {
    h: "4. Off-Plan Purchases, RERA Escrow (Law No. 8 of 2007) & Statutory Fees",
    p: "All Dubai off-plan developments are subject to Dubai Law No. 8 of 2007 concerning Escrow Accounts for Real Estate Development and Dubai Land Department (DLD) Oqood registration. Payments for Dubai off-plan units must be deposited exclusively into the project-specific RERA-approved escrow account stated in the official SPA—never to personal accounts or unauthorized intermediaries. On direct primary off-plan purchases in Dubai: (a) there are NO mortgage registration fees and NO DLD Registration Trustee fees; (b) primary developer launches typically carry 0% buyer brokerage commission (unless agreed otherwise in writing); and (c) buyers pay the statutory 4% DLD Oqood registration fee (or applicable Emirate land department fee outside Dubai, such as ADM in Abu Dhabi or SRERD in Sharjah) plus approximate Developers Admin fees of AED 4,000 to AED 5,500, subject to the individual developer's official fee schedule.",
  },
  {
    h: "5. Secondary Market Resales, Ready Homes & Leasing (RERA Forms, Trakheesi & Ejari)",
    p: "Secondary market sales and residential or commercial leases in Dubai are governed by RERA unified contracts (Form A for sellers/landlords, Form B for buyers/tenants, Form F / MOU for secondary transfers, and Ejari Unified Tenancy Contracts for leases). Secondary listings are advertised subject to valid DLD Trakheesi permit verification and owner authorization. Applicable statutory fees (including 4% DLD transfer fee, Title Deed issuance, Developer NOC fees, Ejari registration, and agreed brokerage commission plus 5% UAE VAT where applicable) are borne by the responsible party as stipulated in the executed RERA contract.",
  },
  {
    h: "6. UAE Mortgage, DLD & Financial Calculators Disclaimer",
    p: "All outputs from the UAE Mortgage Calculator, DLD 4% Upfront Cost Calculator, Off-Plan Payment Schedule Calculator, Net Rental Yield Calculator, and 5-Year Buy vs Rent Estimator are strictly illustrative mathematical estimates based on user inputs and general UAE market assumptions. Mortgage eligibility, Loan-to-Value (LTV) ratios, Debt Burden Ratio (DBR) limits, profit/interest rates, arrangement fees, valuation charges, and insurance requirements are determined exclusively by UAE Central Bank regulations and the lending bank's independent credit underwriting. SWK Properties is a licensed real estate brokerage and is not a bank or direct mortgage lender.",
  },
  {
    h: "7. Architectural Renders, Specifications & Mollak Service Charges",
    p: "Visuals, exterior/interior renders, photography, lifestyle descriptions, and floor-plan sketches displayed for off-plan and ready developments are supplied for illustrative purposes only and may depict upgrades, views, or landscaping not included in standard handovers. Actual unit dimensions (sq ft / sq m), finishes, views, parking allocations, and annual RERA Mollak service charges are governed solely by the official SPA, Title Deed, and Owners Association / Mollak budgets approved by RERA.",
  },
  {
    h: "8. Primary Currency (AED) & Foreign Exchange / Area Conversions",
    p: "All UAE property transactions are legally denominated and settled in United Arab Emirates Dirhams (AED). Any foreign currency conversions (USD, EUR, GBP, INR, RUB) or square-metre (sq m) equivalents displayed via site preference controls are approximate convenience calculations using indicative reference rates and must not be relied upon for wire transfers, financing, or contractual commitments.",
  },
  {
    h: "9. UAE Golden Visa & Residency Eligibility Disclaimer",
    p: "References to the 10-year UAE Golden Visa (currently associated with qualifying real estate investments of AED 2,000,000 or more) or other residency pathways are general summaries of current UAE Federal Authority for Identity, Citizenship, Customs & Port Security (ICP) and Dubai Land Department (DLD) criteria. Visa issuance, thresholds, mortgage equity rules, and renewal terms are solely at the discretion of UAE government authorities and may change at any time without notice. SWK Properties makes no warranty or guarantee of visa approval.",
  },
  {
    h: "10. Brokerage Commission & Transparency",
    p: "Any brokerage commission payable to SWK Properties is agreed transparently in writing prior to service execution via the applicable RERA contract (Form A, Form B, or written fee agreement). Government land department charges, Developers Admin fees, NOC charges, utility deposits, and bank charges are third-party fees separate from brokerage commission.",
  },
  {
    h: "11. Anti-Money Laundering (AML/CTF) & KYC Regulatory Compliance",
    p: "As a Designated Non-Financial Business and Profession (DNFBP) under UAE Federal Decree-Law No. 20 of 2018 on Anti-Money Laundering and Combating the Financing of Terrorism (as amended), SWK Properties LLC is legally obligated to conduct Customer Due Diligence (CDD/KYC), verify identity and source of funds via authorized channels, maintain regulated transaction records for at least five (5) years, and report suspicious transactions to the UAE Financial Intelligence Unit (goAML). We reserve the right to decline or suspend any transaction where statutory KYC/AML verification is incomplete.",
  },
  {
    h: "12. Privacy & Personal Data Protection (UAE PDPL)",
    p: "Personal data collected through website enquiries, advisory consultations, or newsletter subscriptions is processed strictly in accordance with UAE Federal Decree-Law No. 45 of 2021 regarding the Protection of Personal Data (UAE PDPL) and our published Privacy Policy and Cookie Settings. Visitors must never upload or transmit passport copies, Emirates IDs, bank account passwords, or payment card details via website forms or unverified messaging channels.",
  },
  {
    h: "13. Intellectual Property, Developer Trademarks & Acceptable Cyber Use",
    p: `The SWK Properties name, emblem, logos, editorial research, calculators, and original photography are the intellectual property of ${SITE.legalName}. Third-party developer names, logos, and project titles (including Nakheel, Emaar, Binghatti, DAMAC, Azizi, Tarrad Development, Sobha Realty, Omniyat, Aldar, Ellington, Arada, Meraas, and others) remain the exclusive property of their respective owners and are referenced strictly to identify UAE developments without implying exclusive agency unless confirmed in writing. You strictly agree not to engage in automated scraping, denial-of-service floods, vulnerability probing, injection attacks, unauthorized file uploads, credential stuffing, or form spam against ${SITE.domain}; automated abuse is actively blocked and logged under UAE Cybercrime Law (Federal Decree-Law No. 34 of 2021).`,
  },
  {
    h: "14. Limitation of Liability, Amendments & Governing Law (Dubai, UAE)",
    p: `To the fullest extent permitted by applicable UAE law, ${SITE.legalName}, its directors, advisors, and affiliates shall not be liable for any direct, indirect, incidental, consequential, or special loss, lost profit, price change, developer delay, or decision taken in reliance upon website content, calculators, third-party links, or indicative pricing. We reserve the right to amend these Terms at any time by publishing updated Terms on this page. These Terms are governed by and construed exclusively in accordance with the federal laws of the United Arab Emirates and the laws of the Emirate of Dubai, and any dispute arising hereunder shall be subject to the exclusive jurisdiction of the competent courts of Dubai, UAE. Report any listing inaccuracy or compliance notice to ${SITE.email}.`,
  },
];

export default function TermsPage() {
  return (
    <div className="bg-transparent">
      <JsonLd
        id="ld-terms-breadcrumb"
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Terms & Conditions", path: "/terms" },
        ])}
      />

      <AvenloPageHeader
        eyebrow={`RERA ORN ${SITE.orn} · LEGALLY BINDING TERMS & DISCLOSURES`}
        title="Terms &"
        italic="Conditions"
        compact
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Terms & Conditions" },
        ]}
        meta={
          <span>
            Effective Date: November 2026 · {SITE.legalName}, {SITE.address.full}
          </span>
        }
      />

      <article className="mx-auto my-12 max-w-4xl rounded-3xl border border-white/80 bg-white/88 px-6 py-12 sm:px-10 shadow-[0_20px_54px_rgba(12,56,96,0.09)] backdrop-blur-2xl space-y-9 text-[15px] leading-[1.75] text-[#334155]">
        {/* Prominent Executive Notice Box */}
        <div className="rounded-2xl border border-[#0e9f6e]/30 bg-[#0e9f6e]/[0.06] p-5 sm:p-6 text-sm text-[#0f172a]">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0b7a55]">
            IMPORTANT MANDATORY NOTICE · DEVELOPER PRICING &amp; MARKET CONDITIONS
          </p>
          <p className="mt-2 leading-relaxed">
            All properties, prices, payment plans, offers, and unit availability displayed across{" "}
            <strong>{SITE.domain}</strong> depend strictly on the respective developer and prevailing current market conditions and are subject to change or withdrawal without prior notice. On primary off-plan purchases in Dubai, there are{" "}
            <strong>no mortgage registration fees</strong> and <strong>no trustee fees</strong>; approximate{" "}
            <strong>Developers Admin fees (AED 4,000–5,500)</strong> and statutory land department fees apply per official developer and DLD schedules.
          </p>
        </div>

        {TERMS_SECTIONS.map((item) => (
          <section key={item.h}>
            <h2 className="text-xl sm:text-2xl font-medium tracking-[-0.03em] text-[#121212]">
              {item.h}
            </h2>
            <p className="mt-3">{item.p}</p>
          </section>
        ))}

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-black/[0.08] pt-8 text-xs text-[#64748b]">
          <span>
            Related legal documents:{" "}
            <Link href="/privacy" className="font-medium text-[#121212] underline underline-offset-4">
              Privacy Policy (UAE PDPL)
            </Link>{" "}
            ·{" "}
            <Link href="/cookies" className="font-medium text-[#121212] underline underline-offset-4">
              Cookie Settings
            </Link>
          </span>
          <a
            href={`mailto:${SITE.email}`}
            className="font-medium text-[#121212] underline underline-offset-4 hover:text-[#0e9f6e]"
          >
            Legal &amp; Compliance Desk: {SITE.email}
          </a>
        </div>
      </article>
    </div>
  );
}
