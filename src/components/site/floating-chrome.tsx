"use client";

import React, { useState } from "react";
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
    text: "Welcome to SWK Properties (RERA ORN 51517). Ask about any Dubai developer, 2026 off-plan launch, ready property, or DLD fees and I will point you straight to the right page or specialist.",
    links: [
      { label: "Off-Plan Launches", href: "/off-plan" },
      { label: "UAE Master Developers", href: "/developers" },
      { label: "Mortgage & DLD Calculator", href: "/calculators" },
    ],
  },
];

function generateAssistantReply(query: string): {
  text: string;
  links: { label: string; href: string }[];
} {
  const q = query.toLowerCase();

  const matchedProjects = projects
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.developer.toLowerCase().includes(q) ||
        p.community.toLowerCase().includes(q)
    )
    .slice(0, 3);

  if (matchedProjects.length > 0) {
    return {
      text: `We track ${matchedProjects.length}+ verified developer releases matching "${query}". Current unit availability, payment schedules, and handover dates are confirmed directly with the developer desk.`,
      links: matchedProjects.map((p) => ({
        label: `${p.name} — ${p.developer}`,
        href: `/off-plan/${p.slug}`,
      })),
    };
  }

  const matchedListings = LISTINGS.filter(
    (l) =>
      l.title.toLowerCase().includes(q) ||
      l.community.toLowerCase().includes(q) ||
      l.developer.toLowerCase().includes(q) ||
      l.propertyType.toLowerCase().includes(q) ||
      (q.includes("rent") && l.purpose === "rent") ||
      (q.includes("buy") && l.purpose === "buy")
  ).slice(0, 3);

  if (matchedListings.length > 0) {
    const summary = matchedListings
      .map(
        (l) =>
          `• ${l.title} (${l.community}) — AED ${l.priceAed.toLocaleString("en-US")}${
            l.purpose === "rent" ? "/yr" : ""
          }${permitLabel(l) ? ` · ${permitLabel(l)}` : ""}`
      )
      .join("\n");
    return {
      text: `Matching residences on our books:\n${summary}\n\nAvailability is confirmed directly by our consultants prior to viewing.`,
      links: matchedListings.map((l) => ({
        label: `${l.title}`,
        href: `/properties/${l.slug}`,
      })),
    };
  }

  const matchedFaq = faqs.find(
    (f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
  );
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
    text: "I search SWK Properties' Dubai & UAE portfolio across leading master developers including Nakheel, Binghatti, Emaar, DAMAC, Sobha, and Azizi. Would you like to browse releases, run the DLD & mortgage calculator, or speak directly with our team?",
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

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    const reply = generateAssistantReply(trimmed);
    setChatMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", text: trimmed },
      { id: `a-${Date.now() + 1}`, role: "assistant", text: reply.text, links: reply.links },
    ]);
    setChatInput("");
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

      {/* 2. UAE PDPL Cookie Consent Card */}
      {!cookieConsent.decided ? (
        <div className="fixed bottom-20 left-3 right-3 sm:left-6 sm:right-auto sm:max-w-sm z-50 rounded-2xl border border-black/10 bg-white p-5 text-[#121212] shadow-[0_20px_50px_rgba(18,18,18,0.16)]">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b8b8b]">
            <Cookie className="h-3.5 w-3.5 text-[#121212]" />
            <span>Privacy &amp; Cookies (UAE PDPL)</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-[#525252]">
            Essential storage keeps your shortlist and currency preference working. Review our{" "}
            <Link href="/cookies" className="font-medium text-[#121212] underline underline-offset-2">
              Cookie Inventory
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-medium text-[#121212] underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </p>
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => updateCookieConsent({ analytics: true, preferences: true })}
              className="cursor-pointer rounded-full bg-[#121212] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#2b2b2b]"
            >
              Accept All
            </button>
            <button
              type="button"
              onClick={() => updateCookieConsent({ analytics: false, preferences: true })}
              className="cursor-pointer rounded-full border border-black/15 bg-[#f7f7f7] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[#121212] transition-colors hover:bg-[#ececec]"
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
          className="inline-flex h-11 min-w-[205px] cursor-pointer items-center justify-between gap-6 rounded-xl border border-white/15 bg-[#121212]/78 px-4 text-xs font-medium text-white backdrop-blur-xl shadow-[0_14px_34px_rgba(18,18,18,0.28)] transition-colors hover:bg-[#121212]/92"
        >
          <span className="inline-flex items-center gap-2">
            <img
              src="/brand/swk-icon-192.webp"
              width={20}
              height={20}
              alt=""
              className="h-5 w-5 object-contain"
            />
            <span className="tracking-[-0.01em]">SWK Properties</span>
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
          className="hidden sm:inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-black/12 bg-white/95 text-[#121212] shadow-md backdrop-blur-md transition-colors hover:bg-[#121212] hover:text-white"
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
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_22px_rgba(37,211,102,0.35)] transition-transform hover:scale-105"
        >
          <WhatsAppIcon className="h-5 w-5" />
        </a>
      </div>

      {/* 5. Monochrome SWK Property Concierge Panel */}
      {assistantOpen ? (
        <div className="fixed bottom-20 right-3 sm:right-6 z-[80] flex h-[70dvh] max-h-[500px] w-[calc(100vw-1.5rem)] max-w-md flex-col overflow-hidden rounded-2xl border border-black/12 bg-white text-[#121212] shadow-[0_24px_70px_rgba(18,18,18,0.22)]">
          <div className="flex items-center justify-between bg-[#121212] px-5 py-4 text-white">
            <div className="flex items-center gap-2.5">
              <img
                src="/brand/swk-icon-192.webp"
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
              {["Emaar launches", "Dubai Marina", "DLD buyer fees"].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setChatInput(chip)}
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
        <div className="fixed inset-0 z-[90] flex justify-end bg-[#121212]/45 backdrop-blur-xs">
          <div className="flex h-full w-full max-w-3xl flex-col bg-white text-[#121212] border-l border-black/10 shadow-2xl">
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
