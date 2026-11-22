import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { JsonLd } from "@/components/seo/json-ld";
import { communityGuides } from "@/lib/communities";
import { breadcrumbLd, buildMeta, itemListLd, KEYWORDS } from "@/lib/seo";
import { SITE } from "@/lib/swk";
import { AvenloPageHeader } from "@/components/avenlo/page-header";
import { CtaBanner, SectionEyebrow, SplitHeading } from "@/components/avenlo/motion";

export const metadata: Metadata = buildMeta({
  title: "Dubai Community Guides | Downtown, Palm, Marina & Hills",
  description:
    "Balanced neighbourhood guides for Dubai's core freehold communities: Downtown Dubai, Dubai Marina, Palm Jumeirah, Business Bay, Dubai Hills Estate, JVC, Creek Harbour & SZR.",
  path: "/communities",
  image: "/img/communities/downtown-dubai.webp",
  keywords: KEYWORDS.communities,
});

export default function CommunitiesPage() {
  return (
    <div className="bg-white">
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Dubai Communities", path: "/communities" },
          ]),
          itemListLd(
            "Dubai Core Real Estate Communities",
            communityGuides.map((c) => ({
              name: c.name,
              url: `${SITE.url}/communities/${c.slug}`,
            }))
          ),
        ]}
      />

      <AvenloPageHeader
        eyebrow="NEIGHBOURHOOD GUIDES · DUBAI"
        title="Compare Dubai's core"
        italic="freehold districts"
        lead="Honest street-level briefs covering transport links, schools, typical property types, strengths, and practical trade-offs across eight major Dubai corridors."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Communities" },
        ]}
      />

      <section className="mx-auto max-w-[1260px] px-4 py-16 sm:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {communityGuides.map((comm) => (
            <Link
              key={comm.slug}
              href={`/communities/${comm.slug}`}
              className="group overflow-hidden rounded-2xl border border-black/[0.07] bg-white transition-all duration-300 hover:border-black/20 hover:shadow-[0_20px_50px_rgba(18,18,18,0.08)]"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#f5f5f5]">
                <img
                  src={comm.image}
                  alt={comm.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <div className="p-6 sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-2xl font-medium tracking-[-0.03em] text-[#121212]">
                    {comm.name}
                  </h2>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-[#8b8b8b] group-hover:text-[#121212]" />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#525252]">{comm.blurb}</p>
                <div className="mt-5 flex flex-wrap gap-1.5 border-t border-black/[0.06] pt-4">
                  {comm.bestFor.slice(0, 2).map((b) => (
                    <span
                      key={b}
                      className="rounded-full bg-[#f5f5f5] px-3 py-1 text-[11px] font-medium text-[#525252]"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-black/[0.06] bg-[#f7f7f7] py-20">
        <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
            <div className="lg:col-span-5 space-y-4">
              <SectionEyebrow>AREA SELECTION BRIEF</SectionEyebrow>
              <SplitHeading
                primary="Matching your routine"
                muted="to the right corridor"
                size="md"
              />
              <p className="text-sm leading-relaxed text-[#525252]">
                Share commute destinations, school preferences, or target rental yield and our team will map two to three buildings worth viewing.
              </p>
            </div>
            <div className="lg:col-span-7">
              <EnquiryForm
                context="advisory"
                heading="Request a community comparison"
                subheading="Receive real comparable prices, service-charge ranges, and rental yield notes."
              />
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
