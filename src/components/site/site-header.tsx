"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, X } from "lucide-react";
import { CURRENCY_RATES, type CurrencyCode, usePrefs } from "@/lib/prefs";
import { SITE } from "@/lib/swk";
import { BracketLink } from "@/components/avenlo/bracket-button";

const TOP_NAV = [
  { href: "/properties", label: "Properties" },
  { href: "/off-plan", label: "Off-Plan" },
  { href: "/developers", label: "Developers" },
  { href: "/services", label: "Services" },
];

const PAGES_COLUMNS = [
  {
    heading: "Explore",
    links: [
      { href: "/", label: "Home" },
      { href: "/properties", label: "All Properties" },
      { href: "/buy", label: "Buy Ready Homes" },
      { href: "/rent", label: "Rent & Leasing" },
      { href: "/off-plan", label: "Off-Plan Launches" },
      { href: "/list-your-property", label: "List Your Property" },
    ],
  },
  {
    heading: "Dubai Ecosystem",
    links: [
      { href: "/developers", label: "27+ Master Developers" },
      { href: "/communities", label: "Dubai Communities" },
      { href: "/services", label: "Advisory Services" },
      { href: "/agents", label: "Advisors & Team" },
      { href: "/insights", label: "Market Insights" },
      { href: "/guides", label: "Dubai Property Guides" },
    ],
  },
  {
    heading: "Tools & Firm",
    links: [
      { href: "/calculators", label: "Mortgage & DLD Calculator" },
      { href: "/about", label: "About SWK Properties" },
      { href: "/faq", label: "Questions & FAQ" },
      { href: "/contact", label: "Contact & Office" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms & Disclosures" },
    ],
  },
];

export function SiteHeader() {
  const pathname = usePathname();
  const {
    currency,
    setCurrency,
    areaUnit,
    setAreaUnit,
    savedSlugs,
    compareSlugs,
    setDrawerOpen,
  } = usePrefs();

  const [pagesOpen, setPagesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setPagesOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPagesOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const shortlistCount = savedSlugs.length + compareSlugs.length;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled || mobileOpen
          ? "bg-white/95 backdrop-blur-xl border-b border-black/[0.07]"
          : "bg-white/88 backdrop-blur-md border-b border-black/[0.04]"
      }`}
    >
      <div className="mx-auto flex h-[78px] sm:h-[88px] max-w-[1260px] items-center justify-between gap-4 px-4 sm:px-8">
        {/* Left: Uploaded Transparent SWK Crest + Architectural Lockup */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#121212]"
          aria-label="SWK Properties Dubai Home"
        >
          <img
            src="/brand/swk-crest-2026-192.webp"
            width={44}
            height={44}
            alt="SWK Properties Emblem"
            fetchPriority="high"
            className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 object-contain transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <div className="flex flex-col leading-none">
            <span className="text-[19px] sm:text-[21px] font-semibold tracking-[-0.04em] text-[#121212]">
              SWK Properties
            </span>
            <span className="mt-1 text-[9.5px] sm:text-[10px] font-medium uppercase tracking-[0.22em] text-[#8b8b8b]">
              DUBAI REAL ESTATE
            </span>
          </div>
        </Link>

        {/* Center-Right: Avenlo "+ LINK" Architectural Navigation */}
        <div className="hidden lg:flex items-center gap-7 xl:gap-8">
          <nav aria-label="Primary navigation" className="flex items-center gap-6 xl:gap-7">
            {TOP_NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`group inline-flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.12em] transition-colors ${
                    active ? "text-[#121212]" : "text-[#121212]/75 hover:text-[#121212]"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`text-[13px] font-light transition-transform duration-200 group-hover:rotate-90 ${
                      active ? "text-[#0e9f6e]" : "text-[#8b8b8b]"
                    }`}
                  >
                    +
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* "+ PAGES" 3-Column Avenlo Mega Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setPagesOpen((v) => !v)}
                aria-expanded={pagesOpen}
                aria-controls="swk-pages-panel"
                className={`group inline-flex cursor-pointer items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.12em] transition-colors ${
                  pagesOpen ? "text-[#121212]" : "text-[#121212]/75 hover:text-[#121212]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`text-[13px] font-light transition-transform duration-200 ${
                    pagesOpen ? "rotate-45 text-[#121212]" : "text-[#8b8b8b]"
                  }`}
                >
                  +
                </span>
                <span>Pages</span>
              </button>

              {pagesOpen ? (
                <div
                  id="swk-pages-panel"
                  className="absolute right-0 top-[calc(100%+22px)] z-50 w-[680px] rounded-2xl border border-black/[0.08] bg-white p-8 shadow-[0_24px_60px_rgba(18,18,18,0.14)]"
                >
                  <div className="grid grid-cols-3 gap-x-10 gap-y-5">
                    {PAGES_COLUMNS.map((col) => (
                      <div key={col.heading}>
                        <p className="mb-3.5 text-[10px] font-medium uppercase tracking-[0.22em] text-[#8b8b8b]">
                          {col.heading}
                        </p>
                        <ul className="space-y-2.5">
                          {col.links.map((lnk) => (
                            <li key={lnk.href}>
                              <Link
                                href={lnk.href}
                                onClick={() => setPagesOpen(false)}
                                className={`block text-[14px] tracking-[-0.015em] transition-colors ${
                                  isActive(lnk.href)
                                    ? "font-medium text-[#121212]"
                                    : "text-[#4a4a4a] hover:text-[#121212]"
                                }`}
                              >
                                {lnk.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Clean Utility Footer inside Mega Panel */}
                  <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.08] pt-5 text-xs">
                    <div className="flex items-center gap-2.5">
                      <label className="sr-only" htmlFor="header-currency">
                        Display currency
                      </label>
                      <select
                        id="header-currency"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                        className="rounded-lg border border-black/10 bg-[#f7f7f7] px-2.5 py-1.5 text-xs font-medium text-[#121212] focus:border-[#121212] focus:outline-none"
                      >
                        {(Object.keys(CURRENCY_RATES) as CurrencyCode[]).map((code) => (
                          <option key={code} value={code}>
                            {code}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => setAreaUnit(areaUnit === "sqft" ? "sqm" : "sqft")}
                        className="cursor-pointer rounded-lg border border-black/10 bg-[#f7f7f7] px-2.5 py-1.5 text-xs font-medium text-[#121212] hover:bg-[#ececec]"
                      >
                        {areaUnit === "sqft" ? "sq ft" : "sq m"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPagesOpen(false);
                          setDrawerOpen(true);
                        }}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-black/10 bg-[#f7f7f7] px-2.5 py-1.5 text-xs font-medium text-[#121212] hover:bg-[#ececec]"
                      >
                        <Heart className="h-3.5 w-3.5" />
                        <span>Shortlist ({shortlistCount})</span>
                      </button>
                    </div>

                    <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#8b8b8b]">
                      RERA ORN {SITE.reraOrn}
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          </nav>

          {/* Right Corner-Bracketed Primary CTA */}
          <BracketLink href="/contact" variant="light" size="sm">
            Book a Call
          </BracketLink>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2.5 lg:hidden">
          <BracketLink href="/contact" variant="light" size="sm" className="hidden sm:inline-flex">
            Book a Call
          </BracketLink>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-black/10 bg-[#f7f7f7] text-[#121212]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Clean Light Mobile Drawer */}
      {mobileOpen ? (
        <div className="lg:hidden border-t border-black/[0.08] bg-white px-4 py-6 shadow-xl">
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { href: "/properties", label: "Properties" },
              { href: "/off-plan", label: "Off-Plan Launches" },
              { href: "/developers", label: "27+ Developers" },
              { href: "/communities", label: "Communities" },
              { href: "/services", label: "Services" },
              { href: "/calculators", label: "Calculators" },
              { href: "/agents", label: "Advisors" },
              { href: "/insights", label: "Insights" },
              { href: "/guides", label: "Dubai Guides" },
              { href: "/about", label: "About SWK" },
              { href: "/list-your-property", label: "List Property" },
              { href: "/contact", label: "Contact" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex min-h-[46px] items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-[#121212] text-white"
                    : "bg-[#f7f7f7] text-[#121212] hover:bg-[#ececec]"
                }`}
              >
                <span>{item.label}</span>
                <span className="text-xs opacity-50">→</span>
              </Link>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-2.5 border-t border-black/[0.08] pt-4">
            <div className="flex items-center gap-2">
              <select
                aria-label="Select display currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="rounded-lg border border-black/10 bg-[#f7f7f7] px-2.5 py-2 text-xs font-medium text-[#121212]"
              >
                {(Object.keys(CURRENCY_RATES) as CurrencyCode[]).map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setAreaUnit(areaUnit === "sqft" ? "sqm" : "sqft")}
                className="rounded-lg border border-black/10 bg-[#f7f7f7] px-3 py-2 text-xs font-medium text-[#121212]"
              >
                {areaUnit === "sqft" ? "sq ft" : "sq m"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setDrawerOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 bg-[#f7f7f7] px-3 py-2 text-xs font-medium text-[#121212]"
              >
                <Heart className="h-3.5 w-3.5" />
                <span>{shortlistCount}</span>
              </button>
            </div>
            <a
              href={`tel:${SITE.phoneRaw}`}
              className="text-xs font-medium text-[#121212] underline underline-offset-4"
            >
              {SITE.phone}
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
