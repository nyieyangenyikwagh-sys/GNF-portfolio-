import type { Portfolio } from "@/data/types";
export function configured(value: string) {
  return !!value.trim() && !/\[[^\]]+\]|^—$/.test(value);
}
export function webUrl(value: string) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url : undefined;
  } catch {
    return undefined;
  }
}
export function personSchema(
  profile: Portfolio["profile"],
  social: Portfolio["social"],
) {
  if (!configured(profile.name)) return null;
  const sameAs = [profile.linkedin, ...social.map((item) => item.url)].filter(
    (item) => configured(item) && webUrl(item),
  );
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    ...(configured(profile.email) ? { email: profile.email } : {}),
    ...(configured(profile.location)
      ? { homeLocation: { "@type": "Place", name: profile.location } }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}
