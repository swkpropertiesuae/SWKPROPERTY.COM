import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { blogIndex, blogCategories } from "@/lib/blog";
import { GUIDES } from "@/lib/guides";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { AvenloPageHeader } from "@/components/avenlo/page-header";
import { BracketLink } from "@/components/avenlo/bracket-button";
import { CtaBanner, SectionEyebrow, SplitHeading } from "@/components/avenlo/motion";
import { InsightsExplorer } from "@/components/insights/insights-explorer";
import { SpotlightCard } from "@/components/ui/spotlight-card";

export const metadata: Metadata = buildMetadata({
  title: "Dubai Real Estate Insights & Market Archive (2008–2026)",
  description:
    "In-depth Dubai and UAE real estate market research from 2008 to today: off-plan escrow analysis, DLD transfer rules, Golden Visa checklists, rental yields, and community cycles.",
  path: "/insights",
  keywords: [
    "Dubai real estate market insights 2026",
    "Dubai property market archive 2008 2026",
    "Dubai off-plan escrow Oqood guide",
    "UAE Golden Visa AED 2M property",
    "Dubai Metro Blue Line real estate",
  ],
});

export default function InsightsPage() {
  return (
    <div className="bg-transparent">
      <JsonLd
        id="ld-insights-breadcrumb"
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Market Insights & Guides", path: "/insights" },
        ])}
      />

      <AvenloPageHeader
        eyebrow="JOURNAL & RESEARCH ARCHIVE · SINCE 2008"
        title="Notes from the"
        italic="Dubai desk"
        lead="Decades of plain-English Dubai real estate research grounded in Dubai Land Department cycles, RERA regulations, infrastructure catalysts, and building-level trade-offs."
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

      <InsightsExplorer entries={blogIndex} categories={blogCategories} />

      {/* Core Dubai Handbooks Strip — 21st.dev Spotlight Cards */}
      <section className="border-y border-white/60 bg-white/24 backdrop-blur-[2px] py-16">
        <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
          <SectionEyebrow>CORE HANDBOOKS</SectionEyebrow>
          <SplitHeading
            primary="Step-by-step"
            muted="transaction manuals"
            size="md"
            inline
            className="mt-4"
          />
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {GUIDES.map((g, idx) => (
              <SpotlightCard key={g.slug}>
                <Link
                  href={`/guides/${g.slug}`}
                  className="group flex h-full flex-col justify-between p-6"
                >
                  <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1b6aa7]">
                      0{idx + 1} · {g.eyebrow}
                    </p>
                    <h3 className="mt-2.5 text-lg font-medium tracking-[-0.02em] text-[#121212] transition-colors group-hover:text-[#0e9f6e]">
                      {g.title}
                    </h3>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-[#121212] transition-all group-hover:translate-x-0.5 group-hover:text-[#0e9f6e]">
                    Open Guide <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-8">
        <EnquiryForm
          context="advisory"
          heading="Request a custom Dubai market brief"
          subheading="Tell us which district or developer you are evaluating and we will share live DLD comparables."
        />
      </section>

      <CtaBanner />
    </div>
  );
}
