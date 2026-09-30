import { NextResponse } from "next/server";
import { portfolio } from "@/data/portfolio";
import { validEmail, validateInquiry, type Inquiry } from "@/lib/contact";
export async function POST(request: Request) {
  if (
    portfolio.contact.mode !== "resend" ||
    !process.env.RESEND_API_KEY ||
    !process.env.CONTACT_FROM_EMAIL ||
    !process.env.CONTACT_TO_EMAIL
  )
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return NextResponse.json({ error: "origin" }, { status: 403 });
  if (!request.headers.get("content-type")?.includes("application/json"))
    return NextResponse.json({ error: "content-type" }, { status: 415 });
  if (Number(request.headers.get("content-length")) > 20000)
    return NextResponse.json({ error: "size" }, { status: 413 });
  try {
    const text = await request.text();
    if (text.length > 20000)
      return NextResponse.json({ error: "size" }, { status: 413 });
    const body: unknown = JSON.parse(text);
    if (!body || typeof body !== "object" || Array.isArray(body))
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    const record = body as Record<string, unknown>;
    const input = Object.fromEntries(
      ["name", "email", "organization", "message", "website"].map((key) => [
        key,
        typeof record[key] === "string" ? record[key].trim() : "",
      ]),
    ) as Inquiry;
    if (input.website) return NextResponse.json({ ok: true });
    const errors = validateInquiry(input);
    if (Object.keys(errors).length)
      return NextResponse.json({ errors }, { status: 400 });
    if (!validEmail(process.env.CONTACT_TO_EMAIL))
      return NextResponse.json({ error: "configuration" }, { status: 503 });
    const copy = portfolio.ui.form;
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL,
        to: [process.env.CONTACT_TO_EMAIL],
        reply_to: input.email,
        subject: copy.subject,
        text: `${copy.name}: ${input.name}\n${copy.email}: ${input.email}\n${copy.organization}: ${input.organization}\n\n${input.message}`,
      }),
      signal: AbortSignal.timeout(10000),
    });
    return response.ok
      ? NextResponse.json({ ok: true })
      : NextResponse.json({ error: "delivery" }, { status: 502 });
  } catch {
    return NextResponse.json({ error: "request" }, { status: 400 });
  }
}
