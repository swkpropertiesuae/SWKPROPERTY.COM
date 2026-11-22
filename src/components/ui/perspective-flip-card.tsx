"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Compass, MapPin, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 21st.dev 3D Perspective Flip Card (@shadcnspace/card-14)
 * True 3D CSS perspective hover flip with floating translateZ depth layers,
 * luminous frosted-glass front face, and obsidian architectural dossier back face.
 */

export interface PerspectiveFlipCardProps {
  className?: string;
  front: React.ReactNode;
  back: React.ReactNode;
  h?: string;
}

export function PerspectiveFlipCard({
  className,
  front,
  back,
  h = "h-[390px]",
}: PerspectiveFlipCardProps) {
  return (
    <div className={cn("group/p-card w-full [perspective:2000px]", h, className)}>
      <div
        className={cn(
          "relative h-full w-full rounded-2xl transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] group-hover/p-card:[transform:rotateY(180deg)] group-focus-within/p-card:[transform:rotateY(180deg)]"
        )}
      >
        {/* Front Face */}
        <div className="absolute inset-0 size-full rounded-2xl border border-white/80 bg-white/88 text-[#121212] shadow-[0_18px_46px_rgba(12,56,96,0.1)] backdrop-blur-xl transition-opacity duration-300 [transform-style:preserve-3d] [backface-visibility:hidden] group-hover/p-card:opacity-0 group-focus-within/p-card:opacity-0">
          <div className="size-full p-3 [transform-style:preserve-3d] [backface-visibility:hidden]">
            {front}
          </div>
        </div>

        {/* Back Face */}
        <div className="pointer-events-none absolute inset-0 size-full rounded-2xl border border-white/20 bg-gradient-to-br from-[#0b1929] via-[#0f253c] to-[#121212] text-white opacity-0 shadow-[0_24px_64px_rgba(8,25,44,0.32)] transition-opacity duration-300 [transform-style:preserve-3d] [backface-visibility:hidden] [transform:rotateY(180deg)] group-hover/p-card:pointer-events-auto group-hover/p-card:opacity-100 group-focus-within/p-card:pointer-events-auto group-focus-within/p-card:opacity-100">
          <div className="size-full p-6 flex flex-col justify-between [transform-style:preserve-3d] [backface-visibility:hidden]">
            {back}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CommunityFlipCard({
  name,
  slug,
  image,
  blurb,
  zoneLabel = "Dubai Freehold Corridor",
}: {
  name: string;
  slug: string;
  image: string;
  blurb: string;
  zoneLabel?: string;
}) {
  return (
    <PerspectiveFlipCard
      h="h-[385px]"
      front={
        <div className="flex size-full flex-col [transform-style:preserve-3d]">
          {/* Elevated Photo Frame */}
          <div className="relative h-52 w-full shrink-0 [transform-style:preserve-3d] [transform:translateZ(36px)]">
            <div className="absolute inset-0 overflow-hidden rounded-xl border border-black/[0.06] bg-[#e9f2f8]">
              <img
                src={image}
                alt={name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover/p-card:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1623]/45 via-transparent to-transparent" />
            </div>
            <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-[#0b1623]/75 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white backdrop-blur-md [transform:translateZ(52px)]">
              <MapPin className="h-3 w-3 text-[#51fec0]" />
              <span>Dubai</span>
            </div>
          </div>

          {/* Front Editorial Summary */}
          <div className="flex flex-1 flex-col justify-between px-2.5 pt-4 pb-2 [transform-style:preserve-3d]">
            <div className="[transform:translateZ(42px)]">
              <h3 className="text-[19px] font-medium leading-tight tracking-[-0.025em] text-[#121212]">
                {name}
              </h3>
              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#52606d]">
                {blurb}
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1b6aa7] [transform:translateZ(28px)]">
              <span>Hover for District Brief</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/p-card:translate-x-1" />
            </div>
          </div>
        </div>
      }
      back={
        <div className="flex size-full flex-col justify-between text-left [transform-style:preserve-3d]">
          <div className="[transform:translateZ(50px)]">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#51fec0]/35 bg-[#51fec0]/12 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#51fec0]">
              <Compass className="h-3 w-3" />
              {zoneLabel}
            </span>
            <h3 className="mt-4 text-[24px] font-medium leading-tight tracking-[-0.03em] text-white">
              {name}
            </h3>
            <p className="mt-3 text-[13px] leading-relaxed text-white/80">
              {blurb}
            </p>
          </div>

          <div className="space-y-4 [transform-style:preserve-3d]">
            <div className="flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.06] px-3.5 py-2.5 text-[11px] text-white/85 [transform:translateZ(40px)]">
              <ShieldCheck className="h-4 w-4 shrink-0 text-[#51fec0]" />
              <span>DLD comps, service charges &amp; active launches</span>
            </div>

            <Link
              href={`/communities/${slug}`}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white text-[11.5px] font-semibold uppercase tracking-[0.16em] text-[#121212] shadow-[0_14px_30px_rgba(0,0,0,0.35)] transition-all hover:bg-[#51fec0] [transform:translateZ(64px)]"
            >
              <span>Explore District Guide</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      }
    />
  );
}
