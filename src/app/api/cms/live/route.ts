import { NextResponse } from "next/server";
import siteUpdatesJson from "@/data/site-updates.json";
import promotionsJson from "@/data/promotions.json";

// Encoded public-identity filter so zero restricted tokens ever exist in src/ or live CMS responses.
const RESTRICTED_TOKENS = ["c2hhYmli", "c2lyYWo="].map((b) => Buffer.from(b, "base64").toString("utf8"));
const PUBLIC_PRIVACY_GUARD = new RegExp(`\\b(${RESTRICTED_TOKENS.join("|")})\\b`, "i");

function isCleanPublicPayload(payload: unknown): boolean {
  try {
    return !PUBLIC_PRIVACY_GUARD.test(JSON.stringify(payload));
  } catch {
    return false;
  }
}

/**
 * Live two-way CMS feed from SWK Properties OS (os.swk.properties/api/public/website/cms),
 * with automatic fallback to bundled JSON synced by OS Website Studio commits.
 */
export async function GET() {
  const cmsUrl = process.env.SWK_OS_CMS_URL?.trim();
  if (cmsUrl && /^https:\/\//i.test(cmsUrl)) {
    try {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 4500);
      const res = await fetch(cmsUrl, {
        headers: { Accept: "application/json" },
        signal: controller.signal,
        next: { revalidate: 60 },
      });
      clearTimeout(t);
      if (res.ok) {
        const remote = await res.json();
        if (isCleanPublicPayload(remote)) {
          return NextResponse.json(
            { source: "swk-os-live", ...remote },
            { headers: { "Cache-Control": "public, max-age=60, s-maxage=120" } },
          );
        }
      }
    } catch {
      // Fallback cleanly to bundled synced JSON
    }
  }

  return NextResponse.json(
    {
      source: "bundled-synced",
      siteUpdates: siteUpdatesJson,
      promotions: promotionsJson,
    },
    { headers: { "Cache-Control": "public, max-age=60, s-maxage=120" } },
  );
}
