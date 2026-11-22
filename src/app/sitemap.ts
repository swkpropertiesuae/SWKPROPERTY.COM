import type { MetadataRoute } from "next"
import { SITE, team } from "@/lib/swk"
import { communityGuides } from "@/lib/communities"
import { developers, projects } from "@/lib/developers"
import { services } from "@/lib/services"
import { listings, isPermitVerified } from "@/lib/listings"
import { GUIDES } from "@/lib/guides"
import { blogArticles } from "@/lib/blog"
import { offPlanAreas } from "@/lib/areas"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url
  const now = new Date()

  const staticPaths = [
    "",
    "/buy",
    "/rent",
    "/off-plan",
    "/properties",
    "/developers",
    "/communities",
    "/services",
    "/insights",
    "/calculators",
    "/guides",
    "/about",
    "/agents",
    "/contact",
    "/list-your-property",
    "/faq",
    "/privacy",
    "/terms",
    "/cookies",
  ]

  return [
    ...staticPaths.map((p) => ({
      url: `${base}${p}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1.0 : 0.85,
    })),
    // Listings are indexable only once their DLD Trakheesi permit is verified.
    ...listings.filter(isPermitVerified).map((l) => ({
      url: `${base}/properties/${l.slug}`,
      lastModified: new Date(l.lastChecked),
      changeFrequency: "daily" as const,
      priority: 0.9,
      images: l.images.slice(0, 5).map((i) => `${base}${i}`),
    })),
    ...projects.map((p) => ({
      url: `${base}/off-plan/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: [`${base}${p.image}`],
    })),
    ...offPlanAreas.map((a) => ({
      url: `${base}/off-plan/in/${a.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...developers.map((d) => ({
      url: `${base}/developers/${d.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...communityGuides.map((c) => ({
      url: `${base}/communities/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
      images: [`${base}${c.image}`],
    })),
    ...services.map((s) => ({
      url: `${base}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...team.map((m) => ({
      url: `${base}/agents/${m.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...GUIDES.map((g) => ({
      url: `${base}/guides/${g.slug}`,
      lastModified: new Date(g.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    ...blogArticles.map((b) => ({
      url: `${base}/insights/${b.slug}`,
      lastModified: new Date(b.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ]
}
