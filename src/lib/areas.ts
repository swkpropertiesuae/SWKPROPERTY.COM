import { projects, slugify, type Project } from "@/lib/developers"
import { communityGuides } from "@/lib/communities"

export type OffPlanArea = {
  slug: string
  name: string
  projects: Project[]
  developers: string[]
  /** Slug of the matching /communities/[slug] guide when one exists. */
  communityGuideSlug?: string
}

const MIN_PROJECTS = 3
const GENERIC = new Set(["Dubai", "UAE", "Sharjah", "Abu Dhabi", "Ras Al Khaimah", "Umm Al Quwain"])

const AREA_ALIASES: Record<string, string> = {
  "yas island, abu dhabi": "Yas Island",
  "dubai land": "Dubailand",
  "dubailand (dlrc)": "Dubailand",
  "dubailand green corridor": "Dubailand",
  "the oasis, dubailand": "Dubailand",
  "sobha hartland ii waterfront": "Sobha Hartland II",
  "aljada, sharjah": "Aljada",
  "jumeirah village circle (jvc)": "Jumeirah Village Circle",
  "al marjan island, ras al khaimah": "Al Marjan Island",
}

const GUIDE_ALIASES: Record<string, string> = {
  "mohammed bin rashid city": "mbr-city",
  "jumeirah village circle": "jvc",
  "jumeirah lake towers": "jlt",
}

function normalizeAreaName(raw: string): string {
  const trimmed = raw.trim()
  return AREA_ALIASES[trimmed.toLowerCase()] ?? trimmed
}

const by = new Map<string, Project[]>()
for (const p of projects) {
  const canonical = normalizeAreaName(p.community)
  if (!canonical || GENERIC.has(canonical)) continue
  const existing = by.get(canonical)
  if (existing) existing.push(p)
  else by.set(canonical, [p])
}

export const offPlanAreas: OffPlanArea[] = [...by.entries()]
  .filter(([, list]) => list.length >= MIN_PROJECTS)
  .map(([name, list]) => {
    const slug = slugify(name)
    const aliasSlug = GUIDE_ALIASES[name.toLowerCase()]
    const guide = communityGuides.find(
      (c) =>
        c.slug === slug ||
        c.slug === aliasSlug ||
        c.name.toLowerCase() === name.toLowerCase()
    )
    return {
      slug,
      name,
      projects: list,
      developers: [...new Set(list.map((p) => p.devName))],
      communityGuideSlug: guide?.slug,
    }
  })
  .sort((a, b) => b.projects.length - a.projects.length || a.name.localeCompare(b.name))

export const getOffPlanArea = (slug: string) => offPlanAreas.find((a) => a.slug === slug)
