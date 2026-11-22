"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import type { Developer } from "@/lib/developers";
import { SpotlightCard } from "@/components/ui/spotlight-card";

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
            {tab === "All" ? "All UAE Developers" : tab}
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
          placeholder="Search Nakheel, Binghatti, Emaar, DAMAC, Azizi, Sobha, Aldar..."
          aria-label="Search UAE developers"
          className="w-full rounded-full border border-white/85 bg-white/82 backdrop-blur-xl shadow-[0_10px_28px_rgba(12,56,96,0.08)] py-3 pr-5 pl-11 text-sm text-[#121212] placeholder:text-[#8b8b8b] focus:border-[#121212] focus:bg-white focus:outline-none"
        />
      </div>

      {/* Architectural Developer Showcase Grid — Original Full-Color Logos & Zero Repeated Photos */}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((dev) => (
          <SpotlightCard key={dev.slug}>
            <Link
              href={`/developers/${dev.slug}`}
              className="group flex h-full flex-col justify-between"
            >
              <div>
                {/* Crisp Studio Logo Stage (Original Colors, Zero Photo Duplication) */}
                <div className="relative flex h-40 w-full items-center justify-center overflow-hidden border-b border-black/[0.06] bg-gradient-to-br from-[#fafafa] via-white to-[#f3f5f4] px-8">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-arch-grid-fade opacity-50"
                  />
                  <span className="absolute top-3.5 left-3.5 rounded-full bg-[#121212] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white">
                    {dev.emirate}
                  </span>
                  <span className="absolute top-3.5 right-3.5 rounded-full border border-black/10 bg-white px-3 py-1 text-[10px] font-medium text-[#525252]">
                    {dev.knownFor}
                  </span>

                  {dev.logo ? (
                    <img
                      src={dev.logo}
                      alt={dev.name}
                      loading="lazy"
                      className="relative z-10 mt-4 max-h-14 max-w-[180px] object-contain transition-transform duration-300 group-hover:scale-[1.06]"
                    />
                  ) : (
                    <span className="relative z-10 mt-4 text-2xl font-medium tracking-[-0.035em] text-[#121212]">
                      {dev.name}
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-medium tracking-[-0.025em] text-[#121212] group-hover:text-[#0e9f6e] transition-colors">
                    {dev.name}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#666666]">
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
                  View Projects <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
}
