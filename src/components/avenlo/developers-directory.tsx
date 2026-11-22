"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import type { Developer } from "@/lib/developers";

const EMIRATE_TABS = ["All", "Dubai", "Abu Dhabi", "Sharjah", "Ras Al Khaimah"] as const;

export function DevelopersDirectory({ developers }: { developers: Developer[] }) {
  const [emirate, setEmirate] = useState<(typeof EMIRATE_TABS)[number]>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return developers.filter((d) => {
      if (emirate !== "All") {
        if (emirate === "Dubai" && d.emirate !== "Dubai" && d.emirate !== "UAE") return false;
        if (emirate !== "Dubai" && d.emirate !== emirate) return false;
      }
      if (q) {
        const hay = `${d.name} ${d.tagline} ${d.knownFor} ${d.flagshipAreas.join(" ")} ${d.emirate}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [developers, emirate, query]);

  return (
    <section className="mx-auto max-w-[1260px] px-4 py-14 sm:px-8">
      {/* Avenlo Pill Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {EMIRATE_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setEmirate(tab)}
            className={`cursor-pointer rounded-full px-5 py-2.5 text-xs font-medium transition-colors ${
              emirate === tab
                ? "bg-[#121212] text-white"
                : "border border-black/10 bg-white text-[#525252] hover:border-[#121212] hover:text-[#121212]"
            }`}
          >
            {tab === "All" ? `All Developers (${developers.length})` : tab}
          </button>
        ))}
      </div>

      {/* Compact Search */}
      <div className="mx-auto mt-7 max-w-xl relative">
        <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#8b8b8b]" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Emaar, Nakheel, Sobha, DAMAC, Binghatti, Aldar..."
          aria-label="Search UAE developers"
          className="w-full rounded-full border border-black/12 bg-[#f7f7f7] py-3 pr-5 pl-11 text-sm text-[#121212] placeholder:text-[#8b8b8b] focus:border-[#121212] focus:bg-white focus:outline-none"
        />
      </div>

      {/* Clean White Architectural Developer Grid */}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((dev) => (
          <Link
            key={dev.slug}
            href={`/developers/${dev.slug}`}
            className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-black/[0.07] bg-white transition-all duration-300 hover:border-black/20 hover:shadow-[0_20px_50px_rgba(18,18,18,0.08)]"
          >
            <div>
              <div className="relative h-44 w-full overflow-hidden bg-[#f5f5f5]">
                <img
                  src={dev.coverImage}
                  alt={`${dev.name} flagship UAE development`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-3.5 left-3.5 rounded-full bg-[#121212]/80 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white backdrop-blur-md">
                  {dev.emirate}
                </span>
                <span className="absolute top-3.5 right-3.5 rounded-full bg-white/92 px-3 py-1 font-mono text-[10px] font-medium text-[#121212]">
                  {dev.projectCount} Projects
                </span>
              </div>

              <div className="p-6">
                <div className="flex h-9 items-center">
                  {dev.logo ? (
                    <img
                      src={dev.logo}
                      alt={dev.name}
                      loading="lazy"
                      className="max-h-8 max-w-[140px] object-contain object-left"
                    />
                  ) : (
                    <span className="text-xl font-medium tracking-[-0.03em] text-[#121212]">
                      {dev.name}
                    </span>
                  )}
                </div>
                <h2 className="mt-3 text-lg font-medium tracking-[-0.025em] text-[#121212]">
                  {dev.name}
                </h2>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#666666]">
                  {dev.tagline}
                </p>

                {dev.flagshipAreas.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {dev.flagshipAreas.slice(0, 3).map((area) => (
                      <span
                        key={area}
                        className="rounded-full bg-[#f5f5f5] px-2.5 py-1 text-[10px] font-medium text-[#525252]"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-black/[0.06] px-6 py-4 text-xs font-medium text-[#121212]">
              <span className="text-[#8b8b8b]">{dev.headquarters}</span>
              <span className="inline-flex items-center gap-1 group-hover:text-[#0e9f6e]">
                View Profile <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
