"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * 21st.dev Architectural Spotlight Card
 * Interactive cursor-tracking specular illumination framed in luminous frosted glass
 * so the live Mesh Drift wave background shines smoothly around every card.
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
          ? "border-white/80 bg-white/82 backdrop-blur-xl shadow-[0_16px_44px_rgba(12,56,96,0.08)] hover:-translate-y-0.5 hover:border-white hover:bg-white/92 hover:shadow-[0_26px_64px_rgba(12,56,96,0.14)]"
          : "border-white/[0.12] bg-[#141c28]/88 backdrop-blur-xl hover:border-white/25 hover:shadow-[0_24px_60px_rgba(0,0,0,0.45)]",
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
