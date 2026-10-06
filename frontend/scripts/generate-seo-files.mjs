// Generates sitemap.xml and robots.txt in dist/. Needs SITE_URL (or VITE_SITE_URL) at build time.
import { readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const p = (rel) => fileURLToPath(new URL(rel, import.meta.url));
const url = (process.env.SITE_URL || process.env.VITE_SITE_URL || "").replace(/\/$/, "");
const slugs = readdirSync(p("../src/data/projects/")).filter((f) => f.endsWith(".ts") && f !== "index.ts").map((f) => f.replace(".ts", ""));

if (!url) {
  writeFileSync(p("../dist/robots.txt"), "User-agent: *\nAllow: /\n");
  console.log("No SITE_URL set: wrote robots.txt without a sitemap. Set VITE_SITE_URL=https://your-domain to generate sitemap.xml.");
} else {
  const routes = ["/", "/projects", "/demo", ...slugs.map((s) => `/projects/${s}`)];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((r) => `  <url><loc>${url}${r}</loc></url>`).join("\n")}\n</urlset>\n`;
  writeFileSync(p("../dist/sitemap.xml"), xml);
  writeFileSync(p("../dist/robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${url}/sitemap.xml\n`);
  console.log(`sitemap.xml (${routes.length} routes) and robots.txt written`);
}
