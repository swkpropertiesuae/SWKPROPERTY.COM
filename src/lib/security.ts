/**
 * Zero-Trust Defense-in-Depth Security Engine for SWK Properties (RERA ORN 51517).
 *
 * Pure Web Standards (no Node-only APIs) — runs identically across Cloudflare Workers,
 * Next.js 16 Proxy (Edge / Node), and API Route Handlers.
 *
 * Defends against:
 *  - Volumetric floods & credential/form stuffing (multi-tier bounded LRU IP + /24 subnet + global breaker + exponential penalty)
 *  - Arbitrary file uploads & MIME smuggling (strict method & Content-Type enforcement)
 *  - SQLi, XSS, SSTI, JNDI/Log4Shell, LFI, Command Injection, SSRF & automated scanner probes
 *  - Path traversal & open redirects
 *  - OOM JSON payload bombs (streaming byte-cap reader + nesting depth & key limits)
 *  - Prototype pollution (__proto__, constructor, prototype stripping)
 *  - CSRF (strict Origin / Referer / Sec-Fetch-Site validation)
 *  - Email / CRLF / Unicode bidi header injection
 */

export const ALLOWED_ORIGINS = new Set<string>([
  "https://www.swkpropertiesuae.com",
  "https://swkpropertiesuae.com",
]);

export const SAFE_SLUG_RE = /^[a-z0-9][a-z0-9-]{0,140}$/i;

export const ALLOWED_HTTP_METHODS = new Set<string>(["GET", "HEAD", "POST", "OPTIONS"]);

/**
 * Full defense-in-depth Content-Security-Policy.
 * Allows Next.js hydration, self-hosted next/font, Google Tag Manager / GA4 (Consent Mode v2),
 * and OpenStreetMap embeds while blocking arbitrary third-party scripts, objects, plugins, and clickjacking.
 */
export function buildCspHeader(includeUpgradeInsecure = true): string {
  const directives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com",
    "font-src 'self' data:",
    "media-src 'self' blob:",
    "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com",
    "frame-src 'self' https://www.openstreetmap.org https://maps.google.com https://www.google.com https://www.googletagmanager.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self' https://wa.me mailto:",
    "object-src 'none'",
    "worker-src 'self'",
    "manifest-src 'self'",
  ];
  if (includeUpgradeInsecure) {
    directives.push("upgrade-insecure-requests");
  }
  return directives.join("; ");
}

export const BASE_SECURITY_HEADERS: ReadonlyArray<readonly [string, string]> = [
  ["Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload"],
  ["X-Content-Type-Options", "nosniff"],
  ["X-Frame-Options", "DENY"],
  ["Referrer-Policy", "strict-origin-when-cross-origin"],
  [
    "Permissions-Policy",
    "accelerometer=(), autoplay=(self), camera=(), display-capture=(), encrypted-media=(), fullscreen=(self), geolocation=(), gyroscope=(), hid=(), interest-cohort=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), serial=(), usb=(), xr-spatial-tracking=()",
  ],
  ["Cross-Origin-Opener-Policy", "same-origin"],
  ["Cross-Origin-Resource-Policy", "same-origin"],
  ["Origin-Agent-Cluster", "?1"],
  ["X-Permitted-Cross-Domain-Policies", "none"],
  ["X-DNS-Prefetch-Control", "off"],
];

export const API_SECURITY_HEADERS: Record<string, string> = {
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Cross-Origin-Opener-Policy": "same-origin",
  "X-Permitted-Cross-Domain-Policies": "none",
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
  "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
};

export function applySecurityHeaders(headers: Headers, isProductionHttps = true): void {
  for (const [k, v] of BASE_SECURITY_HEADERS) {
    if (!headers.has(k)) headers.set(k, v);
  }
  if (!headers.has("Content-Security-Policy")) {
    headers.set("Content-Security-Policy", buildCspHeader(isProductionHttps));
  }
  headers.delete("X-Powered-By");
  headers.delete("x-powered-by");
  headers.delete("Server");
}

