import { spawn } from "node:child_process";
import { mkdir, appendFile } from "node:fs/promises";
const section = process.argv[2];
async function command(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.env.ComSpec || "cmd.exe",
      ["/d", "/s", "/c", args],
      { stdio: ["ignore", "pipe", "pipe"] },
    );
    let output = "";
    child.stdout.on("data", (chunk) => (output += chunk));
    child.stderr.on("data", (chunk) => (output += chunk));
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0 ? resolve(output) : reject(new Error(output)),
    );
  });
}
const checks = await Promise.all([
  command("npm run lint"),
  command("npx tsc --noEmit"),
]);
const response = await fetch(
  process.env.CASEBOOK_URL || "http://localhost:3000",
  { signal: AbortSignal.timeout(60000) },
);
const html = await response.text();
if (
  !response.ok ||
  !html.includes(section) ||
  html.includes("NEXT_HTTP_ERROR_FALLBACK;500")
)
  throw new Error(`Render failed: ${response.status} / ${section}`);
await mkdir(".tools", { recursive: true });
await appendFile(
  ".tools/section-checks.log",
  `${new Date().toISOString()} ${section}: lint PASS, tsc PASS, HTTP ${response.status}, content present\n${checks.join("\n")}`,
);
console.log(`${section}: lint PASS, tsc PASS, dev render ${response.status}`);
