import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { GUIDES, getGuide } from "@/lib/guides";
import { buildMetadata, articleSchema, faqSchema, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { Faq } from "@/components/site/faq";
import { AvenloPageHeader } from "@/components/avenlo/page-header";
import { BracketLink } from "@/components/avenlo/bracket-button";
import { CtaBanner } from "@/components/avenlo/motion";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) {
    return buildMetadata({
      title: "Guide Not Found",
      description: "The requested SWK guide could not be found.",
      path: `/guides/${slug}`,
    });
  }
  return buildMetadata({
    title: guide.title,
    description: guide.directAnswer,
    path: `/guides/${guide.slug}`,
    keywords: [guide.title, guide.eyebrow, "Dubai real estate guide", "RERA ORN 51517"],
  });
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  return (
    <div className="bg-transparent">
      <JsonLd
        id="ld-guide-article"
        data={articleSchema({
          title: guide.title,
          description: guide.directAnswer,
          slug: `guides/${guide.slug}`,
          datePublished: "2026-09-01",
          dateModified: guide.updatedAt,
          image: "/img/hero/banner-communities.webp",
          authorName: guide.reviewedBy,
        })}
      />
      <JsonLd id="ld-guide-faq" data={faqSchema(guide.faqs)} />
      <JsonLd
        id="ld-guide-breadcrumb"
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
          { name: guide.title, path: `/guides/${guide.slug}` },
        ])}
      />

      <AvenloPageHeader
        eyebrow={guide.badge}
        title={guide.title}
        lead={guide.subtitle}
        compact
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Guides", href: "/guides" },
          { label: guide.eyebrow },
        ]}
        meta={
          <>
            <span>{guide.readTime}</span>
            <span className="text-[#cfcfcf]">·</span>
            <span>Updated {guide.lastUpdated}</span>
            <span className="text-[#cfcfcf]">·</span>
            <span>Reviewed by {guide.reviewedBy}</span>
          </>
        }
        actions={
          <BracketLink href="/calculators" variant="light" size="sm">
            Open DLD &amp; Mortgage Calculator
          </BracketLink>
        }
      />

      {/* Uncluttered Single-Column Frosted Glass Reading Layout */}
      <article className="mx-auto my-12 max-w-3xl rounded-3xl border border-white/80 bg-white/86 px-6 py-12 sm:px-10 shadow-[0_20px_54px_rgba(12,56,96,0.09)] backdrop-blur-2xl space-y-12">
        {/* Direct Executive Summary */}
        <div className="rounded-2xl border border-white/80 bg-white/80 backdrop-blur-xl shadow-[0_14px_40px_rgba(12,56,96,0.08)] p-6 sm:p-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b8b8b]">
            DIRECT ANSWER
          </p>
          <p className="mt-3 text-[16px] leading-[1.7] text-[#121212]">{guide.directAnswer}</p>
        </div>

        {/* Guide Sections */}
        {guide.sections.map((sec) => (
          <section key={sec.id} id={sec.id} className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.03em] text-[#121212]">
              {sec.heading}
            </h2>
            <p className="text-[16px] leading-[1.7] text-[#4a4a4a]">{sec.summary}</p>
            <ul className="space-y-3 pt-2 text-sm leading-relaxed text-[#4a4a4a]">
              {sec.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#0e9f6e]" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            {sec.callout ? (
              <div className="rounded-xl border-l-2 border-[#121212] bg-[#f7f7f7] px-5 py-4 text-sm font-medium text-[#121212]">
                {sec.callout}
              </div>
            ) : null}
          </section>
        ))}

        {/* Crisp Architectural Comparison Table */}
        <section className="space-y-4">
          <h2 className="text-2xl font-medium tracking-[-0.03em] text-[#121212]">
            {guide.comparisonTable.caption}
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-black/[0.08]">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#f7f7f7] text-[#121212]">
                <tr>
                  {guide.comparisonTable.headers.map((h) => (
                    <th key={h} className="px-4 py-3.5 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.06] text-[#4a4a4a]">
                {guide.comparisonTable.rows.map((row, idx) => (
                  <tr key={idx}>
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        className={`px-4 py-3.5 ${ci === 0 ? "font-medium text-[#121212]" : ""}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Sibling Guides */}
        <div className="flex flex-wrap gap-2 border-t border-black/[0.08] pt-8">
          {GUIDES.filter((g) => g.slug !== guide.slug).map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="rounded-full border border-black/10 bg-[#f7f7f7] px-4 py-2 text-xs font-medium text-[#121212] hover:bg-[#121212] hover:text-white transition-colors"
            >
              {g.eyebrow} Guide →
            </Link>
          ))}
        </div>
      </article>

      {guide.faqs.length > 0 ? (
        <Faq
          items={guide.faqs}
          eyebrow="GUIDE QUESTIONS"
          primary="Frequently asked"
          muted="on this topic"
          compact
        />
      ) : null}

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
        <EnquiryForm
          context="advisory"
          subject={guide.title}
          heading="Ask an advisor about your situation"
          subheading="Receive a tailored Dubai cost sheet and timeline from our Sheikh Zayed Road desk."
        />
      </section>

      <CtaBanner />
    </div>
  );
}
