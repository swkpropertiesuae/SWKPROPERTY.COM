"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * 21st.dev Architectural Spotlight Card
 * Zero-re-render cursor-tracking specular illumination via direct CSS variable updates on DOM ref.
 */
export function SpotlightCard({
  children,
  className,
  spotlightColor = "rgba(87, 210, 244, 0.16)",
  tone = "light",
}: {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  tone?: "light" | "dark";
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    const glow = glowRef.current;
    if (!el || !glow) return;
    const rect = el.getBoundingClientRect();
    glow.style.background = `radial-gradient(420px circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, ${spotlightColor}, transparent 68%)`;
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseEnter={() => {
        if (glowRef.current) glowRef.current.style.opacity = "1";
      }}
      onMouseLeave={() => {
        if (glowRef.current) glowRef.current.style.opacity = "0";
      }}
      className={cn(
        "relative overflow-hidden rounded-2xl border transition-all duration-300",
        tone === "light"
          ? "border-white/80 bg-white/82 backdrop-blur-xl shadow-[0_16px_44px_rgba(12,56,96,0.08)] hover:-translate-y-0.5 hover:border-white hover:bg-white/92 hover:shadow-[0_26px_64px_rgba(12,56,96,0.14)]"
          : "border-white/[0.12] bg-[#141c28]/88 backdrop-blur-xl hover:border-white/25 hover:shadow-[0_24px_60px_rgba(0,0,0,0.45)]",
        className
      )}
    >
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300"
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
