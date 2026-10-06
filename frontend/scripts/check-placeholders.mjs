// Fails the production build while any TODO_ placeholder remains in content files.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const warnOnly = process.argv.includes("--warn");
const root = fileURLToPath(new URL("../src/data", import.meta.url));
const hits = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(ts|tsx|md|mdx)$/.test(name)) {
      readFileSync(p, "utf8").split("\n").forEach((line, i) => {
        if (/TODO_/.test(line) && !/^\s*\/\//.test(line)) hits.push(`${p.replace(root, "src/data")}:${i + 1}`);
      });
    }
  }
}
walk(root);

if (hits.length === 0) {
  console.log("OK: no TODO_ placeholders left in src/data");
} else {
  console.log(`${hits.length} TODO_ placeholder line(s) remain:`);
  hits.slice(0, 30).forEach((h) => console.log("  " + h));
  if (hits.length > 30) console.log(`  ...and ${hits.length - 30} more`);
  if (!warnOnly) {
    console.error("\nProduction build blocked. Replace the placeholders, or use `npm run build:draft` for a preview build.");
    process.exit(1);
  }
}
