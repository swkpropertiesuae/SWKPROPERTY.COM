import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { JsonLd } from "@/components/seo/json-ld";
import { servicePages } from "@/lib/services";
import { breadcrumbLd, buildMeta, KEYWORDS } from "@/lib/seo";
import { AvenloPageHeader } from "@/components/avenlo/page-header";
import { BracketLink } from "@/components/avenlo/bracket-button";
import { CtaBanner, SectionEyebrow, SplitHeading } from "@/components/avenlo/motion";

export const metadata: Metadata = buildMeta({
  title: "Dubai Real Estate Services | Off-Plan, Resale & Management",
  description:
    "SWK Properties full-cycle UAE real estate services: Off-Plan Advisory, Secondary Sales, Leasing & Ejari, Investment Advisory, Property Management, Mortgages & Legal.",
  path: "/services",
  image: "/img/hero/banner-services.webp",
  keywords: KEYWORDS.services,
});

const PROCESS_TAGS = [
  "Brief",
  "DLD Comparables",
  "Escrow Check",
  "Negotiation",
  "Form F / SPA",
  "Handover & Ejari",
];

export default function ServicesPage() {
  return (
    <div className="bg-transparent">
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />

      <AvenloPageHeader
        eyebrow="ADVISORY SERVICES · SHEIKH ZAYED ROAD"
        title="Eight desks, one"
        italic="point of contact"
        lead="Every SWK mandate defines exact scope, process milestones, fee structure, and required DLD paperwork upfront—whether acquiring off-plan, reselling, or letting."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Services" },
        ]}
        actions={
          <BracketLink href="/contact" variant="light" size="md">
            Talk to an Advisor
          </BracketLink>
        }
      />

      {/* Avenlo Dark Numbered 01-08 Interactive List */}
      <section className="bg-[#121212] py-20 sm:py-24 text-white">
        <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <SectionEyebrow tone="dark">WHAT WE PROVIDE</SectionEyebrow>
              <SplitHeading
                tone="dark"
                primary="Full-cycle UAE"
                muted="property representation"
                className="mt-5"
              />
            </div>
            <div className="text-left sm:text-right">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8b8b8b]">
                DESKS
              </p>
              <p className="mt-1 text-3xl font-medium tracking-[-0.04em] text-white tabular-nums">
                +00{servicePages.length}
              </p>
            </div>
          </div>

          <div className="mt-12 divide-y divide-white/[0.1] border-y border-white/[0.1]">
            {servicePages.map((svc, idx) => (
              <Link
                key={svc.slug}
                href={`/services/${svc.slug}`}
                className="group grid grid-cols-1 items-center gap-6 py-8 sm:py-10 md:grid-cols-12 transition-colors hover:bg-white/[0.02]"
              >
                <div className="md:col-span-5 flex items-baseline gap-6">
                  <span className="font-mono text-sm text-[#8b8b8b]">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#51fec0]">
                      {svc.eyebrow}
                    </p>
                    <h2 className="mt-1 text-2xl sm:text-[28px] font-medium tracking-[-0.03em] text-white group-hover:text-[#51fec0] transition-colors">
                      {svc.title}
                    </h2>
                  </div>
                </div>
                <ul className="md:col-span-5 space-y-1.5 text-sm text-[#a7a7a7]">
                  {svc.scope.slice(0, 3).map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-[#8b8b8b]">+</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="md:col-span-2 flex md:justify-end">
                  <span className="inline-flex h-14 w-12 items-center justify-center rounded-xl bg-[#1e1e1e] text-white transition-colors group-hover:bg-[#51fec0] group-hover:text-[#121212]">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Process Strip + Enquiry */}
      <section className="mx-auto max-w-[1260px] px-4 py-20 sm:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2.5 pb-16 border-b border-black/[0.06]">
          {PROCESS_TAGS.map((tag, i) => (
            <span
              key={tag}
              className="rounded-full border border-black/10 bg-[#f7f7f7] px-4 py-2 text-xs font-medium text-[#121212]"
            >
              <span className="mr-2 font-mono text-[#8b8b8b]">0{i + 1}</span>
              {tag}
            </span>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-3xl">
          <EnquiryForm
            context="advisory"
            heading="Tell us what you need handled"
            subheading="Our Sheikh Zayed Road desk pairs your brief with the specialist covering your service."
          />
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
