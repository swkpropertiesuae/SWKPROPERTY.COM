import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Globe2, Mail, MapPin, Phone, UserCheck } from "lucide-react"
import { SITE, team } from "@/lib/swk"
import { getListingsByAgent, listings } from "@/lib/listings"
import { buildMetadata, breadcrumbSchema } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"
import { PropertyCard } from "@/components/site/property-card"
import { EnquiryForm } from "@/components/site/enquiry-form"

const AGENT_DETAILS: Record<
  string,
  {
    communities: string[]
    bio: string
    backupAgent: string
  }
> = {
  "mohammad-haseeb": {
    communities: ["Downtown Dubai", "Dubai Hills Estate", "Dubai South", "Palm Jumeirah"],
    bio: "Mohammad Haseeb brings 10+ years of UAE real estate experience and 140+ verified transactions across Emaar, Azizi, Sobha Realty, DAMAC, and Imtiaz Developments.",
    backupAgent: "Mohammed Islam (Rex) · Assistant Director",
  },
  "mohammed-islam": {
    communities: ["Dubai Islands", "Downtown Dubai", "Yas Island", "Al Marjan Island"],
    bio: "Mohammed Islam (Rex) brings over a decade of international real estate experience across the United Kingdom and Dubai with 165+ verified transactions in sales, investment advisory, and client relationships.",
    backupAgent: "Mohammad Haseeb · Sales & Operations Manager",
  },
  "issaadi-chahrazed": {
    communities: ["Palm Jumeirah", "Dubai Marina", "Downtown Dubai", "Business Bay"],
    bio: "Issaadi Chahrazed advises French-, Arabic-, and English-speaking buyers across waterfront residences, branded developments, and high-yield city-centre apartments, coordinating remote viewings and power-of-attorney handovers.",
    backupAgent: "Talha Shabbir · Business Development Manager",
  },
  "talha-shabbir": {
    communities: ["Dubai Creek Harbour", "Dubai Hills Estate", "Mohammed Bin Rashid City", "Dubai South"],
    bio: "Talha Shabbir focuses on verified UAE developer launches, payment-plan structuring, and Oqood registration milestones across Emaar, Sobha, Imtiaz, DAMAC, and Azizi communities.",
    backupAgent: "Mohammad Haseeb · Sales & Operations Manager",
  },
  "fareed-choudhary": {
    communities: ["Dubai Hills Estate", "Masaar Sharjah", "Jumeirah Village Circle", "Business Bay"],
    bio: "Fareed Choudhary advises secondary-market buyers and portfolio landlords on ready villas, townhouses, and tenanted investments, preparing DLD transaction comparables and net-yield worksheets.",
    backupAgent: "Mohammad Haseeb · Sales & Operations Manager",
  },
  saifullah: {
    communities: ["Dubai South", "Al Jaddaf", "Dubailand", "Business Bay"],
    bio: "Saifullah specialises in high-demand off-plan launches including Imtiaz Kore, Azizi Florence, and Azizi Venice with flexible developer payment schedules.",
    backupAgent: "Talha Shabbir · Business Development Manager",
  },
  "mohammad-umar": {
    communities: ["Dubailand", "Dubai Islands", "Al Furjan", "Umm Al Quwain"],
    bio: "Mohammad Umar guides residential buyers and landlords through off-plan reservations and secondary resales across emerging UAE corridors.",
    backupAgent: "Fareed Choudhary · Senior Property Consultant",
  },
  "mohd-shahid-khan": {
    communities: ["Sheikh Zayed Road", "Downtown Dubai", "Business Bay"],
    bio: "Mohd Shahid Khan manages transaction operations, developer portal allocations, and SPA documentation across 500+ coordinated filings at SWK Properties.",
    backupAgent: "Mohammad Haseeb · Sales & Operations Manager",
  },
}

