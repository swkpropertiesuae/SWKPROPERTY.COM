import Link from "next/link"
import { ArrowRight, BookOpen } from "lucide-react"
import { GUIDES } from "@/lib/guides"
import { buildMeta, breadcrumbLd, itemListLd } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"

export const metadata = buildMeta({
  title: "Dubai Property Guides — Buying, Renting, Selling & Investing",
  description:
    "Step-by-step Dubai real estate guides from RERA-licensed SWK Properties: buying ready and off-plan, renting with Ejari, selling with Form A and investing for yield.",
  path: "/guides",
})

export default function GuidesIndexPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-14 text-[#17130e]">
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
          ]),
          itemListLd("Dubai property guides", GUIDES.map((g) => ({ name: g.title, path: `/guides/${g.slug}` }))),
        ]}
      />
      <header className="space-y-3">
        <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#94652c]">
          <BookOpen className="h-3.5 w-3.5" aria-hidden /> SWK handbooks
        </span>
        <h1 className="font-serif text-3xl font-semibold md:text-5xl">Dubai property guides</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-[#4a4237]">
          Plain-English guides to every stage of a UAE property transaction, reviewed by SWK advisors and updated as DLD and RERA rules
          change.
        </p>
      </header>
      <ul className="grid gap-6 md:grid-cols-2">
        {GUIDES.map((g) => (
          <li key={g.slug}>
            <Link href={`/guides/${g.slug}`} className="group flex h-full flex-col gap-3 rounded-3xl border border-[#e6dfd2] bg-white p-6 transition hover:border-[#94652c] hover:shadow-lg">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#94652c]">{g.badge}</span>
              <h2 className="font-serif text-2xl font-semibold">{g.title}</h2>
              <p className="text-sm leading-relaxed text-[#4a4237]">{g.directAnswer}</p>
              <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-[#94652c]">
                Read guide · {g.readTime} <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
