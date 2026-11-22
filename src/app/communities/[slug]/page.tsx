import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, Minus } from "lucide-react";
import { communityGuides, getCommunityGuide } from "@/lib/communities";
import { getListingsByCommunity } from "@/lib/listings";
import { projects } from "@/lib/developers";
import { PropertyCard } from "@/components/site/property-card";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd, buildMeta, placeLd } from "@/lib/seo";
import { SITE } from "@/lib/swk";
import { MapEmbed } from "@/components/site/map-embed";
import { AvenloPageHeader } from "@/components/avenlo/page-header";
import { BracketLink } from "@/components/avenlo/bracket-button";
import { CtaBanner, SectionEyebrow, SplitHeading } from "@/components/avenlo/motion";

export function generateStaticParams() {
  return communityGuides.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const comm = getCommunityGuide(slug);
  if (!comm) {
    return buildMeta({
      title: "Community Not Found",
      description: "Explore Dubai community guides with SWK Properties.",
      path: "/communities",
    });
  }

  return buildMeta({
    title: `${comm.name} Guide | Properties, Schools & Pros/Cons`,
    description: `${comm.blurb} Explore properties, transport links, schools, and balanced pros & drawbacks in ${comm.name} with SWK Properties (ORN ${SITE.reraOrn}).`,
    path: `/communities/${comm.slug}`,
    image: comm.image,
    keywords: [
      comm.name,
      `${comm.name} properties for sale`,
      `${comm.name} apartments for rent`,
      `living in ${comm.name}`,
    ],
  });
}

export default async function CommunityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const comm = getCommunityGuide(slug);
  if (!comm) notFound();

  const commListings = getListingsByCommunity(comm.slug);
  const commProjects = projects
    .filter((p) => p.community.toLowerCase().includes(comm.name.toLowerCase().split(" ")[0]))
    .slice(0, 6);

  return (
    <div className="bg-white">
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Communities", path: "/communities" },
            { name: comm.name, path: `/communities/${comm.slug}` },
          ]),
          placeLd({
            name: comm.name,
            description: comm.overview,
            slug: comm.slug,
            lat: comm.lat,
            lng: comm.lng,
            image: comm.image,
          }),
        ]}
      />

      <AvenloPageHeader
        eyebrow="DUBAI COMMUNITY GUIDE"
        title={comm.name}
        lead={comm.blurb}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Communities", href: "/communities" },
          { label: comm.name },
        ]}
        actions={
          <>
            <BracketLink href={`/properties?community=${comm.slug}`} variant="light" size="md">
              Browse {comm.name} Listings
            </BracketLink>
            <BracketLink href="#enquire" variant="light" size="md">
              Speak to Area Specialist
            </BracketLink>
          </>
        }
      />

      {/* Full-Width Community Image */}
      <section className="mx-auto max-w-[1260px] px-4 py-12 sm:px-8">
        <div className="overflow-hidden rounded-2xl bg-[#f5f5f5]">
          <img
            src={comm.image}
            alt={comm.name}
            className="h-[320px] sm:h-[480px] md:h-[560px] w-full object-cover"
          />
        </div>

        {/* Overview + Lifestyle */}
        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-5">
            <SectionEyebrow>NEIGHBOURHOOD OVERVIEW</SectionEyebrow>
            <h2 className="text-3xl font-medium tracking-[-0.035em] text-[#121212]">
              Living &amp; investing in {comm.name}
            </h2>
            <p className="text-[16px] leading-[1.7] text-[#4a4a4a]">{comm.overview}</p>
            <p className="text-sm leading-relaxed text-[#737373]">
              <strong className="font-medium text-[#121212]">Lifestyle:</strong> {comm.lifestyle}
            </p>
          </div>

          <div className="lg:col-span-5 rounded-2xl border border-black/[0.06] bg-[#f7f7f7] p-6 sm:p-8 space-y-5">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b8b8b]">
                PROPERTY TYPES
              </p>
              <ul className="mt-3 space-y-2 text-sm text-[#121212]">
                {comm.propertyTypes.map((pt) => (
                  <li key={pt} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#121212]" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-black/[0.08] pt-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b8b8b]">
                BEST SUITED FOR
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {comm.bestFor.map((bf) => (
                  <span
                    key={bf}
                    className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-[#121212]"
                  >
                    {bf}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Balanced Pros & Practical Considerations */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-black/[0.06] bg-[#f7f7f7] p-7">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#0e9f6e]">
              KEY ADVANTAGES
            </p>
            <ul className="mt-5 space-y-3 text-sm text-[#121212]">
              {comm.pros.map((p) => (
                <li key={p} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#0e9f6e]" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-black/[0.06] bg-[#f7f7f7] p-7">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b8b8b]">
              PRACTICAL CONSIDERATIONS
            </p>
            <ul className="mt-5 space-y-3 text-sm text-[#525252]">
              {comm.drawbacks.map((d) => (
                <li key={d} className="flex items-start gap-2.5">
                  <Minus className="mt-0.5 h-4 w-4 shrink-0 text-[#8b8b8b]" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Transport, Schools & Amenities */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { title: "Connectivity & Transport", list: comm.transport },
            { title: "Schools & Healthcare", list: comm.schoolsHealth },
            { title: "District Amenities", list: comm.amenities },
          ].map((box) => (
            <div
              key={box.title}
              className="rounded-2xl border border-black/[0.07] bg-white p-6"
            >
              <h3 className="text-base font-medium text-[#121212]">{box.title}</h3>
              <ul className="mt-4 space-y-2.5 text-xs leading-relaxed text-[#525252]">
                {box.list.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <MapEmbed lat={comm.lat} lng={comm.lng} zoom={13} title={`${comm.name}, Dubai`} />
        </div>
      </section>

      {/* Listings in Community */}
      {commListings.length > 0 ? (
        <section className="border-t border-black/[0.06] bg-[#f7f7f7] py-16">
          <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
            <SectionEyebrow>ON OUR BOOKS</SectionEyebrow>
            <SplitHeading
              primary={`Properties in ${comm.name}`}
              muted="available now"
              size="md"
              inline
              className="mt-4"
            />
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {commListings.map((l) => (
                <PropertyCard key={l.slug} listing={l} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Tracked Off-Plan Launches Nearby */}
      {commProjects.length > 0 ? (
        <section className="mx-auto max-w-[1260px] px-4 py-16 sm:px-8">
          <SectionEyebrow>OFF-PLAN LAUNCHES</SectionEyebrow>
          <SplitHeading
            primary={`New launches in & around`}
            muted={comm.name}
            size="md"
            inline
            className="mt-4"
          />
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {commProjects.map((p) => (
              <Link
                key={p.slug}
                href={`/off-plan/${p.slug}`}
                className="group overflow-hidden rounded-2xl border border-black/[0.07] bg-white hover:border-black/20"
              >
                <div className="aspect-[16/10] w-full overflow-hidden bg-[#ececec]">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#8b8b8b]">
                      {p.developer}
                    </p>
                    <h3 className="mt-1 text-lg font-medium text-[#121212]">{p.name}</h3>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-[#8b8b8b] group-hover:text-[#121212]" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section id="enquire" className="mx-auto max-w-4xl px-4 py-16 sm:px-8">
        <EnquiryForm
          context="advisory"
          community={comm.name}
          heading={`Speak to our ${comm.name} specialist`}
          subheading="Get building-by-building comparable prices, service charges, and upcoming launch allocations."
        />
      </section>

      <CtaBanner />
    </div>
  );
}