/* -------------------------------------------------------------------------- */
/* CLIENT IP & SUBNET EXTRACTION                                              */
/* -------------------------------------------------------------------------- */
export function getClientIp(headers: Headers): string {
  const cfIp = headers.get("cf-connecting-ip")?.trim();
  if (cfIp && cfIp.length <= 64) return cfIp;

  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp && realIp.length <= 64) return realIp;

  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first && first.length <= 64) return first;
  }
  return "unknown";
}

export function getSubnetKey(ip: string): string {
  if (!ip || ip === "unknown") return "unknown";
  // IPv4 -> /24 prefix
  const v4 = ip.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.\d{1,3}$/);
  if (v4) return `${v4[1]}.${v4[2]}.${v4[3]}.0/24`;
  // IPv6 -> /48 prefix (first 3 hextets)
  if (ip.includes(":")) {
    const parts = ip.toLowerCase().split(":").slice(0, 3);
    return `${parts.join(":")}::/48`;
  }
  return ip;
}

/* -------------------------------------------------------------------------- */
/* EDGE WAF & ANOMALY INSPECTOR                                               */
/* -------------------------------------------------------------------------- */
const SCANNER_PROBE_RE =
  /(?:^|\/)(?:\.env(?:\.|$)|\.git(?:\/|$)|\.htaccess|\.htpasswd|\.svn|\.hg|\.DS_Store|wp-admin|wp-login|wp-content|wp-includes|xmlrpc\.php|phpmyadmin|pma|adminer|cgi-bin|server-status|server-info|actuator|jmx-console|solr|vendor\/phpunit|composer\.(?:json|lock)|package-lock\.json|web\.config|etc\/passwd|proc\/self|win\.ini)|\.(?:php[0-9]?|phtml|asp|aspx|jsp|jspx|cgi|pl|bak|old|orig|sql|swp|swo|tar|gz|zip|rar|7z|sh|bat|exe|dll)$/i;

const TRAVERSAL_RE = /(?:^|[\\/])\.\.(?:[\\/]|$)|%2e%2e|%252e|%5c|\\|\0|%00/i;