export function generateStaticParams() {
  return team.map((m) => ({ slug: m.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const member = team.find((m) => m.slug === slug)
  if (!member) {
    return buildMetadata({
      title: "Consultant Not Found",
      description: "Requested SWK consultant profile could not be found.",
      path: `/agents/${slug}`,
    })
  }
  return buildMetadata({
    title: `${member.name}, ${member.role}`,
    description: `Connect with ${member.name}, ${member.role} at SWK Properties Dubai (RERA ORN 51517). Speaks ${member.languages.join(", ")}. View active listings and book a viewing.`,
    path: `/agents/${member.slug}`,
    ogImage: member.photo,
  })
}

export default async function AgentProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const member = team.find((m) => m.slug === slug)
  if (!member) notFound()

  const details = AGENT_DETAILS[member.slug] ?? {
    communities: ["Downtown Dubai", "Dubai Marina"],
    bio: member.focus,
    backupAgent: "SWK Central Advisory Desk",
  }

  const agentListings = getListingsByAgent(member.slug)
  const displayListings = agentListings.length > 0 ? agentListings : listings.slice(0, 3)

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#17130e]">
      <JsonLd
        id="ld-agent-breadcrumb"
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About SWK", path: "/about" },
            { name: member.name, path: `/agents/${member.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": `${SITE.url}/agents/${member.slug}#person`,
            name: member.name,
            jobTitle: member.role,
            image: `${SITE.url}${member.photo}`,
            url: `${SITE.url}/agents/${member.slug}`,
            worksFor: { "@id": `${SITE.url}/#organization` },
            knowsLanguage: member.languages,
            areaServed: details.communities.map((name) => ({ "@type": "Place", name })),
            ...(member.brn ? { identifier: { "@type": "PropertyValue", name: "RERA BRN", value: member.brn } } : {}),
          },
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-12">
        <Link
          href="/about"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#94652c] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to SWK Advisory Team
        </Link>

        {/* Agent Profile Card (§14) */}
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 rounded-3xl border border-[#e6dfd2] bg-white p-6 md:p-10">
          <div className="lg:col-span-4">
            <div className="overflow-hidden rounded-3xl border border-[#e6dfd2] bg-black">
              <img
                src={member.photo}
                alt={member.name}
                className="h-96 w-full object-cover object-top"
              />
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="rounded-full border border-[#94652c]/35 bg-[#f6ead7] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#94652c]">
                  {member.role}
                </span>
                <span className="rounded-full border border-[#e6dfd2] bg-[#faf7f2] px-3.5 py-1 text-[11px] text-[#4a4237]">
                  RERA ORN {SITE.orn}
                  {member.brn ? ` · BRN ${member.brn}` : ""}
                </span>
              </div>

              <h1 className="mt-4 font-serif text-3xl md:text-5xl font-semibold text-[#17130e]">
                {member.name}
              </h1>
              <p className="mt-2 text-sm font-medium text-[#94652c]">{member.focus}</p>
              <p className="mt-4 text-sm md:text-base text-[#4a4237] leading-relaxed">
                {details.bio}
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#94652c]">
                    <Globe2 className="h-4 w-4" /> Languages Spoken
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {member.languages.map((lang) => (
                      <span
                        key={lang}
                        className="rounded-full border border-[#e6dfd2] px-3 py-1 text-xs text-[#17130e]"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#94652c]">
                    <MapPin className="h-4 w-4" /> Core Dubai Communities
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {details.communities.map((c) => (
                      <span
                        key={c}
                        className="rounded-full border border-[#e6dfd2] px-3 py-1 text-xs text-[#17130e]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Contact & Backup Contact (§14) */}
            <div className="border-t border-[#e6dfd2] pt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-3">
                <a
                  href={`tel:${SITE.phoneTel}`}
                  className="inline-flex items-center gap-2 rounded-full bg-[#17130e] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-white"
                >
                  <Phone className="h-3.5 w-3.5" /> Call {SITE.phone}
                </a>
                <a
                  href={`${SITE.whatsapp}?text=${encodeURIComponent(
                    `Hello ${member.name}, I viewed your consultant profile on SWK Properties and would like to arrange a consultation.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[#2f5d3a] bg-[#2f5d3a]/25 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-[#17130e] hover:bg-[#2f5d3a]/40"
                >
                  WhatsApp {member.name}
                </a>
                <a
                  href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Consultation with ${member.name}`)}`}
                  className="inline-flex items-center gap-2 rounded-full border border-[#e6dfd2] px-4 py-2.5 text-xs font-semibold text-[#17130e]"
                >
                  <Mail className="h-3.5 w-3.5 text-[#94652c]" /> {SITE.email}
                </a>
              </div>

              <div className="text-xs text-[#786e60] flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-[#94652c]" />
                <span>
                  Backup Contact: <strong className="text-[#17130e]">{details.backupAgent}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Listings Managed by Consultant */}
        <section className="mt-16">
          <h2 className="font-serif text-2xl md:text-4xl font-semibold text-[#17130e] mb-6">
            Active Properties & Shortlist Managed by {member.name}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {displayListings.map((l) => (
              <PropertyCard key={l.slug} listing={l} />
            ))}
          </div>
        </section>

        {/* Appointment Booking Form */}
        <section className="mt-16">
          <EnquiryForm
            context="viewing"
            agentName={member.name}
            subject={`Direct Consultation / Viewing Booking with ${member.name}`}
            heading={`Book an Appointment With ${member.name}`}
            subheading={`Select a preferred date and Gulf Standard Time (GST) slot, or request a general callback. Backup coverage is provided by ${details.backupAgent}.`}
          />
        </section>
      </div>
    </div>
  )
}
