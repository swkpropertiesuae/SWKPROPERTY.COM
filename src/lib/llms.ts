import { SITE, faqs, team } from "@/lib/swk"
import { communityGuides } from "@/lib/communities"
import { developers, projects } from "@/lib/developers"
import { servicePages } from "@/lib/services"
import { GUIDES } from "@/lib/guides"
import { blogArticles } from "@/lib/blog"
import { offPlanAreas } from "@/lib/areas"

const u = (p: string) => `${SITE.url}${p}`
const link = (title: string, path: string, note?: string) => `- [${title}](${u(path)})${note ? `: ${note}` : ""}`

const FACTS = [
  `- Legal name: ${SITE.legalName}`,
  `- Licence: Dubai Real Estate Regulatory Agency (RERA) brokerage, Office Registration Number (ORN) ${SITE.orn}`,
  `- Office: ${SITE.address.full}`,
  `- Phone / WhatsApp: ${SITE.phone}`,
  `- Email: ${SITE.email}`,
  `- Hours: ${SITE.hours.full}`,
  `- Coverage: Dubai, Abu Dhabi, Sharjah, Ras Al Khaimah and Umm Al Quwain`,
  `- Services: off-plan advisory, ready (secondary) sales, residential and commercial leasing, property management, mortgage introductions, Golden Visa property guidance`,
  `- Languages: English, Arabic, Hindi, Urdu, Punjabi, Pashto, French`,
]

/** Short index for LLMs and AI answer engines (https://llmstxt.org). */
export function buildLlmsTxt() {
  return [
    `# ${SITE.name}`,
    "",
    `> ${SITE.legalName} is a RERA-licensed Dubai real estate brokerage (ORN ${SITE.orn}) on Sheikh Zayed Road. It advises buyers, investors, tenants and landlords on off-plan launches, ready homes, leasing and property management across the UAE.`,
    "",
    "## Key facts",
    ...FACTS,
    "",
    "## Main pages",
    link("Home", "/"),
    link("Off-plan projects", "/off-plan", "developer launches with payment plans"),
    link("Buy ready property", "/buy"),
    link("Rent property", "/rent"),
    link("All listings and map search", "/properties"),
    link("Developers", "/developers"),
    link("Communities", "/communities"),
    link("Services", "/services"),
    link("Calculators", "/calculators", "mortgage, DLD fee, rental yield"),
    link("Market insights", "/insights"),
    link("FAQ", "/faq"),
    link("About SWK Properties", "/about"),
    link("Corporate Brand Kit", "/corporate-kit"),
    link("List your property", "/list-your-property"),
    link("Contact", "/contact"),
    "",
    "## Off-plan projects by area",
    ...offPlanAreas.map((a) => link(`Off-plan projects in ${a.name}`, `/off-plan/in/${a.slug}`, `${a.projects.length} launches`)),
    "",
    "## Guides",
    link("All guides", "/guides"),
    ...GUIDES.map((g) => link(g.title, `/guides/${g.slug}`, g.directAnswer)),
    "",
    "## Services",
    ...servicePages.map((s) => link(s.title, `/services/${s.slug}`, s.description)),
    "",
    "## Communities",
    ...communityGuides.map((c) => link(c.name, `/communities/${c.slug}`, c.blurb)),
    "",
    "## Developers",
    ...developers.map((d) => link(d.name, `/developers/${d.slug}`, d.tagline)),
    "",
    "## Insights",
    ...blogArticles.map((b) => link(b.title, `/insights/${b.slug}`, b.excerpt)),
    "",
    "## RERA-licensed advisors",
    ...team.map((m) => link(m.name, `/agents/${m.slug}`, `${m.role} (${m.languages.join(", ")})`)),
    "",
    "## Optional",
    link("Full text for LLMs", "/llms-full.txt"),
    link("Sitemap", "/sitemap.xml"),
    link("Privacy policy", "/privacy"),
    link("Terms of use", "/terms"),
    "",
  ].join("\n")
}

/** Expanded plain-text corpus: direct answers, FAQs and guide content for retrieval. */
export function buildLlmsFullTxt() {
  const out: string[] = [buildLlmsTxt(), "", "---", "", "# Frequently asked questions", ""]
  for (const f of faqs) out.push(`## ${f.q}`, "", f.a, "")
  for (const g of GUIDES) {
    out.push(`# ${g.title}`, "", `Source: ${u(`/guides/${g.slug}`)} (updated ${g.lastUpdated})`, "", g.directAnswer, "")
    out.push("Key takeaways:", ...g.keyTakeaways.map((k) => `- ${k}`), "")
    for (const s of g.sections) out.push(`## ${s.heading}`, "", s.summary, "", s.body, ...s.bullets.map((b) => `- ${b}`), "")
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
  for (const b of blogArticles) {
    out.push(`# ${b.title}`, "", `Source: ${u(`/insights/${b.slug}`)} (updated ${b.updatedAt})`, "", b.directAnswer, "")
    out.push(...b.keyTakeaways.map((k) => `- ${k}`), "")
  }
  out.push("# Off-plan projects tracked", "", ...projects.map((p) => `- ${p.name} by ${p.devName}, ${p.community}: ${u(`/off-plan/${p.slug}`)}`), "")
  out.push("# Advisors", "", ...team.map((m) => `- ${m.name}, ${m.role}: ${u(`/agents/${m.slug}`)}`), "")
  return out.join("\n")
}
