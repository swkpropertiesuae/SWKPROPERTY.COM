"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Calendar, Search } from "lucide-react";
import type { BlogIndexEntry } from "@/lib/blog";
import { BLOG_ERAS } from "@/lib/blog";
import { SpotlightCard } from "@/components/ui/spotlight-card";

const PAGE_SIZE = 18;

export function InsightsExplorer({
  entries,
  categories,
}: {
  entries: BlogIndexEntry[];
  categories: string[];
}) {
  const [category, setCategory] = useState("All");
  const [eraId, setEraId] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const selectedEra = BLOG_ERAS.find((e) => e.id === eraId) ?? BLOG_ERAS[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((item) => {
      if (category !== "All" && item.category !== category) return false;
      const yr = Number(item.date.slice(0, 4));
      if (yr < selectedEra.minYear || yr > selectedEra.maxYear) return false;
      if (q) {
        const hay = `${item.title} ${item.excerpt} ${item.category} ${item.date} ${item.keywords.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [entries, category, selectedEra, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const featured = safePage === 1 && !query && category === "All" && eraId === "all" ? pageItems[0] : null;
  const gridItems = featured ? pageItems.slice(1) : pageItems;

  const resetFilters = () => {
    setCategory("All");
    setEraId("all");
    setQuery("");
    setPage(1);
  };

  return (
    <section className="mx-auto max-w-[1260px] px-4 py-14 sm:px-8 space-y-10">
      {/* Interactive Frosted-Glass Filter, Search & Era Timeline Deck */}
      <div className="rounded-[28px] border border-white/85 bg-white/84 p-5 sm:p-7 shadow-[0_20px_54px_rgba(12,56,96,0.09)] backdrop-blur-2xl space-y-5">
        {/* Search + Era Scrubber Row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 items-center">
          <div className="relative lg:col-span-5">
            <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search Palm Jebel Ali, Blue Line Metro, Golden Visa, DLD, JVC..."
              aria-label="Search Dubai real estate briefings"
              className="w-full rounded-full border border-black/10 bg-white py-3 pr-5 pl-11 text-sm text-[#121212] placeholder:text-[#94a3b8] focus:border-[#121212] focus:outline-none"
            />
          </div>

          <div className="lg:col-span-7 flex flex-wrap items-center gap-1.5 lg:justify-end">
            <span className="mr-1 inline-flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748b]">
              <Calendar className="h-3.5 w-3.5 text-[#1b6aa7]" />
              ERA:
            </span>
            {BLOG_ERAS.map((era) => {
              const active = eraId === era.id;
              return (
                <button
                  key={era.id}
                  type="button"
                  onClick={() => {
                    setEraId(era.id);
                    setPage(1);
                  }}
                  className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 ${
                    active
                      ? "bg-[#121212] text-white shadow-sm"
                      : "border border-black/10 bg-white text-[#475569] hover:border-[#121212] hover:text-[#121212]"
                  }`}
                >
                  {era.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Pills with Framer Motion layoutId */}
        <div className="flex flex-wrap items-center gap-2 border-t border-black/[0.06] pt-4">
          {categories.map((cat) => {
            const active = category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setCategory(cat);
                  setPage(1);
                }}
                className={`relative cursor-pointer rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 ${
                  active
                    ? "text-white"
                    : "border border-black/[0.08] bg-white/90 text-[#334155] hover:border-[#121212] hover:text-[#121212]"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="insights-category-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-[#121212] shadow-sm"
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Lead Editorial Card */}
      {featured ? (
        <SpotlightCard>
          <Link
            href={`/insights/${featured.slug}`}
            className="group grid grid-cols-1 overflow-hidden lg:grid-cols-12"
          >
            <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[340px] lg:col-span-6 overflow-hidden bg-[#e7f2f9]">
              <img
                src={featured.image}
                alt={featured.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute top-4 left-4 rounded-full bg-[#121212]/90 px-3.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#51fec0] backdrop-blur-md">
                FEATURED BRIEFING · {featured.date}
              </span>
            </div>
            <div className="flex flex-col justify-between p-7 sm:p-10 lg:col-span-6">
              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1b6aa7]">
                  {featured.category} · {featured.readTime}
                </p>
                <h2 className="mt-3 text-2xl sm:text-3xl font-medium leading-[1.15] tracking-[-0.03em] text-[#121212] transition-colors group-hover:text-[#0e9f6e]">
                  {featured.title}
                </h2>
                <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#475569]">
                  {featured.excerpt}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-black/[0.06] pt-5 text-xs font-semibold text-[#121212]">
                <span className="font-mono uppercase tracking-[0.14em] text-[#64748b]">
                  Sheikh Zayed Road Research Desk
                </span>
                <span className="inline-flex items-center gap-1.5 transition-all group-hover:translate-x-0.5 group-hover:text-[#0e9f6e]">
                  Read Full Briefing <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        </SpotlightCard>
      ) : null}

      {/* Editorial Grid */}
      {gridItems.length === 0 ? (
        <div className="rounded-3xl border border-white/85 bg-white/84 p-12 text-center backdrop-blur-xl">
          <h3 className="text-xl font-medium text-[#121212]">No briefings match that filter</h3>
          <p className="mt-2 text-sm text-[#475569]">
            Try broadening your era or keyword search across our Dubai real estate archive.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 cursor-pointer rounded-full bg-[#121212] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#0e9f6e]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {gridItems.map((art) => (
            <SpotlightCard key={art.slug} className="h-full">
              <Link
                href={`/insights/${art.slug}`}
                className="group flex h-full flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#e7f2f9]">
                    <img
                      src={art.image}
                      alt={art.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-[#121212]/80 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.14em] text-white backdrop-blur-md">
                      {art.date.slice(0, 4)}
                    </span>
                  </div>
                  <div className="p-6">
                    <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#1b6aa7]">
                      {art.category} · {art.readTime}
                    </p>
                    <h3 className="mt-2.5 text-[19px] font-medium leading-[1.25] tracking-[-0.025em] text-[#121212] transition-colors group-hover:text-[#0e9f6e]">
                      {art.title}
                    </h3>
                    <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed text-[#475569]">
                      {art.excerpt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-black/[0.06] px-6 py-4 text-xs font-medium text-[#121212]">
                  <span className="font-mono text-[11px] text-[#64748b]">{art.date}</span>
                  <span className="inline-flex items-center gap-1 transition-all group-hover:translate-x-0.5 group-hover:text-[#0e9f6e]">
                    Read Briefing <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </SpotlightCard>
          ))}
        </div>
      )}

      {/* Clean Archive Pagination */}
      {totalPages > 1 ? (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => {
              setPage((p) => Math.max(1, p - 1));
              window.scrollTo({ top: 320, behavior: "smooth" });
            }}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/85 bg-white/88 px-4 py-2 text-xs font-semibold text-[#121212] shadow-xs transition-all hover:-translate-y-0.5 hover:bg-[#121212] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Previous</span>
          </button>

          <span className="rounded-full border border-white/85 bg-white/82 px-4 py-2 font-mono text-xs font-semibold text-[#121212] backdrop-blur-md">
            Page {safePage} of {totalPages}
          </span>

          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => {
              setPage((p) => Math.min(totalPages, p + 1));
              window.scrollTo({ top: 320, behavior: "smooth" });
            }}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/85 bg-white/88 px-4 py-2 text-xs font-semibold text-[#121212] shadow-xs transition-all hover:-translate-y-0.5 hover:bg-[#121212] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span>Next</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}
    </section>
  );
}
