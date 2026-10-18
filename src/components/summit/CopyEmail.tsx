"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** Copies the address to the clipboard, with a visible and announced confirmation. */
export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-8 items-center gap-1.5 rounded-[2px] border border-snow/20 px-2.5 font-label text-[0.7rem] uppercase tracking-[0.12em] text-fog transition-colors hover:border-snow/40 hover:text-snow"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-ember" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      <span className="sr-only"> email address</span>
    </button>
  );
}
