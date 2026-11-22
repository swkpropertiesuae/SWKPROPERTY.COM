import type { Metadata } from "next";
import { PropertyCard } from "@/components/site/property-card";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { JsonLd } from "@/components/seo/json-ld";
import { LISTINGS } from "@/lib/listings";
import { breadcrumbLd, buildMeta } from "@/lib/seo";
import { AvenloPageHeader } from "@/components/avenlo/page-header";
import { BracketLink } from "@/components/avenlo/bracket-button";
import { CtaBanner, SectionEyebrow, SplitHeading } from "@/components/avenlo/motion";

export const metadata: Metadata = buildMeta({
  title: "Buy Ready Property in Dubai | Secondary Market Homes",
  description:
    "Acquire ready apartments, waterfront villas, townhouses, and penthouses in Dubai with RERA Form F, NOC, and DLD Trustee transfer support from SWK Properties (ORN 51517).",
  path: "/buy",
  image: "/img/hero/banner-buy.webp",
  keywords: [
    "buy property in Dubai",
    "ready apartments for sale Dubai",
    "Palm Jumeirah villas for sale",
    "Downtown Dubai apartments for sale",
    "RERA Form F Dubai transfer",
  ],
});

export default function BuyPage() {
  const buyListings = LISTINGS.filter((l) => l.purpose === "buy");

  return (
    <div className="bg-white">
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Buy Ready Property", path: "/buy" },
        ])}
      />

      <AvenloPageHeader
        eyebrow="SECONDARY MARKET · READY HOMES"
        title="Acquire ready homes across"
        italic="Dubai freehold districts"
        lead="Every secondary resale advised by SWK Properties is checked for Title Deed status, RERA Mollak service-charge history, and recent DLD comparable transfers."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Properties", href: "/properties" },
          { label: "Buy Ready" },
        ]}
        actions={
          <>
            <BracketLink href="/properties?purpose=buy" variant="light" size="md">
              Filter Ready Inventory
            </BracketLink>
            <BracketLink href="/guides/buying" variant="light" size="md">
              Dubai Buying Guide
            </BracketLink>
          </>
        }
      />

      <section className="mx-auto max-w-[1260px] px-4 py-16 sm:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {buyListings.map((listing) => (
            <PropertyCard key={listing.slug} listing={listing} />
          ))}
        </div>
      </section>

      {/* Upfront Cost Summary + Form F Strip */}
      <section className="border-y border-black/[0.06] bg-[#f7f7f7] py-20">
        <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
            <div className="lg:col-span-5 space-y-6">
              <SectionEyebrow>UPFRONT TRANSACTION COSTS</SectionEyebrow>
              <SplitHeading
                primary="Know every fee"
                muted="before signing Form F"
                size="md"
              />
              <p className="text-sm leading-relaxed text-[#525252]">
                On Dubai secondary resales, buyers budget 4% DLD transfer fee, DLD Trustee registration (AED 4,200 for properties ≥ AED 500K), Title Deed issuance (AED 580), and 2% brokerage commission (+ VAT).
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { v: "4%", l: "DLD Transfer Fee" },
                  { v: "AED 4,200", l: "DLD Trustee Office" },
                  { v: "2–4 Wks", l: "Typical Cash Transfer" },
                  { v: "100%", l: "Freehold Title Deed" },
                ].map((m) => (
                  <div key={m.l} className="rounded-2xl border border-black/[0.06] bg-white p-5">
                    <p className="text-2xl font-medium tracking-[-0.03em] text-[#121212]">{m.v}</p>
                    <p className="mt-1 text-xs text-[#737373]">{m.l}</p>
                  </div>
                ))}
              </div>
              <BracketLink href="/calculators" variant="light" size="sm">
                Open DLD Cost Calculator
              </BracketLink>
            </div>

            <div className="lg:col-span-7">
              <EnquiryForm
                context="buying"
                heading="Request a ready-home shortlist"
                subheading="Tell us your target Dubai district, budget in AED, and cash or mortgage timeline."
              />
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
