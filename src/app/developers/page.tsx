import type { Metadata } from "next";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { JsonLd } from "@/components/seo/json-ld";
import { developers } from "@/lib/developers";
import { breadcrumbLd, buildMeta, itemListLd, KEYWORDS } from "@/lib/seo";
import { SITE } from "@/lib/swk";
import { AvenloPageHeader } from "@/components/avenlo/page-header";
import { DevelopersDirectory } from "@/components/avenlo/developers-directory";
import { CtaBanner, SectionEyebrow, SplitHeading } from "@/components/avenlo/motion";

export const metadata: Metadata = buildMeta({
  title: "UAE Real Estate Developers | Nakheel, Binghatti, Emaar & DAMAC",
  description:
    "Explore factual profiles, delivery track records, flagship communities, and off-plan & ready developments across leading Dubai and UAE master developers with SWK Properties.",
  path: "/developers",
  image: "/img/hero/banner-developers.webp",
  keywords: KEYWORDS.developers,
});

export default function DevelopersPage() {
  return (
    <div className="bg-white">
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "UAE Developers", path: "/developers" },
          ]),
          itemListLd(
            "Premier UAE Real Estate Developers",
            developers.map((d) => ({
              name: d.name,
              url: `${SITE.url}/developers/${d.slug}`,
            }))
          ),
        ]}
      />

      <AvenloPageHeader
        eyebrow="MASTER DEVELOPERS · DUBAI & UAE"
        title="The builders shaping"
        italic="the UAE skyline"
        lead="Compare delivery records, flagship master communities, and active releases across Nakheel, Binghatti, Emaar, DAMAC, Azizi, Sobha Realty, Omniyat, Ellington, and premier UAE developers—audited beyond the brochure."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Developers" },
        ]}
      />

      <DevelopersDirectory developers={developers} />

      <section className="border-t border-black/[0.06] bg-[#f7f7f7] py-20">
        <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
            <div className="lg:col-span-5 space-y-5">
              <SectionEyebrow>DEVELOPER COMPARISON DESK</SectionEyebrow>
              <SplitHeading
                primary="Unsure which builder"
                muted="fits your brief?"
                size="md"
              />
              <p className="text-sm leading-relaxed text-[#525252]">
                Tell us your budget in AED, handover horizon, and whether you prioritise net rental yield, waterfront capital appreciation, or immediate occupancy. We send a clean side-by-side comparison across 3 developers.
              </p>
            </div>
            <div className="lg:col-span-7">
              <EnquiryForm
                context="investment"
                heading="Request a side-by-side developer matrix"
                subheading="Independent guidance across Emaar, Nakheel, Sobha, DAMAC, Binghatti, Azizi, Aldar, Ellington, and Arada."
              />
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
