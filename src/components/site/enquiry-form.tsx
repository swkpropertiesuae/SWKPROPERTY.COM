"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Phone } from "lucide-react";
import { usePrefs } from "@/lib/prefs";
import { SITE } from "@/lib/swk";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { BracketButton } from "@/components/avenlo/bracket-button";

export type EnquiryContextType =
  | "property"
  | "viewing"
  | "investment"
  | "advisory"
  | "buying"
  | "renting"
  | "callback"
  | "selling"
  | "renting-out"
  | "brochure"
  | "general";

export interface EnquiryFormProps {
  context?: EnquiryContextType;
  subject?: string;
  heading?: string;
  subheading?: string;
  propertyRef?: string;
  propertyTitle?: string;
  community?: string;
  developer?: string;
  agentSlug?: string;
  agentName?: string;
  defaultViewingPicker?: boolean;
  compact?: boolean;
  className?: string;
}

const COUNTRY_CODES = [
  { code: "+971", label: "+971 (UAE)" },
  { code: "+44", label: "+44 (UK)" },
  { code: "+1", label: "+1 (US/CA)" },
  { code: "+91", label: "+91 (IN)" },
  { code: "+966", label: "+966 (KSA)" },
  { code: "+49", label: "+49 (DE)" },
  { code: "+33", label: "+33 (FR)" },
  { code: "+7", label: "+7 (RU/KZ)" },
  { code: "+65", label: "+65 (SG)" },
  { code: "+41", label: "+41 (CH)" },
];

const INQUIRY_OPTIONS: { value: EnquiryContextType; label: string }[] = [
  { value: "general", label: "General Advisory & Shortlist" },
  { value: "investment", label: "Off-Plan Developer Launches" },
  { value: "buying", label: "Buying Ready Property" },
  { value: "renting", label: "Annual Leasing / Renting" },
  { value: "selling", label: "Selling a Property (Form A)" },
  { value: "renting-out", label: "Leasing Out / Management" },
  { value: "viewing", label: "Schedule Private Viewing" },
];

const GST_SLOTS = [
  "10:00 GST",
  "11:30 GST",
  "14:00 GST",
  "16:30 GST",
  "18:00 GST",
];

