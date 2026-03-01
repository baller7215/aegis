#!/usr/bin/env node
/**
 * injects API_BASE_URL from .env into background.js and outputs to dist/
 * run: node scripts/inject-env.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DIST = path.join(ROOT, "dist");

// parse .env (simple key=value)
function loadEnv() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) {
    console.warn("[inject-env] No .env found, using API_BASE_URL from environment or fallback");
    return {};
  }
  const content = fs.readFileSync(envPath, "utf-8");
  const env = {};
  for (const line of content.split("\n")) {
    const m = line.match(/^\s*([^#=]+)=(.*)$/);
    if (m) env[m[1].trim()] = m[2].trim();
  }
  return env;
}

const env = loadEnv();
const API_BASE_URL = env.API_BASE_URL || process.env.API_BASE_URL || "http://localhost:8000";

// ensure dist exists
if (!fs.existsSync(DIST)) fs.mkdirSync(DIST, { recursive: true });

// copy extension files
const files = ["manifest.json", "content.js", "content.css", "popup.js", "popup.html", "popup.css"];
for (const f of files) {
  const src = path.join(ROOT, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(DIST, f));
  }
}

// inject API_BASE_URL into background.js
const bgSrc = fs.readFileSync(path.join(ROOT, "background.js"), "utf-8");
const bgOut = bgSrc.replace(/__API_BASE_URL__/g, API_BASE_URL);
fs.writeFileSync(path.join(DIST, "background.js"), bgOut);

console.log("[inject-env] Built to dist/ with API_BASE_URL =", API_BASE_URL);