const ATTACK_SIGNATURE_RE =
  /(?:<\s*\/?\s*(?:script|iframe|object|embed|svg|math|applet|meta|base)\b|javascript\s*:|vbscript\s*:|data\s*:\s*text\/html|on(?:error|load|click|mouseover|focus|blur|animationstart|toggle)\s*=|document\.(?:cookie|domain|write)|window\.location|union\s+(?:all\s+)?select\b|select\s+.{1,40}\s+from\s+information_schema|;\s*(?:drop|truncate|delete|insert|update|alter|exec|execute)\s+|waitfor\s+delay|benchmark\s*\(|pg_sleep\s*\(|sleep\s*\(\s*\d|load_file\s*\(|into\s+(?:out|dump)file|'\s*(?:or|and)\s+['"]?\w+['"]?\s*=\s*['"]?\w+|\$\{\s*jndi\s*:|\{\{\s*[^}]{0,60}(?:constructor|__proto__|7\s*\*\s*7|config|self|cycler|lipsum|popen|eval|exec|import|os\.)|\{\{\s*\d+\s*[\*\/+\-]\s*\d+\s*\}\}|<%[\s\S]{0,80}%>|(?:^|[&?])(?:__proto__|constructor\[prototype\]|prototype\[)|(?:file|gopher|dict|ldap|ldaps):\/\/|169\.254\.169\.254|metadata\.google\.internal|%0d%0a|\r|\n)/i;

const UPLOAD_CONTENT_TYPE_RE =
  /(?:multipart\/form-data|application\/octet-stream|application\/x-msdownload|application\/zip|application\/x-sh)/i;

export interface WafVerdict {
  allowed: boolean;
  status: number;
  code: string;
  reason: string;
}

function safeDecode(raw: string): string {
  let current = raw;
  for (let i = 0; i < 2; i++) {
    try {
      const next = decodeURIComponent(current);
      if (next === current) break;
      current = next;
    } catch {
      break;
    }
  }
  return current;
}

export function inspectRequestSecurity(request: Request, url: URL): WafVerdict {
  const method = request.method.toUpperCase();
  const pathname = url.pathname;
  const rawSearch = url.search;

  // 1. Strict HTTP Method allowlist
  if (!ALLOWED_HTTP_METHODS.has(method)) {
    return { allowed: false, status: 405, code: "METHOD_NOT_ALLOWED", reason: "HTTP method not permitted." };
  }

  // POST is permitted ONLY on /api/enquiries
  if (method === "POST" && pathname !== "/api/enquiries") {
    return { allowed: false, status: 405, code: "POST_NOT_ALLOWED", reason: "POST is not accepted on this endpoint." };
  }

  // 2. Request Smuggling guard: simultaneous Content-Length and Transfer-Encoding
  if (request.headers.has("content-length") && request.headers.has("transfer-encoding")) {
    return { allowed: false, status: 400, code: "SMUGGLING_ANOMALY", reason: "Malformed framing headers." };
  }

  // 3. Block arbitrary file uploads & binary bodies everywhere
  const contentType = request.headers.get("content-type") || "";
  if (UPLOAD_CONTENT_TYPE_RE.test(contentType)) {
    return { allowed: false, status: 415, code: "UPLOAD_BLOCKED", reason: "File uploads are not accepted." };
  }
  const contentDisposition = request.headers.get("content-disposition") || "";
  if (contentDisposition && /filename\s*=/i.test(contentDisposition)) {
    return { allowed: false, status: 415, code: "UPLOAD_HEADER_BLOCKED", reason: "Upload headers are not permitted." };
  }

  // 4. URL length & query-parameter flood guard
  if (pathname.length > 512 || rawSearch.length > 1536) {
    return { allowed: false, status: 414, code: "URI_TOO_LONG", reason: "Request URI exceeds maximum safe length." };
  }
  let paramCount = 0;
  const paramIter = url.searchParams.keys();
  while (!paramIter.next().done) {
    paramCount++;
    if (paramCount > 25) {
      return { allowed: false, status: 400, code: "TOO_MANY_PARAMS", reason: "Excessive query parameters." };
    }
  }

  // 5. Path traversal, null-byte & double-slash host confusion checks
  if (pathname.includes("//") || TRAVERSAL_RE.test(pathname) || TRAVERSAL_RE.test(rawSearch)) {
    return { allowed: false, status: 400, code: "PATH_TRAVERSAL_BLOCKED", reason: "Malformed path sequence." };
  }

  // 6. Scanner & secret-file probes (allow .well-known/security.txt)
  if (!pathname.startsWith("/.well-known/") && SCANNER_PROBE_RE.test(pathname)) {
    return { allowed: false, status: 403, code: "PROBE_BLOCKED", reason: "Forbidden resource." };
  }

  // 7. OWASP Attack Signatures in decoded path & query (including form-encoded '+' spaces from NextURL)
  const decodedPath = safeDecode(pathname);
  const decodedSearch = safeDecode(rawSearch);
  const decodedSearchSpaces = safeDecode(rawSearch.replace(/\+/g, " "));
  const rawReqQuery = request.url.includes("?") ? request.url.slice(request.url.indexOf("?")) : "";
  const decodedRawQuery = rawReqQuery ? safeDecode(rawReqQuery.replace(/\+/g, " ")) : "";
  if (
    ATTACK_SIGNATURE_RE.test(decodedPath) ||
    ATTACK_SIGNATURE_RE.test(decodedSearch) ||
    ATTACK_SIGNATURE_RE.test(decodedSearchSpaces) ||
    (decodedRawQuery && ATTACK_SIGNATURE_RE.test(decodedRawQuery))
  ) {
    return { allowed: false, status: 403, code: "WAF_SIGNATURE_BLOCKED", reason: "Request blocked by security policy." };
  }

  // 8. Oversized POST Content-Length check upfront (16 KiB max for JSON enquiries)
  if (method === "POST") {
    const cl = Number(request.headers.get("content-length"));
    if (Number.isFinite(cl) && cl > 16_384) {
      return { allowed: false, status: 413, code: "PAYLOAD_TOO_LARGE", reason: "Payload exceeds 16 KiB limit." };
    }
  }

  return { allowed: true, status: 200, code: "OK", reason: "OK" };
}

/* -------------------------------------------------------------------------- */
/* BOUNDED LRU MULTI-TIER RATE LIMITER + EXPONENTIAL PENALTY + BREAKER        */
/* -------------------------------------------------------------------------- */
interface RateBucket {
  count: number;
  resetAt: number;
  violations: number;
  blockedUntil: number;
}

const MAX_RATE_BUCKETS = 4096;
const rateStore = new Map<string, RateBucket>();

function lruGet(key: string): RateBucket | undefined {
  const val = rateStore.get(key);
  if (val) {
    // Refresh recency
    rateStore.delete(key);
    rateStore.set(key, val);
  }
  return val;
}

function lruSet(key: string, bucket: RateBucket): void {
  if (rateStore.has(key)) rateStore.delete(key);
  rateStore.set(key, bucket);
  while (rateStore.size > MAX_RATE_BUCKETS) {
    const oldestKey = rateStore.keys().next().value;
    if (oldestKey === undefined) break;
    rateStore.delete(oldestKey);
  }
}

export interface RateLimitPolicy {
  namespace: string;
  limit: number;
  windowMs: number;
  penaltyBaseMs?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSec: number;
}

export function checkRateLimit(key: string, policy: RateLimitPolicy): RateLimitResult {
  const now = Date.now();
  const fullKey = `${policy.namespace}:${key}`;
  const existing = lruGet(fullKey);

  // Active penalty box check
  if (existing && existing.blockedUntil > now) {
    const retryAfterSec = Math.max(1, Math.ceil((existing.blockedUntil - now) / 1000));
    return {
      allowed: false,
      limit: policy.limit,
      remaining: 0,
      resetAt: existing.blockedUntil,
      retryAfterSec,
    };
  }

  // Fresh or expired window
  if (!existing || now >= existing.resetAt) {
    const next: RateBucket = {
      count: 1,
      resetAt: now + policy.windowMs,
      violations: existing ? Math.max(0, existing.violations - 1) : 0,
      blockedUntil: 0,
    };
    lruSet(fullKey, next);
    return {
      allowed: true,
      limit: policy.limit,
      remaining: Math.max(0, policy.limit - 1),
      resetAt: next.resetAt,
      retryAfterSec: 0,
    };
  }

  // Within active window
  if (existing.count >= policy.limit) {
    const nextViolations = Math.min(existing.violations + 1, 5);
    const penaltyBase = policy.penaltyBaseMs ?? Math.min(policy.windowMs, 60_000);
    const penaltyMs = Math.min(penaltyBase * Math.pow(2, nextViolations - 1), 15 * 60_000);
    const blockedUntil = Math.max(existing.resetAt, now + penaltyMs);
    lruSet(fullKey, {
      ...existing,
      violations: nextViolations,
      blockedUntil,
    });
    return {
      allowed: false,
      limit: policy.limit,
      remaining: 0,
      resetAt: blockedUntil,
      retryAfterSec: Math.max(1, Math.ceil((blockedUntil - now) / 1000)),
    };
  }

  const updated: RateBucket = {
    ...existing,
    count: existing.count + 1,
  };
  lruSet(fullKey, updated);

  return {
    allowed: true,
    limit: policy.limit,
    remaining: Math.max(0, policy.limit - updated.count),
    resetAt: updated.resetAt,
    retryAfterSec: 0,
  };
}

export function recordSecurityStrike(ip: string): void {
  if (!ip || ip === "unknown") return;
  const now = Date.now();
  const fullKey = `waf-strike:${ip}`;
  const existing = lruGet(fullKey);
  const violations = (existing?.violations ?? 0) + 1;
  const blockedUntil = violations >= 5 ? now + Math.min(60_000 * Math.pow(2, violations - 5), 15 * 60_000) : 0;
  lruSet(fullKey, {
    count: violations,
    resetAt: now + 300_000,
    violations,
    blockedUntil,
  });
}

export function isIpPenalized(ip: string): number {
  if (!ip || ip === "unknown") return 0;
  const existing = lruGet(`waf-strike:${ip}`);
  const now = Date.now();
  if (existing && existing.blockedUntil > now) {
    return Math.max(1, Math.ceil((existing.blockedUntil - now) / 1000));
  }
  return 0;
}

/* -------------------------------------------------------------------------- */
/* CSRF / SAME-ORIGIN VALIDATION                                              */
/* -------------------------------------------------------------------------- */
function isLocalhostHost(host: string): boolean {
  return /^(?:localhost|127\.0\.0\.1)(?::\d{1,5})?$/i.test(host);
}

export function verifySameOriginRequest(request: Request, url: URL): boolean {
  const secFetchSite = request.headers.get("sec-fetch-site")?.toLowerCase().trim();
  if (secFetchSite && secFetchSite !== "same-origin" && secFetchSite !== "same-site" && secFetchSite !== "none") {
    return false;
  }

  const host = (request.headers.get("host") || url.host || "").toLowerCase();
  const allowLocal = isLocalhostHost(host);

  const origin = request.headers.get("origin")?.trim();
  if (origin) {
    if (origin === "null") return false;
    try {
      const parsed = new URL(origin);
      const normalized = `${parsed.protocol}//${parsed.host.toLowerCase()}`;
      if (ALLOWED_ORIGINS.has(normalized)) return true;
      if (allowLocal && isLocalhostHost(parsed.host.toLowerCase())) return true;
      return false;
    } catch {
      return false;
    }
  }

  // Fallback to Referer when Origin is absent
  const referer = request.headers.get("referer")?.trim();
  if (referer) {
    try {
      const parsed = new URL(referer);
      const normalized = `${parsed.protocol}//${parsed.host.toLowerCase()}`;
      if (ALLOWED_ORIGINS.has(normalized)) return true;
      if (allowLocal && isLocalhostHost(parsed.host.toLowerCase())) return true;
      return false;
    } catch {
      return false;
    }
  }

  // Missing both Origin and Referer on browser POST: reject if Sec-Fetch-Mode indicates browser
  const fetchMode = request.headers.get("sec-fetch-mode")?.toLowerCase().trim();
  if (fetchMode && fetchMode !== "same-origin") {
    return false;
  }

  // Allow non-browser same-host POST only in local testing; in production browsers always send Origin
  return allowLocal;
}

/* -------------------------------------------------------------------------- */
/* STREAMING BOUNDED JSON BODY READER & PROTOTYPE POLLUTION SHIELD            */
/* -------------------------------------------------------------------------- */
const FORBIDDEN_KEYS = new Set(["__proto__", "constructor", "prototype"]);

function sanitizeJsonValue(value: unknown, depth: number, keyBudget: { remaining: number }): unknown {
  if (depth > 5) throw new Error("JSON_TOO_DEEP");
  if (value === null || typeof value === "boolean" || typeof value === "number") {
    if (typeof value === "number" && !Number.isFinite(value)) return 0;
    return value;
  }
  if (typeof value === "string") {
    // Strip ASCII control chars (keep \t \n for messages) & Unicode Bidi override chars
    return value
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
      .replace(/[\u202A-\u202E\u2066-\u2069]/g, "");
  }
  if (Array.isArray(value)) {
    if (value.length > 30) throw new Error("JSON_ARRAY_TOO_LARGE");
    return value.map((item) => sanitizeJsonValue(item, depth + 1, keyBudget));
  }
  if (typeof value === "object") {
    const out: Record<string, unknown> = Object.create(null);
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (FORBIDDEN_KEYS.has(k)) continue;
      keyBudget.remaining--;
      if (keyBudget.remaining < 0) throw new Error("JSON_TOO_MANY_KEYS");
      out[k] = sanitizeJsonValue(v, depth + 1, keyBudget);
    }
    return out;
  }
  return undefined;
}

export async function readJsonBodyBounded<T = Record<string, unknown>>(
  request: Request,
  maxBytes = 16_384
): Promise<{ ok: true; data: T } | { ok: false; status: number; error: string }> {
  const cl = Number(request.headers.get("content-length"));
  if (Number.isFinite(cl) && cl > maxBytes) {
    return { ok: false, status: 413, error: "Request body is too large." };
  }

  const reader = request.body?.getReader();
  if (!reader) {
    return { ok: false, status: 400, error: "Empty request body." };
  }

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        totalBytes += value.byteLength;
        if (totalBytes > maxBytes) {
          await reader.cancel().catch(() => {});
          return { ok: false, status: 413, error: "Request body exceeds maximum permitted size." };
        }
        chunks.push(value);
      }
    }
  } catch {
    return { ok: false, status: 400, error: "Unable to read request body." };
  }

  if (totalBytes === 0) {
    return { ok: false, status: 400, error: "Empty request body." };
  }

  const merged = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }

  let parsed: unknown;
  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(merged);
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, status: 400, error: "Malformed JSON payload." };
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { ok: false, status: 400, error: "JSON payload must be an object." };
  }

  try {
    const clean = sanitizeJsonValue(parsed, 0, { remaining: 80 }) as T;
    return { ok: true, data: clean };
  } catch {
    return { ok: false, status: 400, error: "JSON payload structure rejected." };
  }
}

