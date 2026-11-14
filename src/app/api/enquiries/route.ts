import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { SITE, team } from "@/lib/swk";

/**
 * Lead intake for every enquiry form on the site.
 *
 * A lead is accepted only when at least one delivery channel stores it:
 *  1. LEAD_WEBHOOK_URL  - POSTs the JSON record to a CRM / Zapier / Make / n8n webhook.
 *  2. RESEND_API_KEY    - emails the lead to LEAD_EMAIL_TO (default info@) via Resend.
 *  3. MEDIA (R2)        - archives the JSON under leads/YYYY/MM/<id>.json (private prefix,
 *                         never served by worker/index.js).
 * If every channel fails the visitor is told to use WhatsApp, so no lead is silently lost.
 */

type LeadEnv = {
  LEAD_WEBHOOK_URL?: string;
  LEAD_WEBHOOK_SECRET?: string;
  RESEND_API_KEY?: string;
  LEAD_EMAIL_TO?: string;
  LEAD_EMAIL_FROM?: string;
  MEDIA?: { put: (key: string, value: string, options?: object) => Promise<unknown> };
};

interface EnquiryPayload {
  name?: string;
  phone?: string;
  countryCode?: string;
  email?: string;
  message?: string;
  context?: string;
  preferredContact?: string;
  marketingConsent?: boolean;
  viewingDate?: string;
  viewingTimeGst?: string;
  viewingMode?: string;
  propertyRef?: string;
  propertyTitle?: string;
  community?: string;
  developer?: string;
  agentSlug?: string;
  pageUrl?: string;
  language?: string;
  attribution?: Record<string, string>;
  qualification?: {
    budgetRange?: string;
    timeline?: string;
    financing?: string;
    residency?: string;
  };
  // Honeypot field
  companyWebsite?: string;
}

const DEDUPE_WINDOW_MS = 45_000;
const recentSubmissions = new Map<string, { at: number; enquiryId: string }>();

const clip = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

const member = (slug: string) => team.find((m) => m.slug === slug);
const label = (slug: string) => {
  const m = member(slug);
  return m ? `${m.name} (${m.role})` : "SWK Advisory Desk";
};

/** Routes the lead to a desk using real team roles from src/data/team.json. */
function assignLeadOwner(payload: EnquiryPayload) {
  const community = (payload.community || "").toLowerCase();
  const pick = (primary: string, backup: string, reason: string) => {
    const m = member(primary);
    return {
      primaryAgent: m?.name ?? "SWK Advisory Desk",
      primaryRole: m?.role ?? "Advisory",
      backupAgent: label(backup),
      routingReason: reason,
    };
  };
  if (payload.agentSlug && member(payload.agentSlug)) {
    return pick(payload.agentSlug, "mohammad-haseeb", "Requested consultant");
  }
  if (payload.language === "fr") return pick("issaadi-chahrazed", "mohammad-haseeb", "Francophone desk");
  if (payload.context === "renting-out" || community.includes("marina")) {
    return pick("fareed-choudhary", "talha-shabbir", "Leasing & secondary desk");
  }
  if (community.includes("hills") || community.includes("jvc")) {
    return pick("talha-shabbir", "issaadi-chahrazed", "Villa & townhouse desk");
  }
  return pick("mohammad-haseeb", "mohammed-islam", "Principal advisory desk");
}

function readEnv(): LeadEnv {
  try {
    return getCloudflareContext().env as unknown as LeadEnv;
  } catch {
    // `next dev` without the Cloudflare dev shim: fall back to process env (no R2).
    return process.env as unknown as LeadEnv;
  }
}

function leadEmailHtml(lead: Record<string, unknown>) {
  const esc = (v: unknown) =>
    String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
  return `<h2>New enquiry ${esc(lead.enquiryId)}</h2><pre style="font:13px/1.5 monospace;white-space:pre-wrap">${esc(
    JSON.stringify(lead, null, 2)
  )}</pre>`;
}

