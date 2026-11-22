import type { Metadata } from "next";
import { Check } from "lucide-react";
import { SITE } from "@/lib/swk";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { AvenloPageHeader } from "@/components/avenlo/page-header";
import { CtaBanner, SectionEyebrow, SplitHeading } from "@/components/avenlo/motion";

export const metadata: Metadata = buildMetadata({
  title: "List Your Property in Dubai — Sell or Lease With SWK",
  description:
    "Instruct SWK Properties (RERA ORN 51517) to sell or lease your Dubai apartment, villa, or commercial asset. DLD comparable valuation, RERA Form A, and Trakheesi permit marketing.",
  path: "/list-your-property",
  keywords: [
    "sell property in Dubai",
    "list property for rent Dubai",
    "RERA Form A Dubai landlord",
    "Dubai property valuation SWK Properties",
  ],
});

const SELLER_STEPS = [
  {
    num: "01",
    title: "DLD Evidence Valuation",
    desc: "We benchmark recent achieved DLD transfers and Ejari leases in your building—separating wishful portal prices from closing reality.",
    offset: "lg:mt-0",
  },
  {
    num: "02",
    title: "Form A & Trakheesi Permit",
    desc: "Execute official RERA Form A via Dubai REST and issue a compliant DLD Trakheesi marketing permit prior to publication.",
    offset: "lg:mt-14",
  },
  {
    num: "03",
    title: "Architectural Presentation",
    desc: "Clean architectural photography, qualified buyer/tenant screening, and coordinated viewings without wasting your calendar.",
    offset: "lg:mt-4",
  },
  {
    num: "04",
    title: "NOC & Clean Transfer",
    desc: "Form F negotiation, mortgage liability coordination, developer NOC clearance, and smooth DLD Trustee transfer or Ejari move-in.",
    offset: "lg:mt-16",
  },
];

const REQUIRED_DOCS = [
  {
    title: "Title Deed or Oqood Certificate",
    detail: "Confirms registered ownership so DLD can issue a valid Trakheesi advertising permit.",
  },
  {
    title: "Owner Passport & Emirates ID",
    detail: "Required to execute the RERA Form A brokerage mandate via the Dubai REST platform.",
  },
  {
    title: "Signed RERA Form A",
    detail: "Mandatory under Dubai advertising regulations before any listing is marketed publicly.",
  },
  {
    title: "Tenancy & Service Charge Status",
    detail: "Current Ejari details (if tenanted) or confirmation of vacant possession and Mollak standing.",
  },
];

export default function ListYourPropertyPage() {
  return (
    <div className="bg-transparent">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "List Your Property", path: "/list-your-property" },
        ])}
      />

      <AvenloPageHeader
        eyebrow={`OWNER MANDATE DESK · RERA ORN ${SITE.reraOrn}`}
        title="Price on evidence,"
        italic="close cleanly"
        lead="Sell or lease your Dubai apartment, villa, or penthouse with a brokerage that prices from real DLD transfer records and qualifies every viewer."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "List Your Property" },
        ]}
      />

      {/* Staggered 4-Stage Mandate Wave */}
      <section className="border-b border-white/60 bg-white/24 backdrop-blur-[2px] py-20">
        <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
          <div className="text-center">
            <SectionEyebrow align="center">HOW WE REPRESENT OWNERS</SectionEyebrow>
            <SplitHeading
              align="center"
              primary="Four disciplined stages"
              muted="from valuation to handover"
              size="md"
              className="mt-4"
            />
          </div>

          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 items-start">
            {SELLER_STEPS.map((s) => (
              <div
                key={s.num}
                className={`rounded-2xl border border-white/80 bg-white/84 backdrop-blur-xl shadow-[0_14px_40px_rgba(12,56,96,0.08)] p-7 ${s.offset}`}
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-[#cfcfcf] font-mono text-xs font-medium text-[#121212]">
                  {s.num}
                </span>
                <h2 className="mt-8 text-xl font-medium tracking-[-0.025em] text-[#121212]">
                  {s.title}
                </h2>
                <p className="mt-2.5 text-sm leading-relaxed text-[#737373]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Owner Checklist + Mandate Intake Form */}
      <section className="mx-auto max-w-[1260px] px-4 py-20 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
          <div className="lg:col-span-5 space-y-6">
            <SectionEyebrow>DLD ONBOARDING CHECKLIST</SectionEyebrow>
            <SplitHeading
              primary="Documents needed"
              muted="for Form A & Trakheesi"
              size="md"
            />
            <p className="text-sm leading-relaxed text-[#525252]">
              Do not upload IDs or Title Deeds via this web form. Once our advisor contacts you, we verify documents directly through official RERA / Dubai REST channels.
            </p>
            <div className="space-y-3">
              {REQUIRED_DOCS.map((doc) => (
                <div
                  key={doc.title}
                  className="rounded-2xl border border-white/80 bg-white/80 backdrop-blur-xl shadow-[0_14px_40px_rgba(12,56,96,0.08)] p-5"
                >
                  <div className="flex items-center gap-2 text-sm font-medium text-[#121212]">
                    <Check className="h-4 w-4 text-[#0e9f6e]" />
                    <span>{doc.title}</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#737373]">{doc.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <EnquiryForm
              context="selling"
              heading="Request a DLD comparative valuation"
              subheading="Share your building, unit size, bedrooms, and whether you plan to sell or lease."
            />
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
