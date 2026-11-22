"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Heart, Menu, X } from "lucide-react";
import { CURRENCY_RATES, type CurrencyCode, usePrefs } from "@/lib/prefs";
import { SITE } from "@/lib/swk";
import { BracketLink } from "@/components/avenlo/bracket-button";

const PROPERTIES_MENU = [
  {
    href: "/off-plan",
    label: "Off-Plan Launches",
    desc: "Direct developer allocations across Nakheel, Binghatti, Emaar, DAMAC, Azizi & Sobha",
  },
  {
    href: "/buy",
    label: "Secondary (Ready Homes)",
    desc: "Verified resale apartments, villas & penthouses with Title Deed clarity",
  },
  {
    href: "/properties?completion=Ready",
    label: "Handover & Ready Transfer",
    desc: "Move-in-ready residences with immediate DLD Trustee transfer & keys",
  },
  {
    href: "/rent",
    label: "Leasing & Rentals",
    desc: "Yearly residential leasing with Ejari registration & tenant advisory",
  },
  {
    href: "/properties?type=Office",
    label: "Commercial Spaces",
    desc: "Grade-A fitted offices & executive suites along Sheikh Zayed Road & Business Bay",
  },
  {
    href: "/properties",
    label: "All Properties & Map Search",
    desc: "Browse full Dubai & UAE portfolio with live currency & area filters",
  },
];

