import { NextRequest, NextResponse } from "next/server";
import {
  API_SECURITY_HEADERS,
  applySecurityHeaders,
  checkRateLimit,
  getClientIp,
  getSubnetKey,
  inspectRequestSecurity,
  isIpPenalized,
  recordSecurityStrike,
} from "@/lib/security";

/**
 * Next.js 16 Edge/Node Security Proxy (runs on Vercel, Node `next start`, and inside OpenNext).
 *
 * Enforces zero-trust WAF inspection, upload blocking, HTTP method allowlisting,
 * multi-tier IP + /24 subnet rate limiting with exponential backoff, and military-grade
 * HTTP security headers on every response.
 */
export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;
  const ip = getClientIp(request.headers);
  const subnet = getSubnetKey(ip);
  const isApi = pathname.startsWith("/api/");
  const isHttps =
    url.protocol === "https:" ||
    request.headers.get("x-forwarded-proto") === "https";

  // 1. Penalty box check for repeat attackers
  const penaltySec = isIpPenalized(ip);
  if (penaltySec > 0) {
    return NextResponse.json(
      { ok: false, error: "Temporarily blocked due to repeated security violations." },
      {
        status: 429,
        headers: {
          ...API_SECURITY_HEADERS,
          "Retry-After": String(penaltySec),
        },
      }
    );
  }

  // 2. WAF inspection (methods, uploads, smuggling, scanner probes, traversal, SQLi/XSS/JNDI/SSRF)
  const waf = inspectRequestSecurity(request, url);
  if (!waf.allowed) {
    if (waf.status === 403 || waf.status === 400 || waf.status === 415) {
      recordSecurityStrike(ip);
    }
    const headers: Record<string, string> = {
      ...API_SECURITY_HEADERS,
      ...(waf.status === 405 ? { Allow: isApi ? "POST, OPTIONS" : "GET, HEAD" } : {}),
    };
    return NextResponse.json(
      { ok: false, error: waf.reason, code: waf.code },
      { status: waf.status, headers }
    );
  }

  // 3. Multi-tier rate limiting (skip static build chunks / images to protect UX during parallel asset load)
  const isStaticAsset =
    pathname.startsWith("/_next/static/") ||
    pathname.startsWith("/img/") ||
    pathname.startsWith("/brand/") ||
    pathname === "/favicon.ico";

  if (!isStaticAsset) {
    if (isApi && request.method === "POST") {
      // Strict API POST limits: 6/min per IP, 20/min per /24 subnet, 120/min global isolate breaker
      const ipLimit = checkRateLimit(ip, { namespace: "proxy-api-ip", limit: 6, windowMs: 60_000, penaltyBaseMs: 60_000 });
      const subLimit = checkRateLimit(subnet, { namespace: "proxy-api-sub", limit: 20, windowMs: 60_000, penaltyBaseMs: 60_000 });
      const globalLimit = checkRateLimit("global", { namespace: "proxy-api-global", limit: 120, windowMs: 60_000, penaltyBaseMs: 30_000 });

      const blocked = !ipLimit.allowed ? ipLimit : !subLimit.allowed ? subLimit : !globalLimit.allowed ? globalLimit : null;
      if (blocked) {
        return NextResponse.json(
          { ok: false, error: "Too many requests. Please wait a moment before trying again." },
          {
            status: 429,
            headers: {
              ...API_SECURITY_HEADERS,
              "Retry-After": String(blocked.retryAfterSec),
              "X-RateLimit-Limit": String(blocked.limit),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": String(Math.ceil(blocked.resetAt / 1000)),
            },
          }
        );
      }
    } else {
      // Page burst & sustained limits: 60 req/10s per IP, 240 req/60s per IP, 600 req/60s per /24 subnet
      const burst = checkRateLimit(ip, { namespace: "proxy-page-burst", limit: 60, windowMs: 10_000, penaltyBaseMs: 30_000 });
      const sustained = checkRateLimit(ip, { namespace: "proxy-page-sustained", limit: 240, windowMs: 60_000, penaltyBaseMs: 60_000 });
      const sub = checkRateLimit(subnet, { namespace: "proxy-page-sub", limit: 600, windowMs: 60_000, penaltyBaseMs: 60_000 });

      const blocked = !burst.allowed ? burst : !sustained.allowed ? sustained : !sub.allowed ? sub : null;
      if (blocked) {
        return new NextResponse("Too Many Requests", {
          status: 429,
          headers: {
            ...API_SECURITY_HEADERS,
            "Content-Type": "text/plain; charset=utf-8",
            "Retry-After": String(blocked.retryAfterSec),
            "X-RateLimit-Limit": String(blocked.limit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(blocked.resetAt / 1000)),
          },
        });
      }
    }
  }

  const response = NextResponse.next();
  applySecurityHeaders(response.headers, isHttps);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static/|_next/image/).*)",
  ],
};
