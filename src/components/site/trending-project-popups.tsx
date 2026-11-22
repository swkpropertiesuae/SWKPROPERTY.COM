"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Flame, ShieldCheck, Sparkles, X } from "lucide-react";
import { SITE } from "@/lib/swk";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";

interface TrendingDeal {
  id: string;
  tab: "off-plan" | "secondary" | "commercial";
  eyebrow: string;
  title: string;
  shortTitle: string;
  developer: string;
  community: string;
  priceGuide: string;
  planHighlight: string;
  image: string;
  href: string;
  benefits: string[];
}

const TRENDING_DEALS: TrendingDeal[] = [
  {
    id: "palm-jebel-ali",
    tab: "off-plan",
    eyebrow: "TRENDING OFF-PLAN LAUNCH · NAKHEEL",
    title: "Palm Jebel Ali Beachfront Frond Villas",
    shortTitle: "Palm Jebel Ali Villas",
    developer: "Nakheel",
    community: "Palm Jebel Ali, Dubai",
    priceGuide: "From AED 18.5M",
    planHighlight: "80/20 Construction-Linked · 0% Buyer Fee",
    image: "/img/projects/nakheel/palm-jebel-ali.webp",
    href: "/off-plan/palm-jebel-ali",
    benefits: [
      "0% brokerage commission on direct developer release",
      "Protected under Dubai RERA Escrow Law No. 8 of 2007",
      "Qualifies directly for 10-Year UAE Golden Visa",
      "Private sandy beach access across 16 masterplanned fronds",
    ],
  },
  {
    id: "mercedes-benz-places",
    tab: "off-plan",
    eyebrow: "BRANDED DOWNTOWN ICON · BINGHATTI",
    title: "Mercedes-Benz Places by Binghatti",
    shortTitle: "Mercedes-Benz Places",
    developer: "Binghatti",
    community: "Downtown Dubai · Burj Khalifa Views",
    priceGuide: "From AED 8.8M",
    planHighlight: "70/30 Structured Plan · Direct Allocation",
    image: "/img/projects/binghatti/mercedes-benz-places-hd.webp",
    href: "/off-plan/mercedes-benz-places",
    benefits: [
      "65-storey architectural landmark facing Burj Khalifa",
      "Direct developer floor-plate & inventory access via SWK",
      "10-Year UAE Golden Visa eligibility on DLD Oqood",
      "Zero annual property tax & zero capital gains tax in Dubai",
    ],
  },
  {
    id: "creek-haven",
    tab: "off-plan",
    eyebrow: "BLUE LINE WATERFRONT · EMAAR",
    title: "Creek Haven & Dubai Creek Harbour",
    shortTitle: "Creek Haven · Emaar",
    developer: "Emaar Properties",
    community: "Dubai Creek Harbour",
    priceGuide: "From AED 1.65M",
    planHighlight: "80/20 Emaar Schedule · Metro Blue Line Axis",
    image: "/img/projects/emaar/creek-haven-hd.webp",
    href: "/off-plan/creek-haven",
    benefits: [
      "Positioned directly along the confirmed Dubai Metro Blue Line",
      "Emaar's flagship waterfront track record & resale liquidity",
      "Strong long-term rental yield potential overlooking Ras Al Khor",
      "Full written AED closing & Mollak fee sheet before booking",
    ],
  },
  {
    id: "downtown-ready-secondary",
    tab: "secondary",
    eyebrow: "PRIME SECONDARY & HANDOVER · READY TITLE DEED",
    title: "Burj Crown, Palm Shoreline & Dubai Hills Ready Homes",
    shortTitle: "Ready Dubai Homes",
    developer: "Emaar · Nakheel · Sobha · Ellington",
    community: "Downtown · Palm Jumeirah · Dubai Hills",
    priceGuide: "Ready Title Deed Stock",
    planHighlight: "Immediate Transfer · Vacant on Handover Options",
    image: "/img/listings/burj-crown-boulevard-3br-downtown-dubai.webp",
    href: "/buy",
    benefits: [
      "Start earning tax-free rental income or move in immediately",
      "Independent DLD achieved-transfer comparable pricing audit",
      "Form F, Developer NOC & DLD Trustee transfer managed end-to-end",
      "UAE resident & non-resident mortgage pre-approval guidance",
    ],
  },
  {
    id: "szr-commercial",
    tab: "commercial",
    eyebrow: "GRADE-A COMMERCIAL SPACES · SZR & DIFC",
    title: "Freehold Offices & Headquarters Along Sheikh Zayed Road",
    shortTitle: "SZR & DIFC Offices",
    developer: "DIFC · Business Bay · Sheikh Zayed Road",
    community: "Prime Commercial Corridors",
    priceGuide: "Fitted & Full-Floor Suites",
    planHighlight: "High Corporate Occupancy · Strong Commercial Yields",
    image: "/img/listings/business-bay-canal-executive-headquarters-commercial.webp",
    href: "/properties?type=Office",
    benefits: [
      "Tightest Grade-A office vacancy across DIFC, SZR & Business Bay",
      "Dedicated parking ratios & direct Red Line Metro connectivity",
      "Clear DED mainland & DMCC/DIFC commercial title options",
      "Full 5% VAT & corporate Ejari leasing structuring",
    ],
  },
];