const TOP_NAV = [
  { href: "/developers", label: "Developers" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
];

const PAGES_COLUMNS = [
  {
    heading: "Properties",
    links: [
      { href: "/", label: "Home" },
      { href: "/off-plan", label: "Off-Plan Launches" },
      { href: "/buy", label: "Secondary Market" },
      { href: "/properties?completion=Ready", label: "Handover & Ready" },
      { href: "/rent", label: "Leasing & Rentals" },
      { href: "/properties?type=Office", label: "Commercial Spaces" },
      { href: "/list-your-property", label: "List Your Property" },
    ],
  },
  {
    heading: "Dubai Ecosystem",
    links: [
      { href: "/developers", label: "Master Developers" },
      { href: "/communities", label: "Dubai Communities" },
      { href: "/services", label: "Advisory Services" },
      { href: "/agents", label: "Our Advisory Team" },
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

  const [openMenu, setOpenMenu] = useState<"properties" | "pages" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => {
    const clean = href.split("?")[0];
    return clean === "/" ? pathname === "/" : pathname === clean || pathname.startsWith(`${clean}/`);
  };

  const propertiesActive =
    pathname.startsWith("/properties") ||
    pathname.startsWith("/off-plan") ||
    pathname.startsWith("/buy") ||
    pathname.startsWith("/rent");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
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
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled || mobileOpen
          ? "bg-white/82 backdrop-blur-2xl border-b border-white/70 shadow-[0_12px_36px_rgba(12,56,96,0.08)]"
          : "bg-white/58 backdrop-blur-xl border-b border-white/55"
      }`}
    >
      <div className="mx-auto flex h-[80px] sm:h-[88px] max-w-[1260px] items-center justify-between gap-4 px-4 sm:px-8">
        {/* Left: Unified Transparent SWK Crest Icon + Calligraphic Wordmark */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#121212]"
          aria-label="SWK Properties Dubai Home"
        >
          <img
            src="/brand/swk-icon-192.webp"
            width={44}
            height={44}
            alt="SWK Properties Emblem"
            fetchPriority="high"
            className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 object-contain transition-transform duration-300 group-hover:scale-[1.04]"
          />
          <img
            src="/brand/swk-logo-light.webp"
            width={116}
            height={53}
            alt="SWK Properties"
            fetchPriority="high"
            className="h-9 sm:h-10 w-auto object-contain"
          />
        </Link>

        {/* Center-Right: Avenlo "+ LINK" Architectural Navigation */}
        <div ref={navRef} className="hidden lg:flex items-center gap-7 xl:gap-8">
          <nav aria-label="Primary navigation" className="flex items-center gap-6 xl:gap-7">
            {/* "+ PROPERTIES" Dropdown (Off-Plan, Secondary, Handover, Leasing, Commercial Spaces) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenMenu((m) => (m === "properties" ? null : "properties"))}
                aria-expanded={openMenu === "properties"}
                aria-controls="swk-properties-panel"
                className={`group inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-medium uppercase tracking-[0.12em] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0c233a]/[0.07] ${
                  openMenu === "properties" || propertiesActive
                    ? "bg-[#0c233a]/[0.06] text-[#121212]"
                    : "text-[#121212]/78 hover:text-[#121212]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`text-[13px] font-light transition-transform duration-200 ${
                    openMenu === "properties"
                      ? "rotate-45 text-[#0e9f6e]"
                      : propertiesActive
                        ? "text-[#0e9f6e]"
                        : "text-[#8b8b8b] group-hover:rotate-90"
                  }`}
                >
                  +
                </span>
                <span>Properties</span>
              </button>

              {openMenu === "properties" ? (
                <div
                  id="swk-properties-panel"
                  className="absolute left-0 top-[calc(100%+22px)] z-50 w-[640px] rounded-2xl border border-black/[0.08] bg-white p-6 shadow-[0_24px_60px_rgba(18,18,18,0.14)]"
                >
                  <div className="mb-4 flex items-center justify-between border-b border-black/[0.06] pb-3">
                    <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#8b8b8b]">
                      UAE PROPERTY PORTFOLIO
                    </span>
                    <Link
                      href="/list-your-property"
                      onClick={() => setOpenMenu(null)}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-[#0e9f6e] hover:underline"
                    >
                      <span>List Your Property</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {PROPERTIES_MENU.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpenMenu(null)}
                        className="group rounded-xl border border-transparent bg-[#f8f8f8] p-4 transition-all hover:border-black/15 hover:bg-white hover:shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium tracking-[-0.015em] text-[#121212] group-hover:text-[#0e9f6e]">
                            {item.label}
                          </span>
                          <ArrowUpRight className="h-3.5 w-3.5 text-[#8b8b8b] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#121212]" />
                        </div>
                        <p className="mt-1.5 text-[11.5px] leading-snug text-[#666666]">
                          {item.desc}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {/* + DEVELOPERS, + SERVICES, + ABOUT */}
            {TOP_NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpenMenu(null)}
                  aria-current={active ? "page" : undefined}
                  className={`group inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-medium uppercase tracking-[0.12em] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0c233a]/[0.07] ${
                    active ? "bg-[#0c233a]/[0.06] text-[#121212]" : "text-[#121212]/78 hover:text-[#121212]"
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
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenMenu((m) => (m === "pages" ? null : "pages"))}
                aria-expanded={openMenu === "pages"}
                aria-controls="swk-pages-panel"
                className={`group inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-medium uppercase tracking-[0.12em] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0c233a]/[0.07] ${
                  openMenu === "pages" ? "bg-[#0c233a]/[0.06] text-[#121212]" : "text-[#121212]/78 hover:text-[#121212]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`text-[13px] font-light transition-transform duration-200 ${
                    openMenu === "pages" ? "rotate-45 text-[#121212]" : "text-[#8b8b8b]"
                  }`}
                >
                  +
                </span>
                <span>Pages</span>
              </button>

              {openMenu === "pages" ? (
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
                                onClick={() => setOpenMenu(null)}
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
                          setOpenMenu(null);
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
          <p className="mb-2.5 text-[10px] font-medium uppercase tracking-[0.22em] text-[#8b8b8b]">
            Properties
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { href: "/off-plan", label: "Off-Plan" },
              { href: "/buy", label: "Secondary" },
              { href: "/properties?completion=Ready", label: "Handover" },
              { href: "/rent", label: "Leasing" },
              { href: "/properties?type=Office", label: "Commercial" },
              { href: "/properties", label: "All Properties" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex min-h-[44px] items-center justify-between rounded-xl px-3.5 py-2 text-sm font-medium transition-colors ${
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

          <p className="mt-5 mb-2.5 text-[10px] font-medium uppercase tracking-[0.22em] text-[#8b8b8b]">
            Explore
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { href: "/developers", label: "Developers" },
              { href: "/services", label: "Services" },
              { href: "/about", label: "About SWK" },
              { href: "/communities", label: "Communities" },
              { href: "/agents", label: "Our Team" },
              { href: "/calculators", label: "Calculators" },
              { href: "/insights", label: "Insights" },
              { href: "/contact", label: "Contact" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex min-h-[44px] items-center justify-between rounded-xl px-3.5 py-2 text-sm font-medium transition-colors ${
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
