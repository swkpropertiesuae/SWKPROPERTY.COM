import type { MetadataRoute } from "next"
import { SITE, team } from "@/lib/swk"
import { communityGuides } from "@/lib/communities"
import { developers, projects } from "@/lib/developers"
import { services } from "@/lib/services"
import { listings, isPermitVerified } from "@/lib/listings"
import { GUIDES } from "@/lib/guides"
import { blogIndex } from "@/lib/blog-index"
import { offPlanAreas } from "@/lib/areas"

const SITE_EPOCH = new Date("2026-11-25T00:00:00Z")

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url
  const absImg = (src: string) => (src.startsWith("http") ? src : `${base}${src.startsWith("/") ? src : `/${src}`}`)

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
      lastModified: SITE_EPOCH,
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1.0 : 0.85,
    })),
    // Listings are indexable only once their DLD Trakheesi permit is verified.
    ...listings.filter(isPermitVerified).map((l) => ({
      url: `${base}/properties/${l.slug}`,
      lastModified: new Date(l.lastChecked),
      changeFrequency: "daily" as const,
      priority: 0.9,
      images: l.images.slice(0, 5).map(absImg),
    })),
    ...projects.map((p) => ({
      url: `${base}/off-plan/${p.slug}`,
      lastModified: SITE_EPOCH,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: p.image ? [absImg(p.image)] : undefined,
    })),
    ...offPlanAreas.map((a) => ({
      url: `${base}/off-plan/in/${a.slug}`,
      lastModified: SITE_EPOCH,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...developers.map((d) => ({
      url: `${base}/developers/${d.slug}`,
      lastModified: SITE_EPOCH,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...communityGuides.map((c) => ({
      url: `${base}/communities/${c.slug}`,
      lastModified: SITE_EPOCH,
      changeFrequency: "weekly" as const,
      priority: 0.85,
      images: c.image ? [absImg(c.image)] : undefined,
    })),
    ...services.map((s) => ({
      url: `${base}/services/${s.slug}`,
      lastModified: SITE_EPOCH,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...team.map((m) => ({
      url: `${base}/agents/${m.slug}`,
      lastModified: SITE_EPOCH,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...GUIDES.map((g) => ({
      url: `${base}/guides/${g.slug}`,
      lastModified: new Date(g.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    ...blogIndex.map((b) => ({
      url: `${base}/insights/${b.slug}`,
      lastModified: new Date(b.updated || b.date),
      changeFrequency: "monthly" as const,
      priority: Number(b.date.slice(0, 4)) >= 2024 ? 0.82 : 0.72,
    })),
  ]
}
