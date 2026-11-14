// Crawls a running build (default http://localhost:3000) from the sitemap and every internal link.
// Fails (exit 1) on broken links/assets, duplicate titles, missing canonicals, titles > 60 chars,
// descriptions > 175 chars or pages without exactly one <h1>.
// Usage: npm run build && npm start, then in another shell: npm run audit:seo [-- http://localhost:3000]
const base = process.argv[2] || "http://localhost:3000";
const seen = new Map(); const queue = ["/"]; const refs = new Map(); const meta = [];
const sm = await (await fetch(base + "/sitemap.xml")).text();
for (const m of sm.matchAll(/<loc>https:\/\/www\.swkpropertiesuae\.com([^<]*)<\/loc>/g)) queue.push(m[1] || "/");
const add = (u, from) => { if (!refs.has(u)) refs.set(u, new Set()); refs.get(u).add(from); };
while (queue.length) {
  const p = queue.shift(); if (seen.has(p)) continue;
  const r = await fetch(base + p, { redirect: "manual" }); seen.set(p, r.status);
  if (!(r.headers.get("content-type") || "").includes("text/html")) continue;
  const html = await r.text();
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]; const canon = html.match(/rel="canonical" href="([^"]*)"/)?.[1];
  const desc = html.match(/name="description" content="([^"]*)"/)?.[1]; const h1 = (html.match(/<h1[\s>]/g) || []).length;
  const robots = html.match(/name="robots" content="([^"]*)"/)?.[1];
  meta.push({ p, title, canon, dlen: desc?.length, h1, robots });
  for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)[^"]*"/g)) {
    const u = m[1]; if (u.startsWith("/_next")) continue; add(u, p);
    if (!/\.\w{2,5}$/.test(u) && !seen.has(u)) queue.push(u);
  }
}
const bad = [];
for (const [u, from] of refs) {
  let s = seen.get(u); if (s === undefined) { s = (await fetch(base + u, { method: "GET", redirect: "manual" })).status; seen.set(u, s); }
  if (s >= 400) bad.push([u, s, [...from].slice(0, 3)]);
}
console.log("pages", meta.length, "refs", refs.size);
console.log("BROKEN", JSON.stringify(bad, null, 1));
const titles = new Map(); for (const m of meta) titles.set(m.title, [...(titles.get(m.title) || []), m.p]);
console.log("DUP TITLES", JSON.stringify([...titles].filter(([, v]) => v.length > 1), null, 1));
const unesc = (t) => (t || "").replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');
const issues = meta.filter((m) => !m.title || !m.canon || m.h1 !== 1 || !m.dlen || m.dlen > 175 || unesc(m.title).length > 60 || !m.canon.endsWith(m.p === "/" ? "swkpropertiesuae.com" : m.p));
console.log("ISSUES", JSON.stringify(issues, null, 1));
const dups = [...titles].filter(([, v]) => v.length > 1);
if (bad.length || dups.length || issues.length) process.exit(1);
console.log("SEO audit passed");