const EXIT_BENEFITS = [
  "0% buyer commission on all direct Dubai off-plan launches",
  "Verified DLD Escrow & Oqood / Title Deed checks before any deposit",
  "Side-by-side net rental yield & Mollak service-charge comparison in AED",
  "Priority access across Nakheel, Emaar, Binghatti, DAMAC, Azizi & Sobha",
  "Full 10-Year UAE Golden Visa (AED 2M+) & UAE mortgage structuring",
];

export function TrendingProjectPopups() {
  const [tickerIdx, setTickerIdx] = useState(0);
  const [pillDismissed, setPillDismissed] = useState(false);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"off-plan" | "secondary" | "commercial">("off-plan");
  const [exitOpen, setExitOpen] = useState(false);

  // Quick exit-intent callback form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Rotate live trending pill every 6.5s
  useEffect(() => {
    const id = window.setInterval(() => {
      setTickerIdx((v) => (v + 1) % TRENDING_DEALS.length);
    }, 6500);
    return () => window.clearInterval(id);
  }, []);

  // Lock background body scroll while any modal is open
  useEffect(() => {
    if (!spotlightOpen && !exitOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [spotlightOpen, exitOpen]);

  // Gentle timed spotlight once per browser session (38s) unless already closed or exit shown
  useEffect(() => {
    try {
      if (sessionStorage.getItem("swk_spotlight_seen")) return;
    } catch {
      return;
    }
    const timer = window.setTimeout(() => {
      try {
        if (!sessionStorage.getItem("swk_spotlight_seen") && !sessionStorage.getItem("swk_exit_seen")) {
          sessionStorage.setItem("swk_spotlight_seen", "1");
          setSpotlightOpen(true);
        }
      } catch {
        // ignore storage errors
      }
    }, 38000);
    return () => window.clearTimeout(timer);
  }, []);

  // Desktop Exit-Intent listener (triggers once per session when cursor leaves top of viewport)
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY > 6) return;
      try {
        if (sessionStorage.getItem("swk_exit_seen")) return;
        sessionStorage.setItem("swk_exit_seen", "1");
      } catch {
        return;
      }
      setSpotlightOpen(false);
      setExitOpen(true);
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSpotlightOpen(false);
        setExitOpen(false);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  const currentPillDeal = TRENDING_DEALS[tickerIdx] ?? TRENDING_DEALS[0];
  const tabDeals = TRENDING_DEALS.filter((d) => d.tab === activeTab);
  const featuredDeal = tabDeals[0] ?? TRENDING_DEALS[0];

  const handleExitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (phone.replace(/[^\d+]/g, "").length < 7) {
      setErrorMsg("Enter a valid phone or WhatsApp number (with country code).");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          context: "exit-intent-brief",
          name: name.trim() || "Dubai Property Investor",
          phone: phone.trim(),
          email: email.trim(),
          message: "Requested priority Dubai off-plan & secondary brief via exit popup.",
          pageUrl: typeof window !== "undefined" ? window.location.href : SITE.url,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setErrorMsg(
          data.error ||
            `Instant dispatch is offline — message us directly on WhatsApp (${SITE.phoneDisplay}) for immediate floor plans.`
        );
      } else {
        setSent(true);
      }
    } catch {
      setErrorMsg(
        `Network issue — message our Sheikh Zayed Road desk on WhatsApp at ${SITE.phoneDisplay}.`
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* 1. Floating Live Trending Project Alert Pill (Ultra-compact & dismissible on Mobile + Desktop) */}
      {!pillDismissed && !spotlightOpen && !exitOpen ? (
        <div
          className="fixed left-3 right-3 sm:left-5 sm:right-auto z-[72] flex items-center justify-between gap-2 rounded-full border border-white/90 bg-white/95 py-1.5 pl-2 pr-1.5 sm:py-2 sm:pl-2.5 sm:pr-3 text-[#121212] shadow-[0_14px_36px_rgba(12,35,58,0.18)] backdrop-blur-2xl transition-all duration-300 sm:hover:-translate-y-0.5 sm:hover:shadow-[0_24px_54px_rgba(12,35,58,0.24)] bottom-[70px] sm:bottom-5 max-w-[360px] sm:max-w-none mx-auto sm:mx-0"
        >
          <button
            type="button"
            onClick={() => {
              setActiveTab(currentPillDeal.tab);
              setSpotlightOpen(true);
            }}
            className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 sm:gap-2.5 text-left"
          >
            <span className="relative flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-[#121212] text-[#51fec0]">
              <Flame className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#0e9f6e] ring-2 ring-white" />
            </span>
            <span className="min-w-0 flex-1 sm:max-w-[235px]">
              <span className="block font-mono text-[8.5px] sm:text-[9.5px] font-semibold uppercase tracking-[0.14em] sm:tracking-[0.16em] text-[#0e9f6e] truncate">
                <span className="sm:hidden">Trending · Tap Benefits</span>
                <span className="hidden sm:inline">Trending Dubai Alert · View Benefits</span>
              </span>
              <span className="block truncate text-[11.5px] sm:text-xs font-semibold text-[#121212]">
                <span className="sm:hidden">{currentPillDeal.shortTitle}</span>
                <span className="hidden sm:inline">{currentPillDeal.title}</span>
              </span>
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[#1b6aa7]" />
          </button>
          <button
            type="button"
            aria-label="Close trending alert"
            onClick={() => setPillDismissed(true)}
            className="inline-flex h-7 w-7 sm:h-7 sm:w-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-black/[0.08] text-[#121212] transition-colors hover:bg-[#121212] hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}

      {/* 2. Trending Projects & Benefits Spotlight Modal (Compact Mobile Sheet + Pinned Visible Close Button) */}
      <AnimatePresence>
        {spotlightOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Trending Dubai Real Estate Opportunities"
            className="fixed inset-0 z-[120] flex items-center justify-center bg-[#060f1a]/82 p-3 sm:p-6 backdrop-blur-xl"
            onClick={() => setSpotlightOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[84dvh] sm:max-h-[90dvh] w-full max-w-[390px] sm:max-w-5xl flex-col overflow-hidden rounded-[22px] sm:rounded-[32px] border border-white/25 bg-white/98 text-[#121212] shadow-[0_40px_120px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
            >
              {/* Pinned Top Bar (Never scrolls away — Close button ALWAYS clearly visible!) */}
              <div className="shrink-0 border-b border-black/[0.08] bg-white px-4 py-3 sm:px-8 sm:py-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#121212] px-2.5 py-1 font-mono text-[9.5px] sm:text-[10px] font-semibold uppercase tracking-[0.15em] text-[#51fec0] truncate">
                      <Sparkles className="h-3 w-3 shrink-0" />
                      <span className="truncate">LIVE DUBAI DESK</span>
                    </span>
                    <span className="hidden md:inline text-xs text-[#64748b]">
                      RERA ORN {SITE.reraOrn} · 25th Floor, Al Saqr Building
                    </span>
                  </div>

                  {/* Desktop tabs + Always-Visible Close Button */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="hidden sm:flex items-center gap-1.5">
                      {(
                        [
                          ["off-plan", "Off-Plan Launches"],
                          ["secondary", "Ready & Handover"],
                          ["commercial", "Commercial"],
                        ] as const
                      ).map(([tabKey, label]) => (
                        <button
                          key={tabKey}
                          type="button"
                          onClick={() => setActiveTab(tabKey)}
                          className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-all ${
                            activeTab === tabKey
                              ? "bg-[#121212] text-white"
                              : "border border-black/10 bg-white text-[#475569] hover:border-[#121212] hover:text-[#121212]"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      aria-label="Close trending projects modal"
                      onClick={() => setSpotlightOpen(false)}
                      className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#121212] text-white shadow-md ring-2 ring-black/10 transition-all hover:bg-[#0e9f6e] sm:border sm:border-black/15 sm:bg-white sm:text-[#121212] sm:hover:bg-[#121212] sm:hover:text-white"
                    >
                      <X className="h-4 w-4 stroke-[2.4]" />
                    </button>
                  </div>
                </div>

                {/* Compact Mobile Tab Bar */}
                <div className="mt-2.5 grid grid-cols-3 gap-1.5 sm:hidden">
                  {(
                    [
                      ["off-plan", "Off-Plan"],
                      ["secondary", "Ready"],
                      ["commercial", "Commercial"],
                    ] as const
                  ).map(([tabKey, label]) => (
                    <button
                      key={tabKey}
                      type="button"
                      onClick={() => setActiveTab(tabKey)}
                      className={`cursor-pointer rounded-full px-2.5 py-1.5 text-[11px] font-semibold transition-all ${
                        activeTab === tabKey
                          ? "bg-[#121212] text-white"
                          : "border border-black/10 bg-[#f8fafc] text-[#475569]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  <div className="relative h-[145px] sm:min-h-[260px] lg:col-span-6 lg:min-h-[450px] bg-[#0a1624]">
                    <img
                      src={featuredDeal.image}
                      alt={featuredDeal.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060f1a]/92 via-[#060f1a]/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-8 text-white">
                      <p className="font-mono text-[9.5px] sm:text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#51fec0] truncate">
                        {featuredDeal.developer} · {featuredDeal.community}
                      </p>
                      <p className="mt-1 sm:mt-2 text-lg sm:text-3xl font-medium tracking-[-0.03em]">
                        {featuredDeal.priceGuide}
                      </p>
                      <p className="mt-0.5 text-[11px] sm:text-xs text-white/80 line-clamp-1">
                        {featuredDeal.planHighlight}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between p-4 sm:p-8 lg:col-span-6">
                    <div>
                      <p className="font-mono text-[9.5px] sm:text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#1b6aa7]">
                        {featuredDeal.eyebrow}
                      </p>
                      <h2 className="mt-1.5 sm:mt-2.5 text-lg sm:text-3xl font-medium leading-[1.12] tracking-[-0.03em] text-[#121212]">
                        {featuredDeal.title}
                      </h2>

                      <p className="mt-3 sm:mt-4 font-mono text-[9.5px] sm:text-[10.5px] font-semibold uppercase tracking-[0.15em] text-[#0e9f6e]">
                        KEY BUYER &amp; INVESTOR BENEFITS
                      </p>
                      <ul className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2.5">
                        {featuredDeal.benefits.map((b, idx) => (
                          <li
                            key={b}
                            className={`flex items-start gap-2 text-xs sm:text-sm text-[#334155] ${
                              idx >= 3 ? "hidden sm:flex" : ""
                            }`}
                          >
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-[#0e9f6e]" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>

                      {tabDeals.length > 1 ? (
                        <div className="mt-3.5 sm:mt-5 hidden sm:flex flex-wrap gap-2">
                          {TRENDING_DEALS.filter((d) => d.tab === "off-plan").map((deal) => (
                            <Link
                              key={deal.id}
                              href={deal.href}
                              onClick={() => setSpotlightOpen(false)}
                              className="rounded-full border border-black/10 bg-[#f8fafc] px-3 py-1.5 text-[11px] font-medium text-[#121212] transition-all hover:border-[#121212] hover:bg-[#121212] hover:text-white"
                            >
                              {deal.developer}: {deal.shortTitle} ↗
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-4 sm:mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 border-t border-black/[0.08] pt-3.5 sm:pt-5">
                      <Link
                        href={featuredDeal.href}
                        onClick={() => setSpotlightOpen(false)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#121212] px-4 py-2.5 sm:px-5 sm:py-3 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-white transition-all hover:bg-[#0e9f6e]"
                      >
                        <span>Explore Full Dossier</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                      <a
                        href={SITE.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#0e9f6e]/35 bg-[#0e9f6e]/10 px-4 py-2.5 sm:px-5 sm:py-3 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-[#0e9f6e] transition-all hover:bg-[#0e9f6e] hover:text-white"
                      >
                        <WhatsAppIcon className="h-4 w-4" />
                        <span>WhatsApp Desk</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* 3. Smart Exit-Intent Benefits Modal (Compact Mobile Sheet + Pinned Visible Close Button) */}
      <AnimatePresence>
        {exitOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Before you leave SWK Properties Dubai"
            className="fixed inset-0 z-[125] flex items-center justify-center bg-[#060f1a]/86 p-3 sm:p-6 backdrop-blur-xl"
            onClick={() => setExitOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[84dvh] sm:max-h-[90dvh] w-full max-w-[390px] sm:max-w-4xl flex-col overflow-hidden rounded-[22px] sm:rounded-[32px] border border-white/25 bg-white/98 text-[#121212] shadow-[0_40px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
            >
              {/* Pinned Mobile Header with Always-Visible High-Contrast Close Button */}
              <div className="flex md:hidden shrink-0 items-center justify-between gap-2 bg-[#0a1624] px-4 py-3 text-white border-b border-white/12">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#51fec0]/35 bg-[#51fec0]/12 px-2.5 py-1 font-mono text-[9.5px] font-semibold uppercase tracking-[0.15em] text-[#51fec0]">
                  <ShieldCheck className="h-3 w-3" />
                  SWK ADVISORY ADVANTAGE
                </span>
                <button
                  type="button"
                  aria-label="Close exit dialog"
                  onClick={() => setExitOpen(false)}
                  className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white text-[#121212] shadow-md"
                >
                  <X className="h-4 w-4 stroke-[2.4]" />
                </button>
              </div>

              {/* Desktop Top-Right Close Button */}
              <button
                type="button"
                aria-label="Close exit dialog"
                onClick={() => setExitOpen(false)}
                className="hidden md:inline-flex absolute top-5 right-5 z-20 h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-black/15 bg-white/95 text-[#121212] shadow-md transition-all hover:bg-[#121212] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex-1 overflow-y-auto overscroll-contain">
                <div className="grid grid-cols-1 md:grid-cols-12">
                  {/* Left Obsidian Benefits Column */}
                  <div className="flex flex-col justify-between bg-[#0a1624] p-4 sm:p-7 md:p-9 text-white md:col-span-6">
                    <div>
                      <span className="hidden md:inline-flex items-center gap-2 rounded-full border border-[#51fec0]/30 bg-[#51fec0]/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#51fec0]">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        BEFORE YOU LEAVE · SWK ADVISORY ADVANTAGE
                      </span>
                      <h2 className="md:mt-4 text-lg sm:text-2xl md:text-3xl font-medium leading-[1.1] tracking-[-0.03em]">
                        Don&apos;t miss private Dubai launch allocations &amp; DLD cost clarity
                      </h2>
                      <ul className="mt-3 sm:mt-6 space-y-1.5 sm:space-y-3">
                        {EXIT_BENEFITS.map((benefit, idx) => (
                          <li
                            key={benefit}
                            className={`flex items-start gap-2 text-xs sm:text-sm text-white/85 ${
                              idx >= 3 ? "hidden sm:flex" : ""
                            }`}
                          >
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-[#51fec0]" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <p className="hidden sm:block mt-8 border-t border-white/12 pt-4 text-[11px] text-white/60">
                      {SITE.legalName} · RERA ORN {SITE.reraOrn} · {SITE.address.full}
                    </p>
                  </div>

                  {/* Right Instant Shortlist Request Column */}
                  <div className="flex flex-col justify-center p-4 sm:p-7 md:p-9 md:col-span-6">
                    {sent ? (
                      <div className="space-y-3 sm:space-y-4 py-4 sm:py-6 text-center">
                        <span className="mx-auto flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#0e9f6e]/12 text-[#0e9f6e]">
                          <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7" />
                        </span>
                        <h3 className="text-lg sm:text-2xl font-medium tracking-[-0.03em] text-[#121212]">
                          Your Dubai shortlist request is with our desk
                        </h3>
                        <p className="text-xs sm:text-sm text-[#475569]">
                          An advisor at our Sheikh Zayed Road office will share verified floor plans, payment plans, and DLD comparables shortly.
                        </p>
                        <button
                          type="button"
                          onClick={() => setExitOpen(false)}
                          className="mt-2 cursor-pointer rounded-full bg-[#121212] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#0e9f6e]"
                        >
                          Return to Website
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="font-mono text-[9.5px] sm:text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#1b6aa7]">
                          FREE PRIVATE SHORTLIST · ZERO OBLIGATION
                        </p>
                        <h3 className="mt-1.5 sm:mt-2 text-lg sm:text-2xl font-medium tracking-[-0.03em] text-[#121212]">
                          Get today&apos;s off-plan &amp; ready investor brief
                        </h3>
                        <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#475569] hidden sm:block">
                          Receive direct master-developer floor plans, real net rental yields, and pre-launch allocations for Palm Jebel Ali, Creek Harbour, Bugatti, Mercedes-Benz Places, and ready Dubai homes.
                        </p>

                        <form onSubmit={handleExitSubmit} className="mt-3 sm:mt-5 space-y-2.5 sm:space-y-3" noValidate>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            className="w-full rounded-xl border border-black/12 bg-white px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm text-[#121212] placeholder:text-[#94a3b8] focus:border-[#121212] focus:outline-none"
                          />
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="WhatsApp / Phone (+971 50 000 0000)"
                            className="w-full rounded-xl border border-black/12 bg-white px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm text-[#121212] placeholder:text-[#94a3b8] focus:border-[#121212] focus:outline-none"
                          />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email (optional, for PDF floor plans)"
                            className="w-full rounded-xl border border-black/12 bg-white px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm text-[#121212] placeholder:text-[#94a3b8] focus:border-[#121212] focus:outline-none"
                          />
                          {errorMsg ? (
                            <p className="text-xs text-rose-600" role="alert">
                              {errorMsg}
                            </p>
                          ) : null}
                          <button
                            type="submit"
                            disabled={sending}
                            className="w-full cursor-pointer rounded-full bg-[#121212] px-5 py-3 sm:px-6 sm:py-3.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-white transition-all hover:bg-[#0e9f6e] disabled:opacity-60"
                          >
                            {sending ? "Sending Brief Request..." : "Send Me The Priority Brief"}
                          </button>
                        </form>

                        <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-between gap-2 text-[11.5px] sm:text-xs text-[#64748b]">
                          <Link
                            href="/off-plan"
                            onClick={() => setExitOpen(false)}
                            className="font-medium text-[#121212] underline underline-offset-4 hover:text-[#0e9f6e]"
                          >
                            Browse Off-Plan ↗
                          </Link>
                          <button
                            type="button"
                            onClick={() => setExitOpen(false)}
                            className="cursor-pointer font-medium text-[#121212]/75 hover:text-[#121212]"
                          >
                            Close &amp; continue
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
