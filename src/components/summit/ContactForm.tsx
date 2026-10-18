"use client";

import { useId, useRef, useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { contactSchema } from "@/lib/validations";

type Field = "name" | "email" | "message";
type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

const FIELDS: { name: Field; label: string; type?: string; autoComplete: string; placeholder: string }[] = [
  { name: "name", label: "Name", autoComplete: "name", placeholder: "Your name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email", placeholder: "you@example.com" },
  { name: "message", label: "Message", autoComplete: "off", placeholder: "Tell me about your project or role" },
];

/**
 * Contact form posting to /api/contact (Zod validation, honeypot and rate
 * limiting live on the server). Errors are shown inline under each field.
 */
export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const uid = useId();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
      website: String(data.get("website") ?? ""), // honeypot
    };

    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const next: Partial<Record<Field, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as Field;
        if (key in { name: 1, email: 1, message: 1 } && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      setStatus({ kind: "idle" });
      const firstInvalid = FIELDS.find((f) => next[f.name]);
      if (firstInvalid) form.querySelector<HTMLElement>(`[name="${firstInvalid.name}"]`)?.focus();
      return;
    }

    setErrors({});
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({ kind: "error", message: body.error ?? "Something went wrong. Please try again." });
        return;
      }
      setStatus({ kind: "sent" });
      form.reset();
    } catch {
      setStatus({ kind: "error", message: "Network error. Please check your connection and try again." });
    }
  }

  const clearError = (field: Field) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="grid gap-6" aria-describedby={`${uid}-status`}>
      {FIELDS.map((field) => {
        const id = `${uid}-${field.name}`;
        const error = errors[field.name];
        const common = {
          id,
          name: field.name,
          autoComplete: field.autoComplete,
          placeholder: field.placeholder,
          required: true,
          "aria-invalid": error ? true : undefined,
          "aria-describedby": error ? `${id}-error` : undefined,
          onInput: () => clearError(field.name),
          className: `w-full rounded-[2px] border bg-forest-950/70 px-4 text-[1rem] text-snow placeholder:text-sage/70 transition-[border-color,box-shadow] focus:border-ember focus:shadow-[0_0_0_1px_rgb(var(--s-ember-400))] focus:outline-none focus-visible:outline-none ${
            error ? "border-[#e0826f]" : "border-snow/20 hover:border-snow/35"
          }`,
        };
        return (
          <div key={field.name} className="grid gap-2">
            <label htmlFor={id} className="s-label text-fog">
              {field.label}
            </label>
            {field.name === "message" ? (
              <textarea {...common} rows={5} className={`${common.className} min-h-[9rem] resize-y py-3 leading-relaxed`} />
            ) : (
              <input {...common} type={field.type ?? "text"} className={`${common.className} h-12`} />
            )}
            {error ? (
              <p id={`${id}-error`} className="text-sm text-[#f0a090]">
                {error}
              </p>
            ) : null}
          </div>
        );
      })}

      {/* Honeypot: hidden from people, must stay empty. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input id={`${uid}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-1">
        <button type="submit" disabled={status.kind === "sending"} className="s-btn s-btn-primary disabled:opacity-70">
          {status.kind === "sending" ? (
            <>
              <Loader2 className="animate-spin" aria-hidden />
              Sending
            </>
          ) : (
            <>
              Send message
              <ArrowRight data-nudge="right" aria-hidden />
            </>
          )}
        </button>
        <p id={`${uid}-status`} role="status" className="min-h-[1.5rem] text-[0.95rem]">
          {status.kind === "sent" ? (
            <span className="inline-flex items-center gap-2 text-snow">
              <Check className="h-4 w-4 text-ember" aria-hidden />
              Message sent. I&apos;ll get back to you soon.
            </span>
          ) : status.kind === "error" ? (
            <span className="text-[#f0a090]">{status.message}</span>
          ) : null}
        </p>
      </div>
    </form>
  );
}
