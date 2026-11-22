"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export interface GalleryItem {
  id: string;
  type: "image" | "text";
  src?: string;
  alt?: string;
  label?: string;
  sublabel?: string;
  href?: string;
  text?: string;
  eyebrow?: string;
  position?: string;
}

interface InteractiveImageGalleryProps {
  items: GalleryItem[];
  className?: string;
}

/**
 * 21st.dev Interactive Focus Image Gallery
 * Hovering any architectural frame scales it cleanly into focus while softening
 * sibling frames (`blur-sm opacity-50`), interleaved with frosted editorial narrative cards.
 */
export function InteractiveImageGallery({
  items,
  className,
}: InteractiveImageGalleryProps) {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  return (
    <div
      className={cn(
        "relative flex w-full flex-wrap items-center justify-center gap-6 sm:gap-7 py-6 transition-colors",
        className
      )}
    >
      {items.map((item) =>
        item.type === "image" ? (
          <div
            key={item.id}
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-white/85 bg-[#0b1623] shadow-[0_18px_46px_rgba(12,56,96,0.14)] transition-all duration-300 ease-out",
              "hover:z-10 hover:scale-[1.06] hover:shadow-[0_28px_68px_rgba(12,56,96,0.24)]",
              hoveredId && hoveredId !== item.id
                ? "blur-[3px] opacity-45 scale-[0.97]"
                : "opacity-100",
              item.position
            )}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {item.href ? (
              <Link
                href={item.href}
                className="block relative h-48 w-44 sm:h-56 sm:w-52 md:h-60 md:w-56"
              >
                {item.src ? (
                  <img
                    src={item.src}
                    alt={item.alt ?? item.label ?? "Dubai architectural gallery item"}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-[#08131f]/82 via-[#08131f]/15 to-transparent" />
                {item.label ? (
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3.5 text-white">
                    <div className="min-w-0">
                      {item.sublabel ? (
                        <span className="block text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[#51fec0] truncate">
                          {item.sublabel}
                        </span>
                      ) : null}
                      <span className="mt-0.5 block text-xs sm:text-sm font-medium leading-tight truncate">
                        {item.label}
                      </span>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-white/80 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#51fec0]" />
                  </div>
                ) : null}
              </Link>
            ) : (
              <div className="relative h-48 w-44 sm:h-56 sm:w-52 md:h-60 md:w-56">
                {item.src ? (
                  <img
                    src={item.src}
                    alt={item.alt ?? item.label ?? "Dubai architectural gallery item"}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : null}
                {item.label ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08131f]/80 via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3.5 text-white">
                      {item.sublabel ? (
                        <span className="block text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[#51fec0]">
                          {item.sublabel}
                        </span>
                      ) : null}
                      <span className="mt-0.5 block text-xs sm:text-sm font-medium leading-tight">
                        {item.label}
                      </span>
                    </div>
                  </>
                ) : null}
              </div>
            )}
          </div>
        ) : (
          <Card
            key={item.id}
            className={cn(
              "w-full sm:w-72 md:w-80 border-white/85 bg-white/86 text-left shadow-[0_18px_46px_rgba(12,56,96,0.1)] backdrop-blur-2xl transition-all duration-300",
              hoveredId ? "opacity-85" : "opacity-100",
              item.position
            )}
          >
            <CardContent className="p-6">
              {item.eyebrow ? (
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1b6aa7]">
                  {item.eyebrow}
                </p>
              ) : null}
              <p className="text-[14.5px] leading-[1.6] font-medium text-[#121212]">
                {item.text}
              </p>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}

export default InteractiveImageGallery;
