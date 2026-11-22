"use client";

import React from "react";

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
  display: string;
}

/** Avenlo-inspired monochrome + #51FEC0 mint SVG Donut Chart for #121212 obsidian cards. */
export function DonutChart({ slices }: { slices: DonutSlice[] }) {
  const total = Math.max(
    1,
    slices.reduce((sum, s) => sum + Math.max(0, s.value), 0)
  );
  const radius = 64;
  const circumference = 2 * Math.PI * radius;

  const segments = slices.reduce<
    (DonutSlice & { dash: number; offset: number })[]
  >((acc, slice) => {
    const prevUsed = acc.reduce((s, item) => s + item.dash, 0);
    const ratio = Math.max(0, slice.value) / total;
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
        {segments.map((seg) => (
          <circle
            key={seg.label}
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth="18"
            strokeDasharray={`${Math.max(0, seg.dash - 1.5)} ${circumference}`}
            strokeDashoffset={seg.offset}
          />
        ))}
      </svg>

      <div className="w-full space-y-3 text-sm">
        {slices.map((slice) => (
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

export interface PayoffPoint {
  year: number;
  balance: number;
  principalPaid: number;
  interestPaid: number;
}

/** Avenlo signature #51FEC0 mint-green Payoff Area Chart ("What you still owe"). */
export function PayoffAreaChart({
  points,
  formatVal,
}: {
  points: PayoffPoint[];
  formatVal: (v: number) => string;
}) {
  const width = 960;
  const height = 240;
  const padX = 24;
  const padTop = 18;
  const padBottom = 34;
  const maxVal = Math.max(1, points[0]?.balance ?? 1);
  const innerW = width - padX * 2;
  const innerH = height - padTop - padBottom;

  const coords = points.map((pt, idx) => {
    const x = padX + (idx / Math.max(1, points.length - 1)) * innerW;
    const y = padTop + (1 - Math.max(0, pt.balance) / maxVal) * innerH;
    return { x, y, pt };
  });

  const linePath = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L ${(padX + innerW).toFixed(1)} ${(padTop + innerH).toFixed(
    1
  )} L ${padX} ${(padTop + innerH).toFixed(1)} Z`;

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((frac) => {
    const idx = Math.round(frac * (coords.length - 1));
    return coords[idx];
  });

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full min-w-[520px]"
        role="img"
        aria-label="Mortgage remaining balance area chart"
      >
        <defs>
          <linearGradient id="avenlo-mint-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#51fec0" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#51fec0" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Horizontal subtle hairlines */}
        {[0, 0.5, 1].map((f) => {
          const y = padTop + f * innerH;
          return (
            <line
              key={f}
              x1={padX}
              y1={y}
              x2={width - padX}
              y2={y}
              stroke="#e5e5e5"
              strokeWidth="1"
            />
          );
        })}

        <path d={areaPath} fill="url(#avenlo-mint-fill)" />
        <path d={linePath} fill="none" stroke="#10b981" strokeWidth="2.5" />

        {ticks.map((t, i) =>
          t ? (
            <g key={i}>
              <circle cx={t.x} cy={t.y} r="4" fill="#121212" stroke="#51fec0" strokeWidth="2" />
              <text
                x={t.x}
                y={height - 10}
                textAnchor={i === 0 ? "start" : i === ticks.length - 1 ? "end" : "middle"}
                className="fill-[#8b8b8b] text-[11px]"
              >
                Yr {t.pt.year} ({formatVal(t.pt.balance)})
              </text>
            </g>
          ) : null
        )}
      </svg>
    </div>
  );
}

/** Crisp horizontal progress bar visualization for Off-Plan Milestones & Buy vs Rent on obsidian cards. */
export function ObsidianBarChart({
  bars,
}: {
  bars: { label: string; value: number; display: string; color: string }[];
}) {
  const maxVal = Math.max(1, ...bars.map((b) => b.value));

  return (
    <div className="space-y-4">
      {bars.map((bar) => (
        <div key={bar.label} className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#a7a7a7]">{bar.label}</span>
            <span className="font-medium text-white tabular-nums">{bar.display}</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.max(3, (bar.value / maxVal) * 100)}%`,
                backgroundColor: bar.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
