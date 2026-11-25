"use client";

import React, { useId, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Building2, MapPin, Search, Sparkles } from "lucide-react";
import type { Developer } from "@/lib/developers";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { LogoCloudMarquee } from "@/components/ui/logo-cloud-marquee";

const FILTER_TABS = [
  { id: "All", label: "All UAE Developers" },
  { id: "Dubai", label: "Dubai" },
  { id: "Branded & Waterfront", label: "Branded & Waterfront" },
  { id: "Abu Dhabi", label: "Abu Dhabi" },
  { id: "Sharjah", label: "Sharjah" },
  { id: "Ras Al Khaimah", label: "Ras Al Khaimah" },
  { id: "Umm Al Quwain", label: "Umm Al Quwain" },
] as const;

type FilterTabId = (typeof FILTER_TABS)[number]["id"];

const FEATURED_SLUGS = ["nakheel", "binghatti", "emaar", "damac", "azizi", "tarrad", "sobha", "omniyat", "ellington"];

export function DevelopersDirectory({ developers }: { developers: Developer[] }) {
  const uid = useId();
  const [activeTab, setActiveTab] = useState<FilterTabId>("All");
  const [query, setQuery] = useState("");
  const [spotlightSlug, setSpotlightSlug] = useState("nakheel");

  const logoDevelopers = useMemo(
    () =>
      developers
        .filter((d) => Boolean(d.logo))
        .map((d) => ({
          slug: d.slug,
          name: d.name,
          logo: d.logo as string,
          knownFor: d.knownFor,
        })),
    [developers]
  );

  const featuredDevs = useMemo(
    () =>
      FEATURED_SLUGS.map((s) => developers.find((d) => d.slug === s)).filter(
        (d): d is Developer => Boolean(d)
      ),
    [developers]
  );

  const activeSpotlight =
    featuredDevs.find((d) => d.slug === spotlightSlug) ?? featuredDevs[0] ?? developers[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return developers.filter((d) => {
      if (activeTab === "Dubai" && d.emirate !== "Dubai" && d.emirate !== "UAE") return false;
      if (
        (activeTab === "Abu Dhabi" ||
          activeTab === "Sharjah" ||
          activeTab === "Ras Al Khaimah" ||
          activeTab === "Umm Al Quwain") &&
        d.emirate !== activeTab
      ) {
        return false;
      }
      if (activeTab === "Branded & Waterfront") {
        const hayTier = `${d.knownFor} ${d.tagline} ${d.flagshipAreas.join(" ")}`.toLowerCase();
        if (!/waterfront|island|palm|branded|luxury|lagoon|beach|marina/.test(hayTier)) return false;
      }
      if (q) {
        const hay = `${d.name} ${d.tagline} ${d.knownFor} ${d.flagshipAreas.join(" ")} ${d.emirate} ${d.headquarters}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [developers, activeTab, query]);

  return (
    <section className="mx-auto max-w-[1260px] px-4 py-12 sm:px-8 space-y-14">
      {/* 1. Animated Original-Color Master Developer Logo Cloud Marquee */}
      <LogoCloudMarquee developers={logoDevelopers} />

      {/* 2. Interactive Master-Developer Spotlight Stage */}
      {activeSpotlight ? (
        <div className="rounded-[30px] border border-white/85 bg-white/84 p-6 sm:p-8 shadow-[0_24px_64px_rgba(12,56,96,0.11)] backdrop-blur-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/[0.06] pb-5">
            <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0e9f6e]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>FEATURED MASTER-DEVELOPER SPOTLIGHT</span>
            </div>
            <div className="flex flex-nowrap sm:flex-wrap gap-1.5 overflow-x-auto pb-1 w-full sm:w-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {featuredDevs.map((dev) => {
                const isSelected = dev.slug === activeSpotlight.slug;
                return (
                  <button
                    key={dev.slug}
                    type="button"
                    onClick={() => setSpotlightSlug(dev.slug)}
                    className={`relative shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                      isSelected
                        ? "text-white"
                        : "border border-black/10 bg-white text-[#475569] hover:border-[#121212] hover:text-[#121212]"
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId={`${uid}-spotlight-pill`}
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-0 rounded-full bg-[#121212]"
                      />
                    )}
                    <span className="relative z-10">{dev.name.split(" ")[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSpotlight.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 grid grid-cols-1 items-center gap-8 lg:grid-cols-12"
            >
              <div className="lg:col-span-4 flex flex-col items-center justify-center rounded-2xl border border-black/[0.06] bg-gradient-to-br from-[#fafdff] via-white to-[#f2f8fc] p-10 min-h-[200px]">
                {activeSpotlight.logo ? (
                  <img
                    src={activeSpotlight.logo}
                    alt={activeSpotlight.name}
                    className="max-h-20 max-w-[220px] object-contain"
                  />
                ) : (
                  <span className="text-3xl font-medium tracking-[-0.04em] text-[#121212]">
                    {activeSpotlight.name}
                  </span>
                )}
                <span className="mt-5 rounded-full bg-[#121212] px-3.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#51fec0]">
                  {activeSpotlight.emirate} · {activeSpotlight.knownFor}
                </span>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.03em] text-[#121212]">
                  {activeSpotlight.name}
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-[#475569]">
                  {activeSpotlight.tagline}
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {activeSpotlight.flagshipAreas.slice(0, 5).map((area) => (
                    <span
                      key={area}
                      className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-[#334155]"
                    >
                      <MapPin className="h-3 w-3 text-[#1b6aa7]" />
                      {area}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-3">
                  <Link
                    href={`/developers/${activeSpotlight.slug}`}
                    className="inline-flex items-center gap-2 rounded-full bg-[#121212] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0e9f6e] hover:shadow-lg"
                  >
                    <span>Explore {activeSpotlight.name} Portfolio</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#64748b]">
                    <Building2 className="h-3.5 w-3.5 text-[#1b6aa7]" />
                    HQ: {activeSpotlight.headquarters}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : null}

      {/* 3. Animated Filter Bar & Live Search */}
      <div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {FILTER_TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={active}
                onClick={() => setActiveTab(tab.id)}
                className={`relative cursor-pointer rounded-full px-5 py-2.5 text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 ${
                  active
                    ? "text-white"
                    : "border border-white/85 bg-white/82 text-[#334155] shadow-xs backdrop-blur-xl hover:border-[#121212] hover:bg-white hover:text-[#121212]"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId={`${uid}-filter-pill`}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-[#121212] shadow-md"
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mx-auto mt-6 max-w-xl relative">
          <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Nakheel, Binghatti, Emaar, DAMAC, Azizi, Sobha, Omniyat, Aldar..."
            aria-label="Search UAE developers"
            className="w-full rounded-full border border-white/85 bg-white/86 backdrop-blur-xl shadow-[0_12px_32px_rgba(12,56,96,0.08)] py-3.5 pr-5 pl-11 text-sm text-[#121212] placeholder:text-[#94a3b8] focus:border-[#121212] focus:bg-white focus:outline-none"
          />
        </div>

        {/* 4. Framer Motion Animated Developer Grid (Original Full-Color Logos) */}
        {filtered.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-white/85 bg-white/84 p-12 text-center backdrop-blur-xl">
            <h3 className="text-xl font-medium text-[#121212]">No developers match your filter</h3>
            <p className="mt-2 text-sm text-[#475569]">
              Try resetting your search or switching to All UAE Developers.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveTab("All");
                setQuery("");
              }}
              className="mt-5 cursor-pointer rounded-full bg-[#121212] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#0e9f6e]"
            >
              Reset Filter
            </button>
          </div>
        ) : (
        <motion.div
          layout
          className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((dev, idx) => (
              <motion.div
                key={dev.slug}
                layout
                initial={{ opacity: 0, y: 18, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.34,
                  delay: Math.min(idx * 0.03, 0.24),
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <SpotlightCard className="h-full">
                  <Link
                    href={`/developers/${dev.slug}`}
                    className="group flex h-full flex-col justify-between"
                  >
                    <div>
                      <div className="relative flex h-44 w-full items-center justify-center overflow-hidden border-b border-black/[0.06] bg-gradient-to-br from-[#fafdff] via-white to-[#f2f8fc] px-8">
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 bg-arch-grid-fade opacity-50"
                        />
                        <span className="absolute top-3.5 left-3.5 rounded-full bg-[#121212] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                          {dev.emirate}
                        </span>
                        <span className="absolute top-3.5 right-3.5 rounded-full border border-black/10 bg-white/95 px-3 py-1 text-[10px] font-medium text-[#475569]">
                          {dev.knownFor}
                        </span>

                        {dev.logo ? (
                          <img
                            src={dev.logo}
                            alt={dev.name}
                            loading="lazy"
                            className="relative z-10 mt-5 max-h-16 max-w-[190px] object-contain transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <span className="relative z-10 mt-5 text-2xl font-medium tracking-[-0.035em] text-[#121212] transition-colors group-hover:text-[#0e9f6e]">
                            {dev.name}
                          </span>
                        )}
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-medium tracking-[-0.025em] text-[#121212] transition-colors group-hover:text-[#0e9f6e]">
                          {dev.name}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#475569]">
                          {dev.tagline}
                        </p>

                        {dev.flagshipAreas.length > 0 ? (
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {dev.flagshipAreas.slice(0, 3).map((area) => (
                              <span
                                key={area}
                                className="rounded-full border border-black/[0.06] bg-[#f8fafc] px-2.5 py-1 text-[10.5px] font-medium text-[#475569] transition-colors group-hover:border-[#1b6aa7]/25"
                              >
                                {area}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-black/[0.06] px-6 py-4 text-xs font-medium text-[#121212]">
                      <span className="text-[#64748b]">{dev.headquarters}</span>
                      <span className="inline-flex items-center gap-1 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#0e9f6e]">
                        Explore Projects <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                </SpotlightCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        )}
      </div>
    </section>
  );
}
