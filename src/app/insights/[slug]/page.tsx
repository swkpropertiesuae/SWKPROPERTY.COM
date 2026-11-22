import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ExternalLink } from "lucide-react";
import { blogArticles, getBlogArticle } from "@/lib/blog";
import { listings } from "@/lib/listings";
import { team } from "@/lib/swk";
import { buildMetadata, articleSchema, faqSchema, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { PropertyCard } from "@/components/site/property-card";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { Faq } from "@/components/site/faq";
import { AvenloPageHeader } from "@/components/avenlo/page-header";
import { CtaBanner, SectionEyebrow, SplitHeading } from "@/components/avenlo/motion";

export function generateStaticParams() {
  return blogArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getBlogArticle(slug);
  if (!article) {
    return buildMetadata({
      title: "Article Not Found",
      description: "Requested SWK market briefing could not be found.",
      path: `/insights/${slug}`,
    });
  }
  return buildMetadata({
    title: article.title,
    description: article.directAnswer,
    path: `/insights/${article.slug}`,
    ogImage: article.image,
    type: "article",
    publishedTime: article.date,
    modifiedTime: article.updatedAt,
    keywords: [
      ...article.keywords,
      article.category,
      "SWK Properties Dubai",
      "Dubai real estate research",
    ],
  });
}

export default async function InsightArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getBlogArticle(slug);
  if (!article) notFound();

  const relatedListings = listings.slice(0, 3);
  const authorInTeam = team.some((m) => m.slug === article.author.slug);

  return (
    <div className="bg-transparent">
      <JsonLd
        id="ld-article"
        data={articleSchema({
          title: article.title,
          description: article.directAnswer,
          slug: article.slug,
          datePublished: article.date,
          dateModified: article.updatedAt,
          image: article.image,
          authorName: article.author.name,
        })}
      />
      <JsonLd id="ld-article-faq" data={faqSchema(article.faqs)} />
      <JsonLd
        id="ld-article-breadcrumb"
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights" },
          { name: article.title, path: `/insights/${article.slug}` },
        ])}
      />

      <AvenloPageHeader
        eyebrow={article.category}
        title={article.title}
        compact
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Insights", href: "/insights" },
          { label: article.category },
        ]}
        meta={
          <>
            <span>{article.date}</span>
            <span className="text-[#cfcfcf]">·</span>
            <span>{article.readTime}</span>
            <span className="text-[#cfcfcf]">·</span>
            {authorInTeam ? (
              <Link
                href={`/agents/${article.author.slug}`}
                className="font-medium text-[#121212] underline underline-offset-4"
              >
                {article.author.name}
              </Link>
            ) : (
              <span>{article.author.name}</span>
            )}
          </>
        }
      />

      {/* Avenlo Single-Column Frosted Glass Editorial Reading Flow */}
      <article className="mx-auto my-12 max-w-3xl rounded-3xl border border-white/80 bg-white/86 px-6 py-10 sm:px-10 shadow-[0_20px_54px_rgba(12,56,96,0.09)] backdrop-blur-2xl space-y-10">
        <div className="overflow-hidden rounded-2xl bg-[#f5f5f5]">
          <img
            src={article.image}
            alt={article.title}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>

        {/* Direct Summary Callout (AEO/GEO Speakable Direct Answer) */}
        <div className="rounded-2xl border border-white/80 bg-white/80 backdrop-blur-xl shadow-[0_14px_40px_rgba(12,56,96,0.08)] p-6 sm:p-8">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1b6aa7]">
            KEY SUMMARY · DIRECT ANSWER
          </p>
          <p data-speakable className="mt-3 text-[16px] leading-[1.7] text-[#121212]">{article.directAnswer}</p>
        </div>

        <p className="text-[17px] leading-[1.75] text-[#4a4a4a]">{article.content}</p>

        {/* Long-Form Sections */}
        {article.sections.map((sec) => (
          <section key={sec.title} className="space-y-3">
            <h2 className="text-2xl sm:text-[30px] font-medium tracking-[-0.03em] text-[#121212]">
              {sec.title}
            </h2>
            <p className="text-[16px] leading-[1.75] text-[#4a4a4a]">{sec.text}</p>
          </section>
        ))}

        {/* Key Takeaways */}
        {article.keyTakeaways.length > 0 ? (
          <div className="rounded-2xl border border-white/80 bg-white/80 backdrop-blur-xl shadow-[0_14px_40px_rgba(12,56,96,0.08)] p-6 sm:p-8">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b8b8b]">
              TAKEAWAYS
            </p>
            <ul className="mt-4 space-y-3 text-sm text-[#121212]">
              {article.keyTakeaways.map((kt) => (
                <li key={kt} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#0e9f6e]" />
                  <span>{kt}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Sources */}
        {article.sources.length > 0 ? (
          <div className="border-t border-black/[0.08] pt-6 text-xs text-[#737373]">
            <p className="font-medium uppercase tracking-[0.18em] text-[#8b8b8b]">
              Official References
            </p>
            <ul className="mt-3 space-y-1.5">
              {article.sources.map((src) => (
                <li key={src.url}>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#121212] hover:underline"
                  >
                    <span>{src.title}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </article>

      {article.faqs.length > 0 ? (
        <Faq
          items={article.faqs}
          eyebrow="BRIEFING QUESTIONS"
          primary="Questions raised by"
          muted="this note"
          compact
        />
      ) : null}

      {/* Related Residences */}
      <section className="mx-auto max-w-[1260px] px-4 py-16 sm:px-8">
        <SectionEyebrow>ON OUR BOOKS</SectionEyebrow>
        <SplitHeading
          primary="Selected Dubai"
          muted="residences"
          size="md"
          inline
          className="mt-4"
        />
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {relatedListings.map((item) => (
            <PropertyCard key={item.slug} listing={item} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-8">
        <EnquiryForm
          context="advisory"
          subject={article.title}
          heading="Discuss this briefing with our desk"
          subheading="Request building comparables or a bespoke cost sheet."
        />
      </section>

      <CtaBanner />
    </div>
  );
}
