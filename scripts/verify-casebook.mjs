import { chromium } from "../.tools/browser/node_modules/playwright/index.mjs";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
const base = process.env.CASEBOOK_URL || "http://localhost:3000";
await mkdir(".tools/screenshots", { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const results = [],
  errors = [];
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
    acceptDownloads: true,
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error")
      errors.push(`${message.text()} ${message.location().url}`);
  });
  await page.goto(base, { waitUntil: "networkidle" });
  assert.equal(await page.locator("h1").count(), 1);
  assert.equal(await page.title(), "[YOUR NAME] | Claims Professional");
  for (const width of [1440, 1280, 1024, 768, 390, 375]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const colorScheme of ["light", "dark"]) {
      await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
      for (const section of await page.locator("main > section").all()) {
        await section.scrollIntoViewIfNeeded();
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          false,
          `${width}/${colorScheme}: page overflow`,
        );
      }
      results.push(
        `${width}px / ${colorScheme} preference: every section, no horizontal page overflow`,
      );
    }
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `.tools/screenshots/hero-${width}.png` });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  for (const anchor of await page.locator(".desktop-nav a").all()) {
    const href = await anchor.getAttribute("href");
    assert.equal(await page.locator(href).count(), 1);
    await anchor.click();
    await page.waitForTimeout(120);
    assert.equal(await anchor.getAttribute("aria-current"), "location", href);
  }
  for (const id of ["top", "services", "process", "format", "about", "contact"])
    assert.equal(await page.locator(`#${id}`).count(), 1);
  results.push(
    "Eight navigation anchors, active highlighting, and six legacy fragments pass",
  );
  for (const button of await page
    .locator("#credentials .filters button")
    .all()) {
    await button.click();
    assert.equal(await button.getAttribute("aria-pressed"), "true");
    assert.equal(await page.locator("#credentials .empty-state").count(), 1);
  }
  results.push("Credential filters and honest placeholder state pass");
  for (const button of await page.locator("#casebook .filters button").all()) {
    await button.click();
    assert.equal(
      await page.locator(".case-card").count(),
      (await button.innerText()) === "All" ? 4 : 1,
    );
  }
  await page.locator("#casebook .filters button").first().click();
  const toggle = page.locator(".case-toggle").first();
  await toggle.focus();
  await page.keyboard.press("Enter");
  assert.equal(await toggle.getAttribute("aria-expanded"), "true");
  assert.equal(await page.locator(".case-steps h4").count(), 6);
  await page.keyboard.press("Space");
  assert.equal(await toggle.getAttribute("aria-expanded"), "false");
  await toggle.click();
  assert.equal(await toggle.getAttribute("aria-expanded"), "true");
  await toggle.click();
  results.push("Case filters and mouse/Enter/Space expansion pass");
  for (const button of await page
    .locator("#work-samples .filters button")
    .all()) {
    await button.click();
    assert.equal(
      await page.locator(".document-card").count(),
      (await button.innerText()) === "All" ? 8 : 1,
    );
  }
  await page.locator("#work-samples .filters button").first().click();
  const trigger = page
    .getByRole("button", { name: "VIEW SAMPLE", exact: true })
    .first();
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor();
  assert.equal(
    await page
      .getByRole("button", { name: "Close viewer", exact: true })
      .evaluate((el) => el === document.activeElement),
    true,
  );
  for (let i = 0; i < 18; i++) {
    await page.keyboard.press("Tab");
    assert.equal(
      await page.evaluate(() => !!document.activeElement.closest("dialog")),
      true,
    );
  }
  for (let i = 0; i < 18; i++) {
    await page.keyboard.press("Shift+Tab");
    assert.equal(
      await page.evaluate(() => !!document.activeElement.closest("dialog")),
      true,
    );
  }
  await page.getByRole("button", { name: "Next page", exact: true }).click();
  assert.match(
    await page.locator(".sample-paper h3").innerText(),
    /Review notes/,
  );
  await page
    .getByRole("button", { name: "Previous page", exact: true })
    .click();
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  assert.equal(
    await page.locator(".toolbar-group output").first().innerText(),
    "125%",
  );
  await page.getByRole("button", { name: "Zoom out", exact: true }).click();
  assert.equal(
    await page.locator(".toolbar-group output").first().innerText(),
    "100%",
  );
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  await page.getByRole("button", { name: "Reset zoom", exact: true }).click();
  const downloadPromise = page.waitForEvent("download");
  await dialog.getByRole("button", { name: "DOWNLOAD", exact: true }).click();
  const download = await downloadPromise;
  assert.match(download.suggestedFilename(), /SAMPLE\.txt$/);
  await page.screenshot({ path: ".tools/screenshots/document-viewer.png" });
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "detached" });
  assert.equal(
    await trigger.evaluate((el) => el === document.activeElement),
    true,
  );
  await trigger.click();
  await dialog.waitFor();
  await page.mouse.click(2, 2);
  await dialog.waitFor({ state: "detached" });
  await trigger.click();
  await dialog.waitFor();
  await page.getByRole("button", { name: "Close viewer", exact: true }).click();
  await dialog.waitFor({ state: "detached" });
  results.push(
    "Viewer focus trap/restoration, Escape/backdrop/button close, zoom/reset, pages and sample download pass",
  );
  const stages = page.locator(".workflow-stage");
  await stages.first().focus();
  await page.keyboard.press("End");
  assert.equal(await stages.last().getAttribute("aria-pressed"), "true");
  await page.keyboard.press("Home");
  await page.keyboard.press("ArrowRight");
  assert.match(
    await page.locator("#workflow-detail h3").innerText(),
    /Initial Review/,
  );
  for (const stage of await stages.all()) {
    await stage.click();
    assert.equal(await stage.getAttribute("aria-pressed"), "true");
  }
  const checkbox = page.locator(".quality-row input").first();
  await checkbox.check();
  assert.equal(await checkbox.isChecked(), true);
  await page.getByRole("button", { name: "Reset checklist" }).click();
  assert.equal(await checkbox.isChecked(), false);
  assert.equal(await page.locator(".pipeline-diagram li").count(), 9);
  assert.match(
    await page.locator(".dashboard-heading").innerText(),
    /Not a Live Claims System/,
  );
  for (const label of ["REAL_EXPERIENCE", "DEMONSTRATION", "SAMPLE_REDACTED"])
    assert.ok(
      (await page.locator(`[data-content-label="${label}"]`).count()) > 0,
    );
  assert.equal(await page.locator("#documents").count(), 0);
  assert.equal(await page.locator("#field-readiness").count(), 0);
  results.push(
    "Workflow keyboard controls, all nine stages, checklist, labels and conditional hidden sections pass",
  );
  await page.locator(".inquiry-form").evaluate((form) => form.requestSubmit());
  assert.equal(
    await page.locator("#inquiry-name").getAttribute("aria-invalid"),
    "true",
  );
  await page.locator("#inquiry-name").fill("QA Visitor");
  await page.locator("#inquiry-email").fill("invalid");
  await page
    .locator("#inquiry-message")
    .fill("Synthetic local validation check.");
  await page.locator(".inquiry-form").evaluate((form) => form.requestSubmit());
  assert.equal(
    await page.locator("#inquiry-email").getAttribute("aria-invalid"),
    "true",
  );
  assert.equal(
    await page.getByRole("button", { name: "Send Inquiry" }).isDisabled(),
    true,
  );
  assert.equal(
    (await context.request.post(`${base}/api/contact`, { data: {} })).status(),
    503,
  );
  results.push(
    "Contact required/email validation, unconfigured destination and disabled server delivery pass; no messages sent",
  );
  for (const id of ["casebook", "technology", "contact"]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await page.screenshot({ path: `.tools/screenshots/${id}-1440.png` });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => scrollTo(0, 0));
  const menu = page.getByRole("button", { name: "Open menu", exact: true });
  await menu.click();
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press("Tab");
    assert.equal(
      await page.evaluate(
        () => !!document.activeElement.closest(".mobile-menu"),
      ),
      true,
    );
  }
  await page.keyboard.press("Escape");
  assert.equal(
    await menu.evaluate((el) => el === document.activeElement),
    true,
  );
  await menu.click();
  await page
    .locator(".mobile-menu nav a")
    .filter({ hasText: "Technology" })
    .click();
  assert.equal(await page.locator(".mobile-menu").count(), 0);
  assert.equal(
    await page
      .locator(".hero-flow")
      .evaluate((el) => getComputedStyle(el, "::before").animationName),
    "none",
  );
  results.push(
    "Mobile overlay focus, Escape, anchor close and reduced-motion animation suppression pass",
  );
  assert.deepEqual(errors, []);
  await writeFile(
    ".tools/qa-results.json",
    JSON.stringify({ results, browserErrors: errors }, null, 2),
  );
  console.log(results.join("\n"));
} finally {
  await browser.close();
}
