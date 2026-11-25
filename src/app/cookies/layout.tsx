import { buildMeta, breadcrumbLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata = buildMeta({
  title: "Cookie Policy & Settings",
  description:
    "How SWK Properties uses essential, preference and analytics cookies under the UAE Personal Data Protection Law, and how to change your consent at any time.",
  path: "/cookies",
});

export default function CookiesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Cookie Settings", path: "/cookies" },
        ])}
      />
      {children}
    </>
  );
}
