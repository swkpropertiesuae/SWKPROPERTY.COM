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
  title: "Rent Property in Dubai | Annual Ejari Homes & Villas",
  description:
    "Annual and executive residential leases across Dubai Marina, Downtown Dubai, Sheikh Zayed Road, JVC & Dubai Hills with official Ejari registration by SWK Properties (ORN 51517).",
  path: "/rent",
  image: "/img/hero/banner-rent.webp",
  keywords: [
    "rent apartment in Dubai",
    "Dubai Marina apartments for rent",
    "annual rent Dubai Ejari",
    "JVC townhouses for rent",
    "SWK Properties leasing",
  ],
});

export default function RentPage() {
  const rentListings = LISTINGS.filter((l) => l.purpose === "rent");

  return (
    <div className="bg-transparent">
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Rent & Lease", path: "/rent" },
        ])}
      />

      <AvenloPageHeader
        eyebrow="LEASING & EJARI · DUBAI"
        title="Annual & executive leases"
        italic="with clean Ejari setup"
        lead="Every rental residence clearly shows annual terms, cheque structure, security deposit, furnishing status, and move-in coordination including Ejari and DEWA."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Properties", href: "/properties" },
          { label: "Rent & Lease" },
        ]}
        actions={
          <>
            <BracketLink href="/properties?purpose=rent" variant="light" size="md">
              Filter Rental Inventory
            </BracketLink>
            <BracketLink href="/guides/renting" variant="light" size="md">
              Dubai Renting Guide
            </BracketLink>
          </>
        }
      />

      <section className="mx-auto max-w-[1260px] px-4 py-16 sm:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rentListings.map((listing) => (
            <PropertyCard key={listing.slug} listing={listing} />
          ))}
        </div>
      </section>

      <section className="border-y border-white/60 bg-white/24 backdrop-blur-[2px] py-20">
        <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
            <div className="lg:col-span-5 space-y-6">
              <SectionEyebrow>TENANT &amp; LANDLORD STANDARD</SectionEyebrow>
              <SplitHeading
                primary="Transparent cheques,"
                muted="registered contracts"
                size="md"
              />
              <p className="text-sm leading-relaxed text-[#525252]">
                Whether relocating to Dubai or letting a newly handed-over apartment, our leasing desk coordinates curated viewings, unified RERA tenancy contracts, Ejari filing, and DEWA utility setup.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { v: "1–4", l: "Standard Annual Cheques" },
                  { v: "5% / 10%", l: "Refundable Deposit" },
                  { v: "Ejari", l: "Official DLD Registration" },
                  { v: "RERA", l: "Renewal Index Checked" },
                ].map((m) => (
                  <div key={m.l} className="rounded-2xl border border-white/80 bg-white/84 backdrop-blur-xl shadow-[0_14px_40px_rgba(12,56,96,0.08)] p-5">
                    <p className="text-2xl font-medium tracking-[-0.03em] text-[#121212]">{m.v}</p>
                    <p className="mt-1 text-xs text-[#737373]">{m.l}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <EnquiryForm
                context="renting"
                heading="Tell us your move-in brief"
                subheading="Share target area, annual AED budget, cheque preference, and move-in date."
              />
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
