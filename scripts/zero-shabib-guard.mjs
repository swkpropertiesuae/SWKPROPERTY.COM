#!/usr/bin/env node
/**
 * DEAD-HARDCODED PUBLIC WEBSITE PRIVACY LOCK
 *
 * Scans every file under src/ and public/ and fails with exit code 1 if any
 * restricted owner identity string appears anywhere in the public website repo.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const TARGET_DIRS = ["src", "public"];
const TEXT_EXT = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json",
  ".md", ".txt", ".xml", ".html", ".css", ".svg", ".yml", ".yaml",
]);
const RESTRICTED = ["c2hhYmli", "c2lyYWo="].map((b) => Buffer.from(b, "base64").toString("utf8"));
const BLOCKED_PATTERN = new RegExp(`\\b(${RESTRICTED.join("|")})\\b`, "i");
const ALLOWLIST_PATHS = new Set();

const violations = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      walk(full);
      continue;
    }
    const rel = path.normalize(path.relative(ROOT, full));
    if (ALLOWLIST_PATHS.has(rel)) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (!TEXT_EXT.has(ext)) continue;
    const content = fs.readFileSync(full, "utf8");
    if (BLOCKED_PATTERN.test(content)) {
      violations.push(rel);
    }
  }
}

for (const d of TARGET_DIRS) walk(path.join(ROOT, d));

if (violations.length > 0) {
  console.error("HARD LOCK FAILED: Restricted identity reference detected in public website files:");
  for (const v of violations) console.error("  -", v);
  process.exit(1);
}

console.log("Public website privacy lock PASSED (0 violations across src/ and public/).");
