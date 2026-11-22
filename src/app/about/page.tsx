import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { SITE, stats, team } from "@/lib/swk";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { AvenloPageHeader } from "@/components/avenlo/page-header";
import { BracketLink } from "@/components/avenlo/bracket-button";
import {
  CtaBanner,
  ScrollRevealStatement,
  SectionEyebrow,
  SplitHeading,
} from "@/components/avenlo/motion";

export const metadata: Metadata = buildMetadata({
  title: "About SWK Properties — Sheikh Zayed Road, Dubai",
  description:
    "Backed by 18+ years of UAE real estate advisory across premier master developers, SWK Properties (RERA ORN 51517) operates from 25th Floor, Al Saqr Building, Sheikh Zayed Road.",
  path: "/about",
  keywords: [
    "About SWK Properties Dubai",
    "Al Saqr Building real estate brokerage",
    "Sheikh Zayed Road property consultants",
    "SWK Properties team",
  ],
});

const STRIP_PHOTOS = [
  { src: "/img/about/al-saqr-suite.webp", alt: "SWK Private Consultation Suite — 25th Floor, Al Saqr Building" },
  { src: "/img/about/al-saqr-boardroom.webp", alt: "SWK Properties Dubai Advisory Gallery — Sheikh Zayed Road" },
  { src: "/img/about/architectural-atrium.webp", alt: "Dubai contemporary architectural atrium" },
  { src: "/img/about/waterfront-vertical.webp", alt: "Dubai waterfront skyline at golden hour" },
];

export default function AboutPage() {
  return (
    <div className="bg-transparent">
      <JsonLd
        id="ld-about-breadcrumb"
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About SWK Properties", path: "/about" },
        ])}
      />

      <AvenloPageHeader
        eyebrow={`ABOUT SWK PROPERTIES · RERA ORN ${SITE.reraOrn}`}
        title="Advising Dubai buyers"
        italic="since 2008"
        lead="We built SWK Properties around a straightforward standard: real estate decisions should be led by developer delivery history, floor-plate comparisons, and written DLD cost sheets before any deposit."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "About" },
        ]}
        actions={
          <>
            <BracketLink href="/agents" variant="light" size="md">
              Meet Our Advisors
            </BracketLink>
            <BracketLink href="/contact" variant="light" size="md">
              Visit Sheikh Zayed Road
            </BracketLink>
          </>
        }
      />

      {/* Avenlo Arched / Editorial Horizontal Photo Strip */}
      <section className="mx-auto max-w-[1260px] px-4 py-12 sm:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {STRIP_PHOTOS.map((photo, idx) => (
            <div
              key={photo.src}
              className={`overflow-hidden bg-[#f5f5f5] ${
                idx % 2 === 0 ? "rounded-2xl" : "rounded-t-[100px] rounded-b-2xl"
              }`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Scroll-Reveal Firm Philosophy */}
      <section className="mx-auto max-w-[1060px] px-4 py-16 sm:px-8">
        <div className="rounded-3xl border border-white/80 bg-white/76 p-7 sm:p-11 shadow-[0_20px_54px_rgba(12,56,96,0.09)] backdrop-blur-2xl">
          <ScrollRevealStatement text="Eighteen years in Dubai have taught us that the right address is rarely the loudest launch — it is the building whose floor plans, developer escrow, and rental demand still hold up five years later." />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            {
              title: "Evidence Over Brochures",
              body: "Every shortlist pairs recent DLD achieved transfers and realistic Mollak service charges alongside developer payment plans.",
            },
            {
              title: "Direct Developer Access",
              body: "Active agency agreements across Nakheel, Binghatti, Emaar, DAMAC, Azizi, Sobha Realty, Omniyat, Aldar, Ellington, and leading UAE master developers.",
            },
            {
              title: "RERA & DLD Governance",
              body: `Registered Dubai brokerage (RERA ORN ${SITE.reraOrn}) adhering strictly to Form A, Form F, Trakheesi, Oqood, and Ejari compliance.`,
            },
          ].map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-2xl border border-white/80 bg-white/80 backdrop-blur-xl shadow-[0_14px_40px_rgba(12,56,96,0.08)] p-6"
            >
              <h2 className="text-lg font-medium tracking-[-0.02em] text-[#121212]">
                {pillar.title}
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-[#666666]">{pillar.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Track Record Obsidian Strip */}
      <section className="bg-[#121212] py-20 text-white">
        <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((st) => (
              <div
                key={st.label}
                className="rounded-2xl bg-white p-7 text-[#121212]"
              >
                <p className="text-4xl sm:text-5xl font-medium tracking-[-0.045em] tabular-nums">
                  {st.value}
                  {st.suffix}
                </p>
                <p className="mt-3 text-xs font-medium text-[#737373]">{st.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advisory Team Preview */}
      <section className="mx-auto max-w-[1260px] px-4 py-20 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionEyebrow>THE ADVISORY DESK</SectionEyebrow>
            <SplitHeading
              primary="The people you will"
              muted="actually deal with"
              size="md"
              className="mt-4"
            />
          </div>
          <BracketLink href="/agents" variant="light" size="sm">
            Meet Our Team
          </BracketLink>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.slice(0, 4).map((member) => (
            <Link
              key={member.slug}
              href={`/agents/${member.slug}`}
              className="group overflow-hidden rounded-2xl border border-white/80 bg-white/84 backdrop-blur-xl shadow-[0_14px_40px_rgba(12,56,96,0.08)] transition-all hover:border-black/20"
            >
              <div className="aspect-[4/5] w-full overflow-hidden bg-[#f5f5f5]">
                <img
                  src={member.photo}
                  alt={member.name}
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-5 flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-medium text-[#121212]">{member.name}</h3>
                  <p className="mt-0.5 text-xs text-[#8b8b8b]">{member.role}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-[#8b8b8b] group-hover:text-[#121212]" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Sheikh Zayed Road Office + Consultation */}
      <section className="border-t border-white/60 bg-white/24 backdrop-blur-[2px] py-20">
        <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
            <div className="lg:col-span-5 space-y-5">
              <SectionEyebrow>DUBAI HEADQUARTERS</SectionEyebrow>
              <SplitHeading
                primary="Al Saqr Building,"
                muted="Sheikh Zayed Road"
                size="md"
              />
              <p className="text-sm leading-relaxed text-[#525252]">
                Visit our 25th-floor consultation suite at Al Saqr Building for private floor-plan walkthroughs, developer portfolio briefings, or Form A / Form F documentation.
              </p>
              <div className="rounded-2xl border border-white/80 bg-white/84 backdrop-blur-xl shadow-[0_16px_44px_rgba(12,56,96,0.08)] p-6 text-xs text-[#525252] space-y-2.5">
                <div className="flex items-center gap-2 font-medium text-[#121212]">
                  <ShieldCheck className="h-4 w-4 text-[#0e9f6e]" />
                  <span>{SITE.legalName} · RERA ORN {SITE.reraOrn}</span>
                </div>
                <p>{SITE.address.full}</p>
                <p>{SITE.hours.full}</p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <EnquiryForm
                context="advisory"
                heading="Schedule an office meeting or call"
                subheading="Speak directly with our advisory desk in English, Arabic, Urdu, Hindi, or French."
              />
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
