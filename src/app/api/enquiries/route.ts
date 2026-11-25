import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { SITE, team } from "@/lib/swk";
import {
  API_SECURITY_HEADERS,
  checkRateLimit,
  getClientIp,
  getSubnetKey,
  isSafeOutboundWebhookUrl,
  isValidEmail,
  normalizeInternationalPhone,
  readJsonBodyBounded,
  sanitizeMultiline,
  sanitizePageUrl,
  sanitizeSingleLine,
  signHmacSha256Hex,
  verifySameOriginRequest,
} from "@/lib/security";

/**
 * Hardened Zero-Trust Lead Intake Endpoint for SWK Properties.
 *
 * Security controls enforced on every request:
 *  - Strict HTTP method allowlist (POST + preflight OPTIONS; explicit 405 on GET/PUT/DELETE/PATCH)
 *  - Strict Content-Type: application/json (rejects multipart/form-data file uploads & text/plain CSRF)
 *  - Strict Same-Origin / Sec-Fetch-Site CSRF verification
 *  - Multi-layer rate limiting: Cloudflare native API_ENQUIRY_LIMITER + bounded LRU IP + /24 subnet + global breaker
 *  - Streaming 16 KiB body size cap + prototype-pollution key stripping + depth/key-count guard
 *  - Indistinguishable honeypot + human dwell-time validation (zero bot fingerprinting)
 *  - Bounded LRU dedupe cache (prevents memory-exhaustion leaks)
 *  - Real digit-count international phone validation + double-+971 prevention
 *  - RFC email + CRLF / header-injection stripping + Resend empty reply_to omission
 *  - Outbound SSRF protection + 8s fetch timeout + optional HMAC-SHA256 webhook signature
 */

type RateLimiterBinding = {
  limit: (opts: { key: string }) => Promise<{ success: boolean }>;
};

type LeadEnv = {
  LEAD_WEBHOOK_URL?: string;
  LEAD_WEBHOOK_SECRET?: string;
  RESEND_API_KEY?: string;
  LEAD_EMAIL_TO?: string;
  LEAD_EMAIL_FROM?: string;
  MEDIA?: { put: (key: string, value: string, options?: object) => Promise<unknown> };
  API_ENQUIRY_LIMITER?: RateLimiterBinding;
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
  attribution?: Record<string, unknown>;
  qualification?: Record<string, unknown>;
  companyWebsite?: string;
  formLoadedAt?: number;
}

const DEDUPE_WINDOW_MS = 45_000;
const MAX_DEDUPE_ENTRIES = 2000;
const MIN_HUMAN_DWELL_MS = 800;
const OUTBOUND_TIMEOUT_MS = 8_000;

const recentSubmissions = new Map<string, { at: number; enquiryId: string }>();

const ALLOWED_ATTRIBUTION_KEYS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "msclkid",
  "referrer",
  "landingPage",
]);

const ALLOWED_QUALIFICATION_KEYS = new Set([
  "budgetRange",
  "timeline",
  "financing",
  "residency",
]);

const ALLOWED_CONTEXTS = new Set([
  "general",
  "newsletter",
  "exit-intent-brief",
  "buying",
  "off-plan",
  "renting",
  "selling",
  "renting-out",
  "management",
  "mortgage",
  "commercial",
  "property",
  "advisory",
  "callback",
  "brochure",
  "hot-project",
]);

function jsonReply(body: Record<string, unknown>, status = 200, extraHeaders?: Record<string, string>) {
  return NextResponse.json(body, {
    status,
    headers: {
      ...API_SECURITY_HEADERS,
      ...(extraHeaders ?? {}),
    },
  });
}

function setDedupe(key: string, value: { at: number; enquiryId: string }) {
  if (recentSubmissions.has(key)) recentSubmissions.delete(key);
  recentSubmissions.set(key, value);
  while (recentSubmissions.size > MAX_DEDUPE_ENTRIES) {
    const oldest = recentSubmissions.keys().next().value;
    if (oldest === undefined) break;
    recentSubmissions.delete(oldest);
  }
}

