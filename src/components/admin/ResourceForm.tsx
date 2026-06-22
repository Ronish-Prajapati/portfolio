"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Loader2, Save } from "lucide-react";
import type { FieldConfig } from "@/lib/resources";
import type { ActionResult } from "@/actions/resource";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/admin/ImageUpload";
import RichTextEditor from "@/components/admin/RichTextEditor";

interface ResourceFormProps {
  fields: FieldConfig[];
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  initial?: Record<string, unknown> | null;
  backHref: string;
  submitLabel?: string;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : <Save size={16} />}
      {pending ? "Saving…" : label}
    </Button>
  );
}

function toStringValue(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (Array.isArray(v)) return v.join("\n");
  return String(v);
}

export default function ResourceForm({
  fields,
  action,
  initial,
  backHref,
  submitLabel = "Save",
}: ResourceFormProps) {
  const [state, formAction] = useActionState<ActionResult, FormData>(action, {});

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {fields.map((field) => {
        const value = initial?.[field.name];

        if (field.type === "image") {
          return (
            <ImageUpload
              key={field.name}
              name={field.name}
              label={field.label}
              defaultValue={toStringValue(value)}
              help={field.help}
            />
          );
        }

        if (field.type === "editor") {
          return (
            <RichTextEditor
              key={field.name}
              name={field.name}
              label={field.label}
              defaultValue={toStringValue(value)}
              help={field.help}
            />
          );
        }

        if (field.type === "boolean") {
          return (
            <div key={field.name} className="flex items-center gap-3">
              <input
                id={field.name}
                name={field.name}
                type="checkbox"
                defaultChecked={Boolean(value)}
                className="h-4 w-4 rounded border-border accent-[hsl(var(--accent))]"
              />
              <Label htmlFor={field.name} className="cursor-pointer">
                {field.label}
              </Label>
            </div>
          );
        }

        return (
          <div key={field.name} className="grid gap-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-destructive"> *</span>}
            </Label>

            {field.type === "textarea" || field.type === "list" ? (
              <Textarea
                id={field.name}
                name={field.name}
                rows={field.type === "list" ? 4 : 3}
                placeholder={field.placeholder}
                defaultValue={toStringValue(value)}
              />
            ) : field.type === "richtext" ? (
              <Textarea
                id={field.name}
                name={field.name}
                rows={10}
                placeholder={field.placeholder}
                defaultValue={toStringValue(value)}
                className="font-mono text-sm"
              />
            ) : (
              <Input
                id={field.name}
                name={field.name}
                type={field.type === "number" ? "number" : field.type === "url" ? "url" : "text"}
                placeholder={field.placeholder}
                defaultValue={toStringValue(value)}
              />
            )}

            {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
          </div>
        );
      })}

      {state?.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      {state?.success && (
        <p className="text-sm text-green-600" role="status">
          Saved successfully.
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton label={submitLabel} />
        <Button type="button" variant="ghost" asChild>
          <Link href={backHref}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
