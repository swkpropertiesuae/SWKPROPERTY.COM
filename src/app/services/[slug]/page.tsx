import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import { getServicePage, servicePages } from "@/lib/services";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { Faq } from "@/components/site/faq";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd, buildMeta, faqLd, serviceLd } from "@/lib/seo";
import { AvenloPageHeader } from "@/components/avenlo/page-header";
import { BracketLink } from "@/components/avenlo/bracket-button";
import { CtaBanner, SectionEyebrow, SplitHeading } from "@/components/avenlo/motion";

export function generateStaticParams() {
  return servicePages.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const svc = getServicePage(slug);
  if (!svc) {
    return buildMeta({
      title: "Service Not Found",
      description: "Explore SWK Properties real estate services in Dubai.",
      path: "/services",
    });
  }

  return buildMeta({
    title: `${svc.title} in Dubai | SWK Advisory`,
    description: `${svc.tagline}. ${svc.description}`,
    path: `/services/${svc.slug}`,
    image: svc.heroImage,
    keywords: svc.keywords,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const svc = getServicePage(slug);
  if (!svc) notFound();

  return (
    <div className="bg-white">
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: svc.title, path: `/services/${svc.slug}` },
          ]),
          serviceLd({
            name: svc.title,
            description: svc.description,
            slug: svc.slug,
          }),
          faqLd(svc.faqs),
        ]}
      />

      <AvenloPageHeader
        eyebrow={`SERVICE · ${svc.eyebrow.toUpperCase()}`}
        title={svc.title}
        lead={svc.tagline}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: svc.title },
        ]}
        actions={
          <BracketLink href="#enquire" variant="light" size="md">
            {svc.ctaLabel}
          </BracketLink>
        }
      />

      {/* Avenlo 4-Row Metadata Table + Editorial Intro */}
      <section className="mx-auto max-w-[1260px] px-4 py-16 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
          <div className="lg:col-span-6 space-y-6">
            <div className="overflow-hidden rounded-2xl bg-[#f5f5f5]">
              <img
                src={svc.heroImage}
                alt={svc.title}
                className="aspect-[16/10] w-full object-cover"
              />
            </div>
            <p className="text-[16px] leading-[1.7] text-[#4a4a4a]">{svc.intro}</p>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-black/[0.08] bg-[#f7f7f7] p-6 sm:p-8">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b8b8b]">
                MANDATE SPECIFICATION
              </p>
              <dl className="mt-4 divide-y divide-black/[0.08] text-sm">
                <div className="py-4">
                  <dt className="text-xs font-medium uppercase tracking-[0.14em] text-[#8b8b8b]">
                    Best For
                  </dt>
                  <dd className="mt-1.5 text-[#121212]">{svc.whoFor.join(" · ")}</dd>
                </div>
                <div className="py-4">
                  <dt className="text-xs font-medium uppercase tracking-[0.14em] text-[#8b8b8b]">
                    Coverage
                  </dt>
                  <dd className="mt-1.5 text-[#121212]">
                    Dubai, Abu Dhabi, Sharjah, Ras Al Khaimah &amp; Umm Al Quwain
                  </dd>
                </div>
                <div className="py-4">
                  <dt className="text-xs font-medium uppercase tracking-[0.14em] text-[#8b8b8b]">
                    Stages
                  </dt>
                  <dd className="mt-1.5 text-[#121212]">
                    {svc.process.length} structured milestones from brief to completion
                  </dd>
                </div>
                <div className="py-4">
                  <dt className="text-xs font-medium uppercase tracking-[0.14em] text-[#8b8b8b]">
                    Fee Transparency
                  </dt>
                  <dd className="mt-1.5 leading-relaxed text-[#525252]">{svc.fees}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Scope Deliverables & Step-by-Step Process */}
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6 rounded-2xl border border-black/[0.07] bg-white p-7 sm:p-8">
            <SectionEyebrow>WHAT IS INCLUDED</SectionEyebrow>
            <ul className="mt-6 space-y-3.5 text-sm text-[#121212]">
              {svc.scope.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#0e9f6e]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6 rounded-2xl border border-black/[0.07] bg-[#f7f7f7] p-7 sm:p-8">
            <SectionEyebrow>HOW IT RUNS</SectionEyebrow>
            <ol className="mt-6 space-y-4">
              {svc.process.map((step, i) => (
                <li key={step.step} className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-dashed border-[#cfcfcf] bg-white font-mono text-xs text-[#121212]">
                    0{i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[#121212]">{step.step}</p>
                    <p className="mt-1 text-xs leading-relaxed text-[#666666]">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {svc.faqs.length > 0 ? (
        <Faq
          items={svc.faqs}
          eyebrow={`${svc.eyebrow.toUpperCase()} QUESTIONS`}
          primary="Common questions"
          muted="about this desk"
          compact
        />
      ) : null}

      {/* Direct Service Enquiry */}
      <section id="enquire" className="mx-auto max-w-4xl px-4 py-16 sm:px-8">
        <EnquiryForm
          context="advisory"
          subject={svc.title}
          heading={svc.ctaLabel}
          subheading="Tell us your brief and a dedicated SWK advisor will reply within one Dubai business day."
        />
      </section>

      {/* Bottom Numbered 01-08 Sibling Services Cross-Links (Avenlo Pattern) */}
      <section className="border-t border-black/[0.06] bg-[#f7f7f7] py-16">
        <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
          <SectionEyebrow>ALL ADVISORY DESKS</SectionEyebrow>
          <SplitHeading
            primary="Explore our other"
            muted="seven desks"
            size="md"
            inline
            className="mt-4"
          />
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {servicePages.map((s, idx) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className={`flex items-center justify-between rounded-xl border p-4 text-sm font-medium transition-colors ${
                  s.slug === svc.slug
                    ? "border-[#121212] bg-[#121212] text-white"
                    : "border-black/[0.07] bg-white text-[#121212] hover:border-[#121212]"
                }`}
              >
                <span>
                  <span className="mr-2 font-mono text-xs opacity-60">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  {s.title}
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
