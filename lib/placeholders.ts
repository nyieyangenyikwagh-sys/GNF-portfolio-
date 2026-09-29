export function findPlaceholders(value: unknown, path = "portfolio"): string[] {
  if (typeof value === "string") return /\[(?!REDACTED\])[^\]]+\]|^—$/.test(value) || value === "" ? [path] : [];
  if (value === null) return [path];
  if (Array.isArray(value)) return value.flatMap((entry, index) => findPlaceholders(entry, `${path}[${index}]`));
  if (value && typeof value === "object") return Object.entries(value).filter(([key]) => key !== "legacy" && key !== "sampleQuery").flatMap(([key, entry]) => findPlaceholders(entry, `${path}.${key}`));
  return [];
}

let warned = false;
export function warnPlaceholders(value: unknown) {
  if (process.env.NODE_ENV !== "development" || warned) return;
  warned = true;
  const fields = findPlaceholders(value);
  if (fields.length) console.warn(`[Portfolio configuration] Optional or unresolved fields (${fields.length}):\n${fields.join("\n")}`);
}
