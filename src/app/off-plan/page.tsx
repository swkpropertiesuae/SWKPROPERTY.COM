"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { developers, projects } from "@/lib/developers";
import { offPlanAreas } from "@/lib/areas";
import { AvenloPageHeader } from "@/components/avenlo/page-header";
import { BracketLink } from "@/components/avenlo/bracket-button";
import { CtaBanner, SectionEyebrow, SplitHeading } from "@/components/avenlo/motion";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ListingDisclaimer } from "@/components/site/listing-disclaimer";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd, itemListLd } from "@/lib/seo";

const EMIRATES = ["All", "Dubai", "Abu Dhabi", "Sharjah", "Ras Al Khaimah", "Umm Al Quwain"] as const;

export default function OffPlanPage() {
  const [emirate, setEmirate] = useState<(typeof EMIRATES)[number]>("All");
  const [devSlug, setDevSlug] = useState("");
  const [query, setQuery] = useState("");
  const [onlyPriority, setOnlyPriority] = useState(false);

  const devMap = useMemo(() => new Map(developers.map((d) => [d.slug, d])), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (onlyPriority && !p.priorityTarget) return false;
      if (devSlug && p.developerSlug !== devSlug) return false;
      if (emirate !== "All") {
        if (p.emirate !== emirate) return false;
      }
      if (q) {
        const hay = `${p.name} ${p.developer} ${p.community} ${p.collection} ${p.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [emirate, devSlug, query, onlyPriority]);

  return (
    <div className="bg-transparent">
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Off-Plan Projects", path: "/off-plan" },
          ]),
          itemListLd(
            "Off-plan projects in Dubai and the UAE",
            projects.slice(0, 50).map((p) => ({ name: `${p.name} by ${p.devName}`, path: `/off-plan/${p.slug}` }))
          ),
        ]}
      />
      <AvenloPageHeader
        eyebrow="OFF-PLAN LAUNCHES · PREMIER UAE DEVELOPERS"
        title="New projects"
        italic="rising now"
        lead="Explore direct off-plan developments from Nakheel, Binghatti, Emaar, DAMAC, Azizi, Sobha Realty, Omniyat, Ellington, and Aldar—with 0% buyer agency commission on primary releases and RERA escrow verification."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Off-Plan Launches" },
        ]}
        actions={
          <>
            <BracketLink href="/calculators" variant="light" size="md">
              Payment Plan Calculator
            </BracketLink>
            <BracketLink href="/developers" variant="light" size="md">
              Master Developers
            </BracketLink>
          </>
        }
      />

      {/* Emirate Filter Pills + Search & Developer Select */}
      <section className="mx-auto max-w-[1260px] px-4 py-12 sm:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {EMIRATES.map((em) => (
            <button
              key={em}
              type="button"
              aria-pressed={emirate === em}
              onClick={() => setEmirate(em)}
              className={`cursor-pointer rounded-full px-5 py-2.5 text-xs font-medium transition-colors ${
                emirate === em
                  ? "bg-[#121212] text-white"
                  : "border border-black/10 bg-white text-[#525252] hover:border-[#121212] hover:text-[#121212]"
              }`}
            >
              {em === "All" ? "All UAE" : em}
            </button>
          ))}
          <button
            type="button"
            aria-pressed={onlyPriority}
            onClick={() => setOnlyPriority((v) => !v)}
            className={`cursor-pointer rounded-full px-5 py-2.5 text-xs font-medium transition-colors ${
              onlyPriority
                ? "bg-[#121212] text-[#51fec0]"
                : "border border-black/10 bg-[#f7f7f7] text-[#121212] hover:border-[#121212]"
            }`}
          >
            Flagship Mandates
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 rounded-2xl border border-white/80 bg-white/80 backdrop-blur-xl shadow-[0_14px_40px_rgba(12,56,96,0.08)] p-4 sm:grid-cols-12">
          <div className="relative sm:col-span-6">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#8b8b8b]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Palm, Mercedes-Benz, Bugatti, Creek Harbour, JVC, Lagoons, Azizi..."
              aria-label="Search off-plan projects"
              className="w-full rounded-lg border border-black/10 bg-white py-2.5 pr-4 pl-10 text-sm text-[#121212] placeholder:text-[#a7a7a7] focus:border-[#121212] focus:outline-none"
            />
          </div>

          <select
            aria-label="Filter by developer"
            value={devSlug}
            onChange={(e) => setDevSlug(e.target.value)}
            className="sm:col-span-4 rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-sm text-[#121212] focus:border-[#121212] focus:outline-none"
          >
            <option value="">All Master Developers</option>
            {developers.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name}
              </option>
            ))}
          </select>

          <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-3 px-2 text-xs text-[#525252]">
            <span aria-live="polite" className="font-medium text-[#121212]">{filtered.length} releases</span>
            {(query || devSlug || emirate !== "All" || onlyPriority) ? (
              <button
                type="button"
                onClick={() => {
                  setEmirate("All");
                  setDevSlug("");
                  setQuery("");
                  setOnlyPriority(false);
                }}
                className="cursor-pointer underline underline-offset-4"
              >
                Reset
              </button>
            ) : null}
          </div>
        </div>

        {/* Project Grid */}
        {filtered.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-white/80 bg-white/80 backdrop-blur-xl shadow-[0_14px_40px_rgba(12,56,96,0.08)] p-12 text-center">
            <h2 className="text-2xl font-medium tracking-[-0.03em] text-[#121212]">
              No matching off-plan launches
            </h2>
            <p className="mt-2 text-sm text-[#737373]">
              Clear your search filter or ask our off-plan desk for upcoming private pre-launches.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((proj) => {
              const dev = devMap.get(proj.developerSlug);
              return (
                <SpotlightCard key={proj.slug}>
                  <Link
                    href={`/off-plan/${proj.slug}`}
                    className="group flex h-full flex-col"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#ececec]">
                      <img
                        src={proj.image}
                        alt={`${proj.name} by ${proj.developer}`}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                      <div className="absolute top-3.5 left-3.5">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#121212]/82 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white backdrop-blur-md">
                          <span className="h-1.5 w-1.5 rounded-[2px] bg-[#51fec0]" aria-hidden="true" />
                          {proj.priorityTarget ? "Flagship Release" : "Off-Plan"}
                        </span>
                      </div>
                      <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-medium text-[#121212]">
                        Architectural Visual
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          {dev?.logo ? (
                            <img
                              src={dev.logo}
                              alt={proj.developer}
                              loading="lazy"
                              className="h-6 w-auto max-w-[108px] object-contain"
                            />
                          ) : (
                            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#8b8b8b]">
                              {proj.developer}
                            </span>
                          )}
                          <span className="truncate text-[11px] text-[#8b8b8b]">{proj.community}</span>
                        </div>
                        <h2 className="mt-3 text-[22px] font-medium tracking-[-0.03em] text-[#121212] group-hover:text-[#0e9f6e] transition-colors">
                          {proj.name}
                        </h2>
                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#666666]">
                          {proj.summary}
                        </p>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-black/[0.06] pt-4">
                        <div className="flex flex-wrap gap-1.5">
                          {proj.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-[#f5f5f5] px-2.5 py-1 text-[10px] font-medium text-[#525252]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-[#121212] group-hover:text-[#0e9f6e]">
                          <span>View</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </SpotlightCard>
              );
            })}
          </div>
        )}

        <div className="mt-10">
          <ListingDisclaimer variant="off-plan" />
        </div>
      </section>

      {/* Browse Launches by Community Corridor (pSEO Area Hubs) */}
      <section className="border-t border-white/60 bg-white/24 backdrop-blur-[2px] py-20">
        <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
          <SectionEyebrow>BROWSE BY CORRIDOR</SectionEyebrow>
          <SplitHeading
            primary="Off-plan launches"
            muted="by Dubai & UAE area"
            size="md"
            inline
            className="mt-4"
          />
          <div className="mt-8 flex flex-wrap gap-2.5">
            {offPlanAreas.map((area) => (
              <Link
                key={area.slug}
                href={`/off-plan/in/${area.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-medium text-[#121212] transition-colors hover:border-[#121212] hover:bg-[#121212] hover:text-white"
              >
                <span>{area.name}</span>
                <span className="font-mono text-[11px] opacity-60">{area.projects.length}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
