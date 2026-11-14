import type { MetadataRoute } from "next"
import { SITE } from "@/lib/swk"

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: `${SITE.name} — Dubai Real Estate`,
    short_name: SITE.name,
    description:
      "RERA-licensed Dubai real estate brokerage (ORN 51517): off-plan launches, ready homes, leasing and property management across the UAE.",
    start_url: "/?utm_source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0b0c0f",
    theme_color: "#0c0a07",
    lang: "en-AE",
    dir: "ltr",
    categories: ["business", "lifestyle", "finance"],
    icons: [
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/favicon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/favicon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/app-icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/app-icon-1024.png", sizes: "1024x1024", type: "image/png", purpose: "any" },
      { src: "/app-icon-1024.png", sizes: "1024x1024", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Off-plan projects", url: "/off-plan" },
      { name: "Properties for sale", url: "/buy" },
      { name: "Properties for rent", url: "/rent" },
      { name: "Contact SWK", url: "/contact" },
    ],
  }
}
