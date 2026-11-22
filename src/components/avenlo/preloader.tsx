"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export function AvenloPreloader() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (reduced) return;
    try {
      if (sessionStorage.getItem("swk_intro_seen")) return;
      sessionStorage.setItem("swk_intro_seen", "1");
    } catch {
      return;
    }

    let stepId: number | undefined;
    let hideId: number | undefined;
    const rafId = window.requestAnimationFrame(() => {
      setVisible(true);
      let current = 0;
      stepId = window.setInterval(() => {
        current = Math.min(100, current + 16);
        setPct(current);
        if (current >= 100) {
          if (stepId) window.clearInterval(stepId);
          hideId = window.setTimeout(() => setVisible(false), 160);
        }
      }, 50);
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      if (stepId) window.clearInterval(stepId);
      if (hideId) window.clearTimeout(hideId);
    };
  }, [reduced]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="swk-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[120] flex flex-col items-center justify-between bg-[#121212] px-6 py-10 text-white"
          aria-hidden="true"
        >
          <div className="text-[11px] font-medium uppercase tracking-[0.26em] text-white/45">
            RERA ORN 51517 · DUBAI
          </div>

          <div className="flex items-center gap-3.5">
            <img
              src="/brand/swk-crest-2026-192.webp"
              width={48}
              height={48}
              alt=""
              className="h-12 w-12 object-contain"
            />
            <div className="leading-none">
              <div className="text-xl font-semibold tracking-[-0.03em] text-white">
                SWK Properties
              </div>
              <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.24em] text-[#8b8b8b]">
                DUBAI REAL ESTATE
              </div>
            </div>
          </div>

          <div className="font-mono text-xs tracking-[0.2em] text-white/60 tabular-nums">
            {String(pct).padStart(3, "0")}%
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