/* -------------------------------------------------------------------------- */
/* OUTBOUND SSRF GUARD & HMAC SIGNING                                         */
/* -------------------------------------------------------------------------- */
const PRIVATE_IPV4_RE =
  /^(?:127\.|10\.|0\.|169\.254\.|192\.168\.|100\.(?:6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.|172\.(?:1[6-9]|2\d|3[01])\.)/;

export function isSafeOutboundWebhookUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== "https:") return false;
    if (parsed.username || parsed.password) return false;

    const host = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, "");
    if (!host) return false;
    if (
      host === "localhost" ||
      host.endsWith(".localhost") ||
      host.endsWith(".local") ||
      host.endsWith(".internal") ||
      host === "metadata.google.internal" ||
      host === "metadata"
    ) {
      return false;
    }
    if (PRIVATE_IPV4_RE.test(host)) return false;
    if (
      host === "::1" ||
      host === "::" ||
      host.startsWith("fc") ||
      host.startsWith("fd") ||
      host.startsWith("fe80") ||
      host.startsWith("::ffff:")
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function signHmacSha256Hex(secret: string, payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/* -------------------------------------------------------------------------- */
/* INPUT & HEADER SANITIZATION HELPERS                                        */
/* -------------------------------------------------------------------------- */
export function sanitizeSingleLine(value: unknown, maxLen = 200): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, maxLen);
}

