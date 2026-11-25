// Military-grade Edge WAF, Rate Limiter, Safe Redirects & Media Gateway in front of OpenNext.
import nextWorker from "../.open-next/worker.js";
export * from "../.open-next/worker.js";

const CANONICAL_ORIGIN = "https://www.swkpropertiesuae.com";

const RETIRED_LISTINGS = new Set([
  "river-cove-residences", "raw-district-2", "golf-fields", "villa-sanctuary", "hills-grove-townhouse",
  "islands-2", "rise-by-athlon", "arabian-ranches-courtyard-villa", "marina-sky-penthouse",
  "creek-harbour-waterside-townhouse", "business-bay-executive-tower", "hills-estate-golf-mansion",
  "jvc-boulevard-residences", "palm-garden-homes",
]);

// Strictly allowlisted slug pattern — eliminates open redirects & path traversal in legacy redirects.
const SAFE_SLUG_RE = /^[a-z0-9][a-z0-9-]{0,140}$/i;

// Single bounded byte-range parser — blocks multi-range Range-Bomb DoS attacks on R2 video streaming.
const SINGLE_RANGE_RE = /^bytes=(\d{1,12})-(\d{0,12})$/;
const MAX_VIDEO_CHUNK_BYTES = 8 * 1024 * 1024; // 8 MiB max single range slice

// Large hero films live in R2 (binding MEDIA) and are served with strict bounded byte-range support.
const MEDIA_PATH = /^\/assets\/video\/(hero-swk-[a-z0-9-]{1,64}\.mp4)$/;

const ALLOWED_METHODS = new Set(["GET", "HEAD", "POST", "OPTIONS"]);

const SCANNER_PROBE_RE =
  /(?:^|\/)(?:\.env(?:\.|$)|\.git(?:\/|$)|\.htaccess|\.htpasswd|\.svn|\.hg|\.DS_Store|wp-admin|wp-login|wp-content|wp-includes|xmlrpc\.php|phpmyadmin|pma|adminer|cgi-bin|server-status|server-info|actuator|jmx-console|solr|vendor\/phpunit|composer\.(?:json|lock)|package-lock\.json|web\.config|etc\/passwd|proc\/self|win\.ini)|\.(?:php[0-9]?|phtml|asp|aspx|jsp|jspx|cgi|pl|bak|old|orig|sql|swp|swo|tar|gz|zip|rar|7z|sh|bat|exe|dll)$/i;

const TRAVERSAL_RE = /(?:^|[\\/])\.\.(?:[\\/]|$)|%2e%2e|%252e|%5c|\\|\0|%00/i;

