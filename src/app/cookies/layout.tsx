import { buildMeta } from "@/lib/seo"

export const metadata = buildMeta({
  title: "Cookie Policy & Settings",
  description:
    "How SWK Properties uses essential, preference and analytics cookies under the UAE Personal Data Protection Law, and how to change your consent at any time.",
  path: "/cookies",
})

export default function CookiesLayout({ children }: { children: React.ReactNode }) {
  return children
}
