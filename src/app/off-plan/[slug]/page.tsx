import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import { getDeveloper, getProject, projects } from "@/lib/developers";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd, buildMeta } from "@/lib/seo";
import { SITE } from "@/lib/swk";
import { MapEmbed } from "@/components/site/map-embed";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { AvenloPageHeader } from "@/components/avenlo/page-header";
import { BracketLink } from "@/components/avenlo/bracket-button";
import { CtaBanner, SectionEyebrow, SplitHeading } from "@/components/avenlo/motion";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) {
    return buildMeta({
      title: "Off-Plan Project Not Found",
      description: "Explore premier UAE off-plan developments with SWK Properties.",
      path: "/off-plan",
    });
  }

  return buildMeta({
    title: `${project.name} by ${project.developer} (${project.community})`,
    description: `${project.summary} Request floor plans, payment schedule, and DLD escrow details from SWK Properties (RERA ORN ${SITE.reraOrn}).`,
    path: `/off-plan/${project.slug}`,
    image: project.images[0],
    keywords: [
      project.name,
      `${project.name} ${project.developer}`,
      `${project.name} payment plan`,
      `${project.community} off-plan`,
      project.developer,
    ],
  });
}

export default async function OffPlanProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const dev = getDeveloper(project.developerSlug);
  const relatedProjects = projects
    .filter(
      (p) =>
        p.slug !== project.slug &&
        (p.developerSlug === project.developerSlug || p.community === project.community)
    )
    .slice(0, 3);

  const waMessage = encodeURIComponent(
    `Hello SWK Properties, I would like the brochure, floor plans, payment schedule, and live unit availability for ${project.name} by ${project.developer} in ${project.community}.`
  );

  return (
    <div className="bg-transparent">
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Off-Plan Projects", path: "/off-plan" },
          { name: project.developer, path: `/developers/${project.developerSlug}` },
          { name: project.name, path: `/off-plan/${project.slug}` },
        ])}
      />

      <AvenloPageHeader
        eyebrow={`${project.developer} · ${project.community}`}
        title={project.name}
        lead={project.summary}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Off-Plan", href: "/off-plan" },
          { label: project.developer, href: `/developers/${project.developerSlug}` },
          { label: project.name },
        ]}
        meta={
          <>
            <span>{project.collection}</span>
            <span className="text-[#cfcfcf]">·</span>
            <span>0% Buyer Commission (Primary Release)</span>
            <span className="text-[#cfcfcf]">·</span>
            <span>Escrow Registered (Law 8/2007)</span>
          </>
        }
        actions={
          <>
            <BracketLink href="#enquire" variant="light" size="md">
              Request Floor Plans
            </BracketLink>
            <BracketLink href="/calculators" variant="light" size="md">
              Calculate Payment
            </BracketLink>
          </>
        }
      />

      {/* Full-Width Architectural Render Showcase */}
      <section className="mx-auto max-w-[1260px] px-4 py-12 sm:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-[#f5f5f5]">
          <img
            src={project.images[0]}
            alt={`${project.name} architectural render by ${project.developer}`}
            className="h-[340px] sm:h-[520px] md:h-[600px] w-full object-cover"
          />
          <span className="absolute bottom-4 left-4 rounded-full bg-[#121212]/80 px-3.5 py-1.5 text-[11px] font-medium text-white backdrop-blur-md">
            Developer Architectural Render · Subject to Official SPA
          </span>
        </div>

        {/* 4-Column Quick Facts */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Master Developer", value: project.developer },
            { label: "District / Corridor", value: project.community },
            { label: "Collection", value: project.collection },
            { label: "Agency Commission", value: "0% (Developer-Paid)" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/80 bg-white/80 backdrop-blur-xl shadow-[0_14px_40px_rgba(12,56,96,0.08)] p-5"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#8b8b8b]">
                {stat.label}
              </p>
              <p className="mt-2 text-base sm:text-lg font-medium tracking-[-0.02em] text-[#121212]">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Project Overview, Due Diligence Checklist & Developer Card */}
      <section className="mx-auto max-w-[1260px] px-4 py-10 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
          <div className="lg:col-span-7 space-y-8">
            <div>
              <SectionEyebrow>DEVELOPMENT BRIEF</SectionEyebrow>
              <h2 className="mt-4 text-3xl sm:text-4xl font-medium tracking-[-0.035em] text-[#121212]">
                What to verify before reserving at {project.name}
              </h2>
              <p className="mt-4 text-[16px] leading-[1.7] text-[#4a4a4a]">{project.blurb}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-black/10 bg-[#f7f7f7] px-3.5 py-1.5 text-xs font-medium text-[#121212]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/80 bg-white/80 backdrop-blur-xl shadow-[0_14px_40px_rgba(12,56,96,0.08)] p-6 sm:p-8">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b8b8b]">
                SWK DUE DILIGENCE PROTOCOL
              </p>
              <ul className="mt-5 space-y-3.5 text-sm text-[#4a4a4a]">
                {[
                  "Confirm RERA project registration number and official project-specific escrow bank account before transfer.",
                  "Audit floor-plate efficiency, view orientation, and projected Mollak service charges per sq ft.",
                  "Review full payment schedule milestones, DLD 4% Oqood registration timing, and pre-handover resale clause in the SPA.",
                  "Compare delivered communities by the same developer against brochure finishes.",
                ].map((pt) => (
                  <li key={pt} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#0e9f6e]" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {dev ? (
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/80 bg-white/86 backdrop-blur-xl shadow-[0_18px_48px_rgba(12,56,96,0.09)] p-6">
                <div className="flex items-center gap-4">
                  {dev.logo ? (
                    <div className="flex h-14 w-24 items-center justify-center rounded-xl bg-[#f7f7f7] p-2.5">
                      <img
                        src={dev.logo}
                        alt={dev.name}
                        className="max-h-9 max-w-full object-contain"
                      />
                    </div>
                  ) : null}
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#8b8b8b]">
                      MASTER DEVELOPER
                    </p>
                    <p className="mt-0.5 text-lg font-medium text-[#121212]">{dev.name}</p>
                    <p className="text-xs text-[#737373]">
                      {dev.emirate} · {dev.knownFor}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/developers/${dev.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.14em] text-[#121212] underline underline-offset-4 hover:text-[#0e9f6e]"
                >
                  <span>Developer Profile</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : null}

            <MapEmbed
              query={`${project.community}, UAE`}
              zoom={13}
              title={`${project.name} — ${project.community}`}
            />
          </div>

          <div id="enquire" className="lg:col-span-5 lg:sticky lg:top-28 space-y-5">
            <EnquiryForm
              context="brochure"
              heading={`Request ${project.name} dossier`}
              subheading="Receive current developer inventory, floor plans, payment schedule, and escrow confirmation."
              propertyTitle={`${project.name} by ${project.developer}`}
              community={project.community}
              developer={project.developer}
              compact
            />

            <div className="rounded-2xl border border-white/80 bg-white/80 backdrop-blur-xl shadow-[0_14px_40px_rgba(12,56,96,0.08)] p-5 text-xs text-[#525252] space-y-3">
              <div className="flex items-center gap-2 font-medium text-[#121212]">
                <ShieldCheck className="h-4 w-4 text-[#0e9f6e]" />
                <span>Direct Developer Desk · RERA ORN {SITE.reraOrn}</span>
              </div>
              <a
                href={`https://wa.me/${SITE.phoneRaw.replace("+", "")}?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#121212] px-5 py-3 text-xs font-medium uppercase tracking-[0.14em] text-white hover:bg-[#2b2b2b]"
              >
                <WhatsAppIcon className="h-4 w-4 text-[#51fec0]" />
                <span>WhatsApp for Live Availability</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Related Releases */}
      {relatedProjects.length > 0 ? (
        <section className="border-t border-white/60 bg-white/24 backdrop-blur-[2px] py-16">
          <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
            <SectionEyebrow>RELATED RELEASES</SectionEyebrow>
            <SplitHeading
              primary="Compare neighbouring"
              muted="developer launches"
              size="md"
              inline
              className="mt-4"
            />
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {relatedProjects.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/off-plan/${rel.slug}`}
                  className="group overflow-hidden rounded-2xl border border-white/80 bg-white/84 backdrop-blur-xl shadow-[0_16px_44px_rgba(12,56,96,0.08)] transition-all hover:border-black/20"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden bg-[#ececec]">
                    <img
                      src={rel.image}
                      alt={rel.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#8b8b8b]">
                      {rel.developer} · {rel.community}
                    </p>
                    <h3 className="mt-2 text-xl font-medium tracking-[-0.025em] text-[#121212]">
                      {rel.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBanner />
    </div>
  );
}
