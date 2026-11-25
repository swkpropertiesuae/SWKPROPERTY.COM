"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Cookie,
  Heart,
  Menu,
  MessageSquare,
  Phone,
  Scale,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { LISTINGS, permitLabel } from "@/lib/listings";
import { projects } from "@/lib/developers";
import { faqs, SITE } from "@/lib/swk";
import { usePrefs } from "@/lib/prefs";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  links?: { label: string; href: string }[];
}

const INITIAL_CHAT: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    text: `Welcome to SWK Properties (RERA ORN ${SITE.reraOrn}). Ask about any Dubai developer, hot studios (Binghatti AED 550K, Tarrad AED 620K, Azizi Venice AED 680K), ready homes, or DLD fees and I will point you straight to the right page or specialist.`,
    links: [
      { label: "Off-Plan Launches", href: "/off-plan" },
      { label: "UAE Master Developers", href: "/developers" },
      { label: "Mortgage & DLD Calculator", href: "/calculators" },
    ],
  },
];

const STOP_WORDS = new Set(["the", "and", "for", "with", "in", "on", "of", "to", "a", "an", "launches", "launch", "projects", "project", "dubai", "uae"]);

function scoreText(haystack: string, fullQuery: string, tokens: string[]): number {
  const lower = haystack.toLowerCase();
  if (lower.includes(fullQuery)) return 10;
  let score = 0;
  for (const t of tokens) {
    if (lower.includes(t)) score += 2;
  }
  return score;
}

