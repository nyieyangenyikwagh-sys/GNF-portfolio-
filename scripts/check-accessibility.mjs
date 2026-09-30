import { chromium } from "../.tools/browser/node_modules/playwright/index.mjs";
import AxeBuilder from "../.tools/browser/node_modules/@axe-core/playwright/dist/index.mjs";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(process.env.CASEBOOK_URL || "http://localhost:3000", {
    waitUntil: "networkidle",
  });
  for (const section of await page.locator("main > section").all())
    await section.scrollIntoViewIfNeeded();
  const full = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  await page
    .getByRole("button", { name: "VIEW SAMPLE", exact: true })
    .first()
    .click();
  await page.getByRole("dialog").waitFor();
  const modal = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  const report = { page: full.violations, modal: modal.violations };
  await writeFile(".tools/accessibility.json", JSON.stringify(report, null, 2));
  console.log(
    JSON.stringify(
      Object.fromEntries(
        Object.entries(report).map(([key, violations]) => [
          key,
          violations.map((item) => ({
            id: item.id,
            impact: item.impact,
            nodes: item.nodes.map((node) => ({
              target: node.target,
              summary: node.failureSummary,
            })),
          })),
        ]),
      ),
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