export function sanitizeMultiline(value: unknown, maxLen = 4000): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/\r\n?/g, "\n")
    .trim()
    .slice(0, maxLen);
}

export function sanitizePageUrl(value: unknown): string {
  const raw = sanitizeSingleLine(value, 500);
  if (!raw) return "";
  if (raw.startsWith("/") && !raw.startsWith("//")) return raw;
  try {
    const u = new URL(raw);
    if (ALLOWED_ORIGINS.has(`${u.protocol}//${u.host.toLowerCase()}`)) {
      return `${u.pathname}${u.search}`.slice(0, 500);
    }
  } catch {
    // ignore invalid URL
  }
  return "";
}

export function normalizeInternationalPhone(countryCodeRaw: unknown, phoneRaw: unknown): { valid: boolean; formatted: string; digits: string } {
  const cc = sanitizeSingleLine(countryCodeRaw, 8).replace(/[^\d+]/g, "");
  const phone = sanitizeSingleLine(phoneRaw, 40);
  const phoneDigits = phone.replace(/\D/g, "");

  if (phoneDigits.length < 7 || phoneDigits.length > 15) {
    return { valid: false, formatted: "", digits: phoneDigits };
  }

  // If user already included international '+' or '00' prefix, avoid duplicating countryCode (fixes double +971 +971)
  if (phone.startsWith("+") || phone.startsWith("00")) {
    const cleanE164 = `+${phoneDigits}`;
    return { valid: phoneDigits.length >= 8 && phoneDigits.length <= 15, formatted: cleanE164, digits: phoneDigits };
  }

  const ccDigits = cc.replace(/\D/g, "") || "971";
  // If local phone already starts with country code (e.g. 971564330448)
  if (phoneDigits.startsWith(ccDigits) && phoneDigits.length >= ccDigits.length + 7) {
    return { valid: phoneDigits.length <= 15, formatted: `+${phoneDigits}`, digits: phoneDigits };
  }

  const trimmedLocal = phoneDigits.replace(/^0+/, "");
  const combinedDigits = `${ccDigits}${trimmedLocal}`;
  return {
    valid: combinedDigits.length >= 8 && combinedDigits.length <= 15,
    formatted: `+${ccDigits} ${trimmedLocal}`,
    digits: combinedDigits,
  };
}

export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  if (/[\r\n,;]/.test(email)) return false;
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(
    email
  );
}
