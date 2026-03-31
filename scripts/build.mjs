import { build } from "esbuild";
import { execSync } from "child_process";
import {
  cpSync,
  rmSync,
  mkdirSync,
  existsSync,
  readFileSync,
  writeFileSync,
  readdirSync,
} from "fs";
import { join } from "path";

const DIST = "dist";

// 1. Clean dist
if (existsSync(DIST)) {
  rmSync(DIST, { recursive: true });
}
mkdirSync(DIST, { recursive: true });

// 2. Build background service worker (ES module, single bundle)
await build({
  entryPoints: ["src/background/index.ts"],
  bundle: true,
  outfile: "dist/background.js",
  format: "esm",
  target: "chrome120",
  tsconfig: "tsconfig.json",
});
console.log("✓ background.js");

// 3. Build content script (IIFE, no imports, single bundle)
await build({
  entryPoints: ["src/content/index.ts"],
  bundle: true,
  outfile: "dist/content.js",
  format: "iife",
  target: "chrome120",
  tsconfig: "tsconfig.json",
});
console.log("✓ content.js");

// 4. Build popup + options HTML pages with Vite
execSync("npx vite build", { stdio: "inherit" });
console.log("✓ popup + options pages");

// 5. Strip crossorigin and modulepreload from HTML (Chrome extension compat)
function fixHtmlFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      fixHtmlFiles(path);
    } else if (entry.name.endsWith(".html")) {
      let html = readFileSync(path, "utf-8");
      html = html.replace(/ crossorigin/g, "");
      html = html.replace(
        /\s*<link rel="modulepreload"[^>]*>\s*/g,
        "\n",
      );
      writeFileSync(path, html);
      console.log(`  ✓ fixed ${path}`);
    }
  }
}
fixHtmlFiles(DIST);

// 6. Copy manifest.json
cpSync("manifest.json", "dist/manifest.json");
console.log("✓ manifest.json");

// 7. Copy icons
mkdirSync("dist/icons", { recursive: true });
for (const size of [16, 48, 128]) {
  cpSync(`public/icons/icon${size}.png`, `dist/icons/icon${size}.png`);
}
console.log("✓ icons");

console.log("\nBuild complete! Load dist/ folder in chrome://extensions");
