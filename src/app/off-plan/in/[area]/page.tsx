import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { offPlanAreas, getOffPlanArea } from "@/lib/areas";
import { getDeveloper } from "@/lib/developers";
import { SITE } from "@/lib/swk";
import { buildMeta, breadcrumbLd, itemListLd, faqLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { MapEmbed } from "@/components/site/map-embed";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { Faq } from "@/components/site/faq";
import { AvenloPageHeader } from "@/components/avenlo/page-header";
import { BracketLink } from "@/components/avenlo/bracket-button";
import { CtaBanner, SectionEyebrow, SplitHeading } from "@/components/avenlo/motion";

export function generateStaticParams() {
  return offPlanAreas.map((a) => ({ area: a.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ area: string }>;
}): Promise<Metadata> {
  const area = getOffPlanArea((await params).area);
  if (!area) return {};
  return buildMeta({
    title: `Off-Plan Projects in ${area.name} (${area.projects.length} Launches)`,
    description: `${area.projects.length} off-plan projects in ${area.name} from ${area.developers
      .slice(0, 3)
      .join(", ")}. Compare payment plans and handover with SWK Properties, RERA ORN ${SITE.orn}.`,
    path: `/off-plan/in/${area.slug}`,
    image: area.projects[0]?.image,
    keywords: [
      `off plan ${area.name}`,
      `new projects ${area.name}`,
      `${area.name} payment plan`,
      ...area.developers.map((d) => `${d} ${area.name}`),
    ],
  });
}

export default async function OffPlanAreaPage({
  params,
}: {
  params: Promise<{ area: string }>;
}) {
  const area = getOffPlanArea((await params).area);
  if (!area) notFound();

  const areaFaqs = [
    {
      q: `How many off-plan projects in ${area.name} does SWK track?`,
      a: `SWK Properties tracks ${area.projects.length} off-plan launches in ${area.name} from ${area.developers.length} developer${area.developers.length > 1 ? "s" : ""}: ${area.developers.join(", ")}. Availability and payment terms are confirmed directly with the developer before reservation.`,
    },
    {
      q: `Do I pay commission when buying off-plan in ${area.name}?`,
      a: "On primary developer sales, the developer normally pays the brokerage commission. Buyers pay the 4% DLD Oqood fee plus admin fee and construction-linked escrow instalments.",
    },
    {
      q: `Can foreign buyers purchase off-plan in ${area.name}?`,
      a: `Foreign nationals can acquire freehold property in designated UAE freehold zones. SWK confirms title status and RERA escrow registration before any booking.`,
    },
  ];

  return (
    <div className="bg-white">
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Off-Plan Projects", path: "/off-plan" },
            { name: area.name, path: `/off-plan/in/${area.slug}` },
          ]),
          itemListLd(
            `Off-plan projects in ${area.name}`,
            area.projects.map((p) => ({ name: p.name, path: `/off-plan/${p.slug}` }))
          ),
          faqLd(areaFaqs),
        ]}
      />

      <AvenloPageHeader
        eyebrow={`${area.projects.length} TRACKED LAUNCHES · ${area.developers.length} DEVELOPERS`}
        title="Off-plan projects in"
        italic={area.name}
        lead={`Compare active releases in ${area.name} from ${area.developers.join(", ")}—each verified for RERA escrow registration and official payment plans.`}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Off-Plan", href: "/off-plan" },
          { label: area.name },
        ]}
        actions={
          area.communityGuideSlug ? (
            <BracketLink href={`/communities/${area.communityGuideSlug}`} variant="light" size="md">
              Read {area.name} Guide
            </BracketLink>
          ) : undefined
        }
      />

      <section className="mx-auto max-w-[1260px] px-4 py-16 sm:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {area.projects.map((p) => {
            const dev = getDeveloper(p.developerSlug);
            return (
              <Link
                key={p.slug}
                href={`/off-plan/${p.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.07] bg-white transition-all hover:border-black/20 hover:shadow-[0_20px_50px_rgba(18,18,18,0.08)]"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#ececec]">
                  <img
                    src={p.thumb || p.image}
                    alt={`${p.name} by ${p.devName}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-medium text-[#121212]">
                    Developer Render
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      {dev?.logo ? (
                        <img
                          src={dev.logo}
                          alt={p.devName}
                          className="h-5 w-auto max-w-[100px] object-contain opacity-80"
                        />
                      ) : (
                        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#8b8b8b]">
                          {p.devName}
                        </span>
                      )}
                      <span className="text-[11px] text-[#8b8b8b]">{p.community}</span>
                    </div>
                    <h2 className="mt-3 text-xl font-medium tracking-[-0.025em] text-[#121212]">
                      {p.name}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#666666]">
                      {p.summary || p.blurb}
                    </p>
                  </div>
                  <div className="mt-5 flex items-center justify-end border-t border-black/[0.06] pt-4 text-xs font-medium text-[#121212] group-hover:text-[#0e9f6e]">
                    <span>Inspect Launch</span>
                    <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-14">
          <MapEmbed query={`${area.name}, UAE`} zoom={13} title={`${area.name} — UAE Corridor Map`} />
        </div>
      </section>

      <Faq
        items={areaFaqs}
        eyebrow={`${area.name.toUpperCase()} QUESTIONS`}
        primary={`${area.name} off-plan`}
        muted="essentials"
        compact
      />

      <section className="mx-auto max-w-[1260px] px-4 py-16 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-5">
            <SectionEyebrow>OTHER CORRIDORS</SectionEyebrow>
            <SplitHeading primary="Explore nearby" muted="off-plan hubs" size="md" />
            <div className="flex flex-wrap gap-2 pt-2">
              {offPlanAreas
                .filter((a) => a.slug !== area.slug)
                .map((a) => (
                  <Link
                    key={a.slug}
                    href={`/off-plan/in/${a.slug}`}
                    className="rounded-full border border-black/10 bg-[#f7f7f7] px-3.5 py-2 text-xs font-medium text-[#121212] hover:bg-[#121212] hover:text-white transition-colors"
                  >
                    {a.name} ({a.projects.length})
                  </Link>
                ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <EnquiryForm
              context="investment"
              community={area.name}
              heading={`Shortlist ${area.name} launches`}
              subheading="Receive side-by-side payment schedules, floor plates, and expected handover timelines."
            />
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
