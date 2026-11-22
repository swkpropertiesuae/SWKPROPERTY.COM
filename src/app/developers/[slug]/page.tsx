import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { developers, getDeveloper } from "@/lib/developers";
import { getListingsByDeveloper } from "@/lib/listings";
import { PropertyCard } from "@/components/site/property-card";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd, buildMeta } from "@/lib/seo";
import { SITE } from "@/lib/swk";
import { AvenloPageHeader } from "@/components/avenlo/page-header";
import { BracketLink } from "@/components/avenlo/bracket-button";
import { CtaBanner, SectionEyebrow, SplitHeading } from "@/components/avenlo/motion";

export function generateStaticParams() {
  return developers.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dev = getDeveloper(slug);
  if (!dev) {
    return buildMeta({
      title: "Developer Not Found",
      description: "Browse UAE real estate developers with SWK Properties.",
      path: "/developers",
    });
  }

  return buildMeta({
    title: `${dev.name} Projects & Payment Plans | Dubai & UAE`,
    description: `${dev.tagline}. Explore off-plan and ready developments by ${dev.name} and DLD escrow guidance with SWK Properties (ORN ${SITE.reraOrn}).`,
    path: `/developers/${dev.slug}`,
    image: dev.projects[0]?.images[0] || "/img/hero/banner-developers.webp",
    keywords: [
      dev.name,
      `${dev.name} Dubai projects`,
      `${dev.name} off-plan`,
      ...(dev.flagshipAreas || []),
    ],
  });
}

export default async function DeveloperDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dev = getDeveloper(slug);
  if (!dev) notFound();

  const devListings = getListingsByDeveloper(dev.slug);

  return (
    <div className="bg-white">
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Developers", path: "/developers" },
          { name: dev.name, path: `/developers/${dev.slug}` },
        ])}
      />

      <AvenloPageHeader
        eyebrow={`${dev.emirate.toUpperCase()} MASTER DEVELOPER`}
        title={dev.name}
        lead={dev.tagline}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Developers", href: "/developers" },
          { label: dev.name },
        ]}
        meta={
          <>
            <span>Direct Allocation Desk</span>
            <span className="text-[#cfcfcf]">·</span>
            <span>HQ: {dev.headquarters}</span>
            {dev.founded ? (
              <>
                <span className="text-[#cfcfcf]">·</span>
                <span>Est. {dev.founded}</span>
              </>
            ) : null}
          </>
        }
        actions={
          <>
            <BracketLink href="#enquire" variant="light" size="md">
              Request {dev.name} Inventory
            </BracketLink>
            <BracketLink href="/off-plan" variant="light" size="md">
              All UAE Releases
            </BracketLink>
          </>
        }
      />

      {/* Developer Overview & Metadata Table */}
      <section className="mx-auto max-w-[1260px] px-4 py-16 sm:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
          <div className="lg:col-span-7 space-y-5">
            {dev.logo ? (
              <div className="inline-flex h-16 items-center rounded-2xl border border-black/[0.06] bg-[#f7f7f7] px-6">
                <img
                  src={dev.logo}
                  alt={dev.name}
                  className="max-h-10 max-w-[180px] object-contain"
                />
              </div>
            ) : null}
            <h2 className="text-3xl font-medium tracking-[-0.03em] text-[#121212]">
              About {dev.name}
            </h2>
            <p className="text-[16px] leading-[1.7] text-[#4a4a4a]">{dev.about}</p>
            <p className="text-sm leading-relaxed text-[#737373]">
              <strong className="font-medium text-[#121212]">Known for:</strong> {dev.knownFor}
            </p>
          </div>

          <div className="lg:col-span-5 rounded-2xl border border-black/[0.07] bg-[#f7f7f7] p-6 sm:p-8">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b8b8b]">
              PROFILE SNAPSHOT
            </p>
            <dl className="mt-4 divide-y divide-black/[0.08] text-sm">
              {[
                ["Primary Emirate", dev.emirate],
                ["Headquarters", dev.headquarters],
                ["Signature Focus", dev.knownFor],
                ["Flagship Corridors", dev.flagshipAreas.join(", ") || "Dubai & UAE"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-start justify-between gap-4 py-3.5">
                  <dt className="shrink-0 text-[#737373]">{k}</dt>
                  <dd className="text-right font-medium text-[#121212]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Active Projects Grid */}
      <section className="border-y border-black/[0.06] bg-[#f7f7f7] py-16">
        <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
          <SectionEyebrow>{dev.name.toUpperCase()} PORTFOLIO</SectionEyebrow>
          <SplitHeading
            primary="Featured"
            muted="developments"
            size="md"
            inline
            className="mt-4"
          />

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dev.projects.map((proj) => (
              <Link
                key={proj.slug}
                href={`/off-plan/${proj.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-black/[0.07] bg-white transition-all hover:border-black/20 hover:shadow-[0_20px_50px_rgba(18,18,18,0.08)]"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#ececec]">
                  <img
                    src={proj.image}
                    alt={`${proj.name} by ${dev.name}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-medium text-[#121212]">
                    Architectural Visual
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#8b8b8b]">
                      {proj.community} · {proj.collection}
                    </p>
                    <h3 className="mt-2 text-xl font-medium tracking-[-0.025em] text-[#121212]">
                      {proj.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#666666]">
                      {proj.summary}
                    </p>
                  </div>
                  <div className="mt-5 flex items-center justify-end border-t border-black/[0.06] pt-4 text-xs font-medium text-[#121212] group-hover:text-[#0e9f6e]">
                    <span>Inspect Project</span>
                    <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ready / Secondary Listings by This Developer (if any) */}
      {devListings.length > 0 ? (
        <section className="mx-auto max-w-[1260px] px-4 py-16 sm:px-8">
          <SectionEyebrow>ON OUR BOOKS</SectionEyebrow>
          <SplitHeading
            primary={`Residences by ${dev.name}`}
            muted="available now"
            size="md"
            inline
            className="mt-4"
          />
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {devListings.map((l) => (
              <PropertyCard key={l.slug} listing={l} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Developer Allocation Enquiry */}
      <section id="enquire" className="mx-auto max-w-4xl px-4 py-16 sm:px-8">
        <EnquiryForm
          context="investment"
          developer={dev.name}
          heading={`Request ${dev.name} price list & availability`}
          subheading="Receive direct developer floor plans, milestone payment schedules, and escrow details."
        />
      </section>

      <CtaBanner />
    </div>
  );
}
