import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
const html = await readFile(".next/server/app/index.html", "utf8");
const initialPaths = [
  ...new Set(
    [...html.matchAll(/src="(\/_next\/static\/[^"?]+\.js)/g)].map((match) =>
      match[1].replace("/_next/", ".next/"),
    ),
  ),
];
const initial = await Promise.all(
  initialPaths.map(async (file) => {
    const content = await readFile(file);
    return { file, bytes: content.length, gzipBytes: gzipSync(content).length };
  }),
);
const chunks = await readdir(".next/static/chunks");
const lazy = [];
for (const name of chunks.filter((name) => name.endsWith(".js"))) {
  const file = `.next/static/chunks/${name}`;
  const content = await readFile(file);
  if (content.includes("sample-paper") && !initialPaths.includes(file))
    lazy.push({
      file,
      bytes: (await stat(file)).size,
      gzipBytes: gzipSync(content).length,
    });
}
const report = {
  initial,
  initialJsBytes: initial.reduce((sum, item) => sum + item.bytes, 0),
  initialGzipBytes: initial.reduce((sum, item) => sum + item.gzipBytes, 0),
  lazyViewer: lazy,
  addedRuntimeDependencies: 0,
};
await writeFile(".tools/bundle-report.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