function purgeExpiredDedupe(now: number) {
  for (const [k, v] of recentSubmissions) {
    if (now - v.at > DEDUPE_WINDOW_MS) recentSubmissions.delete(k);
  }
}

function sanitizeAttribution(raw: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return out;
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (!ALLOWED_ATTRIBUTION_KEYS.has(k)) continue;
    const clean = sanitizeSingleLine(v, 140);
    if (clean) out[k] = clean;
  }
  return out;
}

function sanitizeQualification(raw: unknown): Record<string, string> | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (!ALLOWED_QUALIFICATION_KEYS.has(k)) continue;
    const clean = sanitizeSingleLine(v, 80);
    if (clean) out[k] = clean;
  }
  return Object.keys(out).length > 0 ? out : null;
}

const member = (slug: string) => team.find((m) => m.slug === slug);
const label = (slug: string) => {
  const m = member(slug);
  return m ? `${m.name} (${m.role})` : "SWK Advisory Desk";
};

function assignLeadOwner(payload: EnquiryPayload) {
  const community = sanitizeSingleLine(payload.community, 120).toLowerCase();
  const pick = (primary: string, backup: string, reason: string) => {
    const m = member(primary);
    return {
      primaryAgent: m?.name ?? "SWK Advisory Desk",
      primaryRole: m?.role ?? "Advisory",
      backupAgent: label(backup),
      routingReason: reason,
    };
  };
  const requestedSlug = sanitizeSingleLine(payload.agentSlug, 60);
  if (requestedSlug && member(requestedSlug)) {
    return pick(requestedSlug, "mohammad-haseeb", "Requested consultant");
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
    return process.env as unknown as LeadEnv;
  }
}

function leadEmailHtml(lead: Record<string, unknown>) {
  const esc = (v: unknown) =>
    String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
  return `<h2>New enquiry ${esc(lead.enquiryId)}</h2><pre style="font:13px/1.5 monospace;white-space:pre-wrap">${esc(
    JSON.stringify(lead, null, 2)
  )}</pre>`;
}

function formatDubaiGstNow(): string {
  return `${new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dubai",
  }).format(new Date())} GST`;
}

function generateEnquiryId(prefix: "SWK-ENQ" | "SWK-NEWS"): string {
  return `${prefix}-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

async function deliver(lead: Record<string, unknown> & { enquiryId: string }, env: LeadEnv) {
  const jobs: Promise<string>[] = [];

  if (env.LEAD_WEBHOOK_URL) {
    if (!isSafeOutboundWebhookUrl(env.LEAD_WEBHOOK_URL)) {
      console.error("Blocked unsafe outbound LEAD_WEBHOOK_URL (SSRF protection)", lead.enquiryId);
    } else {
      const serialized = JSON.stringify(lead);
      const headers: Record<string, string> = { "content-type": "application/json" };
      if (env.LEAD_WEBHOOK_SECRET) {
        headers.authorization = `Bearer ${env.LEAD_WEBHOOK_SECRET}`;
        headers["x-swk-signature-256"] = `sha256=${await signHmacSha256Hex(env.LEAD_WEBHOOK_SECRET, serialized)}`;
      }
      jobs.push(
        fetch(env.LEAD_WEBHOOK_URL, {
          method: "POST",
          headers,
          body: serialized,
          signal: AbortSignal.timeout(OUTBOUND_TIMEOUT_MS),
        }).then((r) => {
          if (!r.ok) throw new Error(`webhook ${r.status}`);
          return "webhook";
        })
      );
    }
  }

  if (env.RESEND_API_KEY) {
    const contact = lead.contact as { name: string; email: string };
    const safeRecipients = (env.LEAD_EMAIL_TO || SITE.email)
      .split(",")
      .map((s) => s.trim())
      .filter(isValidEmail);
    const safeSubject = sanitizeSingleLine(`New enquiry ${lead.enquiryId} — ${contact.name}`, 180);

    if (safeRecipients.length > 0) {
      const resendBody: Record<string, unknown> = {
        from: env.LEAD_EMAIL_FROM || `SWK Website <leads@${SITE.domain}>`,
        to: safeRecipients,
        subject: safeSubject,
        html: leadEmailHtml(lead),
      };
      if (isValidEmail(contact.email)) {
        resendBody.reply_to = contact.email;
      }
      jobs.push(
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${env.RESEND_API_KEY}`,
          },
          body: JSON.stringify(resendBody),
          signal: AbortSignal.timeout(OUTBOUND_TIMEOUT_MS),
        }).then((r) => {
          if (!r.ok) throw new Error(`resend ${r.status}`);
          return "email";
        })
      );
    }
  }

  if (env.MEDIA?.put) {
    const d = new Date();
    const key = `leads/${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, "0")}/${lead.enquiryId}.json`;
    jobs.push(
      env.MEDIA.put(key, JSON.stringify(lead, null, 2), {
        httpMetadata: { contentType: "application/json" },
      }).then(() => "r2")
    );
  }

  const results = await Promise.allSettled(jobs);
  const delivered = results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
  results.forEach((r) => {
    if (r.status === "rejected") {
      console.error("lead delivery failed", lead.enquiryId, r.reason instanceof Error ? r.reason.message : "error");
    }
  });
  return delivered;
}

