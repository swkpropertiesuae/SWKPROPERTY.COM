import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { GUIDES } from "@/lib/guides";
import { buildMeta, breadcrumbLd, faqLd, itemListLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { AvenloPageHeader } from "@/components/avenlo/page-header";
import { CtaBanner } from "@/components/avenlo/motion";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Faq } from "@/components/site/faq";

export const metadata = buildMeta({
  title: "Dubai Property Guides — Buying, Renting & Investing",
  description:
    "Step-by-step Dubai real estate handbooks from RERA-licensed SWK Properties: buying ready and off-plan, renting with Ejari, selling with Form A, and investing for yield.",
  path: "/guides",
});

export default function GuidesIndexPage() {
  const combinedGuideFaqs = GUIDES.flatMap((g) => g.faqs).slice(0, 8);

  return (
    <div className="bg-transparent">
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
          ]),
          itemListLd(
            "Dubai property guides",
            GUIDES.map((g) => ({ name: g.title, path: `/guides/${g.slug}` }))
          ),
          faqLd(combinedGuideFaqs),
        ]}
      />

      <AvenloPageHeader
        eyebrow="SWK HANDBOOKS · DUBAI & UAE"
        title="Plain-English"
        italic="Dubai property guides"
        lead="Step-by-step reference manuals covering DLD transfer fees, Form A/Form F rules, RERA escrow protections, Ejari contracts, and net rental yield mechanics."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Guides" },
        ]}
      />

      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-8">
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
          {GUIDES.map((g, idx) => (
            <SpotlightCard key={g.slug} className="h-full">
              <Link
                href={`/guides/${g.slug}`}
                className="group flex h-full flex-col justify-between p-7 sm:p-9"
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1b6aa7]">
                    <span>{String(idx + 1).padStart(2, "0")} · {g.eyebrow}</span>
                    <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-[10px] text-[#475569]">
                      {g.readTime}
                    </span>
                  </div>
                  <h2 className="mt-4 text-2xl sm:text-[28px] font-medium leading-[1.15] tracking-[-0.03em] text-[#121212] transition-colors group-hover:text-[#0e9f6e]">
                    {g.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#475569]">{g.directAnswer}</p>

                  {g.keyTakeaways.length > 0 ? (
                    <ul className="mt-5 space-y-2 border-t border-black/[0.06] pt-4">
                      {g.keyTakeaways.slice(0, 3).map((kt) => (
                        <li key={kt} className="flex items-start gap-2 text-xs text-[#334155]">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0e9f6e]" />
                          <span>{kt}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-black/[0.06] pt-4 text-xs font-semibold text-[#121212]">
                  <span className="font-mono text-[11px] text-[#64748b]">Updated {g.lastUpdated}</span>
                  <span className="inline-flex items-center gap-1.5 transition-all group-hover:translate-x-0.5 group-hover:text-[#0e9f6e]">
                    Open Full Handbook <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </SpotlightCard>
          ))}
        </div>
      </section>

      <Faq
        items={combinedGuideFaqs}
        eyebrow="HANDBOOK Q&A"
        primary="Quick regulatory"
        muted="answers from our manuals"
      />

      <CtaBanner />
    </div>
  );
}
