import { chromium } from "../.tools/browser/node_modules/playwright/index.mjs";
import { readFile, writeFile, unlink } from "node:fs/promises";
import assert from "node:assert/strict";
const sourcePath = "data/portfolio.ts",
  filePath = "public/documents/qa-synthetic.pdf";
const original = await readFile(sourcePath, "utf8");
const objects = [
  "<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Kids [3 0 R 5 0 R] /Count 2 >>",
  "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 7 0 R >> >> /Contents 4 0 R >>",
  "",
  "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 7 0 R >> >> /Contents 6 0 R >>",
  "",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
];
for (const [index, page] of [
  [3, 1],
  [5, 2],
]) {
  const stream = `BT /F1 24 Tf 70 700 Td (SAMPLE - SYNTHETIC QA - PAGE ${page}) Tj 0 -50 Td /F1 12 Tf (No claimant or carrier information.) Tj ET`;
  objects[index] =
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
}
let pdf = "%PDF-1.4\n";
const offsets = [0];
for (const [index, object] of objects.entries()) {
  offsets.push(Buffer.byteLength(pdf));
  pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
}
const xref = Buffer.byteLength(pdf);
pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets
  .slice(1)
  .map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`)
  .join(
    "",
  )}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
let browser;
try {
  await writeFile(filePath, pdf);
  assert.ok(original.includes('file: "", placeholderPages:'));
  await writeFile(
    sourcePath,
    original.replace(
      'file: "", placeholderPages:',
      'file: id === "DOC-001" ? "/documents/qa-synthetic.pdf" : "", placeholderPages:',
    ),
  );
  browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const base = process.env.CASEBOOK_URL || "http://localhost:3000";
  await page.goto(base, { waitUntil: "networkidle" });
  const response = await page.request.get(`${base}/documents/qa-synthetic.pdf`);
  assert.equal(response.status(), 200);
  assert.match(response.headers()["content-type"], /pdf/);
  await page
    .getByRole("button", { name: "VIEW SAMPLE", exact: true })
    .first()
    .click();
  const frame = page.locator(".pdf-frame");
  await frame.waitFor();
  assert.match(
    await frame.getAttribute("src"),
    /qa-synthetic\.pdf#page=1&zoom=100/,
  );
  await page.getByRole("button", { name: "Next page", exact: true }).click();
  assert.match(await frame.getAttribute("src"), /page=2/);
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  assert.match(await frame.getAttribute("src"), /zoom=125/);
  assert.equal(
    await page
      .getByRole("link", { name: "DOWNLOAD", exact: true })
      .getAttribute("href"),
    "/documents/qa-synthetic.pdf",
  );
  await page.waitForTimeout(2000);
  await page.screenshot({ path: ".tools/screenshots/pdf-viewer.png" });
  await page.keyboard.press("Escape");
  await page.getByRole("dialog").waitFor({ state: "detached" });
  console.log(
    "Real two-page synthetic PDF served as application/pdf, embedded from config, page/zoom URLs and download pass. Native PDF rendering remains browser-dependent.",
  );
} finally {
  await browser?.close();
  await writeFile(sourcePath, original);
  await unlink(filePath).catch(() => {});
}
