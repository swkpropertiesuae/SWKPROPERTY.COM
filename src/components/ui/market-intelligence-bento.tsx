"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Building2, Landmark, ShieldCheck, TrendingUp } from "lucide-react";
import { BracketLink } from "@/components/avenlo/bracket-button";
import { SectionEyebrow, SplitHeading } from "@/components/avenlo/motion";

interface DistrictIntel {
  slug: string;
  name: string;
  tier: string;
  psfAed: string;
  grossYield: string;
  cycleGrowth: string;
  liquidity: string;
  serviceCharge: string;
  summary: string;
  trendPoints: number[]; // normalized 20..100 for 6-year curve 2021-2026
  years: string[];
  highlights: string[];
}

const DISTRICTS: DistrictIntel[] = [
  {
    slug: "downtown-dubai",
    name: "Downtown Dubai",
    tier: "Prime Urban Core",
    psfAed: "AED 2,840",
    grossYield: "6.4%",
    cycleGrowth: "+14.2%",
    liquidity: "Tier-1 Resale",
    serviceCharge: "AED 22–28 / sq ft",
    summary:
      "Anchored by Burj Khalifa, Dubai Opera, and Dubai Mall, Downtown combines global trophy demand with year-round executive and short-stay occupancy.",
    trendPoints: [42, 54, 66, 77, 89, 96],
    years: ["2021", "2022", "2023", "2024", "2025", "2026"],
    highlights: ["Red Line Metro walkable", "Global resale liquidity", "Strong branded premium"],
  },
  {
    slug: "palm-jumeirah",
    name: "Palm Jumeirah",
    tier: "Ultra-Prime Waterfront",
    psfAed: "AED 3,650",
    grossYield: "5.8%",
    cycleGrowth: "+16.8%",
    liquidity: "Scarcity Trophy",
    serviceCharge: "AED 18–34 / sq ft",
    summary:
      "Fixed beachfront island supply drives enduring appreciation across frond villas, Shoreline apartments, and hospitality-serviced crescent residences.",
    trendPoints: [48, 63, 76, 86, 94, 100],
    years: ["2021", "2022", "2023", "2024", "2025", "2026"],
    highlights: ["Zero new frond land", "Global UHNW demand", "High winter holiday yield"],
  },
  {
    slug: "dubai-creek-harbour",
    name: "Dubai Creek Harbour",
    tier: "Waterfront Growth",
    psfAed: "AED 2,210",
    grossYield: "7.1%",
    cycleGrowth: "+15.4%",
    liquidity: "Rising Core",
    serviceCharge: "AED 18–22 / sq ft",
    summary:
      "Emaar's flagship marina district overlooking Ras Al Khor sanctuary gains major structural momentum from the confirmed Dubai Metro Blue Line station.",
    trendPoints: [34, 46, 61, 74, 86, 95],
    years: ["2021", "2022", "2023", "2024", "2025", "2026"],
    highlights: ["Metro Blue Line catalyst", "Direct Downtown skyline", "Emaar masterplan depth"],
  },
  {
    slug: "business-bay",
    name: "Business Bay",
    tier: "Central Canal & Mixed",
    psfAed: "AED 2,340",
    grossYield: "7.2%",
    cycleGrowth: "+13.6%",
    liquidity: "High Velocity",
    serviceCharge: "AED 19–25 / sq ft",
    summary:
      "Canal-front branded towers like Bugatti Residences and VELA sit beside Grade-A corporate offices minutes from DIFC and Downtown.",
    trendPoints: [38, 49, 63, 75, 84, 92],
    years: ["2021", "2022", "2023", "2024", "2025", "2026"],
    highlights: ["Strong corporate tenant pool", "Marasi Bay luxury wave", "Residential + Grade-A offices"],
  },
  {
    slug: "jvc",
    name: "Jumeirah Village Circle",
    tier: "High-Yield Urban",
    psfAed: "AED 1,380",
    grossYield: "8.2%",
    cycleGrowth: "+12.9%",
    liquidity: "Volume Leader",
    serviceCharge: "AED 13–17 / sq ft",
    summary:
      "Dubai's top transaction-volume district rewards selective investors choosing design-led Ellington, Binghatti, and Imtiaz buildings with healthy net cash flow.",
    trendPoints: [30, 42, 57, 71, 83, 91],
    years: ["2021", "2022", "2023", "2024", "2025", "2026"],
    highlights: ["Accessible AED entry", "Leading gross rental yield", "Circle Mall & park maturity"],
  },
  {
    slug: "dubai-hills-estate",
    name: "Dubai Hills Estate",
    tier: "Green Family Masterplan",
    psfAed: "AED 2,420",
    grossYield: "6.7%",
    cycleGrowth: "+15.9%",
    liquidity: "End-User Anchor",
    serviceCharge: "AED 5–19 / sq ft",
    summary:
      "Built around an 18-hole golf course, Dubai Hills Mall, and flagship schools, end-user family occupancy anchors remarkable multi-cycle price resilience.",
    trendPoints: [36, 51, 68, 81, 91, 98],
    years: ["2021", "2022", "2023", "2024", "2025", "2026"],
    highlights: ["High end-user ownership", "Low villa service charges", "Central Al Khail access"],
  },
  {
    slug: "damac-lagoons",
    name: "DAMAC Lagoons",
    tier: "Lagoon Villa Cluster",
    psfAed: "AED 1,560",
    grossYield: "7.4%",
    cycleGrowth: "+16.1%",
    liquidity: "Handover Inflection",
    serviceCharge: "AED 5–7 / sq ft",
    summary:
      "Swimmable crystal-lagoon townhouse clusters transitioning from off-plan development into live family rental absorption across Dubailand.",
    trendPoints: [26, 40, 56, 70, 84, 93],
    years: ["2021", "2022", "2023", "2024", "2025", "2026"],
    highlights: ["Strong family sq ft value", "Low townhouse Mollak fees", "Resort lagoon lifestyle"],
  },
  {
    slug: "dubai-marina",
    name: "Dubai Marina",
    tier: "Mature Waterfront",
    psfAed: "AED 2,290",
    grossYield: "7.0%",
    cycleGrowth: "+11.8%",
    liquidity: "Deepest Leasing",
    serviceCharge: "AED 18–24 / sq ft",
    summary:
      "Red Line Metro, Dubai Tram, JBR beach access, and yacht-front promenades sustain one of the deepest year-round tenant pools in the Middle East.",
    trendPoints: [44, 55, 67, 76, 85, 91],
    years: ["2021", "2022", "2023", "2024", "2025", "2026"],
    highlights: ["Metro + Tram connectivity", "Year-round expat demand", "Upgraded waterfront stock"],
  },
];

