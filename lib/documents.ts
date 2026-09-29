import "server-only";
import { existsSync, realpathSync, statSync } from "node:fs";
import path from "node:path";

export function existingDocument(file: string): string {
  if (!/^\/documents\/[a-zA-Z0-9_./-]+\.pdf$/.test(file)) return "";
  const root = path.resolve(process.cwd(), "public", "documents");
  const target = path.resolve(process.cwd(), "public", file.slice(1));
  if (!target.startsWith(root + path.sep) || !existsSync(target)) return "";
  const real = realpathSync(target);
  return real.startsWith(realpathSync(root) + path.sep) && statSync(real).isFile() ? file : "";
}
