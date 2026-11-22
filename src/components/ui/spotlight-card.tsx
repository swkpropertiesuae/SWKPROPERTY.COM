"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * 21st.dev-inspired Architectural Spotlight Card
 * Interactive cursor-tracking specular illumination tailored for crisp Swiss luxury surfaces.
 */
export function SpotlightCard({
  children,
  className,
  spotlightColor = "rgba(14, 159, 110, 0.11)",
  tone = "light",
}: {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  tone?: "light" | "dark";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative overflow-hidden rounded-2xl border transition-all duration-300",
        tone === "light"
          ? "border-black/[0.07] bg-white hover:border-black/20 hover:shadow-[0_24px_60px_rgba(18,18,18,0.08)]"
          : "border-white/[0.1] bg-[#1a1a1a] hover:border-white/25 hover:shadow-[0_24px_60px_rgba(0,0,0,0.45)]",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 68%)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