const YIELD_BARS = [
  { name: "JVC", yieldVal: 8.2, psf: "1,380", slug: "jvc" },
  { name: "DAMAC Lagoons", yieldVal: 7.4, psf: "1,560", slug: "damac-lagoons" },
  { name: "Business Bay", yieldVal: 7.2, psf: "2,340", slug: "business-bay" },
  { name: "Creek Harbour", yieldVal: 7.1, psf: "2,210", slug: "dubai-creek-harbour" },
  { name: "Dubai Marina", yieldVal: 7.0, psf: "2,290", slug: "dubai-marina" },
  { name: "Dubai Hills", yieldVal: 6.7, psf: "2,420", slug: "dubai-hills-estate" },
  { name: "Downtown", yieldVal: 6.4, psf: "2,840", slug: "downtown-dubai" },
  { name: "Palm Jumeirah", yieldVal: 5.8, psf: "3,650", slug: "palm-jumeirah" },
];

function buildSmoothPath(points: number[], w: number, h: number, padX = 24, padY = 20) {
  const usableW = w - padX * 2;
  const usableH = h - padY * 2;
  const coords = points.map((v, i) => ({
    x: padX + (i / Math.max(1, points.length - 1)) * usableW,
    y: padY + usableH - ((v - 15) / 90) * usableH,
  }));
  if (coords.length < 2) return { line: "", area: "", coords };
  let line = `M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const curr = coords[i];
    const next = coords[i + 1];
    const cx = ((curr.x + next.x) / 2).toFixed(1);
    line += ` C ${cx} ${curr.y.toFixed(1)}, ${cx} ${next.y.toFixed(1)}, ${next.x.toFixed(1)} ${next.y.toFixed(1)}`;
  }
  const area = `${line} L ${coords[coords.length - 1].x.toFixed(1)} ${h} L ${coords[0].x.toFixed(1)} ${h} Z`;
  return { line, area, coords };
}

export function MarketIntelligenceBento() {
  const [selectedSlug, setSelectedSlug] = useState<string>("downtown-dubai");
  const [hoveredYearIdx, setHoveredYearIdx] = useState<number | null>(null);

  const active = DISTRICTS.find((d) => d.slug === selectedSlug) ?? DISTRICTS[0];
  const { line, area, coords } = buildSmoothPath(active.trendPoints, 540, 200);

  return (
    <section
      aria-label="Dubai Real Estate Market Intelligence"
      className="relative border-y border-white/65 bg-white/24 py-24 backdrop-blur-[2px]"
    >
      <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionEyebrow>DUBAI MARKET INTELLIGENCE</SectionEyebrow>
            <SplitHeading
              primary="Data-led conviction,"
              muted="district by district"
              className="mt-5"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <BracketLink href="/calculators" variant="light" size="sm">
              DLD &amp; Yield Calculators
            </BracketLink>
            <BracketLink href="/communities" variant="light" size="sm">
              All Community Guides
            </BracketLink>
          </div>
        </div>

        {/* Interactive District Switcher Pills with Framer Motion layoutId */}
        <div className="mt-10 flex flex-wrap items-center gap-2">
          {DISTRICTS.map((dist) => {
            const isSelected = dist.slug === active.slug;
            return (
              <button
                key={dist.slug}
                type="button"
                onClick={() => {
                  setSelectedSlug(dist.slug);
                  setHoveredYearIdx(null);
                }}
                className={`relative cursor-pointer rounded-full px-4 py-2.5 text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 ${
                  isSelected
                    ? "text-white"
                    : "border border-white/85 bg-white/80 text-[#1e293b] shadow-xs backdrop-blur-xl hover:border-[#121212] hover:bg-white hover:text-[#121212]"
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="market-intel-active-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-[#121212] shadow-[0_12px_28px_rgba(12,35,58,0.28)]"
                  />
                )}
                <span className="relative z-10">{dist.name}</span>
              </button>
            );
          })}
        </div>

        {/* Luminous Frosted-Glass Bento Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Main Stage: Active District Trajectory + 4 Live KPI Cards */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-[28px] border border-white/85 bg-white/84 p-6 sm:p-8 shadow-[0_24px_64px_rgba(12,56,96,0.11)] backdrop-blur-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#0e9f6e]/25 bg-[#0e9f6e]/[0.08] px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0e9f6e]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0e9f6e]" />
                    {active.tier}
                  </span>
                  <Link
                    href={`/communities/${active.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#121212] underline underline-offset-4 transition-colors hover:text-[#0e9f6e]"
                  >
                    <span>Explore {active.name}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <h3 className="mt-4 text-2xl sm:text-3xl font-medium tracking-[-0.03em] text-[#121212]">
                  {active.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#475569]">{active.summary}</p>

                {/* 4 Crisp KPI Metric Tiles */}
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Indicative / sq ft", value: active.psfAed, icon: Building2 },
                    { label: "Gross Yield", value: active.grossYield, icon: TrendingUp },
                    { label: "YoY Momentum", value: active.cycleGrowth, icon: Landmark },
                    { label: "Mollak Guide", value: active.serviceCharge.replace(" / sq ft", ""), icon: ShieldCheck },
                  ].map((kpi) => (
                    <div
                      key={kpi.label}
                      className="rounded-2xl border border-black/[0.06] bg-white/95 p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1b6aa7]/35 hover:shadow-md"
                    >
                      <kpi.icon className="h-4 w-4 text-[#1b6aa7]" />
                      <p className="mt-2.5 text-lg sm:text-xl font-semibold tracking-[-0.03em] text-[#121212] tabular-nums">
                        {kpi.value}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#64748b]">{kpi.label}</p>
                    </div>
                  ))}
                </div>

                {/* Interactive Luminous SVG Demand Curve (2021-2026) */}
                <div className="mt-6 rounded-2xl border border-black/[0.06] bg-gradient-to-b from-[#f8fbff] to-white p-4 sm:p-5">
                  <div className="mb-2 flex items-center justify-between text-[11px]">
                    <span className="font-mono font-semibold uppercase tracking-[0.16em] text-[#1b6aa7]">
                      2021–2026 FREEHOLD DEMAND CURVE · HOVER POINTS
                    </span>
                    <span className="font-mono font-semibold text-[#0e9f6e]">
                      {hoveredYearIdx !== null
                        ? `${active.years[hoveredYearIdx]} · Index ${Math.round(active.trendPoints[hoveredYearIdx] * 1.9)}`
                        : `Liquidity: ${active.liquidity}`}
                    </span>
                  </div>
                  <svg viewBox="0 0 540 215" className="h-[180px] w-full overflow-visible">
                    <defs>
                      <linearGradient id="swkIntelArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0e9f6e" stopOpacity="0.24" />
                        <stop offset="100%" stopColor="#1b6aa7" stopOpacity="0.01" />
                      </linearGradient>
                      <linearGradient id="swkIntelStroke" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#1b6aa7" />
                        <stop offset="100%" stopColor="#0e9f6e" />
                      </linearGradient>
                    </defs>

                    {[45, 95, 145].map((y) => (
                      <line
                        key={y}
                        x1="20"
                        x2="520"
                        y1={y}
                        y2={y}
                        stroke="rgba(12,35,58,0.07)"
                        strokeDasharray="4 4"
                      />
                    ))}

                    <motion.path
                      d={area}
                      fill="url(#swkIntelArea)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.45 }}
                    />
                    <motion.path
                      d={line}
                      fill="none"
                      stroke="url(#swkIntelStroke)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    />

                    {coords.map((pt, idx) => {
                      const isHot = hoveredYearIdx === idx || (hoveredYearIdx === null && idx === coords.length - 1);
                      return (
                        <g
                          key={active.years[idx]}
                          onMouseEnter={() => setHoveredYearIdx(idx)}
                          onMouseLeave={() => setHoveredYearIdx(null)}
                          className="cursor-pointer"
                        >
                          <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={isHot ? 6.5 : 4.5}
                            fill={isHot ? "#0e9f6e" : "#ffffff"}
                            stroke={isHot ? "#121212" : "#1b6aa7"}
                            strokeWidth="2.5"
                          />
                          <text
                            x={pt.x}
                            y="206"
                            textAnchor="middle"
                            className="fill-[#64748b] font-mono text-[10.5px] font-medium"
                          >
                            {active.years[idx]}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* District Edge Pills */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {active.highlights.map((hl) => (
                    <span
                      key={hl}
                      className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-xs font-medium text-[#334155]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#0e9f6e]" />
                      {hl}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Live Interactive Yield Comparison Bar Leaderboard */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-[28px] border border-white/85 bg-white/84 p-6 sm:p-8 shadow-[0_24px_64px_rgba(12,56,96,0.11)] backdrop-blur-2xl">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1b6aa7]">
                INDICATIVE GROSS YIELD LEADERBOARD
              </p>
              <h3 className="mt-2 text-xl sm:text-2xl font-medium tracking-[-0.03em] text-[#121212]">
                Click any corridor to compare
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#64748b]">
                Benchmarking gross rental return alongside indicative AED/sq ft across Dubai&apos;s highest-demand residential corridors.
              </p>

              <div className="mt-6 space-y-3">
                {YIELD_BARS.map((bar) => {
                  const isSelected = bar.slug === active.slug;
                  const pct = Math.min(100, (bar.yieldVal / 9.0) * 100);
                  return (
                    <button
                      key={bar.slug}
                      type="button"
                      onClick={() => setSelectedSlug(bar.slug)}
                      className={`group w-full cursor-pointer rounded-2xl border p-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                        isSelected
                          ? "border-[#121212] bg-[#121212] text-white shadow-md"
                          : "border-black/[0.06] bg-white/90 text-[#121212] hover:border-[#1b6aa7]/45 hover:bg-white hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span>{bar.name}</span>
                        <span className="font-mono tabular-nums">
                          <strong className={isSelected ? "text-[#51fec0]" : "text-[#0e9f6e]"}>
                            {bar.yieldVal.toFixed(1)}%
                          </strong>
                          <span className={`ml-2 text-[10.5px] ${isSelected ? "text-white/65" : "text-[#64748b]"}`}>
                            AED {bar.psf}/sf
                          </span>
                        </span>
                      </div>
                      <div
                        className={`mt-2 h-2 w-full overflow-hidden rounded-full ${
                          isSelected ? "bg-white/15" : "bg-[#e2e8f0]"
                        }`}
                      >
                        <motion.div
                          initial={false}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                          className={`h-full rounded-full ${
                            isSelected
                              ? "bg-gradient-to-r from-[#51fec0] to-[#57d2f4]"
                              : "bg-gradient-to-r from-[#1b6aa7] to-[#0e9f6e]"
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-[#1b6aa7]/15 bg-[#f0f8fe]/80 p-4 text-[11.5px] leading-relaxed text-[#334155]">
              <strong className="font-semibold text-[#0c233a]">RERA Benchmark Note:</strong> Indicative figures compiled for orientation only—not guaranteed yields or formal valuations. Request a building-specific DLD &amp; Mollak net-yield worksheet from our Sheikh Zayed Road desk.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