async function deliver(lead: Record<string, unknown> & { enquiryId: string }, env: LeadEnv) {
  const jobs: Promise<string>[] = [];

  if (env.LEAD_WEBHOOK_URL) {
    jobs.push(
      fetch(env.LEAD_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(env.LEAD_WEBHOOK_SECRET ? { authorization: `Bearer ${env.LEAD_WEBHOOK_SECRET}` } : {}),
        },
        body: JSON.stringify(lead),
      }).then((r) => {
        if (!r.ok) throw new Error(`webhook ${r.status}`);
        return "webhook";
      })
    );
  }

  if (env.RESEND_API_KEY) {
    const contact = lead.contact as { name: string; email: string };
    jobs.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${env.RESEND_API_KEY}` },
        body: JSON.stringify({
          from: env.LEAD_EMAIL_FROM || `SWK Website <leads@${SITE.domain}>`,
          to: (env.LEAD_EMAIL_TO || SITE.email).split(",").map((s) => s.trim()),
          reply_to: contact.email,
          subject: `New enquiry ${lead.enquiryId} — ${contact.name}`,
          html: leadEmailHtml(lead),
        }),
      }).then((r) => {
        if (!r.ok) throw new Error(`resend ${r.status}`);
        return "email";
      })
    );
  }

  if (env.MEDIA?.put) {
    const d = new Date();
    const key = `leads/${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, "0")}/${lead.enquiryId}.json`;
    jobs.push(
      env.MEDIA.put(key, JSON.stringify(lead, null, 2), { httpMetadata: { contentType: "application/json" } }).then(
        () => "r2"
      )
    );
  }

  const results = await Promise.allSettled(jobs);
  const delivered = results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
  results.forEach((r) => r.status === "rejected" && console.error("lead delivery failed", lead.enquiryId, r.reason));
  return delivered;
}

export async function POST(req: NextRequest) {
  let body: EnquiryPayload;
  try {
    body = (await req.json()) as EnquiryPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // 1. Honeypot: pretend success so bots learn nothing.
  if (clip(body.companyWebsite)) {
    return NextResponse.json({ ok: true, enquiryId: "SWK-FILTERED", status: "accepted" }, { status: 200 });
  }

  const name = clip(body.name, 120);
  const phone = clip(body.phone, 40);
  const email = clip(body.email, 200);

  if (name.length < 2) {
    return NextResponse.json({ ok: false, error: "Please enter your full name." }, { status: 400 });
  }
  if (phone.replace(/[^\d+]/g, "").length < 7) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid international phone or WhatsApp number." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  // 2. Duplicate protection within a 45 s window (per isolate).
  const now = Date.now();
  for (const [k, v] of recentSubmissions) if (now - v.at > DEDUPE_WINDOW_MS) recentSubmissions.delete(k);
  const dedupeKey = `${email.toLowerCase()}|${phone.replace(/\D/g, "")}|${body.context || "general"}`;
  const previous = recentSubmissions.get(dedupeKey);
  if (previous && !body.qualification) {
    return NextResponse.json(
      {
        ok: true,
        duplicate: true,
        enquiryId: previous.enquiryId,
        message: "Your enquiry has already been logged. Our specialist is reviewing it now.",
      },
      { status: 200 }
    );
  }

  // 3. Routing and record.
  const routing = assignLeadOwner(body);
  const enquiryId = `SWK-ENQ-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const submittedAtGst = `${new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dubai",
  }).format(new Date())} GST`;

  const lead = {
    enquiryId,
    submittedAtIso: new Date().toISOString(),
    submittedAtGst,
    status: body.qualification ? "Qualified" : "New",
    context: clip(body.context, 60) || "general",
    contact: {
      name,
      phone: `${clip(body.countryCode, 6) || "+971"} ${phone}`,
      email,
      preferredContact: clip(body.preferredContact, 30) || "WhatsApp",
    },
    message: clip(body.message, 4000),
    propertyContext: {
      propertyRef: clip(body.propertyRef, 60) || "N/A",
      propertyTitle: clip(body.propertyTitle, 200) || "General Advisory",
      community: clip(body.community, 120) || "Dubai",
      developer: clip(body.developer, 120) || "All",
    },
    viewingSlot: body.viewingDate
      ? {
          date: clip(body.viewingDate, 20),
          timeGst: clip(body.viewingTimeGst, 20) || "11:00 GST",
          mode: clip(body.viewingMode, 60) || "In-person viewing (Dubai)",
        }
      : null,
    qualification: body.qualification ?? null,
    consent: {
      enquiryProcessing: true,
      marketingOptIn: Boolean(body.marketingConsent),
      privacyPolicyVersion: "UAE-PDPL-2026.11",
    },
    attribution: body.attribution ?? {},
    pageUrl: clip(body.pageUrl, 500),
    language: clip(body.language, 5) || "en",
    userAgent: clip(req.headers.get("user-agent"), 300),
    routing,
  };

  const delivered = await deliver(lead, readEnv());
  if (delivered.length === 0) {
    console.error("lead not delivered: no channel configured or all failed", enquiryId);
    return NextResponse.json(
      {
        ok: false,
        error: `We could not log your enquiry right now. Please message us on WhatsApp at ${SITE.phoneDisplay} or email ${SITE.email}.`,
      },
      { status: 502 }
    );
  }
  recentSubmissions.set(dedupeKey, { at: now, enquiryId });

  return NextResponse.json({ ok: true, enquiryId, submittedAtGst, routing }, { status: 200 });
}
