import type { Metadata } from "next";
import { faqs } from "@/lib/swk";
import { GUIDES } from "@/lib/guides";
import { buildMetadata, faqSchema, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { Faq } from "@/components/site/faq";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { AvenloPageHeader } from "@/components/avenlo/page-header";
import { BracketLink } from "@/components/avenlo/bracket-button";
import { CtaBanner } from "@/components/avenlo/motion";

export const metadata: Metadata = buildMetadata({
  title: "Dubai Real Estate FAQ — DLD Fees, Off-Plan & Ejari",
  description:
    "Direct answers to common questions about buying ready or off-plan property in Dubai, DLD 4% fees, escrow and Oqood registration, UAE Golden Visa, and Ejari leasing.",
  path: "/faq",
  keywords: [
    "Dubai real estate FAQ",
    "DLD 4% fee FAQ",
    "Oqood escrow Dubai FAQ",
    "SWK Properties RERA ORN 51517 FAQ",
  ],
});

export default function FaqPage() {
  const combinedFaqs = [...faqs, ...GUIDES.flatMap((g) => g.faqs)];

  return (
    <div className="bg-transparent">
      <JsonLd id="ld-faq-page" data={faqSchema(combinedFaqs)} />
      <JsonLd
        id="ld-faq-breadcrumb"
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Frequently Asked Questions", path: "/faq" },
        ])}
      />

      <AvenloPageHeader
        eyebrow="QUESTIONS & ANSWERS · RERA ORN 51517"
        title="Clear answers on"
        italic="Dubai property"
        lead="Straight answers on DLD 4% fees, Oqood and RERA escrow accounts, Golden Visa thresholds, non-resident mortgages, Ejari leasing, and Form A/F transfers."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "FAQ" },
        ]}
        actions={
          <BracketLink href="/calculators" variant="light" size="sm">
            Try DLD &amp; Mortgage Calculator
          </BracketLink>
        }
      />

      <Faq
        items={combinedFaqs}
        eyebrow="ALL QUESTIONS"
        primary="Everything buyers,"
        muted="tenants & sellers ask"
      />

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
        <EnquiryForm
          context="advisory"
          heading="Still have a specific question?"
          subheading="Write to our Sheikh Zayed Road desk and we will confirm the exact RERA or DLD rule for your case."
        />
      </section>

      <CtaBanner />
    </div>
  );
}
