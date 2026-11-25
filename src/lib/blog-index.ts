import blogIndexJson from "@/data/blog-index.json"

export interface BlogIndexEntry {
  slug: string
  title: string
  category: string
  date: string
  updated: string
  readTime: string
  image: string
  excerpt: string
  keywords: string[]
  authorSlug: string
  shard: string
}

function normalizeBlogImage(image: string): string {
  if (!image) return "/og-default.jpg"
  if (image.startsWith("assets/images/")) return image.replace(/^assets\/images\//, "/img/")
  if (image.startsWith("/") || image.startsWith("https://")) return image
  return `/img/${image}`
}

export const blogIndex: BlogIndexEntry[] = (blogIndexJson as BlogIndexEntry[]).map((entry) => ({
  ...entry,
  image: normalizeBlogImage(entry.image),
}))

export const blogCategories: string[] = [
  "All",
  ...Array.from(new Set(blogIndex.map((a) => a.category))),
]

export const BLOG_ERAS = [
  { id: "all", label: "All Archives", minYear: 2008, maxYear: 2026 },
  { id: "2025-2026", label: "2025 – 2026", minYear: 2025, maxYear: 2026 },
  { id: "2023-2024", label: "2023 – 2024", minYear: 2023, maxYear: 2024 },
  { id: "2020-2022", label: "2020 – 2022", minYear: 2020, maxYear: 2022 },
  { id: "2015-2019", label: "2015 – 2019", minYear: 2015, maxYear: 2019 },
  { id: "2008-2014", label: "2008 – 2014", minYear: 2008, maxYear: 2014 },
] as const
