import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GUIDES } from "@/lib/guides";
import { buildMeta, breadcrumbLd, itemListLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { AvenloPageHeader } from "@/components/avenlo/page-header";
import { CtaBanner } from "@/components/avenlo/motion";

export const metadata = buildMeta({
  title: "Dubai Property Guides — Buying, Renting & Investing",
  description:
    "Step-by-step Dubai real estate handbooks from RERA-licensed SWK Properties: buying ready and off-plan, renting with Ejari, selling with Form A, and investing for yield.",
  path: "/guides",
});

export default function GuidesIndexPage() {
  return (
    <div className="bg-white">
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

      <section className="mx-auto max-w-[1100px] px-4 py-16 sm:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {GUIDES.map((g, idx) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-black/[0.07] bg-white p-7 sm:p-8 transition-all hover:border-black/20 hover:shadow-[0_20px_50px_rgba(18,18,18,0.07)]"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b8b8b]">
                  <span>0{idx + 1} · {g.eyebrow}</span>
                  <span>{g.readTime}</span>
                </div>
                <h2 className="mt-4 text-2xl font-medium leading-[1.2] tracking-[-0.03em] text-[#121212] group-hover:text-[#525252]">
                  {g.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#666666]">{g.directAnswer}</p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-black/[0.06] pt-4 text-xs font-medium text-[#121212]">
                <span className="text-[#8b8b8b]">Updated {g.lastUpdated}</span>
                <span className="inline-flex items-center gap-1 group-hover:text-[#0e9f6e]">
                  Read Handbook <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
