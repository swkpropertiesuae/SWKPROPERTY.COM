import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { blogArticles } from "@/lib/blog";
import { GUIDES } from "@/lib/guides";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { AvenloPageHeader } from "@/components/avenlo/page-header";
import { BracketLink } from "@/components/avenlo/bracket-button";
import { CtaBanner, SectionEyebrow, SplitHeading } from "@/components/avenlo/motion";

export const metadata: Metadata = buildMetadata({
  title: "Dubai Real Estate Insights & Market Briefings",
  description:
    "Dubai and UAE real estate research, off-plan payment plan guides, Golden Visa property checklists, developer track-record analysis, and rental yield notes by SWK Properties.",
  path: "/insights",
  keywords: [
    "Dubai real estate market insights 2026",
    "Dubai off-plan escrow Oqood guide",
    "UAE Golden Visa AED 2M property",
    "Dubai rental yield comparison",
  ],
});

export default function InsightsPage() {
  return (
    <div className="bg-white">
      <JsonLd
        id="ld-insights-breadcrumb"
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Market Insights & Guides", path: "/insights" },
        ])}
      />

      <AvenloPageHeader
        eyebrow="JOURNAL & RESEARCH · SHEIKH ZAYED ROAD"
        title="Notes from the"
        italic="Dubai desk"
        lead="Plain-English market briefings grounded in Dubai Land Department procedures, payment-plan structures, and building-level trade-offs."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Insights" },
        ]}
        actions={
          <BracketLink href="/calculators" variant="light" size="md">
            DLD &amp; Yield Calculators
          </BracketLink>
        }
      />

      {/* Editorial Article Grid */}
      <section className="mx-auto max-w-[1260px] px-4 py-16 sm:px-8">
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {blogArticles.map((art) => (
            <Link
              key={art.slug}
              href={`/insights/${art.slug}`}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-black/[0.07] bg-white transition-all duration-300 hover:border-black/20 hover:shadow-[0_20px_50px_rgba(18,18,18,0.08)]"
            >
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f5f5f5]">
                  <img
                    src={art.image}
                    alt={art.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#8b8b8b]">
                    {art.category} · {art.readTime}
                  </p>
                  <h2 className="mt-2.5 text-xl font-medium leading-[1.25] tracking-[-0.025em] text-[#121212] group-hover:text-[#525252]">
                    {art.title}
                  </h2>
                  <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed text-[#666666]">
                    {art.excerpt}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-black/[0.06] px-6 py-4 text-xs font-medium text-[#121212]">
                <span className="text-[#8b8b8b]">{art.date}</span>
                <span className="inline-flex items-center gap-1 group-hover:text-[#0e9f6e]">
                  Read Briefing <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Core Dubai Handbooks Strip */}
      <section className="border-y border-black/[0.06] bg-[#f7f7f7] py-16">
        <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
          <SectionEyebrow>CORE HANDBOOKS</SectionEyebrow>
          <SplitHeading
            primary="Step-by-step"
            muted="transaction manuals"
            size="md"
            inline
            className="mt-4"
          />
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GUIDES.map((g) => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className="group rounded-2xl border border-black/[0.06] bg-white p-6 transition-all hover:border-black/20"
              >
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#8b8b8b]">
                  {g.eyebrow}
                </p>
                <h3 className="mt-2 text-lg font-medium tracking-[-0.02em] text-[#121212]">
                  {g.title}
                </h3>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[#121212] group-hover:text-[#0e9f6e]">
                  Open Guide <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-8">
        <EnquiryForm
          context="advisory"
          heading="Request a custom Dubai market brief"
          subheading="Tell us which district or developer you are evaluating and we will share DLD comparables."
        />
      </section>

      <CtaBanner />
    </div>
  );
}
