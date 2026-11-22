import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SITE, team } from "@/lib/swk";
import { buildMeta, breadcrumbLd, itemListLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { AvenloPageHeader } from "@/components/avenlo/page-header";
import { CtaBanner } from "@/components/avenlo/motion";

export const metadata: Metadata = buildMeta({
  title: "Dubai Property Advisors & Team",
  description: `Meet the RERA-registered Dubai real estate advisory team at ${SITE.legalName} (ORN ${SITE.reraOrn}) covering off-plan launches, ready sales, leasing, and commercial portfolios.`,
  path: "/agents",
  image: "/img/hero/banner-agents.webp",
});

export default function AgentsPage() {
  return (
    <div className="bg-white">
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Advisors", path: "/agents" },
          ]),
          itemListLd(
            "SWK Properties Dubai Advisory Team",
            team.map((m) => ({ name: m.name, path: `/agents/${m.slug}` }))
          ),
        ]}
      />

      <AvenloPageHeader
        eyebrow={`THE TEAM · RERA ORN ${SITE.reraOrn}`}
        title="The people you will"
        italic="actually deal with"
        lead="Every enquiry goes straight to the specialist covering your target Dubai community, developer, or transaction type—speaking English, Arabic, Urdu, Hindi, Punjabi, Pashto, and French."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Advisors" },
        ]}
      />

      {/* Avenlo Clean 3-Column Studio Portrait Grid */}
      <section className="mx-auto max-w-[1260px] px-4 py-16 sm:px-8">
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <Link
              key={member.slug}
              href={`/agents/${member.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-black/[0.07] bg-white transition-all duration-300 hover:border-black/20 hover:shadow-[0_20px_50px_rgba(18,18,18,0.08)]"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#f5f5f5]">
                <img
                  src={member.photo}
                  alt={member.name}
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-xl font-medium tracking-[-0.025em] text-[#121212]">
                        {member.name}
                      </h2>
                      <p className="mt-1 text-xs text-[#8b8b8b]">{member.role}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-[#8b8b8b] group-hover:text-[#121212]" />
                  </div>
                  <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-[#666666]">
                    {member.bio}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-black/[0.06] pt-4 text-[11px] text-[#737373]">
                  <span>{member.languages.join(" · ")}</span>
                  <span className="font-medium text-[#121212]">{member.experienceYears}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
