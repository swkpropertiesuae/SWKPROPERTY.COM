"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Cue Foundations · Collapsing Cards Accordion (cue115)
 * Five-image horizontal architectural accordion where hovering/clicking smoothly
 * expands the active card (`flex: 2.8`) while others collapse to vertical wordmarks.
 * All CSS is strictly scoped to `.cc-scope` so it never overrides page body styles.
 */

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
    img: "/img/projects/damac/damac-casa.webp",
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

const SCOPED_CSS = `
.cc-scope {
  width: 100%;
}
.cc-scope .cc-cards {
  display: flex;
  gap: 12px;
  width: 100%;
  height: 500px;
}
.cc-scope .cc-card {
  position: relative;
  flex: 0.72;
  min-width: 82px;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.24);
  box-shadow: 0 22px 54px rgba(8, 25, 44, 0.22);
  transition: flex 0.75s cubic-bezier(0.2, 1, 0.3, 1), border-color 0.35s ease;
  will-change: flex;
  background: #0d1622;
}
.cc-scope .cc-card.active {
  flex: 2.85;
  border-color: rgba(81, 254, 192, 0.55);
}
.cc-scope .cc-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.05);
  transition: transform 0.9s cubic-bezier(0.2, 1, 0.3, 1), filter 0.75s cubic-bezier(0.2, 1, 0.3, 1);
  filter: grayscale(22%) brightness(0.72);
}
.cc-scope .cc-card.active .cc-img {
  transform: scale(1);
  filter: grayscale(0%) brightness(0.94);
}
.cc-scope .cc-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(6, 15, 26, 0.84) 0%,
    rgba(6, 15, 26, 0.34) 40%,
    rgba(6, 15, 26, 0.12) 65%,
    rgba(6, 15, 26, 0.48) 100%
  );
  pointer-events: none;
}
.cc-scope .cc-content {
  position: relative;
  z-index: 2;
  height: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  color: #ffffff;
}
.cc-scope .cc-idx {
  font-size: 11px;
  letter-spacing: 0.18em;
  color: rgba(255, 255, 255, 0.82);
  font-weight: 500;
  font-family: var(--font-mono), monospace;
}
.cc-scope .cc-meta {
  margin-top: auto;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}
.cc-scope .cc-title-wrap {
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.35s ease 0.14s, transform 0.5s cubic-bezier(0.2, 1, 0.3, 1) 0.14s;
  max-width: 440px;
}
.cc-scope .cc-card.active .cc-title-wrap {
  opacity: 1;
  transform: translateY(0);
}
.cc-scope .cc-title {
  font-size: 24px;
  font-weight: 500;
  line-height: 1.15;
  letter-spacing: -0.025em;
  color: #ffffff;
}
.cc-scope .cc-sub {
  margin-top: 6px;
  font-size: 13px;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.78);
}
.cc-scope .cc-v-title {
  position: absolute;
  left: 24px;
  bottom: 24px;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.92);
  transition: opacity 0.3s ease;
  z-index: 2;
  pointer-events: none;
}
.cc-scope .cc-card.active .cc-v-title {
  opacity: 0;
}
.cc-scope .cc-cta {
  flex-shrink: 0;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #0a1624;
  background: #ffffff;
  padding: 10px 16px;
  border-radius: 999px;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.35s ease 0.2s, transform 0.5s cubic-bezier(0.2, 1, 0.3, 1) 0.2s, background-color 0.2s ease;
}
.cc-scope .cc-cta:hover {
  background: #51fec0;
}
.cc-scope .cc-card.active .cc-cta {
  opacity: 1;
  transform: translateY(0);
}
@media (max-width: 900px) {
  .cc-scope .cc-cards {
    height: 440px;
  }
  .cc-scope .cc-title {
    font-size: 19px;
  }
}
@media (max-width: 680px) {
  .cc-scope .cc-cards {
    flex-direction: column;
    height: 580px;
    gap: 8px;
  }
  .cc-scope .cc-card {
    flex: 0.75;
    min-width: 0;
    min-height: 0;
  }
  .cc-scope .cc-card.active {
    flex: 3.2;
  }
  .cc-scope .cc-v-title {
    writing-mode: horizontal-tb;
    transform: none;
    left: 18px;
    bottom: 16px;
  }
  .cc-scope .cc-content {
    padding: 16px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .cc-scope .cc-card,
  .cc-scope .cc-img,
  .cc-scope .cc-title-wrap,
  .cc-scope .cc-cta,
  .cc-scope .cc-v-title {
    transition-duration: 0.15s !important;
  }
}
`;

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
      <style>{SCOPED_CSS}</style>
      <div className="cc-cards" role="region" aria-label="Expandable UAE Masterplan Accordion">
        {cards.map((c) => {
          const isActive = activeIdx === c.idx;
          return (
            <div
              key={c.idx}
              className={`cc-card ${isActive ? "active" : ""}`}
              onMouseEnter={() => setActiveIdx(c.idx)}
              onClick={() => setActiveIdx(c.idx)}
              role="button"
              tabIndex={0}
              aria-expanded={isActive}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveIdx(c.idx);
                }
              }}
            >
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
                    className="cc-cta"
                    onClick={(e) => e.stopPropagation()}
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
