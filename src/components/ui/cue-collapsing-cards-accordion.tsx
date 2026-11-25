"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CollapsingCardItem {
  idx: number;
  wordmark: string;
  title: string;
  subtitle?: string;
  img: string;
  href: string;
}

const DEFAULT_CARDS: CollapsingCardItem[] = [
  {
    idx: 1,
    wordmark: "OMNIYAT",
    title: "The Opus by Zaha Hadid — Business Bay",
    subtitle: "Sculptural mixed-use icon with ME Dubai residences",
    img: "/img/projects/omniyat/the-opus.webp",
    href: "/off-plan/the-opus",
  },
  {
    idx: 2,
    wordmark: "NAKHEEL",
    title: "Palm Beach Towers — Palm Jumeirah Gateway",
    subtitle: "Private beach club living overlooking Arabian Gulf",
    img: "/img/projects/nakheel/palm-beach-towers.webp",
    href: "/off-plan/palm-beach-towers",
  },
  {
    idx: 3,
    wordmark: "SOBHA",
    title: "Sobha Skyvue — Bukadra Waterfront",
    subtitle: "Precision in-house construction with panoramic skyline views",
    img: "/img/projects/sobha/sobha-skyvue.webp",
    href: "/off-plan/sobha-skyvue",
  },
  {
    idx: 4,
    wordmark: "DAMAC",
    title: "DAMAC Casa — Al Sufouh & Palm Vista",
    subtitle: "Sky-high tropical terraces and resort-style wellness decks",
    img: "/img/projects/damac/damac-casa.webp?v=2",
    href: "/off-plan/damac-casa",
  },
  {
    idx: 5,
    wordmark: "ALDAR",
    title: "Saadiyat Lagoons — Abu Dhabi Island",
    subtitle: "Eco-mangrove luxury villas across Abu Dhabi's cultural island",
    img: "/img/projects/aldar/saadiyat-lagoons.webp",
    href: "/off-plan/saadiyat-lagoons",
  },
];

export function CollapsingCards({
  cards = DEFAULT_CARDS,
  className,
}: {
  cards?: CollapsingCardItem[];
  className?: string;
}) {
  const [activeIdx, setActiveIdx] = useState(cards[0]?.idx ?? 1);
  const total = String(cards.length).padStart(2, "0");

  return (
    <div className={cn("cc-scope", className)}>
      <div className="cc-cards" role="region" aria-label="Expandable UAE Masterplan Accordion">
        {cards.map((c) => {
          const isActive = activeIdx === c.idx;
          return (
            <div
              key={c.idx}
              className={`cc-card ${isActive ? "active" : ""}`}
              onMouseEnter={() => setActiveIdx(c.idx)}
            >
              <button
                type="button"
                aria-expanded={isActive}
                aria-label={`Expand ${c.title}`}
                onClick={() => setActiveIdx(c.idx)}
                className="absolute inset-0 z-[1] cursor-pointer focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#51fec0]"
              />
              <img
                src={c.img}
                alt={c.title}
                loading="lazy"
                className="cc-img"
              />
              <div className="cc-v-title" aria-hidden="true">
                {c.wordmark}
              </div>
              <div className="cc-content">
                <div className="cc-idx">
                  {String(c.idx).padStart(2, "0")} / {total}
                </div>
                <div className="cc-meta">
                  <div className="cc-title-wrap">
                    <div className="cc-title">{c.title}</div>
                    {c.subtitle ? <p className="cc-sub">{c.subtitle}</p> : null}
                  </div>
                  <Link
                    href={c.href}
                    tabIndex={isActive ? 0 : -1}
                    aria-hidden={!isActive}
                    className="cc-cta relative z-[3]"
                  >
                    <span>Explore</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CollapsingCards;
