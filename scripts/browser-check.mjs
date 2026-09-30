import { chromium } from "../.tools/browser/node_modules/playwright/index.mjs";
import { mkdir } from "node:fs/promises";
await mkdir(".tools/screenshots", { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
page.on("pageerror", (error) => console.error("BROWSER ERROR:", error.message));
await page.goto(process.env.CASEBOOK_URL || "http://localhost:3000", {
  waitUntil: "networkidle",
  timeout: 60000,
});
await page.screenshot({
  path: ".tools/screenshots/current.png",
  fullPage: true,
});
console.log(
  JSON.stringify({
    title: await page.title(),
    h1: await page.locator("h1").innerText(),
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  }),
);
await browser.close();
