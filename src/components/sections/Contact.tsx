"use client";

import { useState } from "react";
import { Mail, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { contactSchema } from "@/lib/validations";

interface ContactProps {
  email?: string | null;
}

const Contact = ({ email }: ContactProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const contactEmail = email ?? "ronishprajapati0@gmail.com";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? ""), // honeypot
    };

    // Client-side validation mirrors the server schema.
    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your input.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      toast.success("Message sent! I'll get back to you soon.");
      form.reset();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="section-padding bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-accent font-mono text-sm mb-3">Get In Touch</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Let&apos;s work together
          </h2>
          <p className="text-muted-foreground">
            Have a project in mind or just want to say hi? Drop me a message and I&apos;ll
            respond as soon as I can.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-card rounded-2xl border border-border p-6 md:p-8 space-y-6"
          >
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Your name" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Tell me about your project…"
                rows={5}
                required
              />
            </div>

            {/* Honeypot — hidden from humans, must stay empty */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" /> Sending…
                </>
              ) : (
                <>
                  <Send size={18} /> Send Message
                </>
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Or email me directly at{" "}
              <a href={`mailto:${contactEmail}`} className="text-accent hover:underline">
                <Mail size={14} className="inline mb-0.5" /> {contactEmail}
              </a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
