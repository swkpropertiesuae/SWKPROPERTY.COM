import blogIndexJson from "@/data/blog-index.json"
import era20232026Json from "@/data/blog-articles/era-2023-2026.json"
import era20192022Json from "@/data/blog-articles/era-2019-2022.json"
import era20142018Json from "@/data/blog-articles/era-2014-2018.json"
import era20082013Json from "@/data/blog-articles/era-2008-2013.json"

export interface BlogSection {
  title: string
  text: string
}

export interface BlogSource {
  title: string
  url: string
}

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

export interface BlogArticle {
  slug: string
  title: string
  category: string
  date: string
  updatedAt: string
  readTime: string
  image: string
  excerpt: string
  directAnswer: string
  content: string
  keywords: string[]
  sections: BlogSection[]
  sources: BlogSource[]
  author: {
    name: string
    role: string
    slug: string
    credentials: string
  }
  reviewer: {
    name: string
    role: string
    credentials: string
  }
  keyTakeaways: string[]
  faqs: { q: string; a: string }[]
}

type RawBlogItem = {
  slug: string
  title: string
  category: string
  date: string
  updated?: string
  readTime: string
  image: string
  excerpt: string
  content: string
  sections: BlogSection[]
  sources?: BlogSource[]
  keywords?: string[]
  authorSlug?: string
}

const AUTHOR_BY_SLUG: Record<string, BlogArticle["author"]> = {
  "mohammad-haseeb": {
    name: "Mohammad Haseeb",
    role: "Sales & Operations Manager",
    slug: "mohammad-haseeb",
    credentials: "SWK Advisory Desk · RERA ORN 51517",
  },
  "mohammed-islam": {
    name: "Mohammed Islam (Rex)",
    role: "Assistant Director · UK & Dubai Advisory",
    slug: "mohammed-islam",
    credentials: "SWK Advisory Desk · RERA ORN 51517",
  },
  "talha-shabbir": {
    name: "Talha Shabbir",
    role: "Business Development Manager",
    slug: "talha-shabbir",
    credentials: "SWK Advisory Desk · RERA ORN 51517",
  },
  "fareed-choudhary": {
    name: "Fareed Choudhary",
    role: "Senior Property Consultant",
    slug: "fareed-choudhary",
    credentials: "SWK Advisory Desk · RERA ORN 51517",
  },
  "issaadi-chahrazed": {
    name: "Issaadi Chahrazed",
    role: "Off-Plan Property Consultant",
    slug: "issaadi-chahrazed",
    credentials: "SWK Advisory Desk · RERA ORN 51517",
  },
  saifullah: {
    name: "Saifullah",
    role: "Sales Agent",
    slug: "saifullah",
    credentials: "SWK Advisory Desk · RERA ORN 51517",
  },
  "mohammad-umar": {
    name: "Mohammad Umar",
    role: "Sales Agent",
    slug: "mohammad-umar",
    credentials: "SWK Advisory Desk · RERA ORN 51517",
  },
}

const AUTHOR_LIST = Object.values(AUTHOR_BY_SLUG)

function hydrateArticle(item: RawBlogItem, idx: number): BlogArticle {
  const normalizedImage = item.image.startsWith("assets/images/")
    ? item.image.replace(/^assets\/images\//, "/img/")
    : item.image.startsWith("/")
      ? item.image
      : `/img/${item.image}`

  const author =
    (item.authorSlug ? AUTHOR_BY_SLUG[item.authorSlug] : undefined) ??
    AUTHOR_LIST[idx % AUTHOR_LIST.length]

  return {
    slug: item.slug,
    title: item.title,
    category: item.category,
    date: item.date,
    updatedAt: item.updated || item.date,
    readTime: item.readTime,
    image: normalizedImage,
    excerpt: item.excerpt,
    directAnswer: item.content,
    content: item.content,
    keywords: item.keywords && item.keywords.length > 0 ? item.keywords : [item.title, item.category, "Dubai real estate"],
    sections: item.sections || [],
    sources:
      item.sources && item.sources.length > 0
        ? item.sources
        : [
            {
              title: "Dubai Land Department (DLD) Official Portal",
              url: "https://dubailand.gov.ae/en/",
            },
            {
              title: "Dubai REST Smart Real Estate Services",
              url: "https://dubailand.gov.ae/en/eservices/dubai-rest/",
            },
          ],
    author,
    reviewer: {
      name: "SWK Regulatory & Market Review Desk",
      role: "Compliance & DLD Verification Team",
      credentials: "RERA ORN 51517 · 25th Floor, Al Saqr Building, Sheikh Zayed Road",
    },
    keyTakeaways: (item.sections || [])
      .slice(0, 4)
      .map((s) => `${s.title}: ${s.text.split(".")[0]}.`),
    faqs: [
      {
        q: `What is the key guidance from "${item.title}"?`,
        a: item.content,
      },
      {
        q: "How can I verify Dubai project escrow, Title Deed, or transaction comparables independently?",
        a: "Every Dubai property transfer, project escrow account, Trakheesi permit, and Mollak service-charge budget can be checked directly via the official Dubai Land Department (DLD) portal or Dubai REST application.",
      },
      {
        q: "Can SWK Properties prepare a written AED comparison sheet on this topic?",
        a: "Yes. Speak with our Sheikh Zayed Road advisory desk (25th Floor, Al Saqr Building · RERA ORN 51517) for a tailored side-by-side floor-plate, payment-plan, and net-yield dossier.",
      },
    ],
  }
}

export const blogIndex: BlogIndexEntry[] = blogIndexJson as BlogIndexEntry[]

const ALL_RAW: RawBlogItem[] = [
  ...(era20232026Json as RawBlogItem[]),
  ...(era20192022Json as RawBlogItem[]),
  ...(era20142018Json as RawBlogItem[]),
  ...(era20082013Json as RawBlogItem[]),
]

export const blogArticles: BlogArticle[] = ALL_RAW.map(hydrateArticle)

const ARTICLE_MAP = new Map<string, BlogArticle>(blogArticles.map((a) => [a.slug, a]))

export function getBlogArticle(slug: string): BlogArticle | undefined {
  return ARTICLE_MAP.get(slug)
}

export const blogCategories = [
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
