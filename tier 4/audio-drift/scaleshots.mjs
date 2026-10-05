import { chromium } from "playwright";
const OUT = "C:/Users/User/AppData/Local/Temp/claude/C--Users-User-audio-drift/d20f0562-e80d-4c21-8b29-33a023df2a69/scratchpad/shots";
const URL = "http://localhost:3001";
const browser = await chromium.launch();

async function check(route, size, name) {
  const context = await browser.newContext({ viewport: { width: size.w, height: size.h } });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
  page.on("pageerror", (e) => errors.push(`PAGEERROR: ${e.message}`));
  const resp = await page.goto(`${URL}${route}`, { waitUntil: "networkidle", timeout: 20000 });
  await page.waitForTimeout(900);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  const fontCheck = await page.evaluate(() => {
    const h = document.querySelector("h1, h2");
    return h ? getComputedStyle(h).fontFamily : "no heading found";
  });
  console.log(`[${size.w}] ${route} -> HTTP ${resp?.status()} overflow:${overflow}px font:"${fontCheck.slice(0,40)}" errors:${errors.length ? JSON.stringify(errors) : "none"}`);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  await context.close();
}

await check("/", { w: 1440, h: 900 }, "scale-home-1440");
await check("/product", { w: 1440, h: 900 }, "scale-product-1440");
await check("/buy", { w: 1440, h: 900 }, "scale-buy-1440");
await check("/engineering", { w: 1440, h: 900 }, "scale-engineering-1440");
await check("/", { w: 390, h: 844 }, "scale-home-390");
await check("/product", { w: 390, h: 844 }, "scale-product-390");
await check("/buy", { w: 390, h: 844 }, "scale-buy-390");
await check("/engineering", { w: 390, h: 844 }, "scale-engineering-390");

// mid-transition shots + full sections at 1440
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${URL}/`, { waitUntil: "networkidle" });
  const geo = await page.evaluate(() => {
    const s = document.getElementById("sound").getBoundingClientRect();
    const si = document.getElementById("silence").getBoundingClientRect();
    const ss = document.getElementById("soundstage").getBoundingClientRect();
    return {
      soundTop: s.top + window.scrollY,
      silenceTop: si.top + window.scrollY,
      soundstageTop: ss.top + window.scrollY,
    };
  });
  const steps = [
    { name: "sound-full-section", y: geo.soundTop + 10 },
    { name: "sound-hold-pause", y: geo.soundTop + 350 },
    { name: "sound-exiting", y: geo.soundTop + 850 },
    { name: "silence-full-section", y: geo.silenceTop + 10 },
    { name: "silence-hold-pause", y: geo.silenceTop + 350 },
    { name: "silence-exiting", y: geo.silenceTop + 850 },
    { name: "soundstage-full-section", y: geo.soundstageTop + 10 },
  ];
  for (const step of steps) {
    await page.evaluate((y) => window.scrollTo(0, y), step.y);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/scale-${step.name}.png` });
  }
  await page.close();
}

await browser.close();
console.log("done");
