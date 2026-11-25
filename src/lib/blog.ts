import era20232026Json from "@/data/blog-articles/era-2023-2026.json"
import era20192022Json from "@/data/blog-articles/era-2019-2022.json"
import era20142018Json from "@/data/blog-articles/era-2014-2018.json"
import era20082013Json from "@/data/blog-articles/era-2008-2013.json"
import { blogIndex, blogCategories, BLOG_ERAS, type BlogIndexEntry } from "@/lib/blog-index"

export { blogIndex, blogCategories, BLOG_ERAS, type BlogIndexEntry }

export interface BlogSection {
  title: string
  text: string
}

export interface BlogSource {
  title: string
  url: string
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
  "sanket-katariya": {
    name: "Sanket Katariya",
    role: "Sales Executive",
    slug: "sanket-katariya",
    credentials: "SWK Advisory Desk · RERA ORN 51517",
  },
}

const AUTHOR_LIST = Object.values(AUTHOR_BY_SLUG)

/** Extract the first full sentence without breaking on decimals (e.g. 6.5%) or abbreviations (No., St., Dr.). */
function firstSentence(text: string): string {
  const cleaned = text.replace(/\s+/g, " ").trim()
  if (!cleaned) return ""
  const re = /[.!?](?=\s+[A-Z0-9(“"']|$)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(cleaned)) !== null) {
    const end = m.index
    const prefix = cleaned.slice(Math.max(0, end - 8), end + 1)
    if (/(?:\bNo\.|\bArt\.|\bLaw\.|\bSt\.|\bDr\.|\bMr\.|\bMs\.|\bSq\.|\bEst\.|\bApprox\.|\bvs\.|\be\.g\.|\bi\.e\.)$/i.test(prefix)) {
      continue
    }
    if (end >= 1 && /\d/.test(cleaned[end - 1]) && end + 1 < cleaned.length && /\d/.test(cleaned[end + 1])) {
      continue
    }
    return cleaned.slice(0, end + 1)
  }
  return cleaned.endsWith(".") ? cleaned : `${cleaned}.`
}

function hydrateArticle(item: RawBlogItem, idx: number): BlogArticle {
  const normalizedImage = item.image.startsWith("assets/images/")
    ? item.image.replace(/^assets\/images\//, "/img/")
    : item.image.startsWith("/")
      ? item.image
      : `/img/${item.image}`

  const author =
    (item.authorSlug ? AUTHOR_BY_SLUG[item.authorSlug] : undefined) ??
    AUTHOR_LIST[idx % AUTHOR_LIST.length]

  const cleanExcerpt = item.excerpt.trim()
  const cleanContent = item.content.trim()
  const directAnswer =
    cleanExcerpt && cleanExcerpt.length >= 40 && cleanExcerpt !== cleanContent
      ? cleanExcerpt
      : cleanContent

  return {
    slug: item.slug,
    title: item.title,
    category: item.category,
    date: item.date,
    updatedAt: item.updated || item.date,
    readTime: item.readTime,
    image: normalizedImage,
    excerpt: cleanExcerpt,
    directAnswer,
    content: cleanContent,
    keywords: item.keywords && item.keywords.length > 0 ? item.keywords : [item.title, item.category, "Dubai real estate"],
    sections: item.sections || [],
    sources:
      item.sources && item.sources.length > 0
        ? item.sources.filter((s) => /^https?:\/\//i.test(s.url))
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
      .map((s) => `${s.title}: ${firstSentence(s.text)}`),
    faqs: [
      {
        q: `What is the key guidance from "${item.title}"?`,
        a: directAnswer,
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
