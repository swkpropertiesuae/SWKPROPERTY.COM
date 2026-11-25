import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Mail, Phone } from "lucide-react";
import { SITE, team } from "@/lib/swk";
import { getListingsByAgent, listings } from "@/lib/listings";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { PropertyCard } from "@/components/site/property-card";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { AvenloPageHeader } from "@/components/avenlo/page-header";
import { BracketLink } from "@/components/avenlo/bracket-button";
import { CtaBanner, SectionEyebrow, SplitHeading } from "@/components/avenlo/motion";

const AGENT_COMMUNITIES: Record<string, string[]> = {
  "mohammad-haseeb": ["Downtown Dubai", "Dubai Hills Estate", "Dubai South", "Palm Jumeirah"],
  "mohammed-islam": ["Dubai Islands", "Downtown Dubai", "Yas Island", "Al Marjan Island"],
  "issaadi-chahrazed": ["Palm Jumeirah", "Dubai Marina", "Downtown Dubai", "Business Bay"],
  "talha-shabbir": ["Dubai Creek Harbour", "Dubai Hills Estate", "MBR City", "Dubai South"],
  "fareed-choudhary": ["Dubai Hills Estate", "Masaar Sharjah", "JVC", "Business Bay"],
  saifullah: ["Dubai South", "Al Jaddaf", "Dubailand", "Business Bay"],
  "mohammad-umar": ["Dubailand", "Dubai Islands", "Al Furjan", "Umm Al Quwain"],
  "sanket-katariya": ["JVC", "DLRC", "Dubai Silicon Oasis", "Dubai South"],
  "mohd-shahid-khan": ["Sheikh Zayed Road", "Downtown Dubai", "Business Bay"],
};

export function generateStaticParams() {
  return team.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const member = team.find((m) => m.slug === slug);
  if (!member) {
    return buildMetadata({
      title: "Advisor Not Found",
      description: "Meet SWK Properties Dubai real estate advisors.",
      path: "/agents",
      noIndex: true,
    });
  }
  return buildMetadata({
    title: `${member.name} — ${member.role}`,
    description: `${member.bio} Contact ${member.name} at SWK Properties Dubai (RERA ORN ${SITE.reraOrn}).`,
    path: `/agents/${member.slug}`,
    ogImage: member.photo,
  });
}

export default async function AgentProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = team.find((m) => m.slug === slug);
  if (!member) notFound();

  const assigned = getListingsByAgent(member.slug);
  const shownListings = assigned.length > 0 ? assigned : listings.slice(0, 3);
  const areas = AGENT_COMMUNITIES[member.slug] ?? ["Dubai", "Sheikh Zayed Road"];

  return (
    <div className="bg-transparent">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Advisors", path: "/agents" },
          { name: member.name, path: `/agents/${member.slug}` },
        ])}
      />

      <AvenloPageHeader
        eyebrow={member.role}
        title={member.name}
        compact
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Advisors", href: "/agents" },
          { label: member.name },
        ]}
        meta={
          <>
            <span>{member.experienceYears}</span>
            <span className="text-[#cfcfcf]">·</span>
            <span>
              {member.languages.join(", ")}
              {member.addonLanguages.length > 0
                ? ` · Add-on: ${member.addonLanguages.join(", ")}`
                : ""}
            </span>
            {member.brn ? (
              <>
                <span className="text-[#cfcfcf]">·</span>
                <span>RERA BRN {member.brn}</span>
              </>
            ) : null}
          </>
        }
      />

      {/* Avenlo 2-Column Studio Portrait + Editorial Dossier */}
      <section className="mx-auto max-w-[1260px] px-4 py-14 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-[#f5f5f5]">
              <img
                src={member.photo}
                alt={member.name}
                className="aspect-[4/5] w-full object-cover object-top"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-8">
            <div>
              <SectionEyebrow>ABOUT</SectionEyebrow>
              <p className="mt-4 text-[17px] leading-[1.7] text-[#333333]">{member.bio}</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 border-y border-black/[0.08] py-7">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b8b8b]">
                  CORE SPECIALTIES
                </p>
                <ul className="mt-3.5 space-y-2.5 text-sm text-[#121212]">
                  {member.specialties.map((s) => (
                    <li key={s} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#0e9f6e]" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b8b8b]">
                  FOCUS DEVELOPERS &amp; AREAS
                </p>
                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {member.topDevelopers.map((dev) => (
                    <span
                      key={dev}
                      className="rounded-full border border-black/10 bg-[#f7f7f7] px-3 py-1 text-xs font-medium text-[#121212]"
                    >
                      {dev}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-xs text-[#737373]">
                  Corridors: <strong className="font-medium text-[#121212]">{areas.join(" · ")}</strong>
                </p>
              </div>
            </div>

            {/* Language Skills */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#8b8b8b] mr-1">
                Languages:
              </span>
              {member.languages.map((lang) => (
                <span
                  key={lang}
                  className="rounded-full border border-black/10 bg-white px-3 py-1 font-medium text-[#121212]"
                >
                  {lang}
                </span>
              ))}
              {member.addonLanguages.map((lang) => (
                <span
                  key={lang}
                  className="rounded-full border border-[#0e9f6e]/30 bg-[#0e9f6e]/10 px-3 py-1 font-medium text-[#0b7a55]"
                >
                  + {lang} (Add-on)
                </span>
              ))}
            </div>

            {/* Direct Contact Strip */}
            <div className="flex flex-wrap items-center gap-5">
              <BracketLink href="#enquire" variant="light" size="md">
                Book a Call
              </BracketLink>
              <a
                href={`tel:${member.phoneRaw}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#121212] hover:text-[#0e9f6e]"
              >
                <Phone className="h-4 w-4" />
                <span>{member.phoneDisplay}</span>
              </a>
              <a
                href={`${member.whatsappUrl}?text=${encodeURIComponent(
                  `Hello ${member.name}, I would like to discuss Dubai property advisory with SWK Properties.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#0e9f6e]/30 bg-[#0e9f6e]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#0b7a55] transition-colors hover:bg-[#0e9f6e] hover:text-white"
              >
                <WhatsAppIcon className="h-3.5 w-3.5" />
                <span>WhatsApp</span>
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex items-center gap-2 text-sm text-[#525252] hover:text-[#121212]"
              >
                <Mail className="h-4 w-4" />
                <span>{SITE.email}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Currently on Our Books */}
      <section className="border-y border-white/60 bg-white/24 backdrop-blur-[2px] py-16">
        <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionEyebrow>CURRENTLY ON OUR BOOKS</SectionEyebrow>
              <SplitHeading
                primary={`Selected residences`}
                muted={`advised by ${member.name.split(" ")[0]}`}
                size="md"
                inline
                className="mt-4"
              />
            </div>
            <Link
              href="/properties"
              className="text-xs font-medium uppercase tracking-[0.14em] text-[#121212] underline underline-offset-4"
            >
              All Properties →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {shownListings.slice(0, 3).map((item) => (
              <PropertyCard key={item.slug} listing={item} />
            ))}
          </div>
        </div>
      </section>

      <section id="enquire" className="mx-auto max-w-4xl px-4 py-16 sm:px-8">
        <EnquiryForm
          context="advisory"
          agentSlug={member.slug}
          agentName={member.name}
          heading={`Message ${member.name} directly`}
          subheading="Your brief is routed directly to this advisor at our Sheikh Zayed Road desk."
        />
      </section>

      <CtaBanner />
    </div>
  );
}
