"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Search, Sparkles } from "lucide-react";
import { faqs, SITE } from "@/lib/swk";
import { SectionEyebrow, SplitHeading } from "@/components/avenlo/motion";

export interface FaqItem {
  q: string;
  a: string;
}

type FaqTopic = "All" | "Buying & DLD" | "Off-Plan & Escrow" | "Golden Visa & Finance" | "Leasing & Selling";

function classifyFaq(item: FaqItem): Exclude<FaqTopic, "All"> {
  const txt = `${item.q} ${item.a}`.toLowerCase();
  if (/off-plan|oqood|escrow|payment plan|handover|developer/.test(txt)) return "Off-Plan & Escrow";
  if (/golden visa|mortgage|ltv|loan|tax|vat|non-resident|bank/.test(txt)) return "Golden Visa & Finance";
  if (/rent|ejari|tenant|landlord|lease|sell|form a|listing/.test(txt)) return "Leasing & Selling";
  return "Buying & DLD";
}

export function Faq({
  items,
  eyebrow = "QUESTIONS & DIRECT ANSWERS",
  primary = "The things buyers",
  muted = "ask us first",
  compact = false,
}: {
  items?: FaqItem[];
  eyebrow?: string;
  primary?: string;
  muted?: string;
  compact?: boolean;
}) {
  const list = useMemo(() => (items && items.length > 0 ? items : faqs), [items]);
  const [openKey, setOpenKey] = useState<string | null>(list[0]?.q ?? null);
  const [topic, setTopic] = useState<FaqTopic>("All");
  const [query, setQuery] = useState("");

  const showToolbar = !compact && list.length >= 6;

  const availableTopics = useMemo<FaqTopic[]>(() => {
    const found = new Set(list.map(classifyFaq));
    const ordered: FaqTopic[] = ["All"];
    for (const t of ["Buying & DLD", "Off-Plan & Escrow", "Golden Visa & Finance", "Leasing & Selling"] as const) {
      if (found.has(t)) ordered.push(t);
    }
    return ordered;
  }, [list]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list.filter((item) => {
      if (topic !== "All" && classifyFaq(item) !== topic) return false;
      if (q && !`${item.q} ${item.a}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [list, topic, query]);

  return (
    <section
      className={
        compact
          ? "bg-white/24 backdrop-blur-[2px] py-16"
          : "bg-white/24 backdrop-blur-[2px] py-24"
      }
    >
      <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
        <div className="border-t border-white/70 pt-14 sm:pt-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
            {/* Left Sticky Architectural Guidance Column */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
              <SectionEyebrow>{eyebrow}</SectionEyebrow>
              <SplitHeading primary={primary} muted={muted} className="mt-5" />
              <p className="mt-6 max-w-md text-[15px] leading-[1.62] text-[#334155]">
                Every answer is grounded in Dubai Land Department (DLD) &amp; RERA procedures. Need building-specific guidance? Call our Sheikh Zayed Road desk on{" "}
                <a
                  href={`tel:${SITE.phoneRaw}`}
                  className="font-semibold text-[#121212] underline underline-offset-4 transition-colors hover:text-[#0e9f6e]"
                >
                  {SITE.phone}
                </a>
                .
              </p>

              {/* Quick AEO Direct Assurance Card */}
              <div className="mt-7 rounded-2xl border border-white/85 bg-white/84 p-5 shadow-[0_14px_38px_rgba(12,56,96,0.08)] backdrop-blur-xl">
                <div className="flex items-center gap-2 font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#0e9f6e]">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>RERA ORN {SITE.reraOrn} · WRITTEN CLARITY</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#475569]">
                  Before any reservation or Form F signature, we provide a written AED closing cost sheet, DLD escrow/Title Deed check, and Mollak service-charge comparison.
                </p>
              </div>
            </div>

            {/* Right 21st.dev Interactive Animated Accordion Stack */}
            <div className="lg:col-span-7">
              {showToolbar ? (
                <div className="mb-6 space-y-3.5">
                  <div className="relative">
                    <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search DLD 4%, Oqood, Golden Visa, Ejari, mortgage..."
                      aria-label="Search frequently asked questions"
                      className="w-full rounded-full border border-white/85 bg-white/86 py-3 pr-5 pl-11 text-sm text-[#121212] shadow-xs backdrop-blur-xl placeholder:text-[#94a3b8] focus:border-[#121212] focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableTopics.map((t) => {
                      const active = topic === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTopic(t)}
                          className={`relative cursor-pointer rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 ${
                            active
                              ? "text-white"
                              : "border border-white/85 bg-white/80 text-[#334155] hover:border-[#121212] hover:bg-white hover:text-[#121212]"
                          }`}
                        >
                          {active && (
                            <motion.span
                              layoutId="swk-faq-topic-pill"
                              transition={{ type: "spring", stiffness: 380, damping: 32 }}
                              className="absolute inset-0 rounded-full bg-[#121212] shadow-md"
                            />
                          )}
                          <span className="relative z-10">{t}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <div className="space-y-3.5">
                {filtered.length === 0 ? (
                  <div className="rounded-2xl border border-white/85 bg-white/84 p-8 text-center text-sm text-[#475569] backdrop-blur-xl">
                    No matching questions found.{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setTopic("All");
                        setQuery("");
                      }}
                      className="cursor-pointer font-semibold text-[#121212] underline underline-offset-4"
                    >
                      Reset filter
                    </button>
                  </div>
                ) : (
                  filtered.map((f, idx) => {
                    const open = openKey === f.q;
                    return (
                      <motion.div
                        key={f.q}
                        layout
                        className={`group/faq relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
                          open
                            ? "border-[#1b6aa7]/40 bg-white/95 shadow-[0_22px_52px_rgba(12,56,96,0.13)]"
                            : "border-white/85 bg-white/84 shadow-[0_12px_34px_rgba(12,56,96,0.07)] hover:-translate-y-0.5 hover:border-[#1b6aa7]/35 hover:bg-white/95 hover:shadow-[0_18px_44px_rgba(12,56,96,0.12)]"
                        }`}
                      >
                        {/* Active Vertical Emerald Indicator Rail */}
                        <span
                          aria-hidden="true"
                          className={`absolute inset-y-0 left-0 w-1 transition-all duration-300 ${
                            open ? "bg-gradient-to-b from-[#1b6aa7] to-[#0e9f6e] opacity-100" : "opacity-0"
                          }`}
                        />

                        <button
                          type="button"
                          onClick={() => setOpenKey(open ? null : f.q)}
                          aria-expanded={open}
                          className="flex w-full cursor-pointer items-center justify-between gap-5 px-6 py-5 sm:px-7 sm:py-6 text-left"
                        >
                          <div className="flex items-baseline gap-3.5">
                            <span className="font-mono text-[11px] font-semibold text-[#1b6aa7]/75 tabular-nums">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <span className="text-[15.5px] sm:text-[17px] font-medium tracking-[-0.02em] text-[#121212] transition-colors group-hover/faq:text-[#0e9f6e]">
                              {f.q}
                            </span>
                          </div>
                          <span
                            aria-hidden="true"
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                              open
                                ? "border-[#121212] bg-[#121212] text-[#51fec0]"
                                : "border-black/10 bg-white/90 text-[#121212] group-hover/faq:border-[#121212] group-hover/faq:bg-[#121212] group-hover/faq:text-[#51fec0]"
                            }`}
                          >
                            {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                          </span>
                        </button>

                        <AnimatePresence initial={false}>
                          {open ? (
                            <motion.div
                              key="content"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden"
                            >
                              <div
                                data-speakable
                                className="px-6 pb-6 pl-14 sm:px-7 sm:pb-7 sm:pl-16 text-[15px] leading-[1.68] text-[#475569]"
                              >
                                {f.a}
                              </div>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
