import { SITE, faqs, team } from "@/lib/swk"
import { communityGuides } from "@/lib/communities"
import { developers, projects } from "@/lib/developers"
import { servicePages } from "@/lib/services"
import { GUIDES } from "@/lib/guides"
import { blogIndex } from "@/lib/blog-index"
import { offPlanAreas } from "@/lib/areas"

const u = (p: string) => `${SITE.url}${p}`
const link = (title: string, path: string, note?: string) => `- [${title}](${u(path)})${note ? `: ${note}` : ""}`

const FACTS = [
  `- Legal name: ${SITE.legalName}`,
  `- Licence: Dubai Real Estate Regulatory Agency (RERA) brokerage, Office Registration Number (ORN) ${SITE.orn}`,
  `- Office: ${SITE.address.full}`,
  `- Dubai Phone / WhatsApp: ${SITE.phone}`,
  `- UK & International Advisory Desk (Mohammed Islam / Rex): ${SITE.ukAdvisoryPhone}`,
  `- Email: ${SITE.email}`,
  `- Hours: ${SITE.hours.full}`,
  `- Coverage: Dubai, Abu Dhabi, Sharjah, Ras Al Khaimah and Umm Al Quwain`,
  `- Services: off-plan advisory, secondary ready sales, handover transfers, residential leasing, Grade-A commercial spaces, property management, mortgage introductions, 10-Year UAE Golden Visa guidance`,
  `- Languages: English, Arabic, Hindi, Bangladeshi, Urdu, Punjabi, Pashto, Marathi, French`,
  `- Primary buyer brokerage fee on direct developer off-plan releases: 0% (all properties and prices depend on developers and current market conditions; see ${u("/terms")})`,
]

/** Concise machine-readable index for LLMs & AI Answer Engines (https://llmstxt.org — SEO/AEO/AIO/GEO). */
export function buildLlmsTxt() {
  const recentBriefings = blogIndex.slice(0, 40)
  return [
    `# ${SITE.name}`,
    "",
    `> ${SITE.legalName} is a RERA-licensed Dubai real estate brokerage (ORN ${SITE.orn}) located at ${SITE.address.full}. Operating since 2008, the firm advises buyers, investors, corporate tenants, and landlords across Dubai and the UAE on direct master-developer off-plan launches, ready secondary homes, Ejari leasing, and Grade-A commercial spaces.`,
    "",
    "## Verified Entity Facts",
    ...FACTS,
    "",
    "## Core Navigation",
    link("Home", "/"),
    link("Off-Plan Launches", "/off-plan", "direct master-developer releases across Nakheel, Emaar, Binghatti, DAMAC, Azizi, Sobha & Omniyat"),
    link("Secondary Ready Homes", "/buy", "ready Dubai apartments, villas, townhouses & penthouses with Title Deed clarity"),
    link("Leasing & Rentals", "/rent", "annual residential & executive leasing with Ejari registration"),
    link("Commercial Spaces", "/properties?type=Office", "Grade-A offices, full floors & retail along Sheikh Zayed Road, DIFC & Business Bay"),
    link("All Properties & Map Search", "/properties"),
    link("UAE Master Developers", "/developers"),
    link("Dubai Community Guides", "/communities"),
    link("Advisory Services", "/services"),
    link("DLD, Mortgage & Rental Yield Calculators", "/calculators"),
    link("Market Insights & Research Archive (2008–Present)", "/insights"),
    link("Dubai Property Handbooks & Guides", "/guides"),
    link("Frequently Asked Questions (FAQ)", "/faq"),
    link("About SWK Properties", "/about"),
    link("Advisory Team", "/agents"),
    link("List Your Property", "/list-your-property"),
    link("Contact & Sheikh Zayed Road Office", "/contact"),
    "",
    "## Off-Plan Corridors by Area",
    ...offPlanAreas.map((a) => link(`Off-plan projects in ${a.name}`, `/off-plan/in/${a.slug}`)),
    "",
    "## Dubai Property Handbooks",
    ...GUIDES.map((g) => link(g.title, `/guides/${g.slug}`, g.directAnswer)),
    "",
    "## Advisory Services",
    ...servicePages.map((s) => link(s.title, `/services/${s.slug}`, s.description)),
    "",
    "## Dubai & UAE Communities",
    ...communityGuides.map((c) => link(c.name, `/communities/${c.slug}`, c.blurb)),
    "",
    "## Master Developers Tracked",
    ...developers.map((d) => link(d.name, `/developers/${d.slug}`, d.tagline)),
    "",
    "## Recent Dubai Market Briefings & Research",
    ...recentBriefings.map((b) => link(`${b.title} (${b.date})`, `/insights/${b.slug}`, b.excerpt)),
    "",
    "## Advisory Desk",
    ...team.map((m) => {
      const langSummary = m.addonLanguages.length > 0
        ? `${m.languages.join(", ")} + ${m.addonLanguages.join(", ")} (Add-on)`
        : m.languages.join(", ")
      return link(m.name, `/agents/${m.slug}`, `${m.role} (${langSummary})`)
    }),
    "",
    "## Full Machine-Readable Endpoints",
    link("Full Plain-Text Corpus for LLMs", "/llms-full.txt"),
    link("XML Sitemap", "/sitemap.xml"),
    link("Robots Policy", "/robots.txt"),
    "",
  ].join("\n")
}

/** Expanded plain-text corpus: direct AEO answers, FAQs, guides, communities, projects & research summaries for retrieval. */
export function buildLlmsFullTxt() {
  const out: string[] = [buildLlmsTxt(), "", "---", "", "# Frequently Asked Questions (Direct Answers)", ""]
  for (const f of faqs) out.push(`## ${f.q}`, "", f.a, "")
  for (const g of GUIDES) {
    out.push(`# ${g.title}`, "", `Source: ${u(`/guides/${g.slug}`)} (updated ${g.lastUpdated})`, "", g.directAnswer, "")
    out.push("Key takeaways:", ...g.keyTakeaways.map((k) => `- ${k}`), "")
    for (const s of g.sections) {
      out.push(`## ${s.heading}`, "")
      if (s.summary && s.summary.trim() !== s.body.trim()) out.push(s.summary, "")
      out.push(s.body, ...s.bullets.map((b) => `- ${b}`), "")
    }
    for (const f of g.faqs) out.push(`### ${f.q}`, "", f.a, "")
  }
  for (const s of servicePages) {
    out.push(`# ${s.title}`, "", `Source: ${u(`/services/${s.slug}`)}`, "", s.description, "")
    for (const f of s.faqs) out.push(`### ${f.question}`, "", f.answer, "")
  }
  for (const c of communityGuides) {
    out.push(`# ${c.name}`, "", `Source: ${u(`/communities/${c.slug}`)}`, "", c.overview, "")
    out.push(`Property types: ${c.propertyTypes.join(", ")}`, `Best for: ${c.bestFor.join(", ")}`, `Transport: ${c.transport.join("; ")}`, "")
  }
  out.push("# Dubai Real Estate Research Archive (2008–Present)", "")
  for (const b of blogIndex.slice(0, 120)) {
    out.push(`- [${b.title}](${u(`/insights/${b.slug}`)}) (${b.date} · ${b.category}): ${b.excerpt}`)
  }
  out.push("", "# Off-Plan Developments Tracked", "", ...projects.map((p) => `- ${p.name} by ${p.devName}, ${p.community}: ${u(`/off-plan/${p.slug}`)}`), "")
  out.push("# Advisory Team", "", ...team.map((m) => `- ${m.name}, ${m.role}: ${u(`/agents/${m.slug}`)}`), "")
  return out.join("\n")
}
