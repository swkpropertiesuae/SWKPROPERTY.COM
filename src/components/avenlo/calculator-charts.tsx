"use client";

import React from "react";

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
  display: string;
}

function safeNonNegative(v: number): number {
  return Number.isFinite(v) && v > 0 ? v : 0;
}

/** Avenlo-inspired monochrome + #51FEC0 mint SVG Donut Chart for #121212 obsidian cards. */
export function DonutChart({ slices }: { slices: DonutSlice[] }) {
  const cleanSlices = slices.map((s) => ({ ...s, value: safeNonNegative(s.value) }));
  const activeCount = cleanSlices.filter((s) => s.value > 0).length;
  const total = Math.max(
    1,
    cleanSlices.reduce((sum, s) => sum + s.value, 0)
  );
  const radius = 64;
  const circumference = 2 * Math.PI * radius;

  const segments = cleanSlices.reduce<
    (DonutSlice & { dash: number; offset: number })[]
  >((acc, slice) => {
    const prevUsed = acc.reduce((s, item) => s + item.dash, 0);
    const ratio = slice.value / total;
    const dash = ratio * circumference;
    acc.push({
      ...slice,
      dash,
      offset: -prevUsed,
    });
    return acc;
  }, []);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-7">
      <svg
        viewBox="0 0 160 160"
        className="h-40 w-40 shrink-0 -rotate-90"
        role="img"
        aria-label="Cost breakdown chart"
      >
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="18"
        />
        {segments.map((seg) => {
          if (seg.dash <= 0) return null;
          const gap = activeCount > 1 ? 1.5 : 0;
          return (
            <circle
              key={seg.label}
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth="18"
              strokeDasharray={`${Math.max(0, seg.dash - gap)} ${circumference}`}
              strokeDashoffset={seg.offset}
            />
          );
        })}
      </svg>

      <div className="w-full space-y-3 text-sm">
        {cleanSlices.map((slice) => (
          <div key={slice.label} className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2.5 text-[#a7a7a7]">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                style={{ backgroundColor: slice.color }}
                aria-hidden="true"
              />
              <span>{slice.label}</span>
            </span>
            <span className="font-medium text-white tabular-nums">{slice.display}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Crisp horizontal progress bar visualization for Off-Plan Milestones & Buy vs Rent on obsidian cards. */
export function ObsidianBarChart({
  bars,
}: {
  bars: { label: string; value: number; display: string; color: string }[];
}) {
  const cleanBars = bars.map((b) => ({ ...b, value: safeNonNegative(b.value) }));
  const maxVal = Math.max(1, ...cleanBars.map((b) => b.value));

  return (
    <div className="space-y-4">
      {cleanBars.map((bar) => (
        <div key={bar.label} className="space-y-1.5">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="text-[#a7a7a7]">{bar.label}</span>
            <span className="font-medium text-white tabular-nums shrink-0">{bar.display}</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${bar.value === 0 ? 0 : Math.max(3, Math.min(100, (bar.value / maxVal) * 100))}%`,
                backgroundColor: bar.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
