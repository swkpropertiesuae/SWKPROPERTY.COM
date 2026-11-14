import { projects, slugify, type Project } from "@/lib/developers"
import { communityGuides } from "@/lib/communities"

export type OffPlanArea = {
  slug: string
  name: string
  projects: Project[]
  developers: string[]
  communityGuideSlug?: string
}

const MIN_PROJECTS = 3 // fewer projects would make a thin page
const GENERIC = new Set(["Dubai", "UAE"])

/** Programmatic off-plan area hubs: one page per community with enough tracked launches. */
export const offPlanAreas: OffPlanArea[] = (() => {
  const by = new Map<string, Project[]>()
  for (const p of projects) {
    if (GENERIC.has(p.community)) continue
    by.set(p.community, [...(by.get(p.community) ?? []), p])
  }
  return [...by]
    .filter(([, list]) => list.length >= MIN_PROJECTS)
    .map(([name, list]) => {
      const slug = slugify(name)
      return {
        slug,
        name,
        projects: list,
        developers: [...new Set(list.map((p) => p.devName))],
        communityGuideSlug: communityGuides.find((c) => c.name.toLowerCase() === name.toLowerCase() || c.slug === slug)?.slug,
      }
    })
    .sort((a, b) => b.projects.length - a.projects.length)
})()

export const getOffPlanArea = (slug: string) => offPlanAreas.find((a) => a.slug === slug)