export async function POST(req: NextRequest) {
  // 1. Strict Content-Type: application/json (eliminates multipart file uploads & text/plain CSRF)
  const contentType = (req.headers.get("content-type") || "").toLowerCase();
  if (!contentType.startsWith("application/json")) {
    return jsonReply(
      { ok: false, error: "Unsupported Content-Type. Expected application/json." },
      415
    );
  }

  // 2. Strict Same-Origin / Sec-Fetch-Site CSRF check
  if (!verifySameOriginRequest(req, req.nextUrl)) {
    return jsonReply({ ok: false, error: "Cross-origin submission rejected." }, 403);
  }

  // 3. Multi-tier Rate Limiting (CF Native Binding + Bounded LRU IP + /24 Subnet + Global Circuit Breaker)
  const env = readEnv();
  const ip = getClientIp(req.headers);
  const subnet = getSubnetKey(ip);

  if (env.API_ENQUIRY_LIMITER?.limit) {
    try {
      const { success } = await env.API_ENQUIRY_LIMITER.limit({ key: `route-api:${ip}` });
      if (!success) {
        return jsonReply(
          { ok: false, error: "Too many enquiries submitted. Please wait 60 seconds or message us on WhatsApp." },
          429,
          { "Retry-After": "60" }
        );
      }
    } catch {
      // Fall through to in-memory bounded LRU limiter
    }
  }

  const ipLimit = checkRateLimit(ip, { namespace: "api-enq-ip", limit: 5, windowMs: 60_000, penaltyBaseMs: 60_000 });
  const ipSustained = checkRateLimit(ip, { namespace: "api-enq-10m", limit: 15, windowMs: 600_000, penaltyBaseMs: 300_000 });
  const subLimit = checkRateLimit(subnet, { namespace: "api-enq-sub", limit: 18, windowMs: 60_000, penaltyBaseMs: 60_000 });
  const globalBreaker = checkRateLimit("global", { namespace: "api-enq-global", limit: 100, windowMs: 60_000, penaltyBaseMs: 30_000 });

  const blocked = !ipLimit.allowed
    ? ipLimit
    : !ipSustained.allowed
      ? ipSustained
      : !subLimit.allowed
        ? subLimit
        : !globalBreaker.allowed
          ? globalBreaker
          : null;

  if (blocked) {
    return jsonReply(
      { ok: false, error: "Too many requests. Please wait a moment or contact us directly on WhatsApp." },
      429,
      {
        "Retry-After": String(blocked.retryAfterSec),
        "X-RateLimit-Limit": String(blocked.limit),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.ceil(blocked.resetAt / 1000)),
      }
    );
  }

  // 4. Streaming bounded JSON reader (16 KiB max + prototype-pollution stripped + depth guard)
  const parsed = await readJsonBodyBounded<EnquiryPayload>(req, 16_384);
  if (!parsed.ok) {
    return jsonReply({ ok: false, error: parsed.error }, parsed.status);
  }
  const body = parsed.data;

  // 5. Indistinguishable honeypot + bot dwell-time check (returns realistic ID so bots cannot fingerprint)
  const honeypotTripped = sanitizeSingleLine(body.companyWebsite, 100).length > 0;
  const loadedAt = typeof body.formLoadedAt === "number" && Number.isFinite(body.formLoadedAt) ? body.formLoadedAt : 0;
  const dwellTooFast = loadedAt > 0 && Date.now() - loadedAt < MIN_HUMAN_DWELL_MS && Date.now() >= loadedAt;

  if (honeypotTripped || dwellTooFast) {
    return jsonReply(
      {
        ok: true,
        enquiryId: generateEnquiryId("SWK-ENQ"),
        submittedAtGst: formatDubaiGstNow(),
        status: "accepted",
      },
      200
    );
  }

  const rawContext = sanitizeSingleLine(body.context, 60).toLowerCase() || "general";
  const context = ALLOWED_CONTEXTS.has(rawContext) ? rawContext : "general";
  const email = sanitizeSingleLine(body.email, 254);
  const cleanAttribution = sanitizeAttribution(body.attribution);
  const cleanQualification = sanitizeQualification(body.qualification);
  const cleanPageUrl = sanitizePageUrl(body.pageUrl);
  const userAgent = sanitizeSingleLine(req.headers.get("user-agent"), 240);

  // 6. Dedicated UAE PDPL-compliant newsletter subscription path
  if (context === "newsletter") {
    if (!isValidEmail(email)) {
      return jsonReply({ ok: false, error: "Please enter a valid email address." }, 400);
    }
    if (!body.marketingConsent) {
      return jsonReply(
        { ok: false, error: "Please confirm you wish to receive monthly Dubai property notes." },
        400
      );
    }

    const now = Date.now();
    purgeExpiredDedupe(now);
    const dedupeKey = `${email.toLowerCase()}|newsletter`;
    const previous = recentSubmissions.get(dedupeKey);
    if (previous) {
      return jsonReply(
        { ok: true, duplicate: true, enquiryId: previous.enquiryId, message: "You are already subscribed." },
        200
      );
    }

    const enquiryId = generateEnquiryId("SWK-NEWS");
    const submittedAtGst = formatDubaiGstNow();

    const lead = {
      enquiryId,
      type: "newsletter",
      submittedAtIso: new Date().toISOString(),
      submittedAtGst,
      status: "Subscribed",
      context: "newsletter",
      contact: {
        name: "Newsletter Subscriber",
        phone: "N/A",
        email,
        preferredContact: "Email",
      },
      message: "Subscribed to SWK Properties monthly Dubai market & developer launch notes.",
      consent: {
        enquiryProcessing: true,
        marketingOptIn: true,
        privacyPolicyVersion: "UAE-PDPL-2026.11",
      },
      attribution: cleanAttribution,
      pageUrl: cleanPageUrl,
      userAgent,
    };

    const delivered = await deliver(lead, env);
    if (delivered.length === 0) {
      console.error("newsletter not delivered: no channel configured or all failed", enquiryId);
      return jsonReply(
        {
          ok: false,
          error: `Unable to save your subscription right now. Please email ${SITE.email} or message us on WhatsApp at ${SITE.phoneDisplay}.`,
        },
        502
      );
    }
    setDedupe(dedupeKey, { at: now, enquiryId });
    return jsonReply({ ok: true, enquiryId, submittedAtGst }, 200);
  }

  // 7. Standard Property / Advisory Enquiry Validation
  const name = sanitizeSingleLine(body.name, 120);
  if (name.length < 2) {
    return jsonReply({ ok: false, error: "Please enter your full name." }, 400);
  }

  const normalizedPhone = normalizeInternationalPhone(body.countryCode, body.phone);
  if (!normalizedPhone.valid) {
    return jsonReply(
      { ok: false, error: "Please enter a valid international phone or WhatsApp number (at least 7 digits)." },
      400
    );
  }

  const isQuickCallback = context === "exit-intent-brief";
  if ((!isQuickCallback || email.length > 0) && !isValidEmail(email)) {
    return jsonReply({ ok: false, error: "Please enter a valid email address." }, 400);
  }

  // 8. Bounded duplicate protection within 45s window
  const now = Date.now();
  purgeExpiredDedupe(now);
  const dedupeKey = `${email.toLowerCase()}|${normalizedPhone.digits}|${context}`;
  const previous = recentSubmissions.get(dedupeKey);
  if (previous && !cleanQualification) {
    return jsonReply(
      {
        ok: true,
        duplicate: true,
        enquiryId: previous.enquiryId,
        message: "Your enquiry has already been logged. Our specialist is reviewing it now.",
      },
      200
    );
  }

  // 9. Routing and normalized record
  const routing = assignLeadOwner(body);
  const enquiryId = generateEnquiryId("SWK-ENQ");
  const submittedAtGst = formatDubaiGstNow();

  const viewingDateRaw = sanitizeSingleLine(body.viewingDate, 20);
  const validViewingDate = /^\d{4}-\d{2}-\d{2}$/.test(viewingDateRaw) ? viewingDateRaw : "";

  const lead = {
    enquiryId,
    submittedAtIso: new Date().toISOString(),
    submittedAtGst,
    status: cleanQualification ? "Qualified" : "New",
    context,
    contact: {
      name,
      phone: normalizedPhone.formatted,
      email,
      preferredContact: sanitizeSingleLine(body.preferredContact, 30) || "WhatsApp",
    },
    message: sanitizeMultiline(body.message, 4000),
    propertyContext: {
      propertyRef: sanitizeSingleLine(body.propertyRef, 60) || "N/A",
      propertyTitle: sanitizeSingleLine(body.propertyTitle, 200) || "General Advisory",
      community: sanitizeSingleLine(body.community, 120) || "Dubai",
      developer: sanitizeSingleLine(body.developer, 120) || "All",
    },
    viewingSlot: validViewingDate
      ? {
          date: validViewingDate,
          timeGst: sanitizeSingleLine(body.viewingTimeGst, 20) || "11:00 GST",
          mode: sanitizeSingleLine(body.viewingMode, 60) || "In-person viewing (Dubai)",
        }
      : null,
    qualification: cleanQualification,
    consent: {
      enquiryProcessing: true,
      marketingOptIn: Boolean(body.marketingConsent),
      privacyPolicyVersion: "UAE-PDPL-2026.11",
    },
    attribution: cleanAttribution,
    pageUrl: cleanPageUrl,
    language: sanitizeSingleLine(body.language, 5) || "en",
    userAgent,
    routing,
  };

  const delivered = await deliver(lead, env);
  if (delivered.length === 0) {
    console.error("lead not delivered: no channel configured or all failed", enquiryId);
    return jsonReply(
      {
        ok: false,
        error: `We could not log your enquiry right now. Please message us on WhatsApp at ${SITE.phoneDisplay} or email ${SITE.email}.`,
      },
      502
    );
  }
  setDedupe(dedupeKey, { at: now, enquiryId });

  return jsonReply({ ok: true, enquiryId, submittedAtGst, routing }, 200);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...API_SECURITY_HEADERS,
      Allow: "POST, OPTIONS",
    },
  });
}

function methodNotAllowed() {
  return jsonReply(
    { ok: false, error: "Method not allowed. Only POST JSON enquiries are accepted." },
    405,
    { Allow: "POST, OPTIONS" }
  );
}

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