export function EnquiryForm({
  context = "general",
  subject,
  heading = "Send us an enquiry",
  subheading = "Your note goes directly to the specialist covering your target Dubai community or developer.",
  propertyRef,
  propertyTitle,
  community,
  developer,
  agentSlug,
  agentName,
  defaultViewingPicker = false,
  compact = false,
  className = "",
}: EnquiryFormProps) {
  const { attribution, trackEvent } = usePrefs();

  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+971");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [inquiryType, setInquiryType] = useState<EnquiryContextType>(context);
  const [preferredContact, setPreferredContact] = useState<"WhatsApp" | "Phone" | "Email">("WhatsApp");
  const [message, setMessage] = useState(
    subject ? `Enquiry regarding: ${subject}` : ""
  );
  const [showViewing, setShowViewing] = useState(defaultViewingPicker);
  const [viewingDate, setViewingDate] = useState("");
  const [viewingTimeGst, setViewingTimeGst] = useState(GST_SLOTS[1]);
  const [viewingMode, setViewingMode] = useState("In-person viewing (Dubai)");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [companyWebsite, setCompanyWebsite] = useState(""); // honeypot

  const [started, setStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    enquiryId: string;
    submittedAtGst?: string;
    primaryAgent?: string;
  } | null>(null);

  const onFocusStart = () => {
    if (!started) {
      setStarted(true);
      trackEvent("form_start", { context: inquiryType, propertyRef: propertyRef || "general" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (phone.replace(/[^\d+]/g, "").length < 7) {
      setError("Please enter a valid phone or WhatsApp number.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          countryCode,
          phone: phone.trim(),
          email: email.trim(),
          message: message.trim(),
          context: inquiryType,
          preferredContact,
          marketingConsent,
          viewingDate: showViewing ? viewingDate : undefined,
          viewingTimeGst: showViewing ? viewingTimeGst : undefined,
          viewingMode: showViewing ? viewingMode : undefined,
          propertyRef,
          propertyTitle: propertyTitle || subject,
          community,
          developer,
          agentSlug,
          pageUrl: typeof window !== "undefined" ? window.location.href : SITE.url,
          attribution,
          companyWebsite,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        enquiryId?: string;
        submittedAtGst?: string;
        routing?: { primaryAgent?: string };
      };
      if (!res.ok || !data.ok) {
        setError(
          data.error ||
            `We could not submit right now. Message us directly on WhatsApp at ${SITE.phoneDisplay}.`
        );
      } else {
        setResult({
          enquiryId: data.enquiryId || "SWK-LOGGED",
          submittedAtGst: data.submittedAtGst,
          primaryAgent: data.routing?.primaryAgent || agentName,
        });
        trackEvent("enquiry_success", {
          context: inquiryType,
          propertyRef: propertyRef || "general",
        });
      }
    } catch {
      setError(
        `Connection error. Please reach us directly on WhatsApp at ${SITE.phoneDisplay} or ${SITE.email}.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const waFallback = `${SITE.whatsappUrl}?text=${encodeURIComponent(
    `Hello SWK Properties, I am enquiring about ${propertyTitle || subject || community || "Dubai property advisory"}.`
  )}`;

  if (result) {
    return (
      <div
        className={`rounded-2xl border border-white/80 bg-white/86 backdrop-blur-xl shadow-[0_18px_48px_rgba(12,56,96,0.09)] p-6 sm:p-8 ${className}`}
      >
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#121212] text-[#51fec0]">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <h3 className="mt-5 text-2xl font-medium tracking-[-0.03em] text-[#121212]">
          Enquiry received
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[#525252]">
          Reference <strong className="font-mono text-[#121212]">{result.enquiryId}</strong>
          {result.primaryAgent ? ` has been routed to ${result.primaryAgent}` : " has been logged"}
          {result.submittedAtGst ? ` (${result.submittedAtGst})` : ""}. Expect a clear response within one Dubai business day.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={waFallback}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#121212] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-white hover:bg-[#2b2b2b]"
          >
            <WhatsAppIcon className="h-4 w-4 text-[#51fec0]" />
            <span>Continue on WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={() => {
              setResult(null);
              setName("");
              setPhone("");
              setEmail("");
              setMessage("");
            }}
            className="cursor-pointer rounded-full border border-black/12 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-[#121212] hover:bg-[#f7f7f7]"
          >
            Send Another Note
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-white/80 bg-white/86 backdrop-blur-xl shadow-[0_18px_48px_rgba(12,56,96,0.09)] ${
        compact ? "p-5 sm:p-6" : "p-6 sm:p-8 md:p-10"
      } ${className}`}
    >
      <div className="mb-6">
        <h3 className="text-[22px] sm:text-[26px] font-medium tracking-[-0.03em] text-[#121212]">
          {heading}
        </h3>
        {subheading ? (
          <p className="mt-2 text-sm leading-relaxed text-[#737373]">{subheading}</p>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} onFocus={onFocusStart} className="space-y-4" noValidate>
        {/* Honeypot */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor={`hp-${context}`}>Company Website</label>
          <input
            id={`hp-${context}`}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={companyWebsite}
            onChange={(e) => setCompanyWebsite(e.target.value)}
          />
        </div>

        {/* Name & Phone Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#525252]">
              Full name <span className="text-[#121212]">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
              className="w-full rounded-lg border border-[#d4d4d4] bg-white px-4 py-3 text-sm text-[#121212] placeholder:text-[#a7a7a7] focus:border-[#121212] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#525252]">
              Phone / WhatsApp <span className="text-[#121212]">*</span>
            </label>
            <div className="flex gap-2">
              <select
                aria-label="Country code"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-[106px] shrink-0 rounded-lg border border-[#d4d4d4] bg-[#f7f7f7] px-2.5 py-3 text-xs font-medium text-[#121212] focus:border-[#121212] focus:outline-none"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="50 000 0000"
                autoComplete="tel-national"
                className="min-w-0 flex-1 rounded-lg border border-[#d4d4d4] bg-white px-3.5 py-3 text-sm text-[#121212] placeholder:text-[#a7a7a7] focus:border-[#121212] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Email & Inquiry Type */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#525252]">
              Email address <span className="text-[#121212]">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              autoComplete="email"
              className="w-full rounded-lg border border-[#d4d4d4] bg-white px-4 py-3 text-sm text-[#121212] placeholder:text-[#a7a7a7] focus:border-[#121212] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#525252]">
              Inquiry type
            </label>
            <select
              value={inquiryType}
              onChange={(e) => setInquiryType(e.target.value as EnquiryContextType)}
              className="w-full rounded-lg border border-[#d4d4d4] bg-white px-3.5 py-3 text-sm text-[#121212] focus:border-[#121212] focus:outline-none"
            >
              {INQUIRY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Preferred Channel + Optional Viewing Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5">
            {(["WhatsApp", "Phone", "Email"] as const).map((ch) => (
              <button
                key={ch}
                type="button"
                onClick={() => setPreferredContact(ch)}
                className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  preferredContact === ch
                    ? "bg-[#121212] text-white"
                    : "border border-black/10 bg-[#f7f7f7] text-[#525252] hover:text-[#121212]"
                }`}
              >
                {ch}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowViewing((v) => !v)}
            className="cursor-pointer text-xs font-medium text-[#525252] underline underline-offset-4 hover:text-[#121212]"
          >
            {showViewing ? "Hide viewing slot" : "+ Request viewing slot"}
          </button>
        </div>

        {showViewing ? (
          <div className="grid grid-cols-1 gap-3 rounded-xl border border-black/[0.08] bg-[#f7f7f7] p-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-[#525252]">
                Preferred date
              </label>
              <input
                type="date"
                value={viewingDate}
                onChange={(e) => setViewingDate(e.target.value)}
                className="w-full rounded-lg border border-[#d4d4d4] bg-white px-3 py-2 text-xs text-[#121212]"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-[#525252]">
                Time (Dubai GST)
              </label>
              <select
                value={viewingTimeGst}
                onChange={(e) => setViewingTimeGst(e.target.value)}
                className="w-full rounded-lg border border-[#d4d4d4] bg-white px-3 py-2 text-xs text-[#121212]"
              >
                {GST_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-[#525252]">
                Format
              </label>
              <select
                value={viewingMode}
                onChange={(e) => setViewingMode(e.target.value)}
                className="w-full rounded-lg border border-[#d4d4d4] bg-white px-3 py-2 text-xs text-[#121212]"
              >
                <option value="In-person viewing (Dubai)">In-person (Dubai)</option>
                <option value="Live video walkthrough">Live video tour</option>
                <option value="Office meeting (Sheikh Zayed Rd)">SZR Office Suite</option>
              </select>
            </div>
          </div>
        ) : null}

        {/* Message */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#525252]">
            Brief or notes
          </label>
          <textarea
            rows={compact ? 3 : 4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share target community, budget in AED, bedroom count, or timeline..."
            className="w-full resize-y rounded-lg border border-[#d4d4d4] bg-white px-4 py-3 text-sm text-[#121212] placeholder:text-[#a7a7a7] focus:border-[#121212] focus:outline-none"
          />
        </div>

        {/* Unticked UAE PDPL Marketing Opt-In (Mandatory Separation) */}
        <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-[#737373]">
          <input
            type="checkbox"
            checked={marketingConsent}
            onChange={(e) => setMarketingConsent(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-[#121212]"
          />
          <span>
            Optional: keep me updated on new Dubai developer launches and market briefings. Submitting this form authorizes SWK Properties LLC to respond to your enquiry under our{" "}
            <Link href="/privacy" className="text-[#121212] underline underline-offset-2">
              UAE PDPL Privacy Policy
            </Link>
            .
          </span>
        </label>

        {error ? (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        <div className="pt-2">
          <BracketButton
            type="submit"
            disabled={submitting}
            variant="light"
            size="lg"
            fullWidth
          >
            {submitting ? "Sending enquiry..." : "Send Enquiry"}
          </BracketButton>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-[#8b8b8b]">
          <span>Prefer direct contact?</span>
          <div className="flex items-center gap-4">
            <a
              href={waFallback}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("whatsapp_click", { location: "enquiry_form" })}
              className="inline-flex items-center gap-1.5 font-medium text-[#121212] hover:text-[#0e9f6e]"
            >
              <WhatsAppIcon className="h-3.5 w-3.5 text-[#0e9f6e]" />
              <span>WhatsApp</span>
            </a>
            <a
              href={`tel:${SITE.phoneRaw}`}
              onClick={() => trackEvent("phone_click", { location: "enquiry_form" })}
              className="inline-flex items-center gap-1 font-medium text-[#121212] hover:underline"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>{SITE.phone}</span>
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