const ATTACK_SIGNATURE_RE =
  /(?:<\s*\/?\s*(?:script|iframe|object|embed|svg|math|applet|meta|base)\b|javascript\s*:|vbscript\s*:|data\s*:\s*text\/html|on(?:error|load|click|mouseover|focus|blur|animationstart|toggle)\s*=|document\.(?:cookie|domain|write)|window\.location|union\s+(?:all\s+)?select\b|select\s+.{1,40}\s+from\s+information_schema|;\s*(?:drop|truncate|delete|insert|update|alter|exec|execute)\s+|waitfor\s+delay|benchmark\s*\(|pg_sleep\s*\(|sleep\s*\(\s*\d|load_file\s*\(|into\s+(?:out|dump)file|'\s*(?:or|and)\s+['"]?\w+['"]?\s*=\s*['"]?\w+|\$\{\s*jndi\s*:|\{\{\s*[^}]{0,60}(?:constructor|__proto__|7\s*\*\s*7|config|self|cycler|lipsum|popen|eval|exec|import|os\.)|\{\{\s*\d+\s*[\*\/+\-]\s*\d+\s*\}\}|<%[\s\S]{0,80}%>|(?:^|[&?])(?:__proto__|constructor\[prototype\]|prototype\[)|(?:file|gopher|dict|ldap|ldaps):\/\/|169\.254\.169\.254|metadata\.google\.internal|%0d%0a|\r|\n)/i;

const UPLOAD_CONTENT_TYPE_RE =
  /(?:multipart\/form-data|application\/octet-stream|application\/x-msdownload|application\/zip|application\/x-sh)/i;

const CSP_HEADER = [
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
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
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
  ["Content-Security-Policy", CSP_HEADER],
];

function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  for (const [k, v] of SECURITY_HEADERS) {
    if (!headers.has(k)) headers.set(k, v);
  }
  headers.delete("x-powered-by");
  headers.delete("server");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function blockResponse(status, message, extraHeaders = {}) {
  return new Response(JSON.stringify({ ok: false, error: message }), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
      "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "no-referrer",
      "Cross-Origin-Resource-Policy": "same-origin",
      "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
      ...extraHeaders,
    },
  });
}

function safeDecode(raw) {
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

function safeRedirect(cleanPath) {
  // Always construct against immutable CANONICAL_ORIGIN with guaranteed single leading slash
  const safePath = cleanPath.startsWith("/") && !cleanPath.startsWith("//") ? cleanPath : "/";
  const target = new URL(safePath, CANONICAL_ORIGIN);
  if (target.origin !== CANONICAL_ORIGIN) {
    return new Response(null, {
      status: 301,
      headers: {
        Location: `${CANONICAL_ORIGIN}/`,
        "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }
  return new Response(null, {
    status: 301,
    headers: {
      Location: target.toString(),
      "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

async function serveMedia(request, env, key) {
  const head = request.method === "HEAD";
  const rangeHeader = request.headers.get("range");

  if (head) {
    const object = await env.MEDIA.head(key);
    if (!object) return blockResponse(404, "Not found");
    return withSecurityHeaders(
      new Response(null, {
        status: 200,
        headers: {
          "content-type": "video/mp4",
          "accept-ranges": "bytes",
          "cache-control": "public, max-age=604800, immutable",
          etag: object.httpEtag,
          "content-length": String(object.size),
        },
      })
    );
  }

  let r2Range;
  let requestedStart = 0;
  let requestedEnd = null;

  if (rangeHeader) {
    const match = rangeHeader.trim().match(SINGLE_RANGE_RE);
    if (!match) {
      return withSecurityHeaders(
        new Response("Range Not Satisfiable", {
          status: 416,
          headers: { "content-type": "text/plain; charset=utf-8" },
        })
      );
    }
    requestedStart = Number(match[1]);
    requestedEnd = match[2] ? Number(match[2]) : null;
    if (!Number.isSafeInteger(requestedStart) || (requestedEnd !== null && (!Number.isSafeInteger(requestedEnd) || requestedEnd < requestedStart))) {
      return withSecurityHeaders(
        new Response("Range Not Satisfiable", {
          status: 416,
          headers: { "content-type": "text/plain; charset=utf-8" },
        })
      );
    }
    const clampedLen =
      requestedEnd !== null
        ? Math.min(requestedEnd - requestedStart + 1, MAX_VIDEO_CHUNK_BYTES)
        : MAX_VIDEO_CHUNK_BYTES;
    r2Range = { offset: requestedStart, length: clampedLen };
  }

  const object = await env.MEDIA.get(key, r2Range ? { range: r2Range } : undefined);
  if (!object) return blockResponse(404, "Not found");

  if (rangeHeader && requestedStart >= object.size) {
    return withSecurityHeaders(
      new Response("Range Not Satisfiable", {
        status: 416,
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "content-range": `bytes */${object.size}`,
        },
      })
    );
  }

  const headers = new Headers({
    "content-type": "video/mp4",
    "accept-ranges": "bytes",
    "cache-control": "public, max-age=604800, immutable",
    etag: object.httpEtag,
  });

  let status = 200;
  let length = object.size;

  if (r2Range && object.range) {
    const offset = object.range.offset ?? requestedStart;
    const len = Math.min(object.range.length ?? object.size - offset, object.size - offset);
    headers.set("content-range", `bytes ${offset}-${offset + len - 1}/${object.size}`);
    length = len;
    status = 206;
  }

  headers.set("content-length", String(length));
  return withSecurityHeaders(new Response(object.body, { status, headers }));
}

const worker = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname, search } = url;
    const method = request.method.toUpperCase();

    // 0. Edge WAF — runs BEFORE redirects, R2, or Next.js CPU
    if (!ALLOWED_METHODS.has(method)) {
      return blockResponse(405, "HTTP method not permitted.", { Allow: "GET, HEAD, POST, OPTIONS" });
    }
    if (method === "POST" && pathname !== "/api/enquiries") {
      return blockResponse(405, "POST is not permitted on this endpoint.", { Allow: "GET, HEAD" });
    }
    if (request.headers.has("content-length") && request.headers.has("transfer-encoding")) {
      return blockResponse(400, "Malformed framing headers.");
    }
    const contentType = request.headers.get("content-type") || "";
    if (UPLOAD_CONTENT_TYPE_RE.test(contentType)) {
      return blockResponse(415, "File uploads are not accepted.");
    }
    const contentDisposition = request.headers.get("content-disposition") || "";
    if (contentDisposition && /filename\s*=/i.test(contentDisposition)) {
      return blockResponse(415, "Upload headers are not permitted.");
    }
    if (pathname.length > 512 || search.length > 1536) {
      return blockResponse(414, "Request URI exceeds safe length.");
    }
    if (pathname.includes("//") || TRAVERSAL_RE.test(pathname) || TRAVERSAL_RE.test(search)) {
      return blockResponse(400, "Malformed path sequence.");
    }
    if (!pathname.startsWith("/.well-known/") && SCANNER_PROBE_RE.test(pathname)) {
      return blockResponse(403, "Forbidden resource.");
    }
    const decodedPath = safeDecode(pathname);
    const decodedSearch = safeDecode(search);
    const decodedSearchSpaces = safeDecode(search.replace(/\+/g, " "));
    if (
      ATTACK_SIGNATURE_RE.test(decodedPath) ||
      ATTACK_SIGNATURE_RE.test(decodedSearch) ||
      ATTACK_SIGNATURE_RE.test(decodedSearchSpaces)
    ) {
      return blockResponse(403, "Request blocked by edge security policy.");
    }

    // 0b. Native Cloudflare Edge Rate Limiters (PoP-wide volumetric protection)
    const clientIp = request.headers.get("cf-connecting-ip") || "unknown";
    const isApiPost = pathname === "/api/enquiries" && method === "POST";
    if (isApiPost && env.API_ENQUIRY_LIMITER?.limit) {
      const { success } = await env.API_ENQUIRY_LIMITER.limit({ key: `api:${clientIp}` });
      if (!success) {
        return blockResponse(429, "Too many enquiries submitted. Please wait 60 seconds.", { "Retry-After": "60" });
      }
    } else if (!pathname.startsWith("/_next/static/") && !pathname.startsWith("/img/") && !pathname.startsWith("/brand/")) {
      if (env.EDGE_BURST_LIMITER?.limit) {
        const { success } = await env.EDGE_BURST_LIMITER.limit({ key: `burst:${clientIp}` });
        if (!success) {
          return blockResponse(429, "Request rate exceeded. Please slow down.", { "Retry-After": "10" });
        }
      }
      if (env.EDGE_SUSTAINED_LIMITER?.limit) {
        const { success } = await env.EDGE_SUSTAINED_LIMITER.limit({ key: `sustained:${clientIp}` });
        if (!success) {
          return blockResponse(429, "Sustained rate limit exceeded. Please try again shortly.", { "Retry-After": "60" });
        }
      }
    }

    const trimmed = pathname.replace(/\/$/, "");

    // 1. Canonical domain enforcement: 301 redirect apex (non-www) to www.swkpropertiesuae.com
    if (url.hostname === "swkpropertiesuae.com") {
      return safeRedirect(`${pathname}${search}`);
    }

    // 2. Bounded R2 video media streaming
    const media = pathname.match(MEDIA_PATH);
    if (media && env.MEDIA && (method === "GET" || method === "HEAD")) {
      return serveMedia(request, env, media[1]);
    }

    // 3. Legacy .html and route redirects -> exact clean canonical URLs (allowlisted slugs only)
    if (pathname === "/property-details.html") return safeRedirect("/properties");
    if (pathname === "/index.html") return safeRedirect("/");
    if (pathname === "/mortgage.html" || trimmed === "/mortgage") return safeRedirect("/calculators");
    if (pathname === "/blog.html" || trimmed === "/blog") return safeRedirect("/insights");

    const page = pathname.match(/^\/(properties|about|services|contact)\.html$/);
    if (page) return safeRedirect(`/${page[1]}`);

    if (pathname === "/blog-post.html") {
      const slug = url.searchParams.get("slug")?.trim() ?? "";
      if (slug && SAFE_SLUG_RE.test(slug)) return safeRedirect(`/insights/${slug}`);
      return safeRedirect("/insights");
    }

    const listing = trimmed.match(/^\/properties\/([^/]+)$/);
    if (listing && RETIRED_LISTINGS.has(listing[1])) return safeRedirect("/properties");

    if (/^\/blog\/research(\/|$)/.test(pathname)) return safeRedirect("/insights");
    if (/^\/blog\/[^/]+-residential-sales$/.test(trimmed)) return safeRedirect("/insights");
    const blogPost = trimmed.match(/^\/blog\/([^/]+)$/);
    if (blogPost) {
      const slug = blogPost[1];
      return SAFE_SLUG_RE.test(slug) ? safeRedirect(`/insights/${slug}`) : safeRedirect("/insights");
    }

    const upstream = await nextWorker.fetch(request, env, ctx);
    return withSecurityHeaders(upstream);
  },
};

export default worker;
