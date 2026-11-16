import type { MetadataRoute } from "next"
import { SITE } from "@/lib/swk"

// Search and AI-answer crawlers are welcomed explicitly so the brokerage can be cited by
// Google AI Overviews, Bing Copilot, ChatGPT search, Perplexity, Claude, Gemini and Apple Intelligence.
const AI_AND_SEARCH_AGENTS = [
  "Googlebot",
  "Googlebot-Image",
  "Google-Extended",
  "Bingbot",
  "DuckDuckBot",
  "YandexBot",
  "Baiduspider",
  "Applebot",
  "Applebot-Extended",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Meta-ExternalAgent",
  "FacebookBot",
  "facebookexternalhit",
  "Twitterbot",
  "LinkedInBot",
  "WhatsApp",
  "TelegramBot",
  "Slackbot",
  "Amazonbot",
  "MistralAI-User",
  "cohere-ai",
  "CCBot",
  "YouBot",
  "Diffbot",
  "Bytespider",
  "PhindBot",
]

const PRIVATE = ["/api/", "/thank-you"]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: AI_AND_SEARCH_AGENTS, allow: "/", disallow: PRIVATE },
      { userAgent: "*", allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  }
}
