"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * 21st.dev Logo Cloud Marquee (@scrollxui/logo-cloud-marquee)
 * Bidirectional flowing partner showcase featuring 100% authentic original-color
 * UAE Master Developer logos inside luminous frosted-glass cards with pause-on-hover.
 */

export interface DeveloperLogoItem {
  slug: string;
  name: string;
  logo: string;
  knownFor?: string;
}

function LogoRow({
  items,
  reverse = false,
  durationSec = 36,
}: {
  items: DeveloperLogoItem[];
  reverse?: boolean;
  durationSec?: number;
}) {
  const repeated = [...items, ...items];
  return (
    <div className="group/marquee relative flex overflow-hidden py-2">
      <div
        className={cn(
          "flex w-max shrink-0 items-center gap-4 will-change-transform group-hover/marquee:[animation-play-state:paused]",
          reverse ? "animate-logo-marquee-reverse" : "animate-logo-marquee"
        )}
        style={{ animationDuration: `${durationSec}s` }}
      >
        {repeated.map((dev, idx) => (
          <Link
            key={`${dev.slug}-${idx}`}
            href={`/developers/${dev.slug}`}
            title={dev.knownFor ? `${dev.name} — ${dev.knownFor}` : dev.name}
            className="group/card flex h-[78px] w-[196px] sm:w-[214px] shrink-0 items-center justify-center rounded-2xl border border-white/85 bg-white/92 px-5 shadow-[0_10px_28px_rgba(12,56,96,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#1b6aa7]/40 hover:bg-white hover:shadow-[0_16px_38px_rgba(12,56,96,0.16)]"
          >
            <img
              src={dev.logo}
              alt={dev.name}
              loading="lazy"
              className="max-h-10 max-w-[138px] object-contain transition-transform duration-300 group-hover/card:scale-[1.06]"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export function LogoCloudMarquee({
  title = "Direct allocation desk with the UAE's premier master developers",
  subtitle = "Authentic partnerships across Nakheel, Binghatti, Emaar, DAMAC, Azizi, Sobha, Omniyat, Aldar & Ellington — in their original flagship identities.",
  developers,
  className,
}: {
  title?: string;
  subtitle?: string;
  developers: DeveloperLogoItem[];
  className?: string;
}) {
  const words = title.split(" ");
  const mid = Math.ceil(developers.length / 2);
  const rowOne = developers.slice(0, mid);
  const rowTwo = developers.slice(mid);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/80 bg-white/62 px-5 py-8 sm:px-8 sm:py-10 shadow-[0_20px_54px_rgba(12,56,96,0.09)] backdrop-blur-xl",
        className
      )}
    >
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#1b6aa7]">
            OFFICIAL UAE MASTER DEVELOPER PARTNERS
          </p>
          <h3 className="mt-2 text-xl sm:text-2xl font-medium leading-snug tracking-[-0.03em] text-[#121212]">
            {words.map((word, idx) => (
              <motion.span
                key={`${word}-${idx}`}
                initial={{ opacity: 0, filter: "blur(5px)", y: 8 }}
                whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: Math.min(idx * 0.04, 0.36) }}
                className="mr-1.5 inline-block"
              >
                {word}
              </motion.span>
            ))}
          </h3>
          <p className="mt-1.5 text-xs sm:text-sm text-[#475569]">{subtitle}</p>
        </div>

        <Link
          href="/developers"
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-black/12 bg-white/92 px-4 py-2 text-xs font-medium text-[#121212] shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#121212] hover:bg-[#121212] hover:text-white hover:shadow-[0_12px_26px_rgba(12,35,58,0.22)]"
        >
          <span>View Developer Directory</span>
          <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </Link>
      </div>

      {/* Bidirectional Marquee with Soft Edge Fade Mask */}
      <div
        className="relative space-y-2"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
        }}
      >
        <LogoRow items={rowOne} durationSec={34} />
        {rowTwo.length > 0 ? (
          <LogoRow items={rowTwo} reverse durationSec={38} />
        ) : null}
      </div>
    </div>
  );
}