function generateAssistantReply(query: string): {
  text: string;
  links: { label: string; href: string }[];
} {
  const q = query.toLowerCase().trim();
  const tokens = q
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 2 && !STOP_WORDS.has(w));
  const searchTokens = tokens.length > 0 ? tokens : q.split(/\s+/).filter(Boolean);

  // Explicit fee / DLD / mortgage / FAQ intent first when query asks about fees or costs
  if (/\b(?:fee|fees|dld|oqood|mortgage|trustee|commission|admin|visa|ejari)\b/i.test(q)) {
    const scoredFaqs = faqs
      .map((f) => ({ f, s: scoreText(`${f.q} ${f.a}`, q, searchTokens) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s);
    if (scoredFaqs[0]) {
      return {
        text: `${scoredFaqs[0].f.a}\n\nSpeak with our Sheikh Zayed Road desk for case-specific figures.`,
        links: [
          { label: "Mortgage & DLD Calculator", href: "/calculators" },
          { label: "Read Full FAQ", href: "/faq" },
          { label: "Terms & Conditions", href: "/terms" },
        ],
      };
    }
  }

  const allMatchedProjects = projects
    .map((p) => ({
      p,
      s: scoreText(`${p.name} ${p.developer} ${p.community} ${p.tags.join(" ")}`, q, searchTokens),
    }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.p);

  if (allMatchedProjects.length > 0) {
    const shown = allMatchedProjects.slice(0, 3);
    const countLabel =
      allMatchedProjects.length > 3
        ? `${allMatchedProjects.length} developer releases`
        : `${allMatchedProjects.length} developer release${allMatchedProjects.length === 1 ? "" : "s"}`;
    return {
      text: `We track ${countLabel} matching "${query}". Current unit availability, payment schedules, and prices depend on the developer and prevailing market conditions.`,
      links: shown.map((p) => ({
        label: `${p.name} — ${p.developer}`,
        href: `/off-plan/${p.slug}`,
      })),
    };
  }

  const allMatchedListings = LISTINGS.map((l) => {
    let s = scoreText(`${l.title} ${l.community} ${l.developer} ${l.propertyType}`, q, searchTokens);
    if (q.includes("rent") && l.purpose === "rent") s += 3;
    if (q.includes("buy") && l.purpose === "buy") s += 3;
    if (q.includes("studio") && l.bedrooms === 0 && l.propertyType !== "Office") s += 4;
    return { l, s };
  })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.l);

  if (allMatchedListings.length > 0) {
    const shown = allMatchedListings.slice(0, 3);
    const summary = shown
      .map(
        (l) =>
          `• ${l.title} (${l.community}) — AED ${l.priceAed.toLocaleString("en-US")}${
            l.purpose === "rent" ? "/yr" : ""
          }${permitLabel(l) ? ` · ${permitLabel(l)}` : ""}`
      )
      .join("\n");
    return {
      text: `Matching residences on our books (${allMatchedListings.length} total):\n${summary}\n\nAvailability and prices depend on developers and current market conditions.`,
      links: shown.map((l) => ({
        label: l.title,
        href: `/properties/${l.slug}`,
      })),
    };
  }

  const matchedFaq = faqs
    .map((f) => ({ f, s: scoreText(`${f.q} ${f.a}`, q, searchTokens) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)[0]?.f;

  if (matchedFaq) {
    return {
      text: `${matchedFaq.a}\n\nSpeak with our Sheikh Zayed Road desk for case-specific guidance.`,
      links: [
        { label: "Read Full FAQ", href: "/faq" },
        { label: "Book a Call", href: "/contact" },
      ],
    };
  }

  return {
    text: "I search SWK Properties' Dubai & UAE portfolio across Nakheel, Binghatti, Emaar, DAMAC, Azizi, Tarrad, and Sobha. Would you like to browse releases, run the DLD & mortgage calculator, or speak directly with our team?",
    links: [
      { label: "Browse All Properties", href: "/properties" },
      { label: "Explore Off-Plan Projects", href: "/off-plan" },
      { label: "Book a Call", href: "/contact" },
    ],
  };
}

const QUICK_PILL_LINKS = [
  { href: "/properties", label: "Properties" },
  { href: "/off-plan", label: "Off-Plan Launches" },
  { href: "/developers", label: "Developers" },
  { href: "/communities", label: "Communities" },
  { href: "/services", label: "Services" },
  { href: "/calculators", label: "Calculator" },
  { href: "/agents", label: "Advisors" },
  { href: "/contact", label: "Book a Call" },
];

export function FloatingChrome() {
  const {
    hydrated,
    savedSlugs,
    toggleSaved,
    compareSlugs,
    toggleCompare,
    clearCompare,
    drawerOpen,
    setDrawerOpen,
    assistantOpen,
    setAssistantOpen,
    cookieConsent,
    updateCookieConsent,
    formatPrice,
    formatArea,
    trackEvent,
    toastMessage,
  } = usePrefs();

  const [pillOpen, setPillOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    if (!drawerOpen && !assistantOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawerOpen(false);
        setAssistantOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, assistantOpen, setDrawerOpen, setAssistantOpen]);

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  const sendQuery = (raw: string) => {
    const trimmed = raw.trim().slice(0, 200);
    if (!trimmed) return;
    const reply = generateAssistantReply(trimmed);
    setChatMessages((prev) => [
      ...prev.slice(-38),
      { id: `u-${Date.now()}`, role: "user", text: trimmed },
      { id: `a-${Date.now() + 1}`, role: "assistant", text: reply.text, links: reply.links },
    ]);
    setChatInput("");
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    sendQuery(chatInput);
  };

  const savedListings = LISTINGS.filter((l) => savedSlugs.includes(l.slug));
  const comparedListings = LISTINGS.filter((l) => compareSlugs.includes(l.slug));
  const shortlistCount = savedSlugs.length + compareSlugs.length;

  return (
    <>
      {/* 1. Toast Feedback Pill */}
      {toastMessage ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-24 right-4 z-[85] flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5 text-xs font-medium text-[#121212] shadow-lg"
        >
          <CheckCircle2 className="h-4 w-4 text-[#0e9f6e]" />
          <span>{toastMessage}</span>
        </div>
      ) : null}

      {/* 2. UAE PDPL Cookie Consent Card (Hydration-gated to prevent SSR flash) */}
      {hydrated && !cookieConsent.decided ? (
        <div className="fixed bottom-[122px] sm:bottom-24 left-3 right-3 sm:left-6 sm:right-auto sm:max-w-sm z-50 rounded-2xl border border-black/10 bg-white/96 p-3.5 sm:p-5 text-[#121212] shadow-[0_18px_46px_rgba(18,18,18,0.18)] backdrop-blur-xl max-w-[360px] mx-auto sm:mx-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] sm:tracking-[0.2em] text-[#525252]">
              <Cookie className="h-3.5 w-3.5 text-[#121212] shrink-0" />
              <span>Privacy &amp; Cookies (UAE PDPL)</span>
            </div>
            <button
              type="button"
              aria-label="Close cookie banner (essential only)"
              onClick={() => updateCookieConsent({ analytics: false, preferences: true })}
              className="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-black/[0.08] text-[#121212] transition-colors hover:bg-[#121212] hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-1.5 sm:mt-2 text-[11.5px] sm:text-xs leading-relaxed text-[#525252]">
            Essential storage keeps your shortlist and currency working. See{" "}
            <Link href="/cookies" className="font-medium text-[#121212] underline underline-offset-2">
              Cookies
            </Link>{" "}
            &amp;{" "}
            <Link href="/privacy" className="font-medium text-[#121212] underline underline-offset-2">
              Privacy
            </Link>
            .
          </p>
          <div className="mt-2.5 sm:mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => updateCookieConsent({ analytics: true, preferences: true })}
              className="flex-1 sm:flex-initial cursor-pointer rounded-full bg-[#121212] px-3.5 py-1.5 sm:px-4 sm:py-2 text-[10.5px] sm:text-[11px] font-medium uppercase tracking-[0.13em] text-white transition-colors hover:bg-[#2b2b2b]"
            >
              Accept All
            </button>
            <button
              type="button"
              onClick={() => updateCookieConsent({ analytics: false, preferences: true })}
              className="flex-1 sm:flex-initial cursor-pointer rounded-full border border-black/15 bg-[#f7f7f7] px-3.5 py-1.5 sm:px-4 sm:py-2 text-[10.5px] sm:text-[11px] font-medium uppercase tracking-[0.13em] text-[#121212] transition-colors hover:bg-[#ececec]"
            >
              Essential Only
            </button>
          </div>
        </div>
      ) : null}

      {/* 3. Avenlo Signature Centered Floating Dark Frosted Bottom Pill */}
      <div
        className="fixed left-1/2 -translate-x-1/2 z-40 flex flex-col items-center"
        style={{ bottom: "max(1.1rem, env(safe-area-inset-bottom))" }}
      >
        <AnimatePresence>
          {pillOpen ? (
            <motion.div
              key="bottom-pill-menu"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="mb-2.5 w-[290px] sm:w-[340px] rounded-2xl border border-white/15 bg-[#121212]/92 p-4 text-white backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
            >
              <div className="grid grid-cols-2 gap-1.5">
                {QUICK_PILL_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setPillOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-xs font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setPillOpen(false);
                    setDrawerOpen(true);
                  }}
                  className="inline-flex cursor-pointer items-center gap-1.5 text-white/80 hover:text-[#51fec0]"
                >
                  <Heart className="h-3.5 w-3.5" />
                  <span>Shortlist ({shortlistCount})</span>
                </button>
                <a
                  href={SITE.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("whatsapp_click", { location: "bottom_pill" })}
                  className="inline-flex items-center gap-1.5 font-medium text-[#51fec0] hover:underline"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setPillOpen((v) => !v)}
          aria-expanded={pillOpen}
          aria-label="Open quick navigation menu"
          className="inline-flex h-11 sm:h-12 min-w-[180px] sm:min-w-[220px] cursor-pointer items-center justify-between gap-4 sm:gap-6 rounded-xl border border-white/18 bg-[#0b1522]/88 px-3.5 sm:px-4 text-xs font-medium text-white backdrop-blur-xl shadow-[0_14px_34px_rgba(8,22,38,0.32)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#51fec0]/50 hover:bg-[#0b1522]/96 hover:shadow-[0_18px_42px_rgba(8,22,38,0.48)]"
        >
          <span className="inline-flex items-center gap-2 sm:gap-2.5 whitespace-nowrap">
            <img
              src="/brand/swk-icon-192.webp?v=4"
              width={28}
              height={28}
              alt=""
              className="h-6 w-6 sm:h-7 sm:w-7 shrink-0 object-contain drop-shadow-[0_2px_10px_rgba(212,175,55,0.48)]"
            />
            <span className="font-semibold tracking-[-0.01em] whitespace-nowrap">SWK Properties</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            {shortlistCount > 0 ? (
              <span className="h-1.5 w-1.5 rounded-full bg-[#51fec0]" aria-hidden="true" />
            ) : null}
            {pillOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </span>
        </button>
      </div>

      {/* 4. Minimal Corner Concierge & WhatsApp Triggers */}
      <div
        className="fixed right-3 sm:right-6 z-40 flex items-center gap-2"
        style={{ bottom: "max(1.1rem, env(safe-area-inset-bottom))" }}
      >
        <button
          type="button"
          onClick={() => setAssistantOpen(!assistantOpen)}
          aria-label="Open SWK Property Concierge"
          title="Ask SWK Concierge"
          className="hidden sm:inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/80 bg-white/92 text-[#121212] shadow-md backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:border-[#121212] hover:bg-[#121212] hover:text-[#51fec0] hover:shadow-xl"
        >
          <MessageSquare className="h-4 w-4" />
        </button>
        <a
          href={`${SITE.whatsappUrl}?text=${encodeURIComponent(
            "Hello SWK Properties, I am browsing swkpropertiesuae.com and would like property assistance."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("whatsapp_click", { location: "floating_corner" })}
          aria-label="Chat on WhatsApp"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_22px_rgba(37,211,102,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-110 hover:shadow-[0_14px_32px_rgba(37,211,102,0.58)]"
        >
          <WhatsAppIcon className="h-5 w-5" />
        </a>
      </div>

      {/* 5. Monochrome SWK Property Concierge Panel */}
      {assistantOpen ? (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="SWK Advisory Concierge"
          className="fixed bottom-20 right-3 sm:right-6 z-[80] flex h-[70dvh] max-h-[500px] w-[calc(100vw-1.5rem)] max-w-md flex-col overflow-hidden rounded-2xl border border-black/12 bg-white text-[#121212] shadow-[0_24px_70px_rgba(18,18,18,0.22)]"
        >
          <div className="flex items-center justify-between bg-[#121212] px-5 py-4 text-white">
            <div className="flex items-center gap-2.5">
              <img
                src="/brand/swk-icon-192.webp?v=4"
                width={24}
                height={24}
                alt=""
                className="h-6 w-6 object-contain"
              />
              <div>
                <p className="text-sm font-medium">SWK Advisory Concierge</p>
                <p className="text-[11px] text-[#8b8b8b]">
                  Dubai &amp; UAE Inventory · RERA ORN {SITE.reraOrn}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAssistantOpen(false)}
              aria-label="Close concierge"
              className="cursor-pointer rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#f7f7f7] p-4 text-xs">
            {chatMessages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[88%] whitespace-pre-line rounded-2xl px-4 py-3 leading-relaxed ${
                    m.role === "user"
                      ? "bg-[#121212] text-white"
                      : "border border-black/[0.07] bg-white text-[#121212]"
                  }`}
                >
                  {m.text}
                </div>
                {m.links && m.links.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.links.map((lnk) => (
                      <Link
                        key={lnk.href + lnk.label}
                        href={lnk.href}
                        onClick={() => setAssistantOpen(false)}
                        className="rounded-full border border-black/12 bg-white px-3 py-1 text-[11px] font-medium text-[#121212] hover:bg-[#121212] hover:text-white transition-colors"
                      >
                        {lnk.label} →
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}

            <div className="pt-1 flex flex-wrap gap-1.5">
              {["Emaar launches", "Dubai Marina", "DLD buyer fees", "Binghatti Studio"].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => sendQuery(chip)}
                  className="cursor-pointer rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] text-[#525252] hover:border-[#121212] hover:text-[#121212]"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-black/[0.07] bg-[#f7f7f7] px-4 py-2 text-[11px] text-[#525252]">
            <span>Speak to our desk</span>
            <div className="flex items-center gap-3">
              <a
                href={SITE.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#0e9f6e] hover:underline"
              >
                WhatsApp
              </a>
              <a
                href={`tel:${SITE.phoneRaw}`}
                className="inline-flex items-center gap-1 font-medium text-[#121212] hover:underline"
              >
                <Phone className="h-3 w-3" />
                Call
              </a>
            </div>
          </div>

          <form onSubmit={handleSendChat} className="flex items-center gap-2 border-t border-black/[0.08] bg-white p-3">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about a project, community, or DLD fees..."
              className="flex-1 rounded-lg border border-black/12 bg-[#f7f7f7] px-3.5 py-2 text-xs text-[#121212] placeholder:text-[#8b8b8b] focus:border-[#121212] focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-[#121212] text-white hover:bg-[#2b2b2b]"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      ) : null}

      {/* 6. Saved Shortlist & Side-by-Side Comparison Drawer */}
      {drawerOpen ? (
        <div
          className="fixed inset-0 z-[90] flex justify-end bg-[#121212]/45 backdrop-blur-xs"
          onClick={() => setDrawerOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Shortlist and Property Comparison"
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-full max-w-3xl flex-col bg-white text-[#121212] border-l border-black/10 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-black/[0.08] bg-[#f7f7f7] px-6 py-5">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8b8b8b]">
                  CLIENT WORKSPACE
                </p>
                <h3 className="mt-1 text-xl font-medium tracking-[-0.02em] text-[#121212]">
                  Shortlist ({savedListings.length}) &amp; Compare ({comparedListings.length}/4)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close shortlist drawer"
                className="cursor-pointer rounded-full border border-black/12 bg-white p-2 text-[#525252] hover:text-[#121212]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b8b8b]">
                    <Scale className="h-4 w-4 text-[#121212]" />
                    <span>Side-by-Side Comparison</span>
                  </h4>
                  {comparedListings.length > 0 ? (
                    <button
                      type="button"
                      onClick={clearCompare}
                      className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-rose-600 hover:underline"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Clear
                    </button>
                  ) : null}
                </div>

                {comparedListings.length === 0 ? (
                  <div className="rounded-2xl border border-black/[0.07] bg-[#f7f7f7] p-6 text-center text-xs text-[#525252]">
                    Tap the compare icon on any property card to compare prices, areas, service charges, and payment schedules side by side.
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-black/[0.08]">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f7f7f7] text-[#121212]">
                        <tr>
                          <th className="p-3 font-medium">Metric</th>
                          {comparedListings.map((item) => (
                            <th key={item.slug} className="min-w-[165px] p-3 font-medium">
                              <div className="flex items-start justify-between gap-2">
                                <Link
                                  href={`/properties/${item.slug}`}
                                  onClick={() => setDrawerOpen(false)}
                                  className="hover:underline"
                                >
                                  {item.title}
                                </Link>
                                <button
                                  type="button"
                                  aria-label={`Remove ${item.title} from comparison`}
                                  onClick={() => toggleCompare(item.slug)}
                                  className="cursor-pointer text-[#8b8b8b] hover:text-[#121212]"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/[0.06]">
                        <tr>
                          <td className="p-3 text-[#8b8b8b]">Price</td>
                          {comparedListings.map((item) => (
                            <td key={item.slug} className="p-3 font-medium text-[#121212]">
                              {formatPrice(item.priceAed)}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-3 text-[#8b8b8b]">Location</td>
                          {comparedListings.map((item) => (
                            <td key={item.slug} className="p-3">
                              {item.community} · {item.developer}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-3 text-[#8b8b8b]">Specs</td>
                          {comparedListings.map((item) => (
                            <td key={item.slug} className="p-3">
                              {item.bedrooms === 0 ? "Studio" : `${item.bedrooms} BR`} · {item.bathrooms} Bath · {formatArea(item.areaSqFt)}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-3 text-[#8b8b8b]">Handover / Plan</td>
                          {comparedListings.map((item) => (
                            <td key={item.slug} className="p-3">
                              {item.paymentPlan || item.handover}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div>
                <h4 className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b8b8b]">
                  <Heart className="h-4 w-4 text-[#121212]" />
                  <span>Saved Shortlist</span>
                </h4>
                {savedListings.length === 0 ? (
                  <div className="rounded-2xl border border-black/[0.07] bg-[#f7f7f7] p-6 text-center text-xs text-[#525252]">
                    No properties saved yet. Tap the heart icon on any listing to build your shortlist.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedListings.map((item) => (
                      <div
                        key={item.slug}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-black/[0.07] bg-[#f7f7f7] p-4"
                      >
                        <div className="min-w-0">
                          <Link
                            href={`/properties/${item.slug}`}
                            onClick={() => setDrawerOpen(false)}
                            className="block truncate text-sm font-medium text-[#121212] hover:underline"
                          >
                            {item.title}
                          </Link>
                          <p className="mt-0.5 text-xs font-medium text-[#525252]">
                            {formatPrice(item.priceAed)}
                          </p>
                          <p className="text-[11px] text-[#8b8b8b]">
                            {item.community} · {item.reference}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleSaved(item.slug)}
                          aria-label="Remove from shortlist"
                          className="cursor-pointer rounded-full p-2 text-[#8b8b8b] hover:text-rose-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.08] bg-[#f7f7f7] px-6 py-4">
              <span className="text-xs text-[#525252]">
                Request DLD cost sheets &amp; floor plans for your shortlist
              </span>
              <Link
                href="/contact"
                onClick={() => setDrawerOpen(false)}
                className="rounded-full bg-[#121212] px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white hover:bg-[#2b2b2b]"
              >
                Send to Advisory Desk
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
