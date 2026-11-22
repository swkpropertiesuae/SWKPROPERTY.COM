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
 * Desktop: Hover scales the active landmark while softening siblings (`blur-[3px] opacity-45`).
 * Mobile: Crisp 2-column architectural grid with full-width editorial statement cards & zero sticky blur.
 */
export function InteractiveImageGallery({
  items,
  className,
}: InteractiveImageGalleryProps) {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const [canHover, setCanHover] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <div
      className={cn(
        "relative grid w-full grid-cols-2 items-stretch gap-3.5 py-4 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-7 sm:py-6 transition-colors",
        className
      )}
    >
      {items.map((item) =>
        item.type === "image" ? (
          <div
            key={item.id}
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-white/85 bg-[#0b1623] shadow-[0_14px_38px_rgba(12,56,96,0.14)] transition-all duration-300 ease-out",
              "sm:hover:z-10 sm:hover:scale-[1.06] sm:hover:shadow-[0_28px_68px_rgba(12,56,96,0.24)]",
              canHover && hoveredId && hoveredId !== item.id
                ? "blur-[3px] opacity-45 scale-[0.97]"
                : "opacity-100",
              item.position
            )}
            onMouseEnter={() => {
              if (canHover) setHoveredId(item.id);
            }}
            onMouseLeave={() => {
              if (canHover) setHoveredId(null);
            }}
          >
            {item.href ? (
              <Link
                href={item.href}
                className="block relative h-44 w-full sm:h-56 sm:w-52 md:h-60 md:w-56"
              >
                {item.src ? (
                  <img
                    src={item.src}
                    alt={item.alt ?? item.label ?? "Dubai architectural gallery item"}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 sm:group-hover:scale-105"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-[#08131f]/86 via-[#08131f]/18 to-transparent" />
                {item.label ? (
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 sm:p-3.5 text-white">
                    <div className="min-w-0">
                      {item.sublabel ? (
                        <span className="block text-[8.5px] sm:text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[#51fec0] truncate">
                          {item.sublabel}
                        </span>
                      ) : null}
                      <span className="mt-0.5 block text-xs sm:text-sm font-medium leading-tight truncate">
                        {item.label}
                      </span>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-white/85 transition-transform sm:group-hover:translate-x-0.5 sm:group-hover:-translate-y-0.5 sm:group-hover:text-[#51fec0]" />
                  </div>
                ) : null}
              </Link>
            ) : (
              <div className="relative h-44 w-full sm:h-56 sm:w-52 md:h-60 md:w-56">
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
                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-3.5 text-white">
                      {item.sublabel ? (
                        <span className="block text-[8.5px] sm:text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[#51fec0]">
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
              "col-span-2 sm:col-span-1 w-full sm:w-72 md:w-80 border-white/85 bg-white/88 text-left shadow-[0_14px_40px_rgba(12,56,96,0.1)] backdrop-blur-2xl transition-all duration-300",
              canHover && hoveredId ? "opacity-85" : "opacity-100",
              item.position
            )}
          >
            <CardContent className="p-4 sm:p-6">
              {item.eyebrow ? (
                <p className="mb-1.5 sm:mb-2 text-[9.5px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1b6aa7]">
                  {item.eyebrow}
                </p>
              ) : null}
              <p className="text-[13.5px] sm:text-[14.5px] leading-[1.58] font-medium text-[#121212]">
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
