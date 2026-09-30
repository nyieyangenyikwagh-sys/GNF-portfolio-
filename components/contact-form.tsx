"use client";
import { useRef, useState } from "react";
import type { Portfolio } from "@/data/types";
import {
  type Inquiry,
  type InquiryErrors,
  validateInquiry,
} from "@/lib/contact";
export function ContactForm({
  config,
  recipient,
  available,
  copy,
}: {
  config: Portfolio["contact"];
  recipient: string;
  available: boolean;
  copy: Portfolio["ui"]["form"];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<InquiryErrors>({}),
    [status, setStatus] = useState(""),
    [sending, setSending] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    const form = event.currentTarget,
      data = new FormData(form);
    const input: Inquiry = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      organization: String(data.get("organization") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
      website: String(data.get("website") ?? ""),
    };
    if (input.website) return;
    const validation = validateInquiry(input);
    setErrors(validation);
    if (Object.keys(validation).length) {
      (
        form.elements.namedItem(Object.keys(validation)[0]) as HTMLElement
      )?.focus();
      return;
    }
    if (!available) {
      setStatus(copy.unavailable);
      return;
    }
    setSending(true);
    try {
      if (config.mode === "mailto") {
        const body = `${copy.name}: ${input.name}\n${copy.email}: ${input.email}\n${copy.organization}: ${input.organization}\n\n${input.message}`;
        window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(copy.subject)}&body=${encodeURIComponent(body)}`;
        setStatus(copy.mailtoSuccess);
      } else {
        const response = await fetch(
          config.mode === "formspree"
            ? `https://formspree.io/f/${config.formspreeId}`
            : "/api/contact",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(input),
            signal: AbortSignal.timeout(15000),
          },
        );
        if (!response.ok) throw new Error("submission-failed");
        setStatus(copy.success);
        form.reset();
      }
    } catch {
      setStatus(copy.error);
    } finally {
      setSending(false);
    }
  }
  return (
    <form
      ref={formRef}
      className="inquiry-form"
      onSubmit={submit}
      noValidate
      aria-describedby="inquiry-hint"
    >
      <p id="inquiry-hint" className="fine-print">
        {copy.hint}
      </p>
      {(["name", "email", "organization", "message"] as const).map((key) => (
        <div className="form-field" key={key}>
          <label htmlFor={`inquiry-${key}`}>
            {copy[key]}
            {key !== "organization" && <span aria-hidden="true"> *</span>}
          </label>
          {key === "message" ? (
            <textarea
              id={`inquiry-${key}`}
              name={key}
              rows={5}
              maxLength={5000}
              required
              aria-invalid={!!errors[key]}
              aria-describedby={errors[key] ? `error-${key}` : undefined}
            />
          ) : (
            <input
              id={`inquiry-${key}`}
              name={key}
              type={key === "email" ? "email" : "text"}
              autoComplete={
                key === "name"
                  ? "name"
                  : key === "email"
                    ? "email"
                    : "organization"
              }
              maxLength={key === "name" ? 100 : key === "email" ? 254 : 150}
              required={key !== "organization"}
              aria-invalid={!!errors[key]}
              aria-describedby={errors[key] ? `error-${key}` : undefined}
            />
          )}
          {errors[key] && (
            <p id={`error-${key}`} className="form-error">
              {copy[errors[key]]}
            </p>
          )}
        </div>
      ))}
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="inquiry-website">{copy.honeypot}</label>
        <input
          id="inquiry-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      {!available && <p className="form-notice">{copy.unavailable}</p>}
      <button
        className="button button-primary"
        disabled={sending || !available}
        type="submit"
      >
        {sending ? copy.sending : copy.submit}
      </button>
      <p className="form-status" role="status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}
