import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, Building2, MapPin } from "lucide-react"
import { offPlanAreas, getOffPlanArea } from "@/lib/areas"
import { getDeveloper } from "@/lib/developers"
import { SITE } from "@/lib/swk"
import { buildMeta, breadcrumbLd, itemListLd, faqLd } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"
import { MapEmbed } from "@/components/site/map-embed"
import { EnquiryForm } from "@/components/site/enquiry-form"

export function generateStaticParams() {
  return offPlanAreas.map((a) => ({ area: a.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ area: string }> }): Promise<Metadata> {
  const area = getOffPlanArea((await params).area)
  if (!area) return {}
  return buildMeta({
    title: `Off-Plan Projects in ${area.name} (${area.projects.length} Launches)`,
    description: `${area.projects.length} off-plan projects in ${area.name} from ${area.developers.slice(0, 3).join(", ")}. Compare payment plans and handover with SWK Properties, RERA ORN ${SITE.orn}.`,
    path: `/off-plan/in/${area.slug}`,
    image: area.projects[0]?.image,
    keywords: [`off plan ${area.name}`, `new projects ${area.name}`, `${area.name} payment plan`, ...area.developers.map((d) => `${d} ${area.name}`)],
  })
}

export default async function OffPlanAreaPage({ params }: { params: Promise<{ area: string }> }) {
  const area = getOffPlanArea((await params).area)
  if (!area) notFound()

  const faqs = [
    {
      q: `How many off-plan projects in ${area.name} does SWK track?`,
      a: `SWK Properties currently tracks ${area.projects.length} off-plan launches in ${area.name} from ${area.developers.length} developer${area.developers.length > 1 ? "s" : ""}: ${area.developers.join(", ")}. Live availability and prices are confirmed with the developer before any reservation.`,
    },
    {
      q: `Do I pay commission when buying off-plan in ${area.name}?`,
      a: "On primary developer sales the developer normally pays the brokerage commission. Buyers pay the DLD 4% registration fee (Oqood) plus an admin fee, and the developer's payment plan instalments into the project escrow account.",
    },
    {
      q: `Can foreigners buy off-plan property in ${area.name}?`,
      a: `Foreign nationals can buy freehold property in designated freehold areas. SWK confirms the title type of each ${area.name} project and the escrow registration before you reserve.`,
    },
  ]

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 text-[#0f2244]">
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
          faqLd(faqs),
        ]}
      />

      <nav aria-label="Breadcrumb" className="text-xs text-[#5f6a82]">
        <Link href="/" className="hover:text-[#94652c]">Home</Link> / <Link href="/off-plan" className="hover:text-[#94652c]">Off-Plan</Link> / {area.name}
      </nav>

      <header className="max-w-3xl space-y-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#94652c]">{area.projects.length} tracked launches</span>
        <h1 className="font-serif text-3xl font-semibold md:text-5xl">Off-plan projects in {area.name}</h1>
        <p className="text-sm leading-relaxed text-[#39455a]">
          {area.name} has {area.projects.length} off-plan launches on SWK&apos;s tracker from {area.developers.join(", ")}. Each page
          below covers the developer, payment-plan structure and what to check before reserving. All buyers sign the developer SPA and
          register the unit with the Dubai Land Department (Oqood) or the relevant emirate&apos;s land registry.
        </p>
        {area.communityGuideSlug ? (
          <Link href={`/communities/${area.communityGuideSlug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#94652c] hover:underline">
            Read the {area.name} community guide <ArrowRight className="h-4 w-4" />
          </Link>
        ) : null}
      </header>

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {area.projects.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/off-plan/${p.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#e6dfd2] bg-white transition hover:-translate-y-1 hover:border-[#94652c] hover:shadow-lg"
            >
              <div className="h-48 overflow-hidden bg-[#0f2244]">
                <img src={p.thumb || p.image} alt={`${p.name} by ${p.devName}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                {getDeveloper(p.developerSlug)?.logo ? (
                  <img src={getDeveloper(p.developerSlug)!.logo} alt={p.devName} className="h-5 w-auto max-w-[120px] object-contain object-left" />
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#94652c]">
                    <Building2 className="h-3.5 w-3.5" aria-hidden /> {p.devName}
                  </span>
                )}
                <h2 className="font-serif text-xl font-semibold">{p.name}</h2>
                <p className="line-clamp-3 text-xs leading-relaxed text-[#39455a]">{p.summary || p.blurb}</p>
                <span className="mt-auto inline-flex items-center gap-1 text-xs text-[#5f6a82]">
                  <MapPin className="h-3.5 w-3.5" aria-hidden /> {p.community}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <MapEmbed query={`${area.name}, UAE`} zoom={13} title={`${area.name} — map`} />

      <section className="max-w-3xl space-y-4">
        <h2 className="font-serif text-2xl font-semibold">{area.name} off-plan FAQs</h2>
        {faqs.map((f) => (
          <details key={f.q} className="rounded-2xl border border-[#e6dfd2] bg-white p-4">
            <summary className="cursor-pointer text-sm font-semibold">{f.q}</summary>
            <p className="mt-2 text-sm leading-relaxed text-[#39455a]">{f.a}</p>
          </details>
        ))}
      </section>

      <section>
        <h2 className="mb-3 font-serif text-2xl font-semibold">Other off-plan areas</h2>
        <ul className="flex flex-wrap gap-2 text-xs">
          {offPlanAreas
            .filter((a) => a.slug !== area.slug)
            .map((a) => (
              <li key={a.slug}>
                <Link href={`/off-plan/in/${a.slug}`} className="inline-block rounded-full border border-[#e6dfd2] bg-white px-3 py-1.5 hover:border-[#94652c]">
                  {a.name} ({a.projects.length})
                </Link>
              </li>
            ))}
        </ul>
      </section>

      <section className="mx-auto max-w-4xl">
        <EnquiryForm context="investment" community={area.name} heading={`Shortlist ${area.name} off-plan projects`} />
      </section>
    </div>
  )
}
