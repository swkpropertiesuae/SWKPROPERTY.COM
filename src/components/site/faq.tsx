"use client";

import React, { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { faqs, SITE } from "@/lib/swk";
import { SectionEyebrow, SplitHeading } from "@/components/avenlo/motion";

export interface FaqItem {
  q: string;
  a: string;
}

export function Faq({
  items,
  eyebrow = "QUESTIONS",
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
  const list = items && items.length > 0 ? items : faqs;
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className={compact ? "bg-white/24 backdrop-blur-[2px] py-16" : "bg-white/24 backdrop-blur-[2px] py-24"}>
      <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
        <div className="border-t border-white/60 pt-14 sm:pt-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
            {/* Left Column: Avenlo Heading + Direct Office Note */}
            <div className="lg:col-span-5">
              <SectionEyebrow>{eyebrow}</SectionEyebrow>
              <SplitHeading
                primary={primary}
                muted={muted}
                className="mt-5"
              />
              <p className="mt-6 max-w-sm text-[15px] leading-[1.6] text-[#334155]">
                If yours is not here, call our Sheikh Zayed Road office on{" "}
                <a
                  href={`tel:${SITE.phoneRaw}`}
                  className="font-medium text-[#121212] underline underline-offset-4"
                >
                  {SITE.phone}
                </a>
                . You will speak with an advisor who knows the building, not a call script.
              </p>
            </div>

            {/* Right Column: Luminous Frosted-Glass Rounded-16px Accordion Stack */}
            <div className="lg:col-span-7 space-y-3.5">
              {list.map((f, idx) => {
                const open = openIdx === idx;
                return (
                  <div
                    key={f.q}
                    className="rounded-2xl border border-white/80 bg-white/82 shadow-[0_14px_38px_rgba(12,56,96,0.08)] backdrop-blur-xl transition-all hover:bg-white/92"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIdx(open ? null : idx)}
                      aria-expanded={open}
                      className="flex w-full cursor-pointer items-center justify-between gap-6 px-6 py-5 sm:px-7 sm:py-6 text-left"
                    >
                      <span className="text-[16px] sm:text-[17px] font-medium tracking-[-0.02em] text-[#121212]">
                        {f.q}
                      </span>
                      <span
                        aria-hidden="true"
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#121212]"
                      >
                        {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </span>
                    </button>
                    {open ? (
                      <div className="px-6 pb-6 sm:px-7 sm:pb-7 text-[15px] leading-[1.65] text-[#666666]">
                        {f.a}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
