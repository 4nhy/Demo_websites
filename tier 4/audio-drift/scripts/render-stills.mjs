// Renders the static fallback stills (public/renders/*.png) from the live
// procedural model via the dev-only /studio route.
//
//   npm run dev            (in another terminal)
//   node scripts/render-stills.mjs [baseUrl]
//
// Needs Playwright's Chromium (`npx playwright install chromium`).
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.argv[2] ?? "http://localhost:3000";
const SHOTS = ["slate", "glacier", "rosewood", "graphite", "hinge", "exploded", "anc", "closeup", "driver"];
const OUT = new URL("../public/renders/", import.meta.url);

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({
  args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist", "--enable-unsafe-swiftshader"],
});
const page = await browser.newPage({ viewport: { width: 1200, height: 1200 }, deviceScaleFactor: 1 });
page.on("pageerror", (e) => console.error("pageerror:", e.message));

for (const shot of SHOTS) {
  await page.goto(`${BASE}/studio?shot=${shot}`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => {
    const c = document.querySelector("#studio canvas");
    return c && c.width > 0;
  });
  await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
  // HDRI decode + a few settled frames (ANC rings mid-expansion)
  await page.waitForTimeout(shot === "anc" ? 2600 : 1800);
  await page.locator("#studio").screenshot({ path: new URL(`${shot}.png`, OUT).pathname.slice(1), omitBackground: true });
  console.log("rendered", shot);
}

await browser.close();
